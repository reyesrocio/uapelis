export const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
export const BASE_URL = 'https://api.themoviedb.org/3';
export const IMG_BASE = 'https://image.tmdb.org/t/p';

/**
 * Llama a un endpoint de TheMovieDB con los parámetros dados.
 */
export async function apiFetch(path, params = {}) {
  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set('api_key', API_KEY);
  url.searchParams.set('language', 'es-MX');
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json();
}

export function imgUrl(path, size = 'w342') {
  return path ? `${IMG_BASE}/${size}${path}` : null;
}

export function formatVote(v) {
  return v ? v.toFixed(1) : '—';
}

export function formatYear(d) {
  return d ? d.slice(0, 4) : '—';
}

export function formatRuntime(m) {
  if (!m) return '—';
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}

/**
 * Extrae la key de YouTube del trailer/teaser más relevante.
 * Prioridad: Official Trailer > Trailer > Teaser
 */
export function extractTrailerKey(videos) {
  if (!videos || !videos.results) return null;
  const results = videos.results;
  const priority = ['Official Trailer', 'Trailer', 'Teaser'];

  for (const p of priority) {
    const v = results.find(
      (r) =>
        r.site === 'YouTube' &&
        (r.type === 'Trailer' || r.type === 'Teaser') &&
        r.name.includes(p.split(' ')[0])
    );
    if (v) return v.key;
  }
  const any = results.find(
    (r) => r.site === 'YouTube' && (r.type === 'Trailer' || r.type === 'Teaser')
  );
  return any ? any.key : null;
}

export function fetchMoviesList({ section, searchQuery, page }) {
  if (searchQuery) {
    return apiFetch('/search/movie', { query: searchQuery, page, include_adult: false });
  }
  return apiFetch(`/movie/${section}`, { page });
}

export function fetchMovieDetails(movieId) {
  return Promise.all([
    apiFetch(`/movie/${movieId}`, { append_to_response: 'videos' }),
    apiFetch(`/movie/${movieId}/credits`),
  ]);
}

export function fetchMovieWithVideos(movieId) {
  return apiFetch(`/movie/${movieId}`, { append_to_response: 'videos' });
}
