import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../../hooks/useAuth';

export default function AuthModal({ isOpen, onClose }) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (!isOpen) return null;

  const inputStyle = {
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    color: 'var(--white)',
    padding: '10px 14px',
    borderRadius: 30,
    fontFamily: 'var(--font-body)',
    fontSize: 13,
    outline: 'none',
    width: '100%',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (mode === 'signup') {
        if (!username.trim()) throw new Error('Elige un nombre de usuario');
        await signUp(email, password, username.trim());
      } else {
        await signIn(email, password);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Ocurrió un error');
    } finally {
      setBusy(false);
    }
  };

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 14,
          padding: '28px 30px',
          width: '100%',
          maxWidth: 360,
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Cerrar"
          style={{
            position: 'absolute',
            top: 14,
            right: 16,
            background: 'none',
            border: 'none',
            color: 'var(--muted)',
            fontSize: 20,
            cursor: 'pointer',
            lineHeight: 1,
          }}
        >
          ×
        </button>

        <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 20, fontWeight: 800, color: 'var(--sand-light)', marginBottom: 18 }}>
          {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {mode === 'signup' && (
            <input
              type="text"
              placeholder="Nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={inputStyle}
            />
          )}
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
            style={inputStyle}
          />

          {error && (
            <p style={{ color: '#f87171', fontSize: 11, fontFamily: 'var(--font-mono)' }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={busy}
            style={{
              background: 'var(--orange)',
              color: '#0f0d0b',
              border: 'none',
              borderRadius: 30,
              padding: '10px 16px',
              cursor: 'pointer',
              fontFamily: 'var(--font-head)',
              fontWeight: 700,
              fontSize: 13,
              marginTop: 4,
            }}
          >
            {busy ? 'Cargando...' : mode === 'login' ? 'Entrar' : 'Registrarme'}
          </button>
        </form>

        <p style={{ marginTop: 16, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', textAlign: 'center' }}>
          {mode === 'login' ? (
            <>
              ¿No tienes cuenta?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                style={{ background: 'none', border: 'none', color: 'var(--orange)', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 11 }}
              >
                Regístrate
              </button>
            </>
          ) : (
            <>
              ¿Ya tienes cuenta?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                style={{ background: 'none', border: 'none', color: 'var(--orange)', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 11 }}
              >
                Inicia sesión
              </button>
            </>
          )}
        </p>
      </div>
    </div>,
    document.body
  );
}