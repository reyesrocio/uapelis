export function escHtml(t) {
  return String(t)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export function fmtDate(ts) {
  return new Date(ts).toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function getTime() {
  return new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
}

const OFFENSIVE_WORDS = [
  'idiota', 'estupido', 'estúpido', 'imbecil', 'imbécil', 'basura', 'maldito', 'maldita',
  'inutil', 'inútil', 'asqueroso', 'asquerosa', 'horrible', 'odio', 'pésimo', 'pésima',
  'nefasto', 'nefasta', 'porqueria', 'porquería', 'mediocre', 'bodrio', 'asco',
];

export function hasOffensive(text) {
  const n = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return OFFENSIVE_WORDS.some((w) => n.includes(w));
}
