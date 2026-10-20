import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import type {Episode} from '../episodes/types';
import {sec} from '../lib/anim';

/** Voiceover (untouched), quiet bed and on-meaning SFX cues from the episode config. */
export const SoundDesign: React.FC<{ep: Episode}> = ({ep}) => (
  <>
    <Audio src={staticFile(ep.voiceover)} volume={1} />
    <Audio src={staticFile(ep.bed.file)} volume={ep.bed.volume} />
    {ep.sfx.map((c, i) => (
      <Sequence key={i} from={sec(c.at)} layout="none">
        <Audio src={staticFile(`assets/sfx/${c.file}`)} volume={c.volume} />
      </Sequence>
    ))}
  </>
);
