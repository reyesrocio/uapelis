import { useEffect } from 'react';

export default function TrailerModal({ trailerKey, onClose }) {
  useEffect(() => {
    document.body.style.overflow = trailerKey ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [trailerKey]);

  if (!trailerKey) return null;

  return (
    <div
      className="trailer-overlay open"
      id="trailerOverlay"
      onClick={(e) => e.target.id === 'trailerOverlay' && onClose()}
    >
      <div className="trailer-box">
        <button className="trailer-close" id="trailerClose" onClick={onClose}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <div className="trailer-frame-wrap">
          <iframe
            id="trailerFrame"
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
            title="Trailer"
            frameBorder="0"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      </div>
    </div>
  );
}
