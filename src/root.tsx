import React from 'react';
import {Composition} from 'remotion';
import {FractureDay1} from './FractureDay1';
import {ProofInsert, proofInsertSchema} from './proof-insert/ProofInsert';
import {FPS, SOURCE_FRAMES} from './proof-insert/timeline';

export const RemotionRoot: React.FC = () => (
	<>
		<Composition id="FractureDay1" component={FractureDay1} durationInFrames={1322} fps={30} width={1080} height={1920} />
		<Composition
			id="ProofInsert"
			component={ProofInsert}
			schema={proofInsertSchema}
			defaultProps={{motionBlur: true, motionBlurSamples: 8, showLabel: false, sfxVolume: 0.5}}
			durationInFrames={SOURCE_FRAMES}
			fps={FPS}
			width={2560}
			height={1440}
		/>
	</>
);
