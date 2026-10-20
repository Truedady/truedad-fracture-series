import React from 'react';
import {C, F} from '../brand/tokens';
import {dailyQty} from './PurchaseLadder';

/** 30-day experiment calendar. Day cells stagger in; today is gold; report days can be flagged. */
export const DayCounter: React.FC<{
  days: number;
  today: number;
  start: number;
  step: number;
  reveal: (i: number) => number;
  cols?: number;
  cell?: number;
  showQty?: number;
  markDays?: number[];
  markT?: number;
  doneDays?: number;
}> = ({days, today, start, step, reveal, cols = 6, cell = 136, showQty = 1, markDays = [], markT = 0, doneDays = 0}) => {
  const gap = 12;
  const ch = cell * 0.74;
  return (
    <div style={{display: 'grid', gridTemplateColumns: `repeat(${cols}, ${cell}px)`, gap, perspective: 1200}}>
      {new Array(days).fill(0).map((_, i) => {
        const d = i + 1;
        const t = Math.max(0, Math.min(1, reveal(i)));
        const isToday = d === today;
        const isDone = d <= doneDays;
        const marked = markDays.includes(d);
        return (
          <div
            key={d}
            style={{
              height: ch,
              borderRadius: 14,
              position: 'relative',
              background: isToday ? `linear-gradient(160deg, ${C.goldHi}, ${C.gold} 60%, #9A7526)` : 'linear-gradient(180deg,#1A2029,#141920)',
              border: `1.5px solid ${isToday ? C.gold : marked && markT > 0 ? `rgba(217,169,61,${0.3 + 0.7 * markT})` : C.border}`,
              opacity: t,
              transform: `rotateX(${(1 - t) * -70}deg) translateY(${(1 - t) * 24}px)`,
              transformOrigin: '50% 100%',
              padding: '12px 14px',
              boxShadow: isToday ? `0 0 40px ${C.gold}55` : 'none',
              boxSizing: 'border-box',
            }}
          >
            <div style={{fontFamily: F.mono, fontSize: 22, fontWeight: 600, color: isToday ? C.canvas : C.muted, letterSpacing: 1}}>
              {String(d).padStart(2, '0')}
            </div>
            <div
              style={{
                position: 'absolute',
                right: 14,
                bottom: 10,
                fontFamily: F.display,
                fontWeight: 800,
                fontSize: 30,
                color: isToday ? C.canvas : C.ivory,
                opacity: isToday ? 1 : 0.55 * showQty,
              }}
            >
              {dailyQty(d, start, step)}
            </div>
            {isDone && !isToday && (
              <div style={{position: 'absolute', right: 12, top: 10, fontFamily: F.mono, fontSize: 22, color: C.gold}}>✓</div>
            )}
            {marked && markT > 0 && (
              <div
                style={{
                  position: 'absolute',
                  left: 12,
                  bottom: 12,
                  width: 12,
                  height: 12,
                  borderRadius: 12,
                  background: C.gold,
                  opacity: markT,
                  boxShadow: `0 0 14px ${C.gold}`,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
