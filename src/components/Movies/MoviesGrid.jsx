import MovieCard from './MovieCard';
import MovieSkeletons from './MovieSkeletons';

export default function MoviesGrid({ movies, loading, appending, error, onOpenDetails, onOpenTrailer }) {
  if (loading && !appending) {
    return (
      <div className="movies-grid" id="moviesGrid">
        <MovieSkeletons />
      </div>
    );
  }

  if (error) {
    return (
      <div className="movies-grid" id="moviesGrid">
        <div className="no-results">
          <h3>{error === 'unauthorized' ? 'API Key no válida' : 'Error de conexión'}</h3>
          <p>
            {error === 'unauthorized' ? (
              <>
                Abre tu archivo <code>.env</code> y reemplaza <code>VITE_TMDB_API_KEY</code>.<br />
                Obtén tu clave en{' '}
                <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noreferrer">
                  themoviedb.org
                </a>
              </>
            ) : (
              'Verifica tu conexión a internet.'
            )}
          </p>
        </div>
      </div>
    );
  }

  if (!movies.length) {
    return (
      <div className="movies-grid" id="moviesGrid">
        <div className="no-results">
          <h3>Sin resultados</h3>
          <p>Prueba con otra búsqueda o categoría.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="movies-grid" id="moviesGrid">
      {movies.map((movie, i) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          index={i}
          onOpenDetails={onOpenDetails}
          onOpenTrailer={onOpenTrailer}
        />
      ))}
    </div>
  );
}
