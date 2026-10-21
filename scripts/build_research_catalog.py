#!/usr/bin/env python3
"""Generate a local, searchable media catalogue and verifiable research tables."""
import csv
import hashlib
import html
import json
import re
from collections import Counter
from pathlib import Path
from urllib.parse import quote, urlparse

ROOT = Path(__file__).resolve().parents[1]
R = ROOT / 'research/2026-10-21'
M = R / 'manifests'


def read(name):
    return json.loads((M / name).read_text())


def write(name, data):
    (M / name).write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')


def category(item):
    name = Path(item['local_path']).name.lower()
    ident = item.get('wp_id', 0)
    if item.get('source') == 'Instagram':
        if item.get('source_media_kind') == 'Reels-borítókép': return 'Instagram Reels-borító'
        if item.get('post_type') == 'Galéria': return 'Instagram galériakép'
        if item.get('post_id'): return 'Instagram bejegyzés'
        return 'Instagram profil'
    if item.get('source') == 'Meshdent repository': return 'Freedom Air'
    if 'oxo_paciens' in name: return 'OXO klinikai referencia'
    if ident in range(561, 569): return 'Fogtechnikai referenciamunka'
    if ident in [621, 493, 610, 609]: return 'MeshDent / OXO arculat'
    if ident in range(589, 600) or ident in range(656, 662): return 'Partnerlogó'
    if 'oxo' in name: return 'OXO technológia'
    if 'service' in name or 'before' in name or 'after' in name: return 'Szolgáltatásillusztráció'
    if ident in [691, 578, 579] or 'bg' in name: return 'Háttér / stock jellegű kép'
    return 'Ikon / egyéb arculati elem'


def main():
    website = read('website-media.json')
    repo = read('freedom-air-media.json')
    pages = read('pages.json')
    profile = read('instagram.json')
    instagram_media = read('instagram-media.json') if (M/'instagram-media.json').exists() else []
    instagram_import = read('instagram-import-summary.json') if (M/'instagram-import-summary.json').exists() else {}
    # Keep every source path in the manifest, but store byte-identical media once.
    canonical = {}
    for item in sorted(repo, key=lambda x: (not x['source_path'].startswith('public/'), x['source_path'])):
        sha = item['sha256']
        path = ROOT / item['local_path']
        if sha not in canonical:
            canonical[sha] = item
        else:
            original_path = item['local_path']
            item['local_path'] = canonical[sha]['local_path']
            item['duplicate_of_source_path'] = canonical[sha]['source_path']
            if original_path != item['local_path'] and path.exists(): path.unlink()
    write('freedom-air-media.json', repo)
    entries = website + list(canonical.values())
    if profile.get('profile_image'):
        entries.append(dict(profile['profile_image'], source='Instagram', title='Instagram profilkép (100 × 100)',
                            method='public Open Graph profile thumbnail', byte_identical_original=True))
    entries.extend(instagram_media)
    for e in entries:
        e['category'] = category(e)
        e['name'] = e.get('title') or e.get('source_path') or Path(e['local_path']).name
        e['type'] = 'video' if e['local_path'].endswith('.mp4') else 'document' if e['local_path'].endswith('.pdf') else 'image'
        e['used_on'] = [p['source_url'] for p in pages if any(x['url'].replace('http://','https://') == e.get('source_url','').replace('http://','https://') for x in p.get('media', []))]
    write('media-catalog.json', entries)
    summary = {
        'collected_on': '2026-10-21', 'timezone': 'Europe/Budapest',
        'website_pages': len(pages), 'website_media_attachments':len(website),
        'website_original_raster_dimensions_preserved':sum(e.get('source_width') is not None and (e['source_width'],e['source_height'])==(e.get('width'),e.get('height')) for e in website),
        'website_svg_rasterized':sum(e.get('source_mime')=='image/svg+xml' for e in website),
        'repo_media_source_paths':len(repo), 'repo_media_unique':len(canonical),
        'instagram_posts_catalogued':instagram_import.get('posts_catalogued',0),
        'instagram_photo_posts_saved':instagram_import.get('photo_posts',0),
        'instagram_photos':instagram_import.get('photos',0),
        'instagram_reel_covers':instagram_import.get('reel_cover_images',0),
        'instagram_videos_downloaded':instagram_import.get('videos_downloaded',0),
        'instagram_videos_missing':instagram_import.get('videos_missing',0),
        'instagram_profile_images':int(bool(profile.get('profile_image'))),
        'instagram_imported_image_files':len(instagram_media),
        'catalog_entries':len(entries), 'unique_media_sha256':len({e['sha256'] for e in entries}),
        'media_bytes':sum(e['bytes'] for e in entries),
        'types':dict(Counter(e['type'] for e in entries)),
        'categories':dict(Counter(e['category'] for e in entries)),
        'source_commit':'bb4a61168b81b97bf99d0fc3889c2dacbede555c',
        'limitations':['Website HTML obtained through Jina Reader after origin TLS certificate error.',
          'Website images are proxy-reencoded copies; original bytes and original SVG vectors not archived.',
          'Instagram images and metadata imported from a supplied archive; one full reel video missing; live completeness not independently rechecked.' if instagram_media else 'Instagram posts require authentication; only public profile metadata and thumbnail saved.',
          'Embedded Vimeo player returned 404; YouTube metadata requests blocked by network proxy.',
          'No browser visual regression, production form submissions or analytics account validation performed.']}
    write('summary.json',summary)
    with (M/'media-catalog.csv').open('w',newline='') as f:
        fields=['source','category','name','type','source_url','local_path','width','height','bytes','sha256','method','post_id','published_at_utc','published_at_budapest','source_media_kind','caption','caption_local_path','duplicate_of_local_path']
        w=csv.DictWriter(f,fieldnames=fields,extrasaction='ignore');w.writeheader();w.writerows(entries)
    with (M/'pages-seo.csv').open('w',newline='') as f:
        w=csv.writer(f);w.writerow(['source_url','title','description','h1_count','h1','canonical','wp_modified','forms','tracking_ids'])
        for p in pages:
            h=[x['text'] for x in p['headings'] if x['level']=='h1']
            w.writerow([p['source_url'],p['title'],p['metadata'].get('description',''),len(h),' | '.join(h),' | '.join(p['canonical']),p.get('wp_modified'),len([x for x in p['forms'] if x['method']=='post']),' | '.join(p.get('tracking_ids',[]))])
    cards=[]
    for e in entries:
        src='../../'+quote(e['local_path'])
        name=html.escape(e['name'])
        if e['type']=='image':
            preview=f'<img src="{src}" alt="{name}" loading="lazy">'
        elif e['type']=='video':
            preview=f'<video src="{src}" controls preload="metadata" aria-label="{name}"></video>'
        else: preview='<div class="pdf">PDF dokumentum</div>'
        dims=f"{e.get('width','—')} × {e.get('height','—')}" if e['type']=='image' else e['type']
        note='Közvetített képmásolat' if e['source']=='website' else 'Eredeti repófájl' if e['source']=='Meshdent repository' else 'Instagram által kiszolgált kép · átvett archívumból' if e.get('post_id') else 'Csak profilbélyegkép'
        if e.get('related_video_missing'): note+=' · A videófájl hiányzik, ez csak borítókép'
        if e.get('duplicate_of_local_path'): note+=' · Másik bejegyzésben is szereplő, azonos kép'
        if e.get('source_mime')=='image/svg+xml': note+=' · SVG raszterizálva'
        if 'accuracy-test' in src: note+=' · CONFIDENTIAL jelölés; közzététel előtt tisztázandó'
        search=html.escape((e['category']+' '+e['name']+' '+e['source']+' '+e.get('caption','')).lower(),quote=True)
        caption = ('<details><summary>Képaláírás és dátum</summary><p>' + html.escape(e.get('published_at_budapest','')) + ' · Europe/Budapest</p><p style="white-space:pre-wrap">' + html.escape(e['caption']) + '</p></details>') if e.get('caption') else ''
        cards.append(f'<article data-search="{search}" data-source="{html.escape(e["source"],quote=True)}" data-type="{e["type"]}"><a class="preview" href="{src}">{preview}</a><div class="card-body"><small>{html.escape(e["category"])}</small><h2>{name}</h2><p>{dims} · {e["bytes"]/1024:.0f} KB</p><p class="note">{note}</p>{caption}<a href="{src}" download>Fájl letöltése</a> <a href="{html.escape(e.get("source_url",""),quote=True)}" target="_blank" rel="noopener noreferrer">Forrás ↗</a></div></article>')
    template='''<!doctype html><html lang="hu"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>MeshDent · összegyűjtött médiaanyagok</title><style>
    *{box-sizing:border-box}body{margin:0;background:#f3f6f5;color:#133b31;font:16px/1.55 system-ui,sans-serif}header{padding:48px max(24px,5vw);background:#103d34;color:white}header small{color:#6de1b7;letter-spacing:.15em}h1{font-size:clamp(30px,5vw,54px);line-height:1.1;margin:12px 0}header p{max-width:900px;color:#d0e5dd}.metrics{display:flex;gap:30px;flex-wrap:wrap}.metrics strong{font-size:28px;display:block}.tools{position:sticky;top:0;z-index:2;background:#fff;padding:18px 5vw;display:flex;flex-wrap:wrap;gap:12px;border-bottom:1px solid #d9e4df}input,select{font:inherit;border:1px solid #bed1c8;border-radius:6px;padding:10px;background:#fff}input{min-width:200px;flex:1}main{padding:28px 5vw;display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:22px}article{border:1px solid #dce5e0;border-radius:10px;overflow:hidden;background:white;box-shadow:0 5px 20px #123b3106}article[hidden]{display:none}.preview{display:flex;align-items:center;justify-content:center;height:230px;background:repeating-conic-gradient(#f5f6f5 0% 25%,#e8ece9 0% 50%) 50%/20px 20px}img,video{display:block;max-height:100%;width:100%;object-fit:contain}.card-body{padding:18px}h2{font-size:15px;overflow-wrap:anywhere;margin:6px 0}small{font-size:12px;text-transform:uppercase}p{margin:6px 0}.note{font-size:12px;color:#60776d}a{color:#087455;text-underline-offset:3px}.card-body a{display:inline-block;margin:10px 12px 0 0;font-size:13px}.pdf{font-size:24px;font-weight:700}footer{padding:24px 5vw;color:#60776d}#count{align-self:center;font-size:14px}
    </style></head><body><header><small>MESHDENT / FORRÁSARCHÍVUM / 2026.10.21.</small><h1>Az új honlap kép- és médiatára</h1><p>A jelenlegi honlap és a Freedom Air-repó összegyűjtött anyagai. Ez kutatási katalógus, a végleges honlap látványterve külön készül. A webes képek közvetítőn át mentett másolatok; az Instagram-bejegyzések még hiányoznak.</p><div class="metrics"><div><strong>84</strong>weboldali kép</div><div><strong>49</strong>egyedi repófájl</div><div><strong>1</strong>Instagram profilbélyegkép</div><div><strong>13</strong>archivált oldal</div></div></header><section class="tools" aria-label="Médiaszűrők"><input id="search" type="search" aria-label="Keresés" placeholder="Keresés név vagy kategória alapján…"><select id="source" aria-label="Forrás"><option value="">Minden forrás</option value="website">Jelenlegi honlap</option value="Meshdent repository">Freedom Air-repó</option value="Instagram">Instagram</option></select><select id="type" aria-label="Fájltípus"><option value="">Minden típus</option value="image">Kép</option><option value="video">Videó</option><option value="document">PDF</option></select><span id="count" aria-live="polite"></span></section><main>CARDS</main><footer>A fájlok helyben találhatók. Az eredet és az ellenőrzőösszeg a manifests/media-catalog.csv fájlban szerepel. A katalógust a teljes projektmappával együtt kell mozgatni.</footer><script>const cards=[...document.querySelectorAll('article')],search=document.querySelector('#search'),source=document.querySelector('#source'),type=document.querySelector('#type');function filter(){let count=0;for(const card of cards){card.hidden=!(card.dataset.search.includes(search.value.toLocaleLowerCase('hu'))&&(!source.value||card.dataset.source===source.value)&&(!type.value||card.dataset.type===type.value));if(!card.hidden)count++;}document.querySelector('#count').textContent=count+' fájl';}for(const el of [search,source,type])el.addEventListener('input',filter);filter();</script></body></html>'''
    if instagram_media:
        template = template.replace('az Instagram-bejegyzések még hiányoznak.', 'az Instagram-archívum 168 bejegyzését és 183 képfájlját beillesztettük. Egy Reels teljes videófájlja még hiányzik.')
        template = template.replace('<strong>1</strong>Instagram profilbélyegkép', f'<strong>{len(instagram_media)+int(bool(profile.get("profile_image")))}</strong>Instagram képfájl')
    (R/'media-library.html').write_text(template.replace('CARDS','\n'.join(cards)))
    print(json.dumps(summary,ensure_ascii=False,indent=2))


if __name__=='__main__':main()
