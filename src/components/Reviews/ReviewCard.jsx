import { useState } from 'react';
import { fmtDate } from '../../utils/helpers';
import StarRow from './StarRow';
import ReplyBox from './ReplyBox';

export default function ReviewCard({ review, onLike, onReply }) {
  const [showReply, setShowReply] = useState(false);
  const [showReplies, setShowReplies] = useState(true);

  const initials = (review.username || '?').slice(0, 2).toUpperCase();

  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        padding: '18px 22px',
        marginBottom: 12,
        transition: 'border-color 0.3s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(232,130,42,0.3)')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6, gap: 10, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'rgba(232,130,42,0.15)',
              border: '1px solid rgba(232,130,42,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-head)',
              fontSize: 11,
              fontWeight: 700,
              color: 'var(--orange)',
            }}
          >
            {initials}
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-head)', fontSize: 14, fontWeight: 700, color: 'var(--sand-light)' }}>
              {review.username}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)', letterSpacing: '0.08em', marginTop: 1 }}>
              🎬 {review.movie} · {fmtDate(review.timestamp)}
            </div>
          </div>
        </div>
        <StarRow value={review.rating} onChange={() => {}} readonly size={14} />
      </div>

      <p style={{ fontSize: 14, color: 'rgba(245,237,226,0.75)', lineHeight: 1.75, fontStyle: 'italic', marginBottom: 12 }}>
        {review.text}
      </p>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={() => onLike(review.id)}
          title={review.likedByMe ? 'Quitar like' : 'Me gusta'}
          style={{
            background: review.likedByMe ? 'rgba(232,130,42,0.15)' : 'none',
            border: `1px solid ${review.likedByMe ? 'rgba(232,130,42,0.5)' : 'var(--border)'}`,
            color: review.likedByMe ? 'var(--orange)' : 'var(--muted)',
            borderRadius: 30,
            padding: '5px 14px',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.06em',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            transition: 'all 0.2s',
          }}
        >
          ♥ {review.likes || 0}
        </button>

        <button
          onClick={() => setShowReply((v) => !v)}
          style={{
            background: 'none',
            border: '1px solid var(--border)',
            color: 'var(--muted)',
            borderRadius: 30,
            padding: '5px 14px',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.06em',
            transition: 'all 0.2s',
          }}
        >
          💬 Responder
        </button>

        {review.replies?.length > 0 && (
          <button
            onClick={() => setShowReplies((v) => !v)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--muted)',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              letterSpacing: '0.06em',
            }}
          >
            {showReplies ? '▲' : '▼'} {review.replies.length} {review.replies.length === 1 ? 'respuesta' : 'respuestas'}
          </button>
        )}
      </div>

      {showReplies && review.replies?.length > 0 && (
        <div style={{ marginTop: 14, paddingLeft: 14, borderLeft: '2px solid var(--border)' }}>
          {review.replies.map((r) => (
            <div key={r.id} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid rgba(232,130,42,0.06)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)', marginBottom: 3, letterSpacing: '0.06em' }}>
                {r.username} · {fmtDate(r.timestamp)}
              </div>
              <p style={{ fontSize: 13, color: 'rgba(245,237,226,0.65)', lineHeight: 1.6 }}>{r.text}</p>
            </div>
          ))}
        </div>
      )}

      {showReply && <ReplyBox onSend={(text) => { onReply(review.id, text); setShowReply(false); }} />}
    </div>
  );
}
