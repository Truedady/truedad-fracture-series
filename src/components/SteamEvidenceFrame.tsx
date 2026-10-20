import React from 'react';
import {OffthreadVideo, staticFile} from 'remotion';
import {C, F, FPS} from '../brand/tokens';
import type {Rect} from '../episodes/types';
import {lerp} from '../lib/anim';

/**
 * A window onto the REAL screen recording. The crop animates between two source rects
 * (in source pixels), so it reads as a camera move over authentic UI. Overlays are given
 * in source coordinates and follow the camera.
 */
export const SteamEvidenceFrame: React.FC<{
  src: string;
  srcW: number;
  srcH: number;
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
  dim?: number;
  labelSide?: 'left' | 'right';
}> = ({src, srcW, srcH, fromSec, playbackRate = 1, boxW, boxH, rectA, rectB, t = 0, label, live = true, overlay, style, radius = 20, dim = 0, labelSide = 'left'}) => {
  const r = rectB
    ? {x: lerp(rectA.x, rectB.x, t), y: lerp(rectA.y, rectB.y, t), w: lerp(rectA.w, rectB.w, t), h: lerp(rectA.h, rectB.h, t)}
    : rectA;
  const scale = Math.max(boxW / r.w, boxH / r.h);
  const ox = -r.x * scale + (boxW - r.w * scale) / 2;
  const oy = -r.y * scale + (boxH - r.h * scale) / 2;
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
      <div style={{position: 'absolute', left: 0, top: 0, width: srcW, height: srcH, transformOrigin: '0 0', transform: `translate(${ox}px, ${oy}px) scale(${scale})`}}>
        <OffthreadVideo src={staticFile(src)} muted trimBefore={Math.round(fromSec * FPS)} playbackRate={playbackRate} style={{width: srcW, height: srcH}} />
        {overlay}
      </div>
      {dim > 0 && <div style={{position: 'absolute', inset: 0, background: `rgba(11,14,19,${dim})`}} />}
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
