import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT, loadBrandFonts} from './brand';
import {Backdrop, BrandBar, Captions, EvidenceWindow, Headers, TimeCtx} from './primitives';
import type {NewsEpisode, SfxKind} from './types';

loadBrandFonts();

const SFX_VOL: Record<SfxKind, number> = {whoosh: 0.22, hit: 0.35, tick: 0.18, pop: 0.3, riser: 0.16};

/**
 * TrueDad News shell: brand bar, header, real-footage evidence window, word captions,
 * voiceover and light SFX. Each news story is a NewsEpisode config (see ./episodes).
 */
export const TrueDadNews: React.FC<{episode: NewsEpisode}> = ({episode: ep}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  return (
    <TimeCtx.Provider value={t}>
      <AbsoluteFill style={{background: C.bg, color: C.white, fontFamily: FONT.sans, overflow: 'hidden'}}>
        <Backdrop />
        <BrandBar topic={ep.topic} date={ep.dateStamp} />
        <Headers headers={ep.headers} />
        <EvidenceWindow ep={ep} />
        <Captions words={ep.words} />
        {ep.Overlay ? <ep.Overlay /> : null}
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
