export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div>
          © {year} Meshdent Kft. — Minden jog fenntartva.
        </div>
        <div>
          <a href="/">
            meshdent.hu
          </a>
        </div>
      </div>
    </footer>
  );
}
