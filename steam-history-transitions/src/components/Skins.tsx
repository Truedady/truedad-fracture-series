import React from 'react';
import {Img, staticFile} from 'remotion';

/*
 * Реальные рендеры предметов (PNG с прозрачным фоном) из public/skins/.
 * Если файла нет в списке AVAILABLE — сцена использует векторный запасной вариант.
 * Чтобы подключить картинку: положите файл в public/skins/ и добавьте имя слота сюда.
 */
export const SKIN_FILES: Record<string, string> = {
  // 'ch02-hero': 'awp-lightning-strike.png',
};

export const hasSkin = (slot: string) => slot in SKIN_FILES;

/** Показывает PNG, если он подключён, иначе — fallback. */
export const SkinOr: React.FC<{slot: string; width: number; fallback: React.ReactNode; style?: React.CSSProperties}> = ({slot, width, fallback, style}) =>
  hasSkin(slot) ? <Img src={staticFile(`skins/${SKIN_FILES[slot]}`)} style={{width, height: 'auto', display: 'block', ...style}} /> : <>{fallback}</>;
