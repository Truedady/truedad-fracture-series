import React from 'react';
import {Img, staticFile, useCurrentFrame} from 'remotion';
import {hexA} from './Atmosphere';
import {C, FONT} from '../lib/theme';
import {E, k, lerp} from '../lib/anim';

/*
 * «Живой» скриншот статьи: камера по ключевым точкам (в пикселях скрина),
 * золотой маркер по нужным фразам и мягкое затемнение всего, кроме фокуса.
 */
export type Cam = {t: number; x: number; y: number; z: number}; // t — сек от начала плана, x/y — центр кадра в координатах скрина
export type Mark = {t: number; x: number; y: number; w: number; h: number; spot?: boolean};

const FPS = 30;

const camAt = (cams: Cam[], sec: number) => {
  if (sec <= cams[0].t) return cams[0];
  for (let i = 0; i < cams.length - 1; i++) {
    const a = cams[i];
    const b = cams[i + 1];
    if (sec <= b.t) {
      const p = E.inOut((sec - a.t) / (b.t - a.t));
      return {t: sec, x: lerp(a.x, b.x, p), y: lerp(a.y, b.y, p), z: lerp(a.z, b.z, p)};
    }
  }
  return cams[cams.length - 1];
};

export const ArticleShot: React.FC<{src: string; w: number; h: number; cams: Cam[]; marks?: Mark[]; source: string; tilt?: number}> = ({
  src,
  w,
  h,
  cams,
  marks = [],
  source,
  tilt = 0,
}) => {
  const f = useCurrentFrame();
  const sec = f / FPS;
  const c = camAt(cams, sec);
  // текущий «прожектор» — последний начавшийся маркер со spot
  const spots = marks.filter((m) => m.spot && sec >= m.t);
  const spot = spots[spots.length - 1];
  const spotO = spot ? k(sec, [spot.t, spot.t + 0.4], [0, 1]) : 0;

  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden', perspective: 2400}}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: w,
          height: h,
          transformOrigin: '0 0',
          transform: `translate(${960 - c.x * c.z}px, ${540 - c.y * c.z}px) scale(${c.z}) rotateX(${tilt}deg)`,
          boxShadow: '0 60px 160px rgba(0,0,0,0.7)',
        }}
      >
        <Img src={staticFile(src)} style={{width: w, height: h, display: 'block'}} />
        {marks.map((m, i) => {
          const p = k(sec, [m.t, m.t + 0.55], [0, 1], E.out);
          return p > 0 ? (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: m.x - 6,
                top: m.y - 4,
                width: (m.w + 12) * p,
                height: m.h + 8,
                background: hexA(C.gold, 0.22),
                borderBottom: `3px solid ${C.gold}`,
                borderRadius: 3,
                mixBlendMode: 'screen',
              }}
            />
          ) : null;
        })}
      </div>
      {spot && (() => {
        // прожектор в экранных координатах: четыре тёмные панели вокруг фокуса (дёшево для рендера)
        const L = 960 + (spot.x - 18 - c.x) * c.z;
        const T = 540 + (spot.y - 14 - c.y) * c.z;
        const R = L + (spot.w + 36) * c.z;
        const B = T + (spot.h + 28) * c.z;
        const shade = `rgba(5,6,8,${0.55 * spotO})`;
        const box = (st: React.CSSProperties) => <div style={{position: 'absolute', background: shade, ...st}} />;
        return (
          <>
            {box({left: 0, top: 0, right: 0, height: Math.max(0, T)})}
            {box({left: 0, top: B, right: 0, bottom: 0})}
            {box({left: 0, top: T, width: Math.max(0, L), height: Math.max(0, B - T)})}
            {box({left: R, top: T, right: 0, height: Math.max(0, B - T)})}
          </>
        );
      })()}
      <div
        style={{
          position: 'absolute',
          left: 60,
          bottom: 44,
          padding: '8px 14px',
          background: 'rgba(5,6,8,0.75)',
          borderRadius: 4,
          fontFamily: FONT.mono,
          fontSize: 16,
          letterSpacing: '0.08em',
          color: C.muted,
          opacity: k(f, [10, 22], [0, 1]),
        }}
      >
        ИСТОЧНИК: <span style={{color: C.ivory}}>{source}</span>
      </div>
    </div>
  );
};
