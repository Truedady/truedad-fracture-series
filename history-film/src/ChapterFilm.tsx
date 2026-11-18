import React from 'react';
import {AbsoluteFill, Sequence, useVideoConfig} from 'remotion';
import {Fade} from './components';
import {Scene} from './kit';
import {CHAPTERS} from './scenes';
import {C} from './theme';

const XF = 0.5; // перекрытие планов (кроссфейд), сек

export const chapterSeconds = (scenes: Scene[]) => scenes.flatMap((s) => s.plans).reduce((a, p) => a + p.dur - XF, XF);

/** Глава: планы идут подряд с мягким кроссфейдом. */
// props передаются в Remotion как JSON, поэтому передаём только id главы, а планы берём здесь
export const ChapterFilm: React.FC<{chapter: string}> = ({chapter}) => {
  const {fps} = useVideoConfig();
  const scenes: Scene[] = CHAPTERS.find((c) => c.id === chapter)?.scenes ?? [];
  let t = 0;
  const items = scenes.flatMap((s) =>
    s.plans.map((p, i) => {
      const from = t;
      t += p.dur - XF;
      const El = p.el;
      return (
        <Sequence key={`${s.n}-${i}`} from={Math.round(from * fps)} durationInFrames={Math.round(p.dur * fps)} name={`Кадр ${s.n}${s.plans.length > 1 ? '.' + (i + 1) : ''}`}>
          <Fade fade={XF}>
            <El />
          </Fade>
        </Sequence>
      );
    }),
  );
  return <AbsoluteFill style={{background: C.black}}>{items}</AbsoluteFill>;
};
