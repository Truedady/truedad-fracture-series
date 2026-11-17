import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C} from '../lib/theme';
import {rnd} from '../lib/anim';

const noise = (seed: number) =>
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' seed='${seed}' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`,
  );

/** Фон: глубокий графит + мягкое пятно света. */
export const Backdrop: React.FC<{glow?: string; glowOpacity?: number; glowX?: number; glowY?: number; base?: string}> = ({
  glow = C.gold,
  glowOpacity = 0.1,
  glowX = 50,
  glowY = 45,
  base = C.bg,
}) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse 70% 60% at ${glowX}% ${glowY}%, ${hexA(glow, glowOpacity)} 0%, transparent 70%), radial-gradient(ellipse 120% 90% at 50% 50%, ${base} 0%, ${C.black} 100%)`,
    }}
  />
);

/** Финишный слой: виньетка + плёночное зерно. Кладётся поверх всего. */
export const Finish: React.FC<{vignette?: number; grain?: number}> = ({vignette = 0.75, grain = 0.07}) => {
  const f = useCurrentFrame();
  const seed = f % 7;
  const ox = Math.floor(rnd(`gx${f}`) * 300);
  const oy = Math.floor(rnd(`gy${f}`) * 300);
  return (
    <>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 85% 75% at 50% 50%, transparent 45%, rgba(0,0,0,${vignette}) 100%)`,
          pointerEvents: 'none',
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `url("${noise(seed)}")`,
          backgroundPosition: `${ox}px ${oy}px`,
          opacity: grain,
          mixBlendMode: 'overlay',
        }}
      />
    </>
  );
};

export const hexA = (hex: string, a: number) => {
  const h = hex.replace('#', '');
  const n = parseInt(h, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};

/** Пылинки в воздухе с параллаксом. camX/camY — смещение камеры (px), глубина умножает его. */
export const Dust: React.FC<{count?: number; seed?: string; camX?: number; camY?: number; color?: string; opacity?: number; speed?: number}> = ({
  count = 70,
  seed = 'dust',
  camX = 0,
  camY = 0,
  color = C.goldHi,
  opacity = 1,
  speed = 1,
}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{opacity, pointerEvents: 'none'}}>
      {Array.from({length: count}, (_, i) => {
        const z = rnd(`${seed}z${i}`); // 0 — далеко, 1 — близко
        const size = 1.2 + z * z * 7;
        const x0 = rnd(`${seed}x${i}`) * 2200 - 140;
        const y0 = rnd(`${seed}y${i}`) * 1300 - 110;
        const vx = (rnd(`${seed}vx${i}`) - 0.5) * 0.6 * speed;
        const vy = (-0.15 - rnd(`${seed}vy${i}`) * 0.35) * speed;
        const x = x0 + vx * f * (0.5 + z) + camX * (0.2 + z * 1.3);
        const y = y0 + vy * f * (0.5 + z) + camY * (0.2 + z * 1.3);
        const tw = 0.55 + 0.45 * Math.sin(f * 0.12 + i * 1.7);
        const a = (0.12 + z * 0.4) * tw;
        const blur = z > 0.78 ? (z - 0.78) * 22 : 0;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${hexA(color, a)} 0%, ${hexA(color, 0)} 70%)`,
              filter: blur ? `blur(${blur}px)` : undefined,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
