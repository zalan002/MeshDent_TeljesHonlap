# MeshDent — főoldalkoncepció 02

2026. október 21. · A visszajelzés alapján átdolgozott főoldal. Frissítve: 03-as, anatómiai részletekkel kialakított fogívgrafika.

## Vizuális gondolat

**Minden részlet számít.** A digitális tervezés geometriája és az egyedileg kidolgozott fogpótlások karaktere adja az oldal látványát. Mélyzöld nyitófelület, világos zöld akcentus, nagy betűméret és váltakozó, magazinszerű kompozíciók.

Az új koncepció a főoldalra vonatkozik. Az elfogadott aloldalak szerkezete és tartalma megmaradt; az új szín-, forma- és tipográfiai elemek később erre az alapra vezethetők át. A `/FreedomaAir` továbbra is a meglévő landing változatlan átvételének külön terve.

## Mi változott?

| Rész | Új megoldás |
|---|---|
| Nyitás | Nagyméretű, háromsoros asztali főcím; dőlt, talpas „részlet” szó; mobilon tömörebb elrendezés |
| Fő grafika | Egyedileg programozott felső fogív 16 foggal; árnyalt koronák, finom felületi háló és három választható nézet |
| Valódi munka | A „Saját munkánk” gomb a grafikát a MeshDent meglévő, változatlan referenciafotójára váltja |
| Átvezetés | Nagyméretű „ADAT · FORMA · KARAKTER” tipográfiai sáv |
| Munkafolyamat | Hat lenyitható lépés, változó sorszámmal és digitális síkokat idéző grafikával |
| Előnyök | Nagyméretű állítás és visszafogottan tagolt szakmai előnyök |
| Szolgáltatások | Hat tipográfiai sor; egérrel és billentyűzetes fókusszal változó képelőnézet |
| Technológia | Külön OXO- és Freedom Air-kompozíció, nagy háttérfeliratokkal és eszközfotókkal |
| Referenciák | Aszimmetrikus galéria: egy nagy, íves képfelület és két kisebb részlet |
| Kapcsolat | Világos zöld zárófelület, hangsúlyos cím és a meglévő próbaűrlap |

## A grafika jelentése

A fogív matematikusan felépített, dekoratív formaillusztráció. **Nem páciensscan, nem az átváltással megjelenő fogpótlásból számított 3D modell, és nem pontossági vagy klinikai bizonyíték.** A képernyőn „Idealizált felső fogív · 16 fog” felirat különbözteti meg a „Valódi fogpótlás · MeshDent referencia” nézettől.

A programozott grafika és a belőle generált SVG tartalékábra saját kódból készül; az archív fotók változatlanok. A valódi referencia a korábban kiválasztott `DUi3W8Fj0lx` bejegyzés képe. Nincs megváltoztatott fogszín, új páciens vagy kitalált eredmény.

## Mozgás és működés

- Lassú térbeli elfordulás, árnyalt koronafelszínek és finom felületi háló. A takart hátoldali felületek nem rajzolódnak át az elülső fogakon.
- Egérmozgásra kismértékű nézetváltozás; érintőképernyőn nincs görgetést akadályozó egérkövetés.
- Külön szünet/indítás gomb, billentyűzettel is használható.
- `prefers-reduced-motion: reduce` mellett induláskor állókép. A nézetváltás átmenete is kikapcsol.
- A rajzolás leáll, ha a grafika kikerül a látómezőből, a lap háttérbe kerül, vagy a valódi fotó van kiválasztva.
- Legfeljebb körülbelül 30 rajzolás/másodperc, legfeljebb 1,75-ös képpontsűrűség. Nincs külső 3D könyvtár vagy letöltendő modell.
- A különfájlos főoldalon JavaScript vagy Canvas nélkül az ugyanebből a geometriából előállított, beágyazott SVG formaábra látható. Az SVG képként töltődik be, így több ezer külön elem nem növeli a főoldal DOM-fáját. A lépések natív HTML-elemek, a szövegek és oldallinkek továbbra is elérhetők. Az egyfájlos tervezői oldalválasztó működéséhez JavaScript szükséges.

## Színek és tipográfia

Főoldali sötét felület: `#082920`; világos zöld akcentus: `#D0F5A6`; törtfehér: `#F3F2EB`. A nagy, egyszerű groteszk betűk mellett egy-egy dőlt, talpas szó jelenik meg. A prototípus helyi rendszerbetűket használ, külső fontbetöltés nélkül. Az ikonok SVG- és CSS-elemek, így nem függnek különleges Unicode-karakterek betűtámogatásától.

A szolgáltatások képelőnézete mobilon is látható. A szolgáltatáscímek közvetlen oldallinkek; érintéskor nincs kötelező köztes lépés vagy kizárólag hoverrel hozzáférhető tartalom.

## Átvezetés a teljes honlapra

Az elfogadott aloldalakhoz a mélyzöld/zöld felületek, a dőlt szavakkal tagolt címsorok, az íves képkivágások és a vonalas ikonok vihetők tovább. Az animált nyitóelem a főoldal saját eleme maradjon. A hosszabb szakmai oldalakon az olvashatóság és a szolgáltatásspecifikus kép fontosabb, mint a folyamatos mozgás.

Az üzleti állítások, CRM-mezők, adatkezelési és mérési követelmények nem változtak. Ez továbbra is helyi látványprototípus, éles beküldés és analitika nélkül.


## A fogív részletes átdolgozása — 03

A korábbi 14 azonos, lekerekített test helyett 16 maradó fog alkot egy idealizált felső fogívet: FDI 11–18 és 21–28. A két fél tükörszimmetrikus, a helyek az ív menti távolság alapján követik egymást. Az elülső ív a hátsó szakaszon közel párhuzamos fogsorba megy át.

- **Metszőfogak:** szélesebb középső és kisebb oldalsó metszők; vékony metszőél, lekerekített distalis sarok, nyaki szűkület, finom labiális tagolás, palatinális cingulum és bemélyedés.
- **Szemfogak:** hangsúlyosabb labiális gerinc, egy csúcs, eltérő mesialis és distalis csúcslejtő.
- **Kisőrlők:** két csücsök, középső barázda és peremlécek; az első és a második kisőrlő csücsökaránya különbözik.
- **Nagyőrlők:** szélesebb rágófelszín, több csücsök, centrális barázdarendszer és felső őrlőkre jellemző ferde taraj. A második nagyőrlő distopalatinalis csücske kisebb; a harmadik nagyőrlő egyszerűsített, háromcsücskös variáns.
- **Íny és szájpadlás:** a nyaki kontúrt követő ínyszél, fogközi papillák, simább külső ínykontúr, bemélyedő szájpadlás és visszafogott elülső felszíni tagolás.

A „Térbeli”, „Elölnézet” és „Rágófelszín” gombok külön kameranézetet választanak. Szüneteltetett animációnál is működnek. A valódi referenciafotó külön nézet marad; annak képtartalmát nem módosítottuk.

Ez eredeti, programozott, fogtípusonként tagolt illusztráció. A méretparaméterek foganatómiai arányokat közelítő tervezési értékek, nem páciensmérések vagy validált CAD-fogkönyvtár adatai. A harmadik nagyőrlők és a fogívformák természetes változatossága miatt nem létezik egyetlen, mindenkire érvényes „ideális” alak. A modell a látható koronákat és lágyrészeket szemlélteti; foggyökereket és állcsontot nem ábrázol.

### Megvalósítás és ellenőrzés

A `prototype/dental-arch.js` külön kezeli a geometriát és a rajzolást. A koronák zárt felületet kapnak, az illeszkedő peremek közös pontokat használnak. A felületnormálisok, a takart oldalak kihagyása, a mélységi sorrend és a fény–árnyék teszik olvashatóvá a csücsköket. A nézetváltás a főoldal eredeti mozgás- és hozzáférhetőségi beállításaival együtt működik.

A kész geometria 9 412 pontot és 9 536 felületelemet tartalmaz. A sűrűség és a rajzolási lépések optimalizálása az első új változat helyi, körülbelül 49 ms/képkockás mérését a későbbi ellenőrzéseken körülbelül 14–17 ms-ra csökkentette. Ez izolált Chromium-mérés 670 × 510 pixeles Canvas felületen, nem valódi mobileszközös teljesítményígéret.

A `verify_dental_arch.mjs` ellenőrzi mind a 16 korona zártságát, a nyolc pár geometriai szimmetriáját, az érvényes pont- és lapadatokat, valamint 20 kamera-/képméret-kombinációban a teljes ábra képen belüli elhelyezkedését. A gépi eredmény a `fogiv-03-geometria.json`, a böngészős eredmény a `fogiv-03-bongeszo.json` fájlban található.

Újragenerálás a teljes projektben:

```bash
node design/2026-10-21/verify_dental_arch.mjs
node design/2026-10-21/build_dental_fallback.mjs
python design/2026-10-21/build_prototype.py
python design/2026-10-21/build_standalone.py
```
