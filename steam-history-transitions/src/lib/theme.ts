// Единая палитра фильма «История заработка в Steam». Основа — brand/STYLE_GUIDE.md TrueDad.
export const C = {
  black: '#050608',
  bg: '#0B0E13', // Graphite
  panel: '#151A22',
  panel2: '#1B212B',
  line: '#2B3440',
  ivory: '#F4F1E9',
  muted: '#98A3B5',
  dim: '#5D6675',
  gold: '#D9A93D',
  goldHi: '#F1CF7A',
  goldDeep: '#8A6424',
  red: '#E54C58', // только блокировки / падение / запрет
  green: '#26A685', // только рост / разрешение
  // Эпоха 2010–2012: «оливковый» скин старого клиента Steam
  olive: '#4C5844',
  olive2: '#3E4637',
  olive3: '#2D3328',
  oliveText: '#C4B550',
  oliveLine: '#5F6B55',
  // Редкости CS:GO, приглушённые, чтобы не спорить с золотом
  milspec: '#4B69FF',
  restricted: '#8847FF',
  classified: '#D32CE6',
  covert: '#EB4B4B',
} as const;

export const FONT = {
  display: '"Inter Display", "Inter", sans-serif',
  text: '"Inter", sans-serif',
  mono: '"JetBrains Mono", "DejaVu Sans Mono", monospace',
  // Verdana-подобный шрифт интерфейса старого Steam
  retroUi: '"DejaVu Sans", Verdana, sans-serif',
} as const;

export const W = 1920;
export const H = 1080;
export const FPS = 30;

// Title-safe 10% / action-safe 5% (в координатах 1920×1080)
export const SAFE = {titleX: 192, titleY: 108, actionX: 96, actionY: 54};
