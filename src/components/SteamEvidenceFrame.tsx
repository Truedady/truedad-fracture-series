import React from 'react';
import {OffthreadVideo, staticFile} from 'remotion';
import {C, F, FPS} from '../brand/tokens';
import type {Footage, Rect} from '../episodes/types';
import {lerp} from '../lib/anim';

/**
 * A window onto the REAL screen recording. The crop animates between two rects so it reads
 * as a camera move over authentic UI. Rects and overlays use the footage's reference
 * coordinate space (`footage.coordW × coordH`), independent of the file's native resolution.
 * The video is laid out at its final on-screen size (no CSS upscaling of a smaller layer),
 * so pixels come straight from the native-resolution frames.
 */
export const SteamEvidenceFrame: React.FC<{
  footage: Footage;
  fromSec: number;
  playbackRate?: number;
  boxW: number;
  boxH: number;
  rectA: Rect;
  rectB?: Rect;
  t?: number;
  label?: string;
  live?: boolean;
  overlay?: React.ReactNode;
  style?: React.CSSProperties;
  radius?: number;
  labelSide?: 'left' | 'right';
}> = ({footage, fromSec, playbackRate = 1, boxW, boxH, rectA, rectB, t = 0, label, live = true, overlay, style, radius = 20, labelSide = 'left'}) => {
  const r = rectB
    ? {x: lerp(rectA.x, rectB.x, t), y: lerp(rectA.y, rectB.y, t), w: lerp(rectA.w, rectB.w, t), h: lerp(rectA.h, rectB.h, t)}
    : rectA;
  // screen px per reference unit
  const s = Math.max(boxW / r.w, boxH / r.h);
  const ox = -r.x * s + (boxW - r.w * s) / 2;
  const oy = -r.y * s + (boxH - r.h * s) / 2;
  return (
    <div
      style={{
        width: boxW,
        height: boxH,
        position: 'relative',
        borderRadius: radius,
        overflow: 'hidden',
        border: `1.5px solid ${C.border}`,
        boxShadow: '0 50px 90px rgba(0,0,0,0.6), 0 0 0 6px rgba(11,14,19,0.6)',
        background: '#000',
        ...style,
      }}
    >
      <OffthreadVideo
        src={staticFile(footage.src)}
        muted
        trimBefore={Math.round(fromSec * FPS)}
        playbackRate={playbackRate}
        style={{position: 'absolute', left: ox, top: oy, width: footage.coordW * s, height: footage.coordH * s, maxWidth: 'none'}}
      />
      <div style={{position: 'absolute', left: ox, top: oy, width: footage.coordW, height: footage.coordH, transformOrigin: '0 0', transform: `scale(${s})`}}>{overlay}</div>
      <div style={{position: 'absolute', inset: 0, boxShadow: 'inset 0 0 80px rgba(0,0,0,0.45)', pointerEvents: 'none'}} />
      {label && (
        <div
          style={{
            position: 'absolute',
            [labelSide]: 18,
            top: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '8px 14px',
            borderRadius: 10,
            background: 'rgba(11,14,19,0.82)',
            border: `1px solid ${C.border}`,
            fontFamily: F.mono,
            fontSize: 20,
            fontWeight: 600,
            letterSpacing: 2,
            color: C.ivory,
          }}
        >
          {live && <span style={{width: 9, height: 9, borderRadius: 9, background: C.loss}} />}
          {label}
        </div>
      )}
    </div>
  );
};
