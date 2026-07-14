import { useState } from 'react';
import { SECTIONS } from '../../data/constants';
import { useAuth } from '../../hooks/useAuth';
import AuthModal from '../Auth/AuthModal';

function Logo() {
  return (
    <div className="logo">
      <svg className="logo-svg" viewBox="0 0 60 40" fill="none">
        <path
          d="M5 32 Q18 4 30 20 Q42 36 55 8"
          stroke="#7a5230"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M5 32 Q18 4 30 20 Q42 36 55 8"
          stroke="#e8822a"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          strokeDasharray="18 36"
          strokeDashoffset="0"
        />
      </svg>
      <span className="logo-text">
        UA<span className="logo-accent">Pelis</span>
      </span>
    </div>
  );
}

export default function Header({
  scrolled,
  activeSection,
  onSelectSection,
  onSearch,
  onToggleChat,
}) {
  const [query, setQuery] = useState('');
  const [showAuth, setShowAuth] = useState(false);
  const { user, username, signOut } = useAuth();

  function submitSearch() {
    onSearch(query.trim());
  }

  return (
    <header className={`site-header${scrolled ? ' scrolled' : ''}`} id="siteHeader">
      <div className="header-inner">
        <Logo />

        <nav className="nav">
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              className={`nav-btn${activeSection === s.key ? ' active' : ''}`}
              onClick={() => onSelectSection(s.key)}
            >
              {s.label}
            </button>
          ))}
          <button
            className={`nav-btn${activeSection === 'reviews' ? ' active' : ''}`}
            onClick={() => onSelectSection('reviews')}
          >
            Reseñas
          </button>
        </nav>

        <div className="search-wrap">
          <input
            type="text"
            id="searchInput"
            className="search-input"
            placeholder="Buscar película..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submitSearch()}
          />
          <button className="search-btn" onClick={submitSearch}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          <button
            className="btn-primary"
            style={{
              padding: '9px 18px',
              fontSize: 12,
              borderRadius: 30,
              marginLeft: 'auto',
              flexShrink: 0,
            }}
            onClick={onToggleChat}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>{' '}
            CineBot
          </button>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 10, flexShrink: 0 }}>
              <div
                title={username}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  background: 'rgba(232,130,42,0.15)',
                  border: '1px solid rgba(232,130,42,0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-head)',
                  fontSize: 11,
                  fontWeight: 700,
                  color: 'var(--orange)',
                  cursor: 'default',
                }}
              >
                {username.slice(0, 2).toUpperCase()}
              </div>
              <button
                onClick={signOut}
                style={{
                  background: 'none',
                  border: '1px solid var(--border)',
                  color: 'var(--muted)',
                  borderRadius: 30,
                  padding: '7px 14px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  flexShrink: 0,
                }}
              >
                Salir
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              style={{
                background: 'none',
                border: '1px solid rgba(232,130,42,0.4)',
                color: 'var(--orange)',
                borderRadius: 30,
                padding: '9px 16px',
                fontSize: 12,
                cursor: 'pointer',
                fontFamily: 'var(--font-head)',
                fontWeight: 700,
                marginLeft: 10,
                flexShrink: 0,
              }}
            >
              Iniciar sesión
            </button>
          )}
        </div>
      </div>

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </header>
  );
}
