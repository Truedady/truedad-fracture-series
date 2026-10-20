import React from 'react';
import {Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {C} from '../brand/tokens';

/** The case render (transparent PNG cut-out) presented as a floating 2.5D hero. `aspect` = height / width of the PNG. */
export const CaseHero: React.FC<{src: string; width: number; aspect: number; t: number; sweep: number}> = ({src, width, aspect, t, sweep}) => {
  const frame = useCurrentFrame();
  const ry = -16 + 10 * t + Math.sin(frame / 22) * 2.5;
  const rx = 6 + Math.sin(frame / 31) * 1.5;
  const floatY = Math.sin(frame / 18) * 8;
  const h = width * aspect;
  const url = staticFile(src);
  const sx = interpolate(sweep, [0, 1], [-60, 160]);
  return (
    <div style={{position: 'relative', width, height: h + 120, perspective: 1600}}>
      <div
        style={{
          position: 'absolute',
          left: width * 0.1,
          right: width * 0.1,
          top: h + 40,
          height: 60,
          borderRadius: '50%',
          background: 'radial-gradient(closest-side, rgba(0,0,0,0.75), transparent)',
          transform: `scale(${0.9 + 0.1 * t - floatY / 200})`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: `-${width * 0.18}px`,
          background: `radial-gradient(closest-side, ${C.gold}33, transparent 70%)`,
          opacity: t,
        }}
      />
      <div style={{position: 'absolute', left: 0, top: 0, width, height: h, transform: `translateY(${floatY + (1 - t) * 120}px) rotateY(${ry}deg) rotateX(${rx}deg) scale(${0.86 + 0.14 * t})`, opacity: t}}>
        <Img src={url} style={{width, height: h, filter: 'drop-shadow(0 30px 40px rgba(0,0,0,0.6)) saturate(1.05)'}} />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(105deg, transparent ${sx}%, rgba(255,244,214,0.55) ${sx + 8}%, transparent ${sx + 16}%)`,
            WebkitMaskImage: `url(${url})`,
            maskImage: `url(${url})`,
            WebkitMaskSize: '100% 100%',
            maskSize: '100% 100%',
            mixBlendMode: 'screen',
          }}
        />
      </div>
    </div>
  );
};
