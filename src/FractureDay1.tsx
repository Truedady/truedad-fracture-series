import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {ensureFonts} from './brand/fonts';
import {Backdrop, Finish, Hud} from './brand/primitives';
import {C, H, SAFE} from './brand/tokens';
import {CaptionLayer} from './components/CaptionLayer';
import {SoundDesign} from './components/SoundDesign';
import {day01} from './episodes/day01';
import type {Episode} from './episodes/types';
import {sec} from './lib/anim';
import {EvidenceScene, HookScene, QuestionScene} from './scenes/OpeningScenes';
import {CaseHeroScene, CalendarScene, LadderScene, ResolveScene, TotalScene} from './scenes/PlanScenes';
import {OutroCTA, PortfolioScene, ProofScene, TomorrowScene} from './scenes/ProofScenes';
import type {SceneProps} from './scenes/types';

ensureFonts();

export type SceneList = Array<[string, React.FC<SceneProps>]>;

// Day 01 launch format; each scene starts on its beat from the episode config.
const DAY01_SCENES: SceneList = [
  ['hook', HookScene],
  ['evidence', EvidenceScene],
  ['question', QuestionScene],
  ['calendar', CalendarScene],
  ['caseHero', CaseHeroScene],
  ['ladder', LadderScene],
  ['total', TotalScene],
  ['resolve', ResolveScene],
  ['proof', ProofScene],
  ['portfolio', PortfolioScene],
  ['tomorrow', TomorrowScene],
  ['cta', OutroCTA],
];

const OVERLAP = 4; // frames the outgoing scene keeps playing under the incoming one

export const episodeFrames = (ep: Episode) => Math.ceil(ep.voDurationSec * 30);

/** Shared episode shell: backdrop, scenes on beats, HUD, captions, grain, sound. */
export const FractureEpisode: React.FC<{ep: Episode; scenes: SceneList}> = ({ep, scenes}) => {
  const end = episodeFrames(ep);
  const capY = ep.captionY ?? SAFE.captionY;
  return (
    <AbsoluteFill style={{background: C.canvas, overflow: 'hidden'}}>
      <Backdrop />
      {scenes.map(([key, Scene], i) => {
        const startS = ep.beats[key];
        const from = sec(startS);
        const next = scenes[i + 1];
        const to = next ? sec(ep.beats[next[0]]) + OVERLAP : end;
        return (
          <Sequence key={key} from={from} durationInFrames={to - from} name={key} premountFor={30}>
            <Scene ep={ep} start={startS} dur={to - from} />
          </Sequence>
        );
      })}
      <Hud day={ep.day} totalDays={ep.totalDays} caseName={ep.caseName} />
      <AbsoluteFill
        style={{
          background: `linear-gradient(to bottom, transparent ${((capY - 140) / H) * 100}%, rgba(11,14,19,0.82) ${((capY + 90) / H) * 100}%, rgba(11,14,19,0.82) ${((capY + 320) / H) * 100}%, transparent 100%)`,
        }}
      />
      <CaptionLayer pages={ep.captions} y={capY} />
      <Finish />
      <SoundDesign ep={ep} />
    </AbsoluteFill>
  );
};

export const FractureDay1: React.FC = () => <FractureEpisode ep={day01} scenes={DAY01_SCENES} />;
