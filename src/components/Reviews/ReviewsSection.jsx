import { useState } from 'react';
import ReviewCard from './ReviewCard';
import AuthModal from '../Auth/AuthModal';
import { useAuth } from '../../hooks/useAuth';

export default function ReviewsSection({ reviews, onLike, onReply }) {
  const [filter, setFilter] = useState('recent'); // recent | top
  const [search, setSearch] = useState('');
  const [showAuth, setShowAuth] = useState(false);
  const { user, username, signOut } = useAuth();

  const guardedLike = (id) => {
    if (!user) return setShowAuth(true);
    onLike(id);
  };

  const guardedReply = (id, text) => {
    if (!user) return setShowAuth(true);
    onReply(id, text);
  };

  const totalLikes = reviews.reduce((sum, r) => sum + (r.likes || 0), 0);
  const uniqueUsers = new Set(reviews.map((r) => r.username)).size;

  const filtered = reviews
    .filter(
      (r) =>
        !search ||
        r.movie.toLowerCase().includes(search.toLowerCase()) ||
        r.text.toLowerCase().includes(search.toLowerCase())
    )
    .slice()
    .sort(filter === 'top' ? (a, b) => (b.likes || 0) - (a.likes || 0) : (a, b) => b.timestamp - a.timestamp);

  return (
    <section id="reviews-section" style={{ padding: '140px 40px 80px', maxWidth: 1440, margin: '0 auto', minHeight: '70vh' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg viewBox="0 0 44 22" fill="none" width="24" height="12">
              <path d="M2 16 Q11 2 22 11 Q33 20 42 6" stroke="var(--orange)" strokeWidth="3" strokeLinecap="round" fill="none" />
            </svg>
            <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 28, fontWeight: 800, color: 'var(--sand-light)', letterSpacing: '-0.02em' }}>
              Reseñas de la Comunidad
            </h2>
            {reviews.length > 0 && (
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  letterSpacing: '0.1em',
                  background: 'rgba(232,130,42,0.12)',
                  border: '1px solid rgba(232,130,42,0.3)',
                  color: 'var(--orange)',
                  borderRadius: 30,
                  padding: '3px 10px',
                }}
              >
                {reviews.length}
              </span>
            )}
          </div>

          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 10 }}>
            {user ? (
              <>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: 'rgba(232,130,42,0.15)',
                    border: '1px solid rgba(232,130,42,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-head)',
                    fontSize: 10,
                    fontWeight: 700,
                    color: 'var(--orange)',
                  }}
                >
                  {username.slice(0, 2).toUpperCase()}
                </div>
                <span>
                  Conectado como <strong style={{ color: 'var(--orange)' }}>{username}</strong>
                </span>
                <button
                  onClick={signOut}
                  style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--muted)', borderRadius: 30, padding: '5px 12px', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 11 }}
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                style={{ background: 'var(--orange)', color: '#0f0d0b', border: 'none', borderRadius: 30, padding: '7px 18px', cursor: 'pointer', fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 12 }}
              >
                Iniciar sesión
              </button>
            )}
          </div>
        </div>

        {reviews.length > 0 && (
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', marginBottom: 20, letterSpacing: '0.03em' }}>
            ♥ {totalLikes} likes acumulados · {uniqueUsers} {uniqueUsers === 1 ? 'persona ha' : 'personas han'} opinado
          </p>
        )}

        {reviews.length > 0 && (
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por película o contenido..."
              style={{
                flex: 1,
                minWidth: 180,
                maxWidth: 300,
                background: 'var(--surface2)',
                border: '1px solid var(--border)',
                color: 'var(--white)',
                padding: '8px 16px',
                borderRadius: 30,
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                outline: 'none',
              }}
            />
            <div style={{ display: 'flex', gap: 6 }}>
              {['recent', 'top'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    background: filter === f ? 'rgba(232,130,42,0.15)' : 'none',
                    border: `1px solid ${filter === f ? 'rgba(232,130,42,0.4)' : 'var(--border)'}`,
                    color: filter === f ? 'var(--orange)' : 'var(--muted)',
                    borderRadius: 30,
                    padding: '7px 16px',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    transition: 'all 0.2s',
                  }}
                >
                  {f === 'recent' ? '🕐 Recientes' : '🔥 Top likes'}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {reviews.length === 0 ? (
        <div
          style={{
            border: '1px dashed var(--border)',
            borderRadius: 14,
            padding: '48px 24px',
            textAlign: 'center',
            background: 'linear-gradient(180deg, rgba(232,130,42,0.05), transparent)',
          }}
        >
          <div style={{ fontSize: 34, marginBottom: 10 }}>🎬✨</div>
          <p style={{ fontFamily: 'var(--font-head)', fontSize: 18, fontWeight: 700, color: 'var(--sand-light)', marginBottom: 8 }}>
            Todavía no hay reseñas... ¡sé la primera voz!
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted)', marginBottom: 20, maxWidth: 420, marginLeft: 'auto', marginRight: 'auto' }}>
            Abre cualquier película, cuéntanos qué te pareció, y quedará aquí en vivo para toda la comunidad — con likes y comentarios en tiempo real.
          </p>
          {!user && (
            <button
              onClick={() => setShowAuth(true)}
              style={{ background: 'var(--orange)', color: '#0f0d0b', border: 'none', borderRadius: 30, padding: '10px 22px', cursor: 'pointer', fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 13 }}
            >
              Crear cuenta y opinar
            </button>
          )}
        </div>
      ) : filtered.length === 0 ? (
        <p style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
          No hay reseñas que coincidan con tu búsqueda.
        </p>
      ) : (
        filtered.map((r) => <ReviewCard key={r.id} review={r} onLike={guardedLike} onReply={guardedReply} />)
      )}

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </section>
  );
}
