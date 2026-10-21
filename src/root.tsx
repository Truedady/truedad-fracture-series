import React from 'react';
import {Composition} from 'remotion';
import {FractureDay1, episodeFrames} from './FractureDay1';
import {FractureDay2} from './FractureDay2';
import {FPS, H, W} from './brand/tokens';
import {day01} from './episodes/day01';
import {day02} from './episodes/day02';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="FractureDay1" component={FractureDay1} durationInFrames={episodeFrames(day01)} fps={FPS} width={W} height={H} />
    <Composition id="FractureDay2" component={FractureDay2} durationInFrames={episodeFrames(day02)} fps={FPS} width={W} height={H} />
  </>
);
