# A honlapterv és a prototípus ellenőrzése

Átadás: 2026. október 21. · Frissítve a 02-es főoldalkoncepció 03-as fogívgrafikájához.

## Használat

Nyissa meg a **MeshDent-latvanyterv.html** fájlt a böngészőben. Minden szükséges kép, stílus és szkript be van ágyazva; nincs szükség szerverre vagy telepítésre. Az oldalválasztóval 13 fő honlapoldal, a Freedom Air illesztési lapja, az oldaljegyzék, a teljes részletes terv és a jogi oldalak vázlata érhető el. A „Mobil · 390 px” gomb keskeny előnézeti keretet állít be.

A `prototype/index.html` változat külön fájlokkal működik; ehhez a teljes `prototype/` mappát együtt kell megtartani. A ZIP ezeket és a dokumentációt is tartalmazza.

## Ellenőrzött tételek

- Az eredeti 13 tartalmi útvonal és a pontos `/FreedomaAir` szerepel az oldaltervben.
- Minden prototípusoldalon egy H1 és magyar nyelvjelölés van; minden oldal noindex, nofollow.
- A relatív kép-, CSS-, JavaScript- és HTML-hivatkozások, valamint a belső horgonyok helyben ellenőrzöttek.
- A 16 kiválasztott képfájl bájtazonos a gyűjtött archív megfelelőjével; a forrás és alt-javaslat a képjegyzékben szerepel.
- Az önálló HTML 17 választható nézetet, 16 beágyazott forrásképet és egy saját, generált SVG tartalékábrát tartalmaz.
- A JavaScript szintaxisa és a Python-generátorok fordíthatósága ellenőrzött.
- A fő szöveg-/háttérszínpárok kontrasztja számítással ellenőrzött.
- Nincs analitikai tag, külső fontletöltés, háttérben betöltődő Instagram-widget vagy CRM-adatküldés.
- A 02-es főoldalt helyi HTTP-előnézeten, izolált Chromium böngészővel is ellenőriztük. 320, 390, 768 és 1440 px szélességen nincs vízszintes túlcsordulás.
- Böngészőben ellenőrzött: grafika/fotó váltás, a Canvas tényleges megállása szüneteltetéskor, csökkentett mozgás, folyamatlépés választása, billentyűzetes szolgáltatás-képelőnézet, mobilmenü.
- Az egyfájlos HTML-ben is működik a grafika, a 390 px széles mobilkeret és az aloldalra navigálás. Az elfogadott aloldal nem kap főoldali stílusokat.

- A fogívgrafikán 16 zárt koronafelület, nyolc tükörszimmetrikus fogpár és 20 nézet-/képméret-kombináció ellenőrzött. A három új kameranézet külön és billentyűzetes aktiválással is ellenőrzött. A csökkentett mozgás induláskori állapota és a Canvas nélküli SVG-megjelenés böngészőben ellenőrzött.

Az ellenőrzések gépi eredménye az `ellenorzes.json`, a főoldal böngészős eredménye a `fooldal-02-bongeszo.json`, a fogív frissített eredménye a `fogiv-03-bongeszo.json` és `fogiv-03-geometria.json` mellékletben található. Ez nem éles integrációs vagy akadálymentességi tanúsítás.

## Tervezetten működő interakciók

Oldalak közötti navigáció, mobilmenü, szolgáltatásmenü, galériakategóriák szűrése, képnagyítás és bezárás, helyi űrlapvalidáció és próba-visszajelzés, előválasztott szolgáltatás, visszahíváskor kötelező telefonszám. A páciens témánál a céges mező elrejtőzik. A sütipanel kizárólag a tervezett kezelőfelület mintája; semmit nem ment.

## Ellenőrzési határ

A főoldalról asztali és mobilképernyőképek készültek, és a fő interakciók Chromiumban ellenőrzöttek. Ez helyi HTTP-előnézet volt; a letöltött fájl felhasználó saját böngészőjében való megnyitását nem távolról ellenőriztük. A 390 px-es keret nem helyettesít valódi készüléktesztet. Safari, Firefox, képernyőolvasó és a teljes honlap valamennyi interakciójának regressziós tesztje még nincs lezárva.

Nincs éles CRM-bekötés, valódi beküldés, GA4/Ads-adatérkezés vagy Consent Mode teszt. A Freedom Air landing teljes átemelése még nem történt meg: itt az illesztési terv látható. A jogi szövegek és az ellenőrzési listán lévő szakmai állítások véglegesítendők. Az összes hosszú forrásszöveg helyett szerkesztett tervezési példaszövegek jelennek meg.

## Újragenerálás

A teljes projektben, a megőrzött kutatási archívum mellett:

```bash
node design/2026-10-21/verify_dental_arch.mjs
node design/2026-10-21/build_dental_fallback.mjs
python design/2026-10-21/build_prototype.py
python design/2026-10-21/build_standalone.py
```

A különálló látványterv megnyitásához nincs szükség Pythonra. A generátorok a meglévő archívumot olvassák; külső szolgáltatást nem módosítanak.
