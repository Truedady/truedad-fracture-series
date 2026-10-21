import React from 'react';
import {interpolate} from 'remotion';
import words from '../../../data/news/evil-geniuses-01.words.json';
import {C, FONT} from '../brand';
import {Card, Kicker, TelegramIcon, enter, life, useT} from '../primitives';
import type {NewsEpisode} from '../types';

// Source: 1021.3.mp4 (2560x1440, 15 s screen recording, 21.10.2026). Coordinates below are source pixels.
//   0.0–2.4  Steam listing top: sticker, title, price box, order book
//   2.5–4.1  scroll
//   4.1–4.9  "Медиана цен" — month view
//   5.0–9.7  week view, cursor hovers 20.10 23h ($4.14) -> 21.10 16h ($8.97)
//   9.8–15.0 TrueDad Telegram post + channel card
// Voiceover: 1021.2.MP3 (38.14 s), word timings in data/news/evil-geniuses-01.words.json.

const ItemChip: React.FC = () => {
  const t = useT();
  const a = life(t, -1, 3.55);
  return (
    <div style={{position: 'absolute', left: 22, right: 22, bottom: 30, display: 'flex', justifyContent: 'center'}}>
      <Card a={a} style={{padding: '18px 26px', display: 'flex', alignItems: 'center', gap: 18}}>
        <div style={{width: 0, height: 0, borderLeft: '14px solid transparent', borderRight: '14px solid transparent', borderBottom: `22px solid ${C.green}`}} />
        <div>
          <Kicker color={C.muted}>НАКЛЕЙКА · STEAM MARKET</Kicker>
          <div style={{fontWeight: 800, fontSize: 36, marginTop: 6}}>Evil Geniuses (голографическая) | Стокгольм-2021</div>
        </div>
      </Card>
    </div>
  );
};

const Readout: React.FC = () => {
  const t = useT();
  const a = life(t, 12.6, 17.95);
  const r1 = enter(t, 13.75);
  const r2 = enter(t, 15.95);
  const row = (k: number, when: string, price: string, color: string, label: string) => (
    <div style={{display: 'flex', alignItems: 'baseline', gap: 18, opacity: k, transform: `translateX(${(1 - k) * -24}px)`, marginTop: 12}}>
      <span style={{fontFamily: FONT.mono, fontSize: 24, color: C.muted, width: 110}}>{label}</span>
      <span style={{fontFamily: FONT.mono, fontSize: 28, color: C.white, width: 260, whiteSpace: 'nowrap'}}>{when}</span>
      <span style={{fontFamily: FONT.mono, fontWeight: 700, fontSize: 46, color}}>{price}</span>
    </div>
  );
  return (
    <div style={{position: 'absolute', left: 22, right: 22, bottom: 30}}>
      <Card a={a} style={{padding: '22px 28px 26px'}}>
        <Kicker>МЕДИАНА ЦЕН STEAM · ДАННЫЕ С ГРАФИКА</Kicker>
        {row(r1, '20.10, 23:00', '$4.14', C.white, 'ДО')}
        {row(r2, '21.10, 16:00', '$8.97', C.green, 'ПОСЛЕ')}
      </Card>
    </div>
  );
};

const DateCard: React.FC = () => {
  const t = useT();
  const k = enter(t, 19.45, 0.45);
  const y = enter(t, 20.72, 0.5);
  const out = interpolate(t, [21.85, 22.1], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: out}}>
      <div style={{opacity: k, transform: `translateY(${(1 - k) * 20}px)`, textAlign: 'center'}}>
        <Kicker>ВАЖНЫЙ ФАКТ</Kicker>
        <div style={{fontFamily: FONT.sans, fontWeight: 900, fontSize: 50, lineHeight: 1.1, marginTop: 18, color: C.white}}>
          EVIL GENIUSES
          <br />
          ПОКИНУЛИ COUNTER-STRIKE
        </div>
      </div>
      <div style={{overflow: 'hidden', marginTop: 34, padding: '0 10px'}}>
        <div
          style={{
            transform: `translateY(${(1 - y) * 105}%)`,
            fontFamily: FONT.sans,
            fontWeight: 900,
            fontSize: 128,
            letterSpacing: -3,
            whiteSpace: 'nowrap',
            lineHeight: 1,
            color: C.gold,
          }}
        >
          ЯНВАРЬ 2024
        </div>
      </div>
      <div style={{height: 5, width: 560 * y, background: C.gold, marginTop: 26, borderRadius: 3}} />
    </div>
  );
};

const SupplyNote: React.FC = () => {
  const t = useT();
  const a = life(t, 27.3, 28.95);
  return (
    <div style={{position: 'absolute', left: 22, right: 22, bottom: 30}}>
      <Card a={a} style={{padding: '24px 28px'}}>
        <Kicker>ЗАКРЫТИЕ ОРГАНИЗАЦИИ</Kicker>
        <div style={{fontWeight: 800, fontSize: 40, lineHeight: 1.18, marginTop: 10}}>
          не уменьшает количество <span style={{color: C.gold}}>уже выпущенных</span> наклеек
        </div>
      </Card>
    </div>
  );
};

const TelegramCta: React.FC = () => {
  const t = useT();
  const a = enter(t, 36.35, 0.45);
  const icon = enter(t, 36.5, 0.5);
  const line = enter(t, 37.0, 0.5);
  const bob = Math.sin((t - 36.5) * 2.4) * 4 * icon;
  return (
    <div style={{position: 'absolute', left: 22, right: 22, bottom: 30}}>
      <Card a={a} style={{padding: '34px 34px 36px', border: `1.5px solid ${C.gold}66`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 28}}>
          <div style={{transform: `scale(${0.4 + 0.6 * icon}) rotate(${(1 - icon) * -25}deg) translateY(${bob}px)`, opacity: icon}}>
            <TelegramIcon size={132} />
          </div>
          <div>
            <div style={{fontWeight: 900, fontSize: 56, letterSpacing: -0.5, lineHeight: 1}}>
              TRUE<span style={{color: C.gold}}>DAD</span> TELEGRAM
            </div>
            <div style={{fontFamily: FONT.mono, fontWeight: 700, fontSize: 44, color: C.gold, marginTop: 14}}>@truedadEducation</div>
          </div>
        </div>
        <div style={{height: 1.5, background: C.line, margin: '28px 0 22px', transform: `scaleX(${line})`, transformOrigin: 'left'}} />
        <div style={{fontWeight: 700, fontSize: 34, lineHeight: 1.25, color: C.white, opacity: line}}>
          Рыночные данные и разбор ситуации <span style={{color: C.gold}}>с наклейками EG</span>
        </div>
      </Card>
    </div>
  );
};

export const evilGeniuses01: NewsEpisode = {
  id: 'evil-geniuses-01',
  footage: 'news/evil-geniuses-01/footage.mp4',
  footageSize: {w: 2560, h: 1440},
  safeSource: {x0: 40, y0: 140, x1: 2530, y1: 1388},
  voice: 'news/evil-geniuses-01/voiceover.mp3',
  words,
  durationSec: 39.5,
  topic: 'CS2 · НАКЛЕЙКИ',
  dateStamp: '21.10.2026',
  headers: [
    {from: 0, tag: 'TRUEDAD NEWS · CS2', title: 'EVIL GENIUSES ЗАКРЫВАЕТСЯ', size: 74},
    {from: 5.05, tag: 'ЗАЯВЛЕНИЕ ОРГАНИЗАЦИИ', title: 'КОНЕЦ РАБОТЫ — СО 2 НОЯБРЯ', size: 70},
    {from: 9.75, tag: 'РЕАКЦИЯ РЫНКА', title: 'НАКЛЕЙКИ EG ОЖИВИЛИСЬ', size: 72},
    {from: 12.35, tag: 'STEAM · МЕДИАНА ЦЕН', title: 'ГРАФИК СКАКНУЛ В ДВА РАЗА', size: 70},
    {from: 17.85, tag: 'НАПОМИНАНИЕ', title: 'КОМАНДЫ НЕТ В CS С 2024 ГОДА', size: 68},
    {from: 22.05, tag: 'ПОЭТОМУ', title: 'НОВЫХ НАКЛЕЕК EG ДАВНО НЕТ', size: 68},
    {from: 24.35, tag: 'ЧТО ЭТО ЗНАЧИТ', title: 'ЗАКРЫТИЕ НЕ СОЗДАЁТ ДЕФИЦИТ', size: 68},
    {from: 28.85, tag: 'МНЕНИЕ TRUEDAD', title: 'ПОСЛЕ РЕЗКОГО РОСТА — НЕ СПЕШИТЬ', size: 64},
    {from: 31.6, tag: 'МНЕНИЕ TRUEDAD', title: 'ХОРОШАЯ НОВОСТЬ ДЛЯ ПРОДАВЦОВ', size: 66},
    {from: 34.3, tag: 'TRUEDAD TELEGRAM', title: 'ПОДРОБНЕЕ — В ТЕЛЕГРАМ', size: 72},
  ],
  shots: [
    {
      id: 'hook-chart',
      from: 0,
      to: 3.55,
      src: {start: 7.7, rate: 0.55},
      label: 'STEAM · НЕДЕЛЯ',
      cam: [
        {t: 0, cx: 1600, cy: 915, w: 600},
        {t: 3.55, cx: 1650, cy: 905, w: 520},
      ],
      marks: [{t0: 1.1, t1: 3.6, x: 1622, y: 848, w: 124, h: 80}],
      Overlay: ItemChip,
    },
    {
      id: 'sticker',
      from: 3.55,
      to: 5.05,
      src: {start: 0.3, rate: 0.6},
      label: 'STEAM COMMUNITY MARKET',
      cam: [
        {t: 3.55, cx: 1200, cy: 710, w: 700},
        {t: 5.05, cx: 1120, cy: 680, w: 600},
      ],
    },
    {
      id: 'statement',
      from: 5.05,
      to: 9.75,
      src: {start: 10.0},
      label: 'TELEGRAM · TRUEDAD · 21.10',
      cam: [
        {t: 5.05, cx: 1085, cy: 668, w: 580},
        {t: 8.4, cx: 1075, cy: 690, w: 540},
        {t: 9.75, cx: 1075, cy: 700, w: 500},
      ],
      marks: [
        {t0: 6.6, t1: 8.55, x: 827, y: 703, w: 440, h: 32},
        {t0: 8.75, t1: 9.85, x: 827, y: 784, w: 488, h: 28, label: 'СО 2 НОЯБРЯ 2026', labelSide: 'bottom'},
      ],
    },
    {
      id: 'market-wakeup',
      from: 9.75,
      to: 12.35,
      src: {start: 0.0, rate: 0.8},
      label: 'STEAM COMMUNITY MARKET',
      cam: [
        {t: 9.75, cx: 1500, cy: 680, w: 780},
        {t: 12.35, cx: 1555, cy: 700, w: 640},
      ],
      marks: [
        {t0: 10.35, t1: 11.2, x: 1500, y: 606, w: 100, h: 30, tone: 'green'},
        {t0: 11.3, t1: 12.45, x: 1570, y: 754, w: 282, h: 32, label: 'ПРОДАНО В STEAM', labelSide: 'bottom'},
      ],
    },
    {
      id: 'chart',
      from: 12.35,
      to: 17.85,
      src: {start: 4.15},
      label: 'STEAM · МЕДИАНА ЦЕН',
      cam: [
        {t: 12.35, cx: 1273, cy: 920, w: 1220},
        {t: 13.5, cx: 1470, cy: 905, w: 800},
        {t: 15.7, cx: 1610, cy: 900, w: 680},
        {t: 17.85, cx: 1640, cy: 900, w: 640},
      ],
      marks: [
        {t0: 13.75, t1: 14.8, x: 1662, y: 948, w: 108, h: 78},
        {t0: 15.95, t1: 17.9, x: 1622, y: 848, w: 124, h: 80, tone: 'green'},
      ],
      Overlay: Readout,
    },
    {
      id: 'left-cs',
      from: 17.85,
      to: 22.05,
      src: {start: 0.5, rate: 0.45},
      dim: 0.72,
      cam: [
        {t: 17.85, cx: 960, cy: 700, w: 620},
        {t: 22.05, cx: 960, cy: 680, w: 520},
      ],
      Overlay: DateCard,
    },
    {
      id: 'no-new-stickers',
      from: 22.05,
      to: 24.35,
      src: {start: 1.0, rate: 0.6},
      label: 'STEAM COMMUNITY MARKET',
      cam: [
        {t: 22.05, cx: 1250, cy: 690, w: 640},
        {t: 24.35, cx: 1350, cy: 650, w: 540},
      ],
      marks: [{t0: 22.6, t1: 24.45, x: 1210, y: 440, w: 290, h: 98}],
    },
    {
      id: 'supply',
      from: 24.35,
      to: 28.85,
      src: {start: 0.2, rate: 0.45},
      label: 'STEAM · ЗАЯВКИ НА ПРОДАЖУ',
      cam: [
        {t: 24.35, cx: 1200, cy: 1040, w: 920},
        {t: 26.2, cx: 990, cy: 1170, w: 780},
        {t: 28.85, cx: 985, cy: 1175, w: 720},
      ],
      marks: [{t0: 26.3, t1: 28.9, x: 800, y: 1072, w: 348, h: 30, label: 'В ПРОДАЖЕ НА STEAM: 281'}],
      Overlay: SupplyNote,
    },
    {
      id: 'dont-chase',
      from: 28.85,
      to: 31.6,
      src: {start: 8.2, rate: 0.55},
      label: 'STEAM · НЕДЕЛЯ',
      cam: [
        {t: 28.85, cx: 1560, cy: 920, w: 760},
        {t: 31.6, cx: 1660, cy: 910, w: 560},
      ],
      marks: [{t0: 29.5, t1: 31.7, x: 1655, y: 815, w: 125, h: 120, tone: 'green', label: 'РЕЗКИЙ РОСТ'}],
    },
    {
      id: 'sellers',
      from: 31.6,
      to: 34.3,
      src: {start: 0.6, rate: 0.5},
      label: 'STEAM · ЗАЯВКИ НА ПОКУПКУ',
      cam: [
        {t: 31.6, cx: 1540, cy: 1180, w: 720},
        {t: 34.3, cx: 1565, cy: 1200, w: 640},
      ],
      marks: [
        {t0: 32.3, t1: 33.45, x: 1384, y: 1072, w: 364, h: 30, label: 'ЗАЯВОК НА ПОКУПКУ: 12 213'},
        {t0: 33.5, t1: 34.4, x: 1490, y: 1328, w: 150, h: 48, label: 'ПРОДАТЬ'},
      ],
    },
    {
      id: 'telegram',
      from: 34.3,
      to: 39.5,
      src: {start: 10.2, rate: 0.9},
      label: 'T.ME/TRUEDADEDUCATION',
      cam: [
        {t: 34.3, cx: 1300, cy: 690, w: 1040},
        {t: 36.2, cx: 1560, cy: 470, w: 700},
        {t: 39.5, cx: 1575, cy: 460, w: 640},
      ],
      marks: [{t0: 35.35, t1: 39.6, x: 1515, y: 244, w: 160, h: 28}],
      Overlay: TelegramCta,
    },
  ],
  sfx: [
    {at: 0, kind: 'hit'},
    {at: 3.25, kind: 'whoosh'},
    {at: 4.75, kind: 'whoosh'},
    {at: 6.6, kind: 'tick'},
    {at: 8.75, kind: 'tick'},
    {at: 9.45, kind: 'whoosh'},
    {at: 12.05, kind: 'whoosh'},
    {at: 13.75, kind: 'tick'},
    {at: 15.95, kind: 'tick'},
    {at: 17.55, kind: 'whoosh'},
    {at: 20.72, kind: 'hit'},
    {at: 21.75, kind: 'whoosh'},
    {at: 24.05, kind: 'whoosh'},
    {at: 26.3, kind: 'tick'},
    {at: 28.55, kind: 'whoosh'},
    {at: 31.3, kind: 'whoosh'},
    {at: 32.3, kind: 'tick'},
    {at: 34.0, kind: 'whoosh'},
    {at: 35.2, kind: 'riser'},
    {at: 36.5, kind: 'pop'},
  ],
};
