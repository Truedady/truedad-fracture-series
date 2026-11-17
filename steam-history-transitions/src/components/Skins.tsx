import React from 'react';
import {Img, staticFile} from 'remotion';

/*
 * Реальные рендеры предметов (PNG с прозрачным фоном, обрезанные по краю) из public/skins/.
 * ratio = ширина / высота — нужен для раскладки до загрузки картинки.
 */
export const SKINS = {
  awpLightning: {file: 'awp-lightning-strike.png', ratio: 4.937, name: 'AWP | LIGHTNING STRIKE'},
  m4Red: {file: 'm4-red.png', ratio: 3.88},
  m4Cyan: {file: 'm4-cyan.png', ratio: 3.904},
  m4Blue: {file: 'm4-blue.png', ratio: 3.748},
  deagleBlue: {file: 'deagle-blue.png', ratio: 1.784},
} as const;
export type SkinKey = keyof typeof SKINS;
export const SKIN_KEYS = Object.keys(SKINS) as SkinKey[];

/** Картинка скина, вписанная в прямоугольник w×h по центру. */
export const Skin: React.FC<{k: SkinKey; w: number; h?: number; style?: React.CSSProperties}> = ({k, w, h, style}) => {
  const s = SKINS[k];
  const box = h ?? w / s.ratio;
  const fitW = Math.min(w, box * s.ratio);
  return (
    <div style={{width: w, height: box, display: 'flex', alignItems: 'center', justifyContent: 'center', ...style}}>
      <Img src={staticFile(`skins/${s.file}`)} style={{width: fitW, height: 'auto', display: 'block'}} />
    </div>
  );
};

export const skinUrl = (k: SkinKey) => staticFile(`skins/${SKINS[k].file}`);
