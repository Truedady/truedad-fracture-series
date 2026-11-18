import React from 'react';
import {Composition, getInputProps} from 'remotion';
import {CHAPTERS} from './chapters';
import {Film, layout} from './film';
import {ensureFonts} from './fonts';

ensureFonts();

// Холст 1920×1080; рендер в 2K (--scale 4/3 → 2560×1440). fps из props: 30 по умолчанию, 60 для финала.
const fps = Number((getInputProps() as {fps?: number}).fps ?? 30);

// props в Remotion — JSON, поэтому передаём id главы, а сцены берём здесь
const ChapterComp: React.FC<{chapter: string}> = ({chapter}) => <Film scenes={CHAPTERS.find((c) => c.id === chapter)?.scenes ?? []} />;

export const RemotionRoot: React.FC = () => (
  <>
    {CHAPTERS.map((c) => (
      <Composition key={c.id} id={c.id} component={ChapterComp} defaultProps={{chapter: c.id}} durationInFrames={Math.round(layout(c.scenes).total * fps)} fps={fps} width={1920} height={1080} />
    ))}
  </>
);
