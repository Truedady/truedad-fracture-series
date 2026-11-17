import React from 'react';
import {Composition} from 'remotion';
import {ensureFonts} from './lib/fonts';
import {FPS, H, W} from './lib/theme';
import {CHAPTERS} from './chapters';

ensureFonts();

/*
 * Все композиции авторские в 1920×1080 @ 30 fps (векторная графика).
 * 4K-мастер получается рендером с --scale=2 (3840×2160) без потери резкости.
 */
export const RemotionRoot: React.FC = () => (
  <>
    {CHAPTERS.map((c) => (
      <Composition key={c.id} id={c.id} component={c.component} durationInFrames={c.duration} fps={FPS} width={W} height={H} />
    ))}
  </>
);
