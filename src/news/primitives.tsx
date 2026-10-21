import React, {createContext, useContext} from 'react';
import {AbsoluteFill, Easing, OffthreadVideo, Sequence, interpolate, staticFile, useVideoConfig} from 'remotion';
import {C, FONT, LAYOUT} from './brand';
import type {Cam, Header, Mark, NewsEpisode, Shot, Word} from './types';

// Master-timeline seconds, shared through context so Sequences don't reset the clock.
export const TimeCtx = createContext(0);
export const useT = () => useContext(TimeCtx);

const EASE = Easing.bezier(0.33, 0, 0.2, 1);
const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** 0..1 progress of an entrance that starts at `t0` and lasts `d` seconds. */
export const enter = (t: number, t0: number, d = 0.35) => interpolate(t, [t0, t0 + d], [0, 1], {...clamp, easing: OUT});
/** Entrance at t0, exit at t1 (both eased). */
export const life = (t: number, t0: number, t1 = Infinity, d = 0.3) =>
  Math.min(enter(t, t0, d), t1 === Infinity ? 1 : interpolate(t, [t1 - d, t1], [1, 0], {...clamp, easing: EASE}));

const TRANS = 0.3; // shot transition, seconds

// ---------------------------------------------------------------- camera

const camAt = (cams: Cam[], t: number) => {
  if (t <= cams[0].t) return cams[0];
  for (let i = 1; i < cams.length; i++) {
    const a = cams[i - 1];
    const b = cams[i];
    if (t <= b.t) {
      const p = EASE((t - a.t) / Math.max(0.001, b.t - a.t));
      return {t, cx: a.cx + (b.cx - a.cx) * p, cy: a.cy + (b.cy - a.cy) * p, w: Math.exp(Math.log(a.w) + (Math.log(b.w) - Math.log(a.w)) * p)};
    }
  }
  return cams[cams.length - 1];
};

type View = {left: number; top: number; s: number};

const viewFor = (ep: NewsEpisode, shot: Shot, t: number): View => {
  const {win} = LAYOUT;
  const cam = camAt(shot.cam, t);
  const {x0, y0, x1, y1} = ep.safeSource;
  const w = Math.min(cam.w, x1 - x0, (y1 - y0) * (win.w / win.h));
  const h = (w * win.h) / win.w;
  const left = Math.min(Math.max(cam.cx - w / 2, x0), x1 - w);
  const top = Math.min(Math.max(cam.cy - h / 2, y0), y1 - h);
  return {left, top, s: win.w / w};
};

const MarkBox: React.FC<{m: Mark; v: View; t: number}> = ({m, v, t}) => {
  const a = life(t, m.t0, m.t1, 0.28);
  if (a <= 0) return null;
  const col = m.tone === 'green' ? C.green : m.tone === 'red' ? C.red : C.gold;
  const pad = 10;
  const x = (m.x - v.left) * v.s - pad;
  const y = (m.y - v.top) * v.s - pad;
  const w = m.w * v.s + pad * 2;
  const h = m.h * v.s + pad * 2;
  const grow = interpolate(a, [0, 1], [1.08, 1]);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, opacity: a, transform: `scale(${grow})`}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: 14, border: `4px solid ${col}`, boxShadow: `0 0 0 2400px rgba(5,7,10,${0.5 * a}), 0 0 28px ${col}66`}} />
      {m.label ? (
        <div
          style={{
            position: 'absolute',
            left: -4,
            ...(m.labelSide === 'bottom' ? {top: h + 12} : {bottom: h + 12}),
            background: col,
            color: C.bg,
            fontFamily: FONT.sans,
            fontWeight: 900,
            fontSize: 30,
            letterSpacing: 0.5,
            padding: '8px 16px',
            borderRadius: 10,
            whiteSpace: 'nowrap',
          }}
        >
          {m.label}
        </div>
      ) : null}
    </div>
  );
};

const ShotView: React.FC<{ep: NewsEpisode; shot: Shot; first: boolean}> = ({ep, shot, first}) => {
  const t = useT();
  const {fps} = useVideoConfig();
  const {win} = LAYOUT;
  const rate = shot.src.rate ?? 1;
  const pre = first ? 0 : TRANS;
  const startFrom = Math.max(0, Math.round((shot.src.start - pre * rate) * fps));
  const v = viewFor(ep, shot, t);
  const p = first ? 1 : interpolate(t, [shot.from - TRANS, shot.from], [0, 1], {...clamp, easing: EASE});
  const zoomIn = first ? interpolate(t, [0, 0.5], [1.06, 1], {...clamp, easing: OUT}) : interpolate(p, [0, 1], [1.07, 1]);
  return (
    <AbsoluteFill style={{clipPath: p < 1 ? `inset(0 ${(1 - p) * 100}% 0 0)` : undefined}}>
      <AbsoluteFill style={{transform: `scale(${zoomIn})`, transformOrigin: '50% 50%'}}>
        <OffthreadVideo
          src={staticFile(ep.footage)}
          startFrom={startFrom}
          playbackRate={rate}
          muted
          style={{position: 'absolute', left: -v.left * v.s, top: -v.top * v.s, width: ep.footageSize.w * v.s, height: ep.footageSize.h * v.s, maxWidth: 'none'}}
        />
        {shot.dim ? <AbsoluteFill style={{background: `rgba(6,8,11,${shot.dim})`}} /> : null}
        {(shot.marks ?? []).map((m, i) => (
          <MarkBox key={i} m={m} v={v} t={t} />
        ))}
      </AbsoluteFill>
      {shot.Overlay ? <shot.Overlay /> : null}
      {shot.label ? <SourceLabel text={shot.label} t={t} t0={shot.from} /> : null}
      {p < 1 ? <div style={{position: 'absolute', top: 0, bottom: 0, left: p * win.w - 3, width: 6, background: C.gold, boxShadow: `0 0 24px ${C.gold}`}} /> : null}
    </AbsoluteFill>
  );
};

const SourceLabel: React.FC<{text: string; t: number; t0: number}> = ({text, t, t0}) => {
  const a = enter(t, t0 + 0.1, 0.4);
  return (
    <div
      style={{
        position: 'absolute',
        left: 22,
        top: 22,
        opacity: a,
        transform: `translateX(${(1 - a) * -20}px)`,
        background: 'rgba(11,14,19,0.82)',
        border: `1px solid ${C.line}`,
        borderRadius: 10,
        padding: '9px 14px',
        fontFamily: FONT.mono,
        fontWeight: 700,
        fontSize: 21,
        letterSpacing: 1.5,
        color: C.muted,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}
    >
      <span style={{width: 9, height: 9, borderRadius: 9, background: C.gold}} />
      {text}
    </div>
  );
};

/** The evidence window: real footage with camera moves and transitions. */
export const EvidenceWindow: React.FC<{ep: NewsEpisode}> = ({ep}) => {
  const t = useT();
  const {fps} = useVideoConfig();
  const {win} = LAYOUT;
  return (
    <div
      style={{
        position: 'absolute',
        left: win.x,
        top: win.y,
        width: win.w,
        height: win.h,
        borderRadius: 26,
        overflow: 'hidden',
        background: C.panel,
        boxShadow: '0 30px 80px rgba(0,0,0,0.55)',
      }}
    >
      {ep.shots.map((s, i) => {
        const from = Math.round((s.from - (i ? TRANS : 0)) * fps);
        const dur = Math.round((s.to + (i < ep.shots.length - 1 ? 0.05 : 0)) * fps) - from;
        return (
          <Sequence key={s.id} from={from} durationInFrames={dur} layout="none">
            <ShotView ep={ep} shot={s} first={i === 0} />
          </Sequence>
        );
      })}
      <div style={{position: 'absolute', inset: 0, borderRadius: 26, border: `1.5px solid ${C.line}`, pointerEvents: 'none'}} />
      <Corners />
      <div style={{position: 'absolute', left: 0, bottom: 0, height: 5, width: `${(t / ep.durationSec) * 100}%`, background: C.gold}} />
    </div>
  );
};

const Corners: React.FC = () => {
  const L = 34;
  const st = (pos: React.CSSProperties, b: string): React.CSSProperties => ({position: 'absolute', width: L, height: L, ...pos, [b]: `4px solid ${C.gold}`});
  return (
    <>
      <div style={{...st({right: 14, top: 14}, 'borderTop'), borderRight: `4px solid ${C.gold}`, borderTopRightRadius: 12}} />
      <div style={{...st({left: 14, bottom: 14}, 'borderBottom'), borderLeft: `4px solid ${C.gold}`, borderBottomLeftRadius: 12}} />
    </>
  );
};

// ---------------------------------------------------------------- chrome

export const Backdrop: React.FC = () => (
  <AbsoluteFill style={{background: `radial-gradient(120% 70% at 50% 40%, ${C.bg2} 0%, ${C.bg} 70%)`}}>
    <AbsoluteFill
      style={{
        opacity: 0.07,
        backgroundSize: '72px 72px',
        backgroundImage: 'linear-gradient(#8a97a8 1px,transparent 1px),linear-gradient(90deg,#8a97a8 1px,transparent 1px)',
      }}
    />
  </AbsoluteFill>
);

export const BrandBar: React.FC<{topic: string; date: string}> = ({topic, date}) => {
  return (
    <div style={{position: 'absolute', top: 104, left: LAYOUT.side, right: LAYOUT.side, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: FONT.sans}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 14, fontWeight: 900, fontSize: 34, letterSpacing: 1}}>
        <span style={{color: C.white}}>
          TRUE<span style={{color: C.gold}}>DAD</span>
        </span>
        <span style={{background: C.gold, color: C.bg, fontSize: 22, padding: '5px 10px 4px', borderRadius: 6, letterSpacing: 2}}>NEWS</span>
      </div>
      <div style={{fontFamily: FONT.mono, fontWeight: 500, fontSize: 22, color: C.muted, letterSpacing: 1.5}}>
        {topic} · {date}
      </div>
    </div>
  );
};

const HeaderLine: React.FC<{h: Header; next?: Header; t: number}> = ({h, next, t}) => {
  const inA = h.from <= 0 ? 1 : enter(t, h.from, 0.42);
  const outA = next ? interpolate(t, [next.from - 0.05, next.from + 0.25], [0, 1], {...clamp, easing: EASE}) : 0;
  if (t < h.from - 0.01 || outA >= 1) return null;
  const size = h.size ?? 70;
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <div style={{overflow: 'hidden', height: 40}}>
        <div
          style={{
            transform: `translateY(${(1 - inA) * 40 - outA * 40}px)`,
            fontFamily: FONT.mono,
            fontWeight: 700,
            fontSize: 25,
            letterSpacing: 3,
            color: C.gold,
          }}
        >
          {h.tag}
        </div>
      </div>
      <div style={{overflow: 'hidden', marginTop: 6, paddingBottom: 6}}>
        <div
          style={{
            transform: `translateY(${(1 - inA) * 110 - outA * 150}%)`,
            fontFamily: FONT.sans,
            fontWeight: 900,
            fontSize: size,
            lineHeight: 1.02,
            letterSpacing: -1,
            color: h.accent ?? C.white,
            textWrap: 'balance',
          } as React.CSSProperties}
        >
          {h.title}
        </div>
      </div>
    </div>
  );
};

export const Headers: React.FC<{headers: Header[]}> = ({headers}) => {
  const t = useT();
  return (
    <div style={{position: 'absolute', top: 166, left: LAYOUT.side, right: LAYOUT.side, height: 210}}>
      {headers.map((h, i) => (
        <HeaderLine key={i} h={h} next={headers[i + 1]} t={t} />
      ))}
    </div>
  );
};

// ---------------------------------------------------------------- captions

type Phrase = {words: Word[]; start: number; end: number};

export const toPhrases = (words: Word[], maxChars = 24): Phrase[] => {
  const out: Phrase[] = [];
  let cur: Word[] = [];
  const flush = () => {
    if (cur.length) out.push({words: cur, start: cur[0].start, end: cur[cur.length - 1].end});
    cur = [];
  };
  words.forEach((w, i) => {
    const len = cur.reduce((n, x) => n + x.text.length + 1, 0);
    const prev = words[i - 1];
    if (cur.length && (len + w.text.length > maxChars || (prev && w.start - prev.end > 0.35))) flush();
    cur.push(w);
    if (/[.:!?]$/.test(w.text) || (/,$/.test(w.text) && cur.length >= 2)) flush();
  });
  flush();
  // keep each phrase on screen until the next one starts
  out.forEach((p, i) => (p.end = Math.max(p.end + 0.15, Math.min(out[i + 1]?.start ?? p.end + 0.4, p.end + 0.6))));
  return out;
};

export const Captions: React.FC<{words: Word[]}> = ({words}) => {
  const t = useT();
  const phrases = React.useMemo(() => toPhrases(words), [words]);
  const p = phrases.find((x) => t >= x.start - 0.04 && t < x.end);
  if (!p) return null;
  const a = enter(t, p.start - 0.04, 0.16);
  return (
    <div
      style={{
        position: 'absolute',
        top: LAYOUT.captionsY,
        left: LAYOUT.side - 10,
        right: LAYOUT.side - 10,
        textAlign: 'center',
        fontFamily: FONT.sans,
        fontWeight: 800,
        fontSize: 60,
        lineHeight: 1.12,
        letterSpacing: -0.5,
        opacity: a,
        transform: `translateY(${(1 - a) * 14}px) scale(${0.97 + a * 0.03})`,
        textShadow: '0 4px 18px rgba(0,0,0,0.6)',
      }}
    >
      {p.words.map((w, i) => {
        const on = t >= w.start - 0.03;
        // the spoken word stays highlighted until the next one starts
        const now = on && (i === p.words.length - 1 || t < p.words[i + 1].start - 0.03);
        return (
          <span key={i} style={{color: now ? C.gold : on ? C.white : 'rgba(244,241,233,0.42)'}}>
            {w.text}
            {i < p.words.length - 1 ? ' ' : ''}
          </span>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------- overlay helpers

/** Glass card used inside the evidence window or on the frame. */
export const Card: React.FC<{style?: React.CSSProperties; children: React.ReactNode; a?: number}> = ({style, children, a = 1}) => (
  <div
    style={{
      background: 'rgba(13,16,22,0.9)',
      border: `1.5px solid ${C.line}`,
      borderRadius: 22,
      boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
      opacity: a,
      transform: `translateY(${(1 - a) * 26}px)`,
      fontFamily: FONT.sans,
      color: C.white,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Kicker: React.FC<{children: React.ReactNode; color?: string}> = ({children, color = C.gold}) => (
  <div style={{fontFamily: FONT.mono, fontWeight: 700, fontSize: 23, letterSpacing: 2.5, color}}>{children}</div>
);

export const TelegramIcon: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 240 240">
    <circle cx="120" cy="120" r="120" fill={C.tg} />
    <path d="M54 117.5c35-15.2 58.3-25.3 70-30.2 33.3-13.9 40.2-16.3 44.7-16.4 1 0 3.2.2 4.7 1.4 1.2 1 1.5 2.3 1.7 3.3.2 1 .4 3.1.2 4.8-1.8 19-9.6 65.1-13.6 86.4-1.7 9-5 12-8.2 12.3-7 .6-12.3-4.6-19-9.1-10.6-7-16.6-11.3-26.9-18.1-11.9-7.8-4.2-12.1 2.6-19.1 1.8-1.8 32.6-29.9 33.2-32.4.1-.3.1-1.5-.6-2.2-.7-.6-1.8-.4-2.5-.2-1.1.2-17.8 11.3-50.3 33.2-4.8 3.3-9.1 4.9-13 4.8-4.3-.1-12.5-2.4-18.6-4.4-7.5-2.4-13.4-3.7-12.9-7.8.3-2.2 3.2-4.4 8.9-6.6z" fill="#fff" />
  </svg>
);
