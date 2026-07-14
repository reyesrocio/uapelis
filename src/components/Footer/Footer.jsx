export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-logo">
          <svg viewBox="0 0 60 40" fill="none" width="32" height="22">
            <path d="M5 32 Q18 4 30 20 Q42 36 55 8" stroke="#7a5230" strokeWidth="8" strokeLinecap="round" fill="none" />
            <path d="M5 32 Q18 4 30 20 Q42 36 55 8" stroke="#e8822a" strokeWidth="4" strokeLinecap="round" fill="none" strokeDasharray="18 36" />
          </svg>
          <span>UAPelis</span>
        </div>
        <p>
          Datos de{' '}
          <a href="https://www.themoviedb.org" target="_blank" rel="noreferrer">
            TheMovieDB
          </a>{' '}
          · Trailers de YouTube · UAPelis © 2025
        </p>
      </div>
    </footer>
  );
}
