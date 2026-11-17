import React from 'react';
import {C} from '../lib/theme';
import {rnd} from '../lib/anim';
import {RIFLE_D} from './Icons';

/* Дополнительные стилизованные предметы для глав 02–11 (собственная отрисовка). */

type P = {size?: number; style?: React.CSSProperties};

const SKINS: Record<string, string[]> = {
  arms: ['#2E3B4E', '#4B69FF', '#9DB2FF', '#1B2230', '#D9A93D'],
  covert: ['#3A0D12', '#EB4B4B', '#FF8A7A', '#140608', '#D9A93D'],
  jungle: ['#2C3A26', '#7C8F4E', '#C6B67A', '#151B12', '#9A6B3A'],
  dusk: ['#2A1C3E', '#8847FF', '#D32CE6', '#120C1C', '#F1CF7A'],
};

/** Автомат с «раскраской» (процедурный камуфляж) и управляемым освещением. */
export const SkinnedRifle: React.FC<P & {skin?: keyof typeof SKINS | string; lit?: number; flat?: number; id: string}> = ({
  size = 600,
  style,
  skin = 'arms',
  lit = 0.5,
  flat = 0,
  id,
}) => {
  const pal = SKINS[skin] ?? SKINS.arms;
  const shapes = Array.from({length: 26}, (_, i) => {
    const x = rnd(`${id}x${i}`) * 200;
    const y = rnd(`${id}y${i}`) * 70 + 5;
    const w = 18 + rnd(`${id}w${i}`) * 46;
    const h = 6 + rnd(`${id}h${i}`) * 16;
    const a = (rnd(`${id}a${i}`) - 0.5) * 70;
    const c = pal[1 + Math.floor(rnd(`${id}c${i}`) * 3)];
    return <rect key={i} x={x - w / 2} y={y - h / 2} width={w} height={h} rx={3} fill={c} transform={`rotate(${a} ${x} ${y}) skewX(-20)`} opacity={0.9} />;
  });
  return (
    <svg width={size} height={size * 0.4} viewBox="0 0 200 80" style={style}>
      <defs>
        <clipPath id={`clip-${id}`}>
          <path d={RIFLE_D} />
        </clipPath>
        <linearGradient id={`spec-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity={0.55 * lit} />
          <stop offset="0.22" stopColor="#fff" stopOpacity={0.1 * lit} />
          <stop offset="0.6" stopColor="#000" stopOpacity={0.15 + 0.25 * lit} />
          <stop offset="1" stopColor="#000" stopOpacity={0.55} />
        </linearGradient>
      </defs>
      <g clipPath={`url(#clip-${id})`}>
        <rect x="0" y="0" width="200" height="80" fill={pal[0]} />
        {shapes}
        <rect x="0" y="0" width="200" height="80" fill={`url(#spec-${id})`} />
        <rect x="0" y="0" width="200" height="80" fill="#6B6F75" opacity={flat} />
        <path d="M46 26 L196 26 L196 28.5 L46 28.5Z" fill="#fff" opacity={0.15 + 0.5 * lit * (1 - flat)} />
      </g>
      <path d={RIFLE_D} fill="none" stroke={pal[4]} strokeOpacity={0.25 * lit * (1 - flat)} strokeWidth={0.6} />
    </svg>
  );
};

/** Изогнутый нож-«коготь» (обобщённый). */
export const ClawKnife: React.FC<P & {lit?: number; id?: string}> = ({size = 500, style, lit = 1, id = 'ck'}) => (
  <svg width={size} height={size * 0.5} viewBox="0 0 200 100" style={style}>
    <defs>
      <linearGradient id={`kb-${id}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#F4F6F8" />
        <stop offset="0.35" stopColor="#B7BEC8" />
        <stop offset="0.6" stopColor={C.goldHi} stopOpacity={0.9 * lit} />
        <stop offset="1" stopColor="#5A616B" />
      </linearGradient>
      <linearGradient id={`kh-${id}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#3A2A20" />
        <stop offset="1" stopColor="#120C08" />
      </linearGradient>
    </defs>
    <circle cx="28" cy="70" r="11" fill="none" stroke="#9AA1AB" strokeWidth="5" />
    <path d="M36 64 Q60 52 92 40 L98 50 Q66 64 42 76 Z" fill={`url(#kh-${id})`} />
    <path d="M88 36 L100 31 L104 46 L94 50 Z" fill="#9AA1AB" />
    <path d="M100 31 Q146 4 190 50 Q160 30 104 46 Z" fill={`url(#kb-${id})`} />
    <path d="M104 33 Q146 10 184 45 Q148 20 106 37 Z" fill="#fff" opacity={0.5 * lit} />
  </svg>
);

/** Подарочная копия игры. */
export const Gift: React.FC<P & {ribbon?: string}> = ({size = 100, style, ribbon = C.gold}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={style}>
    <defs>
      <linearGradient id="gift-b" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2C3644" />
        <stop offset="1" stopColor="#151A22" />
      </linearGradient>
    </defs>
    <rect x="18" y="40" width="64" height="46" rx="3" fill="url(#gift-b)" />
    <rect x="14" y="32" width="72" height="12" rx="2" fill="#344052" />
    <rect x="45" y="32" width="10" height="54" fill={ribbon} />
    <path d="M50 32 Q34 14 28 24 Q26 32 50 32 Q66 14 72 24 Q74 32 50 32Z" fill="none" stroke={ribbon} strokeWidth="4.5" />
    <rect x="14" y="32" width="72" height="2" fill="#fff" opacity="0.15" />
  </svg>
);

/** Плащ на вешалке (обобщённый силуэт тренча). */
export const Coat: React.FC<P & {tone?: string}> = ({size = 300, style, tone = '#8C6A43'}) => (
  <svg width={size} height={size * 1.4} viewBox="0 0 100 140" style={style}>
    <defs>
      <linearGradient id="coat-g" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#2A2016" />
        <stop offset="0.45" stopColor={tone} />
        <stop offset="1" stopColor="#1E170F" />
      </linearGradient>
    </defs>
    <path d="M50 4 Q50 10 50 12 M38 14 Q50 6 62 14" fill="none" stroke="#9AA1AB" strokeWidth="1.6" />
    <path d="M36 16 L64 16 L80 30 L84 132 L56 136 L50 60 L44 136 L16 132 L20 30 Z" fill="url(#coat-g)" />
    <path d="M36 16 L50 50 L64 16 L58 16 L50 36 L42 16Z" fill="#14100B" />
    <path d="M36 16 L44 46 L40 54 L30 26Z M64 16 L56 46 L60 54 L70 26Z" fill="#000" opacity="0.35" />
    <rect x="18" y="74" width="64" height="7" fill="#1A140D" />
    <rect x="46" y="73" width="9" height="9" rx="1" fill="none" stroke={C.gold} strokeWidth="1.4" />
    <circle cx="44" cy="64" r="1.6" fill="#1A140D" />
    <circle cx="56" cy="64" r="1.6" fill="#1A140D" />
    <circle cx="44" cy="92" r="1.6" fill="#1A140D" />
    <circle cx="56" cy="92" r="1.6" fill="#1A140D" />
    <path d="M30 40 L28 120" stroke="#fff" strokeOpacity="0.08" strokeWidth="4" />
  </svg>
);

const EMBLEMS = [
  'M50 22 L57 42 L78 42 L61 54 L68 75 L50 62 L32 75 L39 54 L22 42 L43 42Z',
  'M50 20 L74 30 L72 56 Q68 72 50 80 Q32 72 28 56 L26 30Z',
  'M26 62 L50 30 L74 62 L64 62 L50 44 L36 62Z M26 76 L50 44 L74 76 L64 76 L50 58 L36 76Z',
  'M56 18 L32 54 L48 54 L42 82 L68 44 L52 44 Z',
  'M50 24 A26 26 0 1 0 50.1 24 Z M50 36 A14 14 0 1 1 49.9 36 Z',
];

/** Наклейка: holo / gold / paper. */
export const Sticker: React.FC<P & {kind?: 'holo' | 'gold' | 'paper'; seed?: number; hue?: number; shift?: number}> = ({
  size = 100,
  style,
  kind = 'paper',
  seed = 0,
  hue = 210,
  shift = 0,
}) => {
  const id = `st-${kind}-${seed}`;
  const em = EMBLEMS[seed % EMBLEMS.length];
  const fill =
    kind === 'holo'
      ? `url(#${id}-h)`
      : kind === 'gold'
        ? `url(#${id}-g)`
        : `hsl(${hue} 55% 52%)`;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={style}>
      <defs>
        <linearGradient id={`${id}-h`} x1="0" y1="0" x2="1" y2="1" gradientTransform={`rotate(${shift * 90} 0.5 0.5)`}>
          <stop offset="0" stopColor="#7CF7FF" />
          <stop offset="0.3" stopColor="#B57CFF" />
          <stop offset="0.55" stopColor="#FF8AD8" />
          <stop offset="0.8" stopColor="#FFE38A" />
          <stop offset="1" stopColor="#7CFFB2" />
        </linearGradient>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1" gradientTransform={`rotate(${shift * 60} 0.5 0.5)`}>
          <stop offset="0" stopColor="#FFF0B8" />
          <stop offset="0.4" stopColor="#D9A93D" />
          <stop offset="0.7" stopColor="#8A6424" />
          <stop offset="1" stopColor="#F6DD92" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill="#ECEFF2" />
      <circle cx="50" cy="50" r="41" fill="#12161C" />
      <path d={em} fill={fill} />
      <circle cx="50" cy="50" r="41" fill="none" stroke={kind === 'paper' ? `hsl(${hue} 55% 52%)` : fill} strokeWidth="2" opacity="0.7" />
    </svg>
  );
};

/** Турнирная капсула (обобщённая). */
export const Capsule: React.FC<P & {accent?: string; open?: number}> = ({size = 160, style, accent = C.gold, open = 0}) => (
  <svg width={size} height={size * 1.3} viewBox="0 0 100 130" style={{overflow: 'visible', ...style}}>
    <defs>
      <linearGradient id="cap-b" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#1C222B" />
        <stop offset="0.45" stopColor="#3C4553" />
        <stop offset="1" stopColor="#161A20" />
      </linearGradient>
    </defs>
    <rect x="22" y="40" width="56" height="80" rx="12" fill="url(#cap-b)" />
    <rect x="22" y="74" width="56" height="12" fill={accent} opacity="0.9" />
    <g transform={`translate(0 ${-open * 34}) rotate(${-open * 18} 30 40)`}>
      <rect x="20" y="22" width="60" height="22" rx="8" fill="#4A5463" />
      <rect x="20" y="22" width="60" height="4" rx="2" fill="#fff" opacity="0.2" />
    </g>
  </svg>
);

/** Кейс с подписью — для главы 08. */
export const LabeledCase: React.FC<P & {accent: string; label: string}> = ({size = 160, style, accent, label}) => (
  <div style={{position: 'relative', width: size, height: size * 0.72, ...style}}>
    <svg width={size} height={size * 0.72} viewBox="0 0 100 72">
      <defs>
        <linearGradient id={`lc-${label}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3A414C" />
          <stop offset="1" stopColor="#15191F" />
        </linearGradient>
      </defs>
      <rect x="38" y="2" width="24" height="9" rx="3" fill="none" stroke="#5E6672" strokeWidth="3" />
      <rect x="4" y="10" width="92" height="58" rx="6" fill={`url(#lc-${label})`} />
      <rect x="4" y="33" width="92" height="10" fill={accent} />
      <rect x="4" y="10" width="92" height="3" rx="1.5" fill="#fff" opacity="0.18" />
      <rect x="44" y="30" width="12" height="16" rx="2" fill="#0F1216" stroke="#6C7480" strokeWidth="1.2" />
    </svg>
  </div>
);

export const Hourglass: React.FC<P & {color?: string; t?: number}> = ({size = 40, style, color = C.ivory, t = 0}) => (
  <svg width={size} height={size} viewBox="0 0 40 40" style={style}>
    <path d="M10 4 H30 M10 36 H30 M12 4 Q12 16 20 20 Q12 24 12 36 M28 4 Q28 16 20 20 Q28 24 28 36" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
    <path d={`M${14 + t * 4} ${8 + t * 9} Q20 ${18} ${26 - t * 4} ${8 + t * 9}Z`} fill={color} opacity="0.8" />
    <path d={`M14 33 Q20 ${33 - t * 9} 26 33Z`} fill={color} opacity="0.8" />
  </svg>
);

/** Объём для плоской SVG: слои по оси Z (имитация толщины при облёте камерой). */
export const Extruded: React.FC<{layers?: number; depth?: number; children: React.ReactNode; dark?: number}> = ({
  layers = 10,
  depth = 2,
  children,
  dark = 0.25,
}) => (
  <div style={{position: 'relative', transformStyle: 'preserve-3d'}}>
    {Array.from({length: layers}, (_, i) => (
      <div
        key={i}
        style={{
          position: i === layers - 1 ? 'relative' : 'absolute',
          left: 0,
          top: 0,
          transform: `translateZ(${(i - layers + 1) * depth}px)`,
          filter: i === layers - 1 ? undefined : `brightness(${dark})`,
        }}
      >
        {children}
      </div>
    ))}
  </div>
);
