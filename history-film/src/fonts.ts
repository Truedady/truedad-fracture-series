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
  const handle = delayRender('fonts', {timeoutInMilliseconds: 110000});
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    continueRender(handle);
  };
  // Жёсткий предохранитель: даже если загрузка зависла, кадр рендерится дальше.
  setTimeout(finish, 15000);
  const one = (f: (typeof LIST)[number]): Promise<void> => {
    const go = () =>
      new Promise<void>((resolve, reject) => {
        try {
          const desc: FontFaceDescriptors = {weight: f.weight};
          if (f.range) desc.unicodeRange = f.range;
          const ff = new FontFace(f.family, `url('${staticFile(`fonts/${f.file}`)}')`, desc);
          const timer = setTimeout(() => reject(new Error('timeout')), 8000);
          ff.load().then(
            (x) => {
              clearTimeout(timer);
              document.fonts.add(x);
              resolve();
            },
            (e) => {
              clearTimeout(timer);
              reject(e);
            },
          );
        } catch (e) {
          reject(e);
        }
      });
    return go().catch(go).catch(() => undefined);
  };
  try {
    Promise.all(LIST.map(one)).then(finish, finish);
  } catch {
    finish();
  }
};
