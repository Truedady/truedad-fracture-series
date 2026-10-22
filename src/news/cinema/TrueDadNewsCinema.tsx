import React, {useMemo} from 'react';
import {AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT, loadBrandFonts} from '../brand';
import {EASE, TelegramIcon, TimeCtx, camAt, enter, toPhrases, useT} from '../primitives';
import type {Cam, SfxKind, Word} from '../types';

loadBrandFonts();

// "Cinema" variant of TrueDad News: footage-first, few long takes, no drawn cards or frames.
// Emphasis comes only from effects on the real footage (camera, soft spotlight, focus pulls).
// Text lives in two fixed zones (title on top, captions below the footage) that never overlap.

/** Soft spotlight in SOURCE pixels: everything outside is dimmed with a feathered edge. */
export type Spot = {t0: number; t1: number; x: number; y: number; w: number; h: number};

export type CinemaShot = {
  id: string;
  from: number;
  to: number;
  src: {start: number; rate?: number};
  cam: Cam[];
  spots?: Spot[];
  /** Per-shot top limit in source px (e.g. keep an ad banner out of frame). */
  minY?: number;
};

export type CinemaTitle = {from: number; kicker: string; title: string; icon?: 'telegram'; titleColor?: string};

export type CinemaEpisode = {
  footage: string;
  footageSize: {w: number; h: number};
  safeSource: {x0: number; y0: number; x1: number; y1: number};
  voice: string;
  words: Word[];
  durationSec: number;
  dateStamp: string;
  shots: CinemaShot[];
  titles: CinemaTitle[];
  /** Line shown in the caption zone after the voiceover ends. */
  outro?: {from: number; text: string};
  sfx: {at: number; kind: SfxKind; volume?: number}[];
  /** Footage only: no titles, captions, brand bar or outro. */
  textless?: boolean;
  /** With `textless`, still show the word captions (top edge in px). */
  captions?: {y: number};
  /** Sharp footage panel; the rest of the frame is the same footage blurred. Default 1080x1080 at y=404. */
  panel?: {y: number; h: number};
  /** Opening title over the bottom of the panel (the only graphic in a footage-first cut). */
  intro?: Intro;
  /** Full-frame opening graphic shown until the first footage shot (which then focus-pulls in over it). */
  Opening?: React.FC;
};

export type Intro = {until: number; kicker: string; big: string; bigSuffix?: string; line: string};

const DEFAULT_PANEL = {y: 404, h: 1080};
const PANEL_W = 1080;
const CAPTIONS_Y = 1518;
const XFADE = 0.6;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const view = (ep: CinemaEpisode, shot: CinemaShot, t: number) => {
  const panel = ep.panel ?? DEFAULT_PANEL;
  const aspect = panel.h / PANEL_W;
  const cam = camAt(shot.cam, t);
  const {x0, x1, y1} = ep.safeSource;
  const y0 = Math.max(ep.safeSource.y0, shot.minY ?? 0);
  const w = Math.min(cam.w, x1 - x0, (y1 - y0) / aspect);
  const h = w * aspect;
  const left = Math.min(Math.max(cam.cx - w / 2, x0), x1 - w);
  const top = Math.min(Math.max(cam.cy - h / 2, y0), y1 - h);
  return {left, top, s: PANEL_W / w, cx: left + w / 2, cy: top + h / 2};
};

const Spotlight: React.FC<{spot: Spot; v: {left: number; top: number; s: number}; t: number}> = ({spot, v, t}) => {
  const a = Math.min(enter(t, spot.t0, 0.6), interpolate(t, [spot.t1 - 0.5, spot.t1], [1, 0], {...clamp, easing: EASE}));
  if (a <= 0) return null;
  const pad = 26;
  return (
    <div
      style={{
        position: 'absolute',
        left: (spot.x - v.left) * v.s - pad,
        top: (spot.y - v.top) * v.s - pad,
        width: spot.w * v.s + pad * 2,
        height: spot.h * v.s + pad * 2,
        borderRadius: 28,
        boxShadow: `0 0 90px 2600px rgba(4,6,9,${0.58 * a})`,
      }}
    />
  );
};

const Shot: React.FC<{ep: CinemaEpisode; shot: CinemaShot; first: boolean}> = ({ep, shot, first}) => {
  const t = useT();
  const {fps} = useVideoConfig();
  const rate = shot.src.rate ?? 1;
  const pre = first ? 0 : XFADE;
  const startFrom = Math.max(0, Math.round((shot.src.start - pre * rate) * fps));
  const v = view(ep, shot, t);
  // focus pull in: incoming shot sharpens, settles from a slight scale
  const p = first ? 1 : interpolate(t, [shot.from - XFADE, shot.from], [0, 1], {...clamp, easing: EASE});
  const src = staticFile(ep.footage);
  const {w: FW, h: FH} = ep.footageSize;
  const panel = ep.panel ?? DEFAULT_PANEL;
  // background: same footage, heavily blurred, scaled to cover the frame
  const bs = 1920 / FH;
  const bgLeft = 540 - v.cx * bs;
  return (
    <AbsoluteFill style={{opacity: p}}>
      <AbsoluteFill style={{filter: `blur(46px) brightness(0.38) saturate(1.15)`, transform: 'scale(1.15)'}}>
        <OffthreadVideo src={src} startFrom={startFrom} playbackRate={rate} muted style={{position: 'absolute', left: Math.min(0, Math.max(1080 - FW * bs, bgLeft)), top: 0, width: FW * bs, height: 1920, maxWidth: 'none'}} />
      </AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: panel.y,
          width: PANEL_W,
          height: panel.h,
          overflow: 'hidden',
          filter: p < 1 ? `blur(${(1 - p) * 14}px)` : undefined,
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0, #000 5%, #000 95%, transparent 100%)',
          maskImage: 'linear-gradient(to bottom, transparent 0, #000 5%, #000 95%, transparent 100%)',
        }}
      >
        <AbsoluteFill style={{transform: `scale(${1 + (1 - p) * 0.04})`}}>
          <OffthreadVideo
            src={src}
            startFrom={startFrom}
            playbackRate={rate}
            muted
            style={{position: 'absolute', left: -v.left * v.s, top: -v.top * v.s, width: FW * v.s, height: FH * v.s, maxWidth: 'none', filter: 'contrast(1.06) saturate(1.08)'}}
          />
          {(shot.spots ?? []).map((s, i) => (
            <Spotlight key={i} spot={s} v={v} t={t} />
          ))}
          <AbsoluteFill style={{background: 'radial-gradient(90% 90% at 50% 50%, transparent 55%, rgba(4,6,9,0.45) 100%)'}} />
        </AbsoluteFill>
      </div>
    </AbsoluteFill>
  );
};

const TopBar: React.FC<{date: string}> = ({date}) => (
  <div style={{position: 'absolute', top: 104, left: 64, right: 64, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
    <div style={{fontFamily: FONT.sans, fontWeight: 900, fontSize: 30, letterSpacing: 1, color: C.white}}>
      TRUE<span style={{color: C.gold}}>DAD</span>
      <span style={{fontFamily: FONT.mono, fontWeight: 700, fontSize: 21, letterSpacing: 4, color: C.muted, marginLeft: 16}}>NEWS</span>
    </div>
    <div style={{fontFamily: FONT.mono, fontWeight: 500, fontSize: 21, letterSpacing: 2, color: C.muted}}>{date}</div>
  </div>
);

// One title at a time: the old one is fully gone before the new one starts.
const Titles: React.FC<{titles: CinemaTitle[]}> = ({titles}) => {
  const t = useT();
  const i = titles.findIndex((x, k) => t >= x.from && t < (titles[k + 1]?.from ?? Infinity));
  if (i < 0) return null;
  const h = titles[i];
  const next = titles[i + 1];
  const a = h.from <= 0 ? 1 : enter(t, h.from, 0.55);
  const out = next ? interpolate(t, [next.from - 0.35, next.from], [0, 1], {...clamp, easing: EASE}) : 0;
  const k = a * (1 - out);
  return (
    <div style={{position: 'absolute', top: 178, left: 64, right: 64, opacity: k, filter: k < 1 ? `blur(${(1 - k) * 8}px)` : undefined, transform: `translateY(${(1 - a) * 14 - out * 8}px)`}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 12, fontFamily: FONT.mono, fontWeight: 700, fontSize: 23, letterSpacing: 3, color: C.gold}}>
        {h.icon === 'telegram' ? <TelegramIcon size={34} /> : null}
        {h.kicker}
      </div>
      <div style={{marginTop: 14, fontFamily: FONT.sans, fontWeight: 900, fontSize: 66, lineHeight: 1.04, letterSpacing: -1, color: h.titleColor ?? C.white, textWrap: 'balance'} as React.CSSProperties}>{h.title}</div>
    </div>
  );
};

const Captions: React.FC<{words: Word[]; until: number; y?: number}> = ({words, until, y = CAPTIONS_Y}) => {
  const t = useT();
  const phrases = useMemo(() => toPhrases(words, 22), [words]);
  const p = phrases.find((x) => t >= x.start - 0.04 && t < x.end);
  if (!p || t >= until) return null;
  const a = enter(t, p.start - 0.04, 0.18);
  return (
    <div style={{position: 'absolute', top: y, left: 70, right: 70, textAlign: 'center', fontFamily: FONT.sans, fontWeight: 800, fontSize: 56, lineHeight: 1.14, opacity: a, transform: `translateY(${(1 - a) * 10}px)`, textShadow: '0 3px 16px rgba(0,0,0,0.7)'}}>
      {p.words.map((w, i) => {
        const on = t >= w.start - 0.03;
        const now = on && (i === p.words.length - 1 || t < p.words[i + 1].start - 0.03);
        return (
          <span key={i} style={{color: now ? C.gold : on ? C.white : 'rgba(244,241,233,0.45)'}}>
            {w.text}
            {i < p.words.length - 1 ? ' ' : ''}
          </span>
        );
      })}
    </div>
  );
};

// Opening title: sits on a soft scrim at the bottom of the footage panel, gone by `until`.
const IntroTitle: React.FC<{intro: Intro; panel: {y: number; h: number}}> = ({intro, panel}) => {
  const t = useT();
  const out = interpolate(t, [intro.until - 0.45, intro.until], [1, 0], {...clamp, easing: EASE});
  if (out <= 0) return null;
  const k = enter(t, 0.05, 0.4);
  const big = enter(t, 0.15, 0.55);
  const line = enter(t, 0.45, 0.6);
  const bottom = panel.y + panel.h;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: bottom - 420, height: 420, opacity: out, filter: out < 1 ? `blur(${(1 - out) * 8}px)` : undefined}}>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(6,8,11,0) 0%, rgba(6,8,11,0.82) 45%, rgba(6,8,11,0.92) 100%)'}} />
      <div style={{position: 'absolute', left: 64, right: 64, bottom: 70}}>
        <div style={{opacity: k, transform: `translateY(${(1 - k) * 12}px)`, fontFamily: FONT.mono, fontWeight: 700, fontSize: 25, letterSpacing: 4, color: C.gold}}>{intro.kicker}</div>
        <div style={{overflow: 'hidden', marginTop: 8}}>
          <div style={{transform: `translateY(${(1 - big) * 105}%)`, display: 'flex', alignItems: 'baseline', gap: 18, fontFamily: FONT.sans, fontWeight: 900, letterSpacing: -3, lineHeight: 1, color: C.white}}>
            <span style={{fontSize: 150}}>{intro.big}</span>
            {intro.bigSuffix ? <span style={{fontSize: 64, color: C.muted, letterSpacing: -1}}>{intro.bigSuffix}</span> : null}
          </div>
        </div>
        <div style={{height: 4, width: 420 * line, background: C.gold, borderRadius: 2, marginTop: 18}} />
        <div style={{opacity: line, marginTop: 16, fontFamily: FONT.sans, fontWeight: 800, fontSize: 36, letterSpacing: 1, color: C.white}}>{intro.line}</div>
      </div>
    </div>
  );
};

const Outro: React.FC<{from: number; text: string}> = ({from, text}) => {
  const t = useT();
  const a = enter(t, from, 0.6);
  if (a <= 0) return null;
  return (
    <div style={{position: 'absolute', top: CAPTIONS_Y + 6, left: 90, right: 90, textAlign: 'center', opacity: a, filter: a < 1 ? `blur(${(1 - a) * 6}px)` : undefined, fontFamily: FONT.sans, fontWeight: 700, fontSize: 40, lineHeight: 1.25, color: C.white}}>
      {text}
    </div>
  );
};

const SFX_VOL: Record<SfxKind, number> = {whoosh: 0.16, swish: 0.14, hit: 0.3, tick: 0.12, pop: 0.22, riser: 0.12, boom: 0.35, shimmer: 0.16, click: 0.25, key: 0.15};

export const TrueDadNewsCinema: React.FC<{episode: CinemaEpisode}> = ({episode: ep}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const lastWord = ep.words[ep.words.length - 1].end;
  return (
    <TimeCtx.Provider value={t}>
      <AbsoluteFill style={{background: C.bg, overflow: 'hidden'}}>
        {ep.Opening ? (
          <Sequence from={0} durationInFrames={Math.round(ep.shots[0].from * fps) + 1} layout="none">
            <ep.Opening />
          </Sequence>
        ) : null}
        {ep.shots.map((s, i) => {
          const from = Math.round((s.from > 0 ? s.from - XFADE : 0) * fps);
          const dur = Math.round(s.to * fps) - from;
          return (
            <Sequence key={s.id} from={from} durationInFrames={dur} layout="none">
              <Shot ep={ep} shot={s} first={s.from === 0} />
            </Sequence>
          );
        })}
        <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(11,14,19,0.55) 0%, transparent 22%, transparent 78%, rgba(11,14,19,0.6) 100%)'}} />
        {ep.intro ? <IntroTitle intro={ep.intro} panel={ep.panel ?? DEFAULT_PANEL} /> : null}
        {ep.textless && ep.captions ? <Captions words={ep.words} until={Infinity} y={ep.captions.y} /> : null}
        {ep.textless ? null : (
          <>
            <TopBar date={ep.dateStamp} />
            <Titles titles={ep.titles} />
            <Captions words={ep.words} until={ep.outro?.from ?? Infinity} />
            {ep.outro && t >= lastWord ? <Outro {...ep.outro} /> : null}
          </>
        )}
        <Audio src={staticFile(ep.voice)} />
        {ep.sfx.map((s, i) => (
          <Sequence key={i} from={Math.max(0, Math.round(s.at * fps))} layout="none">
            <Audio src={staticFile(`news/sfx/${s.kind}.wav`)} volume={s.volume ?? SFX_VOL[s.kind]} />
          </Sequence>
        ))}
      </AbsoluteFill>
    </TimeCtx.Provider>
  );
};
