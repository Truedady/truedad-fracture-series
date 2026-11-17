import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Dust, hexA} from '../components/Atmosphere';
import {Capsule, Sticker} from '../components/Items2';
import {Chip, Shell} from '../components/Shell';
import {Ev, TitleBlock} from '../components/TitleBlock';
import {C} from '../lib/theme';
import {E, k, lerp, rnd} from '../lib/anim';

/*
 * ГЛАВА 09 · НАКЛЕЙКИ RMR И STOCKHOLM · 2021–2022
 * Капсула раскрывается, и из неё вылетают наклейки — сначала по одной,
 * потом всё быстрее, пока они не заполняют весь кадр плотной стеной.
 * Визуальная отсылка к огромному предложению обычных наклеек.
 * Эмблемы — абстрактные, не логотипы реальных команд.
 *
 * 0–24    капсула, лёгкая вибрация, крышка открывается
 * 18–74   наклейки разлетаются и заполняют кадр (обычные / голо / золотые)
 * 66–82   стена уходит в тень, титр на тёмной плашке
 * 114+    наклейки разлетаются мимо камеры, затемнение
 */
export const CH09_DURATION = 135;

const GX = 17;
const GY = 10;
const SP = 118;
const CX = 960;
const CY = 520;
const SLOTS = (() => {
  const arr: {x: number; y: number; d: number; i: number}[] = [];
  for (let r = 0; r < GY; r++)
    for (let c = 0; c < GX; c++) {
      const x = CX + (c - (GX - 1) / 2) * SP + (r % 2) * (SP / 2) - SP / 4;
      const y = CY + (r - (GY - 1) / 2) * SP * 0.92;
      arr.push({x, y, d: Math.hypot(x - CX, (y - CY) * 1.4) + rnd(`j${r}${c}`) * 120, i: arr.length});
    }
  return arr.sort((a, b) => a.d - b.d);
})();

export const Ch09Stickers: React.FC = () => {
  const f = useCurrentFrame();
  const open = k(f, [16, 24], [0, 1], E.out);
  const shakeX = f < 16 ? Math.sin(f * 2.3) * k(f, [4, 15], [0, 4]) : 0;
  const capOut = k(f, [24, 40], [0, 1], E.inOut);
  const dim = k(f, [66, 80], [1, 0.3]);
  const blur = k(f, [66, 82], [0, 4], E.inOut);
  const ex = k(f, [114, 134], [0, 1], E.in);

  return (
    <Shell glowOpacity={0.08} glowY={48}>
      <AbsoluteFill style={{filter: `blur(${blur + ex * 6}px) brightness(${dim})`}}>
        {SLOTS.map((s, n) => {
          const t0 = 18 + Math.pow(n / SLOTS.length, 0.8) * 52;
          const p = k(f, [t0, t0 + 10], [0, 1], E.out);
          if (p <= 0) return null;
          const r = rnd(`k${s.i}`);
          const kind = r < 0.07 ? 'gold' : r < 0.16 ? 'holo' : 'paper';
          const hue = Math.floor(rnd(`h${s.i}`) * 360);
          const rot = (rnd(`r${s.i}`) - 0.5) * 40;
          const size = 104 + rnd(`s${s.i}`) * 10;
          const x = lerp(CX, s.x, p) + (s.x - CX) * ex * 1.6;
          const y = lerp(CY, s.y, p) + (s.y - CY) * ex * 1.6;
          return (
            <div
              key={s.i}
              style={{
                position: 'absolute',
                left: x - size / 2,
                top: y - size / 2,
                transform: `rotate(${rot * p + (1 - p) * 180}deg) scale(${lerp(0.25, 1, p) * (1 + ex * 1.2)})`,
                opacity: kind === 'paper' ? 0.82 : 1,
                filter: kind !== 'paper' ? `drop-shadow(0 0 10px ${hexA(kind === 'gold' ? C.gold : '#B57CFF', 0.35)})` : undefined,
              }}
            >
              <Sticker size={size} kind={kind} seed={s.i % 5} hue={hue} shift={Math.sin(f * 0.08 + s.i) * 0.5 + 0.5} />
            </div>
          );
        })}
        {/* капсула */}
        <div
          style={{
            position: 'absolute',
            left: CX - 110 + shakeX,
            top: CY - 150,
            transform: `scale(${1 - capOut * 0.4})`,
            opacity: 1 - capOut,
            filter: `drop-shadow(0 30px 40px rgba(0,0,0,0.7)) drop-shadow(0 0 ${open * 40}px ${hexA(C.gold, 0.4)})`,
          }}
        >
          <Capsule size={220} open={open} />
        </div>
      </AbsoluteFill>

      <div style={{position: 'absolute', left: 200, top: 110, opacity: k(f, [26, 32], [0, 1]) * k(f, [64, 72], [1, 0])}}>
        <Chip color={hexA(C.gold, 0.6)}>
          <span style={{color: C.gold}}>27.01.2021</span> КАПСУЛЫ RMR 2020
        </Chip>
      </div>
      <div style={{position: 'absolute', right: 200, top: 110, opacity: k(f, [42, 48], [0, 1]) * k(f, [64, 72], [1, 0])}}>
        <Chip color={hexA(C.gold, 0.6)}>
          <span style={{color: C.gold}}>21.10.2021</span> STOCKHOLM 2021
        </Chip>
      </div>

      <Dust seed="d09" count={40} opacity={0.5} speed={1 + ex * 5} />

      <TitleBlock
        f={f}
        num="09"
        lines={['НАКЛЕЙКИ RMR', 'И STOCKHOLM']}
        years="2021 — 2022"
        from={2021}
        to={2022}
        start={72}
        exitStart={114}
        variant="bar"
        size={136}
        sub={
          <>
            <Ev>ТУРНИРНЫЕ КАПСУЛЫ · ГОЛО И ЗОЛОТЫЕ НАКЛЕЙКИ</Ev>
            <Ev>ОГРОМНОЕ ПРЕДЛОЖЕНИЕ</Ev>
          </>
        }
      />
    </Shell>
  );
};
