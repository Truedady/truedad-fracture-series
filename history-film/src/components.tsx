import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT} from './theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const ease = Easing.bezier(0.45, 0, 0.2, 1);
export const k = (f: number, i: number[], o: number[], e?: (t: number) => number) => interpolate(f, i, o, {...clamp, easing: e});

/** Плавное появление/уход плана (кроссфейд). */
export const Fade: React.FC<{children: React.ReactNode; fade?: number}> = ({children, fade = 0.45}) => {
  const f = useCurrentFrame();
  const {fps, durationInFrames: d} = useVideoConfig();
  const n = Math.round(fade * fps);
  return <AbsoluteFill style={{opacity: k(f, [0, n], [0, 1]) * k(f, [d - n, d], [1, 0])}}>{children}</AbsoluteFill>;
};

/*
 * Настоящий скриншот страницы (снят Playwright в 2× разрешении) и «камера» по нему.
 * Координаты — в CSS-пикселях страницы (ширина 1600), z ≤ 1.45, чтобы текст оставался чётким.
 * mark — НЕ БОЛЕЕ одного выделения на план (по просьбе автора).
 */
export type Key = {t: number; x: number; y: number; z: number};
export const Page: React.FC<{
  src: string;
  w?: number;
  h: number;
  keys: Key[];
  mark?: {t: number; x: number; y: number; w: number; h: number};
}> = ({src, w = 1600, h, keys, mark}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sec = f / fps;
  let c = keys[keys.length - 1];
  for (let i = 0; i < keys.length - 1; i++) {
    if (sec <= keys[i + 1].t) {
      const p = ease(Math.max(0, Math.min(1, (sec - keys[i].t) / (keys[i + 1].t - keys[i].t))));
      c = {t: sec, x: keys[i].x + (keys[i + 1].x - keys[i].x) * p, y: keys[i].y + (keys[i + 1].y - keys[i].y) * p, z: keys[i].z + (keys[i + 1].z - keys[i].z) * p};
      break;
    }
  }
  // кадр всегда заполнен страницей: без чёрных полей по краям
  const z = Math.max(c.z, 1920 / w, 1080 / h);
  const cx = Math.min(Math.max(c.x, 960 / z), w - 960 / z);
  const cy = Math.min(Math.max(c.y, 540 / z), h - 540 / z);
  c = {t: c.t, x: cx, y: cy, z};
  const mp = mark ? k(sec, [mark.t, mark.t + 0.6], [0, 1], ease) : 0;
  return (
    <AbsoluteFill style={{background: C.black, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: w, height: h, transformOrigin: '0 0', transform: `translate(${960 - c.x * c.z}px, ${540 - c.y * c.z}px) scale(${c.z})`}}>
        <Img src={staticFile(src)} style={{width: w, height: h, display: 'block'}} />
        {mark && mp > 0 && (
          <div style={{position: 'absolute', left: mark.x - 6, top: mark.y + mark.h + 2, width: (mark.w + 12) * mp, height: 3, background: C.gold, borderRadius: 2}} />
        )}
      </div>
    </AbsoluteFill>
  );
};

/** Фото/скриншот карточкой по центру (не на весь экран) с очень медленным наездом. */
export const Photo: React.FC<{src: string; width: number; push?: number; bg?: string}> = ({src, width, push = 0.05, bg = C.bg}) => {
  const f = useCurrentFrame();
  const {durationInFrames: d} = useVideoConfig();
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 45%, ${bg} 0%, ${C.black} 85%)`, alignItems: 'center', justifyContent: 'center'}}>
      <div style={{transform: `scale(${1 + (f / d) * push})`, boxShadow: '0 30px 90px rgba(0,0,0,0.7)'}}>
        <Img src={staticFile(src)} style={{width, display: 'block'}} />
      </div>
    </AbsoluteFill>
  );
};

/** Короткая плашка с датой (одна на план, по необходимости). */
export const DateTag: React.FC<{text: string; at?: number}> = ({text, at = 0.6}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const o = k(f / fps, [at, at + 0.5], [0, 1]);
  return (
    <div style={{position: 'absolute', left: 96, bottom: 80, opacity: o, padding: '10px 18px', background: 'rgba(5,6,8,0.78)', borderLeft: `3px solid ${C.gold}`, fontFamily: FONT.mono, fontWeight: 500, fontSize: 26, letterSpacing: '0.08em', color: C.ivory}}>
      {text}
    </div>
  );
};

/** Метка черновика: голос ещё не записан. */
export const VoicePending: React.FC = () => (
  <div style={{position: 'absolute', right: 40, top: 30, fontFamily: FONT.mono, fontSize: 18, letterSpacing: '0.12em', color: '#E54C58', background: 'rgba(5,6,8,0.7)', padding: '6px 12px'}}>
    VOICE_PENDING · ЧЕРНОВИК
  </div>
);
