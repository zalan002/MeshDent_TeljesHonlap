import type { Metadata } from "next";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import LeadForm from "@/components/LeadForm";
import Nav from "@/components/Nav";

const SITE_URL =
  process.env.SITE_URL || "https://meshdentteljeshonlap.vercel.app";

const FORRAS = "meshdent-freedomair-page";

export const metadata: Metadata = {
  title:
    "Freedom Air — több, mint szkennelés. Az All-on-X specialistája.",
  description:
    "A Freedom Air intraorális szkenner és valódi fotogrammetria egyetlen 145 grammos eszközben. 10 µm pontosság, 30 mm szkennelési mélység, egy szoftver. Kérj ingyenes esetbemutatót!",
  alternates: { canonical: `${SITE_URL}/FreedomaAir` },
  openGraph: {
    title:
      "Freedom Air — több, mint szkennelés. Az All-on-X specialistája.",
    description:
      "Valódi fotogrammetria + intraorális szkenner egy 145 g-os eszközben. 10 µm pontosság, 30 mm szkennelési mélység, egy szoftver az All-on-X esetekre.",
    url: `${SITE_URL}/FreedomaAir`,
    locale: "hu_HU",
    siteName: "Meshdent Freedom Air",
    type: "website",
    images: [
      {
        url: "/images/freedomair/banner.png",
        width: 1600,
        height: 900,
        alt: "Freedom Air intraorális szkenner",
      },
    ],
  },
  robots: { index: process.env.SITE_INDEXABLE === "true" && !SITE_URL.includes(".vercel.app"), follow: true },
};

const FAQ_ITEMS = [
  {
    q: "Meg kell vásárolnom az eszközt a kipróbálás után?",
    a: "Nem feltétlenül. A Freedom Air elérhetőségével kapcsolatban több konstrukció is szóba jöhet, beleértve a kihelyezési vagy együttműködési lehetőségeket is.",
  },
  {
    q: "Miben más, mint egy hagyományos intraorális szkenner?",
    a: "A Freedom Air nemcsak intraorális szkennelésre alkalmas, hanem fotogrammetriai funkcióval is támogatja az implantációs workflow-t. A DOF saját PIM (Precise Implant Measurement) technológiájával egyetlen képkockán, szájon kívülről rögzíti az összes scan body pozícióját — ezzel kiváltja a stitching-alapú szkennerek képkockánkénti torzulását.",
  },
  {
    q: "Kinek ajánlott az eszköz?",
    a: "Elsősorban olyan fogorvosoknak, implantológusoknak és rendelőknek, akik pontosabb, gyorsabb és digitálisan jobban integrálható megoldást keresnek.",
  },
  {
    q: "Mit jelent a 10 µm pontosság?",
    a: "Tíz mikronos pontosságot jelent a scan body-k egymáshoz viszonyított pozíciójának rögzítésében. Az All-on-X körhidaknál ez a passzív fittért felelős nagyságrend — a független akkreditált mérési jegyzőkönyv letölthető a vásárlás előtti dokumentációs csomagban.",
  },
  {
    q: "Mennyit nyom az eszköz, és mennyire kényelmes?",
    a: "A Freedom Air handpiece + tip tömege mindössze 145 g — a piac egyik legkönnyebb szkennere. A 18,5 × 15 mm-es Normal Tip és a 10 × 9 mm-es Small Tip is kapható, így gyermek- vagy szűk szájméretű pácienseknél is komfortos a használat.",
  },
  {
    q: "Hány alkalommal sterilizálható a tip?",
    a: "A tipek 150 sterilizálási ciklust bírnak. A handpiece anti-fog rendszerrel, fehér és kék LED megvilágítással, valamint integrált D-Pad vezérléssel érkezik — minden klinikai környezetben kényelmesen üzemeltethető.",
  },
  {
    q: "Milyen gép kell hozzá?",
    a: "Ajánlott konfiguráció: Intel 14. gen. i9 (vagy Ultra 7/9), NVIDIA RTX 4060 vagy magasabb (min. 8 GB VRAM), 32 GB RAM, 1 TB SSD, Windows 10/11 64-bit. A telepítést a Meshdent csapata átadáskor elvégzi.",
  },
  {
    q: "Mi van benne a dobozban?",
    a: "FREEDOM Air handpiece, Normal Tip, Small Tip, asztali- és falitartó, tisztítópálcák, USB-pendrive, C–C és A–B kábel. A PIM KIT külön csomagolva: PIM Guide Tool és All-on-X gyakorló-modell.",
  },
  {
    q: "Hogyan próbálhatom ki éles esetben?",
    a: "Kérj ingyenes esetbemutatót a saját rendelődbe. A Meshdent két szakembere — Richárd vagy János — kimegy hozzád előre egyeztetett időpontban, és a saját pácienseddel mutatjuk be a PIM workflow-t.",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebPage", name: "DOF Freedom Air", url: `${SITE_URL}/FreedomaAir`, inLanguage: "hu-HU", isPartOf: { "@id": `${SITE_URL}/#website` } },
    { "@type": "FAQPage", mainEntity: FAQ_ITEMS.map(item => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })) },
    { "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "MeshDent", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "DOF Freedom Air", item: `${SITE_URL}/FreedomaAir` }
    ] }
  ]
};

export default function FreedomAirLanding() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <Nav />

      <main id="tartalom">
        {/* HERO — full-bleed product image with overlay + form */}
        <section className="fa-hero-bleed" aria-label="Freedom Air bemutató">
          <picture>
            <source
              media="(max-width: 640px)"
              srcSet="/images/freedomair/main_mobile.png"
            />
            <source
              media="(max-width: 1024px)"
              srcSet="/images/freedomair/main_tablet.png"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/freedomair/main.png"
              alt="Freedom Air intraorális szkenner"
              className="fa-hero-bleed__bg"
              loading="eager"
            />
          </picture>
          <div className="container fa-hero-bleed__overlay">
            <div className="fa-hero-bleed__copy">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/freedomair/dof_logo.svg"
                alt="DOF — gyártói logó"
                className="fa-hero-bleed__brand"
                loading="eager"
              />
              <h1 className="fa-hero-bleed__title">
                <span className="fa-hero-bleed__title-main">FREEDOM</span>
                <span className="fa-hero-bleed__title-accent">Air</span>
              </h1>
              <p className="fa-hero-bleed__subtitle">
                Intraorális szkennelés és Fotogrammetria egy eszközben.
              </p>
              <ul className="fa-hero-bleed__pills" aria-label="Kihelyezési feltételek">
                <li>Beruházási költség nélkül</li>
                <li>Kihelyezés a saját rendelődbe</li>
                <li>Hosszútávú szakmai support</li>
              </ul>
            </div>

            <aside id="urlap" className="hero__form-card fa-hero-bleed__form">
              <span className="pill pill--accent">Kihelyezés · Időpont-egyeztetés</span>
              <h2>Kérj ingyenes kipróbálási lehetőséget!</h2>
              <p>
                A Freedom Airt beruházási költség nélkül helyezzük ki a
                rendelődbe — mellé szakmai supporttal, ahol a közös cél a
                sikeres munkák.
              </p>
              <LeadForm
                forras={FORRAS}
                contentName="Freedom Air esetbemutató"
                contentCategory="Freedom Air landing — All-on-X"
              />
            </aside>
          </div>
        </section>

        {/* INTRO — rövid value prop + CTA */}
        <section className="fa-intro">
          <div className="fa-intro__bg" aria-hidden />
          <div className="container">
            <div className="fa-intro__copy">
              <h2 className="fa-intro__title">
                Bővítse fogászatát <em>a legjobbal!</em>
              </h2>
              <div className="fa-intro__banner">
                <video
                  className="fa-intro__video"
                  src="/videos/freedom-air-demo.mp4"
                  poster="/images/freedomair/photogrammetry_banner.png"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-label="Freedom Air fotogrammetria bemutató videó"
                />
              </div>
              <p className="fa-intro__lead">
                10 µm pontosság! · 30 mm szkennelési mélység · 145 g súly — mérnöki szinten.
              </p>

              <div className="fa-intro__cta-row">
                <a className="btn btn--primary" href="#urlap">
                  Kérek ingyenes esetbemutatót
                </a>
                <a className="btn btn--ghost" href="#parameterek">
                  Műszaki paraméterek
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* PARTNERSHIP — scanner kihelyezés */}
        <section id="kihelyezes" className="section fa-partner-section">
          <div className="container">
            <div className="fa-partner">
              <div className="fa-partner__head">
                <span className="pill pill--accent">Kihelyezési konstrukció</span>
                <h2 className="fa-partner__title">
                  A scannert <em>beruházás nélkül</em> kapod meg —
                  a sikeres munkák a közös célunk.
                </h2>
                <p className="fa-partner__lead">
                  Nem klasszikus eszközértékesítés, hanem hosszútávú, gördülékeny
                  együttműködés. A Freedom Airt kihelyezzük a rendelődbe, és olyan
                  szakmai supportot kapsz mellé, ahol a közös cél a munkáid sikeres
                  végkifejlete — nem „csak" egy szkenner átadása.
                </p>
              </div>
              <div className="fa-partner__grid">
                <article className="fa-partner__card">
                  <div className="fa-partner__num">01</div>
                  <h3>Zéró kezdő beruházás</h3>
                  <p>
                    A Freedom Air rendelőbe-kihelyezési konstrukcióban érhető el —
                    előzetes beruházási kötelezettség nélkül indulhatsz.
                  </p>
                </article>
                <article className="fa-partner__card">
                  <div className="fa-partner__num">02</div>
                  <h3>Hosszútávú együttműködés</h3>
                  <p>
                    Nem egyszeri eladás, hanem napi szintű támogatás a
                    workflow-integrációtól az éles eseteken át a fogtechnikai
                    átadásig.
                  </p>
                </article>
                <article className="fa-partner__card">
                  <div className="fa-partner__num">03</div>
                  <h3>Közös cél: a sikeres eset</h3>
                  <p>
                    A támogatás nem opció, hanem a kihelyezési modell része —
                    a Te sikered a mi sikerünk.
                  </p>
                </article>
              </div>
              <div className="fa-partner__cta">
                <a className="btn btn--primary" href="#urlap">
                  Kérek kihelyezési ajánlatot
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ALL-IN-ONE & 3D DATA */}
        <section className="section section--soft">
          <div className="container">
            <div className="section__head">
              <p className="section__eyebrow">Egy eszköz — egy folyamat</p>
              <h2 className="section__title">
                Pontosság és innováció — egyetlen eszközben.
              </h2>
              <p className="section__lead">
                Egy adatfolyam, egy szoftver, egy felhasználói felület. Nincs
                köztes konvertálás, nincs külön scan body-fűzős munkafázis —
                csak tiszta, mérnöki workflow.
              </p>
            </div>
            <div className="fa-dual">
              <figure className="fa-dual__col">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/freedomair/all_in_one.svg"
                  alt="All-in-one: PIM és intraorális szkenner egy eszközben"
                />
                <figcaption>
                  <strong>All-in-one workflow</strong>
                  <span>
                    PIM (fotogrammetria) és intraorális szkennelés ugyanazon
                    eszközben, ugyanazon szoftverben.
                  </span>
                </figcaption>
              </figure>
              <figure className="fa-dual__col">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/freedomair/3d_data.svg"
                  alt="Egységes 3D adatfolyam"
                />
                <figcaption>
                  <strong>Egységes 3D adatfolyam</strong>
                  <span>
                    A szkennelt felületek közvetlen és egyszerű küldése
                    Communicate-en keresztül.
                  </span>
                </figcaption>
              </figure>
            </div>

            <div className="fa-pim-scan">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/freedomair/pim_scanning.png"
                alt="Freedom Air klinikai használat közben"
              />
            </div>
          </div>
        </section>

        {/* PIM SOLUTION */}
        <section className="section">
          <div className="container">
            <div className="section__head">
              <p className="section__eyebrow">Beyond Scan · Game Changer</p>
              <h2 className="section__title">
                Precise Implant Measurement — pontos implantátum-mérés.
              </h2>
              <p className="section__lead">
                A DOF saját PIM technológiája dedikált PIM-vezetővel és kiterjesztett
                megvilágítási lencsével dolgozik. A szkennelési területet úgy
                bővíti, hogy egyszerre több scan body-t lát a szájon kívülről —
                stitching nélkül, mikronpontosan ismeri fel az implantátum-pozíciókat.
                Ez a DOF nagy pontosságú megoldása All-on-X esetekre.
              </p>
            </div>

            <div className="fa-pim-hero">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/freedomair/Munkafolyamat.png"
                alt="Freedom Air munkafolyamat: kiindulási állapot, antagonista, harapás rögzítése, gingiva, extraorális fotogrammetria"
              />
            </div>

            <div className="fa-compare">
              <article className="fa-compare__col fa-compare__col--bad">
                <header>
                  <span className="fa-compare__tag">Más gyártók szkennerei</span>
                  <h3>Stitching-alapú szkennelés</h3>
                </header>
                <div className="fa-compare__imgpair">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/freedomair/pim_other.png"
                    alt="Hagyományos stitching alapú szkennelés"
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/freedomair/pim_other_2.jpg"
                    alt="Hasonló elven működő, intraorális fotogrammetriás scanbody-megoldás"
                  />
                </div>
                <ul>
                  <li>Távoli implantátumoknál gyakran kapitulál</li>
                  <li>Képek összeillesztéséből adódó pontatlanság</li>
                  <li>Magas arányú publikált pontatlanság All-on-X eseteknél</li>
                </ul>
              </article>

              <article className="fa-compare__col fa-compare__col--good">
                <header>
                  <span className="fa-compare__tag">Freedom Air · PIM</span>
                  <h3>Fotogrammetria-alapú szkennelés</h3>
                </header>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/freedomair/pim_dof.png"
                  alt="Freedom Air PIM fotogrammetria"
                />
                <ul>
                  <li>Egyetlen képben rögzíti az összes implantátumot</li>
                  <li>Garantált mikron pontos szkennelési precizitás</li>
                  <li>Távoli implantátumok sem okoznak soha gondot</li>
                </ul>
              </article>
            </div>

            <div className="fa-compare__matrix">
              <div className="fa-compare__row fa-compare__row--head">
                <span>Szempont</span>
                <span>Más szkennerek</span>
                <span>Freedom Air</span>
              </div>
              <div className="fa-compare__row">
                <span>Szkennelési módszer</span>
                <span>Stitching vagy Intraorális Fotogrammetria</span>
                <span>Extraorális Fotogrammetria (PIM)</span>
              </div>
              <div className="fa-compare__row">
                <span>Szkennelési terület</span>
                <span>Szűk, scanbodyról scanbodyra scannel</span>
                <span>Széles, egyetlen képben látja az implantokat</span>
              </div>
              <div className="fa-compare__row">
                <span>Scan body felismerés</span>
                <span>Forma és összefűzés alapján</span>
                <span>Dedikált pattern alapján</span>
              </div>
              <div className="fa-compare__row">
                <span>Pontosság</span>
                <span>Változó, torzulás-érzékeny</span>
                <span>10 µm — garantált mérnöki szint</span>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="section">
          <div className="container">
            <div className="section__head">
              <p className="section__eyebrow">Funkciók</p>
              <h2 className="section__title">
                Minden részlet a klinikai komfortért tervezve.
              </h2>
            </div>

            <div className="fa-features">
              <article className="fa-feature">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/freedomair/feature_light_weight.svg"
                  alt="145 g ultrakönnyű kialakítás"
                />
                <h3>Ultrakönnyű — mindössze 145 g</h3>
                <p>
                  Komfortos kezelhetőség, kiváló handling. Hosszú szkennelési
                  fázisokban is fáradtság nélkül használható.
                </p>
              </article>

              <article className="fa-feature">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/freedomair/feature_accuracy_result.svg"
                  alt="Egy szkennelés, tökéletes eredmény"
                />
                <h3>Egy szkennelés — tökéletes eredmény</h3>
                <p>
                  18,5 × 15 mm-es széles szkennelési terület. Egyetlen lendülettel
                  rögzíti az All-on-X scan body-kat.
                </p>
              </article>

              <article className="fa-feature">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/freedomair/feature_smart_memo.svg"
                  alt="Smart hang-jegyzet AI-val"
                />
                <h3>Okos jegyzetek AI hangfelismeréssel</h3>
                <p>
                  Klinikai környezetre szabott voice memo. Megjegyzés szóban,
                  a szoftver bediktálja a páciensanyagba.
                </p>
              </article>

              <article className="fa-feature">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/freedomair/feature_dpad_control.svg"
                  alt="D-Pad vezérlés"
                />
                <h3>Intuitív D-Pad vezérlés</h3>
                <p>
                  Kényelmes, higiénikus használat — minden funkció elérhető a
                  handpiece-en, érintőképernyő nélkül is.
                </p>
              </article>

              <article className="fa-feature">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/freedomair/feature_led_indicator.svg"
                  alt="LED státuszjelzés"
                />
                <h3>Intuitív LED-státuszjelzés</h3>
                <p>
                  A szkenner állapota és a kapcsolat egy pillantással
                  ellenőrizhető — gyors és átlátható.
                </p>
              </article>

              <article className="fa-feature fa-feature--accent">
                <div className="fa-feature__num">06</div>
                <h3>Anti-fog rendszer</h3>
                <p>
                  Beépített páramentesítés. Hosszú szkennelési fázisok alatt sem
                  ködösödik a tip — egyenletes képminőség a teljes körhidnál.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* SLIDE SHOW (két kulcs-feature) */}
        <section className="section section--soft">
          <div className="container">
            <div className="section__head">
              <p className="section__eyebrow">Highlight</p>
              <h2 className="section__title">
                Mély szkennelés és pontos okklúzió — egy eszközben.
              </h2>
            </div>

            <div className="fa-slides">
              <article className="fa-slide">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/freedomair/scan_depth_30mm.svg"
                  alt="30 mm szkennelési mélység"
                />
                <h3>30 mm szkennelési mélység</h3>
                <p>
                  Mélyebb régiókat is biztonsággal rögzít — különösen hasznos
                  preparált csonkoknál és komplex protetikai eseteknél.
                </p>
              </article>
              <article className="fa-slide">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/freedomair/scan_occlusion.svg"
                  alt="Pontos okklúzió szkennelés"
                />
                <h3>Pontos okklúzió-szkennelés</h3>
                <p>
                  Megbízható harapás rögzítése — a fogtechnikus kompromisszum
                  nélkül kezdheti a tervezést.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* COMPONENTS */}
        <section className="section">
          <div className="container">
            <div className="section__head">
              <p className="section__eyebrow">Komponensek</p>
              <h2 className="section__title">Mit kapsz a dobozban?</h2>
              <p className="section__lead">
                Minden, ami a klinikai indításhoz kell — a PIM Kit külön
                csomagolva, gyakorló-modellel.
              </p>
            </div>

            <div className="fa-components">
              <div className="fa-components__image">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/freedomair/component_kits.svg"
                  alt="Freedom Air dobozos komponensek"
                />
              </div>
              <div className="fa-components__lists">
                <article>
                  <h3>Termék-komponensek</h3>
                  <ol>
                    <li>FREEDOM Air handpiece</li>
                    <li>Normal Tip</li>
                    <li>Small Tip</li>
                    <li>Asztali tartó</li>
                    <li>Fali tartó</li>
                    <li>Tisztító-vatta</li>
                    <li>USB pendrive</li>
                    <li>C–C kábel</li>
                    <li>A–B kábel</li>
                  </ol>
                </article>
                <article>
                  <h3>PIM KIT komponensek</h3>
                  <ol>
                    <li>PIM KIT</li>
                    <li>PIM Guide Tool</li>
                    <li>All-on-X gyakorló-modell</li>
                  </ol>
                </article>
              </div>
            </div>
          </div>
        </section>

        {/* SPECIFICATION */}
        <section id="parameterek" className="section section--soft">
          <div className="container">
            <div className="section__head">
              <p className="section__eyebrow">Műszaki paraméterek</p>
              <h2 className="section__title">Specifikáció</h2>
              <p className="section__lead">
                Mérnöki adatok, ahogy a gyártói adatlapon szerepelnek.
              </p>
            </div>

            <div className="fa-spec">
              <div className="fa-spec__image">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/freedomair/spec.svg"
                  alt="Freedom Air méretvázlat"
                />
              </div>

              <div className="fa-spec__tables">
                <article className="fa-spec__table">
                  <h3>Szkennelési technológia</h3>
                  <dl>
                    <div>
                      <dt>Termék neve</dt>
                      <dd>FREEDOM Air</dd>
                    </div>
                    <div>
                      <dt>Kamera felbontás</dt>
                      <dd>1920 × 1200 pixel</dd>
                    </div>
                    <div>
                      <dt>Szkennelési mélység</dt>
                      <dd>30 mm</dd>
                    </div>
                    <div>
                      <dt>Pontosság</dt>
                      <dd>10 µm</dd>
                    </div>
                    <div>
                      <dt>Anti-fog</dt>
                      <dd>Igen</dd>
                    </div>
                    <div>
                      <dt>Fényforrás</dt>
                      <dd>LED (fehér, kék)</dd>
                    </div>
                    <div>
                      <dt>Export-formátum</dt>
                      <dd>PLY, STL</dd>
                    </div>
                  </dl>
                </article>

                <article className="fa-spec__table">
                  <h3>Szkenner handpiece</h3>
                  <dl>
                    <div>
                      <dt>Méret (handpiece + tip)</dt>
                      <dd>219 × 35 × 36,6 mm (kábel nélkül)</dd>
                    </div>
                    <div>
                      <dt>Tömeg (handpiece + tip)</dt>
                      <dd>145 g</dd>
                    </div>
                    <div>
                      <dt>Csatlakozás</dt>
                      <dd>USB 3.2 Gen 1</dd>
                    </div>
                  </dl>
                </article>

                <article className="fa-spec__table">
                  <h3>Tip</h3>
                  <dl>
                    <div>
                      <dt>Tip mérete</dt>
                      <dd>
                        Normal: 25 × 19,9 mm
                        <br />
                        Small: 16,3 × 13,5 mm
                      </dd>
                    </div>
                    <div>
                      <dt>Látószög</dt>
                      <dd>
                        Normal: 18,5 × 15 mm
                        <br />
                        Small: 10 × 9 mm
                      </dd>
                    </div>
                    <div>
                      <dt>Sterilizálhatóság</dt>
                      <dd>Akár 150 ciklus</dd>
                    </div>
                  </dl>
                </article>

                <article className="fa-spec__table">
                  <h3>Ajánlott rendszerkövetelmények</h3>
                  <dl>
                    <div>
                      <dt>CPU</dt>
                      <dd>
                        Intel 14. gen. i9 vagy magasabb · Intel Ultra 7 &amp; Ultra 9
                      </dd>
                    </div>
                    <div>
                      <dt>Videokártya</dt>
                      <dd>
                        NVIDIA RTX 4060 vagy magasabb, RTX 50XX széria (min. 8 GB
                        VRAM). Driver: 576.80+ (Studio Driver).
                      </dd>
                    </div>
                    <div>
                      <dt>RAM</dt>
                      <dd>Minimum 32 GB</dd>
                    </div>
                    <div>
                      <dt>HDD / SSD</dt>
                      <dd>Min. 1 TB SSD (DRAM-os ajánlott), min. 150 GB szabad hely</dd>
                    </div>
                    <div>
                      <dt>OS</dt>
                      <dd>Windows 10 / 11 (64 bit)</dd>
                    </div>
                  </dl>
                </article>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST */}
        <section className="section">
          <div className="container">
            <div className="trust">
              <div>
                <p className="pill">Magyarországi forgalmazás · Meshdent</p>
                <h3>
                  Fogtechnikusok forgalmazzák, akik napi szinten ebben dolgoznak.
                </h3>
                <p>
                  Évek óta a digitális fogászati workflow-ban élünk —
                  gyakorlatilag minden piacon lévő szkenner fájljait kezeljük.
                  Ezért nemcsak eladjuk a Freedom Airt, hanem támogatjuk a
                  betanulást, a workflow-integrációt és a napi munkát.
                </p>
                <ul className="trust__highlights">
                  <li>Magyar nyelvű support és teljes szakmai háttér</li>
                  <li>Élő esetbemutató a saját rendelődben</li>
                  <li>
                    2 napos szakmai oktatás All-on-X munkákhoz nemzetközileg
                    elismert szájsebészektől
                  </li>
                  <li>Folyamatos technikai támogatás</li>
                </ul>
              </div>
              <aside className="trust__visual">
                <strong>Két ember, akivel beszélni fogsz:</strong>
                <p style={{ margin: 0, color: "var(--color-ink-soft)" }}>
                  <strong style={{ color: "var(--color-ink)" }}>Richárd</strong>{" "}
                  és{" "}
                  <strong style={{ color: "var(--color-ink)" }}>János</strong> —
                  ők ketten hívnak vissza személyesen, miután kitöltötted az
                  űrlapot. Előre egyeztetett időpontban.
                </p>
              </aside>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section section--soft">
          <div className="container">
            <div className="section__head">
              <p className="section__eyebrow">Gyakori kérdések</p>
              <h2 className="section__title">Amit a kollégák megkérdezni szoktak</h2>
            </div>
            <FAQ items={FAQ_ITEMS} />
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="section">
          <div className="container">
            <div className="final-cta">
              <h2>
                Beyond Scanning — a Freedom Airt élőben, a saját rendelődben.
              </h2>
              <p>
                Foglalj egy ingyenes esetbemutatót. Élesben látod, hogyan dolgozik
                a PIM technológia a saját pácienseden — mielőtt bármit eldöntenél.
              </p>
              <a className="btn btn--primary" href="#urlap">
                Időpontot kérek
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
