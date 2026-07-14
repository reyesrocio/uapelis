import { useState } from 'react';
import { hasOffensive } from '../../utils/helpers';

export default function ReplyBox({ onSend }) {
  const [val, setVal] = useState('');
  const [warn, setWarn] = useState('');

  function send() {
    if (val.trim().length < 3) return setWarn('Escribe al menos 3 caracteres.');
    if (hasOffensive(val)) return setWarn('Lenguaje inapropiado. Sé respetuoso.');
    onSend(val.trim());
    setVal('');
    setWarn('');
  }

  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input
          value={val}
          onChange={(e) => {
            setVal(e.target.value);
            setWarn('');
          }}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Escribe una respuesta..."
          style={{
            flex: 1,
            background: 'var(--surface3)',
            border: '1px solid var(--border)',
            color: 'var(--white)',
            padding: '8px 14px',
            borderRadius: 30,
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            outline: 'none',
          }}
        />
        <button
          onClick={send}
          style={{
            background: 'var(--orange)',
            color: '#0f0d0b',
            border: 'none',
            borderRadius: 30,
            padding: '8px 16px',
            cursor: 'pointer',
            fontFamily: 'var(--font-head)',
            fontWeight: 700,
            fontSize: 12,
          }}
        >
          Responder
        </button>
      </div>
      {warn && <div style={{ color: '#f87171', fontSize: 11, marginTop: 4, fontFamily: 'var(--font-mono)' }}>{warn}</div>}
    </div>
  );
}
