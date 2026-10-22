import words from '../../../data/news/fracture-day-02.words.json';
import type {CinemaEpisode} from './TrueDadNewsCinema';

// Fracture Case — day 2, «Монтаж без излишеств».
// Source: release day-02-assets/1021.mp4 (3840x2160, 60 fps, 59.5 s) -> footage-4k30.mp4 (scripts/fetch-day02.sh).
// Voiceover: 1021.1.MP3 (41.82 s). Coordinates below are source pixels (3840x2160).
//   1.1–5.1   Steam listing, before the order: 173 849 for sale from 40,78; 3 365 030 buy requests at 40,27
//   5.1–17.6  "Place Buy Order": 40,78/1 -> types 40 руб. (8.4) and 25 (9.0) -> Purchase (10.2) -> confirm/finding -> done
//   17.6–31   listing after the order: 173 854 from 40,61; own order «Снять ордер 25 шт. | 40.00 ₽»
//   31–40.4   scroll to the month median chart, cursor at the latest point
//   48.7–53.3 CS2 «Новый предмет» reveal of Кейс «Разлом», card 1/25 at 48.75–49.75 (black card at ~49.8, flashes after)
//   53.5–58.7 CS2 inventory full of cases
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
  intro: {until: 3.2, kicker: 'ЭКСПЕРИМЕНТ TRUEDAD', big: 'ДЕНЬ 2', bigSuffix: '/ 30', line: 'FRACTURE CASE'},
  shots: [
    {
      // «Этот кейс уже давно не выпадает в CS2…» — slow-motion reveal of the case in CS2
      id: 'case-reveal',
      from: 0,
      to: 5.9,
      // calm first card (48.75–49.75, before the black frame at ~49.8), slowed down
      src: {start: 48.75, rate: 0.165},
      cam: [
        {t: 0, cx: 1730, cy: 1250, w: 1500},
        {t: 5.9, cx: 1760, cy: 1200, w: 1420},
      ],
    },
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
      spots: [{t0: 10.0, t1: 17.5, x: 1220, y: 1162, w: 430, h: 40}],
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
  // soft hit on frame 0; swishes only on the two story turns (to the purchase, to the question)
  sfx: [
    {at: 0, kind: 'hit', volume: 0.22},
    {at: 28.32, kind: 'swish'},
    {at: 34.65, kind: 'swish'},
  ],
};
