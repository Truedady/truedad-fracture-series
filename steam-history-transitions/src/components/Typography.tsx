import React from 'react';
import {C, FONT} from '../lib/theme';
import {E, k} from '../lib/anim';

/** «ГЛАВА 01» — моно, разрядка сжимается при появлении. */
export const ChapterLabel: React.FC<{num: string; f: number; start: number; color?: string; accent?: string}> = ({
  num,
  f,
  start,
  color = C.muted,
  accent = C.gold,
}) => {
  const o = k(f, [start, start + 12], [0, 1], E.out);
  const sp = k(f, [start, start + 18], [0.7, 0.42], E.out);
  const line = k(f, [start + 2, start + 16], [0, 34], E.out);
  return (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, opacity: o}}>
      <div style={{width: line, height: 1.5, background: accent}} />
      <div style={{fontFamily: FONT.mono, fontWeight: 500, fontSize: 21, letterSpacing: `${sp}em`, color, paddingLeft: `${sp}em`}}>
        ГЛАВА {num}
      </div>
      <div style={{width: line, height: 1.5, background: accent}} />
    </div>
  );
};

/** Годы главы: золотые моно-цифры, линии раскрываются из центра. */
export const Years: React.FC<{text: string; f: number; start: number; color?: string; size?: number}> = ({
  text,
  f,
  start,
  color = C.gold,
  size = 38,
}) => {
  const o = k(f, [start, start + 10], [0, 1]);
  const y = k(f, [start, start + 16], [14, 0], E.out);
  const line = k(f, [start + 4, start + 22], [0, 120], E.out);
  return (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 26, opacity: o, transform: `translateY(${y}px)`}}>
      <div style={{width: line, height: 1, background: `linear-gradient(90deg, transparent, ${color})`}} />
      <div style={{fontFamily: FONT.mono, fontWeight: 500, fontSize: size, letterSpacing: '0.18em', color, paddingLeft: '0.18em', fontVariantNumeric: 'tabular-nums'}}>
        {text}
      </div>
      <div style={{width: line, height: 1, background: `linear-gradient(90deg, ${color}, transparent)`}} />
    </div>
  );
};

/**
 * Хронологическая шкала фильма 2010–2026. Главы — это отрезки, а не точки,
 * поэтому пересекающиеся периоды отображаются честно.
 */
export const Chronology: React.FC<{from: number; to: number; f: number; start: number; width?: number; accent?: string}> = ({
  from,
  to,
  f,
  start,
  width = 1040,
  accent = C.gold,
}) => {
  const Y0 = 2010;
  const Y1 = 2026;
  const x = (y: number) => ((y - Y0) / (Y1 - Y0)) * width;
  const base = k(f, [start, start + 18], [0, 1], E.out);
  const span = k(f, [start + 8, start + 28], [0, 1], E.out);
  const o = k(f, [start, start + 8], [0, 1]);
  const keyYears = [2010, 2013, 2017, 2018, 2021, 2023, 2026];
  const a = x(from);
  const b = x(to);
  const single = from === to;
  return (
    <div style={{position: 'relative', width, height: 40, opacity: o}}>
      <div style={{position: 'absolute', left: 0, top: 20, height: 1, width: width * base, background: C.line}} />
      {Array.from({length: Y1 - Y0 + 1}, (_, i) => {
        const yr = Y0 + i;
        const isKey = keyYears.includes(yr);
        const inSpan = yr >= from && yr <= to;
        const appear = k(f, [start + i * 0.8, start + i * 0.8 + 8], [0, 1]);
        return (
          <div
            key={yr}
            style={{
              position: 'absolute',
              left: x(yr) - 0.75,
              top: isKey ? 13 : 16,
              width: 1.5,
              height: isKey ? 14 : 8,
              background: inSpan ? accent : isKey ? C.dim : C.line,
              opacity: appear,
            }}
          />
        );
      })}
      {single ? (
        <div
          style={{
            position: 'absolute',
            left: a - 6,
            top: 14,
            width: 12,
            height: 12,
            borderRadius: 6,
            border: `1.5px solid ${accent}`,
            background: C.bg,
            transform: `scale(${span})`,
          }}
        />
      ) : (
        <div style={{position: 'absolute', left: a, top: 19, height: 3, width: (b - a) * span, background: accent, borderRadius: 2}} />
      )}
      {[Y0, Y1].map((yr) => (
        <div
          key={yr}
          style={{
            position: 'absolute',
            left: x(yr) + (yr === Y0 ? -64 : 18),
            top: 10,
            fontFamily: FONT.mono,
            fontSize: 15,
            letterSpacing: '0.1em',
            color: C.dim,
            opacity: base,
          }}
        >
          {yr}
        </div>
      ))}
    </div>
  );
};
