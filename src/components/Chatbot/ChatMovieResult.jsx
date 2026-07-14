import { escHtml } from '../../utils/helpers';
import { formatVote, formatYear, imgUrl } from '../../api/tmdb';

export default function ChatMovieResult({ movie, onOpenDetails }) {
  const poster = imgUrl(movie.poster_path, 'w154');
  const year = formatYear(movie.release_date || movie.first_air_date);
  const vote = formatVote(movie.vote_average);
  const title = movie.title || movie.name || '—';
  const overview = movie.overview || 'Sin descripción disponible.';

  return (
    <div className="chat-msg bot">
      <div
        className="chat-result-card"
        role="button"
        tabIndex={0}
        onClick={() => onOpenDetails(movie.id)}
        onKeyDown={(e) => e.key === 'Enter' && onOpenDetails(movie.id)}
      >
        {poster ? (
          <img className="chat-result-poster" src={poster} alt={escHtml(title)} loading="lazy" />
        ) : (
          <div className="chat-result-poster-ph">🎬</div>
        )}
        <div className="chat-result-info">
          <div className="chat-result-title">{title}</div>
          <div className="chat-result-desc">{overview}</div>
          <div className="chat-result-tags">
            <span className="chat-result-tag gold">★ {vote}</span>
            <span className="chat-result-tag">{year}</span>
            <span className="chat-result-tag">📝 Reseñar</span>
          </div>
        </div>
      </div>
    </div>
  );
}
