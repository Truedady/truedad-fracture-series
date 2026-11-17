import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from '../lib/theme';
import {E, k} from '../lib/anim';
import {Backdrop, Finish} from './Atmosphere';

/** Общая «рамка» главы: фон, финишное зерно/виньетка, проявление из чёрного и уход в чёрный. */
export const Shell: React.FC<{
  children: React.ReactNode;
  glow?: string;
  glowOpacity?: number;
  glowY?: number;
  base?: string;
  fadeIn?: number;
  fadeOut?: number; // сколько кадров в конце уходить в чёрный
  grain?: number;
  vignette?: number;
}> = ({children, glow = C.gold, glowOpacity = 0.09, glowY = 46, base = C.bg, fadeIn = 8, fadeOut = 8, grain = 0.075, vignette = 0.78}) => {
  const f = useCurrentFrame();
  const {durationInFrames: d} = useVideoConfig();
  return (
    <AbsoluteFill style={{background: C.black, overflow: 'hidden'}}>
      <Backdrop glow={glow} glowOpacity={glowOpacity} glowY={glowY} base={base} />
      {children}
      <Finish vignette={vignette} grain={grain} />
      <AbsoluteFill style={{background: C.black, opacity: k(f, [0, fadeIn], [1, 0]) + k(f, [d - fadeOut, d - 1], [0, 1], E.in)}} />
    </AbsoluteFill>
  );
};

/** Обёртка для 3D-сцены с перспективой. */
export const Stage3D: React.FC<{children: React.ReactNode; perspective?: number; origin?: string; style?: React.CSSProperties; camera: string; top?: string}> = ({
  children,
  perspective = 1500,
  origin = '50% 45%',
  style,
  camera,
  top = '50%',
}) => (
  <AbsoluteFill style={{perspective, perspectiveOrigin: origin, ...style}}>
    <div style={{position: 'absolute', left: '50%', top, transformStyle: 'preserve-3d', transform: camera}}>{children}</div>
  </AbsoluteFill>
);

/** Абсолютно спозиционированный центрированный элемент в 3D-пространстве. */
export const At: React.FC<{x?: number; y?: number; z?: number; w: number; h: number; rx?: number; ry?: number; rz?: number; s?: number; children: React.ReactNode; style?: React.CSSProperties; preserve?: boolean}> = ({
  x = 0,
  y = 0,
  z = 0,
  w,
  h,
  rx = 0,
  ry = 0,
  rz = 0,
  s = 1,
  children,
  style,
  preserve,
}) => (
  <div
    style={{
      position: 'absolute',
      left: -w / 2,
      top: -h / 2,
      width: w,
      height: h,
      transformStyle: preserve ? 'preserve-3d' : undefined,
      transform: `translate3d(${x}px, ${y}px, ${z}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${s})`,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Небольшая моно-метка-«чип» интерфейса. */
export const Chip: React.FC<{children: React.ReactNode; color?: string; style?: React.CSSProperties}> = ({children, color = C.gold, style}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      padding: '8px 16px',
      border: `1px solid ${color}`,
      borderRadius: 4,
      background: 'rgba(10,12,16,0.7)',
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: 16,
      fontWeight: 500,
      letterSpacing: '0.12em',
      color: C.ivory,
      whiteSpace: 'nowrap',
      ...style,
    }}
  >
    {children}
  </div>
);
