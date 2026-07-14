import { useEffect, useMemo, useState } from 'react';
import { extractTrailerKey, fetchMovieWithVideos } from '../api/tmdb';

export function useHero(freshBatch) {
  const heroMovie = useMemo(() => {
    if (!freshBatch || !freshBatch.length) return null;
    const idx = Math.floor(Math.random() * Math.min(5, freshBatch.length));
    return freshBatch[idx];
    // Solo se recalcula cuando cambia la referencia del lote fresco
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [freshBatch]);

  const [trailerKey, setTrailerKey] = useState(null);

  useEffect(() => {
    setTrailerKey(null);
    if (!heroMovie) return;
    let cancelled = false;
    fetchMovieWithVideos(heroMovie.id)
      .then((data) => {
        if (cancelled) return;
        setTrailerKey(extractTrailerKey(data.videos));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [heroMovie]);

  return { heroMovie, trailerKey };
}
