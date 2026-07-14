import { useEffect, useState } from 'react';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import MoviesGrid from './components/Movies/MoviesGrid';
import LoadMoreButton from './components/Movies/LoadMoreButton';
import DetailModal from './components/Modals/DetailModal';
import TrailerModal from './components/Modals/TrailerModal';
import FloatChatButton from './components/Chatbot/FloatChatButton';
import ChatbotPanel from './components/Chatbot/ChatbotPanel';
import ReviewModal from './components/Reviews/ReviewModal';
import ReviewsSection from './components/Reviews/ReviewsSection';
import Footer from './components/Footer/Footer';
import { ToastProvider, useToast } from './hooks/useToast.jsx';
import { useMovies } from './hooks/useMovies';
import { useHero } from './hooks/useHero';
import { useReviews } from './hooks/useReviews';

function AppContent() {
  const {
    section,
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
  } = useMovies();

  const { heroMovie, trailerKey: heroTrailerKey } = useHero(freshBatch);
  const { reviews, addReview, toggleLike, addReply } = useReviews();
  const showToast = useToast();

  const [scrolled, setScrolled] = useState(false);
  const [detailMovieId, setDetailMovieId] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [reviewMovieTitle, setReviewMovieTitle] = useState(null);
  const [view, setView] = useState('movies'); // 'movies' | 'reviews'  ← NUEVO

  // ...(useEffects de scroll y Escape quedan igual)

  function handleSelectNav(key) {           // ← NUEVO
    if (key === 'reviews') {
      setView('reviews');
    } else {
      setView('movies');
      setSection(key);
    }
  }

  function handleSubmitReview({ rating, text }) {
    addReview({ movie: reviewMovieTitle, rating, text });
    setReviewMovieTitle(null);
    showToast('✓ Reseña publicada. ¡Gracias por tu opinión!');
  }

  return (
    <>
      <Header
        scrolled={scrolled}
        activeSection={view === 'reviews' ? 'reviews' : section}   // ← CAMBIA
        onSelectSection={handleSelectNav}                          // ← CAMBIA
        onSearch={search}
        onToggleChat={() => setChatOpen((v) => !v)}
      />

      {view === 'movies' ? (          // ← NUEVO: todo el catálogo va aquí adentro
        <>
          <Hero
            movie={heroMovie}
            trailerKey={heroTrailerKey}
            onOpenDetails={setDetailMovieId}
            onOpenTrailer={setTrailerKey}
          />

          <main className="main">
            <div className="section-header">
              <div className="section-title-wrap">
                <svg className="section-wave-icon" viewBox="0 0 44 22" fill="none">
                  <path d="M2 16 Q11 2 22 11 Q33 20 42 6" stroke="var(--orange)" strokeWidth="3" strokeLinecap="round" fill="none" />
                </svg>
                <h2 className="section-title" id="sectionTitle">
                  {sectionTitle}
                </h2>
              </div>
            </div>

            <MoviesGrid
              movies={movies}
              loading={loading}
              appending={page > 1}
              error={error}
              onOpenDetails={setDetailMovieId}
              onOpenTrailer={setTrailerKey}
            />

            <LoadMoreButton page={page} totalPages={totalPages} loading={loading} onClick={loadMore} />
          </main>
        </>
      ) : (
        <ReviewsSection reviews={reviews} onLike={toggleLike} onReply={addReply} />   // ← se movió aquí
      )}

      <DetailModal
        movieId={detailMovieId}
        onClose={() => setDetailMovieId(null)}
        onOpenTrailer={setTrailerKey}
        onWriteReview={setReviewMovieTitle}
      />

      <TrailerModal trailerKey={trailerKey} onClose={() => setTrailerKey(null)} />

      <ChatbotPanel
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        onOpenDetails={(id) => {
          setChatOpen(false);
          setDetailMovieId(id);
        }}
      />
      <FloatChatButton onClick={() => setChatOpen((v) => !v)} />

      {reviewMovieTitle && (
        <ReviewModal
          movieTitle={reviewMovieTitle}
          onClose={() => setReviewMovieTitle(null)}
          onSubmit={handleSubmitReview}
        />
      )}

      <Footer />
    </>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
