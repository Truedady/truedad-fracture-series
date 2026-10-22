import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile} from 'remotion';
import words from '../../../data/news/fracture-day-02.words.json';
import {C, FONT} from '../brand';
import {EASE, enter, useT} from '../primitives';
import type {CinemaEpisode} from './TrueDadNewsCinema';

// Fracture Case — day 2, «Монтаж без излишеств».
// Source: release day-02-assets/1021.mp4 (3840x2160, 60 fps, 59.5 s) -> footage-4k30.mp4 (scripts/fetch-day02.sh).
// Voiceover: 1021.1.MP3 (41.82 s). Coordinates below are source pixels (3840x2160).
//   1.1–5.1   Steam listing, before the order: 173 849 for sale from 40,78; 3 365 030 buy requests at 40,27
//   5.1–17.6  "Place Buy Order": 40,78/1 -> types 40 руб. (8.4) and 25 (9.0) -> Purchase (10.2) -> confirm/finding -> done
//   17.6–31   listing after the order: 173 854 from 40,61; own order «Снять ордер 25 шт. | 40.00 ₽»
//   31–40.4   scroll to the month median chart, cursor at the latest point
//   48.7–53.3 CS2 «Новый предмет» reveal of Кейс «Разлом» (still at 49.0 -> case-cutout.png for the opening)
//   53.5–58.7 CS2 inventory full of cases
const CASE = staticFile('news/fracture-day-02/case-cutout.png'); // cut out of the CS2 «Новый предмет» card, 922x564
const OPEN_END = 5.9;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Opening graphic (the only graphic in the cut): the real case render as a product shot, title, day counter.
// Beats: 0 boom + case focus-in · 0.55 light sweep + shimmer · 3.95 «…решил скупать целый месяц» -> ДЕНЬ 2 / 30.
const Opening: React.FC = () => {
  const t = useT();
  const inA = enter(t, -0.3, 1.0); // already partly in on frame 0 (thumbnail)
  const caseW = 880;
  const caseH = (caseW * 564) / 922;
  const float = Math.sin(t * 1.3) * 7;
  const scale = interpolate(t, [0, OPEN_END], [1.1, 1.0], {...clamp, easing: EASE});
  const rot = interpolate(t, [0, OPEN_END], [-7, 3], clamp);
  const sweep = interpolate(t, [0.55, 1.6], [-0.4, 1.4], {...clamp, easing: EASE});
  const kicker = enter(t, 0.25, 0.5);
  const title = enter(t, 0.45, 0.7);
  const day = enter(t, 3.95, 0.6);
  const caseTop = 430;
  return (
    <AbsoluteFill style={{background: C.bg, overflow: 'hidden'}}>
      <AbsoluteFill style={{background: `radial-gradient(60% 34% at 50% 40%, rgba(217,169,61,${0.22 * inA}) 0%, rgba(217,169,61,0.05) 45%, transparent 75%)`}} />
      <AbsoluteFill style={{background: `conic-gradient(from 180deg at 50% -5%, transparent 165deg, rgba(244,241,233,${0.05 * inA}) 180deg, transparent 195deg)`}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: caseTop + caseH + 36, height: 2, background: `linear-gradient(90deg, transparent, rgba(217,169,61,${0.35 * inA}), transparent)`}} />

      <div style={{position: 'absolute', top: 168, left: 0, right: 0, textAlign: 'center'}}>
        <div style={{opacity: kicker, transform: `translateY(${(1 - kicker) * 12}px)`, fontFamily: FONT.mono, fontWeight: 700, fontSize: 26, letterSpacing: 6, color: C.gold}}>ЭКСПЕРИМЕНТ TRUEDAD</div>
        <div style={{overflow: 'hidden', marginTop: 10}}>
          <div style={{transform: `translateY(${(1 - title) * 105}%)`, fontFamily: FONT.sans, fontWeight: 900, fontSize: 104, letterSpacing: -2, lineHeight: 1.02, color: C.white}}>FRACTURE CASE</div>
        </div>
      </div>

      <div style={{position: 'absolute', left: (1080 - caseW) / 2, top: caseTop, width: caseW, height: caseH, perspective: 1600}}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: inA,
            filter: `blur(${(1 - inA) * 14}px) drop-shadow(0 40px 60px rgba(0,0,0,0.6))`,
            transform: `translateY(${float}px) scale(${scale}) rotateY(${rot}deg)`,
          }}
        >
          <Img src={CASE} style={{width: '100%', height: '100%'}} />
          {/* light sweep, masked to the case */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              WebkitMaskImage: `url(${CASE})`,
              WebkitMaskSize: '100% 100%',
              maskImage: `url(${CASE})`,
              maskSize: '100% 100%',
              background: `linear-gradient(105deg, transparent ${sweep * 100 - 18}%, rgba(255,247,220,0.55) ${sweep * 100}%, transparent ${sweep * 100 + 18}%)`,
              mixBlendMode: 'screen',
            }}
          />
        </div>
        {/* soft reflection on the floor */}
        <div style={{position: 'absolute', left: 0, top: caseH + 40, width: caseW, height: caseH * 0.45, overflow: 'hidden', opacity: 0.22 * inA, WebkitMaskImage: 'linear-gradient(to bottom, #000, transparent 80%)', maskImage: 'linear-gradient(to bottom, #000, transparent 80%)'}}>
          <Img src={CASE} style={{width: caseW, height: caseH, transform: `scaleY(-1) translateY(${-float}px) scale(${scale})`, filter: 'blur(3px)'}} />
        </div>
      </div>

      <div style={{position: 'absolute', top: 1160, left: 0, right: 0, textAlign: 'center', opacity: day, transform: `translateY(${(1 - day) * 18}px)`}}>
        <div style={{fontFamily: FONT.sans, fontWeight: 900, fontSize: 132, letterSpacing: -3, lineHeight: 1, color: C.white}}>
          ДЕНЬ 2<span style={{fontSize: 60, color: C.muted, letterSpacing: -1}}> / 30</span>
        </div>
        <div style={{display: 'flex', justifyContent: 'center', gap: 8, marginTop: 30}}>
          {Array.from({length: 30}, (_, i) => {
            const on = i < 2;
            const k = enter(t, 4.15 + i * 0.025, 0.3);
            return <div key={i} style={{width: 18, height: 10, borderRadius: 3, background: on ? C.gold : 'rgba(244,241,233,0.14)', opacity: k, transform: `scaleY(${0.4 + 0.6 * k})`}} />;
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const fractureDay02Footage: CinemaEpisode = {
  footage: 'news/fracture-day-02/footage-4k30.mp4',
  footageSize: {w: 3840, h: 2160},
  // excludes browser tabs, Steam ad banner, the left SIH sidebar and the Windows taskbar
  safeSource: {x0: 60, y0: 240, x1: 3800, y1: 2080},
  voice: 'news/fracture-day-02/voiceover.mp3',
  words,
  durationSec: 42.8,
  dateStamp: '21.10.2026',
  titles: [],
  textless: true,
  panel: {y: 190, h: 1300},
  captions: {y: 1540},
  // «Этот кейс уже давно не выпадает в CS2…» (0–5.9) — opening graphic, then the footage focus-pulls in
  Opening,
  shots: [
    {
      // «Итак, сегодня второй день… количество лотов… 172 -> почти 174 тысяч»
      id: 'listing-lots',
      from: 5.9,
      to: 17.3,
      src: {start: 1.3, rate: 0.33},
      cam: [
        {t: 5.9, cx: 1660, cy: 720, w: 1250},
        {t: 9.9, cx: 1435, cy: 1220, w: 600},
        {t: 17.3, cx: 1435, cy: 1225, w: 560},
      ],
      spots: [{t0: 10.0, t1: 17.5, x: 1216, y: 1118, w: 432, h: 38}], // «173 849 for sale …» line
    },
    {
      // «минимальная цена… 40,61» -> «цена ордеров… до 40 рублей» -> «закупиться дешевле»
      id: 'order-book',
      from: 17.3,
      to: 28.77,
      src: {start: 17.8},
      cam: [
        {t: 17.3, cx: 1435, cy: 1250, w: 560},
        {t: 21.4, cx: 1440, cy: 1250, w: 540},
        {t: 23.2, cx: 2420, cy: 1390, w: 800},
        {t: 28.77, cx: 2430, cy: 1400, w: 760},
      ],
      spots: [
        {t0: 19.5, t1: 21.5, x: 1240, y: 1212, w: 396, h: 42},
        {t0: 21.9, t1: 23.7, x: 2056, y: 1120, w: 548, h: 36},
        {t0: 24.3, t1: 28.9, x: 2420, y: 1636, w: 380, h: 42},
      ],
    },
    {
      // «Но я продолжаю увеличивать объёмы… сегодня покупаю ещё 25» — the real buy-order dialog
      id: 'buy-order',
      from: 28.77,
      to: 35.1,
      src: {start: 5.4},
      cam: [
        {t: 28.77, cx: 1910, cy: 900, w: 1300},
        {t: 31.6, cx: 2300, cy: 720, w: 640},
        {t: 35.1, cx: 2310, cy: 720, w: 580},
      ],
      spots: [{t0: 32.2, t1: 35.3, x: 2070, y: 606, w: 470, h: 100}],
    },
    {
      // «Как думаешь, через месяц… дороже или… дешеветь?» — month median price chart
      id: 'chart',
      from: 35.1,
      to: 40.0,
      src: {start: 33.4},
      cam: [
        {t: 35.1, cx: 1910, cy: 1520, w: 1500},
        {t: 40.0, cx: 2150, cy: 1500, w: 1050},
      ],
    },
    {
      // «Пиши свой прогноз в комментариях» — CS2 inventory full of cases
      id: 'inventory',
      from: 40.0,
      to: 42.8,
      src: {start: 53.7, rate: 0.6},
      cam: [
        {t: 40.0, cx: 1900, cy: 1150, w: 1500},
        {t: 42.8, cx: 1900, cy: 1150, w: 1300},
      ],
    },
  ],
  // No swishes. Sound only where something happens on screen:
  // opening boom + shimmer on the light sweep; real clicks/keystrokes of the buy-order dialog
  // (src 7.27 click, 7.57/7.87 keys «40», 8.17 click, ~8.6/8.73 keys «25», ~10.0 Purchase; out = 28.77 + src − 5.4);
  // a soft shimmer as the inventory full of cases appears.
  sfx: [
    {at: 0, kind: 'boom'},
    {at: 0.55, kind: 'shimmer'},
    {at: 3.95, kind: 'tick', volume: 0.08},
    {at: 30.64, kind: 'click'},
    {at: 30.94, kind: 'key'},
    {at: 31.24, kind: 'key'},
    {at: 31.54, kind: 'click'},
    {at: 31.97, kind: 'key'},
    {at: 32.1, kind: 'key'},
    {at: 33.38, kind: 'click', volume: 0.3},
    {at: 39.6, kind: 'shimmer', volume: 0.1},
  ],
};
