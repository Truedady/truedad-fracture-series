export type Rect = {x: number; y: number; w: number; h: number};

export type Caption = {text: string; key: boolean; start: number; end: number};

/** Screen recording. `coordW × coordH` is the reference space all crop rects are measured in. */
export type Footage = {src: string; coordW: number; coordH: number};

/** Where each real shot lives in the footage file (seconds) and how fast to play it. */
export type Clip = {from: number; rate?: number};

export type SfxCue = {at: number; file: string; volume: number};

export type Episode = {
  day: number;
  totalDays: number;
  caseName: string;
  caseNameRu: string;
  dailyStart: number;
  dailyStep: number;
  voiceover: string;
  voDurationSec: number;
  footage: Footage;
  clips: Record<'listing' | 'buyDialog' | 'buySuccess' | 'portfolio' | 'inventory', Clip>;
  captions: Caption[][];
  /** Scene boundaries in seconds, cut on spoken-word onsets from the timing sheet. */
  beats: Record<string, number>;
  /** Word onsets (seconds) used for on-beat accents. */
  cues: Record<string, number>;
  sfx: SfxCue[];
  bed: {file: string; volume: number};
};
