import words from '../../../data/news/evil-geniuses-01.words.json';
import type {CinemaEpisode} from './TrueDadNewsCinema';

// Same sources as episodes/evilGeniuses01.tsx (see the footage map there); six long takes instead of eleven cuts.
// Camera squares are in source pixels; the Steam ad banner (y < 330 on the listing top) stays out of frame.

export const evilGeniuses01Cinema: CinemaEpisode = {
  footage: 'news/evil-geniuses-01/footage.mp4',
  footageSize: {w: 2560, h: 1440},
  safeSource: {x0: 40, y0: 140, x1: 2530, y1: 1388},
  voice: 'news/evil-geniuses-01/voiceover.mp3',
  words,
  durationSec: 39.5,
  dateStamp: '21.10.2026',
  titles: [
    {from: 0, kicker: 'TRUEDAD NEWS · CS2', title: 'EVIL GENIUSES ЗАКРЫВАЕТСЯ'},
    {from: 5.05, kicker: 'ЗАЯВЛЕНИЕ ОРГАНИЗАЦИИ', title: 'РАБОТА ПРЕКРАЩАЕТСЯ СО 2 НОЯБРЯ'},
    {from: 9.75, kicker: 'STEAM MARKET', title: 'ГРАФИК СКАКНУЛ В ДВА РАЗА'},
    {from: 17.85, kicker: 'ВАЖНЫЙ ФАКТ', title: 'КОМАНДЫ НЕТ В CS С 2024 ГОДА'},
    {from: 24.35, kicker: 'ЧТО ЭТО ЗНАЧИТ', title: 'ЗАКРЫТИЕ НЕ СОЗДАЁТ ДЕФИЦИТ'},
    {from: 28.85, kicker: 'МНЕНИЕ TRUEDAD', title: 'ПОСЛЕ РОСТА — НЕ СПЕШИТЬ С ПОКУПКОЙ'},
    {from: 34.3, kicker: 'TRUEDAD TELEGRAM', title: '@truedadEducation', icon: 'telegram', titleColor: '#D9A93D'},
  ],
  outro: {from: 38.2, text: 'Рыночные данные и разбор ситуации с наклейками'},
  shots: [
    {
      // weekly median chart, cursor resting on 21.10 16:00 — $8.97
      id: 'hook-chart',
      from: 0,
      to: 5.05,
      src: {start: 7.4, rate: 0.43},
      cam: [
        {t: 0, cx: 1530, cy: 905, w: 760},
        {t: 5.05, cx: 1640, cy: 900, w: 560},
      ],
      spots: [{t0: 1.4, t1: 5.3, x: 1622, y: 848, w: 124, h: 80}],
    },
    {
      // TrueDad Telegram post: title, then "со 2 ноября 2026"
      id: 'statement',
      from: 5.05,
      to: 9.75,
      src: {start: 10.5, rate: 0.9},
      cam: [
        {t: 5.05, cx: 1090, cy: 700, w: 600},
        {t: 9.75, cx: 1080, cy: 720, w: 520},
      ],
      spots: [
        {t0: 6.5, t1: 8.6, x: 827, y: 703, w: 440, h: 32},
        {t0: 8.75, t1: 10.1, x: 827, y: 784, w: 488, h: 28},
      ],
    },
    {
      // one continuous take of the recording: price box -> real page scroll -> month -> week chart hover
      id: 'market-take',
      from: 9.75,
      to: 17.85,
      src: {start: 1.15},
      cam: [
        {t: 9.75, cx: 1400, cy: 760, w: 860},
        {t: 11.1, cx: 1380, cy: 790, w: 900},
        {t: 12.9, cx: 1300, cy: 900, w: 1000},
        {t: 13.8, cx: 1520, cy: 900, w: 760},
        {t: 15.8, cx: 1640, cy: 900, w: 600},
        {t: 17.85, cx: 1650, cy: 900, w: 560},
      ],
      spots: [
        {t0: 10.0, t1: 11.3, x: 1213, y: 598, w: 387, h: 152},
        {t0: 14.0, t1: 15.4, x: 1662, y: 948, w: 108, h: 78},
        {t0: 16.4, t1: 18.2, x: 1622, y: 848, w: 124, h: 80},
      ],
    },
    {
      // listing top: sticker image, slow pan to the item title
      id: 'sticker',
      from: 17.85,
      to: 24.35,
      src: {start: 0.25, rate: 0.33},
      cam: [
        {t: 17.85, cx: 1160, cy: 680, w: 780},
        {t: 24.35, cx: 1200, cy: 660, w: 660},
      ],
      spots: [{t0: 22.1, t1: 24.7, x: 1210, y: 440, w: 295, h: 98}],
    },
    {
      // order book: sell side (supply) -> buy side (buyers waiting)
      id: 'order-book',
      from: 24.35,
      to: 34.3,
      src: {start: 0.3, rate: 0.2},
      cam: [
        {t: 24.35, cx: 1273, cy: 1080, w: 1040},
        {t: 26.0, cx: 990, cy: 1180, w: 700},
        {t: 28.8, cx: 990, cy: 1185, w: 680},
        {t: 31.8, cx: 1560, cy: 1190, w: 680},
        {t: 34.3, cx: 1565, cy: 1200, w: 640},
      ],
      spots: [
        {t0: 26.1, t1: 28.8, x: 800, y: 1072, w: 348, h: 30},
        {t0: 32.1, t1: 34.6, x: 1384, y: 1072, w: 364, h: 304},
      ],
    },
    {
      // Telegram channel card
      id: 'telegram',
      from: 34.3,
      to: 39.5,
      src: {start: 10.6, rate: 0.8},
      cam: [
        {t: 34.3, cx: 1300, cy: 690, w: 1000},
        {t: 36.5, cx: 1590, cy: 500, w: 640},
        {t: 39.5, cx: 1590, cy: 500, w: 600},
      ],
      spots: [{t0: 35.4, t1: 40, x: 1515, y: 244, w: 160, h: 28}],
    },
  ],
  sfx: [
    {at: 0, kind: 'hit'},
    {at: 4.6, kind: 'whoosh'},
    {at: 9.3, kind: 'whoosh'},
    {at: 17.4, kind: 'whoosh'},
    {at: 23.9, kind: 'whoosh'},
    {at: 33.85, kind: 'whoosh'},
    {at: 34.4, kind: 'pop'},
  ],
};
