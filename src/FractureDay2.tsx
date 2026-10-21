import React from 'react';
import {FractureEpisode, type SceneList} from './FractureDay1';
import {day02} from './episodes/day02';
import {DailyForecast, DailyHook, DailyIntro, DailyInventory, DailyMarket, DailyMyOrder, DailyOrder, DailySuccess} from './scenes/DailyScenes';

// Daily update format (day 2+): real footage first, numbers over the interface.
export const DAILY_SCENES: SceneList = [
  ['hook', DailyHook],
  ['intro', DailyIntro],
  ['market', DailyMarket],
  ['order', DailyOrder],
  ['myOrder', DailyMyOrder],
  ['success', DailySuccess],
  ['inventory', DailyInventory],
  ['forecast', DailyForecast],
];

export const FractureDay2: React.FC = () => <FractureEpisode ep={day02} scenes={DAILY_SCENES} />;
