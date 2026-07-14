export default function LoadMoreButton({ page, totalPages, loading, onClick }) {
  const exhausted = page >= totalPages;

  return (
    <div className="load-more-wrap">
      <button className="load-more-btn" id="loadMoreBtn" disabled={exhausted || loading} onClick={onClick}>
        <span>{exhausted ? 'Sin más resultados' : 'Cargar más'}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="6,9 12,15 18,9" />
        </svg>
      </button>
    </div>
  );
}
