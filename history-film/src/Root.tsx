import React from 'react';
import {Composition, getInputProps} from 'remotion';
import {DRAFT_SECONDS, Draft14to18} from './Draft14to18';
import {ensureFonts} from './fonts';

ensureFonts();

// Холст 1920×1080. Черновик: --scale 2/3 → 1280×720 @30. Финал: --scale 4/3 → 2560×1440 @60 (fps из props).
const fps = Number((getInputProps() as {fps?: number}).fps ?? 30);

export const RemotionRoot: React.FC = () => (
  <Composition
    id="Draft14to18"
    component={Draft14to18}
    durationInFrames={Math.round(DRAFT_SECONDS * fps)}
    fps={fps}
    width={1920}
    height={1080}
    defaultProps={{voicePending: true}}
  />
);
