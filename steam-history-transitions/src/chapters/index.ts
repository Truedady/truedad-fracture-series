import React from 'react';
import {CH01_DURATION, Ch01FirstTrades} from './Ch01FirstTrades';
import {CH02_DURATION, Ch02CsgoSkins} from './Ch02CsgoSkins';
import {CH03_DURATION, Ch03RegionalGames} from './Ch03RegionalGames';
import {CH07_DURATION, Ch07WorstSpring} from './Ch07WorstSpring';

export const CHAPTERS: {id: string; component: React.FC; duration: number}[] = [
  {id: 'Ch01-FirstTrades', component: Ch01FirstTrades, duration: CH01_DURATION},
  {id: 'Ch02-CsgoSkins', component: Ch02CsgoSkins, duration: CH02_DURATION},
  {id: 'Ch03-RegionalGames', component: Ch03RegionalGames, duration: CH03_DURATION},
  {id: 'Ch07-WorstSpring', component: Ch07WorstSpring, duration: CH07_DURATION},
];
