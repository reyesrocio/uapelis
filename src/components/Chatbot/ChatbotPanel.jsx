import { useEffect, useRef, useState } from 'react';
import { apiFetch } from '../../api/tmdb';
import { interpretQueryWithAI, isAIConfigured } from '../../api/groq';
import { escHtml, getTime } from '../../utils/helpers';
import ChatMovieResult from './ChatMovieResult';

const SUGGESTIONS = [
  { emoji: '💥 Adrenalina', q: 'acción explosiva adrenalina' },
  { emoji: '💕 Romance', q: 'romance comedia divertida' },
  { emoji: '👁️ Terror', q: 'terror suspenso psicológico' },
  { emoji: '🚀 Sci-Fi', q: 'ciencia ficción espacio futuro' },
];

const WELCOME_HTML =
  '¡Hola, cinéfilo! 🎬 Soy <strong>CineBot UA</strong>, impulsado por <strong>Llama (Groq)</strong>. Cuéntame con tus propias palabras qué tipo de película buscas y la encuentro en TheMovieDB.<br><br>' +
  'Puedes ser específico: <em>"thriller psicológico sin acción"</em>, <em>"comedia italiana años 90"</em>, <em>"drama de guerra emotivo"</em>... o describirme la trama si no recuerdas el título: <em>"un niño robot que busca a su mamá"</em> 🤖';

const NOT_CONFIGURED_HTML =
  '⚠️ CineBot todavía no tiene configurada su API key de Groq. Agrega <code>VITE_GROQ_API_KEY</code> en tu archivo <code>.env</code> y reinicia el servidor para poder chatear conmigo.';

let msgId = 0;
const nextId = () => ++msgId;

export default function ChatbotPanel({ open, onClose, onOpenDetails }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const initializedRef = useRef(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (open && !initializedRef.current) {
      initializedRef.current = true;
      const msgs = [{ id: nextId(), type: 'bot-html', html: WELCOME_HTML, time: getTime() }];
      if (!isAIConfigured()) {
        msgs.push({ id: nextId(), type: 'bot-html', html: NOT_CONFIGURED_HTML, time: getTime() });
      }
      setMessages(msgs);
    }
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ block: 'end' });
  }, [messages, typing]);

  function addBotHtml(html) {
    setMessages((prev) => [...prev, { id: nextId(), type: 'bot-html', html, time: getTime() }]);
  }

  function addUser(text) {
    setMessages((prev) => [...prev, { id: nextId(), type: 'user', text, time: getTime() }]);
  }

  function addMovieResult(movie) {
    setMessages((prev) => [...prev, { id: nextId(), type: 'movie', movie }]);
  }

  async function chatSearch(query) {
    addUser(query);
    setShowSuggestions(false);

    if (!isAIConfigured()) {
      addBotHtml(NOT_CONFIGURED_HTML);
      return;
    }

    setTyping(true);

    try {
      // 1) Llama (Groq) interpreta la consulta y devuelve posibles títulos + términos de búsqueda + mensaje
      let titles;
      let searches;
      let message;
      try {
        const ai = await interpretQueryWithAI(query);
        titles = ai.titles;
        searches = ai.searches;
        message = ai.message;
      } catch (err) {
        setTyping(false);
        if (err.message === 'missing_api_key') {
          addBotHtml(NOT_CONFIGURED_HTML);
        } else if (err.message?.startsWith('groq_401')) {
          addBotHtml('⚠️ Tu API key de Groq no es válida. Revisa <code>VITE_GROQ_API_KEY</code> en tu <code>.env</code>.');
        } else if (err.message?.startsWith('groq_429')) {
          addBotHtml('⏳ Se alcanzó el límite de uso de la API de Groq. Intenta de nuevo en un momento.');
        } else {
          addBotHtml('Hubo un problema al consultar a CineBot. Verifica tu conexión e intenta de nuevo.');
        }
        return;
      }

      const hasTitles = titles && titles.length > 0;
      if ((!searches || searches.length === 0) && !hasTitles) {
        setTyping(false);
        addBotHtml(message ? escHtml(message) : `No entendí bien <em>"${escHtml(query)}"</em>. Intenta describir el género, el estado de ánimo, un actor/director, o incluso de qué trata la película.`);
        return;
      }

      // 2) Buscar en paralelo: primero los títulos exactos que la IA reconoció (prioridad alta),
      //    y en paralelo también los términos genéricos de género/mood como respaldo.
      const seen = new Set();
      const titleResults = [];
      const genreResults = [];

      const titleFetches = (titles || []).map((title) =>
        apiFetch('/search/movie', { query: title, page: 1, include_adult: false }).catch(() => null)
      );
      const searchFetches = (searches || []).map((term) =>
        apiFetch('/search/movie', { query: term, page: 1, include_adult: false }).catch(() => null)
      );

      const [titleResponses, searchResponses] = await Promise.all([
        Promise.all(titleFetches),
        Promise.all(searchFetches),
      ]);

      // Los títulos reconocidos por la IA se priorizan: solo tomamos el resultado más
      // relevante (el primero) de cada título, para no diluir el resultado con coincidencias flojas.
      for (const data of titleResponses) {
        const movie = data?.results?.[0];
        if (movie && !seen.has(movie.id) && movie.poster_path) {
          seen.add(movie.id);
          titleResults.push(movie);
        }
      }

      for (const data of searchResponses) {
        for (const movie of data?.results || []) {
          if (!seen.has(movie.id) && movie.poster_path && movie.vote_average > 5) {
            seen.add(movie.id);
            genreResults.push(movie);
          }
        }
      }

      genreResults.sort((a, b) => b.popularity - a.popularity);

      // Combinamos: primero las coincidencias de trama/título (más precisas), luego rellenamos
      // con los resultados de género/mood hasta completar 4.
      const combined = [...titleResults, ...genreResults];
      const top = combined.slice(0, 4);

      setTyping(false);

      if (top.length === 0) {
        addBotHtml(`No encontré películas para <em>"${escHtml(query)}"</em>. Intenta describir el género, el estado de ánimo o un actor/director que te guste.`);
        return;
      }

      if (message) {
        addBotHtml(`🎬 ${escHtml(message)}`);
      } else {
        addBotHtml(`Encontré <strong>${top.length} película${top.length > 1 ? 's' : ''}</strong> que encajan con lo que buscas:`);
      }

      top.forEach((m, i) => {
        setTimeout(() => addMovieResult(m), i * 180);
      });

      setTimeout(() => {
        addBotHtml('¿No es exactamente lo que buscabas? Puedes ser más específico: dime el idioma, cómo quieres sentirte al verla, o el nombre de algún actor.');
      }, top.length * 180 + 500);
    } catch {
      setTyping(false);
      addBotHtml('Hubo un problema al buscar. Verifica tu conexión e intenta de nuevo.');
    }
  }

  function handleSend() {
    const q = input.trim();
    if (!q) return;
    setInput('');
    chatSearch(q);
  }

  return (
    <>
      <div className={`chatbot-panel${open ? ' open' : ''}`} id="chatbotPanel">
        <div className="chat-header">
          <div className="chat-header-left">
            <div className="chat-avatar">
              <svg viewBox="0 0 60 40" fill="none" width="22" height="15">
                <path d="M5 32 Q18 4 30 20 Q42 36 55 8" stroke="#7a5230" strokeWidth="8" strokeLinecap="round" fill="none" />
                <path d="M5 32 Q18 4 30 20 Q42 36 55 8" stroke="#e8822a" strokeWidth="4" strokeLinecap="round" fill="none" strokeDasharray="18 36" />
              </svg>
            </div>
            <div>
              <div className="chat-name">CineBot UA</div>
              <div className="chat-status">
                <span className="chat-dot" />
                {isAIConfigured() ? 'IA activa (Llama / Groq)' : 'Falta configurar API key'}
              </div>
            </div>
          </div>
          <button className="chat-close-btn" id="chatCloseBtn" aria-label="Cerrar chat" onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="chat-messages" id="chatMessages">
          {messages.map((m) => {
            if (m.type === 'bot-html') {
              return (
                <div className="chat-msg bot" key={m.id}>
                  <div className="chat-bubble" dangerouslySetInnerHTML={{ __html: m.html }} />
                  <div className="chat-time">{m.time}</div>
                </div>
              );
            }
            if (m.type === 'user') {
              return (
                <div className="chat-msg user" key={m.id}>
                  <div className="chat-bubble">{m.text}</div>
                  <div className="chat-time">{m.time}</div>
                </div>
              );
            }
            return <ChatMovieResult key={m.id} movie={m.movie} onOpenDetails={onOpenDetails} />;
          })}

          {typing && (
            <div className="chat-typing">
              <span />
              <span />
              <span />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {showSuggestions && (
          <div className="chat-suggestions-row" id="chatSuggestions">
            {SUGGESTIONS.map((s) => (
              <button
                key={s.q}
                className="chat-sugg"
                onClick={() => {
                  setInput(s.q);
                  chatSearch(s.q);
                }}
              >
                {s.emoji}
              </button>
            ))}
          </div>
        )}

        <div className="chat-input-row">
          <input
            type="text"
            id="chatInput"
            className="chat-input-field"
            placeholder='Ej: "drama familiar triste", "thriller años 80"…'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button className="chat-send-btn" aria-label="Enviar" onClick={handleSend}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22,2 15,22 11,13 2,9" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
