import {continueRender, delayRender, staticFile} from 'remotion';

// Self-hosted OFL fonts (copied from @fontsource packages into public/fonts).
const LATIN = 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD';
const CYRILLIC = 'U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116';

const faces: Array<[family: string, file: string, weight: number]> = [
  ['Manrope', 'manrope', 500],
  ['Manrope', 'manrope', 700],
  ['Manrope', 'manrope', 800],
  ['Unbounded', 'unbounded', 600],
  ['Unbounded', 'unbounded', 800],
  ['IBM Plex Mono', 'ibm-plex-mono', 500],
  ['IBM Plex Mono', 'ibm-plex-mono', 600],
];

let loaded = false;
export const ensureFonts = () => {
  if (loaded || typeof document === 'undefined') return;
  loaded = true;
  const handle = delayRender('Loading brand fonts');
  const all = faces.flatMap(([family, file, weight]) =>
    (['latin', 'cyrillic'] as const).map((subset) => {
      const face = new FontFace(family, `url(${staticFile(`fonts/${file}-${subset}-${weight}-normal.woff2`)}) format('woff2')`, {
        weight: String(weight),
        unicodeRange: subset === 'latin' ? LATIN : CYRILLIC,
      });
      document.fonts.add(face);
      return face.load();
    }),
  );
  Promise.all(all)
    .then(() => continueRender(handle))
    .catch((err) => {
      console.error(err);
      continueRender(handle);
    });
};
