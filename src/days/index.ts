import type {CinemaEpisode} from '../core/TrueDadNewsCinema';
import {day02} from './day02';

// Every day of the series. Composition ids: Day02, Day03 …
export const DAYS: Record<string, CinemaEpisode> = {
  Day02: day02,
};
