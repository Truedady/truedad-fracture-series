import React from 'react';
import {Composition, getInputProps} from 'remotion';
import {ChapterFilm, chapterSeconds} from './ChapterFilm';
import {DRAFT_SECONDS, Draft14to18} from './Draft14to18';
import {ensureFonts} from './fonts';
import {CHAPTERS} from './scenes';

ensureFonts();

// Холст 1920×1080; 2K = --scale 4/3 → 2560×1440. fps из props (30 по умолчанию, 60 для финала).
const fps = Number((getInputProps() as {fps?: number}).fps ?? 30);

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Draft14to18" component={Draft14to18} durationInFrames={Math.round(DRAFT_SECONDS * fps)} fps={fps} width={1920} height={1080} />
    {CHAPTERS.map((c) => (
      <Composition
        key={c.id}
        id={c.id}
        component={ChapterFilm}
        defaultProps={{chapter: c.id}}
        durationInFrames={Math.round(chapterSeconds(c.scenes) * fps)}
        fps={fps}
        width={1920}
        height={1080}
      />
    ))}
  </>
);
