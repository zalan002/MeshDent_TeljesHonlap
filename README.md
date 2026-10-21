# MeshDent_TeljesHonlap

A MeshDent teljes honlapjának megújítási projektje.

## Webes előnézet

- [Új főoldal és bejárható aloldalak](https://meshdentteljeshonlap.vercel.app/)
- [Teljes látványterv oldalválasztóval és mobilnézettel](https://meshdentteljeshonlap.vercel.app/latvanyterv)
- [Oldaljegyzék és részletes terv](https://meshdentteljeshonlap.vercel.app/terv)
- [Letölthető tervcsomag](artifacts/MeshDent-honlapterv-2026-10-21-v3.zip)

A Vercel-projekt neve `meshdent_teljeshonlap`, a telepítési ág `main`. A `vercel.json` a `node scripts/build-preview.mjs` parancsot futtatja, és kizárólag a `dist/` mappát publikálja. A buildhez nincs külső csomag vagy titkos környezeti változó.

A főcímen közvetlenül a főoldal jelenik meg. A `/latvanyterv` az oldalválasztós áttekintő; a `/FreedomaAir` jelenleg a meglévő landing átvételének terve. Minden útvonal előnézeti, keresőindexelés nélkül. Az űrlapok próbaűrlapok.

## Jelenlegi fázis: teljes honlapterv és látványterv

- [Egy fájlból megnyitható, interaktív látványterv](design/2026-10-21/MeshDent-latvanyterv.html) — 02-es főoldalkoncepció, 16 fogas, anatómiai részletekkel kidolgozott fogívgrafika, három kameraállás, asztali/mobil nézet, oldalválasztó és saját képek.
- [Az új főoldal vizuális és mozgási terve](design/2026-10-21/FOOLDAL-02.md).
- [Teljes honlapterv](design/2026-10-21/TELJES-HONLAPTERV.md) — oldalszerkezet, megjelenés, tartalom, CRM, Google-mérés, SEO és AI-keresés.
- [Oldalankénti SEO-terv](design/2026-10-21/oldalterv.csv) és [képválogatás](design/2026-10-21/kepvalogatas.json).
- [Ellenőrzések és a prototípus határa](design/2026-10-21/ELLENORZES.md).

A látványterv weben és helyben is kipróbálható. A fő honlap 13 oldalához készültek szerkesztett tervezési változatok; a Freedom Air külön illesztési lapot kapott. Az űrlappróba nem küld vagy ment adatot. A meglévő Freedom Air landing átemelése és az éles integrációk a megvalósítási szakasz feladatai.

## Forrásgyűjtés

A jelenlegi `meshdent.hu` szerkezete és tartalma adja a teljes honlap alapját. A meglévő `zalan002/Meshdent` Freedom Air-oldal a **`/FreedomaAir`** útvonalra kerül majd, megőrzött megjelenéssel és CRM-folyamattal.

- [Kutatási összefoglaló](research/2026-10-21/KUTATASI-OSSZEFOGLALO.md)
- [Helyben megnyitható, kereshető médiatár](research/2026-10-21/media-library.html)
- [CRM-, mérési és SEO-követelmények](research/2026-10-21/TECHNIKAI-ES-MERESI-TERV.md)
- [Pontosítandó adatok](research/2026-10-21/ELLENORIZENDO-ADATOK.md)
- [Média-forrásjegyzék](research/2026-10-21/manifests/media-catalog.csv)
- [Importált Instagram-forrásjegyzék, önálló HTML](research/2026-10-21/instagram-forrasjegyzek.html)
- [Instagram-import eredménye és hiányzó videó](research/2026-10-21/INSTAGRAM-IMPORT.md)
- [Oldalankénti tartalmak](research/2026-10-21/content/)

A repó tartalmazza a gyűjtött forrásmédiát, a tartalmi jegyzékeket és a tervezési fájlokat. A nyers hálózati válaszdumpok és a korábbi, ismétlődő ZIP-csomagok helyben maradnak. A médiatár a teljes helyi projektmappával együtt használható; csak a HTML-fájl átmásolása nem viszi magával a képeket. A Vercel webes előnézetébe a kiválasztott prototípus és annak képei kerülnek.

## Gyűjtési korlátok

13 weboldal, 84 weboldali képmásolat, 49 különböző Freedom Air-médiafájl és 1 Instagram profilbélyegkép mellett a felhasználó által feltöltött Instagram-archívumot is feldolgoztuk: **168 bejegyzés metaadatai és képaláírásai, 182 fotó és 1 Reels-borítókép**. Egy teljes Reels-videófájl még hiányzik. A katalógusban 317 média-előfordulás, 316 különböző fájltartalom szerepel. A webes képek közvetítőn keresztül mentett, újrakódolt másolatok; a repófájlok és az átvett Instagram-képek bájtazonosak a bemeneti fájlokkal. Az Instagram-képek a platform által kiszolgált változatok, nem a feltöltés előtti eredetik.

## Kutatási eszközök

- `scripts/collect_meshdent.py`: a mentett WordPress oldal-/médialistából gyűjt; a nyers kezdőforrásokat a kutatási `raw/` mappából olvassa. Nem küld űrlapot, nem módosít külső rendszert.
- `scripts/build_research_catalog.py`: duplikált repómédia kiszűrése, HTML-katalógus és CSV/JSON leltárak előállítása.
- `scripts/import_instagram.py`: feltöltött ZIP és HTML egyeztetése, képek SHA-256/méret/felbontás ellenőrzése, bejegyzés- és médialeltár importálása.
- Python-függőségek: `lxml`, `Pillow`. A PDF-szövegkinyeréshez `pdftotext`, a videóleltárhoz `ffprobe` használható.

A terv és a statikus látványprototípus a `design/2026-10-21/` mappában található. A Vercel a látványprototípust szolgálja ki; az éles integrációkat tartalmazó honlap még nincs megvalósítva.

Helyi webes build:

```bash
node scripts/build-preview.mjs
```

A tervezési források módosítása után, a generált HTML-ek frissítéséhez:

```bash
node design/2026-10-21/verify_dental_arch.mjs
node design/2026-10-21/build_dental_fallback.mjs
python design/2026-10-21/build_prototype.py
python design/2026-10-21/build_standalone.py
node scripts/build-preview.mjs
```
