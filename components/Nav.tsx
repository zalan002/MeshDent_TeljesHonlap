import Logo from "./Logo";

export default function Nav() {
  return (
    <header className="nav">
      <div className="container nav__inner">
        <Logo />
        <nav className="nav__menu" aria-label="Fő menü">
          <a className="nav__link nav__link--accent" href="#kihelyezes">
            Beruházás nélküli kihelyezés
          </a>
        </nav>
        <a className="btn btn--primary nav__cta" href="#urlap">
          Időpontot kérek
        </a>
      </div>
    </header>
  );
}
