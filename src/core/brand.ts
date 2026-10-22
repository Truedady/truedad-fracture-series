import {continueRender, delayRender, staticFile} from 'remotion';

// TrueDad brand tokens (see brand/STYLE_GUIDE.md). Red/green only for real market direction.
export const C = {
  bg: '#0B0E13',
  bg2: '#11151C',
  panel: '#151A22',
  line: '#2B3440',
  gold: '#D9A93D',
  goldSoft: 'rgba(217,169,61,0.16)',
  white: '#F4F1E9',
  muted: '#98A3B5',
  red: '#E54C58',
  green: '#26A685',
  tg: '#2AABEE',
};

export const FONT = {
  sans: '"TD Inter", Arial, sans-serif',
  mono: '"TD Mono", "DejaVu Sans Mono", monospace',
};

// 1080x1920 layout: header / evidence window / captions. Keep CTA + captions above platform UI.
export const LAYOUT = {
  W: 1080,
  H: 1920,
  side: 64,
  win: {x: 36, y: 392, w: 1008, h: 1120},
  captionsY: 1556,
};

const LATIN = 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD';
const CYR = 'U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116';

let loaded = false;
export const loadBrandFonts = () => {
  if (loaded || typeof document === 'undefined') return;
  loaded = true;
  const handle = delayRender('TrueDad fonts');
  const faces: FontFace[] = [];
  const add = (family: string, file: string, weight: number) => {
    for (const [subset, range] of [['latin', LATIN], ['cyrillic', CYR]] as const) {
      faces.push(new FontFace(family, `url(${staticFile(`fonts/${file}-${subset}-${weight}-normal.woff2`)}) format('woff2')`, {weight: String(weight), unicodeRange: range}));
    }
  };
  for (const w of [500, 700, 800, 900]) add('TD Inter', 'inter', w);
  for (const w of [500, 700]) add('TD Mono', 'jetbrains-mono', w);
  Promise.all(faces.map((f) => f.load().then(() => document.fonts.add(f))))
    .then(() => continueRender(handle))
    .catch((e) => {
      console.error(e);
      continueRender(handle);
    });
};
