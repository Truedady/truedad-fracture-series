import React from 'react';
import words from '../../data/day02.words.json';
import {DayOpening} from '../core/DayOpening';
import type {CinemaEpisode} from '../core/TrueDadNewsCinema';

// Day 2 (21.10.2026) — reference episode for the series.
// Sources: release day-02-assets of Truedady/truedad-fracture-series — 1021.mp4 (3840x2160, 60 fps, 59.5 s), 1021.1.MP3 (41.82 s).
// scripts/fetch-day.sh 02 <video-url> <voice-url> -> public/days/day02/{footage.mp4,voiceover.mp3}
// Footage map (source seconds, 3840x2160 px):
//   1.1–5.1   Steam listing before the order: «173 849 for sale starting at 40,78» (line at y 1118–1156)
//   5.1–17.6  «Place Buy Order»: types 40 руб. and 25, Purchase ~10.0, confirm, done
//   17.6–31   listing after the order: 173 854 from 40,61; own order «Снять ордер 25 шт. | 40.00 ₽»
//   31–40.4   month median price chart
//   48.7–53.3 CS2 «Новый предмет» (case still at 49.0 -> public/brand/fracture-case.png)
//   53.5–58.7 CS2 inventory full of cases
export const day02: CinemaEpisode = {
  footage: 'days/day02/footage.mp4',
  footageSize: {w: 3840, h: 2160},
  // excludes browser tabs, Steam ad banner, the left SIH sidebar and the Windows taskbar
  safeSource: {x0: 60, y0: 240, x1: 3800, y1: 2080},
  voice: 'days/day02/voiceover.mp3',
  words,
  durationSec: 42.8,
  dateStamp: '21.10.2026',
  titles: [],
  textless: true,
  panel: {y: 190, h: 1300},
  captions: {y: 1540},
  // «Этот кейс уже давно не выпадает в CS2…» (0–5.9) — opening graphic; «ДЕНЬ 2 / 30» on «…решил скупать целый месяц»
  Opening: () => <DayOpening day={2} end={5.9} dayAt={3.95} />,
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
