import captions from '../../data/day01.captions.json';
import type {Episode} from './types';

// All times are taken from captions/day01.asr-raw.json (word onsets in the real voiceover).
export const day01: Episode = {
  day: 1,
  totalDays: 30,
  caseName: 'Fracture Case',
  caseNameRu: 'Кейс «Разлом»',
  dailyStart: 20,
  dailyStep: 5,
  voiceover: 'assets/voiceover-day01.mp3',
  voDurationSec: 44.042,
  // Author's 1080p recording (1920×1080, 30 fps). Same framing as the 1600×900 proxy, so crop
  // rects stay in that 1600×900 reference space.
  footage: {src: 'assets/master/footage-master.mp4', coordW: 1600, coordH: 900},
  clips: {
    listing: {from: 0.0, rate: 0.33}, // listing page is static only for 0–1.2 s
    buyDialog: {from: 13.87}, // price 40,30 ₽, qty 20, max 806 ₽ → Purchase
    buySuccess: {from: 20.23}, // "Success! Your buy order has been placed."
    portfolio: {from: 45.7, rate: 0.55}, // TrueSkins entry visible 45.6–47.1 s, inventory pop-up after
    inventory: {from: 52.47}, // 20 × Fracture Case tiles
  },
  captions: captions.pages,
  beats: {
    hook: 0,
    evidence: 2.93, // «пока они дешевеют»
    question: 6.4, // «и я решил проверить»
    calendar: 11.22, // «для этого я запускаю»
    caseHero: 13.78, // «выбрал для него»
    ladder: 15.46, // «сегодня покупаю»
    total: 22.2, // «в итоге за месяц»
    resolve: 25.84, // «и даже если рынок»
    proof: 29.46, // «итак, первые 20»
    portfolio: 33.56, // «каждую неделю»
    tomorrow: 36.0, // «а завтра закуплю»
    cta: 38.16, // «как думаешь»
    end: 44.042,
  },
  cues: {
    market: 0.04,
    falls: 0.76,
    iBuy: 1.08,
    almost3000: 2.12,
    cheaper: 3.4,
    month: 4.4,
    lostValue: 5.52,
    earn: 8.12,
    falling: 10.56,
    experiment: 12.32,
    thirty: 13.12,
    fracture: 14.6,
    today20: 16.68,
    tomorrow25: 17.72,
    after30: 19.04,
    everyDay: 19.72,
    plus5: 21.6,
    accumulate: 23.34,
    total2775: 23.86,
    total2775End: 25.26,
    marketFalls: 26.54,
    stopBuying: 27.62,
    notGoing: 28.78,
    first20: 30.22,
    bought: 30.9,
    spent: 31.3,
    usd: 32.06,
    usdEnd: 33.18,
    weekly: 33.62,
    portfolio: 35.14,
    tomorrow: 36.18,
    plus25: 37.18,
    onTime: 38.98,
    throwAway: 40.66,
    comment: 41.5,
    follow: 42.62,
  },
  // Sparse, quiet sound design: only on meaning, never competing with the voice.
  sfx: [
    {at: 0.0, file: 'impact.wav', volume: 0.14}, // hook
    {at: 1.0, file: 'whoosh.wav', volume: 0.06}, // camera move to «я покупаю»
    {at: 4.38, file: 'tick.wav', volume: 0.08}, // −38 %
    {at: 11.14, file: 'whoosh.wav', volume: 0.05}, // into the experiment
    {at: 14.55, file: 'whoosh-short.wav', volume: 0.06}, // case reveal
    {at: 25.26, file: 'impact.wav', volume: 0.1}, // 2 775 lands
    {at: 29.38, file: 'whoosh.wav', volume: 0.05}, // into the real purchase
    {at: 30.9, file: 'confirm.wav', volume: 0.09}, // «куплены»
    {at: 42.62, file: 'tick.wav', volume: 0.06}, // follow cue
  ],
  bed: {file: 'assets/sfx/bed.m4a', volume: 0.05},
};
