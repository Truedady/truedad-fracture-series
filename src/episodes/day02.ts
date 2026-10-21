import captions from '../../data/day02.captions.json';
import type {Episode} from './types';

// Footage: author's 4K recording 1021.mp4 (3840×2160, 60 fps), rendered from a one-off
// 1080p/30 fps copy (scripts/fetch-day.sh --prep). Rects are in a 1600×900 reference space
// (= 4K / 2.4 = 1080p / 1.2). Keep rect width ≥ ~450 so the 1080p source is upscaled ≤ 2×.
// All times below are word onsets from captions/day02.asr-raw.json.

const R = {
  caseImg: {x: 505, y: 172, w: 178, h: 146},
  lotsHeader: {x: 506, y: 464, w: 182, h: 18},
  sellRow1: {x: 517, y: 505, w: 167, h: 18},
  sihOrder: {x: 1010, y: 682, w: 156, h: 17},
  dialogFields: {x: 860, y: 252, w: 236, h: 58},
  successLine: {x: 505, y: 344, w: 196, h: 20},
  navigator: {x: 1116, y: 580, w: 56, h: 26},
  chartEnd: {x: 985, y: 560, w: 125, h: 80},
};

export const day02: Episode = {
  day: 2,
  totalDays: 30,
  caseName: 'Fracture Case',
  caseNameRu: 'Кейс «Разлом»',
  dailyStart: 20,
  dailyStep: 5,
  voiceover: 'assets/day02/1021.1.MP3',
  voDurationSec: 41.822,
  footage: {src: 'assets/day02/footage-1080p.mp4', coordW: 1600, coordH: 900},
  clips: {},
  captions: captions.pages,
  hudProgress: false, // author: header shows only TRUEDAD + case/day chip
  captionY: 1500, // lower caption block: content uses the screen down to ~1470
  beats: {
    hook: 0,
    intro: 5.92, // «итак, сегодня второй день»
    market: 9.12, // «за последние сутки»
    order: 21.5, // «а вот цена ордеров»
    myOrder: 25.3, // «получается, сегодня»
    success: 28.74, // «но я продолжаю»
    inventory: 30.26, // «вчера я купил»
    forecast: 35.19, // «как думаешь»
  },
  cues: {
    notDrop: 0.8,
    quantity: 2.0,
    grows: 3.16,
    month: 5.68,
    secondDay: 6.52,
    fracture: 8.32,
    lots: 10.28,
    from172: 11.52,
    to174: 12.72,
    to174End: 14.4,
    plus1800: 14.8,
    minPrice: 17.76,
    unchanged: 18.52,
    price4061: 19.84,
    orderPrice: 21.78,
    decreased: 22.78,
    from4030: 23.22,
    to40End: 25.02,
    cheaper: 28.3,
    volumes: 29.94,
    y20: 30.98,
    t25: 32.66,
    tomorrow30: 34.71,
    pricier: 37.51,
    falls: 38.95,
    cheaperFc: 39.75,
    comment: 40.31,
  },
  daily: {
    yesterday: {lots: 172025, minPrice: 40.61, orderPrice: 40.3, qty: 20},
    today: {lots: 173854, minPrice: 40.61, orderPrice: 40.0, qty: 25},
    stages: {
      // Orderbook page, static 20.2–31.0 s in the recording (no text selection after 28.0 s)
      hook: {
        from: 28.05,
        rate: 0.45,
        shots: [
          {at: 0, rect: {x: 372, y: 100, w: 450, h: 800}},
          {at: 1.62, rect: {x: 372, y: 78, w: 450, h: 800}, move: 12}, // full-screen; ad banner (≤95) and taskbar (≥868) stay under the edge shading
          {at: 4.04, rect: {x: 420, y: 140, w: 760, h: 560}, cy: 860, move: 18},
        ],
        spots: [{from: 1.75, to: 4.1, rect: R.lotsHeader}],
      },
      // Listing top, static 40.9–46.2 s
      intro: {
        from: 41.0,
        rate: 0.6,
        shots: [
          {at: 5.92, rect: {x: 420, y: 135, w: 760, h: 300}, cy: 1060},
          {at: 8.2, rect: {x: 460, y: 140, w: 470, h: 260}, cy: 1060, move: 20},
        ],
      },
      market: {
        from: 28.05,
        rate: 0.22,
        shots: [
          {at: 9.12, rect: {x: 420, y: 420, w: 520, h: 400}, cy: 720},
          {at: 11.0, rect: {x: 450, y: 440, w: 470, h: 360}, cy: 720, move: 22},
          {at: 17.3, rect: {x: 450, y: 452, w: 470, h: 360}, cy: 720, move: 16},
        ],
        spots: [
          {from: 9.88, to: 17.36, rect: R.lotsHeader},
          {from: 17.5, to: 21.5, rect: R.sellRow1},
        ],
      },
      // Place Buy Order dialog: 40,78 → 40 ₽ at 8.0 s, qty 25 / max 1000 ₽ at 8.5 s, Purchase 9.5 s
      order: {
        from: 7.6,
        rate: 0.75,
        shots: [{at: 21.5, rect: {x: 640, y: 200, w: 470, h: 360}, cy: 720}],
        spots: [{from: 22.0, to: 25.34, rect: R.dialogFields}],
      },
      // SIH chip "Снять ордер 25 шт. | 40.00 ₽" on the orderbook page (order is open, not filled)
      myOrder: {
        from: 21.0,
        rate: 1,
        shots: [
          {at: 25.3, rect: {x: 700, y: 520, w: 480, h: 260}, cy: 760},
          {at: 26.6, rect: {x: 740, y: 580, w: 450, h: 200}, cy: 760, move: 22},
        ],
        spots: [{from: 25.6, to: 28.74, rect: R.sihOrder}],
      },
      // "Success! Your buy order has been placed." (16.5–17.6 s)
      success: {
        from: 16.45,
        rate: 0.72,
        shots: [{at: 28.74, rect: {x: 496, y: 250, w: 450, h: 230}, cy: 760}],
        spots: [{from: 28.95, to: 30.3, rect: R.successLine}],
      },
      // CS2 inventory grid, sorted by newest (static 53.6–54.6 s): 25 «Новое!» + yesterday's 20
      inventory: {
        from: 53.65,
        rate: 0.19,
        shots: [{at: 30.26, rect: {x: 46, y: 126, w: 1462, h: 780}, cy: 760}],
      },
      // Median Sale Prices — Month (static 37.2–40.4 s)
      forecast: {
        from: 37.2,
        rate: 0.45,
        shots: [{at: 35.19, rect: {x: 425, y: 470, w: 745, h: 330}, cy: 650}],
        spots: [{from: 38.95, to: 40.3, rect: R.chartEnd, pad: 4}],
      },
    },
  },
  sfx: [
    {at: 0.0, file: 'chart-market-fall.wav', volume: 0.09}, // «не выпадает»
    {at: 1.62, file: 'chart-ladder-rise.wav', volume: 0.07}, // lots keep growing
    {at: 5.86, file: 'whoosh.wav', volume: 0.05}, // into day 2
    {at: 14.4, file: 'chart-mini-up.wav', volume: 0.08}, // +1 829 lands
    {at: 18.52, file: 'tick.wav', volume: 0.06}, // min price unchanged
    {at: 21.46, file: 'whoosh-short.wav', volume: 0.05}, // into the order
    {at: 25.02, file: 'chart-mini-down.wav', volume: 0.08}, // −0,30 ₽
    {at: 28.95, file: 'confirm.wav', volume: 0.08}, // Success
    {at: 30.98, file: 'chart-bar-20.wav', volume: 0.08}, // 20
    {at: 32.66, file: 'chart-bar-25.wav', volume: 0.08}, // 25
    {at: 34.71, file: 'chart-bar-30.wav', volume: 0.08}, // 30
    {at: 35.15, file: 'whoosh.wav', volume: 0.05}, // forecast
    {at: 40.31, file: 'tick.wav', volume: 0.06}, // comment cue
  ],
  bed: {file: 'assets/sfx/bed.m4a', volume: 0.05},
};
