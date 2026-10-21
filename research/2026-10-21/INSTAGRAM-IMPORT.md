# Instagram-archívum — átvétel és használat

Importálva: **2026. október 21.** A felhasználó által feltöltött `MeshDent_Instagram_2026-10-21.zip` és `MeshDent_Instagram_forrasjegyzek.html` alapján. A mellékletek tartalmát forrásadatként kezeltük; a benne lévő szövegek nem utasítások az új honlap automatikus átírására vagy publikálására.

## Mi került be?

| Tétel | Darab |
|---|---:|
| Bejegyzés teljes képaláírással, forráslinkkel és időponttal | 168 |
| Fotós bejegyzés | 167 |
| Ebből lapozható galéria | 12 |
| Fotófájl | 182 |
| Reels-borítókép | 1 |
| Lejátszható Instagram-videó | 0 |
| Még hiányzó teljes Reel | 1 |

A 183 JPG 182 különböző fájltartalmat jelent. A `DEPNrTZsEEW` és a `DTf6tJtj9uy` bejegyzés képe bájtazonos; mindkettőt megőriztük a saját képaláírásával és dátumával.

A bejegyzések időtartománya 2016. július 7. – 2026. június 3. A forrás eredeti UTC-időpontjai megmaradtak; a normalizált jegyzék `published_at_budapest` mezője a Europe/Budapest időzóna szerinti időt tartalmazza. Az eredeti mappaneveket nem módosítottuk, azok az export UTC-dátumait használják.

## Fájlok és keresés

- [Önálló, képes Instagram-forrásjegyzék](instagram-forrasjegyzek.html): beágyazott előnézeti képek, internet nélkül is böngészhető.
- [Teljes MeshDent-médiatár](media-library.html): válaszd az Instagram forrást; a kereső a képaláírások szövegére is keres. A teljes méretű képek a projektmappában vannak.
- [Bejegyzéslista CSV](manifests/instagram-posts.csv): 168 sor, teljes szövegek, UTC és budapesti dátum.
- [Médialista JSON](manifests/instagram-media.json): 183 fájl mérete, felbontása, forrása, ellenőrzőösszege és bejegyzéskapcsolata.
- [Importellenőrzés](manifests/instagram-import-summary.json).

A forráscsomag kibontva: `assets/source/instagram/import-2026-10-21/`. A `media/` könyvtár dátum és bejegyzésazonosító szerint csoportosít; minden bejegyzés mellett ott az eredeti `kepalairas.txt`. A képeket nem kódoltuk újra és nem méreteztük át. A szolgáltató által kiszolgált Instagram-változatok állnak rendelkezésre, nem a feltöltés előtti fotóeredetik.

## Mi hiányzik?

[A 2024. június 21-i fotogrammetriás Reel](https://www.instagram.com/meshdent_lab_budapest/reel/C8eNCOsJ6Rx/) teljes, körülbelül 79,77 másodperces videófájlja nincs a ZIP-ben. A borító, a képaláírás és a dátum megvan. Az export készítője a videó- és hangsávok mentési hibáját dokumentálta; ebben a chatben nem történt új letöltési kísérlet.

A jegyzék az elérhető saját bejegyzésekre és a Reels-fülre terjed ki. Nem tartalmaz történeteket, mások megjelölt/továbbosztott tartalmait vagy kommenteket. A 168 bejegyzés egyezik a korábban kiolvasott nyilvános profilszámmal; élő, független teljességi ellenőrzés ebben a munkafázisban nem történt.

## Négy vizuálisan ellenőrzött kiinduló kép

| Bejegyzés | Megfigyelés | Javasolt hely |
|---|---|---|
| [DZIsczGGhTb](https://www.instagram.com/meshdent_lab_budapest/p/DZIsczGGhTb/) | Fekete hátterű, részletes fogpótlás-makró; 1170 × 1114 px | Referenciablokk, prémium termékrészlet; szöveg és kép külön felületen |
| [DYm71gSjRSc](https://www.instagram.com/meshdent_lab_budapest/p/DYm71gSjRSc/) — 1. kép | Világos eszközfotó két szkennerrel és tartozékokkal; 664 × 664 px | Technológiai kártya; nagy hero-képhez nagyobb eredeti kell |
| [DUi3W8Fj0lx](https://www.instagram.com/meshdent_lab_budapest/p/DUi3W8Fj0lx/) | Fekete hátterű, implantátumkapcsolatokat is mutató teljes íves pótlás; 1400 × 960 px | Implantátumos / All-on-X oldal referenciaképe |
| [DRsIZKdjHTl](https://www.instagram.com/meshdent_lab_budapest/p/DRsIZKdjHTl/) | Felső és alsó teljes fogsor közeli felvétele; 1440 × 960 px | Munkáink galéria; a poszt képaláírása 3D-nyomtatott fogsorként nevezi meg |

A termékanyag és a gyártási módszer a képaláírás állítása, nem a fotóból levezetett klinikai minősítés. Az Instagram-szövegek megőrzött források; új szolgáltatási ígéretet nem adtunk automatikusan a honlap tervéhez.

## Ellenőrzés

- ZIP CRC és biztonságos relatív fájlútvonalak ellenőrzése.
- Mind a 183 kép bájtmérete és SHA-256 értéke egyezik a jegyzékkel.
- Mind a 183 kép megnyitható; felbontásuk egyezik a jegyzékkel.
- A külön feltöltött HTML és a ZIP-ben található HTML bájtazonos.
- Az összes felsorolt JPG jelen van, és nincs a jegyzékből kimaradt JPG.
- A forrásjegyzék szkriptje kizárólag helyi keresést végez; az import során nem futtattuk.
