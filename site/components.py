import html
from urllib.parse import quote
esc = html.escape
ASSETS = {}
WORKS = [('full-arch', 'Implantátumos teljes íves munka', 'implant', 'Implantátumos munkák', 'implantatumra-keszult.html'), ('esthetic', 'ESTHETIC zirkon referencia', 'zircon', 'Zirkon', 'esthetic-anatomikus-zirkon-fogpotlas.html'), ('detail', 'Zirkon fogpótlás — részletek', 'zircon', 'Zirkon', 'esthetic-anatomikus-zirkon-fogpotlas.html'), ('dentures', '3D-nyomtatott fogsor', 'other', 'Egyéb munkák', 'munkaink.html')]

def contact_link(topic="general"):
    return "kapcsolat.html?tema="+quote(topic)+"#urlap"

def img(key, priority=False, cls=''):
    x=ASSETS[key]
    loading='fetchpriority="high"' if priority else 'loading="lazy"'
    return f'<img src="{x["src"]}" alt="{esc(x["alt"],quote=True)}" width="{x["width"]}" height="{x["height"]}" {loading} decoding="async" class="{cls}">'

def link(file, text, cls='text-link', suffix=' ↗'):
    return f'<a class="{cls}" href="{esc(file,quote=True)}">{esc(text)}<span aria-hidden="true">{suffix}</span></a>'

def breadcrumb(title):
    return f'<nav class="wrap breadcrumbs" aria-label="Morzsanavigáció"><a href="index.html">Főoldal</a><span aria-hidden="true">/</span><span aria-current="page">{esc(title)}</span></nav>'

def subhero(title,intro,image,eyebrow,cta='Szakmai egyeztetés',topic='general'):
    light=' light' if image in ['freedom','aligner','same-day','layered'] else ''
    return breadcrumb(title)+f'<section class="subhero wrap"><div class="hero-grid"><div class="hero-copy"><p class="eyebrow">{esc(eyebrow)}</p><h1>{esc(title)}</h1><p class="lead">{esc(intro)}</p><div class="buttons">{link(contact_link(topic),cta,"btn")}</div></div><figure class="hero-image{light}">{img(image,True)}</figure></div></section>'

def cta_band(title='Beszéljünk a következő munkáról.',topic='general'):
    return f'<section class="section dark"><div class="wrap cta-band"><div><p class="eyebrow">Kapcsolat a laborral</p><h2>{esc(title)}</h2></div>{link(contact_link(topic),"Kapcsolatfelvétel","btn")}</div></section>'

def service_cards(items):
    return '<div class="service-grid">'+''.join(f'<a class="service-card" href="{s["slug"]}.html">{img(s["image"])}<div class="card-text"><div><h3>{esc(s["short"])}</h3><p>{esc(s["tag"])}</p></div><span class="arrow-circle" aria-hidden="true">↗</span></div></a>' for s in items)+'</div>'

def gallery(works=WORKS, filters=False):
    result=''
    if filters:
        result='<div class="filters" role="group" aria-label="Referenciák szűrése">'+''.join(f'<button class="filter" data-filter="{key}" aria-pressed="{str(i==0).lower()}">{label}</button>' for i,(key,label) in enumerate([('all','Összes'),('zircon','Zirkon'),('implant','Implantátumos munkák'),('other','Egyéb munkák')]))+'</div><p class="gallery-count" id="gallery-count" role="status">4 referencia a válogatásban</p>'
    cards=[]
    for key,title,category,label,href in works:
        a=ASSETS[key]
        cards.append(f'<article class="work" data-category="{category}"><figure><button data-image="{a["src"]}" data-alt="{esc(a["alt"],quote=True)}" data-title="{esc(title,quote=True)}" data-source="{esc(a["source"],quote=True)}" aria-label="{esc(title,quote=True)} nagyítása">{img(key)}<span aria-hidden="true">＋</span></button></figure><h3>{esc(title)}</h3><p>{esc(label)} · <a href="{href}">Részletek ↗</a></p></article>')
    return result+'<div class="gallery-grid">'+''.join(cards)+'</div>'
