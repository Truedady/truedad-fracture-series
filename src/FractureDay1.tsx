import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {ensureFonts} from './brand/fonts';
import {Backdrop, Finish, Hud} from './brand/primitives';
import {C} from './brand/tokens';
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

// Scene order is fixed for the series; each scene starts on its beat from the episode config.
const SCENES: Array<[keyof Episode['beats'], React.FC<SceneProps>]> = [
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

export const FractureEpisode: React.FC<{ep: Episode}> = ({ep}) => {
  const end = episodeFrames(ep);
  return (
    <AbsoluteFill style={{background: C.canvas, overflow: 'hidden'}}>
      <Backdrop />
      {SCENES.map(([key, Scene], i) => {
        const startS = ep.beats[key];
        const from = sec(startS);
        const next = SCENES[i + 1];
        const to = next ? sec(ep.beats[next[0]]) + OVERLAP : end;
        return (
          <Sequence key={key} from={from} durationInFrames={to - from} name={key} premountFor={30}>
            <Scene ep={ep} start={startS} dur={to - from} />
          </Sequence>
        );
      })}
      <Hud day={ep.day} totalDays={ep.totalDays} caseName={ep.caseName} />
      <AbsoluteFill style={{background: 'linear-gradient(to bottom, transparent 62%, rgba(11,14,19,0.82) 74%, rgba(11,14,19,0.82) 86%, transparent 100%)'}} />
      <CaptionLayer pages={ep.captions} />
      <Finish />
      <SoundDesign ep={ep} />
    </AbsoluteFill>
  );
};

export const FractureDay1: React.FC = () => <FractureEpisode ep={day01} />;
