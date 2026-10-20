import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {EASE_IN, EASE_OUT, fmtInt, prog} from '../lib/anim';
import {C, F, SAFE} from './tokens';

/** Graphite canvas: soft key light, perspective grid floor and drifting dust. */
export const Backdrop: React.FC<{glow?: string; glowY?: number; grid?: number}> = ({glow = C.gold, glowY = 0.42, grid = 1}) => {
  const frame = useCurrentFrame();
  const drift = (frame * 0.9) % 90;
  return (
    <AbsoluteFill style={{background: C.canvas, overflow: 'hidden'}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(1200px 900px at 50% ${glowY * 100}%, ${glow}14 0%, transparent 60%), radial-gradient(900px 700px at 85% 8%, #2B344055 0%, transparent 70%)`,
        }}
      />
      <div style={{position: 'absolute', left: -600, right: -600, top: 1050, height: 870, perspective: 900, opacity: 0.55 * grid, overflow: 'hidden'}}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: 'rotateX(74deg)',
            transformOrigin: '50% 0%',
            backgroundImage: `linear-gradient(${C.border} 1.5px, transparent 1.5px), linear-gradient(90deg, ${C.border} 1.5px, transparent 1.5px)`,
            backgroundSize: '90px 90px',
            backgroundPosition: `0 ${drift}px`,
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 25%, black 60%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 25%, black 60%, transparent 100%)',
          }}
        />
      </div>
      <Dust />
    </AbsoluteFill>
  );
};

const Dust: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  return (
    <AbsoluteFill>
      {new Array(26).fill(0).map((_, i) => {
        const x = random(`dx${i}`) * width;
        const y = (random(`dy${i}`) * height - frame * (0.25 + random(`ds${i}`) * 0.5) + height) % height;
        const s = 1.5 + random(`dz${i}`) * 2.5;
        return (
          <div
            key={i}
            style={{position: 'absolute', left: x, top: y, width: s, height: s, borderRadius: s, background: C.ivory, opacity: 0.05 + random(`do${i}`) * 0.1}}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Film grain + vignette, rendered last. */
export const Finish: React.FC = () => {
  const frame = useCurrentFrame();
  const seed = frame % 6;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill style={{background: 'radial-gradient(130% 85% at 50% 45%, transparent 55%, rgba(0,0,0,0.55) 100%)'}} />
      <svg width="100%" height="100%" style={{position: 'absolute', inset: 0, opacity: 0.07, mixBlendMode: 'overlay'}}>
        <filter id={`grain${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

/** Small monospaced label with a gold tick, e.g. "DAY 01 / MARKET". */
export const Kicker: React.FC<{children: React.ReactNode; color?: string; t?: number; style?: React.CSSProperties}> = ({children, color = C.gold, t = 1, style}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 14,
      fontFamily: F.mono,
      fontWeight: 600,
      fontSize: 26,
      letterSpacing: 4,
      textTransform: 'uppercase',
      color,
      opacity: t,
      transform: `translateY(${(1 - t) * 14}px)`,
      ...style,
    }}
  >
    <span style={{width: 26 * t, height: 3, background: color, display: 'inline-block'}} />
    {children}
  </div>
);

/** Masked line reveal: text slides up from behind a clip edge. */
export const MaskLine: React.FC<{t: number; children: React.ReactNode; style?: React.CSSProperties; blur?: boolean}> = ({t, children, style, blur = true}) => (
  <div style={{overflow: 'hidden', paddingBottom: '0.08em', marginBottom: '-0.08em'}}>
    <div
      style={{
        transform: `translateY(${(1 - t) * 105}%)`,
        filter: blur ? `blur(${(1 - t) * 6}px)` : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  </div>
);

/** Fixed-width digit ticker for stable counters. */
export const Digits: React.FC<{value: number; style?: React.CSSProperties; prefix?: string; suffix?: string; decimals?: number; digitWidth?: number}> = ({
  value,
  style,
  prefix = '',
  suffix = '',
  decimals = 0,
  digitWidth = 0.8,
}) => {
  const text = decimals > 0 ? value.toFixed(decimals).replace('.', ',') : fmtInt(value);
  return (
    <span style={{display: 'inline-flex', alignItems: 'baseline', whiteSpace: 'nowrap', ...style}}>
      {prefix}
      {text.split('').map((ch, i) => (
        <span key={i} style={{display: 'inline-block', width: /\d/.test(ch) ? `${digitWidth}em` : ch === ',' ? '0.32em' : '0.3em', textAlign: 'center'}}>
          {ch}
        </span>
      ))}
      {suffix}
    </span>
  );
};

/** Discreet provenance label for every factual graphic. */
export const SourceTag: React.FC<{children: React.ReactNode; t?: number; style?: React.CSSProperties}> = ({children, t = 1, style}) => (
  <div
    style={{
      fontFamily: F.mono,
      fontSize: 20,
      fontWeight: 500,
      letterSpacing: 1.2,
      color: C.muted,
      opacity: 0.85 * t,
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      ...style,
    }}
  >
    <span style={{width: 8, height: 8, borderRadius: 8, border: `1.5px solid ${C.muted}`}} />
    {children}
  </div>
);

/** Matte card with hairline border. */
export const Panel: React.FC<{children?: React.ReactNode; style?: React.CSSProperties; glow?: string}> = ({children, style, glow}) => (
  <div
    style={{
      background: `linear-gradient(180deg, ${C.cardHi} 0%, ${C.card} 100%)`,
      border: `1.5px solid ${C.border}`,
      borderRadius: 22,
      boxShadow: `0 40px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.02) inset${glow ? `, 0 0 60px ${glow}` : ''}`,
      overflow: 'hidden',
      position: 'relative',
      ...style,
    }}
  >
    {children}
  </div>
);

export type TransitionKind = 'whip' | 'push' | 'rise' | 'cut';

/**
 * Wraps a scene with an entrance and an exit. `local` is the frame inside the Sequence;
 * `dur` the Sequence length. Entrances take ~10 frames, exits ~8 (brand motion spec).
 */
export const SceneShell: React.FC<{children: React.ReactNode; dur: number; enter?: TransitionKind; exit?: TransitionKind; inFrames?: number; outFrames?: number}> = ({
  children,
  dur,
  enter = 'push',
  exit = 'push',
  inFrames = 10,
  outFrames = 8,
}) => {
  const frame = useCurrentFrame();
  const tin = enter === 'cut' ? 1 : prog(frame, 0, inFrames, EASE_OUT);
  const tout = exit === 'cut' ? 0 : prog(frame, dur - outFrames, dur, EASE_IN);
  let transform = '';
  let filter = '';
  let opacity = 1;
  if (enter === 'whip') {
    transform += ` translateY(${(1 - tin) * 260}px)`;
    filter += ` blur(${(1 - tin) * 18}px)`;
    opacity *= interpolate(tin, [0, 0.4], [0, 1], {extrapolateRight: 'clamp'});
  } else if (enter === 'push') {
    transform += ` scale(${1.08 - 0.08 * tin})`;
    filter += ` blur(${(1 - tin) * 10}px)`;
    opacity *= tin;
  } else if (enter === 'rise') {
    transform += ` translateY(${(1 - tin) * 80}px)`;
    opacity *= tin;
  }
  if (exit === 'whip') {
    transform += ` translateY(${-tout * 300}px)`;
    filter += ` blur(${tout * 18}px)`;
    opacity *= 1 - interpolate(tout, [0.5, 1], [0, 1], {extrapolateLeft: 'clamp'});
  } else if (exit === 'push') {
    transform += ` scale(${1 - 0.05 * tout})`;
    filter += ` blur(${tout * 8}px)`;
    opacity *= 1 - tout;
  } else if (exit === 'rise') {
    transform += ` translateY(${-tout * 80}px)`;
    opacity *= 1 - tout;
  }
  return <AbsoluteFill style={{transform, filter: filter || undefined, opacity}}>{children}</AbsoluteFill>;
};

/** Persistent top HUD: wordmark + episode chip + thin episode progress. */
export const Hud: React.FC<{day: number; totalDays: number; caseName: string}> = ({day, totalDays, caseName}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  return (
    <div style={{position: 'absolute', left: SAFE.left, right: SAFE.right, top: SAFE.top - 40}}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 34, letterSpacing: 1, color: C.ivory}}>
          TRUE<span style={{color: C.gold}}>DAD</span>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            fontFamily: F.mono,
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: 2,
            color: C.ivory,
            padding: '10px 18px',
            border: `1.5px solid ${C.border}`,
            borderRadius: 999,
            background: 'rgba(21,26,34,0.75)',
          }}
        >
          <span style={{width: 10, height: 10, borderRadius: 10, background: C.gold, boxShadow: `0 0 12px ${C.gold}`}} />
          {caseName.toUpperCase()} · ДЕНЬ {String(day).padStart(2, '0')}/{totalDays}
        </div>
      </div>
      <div style={{marginTop: 22, height: 3, background: '#1E2530', borderRadius: 3, overflow: 'hidden'}}>
        <div style={{width: `${((frame + 1) / durationInFrames) * 100}%`, height: '100%', background: `linear-gradient(90deg, ${C.gold}66, ${C.gold})`}} />
      </div>
    </div>
  );
};

export const Arrow: React.FC<{dir: 'up' | 'down'; color: string; size?: number}> = ({dir, color, size = 64}) => (
  <svg width={size} height={size} viewBox="0 0 64 64" style={{transform: dir === 'down' ? 'rotate(180deg)' : undefined}}>
    <path d="M32 8 L54 34 H40 V56 H24 V34 H10 Z" fill={color} />
  </svg>
);
