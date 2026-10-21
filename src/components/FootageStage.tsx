import React from 'react';
import {AbsoluteFill, OffthreadVideo, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {C, FPS, H, W} from '../brand/tokens';
import type {Footage, Rect} from '../episodes/types';
import {EASE_IN_OUT, lerp, sec} from '../lib/anim';

/**
 * A camera keyframe over the real recording. `rect` is in the footage reference space
 * (footage.coordW × coordH). A rect taller than 9:16 fills the whole screen; a wider rect
 * becomes a "card" (full width, height from aspect) centred on `cy`, over a blurred copy
 * of the same frame. `move` = transition length in frames into this keyframe.
 */
export type Shot = {at: number; rect: Rect; cy?: number; move?: number};

/** Dims everything except `rect` between `from` and `to` (absolute seconds). */
export type Spot = {from: number; to: number; rect: Rect; pad?: number; color?: string};

const DEFAULT_CY = 860; // above the caption zone
const DRIFT = 0.035; // slow push-in while a keyframe holds

const lerpRect = (a: Rect, b: Rect, t: number): Rect => ({x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), w: lerp(a.w, b.w, t), h: lerp(a.h, b.h, t)});

/** Camera state at absolute frame `f`. */
const cameraAt = (shots: Shot[], f: number) => {
  let i = 0;
  while (i + 1 < shots.length && sec(shots[i + 1].at) <= f) i++;
  const cur = shots[i];
  const prev = shots[i - 1];
  const move = cur.move ?? 14;
  const t = prev ? interpolate(f, [sec(cur.at), sec(cur.at) + move], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_IN_OUT}) : 1;
  let rect = prev ? lerpRect(prev.rect, cur.rect, t) : cur.rect;
  const cy = prev ? lerp(prev.cy ?? DEFAULT_CY, cur.cy ?? DEFAULT_CY, t) : cur.cy ?? DEFAULT_CY;
  // gentle drift towards the centre of the current rect
  const hold = Math.max(0, f - sec(cur.at) - move) / FPS;
  const k = 1 - DRIFT * Math.min(1, hold / 4);
  rect = {x: rect.x + (rect.w * (1 - k)) / 2, y: rect.y + (rect.h * (1 - k)) / 2, w: rect.w * k, h: rect.h * k};
  return {rect, cy};
};

export const FootageStage: React.FC<{
  footage: Footage;
  /** Source time (s) at the start of this Sequence, and playback rate. */
  fromSec: number;
  rate?: number;
  /** Absolute start of the Sequence (s), so shots/spots can use voiceover timecodes. */
  start: number;
  shots: Shot[];
  spots?: Spot[];
  /** Extra overlay in screen space; receives a mapper from source rects to screen rects. */
  overlay?: (toScreen: (r: Rect) => Rect) => React.ReactNode;
}> = ({footage, fromSec, rate = 1, start, shots, spots = [], overlay}) => {
  const local = useCurrentFrame();
  const f = local + sec(start);
  const {rect, cy} = cameraAt(shots, f);
  const boxH = Math.min(H, (W * rect.h) / rect.w);
  const full = boxH >= H - 1;
  const top = full ? 0 : Math.max(0, Math.min(H - boxH, cy - boxH / 2));
  const s = Math.max(W / rect.w, boxH / rect.h);
  const ox = -rect.x * s + (W - rect.w * s) / 2;
  const oy = top - rect.y * s + (boxH - rect.h * s) / 2;
  const toScreen = (r: Rect): Rect => ({x: ox + r.x * s, y: oy + r.y * s, w: r.w * s, h: r.h * s});
  const cardT = interpolate(boxH, [H * 0.82, H], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const radius = 26 * cardT;
  const video = (style: React.CSSProperties) => (
    <OffthreadVideo src={staticFile(footage.src)} muted trimBefore={Math.round(fromSec * FPS)} playbackRate={rate} style={{position: 'absolute', maxWidth: 'none', ...style}} />
  );
  // blurred cover copy for card framing
  const bgS = Math.max(W / footage.coordW, H / footage.coordH) * 1.08;
  return (
    <AbsoluteFill style={{background: C.canvas}}>
      {cardT > 0 && (
        <AbsoluteFill style={{opacity: cardT}}>
          {video({
            left: (W - footage.coordW * bgS) / 2,
            top: (H - footage.coordH * bgS) / 2,
            width: footage.coordW * bgS,
            height: footage.coordH * bgS,
            filter: 'blur(36px) brightness(0.32) saturate(0.8)',
          })}
          <AbsoluteFill style={{background: 'radial-gradient(120% 70% at 50% 45%, transparent 30%, rgba(11,14,19,0.75) 100%)'}} />
        </AbsoluteFill>
      )}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top,
          width: W,
          height: boxH,
          overflow: 'hidden',
          borderRadius: radius,
          boxShadow: cardT > 0 ? `0 40px 90px rgba(0,0,0,${0.6 * cardT}), 0 0 0 1.5px ${C.border}` : undefined,
        }}
      >
        {video({left: ox, top: oy - top, width: footage.coordW * s, height: footage.coordH * s})}
        {spots.map((sp, i) => {
          const fin = sec(sp.from);
          const fout = sec(sp.to);
          const t = Math.min(
            interpolate(f, [fin, fin + 9], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
            interpolate(f, [fout - 6, fout], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
          );
          if (t <= 0) return null;
          const pad = sp.pad ?? 6;
          const r = toScreen({x: sp.rect.x - pad, y: sp.rect.y - pad, w: sp.rect.w + pad * 2, h: sp.rect.h + pad * 2});
          const color = sp.color ?? C.gold;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: r.x,
                top: r.y - top,
                width: r.w,
                height: r.h,
                borderRadius: 12,
                border: `3px solid ${color}`,
                boxShadow: `0 0 0 4000px rgba(7,9,13,${0.62 * t}), 0 0 28px ${color}88`,
                opacity: t,
                transform: `scale(${1.06 - 0.06 * t})`,
              }}
            />
          );
        })}
        {/* soft top/bottom shading so HUD and captions stay readable over bright UI */}
        {full && (
          <AbsoluteFill
            style={{background: 'linear-gradient(to bottom, rgba(11,14,19,0.78) 0%, transparent 16%, transparent 58%, rgba(11,14,19,0.55) 70%, rgba(11,14,19,0.9) 100%)'}}
          />
        )}
      </div>
      {overlay && <AbsoluteFill>{overlay(toScreen)}</AbsoluteFill>}
    </AbsoluteFill>
  );
};
