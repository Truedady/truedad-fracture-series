import React from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Backdrop, Dust, Finish} from '../components/Atmosphere';
import {ArticleShot} from '../components/Article';
import {C} from '../lib/theme';
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

// Запись прокрутки csgodatabase.com (содержимое первого кейса) — лежит только у автора:
// public/news/csgodatabase.mp4. DB_START — с какой секунды записи начинать, DB_RATE — скорость.
const DB_START = 1.5;
const DB_RATE = 1.8;

const PAGE = {src: 'news/armsdeal-page.jpg', w: 1600, h: 3600, source: ''};
const GUIDE = {src: 'news/market-guide-2013.jpg', w: 1600, h: 2600, source: ''};
const CASES = {src: 'news/market-cases-today-hd.jpg', w: 1600, h: 1300, source: ''};
const DEAL = {src: 'news/csgo-daily-deal-75.jpg', w: 1600, h: 750, source: ''};
const GI = {src: 'news/gameinformer-steam-sale-2013.jpg', w: 1600, h: 1700, source: ''};

/** Скриншоты карточками (не на весь экран), появляются по очереди, медленный наезд. */
const Cards: React.FC<{f: number; items: {src: string; x: number; y: number; w: number; r?: number; at?: number}[]}> = ({f, items}) => (
  <AbsoluteFill style={{transform: `scale(${1 + f * 0.00035})`}}>
    {items.map((c, i) => {
      const a = k(f, [c.at ?? i * 10, (c.at ?? i * 10) + 14], [0, 1], E.out);
      return (
        <div key={c.src} style={{position: 'absolute', left: c.x, top: c.y + (1 - a) * 50, width: c.w, opacity: a, transform: `rotate(${c.r ?? 0}deg)`, boxShadow: '0 30px 90px rgba(0,0,0,0.75)', border: `3px solid ${C.ivory}`}}>
          <Img src={staticFile(c.src)} style={{width: c.w, display: 'block'}} />
        </div>
      );
    })}
  </AbsoluteFill>
);

const SHOTS: {from: number; to: number; el: React.FC<{dur: number}>}[] = [
  // 0–4.6 «14 августа 2013 года выходит обновление Arms Deal…» — официальная страница обновления
  {
    from: 0,
    to: 4.6,
    el: ({dur}) => (
      <Shot dur={dur}>
        {() => <ArticleShot {...PAGE} cams={[{t: 0, x: 800, y: 470, z: 1.0}, {t: 4.6, x: 800, y: 520, z: 1.12}]} />}
      </Shot>
    ),
  },
  // 4.4–7.9 «…первые раскраски, кейсы и ножи» — запись csgodatabase: содержимое CS:GO Weapon Case
  {
    from: 4.4,
    to: 7.9,
    el: ({dur}) => (
      <Shot dur={dur}>
        {(f) => (
          <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
            <div style={{width: 1560, transform: `scale(${1 + f * 0.0006})`, boxShadow: '0 30px 90px rgba(0,0,0,0.75)', border: `3px solid ${C.ivory}`, overflow: 'hidden', background: '#000'}}>
              <OffthreadVideo src={staticFile('news/csgodatabase.mp4')} muted startFrom={Math.round(DB_START * 30)} playbackRate={DB_RATE} style={{width: 1560, display: 'block'}} />
            </div>
          </AbsoluteFill>
        )}
      </Shot>
    ),
  },
  // 7.7–11.1 «С точки зрения рынка — сотни новых товаров» — коллекции Arms Deal и eSports 2013
  {
    from: 7.7,
    to: 11.3,
    el: ({dur}) => (
      <Shot dur={dur}>
        {(f) => (
          <Cards
            f={f}
            items={[
              {src: 'news/user-23.jpg', x: 110, y: 190, w: 840, r: -3},
              {src: 'news/user-24.jpg', x: 970, y: 330, w: 840, r: 2, at: 14},
            ]}
          />
        )}
      </Shot>
    ),
  },
  // 11.1–19.4 «…можно было перепродавать. Достал скин — продаёшь» — гайд по Community Market со старыми скринами рынка
  {
    from: 11.1,
    to: 19.6,
    el: ({dur}) => (
      <Shot dur={dur}>
        {() => (
          <ArticleShot
            {...GUIDE}
            cams={[
              {t: 0, x: 800, y: 420, z: 1.0},
              {t: 3.0, x: 800, y: 1250, z: 1.0},
              {t: 4.5, x: 770, y: 1480, z: 1.4},
              {t: 8.5, x: 770, y: 1500, z: 1.45},
            ]}
            marks={[{t: 0.6, x: 655, y: 278, w: 252, h: 33, spot: true}]}
          />
        )}
      </Shot>
    ),
  },
  // 19.4–25.0 «Выпал редкий нож…» — Karambit | Case Hardened
  {
    from: 19.4,
    to: 25.2,
    el: ({dur}) => (
      <Shot dur={dur}>
        {(f) => <Cards f={f} items={[{src: 'news/user-25.jpg', x: 360, y: 130, w: 1200}]} />}
      </Shot>
    ),
  },
  // 25.0–37.4 «CS:GO привела в торговлю огромное количество новых людей…» — торговая площадка, кейсы в продаже
  {
    from: 25.0,
    to: 37.6,
    el: ({dur}) => (
      <Shot dur={dur}>
        {() => (
          <ArticleShot
            {...CASES}
            cams={[
              {t: 0, x: 800, y: 600, z: 1.0},
              {t: 12.6, x: 800, y: 760, z: 1.12},
            ]}
            marks={[{t: 4.0, x: 376, y: 586, w: 160, h: 20, spot: true}]}
          />
        )}
      </Shot>
    ),
  },
  // 37.4–42.6 «коллекционные истории… редкие паттерны» — AWP | Dragon Lore
  {
    from: 37.4,
    to: 42.8,
    el: ({dur}) => (
      <Shot dur={dur}>
        {(f) => <Cards f={f} items={[{src: 'news/user-26.jpg', x: 420, y: 110, w: 1080}]} />}
      </Shot>
    ),
  },
  // 42.6–47.2 «…суммы, сравнимые со стоимостью автомобиля или квартиры» — AK-47 Case Hardened, редкий паттерн
  {
    from: 42.6,
    to: 47.4,
    el: ({dur}) => (
      <Shot dur={dur}>
        {(f) => <Cards f={f} items={[{src: 'news/user-27.jpg', x: 330, y: 130, w: 1260}]} />}
      </Shot>
    ),
  },
  // 47.2–52.2 «параллельно существовал другой рынок…» — Steam: Daily Deal CS:GO 75% Off
  {
    from: 47.2,
    to: 52.4,
    el: ({dur}) => (
      <Shot dur={dur}>
        {() => (
          <ArticleShot
            {...DEAL}
            cams={[
              {t: 0, x: 700, y: 330, z: 1.0},
              {t: 5.2, x: 640, y: 320, z: 1.25},
            ]}
            marks={[{t: 1.0, x: 328, y: 200, w: 380, h: 55, spot: true}]}
          />
        )}
      </Shot>
    ),
  },
  // 52.2–57.5 «…зарабатывать на самих играх» — Game Informer, распродажа 21.12.2013
  {
    from: 52.2,
    to: 57.55,
    el: ({dur}) => (
      <Shot dur={dur}>
        {() => (
          <ArticleShot
            {...GI}
            cams={[
              {t: 0, x: 800, y: 500, z: 1.0},
              {t: 2.0, x: 700, y: 1250, z: 1.15},
              {t: 5.3, x: 700, y: 1300, z: 1.25},
            ]}
            marks={[{t: 2.2, x: 530, y: 1408, w: 263, h: 19, spot: true}]}
          />
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
