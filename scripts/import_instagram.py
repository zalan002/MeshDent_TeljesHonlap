#!/usr/bin/env python3
"""Validate and import a supplied Instagram archive as data, without executing it."""
import argparse
import csv
import hashlib
import io
import json
import stat
import zipfile
from collections import Counter
from datetime import datetime
from pathlib import Path, PurePosixPath
from urllib.parse import urlparse
from zoneinfo import ZoneInfo

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
R = ROOT / 'research/2026-10-21'
M = R / 'manifests'
DEST = ROOT / 'assets/source/instagram/import-2026-10-21'


def write_json(path, data):
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('zip_path', type=Path)
    parser.add_argument('html_path', type=Path)
    args = parser.parse_args()
    with zipfile.ZipFile(args.zip_path) as archive:
        infos = archive.infolist()
        if len(infos) > 5000 or sum(i.file_size for i in infos) > 512 * 1024 * 1024:
            raise ValueError('Unexpected archive size')
        names = [i.filename for i in infos]
        if len(names) != len(set(names)):
            raise ValueError('Duplicate ZIP member paths')
        for i in infos:
            path = PurePosixPath(i.filename)
            if path.is_absolute() or '..' in path.parts or '\\' in i.filename or ':' in i.filename or stat.S_ISLNK(i.external_attr >> 16):
                raise ValueError('Unsafe ZIP member path')
            if path.suffix.lower() not in {'.json', '.jpg', '.txt', '.html'}:
                raise ValueError('Unexpected file type')
        if archive.testzip() is not None:
            raise ValueError('Invalid ZIP CRC')
        supplied = json.loads(archive.read('forrasjegyzek.json'))
        posts = supplied['posts']
        if len({p['post_id'] for p in posts}) != len(posts):
            raise ValueError('Duplicate post IDs')
        listed_files = [f['file'] for p in posts for f in p['files']]
        if set(listed_files) != {n for n in names if n.endswith('.jpg')}:
            raise ValueError('Manifest and archive image lists differ')
        if len(listed_files) != len(set(listed_files)):
            raise ValueError('A file path is listed more than once')
        for p in posts:
            if urlparse(p['post_url']).hostname not in {'www.instagram.com', 'instagram.com'}:
                raise ValueError('Unexpected post origin')
            for f in p['files']:
                data = archive.read(f['file'])
                if len(data) != f['bytes'] or hashlib.sha256(data).hexdigest() != f['sha256']:
                    raise ValueError('File size or hash mismatch: ' + f['file'])
                with Image.open(io.BytesIO(data)) as im:
                    if im.size != (f['width'], f['height']):
                        raise ValueError('Image dimensions differ: ' + f['file'])
                    im.verify()
        identical_html = archive.read('forrasjegyzek.html') == args.html_path.read_bytes()
        if not identical_html:
            raise ValueError('Separate HTML source list differs from archived version')
        # Validate the whole input before writing. Do not overwrite different data.
        for i in infos:
            target = DEST / i.filename
            if target.exists() and target.read_bytes() != archive.read(i):
                raise ValueError('Existing file differs: ' + str(target))
        for i in infos:
            target = DEST / i.filename
            target.parent.mkdir(parents=True, exist_ok=True)
            if not target.exists():
                target.write_bytes(archive.read(i))
        normalized_posts = []
        media = []
        seen = {}
        for post in posts:
            normalized = dict(post)
            timestamp = datetime.fromisoformat(post['published_at_utc'].replace('Z', '+00:00'))
            local = timestamp.astimezone(ZoneInfo('Europe/Budapest')).isoformat()
            normalized['published_at_budapest'] = local
            normalized['caption_local_path'] = str((DEST / post['files'][0]['file']).parent.relative_to(ROOT) / 'kepalairas.txt')
            normalized['files'] = []
            for f in post['files']:
                rel = str((DEST / f['file']).relative_to(ROOT))
                record = {
                    'source': 'Instagram', 'source_url': post['post_url'],
                    'source_media_url': f['source_media_url'],
                    'post_id': post['post_id'], 'post_type': post['type'],
                    'published_at_utc': post['published_at_utc'], 'published_at_budapest': local,
                    'caption': post['caption'], 'caption_local_path': normalized['caption_local_path'],
                    'source_media_kind': f['kind'], 'order': f['order'],
                    'title': f"{local[:10]} · {post['post_id']} · {f['order']}. kép",
                    'local_path': rel, 'width': f['width'], 'height': f['height'],
                    'bytes': f['bytes'], 'sha256': f['sha256'], 'status': 'saved',
                    'method': 'user-supplied browser archive; Instagram-served image; no local re-encoding',
                    'byte_identical_to_supplied_file': True, 'pre_upload_original': False,
                    'related_video_missing': bool(post['failures']) if f['kind']=='Reels-borítókép' else False,
                }
                if f['sha256'] in seen:
                    record['duplicate_of_local_path'] = seen[f['sha256']]
                else:
                    seen[f['sha256']] = rel
                normalized['files'].append(record)
                media.append(record)
            normalized_posts.append(normalized)
        summary = {
            'imported_on': '2026-10-21', 'input_archive': args.zip_path.name,
            'archive_sha256': hashlib.sha256(args.zip_path.read_bytes()).hexdigest(),
            'html_sha256': hashlib.sha256(args.html_path.read_bytes()).hexdigest(),
            'separate_html_matches_zip': identical_html,
            'archive_files': len(infos), 'posts_catalogued': len(posts),
            'photo_posts': sum(p['type'] in {'Fotó', 'Galéria'} for p in posts),
            'carousel_posts': sum(p['type']=='Galéria' for p in posts),
            'photos': sum(f['source_media_kind']=='photo' for f in media),
            'reel_cover_images': sum(f['source_media_kind']=='Reels-borítókép' for f in media),
            'videos_downloaded': 0, 'videos_missing': sum(len(p['failures']) for p in posts),
            'image_files':len(media), 'unique_image_sha256':len(seen),
            'duplicate_image_occurrences':len(media)-len(seen),
            'media_bytes':sum(f['bytes'] for f in media),
            'earliest_post_utc':min(p['published_at_utc'] for p in posts),
            'latest_post_utc':max(p['published_at_utc'] for p in posts),
            'validation':'PASS: ZIP integrity, all image hashes/sizes/dimensions, manifest coverage, separate HTML equality',
            'provenance':'User-supplied export; live Instagram completeness was not independently rechecked in this chat',
            'scope_exclusions':['Stories','Tagged/reposted content from others','Other users comments'],
        }
        write_json(M/'instagram-posts.json', normalized_posts)
        write_json(M/'instagram-media.json', media)
        write_json(M/'instagram-import-summary.json', summary)
        profile = json.loads((M/'instagram.json').read_text())
        profile['initial_direct_post_access_status'] = profile.get('initial_direct_post_access_status', profile['post_archive_status'])
        profile['post_archive_status'] = 'user archive imported: 168 posts, 182 photos and 1 reel cover; 1 full reel video missing'
        profile['user_archive_import'] = summary
        write_json(M/'instagram.json', profile)
        status = json.loads((M/'source-status.json').read_text())
        status['instagram']['initial_direct_access'] = {'http_status':401, 'require_login':True}
        status['instagram'].update(posts='user archive imported', posts_catalogued=len(posts), image_files=len(media), videos_missing=1)
        write_json(M/'source-status.json',status)
        with (M/'instagram-posts.csv').open('w',newline='') as out:
            writer=csv.writer(out)
            writer.writerow(['post_id','post_url','published_at_utc','published_at_budapest','type','status','file_count','caption','caption_local_path'])
            for p in normalized_posts:
                writer.writerow([p['post_id'],p['post_url'],p['published_at_utc'],p['published_at_budapest'],p['type'],p['status'],len(p['files']),p['caption'],p['caption_local_path']])
        # Source HTML is self-contained and contains only local filtering JS.
        (R/'instagram-forrasjegyzek.html').write_bytes(args.html_path.read_bytes())
        print(json.dumps(summary,ensure_ascii=False,indent=2))


if __name__=='__main__':main()
