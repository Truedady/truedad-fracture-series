import React from 'react';
import {Composition} from 'remotion';
import {FractureDay1, episodeFrames} from './FractureDay1';
import {FPS, H, W} from './brand/tokens';
import {day01} from './episodes/day01';

export const RemotionRoot: React.FC = () => (
  <Composition id="FractureDay1" component={FractureDay1} durationInFrames={episodeFrames(day01)} fps={FPS} width={W} height={H} />
);
