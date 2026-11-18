import {continueRender, delayRender} from 'remotion';
import {FONT_CSS} from './fontdata';

// Шрифты встроены в код (src/fontdata.ts) — сеть не нужна, загрузка занимает миллисекунды.
// Ожидание короткое и с повтором кадра: если вкладка браузера подвисла, Remotion просто
// перерисует кадр, а не остановит весь рендер.
const CHECK = ['700 40px "Inter Display"', '400 40px "Inter"', '500 40px "Inter"', '500 40px "JetBrains Mono"'];

let started = false;
export const ensureFonts = () => {
  if (started || typeof document === 'undefined') return;
  started = true;
  const style = document.createElement('style');
  style.textContent = FONT_CSS;
  document.head.appendChild(style);

  const handle = delayRender('fonts', {timeoutInMilliseconds: 40000, retries: 3});
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    continueRender(handle);
  };
  setTimeout(finish, 5000);
  try {
    Promise.all(CHECK.map((f) => document.fonts.load(f, 'Шрифт 0123'))).then(finish, finish);
  } catch {
    finish();
  }
};
