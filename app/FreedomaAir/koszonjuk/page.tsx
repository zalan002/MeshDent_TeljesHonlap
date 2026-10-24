import type { Metadata } from "next";
import Logo from "@/components/Logo";

export const metadata: Metadata = {
  title: "Köszönjük — hamarosan hívunk",
  description:
    "Megkaptuk az időpont-kérésedet. Richard vagy János hamarosan személyesen hív vissza, hogy egyeztessünk.",
  robots: { index: false, follow: false },
};

export default function KoszonjukPage() {
  return (
    <>
      <header className="nav">
        <div className="container nav__inner">
          <Logo />
          <a className="btn btn--ghost nav__cta" href="/">
            Vissza a főoldalra
          </a>
        </div>
      </header>

      <main id="tartalom" className="ty">
        <section className="ty__card">
          <div className="ty__icon" aria-hidden>
            ✓
          </div>
          <h1 className="ty__title">
            Köszönjük az időpont-kérésedet!
          </h1>
          <p className="ty__lead">
            Megkaptuk az adataidat. <strong>Richard vagy János</strong>{" "}
            személyesen — nem call center — hív vissza, hogy
            egyeztessünk egy konkrét időpontot az esetbemutatóra.
          </p>

          <div className="ty__steps">
            <div className="ty__step">
              <span className="ty__step-num">1</span>
              <div>
                <strong>Hamarosan keresünk</strong>
                <span>
                  Munkaidőben jellemzően 24 órán belül felhívunk a
                  megadott telefonszámon. Egy rövid hívásban
                  körüljárjuk, mire szeretnéd használni a Freedom
                  Airt.
                </span>
              </div>
            </div>

            <div className="ty__step">
              <span className="ty__step-num">2</span>
              <div>
                <strong>Egyeztetünk egy időpontot</strong>
                <span>
                  Megbeszéljük, mikor megyünk ki hozzád a rendelőbe.
                  Egy konkrét, élő esetet választunk ki közösen,
                  amelyiken bemutatjuk az eszközt.
                </span>
              </div>
            </div>

            <div className="ty__step">
              <span className="ty__step-num">3</span>
              <div>
                <strong>Élő esetbemutató — a saját rendelődben</strong>
                <span>
                  A saját pácienseddel, a saját workflow-dban látod
                  működés közben. Utána tudjuk megbeszélni a
                  vásárlást és a 2 napos szakmai oktatást is.
                </span>
              </div>
            </div>
          </div>

          <p style={{ color: "var(--color-muted)", fontSize: 14, margin: 0 }}>
            Addig is: ha sürgős kérdésed van, írj a{" "}
            <a href="mailto:hello@meshdent.hu">hello@meshdent.hu</a>{" "}
            címre, vagy nézd meg a fő oldalunkat:{" "}
            <a href="/" target="_blank" rel="noreferrer">
              meshdent.hu
            </a>
            .
          </p>
        </section>
      </main>
    </>
  );
}
