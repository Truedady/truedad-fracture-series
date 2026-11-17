import React from 'react';
import {CH01_DURATION, Ch01FirstTrades} from './Ch01FirstTrades';
import {CH02_DURATION, Ch02CsgoSkins} from './Ch02CsgoSkins';
import {CH03_DURATION, Ch03RegionalGames} from './Ch03RegionalGames';
import {CH04_DURATION, Ch04MarketsBots} from './Ch04MarketsBots';
import {CH05_DURATION, Ch05SteamGuard} from './Ch05SteamGuard';
import {CH06_DURATION, Ch06Pubg} from './Ch06Pubg';
import {CH07_DURATION, Ch07WorstSpring} from './Ch07WorstSpring';

import {CH08_DURATION, Ch08InvestBoom} from './Ch08InvestBoom';
import {CH09_DURATION, Ch09Stickers} from './Ch09Stickers';
import {CH10_DURATION, Ch10Cs2Release} from './Ch10Cs2Release';
import {CH11_DURATION, Ch11NewEconomy} from './Ch11NewEconomy';
import {NARR01_DURATION, Narr01} from '../narration/Narr01';
import {NARR02_DURATION, Narr02} from '../narration/Narr02';

export const CHAPTERS: {id: string; component: React.FC; duration: number}[] = [
  {id: 'Ch01-FirstTrades', component: Ch01FirstTrades, duration: CH01_DURATION},
  {id: 'Ch02-CsgoSkins', component: Ch02CsgoSkins, duration: CH02_DURATION},
  {id: 'Ch03-RegionalGames', component: Ch03RegionalGames, duration: CH03_DURATION},
  {id: 'Ch04-MarketsBots', component: Ch04MarketsBots, duration: CH04_DURATION},
  {id: 'Ch05-SteamGuard', component: Ch05SteamGuard, duration: CH05_DURATION},
  {id: 'Ch06-Pubg', component: Ch06Pubg, duration: CH06_DURATION},
  {id: 'Ch07-WorstSpring', component: Ch07WorstSpring, duration: CH07_DURATION},
  {id: 'Ch08-InvestBoom', component: Ch08InvestBoom, duration: CH08_DURATION},
  {id: 'Ch09-Stickers', component: Ch09Stickers, duration: CH09_DURATION},
  {id: 'Ch10-Cs2Release', component: Ch10Cs2Release, duration: CH10_DURATION},
  {id: 'Ch11-NewEconomy', component: Ch11NewEconomy, duration: CH11_DURATION},
  {id: 'Narr01-FirstTrades', component: Narr01, duration: NARR01_DURATION},
  {id: 'Narr02-CsgoSkins', component: Narr02, duration: NARR02_DURATION},
];
