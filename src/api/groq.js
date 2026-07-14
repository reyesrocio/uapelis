// ═══════════════════════════════════════════════════════
//  Cliente de Groq (Llama) para CineBot
//  Interpreta lo que escribe el usuario y devuelve:
//   - searches: términos de búsqueda en inglés para TMDB
//   - message:  mensaje amigable en español para mostrar en el chat
//  API gratuita: https://console.groq.com
// ═══════════════════════════════════════════════════════

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_MODEL = import.meta.env.VITE_GROQ_MODEL || 'llama-3.3-70b-versatile';
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

const SYSTEM_PROMPT = `Eres CineBot, el asistente de un catálogo de películas que usa la API de TheMovieDB (TMDB).
Interpretas lo que pide el usuario y lo conviertes en búsquedas útiles para TMDB. El usuario puede:
(a) describir un género/mood/década/actor de forma general, o
(b) describir la TRAMA o argumento de una película específica (a veces sin saber el título),
    por ejemplo: "un niño robot que busca a su mamá" o "un hombre atrapado repitiendo el mismo día".

Reglas:
- Responde EXCLUSIVAMENTE con un JSON válido, sin texto adicional, sin markdown, sin backticks.
- Formato exacto: {"titles": ["Título 1", "Título 2"], "searches": ["termino1", "termino2"], "message": "mensaje breve en español"}
- "titles": SI reconoces qué película(s) específica(s) describe la trama, pon aquí sus títulos ORIGINALES
  reales (en inglés o idioma original, como aparecen en TMDB), de 1 a 3, ordenados del más al menos probable.
  Si no reconoces ninguna película concreta, deja esta lista vacía [].
- "searches": de 1 a 3 términos de búsqueda EN INGLÉS, cortos (2-4 palabras), pensados para buscar
  películas por género/tema/mood en TMDB (ej: "psychological horror", "feel good comedy", "war drama").
  Inclúyelos SIEMPRE como respaldo, incluso si ya llenaste "titles", por si el título no aparece.
- "message": una frase corta y amable en español, con un emoji, anunciando qué vas a mostrar. Si reconociste
  una trama específica, puedes mencionarlo con naturalidad (sin asegurar 100% que es correcto).
- Si el mensaje del usuario no tiene relación alguna con películas o es inapropiado/ofensivo, responde:
  {"titles": [], "searches": [], "message": "Cuéntame qué tipo de película buscas: un género, un estado de ánimo, una época, un actor, o incluso descríbeme de qué trata 🎬"}
- Solo pon en "titles" películas reales que existan y de las que estés razonablemente seguro por la descripción.
  Nunca inventes un título que no exista.`;

/**
 * Llama a Groq (Llama) para interpretar la consulta del usuario.
 * Lanza un error si no hay API key configurada o si la petición falla.
 */
export async function interpretQueryWithAI(query) {
  if (!GROQ_API_KEY) {
    throw new Error('missing_api_key');
  }

  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      temperature: 0.4,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: query },
      ],
      response_format: { type: 'json_object' },
    }),
  });

  if (!res.ok) {
    throw new Error(`groq_${res.status}`);
  }

  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content || '{}';

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('invalid_json');
  }

  const titles = Array.isArray(parsed.titles) ? parsed.titles.filter(Boolean) : [];
  const searches = Array.isArray(parsed.searches) ? parsed.searches.filter(Boolean) : [];
  const message = typeof parsed.message === 'string' ? parsed.message : null;

  return { titles, searches, message };
}

export function isAIConfigured() {
  return Boolean(GROQ_API_KEY);
}
