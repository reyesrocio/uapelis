import { useEffect, useRef, useState } from 'react';
import { hasOffensive } from '../../utils/helpers';
import StarRow from './StarRow';
import AuthModal from '../Auth/AuthModal';
import { useAuth } from '../../hooks/useAuth';

export default function ReviewModal({ movieTitle, onClose, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [warning, setWarning] = useState('');
  const [showAuth, setShowAuth] = useState(false);
  const textareaRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => textareaRef.current?.focus(), 300);
    return () => {
      document.body.style.overflow = '';
      clearTimeout(t);
    };
  }, []);

  function handleSubmit() {
    if (!user) return setShowAuth(true);
    if (rating === 0) return setWarning('⚠ Selecciona una puntuación de 1 a 5 estrellas.');
    if (text.trim().length < 15) return setWarning('⚠ Escribe al menos 15 caracteres.');
    if (hasOffensive(text)) return setWarning('⚠ Tu reseña contiene lenguaje inapropiado. Por favor, sé respetuoso.');
    onSubmit({ rating, text: text.trim() });
  }

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div
      onClick={handleOverlayClick}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 250,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(14px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        animation: 'fadeInOverlay 0.25s ease',
      }}
    >
      <style>{`
        @keyframes fadeInOverlay { from { opacity:0 } to { opacity:1 } }
        @keyframes slideUp { from { transform:scale(0.93) translateY(20px); opacity:0 } to { transform:scale(1) translateY(0); opacity:1 } }
        .rv-textarea:focus { border-color: var(--orange) !important; box-shadow: 0 0 0 3px rgba(232,130,42,0.12) !important; }
        .rv-btn-cancel:hover { border-color: var(--orange) !important; color: var(--orange2) !important; }
      `}</style>
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid rgba(232,130,42,0.22)',
          borderRadius: 14,
          maxWidth: 520,
          width: '100%',
          position: 'relative',
          animation: 'slideUp 0.35s cubic-bezier(0.34,1.56,0.64,1)',
          padding: '36px 36px 28px',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 14,
            right: 14,
            background: 'none',
            border: 'none',
            color: 'var(--muted)',
            cursor: 'pointer',
            padding: 6,
            borderRadius: 50,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--orange)',
            marginBottom: 6,
          }}
        >
          🎬 {movieTitle}
        </div>
        <h2
          style={{
            fontFamily: 'var(--font-head)',
            fontSize: 28,
            fontWeight: 800,
            color: 'var(--sand-light)',
            letterSpacing: '-0.02em',
            marginBottom: 20,
          }}
        >
          Tu reseña
        </h2>

        <div style={{ marginBottom: 18 }}>
          <StarRow value={rating} onChange={setRating} />
        </div>

        <label
          style={{
            display: 'block',
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--muted)',
            marginBottom: 8,
          }}
        >
          ¿Qué te pareció?
        </label>
        <textarea
          ref={textareaRef}
          className="rv-textarea"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setWarning('');
          }}
          maxLength={500}
          placeholder="Cuéntanos tu opinión... sé honesto pero respetuoso."
          style={{
            width: '100%',
            background: 'var(--surface2)',
            border: '1px solid var(--border)',
            color: 'var(--white)',
            padding: '12px 14px',
            borderRadius: 8,
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            resize: 'none',
            height: 120,
            outline: 'none',
            transition: 'border-color 0.3s, box-shadow 0.3s',
            marginBottom: 6,
            lineHeight: 1.7,
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }}>{text.length}/500</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="rv-btn-cancel"
              onClick={onClose}
              style={{
                padding: '10px 20px',
                fontSize: 12,
                background: 'none',
                color: 'var(--muted)',
                border: '1px solid var(--border)',
                borderRadius: 30,
                cursor: 'pointer',
                fontFamily: 'var(--font-head)',
                fontWeight: 600,
                letterSpacing: '0.05em',
                transition: 'border-color 0.3s, color 0.3s',
              }}
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              style={{
                padding: '10px 22px',
                fontSize: 12,
                background: 'var(--orange)',
                color: '#0f0d0b',
                border: 'none',
                borderRadius: 30,
                cursor: 'pointer',
                fontFamily: 'var(--font-head)',
                fontWeight: 700,
                letterSpacing: '0.05em',
                transition: 'background 0.3s',
              }}
            >
              {user ? 'Publicar' : 'Iniciar sesión para publicar'}
            </button>
          </div>
        </div>

        {warning && (
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: '#f87171',
              background: 'rgba(248,113,113,0.08)',
              border: '1px solid rgba(248,113,113,0.25)',
              borderRadius: 6,
              padding: '8px 12px',
              marginTop: 10,
              letterSpacing: '0.04em',
            }}
          >
            {warning}
          </div>
        )}
      </div>

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </div>
  );
}
