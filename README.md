# 🎬 UAPelis — React + Vite

Catálogo de películas con datos de [TheMovieDB](https://www.themoviedb.org), trailers de YouTube,
un chatbot de búsqueda por intención ("CineBot") y un sistema de reseñas de la comunidad persistido
en `localStorage`.

Este proyecto es la migración de la versión original (HTML + JS vanilla con "islas" de React vía
CDN/Babel) a una estructura **React + Vite** correcta, con componentes, hooks y módulos separados.

## 🚀 Empezar

```bash
npm install
npm run dev
```

Abre la URL que te indique Vite (normalmente http://localhost:5173).

## 🔑 Configurar tu API Key de TMDB

1. Copia `.env.example` como `.env` (ya viene incluido un `.env` con una key de ejemplo).
2. Consigue tu propia clave gratuita en https://www.themoviedb.org/settings/api
3. Reemplaza el valor de `VITE_TMDB_API_KEY` en `.env`.

```
VITE_TMDB_API_KEY=tu_clave_aqui
```

## 🤖 Configurar CineBot (Llama / Groq)

CineBot usa **Llama (vía Groq)** para interpretar lo que escribe el usuario (estado de ánimo, género,
década, actor, etc.) y traducirlo en búsquedas relevantes para TMDB. Groq ofrece una API gratuita.
Es **obligatorio** configurar la API key de Groq; sin ella, el chat muestra un aviso pidiendo que la configures.

1. Crea una cuenta y una API key gratis en https://console.groq.com/keys
2. En tu `.env`, completa:

```
VITE_GROQ_API_KEY=gsk_tu-clave-aqui
VITE_GROQ_MODEL=llama-3.3-70b-versatile
```

3. Reinicia `npm run dev`. Verás "IA activa (Llama / Groq)" en el encabezado del chat.

⚠️ **Importante — esto es un proyecto frontend (Vite/React)**. Cualquier variable que empiece con
`VITE_` queda incluida en el código JavaScript que se descarga en el navegador, así que tu
`VITE_GROQ_API_KEY` **será visible para cualquiera que inspeccione el sitio** una vez publicado.
Esto es aceptable para desarrollo/pruebas locales, pero **no la publiques así en producción**:

- Opción recomendada: crea un pequeño backend (Node/Express, una función serverless de Vercel/
  Netlify, etc.) que reciba la consulta del usuario, llame a Groq con la key guardada como
  variable de entorno **del servidor** (sin prefijo `VITE_`), y le devuelva el resultado al
  frontend. El frontend nunca vería la key.
- En `src/api/groq.js` solo tendrías que cambiar la URL de `https://api.groq.com/...` por la
  de tu propio endpoint (ej. `/api/cinebot`), sin tocar el resto del chatbot.

## 📦 Build de producción

```bash
npm run build
npm run preview   # sirve el build localmente para probarlo
```

## 🗂️ Estructura del proyecto

```
src/
├── api/
│   ├── tmdb.js               # cliente de la API de TMDB + helpers de formato
│   └── groq.js                # cliente de Llama/Groq (interpreta las búsquedas de CineBot)
├── components/
│   ├── Header/Header.jsx
│   ├── Hero/Hero.jsx
│   ├── Movies/
│   │   ├── MovieCard.jsx
│   │   ├── MoviesGrid.jsx
│   │   ├── MovieSkeletons.jsx
│   │   └── LoadMoreButton.jsx
│   ├── Modals/
│   │   ├── DetailModal.jsx
│   │   └── TrailerModal.jsx
│   ├── Chatbot/
│   │   ├── ChatbotPanel.jsx
│   │   ├── ChatMovieResult.jsx
│   │   └── FloatChatButton.jsx
│   ├── Reviews/
│   │   ├── ReviewModal.jsx
│   │   ├── ReviewsSection.jsx
│   │   ├── ReviewCard.jsx
│   │   ├── ReplyBox.jsx
│   │   └── StarRow.jsx
│   └── Footer/Footer.jsx
├── data/
│   └── constants.js          # géneros, secciones, títulos
├── hooks/
│   ├── useMovies.js          # sección activa, búsqueda, paginación
│   ├── useHero.js            # selección de la película destacada + trailer
│   ├── useReviews.js         # reseñas con persistencia en localStorage
│   └── useToast.jsx          # sistema de notificaciones tipo "toast"
├── utils/
│   └── helpers.js            # escHtml, fechas, validación de lenguaje ofensivo
├── App.jsx
├── main.jsx
└── index.css                 # estilos originales del proyecto
```

## ✨ Funcionalidades

- Navegación por secciones: Populares, Mejor valoradas, Próximos estrenos, En cartelera.
- Buscador de películas.
- Hero destacado con trailer.
- Modal de detalle con reparto y trailer.
- **CineBot**: chat impulsado por Llama (Groq) que interpreta frases en español ("drama emotivo",
  "terror psicológico", etc.) y busca películas afines en TMDB.
- **Reseñas de la comunidad**: calificación por estrellas, likes y respuestas, persistidas en
  `localStorage` del navegador.

## 🧱 Notas de la migración

El proyecto original cargaba React vía CDN (`unpkg`) + Babel standalone en el navegador, montando
dos "islas" de React (`reviews.jsx`) dentro de una página principalmente manipulada con DOM vanilla
(`app.js`). En esta versión **todo es una sola aplicación React** con Vite como bundler:

- Toda la lógica de `app.js` (fetch a TMDB, render del grid, modal, hero, chatbot) se convirtió en
  componentes y hooks de React.
- Los componentes de `reviews.jsx` se integraron de forma nativa en el árbol de React (ya no se
  necesitan `ReactDOM.createPortal` ni los puentes `window.openReviewModal` / `window.showToast`
  para comunicar "islas").
- La API key se movió a una variable de entorno (`VITE_TMDB_API_KEY`) en vez de estar hardcodeada
  en el código fuente.
