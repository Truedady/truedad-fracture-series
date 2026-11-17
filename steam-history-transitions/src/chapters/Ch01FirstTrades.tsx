import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Backdrop, Dust, Finish, hexA} from '../components/Atmosphere';
import {Crate, Hat, Key, Metal} from '../components/Icons';
import {ChapterLabel, Chronology, Years} from '../components/Typography';
import {C, FONT} from '../lib/theme';
import {drift, E, k, lerp} from '../lib/anim';

/*
 * ГЛАВА 01 · ПЕРВЫЕ ОБМЕНЫ · 2010–2013
 * Настроение: зарождение рынка. Тёплый свет, медленная камера, «живые» предметы.
 *
 * 0–12    из темноты проступает инвентарь старого Steam (оливковый клиент эпохи)
 * 8–48    два обмена: шляпа ⇄ ключ, металл ⇄ ящик — золотая «нить сделки»
 * 40–62   камера ныряет сквозь интерфейс (push-through + расфокус)
 * 50–84   раскрытие главы: ГЛАВА 01 → ПЕРВЫЕ ОБМЕНЫ → 2010 — 2013 → шкала
 * 84–110  удержание для чтения
 * 110–135 камера продолжает полёт вперёд, предметы проносятся мимо, уход в чёрное
 */
export const CH01_DURATION = 135;

const COLS = 7;
const ROWS = 4;
const S = 118;
const G = 12;
const PAD = 28;
const HEAD = 64;
const BW = PAD * 2 + COLS * S + (COLS - 1) * G;
const BH = HEAD + PAD * 2 + ROWS * S + (ROWS - 1) * G;
const sx = (c: number) => PAD + c * (S + G) + S / 2;
const sy = (r: number) => HEAD + PAD + r * (S + G) + S / 2;

type Kind = 'hat' | 'key' | 'metal' | 'crate';
const ICON: Record<Kind, React.FC<{size?: number; style?: React.CSSProperties}>> = {hat: Hat, key: Key, metal: Metal, crate: Crate};

// Статичное содержимое инвентаря
const STATIC: [number, number, Kind][] = [
  [0, 0, 'metal'], [1, 0, 'metal'], [2, 0, 'key'], [5, 0, 'crate'], [6, 0, 'hat'],
  [0, 1, 'crate'], [3, 1, 'metal'], [4, 1, 'hat'], [6, 1, 'key'],
  [0, 2, 'hat'], [1, 2, 'key'], [3, 2, 'crate'], [6, 2, 'metal'],
  [1, 3, 'metal'], [3, 3, 'key'], [4, 3, 'metal'], [5, 3, 'crate'], [6, 3, 'hat'],
];

// Обмены: предмет a из слота A уходит в B, предмет b — навстречу
const TRADES = [
  {a: [1, 1] as const, b: [5, 2] as const, ka: 'hat' as Kind, kb: 'key' as Kind, t0: 10, t1: 40, side: 1},
  {a: [4, 0] as const, b: [2, 3] as const, ka: 'metal' as Kind, kb: 'crate' as Kind, t0: 18, t1: 47, side: -1},
];

// Контрольная точка дуги: смещение перпендикулярно отрезку A–B
const ctrl = (t: (typeof TRADES)[number], dir: 1 | -1) => {
  const A = {x: sx(t.a[0]), y: sy(t.a[1])};
  const B = {x: sx(t.b[0]), y: sy(t.b[1])};
  const nx = -(B.y - A.y);
  const ny = B.x - A.x;
  const nl = Math.hypot(nx, ny);
  const off = Math.min(150, nl * 0.28) * dir * t.side;
  return {x: (A.x + B.x) / 2 + (nx / nl) * off, y: (A.y + B.y) / 2 + (ny / nl) * off};
};

const Slot: React.FC<{x: number; y: number; hl: number}> = ({x, y, hl}) => (
  <div
    style={{
      position: 'absolute',
      left: x - S / 2,
      top: y - S / 2,
      width: S,
      height: S,
      background: `linear-gradient(180deg, ${C.olive3} 0%, #262B22 100%)`,
      boxShadow: `inset 1px 1px 0 rgba(0,0,0,0.55), inset -1px -1px 0 ${hexA(C.oliveLine, 0.9)}${hl > 0 ? `, 0 0 0 2px ${hexA(C.oliveText, hl)}, 0 0 24px ${hexA(C.gold, hl * 0.35)}` : ''}`,
    }}
  />
);

export const Ch01FirstTrades: React.FC = () => {
  const f = useCurrentFrame();

  // ── Камера над инвентарём ──────────────────────────────────────────
  const push = k(f, [38, 56], [0, 1], E.in);
  const camZ = k(f, [0, 44], [-420, 140], E.soft) + push * 650;
  const zoom = 1 + push * push * 2.4; // «пролёт сквозь интерфейс»
  const rx = k(f, [0, 42], [58, 38], E.soft) - push * 22;
  const rz = k(f, [0, 50], [-17, -4], E.soft);
  const camX = k(f, [0, 50], [220, -20], E.soft);
  const camY = k(f, [0, 50], [70, -20], E.soft);
  const boardOpacity = k(f, [0, 10], [0, 1]) * k(f, [44, 54], [1, 0], E.in);
  const boardBlur = k(f, [0, 22], [10, 0], E.out) + push * 22;
  const sheen = k(f, [4, 44], [-40, 140], E.inOut); // световая полоса по интерфейсу
  const tilt = rx * 0.75; // предметы в полёте разворачиваются к камере

  // ── Слой заголовка ─────────────────────────────────────────────────
  const exit = k(f, [108, 132], [0, 1], E.in);
  const d = drift(f, 1.3, 6);
  const bloom = k(f, [44, 54, 70], [0, 0.22, 0.06]);

  const items: React.ReactNode[] = [];
  const hidden = new Set<string>();
  TRADES.forEach((t, ti) => {
    const p = k(f, [t.t0, t.t1], [0, 1], E.inOut);
    const pAt = (ff: number) => k(ff, [t.t0, t.t1], [0, 1], E.inOut);
    hidden.add(`${t.a[0]},${t.a[1]}`);
    hidden.add(`${t.b[0]},${t.b[1]}`);
    const A = {x: sx(t.a[0]), y: sy(t.a[1])};
    const B = {x: sx(t.b[0]), y: sy(t.b[1])};
    const pos = (pp: number, dir: 1 | -1, from: typeof A, to: typeof A) => {
      const M = ctrl(t, dir);
      const u = 1 - pp;
      const arc = Math.sin(pp * Math.PI);
      return {
        x: u * u * from.x + 2 * u * pp * M.x + pp * pp * to.x,
        y: u * u * from.y + 2 * u * pp * M.y + pp * pp * to.y,
        z: arc * 190 + 2,
        r: arc * 14 * dir,
      };
    };
    const movers = [
      {kind: t.ka, from: A, to: B, dir: 1 as const},
      {kind: t.kb, from: B, to: A, dir: -1 as const},
    ];
    movers.forEach((m, mi) => {
      const Ico = ICON[m.kind];
      const P = pos(p, m.dir, m.from, m.to);
      const lift = Math.sin(p * Math.PI);
      // тень на «полу» инвентаря
      items.push(
        <div
          key={`sh${ti}${mi}`}
          style={{
            position: 'absolute',
            left: P.x - 60,
            top: P.y - 30,
            width: 120,
            height: 60,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(0,0,0,0.55), transparent 70%)',
            opacity: 0.25 + lift * 0.5,
            transform: `translateZ(1px) scale(${1 + lift * 0.6})`,
          }}
        />,
      );
      // «моушн-блюр»: несколько призраков по траектории
      const moving = f > t.t0 && f < t.t1;
      const ghosts = moving ? [3, 2, 1] : [];
      ghosts.forEach((g) => {
        const Pg = pos(pAt(f - g * 0.9), m.dir, m.from, m.to);
        items.push(
          <div
            key={`g${ti}${mi}${g}`}
            style={{
              position: 'absolute',
              left: Pg.x - 50,
              top: Pg.y - 50,
              width: 100,
              height: 100,
              opacity: 0.16 / g,
              transform: `translateZ(${Pg.z}px) rotateX(${-tilt * Math.sin(pAt(f - g) * Math.PI)}deg) rotateZ(${Pg.r}deg)`,
            }}
          >
            <Ico size={100} />
          </div>,
        );
      });
      items.push(
        <div
          key={`m${ti}${mi}`}
          style={{
            position: 'absolute',
            left: P.x - 50,
            top: P.y - 50,
            width: 100,
            height: 100,
            transform: `translateZ(${P.z}px) rotateX(${-tilt * lift}deg) rotateZ(${P.r}deg) scale(${1 + lift * 0.15})`,
            filter: `drop-shadow(0 0 ${lift * 18}px ${hexA(C.goldHi, lift * 0.45)})`,
          }}
        >
          <Ico size={100} />
        </div>,
      );
    });
  });

  // золотая «нить сделки»: две встречные дуги образуют линзу обмена
  const thread = (t: (typeof TRADES)[number], i: number) => {
    const A = {x: sx(t.a[0]), y: sy(t.a[1])};
    const B = {x: sx(t.b[0]), y: sy(t.b[1])};
    const draw = k(f, [t.t0 - 8, t.t0 + 8], [0, 1], E.out);
    const fade = k(f, [t.t1 - 2, t.t1 + 12], [1, 0]);
    const len = 1600;
    return ([1, -1] as const).map((dir) => {
      const M = ctrl(t, dir);
      const [from, to] = dir === 1 ? [A, B] : [B, A];
      return (
        <path
          key={`${i}${dir}`}
          d={`M${from.x} ${from.y} Q${M.x} ${M.y} ${to.x} ${to.y}`}
          fill="none"
          stroke={C.oliveText}
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeDasharray={len}
          strokeDashoffset={len * (1 - draw)}
          opacity={fade * 0.85}
        />
      );
    });
  };

  const slotHl = (c: number, r: number) => {
    let v = 0;
    for (const t of TRADES) {
      const isEnd = (t.a[0] === c && t.a[1] === r) || (t.b[0] === c && t.b[1] === r);
      if (isEnd) v = Math.max(v, k(f, [t.t0 - 8, t.t0], [0, 0.9]) * k(f, [t.t1 + 2, t.t1 + 14], [1, 0.25]));
    }
    return v;
  };

  // Предметы в «боке» вокруг заголовка — те же вещи, что были в инвентаре
  const BOKEH: {kind: Kind; x: number; y: number; s: number; blur: number; o: number; r: number}[] = [
    {kind: 'key', x: 280, y: 250, s: 150, blur: 5, o: 0.5, r: -18},
    {kind: 'hat', x: 1560, y: 190, s: 190, blur: 9, o: 0.4, r: 10},
    {kind: 'metal', x: 1650, y: 690, s: 140, blur: 3.5, o: 0.55, r: -6},
    {kind: 'crate', x: 210, y: 720, s: 170, blur: 10, o: 0.32, r: 8},
    {kind: 'metal', x: 560, y: 120, s: 80, blur: 2, o: 0.35, r: 14},
    {kind: 'key', x: 1380, y: 860, s: 90, blur: 2.5, o: 0.35, r: 30},
  ];
  const bokehIn = k(f, [46, 70], [0, 1], E.out);

  const TITLE = 'ПЕРВЫЕ ОБМЕНЫ';
  const tStart = 55;

  return (
    <AbsoluteFill style={{background: C.black, overflow: 'hidden'}}>
      <Backdrop glow={C.gold} glowOpacity={0.09 + bloom * 0.3} glowY={48} />

      {/* Пол из слотов инвентаря, уходящий к горизонту, под заголовком */}
      <AbsoluteFill style={{perspective: 900, opacity: k(f, [48, 70], [0, 1]) * (1 - exit * 0.6)}}>
        <div
          style={{
            position: 'absolute',
            left: -1500,
            top: 640,
            width: 4920,
            height: 2400,
            transformOrigin: '50% 0%',
            transform: `rotateX(74deg) translateY(${-((f * 3 + exit * exit * 900) % 130)}px)`,
            backgroundImage: `linear-gradient(90deg, ${hexA(C.oliveText, 0.12)} 1px, transparent 1px), linear-gradient(0deg, ${hexA(C.oliveText, 0.12)} 1px, transparent 1px)`,
            backgroundSize: '130px 130px',
            maskImage: 'linear-gradient(180deg, transparent 0%, black 18%, black 40%, transparent 85%)',
            WebkitMaskImage: 'linear-gradient(180deg, transparent 0%, black 18%, black 40%, transparent 85%)',
          }}
        />
      </AbsoluteFill>

      {/* ── 3D-инвентарь старого Steam ───────────────────────── */}
      <AbsoluteFill style={{perspective: 1500, perspectiveOrigin: '50% 42%', opacity: boardOpacity, filter: `blur(${boardBlur}px)`, transform: `scale(${zoom})`}}>
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '52%',
            transformStyle: 'preserve-3d',
            transform: `translate3d(${camX}px, ${camY}px, ${camZ}px) rotateX(${rx}deg) rotateZ(${rz}deg)`,
          }}
        >
          <div style={{position: 'absolute', left: -BW / 2, top: -BH / 2, width: BW, height: BH, transformStyle: 'preserve-3d'}}>
            {/* окно клиента */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(${118}deg, transparent ${sheen - 14}%, rgba(255,250,220,0.07) ${sheen}%, transparent ${sheen + 14}%), linear-gradient(180deg, #47523F 0%, ${C.olive2} 70%, #343B2E 100%)`,
                boxShadow: `inset 0 1px 0 ${hexA('#9AA58A', 0.6)}, 0 40px 120px rgba(0,0,0,0.6)`,
                borderRadius: 4,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: PAD,
                top: 18,
                right: PAD,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                gap: 22,
                fontFamily: FONT.retroUi,
                fontSize: 19,
                color: '#DDE3D2',
                letterSpacing: '0.02em',
              }}
            >
              <span style={{fontWeight: 700, color: C.oliveText}}>ИНВЕНТАРЬ</span>
              <span style={{padding: '3px 12px', background: C.olive3, border: `1px solid ${C.oliveLine}`, fontSize: 16}}>Team Fortress 2</span>
              <span style={{marginLeft: 'auto', fontSize: 15, color: '#AEB79E'}}>Предложение обмена</span>
            </div>
            {Array.from({length: COLS * ROWS}, (_, i) => {
              const c = i % COLS;
              const r = Math.floor(i / COLS);
              return <Slot key={i} x={sx(c)} y={sy(r)} hl={slotHl(c, r)} />;
            })}
            {STATIC.filter(([c, r]) => !hidden.has(`${c},${r}`)).map(([c, r, kind], i) => {
              const Ico = ICON[kind];
              const bob = Math.sin(f * 0.08 + i) * 2;
              return (
                <div key={i} style={{position: 'absolute', left: sx(c) - 46, top: sy(r) - 46 + bob, width: 92, height: 92, transform: 'translateZ(1px)'}}>
                  <Ico size={92} />
                </div>
              );
            })}
            <svg width={BW} height={BH} style={{position: 'absolute', left: 0, top: 0, transform: 'translateZ(1px)', overflow: 'visible'}}>
              {TRADES.map(thread)}
            </svg>
            {items}
          </div>
        </div>
      </AbsoluteFill>

      <Dust camX={-camX * 0.6 - exit * 300} camY={-camY * 0.6} seed="d01" count={80} opacity={0.9} speed={1 + exit * 6} />

      {/* ── Предметы-боке вокруг заголовка ───────────────────────── */}
      <AbsoluteFill>
        {BOKEH.map((b, i) => {
          const Ico = ICON[b.kind];
          const cx = 960;
          const cy = 520;
          const spread = 1 + (1 - bokehIn) * 0.6 + exit * exit * 2.2;
          const x = cx + (b.x - cx) * spread + d.x * (1 + i * 0.3);
          const y = cy + (b.y - cy) * spread + d.y * (1 + i * 0.3) - f * 0.15 * (1 + i * 0.2);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: x - b.s / 2,
                top: y - b.s / 2,
                opacity: b.o * bokehIn * k(f, [120, 134], [1, 0]),
                filter: `blur(${b.blur + exit * 12}px)`,
                transform: `rotate(${b.r + Math.sin(f * 0.03 + i) * 4}deg) scale(${1 + exit * 0.9})`,
              }}
            >
              <Ico size={b.s} />
            </div>
          );
        })}
      </AbsoluteFill>

      {/* ── Заголовок главы ───────────────────────── */}
      <AbsoluteFill
        style={{
          opacity: 1 - k(f, [110, 126], [0, 1], E.in),
          transform: `translate(${d.x * 0.4}px, ${d.y * 0.4}px) scale(${1 + k(f, [56, 110], [0.035, 0]) + exit * 0.16})`,
          filter: `blur(${exit * 10}px)`,
        }}
      >
        <div style={{position: 'absolute', left: 0, right: 0, top: 344}}>
          <ChapterLabel num="01" f={f} start={53} />
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 392, textAlign: 'center', fontFamily: FONT.display, fontWeight: 700, fontSize: 156, lineHeight: 1.12, color: C.ivory, letterSpacing: '-0.005em', whiteSpace: 'pre'}}>
          {TITLE.split('').map((ch, i) => {
            const s = tStart + i * 1.3;
            return (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  opacity: k(f, [s, s + 10], [0, 1]),
                  transform: `translateY(${k(f, [s, s + 20], [46, 0], E.out)}px)`,
                  filter: `blur(${k(f, [s, s + 14], [10, 0], E.out)}px)`,
                  textShadow: '0 10px 60px rgba(0,0,0,0.7)',
                }}
              >
                {ch}
              </span>
            );
          })}
        </div>
        {/* световой блик, проходящий по буквам один раз */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 392,
            textAlign: 'center',
            fontFamily: FONT.display,
            fontWeight: 700,
            fontSize: 156,
            lineHeight: 1.12,
            letterSpacing: '-0.005em',
            whiteSpace: 'pre',
            color: 'transparent',
            backgroundImage: `linear-gradient(100deg, transparent 0%, transparent 42%, ${hexA(C.goldHi, 0.85)} 50%, transparent 58%, transparent 100%)`,
            backgroundSize: '260% 100%',
            backgroundPosition: `${k(f, [80, 104], [100, 0], E.inOut)}% 0`,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            opacity: k(f, [78, 82, 100, 106], [0, 1, 1, 0]),
          }}
        >
          {TITLE}
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 594}}>
          <Years text="2010 — 2013" f={f} start={68} />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 668,
            textAlign: 'center',
            fontFamily: FONT.mono,
            fontSize: 17,
            letterSpacing: '0.32em',
            color: C.muted,
            opacity: k(f, [80, 94], [0, 0.85]),
          }}
        >
          TEAM FORTRESS 2 · STEAM TRADING · COMMUNITY MARKET
        </div>
        <div style={{position: 'absolute', left: (1920 - 1040) / 2, top: 900}}>
          <Chronology from={2010} to={2013} f={f} start={76} />
        </div>
      </AbsoluteFill>

      <Finish vignette={0.78} grain={0.075} />
      <AbsoluteFill style={{background: C.black, opacity: k(f, [0, 8], [1, 0]) + k(f, [126, 134], [0, 1], E.in)}} />
    </AbsoluteFill>
  );
};
