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

const ARMS = {src: 'news/arms-deal-2013-hd.jpg', w: 1600, h: 1400, source: 'blog.counter-strike.net · Valve · 14.08.2013'};
const CASES = {src: 'news/market-cases-today-hd.jpg', w: 1600, h: 1300, source: 'steamcommunity.com/market · торговая площадка Steam · сегодня'};
const KNIFE = {src: 'news/market-karambit-today-hd.jpg', w: 1600, h: 1000, source: 'steamcommunity.com/market · торговая площадка Steam · сегодня'};
const CH = {src: 'news/market-case-hardened-today-hd.jpg', w: 1600, h: 1000, source: 'steamcommunity.com/market · торговая площадка Steam · сегодня'};

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
              {t: 0, x: 800, y: 520, z: 0.95},
              {t: 2.0, x: 645, y: 610, z: 1.45},
              {t: 7.9, x: 645, y: 680, z: 1.5},
            ]}
            marks={[
              {t: 2.0, x: 364, y: 588, w: 64, h: 17, spot: true},
              {t: 4.5, x: 364, y: 692, w: 560, h: 40, spot: true},
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
              {t: 0, x: 800, y: 620, z: 0.95},
              {t: 3.6, x: 800, y: 600, z: 1.05},
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
              {t: 0, x: 645, y: 770, z: 1.45},
              {t: 8.5, x: 645, y: 800, z: 1.5},
            ]}
            marks={[
              {t: 0.8, x: 364, y: 778, w: 560, h: 62, spot: true},
              {t: 4.2, x: 424, y: 843, w: 233, h: 18, spot: true},
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
              {t: 0, x: 800, y: 500, z: 1.0},
              {t: 1.8, x: 850, y: 470, z: 1.3},
              {t: 4.0, x: 650, y: 640, z: 1.3},
              {t: 5.8, x: 650, y: 650, z: 1.33},
            ]}
            marks={[
              {t: 1.6, x: 880, y: 361, w: 265, h: 34, spot: true},
              {t: 3.6, x: 355, y: 703, w: 135, h: 68, spot: true},
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
              {t: 0, x: 800, y: 640, z: 1.0},
              {t: 3.0, x: 560, y: 560, z: 1.3},
              {t: 6.6, x: 1080, y: 560, z: 1.3},
              {t: 9.6, x: 700, y: 860, z: 1.3},
              {t: 12.6, x: 700, y: 870, z: 1.32},
            ]}
            marks={[
              {t: 3.0, x: 376, y: 586, w: 160, h: 20, spot: true},
              {t: 6.4, x: 982, y: 586, w: 160, h: 20, spot: true},
              {t: 9.4, x: 679, y: 901, w: 160, h: 20, spot: true},
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
              {t: 0, x: 800, y: 500, z: 1.0},
              {t: 2.0, x: 950, y: 440, z: 1.3},
              {t: 4.6, x: 900, y: 520, z: 1.35},
              {t: 7.0, x: 700, y: 700, z: 1.25},
              {t: 9.8, x: 700, y: 690, z: 1.3},
            ]}
            marks={[
              {t: 1.8, x: 860, y: 361, w: 378, h: 34, spot: true},
              {t: 4.0, x: 860, y: 544, w: 134, h: 20, spot: true},
              {t: 6.6, x: 288, y: 700, w: 790, h: 76, spot: true},
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
