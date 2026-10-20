// Canonical TrueDad design tokens (see brand/STYLE_GUIDE.md).
export const C = {
  canvas: '#0B0E13',
  card: '#151A22',
  cardHi: '#1B212B',
  border: '#2B3440',
  gold: '#D9A93D',
  goldHi: '#F0C766',
  goldDim: 'rgba(217,169,61,0.18)',
  ivory: '#F4F1E9',
  muted: '#98A3B5',
  dim: '#5D6878',
  loss: '#E54C58',
  lossDim: 'rgba(229,76,88,0.16)',
  gain: '#35B99A',
} as const;

export const F = {
  text: '"Manrope", system-ui, sans-serif',
  display: '"Unbounded", "Manrope", system-ui, sans-serif',
  mono: '"IBM Plex Mono", ui-monospace, monospace',
} as const;

export const FPS = 30;
export const W = 1080;
export const H = 1920;

// Safe area for TikTok / Shorts UI (brand guide: x 75..915 for critical content, y 180..1540).
export const SAFE = {left: 90, right: 90, top: 170, bottom: 1540, captionY: 1330} as const;
