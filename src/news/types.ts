import type React from 'react';

// All times are seconds on the master (voiceover) timeline unless noted.

/** Virtual camera over the source footage: centre + width in SOURCE pixels. Height follows the window aspect. */
export type Cam = {t: number; cx: number; cy: number; w: number};

/** Highlight rectangle in SOURCE pixel coordinates; follows the camera. */
export type Mark = {
  t0: number;
  t1?: number;
  x: number;
  y: number;
  w: number;
  h: number;
  tone?: 'gold' | 'green' | 'red';
  label?: string;
  labelSide?: 'top' | 'bottom';
};

export type Shot = {
  id: string;
  from: number;
  to: number;
  /** Source footage time (s) that is on screen at `from`, and playback rate. */
  src: {start: number; rate?: number};
  cam: Cam[];
  /** Small source label in the window corner, e.g. "STEAM COMMUNITY MARKET". */
  label?: string;
  dim?: number;
  marks?: Mark[];
  /** Window-space overlay (1008x1050 box). */
  Overlay?: React.FC;
};

export type Header = {from: number; tag: string; title: string; accent?: string; size?: number};

export type SfxKind = 'whoosh' | 'swish' | 'hit' | 'tick' | 'pop' | 'riser';
export type Sfx = {at: number; kind: SfxKind; volume?: number};

export type Word = {text: string; start: number; end: number};

export type NewsEpisode = {
  id: string;
  footage: string;
  footageSize: {w: number; h: number};
  /** Usable source area (crops browser chrome / taskbar / personal UI). */
  safeSource: {x0: number; y0: number; x1: number; y1: number};
  voice: string;
  words: Word[];
  durationSec: number;
  topic: string;
  dateStamp: string;
  headers: Header[];
  shots: Shot[];
  sfx: Sfx[];
  /** Full-frame overlays on the master timeline (date cards, CTA). */
  Overlay?: React.FC;
};
