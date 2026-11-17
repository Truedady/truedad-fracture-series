import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Dust, hexA} from '../components/Atmosphere';
import {LabeledCase} from '../components/Items2';
import {Shell} from '../components/Shell';
import {Ev, TitleBlock} from '../components/TitleBlock';
import {C, FONT} from '../lib/theme';
import {E, k} from '../lib/anim';

/*
 * ГЛАВА 08 · ИНВЕСТИЦИОННЫЙ БУМ · 2019–2023
 * Три стопки кейсов — Glove, «Прорыв», Gamma 2 — растут вверх, камера
 * поднимается вслед за ними к тёплому свету. Под каждой стопкой — рост
 * из сценария (январь 2019 → 2021, архив курса). Высота стопок символическая.
 *
 * 0–58    кейсы падают в стопки, камера поднимается, множители считаются
 * 58–72   сцена гаснет, титр поднимается из-под маски
 * 112+    камера продолжает подъём, затемнение
 */
export const CH08_DURATION = 135;

const COLS = [
  {name: 'GLOVE CASE', mult: 800, approx: '', accent: '#D9A93D', n: 8, x: 560, from: '≈0,25 ₽', to: '≈200 ₽', when: '01.2019 → 06.2021'},
  {name: 'ОПЕРАЦИЯ «ПРОРЫВ»', mult: 150, approx: 'почти ', accent: '#4B8BFF', n: 6, x: 960, from: '≈1,5 ₽', to: '≈220 ₽', when: '01.2019 → 06.2021'},
  {name: 'GAMMA 2', mult: 190, approx: 'почти ', accent: '#3FB37F', n: 7, x: 1360, from: '≈0,25 ₽', to: '≈47 ₽', when: '01.2019 → 09.2021'},
];
const CASE_W = 200;
const STEP = 70;
const FLOOR = 760;

export const Ch08InvestBoom: React.FC = () => {
  const f = useCurrentFrame();
  const rise = k(f, [8, 62], [0, 1], E.inOut);
  const camY = -rise * 40 + k(f, [112, 134], [0, 600], E.in);
  const dim = k(f, [58, 72], [1, 0.42]);
  const blur = k(f, [58, 74], [0, 6], E.inOut);
  const light = k(f, [10, 60], [0.06, 0.2]);

  return (
    <Shell glow={C.goldHi} glowOpacity={light} glowY={8} base="#0D0C0A">
      <AbsoluteFill style={{filter: `blur(${blur}px) brightness(${dim})`}}>
        <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: `translateY(${camY}px)`}}>
          {COLS.map((col, ci) => (
            <React.Fragment key={ci}>
              {Array.from({length: col.n}, (_, i) => {
                const t0 = 6 + ci * 3 + i * 5;
                const p = k(f, [t0, t0 + 8], [0, 1], E.out);
                const y = FLOOR - i * STEP;
                const jitter = ((i * 37 + ci * 13) % 11) - 5;
                return (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      left: col.x - CASE_W / 2 + jitter,
                      top: y - (1 - p) * 260,
                      opacity: p,
                      transform: `rotate(${jitter * 0.6}deg)`,
                      filter: `drop-shadow(0 10px 14px rgba(0,0,0,0.6)) brightness(${0.75 + (i / col.n) * 0.35})`,
                      zIndex: i,
                    }}
                  >
                    <LabeledCase size={CASE_W} accent={col.accent} label={`${ci}`} />
                  </div>
                );
              })}
              {/* подпись под стопкой */}
              <div style={{position: 'absolute', left: col.x - 220, width: 440, top: FLOOR + 160, textAlign: 'center', opacity: k(f, [10 + ci * 3, 20 + ci * 3], [0, 1]) * k(f, [58, 66], [1, 0])}}>
                <div style={{fontFamily: FONT.mono, fontSize: 18, letterSpacing: '0.22em', color: C.ivory}}>{col.name}</div>
                <div style={{fontFamily: FONT.mono, fontSize: 15, letterSpacing: '0.12em', color: C.muted, marginTop: 10}}>
                  {col.from} → {col.to}
                </div>
                <div style={{fontFamily: FONT.mono, fontSize: 13, letterSpacing: '0.12em', color: C.dim, marginTop: 6}}>{col.when}</div>
              </div>
              {/* множитель над стопкой */}
              <div
                style={{
                  position: 'absolute',
                  left: col.x - 200,
                  width: 400,
                  top: FLOOR - col.n * STEP - 30,
                  textAlign: 'center',
                  fontFamily: FONT.mono,
                  fontWeight: 700,
                  fontSize: 46,
                  color: C.green,
                  opacity: k(f, [30 + ci * 4, 38 + ci * 4], [0, 1]),
                  textShadow: `0 0 30px ${hexA(C.green, 0.35)}`,
                }}
              >
                <span style={{fontSize: 18, color: C.muted, fontWeight: 500, marginRight: 8}}>{col.approx}</span>×{Math.round(col.mult * k(f, [30 + ci * 4, 56], [0, 1], E.out))}
              </div>
            </React.Fragment>
          ))}
        </div>
        <div style={{position: 'absolute', left: 200, top: 120, fontFamily: FONT.mono, opacity: k(f, [6, 16], [0, 1])}}>
          <div style={{fontSize: 13, letterSpacing: '0.3em', color: C.dim}}>ИСТОРИЧЕСКИЕ ЦЕНЫ · АРХИВ КУРСА</div>
          <div style={{fontSize: 13, letterSpacing: '0.2em', color: C.dim, marginTop: 8}}>ВЫСОТА СТОПОК — СИМВОЛИЧЕСКАЯ</div>
        </div>
      </AbsoluteFill>

      <Dust seed="d08" count={60} color={C.goldHi} opacity={0.7} camY={camY * 0.5} />

      <TitleBlock
        f={f}
        num="08"
        lines={['ИНВЕСТИЦИОННЫЙ БУМ']}
        years="2019 — 2023"
        from={2019}
        to={2023}
        start={66}
        exitStart={112}
        exit="lift"
        variant="riseMask"
        size={124}
        sub={
          <>
            <Ev>GLOVE · «ПРОРЫВ» · GAMMA 2</Ev>
            <Ev d="2023">ВОЛНА ОЖИДАНИЙ CS2</Ev>
          </>
        }
      />
    </Shell>
  );
};
