# MeshDent — technikai, CRM-, SEO- és mérési alapkövetelmények

Állapot: forráskód- és tartalomvizsgálaton alapuló megvalósítási terv, 2026-10-21. Éles integrációt és tényleges analitikai adatérkezést ebben a fázisban nem teszteltünk.

## 1. Kiinduló rendszerek

**Fő honlap:** WordPress, BeTheme/Muffin elrendezési nyomok, Contact Form 7 űrlapok, MonsterInsights Google Analytics-integráció, strukturált JSON-LD adatok. Az oldalak egy részének WordPress `content.rendered` mezője üres, mert az elrendezés más módon tárolt; ezért a teljes HTML-mentés szükséges volt.

**Freedom Air:** Next.js 15.5.15 App Router, React 19, TypeScript, Tailwind 4.1.13, Framer Motion 11.15.0. A jelenlegi főoldal a teljes terméklanding. A kódban az alapértelmezett domain `facebookkampany.meshdent.hu`; ezt az új fő domain és a termékútvonal váltja fel a migrációnál.

**Cél:** az új teljes honlap a `MeshDent_TeljesHonlap` repóban; az eredeti landing `/FreedomaAir` alatt, azonos tartalmi és vizuális szerkezettel. Célszerű a meglévő Next.js-alapot továbbvinni. Framework-frissítés külön, ellenőrzött feladat legyen.

## 2. A Freedom Air oldal átemelésének szerződése

| Meglévő elem | Megőrzendő viselkedés | Migrációs feladat |
|---|---|---|
| `app/page.tsx` | Teljes termékoldal, kihelyezési ajánlat, bemutató CTA-k | Átemelés `app/FreedomaAir/page.tsx` alá |
| `components/LeadForm.tsx` | Hét lépés, validáció, visszalépés, részleges mentés, hibák | A vizuális működés megőrzése; általános honlapűrlaptól elkülönített komponens/séma |
| `lib/crm-form.ts` | Token, időkorlát, mezőleképezés, resume, 403 újrapróba | Új domain CORS/engedélyezési ellenőrzés; azonos CRM-szerződés |
| `app/api/lead/route.ts` | Szerveres validáció, n8n továbbítás, CAPI | Maradhat `/api/lead`; a gyökérrel kezdődő API-útvonalat ne írjuk át automatikusan a termékút alá |
| `lib/attribution.ts` | UTM és kattintásazonosítók továbbadása | Teljes honlapra kiterjedő attribúció, consenttel és URL-tisztítással |
| Meta Pixel / CAPI | Közös Lead `event_id`, deduplikáció | Egyszeri közös betöltés; kliens- és szerveres események egyeztetése |
| `public/` média | Képek, SVG-k, videó, brosúrák | Változatlan relatív logika vagy teljes, ellenőrzött útvonalcsere |
| Köszönőoldal | Sikeres beküldés utáni visszajelzés | Javasolt `/FreedomaAir/koszonjuk`; noindex; személynév nélkül az URL-ben |
| Metadata, sitemap, robots | Indexelhető termékoldal, kizárt köszönőoldal | Canonical és OG URL: `https://meshdent.hu/FreedomaAir`; teljes honlap sitemap |

A Freedom Air CSS-e külön hatókört vagy route-csoportot kapjon, hogy a teljes honlap új stílusa ne módosítsa a megtartandó landinget. A főoldal és a Freedom Air navigációjának eltérő céljait tudatosan kell kezelni. Az oldalon belüli `#urlap`, `#kihelyezes`, `#parameterek` célpontok maradjanak működőképesek.

## 3. Meglévő CRM-folyamat

Források: `components/LeadForm.tsx`, `lib/crm-form.ts`, `app/api/lead/route.ts`, `CRM-FORM-INTEGRATION.md`, a vizsgált commiton.

**Mezők:** név, e-mail, telefon, cég/rendelő, pecsétszám, szerep, meghatározó tevékenység.

| Oldali mező | CRM-kulcs |
|---|---|
| `nev` | `last_name` |
| `email` | `email` |
| `telefon` | `phone` |
| `ceg` | `company` |
| `pecsetszam` | `fogorvosi_pecsetszam` — csak számjegyek |
| `szerep` | `milyen_szerepben` |
| `tevekenyseg` | `milyen_munkak_a_meghatarozoak_nalatok` |

A CRM a `partnercrm.leadgensolution.hu` publikus form API-ján működik. Az aktuális form azonosítója a meglévő `lib/crm-form.ts`-ben van; ez nem általános CRM-hozzáférési kulcs.

Folyamat:

1. Render-token lekérése; beküldéskor `_token`, `_ts`, üres honeypot, `_channel: embed`, `_consent` mezők.
2. Minimum 3 másodperces tokenkor kezelése.
3. A telefonlépés után CRM-részleges mentés, illetve `/api/lead` részleges beküldés.
4. A CRM `submission` és `resume` értékének átadása a végső mentésnél, hogy a részleges rekord folytatódjon.
5. CRM 422 esetén javítható mezőhiba, továbbküldés nélkül. 403 esetén egyszeri tokenfrissítés. Más CRM-hiba esetén az n8n-ág megpróbálja a rögzítést.
6. Sikeres `/api/lead` válasz után Pixel Lead és átirányítás. A Pixel/CAPI ugyanazt az eseményazonosítót használja a végső leadnél.

A kód időkorlátokat használ; a teljes CRM-ág 10 másodperces keretet kap. Az n8n webhook válasza blokkoló, a timeoutja 8 másodperc. **A tartalék ág nem feltétlen adatmentési garancia:** ha a CRM és az n8n is hibázik, a lead elveszhet; ha a CRM sikeres, de az n8n hibás, a kliens újrapróbálása duplikációt okozhat. Ezeket a megvalósításkor tartós szerveres idempotenciával és hibakezeléssel kell ellenőrizni. A CAPI mérési célpont, nem CRM-helyettesítő.

A régi főoldali/kapcsolati űrlap mezői: `nev`, `email`, `telefon`, `your-message`. Az OXO és a pácienslanding ezen felül visszahíváskérést (`checkbox-oxo`, igen/nem) is tartalmaz. Ezek nem illeszthetők változtatás nélkül a Freedom Air kötelező céges/szerep/tevékenység sémájára. A teljes honlaphoz külön formazonosító vagy dokumentált CRM-mezőkiosztás és külön `lead_source` szükséges.

## 4. Konfigurációs leltár

A kódban hivatkozott változónevek; az értékeket nem olvastuk ki és az éles beállításukat nem ellenőriztük:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_PRIVACY_URL`
- `NEXT_PUBLIC_META_PIXEL_ID`
- `META_CAPI_ACCESS_TOKEN`
- `META_TEST_EVENT_CODE`
- `N8N_WEBHOOK_URL`
- `N8N_WEBHOOK_SECRET`

A Google-integrációhoz a tényleges fiókválasztás után például GTM-containerazonosító vagy közvetlen GA4-azonosító szükséges. A mérést egyetlen központi integráció kezelje; ne töltődjön be párhuzamosan több azonos GA4-konfiguráció.

## 5. Google és Meta — megfigyelt állapot

- A régi honlap HTML-jében **GA4: `G-8ZCCREN6X4`**, MonsterInsights-integrációval.
- A régi honlap HTML-jében **Meta Pixel: `1850761125382480`**.
- A Freedom Air-kód Meta Pixel-azonosítója környezeti változóból érkezik; nem igazolt, hogy azonos a régi honlapéval.
- GTM-container, Google Ads `AW-` azonosító és Consent Mode v2-megvalósítás a vizsgált forrásokban nem azonosítható.
- A Freedom Air-kód már rögzít `gclid` értéket. Ez önmagában **nem jelent Google Ads-konverziómérést**.
- Attribúció: 30 napos localStorage-élettartam, utolsó paraméterezett érintés; `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `utm_id`, `fbclid`, `gclid`, `msclkid`, `ttclid`, `li_fat_id`; oldal- és referreradatok.
- `gbraid` és `wbraid` nincs a jelenlegi engedélyezett listákban. Bővítéskor a kliens, CRM-mapping és szerveres allowlist együtt módosítandó.

## 6. Javasolt mérési terv

| Esemény | Mikor keletkezzen? | Szerep |
|---|---|---|
| `page_view` | Valódi oldal-/route-megtekintés, egyszer | Alapforgalom |
| `view_service` | Szolgáltatásoldal megtekintése | Érdeklődési terület |
| `form_start` | Első érdemi űrlapinterakció | Másodlagos diagnosztika |
| `form_step_complete` | Sikeres lépésváltás; csak lépésszám/mezőcsoport | Lemorzsolódás, mezőértékek nélkül |
| `lead_partial` | Részleges mentés visszaigazolt eredménye | Másodlagos; ne számítson teljes leadnek |
| `generate_lead` | Végleges üzleti rögzítés visszaigazolása után, egyszer | Elsődleges online konverzió |
| `click_phone` | Telefonhivatkozás kattintása | Másodlagos; a kattintás nem igazolt beszélgetés |
| `click_email` | E-mail-hivatkozás kattintása | Másodlagos |
| `file_download` | Brosúra / esettanulmány / engedélyezett dokumentum letöltése | Másodlagos |
| `video_start`, `video_progress`, `video_complete` | Tényleges lejátszás és küszöbök | Tartalmi érdeklődés |
| CRM minősített lead / értékesítés | CRM-státuszváltozás, későbbi offline import | Hirdetési minőség és üzleti eredmény |

Javasolt, személyes adatot nem tartalmazó paraméterek: `form_id`, `form_type`, `service_slug`, `page_path`, `step_number`, belső véletlen `lead_id`/`event_id`. A Google Ads elsődleges leadkonverziója egyetlen deduplikált forrásból érkezzen; a GA4-import és a közvetlen Ads-tag ne számolja ugyanazt kétszer.

**Ne az elküldésgomb kattintását mérjük sikeres leadnek.** Köszönőoldal-újratöltés vagy URL-megnyitás se hozzon új konverziót. A leadhez tartozó azonosító és a tárolási eredmény alapján lehessen deduplikálni. A CRM-ből később visszaküldhető a minősített érdeklődő és az értékesítés státusza, a hozzájárulás és az attribúciós azonosítók megőrzésével.

## 7. Hozzájárulás és adatfolyam

A Consent Mode v2 induló állapotát a tagek előtt kell beállítani, külön kezelve az `analytics_storage`, `ad_storage`, `ad_user_data`, `ad_personalization` értékeket. A hozzájárulás visszavonása is működjön. Az analitika és reklám hozzájárulása külön kérdés az űrlap adatkezelési tájékoztatójától.

A jelenlegi localStorage-attribúció, a Meta Pixel, a CAPI és a külső térkép-/videóbeágyazás is része az áttekintendő adatfolyamnak. A választott consentmodell szerinti engedélyezést egységesen kell végrehajtani; a hozzájárulási sáv önmagában nem elég.

A jelenlegi `/koszonjuk?nev=…` URL a személynév analitikába jutásának kockázatát hordozza. Az új köszönőoldal URL-je ne tartalmazzon nevet. Az UTM-ekből, URL-ekből és referrerekből is szűrni kell az oda véletlenül bekerülő személyes adatot. Név, e-mail, telefonszám, pecsétszám, szabad szöveges üzenet vagy páciensadat ne kerüljön GA4-eventbe. Enhanced Conversions csak külön, helyesen konfigurált felhasználóiadat-csatornán és megfelelő hozzájárulás esetén használható; nem általános eventparaméterként.

## 8. SEO-migráció

Konkrét megfigyelések a gyűjtött HTML-ben:

- A főoldalon és a kapcsolatoldalon nincs H1; az implantátumos oldalon kettő van. Új oldalanként egy világos főcímet és logikus címsorhierarchiát tervezzünk.
- A legtöbb oldalon már van egyedi cím és meta description. Ezeket leltárból kell továbbvinni és javítani, nem nulláról elveszíteni.
- JSON-LD már van: Organization, WebSite, WebPage, BreadcrumbList. Az Organization neve jelenleg `meshdent.hu`; ezt a tényleges MeshDent-névvel és egységes adatokkal érdemes pontosítani.
- Több kép alt szövege fájlnévszerű (`service9`, rétegnevek), más képeké hiányos. Leíró magyar alt, dekorációnál üres alt szükséges.
- A partneroldalon több HTTP-képhivatkozás van. Az új oldal kizárólag saját HTTPS-es médiaútvonalakat használjon.
- A robots.txt sitemapot hirdet: `/sitemap.xml`, `/sitemap.rss`. A közvetített sitemap-megjelenítés nem adott megbízható URL-listát, ezért az oldalleltár a WordPress REST-re és a HTML-linkekre épül.

Megvalósítás:

1. Stabil régi URL-ek és belső linkek megőrzése, konkrét 301-térkép a ténylegesen változó URL-ekhez.
2. Szerveroldalon elérhető magyar tartalom, egyedi title/description/canonical és megosztási kép.
3. Helyes `lang="hu"`, UTF-8, szemantikus HTML, billentyűzetes használat, jó kontraszt.
4. Teljes XML-sitemap csak indexelhető, canonical, 200-as URL-ekkel; valós módosítási dátumokkal.
5. Köszönőoldal: noindex; API-k és tesztoldalak ne legyenek indexelhető tartalomként kitéve. Éles domainváltáskor a Search Console és az átirányítások ellenőrzése.
6. Strukturált adatok: ellenőrzött Organization/LocalBusiness, Service, BreadcrumbList, szükség szerint Product és VideoObject. A fogtechnikai labor ne kapjon automatikusan fogorvosi rendelőt jelentő típust.
7. Képekből megfelelő AVIF/WebP-változatok, reszponzív méretek, rögzített képarány. Hero képnél prioritás; további képeknél lazy loading. Videó: poszter, mobilos adatforgalom és csökkentett mozgás figyelembevétele.
8. Célértékek: LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1 a valós mobilos használat 75. percentilisén. Ezek célok, a régi oldalról nem mért eredmények.

## 9. AI-keresésekhez használható tartalom

A géppel jól értelmezhető, ellenőrizhető tartalom adja az alapot. AI-találati helyezést vagy idézést nem lehet garantálni.

- Minden szolgáltatásoldal elején rövid válasz: mi ez, kinek szól, mit készít a MeshDent, hogyan indul az együttműködés.
- A meglévő tartalom rendezése világos munkafolyamat-, anyag-, előny- és kapcsolati blokkokba, nagy szövegbővítés nélkül.
- OXO és Freedom Air külön entitásként, pontos fogalmakkal és eltérő műszaki adatokkal.
- Ellenőrzött szakmai felelős, bemutatkozás, valós képesítések és frissítési időpontok.
- Publikálható brosúrákhoz és vizsgálatokhoz hivatkozás; a számadatokhoz mérési körülmények.
- Valós esetleírások a referenciaképekhez: feladat, alkalmazott technológia, folyamat. Hiányzó klinikai adatokat ne találjunk ki a képből.
- Következetes cégnév, cím, telefon, e-mail és `sameAs` kapcsolatok a hivatalos profilokhoz.
- A fontos állítások HTML-szövegként is legyenek elérhetők, ne csak képre írva vagy videóban.
- FAQ csak valós, látható kérdésekkel és válaszokkal. Schema önmagában nem ígér rich resultot. Az `llms.txt` opcionális kiegészítő lehet, nem helyettesíti az indexelhetőséget és nem bizonyított rangsorolási kapcsoló.

## 10. Átadási ellenőrzések a megvalósítás végén

- Desktop és mobil összehasonlítás a megtartandó Freedom Air-oldallal.
- Minden régi tartalmi URL, belső horgony, kép, PDF, videó és CTA ellenőrzése.
- CRM-szerződéstesztek mockolt végponttal: részleges → végső, 422, 403, hálózati hiba, időkorlát, dupla kattintás, újrapróba, párhuzamos beküldés.
- Annak bizonyítása, hogy a részleges és végső leadből egy üzleti rekord keletkezik, és nincs ál-siker CRM+n8n kiesésnél.
- Consent elfogadás/elutasítás/visszavonás; tiltott személyes adatok kizárása.
- GA4 DebugView, Tag Assistant és Ads konverziódiagnosztika; oldalváltás és újratöltés ne duplikáljon.
- Strukturált adatok, robots, sitemap, canonical és átirányítások ellenőrzése.
- Valós teljesítménymérés a működő új oldalon. Éles integrációtesztet csak megkülönböztetett tesztrekorddal, előre kijelölt tesztfolyamatban érdemes végezni.

## Kódforrás

Az összes megállapítás a [Meshdent forráscommit](https://github.com/zalan002/Meshdent/tree/bb4a61168b81b97bf99d0fc3889c2dacbede555c) vizsgálatára vonatkozik. A repó korábbi tesztleírásai előzményadatok; ezek nem ebben a gyűjtési munkafázisban megismételt tesztek.
