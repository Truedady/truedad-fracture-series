import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile} from 'remotion';
import {C, FONT} from './brand';
import {EASE, enter, useT} from './primitives';
import {SERIES} from './series';

export type DayOpeningProps = {
  day: number;
  /** When the first footage take starts (it focus-pulls in over the opening). */
  end: number;
  /** When «ДЕНЬ N / 30» appears — put it on the words about the month / the plan. */
  dayAt: number;
  /** Real pixels of the hero object with alpha (scripts/cutout_case.py). Default: the Fracture Case render. */
  image?: string;
  imageSize?: {w: number; h: number};
};

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/**
 * Opening graphic of every day: the case as a product shot (focus-in, light sweep, floor reflection),
 * «ЭКСПЕРИМЕНТ TRUEDAD / FRACTURE CASE», then «ДЕНЬ N / 30» with a 30-cell bar.
 * The object is already visible on frame 0 (thumbnail). Sound: boom at 0, shimmer at 0.55, soft tick at `dayAt`.
 */
export const DayOpening: React.FC<DayOpeningProps> = ({day, end, dayAt, image = 'brand/fracture-case.png', imageSize = {w: 922, h: 564}}) => {
  const t = useT();
  const src = staticFile(image);
  const inA = enter(t, -0.3, 1.0);
  const caseW = 880;
  const caseH = (caseW * imageSize.h) / imageSize.w;
  const float = Math.sin(t * 1.3) * 7;
  const scale = interpolate(t, [0, end], [1.1, 1.0], {...clamp, easing: EASE});
  const rot = interpolate(t, [0, end], [-7, 3], clamp);
  const sweep = interpolate(t, [0.55, 1.6], [-0.4, 1.4], {...clamp, easing: EASE});
  const kicker = enter(t, 0.25, 0.5);
  const title = enter(t, 0.45, 0.7);
  const dayIn = enter(t, dayAt, 0.6);
  const caseTop = 430;
  return (
    <AbsoluteFill style={{background: C.bg, overflow: 'hidden'}}>
      <AbsoluteFill style={{background: `radial-gradient(60% 34% at 50% 40%, rgba(217,169,61,${0.22 * inA}) 0%, rgba(217,169,61,0.05) 45%, transparent 75%)`}} />
      <AbsoluteFill style={{background: `conic-gradient(from 180deg at 50% -5%, transparent 165deg, rgba(244,241,233,${0.05 * inA}) 180deg, transparent 195deg)`}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: caseTop + caseH + 36, height: 2, background: `linear-gradient(90deg, transparent, rgba(217,169,61,${0.35 * inA}), transparent)`}} />

      <div style={{position: 'absolute', top: 168, left: 0, right: 0, textAlign: 'center'}}>
        <div style={{opacity: kicker, transform: `translateY(${(1 - kicker) * 12}px)`, fontFamily: FONT.mono, fontWeight: 700, fontSize: 26, letterSpacing: 6, color: C.gold}}>{SERIES.kicker}</div>
        <div style={{overflow: 'hidden', marginTop: 10}}>
          <div style={{transform: `translateY(${(1 - title) * 105}%)`, fontFamily: FONT.sans, fontWeight: 900, fontSize: 104, letterSpacing: -2, lineHeight: 1.02, color: C.white}}>{SERIES.title}</div>
        </div>
      </div>

      <div style={{position: 'absolute', left: (1080 - caseW) / 2, top: caseTop, width: caseW, height: caseH, perspective: 1600}}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: inA,
            filter: `blur(${(1 - inA) * 14}px) drop-shadow(0 40px 60px rgba(0,0,0,0.6))`,
            transform: `translateY(${float}px) scale(${scale}) rotateY(${rot}deg)`,
          }}
        >
          <Img src={src} style={{width: '100%', height: '100%'}} />
          {/* light sweep, masked to the object */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              WebkitMaskImage: `url(${src})`,
              WebkitMaskSize: '100% 100%',
              maskImage: `url(${src})`,
              maskSize: '100% 100%',
              background: `linear-gradient(105deg, transparent ${sweep * 100 - 18}%, rgba(255,247,220,0.55) ${sweep * 100}%, transparent ${sweep * 100 + 18}%)`,
              mixBlendMode: 'screen',
            }}
          />
        </div>
        {/* soft reflection on the floor */}
        <div style={{position: 'absolute', left: 0, top: caseH + 40, width: caseW, height: caseH * 0.45, overflow: 'hidden', opacity: 0.22 * inA, WebkitMaskImage: 'linear-gradient(to bottom, #000, transparent 80%)', maskImage: 'linear-gradient(to bottom, #000, transparent 80%)'}}>
          <Img src={src} style={{width: caseW, height: caseH, transform: `scaleY(-1) translateY(${-float}px) scale(${scale})`, filter: 'blur(3px)'}} />
        </div>
      </div>

      <div style={{position: 'absolute', top: 1160, left: 0, right: 0, textAlign: 'center', opacity: dayIn, transform: `translateY(${(1 - dayIn) * 18}px)`}}>
        <div style={{fontFamily: FONT.sans, fontWeight: 900, fontSize: 132, letterSpacing: -3, lineHeight: 1, color: C.white}}>
          ДЕНЬ {day}
          <span style={{fontSize: 60, color: C.muted, letterSpacing: -1}}> / {SERIES.totalDays}</span>
        </div>
        <div style={{display: 'flex', justifyContent: 'center', gap: 8, marginTop: 30}}>
          {Array.from({length: SERIES.totalDays}, (_, i) => {
            const k = enter(t, dayAt + 0.2 + i * 0.025, 0.3);
            return <div key={i} style={{width: 18, height: 10, borderRadius: 3, background: i < day ? C.gold : 'rgba(244,241,233,0.14)', opacity: k, transform: `scaleY(${0.4 + 0.6 * k})`}} />;
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
