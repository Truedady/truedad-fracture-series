import {Easing, interpolate, random} from 'remotion';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** interpolate с обрезкой по краям */
export const k = (
  f: number,
  input: number[],
  output: number[],
  easing?: (t: number) => number,
) => interpolate(f, input, output, {...clamp, easing});

export const E = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  outSoft: Easing.bezier(0.22, 1, 0.36, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  soft: Easing.bezier(0.45, 0, 0.2, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0),
  hard: Easing.bezier(0.9, 0, 0.1, 1),
};

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const rnd = (seed: string | number) => random(seed);
export const range = (n: number) => Array.from({length: n}, (_, i) => i);

/** Детерминированная «ручная» тряска камеры, затухающая после start */
export const shake = (f: number, start: number, amp: number, decay = 10) => {
  if (f < start) return {x: 0, y: 0, r: 0};
  const t = f - start;
  const a = amp * Math.exp(-t / decay);
  return {
    x: a * Math.sin(t * 2.7 + 1.3) * Math.cos(t * 0.9),
    y: a * Math.sin(t * 3.4 + 0.2),
    r: a * 0.04 * Math.sin(t * 2.1),
  };
};

/** Медленный органичный дрейф (ручная камера на стабилизаторе) */
export const drift = (f: number, seed: number, amp: number) => ({
  x: amp * (Math.sin(f * 0.031 + seed) + 0.5 * Math.sin(f * 0.073 + seed * 2.1)),
  y: amp * 0.6 * (Math.sin(f * 0.027 + seed * 1.7) + 0.5 * Math.sin(f * 0.061 + seed)),
});
