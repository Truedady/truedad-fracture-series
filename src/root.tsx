import React from 'react';
import {Composition} from 'remotion';
import {TrueDadNewsCinema} from './core/TrueDadNewsCinema';
import {DAYS} from './days';

const FPS = 30;

// Episodes hold React components (Opening), so they are bound here rather than passed as serialised props.
const bind = (id: string): React.FC => () => <TrueDadNewsCinema episode={DAYS[id]} />;

export const RemotionRoot: React.FC = () => (
  <>
    {Object.entries(DAYS).map(([id, ep]) => (
      <Composition key={id} id={id} component={bind(id)} durationInFrames={Math.round(ep.durationSec * FPS)} fps={FPS} width={1080} height={1920} />
    ))}
  </>
);
