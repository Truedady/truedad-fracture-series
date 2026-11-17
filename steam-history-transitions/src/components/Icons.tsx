import React from 'react';
import {C} from '../lib/theme';

/*
 * Стилизованные векторные предметы. Это собственная отрисовка «по мотивам»
 * (силуэты эпохи), а не копия игровых ассетов — их можно смело менять на
 * официальные рендеры, если у канала есть права.
 */

type P = {size?: number; style?: React.CSSProperties};

const Defs = () => (
  <defs>
    <linearGradient id="g-brass" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#F6DD92" />
      <stop offset="0.45" stopColor="#D2A445" />
      <stop offset="1" stopColor="#7E5A1F" />
    </linearGradient>
    <linearGradient id="g-metal-top" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#F2F4F6" />
      <stop offset="1" stopColor="#A7AEB7" />
    </linearGradient>
    <linearGradient id="g-metal-front" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#5E656E" />
      <stop offset="0.5" stopColor="#8E959E" />
      <stop offset="1" stopColor="#4D535B" />
    </linearGradient>
    <linearGradient id="g-hat" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#141312" />
      <stop offset="0.42" stopColor="#4A4541" />
      <stop offset="1" stopColor="#121110" />
    </linearGradient>
    <linearGradient id="g-wood" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#9C7346" />
      <stop offset="1" stopColor="#5B3D22" />
    </linearGradient>
    <linearGradient id="g-steel" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#E7EAEE" />
      <stop offset="0.5" stopColor="#9AA1AB" />
      <stop offset="1" stopColor="#59606A" />
    </linearGradient>
  </defs>
);

export const Hat: React.FC<P> = ({size = 100, style}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={style}>
    <Defs />
    <ellipse cx="50" cy="77" rx="41" ry="9.5" fill="#0E0D0C" />
    <ellipse cx="50" cy="75.5" rx="40" ry="8.5" fill="#2A2725" />
    <path d="M28 74 L31.5 25 Q50 19 68.5 25 L72 74 Q50 80 28 74Z" fill="url(#g-hat)" />
    <path d="M29.2 59 Q50 65 70.8 59 L71.4 68 Q50 74 28.6 68Z" fill="#8C3B2B" />
    <path d="M29.2 59 Q50 65 70.8 59 L70.9 61 Q50 67 29.1 61Z" fill="#B9573F" opacity="0.8" />
    <ellipse cx="50" cy="24.5" rx="18.5" ry="4.2" fill="#5B5550" />
    <path d="M36 30 L34.5 70" stroke="#FFFFFF" strokeOpacity="0.12" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export const Key: React.FC<P> = ({size = 100, style}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={style}>
    <Defs />
    <g transform="rotate(-28 50 50)">
      <circle cx="28" cy="50" r="15" fill="none" stroke="url(#g-brass)" strokeWidth="7.5" />
      <circle cx="28" cy="50" r="4.5" fill="url(#g-brass)" />
      <rect x="41" y="46.3" width="47" height="7.4" rx="2" fill="url(#g-brass)" />
      <rect x="70" y="52.5" width="5.5" height="12" rx="1" fill="url(#g-brass)" />
      <rect x="80" y="52.5" width="5.5" height="8.5" rx="1" fill="url(#g-brass)" />
      <rect x="43" y="46.8" width="44" height="1.8" fill="#FFF3CC" opacity="0.55" />
    </g>
  </svg>
);

export const Metal: React.FC<P> = ({size = 100, style}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={style}>
    <Defs />
    <path d="M17 58 L29 39 L71 39 L83 58 Z" fill="url(#g-metal-top)" />
    <path d="M17 58 L83 58 L80 69 L20 69 Z" fill="url(#g-metal-front)" />
    <path d="M29 39 L71 39 L69 42 L31 42Z" fill="#FFFFFF" opacity="0.6" />
  </svg>
);

export const Crate: React.FC<P> = ({size = 100, style}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={style}>
    <Defs />
    <rect x="20" y="28" width="60" height="50" rx="3" fill="url(#g-wood)" />
    <rect x="20" y="28" width="60" height="7" fill="#C49A63" opacity="0.6" />
    <path d="M20 45 H80 M20 61 H80" stroke="#3E2814" strokeWidth="2" />
    <path d="M23 31 L77 75 M77 31 L23 75" stroke="#3E2814" strokeWidth="3" opacity="0.55" />
    <rect x="44" y="49" width="12" height="8" rx="1" fill="#C8A04A" />
  </svg>
);

/** Силуэт автомата (обобщённый). accent — цвет «раскраски». */
export const Rifle: React.FC<P & {accent?: string; accent2?: string}> = ({size = 200, style, accent = '#8D96A3', accent2 = '#454C57'}) => (
  <svg width={size} height={size * 0.4} viewBox="0 0 200 80" style={style}>
    <defs>
      <linearGradient id={`rf-${accent}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={accent} />
        <stop offset="1" stopColor={accent2} />
      </linearGradient>
    </defs>
    <path
      d="M6 33 L38 28 L44 24 L118 24 L122 20 L148 20 L150 24 L194 25 L194 30 L150 31 L146 37 L128 37 L122 58 Q116 63 108 60 L112 37 L92 37 L86 60 L72 60 L77 37 L52 37 L42 52 L9 48 Z"
      fill={`url(#rf-${accent})`}
    />
    <path d="M44 24 L118 24 L118 27 L44 27Z" fill="#FFFFFF" opacity="0.28" />
    <path d="M58 28 L100 28 L96 35 L62 35Z" fill="#000" opacity="0.25" />
  </svg>
);

export const Pistol: React.FC<P & {accent?: string; accent2?: string}> = ({size = 200, style, accent = '#9AA1AB', accent2 = '#4A505A'}) => (
  <svg width={size} height={size * 0.4} viewBox="0 0 200 80" style={style}>
    <defs>
      <linearGradient id={`ps-${accent}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={accent} />
        <stop offset="1" stopColor={accent2} />
      </linearGradient>
    </defs>
    <path d="M40 18 L160 18 L162 34 L104 34 L98 40 L92 70 L66 70 L74 34 L40 34 Z" fill={`url(#ps-${accent})`} />
    <path d="M40 18 L160 18 L160 22 L40 22Z" fill="#FFF" opacity="0.3" />
  </svg>
);

export const Knife: React.FC<P & {accent?: string}> = ({size = 200, style, accent = '#2B2F36'}) => (
  <svg width={size} height={size * 0.4} viewBox="0 0 200 80" style={style}>
    <Defs />
    <path d="M14 44 Q14 36 24 36 L72 35 L78 31 L82 31 L82 53 L78 53 L72 49 L24 50 Q14 50 14 44Z" fill={accent} />
    <path d="M82 34 L164 30 Q192 38 184 46 Q176 50 82 50Z" fill="url(#g-steel)" />
    <path d="M86 35 L162 32 L160 35 L86 38Z" fill="#FFF" opacity="0.55" />
  </svg>
);

/** Обобщённый оружейный кейс. */
export const Case: React.FC<P & {accent?: string; label?: string}> = ({size = 100, style, accent = C.gold}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={style}>
    <defs>
      <linearGradient id="case-body" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#3A414C" />
        <stop offset="1" stopColor="#1A1E24" />
      </linearGradient>
    </defs>
    <rect x="38" y="20" width="24" height="9" rx="3" fill="none" stroke="#5E6672" strokeWidth="3.5" />
    <rect x="12" y="28" width="76" height="50" rx="6" fill="url(#case-body)" />
    <rect x="12" y="49" width="76" height="8" fill={accent} opacity="0.85" />
    <rect x="12" y="28" width="76" height="3" rx="1.5" fill="#FFF" opacity="0.18" />
    <rect x="44" y="45" width="12" height="16" rx="2" fill="#0F1216" stroke="#6C7480" strokeWidth="1.5" />
  </svg>
);

export const Lock: React.FC<P & {color?: string}> = ({size = 40, style, color = C.red}) => (
  <svg width={size} height={size} viewBox="0 0 40 40" style={style}>
    <path d="M12 18 V13 a8 8 0 0 1 16 0 V18" fill="none" stroke={color} strokeWidth="3.4" strokeLinecap="round" />
    <rect x="8" y="17" width="24" height="18" rx="3.5" fill={color} />
    <rect x="18.5" y="23" width="3" height="7" rx="1.5" fill="#0B0E13" />
  </svg>
);

export const Shield: React.FC<P & {color?: string}> = ({size = 40, style, color = C.ivory}) => (
  <svg width={size} height={size} viewBox="0 0 40 40" style={style}>
    <path d="M20 3 L34 8 V19 Q34 31 20 37 Q6 31 6 19 V8Z" fill="none" stroke={color} strokeWidth="2.6" strokeLinejoin="round" />
  </svg>
);

export const Swap: React.FC<P & {color?: string}> = ({size = 40, style, color = C.gold}) => (
  <svg width={size} height={size} viewBox="0 0 40 40" style={style}>
    <path d="M7 14 H31 M25 8 L31 14 L25 20 M33 26 H9 M15 20 L9 26 L15 32" fill="none" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
