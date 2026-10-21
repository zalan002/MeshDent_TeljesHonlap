# MeshDent — a teljes új honlap terve

**Verzió:** 2.1 — digitális fogtechnika Budapesten · **Dátum:** 2026. október 21. · **Állapot:** megvalósításra előkészített terv és helyi látványprototípus.

**Főoldal, 04-es finomítás:** az új vizuális irányt és mozgást a [Frissített főoldalkoncepció](FOOLDAL-02.md) rögzíti. A főoldal új címe „Digitális fogtechnika Budapesten.”, nyitóeleme interaktív fogív-illusztráció, valódi referenciára váltható nézettel. Ez a kiegészítés felülírja az alábbi eredeti vizuális főoldalleírásokat. Az aloldalak elfogadott szerkezete, a CRM és a mérés terve változatlan.

[Kattintható látványterv](prototype/index.html) · [Oldaljegyzék és tervezői megjegyzések](prototype/terv.html) · [Oldalankénti SEO- és tartalomterv](oldalterv.csv) · [Képválogatás és eredet](kepvalogatas.json)

## 1. Az új honlap alapgondolata

**Digitális fogtechnika Budapesten.** Fogpótlások digitális tervezése és készítése fogorvosoknak, rendelőknek.

A MeshDent honlapja egy budapesti digitális fogtechnikai labor szakmai bemutatkozása. A látogató először megérti, mivel foglalkozik a labor, majd megismeri az együttműködés folyamatát, a szolgáltatásokat és a tényleges munkákat. Innen egyértelmű út vezet a szakmai egyeztetéshez.

A jelenlegi 13 tartalmi útvonal megmarad. A főoldal jelenlegi bemutatkozás → munkafolyamat → digitális előnyök → szolgáltatások → kapcsolat ívét megtartjuk. A saját referenciák és a két technológiai ajánlat átláthatóbb helyet kapnak ebben a rendszerben. A Freedom Air meglévő landingje a kért **`/FreedomaAir`** útvonalon, saját megjelenésével és hétlépéses CRM-folyamatával szerepel.

A tervezett szövegek a meglévő tartalom rövidített, szerkesztett változatai. Az eredeti szövegarchívum a tartalmi átültetés alapja; a látványterv nem a végleges, teljes terjedelmű szövegátadás. A korábbi oldalakon szereplő számszerű és feltételhez kötött ígéretek külön ellenőrzési listán maradnak, nem tekintjük őket automatikusan aktuális ajánlatnak.

## 2. Közönség és látogatói utak

| Látogató | Kérdése | Javasolt út | Cél |
|---|---|---|---|
| Fogorvos, rendelőtulajdonos | Hogyan dolgozhatok a MeshDenttel? | Főoldal → folyamat → szolgáltatás → kapcsolat | Labor-együttműködésről szóló érdeklődés |
| Implantológiával foglalkozó rendelő | Hogyan készül teljes íves pótlás? | Implantátumos oldal → referenciák → OXO vagy kapcsolat | Szakmai egyeztetés |
| Szkennert kereső szakember | Mit kínál a Freedom Air? | Főoldali technológiai blokk / hirdetés → `/FreedomaAir` | A meglévő bemutató-/kihelyezési űrlap kitöltése |
| Páciens | Mit jelent számomra a digitális folyamat? | „Pácienseknek” → külön OXO páciensoldal → kapcsolat | Tájékoztatás, helyszín- és időpontegyeztetés |
| Visszatérő partner | Kit hívhatok, hol találom a labort? | Fejléc / kapcsolat / mobil alsó CTA | Közvetlen telefon vagy e-mail |

Az alap hangnem következetesen magázó, rövid és szakmai. A páciensoldal közérthető nyelvet használ; nem sugallja, hogy a labor önálló fogorvosi rendelő. Nem kerül be új páciensportál, webshop vagy fájlfeltöltő: ezekre a jelenlegi igény nem terjed ki.

## 3. Navigáció és oldaltérkép

**Asztali fejléc:** logó → Rólunk → Szolgáltatások lenyíló menü → Munkáink → Freedom Air → kiemelt Kapcsolat. A lenyíló menüben a hat meglévő szolgáltatás közvetlenül elérhető. A Partnereink és Pácienseknek link az alsó navigációban, valamint kapcsolódó tartalmakból érhető el.

**Mobil:** logó és Menü gomb; nyitáskor teljes szélességű, csoportosított lista. A szolgáltatások külön lenyithatók. A tervezett alsó kapcsolatgomb csak akkor látszik, amikor az oldali űrlap nincs a képernyőn; nem takarja el a cookie-panelt és a billentyűzetet. A prototípus a közös fejléc és az oldali CTA-k elrendezését mutatja. A Freedom Air megőrzi saját navigációját.

| Útvonal | Oldal szerepe / főcíme | Elsődleges művelet | Indexelés |
|---|---|---|---|
| `/` | Digitális fogtechnika Budapesten. | Kapcsolatfelvétel | Igen |
| `/rolunk/` | Digitális szemlélet. Személyes együttműködés. | Kapcsolat a laborral | Igen |
| `/same-day-cirkon-koronak-hidak/` | SAME DAY cirkon koronák és hidak | Egyeztessünk a munkáról | Igen |
| `/leplezett-zirkon-korona/` | Leplezett zirkon koronák | Szakmai egyeztetés | Igen |
| `/esthetic-anatomikus-zirkon-fogpotlas/` | ESTHETIC anatómikus zirkon fogpótlás | Szakmai egyeztetés | Igen |
| `/lathatatlan-fogszabalyozas/` | Láthatatlan fogszabályozás | Tájékoztatást kérek | Igen |
| `/implantatumra-keszult/` | Implantátumra készült fogpótlások | Egyeztessünk az esetről | Igen |
| `/oxo-implant-service/` | OXO implantátumpozíció-meghatározás | OXO-egyeztetés | Igen |
| `/munkaink/` | A részletekben látszik a munkánk | Kapcsolódó szolgáltatás / kapcsolat | Igen |
| `/partnereink/` | Partnereink | Kapcsolat | Igen |
| `/kapcsolat/` | Beszéljünk a következő munkáról | Érdeklődés elküldése | Igen |
| `/extraoralis-scanner-fogpotlas/` | Digitális lenyomatvétel a fogpótlásához | Tájékoztatás / visszahívás | Igen; önálló páciensszöveggel |
| `/insta/` | A labor munkái képekben | Munkáink / Instagram | Megmarad; induláskor noindex, amíg csak galériatükör |
| **`/FreedomaAir`** | A jelenlegi Freedom Air landing | A meglévő hétlépéses űrlap | Igen |

**Kiegészítő útvonalak:** `/adatkezeles/`, `/sutik/`, `/impresszum/`, `/koszonjuk/`, `/FreedomaAir/koszonjuk`, valamint valódi HTTP 404-oldal. A köszönőoldalak noindex jelölést kapnak, és nem szerepelnek a sitemapben. A jogi oldalak végleges szövegét a tényleges cég- és adatfeldolgozási adatokból kell elkészíteni; a prototípusban a helyük és szerepük látható.

**URL-döntés:** a régi útvonalak megőrzése elsődleges; nincs általános főoldalra átirányítás. A régi WordPress-útvonalaknál a záró perjeles alak a canonical. A kért `/FreedomaAir` útvonal kis- és nagybetűje pontosan megmarad. A framework alapértelmezett perjel-kezelése helyett a route-táblával egyező, ciklusmentes normalizálás szükséges. Az esetleges `/freedomaair`, `/FreedomAir` és záróperjeles termékaliasok egyetlen 301 lépéssel a megadott canonical címre menjenek.

## 4. Vizuális rendszer

**Irány: precíz, nyugodt, anyagközpontú.** A természetes fogfelszínek, a fogpótlások részletei és a digitális technológia adják a látványt. Világos háttéren sötét tipográfia; néhány mélyzöld szakasz; nagy, valós referenciaképek.

| Elem | Terv |
|---|---|
| Fő háttér | Meleg törtfehér `#F5F4EF` |
| Elsődleges szöveg | Mélyzöld `#173E35` |
| Márka- és gombszín | Zöld `#007C62`, fehér gombfelirat |
| Másodlagos felület | Halvány zsálya `#E6EDE6` |
| Másodlagos szöveg | `#53645D` |
| Vonalak | `#D4DDD5` |
| Kiegészítő akcentus | A meglévő logó pirosa; nem új, domináns oldalszín |
| Tipográfia | Javasolt Manrope változó betűcsalád, magyar karakterekkel, saját tárhelyről; prototípus: rendszerbetű, külső betöltés nélkül |
| Főcím | Asztali 64–88 px, mobil 40–48 px; normál/közepes súly, szoros sorköz |
| Szakaszcím / törzsszöveg | 36–52 / 17–18 px; hosszú szövegnél legfeljebb 65–75 karakter/sor |
| Rács | Legfeljebb 1320 px széles tartalom, 12 oszlop; mobilon egy oszlop |
| Térközök | 8 px alapritmus; szakaszok között asztali 96–128, mobil 56–72 px |
| Képek | Megőrzött arány, 8–20 px lekerekítés; változatlan fogszín és részletek |
| Gombok | Legalább 44 × 44 px célterület; jól látható hover/focus/disabled állapot |

A meglévő logót használjuk; a prototípusban 146 px körüli megjelenítési szélességgel. A végleges oldalhoz az eredeti vektoros logó szükséges. Nem készül kitalált új embléma vagy pácienseredmény.

**Mozgás:** 160–220 ms gomb- és menüátmenetek, legfeljebb 12 px-es visszafogott belépés. A tartalom JavaScript nélkül is olvasható. Nincs görgetésátvétel, automatikusan induló körhinta vagy folyamatos háttérvideó. `prefers-reduced-motion` esetén minden nem szükséges animáció kikapcsol. A saját videó külön, kattintással indítható.

## 5. Főoldal — végleges blokkterv

| Sorrend | Tartalom | Elrendezés és interakció | Forrás |
|---|---|---|---|
| 1 | **Digitális fogtechnika Budapesten.** Alatta: „Fogpótlások digitális tervezése és készítése fogorvosoknak, rendelőknek.” | Két hasáb: balra cím, Kapcsolatfelvétel és Szolgáltatásaink link; jobbra interaktív fogív, saját referenciára váltható nézettel. Mobilon egymás alatti elrendezés. | Régi főoldali bemutatkozás + Instagram |
| 2 | Így dolgozunk. | Hat számozott, lenyitható lépés rövid leírásokkal. | Régi hatlépéses folyamat, logikus sorrendbe rendezve |
| 3 | Digitális együttműködés. | Három rövid előny: egyszerű adatátadás, egyeztethető tervek, közvetlen kapcsolat. | Régi digitális előnyök |
| 4 | Fogpótlások és digitális megoldások. | Hat közvetlen szolgáltatáslink, váltakozó képelőnézettel. | Hat jelenlegi szolgáltatás |
| 5 | Technológia a rendelő és a labor között | Két külön modul: OXO szolgáltatás és Freedom Air terméklanding. A kettő külön CTA-val és leírással szerepel. | OXO oldal + meglévő landing |
| 6 | Munkáink. | Három saját referencia, képnagyítás és link a Munkáink oldalra. | Ellenőrzött Instagram-képválogatás |
| 7 | Kapcsolat a laborral. | Elérhetőségek + rövid űrlap; ügytípus előválasztható a szolgáltatásoldalról. | Régi kapcsolatblokk |
| 8 | Lábléc | Teljes szolgáltatáslista, cégcím, kapcsolattartók, Instagram, jogi és cookie-linkek. | Forrásadatok |

**Hat lépés:** digitális lenyomat → ellenőrzés és továbbítás → CAD-tervezés → gyártás → egyedi kidolgozás → kiszállítás. A régi kinyert HTML oszlopsorrendje felcserélte az egyes lépéseket; a tartalom megmarad, a sorrend a munkafolyamatot követi.

Nem használunk kitalált darabszámokat, eredményarányokat, véleményeket vagy ügyfélszámokat. A 168 Instagram-bejegyzés gyűjtési adat, nem marketingeredmény.

## 6. Aloldalak részletes terve

### Rólunk

Bemutatkozó főcím → a digitális labor szemlélete → jelenlegi cégtörténet rövid bekezdésekben → digitális tervezés és gyártás → együttműködési értékek → név szerinti kapcsolattartók → kapcsolat. Az alapítás éve, csapatlétszám és képesítések csak igazolt adatból kerülhetnek be. A saját munka képe a labor munkáját mutatja, nem csapatportrét helyettesítő stock ember. Friss csapat- és laborfotók később ugyanebbe a rácsba illeszthetők.

### Az öt fogtechnikai szolgáltatásoldal közös sablonja

Morzsanavigáció → egyedi H1, 40–70 szavas közvetlen összefoglaló és saját kép → mi készül / kinek szól → anyag és eljárás → együttműködés lépései → kapcsolódó referencia → 2–3 valós kérdés és válasz → szolgáltatásra előválasztott érdeklődés → két kapcsolódó szolgáltatás.

| Oldal | Megtartandó szakmai tartalom | Kiemelt vizuális / tartalmi döntés |
|---|---|---|
| SAME DAY | CAD/CAM, egyedi koronák és hidak, expressz lehetőség | A „24 óra” vállalást a leadási határidőkkel, munkatípussal és kapacitással együtt kell véglegesíteni; a látványterv egyeztetésre hív. |
| Leplezett zirkon | Digitális váztervezés, visszavágás, mikroszkópos ellenőrzés, GC Initial porcelán | A jelenlegi oldal tényleges illusztrációja; más anyagú Instagram-munkát nem nevezünk leplezett zirkonnak. |
| ESTHETIC | Teljes anatómikus kialakítás, többrétegű cirkónia, kerámialeplezés nélküli forma | Saját, a képaláírás szerint zirkon referencia. A 1250/900 MPa és transzparenciaadatokhoz aktuális anyagazonosító és gyártói forrás kell. |
| Láthatatlan fogszabályozás | Egyedi átlátszó sínek, digitális tervezés, kivehetőség; fogorvosi alkalmassági döntés | A kezelőorvos szerepe látható; a labor és a rendelő szolgáltatási szerepe nem keveredik. |
| Implantátumos pótlások | Solid Full Arch Zirconia, intraorális/OXO adatok, PMMA vagy try-in, módosítás a végleges előtt, All-on-4/6 | Folyamatábra és saját teljes íves kép. A próba külön lépés, nem puszta dekoráció. |

### OXO szakmai oldal

Két hasábos nyitás eszközképpel → az implantátumpozíció-meghatározás rövid magyarázata → munkaállomás / implantátumpozíció / rágási pálya / arcdigitalizálás → rendelői, páciens- és laborszempontok → Scanmarker és az adatok összeillesztésének folyamata → rendelkezésre álló technológiai képek → OXO-specifikus kapcsolat, visszahívási lehetőséggel. A régi hosszú szöveget tagoljuk, a jelentését nem írjuk át.

Az 5 µm, a 10–15 másodperc, az országos és ingyenes szolgáltatás feltételei ellenőrzendők. Ezek nem kerülnek át a Freedom Air oldalra. A hiányzó Instagram Reel nem kap működést színlelő lejátszásgombot.

### Munkáink

Nagy referenciafotó → szűrők: Összes, Zirkon, Implantátumos munkák, Egyéb munkák → vegyes képarányú, de stabil rács → billentyűzettel is használható képnagyítás. Minden képnél rövid, ellenőrzött megnevezés, forrás és kapcsolódó szolgáltatás. A címkék képaláírásból vagy szakmai ellenőrzésből származnak.

Induló válogatás 12–18 kép, oldalanként korlátozott betöltéssel. Nem töltjük le az összes 183 képet a főoldal megnyitásakor. A duplikált kép csak egyszer szerepel a válogatásban. Későbbi esettanulmány mezői: feladat, anyag, adatfelvétel, próba, gyártás; hiányzó adat nélkül, valódi szakmai szerzővel. Külön esettanulmány-URL csak érdemi tartalom esetén készül.

### Partnereink

Rövid bevezető → meglévő partner- és technológiai logók rendezett, világos rácsban → igazolt kapcsolatjelleg szerinti csoportok → ellenőrzött külső videók → együttműködési kapcsolat. A gyártólogó nem automatikusan jelent hivatalos képviseletet vagy ajánlást. A prototípus a jelenlegi partneroldal logóinak válogatását mutatja; a végleges lista mind a 17 leltári logóból, aktualitásellenőrzéssel áll össze.

### Kapcsolat

Bal oldalon e-mail, cím és a két név szerinti telefonszám, jobb oldalon rövid űrlap. Alatta megközelítés és kattintható térképlink; beágyazott térkép csak hozzájárulás után. Nem jelenik meg kitalált nyitvatartás vagy válaszidő. Alapértelmezett e-mail: a jelenlegi honlap és Instagram által egyaránt használt `meshdentkft@gmail.com`; a Freedom Air eltérő címét a migráció előtt egyeztetni kell.

### Páciensoldal: `/extraoralis-scanner-fogpotlas/`

Közérthető magyarázat → hogyan zajlik az adatfelvétel → kényelem és fogorvosi egyeztetés → helyszín-/időpontegyeztetés → visszahívási űrlap. A régi kerületlista forrásként megmarad, de a végleges szolgáltatási helyszíneket frissíteni kell. Önálló szöveg és canonical különbözteti meg a szakmai OXO-oldaltól.

### Instagram: `/insta/`

Saját tárhelyről kiszolgált, szerkesztett képes válogatás, dátummal és eredeti bejegyzéslinkkel; nincs automatikusan betöltődő Instagram-widget. Kiegészíti a Munkáink galériát. Induláskor noindex, follow; így az egyszerű közösségimédia-tükör nem versenyez a referenciák oldalával. Később egyedi szerkesztett tartalom esetén ez felülvizsgálható.

### Freedom Air: `/FreedomaAir`

**A meglévő design és tartalmi sorrend átvételét tervezzük, nem új landinget.** Forrás: `zalan002/Meshdent`, vizsgált commit: `bb4a61168b81b97bf99d0fc3889c2dacbede555c`.

Megmarad: teljes oldalszerkezet, komponensek, színek, betűk, animációk, `#urlap`, `#kihelyezes`, `#parameterek` horgonyok, hétlépéses űrlap és részleges mentés. A közös honlap fejléce/lábléce nem kerül automatikusan köré. A tervezői prototípus ehhez illesztési lapot ad, nem állítja, hogy a teljes Next.js landinget már átemelte.

Módosítandó technikai keret: domain és canonical, route-ok, adatkezelési link, köszönőoldal személynév nélküli URL-je, egyszeri mérőkódbetöltés, consent és működő CRM-domainengedélyezés. A felismert műszaki állításeltérések külön tartalmi feladatok; nem módosítjuk őket észrevétlenül a designátvétel során.

## 7. Kép- és videóterv

| Anyag | Tervezett hely | Megjegyzés |
|---|---|---|
| `DUi3W8Fj0lx_01.jpg` · 1400 × 960 | Főoldali nyitókép és implantátumos referencia | Sötét hátterű teljes íves munka; a képrészlet nem torzul |
| `DZIsczGGhTb_01.jpg` · 1170 × 1114 | Referenciaválogatás / Rólunk | Saját munka makrója; nem laborhelyszínfotó |
| `DXsCFGZkazP_01.jpg` · 1343 × 978 | ESTHETIC és referenciák | Anyagmegnevezés a bejegyzés képaláírása alapján |
| `DRsIZKdjHTl_01.jpg` · 1440 × 960 | Referenciák | A képaláírás szerint 3D-nyomtatott fogsor; nem hoz létre új önálló szolgáltatásoldalt |
| `wp-608-oxo_core_01_1024x578.png` | OXO technológiai blokk | A forrásképen szereplő jelzések megmaradnak |
| `DYm71gSjRSc_01.jpg` · 664 × 664 | Kisebb Freedom Air átkötő modul | Nem nagyítjuk teljes képernyős hero méretre |
| Régi service-képek | SAME DAY, leplezett zirkon, fogszabályozás | A jelenlegi oldali megfeleltetés alapján |
| Meglévő 66,69 mp-es Freedom Air MP4 | Freedom Air, saját lejátszó | Poszter, controls, preload=none; a fájlnak nincs hangsávja |

Nem retusáljuk a fogszínt, a formát vagy az eredményt. A végleges reszponzív változatok kizárólag méretezést és tömörítést jelentenek; az eredeti források és képarányok megmaradnak. Klinikai fotó csak az adott felhasználásra rendezett hozzájárulással kerüljön ki. A jelenlegi koncepció a tárgyfotókat helyezi előtérbe.

## 8. Űrlapok és CRM

| Folyamat | Mezők | Üzleti besorolás |
|---|---|---|
| Általános / szolgáltatás | Név, e-mail; telefon opcionális; rendelő/cég opcionális; érdeklődés tárgya; üzenet; adatkezelési tájékoztató | `general` vagy a konkrét `service_slug` |
| OXO szakmai | Előzőek + visszahívás választás; visszahíváskor kötelező telefon | `oxo_professional` |
| Páciensoldal | Név, e-mail; visszahíváskor telefon; rövid kérdés, helyszínegyeztetés | `oxo_patient`, elkülönítve a B2B érdeklődőktől |
| Freedom Air | Jelenlegi 7 lépés és mezőleképezés | Meglévő Freedom Air folyamat |

Az általános űrlap egy képernyőn kitölthető; nem kér fogorvosi pecsétszámot. A marketinghozzájárulás nem kötelező feltétele a kapcsolatfelvételnek. A nyilvános űrlap nem kér páciensfotót, kórtörténetet vagy scan-fájlt.

**Állapotok:** alap → mezőhibák → küldés (újrakattintás tiltva) → hitelesített siker vagy javítható hiba. Hiba esetén az adatok a képernyőn megmaradnak. Siker csak tartós mentés visszaigazolására jelenik meg; a köszönőoldal puszta megnyitása nem jelent új leadet.

**Célarchitektúra:** külön `/api/contact` az általános/OXO űrlaphoz; a meglévő `/api/lead` a Freedom Airhez. Mindkettő a dokumentált megfelelő mezőkre és formazonosítóra továbbít, közös idempotenciával. Egy véletlen beküldési azonosító ugyanazt az üzleti kérést jelöli az újrapróbálások alatt. A részleges és végső CRM-mentés ugyanazon rekordot folytatja. Tartós inbox/outbox vagy azonos garanciájú CRM-művelet szükséges; a konkrét tárhely a megvalósításkor választandó, nincs feltételezett új infrastruktúra-hozzáférés.

**Hibakezelési szerződés:** validációs 422 mezőszintű hiba; tokenhiba esetén egy megújítás; 429-nél várakozási jelzés; időtúllépésnél újrapróba ugyanazzal az azonosítóval. CRM+n8n kiesésnél nincs sikerjelzés mentés nélkül. CRM siker és értesítési hiba esetén a lead állapota különválik az értesítés állapotától, így nem keletkezik új üzleti rekord.

## 9. Google Ads, GA4 és hozzájárulás

Egy közös GTM-betöltést és egy GA4-konfigurációt javasolunk. A meglévő `G-8ZCCREN6X4` tulajdon használata hozzáférés- és folytonosságellenőrzés után véglegesíthető. A GTM/Ads azonosító még nincs megadva. A látványterv nem küld mérési eseményeket.

| Esemény | Kiváltás | Paraméterek | Konverziós szerep |
|---|---|---|---|
| `page_view` | Egy valódi oldalváltás | Tisztított URL, oldalazonosító | Forgalom |
| `view_service` | Szolgáltatásoldal megtekintése | `service_slug` | Diagnosztika |
| `form_start` | Első mezőinterakció, űrlapfolyamatonként egyszer | `form_id`, `form_type` | Másodlagos |
| `form_step_complete` | Freedom Air lépés sikeres befejezése | `step_number`, `form_id` | Másodlagos |
| `lead_partial` | Részleges CRM-mentés visszaigazolása | Véletlen azonosító, `form_id` | Nem teljes lead |
| `generate_lead` | Végleges tartós rögzítés után egyszer | `event_id`, `form_id`, `service_slug` | Elsődleges online lead |
| `click_phone`, `click_email` | Kattintás | Kapcsolati cél típusa, oldal | Másodlagos; nem igazolt beszélgetés |
| `file_download`, videóesemények | Valódi letöltés/lejátszás | Tartalomazonosító | Másodlagos |
| Minősített lead / értékesítés | CRM-státuszváltozás | Engedélyezett attribúció, belső deduplikáció | Későbbi offline Ads-import |

Javasolt induló Ads-beállítás: a hitelesített online lead egyetlen elsődleges konverziós forrásból érkezzen, leadtípusnál „egy” számlálási beállítással. Ugyanazt ne importáljuk elsődlegesként GA4-ből és közvetlen tagből is. A minősített lead kezdetben másodlagos megfigyelés; stabil CRM-visszacsatolás után válhat optimalizálási céllá, dokumentált átállással.

**Attribúció:** UTM-ek, `gclid`, `gbraid`, `wbraid`; azonos allowlist a kliensen, szerveren és CRM-ben. A választott hozzájárulási állapot szabályozza a tárolást és továbbítást. Név, e-mail, telefon, pecsétszám, szabad szöveg és páciensadat nem kerülhet GA4-eventbe vagy URL-be. A puszta hash nem tesz egy adatot általános analitikai mezővé.

**Cookie-panel:** „Csak szükségesek”, „Összes elfogadása”, „Beállítások” azonosan könnyen elérhető. Külön analitikai és marketingkategória. Induláskor a Consent Mode v2 mind a négy kapcsolója denied, még a tagek előtt. Javasolt alap: hozzájárulás előtt a nem szükséges tagek blokkolva; bármilyen cookieless/advanced működés külön döntés. A Meta Pixel/CAPI és a kattintásazonosítók tárolása is követi a választást. Visszavonás a láblécből, külső videó/térkép csak a megfelelő engedéllyel.

**Hirdetési céloldalak:** labor-együttműködés → főoldal vagy megfelelő szolgáltatás; All-on-X → implantátumos oldal; OXO → szakmai OXO; Freedom Air → `/FreedomaAir`. Páciensforgalom saját oldalra és saját CRM-besorolásba kerüljön.

## 10. SEO és AI-keresési terv

Minden indexelhető oldal saját keresési szándékot, egy H1-et, egyedi title/description mezőt, abszolút canonicalt, magyar nyelvjelölést és megosztási képet kap. Az [oldalterv.csv](oldalterv.csv) tartalmazza az egyedi javaslatokat. A keresőknek szánt szöveg az első HTML-válaszban olvasható lesz; a prototípus noindex jelölése nem kerül át véletlenül élesbe.

**Entitások:** `https://meshdent.hu/#organization` a MeshDent Kft. közös azonosítója; ugyanaz a cégnév, cím és elérhetőség jelenik meg az oldalakon és a JSON-LD-ben. `Organization`/megfelelő `LocalBusiness`, `WebSite`, `WebPage`, `BreadcrumbList`; szolgáltatásoldalon `Service`, a MeshDent mint szolgáltató. Nem használunk `Dentist` típust egy igazolatlan rendelőszerepre. Freedom Airhez `Product` csak a tényleges gyártó-/modelladatokkal; kitalált ár, készlet vagy értékelés nélkül. `VideoObject` csak hozzáférhető videó és ellenőrzött metaadatok esetén.

**AI-keresésben idézhető szerkezet:** minden szolgáltatás elején közvetlen, önmagában érthető válasz arra, mi ez, kinek szól és hogyan kapcsolódik hozzá a MeshDent. Ezután világos folyamat, anyag, feltételek és elérhetőség. A szakmai számadat mellett a forrás és a mérési feltétel; az OXO és Freedom Air külön fogalom. Valós szakmai ellenőrző neve és tényleges módosítási dátum, amikor ezek rendelkezésre állnak. Rövid, látható FAQ, nem mesterségesen gyártott kulcsszólista.

Az `llms.txt` legfeljebb opcionális, karbantartott oldaljegyzék; nem rangsorolási garancia és nem helyettesíti a HTML-t. A robots-szabályoknál a keresési hozzáférés és a tréningcélú robotok kezelése külön döntés; nem tiltjuk le véletlenül a kívánt keresőket egy közös wildcarddal. AI-találatot, rich resultot vagy helyezést nem lehet garantálni.

**Migráció:** kiinduló URL-leltár → egyenkénti 200/301-térkép → canonical/sitemap/robots → belső linkek → Search Console → indulás utáni indexelés és 404-ek figyelése. A korábbi Freedom Air aldomainről átirányítás csak az új útvonal működésének igazolása után. A régi köszönőoldal személyes queryadatait nem továbbítjuk. A tartalmi `lastmod` valódi változást jelez, nem minden build időpontját.

## 11. Technikai felépítés és teljesítmény

Javasolt megvalósítás: a már használt Next.js App Router + React + TypeScript folytatása. A konkrét támogatott framework-verziót a fejlesztés kezdetén dependency audit alapján rögzítjük; a jelenlegi 15.5.15 nem automatikus frissességi ajánlás. A kutatási archívum marad külön, az éles `public/` csak a kiválasztott médiaanyagokat tartalmazza.

```text
app/
  layout.tsx                    közös html, consent és egyszeri mérési keret
  (main)/layout.tsx              MeshDent fejléc és lábléc
  (main)/page.tsx                főoldal
  (main)/[megőrzött útvonalak]/   szolgáltatások, cég, referenciák, kapcsolat
  (freedom)/FreedomaAir/         változatlan landing-komponensek
  api/contact/                  általános és OXO érdeklődők
  api/lead/                     meglévő Freedom Air szerződés
content/                        ellenőrzött, verziózott oldaltartalom
components/site/                új honlap komponensei
components/freedom/             megtartott landing komponensei
lib/crm/                        mezőtérképek, idempotencia, hibakezelés
lib/measurement/                hozzájárulás, attribúció, eseménysémák
public/media/                   kiválasztott, optimalizált képek
```

A route-csoport önmagában nem CSS-határ: a globális reseteket, Tailwind-szabályokat és változókat külön gyökérosztályhoz/CSS-modulhoz kell kötni, vagy külön root layout stratégiát választani és route-váltásokkal is ellenőrizni. A közös betűk nem írhatják felül a Freedom Air meglévő három betűcsaládját.

**Teljesítménycélok:** mobilos 75. percentilis LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1. Ezek még nem mért eredmények. Egy kiemelt hero-kép kap prioritást; minden más kép méretezett, lazy. Javasolt első képernyős képbüdzsé 250–400 KB, első oldalbetöltés legfeljebb kb. 1,5 MB a hozzájárulás utáni külső eszközök nélkül. AVIF/WebP + fallback, `srcset` és rögzített szélesség/magasság; fontok saját tárhelyen. A prototípus a forrásképek változatlan másolatával dolgozik, nem teljesítménybenchmark.

**Akadálymentesség:** WCAG 2.2 AA cél; ellenőrzött szövegkontraszt, skip link, látható fókusz, helyes címsorok, billentyűzetes menü és galéria, labellel ellátott mezők, szöveges hibák, képernyőolvasós állapotjelzés. 320–1440+ px közötti elrendezések, 200% nagyítás és reduced motion ellenőrzése.

## 12. Megvalósítási sorrend és készültségi feltételek

| Szakasz | Eredmény | Ellenőrzés |
|---|---|---|
| 1. Alap és designrendszer | Route-ok, tipográfia, közös navigáció, reszponzív elemek | Mobil/asztali rács, billentyűzet, kontraszt |
| 2. Tartalmi oldalak | Főoldal, 5 szolgáltatás, OXO, Rólunk, galéria, partnerek, kapcsolat, páciens- és Instagram-oldal | Minden régi tartalmi blokk megfeleltetése, képek és linkek |
| 3. Freedom Air beillesztése | Meglévő landing az új útvonalon | Forrásoldallal desktop/mobil vizuális összehasonlítás, horgonyok és média |
| 4. CRM és hozzájárulás | Külön forgalmi típusok, hiteles siker, token/resume, visszavonható hozzájárulás | Mockolt hibák, duplaküldés, részleges→végső, majd kijelölt tesztfolyamat |
| 5. Mérési és keresési réteg | GA4/Ads események, metadata, schema, sitemap, redirectek | Tag Assistant/DebugView, Ads diagnosztika, schema és URL-ellenőrzés |
| 6. Átadás | Tartalom véglegesítve, élesítésre kész build | Teljes route-leltár, valódi mobilos teljesítmény, 404, adatvédelmi/céges szöveg |

**Még szükséges végleges adatok:** eredeti logó; hiteles cégadatok; nyilvános e-mail egységesítése; 24 órás és ingyenes ajánlat feltételei; OXO/Freedom Air műszaki eltérések; publikálható PDF; általános/OXO CRM-mezőtérkép és értesítési címzettek; Google fiókazonosítók; végleges adatkezelés; partnerlista aktualitása. Ezek a hiányok nem akadályozzák a design és az oldalak megépítését, de az érintett éles funkciók/tartalmak lezárásához kellenek.

## 13. A mostani átadás határa

Elkészült: teljes információs és vizuális terv, oldalankénti keresési cél és metaadatjavaslat, képválogatás eredettel, helyi kattintható prototípus a fő honlaphoz, külön Freedom Air illesztési lap. A prototípusban működő menü, referenciaszűrés, képnagyítás és helyi űrlap-visszajelzés van. Az űrlap nem továbbít adatot; ezt kitöltés előtt jelzi. A jogi szövegek helye vázlatként szerepel.

Éles Next.js-átültetés, CRM-bekötés, mérőkód-aktiválás, GitHub-push és telepítés nem része ennek a tervezési átadásnak. A böngészős megjelenítés ellenőrzési státusza a mellékelt `ELLENORZES.md` fájlban szerepel.

## Források

- [Kutatási összefoglaló](../../research/2026-10-21/KUTATASI-OSSZEFOGLALO.md)
- [Tartalmi pillanatképek](../../research/2026-10-21/content/)
- [CRM és mérési forrásaudit](../../research/2026-10-21/TECHNIKAI-ES-MERESI-TERV.md)
- [Ellenőrizendő adatok](../../research/2026-10-21/ELLENORIZENDO-ADATOK.md)
- [Instagram-import](../../research/2026-10-21/INSTAGRAM-IMPORT.md)
- [Meglévő Freedom Air oldal](https://meshdent.vercel.app/)
