import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Backdrop, Dust, Finish, hexA} from '../components/Atmosphere';
import {Case, Knife, Lock, Pistol, Rifle} from '../components/Icons';
import {ChapterLabel, Chronology, Years} from '../components/Typography';
import {Skin, SkinKey, WEAPONS} from '../components/Skins';
import {C, FONT} from '../lib/theme';
import {E, k, lerp, rnd, shake} from '../lib/anim';

/*
 * ГЛАВА 07 · ХУДШАЯ ВЕСНА ДЛЯ ТРЕЙДЕРОВ · 2018
 * Настроение: резкая смена правил. Холодный свет, быстрая камера → полная остановка.
 *
 * 0–42    четыре инвентаря трейд-ботов, предметы непрерывно летают между ними
 * 42      СТОП: время замирает посреди сделок, удар камеры, цвет уходит
 * 44–60   на каждом полученном предмете — красный замок
 * 46–80   предупреждение «Обмен заблокирован · 7 дней», дни заполняются
 * 76–94   фокус переводится со сцены на титр; предупреждение сжимается в метку
 * 80–94   титр раскрывается «шторкой» из одной линии
 * 94–132  удержание для чтения
 * 128–150 сцена обрушивается вниз, шторка схлопывается в линию → точка → чёрный
 */
export const CH07_DURATION = 150;
const FREEZE = 42;

// ── Геометрия панелей ────────────────────────────────────────────────
const PW = 336;
const PH = 494;
const SS = 92;
const SG = 10;
const PP = 20;
const PHEAD = 56;
const PANELS = [
  {x: -730, y: 14, z: -300, ry: 28},
  {x: -252, y: -6, z: 20, ry: 9},
  {x: 252, y: 6, z: 20, ry: -9},
  {x: 730, y: -14, z: -300, ry: -28},
];
const slotLocal = (i: number) => {
  const c = i % 3;
  const r = Math.floor(i / 3);
  return {x: -PW / 2 + PP + c * (SS + SG) + SS / 2, y: -PH / 2 + PHEAD + PP + r * (SS + SG) + SS / 2};
};
const slotWorld = (p: number, i: number) => {
  const P = PANELS[p];
  const l = slotLocal(i);
  const a = (P.ry * Math.PI) / 180;
  return {x: P.x + l.x * Math.cos(a), y: P.y + l.y, z: P.z - l.x * Math.sin(a)};
};

type Kind = 'rifle' | 'pistol' | 'knife' | 'case';
const RARITY = [C.milspec, C.restricted, C.classified, '#B0C3D9'];
const itemOf = (seed: string) => {
  const r = rnd(seed);
  const kind: Kind = r < 0.45 ? 'rifle' : r < 0.68 ? 'pistol' : r < 0.84 ? 'knife' : 'case';
  const rarity = RARITY[Math.floor(rnd(seed + 'r') * RARITY.length)];
  return {kind, rarity};
};

// Реальные рендеры скинов; seed выбирает, какой именно
const REAL: SkinKey[] = WEAPONS;
const Item: React.FC<{kind: Kind; rarity: string; size: number; seed?: string}> = ({kind, rarity, size, seed}) => {
  if (seed !== undefined) {
    const key = REAL[Math.floor(rnd(seed + 'skin') * REAL.length)];
    return <Skin k={key} w={size} h={size * 0.42} />;
  }
  const dark = '#1A1F27';
  if (kind === 'rifle') return <Rifle size={size} accent={rarity} accent2={dark} />;
  if (kind === 'pistol') return <Pistol size={size * 0.8} accent={rarity} accent2={dark} />;
  if (kind === 'knife') return <Knife size={size} accent="#2A2F37" />;
  return <Case size={size * 0.5} accent={rarity} />;
};

// Сделки: [панель, слот] → [панель, слот], старт, длительность
const FLIGHTS: {a: [number, number]; b: [number, number]; s: number; d: number}[] = [
  {a: [0, 1], b: [1, 4], s: 2, d: 13},
  {a: [2, 7], b: [3, 2], s: 4, d: 13},
  {a: [1, 9], b: [2, 0], s: 7, d: 12},
  {a: [3, 5], b: [0, 8], s: 10, d: 15},
  {a: [1, 2], b: [3, 10], s: 13, d: 13},
  {a: [2, 4], b: [1, 6], s: 16, d: 12},
  {a: [0, 6], b: [2, 11], s: 19, d: 13},
  {a: [3, 0], b: [1, 11], s: 22, d: 13},
  {a: [2, 9], b: [0, 3], s: 25, d: 14},
  // эти пять — в воздухе в момент остановки
  {a: [0, 10], b: [3, 7], s: 29, d: 17},
  {a: [1, 0], b: [2, 5], s: 32, d: 15},
  {a: [3, 9], b: [1, 8], s: 34, d: 16},
  {a: [2, 1], b: [0, 4], s: 36, d: 15},
  {a: [1, 7], b: [3, 4], s: 38, d: 15},
];
const DESTS = new Set(FLIGHTS.map((fl) => `${fl.b[0]},${fl.b[1]}`));
const SOURCES = new Set(FLIGHTS.map((fl) => `${fl.a[0]},${fl.a[1]}`));

const LOG_IDS = FLIGHTS.map((_, i) => `#${Math.floor(1000 + rnd(`log${i}`) * 8999)}-${String.fromCharCode(65 + Math.floor(rnd(`lg${i}`) * 26))}`);

export const Ch07WorstSpring: React.FC = () => {
  const f = useCurrentFrame();
  const tf = Math.min(f, FREEZE); // время сделок останавливается
  const frozen = f >= FREEZE;

  // ── Камера ────────────────────────────────────────────────────────
  const camZ = k(tf, [0, FREEZE], [-60, 250], E.soft) + (frozen ? (f - FREEZE) * 0.6 : 0);
  const camRy = k(tf, [0, FREEZE], [14, -6], E.soft);
  const camX = k(tf, [0, FREEZE], [-80, 30], E.soft);
  const sh = shake(f, FREEZE, 14, 7);
  const impact = frozen ? 1 + 0.018 * Math.exp(-(f - FREEZE) / 6) : 1;

  // ── Грейдинг / фокус ───────────────────────────────────────────────
  const sat = k(f, [FREEZE, FREEZE + 6], [1, 0.22]);
  const bri = k(f, [FREEZE, FREEZE + 3, FREEZE + 10], [1, 0.62, 0.74]) * k(f, [76, 94], [1, 0.7]);
  const rack = k(f, [76, 94], [0, 8], E.inOut);

  // ── Финальное обрушение ────────────────────────────────────────────
  const fall = (seed: number) => {
    const t = Math.max(0, f - 126 - seed * 2);
    return t * t * 2.6;
  };

  // ── Предметы в полёте ──────────────────────────────────────────────
  const flightPos = (i: number, ff: number) => {
    const fl = FLIGHTS[i];
    const p = k(Math.min(ff, FREEZE), [fl.s, fl.s + fl.d], [0, 1], E.inOut);
    const A = slotWorld(fl.a[0], fl.a[1]);
    const B = slotWorld(fl.b[0], fl.b[1]);
    const arc = Math.sin(p * Math.PI);
    return {p, x: lerp(A.x, B.x, p), y: lerp(A.y, B.y, p) - arc * 150, z: lerp(A.z, B.z, p) + arc * 260 + 4};
  };
  const flightState = FLIGHTS.map((fl, i) => {
    const pos = flightPos(i, f);
    return {fl, i, pos, inAir: pos.p > 0 && pos.p < 1, landed: pos.p >= 1, started: f >= fl.s};
  });

  const landedSet = new Map<string, number>();
  flightState.forEach((s) => s.landed && landedSet.set(`${s.fl.b[0]},${s.fl.b[1]}`, s.i));
  const departed = new Set(flightState.filter((s) => s.pos.p > 0).map((s) => `${s.fl.a[0]},${s.fl.a[1]}`));

  const lockPop = (start: number) => ({
    o: k(f, [start, start + 3], [0, 1]),
    s: k(f, [start, start + 6], [1.7, 1], E.out),
  });

  // журнал сделок
  const landedOrder = flightState.filter((s) => s.landed).sort((a, b) => a.fl.s + a.fl.d - (b.fl.s + b.fl.d));
  const logLines = landedOrder.slice(-5).map((s) => `ОБМЕН ПРИНЯТ   ${LOG_IDS[s.i]}`);

  const dayRoll = k(f, [FREEZE, FREEZE + 5], [0, 1], E.out);
  const uiOut = k(f, [76, 90], [1, 0]);

  // предупреждение
  const warnIn = k(f, [46, 52], [0, 1], E.out);
  const warnMorph = k(f, [78, 90], [0, 1], E.inOut);
  // титр
  const lineW = k(f, [80, 87], [0, 1380], E.out) * (1 - k(f, [142, 147], [0, 1], E.in));
  const open = k(f, [84, 95], [0, 1], E.out) * (1 - k(f, [134, 142], [0, 1], E.hard));
  const lineO = k(f, [80, 82], [0, 1]) * k(f, [92, 100, 134, 137], [1, 0.0, 0.0, 1]);

  const TITLE_Y = 400;

  return (
    <AbsoluteFill style={{background: C.black, overflow: 'hidden'}}>
      <Backdrop glow="#6F86A8" glowOpacity={0.09} glowY={46} base="#0A0D12" />

      {/* ── Сцена: 4 инвентаря ───────────────────────── */}
      <AbsoluteFill
        style={{
          filter: `saturate(${sat}) brightness(${bri}) blur(${rack}px)`,
          transform: `translate(${sh.x}px, ${sh.y}px) rotate(${sh.r}deg) scale(${impact})`,
          opacity: k(f, [0, 8], [0, 1]),
        }}
      >
        <AbsoluteFill style={{perspective: 1600, perspectiveOrigin: '50% 45%'}}>
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '49%',
              transformStyle: 'preserve-3d',
              transform: `translate3d(${camX}px, 0px, ${camZ}px) rotateY(${camRy}deg) rotateX(-3deg)`,
            }}
          >
            {PANELS.map((P, pi) => (
              <div
                key={pi}
                style={{
                  position: 'absolute',
                  left: -PW / 2,
                  top: -PH / 2,
                  width: PW,
                  height: PH,
                  transform: `translate3d(${P.x}px, ${P.y + fall(pi)}px, ${P.z}px) rotateY(${P.ry}deg) rotateX(${-fall(pi) * 0.02}deg)`,
                  background: `linear-gradient(180deg, ${C.panel2} 0%, ${C.panel} 100%)`,
                  border: `1px solid ${C.line}`,
                  borderRadius: 6,
                  boxShadow: '0 30px 90px rgba(0,0,0,0.6)',
                }}
              >
                <div style={{position: 'absolute', left: PP, right: PP, top: 16, display: 'flex', alignItems: 'center', gap: 10}}>
                  <div style={{width: 24, height: 24, borderRadius: 3, background: `linear-gradient(135deg, #3B4655, #222932)`}} />
                  <div style={{fontFamily: FONT.mono, fontSize: 14, fontWeight: 500, color: C.ivory, letterSpacing: '0.08em'}}>ТРЕЙД-БОТ 0{pi + 1}</div>
                  <div style={{marginLeft: 'auto', fontFamily: FONT.mono, fontSize: 12, color: C.dim, letterSpacing: '0.1em'}}>CS:GO</div>
                </div>
                {Array.from({length: 12}, (_, si) => {
                  const l = slotLocal(si);
                  const key = `${pi},${si}`;
                  const isDest = DESTS.has(key);
                  const isSrc = SOURCES.has(key);
                  const filledStatic = !isDest && (isSrc || rnd(`fill${key}`) > 0.35);
                  const show = isDest ? landedSet.has(key) : filledStatic && !departed.has(key);
                  const it = isDest && landedSet.has(key) ? itemOf(`fl${landedSet.get(key)}`) : itemOf(`slot${key}`);
                  const locked = isDest && landedSet.has(key) && frozen;
                  const lk = lockPop(FREEZE + 4 + ((pi * 5 + si) % 9));
                  return (
                    <div
                      key={si}
                      style={{
                        position: 'absolute',
                        left: l.x + PW / 2 - SS / 2,
                        top: l.y + PH / 2 - SS / 2,
                        width: SS,
                        height: SS,
                        background: '#10141A',
                        border: `1px solid ${locked ? hexA(C.red, 0.55 * lk.o) : '#232A34'}`,
                        borderRadius: 3,
                        overflow: 'hidden',
                      }}
                    >
                      {show && (
                        <>
                          <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 3, background: it.rarity, opacity: 0.85}} />
                          <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <Item kind={it.kind} rarity={it.rarity} size={84} seed={isDest && landedSet.has(key) ? `fl${landedSet.get(key)}` : `slot${key}`} />
                          </div>
                          {locked && (
                            <div style={{position: 'absolute', right: 4, top: 4, opacity: lk.o, transform: `scale(${lk.s})`}}>
                              <Lock size={18} />
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Летящие предметы (с призраками-шлейфом до остановки) */}
            {flightState
              .filter((s) => s.inAir)
              .map((s) => {
                const it = itemOf(`fl${s.i}`);
                const ghosts = frozen ? [] : [4, 3, 2, 1];
                const lk = lockPop(FREEZE + 2 + (s.i % 5) * 2);
                const drop = fall(s.i % 4);
                const node = (x: number, y: number, z: number, o: number, key: string, withLock: boolean) => (
                  <div
                    key={key}
                    style={{
                      position: 'absolute',
                      left: -75,
                      top: -30,
                      width: 150,
                      height: 60,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: o,
                      transform: `translate3d(${x}px, ${y + drop}px, ${z}px) rotateY(${-camRy}deg)`,
                      filter: withLock ? `drop-shadow(0 0 ${8 * lk.o}px ${hexA(C.red, 0.7 * lk.o)})` : `drop-shadow(0 8px 18px rgba(0,0,0,0.6))`,
                    }}
                  >
                    <Item kind={it.kind} rarity={it.rarity} size={150} seed={`fl${s.i}`} />
                    {withLock && (
                      <div style={{position: 'absolute', right: -6, top: -18, opacity: lk.o, transform: `scale(${lk.s})`}}>
                        <Lock size={30} />
                      </div>
                    )}
                  </div>
                );
                return (
                  <React.Fragment key={s.i}>
                    {ghosts.map((g) => {
                      const q = flightPos(s.i, f - g * 0.75);
                      return node(q.x, q.y, q.z, 0.22 / g, `g${s.i}${g}`, false);
                    })}
                    {node(s.pos.x, s.pos.y, s.pos.z, 1, `m${s.i}`, frozen)}
                  </React.Fragment>
                );
              })}
          </div>
        </AbsoluteFill>
      </AbsoluteFill>

      <Dust seed="d07" count={50} color="#C9D6EA" camX={-camX} opacity={0.55} speed={frozen ? 0.15 : 1.4} />

      {/* красная виньетка-удар в момент остановки */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 90% 80% at 50% 50%, transparent 55%, ${hexA(C.red, 0.2)} 100%)`,
          opacity: k(f, [FREEZE, FREEZE + 2, FREEZE + 30], [0, 1, 0.25]) * k(f, [90, 110], [1, 0]),
        }}
      />

      {/* ── Интерфейсные надписи сцены ───────────────── */}
      <div style={{position: 'absolute', left: 160, top: 96, opacity: k(f, [4, 12], [0, 1]) * uiOut, fontFamily: FONT.mono}}>
        <div style={{fontSize: 13, letterSpacing: '0.3em', color: C.dim, marginBottom: 12}}>ЖУРНАЛ ОБМЕНОВ</div>
        {logLines.map((l, i) => (
          <div key={l} style={{fontSize: 16, lineHeight: '26px', color: C.muted, opacity: 0.35 + (i / Math.max(1, logLines.length - 1)) * 0.65, letterSpacing: '0.04em'}}>
            {l}
          </div>
        ))}
        {frozen && (
          <div style={{fontSize: 16, lineHeight: '26px', color: C.red, letterSpacing: '0.04em', opacity: k(f, [FREEZE + 3, FREEZE + 5], [0, 1])}}>
            ПОВТОРНАЯ ПЕРЕДАЧА — ЧЕРЕЗ 7 ДНЕЙ
          </div>
        )}
      </div>
      <div style={{position: 'absolute', right: 160, top: 96, textAlign: 'right', opacity: k(f, [4, 12], [0, 1]) * uiOut, fontFamily: FONT.mono}}>
        <div style={{fontSize: 13, letterSpacing: '0.3em', color: C.dim, marginBottom: 8}}>ДАТА</div>
        <div style={{fontSize: 30, fontWeight: 500, color: C.ivory, letterSpacing: '0.06em', display: 'flex', justifyContent: 'flex-end'}}>
          <span>2</span>
          <span style={{position: 'relative', display: 'inline-block', height: 38, overflow: 'hidden', width: '0.62em'}}>
            <span style={{position: 'absolute', left: 0, top: -dayRoll * 38, lineHeight: '38px'}}>8</span>
            <span style={{position: 'absolute', left: 0, top: 38 - dayRoll * 38, lineHeight: '38px', color: frozen ? C.red : C.ivory}}>9</span>
          </span>
          <span>.03.2018</span>
        </div>
      </div>

      {/* ── Предупреждение → метка ───────────────────── */}
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div
          style={{
            position: 'absolute',
            left: 960 - 370,
            top: 540 - 125 + warnMorph * (250 - 540),
            width: 740,
            padding: '30px 38px 32px',
            background: 'rgba(16,9,11,0.9)',
            border: `1.5px solid ${hexA(C.red, 0.8)}`,
            borderRadius: 6,
            boxShadow: `0 0 80px ${hexA(C.red, 0.18)}, 0 30px 80px rgba(0,0,0,0.7)`,
            opacity: warnIn * (1 - warnMorph),
            transform: `scale(${k(f, [46, 52], [1.06, 1], E.out) * lerp(1, 0.45, warnMorph)})`,
            transformOrigin: '50% 50%',
          }}
        >
          <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
            <Lock size={44} />
            <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 42, color: C.ivory, letterSpacing: '0.01em'}}>ОБМЕН ЗАБЛОКИРОВАН</div>
          </div>
          <div style={{fontFamily: FONT.text, fontSize: 21, color: C.muted, marginTop: 14}}>
            Предмет, полученный через обмен, нельзя передать повторно
          </div>
          <div style={{display: 'flex', alignItems: 'flex-end', gap: 24, marginTop: 26}}>
            <div style={{display: 'flex', gap: 8, flex: 1}}>
              {Array.from({length: 7}, (_, i) => {
                const fill = k(f, [52 + i * 2.2, 55 + i * 2.2], [0, 1]);
                return (
                  <div key={i} style={{flex: 1}}>
                    <div style={{fontFamily: FONT.mono, fontSize: 13, color: C.dim, marginBottom: 6}}>Д{i + 1}</div>
                    <div style={{height: 10, background: '#2A1A1D', borderRadius: 2, overflow: 'hidden'}}>
                      <div style={{width: `${fill * 100}%`, height: '100%', background: C.red}} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{fontFamily: FONT.mono, fontWeight: 700, fontSize: 46, color: C.red, lineHeight: 0.9, letterSpacing: '0.02em'}}>7 ДНЕЙ</div>
          </div>
        </div>
      </AbsoluteFill>

      {/* метка над титром */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 268,
          display: 'flex',
          justifyContent: 'center',
          opacity: k(f, [86, 94], [0, 1]) * (1 - k(f, [132, 138], [0, 1])),
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '8px 18px 8px 12px',
            border: `1px solid ${hexA(C.red, 0.7)}`,
            borderRadius: 4,
            background: 'rgba(30,10,13,0.6)',
            fontFamily: FONT.mono,
            fontSize: 16,
            fontWeight: 500,
            letterSpacing: '0.12em',
            color: C.ivory,
          }}
        >
          <Lock size={18} />
          <span style={{color: C.red}}>29.03.2018</span>
          <span style={{color: C.dim}}>·</span>
          <span>ТРЕЙДЛОК 7 ДНЕЙ</span>
        </div>
      </div>

      {/* ── Титр: шторка из линии ─────────────────────── */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 336, opacity: (1 - k(f, [132, 138], [0, 1]))}}>
        <ChapterLabel num="07" f={f} start={90} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: TITLE_Y,
          height: 300,
          clipPath: `inset(${50 - 50 * open}% 0 ${50 - 50 * open}% 0)`,
          textAlign: 'center',
          fontFamily: FONT.display,
          fontWeight: 700,
          fontSize: 146,
          lineHeight: '150px',
          color: C.ivory,
          letterSpacing: '-0.005em',
          transform: `translateY(${k(f, [84, 100], [6, 0], E.out)}px)`,
          textShadow: '0 10px 50px rgba(0,0,0,0.8)',
        }}
      >
        ХУДШАЯ ВЕСНА
        <br />
        ДЛЯ ТРЕЙДЕРОВ
      </div>
      <div
        style={{
          position: 'absolute',
          left: 960 - lineW / 2,
          top: TITLE_Y + 150 - 1,
          width: lineW,
          height: 2,
          background: C.ivory,
          opacity: lineO,
          boxShadow: `0 0 18px ${hexA(C.ivory, 0.5)}`,
        }}
      />
      <div style={{position: 'absolute', left: 0, right: 0, top: 730, opacity: 1 - k(f, [132, 138], [0, 1])}}>
        <Years text="2018" f={f} start={94} size={40} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 800,
          display: 'flex',
          justifyContent: 'center',
          gap: 46,
          fontFamily: FONT.mono,
          fontSize: 16,
          letterSpacing: '0.16em',
          color: C.muted,
          opacity: k(f, [100, 112], [0, 0.9]) * (1 - k(f, [132, 138], [0, 1])),
        }}
      >
        <span>
          <span style={{color: C.ivory}}>29.03</span> · CS:GO — 7-ДНЕВНЫЙ ТРЕЙДЛОК
        </span>
        <span>
          <span style={{color: C.ivory}}>03.05</span> · PUBG — ОТКЛЮЧЕНИЕ ЛИЧНЫХ ОБМЕНОВ
        </span>
      </div>
      <div style={{position: 'absolute', left: (1920 - 1040) / 2, top: 900, opacity: 1 - k(f, [132, 138], [0, 1])}}>
        <Chronology from={2018} to={2018} f={f} start={100} />
      </div>

      <Finish vignette={0.8} grain={0.08} />
      <AbsoluteFill style={{background: C.black, opacity: k(f, [146, 149], [0, 1])}} />
    </AbsoluteFill>
  );
};
