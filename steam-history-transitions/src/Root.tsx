import React from 'react';
import {Composition} from 'remotion';
import {ensureFonts} from './lib/fonts';
import {FPS, H, W} from './lib/theme';
import {CH01_DURATION, Ch01FirstTrades} from './chapters/Ch01FirstTrades';
import {CH07_DURATION, Ch07WorstSpring} from './chapters/Ch07WorstSpring';

ensureFonts();

/*
 * Все композиции авторские в 1920×1080 @ 30 fps (векторная графика).
 * 4K-мастер получается рендером с --scale=2 (3840×2160) без потери резкости.
 */
export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Ch01-FirstTrades" component={Ch01FirstTrades} durationInFrames={CH01_DURATION} fps={FPS} width={W} height={H} />
    <Composition id="Ch07-WorstSpring" component={Ch07WorstSpring} durationInFrames={CH07_DURATION} fps={FPS} width={W} height={H} />
  </>
);
