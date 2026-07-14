import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'

/**
 * Reemplaza la versión de localStorage por Supabase (multi-usuario + realtime).
 * Mantiene la MISMA forma de datos que ya usan ReviewCard/ReplyBox/ReviewsSection:
 *   review: { id, movie, rating, text, timestamp, likes, likedByMe, username, replies }
 *   reply:  { id, text, timestamp, username }
 *
 * addReview({ movie, rating, text }) / toggleLike(id) / addReply(reviewId, text)
 * conservan la misma firma que antes, así que App.jsx / ReviewModal.jsx no
 * necesitan cambiar cómo las llaman.
 *
 * Si el usuario no ha iniciado sesión, estas 3 acciones no hacen nada y
 * activan `authRequired` (para que puedas mostrar el modal de login).
 */
export function useReviews() {
  const { user, username } = useAuth()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [authRequired, setAuthRequired] = useState(false)
  const channelRef = useRef(null)

  const fetchReviews = useCallback(async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*, review_likes(user_id), review_replies(*)')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error cargando reseñas:', error.message)
      return
    }

    const normalized = (data || []).map((r) => ({
      id: r.id,
      movie: r.movie,
      rating: r.rating,
      text: r.text,
      timestamp: new Date(r.created_at).getTime(),
      username: r.username,
      likes: r.review_likes?.length || 0,
      likedByMe: user ? r.review_likes?.some((l) => l.user_id === user.id) : false,
      replies: (r.review_replies || [])
        .slice()
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
        .map((rep) => ({
          id: rep.id,
          text: rep.text,
          timestamp: new Date(rep.created_at).getTime(),
          username: rep.username,
        })),
    }))

    setReviews(normalized)
    setLoading(false)
  }, [user])

  useEffect(() => {
    setLoading(true)
    fetchReviews()

    if (channelRef.current) supabase.removeChannel(channelRef.current)

    const channel = supabase
      .channel('reviews-global')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reviews' }, fetchReviews)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'review_likes' }, fetchReviews)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'review_replies' }, fetchReviews)
      .subscribe()

    channelRef.current = channel
    return () => supabase.removeChannel(channel)
  }, [fetchReviews])

  async function addReview({ movie, rating, text }) {
    if (!user) return setAuthRequired(true)
    const { error } = await supabase.from('reviews').insert({
      user_id: user.id,
      username,
      movie,
      rating,
      text,
    })
    if (error) console.error('Error al publicar reseña:', error.message)
  }

  async function toggleLike(id) {
    if (!user) return setAuthRequired(true)
    const current = reviews.find((r) => r.id === id)
    if (!current) return

    if (current.likedByMe) {
      const { error } = await supabase
        .from('review_likes')
        .delete()
        .eq('review_id', id)
        .eq('user_id', user.id)
      if (error) console.error('Error al quitar like:', error.message)
    } else {
      const { error } = await supabase.from('review_likes').insert({ review_id: id, user_id: user.id })
      if (error) console.error('Error al dar like:', error.message)
    }
  }

  async function addReply(reviewId, text) {
    if (!user) return setAuthRequired(true)
    const { error } = await supabase
      .from('review_replies')
      .insert({ review_id: reviewId, user_id: user.id, username, text })
    if (error) console.error('Error al responder:', error.message)
  }

  return {
    reviews,
    loading,
    addReview,
    toggleLike,
    addReply,
    authRequired,
    dismissAuthRequired: () => setAuthRequired(false),
  }
}
