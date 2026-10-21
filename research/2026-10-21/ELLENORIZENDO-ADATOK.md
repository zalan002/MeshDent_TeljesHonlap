# Pontosítandó adatok és hiányzó források

Ezek a gyűjtés közben talált konkrét eltérések. Nem akadályozzák a honlap szerkezetének és megjelenésének tervezését; a végleges szövegezéshez, mérésekhez és publikáláshoz szükségesek.

| Téma | Megfigyelés | Következő lépés |
|---|---|---|
| Kapcsolati e-mail | Fő honlap + Instagram: `meshdentkft@gmail.com`; Freedom Air köszönőoldal: `hello@meshdent.hu` | Megerősíteni, melyik legyen az egységes nyilvános cím, illetve működik-e mindkettő |
| Freedom Air pontosság | Landing: általános 10 µm; mellékelt DOF-jelentés: PIM átlagos távolsági eltérés 13,4 µm; IOS átlagos trueness 12/18/21 µm a single/quadrant/full-arch vizsgálatban | A 10 µm állítást megfelelő mérési feltételekkel és forrással igazolni, vagy pontosítani; a mért mennyiségek nem felcserélhetők |
| Freedom Air szkennelési mélység | Landing: 30 mm; a mentett 2025-ös brosúra műszaki táblázata: 25 mm | Aktuális gyártói verzió/adatlap alapján tisztázni; lehet dokumentumverzió-eltérés, ezért nem írtuk felül automatikusan |
| Tipméretek megnevezése | A brosúrában 18,5 × 15 mm és 10 × 9 mm a látómező, míg a külső tipméretek 25 × 19,9 és 16,3 × 13,5 mm | A mérettáblázat és FAQ címkézése különböztesse meg a látómezőt a fizikai tipmérettől |
| Jegyzőkönyv megnevezése | FAQ: „független akkreditált mérési jegyzőkönyv”; a mentett PDF DOF PM, 2025.12. jelölésű, első oldalán CONFIDENTIAL | A gyűjtött dokumentum önmagában nem igazolja a független akkreditált minősítést. Bekérni az erre szolgáló külön dokumentumot, ha van |
| PDF közzététele | A CONFIDENTIAL jelölésű jelentés a meglévő repó `public/brochures/` mappájában is szerepel | Az új nyilvános honlapra emelés előtt a megosztható változatot tisztázni; a gyűjtésben megőriztük, nem publikáltuk |
| OXO és Freedom Air | Régi OXO-oldal: 5 mikron; Freedom Air: más eszköz, eltérő adatok | Külön szolgáltatás-/termékazonosság; az OXO-ígéret ne kerüljön át automatikusan a Freedom Airhez |
| Szolgáltatási ígéretek | „24 óra”, „ingyenesen”, „garantált”, „hibátlan” szerepel a régi oldalakon | A tényleges feltételek és érvényesség ellenőrzése; a kutatási másolat nem friss ajánlat |
| Instagram-archívum | Importálva: 168 bejegyzés, 182 fotó és 1 Reels-borítókép; minden kép ellenőrizve | A `C8eNCOsJ6Rx` azonosítójú, 2024-06-21-i Reel teljes videófájlja még hiányzik; a borító és a szöveg megvan. Az Instagram-képek platformváltozatok, nem a feltöltés előtti eredetik |
| Eredeti arculati fájlok | A weboldali logó kicsi; 2 partner-SVG-ből csak raszteres másolat van | Eredeti MeshDent és partnerlogók SVG/AI/PDF formátumban |
| Saját vizuális anyagok | Régi referenciák és stock anyagok rendelkezésre állnak | Friss csapat-, labor- és eszközfotók, nagy felbontású eredetik, rövid munkafolyamat-videók |
| Régi Vimeo | A `794036895` beágyazás 404-et adott a gyűjtéskor | Tulajdonosi lejátszhatóságellenőrzés vagy új videófájl |
| YouTube partnerbeágyazások | A két URL ismert, metaadatukhoz proxytiltás miatt nem jutottunk hozzá | Ellenőrizni a címeket, aktualitást és azt, hogy szükségesek-e az új partneroldalon |
| Régi kapcsolatfelvétel | Contact Form 7 frontend azonosítható, a háttérfeldolgozás nem | A fogadó e-mail-címek, értesítések és esetleges további integrációk listája |
| CRM | A Freedom Air-mezők és a publikus űrlapszerződés ismertek | A teljes honlap általános és OXO érdeklődőihez külön űrlap-/pipeline-megfeleltetés; ne kapjanak indokolatlanul Freedom Air-címkét |
| Adatkezelés | A landing linkje env-függő; a kód folytatáshoz köti a hozzájárulást | Végleges tájékoztató, ellenőrzött hozzájárulási megoldás és cookie-beállítások |
| Google mérések | Régi HTML-ben `G-8ZCCREN6X4`; GTM-/Ads-azonosítót a gyűjtött kódban nem találtunk | GA4-tulajdon, Ads-kapcsolat, konverziók és Search Console hozzáférésének ellenőrzése a bekötéskor |
| Céges részletek | Nyitvatartás, hivatalos cégadatok, képesítések nincsenek igazolva | Tulajdonosi, hivatalos forrás; kitalált adatok nélkül épülő strukturált adat |

## Műszaki adatforrások

- [DOF-jelentés kinyert szövege](content/freedom-air-documents/freedom-air-accuracy-test.txt): 3. oldal IOS-vizsgálat; 5. oldal PIM-vizsgálat. A nyers PDF a médiatárban elérhető.
- [Freedom Air brosúra szövege](content/freedom-air-documents/freedom-air-brochure.txt): a 145 g-os tömeget a gyártói brosúra is tartalmazza.
- [OXO forrásszöveg](content/oxo-implant-service.md).
- [Meglévő landing forrása](https://github.com/zalan002/Meshdent/blob/bb4a61168b81b97bf99d0fc3889c2dacbede555c/app/page.tsx).

Az eltérések megjelölése nem jelenti a meglévő oldal önkényes átírását. A kért változatlan Freedom Air-megjelenés és a szükséges szakmai pontosítás külön kezelhető.
