"""Check the published package, not the archived prototypes. Requires lxml."""
from pathlib import Path
from lxml import html
from urllib.parse import urlsplit, unquote
import json
root=Path('dist')
errors=[]
files=list(root.rglob('*.html'))
for file in files:
    doc=html.fromstring(file.read_text())
    ids=doc.xpath('//*[@id]/@id')
    if len(ids)!=len(set(ids)): errors.append((str(file),'duplicate ids'))
    if len(doc.xpath('//h1'))!=1: errors.append((str(file),'h1 count'))
    if doc.xpath('//a[contains(@href,"github.com")]'): errors.append((str(file),'GitHub link'))
    if 'OXO' in doc.text_content(): errors.append((str(file),'outdated OXO copy'))
    for item in doc.xpath('//script[@type="application/ld+json"]/text()'): json.loads(item)
    for url in doc.xpath('//@href|//@src|//@data-image|//source/@srcset'):
        if url.startswith(('http:','https:','mailto:','tel:','data:')): continue
        parsed=urlsplit(url)
        target,fragment=unquote(parsed.path),unquote(parsed.fragment)
        path=root/target.lstrip('/') if target not in ['','/'] else (file if not target else root/'index.html')
        if not path.suffix: path=path.with_suffix('.html')
        if not path.exists(): errors.append((str(file),'missing target',url)); continue
        if fragment and path.suffix=='.html' and fragment not in html.fromstring(path.read_text()).xpath('//*[@id]/@id'):
            errors.append((str(file),'missing anchor',url))
print(json.dumps({'pages':len(files),'errors':errors},ensure_ascii=False))
assert not errors
