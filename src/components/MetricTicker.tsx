import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Digits} from '../brand/primitives';
import {C, F} from '../brand/tokens';
import {EASE_OUT} from '../lib/anim';

/** Counts from `from` to `to` between two (local) frames; lands exactly on the spoken number. */
export const MetricTicker: React.FC<{
  from?: number;
  to: number;
  startFrame: number;
  endFrame: number;
  size?: number;
  color?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  font?: string;
  style?: React.CSSProperties;
}> = ({from = 0, to, startFrame, endFrame, size = 200, color = C.gold, prefix, suffix, decimals = 0, font = F.display, style}) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [startFrame, endFrame], [from, to], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT});
  const shown = decimals ? Math.round(v * 10 ** decimals) / 10 ** decimals : Math.round(v);
  return (
    <Digits
      value={shown}
      decimals={decimals}
      prefix={prefix}
      suffix={suffix}
      style={{fontFamily: font, fontWeight: 800, fontSize: size, color, lineHeight: 1, letterSpacing: -2, ...style}}
    />
  );
};
