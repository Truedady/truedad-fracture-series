import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, F, FPS, SAFE} from '../brand/tokens';
import type {Caption} from '../episodes/types';

/**
 * Word-synced kinetic captions. One page (2–5 words) at a time, each word lights up on its
 * spoken onset; key words/numbers get the gold accent.
 */
export const CaptionLayer: React.FC<{pages: Caption[][]; y?: number; hideBetween?: Array<[number, number]>}> = ({pages, y = SAFE.captionY, hideBetween = []}) => {
  const frame = useCurrentFrame();
  const now = frame / FPS;
  if (hideBetween.some(([a, b]) => now >= a && now < b)) return null;
  const idx = pages.findIndex((p, i) => {
    const next = pages[i + 1];
    const end = next ? Math.min(next[0].start, p[p.length - 1].end + 0.6) : p[p.length - 1].end + 0.8;
    return now >= p[0].start - 0.06 && now < end;
  });
  if (idx < 0) return null;
  const page = pages[idx];
  const pStart = page[0].start - 0.06;
  // The very first page is fully on screen from frame 0 (hook).
  const tin = pStart <= 0 ? 1 : interpolate(now, [pStart, pStart + 0.18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div
      style={{
        position: 'absolute',
        left: SAFE.left - 10,
        right: SAFE.right - 10,
        top: y,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'baseline',
        columnGap: 24,
        rowGap: 4,
        transform: `translateY(${(1 - tin) * 24}px)`,
        opacity: tin,
      }}
    >
      {page.map((w, i) => {
        const on = w.start < 0.1 ? 1 : interpolate(now, [w.start - 0.03, w.start + 0.09], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        const color = w.key ? C.gold : C.ivory;
        const scale = 1 + 0.08 * on * (1 - interpolate(now, [w.start + 0.09, w.start + 0.3], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
        return (
          <span
            key={i}
            style={{
              fontFamily: F.text,
              fontWeight: 800,
              fontSize: w.key ? 76 : 68,
              lineHeight: 1.12,
              letterSpacing: -0.5,
              color,
              opacity: 0.32 + 0.68 * on,
              transform: `scale(${scale})`,
              display: 'inline-block',
              textShadow: '0 4px 24px rgba(0,0,0,0.85), 0 2px 4px rgba(0,0,0,0.9)',
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};
