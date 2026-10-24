# MeshDent teljes honlap

Az ügyfél által elfogadott főoldal az „Összekapcsolva” nyitását és a „Folyamat” görgetésre képváltó részét egyesíti. A nyilvános honlap nem tartalmaz koncepcióválasztót vagy OXO-tartalmat.

- Honlap: https://meshdentteljeshonlap.vercel.app/
- Teljes DOF Freedom Air landing: https://meshdentteljeshonlap.vercel.app/FreedomaAir
- Kapcsolat: https://meshdentteljeshonlap.vercel.app/kapcsolat

## Fejlesztés

A fő honlap előre generált, önálló HTML-oldalakból áll. A saját CSS/JavaScript kezeli a menüt, képgalériát, munkafolyamatot, CRM-et és a hozzájárulásos mérést. A Freedom Air az eredeti Next.js/React oldal külön, statikus exportja; saját stílusa és médiája megmarad. Nincs távoli beágyazás vagy iframe.

- `site/templates/home.html`: az összeállított főoldal forrása.
- `site/content/`: szolgáltatások, képek és nyilvános integrációs azonosítók.
- `site/build.py`, `site/components.py`: fő honlap generátora.
- `site/static/`: közös stílusok, böngészős működés, CRM-kliens.
- `site/generated/`: generált HTML-ek; a Vercel-buildhez verziókezelve.
- `app/FreedomaAir/`, `components/`, `lib/`: átemelt DOF-oldal és CRM-bekötés.
- `public/`: a DOF-oldal eredeti médiája és saját kiszolgálású betűkészletei.
- `design/2026-10-21/`, `research/2026-10-21/`: megőrzött tervek és forrásarchívum. Nem kerülnek a publikált csomagba.

```bash
npm ci
python site/build.py
npm run typecheck
npm test
npm run build
npm start
```

A Python-generátorhoz Python 3.12 szükséges, külső csomag nem kell. A böngészős ellenőrzőhöz Chromium és Node 24 kell: `node tests/browser-check.mjs`. A teszt minden külső hálózati hívást elfog; valódi leadet és analitikai eseményt nem küld. A helyi szerver a `127.0.0.1:8766` címen indul.

A Vercel `main` ágból, `npm run build` paranccsal épít; a publikált könyvtár `dist`. A telepítési kulcsok és környezeti titkok nincsenek a repóban.

## CRM

Az általános kapcsolatfelvétel a felhasználó által megadott `26ff2dd524be7123e4dd8604c91801d7` publikus formot használja. Mezők: `last_name`, `email`, `phone`, `company`. A `company` ebben az űrlapban **a „Miben segíthetünk?” üzenetet** jelenti. A választott szolgáltatás az üzenet előtagja; nincs kitalált CRM-mező.

A Freedom Air megtartja saját `b3725c8d4d3837fccbae3a3e00873109` formját és mezőit. A részleges mentés a telefonszám és a kifejezett hozzájárulás után történik. Mindkét űrlap a CRM aláírt `submission` + `resume` válaszával egészíti ki ugyanazt az érdeklődést. A végső beküldés bevárja a részleges rögzítést. Egyértelmű mezőhiba javítható; 403 esetén egyszeri tokenfrissítés történik; bizonytalan hálózati hiba után nincs automatikus új beküldés vagy hamis sikerjelzés.

Az általános űrlap a kitöltés végén ment, nem küld adatot gépelés közben. A korábbi Freedom Air n8n/CAPI-mellékágát az új honlap nem hívja: az új oldalon a CRM a rögzítés egyetlen igazolási pontja. Az eredeti külön Vercel-projekt változatlan.

## GA4, Ads és hozzájárulás

A megerősített GA4-azonosító: `G-8ZCCREN6X4`. A Google-kód csak az analitikai hozzájárulás után töltődik be. Alapból minden Consent Mode v2 kategória tiltott; analitika és marketing külön választható, a személyre szabott reklám tiltott marad. A beállítás visszavonható és hat hónap után lejár.

Események: `page_view`, `click_phone`, `click_email`, `generate_lead`. A leadesemény csak sikeres CRM-válasz után keletkezik. A köszönőoldal megnyitása vagy újratöltése nem küld konverziót. Név, e-mail, telefonszám, üzenet és teljes query string nem kerül a mérésekbe.

A Google Ads aktiválásához még a `PUBLIC_ADS_ID` (`AW-…`) és `PUBLIC_ADS_LABEL` szükséges. Ezek együtt kapcsolják be az Ads-kategóriát és a sikeres leadhez tartozó, CRM-azonosítóval deduplikált konverziót. GA4-importot és közvetlen Ads-konverziót ugyanarra a célra ne állítsunk egyszerre elsődlegesre.

## Keresőoptimalizálás és saját domain

Egyedi cím/leírás/canonical/OG, szerverről olvasható HTML, Organization/WebSite/Service/BreadcrumbList/FAQ strukturált adatok, `sitemap.xml`, `robots.txt` és `llms.txt` készül. A Vercel előnézeti címe nem indexelhető. Az `llms.txt` tájékoztató, nem garantál kereső- vagy AI-megjelenést.

A saját domain átállításakor `SITE_URL=https://meshdent.hu` és `SITE_INDEXABLE=true` szükséges új builddel. A régi élő domaint ez a fejlesztés nem módosította. A koncepció-URL-ek az új főoldalra, a megszűnt OXO-URL a DOF-oldalra irányítanak.

## Ellenőrzés és még szükséges üzleti adatok

A 2026-10-24-i ellenőrzés: TypeScript és production build; CRM-protokoll tesztelt sikerrel, 422/403/5xx hibákkal, hiányzó bizonylattal, hálózati bizonytalansággal és kettős beküldéssel; asztali/mobil Chromium-ellenőrzés; képszakaszok, menü, galéria, hozzájárulás, mérés és mindkét űrlap útvonala.

A fejlesztői környezet a CRM éles végpontját hálózati hibával/tiltással utasította el, így az élő CRM-beérkezés nincs igazolva. A böngészőtesztek ellenőrzött CRM-válaszokkal futnak. A GA4 DebugView és Google Ads fiókon belüli konverziódiagnosztika nincs igazolva.

A saját domain élesítése előtt még szükséges: hivatalos cégjegyzékszám/adószám, az adatmegőrzés és a CRM-adatfeldolgozó teljes adatainak véglegesítése, valamint az Ads konverzióazonosító. Ezeket nem pótoltuk feltételezéssel. Az átemelt DOF-oldal műszaki állításai az eredeti forrás szerinti tartalmak; az ismert szakmai adateltérések a kutatási jegyzékben szerepelnek.
