import { useEffect, useState } from 'react';
import { fetchMovieDetails, extractTrailerKey, formatRuntime, formatVote, formatYear, imgUrl, IMG_BASE } from '../../api/tmdb';

export default function DetailModal({ movieId, onClose, onOpenTrailer, onWriteReview }) {
  const [state, setState] = useState({ loading: true, error: false, movie: null, cast: [], trailerKey: null });

  useEffect(() => {
    if (!movieId) return;
    let cancelled = false;
    setState({ loading: true, error: false, movie: null, cast: [], trailerKey: null });

    fetchMovieDetails(movieId)
      .then(([movie, credits]) => {
        if (cancelled) return;
        setState({
          loading: false,
          error: false,
          movie,
          cast: (credits.cast || []).slice(0, 10),
          trailerKey: extractTrailerKey(movie.videos),
        });
      })
      .catch(() => {
        if (!cancelled) setState((s) => ({ ...s, loading: false, error: true }));
      });

    return () => {
      cancelled = true;
    };
  }, [movieId]);

  useEffect(() => {
    document.body.style.overflow = movieId ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [movieId]);

  if (!movieId) return null;

  const { loading, error, movie, cast, trailerKey } = state;
  const bd = movie ? imgUrl(movie.backdrop_path, 'w1280') : null;

  return (
    <div
      className="modal-overlay open"
      id="modalOverlay"
      onClick={(e) => e.target.id === 'modalOverlay' && onClose()}
    >
      <div className="modal" id="modal">
        <button className="modal-close" id="modalClose" onClick={onClose}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="modal-inner" id="modalInner">
          {loading && (
            <div style={{ padding: 90, textAlign: 'center', color: 'var(--muted)' }}>
              <svg width="38" height="38" viewBox="0 0 50 50" style={{ animation: 'spin 1s linear infinite', marginBottom: 16 }}>
                <circle cx="25" cy="25" r="18" fill="none" stroke="var(--orange)" strokeWidth="4" strokeDasharray="56 38" />
              </svg>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em' }}>
                Cargando detalles...
              </p>
            </div>
          )}

          {error && (
            <div style={{ padding: 60, textAlign: 'center', color: 'var(--muted)' }}>
              <p>Error al cargar los detalles.</p>
            </div>
          )}

          {!loading && !error && movie && (
            <>
              {bd && (
                <div className="modal-hero">
                  <img src={bd} alt={movie.title} />
                  <div className="modal-hero-overlay" />
                </div>
              )}
              <div className="modal-body">
                <div className="modal-genres">
                  {(movie.genres || []).map((g) => (
                    <span className="genre-tag" key={g.id}>
                      {g.name}
                    </span>
                  ))}
                </div>
                <h2 className="modal-title">{movie.title}</h2>
                {movie.tagline && <p className="modal-tagline">"{movie.tagline}"</p>}

                <div className="modal-stats">
                  <div className="stat">
                    <span className="stat-label">Calificación</span>
                    <span className="stat-value orange">★ {formatVote(movie.vote_average)}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Año</span>
                    <span className="stat-value">{formatYear(movie.release_date)}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Duración</span>
                    <span className="stat-value">{formatRuntime(movie.runtime)}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Votos</span>
                    <span className="stat-value">{(movie.vote_count || 0).toLocaleString()}</span>
                  </div>
                </div>

                {movie.overview && <p className="modal-overview">{movie.overview}</p>}

                <div style={{ marginBottom: 22 }}>
                  <button
                    className="btn-secondary"
                    style={{ fontSize: 12, padding: '10px 22px' }}
                    onClick={() => {
                      onClose();
                      onWriteReview(movie.title);
                    }}
                  >
                    ✍ Escribir reseña de "{movie.title}"
                  </button>
                </div>

                {trailerKey && (
                  <div className="modal-trailer-wrap">
                    <button className="modal-trailer-btn" onClick={() => onOpenTrailer(trailerKey)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5,3 19,12 5,21" />
                      </svg>
                      Ver Trailer en YouTube
                    </button>
                  </div>
                )}

                {cast.length > 0 && (
                  <>
                    <h3 className="modal-cast-title">Reparto Principal</h3>
                    <div className="cast-grid">
                      {cast.map((a) => (
                        <div className="cast-member" key={a.id}>
                          {a.profile_path ? (
                            <img
                              className="cast-photo"
                              src={`${IMG_BASE}/w185${a.profile_path}`}
                              alt={a.name}
                              loading="lazy"
                            />
                          ) : (
                            <div className="cast-no-photo">🎭</div>
                          )}
                          <div className="cast-name">{a.name}</div>
                          <div className="cast-char">{a.character || ''}</div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
