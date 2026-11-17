import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Dust, hexA} from '../components/Atmosphere';
import {Chip, Shell} from '../components/Shell';
import {KNIVES, rarityColor, Skin, SKIN_KEYS, SkinKey, WEAPONS} from '../components/Skins';
import {Ev, TitleBlock} from '../components/TitleBlock';
import {C, FONT} from '../lib/theme';
import {drift, E, k, lerp, rnd} from '../lib/anim';

/*
 * ГЛАВА 04 · СТОРОННИЕ МАРКЕТЫ, РУЛЕТКИ И БОТЫ · 2013–2017
 * Окна площадок наслаиваются одно на другое, бот-сканер прочёсывает лоты и
 * забирает выгодные быстрее человека. Затем — лента рулетки, которая
 * разгоняется и замедляется точно под указателем. Титр «печатается», как в терминале.
 *
 * 0–46    каскад окон-маркетов, сканер, «КУПЛЕНО»
 * 40–88   лента рулетки: разгон → торможение → выигрыш
 * 90–128  титр (печать), удержание
 * 128+    полёт вперёд, затемнение
 */
export const CH04_DURATION = 150;

const WINDOWS = [
  {x: 250, y: 150, t: 2, label: 'МАРКЕТ', r: -6},
  {x: 1040, y: 110, t: 8, label: 'ОБМЕННИК', r: 5},
  {x: 600, y: 420, t: 14, label: 'БОТ-СКАНЕР', r: -2},
  {x: 130, y: 560, t: 20, label: 'МАРКЕТ', r: 4},
  {x: 1180, y: 520, t: 26, label: 'АВТООБМЕН', r: -5},
];
const WW = 600;
const ROWS = 5;

const Window: React.FC<{f: number; i: number}> = ({f, i}) => {
  const w = WINDOWS[i];
  const o = k(f, [w.t, w.t + 6], [0, 1], E.out);
  const scan = ((f - w.t) * 0.22) % ROWS;
  const hit = Math.floor(rnd(`hit${i}`) * ROWS);
  const hitOn = f > w.t + 6 + hit * 4.5;
  return (
    <div
      style={{
        position: 'absolute',
        left: w.x,
        top: w.y,
        width: WW,
        opacity: o,
        transform: `perspective(1600px) rotateY(${w.r}deg) translateZ(${(1 - o) * -200}px) scale(${lerp(0.94, 1, o)})`,
        background: 'linear-gradient(180deg, #171C24, #11151B)',
        border: `1px solid ${C.line}`,
        borderRadius: 8,
        boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
        overflow: 'hidden',
      }}
    >
      <div style={{height: 40, display: 'flex', alignItems: 'center', gap: 8, padding: '0 14px', borderBottom: `1px solid ${C.line}`}}>
        {[0, 1, 2].map((d) => (
          <div key={d} style={{width: 10, height: 10, borderRadius: 5, background: '#2E3642'}} />
        ))}
        <div style={{marginLeft: 12, flex: 1, height: 20, borderRadius: 4, background: '#0C0F14', display: 'flex', alignItems: 'center', padding: '0 10px'}}>
          <span style={{fontFamily: FONT.mono, fontSize: 12, letterSpacing: '0.2em', color: C.dim}}>{w.label}</span>
        </div>
      </div>
      <div style={{position: 'relative', padding: '8px 14px'}}>
        {Array.from({length: ROWS}, (_, r) => {
          const key = WEAPONS[Math.floor(rnd(`w${i}r${r}`) * WEAPONS.length)];
          const isHit = r === hit && hitOn;
          return (
            <div
              key={r}
              style={{
                height: 56,
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                borderBottom: `1px solid ${hexA(C.line, 0.6)}`,
                background: isHit ? hexA(C.gold, 0.12) : 'transparent',
              }}
            >
              <Skin k={key} w={120} h={42} />
              <div style={{flex: 1}}>
                <div style={{width: `${50 + rnd(`a${i}${r}`) * 40}%`, height: 8, borderRadius: 4, background: '#2A323E'}} />
                <div style={{width: `${30 + rnd(`b${i}${r}`) * 30}%`, height: 6, borderRadius: 3, background: '#1F262F', marginTop: 8}} />
              </div>
              {isHit ? (
                <div style={{fontFamily: FONT.mono, fontSize: 12, letterSpacing: '0.16em', color: C.bg, background: C.gold, padding: '4px 8px', borderRadius: 3}}>КУПЛЕНО</div>
              ) : (
                <div style={{width: 64, height: 10, borderRadius: 4, background: '#2A323E'}} />
              )}
            </div>
          );
        })}
        {/* линия бота-сканера */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 8 + scan * 56,
            height: 2,
            background: C.gold,
            boxShadow: `0 0 16px ${hexA(C.gold, 0.8)}`,
            opacity: f > w.t + 4 ? 0.85 : 0,
          }}
        />
      </div>
    </div>
  );
};

// лента рулетки
const CARD = 210;
const STRIP: SkinKey[] = Array.from({length: 40}, (_, i) => {
  if (i === 30) return 'karambitTiger';
  const pool = rnd(`sp${i}`) < 0.12 ? KNIVES : WEAPONS;
  return pool[Math.floor(rnd(`s${i}`) * pool.length)];
});
const WIN = 30;

export const Ch04MarketsBots: React.FC = () => {
  const f = useCurrentFrame();
  const d = drift(f, 4.2, 5);
  const winOut = k(f, [40, 58], [0, 1], E.inOut);

  // позиция ленты: от правого края к выигрышной карточке под указателем
  const t = k(f, [42, 88], [0, 1]);
  const ease = 1 - Math.pow(1 - t, 3.2);
  const endOff = 960 - (WIN * CARD + CARD / 2);
  const startOff = endOff + 5200;
  const off = lerp(startOff, endOff, ease);
  const vel = Math.abs(lerp(startOff, endOff, 1 - Math.pow(1 - k(f - 1, [42, 88], [0, 1]), 3.2)) - off);
  const stripIn = k(f, [40, 50], [0, 1], E.out);
  const stripOut = k(f, [90, 104], [0, 1], E.inOut);
  const won = k(f, [88, 94], [0, 1], E.out);
  const ex = k(f, [128, 148], [0, 1], E.in);

  return (
    <Shell glowOpacity={0.07} glowY={50} fadeOut={8}>
      {/* окна площадок */}
      <AbsoluteFill
        style={{
          transform: `translate(${d.x}px, ${d.y}px) scale(${1 + k(f, [0, 60], [0, 0.07]) + winOut * 0.1})`,
          filter: `blur(${winOut * 9}px) brightness(${1 - winOut * 0.55})`,
          opacity: 1 - k(f, [96, 112], [0, 0.7]),
        }}
      >
        {WINDOWS.map((_, i) => (
          <Window key={i} f={f} i={i} />
        ))}
      </AbsoluteFill>

      <Dust seed="d04" count={40} opacity={0.5} speed={1 + ex * 6} camX={-ex * 300} />

      {/* рулетка */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 540 - 95 + stripOut * 330, height: 190, opacity: stripIn * (1 - stripOut * 0.85), filter: `blur(${stripOut * 6}px)`}}>
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(5,6,8,0.95), rgba(14,17,22,0.75) 30%, rgba(14,17,22,0.75) 70%, rgba(5,6,8,0.95))', borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}`}} />
        {STRIP.map((key, i) => {
          const x = off + i * CARD;
          if (x < -CARD * 2 || x > 1920 + CARD) return null;
          const isWin = i === WIN && f >= 88;
          const ghosts = vel > 6 ? [1, 2] : [];
          const card = (gx: number, o: number, kk: string) => (
            <div
              key={kk}
              style={{
                position: 'absolute',
                left: gx + 6,
                top: 14,
                width: CARD - 12,
                height: 162,
                opacity: o,
                background: '#141920',
                border: `1px solid ${isWin ? C.gold : '#232A34'}`,
                borderRadius: 6,
                transform: isWin ? `scale(${1 + won * 0.08})` : undefined,
                boxShadow: isWin ? `0 0 ${40 * won}px ${hexA(C.gold, 0.5)}` : undefined,
                overflow: 'hidden',
              }}
            >
              <Skin k={key} w={CARD - 24} h={120} style={{margin: '14px 6px 0'}} />
              <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 5, background: rarityColor(key)}} />
            </div>
          );
          return (
            <React.Fragment key={i}>
              {ghosts.map((g) => card(x + g * vel * 0.35, 0.18 / g, `g${i}${g}`))}
              {card(x, 1, `c${i}`)}
            </React.Fragment>
          );
        })}
        {/* указатель */}
        <div style={{position: 'absolute', left: 959, top: -10, width: 2, height: 210, background: C.gold, boxShadow: `0 0 18px ${hexA(C.gold, 0.9)}`}} />
        <div style={{position: 'absolute', left: 950, top: -14, width: 0, height: 0, borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderTop: `14px solid ${C.gold}`}} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 300, display: 'flex', justifyContent: 'center', opacity: stripIn * (1 - stripOut)}}>
        <Chip color={hexA(C.gold, 0.6)}>
          РУЛЕТКИ И ДЖЕКПОТЫ НА СКИНЫ <span style={{color: C.gold}}>2015–2016</span>
        </Chip>
      </div>

      <TitleBlock
        f={f}
        num="04"
        lines={['СТОРОННИЕ МАРКЕТЫ,', 'РУЛЕТКИ И БОТЫ']}
        years="2013 — 2017"
        from={2013}
        to={2017}
        start={94}
        exitStart={128}
        variant="type"
        size={124}
        sub={
          <>
            <Ev>ОБМЕННИКИ · ПАРСЕРЫ · ТРЕЙД-БОТЫ</Ev>
            <Ev d="07.2016">СКАНДАЛ СО СКИН-ГЕМБЛИНГОМ</Ev>
          </>
        }
      />
    </Shell>
  );
};
