import React from 'react';
import {Composition} from 'remotion';
import {FractureDay1} from './FractureDay1';
import {TrueDadNews} from './news/TrueDadNews';
import {evilGeniuses01} from './news/episodes/evilGeniuses01';

const FPS = 30;

// Episode configs hold React overlays, so they are bound here rather than passed as (serialised) props.
const EvilGeniuses01: React.FC = () => <TrueDadNews episode={evilGeniuses01} />;

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="FractureDay1" component={FractureDay1} durationInFrames={1322} fps={FPS} width={1080} height={1920} />
    <Composition
      id="TrueDadNews-EvilGeniuses01"
      component={EvilGeniuses01}
      durationInFrames={Math.round(evilGeniuses01.durationSec * FPS)}
      fps={FPS}
      width={1080}
      height={1920}
    />
  </>
);
