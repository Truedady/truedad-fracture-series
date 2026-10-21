export type Rect = {x: number; y: number; w: number; h: number};

export type Caption = {text: string; key: boolean; start: number; end: number};

/** Screen recording. `coordW × coordH` is the reference space all crop rects are measured in. */
export type Footage = {src: string; coordW: number; coordH: number};

/** Where each real shot lives in the footage file (seconds) and how fast to play it. */
export type Clip = {from: number; rate?: number};

/** Camera keyframe / spotlight over the recording (see components/FootageStage). */
export type ShotKey = {at: number; rect: Rect; cy?: number; move?: number};
export type SpotKey = {from: number; to: number; rect: Rect; pad?: number};

/** A real shot from the recording: where it starts in the file, its camera path and highlights. */
export type StageClip = Clip & {shots: ShotKey[]; spots?: SpotKey[]};

/** Day-over-day market numbers, read from the recordings (never estimated). */
export type MarketDay = {lots: number; minPrice: number; orderPrice: number; qty: number};

/** Format of daily update episodes (day 2+): mostly real footage with numbers laid over it. */
export type DailyUpdate = {
  yesterday: MarketDay;
  today: MarketDay;
  stages: Record<'hook' | 'intro' | 'market' | 'order' | 'myOrder' | 'success' | 'inventory' | 'forecast', StageClip>;
};

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
  clips: Record<string, Clip>;
  captions: Caption[][];
  /** Scene boundaries in seconds, cut on spoken-word onsets from the timing sheet. */
  beats: Record<string, number>;
  /** Word onsets (seconds) used for on-beat accents. */
  cues: Record<string, number>;
  sfx: SfxCue[];
  bed: {file: string; volume: number};
  daily?: DailyUpdate;
  /** Top of the caption block (px). Default SAFE.captionY. */
  captionY?: number;
  /** Show the episode progress bar under the HUD (Day 01 style). Default true. */
  hudProgress?: boolean;
};
