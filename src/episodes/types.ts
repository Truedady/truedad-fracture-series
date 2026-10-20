export type Rect = {x: number; y: number; w: number; h: number};

export type Caption = {text: string; key: boolean; start: number; end: number};

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
  footage: {src: string; width: number; height: number};
  captions: Caption[][];
  /** Scene boundaries in seconds, cut on spoken-word onsets from the timing sheet. */
  beats: Record<string, number>;
  /** Word onsets (seconds) used for on-beat accents. */
  cues: Record<string, number>;
  sfx: SfxCue[];
  bed: {file: string; volume: number};
};
