import React from 'react';
import {Composition} from 'remotion';
import {FractureDay1} from './FractureDay1';
import {TrueDadNews} from './news/TrueDadNews';
import {evilGeniuses01} from './news/episodes/evilGeniuses01';
import {TrueDadNewsCinema} from './news/cinema/TrueDadNewsCinema';
import {evilGeniuses01Cinema} from './news/cinema/evilGeniuses01Cinema';
import {evilGeniuses01Footage} from './news/cinema/evilGeniuses01Footage';
import {fractureDay02Footage} from './news/cinema/fractureDay02Footage';

const FPS = 30;

// Episode configs hold React overlays, so they are bound here rather than passed as (serialised) props.
const EvilGeniuses01: React.FC = () => <TrueDadNews episode={evilGeniuses01} />;
const EvilGeniuses01Cinema: React.FC = () => <TrueDadNewsCinema episode={evilGeniuses01Cinema} />;
const EvilGeniuses01Footage: React.FC = () => <TrueDadNewsCinema episode={evilGeniuses01Footage} />;
const FractureDay02Footage: React.FC = () => <TrueDadNewsCinema episode={fractureDay02Footage} />;

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
    <Composition
      id="TrueDadNewsCinema-EvilGeniuses01"
      component={EvilGeniuses01Cinema}
      durationInFrames={Math.round(evilGeniuses01Cinema.durationSec * FPS)}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="TrueDadNewsFootage-EvilGeniuses01"
      component={EvilGeniuses01Footage}
      durationInFrames={Math.round(evilGeniuses01Footage.durationSec * FPS)}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="FractureDay02-Footage"
      component={FractureDay02Footage}
      durationInFrames={Math.round(fractureDay02Footage.durationSec * FPS)}
      fps={FPS}
      width={1080}
      height={1920}
    />
  </>
);
