#!/usr/bin/env python3
"""Package the design in one HTML file with desktop/mobile viewports."""
import base64
import html
import json
import mimetypes
import re
from pathlib import Path
from lxml import html as lhtml

BASE = Path(__file__).resolve().parent
PROTOTYPE = BASE / 'prototype'


def inline(text):
    tokens = []
    def save(value):
        tokens.append(value)
        return f'@@TOKEN{len(tokens)-1}@@'
    text = re.sub(r'`([^`]+)`', lambda m: save('<code>'+html.escape(m[1])+'</code>'), text)
    def link(m):
        target = m[2]
        if target == 'prototype/index.html': target = 'index.html'
        if target == 'prototype/terv.html': target = 'terv.html'
        if target.startswith('../../research/') or target.endswith('.json') or target.endswith('.csv'):
            return m[1] + ' (a projektmellékletben)'
        return save('<a href="'+html.escape(target,quote=True)+'">'+html.escape(m[1])+'</a>')
    text = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', link, text)
    text = html.escape(text)
    text = re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', text)
    for i, token in enumerate(tokens): text=text.replace(f'@@TOKEN{i}@@',token)
    return text


def markdown(source):
    lines=source.splitlines(); output=[]; paragraph=[]; i=0
    def flush():
        if paragraph: output.append('<p>'+inline(' '.join(paragraph))+'</p>'); paragraph.clear()
    while i<len(lines):
        line=lines[i]
        if line.startswith('```'):
            flush(); block=[]; i+=1
            while i<len(lines) and not lines[i].startswith('```'): block.append(lines[i]); i+=1
            output.append('<pre><code>'+html.escape('\n'.join(block))+'</code></pre>')
        elif line.startswith('|'):
            flush(); rows=[]
            while i<len(lines) and lines[i].startswith('|'):
                cells=[cell.strip() for cell in lines[i].strip('|').split('|')]
                if not all(re.fullmatch(r':?-+:?',cell) for cell in cells): rows.append(cells)
                i+=1
            output.append('<div class="table-scroll"><table class="plan-table">'+''.join('<tr>'+''.join(f'<{"th" if j==0 else "td"}>'+inline(cell)+f'</{"th" if j==0 else "td"}>' for cell in row)+'</tr>' for j,row in enumerate(rows))+'</table></div>');continue
        elif line.startswith('#'):
            flush(); match=re.match(r'^(#{1,6})\s+(.+)',line)
            if match:
                level=len(match[1]);output.append(f'<h{level}>'+inline(match[2])+f'</h{level}>')
        elif line.startswith('- '):
            flush(); items=[]
            while i<len(lines) and lines[i].startswith('- '):items.append('<li>'+inline(lines[i][2:])+'</li>');i+=1
            output.append('<ul>'+''.join(items)+'</ul>');continue
        elif not line.strip():flush()
        else:paragraph.append(line)
        i+=1
    flush();return '\n'.join(output)


pages={}
for file in sorted(PROTOTYPE.glob('*.html')):
    doc=lhtml.parse(str(file)); body=doc.find('body')
    pages[file.name]={'title':doc.find('.//title').text.replace(' | MeshDent · látványterv',''), 'body':''.join(lhtml.tostring(child,encoding='unicode',method='html') for child in body)}
plan_style='''.full-plan{max-width:1080px;margin:auto;padding:50px 24px 90px}.full-plan h1{font-size:48px;margin-bottom:30px}.full-plan h2{font-size:32px;margin:64px 0 24px;padding-top:30px;border-top:1px solid var(--line)}.full-plan h3{font-size:24px;margin:35px 0 18px}.full-plan p{max-width:85ch;margin:20px 0;font-size:16px}.full-plan li{margin-bottom:10px;font-size:16px}.full-plan a{text-decoration:underline}.full-plan code{font-size:13px;overflow-wrap:anywhere}.full-plan pre{overflow:auto;background:var(--soft);padding:24px;border-radius:8px}.full-plan th,.full-plan td{font-size:13px}.full-plan strong{font-weight:650}@media(max-width:640px){.full-plan h1{font-size:36px}.full-plan h2{font-size:27px}}'''
review=markdown((BASE/'ELLENORZES.md').read_text()).replace('<h1>','<h2>').replace('</h1>','</h2>')
home_notes=markdown((BASE/'FOOLDAL-02.md').read_text()).replace('<h1>','<h2>').replace('</h1>','</h2>')
pages['teljes-terv.html']={'title':'Részletes honlapterv', 'body':'<main class="full-plan">'+markdown((BASE/'TELJES-HONLAPTERV.md').read_text())+'<section id="fooldal-02">'+home_notes+'</section><section id="ellenorzes">'+review+'</section></main>'}
css=(PROTOTYPE/'style.css').read_text()+(PROTOTYPE/'home-v2.css').read_text()+(PROTOTYPE/'light.css').read_text()+plan_style
app=(PROTOTYPE/'app.js').read_text().replace("new URLSearchParams(window.location.search).get('tema')", "window.__prototypeTopic || new URLSearchParams(window.location.search).get('tema')")
app+='\n'+(PROTOTYPE/'dental-arch.js').read_text()+'\n'+(PROTOTYPE/'home-v2.js').read_text()
assets={}
for file in (PROTOTYPE/'assets').iterdir():
    if file.is_file():assets['assets/'+file.name]='data:'+mimetypes.guess_type(file.name)[0]+';base64,'+base64.b64encode(file.read_bytes()).decode()
csv_download='data:text/csv;charset=utf-8;base64,'+base64.b64encode((BASE/'oldalterv.csv').read_bytes()).decode()
payload=json.dumps({'pages':pages,'css':css,'app':app,'assets':assets,'csv_download':csv_download},ensure_ascii=False).replace('<','\\u003c')
shell='''<!doctype html><html lang="hu"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>MeshDent — teljes honlapterv és látványterv</title><style>
*{box-sizing:border-box}html,body{height:100%;margin:0}body{font:14px/1.4 system-ui,sans-serif;background:#dce4dd;color:#173e35;display:flex;flex-direction:column}.toolbar{padding:12px 20px;background:#fff;border-bottom:1px solid #b7c6bc;display:flex;gap:18px;align-items:center;flex-wrap:wrap}.toolbar strong{font-size:16px;letter-spacing:-.03em}.toolbar small{color:#53645d;font-size:11px}.tools{margin-left:auto;display:flex;gap:8px;align-items:center;flex-wrap:wrap}select,button{font:inherit;border:1px solid #a7b8ac;border-radius:5px;background:white;color:#173e35;min-height:38px;padding:8px 10px}select{max-width:350px}button{cursor:pointer}button[aria-pressed=true]{background:#173e35;color:white;border-color:#173e35}:focus-visible{outline:3px solid #007c62;outline-offset:2px}.stage{flex:1;min-height:0;display:flex;justify-content:center;padding:0;overflow:hidden}iframe{border:0;width:100%;height:100%;background:#f5f4ef;transition:width .2s}.stage.mobile{padding:12px}.stage.mobile iframe{width:392px;max-width:100%;border:1px solid #a7b8ac;border-radius:16px}.label{font-size:12px}.view-help{font-size:11px;max-width:230px;color:#53645d}@media(max-width:700px){.toolbar{padding:8px 12px;gap:8px}.tools{width:100%;margin:0}.tools select{flex:1;min-width:0;max-width:100%;width:160px}.toolbar small,.view-help{display:none}.stage.mobile{padding:0}button{font-size:12px}}@media(prefers-reduced-motion:reduce){iframe{transition:none}}
</style></head><body><header class="toolbar"><div><strong>MeshDent / Főoldalkoncepció 02</strong><br><small>2026.10.21. · Helyi, interaktív látványterv</small></div><div class="tools"><label class="label" for="page-select">Oldal</label><select id="page-select" aria-label="Tervezett oldal kiválasztása"></select><button id="desktop" aria-pressed="true">Asztali</button><button id="mobile" aria-pressed="false">Mobil · 390 px</button></div></header><div class="stage" id="stage"><iframe id="preview" title="A kiválasztott MeshDent-oldal látványterve"></iframe></div><script id="design-data" type="application/json">PAYLOAD</script><script>
const data=JSON.parse(document.getElementById('design-data').textContent),frame=document.getElementById('preview'),select=document.getElementById('page-select');
const ordered=['index.html','vilagosabb.html','rolunk.html','same-day-cirkon-koronak-hidak.html','leplezett-zirkon-korona.html','esthetic-anatomikus-zirkon-fogpotlas.html','lathatatlan-fogszabalyozas.html','implantatumra-keszult.html','oxo-implant-service.html','munkaink.html','partnereink.html','kapcsolat.html','extraoralis-scanner-fogpotlas.html','insta.html','FreedomaAir.html','terv.html','teljes-terv.html','jogi-oldalak.html'];
for(const name of ordered){const option=document.createElement('option');option.value=name;option.textContent=name==='index.html'?'Főoldal':data.pages[name].title;select.appendChild(option);}
function navigate(target){if(location.hash.slice(1)===target)render();else location.hash=target;}
function render(){
const target=decodeURI(location.hash.slice(1)||'index.html'),url=new URL(target,'https://prototype.invalid/');let name=url.pathname.split('/').pop();if(!data.pages[name])name='index.html';select.value=name;
let body=data.pages[name].body;for(const [path,uri]of Object.entries(data.assets))body=body.split(path).join(uri);
body=body.split('href="../oldalterv.csv"').join('href="'+data.csv_download+'" download="MeshDent-oldalterv.csv"');
const setup='window.__prototypeTopic='+JSON.stringify(url.searchParams.get('tema'))+';';
const delegate=`document.addEventListener('click',event=>{const a=event.target.closest('a[href]');if(!a)return;let target=a.getAttribute('href');if(target.startsWith('#')||a.hasAttribute('download'))return;if(target==='../TELJES-HONLAPTERV.md')target='teljes-terv.html';if(target==='FOOLDAL-02.md')target='teljes-terv.html#fooldal-02';if(target==='../ELLENORZES.md'||target==='ELLENORZES.md')target='teljes-terv.html#ellenorzes';if(target.startsWith('http')){a.target='_blank';a.rel='noopener noreferrer';return;}if(target.includes('.html')&&!target.startsWith('http')){event.preventDefault();parent.postMessage({type:'meshdent:navigate',target},'*');}});`;
const scroll='setTimeout(()=>{const id='+JSON.stringify(url.hash.slice(1))+';if(id)document.getElementById(id)?.scrollIntoView();},30);';
frame.srcdoc='<!doctype html><html lang="hu"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>'+data.css+'</style></head><body>'+body+'<script>'+setup+data.app+delegate+scroll+'<'+ '/script></body></html>';
document.title=data.pages[name].title+' | MeshDent honlapterv';
}
select.addEventListener('change',()=>navigate(select.value));window.addEventListener('hashchange',render);window.addEventListener('message',event=>{if(event.source!==frame.contentWindow||event.data?.type!=='meshdent:navigate')return;const target=event.data.target;if(typeof target!=='string')return;const name=target.split(/[?#]/)[0];if(data.pages[name])navigate(target);});
for(const id of ['desktop','mobile'])document.getElementById(id).addEventListener('click',()=>{document.getElementById('stage').classList.toggle('mobile',id==='mobile');for(const other of ['desktop','mobile'])document.getElementById(other).setAttribute('aria-pressed',String(other===id));});
render();
</script></body></html>'''
(BASE/'MeshDent-latvanyterv.html').write_text(shell.replace('PAYLOAD',payload))
print(json.dumps({'standalone':str(BASE/'MeshDent-latvanyterv.html'),'pages':len(pages),'embedded_assets':len(assets),'bytes':(BASE/'MeshDent-latvanyterv.html').stat().st_size},indent=2))
