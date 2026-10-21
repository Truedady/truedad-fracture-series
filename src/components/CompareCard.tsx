import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Digits} from '../brand/primitives';
import {C, F} from '../brand/tokens';
import {EASE_OUT, sec} from '../lib/anim';

/**
 * Day-over-day comparison laid over the real interface: label, yesterday's value,
 * today's value counting from yesterday to today, and a delta chip.
 * All times are absolute seconds; `start` is the Sequence start.
 */
export const CompareCard: React.FC<{
  start: number;
  show: number;
  hide?: number;
  label: string;
  before: number;
  after: number;
  countFrom: number;
  countTo: number;
  decimals?: number;
  suffix?: string;
  delta?: {at: number; text: string; color: string};
  note?: string;
  style?: React.CSSProperties;
}> = ({start, show, hide, label, before, after, countFrom, countTo, decimals = 0, suffix = '', delta, note, style}) => {
  const f = useCurrentFrame() + sec(start);
  const tin = interpolate(f, [sec(show), sec(show) + 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT});
  const tout = hide === undefined ? 0 : interpolate(f, [sec(hide) - 6, sec(hide)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const t = tin * (1 - tout);
  if (t <= 0) return null;
  const v = interpolate(f, [sec(countFrom), sec(countTo)], [before, after], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT});
  const landed = f >= sec(countTo);
  const dT = delta ? interpolate(f, [sec(delta.at), sec(delta.at) + 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT}) : 0;
  const shown = decimals ? Math.round(v * 10 ** decimals) / 10 ** decimals : Math.round(v);
  const num = (n: number, size: number, color: string) => (
    <Digits value={n} decimals={decimals} suffix={suffix} digitWidth={0.72} style={{fontFamily: F.display, fontWeight: 800, fontSize: size, color, letterSpacing: -2, lineHeight: 1}} />
  );
  return (
    <div
      style={{
        position: 'absolute',
        left: 60,
        right: 60,
        padding: '26px 30px 28px',
        borderRadius: 24,
        background: 'rgba(11,14,19,0.9)',
        border: `1.5px solid ${C.border}`,
        boxShadow: '0 30px 70px rgba(0,0,0,0.6)',
        opacity: t,
        transform: `translateY(${(1 - t) * 40}px)`,
        ...style,
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: 12, fontFamily: F.mono, fontWeight: 600, fontSize: 24, letterSpacing: 3, color: C.gold}}>
        <span style={{width: 26, height: 3, background: C.gold}} />
        {label}
      </div>
      <div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 18, gap: 18}}>
        <div>
          <div style={{fontFamily: F.mono, fontSize: 22, color: C.muted, letterSpacing: 2, marginBottom: 8}}>ВЧЕРА</div>
          {num(before, 50, C.muted)}
        </div>
        <div style={{fontFamily: F.display, fontSize: 44, color: C.dim, paddingBottom: 4}}>→</div>
        <div style={{textAlign: 'right'}}>
          <div style={{fontFamily: F.mono, fontSize: 22, color: C.ivory, letterSpacing: 2, marginBottom: 8}}>СЕГОДНЯ</div>
          {num(shown, 76, landed ? C.ivory : C.ivory)}
        </div>
      </div>
      {(delta || note) && (
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 18, minHeight: 50}}>
          <div style={{fontFamily: F.mono, fontSize: 21, color: C.muted, letterSpacing: 1}}>{note}</div>
          {delta && (
            <div
              style={{
                fontFamily: F.mono,
                fontWeight: 600,
                fontSize: 34,
                color: delta.color,
                background: `${delta.color}1F`,
                border: `1.5px solid ${delta.color}`,
                borderRadius: 12,
                padding: '6px 16px',
                opacity: dT,
                transform: `scale(${0.75 + 0.25 * dT})`,
                whiteSpace: 'nowrap',
              }}
            >
              {delta.text}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
