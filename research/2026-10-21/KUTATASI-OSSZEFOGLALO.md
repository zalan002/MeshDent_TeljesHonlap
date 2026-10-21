# MeshDent — honlapmegújítási forrásgyűjtés

Gyűjtés: **2026. október 21.** E munkafázis eredménye a tartalmi és technikai leltár, valamint a helyi médiaarchívum. A teljes honlap megvalósítása ezután következik.

## 1. Elkészült anyagok

| Forrás | Összegyűjtve | Minőség / hozzáférés |
|---|---:|---|
| Jelenlegi honlap | 13 közzétett WordPress-oldal | HTML-pillanatkép, szöveg, címek, metaadatok, linkek, űrlapmezők, képhivatkozások |
| WordPress médiatár | 84 kép | 82 raszterkép az eredeti pixelmérettel; 2 SVG raszteres másolata |
| Freedom Air GitHub | 78 média-előfordulás, 49 különböző fájl | Bájtazonos helyi másolatok, SHA-256 szerinti duplikátumkiszűréssel |
| Freedom Air dokumentáció | 3 különböző PDF | Brosúra, casebook, pontossági jelentés; szövegük külön is kinyerve |
| Freedom Air videó | 1 különböző MP4 | 1920 × 1080, H.264, 66,69 másodperc; nincs hangsáv |
| Instagram | 168 bejegyzés; 182 fotó + 1 Reels-borító; profiladatok és 1 profilbélyegkép | Felhasználói ZIP-ből importálva; 1 teljes Reels-videó még hiányzik |
| Külső videóbeágyazások | 3 hivatkozás | 1 Vimeo + 2 YouTube; a videófájlok nem kerültek letöltésre |

Összesen **317 média-előfordulás, 316 különböző fájltartalom**, körülbelül **72,7 MB**: 313 kép-előfordulás, 3 PDF, 1 videó. Egy Instagram-kép két külön bejegyzésben szerepel; mindkét bejegyzés és fájlútvonal megmaradt. A lejátszható videó továbbra is a Freedom Air-repóból származik, az Instagram Reelből csak a borító van meg.

- [Kereshető médiakatalógus](media-library.html)
- [Önálló Instagram-forrásjegyzék](instagram-forrasjegyzek.html)
- [Instagram-import: ellenőrzések és képjavaslatok](INSTAGRAM-IMPORT.md)
- [Oldalankénti tartalmak](content/)
- [Média-forrásjegyzék CSV-ben](manifests/media-catalog.csv)
- [Oldalak SEO-leltára CSV-ben](manifests/pages-seo.csv)
- [Technikai és mérési követelmények](TECHNIKAI-ES-MERESI-TERV.md)
- [Tartalmi eltérések és hiányzó anyagok](ELLENORIZENDO-ADATOK.md)

## 2. Hozzáférési módszer és korlátok

A `meshdent.hu` közvetlen HTTPS-lekérése a környezet hálózati átjárójában tanúsítvány-ellenőrzési hibával meghiúsult. A HTTP-változat HTTPS-re irányít. A honlap HTML-jét és nyilvános WordPress REST-adatait a Jina Reader szolgáltatáson keresztül sikerült lekérni. Ezek **közvetített pillanatképek**: a lekérés dátuma nem azonos a tartalom frissítésének dátumával. A WordPress módosítási időpontjai külön szerepelnek a leltárban.

A képek a forrás-URL-ek alapján a `images.weserv.nl` nyilvános képközvetítő szolgáltatáson keresztül érkeztek. Nem kértünk átméretezést; mind a 82 raszteres forrás pixelmérete egyezik a mentett képpel. A fájlok újrakódolt másolatok, bájtazonosságot az eredeti szerverfájlhoz nem állítunk. A két SVG-ből PNG-másolat készült; a szerkeszthető SVG-eredetik még beszerzendők. Az új honlap saját tárhelyről szolgálja majd ki a kiválasztott képeket.

Az Instagram közvetlen lekérése eredetileg HTTP 401 és `require_login: true` választ adott. Ezt követően a felhasználó feltöltötte a másik chatben elkészült `MeshDent_Instagram_2026-10-21.zip` és `MeshDent_Instagram_forrasjegyzek.html` fájlokat. Ezeket ellenőriztük és importáltuk: 168 bejegyzés adatai, 182 fotó, 1 Reels-borítókép. A külön HTML bájtazonos a ZIP-ben szereplő forrásjegyzékkel. Az összes kép egyezik a kapott SHA-256 ellenőrzőösszeggel, fájlmérettel és felbontással. A gyűjtés élő Instagram-teljességét ebben a chatben nem ellenőriztük újra; a feltöltött jegyzék az elérhető saját bejegyzések teljes listájának mondja a 168 tételt, ami egyezik a korábban kiolvasott profilszámmal. Történetek és mások megjelölt tartalmai nem részei a csomagnak. Az egyetlen Reel teljes videója hiányzik; képaláírása és borítója megvan.

A Vimeo-beágyazás és a lejátszókonfiguráció 404-et adott. A YouTube metaadat-lekéréseit a hálózati proxy 403-mal blokkolta. A beágyazási hivatkozásokat megőriztük; a tartalmuk és újrafelhasználhatóságuk nincs ellenőrizve.

## 3. MeshDent — forrásokkal alátámasztott cégkép

**A jelenlegi honlap bemutatkozása szerint** a MeshDent Kft. budapesti digitális fogtechnikai laboratórium. Fő területe a digitális tervezés és gyártás, az implantátumon és saját fogakon rögzülő fogpótlások, valamint az All-on-X munkafolyamatok támogatása. A főoldal az intraorális scan fájlokra épülő tervezést és a rendelő–labor közötti digitális együttműködést hangsúlyozza.

Források: [Főoldal](https://meshdent.hu/), [Rólunk](https://meshdent.hu/rolunk/), [OXO](https://meshdent.hu/oxo-implant-service/).

| Adat | Jelenlegi honlapon szereplő érték | Megjegyzés |
|---|---|---|
| Cégnév | MeshDent Kft. | Weboldali név; nem cégjegyzéki ellenőrzés |
| Cím | 1139 Budapest, Petneházy u. 14. | A honlap központként jelöli |
| E-mail | meshdentkft@gmail.com | Az Instagram bio is ezt használja |
| Kapcsolattartó | Szabó Richárd, +36 70 361 9962 | A honlapról |
| Kapcsolattartó | Buczi János, +36 70 353 4000 | A honlapról |
| Instagram | @meshdent_lab_budapest | Nyilvános profilmetaadatok |
| Instagram bemutatkozás | DIGITAL DENTAL LAB IN HUNGARY; ALL-ON-X DENTAL LAB | A bio szövege |
| Profilpillanatkép | 3998 követő, 3164 követett fiók, 168 bejegyzés | 2026-10-21-i metaadat; változó számok |

A nyitvatartást, adószámot, cégjegyzékszámot, alapítási évet és a csapat képesítéseit a gyűjtött oldalak nem igazolták. Ezeket nem pótoltuk feltételezésekkel.

### Szolgáltatások

1. **SAME DAY cirkon koronák, hidak** — CAD/CAM tervezés és gyártás; az oldalon „Expressz korona 24 óra alatt” állítás szerepel.
2. **Leplezett zirkon koronák** — digitális tervezés, mikroszkópos ellenőrzés, GC Initial porcelánleplezés.
3. **ESTHETIC anatomikus zirkon fogpótlás** — teljes anatómikus, rétegezés nélküli, többrétegű cirkóniumalapú megoldások.
4. **Láthatatlan fogszabályozás** — egyedileg tervezett átlátszó sínek.
5. **Implantátumra készült fogpótlások** — Solid Full Arch Zirconia, PMMA/try-in próba a végleges pótlás előtt.
6. **OXO technológia** — extraorális implantátumpozíció-meghatározás, rendelői szolgáltatás, All-on-X támogatás.
7. **Freedom Air** — a meglévő GitHub-oldal szerinti intraorális szkennelés és fotogrammetria, kihelyezési konstrukcióval, bemutatóval és szakmai támogatással.

A fenti felsorolás a jelenlegi kommunikáció leltára, nem független klinikai vagy szolgáltatási validáció. Az **OXO és a Freedom Air külön ajánlatként** kezelendő; eszközadataikat és pontossági állításaikat nem szabad összemosni.

## 4. Megőrzendő oldaltérkép

A kérésnek megfelelően az alapfelépítés és a meglévő szolgáltatásoldalak megmaradnak. A `/FreedomaAir` útvonalat pontosan a megadott írásmóddal rögzítettük.

| Jelenlegi útvonal | Tartalom | Új honlapra vonatkozó javaslat |
|---|---|---|
| `/` | Digitális fogtechnika; folyamat; előnyök; szolgáltatások; kapcsolat | Megtartás, új vizuális megjelenéssel |
| `/rolunk/` | Bemutatkozás, történet, célok | Megtartás; saját csapat- és laborfotókkal erősítendő |
| `/oxo-implant-service/` | OXO szolgáltatás, technológia, előnyök, űrlap | Megtartás; műszaki állítások ellenőrzése |
| `/same-day-cirkon-koronak-hidak/` | SAME DAY | Megtartás |
| `/leplezett-zirkon-korona/` | Leplezett zirkon koronák | Megtartás |
| `/esthetic-anatomikus-zirkon-fogpotlas/` | Anatómikus zirkon | Megtartás |
| `/lathatatlan-fogszabalyozas/` | Láthatatlan fogszabályozás | Megtartás |
| `/implantatumra-keszult/` | Implantátumra készülő pótlások | Megtartás |
| `/munkaink/` | Referenciagaléria | Megtartás; a képekhez ellenőrzött esetleírások adhatók |
| `/partnereink/` | Partnerlogók és videók | Megtartás; a kapcsolat jellegét pontosan megnevezni |
| `/kapcsolat/` | Elérhetőségek, térkép, űrlap | Megtartás; új CRM-kompatibilis űrlappal |
| `/extraoralis-scanner-fogpotlas/` | Páciensszemléletű OXO landing | Meglévő külön landingként kezelendő; ne vesszen el |
| `/insta/` | Instagram-integrációt tartalmazó oldal | Archiválva; a jövőbeli funkció és indexelés még eldöntendő |
| **`/FreedomaAir`** | Meglévő Next.js Freedom Air-oldal | Átvétel a jelenlegi megjelenés és üzleti folyamat megőrzésével |

A szükséges adatkezelési és sütikezelési oldalak, illetve köszönőoldalak technikai kiegészítések lesznek. A `/insta/` és a külön pácienslanding törléséről vagy átirányításáról nem született döntés. Régi URL-t csak konkrét céloldalra irányítsunk át, ne mindent a főoldalra.

### A főoldal jelenlegi tartalmi sorrendje

- Digitális labor bemutatása.
- „Kevesebb erőfeszítés, több páciens!” — hatlépéses munkafolyamat.
- „Miért legyél digitális?” — hat előny.
- Szolgáltatáskártyák.
- Elérhetőségek és kapcsolatfelvétel.

A felújítás ezt a tartalmi ívet megtarthatja: nagyobb és jobb minőségű képfelületekkel, olvashatóbb tipográfiával, rendezett térközökkel és mobilra tervezett elrendezéssel.

## 5. A vizuális anyagok használhatósága

A weboldali anyagok között **9 OXO klinikai fotó**, **8 fogtechnikai referenciakép**, **17 partnerlogó**, szolgáltatásillusztrációk, technológiai ábrák és arculati elemek vannak. A kategóriák tájékozódást szolgálnak, részben fájlnév és felhasználási hely alapján készültek. A teljes állomány böngészhető a médiakatalógusban.

Vizuálisan ellenőrzött minták: a MeshDent-logó, a MeshDent–All-on-X közös arculati kép, egy OXO klinikai fotó, egy implantátumos referenciamunka, a családot ábrázoló régi banner és a `meshdent-stock.jpg` kép. Nem történt a jelenlegi oldal teljes böngészős, képernyőképes auditja.

**Javasolt arculati irány:** a felismerhető zöld/türkiz MeshDent-márka megőrzése, világos felületek, sötétzöld kontraszt, kis mennyiségű piros márkaakcentus. A saját munkák és technológia kerüljenek előtérbe. A régi családi stock banner és a fogászati stock képek kevésbé mutatják meg a labor egyediségét.

A 293 × 104 pixeles weboldali logó nagy méretű felhasználásra korlátozott. A repo és a kombinált All-on-X-logó alternatív források, de célszerű az eredeti SVG/AI/PDF logót beszerezni. Az OXO-képeken meglévő vízjelek szerepelnek. A régi referenciafotók tipikusan 839 × 720, az OXO fotók 1600 × 1200 pixelesek; teljes szélességű hero háttérként korlátozottak.

Az importált Instagram-anyagok között már vannak friss referenciamunkák és eszközfotók. Négy mintát vizuálisan ellenőriztünk; az ajánlott felhasználási helyek az [Instagram-import jegyzetben](INSTAGRAM-IMPORT.md) szerepelnek. A képek 518–2048 pixel szélesek; különösen a nagy hero-felületekhez kell a konkrét kiválasztott kép felbontását ellenőrizni. A teljes Reel, valamint nagy felbontású csapatportrék és általános laborbemutató anyagok szükségességét a látványterv alapján kell véglegesíteni.

## 6. Mi áll rendelkezésre a fejlesztéshez?

- A teljes honlap célrepója: [MeshDent_TeljesHonlap](https://github.com/zalan002/MeshDent_TeljesHonlap), a vizsgálatkor README-t tartalmazó induló repó.
- A Freedom Air forrása: [Meshdent](https://github.com/zalan002/Meshdent).
- Ellenőrzött forráscommit: `bb4a61168b81b97bf99d0fc3889c2dacbede555c`; a helyi checkout és a GitHub `main` egyezik.
- Next.js 15.5.15, React 19, TypeScript, Tailwind 4, Framer Motion.
- A CRM-, n8n-, Meta Pixel- és CAPI-kapcsolatok kódszinten feltárva.
- A fő honlap régi Contact Form 7 űrlapjai és mezői feltárva; a szerveroldali címzettek és feldolgozás a nyilvános HTML-ből nem állapíthatók meg.
- Google-mérési, SEO- és AI-keresési megvalósítási követelmények külön dokumentálva.

A gyűjtés **helyileg az új honlap projektmappájában** található. Nem történt GitHub-push, éles telepítés, hirdetési fiókmódosítás vagy tesztlead-beküldés. A nyers archívum és a média a `.gitignore` szerint nem kerül automatikusan verziókezelésbe; a kiválasztott publikálható anyagokat a megvalósításkor kell a megfelelő helyre emelni.

## 7. Forrásjegyzék

Elsődleges webforrások: [meshdent.hu](https://meshdent.hu/), [Instagram](https://www.instagram.com/meshdent_lab_budapest/), a két fent megnevezett GitHub-repó. A nyilvános REST-források: [oldalak](https://meshdent.hu/wp-json/wp/v2/pages?per_page=100), [média](https://meshdent.hu/wp-json/wp/v2/media?per_page=100), [bejegyzések](https://meshdent.hu/wp-json/wp/v2/posts?per_page=100). Utóbbi üres listát adott.

A géppel feldolgozható eredmények a `manifests/` mappában, a teljes forráspillanatképek a `raw/` mappában találhatók. A `content/full-text/` a blokkszintű Markdown-kivonatból esetleg kimaradó közvetlen szövegeket is megőrzi. Az eredeti helyesírási hibák a forráskivonatokban szándékosan megmaradtak.
