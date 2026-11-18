import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {easeOut, k, Sfx, useSec} from './engine';
import {C, FONT} from './theme';

/* Анимированные экраны статистики и механики. Все тайминги — доли длительности плана,
   поэтому экраны подстраиваются под текст сценария. Цифры — только из сценария/курса. */

const RED = '#E5484D';
const GREEN = '#3FB37F';
const PANEL = '#161C25';

const Frame: React.FC<{label?: string; title?: string; children: React.ReactNode; note?: string}> = ({label, title, children, note}) => {
  const {t, dur} = useSec();
  return (
    <AbsoluteFill style={{background: C.black}}>
    <AbsoluteFill style={{background: `radial-gradient(ellipse 80% 70% at 50% 40%, #141B25 0%, ${C.black} 90%)`}} />
    <AbsoluteFill style={{opacity: 0.8, backgroundImage: 'linear-gradient(#202935 2px, transparent 2px), linear-gradient(90deg, #202935 2px, transparent 1px)', backgroundSize: '80px 80px', backgroundPosition: `${-t * 9}px ${-t * 5}px`, maskImage: 'radial-gradient(ellipse 75% 70% at 50% 50%, black 30%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 75% 70% at 50% 50%, black 30%, transparent 100%)'}} />
    <div style={{position: 'absolute', width: 900, height: 900, borderRadius: 450, left: 300 + Math.sin(t * 0.25) * 500, top: 120 + Math.cos(t * 0.2) * 160, background: `radial-gradient(circle, ${C.gold}14 0%, transparent 65%)`}} />
    <AbsoluteFill style={{padding: '80px 140px', fontFamily: FONT.text, color: C.ivory, transform: `scale(${1 + 0.035 * (t / dur)})`}}>
      {label && <div style={{fontFamily: FONT.mono, fontSize: 24, letterSpacing: '0.22em', color: C.gold, opacity: k(t, [0.1, 0.6], [0, 1])}}>{label}</div>}
      {title && <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 80, marginTop: 14, opacity: k(t, [0.2, 0.8], [0, 1]), transform: `translateY(${k(t, [0.2, 0.8], [20, 0], easeOut)}px)`}}>{title}</div>}
      <div style={{flex: 1, position: 'relative', marginTop: 30, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}><div style={{position: 'relative'}}>{children}</div></div>
      {note && <div style={{fontSize: 24, color: C.muted, opacity: k(t, [1, 1.6], [0, 0.9])}}>{note}</div>}
    </AbsoluteFill>
    </AbsoluteFill>
  );
};

const fmt = (v: number, dec = 0) => v.toLocaleString('ru-RU', {minimumFractionDigits: dec, maximumFractionDigits: dec}).replace(/ /g, ' ');
const Counter: React.FC<{to: number; from?: number; at: number; len?: number; dec?: number; suffix?: string; prefix?: string; size?: number; color?: string}> = ({to, from = 0, at, len = 1.2, dec = 0, suffix = '', prefix = '', size = 130, color = C.gold}) => {
  const {t} = useSec();
  const v = from + (to - from) * k(t, [at, at + len], [0, 1], easeOut);
  return <span style={{fontFamily: FONT.display, fontWeight: 700, fontSize: size, color, fontVariantNumeric: 'tabular-nums'}}>{prefix}{fmt(v, dec)}{suffix}</span>;
};
const Pop: React.FC<{at: number; children: React.ReactNode; style?: React.CSSProperties}> = ({at, children, style}) => {
  const {t} = useSec();
  const p = k(t, [at, at + 0.45], [0, 1], easeOut);
  return <div style={{opacity: p, transform: `scale(${0.85 + 0.15 * p}) translateY(${(1 - p) * 20}px)`, ...style}}>{children}</div>;
};
const Card: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{background: PANEL, borderRadius: 22, padding: '52px 60px', border: '1px solid #232B37', ...style}}>{children}</div>
);
const Arrow: React.FC<{at: number; len?: number; w?: number}> = ({at, len = 0.6, w = 160}) => {
  const {t} = useSec();
  const p = k(t, [at, at + len], [0, 1]);
  return (
    <svg width={w} height={40} style={{overflow: 'visible'}}>
      <line x1={0} y1={20} x2={(w - 22) * p} y2={20} stroke={C.ivory} strokeWidth={5} strokeLinecap="round" />
      {p > 0.9 && <polygon points={`${w - 26},6 ${w},20 ${w - 26},34`} fill={C.ivory} />}
    </svg>
  );
};

/* ── 1. Региональная цена: 500 ₽ (РФ) → 2 000 ₽ (США) → продажа за 1 500 ₽ ── */
export const RegionalPrice: React.FC<{stage?: 'prices' | 'deal'}> = ({stage = 'deal'}) => {
  const {dur} = useSec();
  const a = 0.6, b = dur * 0.28, c = dur * 0.5, d = dur * 0.72;
  return (
    <Frame label="РЕГИОНАЛЬНЫЕ ЦЕНЫ · ПРИМЕР" title="Одна и та же игра">
      <div style={{display: 'flex', gap: 60, alignItems: 'stretch', marginTop: 40}}>
        <Pop at={a} style={{flex: 1}}><Card><div style={{fontSize: 40, color: C.muted, marginBottom: 10}}>Магазин в России</div><Counter to={500} at={a} suffix=" ₽" /></Card></Pop>
        <Pop at={b} style={{flex: 1}}><Card><div style={{fontSize: 40, color: C.muted, marginBottom: 10}}>Магазин в США</div><Counter to={2000} at={b} suffix=" ₽" color={C.ivory} /></Card></Pop>
      </div>
      {stage === 'deal' && (
        <div style={{display: 'flex', gap: 40, alignItems: 'center', marginTop: 60}}>
          <Pop at={c} style={{flex: 1}}><Card style={{borderColor: C.gold}}><div style={{fontSize: 40, color: C.muted, marginBottom: 10}}>Продавец предлагает иностранному покупателю</div><Counter to={1500} at={c} suffix=" ₽" /></Card></Pop>
          <Pop at={d} style={{flex: 0.8}}><Card style={{borderColor: GREEN}}><div style={{fontSize: 40, color: C.muted, marginBottom: 10}}>Разница до расходов</div><Counter to={1000} at={d} suffix=" ₽" color={GREEN} /></Card></Pop>
        </div>
      )}
      <Sfx name="pop" at={a} /><Sfx name="pop" at={b} />
      {stage === 'deal' && <><Sfx name="pop" at={c} /><Sfx name="cash" at={d + 0.6} vol={0.5} /></>}
    </Frame>
  );
};

/* ── 2. Рост цены: от → до, множитель ── */
export const PriceJump: React.FC<{label: string; title: string; from: number; to: number; unit: string; fromLabel: string; toLabel: string; badge: string; note?: string; dec?: number}> = ({label, title, from, to, unit, fromLabel, toLabel, badge, note, dec = 0}) => {
  const {dur} = useSec();
  const a = 0.7, b = dur * 0.35, c = dur * 0.6;
  return (
    <Frame label={label} title={title} note={note}>
      <div style={{display: 'flex', alignItems: 'center', gap: 50, marginTop: 70}}>
        <Pop at={a} style={{flex: 1}}><Card><div style={{fontSize: 40, color: C.muted, marginBottom: 10}}>{fromLabel}</div><Counter to={from} at={a} len={0.6} dec={from < 10 && from % 1 ? 2 : dec} suffix={unit} color={C.ivory} /></Card></Pop>
        <Arrow at={b - 0.4} />
        <Pop at={b} style={{flex: 1}}><Card style={{borderColor: C.gold}}><div style={{fontSize: 40, color: C.muted, marginBottom: 10}}>{toLabel}</div><Counter from={from} to={to} at={b} len={1.4} dec={dec} suffix={unit} /></Card></Pop>
        <Pop at={c}><div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 110, color: GREEN}}>{badge}</div></Pop>
      </div>
      <Sfx name="pop" at={a} /><Sfx name="counter" at={b} vol={0.45} /><Sfx name="rise_tone" at={b} vol={0.35} /><Sfx name="thud" at={c} vol={0.5} />
    </Frame>
  );
};

/* ── 3. Дни задержки: N ячеек заполняются, замок ── */
export const DayCells: React.FC<{label: string; title: string; days: number; sub?: string; color?: string}> = ({label, title, days, sub, color = RED}) => {
  const {t, dur} = useSec();
  const start = 0.9, end = Math.max(start + days * 0.3, dur * 0.7);
  const step = (end - start) / days;
  return (
    <Frame label={label} title={title}>
      <div style={{display: 'flex', gap: days > 10 ? 12 : 22, marginTop: 80}}>
        {Array.from({length: days}, (_, i) => {
          const p = k(t, [start + i * step, start + i * step + step * 0.8], [0, 1]);
          return (
            <div key={i} style={{flex: 1}}>
              <div style={{fontFamily: FONT.mono, fontSize: days > 10 ? 28 : 36, color: C.muted, marginBottom: 14, textAlign: 'center'}}>{i + 1}</div>
              <div style={{height: 170, borderRadius: 12, background: '#1E252F', overflow: 'hidden'}}><div style={{height: '100%', width: `${p * 100}%`, background: color, opacity: 0.85}} /></div>
            </div>
          );
        })}
      </div>
      {sub && <Pop at={end + 0.2} style={{marginTop: 80, fontFamily: FONT.display, fontWeight: 700, fontSize: 68}}>{sub}</Pop>}
      {Array.from({length: days}, (_, i) => <Sfx key={i} name="tick" at={start + i * step} vol={0.35} />)}
      <Sfx name="lock" at={end + 0.2} vol={0.7} />
    </Frame>
  );
};

/* ── 4. Оборот капитала до/после 29.03.2018 ── */
export const Turnover: React.FC = () => {
  const {t, dur} = useSec();
  const lane = (y: number, label: string, cycles: number, locked: boolean, at: number) => {
    const w = 1640;
    const prog = k(t, [at, at + dur * 0.4], [0, 1], (x) => x);
    return (
      <div style={{position: 'absolute', top: y, left: 0, width: w}}>
        <div style={{fontSize: 42, color: C.muted, marginBottom: 20}}>{label}</div>
        <div style={{position: 'relative', height: 130, background: '#1A2029', borderRadius: 12}}>
          {Array.from({length: 7}, (_, d) => <div key={d} style={{position: 'absolute', left: (d * w) / 7, top: 0, bottom: 0, borderLeft: '1px solid #2A3340'}}><span style={{position: 'absolute', top: 140, left: 10, fontFamily: FONT.mono, fontSize: 26, color: C.muted}}>день {d + 1}</span></div>)}
          {locked && <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: w * Math.min(1, prog * 1.05), background: `${RED}55`, borderRadius: 12}} />}
          {Array.from({length: cycles}, (_, i) => {
            const x = ((i + 0.5) / cycles) * w;
            const vis = prog * w > x;
            return <div key={i} style={{position: 'absolute', left: x - 50, top: 15, width: 100, height: 100, borderRadius: 50, background: vis ? GREEN : '#2A3340', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 30, transform: `scale(${vis ? 1 : 0.7})`}}>$</div>;
          })}
        </div>
      </div>
    );
  };
  return (
    <Frame label="ОБОРОТ ОДНОГО КАПИТАЛА · МОДЕЛЬ" title="Купил → продал → снова купил">
      <div style={{position: 'relative', height: 640}}>
      {lane(30, 'До 29 марта 2018 — капитал оборачивается несколько раз', 5, false, 0.8)}
      {t > dur * 0.45 && lane(340, 'После — предмет заморожен на 7 дней', 1, true, dur * 0.45)}
      </div>
      {[1, 2, 3, 4, 5].map((i) => <Sfx key={i} name="blip" at={0.8 + (i - 0.5) * (dur * 0.4) / 5} vol={0.35} />)}
      <Sfx name="lock" at={dur * 0.45} vol={0.7} /><Sfx name="drop" at={dur * 0.6} vol={0.4} />
    </Frame>
  );
};

/* ── 5. Спред между площадками: купить дешевле, продать дороже → разница исчезает ── */
export const Spread: React.FC = () => {
  const {t, dur} = useSec();
  const m = k(t, [dur * 0.5, dur * 0.85], [0, 1]);
  const buy = 10 + 0.9 * m, sell = 12 - 0.9 * m;
  const fly = k(t, [1.4, 2.4], [0, 1], easeOut);
  const traders = Math.round(k(t, [dur * 0.45, dur * 0.85], [1, 24], (x) => x));
  const box = (title: string, v: number, col: string, at: number) => (
    <Pop at={at} style={{width: 640}}><Card style={{textAlign: 'center'}}><div style={{fontSize: 40, color: C.muted, marginBottom: 10}}>{title}</div><div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 130, color: col, fontVariantNumeric: 'tabular-nums'}}>${v.toFixed(2)}</div></Card></Pop>
  );
  return (
    <Frame label="АРБИТРАЖ · УСЛОВНЫЙ ПРИМЕР" title="Купить дешевле — продать дороже">
      <div style={{position: 'relative', display: 'flex', justifyContent: 'space-between', marginTop: 150}}>
        {box('Площадка A — покупка', buy, C.ivory, 0.6)}{box('Площадка B — продажа', sell, C.gold, 1.2)}
        <Img src={staticFile('skins/ak-vulcan.png')} style={{position: 'absolute', top: -170, left: 140 + fly * 860, width: 360, height: 160, objectFit: 'contain', opacity: k(t, [0.8, 1.2], [0, 1]), filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.6))'}} />
      </div>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 60}}>
        <Pop at={2.2} style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 80}}>
          Разница: <span style={{color: m > 0.6 ? RED : GREEN, fontVariantNumeric: 'tabular-nums'}}>${(sell - buy).toFixed(2)}</span>
        </Pop>
        <Pop at={dur * 0.45} style={{display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', width: 640}}>
          <span style={{fontSize: 34, color: C.muted, marginRight: 16}}>трейдеров:</span>
          {Array.from({length: traders}, (_, i) => <div key={i} style={{width: 18, height: 34, borderRadius: 9, background: C.gold, opacity: 0.85}} />)}
        </Pop>
      </div>
      <Sfx name="pop" at={0.6} /><Sfx name="pop" at={1.2} /><Sfx name="whoosh_short" at={1.4} vol={0.4} /><Sfx name="cash" at={2.3} vol={0.4} />
      <Sfx name="counter" at={dur * 0.45} vol={0.3} /><Sfx name="drop" at={dur * 0.6} vol={0.4} />
    </Frame>
  );
};

/* ── 6. Бот против человека: тысячи лотов ── */
const SKINS = ['ak-fire-serpent', 'awp-lightning-strike', 'ak-vulcan', 'awp-redline', 'ak-claws-a', 'm4-red', 'deagle-blaze', 'awp-fade'];
export const BotScan: React.FC = () => {
  const {t, dur} = useSec();
  const cols = 6, rows = 4;
  const scan = (t * 1.6) % rows;
  return (
    <Frame label="ПАРСЕРЫ И БОТЫ" title="Человек ищет одну сделку — бот проверяет тысячи">
      <div style={{display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 18, marginTop: 20}}>
        {Array.from({length: cols * rows}, (_, i) => {
          const r = Math.floor(i / cols);
          const hot = [3, 10, 17, 20].includes(i) && t > 1 + r * 0.6;
          return (
            <div key={i} style={{background: hot ? '#1F2A1F' : PANEL, border: `2px solid ${hot ? GREEN : '#232B37'}`, borderRadius: 12, height: 150, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
              <Img src={staticFile(`skins/${SKINS[i % SKINS.length]}.png`)} style={{width: 180, height: 70, objectFit: 'contain'}} />
              <div style={{fontFamily: FONT.mono, fontSize: 22, color: hot ? GREEN : C.muted, marginTop: 8}}>{hot ? 'КУПЛЕНО' : `$${(8 + ((i * 37) % 90) / 3).toFixed(2)}`}</div>
            </div>
          );
        })}
        <div style={{position: 'absolute', left: 0, right: 0, top: 20 + scan * 168, height: 4, background: GREEN, boxShadow: `0 0 24px ${GREEN}`}} />
      </div>
      {[0, 1, 2, 3].map((r) => <Sfx key={r} name="blip" at={1 + r * 0.6} vol={0.3} />)}
      <Sfx name="whoosh_short" at={dur * 0.5} vol={0.3} />
    </Frame>
  );
};

/* ── 7. Онлайн PUBG ── */
export const Online: React.FC = () => {
  const {t, dur} = useSec();
  return (
    <AbsoluteFill style={{background: C.black}}>
      <Img src={staticFile('sources/A85_pubg_keyart_2017.jpg')} style={{position: 'absolute', width: 1920, height: 1080, objectFit: 'cover', filter: 'brightness(0.35) blur(4px)', transform: `scale(${1.05 + t * 0.01})`}} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', color: C.ivory}}>
        <div style={{fontFamily: FONT.mono, fontSize: 30, letterSpacing: '0.2em', color: C.gold, opacity: k(t, [0.3, 0.9], [0, 1])}}>PUBG · КОНЕЦ ДЕКАБРЯ 2017</div>
        <div style={{marginTop: 20}}><Counter to={3000000} at={0.8} len={Math.min(2.4, dur * 0.5)} size={190} color={C.ivory} /><span style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 190, color: C.gold}}>+</span></div>
        <div style={{fontSize: 44, color: C.muted, opacity: k(t, [1.2, 1.8], [0, 1])}}>игроков одновременно</div>
      </AbsoluteFill>
      <Sfx name="counter" at={0.8} vol={0.45} /><Sfx name="thud" at={0.8 + Math.min(2.4, dur * 0.5)} vol={0.5} />
    </AbsoluteFill>
  );
};

/* ── 8. График кейса по архивным точкам (логарифмическая шкала) ── */
export type Pt = {d: string; v: number};
export const CaseChart: React.FC<{name: string; pts: Pt[]; show?: number; badge?: {from: number; to: number; text: string}; hi?: number}> = ({name, pts, show, badge, hi}) => {
  const {t, dur} = useSec();
  const n = show ?? pts.length;
  const W = 1560, H = 520, x0 = 70, y0 = 60;
  const lv = (v: number) => Math.log10(v);
  const minL = lv(0.2), maxL = lv(Math.max(...pts.map((p) => p.v)) * 1.6);
  const px = (i: number) => x0 + (i / (pts.length - 1)) * (W - 2 * x0);
  const py = (v: number) => y0 + H - ((lv(v) - minL) / (maxL - minL)) * H;
  const at = (i: number) => 0.8 + i * ((dur * 0.72) / Math.max(1, n - 1 + 0.4));
  const draw = k(t, [at(0), at(n - 1) + 0.6], [0, 1], (x) => x);
  const path = pts.slice(0, n).map((p, i) => `${i ? 'L' : 'M'}${px(i)},${py(p.v)}`).join(' ');
  return (
    <Frame label="АРХИВНЫЕ ТОЧКИ ЦЕН" title={name}>
      <svg width={W} height={H + 120} style={{overflow: 'visible'}}>
        {[1, 10, 100, 1000].filter((v) => lv(v) < maxL).map((v) => (
          <g key={v}><line x1={0} x2={W} y1={py(v)} y2={py(v)} stroke="#222A35" strokeWidth={2} /><text x={W + 14} y={py(v) + 8} fill={C.muted} fontSize={24} fontFamily="JetBrains Mono">{v} ₽</text></g>
        ))}
        <path d={path} fill="none" stroke={C.gold} strokeWidth={6} strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
        {pts.slice(0, n).map((p, i) => {
          const s = k(t, [at(i), at(i) + 0.4], [0, 1], easeOut);
          const big = hi === undefined || hi === i;
          return (
            <g key={i} opacity={s}>
              <circle cx={px(i)} cy={py(p.v)} r={14 * s} fill={big ? C.gold : C.muted} />
              <text x={px(i)} y={py(p.v) - 34} textAnchor="middle" fill={C.ivory} fontSize={big ? 56 : 40} fontWeight={700} fontFamily="Inter Display">{p.v < 10 ? fmt(p.v, 2) : fmt(p.v)} ₽</text>
              <text x={px(i)} y={H + y0 + 70} textAnchor="middle" fill={C.muted} fontSize={30} fontFamily="Inter">{p.d}</text>
            </g>
          );
        })}
      </svg>
      {badge && (
        <Pop at={at(badge.to) + 0.6} style={{position: 'absolute', right: 40, top: -40, fontFamily: FONT.display, fontWeight: 700, fontSize: 120, color: GREEN}}>{badge.text}</Pop>
      )}
      {pts.slice(0, n).map((_, i) => <Sfx key={i} name="blip" at={at(i)} vol={0.4} />)}
      <Sfx name="rise_tone" at={at(0)} vol={0.25} />
      {badge && <Sfx name="thud" at={at(badge.to) + 0.6} vol={0.5} />}
    </Frame>
  );
};
export const GLOVE: Pt[] = [{d: 'янв 2019', v: 0.25}, {d: 'июн 2021', v: 200}, {d: 'апр 2023', v: 575}, {d: 'мар 2024', v: 520}];
export const BREAKOUT: Pt[] = [{d: 'янв 2019', v: 1.5}, {d: 'июн 2021', v: 220}, {d: 'апр 2023', v: 820}, {d: 'мар 2024', v: 640}];
export const GAMMA2: Pt[] = [{d: 'янв 2019', v: 0.25}, {d: 'сен 2021', v: 47}, {d: 'сен 2023', v: 280}, {d: 'мар 2024', v: 220}];

/* ── 9. Три графика рядом (пики и коррекция) ── */
export const ThreeCases: React.FC = () => {
  const {t} = useSec();
  const mini = (name: string, pts: Pt[], i: number) => {
    const at = 0.5 + i * 0.7;
    const max = Math.max(...pts.map((p) => p.v));
    return (
      <Pop at={at} style={{flex: 1}}>
        <Card style={{height: 560}}>
          <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 40}}>{name}</div>
          <div style={{display: 'flex', alignItems: 'flex-end', gap: 22, height: 380, marginTop: 30}}>
            {pts.map((p, j) => {
              const h = Math.max(6, (Math.log10(p.v / 0.2) / Math.log10(max / 0.2)) * 360) * k(t, [at + 0.2 + j * 0.15, at + 0.7 + j * 0.15], [0, 1], easeOut);
              return <div key={j} style={{flex: 1, textAlign: 'center'}}><div style={{fontSize: 26, color: C.ivory, marginBottom: 8}}>{p.v < 10 ? fmt(p.v, 2) : fmt(p.v)}</div><div style={{height: h, background: j === 2 ? C.gold : j === 3 ? RED : '#3A4554', borderRadius: 6}} /><div style={{fontSize: 20, color: C.muted, marginTop: 10}}>{p.d}</div></div>;
            })}
          </div>
        </Card>
      </Pop>
    );
  };
  return (
    <Frame label="ПИКИ 2023 И КОРРЕКЦИЯ 2024" title="Рост не гарантирован">
      <div style={{display: 'flex', gap: 40, marginTop: 20}}>{mini('Glove Case', GLOVE, 0)}{mini('Operation Breakout', BREAKOUT, 1)}{mini('Gamma 2', GAMMA2, 2)}</div>
      {[0, 1, 2].map((i) => <Sfx key={i} name="pop" at={0.5 + i * 0.7} vol={0.4} />)}
    </Frame>
  );
};

/* ── 10. Экономика кейсов: открыли → исчез → перестал выпадать → инвесторы скупают ── */
export const CaseFlow: React.FC<{part: 'supply' | 'investors'}> = ({part}) => {
  const {t, dur} = useSec();
  const N = 60;
  const opened = part === 'supply' ? Math.floor(k(t, [1, dur * 0.8], [0, 26], (x) => x)) : 26;
  const bought = part === 'investors' ? Math.floor(k(t, [1, dur * 0.8], [0, 24], (x) => x)) : 0;
  return (
    <Frame label="ЭКОНОМИКА СТАРЫХ КЕЙСОВ" title={part === 'supply' ? 'Каждый открытый кейс исчезает' : 'К открытиям добавляются инвесторы'}>
      <div style={{display: 'flex', gap: 80, marginTop: 30}}>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 14, width: 900}}>
          {Array.from({length: N}, (_, i) => {
            const gone = i < opened;
            const inv = !gone && i >= opened && i < opened + bought;
            return <div key={i} style={{height: 56, borderRadius: 8, background: gone ? 'transparent' : inv ? C.gold : '#3A4554', border: gone ? '2px dashed #2A3340' : 'none', transform: `scale(${gone ? 0.8 : 1})`, transition: 'none'}} />;
          })}
        </div>
        <div style={{flex: 1, fontSize: 40, lineHeight: 1.5}}>
          {part === 'supply' ? (
            <>
              <Pop at={0.8}><div><span style={{color: C.muted}}>В обращении</span> <b>{N - opened}</b></div></Pop>
              <Pop at={dur * 0.45}><div style={{marginTop: 30}}>Кейс перестал регулярно выпадать — новых почти нет</div></Pop>
            </>
          ) : (
            <>
              <Pop at={0.8}><div><span style={{color: C.gold}}>■</span> скупили в расчёте на рост: <b>{bought}</b></div></Pop>
              <Pop at={dur * 0.55}><div style={{marginTop: 30}}>Иногда это ускоряет рост, иногда — перегрев</div></Pop>
            </>
          )}
        </div>
      </div>
      <Sfx name={part === 'supply' ? 'counter' : 'counter'} at={1} vol={0.35} /><Sfx name="pop" at={dur * 0.45} vol={0.4} />
    </Frame>
  );
};

/* ── 11. Ликвидность: тысяча кейсов и «удвоение на бумаге» ── */
export const Liquidity: React.FC = () => {
  const {t, dur} = useSec();
  const sold = Math.floor(k(t, [dur * 0.45, dur * 0.95], [0, 40], (x) => x));
  return (
    <Frame label="ЛИКВИДНОСТЬ" title="1 000 кейсов: +100% на графике">
      <div style={{display: 'flex', gap: 70, marginTop: 10}}>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(40, 1fr)', gap: 4, width: 1000}}>
          {Array.from({length: 1000}, (_, i) => <div key={i} style={{height: 16, borderRadius: 2, background: i < sold ? GREEN : '#3A4554'}} />)}
        </div>
        <div style={{flex: 1, fontSize: 40, lineHeight: 1.45}}>
          <Pop at={0.8}><div>По последним предложениям — <span style={{color: GREEN}}>×2</span></div></Pop>
          <Pop at={dur * 0.4}><div style={{marginTop: 30}}>Но в день покупают лишь несколько десятков штук</div></Pop>
          <Pop at={dur * 0.7}><div style={{marginTop: 30, color: C.gold}}>Важны объёмы и реальные сделки</div></Pop>
        </div>
      </div>
      <Sfx name="pop" at={0.8} vol={0.4} /><Sfx name="tick" at={dur * 0.45} /><Sfx name="drop" at={dur * 0.4} vol={0.35} />
    </Frame>
  );
};

/* ── 12. Trade Protection ── */
export const Protection: React.FC<{part: 'rule' | 'risk'}> = ({part}) => {
  const {t, dur} = useSec();
  const p = k(t, [0.8, dur * 0.8], [0, 1], (x) => x);
  const W = 1560;
  return (
    <Frame label="TRADE PROTECTION · 2025" title={part === 'rule' ? '7 дней предмет защищён' : 'Риск для сторонних площадок'}>
      <div style={{position: 'relative', height: 140, marginTop: 40, background: '#1A2029', borderRadius: 14}}>
        <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: W * p, background: `${C.gold}44`, borderRadius: 14}} />
        {Array.from({length: 7}, (_, d) => <div key={d} style={{position: 'absolute', left: (d * W) / 7, top: 0, bottom: 0, borderLeft: '1px solid #2A3340'}}><span style={{position: 'absolute', top: 150, left: 10, fontFamily: FONT.mono, fontSize: 24, color: C.muted}}>день {d + 1}</span></div>)}
        <div style={{position: 'absolute', left: W * p - 50, top: 20, width: 100, height: 100, borderRadius: 50, background: C.gold, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><svg width={46} height={52} viewBox="0 0 40 46"><path d="M20 2 L37 8 V22 Q37 37 20 44 Q3 37 3 22 V8Z" fill={C.black} /></svg></div>
      </div>
      <div style={{display: 'flex', gap: 40, marginTop: 120}}>
        {part === 'rule' ? (
          <>
            <Pop at={1.2} style={{flex: 1}}><Card><div style={{fontSize: 38}}>Можно использовать в игре</div></Card></Pop>
            <Pop at={2} style={{flex: 1}}><Card><div style={{fontSize: 38}}>Нельзя передать или изменить</div></Card></Pop>
            <Pop at={2.8} style={{flex: 1}}><Card style={{borderColor: RED}}><div style={{fontSize: 38}}>Обмен можно отменить</div></Card></Pop>
          </>
        ) : (
          <>
            <Pop at={1.2} style={{flex: 1}}><Card><div style={{fontSize: 38}}>Предмет уже пришёл</div></Card></Pop>
            <Pop at={dur * 0.4} style={{flex: 1}}><Card style={{borderColor: RED}}><div style={{fontSize: 38}}>Но операция ещё обратима</div></Card></Pop>
            <Pop at={dur * 0.65} style={{flex: 1}}><Card><div style={{fontSize: 38}}>Выплаты и сроки — по-новому</div></Card></Pop>
          </>
        )}
      </div>
      <Sfx name="lock" at={0.8} vol={0.6} /><Sfx name="pop" at={1.2} vol={0.35} /><Sfx name="pop" at={part === 'rule' ? 2 : dur * 0.4} vol={0.35} /><Sfx name="pop" at={part === 'rule' ? 2.8 : dur * 0.65} vol={0.35} />
    </Frame>
  );
};

/* ── 13. Пять Covert → нож или перчатки ── */
export const CovertMerge: React.FC = () => {
  const {t, dur} = useSec();
  const five = ['ak-fire-serpent', 'awp-lightning-strike', 'ak-vulcan', 'm4-red', 'ak-claws-a'];
  const merge = k(t, [dur * 0.45, dur * 0.6], [0, 1]);
  const reveal = k(t, [dur * 0.6, dur * 0.7], [0, 1], easeOut);
  return (
    <Frame label="22 ОКТЯБРЯ 2025 · КОНТРАКТ ОБМЕНА" title="5 × Covert → нож или перчатки">
      <div style={{position: 'relative', height: 640}}>
        {five.map((s, i) => {
          const x0 = 40 + i * 320, y0 = 120;
          const a = k(t, [0.6 + i * 0.25, 1 + i * 0.25], [0, 1], easeOut);
          return (
            <div key={s} style={{position: 'absolute', left: x0 + (700 - x0) * merge, top: y0 + 60 * merge, width: 280, opacity: a * (1 - merge), transform: `scale(${1 - 0.5 * merge}) translateY(${(1 - a) * 40}px)`}}>
              <Card style={{padding: 20}}><Img src={staticFile(`skins/${s}.png`)} style={{width: 240, height: 110, objectFit: 'contain'}} /><div style={{height: 6, background: RED, borderRadius: 3, marginTop: 10}} /></Card>
            </div>
          );
        })}
        <div style={{position: 'absolute', left: 0, right: 0, top: 60, display: 'flex', justifyContent: 'center', gap: 80, opacity: reveal, transform: `scale(${0.8 + 0.2 * reveal})`}}>
          <Img src={staticFile('skins/karambit-tiger-tooth.png')} style={{width: 520, height: 300, objectFit: 'contain', filter: `drop-shadow(0 0 40px ${C.gold}88)`}} />
          <Img src={staticFile('skins/gloves-orange.png')} style={{width: 380, height: 300, objectFit: 'contain'}} />
        </div>
        <div style={{position: 'absolute', left: 860, top: 260, width: 200, height: 200, borderRadius: 100, background: `radial-gradient(circle, #fff ${0}%, ${C.gold}88 40%, transparent 70%)`, opacity: k(t, [dur * 0.55, dur * 0.6, dur * 0.7], [0, 1, 0])}} />
      </div>
      {five.map((_, i) => <Sfx key={i} name="pop" at={0.6 + i * 0.25} vol={0.3} />)}
      <Sfx name="whoosh_long" at={dur * 0.45} vol={0.5} /><Sfx name="thud" at={dur * 0.6} vol={0.6} /><Sfx name="cash" at={dur * 0.65} vol={0.4} />
    </Frame>
  );
};

/* ── 14. Финальная хронология ── */
export const Chronicle: React.FC<{items: {y: string; txt: string; img: string}[]}> = ({items}) => {
  const {t, dur} = useSec();
  const step = (dur * 0.8) / items.length;
  return (
    <Frame label="15 ЛЕТ ПЕРЕМЕН" title="Каждый раз говорили, что рынок умер">
      <div style={{position: 'relative', height: 620, marginTop: 20}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 380, height: 4, background: '#2A3340'}} />
        <div style={{position: 'absolute', left: 0, top: 380, height: 4, width: `${k(t, [0.5, dur * 0.85], [0, 100], (x) => x)}%`, background: C.gold}} />
        {items.map((it, i) => {
          const at = 0.5 + i * step;
          const x = (i + 0.5) * (1640 / items.length);
          return (
            <Pop key={it.y} at={at} style={{position: 'absolute', left: x - 150, top: 0, width: 300, textAlign: 'center'}}>
              <div style={{height: 300, borderRadius: 10, overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.6)'}}><Img src={staticFile(it.img)} style={{width: 300, height: 300, objectFit: 'cover', objectPosition: 'top'}} /></div>
              <div style={{width: 24, height: 24, borderRadius: 12, background: C.gold, margin: '68px auto 0'}} />
              <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 56, marginTop: 20}}>{it.y}</div>
              <div style={{fontSize: 28, color: C.muted, marginTop: 6}}>{it.txt}</div>
            </Pop>
          );
        })}
      </div>
      {items.map((_, i) => <Sfx key={i} name="tick" at={0.5 + i * step} vol={0.5} />)}
    </Frame>
  );
};

/* ── 15. Доверие и репутация: чем больше отзывов, тем крупнее сделки ── */
export const Trust: React.FC = () => {
  const {t, dur} = useSec();
  const steps = 6;
  return (
    <Frame label="ФОРУМЫ, ОТЗЫВЫ, ПРЕДОПЛАТА" title="Репутация — почти как инвентарь">
      <div style={{display: 'flex', alignItems: 'flex-end', gap: 40, height: 520, marginTop: 20}}>
        {Array.from({length: steps}, (_, i) => {
          const at = 0.8 + i * ((dur * 0.65) / steps);
          const h = 60 + i * 75;
          const p = k(t, [at, at + 0.6], [0, 1], easeOut);
          return (
            <div key={i} style={{flex: 1, textAlign: 'center'}}>
              <div style={{fontFamily: FONT.mono, fontSize: 28, color: GREEN, opacity: p}}>+{(i + 1) * 5} отзывов</div>
              <div style={{height: h * p, background: i === steps - 1 ? C.gold : '#3A4554', borderRadius: 10, marginTop: 14}} />
            </div>
          );
        })}
      </div>
      <Pop at={dur * 0.75} style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 52, marginTop: 30}}>Чем выше доверие — тем крупнее сделки</Pop>
      {Array.from({length: steps}, (_, i) => <Sfx key={i} name="blip" at={0.8 + i * ((dur * 0.65) / steps)} vol={0.3} />)}
    </Frame>
  );
};

/* ── 16. Предоплата: покупатель платит первым, продавец выполняет заказ ── */
export const Prepay: React.FC = () => {
  const {t, dur} = useSec();
  const pay = k(t, [dur * 0.2, dur * 0.42], [0, 1], easeOut);
  const ship = k(t, [dur * 0.55, dur * 0.77], [0, 1], easeOut);
  const party = (who: string, sub: string, at: number) => (
    <Pop at={at} style={{width: 420}}><Card style={{textAlign: 'center'}}><div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 60}}>{who}</div><div style={{fontSize: 32, color: C.muted, marginTop: 8}}>{sub}</div></Card></Pop>
  );
  return (
    <Frame label="КАК РАБОТАЛИ СДЕЛКИ" title="Сначала оплата — потом заказ">
      <div style={{position: 'relative', height: 520}}>
        <div style={{position: 'absolute', left: 0, top: 150}}>{party('Покупатель', 'платит заранее', 0.5)}</div>
        <div style={{position: 'absolute', right: 0, top: 150}}>{party('Продавец', 'репутация на форуме', 0.9)}</div>
        <div style={{position: 'absolute', left: 470, right: 470, top: 120, height: 3, background: '#2A3340'}} />
        <div style={{position: 'absolute', left: 470, right: 470, top: 400, height: 3, background: '#2A3340'}} />
        <div style={{position: 'absolute', top: 70, left: `calc(470px + ${pay} * (100% - 1040px))`, opacity: pay > 0 && pay < 1 ? 1 : pay >= 1 ? 0.35 : 0, fontFamily: FONT.display, fontWeight: 700, fontSize: 64, color: GREEN}}>$</div>
        <div style={{position: 'absolute', top: 340, right: `calc(470px + ${ship} * (100% - 1060px))`, opacity: ship > 0 && ship < 1 ? 1 : ship >= 1 ? 0.35 : 0, width: 100, height: 100}}>
          <Img src={staticFile('skins/awp-fade.png')} style={{width: 140, height: 100, objectFit: 'contain'}} />
        </div>
        <Pop at={dur * 0.82} style={{position: 'absolute', left: 0, right: 0, top: 470, textAlign: 'center', fontSize: 44, color: C.gold}}>Всё держалось на доверии</Pop>
      </div>
      <Sfx name="pop" at={0.5} vol={0.35} /><Sfx name="pop" at={0.9} vol={0.35} />
      <Sfx name="whoosh_short" at={dur * 0.2} vol={0.45} /><Sfx name="cash" at={dur * 0.42} vol={0.45} />
      <Sfx name="whoosh_short" at={dur * 0.55} vol={0.45} /><Sfx name="lock" at={dur * 0.77} vol={0.4} />
    </Frame>
  );
};

/* ── 17. Заморозка капитала: $1 000 стоят в предметах 7 дней ── */
export const Frozen: React.FC = () => {
  const {t, dur} = useSec();
  const days = Math.min(7, Math.floor(k(t, [1, dur * 0.55], [0, 7], (x) => x)));
  const fall = k(t, [dur * 0.5, dur * 0.8], [0, 1], easeOut);
  const pts = Array.from({length: 30}, (_, i) => {
    const x = (i / 29) * 820;
    const base = 120 + Math.sin(i * 1.3) * 14;
    const y = base + (i > 14 ? (i - 14) * 14 * fall : 0);
    return `${x},${y}`;
  }).join(' ');
  return (
    <Frame label="ЕСЛИ ПРЕДМЕТ ЖДЁТ НЕДЕЛЮ" title="Капитал заморожен">
      <div style={{display: 'flex', gap: 70, alignItems: 'center'}}>
        <Card style={{width: 620, textAlign: 'center'}}>
          <div style={{fontSize: 36, color: C.muted}}>В предметах</div>
          <Counter to={1000} at={0.6} prefix="$" color={C.ivory} />
          <div style={{display: 'flex', gap: 10, marginTop: 30, justifyContent: 'center'}}>
            {Array.from({length: 7}, (_, i) => <div key={i} style={{width: 62, height: 62, borderRadius: 10, background: i < days ? `${RED}cc` : '#2A3340'}} />)}
          </div>
          <div style={{fontFamily: FONT.mono, fontSize: 28, color: C.muted, marginTop: 16}}>день {Math.max(1, days)} из 7</div>
        </Card>
        <div style={{flex: 1}}>
          <svg width={840} height={360} style={{overflow: 'visible'}}>
            <polyline points={pts} fill="none" stroke={fall > 0.05 ? RED : C.ivory} strokeWidth={6} strokeLinejoin="round" strokeDasharray={1400} strokeDashoffset={1400 * (1 - k(t, [0.8, dur * 0.5], [0, 1]))} />
          </svg>
          <div style={{display: 'flex', gap: 30, marginTop: 10}}>
            <Pop at={dur * 0.5}><Card style={{padding: '26px 34px'}}><div style={{fontSize: 34}}>Покупатель исчез</div></Card></Pop>
            <Pop at={dur * 0.62}><Card style={{padding: '26px 34px', borderColor: RED}}><div style={{fontSize: 34}}>Цена упала</div></Card></Pop>
          </div>
          <Pop at={dur * 0.76} style={{marginTop: 26, fontFamily: FONT.display, fontWeight: 700, fontSize: 54, color: RED}}>Прибыль → убыток</Pop>
        </div>
      </div>
      <Sfx name="counter" at={0.6} vol={0.35} />
      {Array.from({length: 7}, (_, i) => <Sfx key={i} name="tick" at={1 + ((dur * 0.55 - 1) * (i + 1)) / 7} vol={0.4} />)}
      <Sfx name="drop" at={dur * 0.5} vol={0.5} /><Sfx name="pop" at={dur * 0.62} vol={0.35} /><Sfx name="thud" at={dur * 0.76} vol={0.55} />
    </Frame>
  );
};

/* ── 18. Сдвиг спроса и предложения после контрактов на ножи ── */
export const DemandShift: React.FC = () => {
  const {t, dur} = useSec();
  const a = k(t, [dur * 0.15, dur * 0.45], [0, 1], easeOut);
  const b = k(t, [dur * 0.45, dur * 0.75], [0, 1], easeOut);
  const col = (img: string[], title: string, what: string, p: number, color: string, up: boolean, at: number) => (
    <Pop at={at} style={{flex: 1}}>
      <Card style={{textAlign: 'center', height: 560, position: 'relative'}}>
        <div style={{display: 'flex', justifyContent: 'center', gap: 10, height: 150}}>{img.map((s) => <Img key={s} src={staticFile(`skins/${s}.png`)} style={{width: 220, height: 140, objectFit: 'contain'}} />)}</div>
        <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 54, marginTop: 20}}>{title}</div>
        <div style={{fontSize: 36, color: C.muted, marginTop: 10}}>{what}</div>
        <svg width={160} height={180} viewBox="0 0 160 180" style={{marginTop: 20, transform: `translateY(${(1 - p) * (up ? 40 : -40)}px)`, opacity: p}}>
          <polygon points={up ? '80,0 160,90 105,90 105,180 55,180 55,90 0,90' : '80,180 160,90 105,90 105,0 55,0 55,90 0,90'} fill={color} />
        </svg>
      </Card>
    </Pop>
  );
  return (
    <Frame label="ПОСЛЕ 22.10.2025 · МОДЕЛЬ" title="Экономика сразу нескольких категорий">
      <div style={{display: 'flex', gap: 60}}>
        {col(['ak-fire-serpent', 'awp-lightning-strike'], 'Красные Covert', 'нужны для контрактов — спрос', a, GREEN, true, 0.5)}
        {col(['karambit-tiger-tooth', 'gloves-orange'], 'Ножи и перчатки', 'новый источник — предложение', b, C.gold, true, dur * 0.4)}
      </div>
      <Sfx name="pop" at={0.5} vol={0.35} /><Sfx name="rise_tone" at={dur * 0.15} vol={0.4} />
      <Sfx name="pop" at={dur * 0.4} vol={0.35} /><Sfx name="rise_tone" at={dur * 0.45} vol={0.4} />
    </Frame>
  );
};

/* ── 19. Март 2026: скином можно пользоваться, пока он выставлен на продажу ── */
export const ListedUse: React.FC = () => {
  const {t, dur} = useSec();
  const sw = k(t, [dur * 0.45, dur * 0.55], [0, 1], easeOut);
  return (
    <Frame label="МАРТ 2026 · STEAM MARKET" title="Выставлен на продажу — и в игре">
      <div style={{display: 'flex', gap: 80, alignItems: 'center'}}>
        <Pop at={0.5} style={{width: 760}}>
          <Card style={{textAlign: 'center'}}>
            <Img src={staticFile('skins/ak-vulcan.png')} style={{width: 560, height: 260, objectFit: 'contain', filter: `grayscale(${1 - sw}) brightness(${0.6 + 0.4 * sw})`}} />
            <div style={{display: 'inline-block', marginTop: 20, padding: '12px 28px', borderRadius: 10, background: '#2A3340', fontSize: 34}}>Лот на торговой площадке</div>
          </Card>
        </Pop>
        <div style={{flex: 1, fontSize: 44}}>
          <Pop at={1}><div style={{color: C.muted}}>Пользоваться в игре</div></Pop>
          <div style={{marginTop: 30, width: 260, height: 120, borderRadius: 60, background: sw > 0.5 ? GREEN : '#3A4554', position: 'relative', opacity: k(t, [1, 1.5], [0, 1])}}>
            <div style={{position: 'absolute', top: 10, left: 10 + 140 * sw, width: 100, height: 100, borderRadius: 50, background: C.ivory}} />
          </div>
          <Pop at={dur * 0.65}><div style={{marginTop: 50}}>Меняется поведение продавцов и число активных лотов</div></Pop>
        </div>
      </div>
      <Sfx name="pop" at={0.5} vol={0.35} /><Sfx name="blip" at={dur * 0.45} vol={0.5} /><Sfx name="pop" at={dur * 0.65} vol={0.35} />
    </Frame>
  );
};
