import { GENRES } from '../../data/constants';
import { formatVote, formatYear, imgUrl } from '../../api/tmdb';

export default function Hero({ movie, trailerKey, onOpenDetails, onOpenTrailer }) {
  const bg = movie ? imgUrl(movie.backdrop_path, 'original') : null;
  const genreNames = movie
    ? (movie.genre_ids || []).slice(0, 2).map((id) => GENRES[id] || '').filter(Boolean).join(' · ')
    : '';

  return (
    <section className="hero" id="hero">
      <div className="hero-bg-layer" key={movie ? movie.id : 'empty'}>
        <div
          className="hero-bg"
          id="heroBg"
          style={bg ? { backgroundImage: `url(${bg})` } : undefined}
        />
      </div>
      <div className="hero-vignette" />
      <div className="hero-overlay" />
      <div className="hero-content" id="heroContent">
        <div className="hero-badge">
          <span className="badge-dot" />
          Destacada del momento
        </div>
        <h1 className="hero-title" id="heroTitle">
          {movie ? movie.title || movie.name || '—' : 'Cargando...'}
        </h1>
        <p className="hero-desc" id="heroDesc">
          {movie ? movie.overview || 'Sin descripción disponible.' : ''}
        </p>
        {movie && (
          <div className="hero-meta" id="heroMeta">
            <span className="rating">★ {formatVote(movie.vote_average)}</span>
            <span className="dot">·</span>
            <span className="year">{formatYear(movie.release_date)}</span>
            {genreNames && (
              <>
                <span className="dot">·</span>
                <span>{genreNames}</span>
              </>
            )}
          </div>
        )}
        <div className="hero-actions">
          {trailerKey && (
            <button className="btn-primary" id="heroTrailerBtn" onClick={() => onOpenTrailer(trailerKey)}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5,3 19,12 5,21" />
              </svg>
              Ver Trailer
            </button>
          )}
          <button
            className="btn-secondary"
            id="heroDetailsBtn"
            disabled={!movie}
            onClick={() => movie && onOpenDetails(movie.id)}
          >
            Ver Detalles
          </button>
        </div>
      </div>
      <div className="hero-scroll-cue" aria-hidden="true">
        <span className="hero-scroll-line" />
        <span className="hero-scroll-label">Explorar</span>
      </div>
      <div className="hero-curve">
        <svg viewBox="0 0 1440 90" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,45 Q360,90 720,45 Q1080,0 1440,45 L1440,90 L0,90 Z" fill="var(--bg)" />
        </svg>
      </div>
    </section>
  );
}
