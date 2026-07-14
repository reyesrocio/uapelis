import { useState } from 'react';

export default function StarRow({ value, onChange, readonly = false, size = 26 }) {
  const [hovered, setHovered] = useState(0);

  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          onClick={() => !readonly && onChange(i)}
          onMouseEnter={() => !readonly && setHovered(i)}
          onMouseLeave={() => !readonly && setHovered(0)}
          style={{
            background: 'none',
            border: 'none',
            cursor: readonly ? 'default' : 'pointer',
            fontSize: size,
            lineHeight: 1,
            padding: 0,
            color: (hovered || value) >= i ? 'var(--orange)' : 'var(--surface3)',
            transform: !readonly && (hovered || value) >= i ? 'scale(1.2)' : 'scale(1)',
            transition: 'transform 0.15s, color 0.15s',
          }}
          aria-label={`${i} estrellas`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
