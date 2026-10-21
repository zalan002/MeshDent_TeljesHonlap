#!/usr/bin/env python3
"""Collect user-requested public Meshdent sources; never submit forms.

Requires lxml and Pillow. Original TLS checks stay enabled. The origin currently
has a certificate error, so website HTML uses Jina Reader and website raster
images use a public image proxy. These are marked as mediated/derived copies,
not byte-identical originals. Instagram login gates are not circumvented.
"""
import concurrent.futures
import hashlib
import json
import mimetypes
import re
import shutil
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

from lxml import html
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
RESEARCH = ROOT / 'research/2026-10-21'
RAW = RESEARCH / 'raw'
MAN = RESEARCH / 'manifests'
ASSETS = ROOT / 'assets/source'


def write_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')


def fetch(url, headers=None):
    req = urllib.request.Request(url, headers=headers or {})
    with urllib.request.urlopen(req, timeout=55) as response:
        return response.read(), response.headers.get('content-type', ''), response.url


def clean_url(url, base='https://meshdent.hu/'):
    return urllib.parse.urldefrag(urllib.parse.urljoin(base, url))[0]


def collect_page(page):
    slug = page['slug']
    url = page['link']
    raw = RAW / 'pages' / (slug + '.html')
    raw.parent.mkdir(parents=True, exist_ok=True)
    result = {'wp_id': page['id'], 'slug': slug, 'source_url': url,
              'wp_modified': page.get('modified'), 'method': 'Jina Reader HTML',
              'retrieved_at': datetime.now(timezone.utc).isoformat()}
    try:
        if not raw.exists():
            if slug == 'kezdolap':
                raw.write_bytes((RAW / 'site-full.txt').read_bytes())
            else:
                data, _, _ = fetch('https://r.jina.ai/' + url, {'X-Return-Format': 'html'})
                raw.write_bytes(data)
        doc = html.fromstring(raw.read_bytes())
        result['title'] = ' '.join(doc.xpath('//title/text()'))
        result['metadata'] = {m.get('name') or m.get('property'): m.get('content') for m in doc.xpath('//meta[@content]')}
        result['canonical'] = doc.xpath('//link[@rel="canonical"]/@href')
        result['headings'] = [{'level': h.tag, 'text': ' '.join(h.text_content().split())} for h in doc.xpath('//h1|//h2|//h3|//h4|//h5|//h6')]
        result['links'] = [{'text': ' '.join(a.text_content().split()), 'url': clean_url(a.get('href'), url)} for a in doc.xpath('//a[@href]') if a.get('href')]
        result['media'] = []
        for node in doc.xpath('//img|//video|//source|//iframe'):
            for attr in ['src', 'data-src', 'poster', 'data-retina']:
                src = node.get(attr)
                if src and not src.startswith('data:'):
                    result['media'].append({'tag': node.tag, 'attribute': attr, 'url': clean_url(src, url), 'alt': node.get('alt', '')})
        for src in re.findall(r'url\([\s\"\']*([^\)\"\']+)', raw.read_text()):
            if not src.startswith('data:'):
                result['media'].append({'tag': 'css', 'url': clean_url(src, url)})
        result['forms'] = [{'action': f.get('action'), 'method': f.get('method'), 'fields': [{'tag': n.tag, 'name': n.get('name'), 'type': n.get('type'), 'placeholder': n.get('placeholder'), 'label_value': n.get('value') if n.get('type') in ['checkbox', 'radio', 'submit'] else None} for n in f.xpath('.//input|.//textarea|.//select')]} for f in doc.xpath('//form')]
        result['structured_data'] = []
        for script in doc.xpath('//script[@type="application/ld+json"]'):
            try:
                result['structured_data'].append(json.loads(script.text or ''))
            except ValueError:
                pass
        result['tracking_ids'] = sorted(set(re.findall(r'(?:GTM-|G-|AW-|UA-)[A-Za-z0-9-]+', raw.read_text())))
        for node in doc.xpath('//script|//style|//noscript|//header|//nav'):
            node.drop_tree()
        for node in doc.xpath('//br'):
            node.tail = '\n' + (node.tail or '')
        full_text = '\n'.join(' '.join(text.split()) for text in doc.xpath('//body//text()[normalize-space()]'))
        full_dir = RESEARCH / 'content/full-text'
        full_dir.mkdir(parents=True, exist_ok=True)
        (full_dir / (slug + '.txt')).write_text(full_text + '\n')
        blocks = doc.xpath('//p|//h1|//h2|//h3|//h4|//h5|//li|//address|//td')
        lines = []
        for b in blocks:
            text = ' '.join(b.text_content().split())
            if text and (not lines or lines[-1] != text):
                lines.append(('#' * int(b.tag[1:]) + ' ' if re.fullmatch(r'h[1-6]', b.tag) else '') + text)
        result['text'] = '\n\n'.join(lines)
        contact_lines = [f"- {link['text']} — {link['url']}" for link in result['links'] if link['url'].startswith(('tel:', 'mailto:')) or 'google.com/maps/place' in link['url']]
        if contact_lines:
            result['text'] += '\n\n## Kapcsolati hivatkozások\n\n' + '\n'.join(dict.fromkeys(contact_lines))
        result['status'] = 'saved'
        (RESEARCH / 'content' / (slug + '.md')).write_text(f'# {result["title"]}\n\nForrás: {url}\n\nGyűjtés: 2026-10-21; közvetített HTML, automatikusan kinyert szöveg.\n\n' + result['text'] + '\n')
    except Exception as error:
        result['status'] = 'error'
        result['error'] = str(error)
    print('PAGE', slug, result['status'], flush=True)
    return result


def collect_image(item):
    url = item['source_url']
    mime = item['mime_type']
    original_suffix = Path(urllib.parse.urlparse(url).path).suffix.lower()
    output_format = 'jpg' if mime == 'image/jpeg' else 'webp' if mime == 'image/webp' else 'png'
    name = f"wp-{item['id']}-{Path(urllib.parse.urlparse(url).path).stem}.{output_format}"
    path = ASSETS / 'website' / name
    fetch_url = 'https://images.weserv.nl/?' + urllib.parse.urlencode({'url': url, 'output': output_format})
    details = item.get('media_details', {})
    record = {'source': 'website', 'wp_id': item['id'], 'source_url': url,
              'source_mime': mime, 'fetch_url': fetch_url,
              'method': 'public image proxy; re-encoded; no requested resize',
              'byte_identical_original': False, 'source_width': details.get('width'),
              'source_height': details.get('height'), 'title': item['title']['rendered'],
              'alt': item.get('alt_text', ''), 'attachment_page': item.get('link'),
              'local_path': str(path.relative_to(ROOT)),
              'retrieved_at': datetime.now(timezone.utc).isoformat()}
    try:
        if not path.exists():
            data, content_type, _ = fetch(fetch_url)
            if not content_type.startswith('image/'):
                raise ValueError('Unexpected content type: ' + content_type)
            path.write_bytes(data)
        with Image.open(path) as im:
            im.verify()
        with Image.open(path) as im:
            record.update(width=im.width, height=im.height, format=im.format)
        record.update(status='saved', bytes=path.stat().st_size, sha256=hashlib.sha256(path.read_bytes()).hexdigest())
    except Exception as error:
        record.update(status='error', error=str(error))
    print('IMAGE', item['id'], record['status'], flush=True)
    return record


def collect_repo():
    source = Path('/workspace/Meshdent')
    allowed = {'.png', '.jpg', '.jpeg', '.webp', '.svg', '.mp4', '.pdf'}
    records = []
    for path in sorted(source.rglob('*')):
        if not path.is_file() or '.git' in path.parts or path.suffix.lower() not in allowed:
            continue
        relative = path.relative_to(source)
        dest = ASSETS / 'freedom-air' / relative
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(path, dest)
        records.append({'source': 'Meshdent repository', 'source_path': str(relative),
            'source_commit': 'bb4a61168b81b97bf99d0fc3889c2dacbede555c',
            'source_url': 'https://github.com/zalan002/Meshdent/blob/bb4a61168b81b97bf99d0fc3889c2dacbede555c/' + urllib.parse.quote(str(relative)),
            'local_path': str(dest.relative_to(ROOT)), 'status': 'saved',
            'method': 'local git checkout byte-identical copy', 'byte_identical_original': True,
            'bytes': dest.stat().st_size, 'sha256': hashlib.sha256(dest.read_bytes()).hexdigest()})
    return records


def main():
    for p in [RAW, MAN, RESEARCH / 'content', ASSETS / 'website', ASSETS / 'instagram', ASSETS / 'freedom-air']:
        p.mkdir(parents=True, exist_ok=True)
    pages = json.loads((RAW / 'wp-pages.txt').read_text())
    media = json.loads((RAW / 'wp-media.txt').read_text())
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
        page_records = list(pool.map(collect_page, pages))
    write_json(MAN / 'pages.json', page_records)
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        image_records = list(pool.map(collect_image, media))
    write_json(MAN / 'website-media.json', image_records)
    write_json(MAN / 'freedom-air-media.json', collect_repo())
    doc = html.fromstring((RAW / 'instagram.html').read_bytes())
    metadata = {m.get('name') or m.get('property'): m.get('content') for m in doc.xpath('//meta[@content]')}
    profile = {'source_url': 'https://www.instagram.com/meshdent_lab_budapest/', 'retrieved_at': datetime.now(timezone.utc).isoformat(),
               'metadata': metadata, 'post_archive_status': 'blocked: public endpoint returns HTTP 401, require_login=true; no authenticated browser tool available',
               'profile_image': None}
    try:
        url = metadata['og:image']
        data, _, _ = fetch(url)
        dest = ASSETS / 'instagram/profile-thumbnail.jpg'
        dest.write_bytes(data)
        with Image.open(dest) as im:
            profile['profile_image'] = {'source_url': url, 'local_path': str(dest.relative_to(ROOT)), 'width': im.width, 'height': im.height, 'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest(), 'status':'saved'}
    except Exception as error:
        profile['profile_image_error'] = str(error)
    write_json(MAN / 'instagram.json', profile)
    print('DONE', len(page_records), len(image_records), flush=True)


if __name__ == '__main__':
    main()
