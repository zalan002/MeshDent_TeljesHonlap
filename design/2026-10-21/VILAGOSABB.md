# MeshDent — világos főoldalváltozat

Előnézet: `/vilagosabb`. Az eredeti `/` főoldal külön megmarad. Az új változat az önálló látványterv oldalválasztójából is megnyitható.

Fehér és halvány mentazöld felületek, a meglévő logóból vett `#1BB588` zöld és `#CE2832` piros akcentusok. A hosszabb zöld szövegek sötétebb `#087B60` árnyalatot kapnak az olvashatóságért. A kiemelt üzenet továbbra is „Digitális fogtechnika Budapesten.”

A nyitóképen a régi MeshDent főoldal mosolygó családja szerepel (WordPress 579). A második hangulatkép szintén a korábbi oldalról származik (WordPress 578). Ezek hangulatképek, nem páciensreferenciák. A saját fogpótlások külön referenciagalériában jelennek meg. Nincs digitális fogív vagy Canvas a világos oldalon.

A családi kép az eredeti 1920 × 745 felbontást megtartó WebP-kódolást kapott: 3,2 MB helyett körülbelül 236 KB. Retusálás nem történt; a képkivágást a reszponzív CSS határozza meg. Az archivált forrás érintetlen, a webes származék az `assets/derived/website/family.webp` fájl. Újrakódolása a projekt gyökerében:

```bash
ffmpeg -i assets/source/website/wp-579-slider-1.png -c:v libwebp -quality 85 -compression_level 6 -frames:v 1 assets/derived/website/family.webp
```

A szolgáltatások, technológiák, referenciák és elérhetőségek a meglévő adatokból származnak. A kapcsolatgombok a közös kapcsolatoldalra vezetnek. A `/FreedomaAir` továbbra is kizárólag az átvételről szóló mondatot és a meglévő oldal címét tartalmazza. A közzétett fájlokban nincs GitHub-hivatkozás.

A `vilagosabb-bongeszo.json` a helyi, publikálásra kész build Chromium-ellenőrzését rögzíti: 320–1440 px szélesség, cím és oldal túlcsordulása, képek betöltése, mobilmenü, referenciakép nagyítása, Freedom Air navigáció és az önálló oldalválasztó. A főoldalról, szolgáltatásokról, munkafolyamatról és kapcsolatblokkról asztali, valamint a főoldalról mobilképernyőkép is készült és vizuálisan ellenőrzött. Ez emulált böngészős ellenőrzés, nem valódi készülékteszt.
