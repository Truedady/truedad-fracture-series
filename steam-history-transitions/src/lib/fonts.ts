import {continueRender, delayRender, staticFile} from 'remotion';

// Все шрифты лежат в public/fonts (Inter — OFL, JetBrains Mono — OFL, DejaVu — свободная лицензия)
const CYR = 'U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116';
const LAT =
  'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD';

const list: {family: string; file: string; weight: string; unicodeRange?: string}[] = [
  {family: 'Inter Display', file: 'InterDisplay-SemiBold.otf', weight: '600'},
  {family: 'Inter Display', file: 'InterDisplay-Bold.otf', weight: '700'},
  {family: 'Inter Display', file: 'InterDisplay-Black.otf', weight: '900'},
  {family: 'Inter', file: 'Inter-Regular.otf', weight: '400'},
  {family: 'Inter', file: 'Inter-Medium.otf', weight: '500'},
  {family: 'Inter', file: 'Inter-SemiBold.otf', weight: '600'},
  {family: 'DejaVu Sans', file: 'DejaVuSans.ttf', weight: '400'},
  {family: 'DejaVu Sans', file: 'DejaVuSans-Bold.ttf', weight: '700'},
  ...(['400', '500', '700'] as const).flatMap((w) => [
    {family: 'JetBrains Mono', file: `jetbrains-mono-cyrillic-${w}-normal.woff2`, weight: w, unicodeRange: CYR},
    {family: 'JetBrains Mono', file: `jetbrains-mono-latin-${w}-normal.woff2`, weight: w, unicodeRange: LAT},
  ]),
];

let started = false;

/*
 * Надёжная загрузка шрифтов: одна задержка на все шрифты, каждый грузится с таймаутом
 * и одной повторной попыткой. Если шрифт так и не загрузился, рендер НЕ останавливается
 * (раньше @remotion/fonts в этом случае обрывал весь рендер на случайном кадре).
 */
const loadOne = (f: (typeof list)[number]) => {
  const attempt = () => {
    const face = new FontFace(f.family, `url('${staticFile(`fonts/${f.file}`)}')`, {weight: f.weight, unicodeRange: f.unicodeRange});
    return Promise.race([
      face.load().then((ff) => {
        document.fonts.add(ff);
      }),
      new Promise<void>((_, rej) => setTimeout(() => rej(new Error('font timeout')), 8000)),
    ]);
  };
  return attempt().catch(() => attempt()).catch(() => undefined);
};

export const ensureFonts = () => {
  if (started) return;
  started = true;
  const handle = delayRender('Загрузка шрифтов', {timeoutInMilliseconds: 60000});
  Promise.all(list.map(loadOne)).finally(() => continueRender(handle));
};
