import React from 'react';
import {Img, staticFile} from 'remotion';

/*
 * Реальные рендеры предметов (PNG с прозрачным фоном, обрезаны по краю) из public/skins/.
 * ratio = ширина / высота. kind — для раскладки (оружие / нож / пистолет / перчатки).
 * Названия указаны только там, где предмет опознан однозначно.
 */
export const SKINS = {
  akClawsA: {file: 'ak-claws-a.png', ratio: 3.288, kind: 'rifle'},
  akClawsB: {file: 'ak-claws-b.png', ratio: 3.36, kind: 'rifle'},
  bfCrimson: {file: 'butterfly-crimson-web.png', ratio: 5.629, kind: 'knife', name: 'BUTTERFLY KNIFE | CRIMSON WEB'},
  bfMarble: {file: 'butterfly-marble-fade.png', ratio: 5.466, kind: 'knife', name: 'BUTTERFLY KNIFE | MARBLE FADE'},
  karambitTiger: {file: 'karambit-tiger-tooth.png', ratio: 2.156, kind: 'knife', name: 'KARAMBIT | TIGER TOOTH'},
  talonPurple: {file: 'talon-purple.png', ratio: 2.838, kind: 'knife'},
  talonMarble: {file: 'talon-marble-fade.png', ratio: 2.852, kind: 'knife', name: 'TALON KNIFE | MARBLE FADE'},
  akFireSerpent: {file: 'ak-fire-serpent.png', ratio: 3.414, kind: 'rifle', name: 'AK-47 | FIRE SERPENT'},
  akDragon: {file: 'ak-dragon.png', ratio: 3.427, kind: 'rifle'},
  akVulcan: {file: 'ak-vulcan.png', ratio: 3.407, kind: 'rifle', name: 'AK-47 | VULCAN'},
  m4Red: {file: 'm4-red.png', ratio: 3.944, kind: 'rifle'},
  m4Cyan: {file: 'm4-cyan.png', ratio: 3.963, kind: 'rifle'},
  m4Blue: {file: 'm4-blue.png', ratio: 3.803, kind: 'rifle'},
  deagleBlue: {file: 'deagle-blue-camo.png', ratio: 1.796, kind: 'pistol'},
  awpLightning: {file: 'awp-lightning-strike.png', ratio: 5.045, kind: 'sniper', name: 'AWP | LIGHTNING STRIKE'},
  awpFade: {file: 'awp-fade.png', ratio: 4.533, kind: 'sniper'},
  awpNeon: {file: 'awp-neon.png', ratio: 5.075, kind: 'sniper'},
  awpRedline: {file: 'awp-redline.png', ratio: 5.09, kind: 'sniper', name: 'AWP | REDLINE'},
  deagleGreen: {file: 'deagle-green.png', ratio: 1.84, kind: 'pistol'},
  deagleBlaze: {file: 'deagle-blaze.png', ratio: 1.691, kind: 'pistol', name: 'DESERT EAGLE | BLAZE'},
  glovesPurple: {file: 'gloves-purple.png', ratio: 1.287, kind: 'gloves'},
  glovesGreen: {file: 'gloves-green.png', ratio: 1.296, kind: 'gloves'},
  glovesOrange: {file: 'gloves-orange.png', ratio: 1.296, kind: 'gloves'},
} as const;
export type SkinKey = keyof typeof SKINS;
export const SKIN_KEYS = Object.keys(SKINS) as SkinKey[];
export const WEAPONS: SkinKey[] = SKIN_KEYS.filter((k) => ['rifle', 'sniper', 'pistol'].includes(SKINS[k].kind));
export const KNIVES: SkinKey[] = SKIN_KEYS.filter((k) => SKINS[k].kind === 'knife');

/** Картинка скина, вписанная в прямоугольник w×h по центру. */
export const Skin: React.FC<{k: SkinKey; w: number; h?: number; style?: React.CSSProperties; imgStyle?: React.CSSProperties}> = ({k, w, h, style, imgStyle}) => {
  const s = SKINS[k];
  const box = h ?? w / s.ratio;
  const fitW = Math.min(w, box * s.ratio);
  return (
    <div style={{width: w, height: box, display: 'flex', alignItems: 'center', justifyContent: 'center', ...style}}>
      <Img src={staticFile(`skins/${s.file}`)} style={{width: fitW, height: 'auto', display: 'block', ...imgStyle}} />
    </div>
  );
};

export const skinUrl = (k: SkinKey) => staticFile(`skins/${SKINS[k].file}`);

// Редкость указываем только для опознанных предметов; остальные — нейтральная полоса.
const RARITY: Partial<Record<SkinKey, string>> = {
  akFireSerpent: '#EB4B4B',
  akVulcan: '#EB4B4B',
  awpLightning: '#EB4B4B',
  awpRedline: '#D32CE6',
  deagleBlaze: '#8847FF',
  bfCrimson: '#E4AE39',
  bfMarble: '#E4AE39',
  karambitTiger: '#E4AE39',
  talonMarble: '#E4AE39',
  talonPurple: '#E4AE39',
  glovesPurple: '#E4AE39',
  glovesGreen: '#E4AE39',
  glovesOrange: '#E4AE39',
};
export const rarityColor = (k: SkinKey) => RARITY[k] ?? '#5D6675';
