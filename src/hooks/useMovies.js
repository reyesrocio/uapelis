import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchMoviesList } from '../api/tmdb';
import { SECTION_TITLES } from '../data/constants';

export function useMovies() {
  const [section, setSectionState] = useState('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [movies, setMovies] = useState([]);
  const [freshBatch, setFreshBatch] = useState([]); // último lote no-append, para elegir el hero
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Evita condiciones de carrera entre peticiones encadenadas
  const requestId = useRef(0);

  const load = useCallback(async (append) => {
    const myRequestId = ++requestId.current;
    setLoading(true);
    if (!append) setError(null);

    try {
      const data = await fetchMoviesList({ section, searchQuery, page });
      if (myRequestId !== requestId.current) return; // respuesta obsoleta

      setTotalPages(data.total_pages);
      setMovies((prev) => (append ? [...prev, ...data.results] : data.results));
      if (!append) {
        setError(null);
        setFreshBatch(data.results);
      }
    } catch (err) {
      if (myRequestId !== requestId.current) return;
      setError(err.message === '401' || err.message.includes('401') ? 'unauthorized' : 'network');
      if (!append) setMovies([]);
    } finally {
      if (myRequestId === requestId.current) setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section, searchQuery, page]);

  useEffect(() => {
    load(page > 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section, searchQuery, page]);

  function setSection(newSection) {
    setSearchQuery('');
    setPage(1);
    setSectionState(newSection);
  }

  function search(query) {
    if (!query) {
      setSection(section);
      return;
    }
    setSearchQuery(query);
    setPage(1);
  }

  function loadMore() {
    if (page < totalPages && !loading) setPage((p) => p + 1);
  }

  const sectionTitle = searchQuery
    ? `Resultados: "${searchQuery}"`
    : SECTION_TITLES[section] || 'Películas';

  return {
    section,
    searchQuery,
    page,
    totalPages,
    movies,
    freshBatch,
    loading,
    error,
    sectionTitle,
    setSection,
    search,
    loadMore,
  };
}
