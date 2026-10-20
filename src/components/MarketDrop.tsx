import React from 'react';
import chart from '../../data/day01.chart.json';
import {C, F} from '../brand/tokens';

type Pt = {date: string; rub: number};
const SERIES = chart.series as Pt[];

export type ChartWindow = {from?: string; to?: string};

const slice = (w: ChartWindow) => SERIES.filter((p) => (!w.from || p.date >= w.from) && (!w.to || p.date <= w.to));

/**
 * Redraws the real Steam median-price curve (digitized from the screenshot).
 * `draw` reveals the line left→right; `focusFrom` recolors everything after that date (e.g. the fall from the peak).
 */
export const MarketDrop: React.FC<{
  width: number;
  height: number;
  draw: number;
  window?: ChartWindow;
  color?: string;
  baseColor?: string;
  focusFrom?: string;
  focusT?: number;
  yMin?: number;
  yMax?: number;
  area?: boolean;
  stroke?: number;
  showEnd?: boolean;
  endLabel?: React.ReactNode;
  peakLabel?: React.ReactNode;
  peakT?: number;
  gridLabels?: boolean;
}> = ({
  width,
  height,
  draw,
  window = {},
  color = C.loss,
  baseColor,
  focusFrom,
  focusT = 1,
  yMin = 30,
  yMax = 95,
  area = true,
  stroke = 7,
  showEnd = true,
  endLabel,
  peakLabel,
  peakT = 0,
  gridLabels = true,
}) => {
  const pts = slice(window);
  const n = pts.length;
  const x = (i: number) => (i / (n - 1)) * width;
  const y = (v: number) => height - ((v - yMin) / (yMax - yMin)) * height;
  const visible = Math.max(2, Math.floor(draw * (n - 1)) + 1);
  const shown = pts.slice(0, visible);
  const d = shown.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p.rub).toFixed(1)}`).join(' ');
  const last = shown[shown.length - 1];
  const lx = x(shown.length - 1);
  const ly = y(last.rub);
  const focusIdx = focusFrom ? pts.findIndex((p) => p.date >= focusFrom) : -1;
  const focusPts = focusIdx >= 0 ? shown.slice(focusIdx) : [];
  const fd = focusPts.map((p, i) => `${i ? 'L' : 'M'}${x(focusIdx + i).toFixed(1)},${y(p.rub).toFixed(1)}`).join(' ');
  const peakIdx = pts.reduce((best, p, i) => (p.rub > pts[best].rub ? i : best), 0);
  const gid = `g${width}${height}${color.replace('#', '')}`;
  return (
    <svg width={width} height={height} style={{overflow: 'visible'}}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={focusFrom ? color : baseColor ?? color} stopOpacity={0.28} />
          <stop offset="100%" stopColor={focusFrom ? color : baseColor ?? color} stopOpacity={0} />
        </linearGradient>
        <filter id={`${gid}glow`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>
      {gridLabels &&
        [40, 60, 80].filter((v) => v > yMin && v < yMax).map((v) => (
          <g key={v}>
            <line x1={0} x2={width} y1={y(v)} y2={y(v)} stroke={C.border} strokeWidth={1.5} strokeDasharray="4 10" />
            <text x={width + 14} y={y(v) + 7} fill={C.dim} fontFamily={F.mono} fontSize={20}>
              {v} ₽
            </text>
          </g>
        ))}
      {area && <path d={`${d} L${lx},${height} L0,${height} Z`} fill={`url(#${gid})`} />}
      <path d={d} fill="none" stroke={baseColor ?? color} strokeWidth={stroke} strokeLinejoin="round" strokeLinecap="round" opacity={baseColor ? 0.9 : 1} />
      {focusPts.length > 1 && (
        <>
          <path d={fd} fill="none" stroke={color} strokeWidth={stroke + 6} opacity={0.35 * focusT} filter={`url(#${gid}glow)`} />
          <path d={fd} fill="none" stroke={color} strokeWidth={stroke} strokeLinejoin="round" strokeLinecap="round" opacity={focusT} />
        </>
      )}
      {!focusFrom && <path d={d} fill="none" stroke={color} strokeWidth={stroke + 8} opacity={0.25} filter={`url(#${gid}glow)`} />}
      {peakLabel && peakIdx < visible && (
        <g opacity={peakT}>
          <circle cx={x(peakIdx)} cy={y(pts[peakIdx].rub)} r={9} fill={C.canvas} stroke={C.ivory} strokeWidth={3} />
          <foreignObject x={x(peakIdx) - 160} y={y(pts[peakIdx].rub) - 92} width={320} height={70}>
            <div style={{display: 'flex', justifyContent: 'center'}}>{peakLabel}</div>
          </foreignObject>
        </g>
      )}
      {showEnd && (
        <g>
          <circle cx={lx} cy={ly} r={22} fill={color} opacity={0.18} />
          <circle cx={lx} cy={ly} r={10} fill={color} />
          {endLabel && (
            <foreignObject x={lx - 300} y={ly + 22} width={300} height={90}>
              <div style={{display: 'flex', justifyContent: 'flex-end'}}>{endLabel}</div>
            </foreignObject>
          )}
        </g>
      )}
    </svg>
  );
};

export const chartFacts = {peak: chart.peak as Pt, last: chart.last as Pt, source: chart.source};
