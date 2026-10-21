#!/usr/bin/env python3
"""Build an offline, no-tracking design prototype from archived MeshDent sources."""
import base64
import csv
import hashlib
import html
import json
import shutil
from pathlib import Path
from urllib.parse import quote

BASE = Path(__file__).resolve().parent
ROOT = BASE.parents[1]
OUT = BASE / 'prototype'
MANIFESTS = ROOT / 'research/2026-10-21/manifests'
CATALOG = json.loads((MANIFESTS / 'media-catalog.json').read_text())
ASSETS = {}
SELECTION = []
esc = html.escape


def asset(key, *, post=None, wp=None, alt='', purpose='', derivative=None):
    found = next(x for x in CATALOG if (x.get('post_id') == post and x.get('order') == 1) if post) if post else next(x for x in CATALOG if x.get('wp_id') == wp)
    source = ROOT / found['local_path']
    exported = ROOT / derivative if derivative else source
    dest = OUT / 'assets' / (key + exported.suffix)
    dest.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(exported, dest)
    ASSETS[key] = {'src': 'assets/' + dest.name, 'alt': alt, 'width': found['width'], 'height': found['height'], 'source': found['source_url']}
    SELECTION.append({'key': key, 'purpose': purpose, 'source_path': found['local_path'], 'source_url': found['source_url'], 'prototype_path': str(dest.relative_to(BASE)), 'width': found['width'], 'height': found['height'], 'alt_proposal': alt, 'sha256': hashlib.sha256(dest.read_bytes()).hexdigest(), 'transformation': 'WebP quality 85 encoding; original dimensions; no retouching' if derivative else 'none; byte-identical copy of archived source', 'source_caption': found.get('caption', '')})


asset('logo', wp=621, alt='MeshDent digitális fogtechnika', purpose='Közös fejléc, meglévő logó')
asset('family', wp=579, alt='Mosolygó szülők két gyermekükkel a MeshDent korábbi főoldalának családi képén', purpose='Világos főoldal: korábbi nyitókép', derivative='assets/derived/website/family.webp')
asset('joy', wp=578, alt='Nevető édesanya és kislánya egy világos szobában', purpose='Világos főoldal: emberközpontú hangulatkép a meglévő oldalról')
asset('full-arch', post='DUi3W8Fj0lx', alt='Teljes íves fogpótlás látható implantátumkapcsolatokkal, fekete háttéren', purpose='Főoldali hero és implantátumos referencia')
asset('detail', post='DZIsczGGhTb', alt='A MeshDent fogpótlásának elülső fogai és ínyrésze közelről', purpose='Saját referenciamunka, Rólunk')
asset('esthetic', post='DXsCFGZkazP', alt='Anatómikus fogpótlás világos modellen, részletes fogfelszínekkel', purpose='ESTHETIC és Munkáink; anyagmegnevezés a képaláírás alapján')
asset('dentures', post='DRsIZKdjHTl', alt='Felső és alsó teljes fogsor közeli tárgyfotón', purpose='Galéria; a poszt szerint 3D-nyomtatott fogsor')
asset('freedom', post='DYm71gSjRSc', alt='Két intraorális szkenner és tartozékok világos háttéren', purpose='Kisméretű Freedom Air átkötő modul')
asset('oxo', wp=608, alt='OXO extraorális szkenner egység', purpose='OXO technológiai és szolgáltatásblokk')
asset('same-day', wp=506, alt='A jelenlegi SAME DAY korona- és hídoldal fogtechnikai illusztrációja', purpose='Forrásoldal szerinti SAME DAY megfeleltetés')
asset('layered', wp=510, alt='A jelenlegi leplezett zirkon oldal fogpótlás-illusztrációja', purpose='Forrásoldal szerinti leplezett zirkon megfeleltetés')
asset('aligner', wp=512, alt='Átlátszó fogszabályozó sín a jelenlegi szolgáltatásoldalról', purpose='Láthatatlan fogszabályozás')
for key, wp, name in [('nobel',661,'Nobel Biocare'),('medit',660,'Medit'),('medentika',659,'Medentika'),('exocad',658,'exocad'),('dentaltechnika',657,'Dentaltechnika'),('3shape',656,'3Shape')]:
    asset(key, wp=wp, alt=name, purpose='Jelenlegi partneroldalon szereplő logó; kapcsolatjelleg véglegesítendő')

SERVICES = [
    {'slug':'same-day-cirkon-koronak-hidak','title':'SAME DAY cirkon koronák és hidak','short':'SAME DAY koronák és hidak','image':'same-day','topic':'same-day','tag':'CAD/CAM · Egyedi fogpótlás',
     'intro':'Digitális tervezéssel és CAD/CAM gyártással készülő koronák és hidak. Az egyedi munkát a rendelővel egyeztetett igényekhez és ütemezéshez igazítjuk.',
     'blocks':[('Digitálisan tervezett, egyedileg kidolgozott','A MeshDent a koronák és hidak tervezéséhez és gyártásához CAD/CAM szoftvereket használ. A digitális munkafolyamatot a kész fogpótlás egyedi kidolgozása egészíti ki.'),('Egyeztetés az elkészítés előtt','A kiinduló adatok, az anyag és az elvárt megjelenés egyeztetése segíti a közös munkát. Az expressz elkészítés lehetőségéről és feltételeiről közvetlenül a laborral egyeztessen.')],
     'faq':[('Hogyan indul az együttműködés?','Vegye fel a kapcsolatot a laborral. Az adott munkáról, a szükséges adatok átadásáról és az ütemezésről közvetlenül egyeztetünk.'),('Milyen technológiával készülnek a munkák?','A jelenlegi szolgáltatás digitális CAD-tervezésre és CAM-gyártásra épül, egyedi kidolgozással.')],
     'intent':'cirkon korona labor; SAME DAY korona','description':'SAME DAY cirkon koronák és hidak a MeshDent budapesti digitális laborjában. CAD/CAM tervezés, egyedi kidolgozás és közvetlen szakmai egyeztetés.','review':'A 24 órás vállalás pontos feltételei véglegesítendők.'},
    {'slug':'leplezett-zirkon-korona','title':'Leplezett zirkon koronák','short':'Leplezett zirkon koronák','image':'layered','topic':'leplezett-zirkon','tag':'Digitális váz · Egyedi porcelánleplezés',
     'intro':'Digitálisan megtervezett cirkóniumváz és egyedileg felépített porcelánleplezés. A MeshDent a forma, a szín és a részletek kidolgozását egy közös munkafolyamatban kezeli.',
     'blocks':[('Digitális forma és mikroszkópos ellenőrzés','Az anatómikus tervezést követően a vázat a porcelánleplezéshez alakítjuk. A pontosság és a széli záródás ellenőrzése mikroszkóp alatt történik.'),('GC Initial porcelánleplezés','A váz GC Initial porcelánleplezést kap. A végső árnyalat és megjelenés kialakítását az adott munka és a rendelővel egyeztetett igények határozzák meg.')],
     'faq':[('Miben különbözik az anatómikus zirkontól?','A leplezett munkánál a megtervezett vázra külön porcelánleplezés kerül. Az anatómikus megoldás teljes formában, külön kerámialeplezés nélkül készül.'),('Mi történik a leplezés előtt?','A digitális váztervezést mikroszkópos ellenőrzés követi a jelenlegi MeshDent-munkafolyamat szerint.')],
     'intent':'leplezett zirkon korona fogtechnika','description':'Leplezett zirkon koronák digitális váztervezéssel, mikroszkópos ellenőrzéssel és GC Initial porcelánleplezéssel. Ismerje meg a MeshDent munkafolyamatát.','review':'Új, ehhez az anyaghoz igazolt saját referencia később válthatja a régi illusztrációt.'},
    {'slug':'esthetic-anatomikus-zirkon-fogpotlas','title':'ESTHETIC anatómikus zirkon fogpótlás','short':'ESTHETIC anatómikus zirkon','image':'esthetic','topic':'esthetic','tag':'Teljes anatómia · Többrétegű cirkónia',
     'intro':'Teljes anatómikus formában készülő, többrétegű cirkóniumalapú fogpótlások. A digitális tervezés és az egyedi kidolgozás a természetes megjelenést szolgálja.',
     'blocks':[('A forma már a tervezés része','A teljes anatómikus restauráció a megtervezett végső formában készül el, külön kerámialeplezés nélkül. A MeshDent meglévő kínálatában többrétegű cirkóniaanyagok szerepelnek.'),('Árnyalat és részletek','Az anyag és az árnyalat kiválasztását az adott eset igényeihez kell igazítani. A felület, a forma és a fogszín kialakítása az egyedi munka része.')],
     'faq':[('Mit jelent a teljes anatómikus kialakítás?','A pótlást az anatómikus formájában gyártják le; nincs rajta külön felépített kerámialeplezés.'),('Milyen információval induljak?','Az adott munkával és a kívánt megjelenéssel keresse a labort. A szükséges digitális és színinformációkat az egyeztetésen pontosítjuk.')],
     'intent':'anatómikus zirkon fogpótlás; monolit cirkónia','description':'ESTHETIC anatómikus zirkon fogpótlások a MeshDenttől. Teljes anatómikus kialakítás, többrétegű cirkónia és digitális tervezés budapesti laborban.','review':'Anyagszilárdsági és transzparenciaadat csak gyártói anyagazonosítással kerül élesbe.'},
    {'slug':'lathatatlan-fogszabalyozas','title':'Láthatatlan fogszabályozás','short':'Láthatatlan fogszabályozás','image':'aligner','topic':'fogszabalyozas','tag':'Átlátszó sínek · Digitális tervezés',
     'intro':'Egyedileg tervezett, átlátszó sínekre épülő fogszabályozási megoldás. A digitális tervezés a páciens fogazatához igazodik; a kezelés alkalmasságáról a kezelő fogorvos dönt.',
     'blocks':[('Egyedi átlátszó sínek','A sínek a páciens fogaihoz igazítva készülnek. A kivehető kialakítás megkönnyíti a tisztítást és az étkezést, a tervezésben speciális szoftverek segítenek.'),('A fogorvosi döntés szerepe','Ez az eljárás nem minden esetben alkalmazható. A megfelelő kezelés kiválasztásához a kezelő fogorvos szakértelme és a páciens egyedi fogászati helyzetének vizsgálata szükséges.')],
     'faq':[('Mindenkinek megfelelő ez a megoldás?','Nem. Az alkalmasságról és a kezelési tervről a kezelő fogorvos dönt az egyéni fogászati helyzet alapján.'),('Milyen eszközről van szó?','Egyedileg készülő, átlátszó, kivehető sínekről, amelyek digitálisan megtervezett folyamat részei.')],
     'intent':'láthatatlan fogszabályozó sín digitális tervezés','description':'Egyedi átlátszó fogszabályozó sínek és digitális tervezés. Ismerje meg a MeshDent szolgáltatását és a fogorvosi alkalmassági döntés szerepét.','review':'A labor és a kezelő rendelő feladatainak végleges leírása szükséges.'},
    {'slug':'implantatumra-keszult','title':'Implantátumra készült fogpótlások','short':'Implantátumra készült pótlások','image':'full-arch','topic':'implantatum','tag':'Solid Full Arch Zirconia · All-on-X',
     'intro':'Digitális adatokra épülő, implantátumon rögzülő fogpótlások. A végleges teljes íves munka előtt PMMA vagy try-in próba segíti az egyeztetést a fogorvossal és a pácienssel.',
     'blocks':[('A digitális adatoktól a próbáig','A tervezéshez intraorális scan, illetve OXO technológiával meghatározott adatok használhatók. A kiindulási állapot, arcfotók és arcscan is segítheti a tervezést.'),('Próba a végleges munka előtt','A PMMA vagy try-in segítségével a páciens és a fogorvos a végleges gyártás előtt jelezheti észrevételeit. Ezután készül a monolit cirkon-dioxid pótlás a megállapított terv szerint.'),('Teljes íves megoldások','A jelenlegi MeshDent-kínálat Solid Full Arch Zirconia munkákat, valamint All-on-4 és All-on-6 esetekhez készülő pótlásokat is bemutat.')],
     'faq':[('Van próba a végleges fogpótlás előtt?','A jelenlegi munkafolyamat PMMA vagy try-in készítését tartalmazza, hogy a módosítási igények a végleges gyártás előtt jelezhetők legyenek.'),('Az OXO és a Freedom Air ugyanaz?','Nem. Az OXO külön implantátumpozíció-meghatározási szolgáltatás; a Freedom Air külön eszköz és ajánlat. Saját oldalukon ismerhetők meg.')],
     'intent':'implantátumos fogpótlás labor; All-on-X fogtechnika','description':'Implantátumra készülő teljes íves fogpótlások a MeshDent digitális laborjában. Solid Full Arch Zirconia, digitális tervezés és próba a végleges munka előtt.','review':'Abszolút garanciák, allergiamentesség és pontossági ígéretek szakmai pontosítást igényelnek.'},
]
OXO = {'slug':'oxo-implant-service','title':'OXO implantátumpozíció-meghatározás','short':'OXO implantátumpozíció','image':'oxo','topic':'oxo','tag':'Extraorális szkennelés · Rendelői együttműködés',
 'intro':'Extraorális szkennelésre épülő implantátumpozíció-meghatározás. Az OXO szolgáltatás a rendelő és a MeshDent labor közötti digitális munkafolyamatot támogatja, teljes íves eseteknél is.',
 'blocks':[('Mit rögzít az OXO technológia?','Az eszköz a Scanmarkerek segítségével határozza meg az implantátumok helyzetét és tájolását. A rendszer fotogrammetriai és strukturált fényszkennelési technikákat egyesít.'),('A rendelő és a labor közös folyamata','Az implantátumpozíciókhoz a fogíny lenyomatának vagy intraorális szkennelésének adatai kapcsolódnak. Ezek összeillesztése adja a tervezés egyik alapját.'),('Egyeztetés az adott esetről','A szükséges adatfelvételről, a rendelői együttműködésről és a szolgáltatás elérhetőségéről kérjen közvetlen tájékoztatást a MeshDenttől.')],
 'faq':[('Mi az OXO szerepe?','Az implantátumok helyzetének és tájolásának meghatározását támogatja Scanmarkerekkel, extraorális digitális adatfelvétellel.'),('Hogyan kérhető a szolgáltatás?','Telefonon vagy az OXO-t kiválasztva a kapcsolatfelvételi űrlapon kezdeményezhet szakmai egyeztetést.')],
 'intent':'implantátum pozíció meghatározás; OXO fotogrammetria','description':'OXO extraorális implantátumpozíció-meghatározás a MeshDenttel. Ismerje meg a Scanmarkerekre épülő adatfelvételt és a rendelő–labor együttműködést.','review':'5 µm, 10–15 mp, ingyenesség és országos elérhetőség feltételei ellenőrzendők.'}
ALL_SERVICES = SERVICES + [OXO]
ROUTES = []
HOME_ARROW='<svg class="h-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 19L19 5M5 5h14v14"/></svg>'
SEO_TITLES = {
    '/':'Digitális fogtechnika Budapesten | MeshDent labor',
    '/rolunk/':'Rólunk – digitális fogtechnikai labor | MeshDent',
    '/munkaink/':'Fogtechnikai referenciák és munkáink | MeshDent',
    '/kapcsolat/':'Kapcsolat – fogtechnikai labor Budapesten | MeshDent',
    '/extraoralis-scanner-fogpotlas/':'Digitális lenyomatvétel pácienseknek | MeshDent',
    '/insta/':'Instagram-válogatás – saját munkáink | MeshDent',
    '/FreedomaAir':'Freedom Air szkenner és fotogrammetria | MeshDent',
}


def img(key, priority=False, cls=''):
    x=ASSETS[key]
    loading='fetchpriority="high"' if priority else 'loading="lazy"'
    return f'<img src="{x["src"]}" alt="{esc(x["alt"],quote=True)}" width="{x["width"]}" height="{x["height"]}" {loading} decoding="async" class="{cls}">'


def link(file, text, cls='text-link', suffix=' ↗'):
    return f'<a class="{cls}" href="{esc(file,quote=True)}">{esc(text)}<span aria-hidden="true">{suffix}</span></a>'


def contact_link(topic='general'):
    return 'kapcsolat.html?tema='+quote(topic)+'#urlap'


def header(current):
    menu=''.join(f'<a href="{s["slug"]}.html">{esc(s["short"])}</a>' for s in ALL_SERVICES)
    nav=[]
    for filename, label in [('rolunk','Rólunk'),('munkaink','Munkáink'),('FreedomaAir','Freedom Air')]:
        active=' aria-current="page"' if current==filename else ''
        nav.append(f'<a href="{filename}.html"{active}>{label}</a>')
    return f'''<a class="skip" href="#tartalom">Ugrás a tartalomra</a>
    <div class="review-bar"><div class="wrap"><span>MESHDENT · LÁTVÁNYTERV 01 · 2026.10.21.</span><a href="terv.html">Oldaljegyzék és terv ↗</a></div></div>
    <header class="site-header"><div class="wrap header-inner"><a class="brand" href="index.html" aria-label="MeshDent főoldal">{img('logo')}</a><button class="menu-button" aria-expanded="false" aria-controls="main-nav">Menü ☰</button><nav class="nav" id="main-nav" aria-label="Fő navigáció">{nav[0]}<details><summary>Szolgáltatások</summary><div class="nav-panel">{menu}</div></details>{''.join(nav[1:])}{link('kapcsolat.html','Kapcsolat','btn')}</nav></div></header>'''


def footer():
    services=''.join(f'<a href="{s["slug"]}.html">{esc(s["short"])}</a>' for s in ALL_SERVICES)
    return f'''<footer class="footer"><div class="wrap"><div class="footer-grid"><div><a class="footer-wordmark" href="index.html">MeshDent<span aria-hidden="true">↗</span></a><p>Digitális fogtechnika.<br>Természetes részletek.</p><p>1139 Budapest,<br>Petneházy u. 14.</p></div><div><h3>Fedezze fel</h3><a href="rolunk.html">Rólunk</a><a href="munkaink.html">Munkáink</a><a href="partnereink.html">Partnereink</a><a href="FreedomaAir.html">Freedom Air</a><a href="extraoralis-scanner-fogpotlas.html">Pácienseknek</a><a href="insta.html">Instagram-válogatás</a></div><div><h3>Szolgáltatások</h3>{services}</div><div><h3>Kapcsolat</h3><a href="tel:+36703619962">Szabó Richárd<br>+36 70 361 9962</a><a href="tel:+36703534000">Buczi János<br>+36 70 353 4000</a><a href="mailto:meshdentkft@gmail.com">meshdentkft@gmail.com</a><a href="https://www.instagram.com/meshdent_lab_budapest/" target="_blank" rel="noopener noreferrer">Instagram ↗</a></div></div><div class="footer-bottom"><span>© 2026 MeshDent Kft. · Tervezési változat</span><div class="footer-legal"><a href="jogi-oldalak.html#adatkezeles">Adatkezelés</a><a href="jogi-oldalak.html#impresszum">Impresszum</a><button data-cookie-open>Sütibeállítások</button></div></div></div></footer>
    <dialog id="lightbox" aria-labelledby="lightbox-title"><button class="dialog-close" data-close aria-label="Kép bezárása">×</button><img alt=""><h2 id="lightbox-title"></h2><p>Saját referenciamunka · <a target="_blank" rel="noopener noreferrer">Eredeti bejegyzés ↗</a></p></dialog>
    <dialog id="cookie-dialog" aria-labelledby="cookie-title"><button class="dialog-close" data-close aria-label="Sütibeállítások bezárása">×</button><h2 id="cookie-title">Sütibeállítások</h2><p>A végleges oldalon külön választható az analitika és a marketing. Ez a látványterv nem használ mérést vagy reklámsütit.</p><div class="buttons"><button class="btn secondary" data-cookie-choice>Csak szükségesek</button><button class="btn" data-cookie-choice>Összes elfogadása</button></div><p role="status"></p>{link('jogi-oldalak.html#sutik','A sütikezelés terve')}</dialog>'''


def page(filename,title,description,body,route='',intent='',cta='',review='',schema='WebPage',index='index, follow',chrome=True):
    seo_title=SEO_TITLES.get(route,title+' | MeshDent')
    home_resources='<link rel="stylesheet" href="home-v2.css"><script src="dental-arch.js" defer></script><script src="home-v2.js" defer></script>' if filename=='index' else ''
    if filename=='vilagosabb':
        home_resources='<link rel="stylesheet" href="light.css">'
    if filename in ['folyamat','osszekapcsolva']:
        home_resources='<link rel="stylesheet" href="concepts.css"><script src="concepts.js" defer></script>'
    header_html=header(filename) if chrome else ''
    footer_html=footer() if chrome else ''
    app_resources='<script src="app.js" defer></script>' if chrome else ''
    noscript_html='<noscript><p class="noscript wrap">A szövegek és az oldalak JavaScript nélkül is elérhetők. A mobilmenü helyett a lábléc linkjei használhatók. Az űrlappróba, a szűrés és a képnagyítás JavaScriptet igényel.</p></noscript>' if chrome else ''
    if filename=='vilagosabb':
        header_html=header_html.replace('MESHDENT · LÁTVÁNYTERV 01 · 2026.10.21.','MESHDENT · VILÁGOS VÁLTOZAT').replace('<a href="terv.html">Oldaljegyzék és terv ↗</a>','<a href="index.html">Eredeti változat ↗</a>').replace('href="index.html" aria-label="MeshDent főoldal"','href="vilagosabb.html" aria-label="MeshDent világos főoldal"')
        footer_html=footer_html.replace('<a class="footer-wordmark" href="index.html">MeshDent<span aria-hidden="true">↗</span></a>','<a class="footer-wordmark" href="vilagosabb.html">'+img('logo')+'</a>')
    if filename=='vilagosabb':
        light_arrow=HOME_ARROW.replace('h-arrow','l-arrow')
        body=body.replace('↗',light_arrow)
        header_html=header_html.replace('↗',light_arrow)
        footer_html=footer_html.replace('↗',light_arrow)
    if filename in ['folyamat','osszekapcsolva']:
        variant='03 · A MUNKAFOLYAMAT' if filename=='folyamat' else '04 · ÖSSZEKAPCSOLVA'
        switch='<nav class="concept-switch" aria-label="Főoldalváltozatok">'+''.join(f'<a href="{name}.html"'+(' aria-current="page"' if name==filename else '')+f'>{label}</a>' for name,label in [('index','01 Eredeti'),('vilagosabb','02 Világos'),('folyamat','03 Folyamat'),('osszekapcsolva','04 Összekapcsolva')])+'</nav>'
        header_html=header_html.replace('MESHDENT · LÁTVÁNYTERV 01 · 2026.10.21.','MESHDENT · '+variant).replace('<a href="terv.html">Oldaljegyzék és terv ↗</a>',switch).replace('href="index.html" aria-label="MeshDent főoldal"',f'href="{filename}.html" aria-label="MeshDent főoldal"')
        footer_html=footer_html.replace('<a class="footer-wordmark" href="index.html">MeshDent<span aria-hidden="true">↗</span></a>',f'<a class="footer-wordmark" href="{filename}.html">'+img('logo')+'</a>')
        variant_arrow=HOME_ARROW.replace('h-arrow','v-arrow')
        body=body.replace('↗',variant_arrow)
        header_html=header_html.replace('↗',variant_arrow)
        footer_html=footer_html.replace('↗',variant_arrow)
    if filename=='index':
        body=body.replace('↗',HOME_ARROW)
        header_html=header_html.replace('↗',HOME_ARROW).replace('LÁTVÁNYTERV 01','LÁTVÁNYTERV 02')
        footer_html=footer_html.replace('↗',HOME_ARROW)
    document=f'''<!doctype html><html lang="hu"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex, nofollow"><meta name="description" content="{esc(description,quote=True)}"><meta name="theme-color" content="#173e35"><title>{esc(title)} | MeshDent · látványterv</title><link rel="stylesheet" href="style.css">{app_resources}{home_resources}</head><body>{header_html}<main id="tartalom">{body}</main>{footer_html}{noscript_html}</body></html>'''
    (OUT/(filename+'.html')).write_text(document)
    if route:
        ROUTES.append({'route':route,'prototype':filename+'.html','h1':title,'title':seo_title,'meta_description':description,'search_intent':intent,'primary_cta':cta,'index_production_proposal':index,'canonical':'https://meshdent.hu'+route,'structured_data_proposal':schema,'open_content_item':review})


def breadcrumb(title):
    return f'<nav class="wrap breadcrumbs" aria-label="Morzsanavigáció"><a href="index.html">Főoldal</a><span aria-hidden="true">/</span><span aria-current="page">{esc(title)}</span></nav>'


def subhero(title,intro,image,eyebrow,cta='Szakmai egyeztetés',topic='general'):
    light=' light' if image in ['oxo','freedom','aligner','same-day','layered'] else ''
    return breadcrumb(title)+f'<section class="subhero wrap"><div class="hero-grid"><div class="hero-copy"><p class="eyebrow">{esc(eyebrow)}</p><h1>{esc(title)}</h1><p class="lead">{esc(intro)}</p><div class="buttons">{link(contact_link(topic),cta,"btn")}</div></div><figure class="hero-image{light}">{img(image,True)}</figure></div></section>'


def cta_band(title='Beszéljünk a következő munkáról.',topic='general'):
    return f'<section class="section dark"><div class="wrap cta-band"><div><p class="eyebrow">Kapcsolat a laborral</p><h2>{esc(title)}</h2></div>{link(contact_link(topic),"Kapcsolatfelvétel","btn")}</div></section>'


def service_cards(items):
    return '<div class="service-grid">'+''.join(f'<a class="service-card" href="{s["slug"]}.html">{img(s["image"])}<div class="card-text"><div><h3>{esc(s["short"])}</h3><p>{esc(s["tag"])}</p></div><span class="arrow-circle" aria-hidden="true">↗</span></div></a>' for s in items)+'</div>'


WORKS=[('full-arch','Implantátumos teljes íves munka','implant','Implantátumos munkák','implantatumra-keszult.html'),('esthetic','ESTHETIC zirkon referencia','zircon','Zirkon','esthetic-anatomikus-zirkon-fogpotlas.html'),('detail','Zirkon fogpótlás — részletek','zircon','Zirkon','esthetic-anatomikus-zirkon-fogpotlas.html'),('dentures','3D-nyomtatott fogsor','other','Egyéb munkák','munkaink.html')]


def gallery(works=WORKS, filters=False):
    result=''
    if filters:
        result='<div class="filters" role="group" aria-label="Referenciák szűrése">'+''.join(f'<button class="filter" data-filter="{key}" aria-pressed="{str(i==0).lower()}">{label}</button>' for i,(key,label) in enumerate([('all','Összes'),('zircon','Zirkon'),('implant','Implantátumos munkák'),('other','Egyéb munkák')]))+'</div><p class="gallery-count" id="gallery-count" role="status">4 referencia a válogatásban</p>'
    cards=[]
    for key,title,category,label,href in works:
        a=ASSETS[key]
        cards.append(f'<article class="work" data-category="{category}"><figure><button data-image="{a["src"]}" data-alt="{esc(a["alt"],quote=True)}" data-title="{esc(title,quote=True)}" data-source="{esc(a["source"],quote=True)}" aria-label="{esc(title,quote=True)} nagyítása">{img(key)}<span aria-hidden="true">＋</span></button></figure><h3>{esc(title)}</h3><p>{esc(label)} · <a href="{href}">Részletek ↗</a></p></article>')
    return result+'<div class="gallery-grid">'+''.join(cards)+'</div>'


def contact_form():
    topics=[('general','Általános együttműködés')]+[(s['topic'],s['short']) for s in ALL_SERVICES]+[('patient','Páciensként érdeklődöm')]
    options=''.join(f'<option value="{key}">{esc(label)}</option>' for key,label in topics)
    return f'''<form class="contact-form" id="urlap" data-contact-form><p class="demo-note">Űrlap-látványterv: a próba nem küld és nem ment adatot. Kérjük, ne adjon meg valódi személyes vagy páciensadatot.</p><div class="form-grid"><label class="field">Név *<input autocomplete="off" required maxlength="120" placeholder="Név"></label><label class="field">E-mail *<input type="email" autocomplete="off" required maxlength="180" placeholder="nev@pelda.hu"></label><label class="field">Telefonszám<input type="tel" autocomplete="off" maxlength="30" placeholder="+36"></label><label class="field" data-company>Rendelő / cég<input autocomplete="off" maxlength="160" placeholder="Nem kötelező"></label><label class="field full">Miben segíthetünk?<select>{options}</select></label><label class="field full">Üzenet<textarea maxlength="2000" placeholder="Röviden írja le, miben segíthetünk."></textarea></label><label class="check full"><input type="checkbox" data-callback><span>Visszahívást kérek. Ebben az esetben a telefonszám kitöltése szükséges.</span></label><label class="check full"><input type="checkbox" required><span>Megismertem az <a href="jogi-oldalak.html#adatkezeles">adatkezelési tájékoztató tervezett helyét</a>. Ez a jelölőnégyzet a látványterv része.</span></label></div><button type="button" class="btn" data-demo-submit>Üzenet elküldése — próba <span aria-hidden="true">↗</span></button><p class="form-output" role="status" tabindex="-1"></p></form>'''


def contact_section(title='Beszéljünk a következő munkáról.'):
    return f'''<section class="section soft"><div class="wrap contact-grid"><div><p class="eyebrow">Közvetlen kapcsolat</p><h2>{esc(title)}</h2><p class="muted">Kérdése van egy fogpótlásról, technológiáról vagy a közös munkáról? Keresse a MeshDent csapatát.</p><div class="contact-details"><div><small>Szabó Richárd</small><a href="tel:+36703619962">+36 70 361 9962 ↗</a></div><div><small>Buczi János</small><a href="tel:+36703534000">+36 70 353 4000 ↗</a></div><div><small>E-mail</small><a href="mailto:meshdentkft@gmail.com">meshdentkft@gmail.com ↗</a></div><div><small>Labor</small><address>1139 Budapest, Petneházy u. 14.</address></div></div></div>{contact_form()}</div></section>'''


STEPS=[('Digitális lenyomat','A folyamat intraorális szkenneléssel indul a rendelőben.'),('Ellenőrzés és továbbítás','A digitális adatok a MeshDent laborba kerülnek.'),('CAD-tervezés','A fogpótlás formája digitális tervezőszoftverben készül.'),('Gyártás','A tervezett munka digitális gyártási folyamaton halad át.'),('Egyedi kidolgozás','A munkatípusnak megfelelő leplezés vagy festés következik.'),('Kiszállítás','Az elkészült fogpótlás a rendelőbe kerül.')]
steps='<ol class="steps">'+''.join(f'<li><span class="step-num">0{i}</span><h3>{title}</h3><p>{text}</p></li>' for i,(title,text) in enumerate(STEPS,1))+'</ol>'
benefits=[('Egyszerű adatátadás','A digitális lenyomat közvetlenül továbbítható a laborba.'),('Egyeztethető tervek','A rendelő és a labor közösen pontosítja a fogpótlás részleteit.'),('Közvetlen kapcsolat','A tervezés és a készítés során a MeshDent csapatával egyeztethet.')]
benefit_html=''.join(f'<div><span aria-hidden="true">↗</span><h3>{title}</h3><p>{text}</p></div>' for title,text in benefits)
technology=f'''<section class="section soft"><div class="wrap"><div class="section-head"><div><p class="eyebrow">Digitális technológiák</p><h2>A rendelő és a labor között.</h2></div><p class="muted">Két külön megoldás, saját munkafolyamattal. Ismerje meg az OXO szolgáltatást és a Freedom Air eszközt.</p></div><div class="technology"><article class="tech white"><p class="eyebrow">Implantátumpozíció-meghatározás</p><h3>OXO technológia</h3><p>Extraorális adatfelvétel a digitális fogpótlástervezéshez, rendelői együttműködésben.</p>{img('oxo')}{link('oxo-implant-service.html','Az OXO szolgáltatás')}</article><article class="tech"><p class="eyebrow">Intraorális szkennelés és fotogrammetria</p><h3>Freedom Air</h3><p>Ismerje meg a meglévő Freedom Air ajánlatot, a bemutató és a kihelyezés lehetőségét.</p>{img('freedom')}{link('FreedomaAir.html','A Freedom Air oldala')}</article></div></div></section>'''
service_rows=[]
for i,s in enumerate(ALL_SERVICES,1):
    a=ASSETS[s['image']]
    service_rows.append(f'<a class="h-service-row" href="{s["slug"]}.html" data-service-image="{a["src"]}" data-service-alt="{esc(a["alt"],quote=True)}" data-service-title="{esc(s["short"],quote=True)}"><span>0{i}</span><h3>{esc(s["short"])}</h3><span aria-hidden="true">↗</span></a>')
fallback='data:image/svg+xml;base64,'+base64.b64encode((BASE/'prototype/dental-arch-fallback.svg').read_bytes()).decode()
home=(BASE/'homepage-v2.html').read_text().replace('{{DENTAL_FALLBACK}}','<img src="'+fallback+'" width="640" height="510" alt="">').replace('{{BENEFITS}}',benefit_html).replace('{{SERVICES}}',''.join(service_rows)).replace('{{GALLERY}}',gallery(WORKS[:3])).replace('{{CONTACT}}',contact_section('Kapcsolat a laborral.'))

page('index','Digitális fogtechnika Budapesten.','MeshDent digitális fogtechnikai labor Budapesten. Digitális tervezés, cirkon koronák, implantátumos fogpótlások és rendelő–labor együttműködés.',home,'/','digitális fogtechnika Budapest; fogtechnikai labor','Kapcsolatfelvétel',schema='Organization; WebSite; WebPage')

light_services=[]
for i,s in enumerate(ALL_SERVICES,1):
    light_services.append(f'<a class="l-service-card" href="{s["slug"]}.html"><div class="l-card-top"><span>0{i}</span><span aria-hidden="true">↗</span></div><h3>{esc(s["short"])}</h3><p>{esc(s["tag"])}</p>{img(s["image"])}</a>')
light_steps=''.join(f'<li><span>0{i}</span><h3>{esc(title)}</h3><p>{esc(text)}</p></li>' for i,(title,text) in enumerate(STEPS,1))
light=(BASE/'homepage-light.html').read_text().replace('{{FAMILY}}',img('family',True)).replace('{{JOY}}',img('joy')).replace('{{SERVICES}}',''.join(light_services)).replace('{{STEPS}}',light_steps).replace('{{GALLERY}}',gallery(WORKS[:3]))
page('vilagosabb','Világos változat — Digitális fogtechnika Budapesten','A MeshDent világos, barátságos főoldalváltozata. Digitális fogtechnika Budapesten, fogpótlások és személyes szakmai együttműködés.',light,'/vilagosabb','alternatív főoldalterv','Kapcsolatfelvétel','Külön látványváltozat; az eredeti főoldal megmarad.',index='noindex, nofollow')

concept_tech=f'''<div class="v-technologies"><article class="v-tech"><div><p class="v-eyebrow">OXO / SZOLGÁLTATÁS</p><h3>Implantátumok<br>digitális helyzete.</h3><p>Extraorális implantátumpozíció-meghatározás, a rendelő és a labor együttműködésében.</p>{link('oxo-implant-service.html','Az OXO szolgáltatás','v-link')}</div>{img('oxo')}</article><article class="v-tech"><div><p class="v-eyebrow">FREEDOM AIR / ESZKÖZ</p><h3>Digitális<br>adatfelvétel.</h3><p>Intraorális szkennelés és fotogrammetria. Ismerje meg a meglévő Freedom Air oldalt.</p>{link('FreedomaAir.html','A Freedom Air oldala','v-link')}</div>{img('freedom')}</article></div>'''
concept_contact='''<div class="v-contact-bottom"><div><p>Új munka vagy szakmai kérdés? Keresse közvetlenül a MeshDent csapatát.</p><a class="v-button" href="kapcsolat.html">Kapcsolatfelvétel <span aria-hidden="true">↗</span></a></div><div class="v-contact-links"><div><small>Szabó Richárd</small><a href="tel:+36703619962">+36 70 361 9962</a></div><div><small>Buczi János</small><a href="tel:+36703534000">+36 70 353 4000</a></div><div><small>E-mail</small><a href="mailto:meshdentkft@gmail.com">meshdentkft@gmail.com</a></div></div></div>'''
process_services=''.join(f'<a class="v-service-row" href="{s["slug"]}.html"><span>0{i}</span><div><h3>{esc(s["short"])}</h3><p>{esc(s["tag"])}</p></div><span aria-hidden="true">↗</span></a>' for i,s in enumerate(ALL_SERVICES,1))
connected_services=''.join(f'<a class="c-service-card" href="{s["slug"]}.html"><div class="c-service-top"><span>0{i}</span><span aria-hidden="true">↗</span></div><h3>{esc(s["short"])}</h3><p>{esc(s["tag"])}</p></a>' for i,s in enumerate(ALL_SERVICES,1))
for filename,template,title,service_content in [
    ('folyamat','homepage-process.html','A szkenneléstől a kész fogpótlásig',process_services),
    ('osszekapcsolva','homepage-connected.html','Rendelő és labor, összekapcsolva',connected_services),
]:
    concept=(BASE/template).read_text().replace('{{SERVICES}}',service_content).replace('{{TECHNOLOGIES}}',concept_tech).replace('{{GALLERY}}',gallery(WORKS[:3])).replace('{{CONTACT}}',concept_contact)
    page(filename,title,'Digitális fogtechnika Budapesten. '+title+'. MeshDent főoldalváltozat, saját referenciákkal és közvetlen szakmai együttműködéssel.',concept,'/'+filename,'alternatív főoldalterv','Kapcsolatfelvétel','Önálló látványváltozat, az eredeti oldalak mellett.',index='noindex, nofollow')

for s in ALL_SERVICES:
    blocks=''.join(f'<div class="copy-block"><h2>{esc(title)}</h2><p>{esc(text)}</p></div>' for title,text in s['blocks'])
    faq=''.join(f'<details><summary>{esc(q)}</summary><p>{esc(a)}</p></details>' for q,a in s['faq'])
    body=subhero(s['title'],s['intro'],s['image'],s['tag'],topic=s['topic'])
    body+=f'<section class="section soft"><div class="wrap text-columns"><aside class="side-note"><p class="eyebrow">MeshDent labor</p><h3>Személyes egyeztetés, digitális alapokon.</h3><p>Az adott munka, a szükséges adatok és az együttműködés részletei közös egyeztetéssel indulnak.</p>{link(contact_link(s["topic"]),"Kapcsolat a laborral")}</aside><div class="copy">{blocks}</div></div></section>'
    body+=f'<section class="section wrap"><div class="faq"><p class="eyebrow">Gyakori kérdések</p><h2>A közös munka előtt.</h2>{faq}</div></section>'+cta_band(topic=s['topic'])
    related=[x for x in ALL_SERVICES if x['slug']!=s['slug']][:3]
    body+=f'<section class="section wrap"><div class="section-head"><h2>További szolgáltatásaink.</h2></div>{service_cards(related)}</section>'
    page(s['slug'],s['title'],s['description'],body,'/'+s['slug']+'/',s['intent'],'Szakmai egyeztetés',s['review'],'Service; WebPage; BreadcrumbList')

about=subhero('Digitális szemlélet. Személyes együttműködés.','A MeshDent Kft. budapesti digitális fogtechnikai labor. Implantátumon és saját fogakon rögzülő fogpótlásokkal, digitális tervezéssel és gyártással támogatjuk a rendelők munkáját.','detail','A MeshDent labor')
about+='''<section class="section soft"><div class="wrap text-columns"><div><p class="eyebrow">Rólunk</p><h2>Technológia és egyedi részletek.</h2></div><div class="copy"><div class="copy-block"><h2>A labor szemlélete</h2><p>A MeshDent létrehozásának alapja a fogtechnika és az innováció iránti elkötelezettség. Az egyedi igényekhez igazított megoldások és a digitális technológiák alkalmazása a jelenlegi bemutatkozás központi elemei.</p></div><div class="copy-block"><h2>Digitális tervezés és gyártás</h2><p>Implantátumon és saját fogon rögzülő pótlások, egyedi kidolgozás és közvetlen rendelő–labor kommunikáció. A cél az esztétikus, az adott feladathoz illő fogpótlás kialakítása.</p></div><div class="copy-block"><h2>A közös munka alapja</h2><p>A szükséges adatokat, a tervezési szempontokat és a részleteket a rendelővel egyeztetjük. A teljes íves munkáknál a végleges pótlás előtti próba teret ad az észrevételeknek.</p></div></div></div></section>'''+contact_section()
page('rolunk','Digitális szemlélet. Személyes együttműködés.','Ismerje meg a MeshDent budapesti digitális fogtechnikai labort. Fogpótlások, digitális tervezés és gyártás, személyes szakmai együttműködéssel.',about,'/rolunk/','MeshDent labor; MeshDent Budapest','Kapcsolat a laborral','Csapatfotók, képesítések és történeti dátumok igazolása.','AboutPage; Organization; BreadcrumbList')

workpage=breadcrumb('Munkáink')+'<section class="intro wrap"><p class="eyebrow">MeshDent / Referenciák</p><h1>A részletekben látszik a munkánk.</h1><p class="lead">Válogatás a labor saját fogpótlásaiból. A formák, a felületek és az egyedi kidolgozás közelről.</p></section><section class="section wrap line-top">'+gallery(filters=True)+'</section>'+cta_band()
page('munkaink','A részletekben látszik a munkánk.','A MeshDent fogtechnikai referenciái: saját zirkon és implantátumos fogpótlások, közeli részletfotók és kapcsolódó szolgáltatások.',workpage,'/munkaink/','MeshDent referenciák; zirkon fogpótlás képek','Szolgáltatás / kapcsolat','Négy kép a prototípusban; végleges induló válogatás 12–18.','CollectionPage; BreadcrumbList')

logos=''.join(f'<div class="logo-tile">{img(key)}</div>' for key in ['nobel','medit','medentika','exocad','dentaltechnika','3shape'])
partners=breadcrumb('Partnereink')+'<section class="intro wrap"><p class="eyebrow">Szakmai kapcsolatok</p><h1>Partnereink.</h1><p class="lead">A MeshDent jelenlegi partneroldalán bemutatott vállalatok és technológiák.</p></section><section class="section wrap line-top"><div class="logo-grid">'+logos+'</div></section>'+cta_band('Kapcsolódjunk szakmailag.')
page('partnereink','Partnereink','A MeshDent partneroldala. Ismerje meg a bemutatott szakmai kapcsolatokat és technológiákat, vagy lépjen kapcsolatba a digitális laborral.',partners,'/partnereink/','MeshDent partnerek','Kapcsolat','Partnerlista, kapcsolatjelleg és videók aktualitása.','CollectionPage; BreadcrumbList')

contact=breadcrumb('Kapcsolat')+'<section class="intro wrap"><p class="eyebrow">MeshDent / Budapest</p><h1>Közvetlenül a laborral.</h1><p class="lead">Egy új munkáról, egy technológiáról vagy az együttműködésről kérdezne? Elérhetőségeinket itt találja.</p></section>'+contact_section()+f'<section class="section wrap"><div class="section-head"><div><p class="eyebrow">Megközelítés</p><h2>Budapest, XIII. kerület.</h2><p class="muted">1139 Budapest, Petneházy u. 14.</p></div>{link("https://www.google.com/maps/search/?api=1&query=MeshDent+1139+Budapest+Petneh%C3%A1zy+14","Megnyitás a térképen")}</div></section>'
page('kapcsolat','Közvetlenül a laborral.','MeshDent kapcsolat: 1139 Budapest, Petneházy u. 14. Szabó Richárd és Buczi János elérhetőségei, e-mail és szakmai érdeklődés a labor felé.',contact,'/kapcsolat/','MeshDent elérhetőség; fogtechnikai labor Budapest XIII','Érdeklődés elküldése','Általános CRM-form és fogadó címek véglegesítése.','ContactPage; Organization; BreadcrumbList')

patient=subhero('Digitális lenyomatvétel a fogpótlásához.','Az OXO technológia az implantátumok helyzetének digitális rögzítését támogatja. Ismerje meg a folyamatot, és egyeztessen a lehetőségekről a kezelő fogorvosával.','oxo','Tájékoztatás pácienseknek','Tájékoztatást kérek','patient')
patient+='''<section class="section soft"><div class="wrap text-columns"><div><p class="eyebrow">A folyamat</p><h2>Érthetően, lépésről lépésre.</h2></div><div class="copy"><div class="copy-block"><h2>Adatfelvétel a fogpótlás tervezéséhez</h2><p>A rendelőben az implantátumokhoz kapcsolódó jelölők segítségével digitálisan rögzítik azok helyzetét. Ezek az adatok a labor tervezési munkáját segítik.</p></div><div class="copy-block"><h2>Egyeztetés a kezelőorvossal</h2><p>A személyes helyzethez illő fogpótlásról és a kezelés menetéről a kezelő fogorvos tud tájékoztatást adni. A MeshDent a digitális fogtechnikai munkafolyamatban vesz részt.</p></div><div class="copy-block"><h2>Helyszín és időpont</h2><p>Az aktuálisan elérhető helyszínekről és az egyeztetés menetéről keressen bennünket. A kapcsolatfelvételnél jelezze, hogy páciensként érdeklődik.</p></div></div></div></section>'''+cta_band('Tájékozódjon a lehetőségekről.','patient')
page('extraoralis-scanner-fogpotlas','Digitális lenyomatvétel a fogpótlásához.','Közérthető tájékoztatás az OXO digitális implantátumpozíció-rögzítésről. A fogpótlástervezés folyamata és kapcsolat a MeshDent laborral.',patient,'/extraoralis-scanner-fogpotlas/','digitális lenyomat implantátumhoz; OXO páciens','Tájékoztatás / visszahívás','Aktuális helyszínek, visszahívási folyamat véglegesítése.','WebPage; BreadcrumbList')

insta=breadcrumb('Instagram')+f'<section class="intro wrap"><p class="eyebrow">@meshdent_lab_budapest</p><h1>A labor munkái képekben.</h1><p class="lead">Részletek a MeshDent saját bejegyzéseiből. A képeknél az eredeti Instagram-bejegyzés is megnyitható.</p><div class="buttons">{link("https://www.instagram.com/meshdent_lab_budapest/","Instagram-profil","btn")}</div></section><section class="section wrap line-top">'+gallery()+'</section>'+cta_band()
page('insta','A labor munkái képekben.','Válogatás a MeshDent Instagram-bejegyzéseiből: fogpótlások, referenciamunkák és részletfotók eredeti forráshivatkozással.',insta,'/insta/','márkakeresés; közösségi tartalmak','Instagram / Munkáink','Végleges válogatás dátummal; nem élő feed.','CollectionPage','noindex, follow')

freedom='<div class="wrap section"><p class="lead">A <a href="https://meshdent.vercel.app/" style="text-decoration:underline;overflow-wrap:anywhere">https://meshdent.vercel.app/</a> oldal kerül át ide egy az egyben.</p></div>'
page('FreedomaAir','Freedom Air','A https://meshdent.vercel.app/ oldal kerül át ide egy az egyben.',freedom,'/FreedomaAir','Freedom Air','Meglévő oldal megnyitása','Változatlan oldalátvétel.',chrome=False)

legal=breadcrumb('Jogi oldalak terve')+'''<section class="intro wrap"><p class="eyebrow">Tervezési melléklet</p><h1>A jogi oldalak helye.</h1><p class="lead">Ez a lap az új honlap jogi tartalmainak szerkezetét mutatja. Nem kész adatkezelési tájékoztató vagy érvényes jogi dokumentum.</p></section><section class="wrap section line-top"><article class="legal-section" id="adatkezeles"><h2>Adatkezelés · /adatkezeles/</h2><p>Adatkezelő és kapcsolattartás; űrlaptípusok célja és jogalapja; kezelt mezők, megőrzési idők; CRM és n8n adatfeldolgozás; érintetti jogok; analitika, hirdetési mérés és adattovábbítás. A tényleges konfiguráció és cégadatok alapján véglegesítendő.</p></article><article class="legal-section" id="sutik"><h2>Sütikezelés · /sutik/</h2><p>Szükséges, analitikai és marketingkategória; valós szolgáltató- és sütileltár; a hozzájárulás módosítása és visszavonása. Az éles Consent Mode v2 és Meta/CAPI működésével egyező leírás szükséges.</p></article><article class="legal-section" id="impresszum"><h2>Impresszum · /impresszum/</h2><p>MeshDent Kft. és ellenőrzött hivatalos cégadatok; kapcsolattartás és tárhelyszolgáltató. Adószámot, cégjegyzékszámot vagy nyitvatartást nem pótolunk feltételezéssel.</p></article><article class="legal-section"><h2>Köszönőoldalak és hibák</h2><p>A /koszonjuk/ és /FreedomaAir/koszonjuk csak visszaigazolt rögzítés után ad sikerjelzést; az URL nem tartalmaz személyes adatot. Noindex, sitemapből kizárva. A hiányzó oldalak valódi HTTP 404 választ kapnak.</p></article></section>'''
page('jogi-oldalak','A jogi oldalak helye.','Jogi oldalak és technikai visszajelzések tervezett szerkezete.',legal)

rows=''.join(f'<tr><td><a href="{p["prototype"]}">{esc(p["route"])}</a></td><td>{esc(p["h1"])}</td><td>{esc(p["primary_cta"])}</td><td>{esc(p["open_content_item"] or "Tartalmi átültetés a forrásból")}</td></tr>' for p in ROUTES)
overview=f'''<section class="intro wrap"><p class="eyebrow">MeshDent / Teljes honlapterv / 01</p><h1>Digitális fogtechnika.<br>Átgondolt megjelenés.</h1><p class="lead">A meglévő tartalom és a saját referenciák új vizuális rendszerben. Nyissa meg az oldalakat, próbálja ki a menüt, a galériát és az űrlap visszajelzését.</p><div class="buttons">{link('index.html','A főoldal látványterve','btn')}{link('../TELJES-HONLAPTERV.md','Részletes honlapterv')}{link('../oldalterv.csv','SEO- és oldalterv CSV')}</div><div class="plan-intro"><p><strong>Mit mutat ez a prototípus?</strong> A fő honlap 13 oldalának szerkesztett látványtervét és a Freedom Air külön illesztési tervét. Az űrlap helyi próba; nincs adatküldés, mérés vagy telepítés. A jogi oldalak helye vázlat. A végleges hosszú tartalmakat a forrásarchívumból ültetjük át.</p></div><div class="plan-list"><article><h3>01 / Megőrzött felépítés</h3><p>A főoldal bemutatkozás, folyamat, előnyök, szolgáltatások és kapcsolat sorrendje tovább él. Minden jelenlegi tartalmi URL kap helyet.</p></article><article><h3>02 / Saját képek</h3><p>A MeshDent referenciái vezetik a látványt. A képválogatás forrással és változatlan archív fájlokkal készült.</p></article><article><h3>03 / Külön érdeklődői utak</h3><p>Általános labor-együttműködés, OXO, páciens és Freedom Air. A CRM-ben is külön besorolást kapnak.</p></article><article><h3>04 / Keresés és mérés</h3><p>Szerveroldali tartalom, megőrzött URL-ek, egyedi metadata, hitelesített leadesemény és hozzájárulásra épülő analitika.</p></article></div></section><section class="section wrap line-top"><p class="eyebrow">Kattintható oldaljegyzék</p><h2>A teljes oldalszerkezet.</h2><div class="table-scroll"><table class="plan-table"><thead><tr><th>Tervezett útvonal</th><th>Oldal</th><th>Fő művelet</th><th>Véglegesítés</th></tr></thead><tbody>{rows}</tbody></table></div><div class="buttons">{link('jogi-oldalak.html','Jogi és technikai oldalak terve')}{link('../ELLENORZES.md','Ellenőrzési jegyzék')}</div></section>'''
page('terv','MeshDent — a teljes új honlap terve','MeshDent oldaljegyzék, vizuális koncepció és megvalósítási terv.',overview)

with (BASE/'oldalterv.csv').open('w',newline='') as f:
    writer=csv.DictWriter(f,fieldnames=list(ROUTES[0]));writer.writeheader();writer.writerows(ROUTES)
(BASE/'oldalterv.json').write_text(json.dumps(ROUTES,ensure_ascii=False,indent=2)+'\n')
(BASE/'kepvalogatas.json').write_text(json.dumps(SELECTION,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'pages':len(list(OUT.glob('*.html'))),'content_routes':len(ROUTES),'assets':len(SELECTION),'asset_bytes':sum((OUT/x['src']).stat().st_size for x in ASSETS.values())},indent=2))
