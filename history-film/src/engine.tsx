import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from './theme';
import dims from './dims.json';

/* ───────── базовое ───────── */
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const ease = Easing.bezier(0.45, 0, 0.2, 1);
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const k = (f: number, i: number[], o: number[], e: (t: number) => number = ease) => interpolate(f, i, o, {...clamp, easing: e});
export const useSec = () => {
  const f = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  return {t: f / fps, dur: durationInFrames / fps, f, fps};
};
export const D = dims as unknown as Record<string, [number, number]>;

/** Звуковой эффект в момент at (сек от начала плана). */
export const Sfx: React.FC<{name: string; at: number; vol?: number}> = ({name, at, vol = 0.6}) => {
  const {fps} = useVideoConfig();
  return (
    <Sequence from={Math.max(0, Math.round(at * fps))} layout="none">
      <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
    </Sequence>
  );
};

/* ───────── камера по скриншоту страницы ───────── */
export type Move = 'push' | 'pull' | 'scroll' | 'panR' | 'panL' | 'tilt' | 'drift' | 'hold';
type Key = {t: number; x: number; y: number; z: number};

const keysFor = (move: Move, w: number, h: number, fx: number, fy: number, dur: number, zMax: number): Key[] => {
  const zf = Math.max(1920 / w, 1080 / h); // заполнить кадр
  const z0 = Math.max(zf, 1.2);
  switch (move) {
    case 'push':
      return [{t: 0, x: w / 2, y: Math.max(fy - 260, 0), z: z0}, {t: dur, x: fx, y: fy, z: zMax}];
    case 'pull':
      return [{t: 0, x: fx, y: fy, z: zMax}, {t: dur, x: w / 2, y: Math.max(fy - 200, 0), z: z0}];
    case 'scroll':
      return [{t: 0, x: fx, y: Math.max(fy - 420, 0), z: 1.3}, {t: dur, x: fx, y: fy + 420, z: 1.3}];
    case 'panR':
      return [{t: 0, x: fx - 260, y: fy, z: zMax}, {t: dur, x: fx + 260, y: fy + 30, z: zMax}];
    case 'panL':
      return [{t: 0, x: fx + 260, y: fy + 30, z: zMax}, {t: dur, x: fx - 260, y: fy, z: zMax}];
    case 'drift':
      return [{t: 0, x: fx - 120, y: fy - 80, z: zMax - 0.08}, {t: dur, x: fx + 120, y: fy + 80, z: zMax}];
    case 'tilt':
      return [{t: 0, x: fx, y: fy - 120, z: z0}, {t: dur, x: fx, y: fy, z: zMax - 0.05}];
    default:
      return [{t: 0, x: fx, y: fy, z: zMax - 0.05}, {t: dur, x: fx, y: fy, z: zMax}];
  }
};

export const PageShot: React.FC<{src: string; id: string; move: Move; fx?: number; fy?: number; zMax?: number; gray?: boolean}> = ({src, id, move, fx, fy = 560, zMax = 1.42, gray}) => {
  const {t, dur} = useSec();
  const [w, h] = D[id];
  const keys = keysFor(move, w, h, fx ?? w / 2, fy, dur, zMax);
  const p = ease(Math.max(0, Math.min(1, t / dur)));
  let x = keys[0].x + (keys[1].x - keys[0].x) * p;
  let y = keys[0].y + (keys[1].y - keys[0].y) * p;
  let z = keys[0].z + (keys[1].z - keys[0].z) * p;
  z = Math.max(z, 1920 / w, 1080 / h);
  x = Math.min(Math.max(x, 960 / z), w - 960 / z);
  y = Math.min(Math.max(y, 540 / z), h - 540 / z);
  const tilt = move === 'tilt' ? k(t, [0, dur * 0.8], [9, 0]) : 0;
  return (
    <AbsoluteFill style={{background: C.black, overflow: 'hidden', perspective: 2200, filter: gray ? 'grayscale(0.85) brightness(0.85)' : undefined}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: w, height: h, transformOrigin: '0 0', transform: `translate(${960 - x * z}px, ${540 - y * z}px) scale(${z}) rotateX(${tilt}deg)`}}>
        <Img src={staticFile(src)} style={{width: w, height: h, display: 'block'}} />
      </div>
    </AbsoluteFill>
  );
};

/* ───────── картинка (архив/официальный арт): полноэкранный Ken Burns или карточка ───────── */
export const PhotoShot: React.FC<{src: string; id: string; mode?: 'full' | 'card'; dir?: 'in' | 'out' | 'left' | 'right' | 'up'; width?: number; gray?: boolean}> = ({src, id, mode, dir = 'in', width, gray}) => {
  const {t, dur} = useSec();
  const [w, h] = D[id];
  const m = mode ?? (w >= 1500 ? 'full' : 'card');
  const p = ease(t / dur);
  if (m === 'full') {
    const base = Math.max(1920 / w, 1080 / h);
    const s = base * (dir === 'out' ? 1.12 - 0.12 * p : dir === 'in' ? 1 + 0.12 * p : 1.1);
    const dx = dir === 'left' ? 60 - 120 * p : dir === 'right' ? -60 + 120 * p : 0;
    const dy = dir === 'up' ? 40 - 80 * p : 0;
    return (
      <AbsoluteFill style={{background: C.black, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', filter: gray ? 'grayscale(0.85) brightness(0.85)' : undefined}}>
        <Img src={staticFile(src)} style={{width: w * s, height: h * s, transform: `translate(${dx}px, ${dy}px)`}} />
      </AbsoluteFill>
    );
  }
  const cw = width ?? Math.min(1500, Math.max(900, w * 1.15));
  const rot = dir === 'left' ? k(t, [0, dur], [2, -1]) : dir === 'right' ? k(t, [0, dur], [-2, 1]) : 0;
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 45%, #121821 0%, ${C.black} 85%)`, alignItems: 'center', justifyContent: 'center', filter: gray ? 'grayscale(0.85)' : undefined}}>
      {/* размытый фон из той же картинки — без пустых полей */}
      <Img src={staticFile(src)} style={{position: 'absolute', width: 2200, height: 1300, objectFit: 'cover', filter: 'blur(40px) brightness(0.35)', transform: `scale(${1.1 + 0.05 * p})`}} />
      <div style={{transform: `scale(${dir === 'out' ? 1.06 - 0.06 * p : 1 + 0.06 * p}) rotate(${rot}deg)`, boxShadow: '0 40px 120px rgba(0,0,0,0.75)', borderRadius: 6, overflow: 'hidden'}}>
        <Img src={staticFile(src)} style={{width: cw, display: 'block'}} />
      </div>
    </AbsoluteFill>
  );
};

/* ───────── переходы между планами ───────── */
export type Tr = 'fade' | 'slide' | 'slideUp' | 'zoom' | 'whip' | 'dip' | 'blur';
export const TR_SEC: Record<Tr, number> = {fade: 0.6, slide: 0.55, slideUp: 0.55, zoom: 0.6, whip: 0.35, dip: 0.8, blur: 0.7};
export const TR_SFX: Partial<Record<Tr, string>> = {slide: 'whoosh_short', slideUp: 'whoosh_short', whip: 'whoosh_short', zoom: 'whoosh_long'};

/** Обёртка плана: вход по типу trIn, выход по типу trOut (тип перехода к следующему). */
export const TransitionWrap: React.FC<{trIn?: Tr; trOut?: Tr; children: React.ReactNode}> = ({trIn, trOut, children}) => {
  const {t, dur} = useSec();
  const a = trIn ? Math.min(1, t / TR_SEC[trIn]) : 1; // 0→1 вход
  const b = trOut ? Math.max(0, (t - (dur - TR_SEC[trOut])) / TR_SEC[trOut]) : 0; // 0→1 выход
  const ai = ease(a);
  const bi = ease(b);
  let style: React.CSSProperties = {};
  let op = 1;
  let tf = '';
  let blur = 0;
  // вход
  if (trIn === 'fade' || trIn === 'blur') op *= ai;
  if (trIn === 'blur') blur += (1 - ai) * 18;
  if (trIn === 'slide') tf += ` translateX(${(1 - ai) * 100}%)`;
  if (trIn === 'slideUp') tf += ` translateY(${(1 - ai) * 100}%)`;
  if (trIn === 'zoom') { tf += ` scale(${0.85 + 0.15 * ai})`; op *= ai; }
  if (trIn === 'whip') { tf += ` translateX(${(1 - ai) * 60}%)`; blur += (1 - ai) * 30; op *= Math.min(1, ai * 2); }
  if (trIn === 'dip') op *= k(t, [TR_SEC.dip / 2, TR_SEC.dip], [0, 1]);
  // выход
  if (trOut === 'slide') tf += ` translateX(${-bi * 35}%)`;
  if (trOut === 'slideUp') tf += ` translateY(${-bi * 35}%)`;
  if (trOut === 'zoom') { tf += ` scale(${1 + bi * 0.25})`; op *= 1 - bi; }
  if (trOut === 'whip') { tf += ` translateX(${-bi * 60}%)`; blur += bi * 30; }
  if (trOut === 'dip') op *= k(t, [dur - TR_SEC.dip, dur - TR_SEC.dip / 2], [1, 0]);
  if (trOut === 'slide' || trOut === 'slideUp') style.filter = undefined;
  return (
    <AbsoluteFill style={{opacity: op, transform: tf || undefined, filter: blur > 0.3 ? `blur(${blur}px)` : undefined, ...style}}>
      {children}
    </AbsoluteFill>
  );
};
