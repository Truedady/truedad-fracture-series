import {Easing, interpolate, spring} from 'remotion';
import {FPS} from '../brand/tokens';

export const sec = (s: number) => Math.round(s * FPS);

export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);
export const EASE_IN = Easing.bezier(0.7, 0, 0.84, 0);

/** 0..1 progress between two frames with easing, clamped. */
export const prog = (frame: number, from: number, to: number, ease = EASE_OUT) =>
  interpolate(frame, [from, to], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});

/** Progress of a reveal that starts at absolute second `at` (relative to a scene starting at `sceneStart`). */
export const at = (frame: number, sceneStart: number, atSec: number, durFrames = 12, ease = EASE_OUT) => {
  const f0 = sec(atSec) - sec(sceneStart);
  return prog(frame, f0, f0 + durFrames, ease);
};

export const pop = (frame: number, startFrame: number, fps = FPS, damping = 14, stiffness = 180) =>
  spring({frame: frame - startFrame, fps, config: {damping, stiffness, mass: 0.6}});

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const fmtInt = (n: number) => Math.round(n).toLocaleString('ru-RU').replace(/\s/g, ' ');
