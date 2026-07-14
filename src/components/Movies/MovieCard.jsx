import { useState } from 'react';
import { extractTrailerKey, fetchMovieWithVideos, formatVote, formatYear, imgUrl } from '../../api/tmdb';
import { useToast } from '../../hooks/useToast.jsx';

export default function MovieCard({ movie, index, onOpenDetails, onOpenTrailer }) {
  const showToast = useToast();
  const [hasTrailerBadge, setHasTrailerBadge] = useState(false);

  const poster = imgUrl(movie.poster_path, 'w342');
  const year = formatYear(movie.release_date || movie.first_air_date);
  const vote = formatVote(movie.vote_average);
  const title = movie.title || movie.name || '—';

  async function handlePlayTrailer(e) {
    e.stopPropagation();
    try {
      showToast('Buscando trailer...');
      const data = await fetchMovieWithVideos(movie.id);
      const key = extractTrailerKey(data.videos);
      if (key) {
        onOpenTrailer(key);
        setHasTrailerBadge(true);
      } else {
        showToast('Trailer no disponible para esta película');
      }
    } catch {
      showToast('Error al buscar el trailer');
    }
  }

  return (
    <div
      className="card"
      style={{ animationDelay: `${index * 0.04}s` }}
      onClick={() => onOpenDetails(movie.id)}
    >
      <div className="card-img-wrap">
        {poster ? (
          <img className="card-img" src={poster} alt={title} loading="lazy" />
        ) : (
          <div className="card-no-img">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
            <span>Sin imagen</span>
          </div>
        )}
        <div className="card-rating">★ {vote}</div>
        <div className="card-hover-overlay">
          <button className="card-play-btn" title="Ver trailer" onClick={handlePlayTrailer}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          </button>
          <span className="card-hover-cta">Ver detalles →</span>
        </div>
      </div>
      <div className="card-body">
        <div className="card-title">{title}</div>
        <div className="card-meta">
          <span className="card-year">{year}</span>
          <span className="card-has-trailer" style={{ display: hasTrailerBadge ? 'inline' : 'none' }}>
            ▶ Trailer
          </span>
        </div>
      </div>
    </div>
  );
}
