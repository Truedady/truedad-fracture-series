import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Backdrop, Dust, Finish} from '../components/Atmosphere';
import {ArticleShot} from '../components/Article';
import {Gift} from '../components/Items2';
import {C, FONT} from '../lib/theme';
import {E, k} from '../lib/anim';

/*
 * ОЗВУЧКА · ГЛАВА 02 «ПОЯВЛЕНИЕ CS:GO И РЫНКА СКИНОВ» — минимальный монтаж (57,5 с).
 * Тайминги — по паузам в записи (7,7 · 11,1 · 19,4 · 25,0 · 29,2 · 47,2 с) и длине фраз.
 * Кадры монтажной карты 11–15. Источники: пост Valve об Arms Deal (14.08.2013)
 * и современная торговая площадка Steam (подписана как «сегодня»).
 */
export const NARR02_DURATION = Math.ceil(57.55 * 30);
const s = (sec: number) => Math.round(sec * 30);

const Shot: React.FC<{dur: number; children: (f: number) => React.ReactNode}> = ({dur, children}) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{opacity: k(f, [0, 12], [0, 1]) * k(f, [dur - 12, dur], [1, 0])}}>{children(f)}</AbsoluteFill>;
};

const ARMS = {src: 'news/arms-deal-2013.jpg', w: 2000, h: 1500, source: 'blog.counter-strike.net · Valve · 14.08.2013'};
const CASES = {src: 'news/market-cases-today.jpg', w: 2000, h: 1300, source: 'steamcommunity.com/market · торговая площадка Steam · сегодня'};
const KNIFE = {src: 'news/market-karambit-today.jpg', w: 2000, h: 1300, source: 'steamcommunity.com/market · торговая площадка Steam · сегодня'};
const CH = {src: 'news/market-case-hardened-today.jpg', w: 2000, h: 1300, source: 'steamcommunity.com/market · торговая площадка Steam · сегодня'};

const SHOTS: {from: number; to: number; el: React.FC<{dur: number}>}[] = [
  // 0–7.7 «14 августа 2013 года выходит Arms Deal… С точки зрения игрока — косметика»
  {
    from: 0,
    to: 7.9,
    el: ({dur}) => (
      <Shot dur={dur}>
        {() => (
          <ArticleShot
            {...ARMS}
            cams={[
              {t: 0, x: 1000, y: 560, z: 0.96},
              {t: 1.6, x: 1000, y: 620, z: 1.15},
              {t: 2.8, x: 700, y: 610, z: 2.3},
              {t: 4.6, x: 840, y: 712, z: 2.0},
              {t: 7.9, x: 840, y: 730, z: 2.1},
            ]}
            marks={[
              {t: 2.4, x: 562, y: 590, w: 104, h: 20, spot: true},
              {t: 4.2, x: 562, y: 680, w: 560, h: 20, spot: true},
              {t: 5.8, x: 562, y: 722, w: 552, h: 42, spot: true},
            ]}
          />
        )}
      </Shot>
    ),
  },
  // 7.7–11.1 «С точки зрения рынка — сотни новых товаров…»
  {
    from: 7.7,
    to: 11.3,
    el: ({dur}) => (
      <Shot dur={dur}>
        {() => (
          <ArticleShot
            {...CASES}
            cams={[
              {t: 0, x: 1180, y: 720, z: 0.98},
              {t: 3.6, x: 1180, y: 660, z: 1.18},
            ]}
          />
        )}
      </Shot>
    ),
  },
  // 11.1–19.4 «…эти предметы можно было перепродавать. Достал скин — продаёшь»
  {
    from: 11.1,
    to: 19.6,
    el: ({dur}) => (
      <Shot dur={dur}>
        {() => (
          <ArticleShot
            {...ARMS}
            cams={[
              {t: 0, x: 840, y: 800, z: 1.9},
              {t: 3.0, x: 840, y: 838, z: 2.1},
              {t: 8.5, x: 760, y: 870, z: 2.3},
            ]}
            marks={[
              {t: 0.8, x: 562, y: 808, w: 560, h: 62, spot: true},
              {t: 4.2, x: 562, y: 872, w: 332, h: 20, spot: true},
            ]}
          />
        )}
      </Shot>
    ),
  },
  // 19.4–25.0 «Выпал редкий нож — цена зависит от спроса и предложений»
  {
    from: 19.4,
    to: 25.2,
    el: ({dur}) => (
      <Shot dur={dur}>
        {() => (
          <ArticleShot
            {...KNIFE}
            cams={[
              {t: 0, x: 1000, y: 640, z: 1.0},
              {t: 1.8, x: 920, y: 480, z: 1.6},
              {t: 4.0, x: 760, y: 760, z: 1.7},
              {t: 5.8, x: 760, y: 780, z: 1.75},
            ]}
            marks={[
              {t: 1.6, x: 1060, y: 362, w: 292, h: 34, spot: true},
              {t: 3.6, x: 548, y: 710, w: 124, h: 64, spot: true},
            ]}
          />
        )}
      </Shot>
    ),
  },
  // 25.0–37.4 «CS:GO привела в торговлю огромное количество новых людей…»
  {
    from: 25.0,
    to: 37.6,
    el: ({dur}) => (
      <Shot dur={dur}>
        {() => (
          <ArticleShot
            {...CASES}
            cams={[
              {t: 0, x: 1180, y: 700, z: 1.0},
              {t: 3.0, x: 640, y: 540, z: 1.8},
              {t: 6.6, x: 1240, y: 560, z: 1.8},
              {t: 9.6, x: 900, y: 860, z: 1.7},
              {t: 12.6, x: 900, y: 880, z: 1.72},
            ]}
            marks={[
              {t: 3.0, x: 376, y: 586, w: 170, h: 20, spot: true},
              {t: 6.4, x: 1020, y: 586, w: 170, h: 20, spot: true},
              {t: 9.4, x: 698, y: 880, w: 170, h: 20, spot: true},
            ]}
          />
        )}
      </Shot>
    ),
  },
  // 37.4–47.2 «коллекционные истории: старые коллекции, паттерны, флоаты… суммы как авто»
  {
    from: 37.4,
    to: 47.4,
    el: ({dur}) => (
      <Shot dur={dur}>
        {() => (
          <ArticleShot
            {...CH}
            cams={[
              {t: 0, x: 1000, y: 620, z: 1.0},
              {t: 2.0, x: 1240, y: 440, z: 1.7},
              {t: 4.6, x: 1180, y: 540, z: 1.9},
              {t: 7.0, x: 880, y: 740, z: 1.6},
              {t: 9.8, x: 700, y: 480, z: 1.8},
            ]}
            marks={[
              {t: 1.8, x: 1062, y: 366, w: 392, h: 34, spot: true},
              {t: 4.0, x: 1060, y: 546, w: 140, h: 20, spot: true},
              {t: 6.6, x: 480, y: 704, w: 790, h: 72, spot: true},
            ]}
          />
        )}
      </Shot>
    ),
  },
  // 47.2–57.5 «параллельно существовал другой рынок… на самих играх»
  {
    from: 47.2,
    to: 57.55,
    el: ({dur}) => (
      <Shot dur={dur}>
        {(f) => (
          <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
            <div style={{opacity: k(f, [s(4.0), s(5.0)], [0, 1]), transform: `translateY(${k(f, [s(4.0), s(5.5)], [30, 0], E.out)}px) scale(${1 + f * 0.0008})`}}>
              <Gift size={260} />
            </div>
            <div style={{fontFamily: FONT.mono, fontSize: 24, letterSpacing: '0.4em', color: C.muted, marginTop: 30, opacity: k(f, [0, 20], [0, 1])}}>ПАРАЛЛЕЛЬНО — ДРУГОЙ РЫНОК</div>
            <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 84, color: C.ivory, marginTop: 14, opacity: k(f, [s(5.0), s(6.0)], [0, 1])}}>
              Торговля самими играми
            </div>
          </AbsoluteFill>
        )}
      </Shot>
    ),
  },
];

export const Narr02: React.FC = () => (
  <AbsoluteFill style={{background: C.black}}>
    <Backdrop glowOpacity={0.08} />
    <Dust seed="n02" count={40} opacity={0.5} speed={0.6} />
    {SHOTS.map((sh, i) => (
      <Sequence key={i} from={s(sh.from)} durationInFrames={s(sh.to) - s(sh.from)}>
        <sh.el dur={s(sh.to) - s(sh.from)} />
      </Sequence>
    ))}
    <Audio src={staticFile('audio/narr02.mp3')} />
    <Finish vignette={0.75} grain={0.06} />
  </AbsoluteFill>
);
