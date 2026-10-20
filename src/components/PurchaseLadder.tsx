import React from 'react';
import {C, F} from '../brand/tokens';

export const dailyQty = (day: number, start: number, step: number) => start + step * (day - 1);
export const cumulative = (days: number, start: number, step: number) => days * start + (step * days * (days - 1)) / 2;

/**
 * 2.5D bar ladder of the 30-day plan. Bought days are solid gold; planned days are outlined,
 * so the plan is never mistaken for executed purchases.
 */
export const PurchaseLadder: React.FC<{
  width: number;
  height: number;
  days: number;
  start: number;
  step: number;
  bought: number;
  reveal: (i: number) => number;
  labels?: Record<number, number>; // bar index -> label opacity
  activeIdx?: number;
  depth?: number;
  /** Opacity of the dashed full-plan skeleton drawn behind the bars. */
  ghost?: number;
}> = ({width, height, days, start, step, bought, reveal, labels = {}, activeIdx = -1, depth = 14, ghost = 0}) => {
  const max = dailyQty(days, start, step);
  const gap = 7;
  const bw = (width - depth - gap * (days - 1)) / days;
  const dy = depth * 0.62;
  return (
    <svg width={width} height={height + 70} style={{overflow: 'visible'}}>
      <defs>
        <linearGradient id="ladFront" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.goldHi} />
          <stop offset="100%" stopColor="#8A6A22" />
        </linearGradient>
        <linearGradient id="ladPlan" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.gold} stopOpacity={0.34} />
          <stop offset="100%" stopColor={C.gold} stopOpacity={0.06} />
        </linearGradient>
      </defs>
      <line x1={0} x2={width} y1={height + 0.5} y2={height + 0.5} stroke={C.border} strokeWidth={2} />
      {ghost > 0 &&
        new Array(days).fill(0).map((_, i) => {
          const gh = (dailyQty(i + 1, start, step) / max) * (height - 40);
          return <rect key={`g${i}`} x={i * (bw + gap)} y={height - gh} width={bw} height={gh} fill="none" stroke={C.gold} strokeOpacity={0.22 * ghost} strokeWidth={1.5} strokeDasharray="4 5" />;
        })}
      {new Array(days).fill(0).map((_, i) => {
        const t = Math.max(0, Math.min(1, reveal(i)));
        if (t <= 0) return null;
        const q = dailyQty(i + 1, start, step);
        const h = (q / max) * (height - 40) * t;
        const x = i * (bw + gap);
        const y = height - h;
        const isBought = i < bought;
        const active = i === activeIdx;
        const front = isBought ? 'url(#ladFront)' : 'url(#ladPlan)';
        const stroke = isBought ? 'none' : C.gold;
        const lo = labels[i] ?? 0;
        return (
          <g key={i} opacity={Math.min(1, t * 3)}>
            <polygon points={`${x + bw},${y} ${x + bw + depth},${y - dy} ${x + bw + depth},${height - dy} ${x + bw},${height}`} fill={isBought ? '#6E5419' : 'rgba(217,169,61,0.08)'} />
            <polygon points={`${x},${y} ${x + depth},${y - dy} ${x + bw + depth},${y - dy} ${x + bw},${y}`} fill={isBought ? '#F7D98C' : 'rgba(217,169,61,0.35)'} />
            <rect x={x} y={y} width={bw} height={h} fill={front} stroke={stroke} strokeWidth={isBought ? 0 : 1.5} strokeOpacity={0.7} />
            {active && <rect x={x - 4} y={y - dy - 6} width={bw + depth + 8} height={h + dy + 6} fill="none" stroke={C.ivory} strokeWidth={2} rx={3} />}
            {lo > 0 && (
              <text
                x={x + bw / 2 + depth / 2}
                y={y - dy - 16 - (1 - lo) * 10}
                textAnchor="middle"
                fill={isBought ? C.gold : C.ivory}
                fontFamily={F.mono}
                fontWeight={600}
                fontSize={30}
                opacity={lo}
              >
                {q}
              </text>
            )}
          </g>
        );
      })}
      {[1, 10, 20, 30].filter((d) => d <= days).map((d) => (
        <text key={d} x={(d - 1) * (bw + gap) + bw / 2} y={height + 40} textAnchor="middle" fill={C.dim} fontFamily={F.mono} fontSize={22}>
          Д{d}
        </text>
      ))}
    </svg>
  );
};
