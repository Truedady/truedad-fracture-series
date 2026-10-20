import type {Episode} from '../episodes/types';

/** Every scene receives the episode config plus its absolute start (s) and Sequence length (frames). */
export type SceneProps = {ep: Episode; start: number; dur: number};
