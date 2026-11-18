import {continueRender, delayRender, staticFile} from 'remotion';

// Шрифты грузятся с таймаутом и повтором; если шрифт не загрузился — рендер НЕ останавливается.
const CYR = 'U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116';
const LIST: {family: string; file: string; weight: string; range?: string}[] = [
  {family: 'Inter Display', file: 'InterDisplay-Bold.otf', weight: '700'},
  {family: 'Inter', file: 'Inter-Regular.otf', weight: '400'},
  {family: 'Inter', file: 'Inter-Medium.otf', weight: '500'},
  {family: 'JetBrains Mono', file: 'jetbrains-mono-cyrillic-500-normal.woff2', weight: '500', range: CYR},
  {family: 'JetBrains Mono', file: 'jetbrains-mono-latin-500-normal.woff2', weight: '500'},
];

let started = false;
export const ensureFonts = () => {
  if (started) return;
  started = true;
  const handle = delayRender('fonts', {timeoutInMilliseconds: 60000});
  const one = (f: (typeof LIST)[number]) => {
    const go = () =>
      Promise.race([
        new FontFace(f.family, `url('${staticFile(`fonts/${f.file}`)}')`, {weight: f.weight, unicodeRange: f.range})
          .load()
          .then((ff) => {
            document.fonts.add(ff);
          }),
        new Promise<void>((_, rej) => setTimeout(() => rej(new Error('timeout')), 8000)),
      ]);
    return go().catch(go).catch(() => undefined);
  };
  Promise.all(LIST.map(one)).finally(() => continueRender(handle));
};
