import type {CinemaEpisode} from './TrueDadNewsCinema';
import {evilGeniuses01Cinema} from './evilGeniuses01Cinema';

// Footage-only cut: no titles or cards, only word captions. Tall panel (camera rects are h = 1.2 w).
const LISTING_TOP = 335; // Steam ad banner sits above this on the un-scrolled listing

const cams: Record<string, CinemaEpisode['shots'][number]['cam']> = {
  'hook-chart': [
    {t: 0, cx: 1560, cy: 920, w: 640},
    {t: 5.05, cx: 1650, cy: 905, w: 500},
  ],
  // keeps the post's "декабря 2023" line (y≈1000) out of frame
  statement: [
    {t: 5.05, cx: 1090, cy: 628, w: 580},
    {t: 9.75, cx: 1090, cy: 638, w: 556},
  ],
  'market-take': [
    {t: 9.75, cx: 1400, cy: 860, w: 820},
    {t: 11.1, cx: 1390, cy: 860, w: 840},
    {t: 12.9, cx: 1300, cy: 900, w: 980},
    {t: 13.8, cx: 1520, cy: 900, w: 760},
    {t: 15.8, cx: 1640, cy: 900, w: 600},
    {t: 17.85, cx: 1650, cy: 900, w: 560},
  ],
  sticker: [
    {t: 17.85, cx: 1160, cy: 700, w: 780},
    {t: 24.35, cx: 1200, cy: 680, w: 660},
  ],
  'order-book': [
    {t: 24.35, cx: 1273, cy: 1080, w: 1000},
    {t: 26.0, cx: 990, cy: 1185, w: 680},
    {t: 28.8, cx: 990, cy: 1185, w: 680},
    {t: 31.8, cx: 1560, cy: 1190, w: 680},
    {t: 34.3, cx: 1565, cy: 1200, w: 640},
  ],
  telegram: [
    {t: 34.3, cx: 1300, cy: 690, w: 1000},
    {t: 36.5, cx: 1590, cy: 520, w: 640},
    {t: 39.5, cx: 1590, cy: 520, w: 600},
  ],
};

export const evilGeniuses01Footage: CinemaEpisode = {
  ...evilGeniuses01Cinema,
  textless: true,
  // panel lifted so the captions below it stay clear of the platform UI
  panel: {y: 190, h: 1300},
  captions: {y: 1540},
  shots: evilGeniuses01Cinema.shots.map((s) => ({
    ...s,
    cam: cams[s.id] ?? s.cam,
    minY: s.id === 'sticker' || s.id === 'order-book' ? LISTING_TOP : undefined,
  })),
  // Sound: no swish on every cut. Only the two story turns get one (soft swish peaks ~0.45 s in, on the cut).
  sfx: [
    {at: 0, kind: 'hit', volume: 0.22},
    {at: 9.3, kind: 'swish'}, // statement -> market reaction
    {at: 33.85, kind: 'swish'}, // -> Telegram
  ],
};
