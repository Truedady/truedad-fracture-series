import React from 'react';
import {C, FONT} from '../lib/theme';
import {E, k, lerp} from '../lib/anim';
import {hexA} from './Atmosphere';
import {ChapterLabel, Chronology, Years} from './Typography';

/*
 * Универсальный блок названия главы. Единая раскладка для всего фильма,
 * но у каждой главы — своя анимация появления (variant) и ухода (exit).
 */
export type TitleVariant = 'rise' | 'wipe' | 'type' | 'stamp' | 'split' | 'riseMask' | 'scan' | 'track' | 'bar';
export type ExitKind = 'fly' | 'collapse' | 'lift';

type Props = {
  f: number;
  num: string;
  lines: string[];
  years: string;
  sub?: React.ReactNode;
  from: number;
  to: number;
  start: number; // кадр, с которого начинается титр
  exitStart: number; // кадр начала ухода
  variant: TitleVariant;
  exit?: ExitKind;
  size?: number;
  accent?: string;
  lineAccent?: string; // цвет световой линии в wipe/scan
};

const W = 1920;

export const TitleBlock: React.FC<Props> = ({
  f,
  num,
  lines,
  years,
  sub,
  from,
  to,
  start,
  exitStart,
  variant,
  exit = 'fly',
  size = 146,
  accent = C.gold,
  lineAccent = C.goldHi,
}) => {
  const lh = Math.round(size * 1.03);
  const n = lines.length;
  const top = n === 1 ? 392 : n === 2 ? 340 : 300;
  const labelTop = top - 50;
  const yearsTop = top + n * lh + 30;
  const subTop = yearsTop + 70;
  const titleEnd = start + 14 + lines.join('').length * (variant === 'type' ? 1 : 0.6);

  // ── уход ───────────────────────────────────────────────────────
  const ex = k(f, [exitStart, exitStart + 20], [0, 1], E.in);
  let groupStyle: React.CSSProperties = {};
  let collapse = 0;
  if (exit === 'fly') {
    groupStyle = {opacity: 1 - k(f, [exitStart, exitStart + 16], [0, 1], E.in), transform: `scale(${1 + ex * 0.16})`, filter: `blur(${ex * 10}px)`};
  } else if (exit === 'lift') {
    groupStyle = {opacity: 1 - k(f, [exitStart, exitStart + 16], [0, 1], E.in), transform: `translateY(${-ex * 120}px)`, filter: `blur(${ex * 6}px)`};
  } else {
    collapse = k(f, [exitStart, exitStart + 8], [0, 1], E.hard);
  }
  const midY = top + (n * lh) / 2;
  const collapseClip = collapse > 0 ? `inset(${(midY / 1080) * 100 * collapse}% 0 ${((1080 - midY) / 1080) * 100 * collapse}% 0)` : undefined;
  const cLine = exit === 'collapse' ? k(f, [exitStart + 6, exitStart + 8], [0, 1]) * (1 - k(f, [exitStart + 9, exitStart + 14], [0, 1], E.in)) : 0;
  const cLineW = 1380 * (1 - k(f, [exitStart + 8, exitStart + 14], [0, 1], E.in));

  const baseText: React.CSSProperties = {
    fontFamily: FONT.display,
    fontWeight: variant === 'stamp' ? 900 : 700,
    fontSize: size,
    lineHeight: `${lh}px`,
    color: C.ivory,
    letterSpacing: variant === 'stamp' ? '0.02em' : '-0.005em',
    whiteSpace: 'pre',
    textAlign: 'center',
    textShadow: '0 10px 50px rgba(0,0,0,0.75)',
  };

  const renderLine = (text: string, li: number) => {
    const ls = variant === 'type' ? start + lines.slice(0, li).join('').length * 1.4 + li * 3 : start + li * 5;
    const y = top + li * lh;
    const wrap = (child: React.ReactNode, extra: React.CSSProperties = {}) => (
      <div key={li} style={{position: 'absolute', left: 0, right: 0, top: y, height: lh, ...baseText, ...extra}}>
        {child}
      </div>
    );
    switch (variant) {
      case 'rise':
        return wrap(
          text.split('').map((ch, i) => {
            const s = ls + i * 1.1;
            return (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  opacity: k(f, [s, s + 10], [0, 1]),
                  transform: `translateY(${k(f, [s, s + 20], [44, 0], E.out)}px)`,
                  filter: `blur(${k(f, [s, s + 14], [10, 0], E.out)}px)`,
                }}
              >
                {ch}
              </span>
            );
          }),
        );
      case 'riseMask': {
        const p = k(f, [ls, ls + 16], [0, 1], E.out);
        return wrap(<div style={{transform: `translateY(${(1 - p) * lh * 1.3}px)`}}>{text}</div>, {overflow: 'hidden'});
      }
      case 'wipe': {
        const p = k(f, [ls, ls + 16], [0, 1], E.inOut);
        const edge = lerp(-5, 105, p);
        return (
          <React.Fragment key={li}>
            {wrap(text, {clipPath: `inset(0 ${100 - edge}% 0 0)`})}
            <div
              style={{
                position: 'absolute',
                top: y + lh * 0.1,
                height: lh * 0.8,
                left: `${edge}%`,
                width: 3,
                background: lineAccent,
                boxShadow: `0 0 24px ${hexA(lineAccent, 0.8)}`,
                opacity: k(f, [ls, ls + 2, ls + 14, ls + 17], [0, 1, 1, 0]),
              }}
            />
          </React.Fragment>
        );
      }
      case 'type': {
        const shown = Math.floor(k(f, [ls, ls + text.length * 1.4], [0, text.length]));
        const done = shown >= text.length;
        const active = f >= ls && (!done ? true : li === n - 1 && Math.floor(f / 7) % 2 === 0);
        const cw = size * 0.07;
        return wrap(
          <>
            <span>{text.slice(0, shown)}</span>
            <span
              style={{
                display: 'inline-block',
                width: cw,
                marginRight: -cw,
                height: size * 0.74,
                verticalAlign: 'baseline',
                transform: `translate(${size * 0.05}px, ${size * 0.04}px)`,
                background: active ? accent : 'transparent',
              }}
            />
            <span style={{color: 'transparent', textShadow: 'none'}}>{text.slice(shown)}</span>
          </>,
        );
      }
      case 'stamp': {
        const words = text.split(' ');
        return wrap(
          words.map((w, wi) => {
            const s = ls + wi * 5;
            const p = k(f, [s, s + 6], [0, 1], E.out);
            return (
              <span key={wi} style={{display: 'inline-block', opacity: f >= s ? 1 : 0, transform: `scale(${lerp(1.35, 1, p)})`, filter: `blur(${(1 - p) * 6}px)`}}>
                {w}
                {wi < words.length - 1 ? ' ' : ''}
              </span>
            );
          }),
        );
      }
      case 'split': {
        const p = k(f, [ls, ls + 16], [0, 1], E.out);
        const o = k(f, [ls, ls + 6], [0, 1]);
        return (
          <React.Fragment key={li}>
            {wrap(text, {clipPath: 'inset(0 0 50% 0)', transform: `translateX(${(1 - p) * -160}px)`, opacity: o})}
            {wrap(text, {clipPath: 'inset(50% 0 0 0)', transform: `translateX(${(1 - p) * 160}px)`, opacity: o})}
          </React.Fragment>
        );
      }
      case 'scan': {
        const p = k(f, [ls, ls + 20], [0, 1], E.inOut);
        const edge = lerp(-5, 105, p);
        return (
          <React.Fragment key={li}>
            {wrap(text, {color: 'transparent', WebkitTextStroke: `1.5px ${hexA(C.ivory, 0.35)}`, opacity: k(f, [ls - 8, ls], [0, 1]), textShadow: 'none'})}
            {wrap(text, {clipPath: `inset(0 ${100 - edge}% 0 0)`})}
          </React.Fragment>
        );
      }
      case 'track': {
        const p = k(f, [ls, ls + 24], [0, 1], E.out);
        return wrap(text, {letterSpacing: `${lerp(0.45, -0.005, p)}em`, opacity: k(f, [ls, ls + 10], [0, 1]), filter: `blur(${(1 - p) * 8}px)`});
      }
      case 'bar': {
        const b = k(f, [ls, ls + 10], [0, 1], E.out);
        const t = k(f, [ls + 6, ls + 16], [0, 1]);
        return (
          <React.Fragment key={li}>
            <div
              style={{
                position: 'absolute',
                left: (W - 1500) / 2,
                width: 1500,
                top: y + 6,
                height: lh - 12,
                background: 'rgba(8,10,14,0.82)',
                transform: `scaleX(${b})`,
                borderLeft: `3px solid ${accent}`,
              }}
            />
            {wrap(text, {opacity: t, transform: `translateY(${(1 - t) * 10}px)`})}
          </React.Fragment>
        );
      }
    }
  };

  return (
    <>
      <div style={{position: 'absolute', inset: 0, ...groupStyle, clipPath: collapseClip}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: labelTop}}>
          <ChapterLabel num={num} f={f} start={start - 4} accent={accent} />
        </div>
        {lines.map(renderLine)}
        <div style={{position: 'absolute', left: 0, right: 0, top: yearsTop}}>
          <Years text={years} f={f} start={start + 12} color={accent} />
        </div>
        {sub && (
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: subTop,
              display: 'flex',
              justifyContent: 'center',
              gap: 46,
              fontFamily: FONT.mono,
              fontSize: 16,
              letterSpacing: '0.18em',
              color: C.muted,
              opacity: k(f, [start + 22, start + 34], [0, 0.9]),
            }}
          >
            {sub}
          </div>
        )}
        <div style={{position: 'absolute', left: (W - 1040) / 2, top: 900}}>
          <Chronology from={from} to={to} f={f} start={start + 18} accent={accent} />
        </div>
      </div>
      {exit === 'collapse' && (
        <div style={{position: 'absolute', left: W / 2 - cLineW / 2, top: midY - 1, width: cLineW, height: 2, background: C.ivory, opacity: cLine, boxShadow: `0 0 18px ${hexA(C.ivory, 0.5)}`}} />
      )}
    </>
  );
};

/** Короткая подпись-событие для строки под годами: «29.03 · ТЕКСТ» */
export const Ev: React.FC<{d?: string; children: React.ReactNode}> = ({d, children}) => (
  <span>
    {d && <span style={{color: C.ivory}}>{d} · </span>}
    {children}
  </span>
);
