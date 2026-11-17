import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Dust, hexA} from '../components/Atmosphere';
import {Crate} from '../components/Icons';
import {Coat} from '../components/Items2';
import {Chip, Shell} from '../components/Shell';
import {Ev, TitleBlock} from '../components/TitleBlock';
import {C, FONT} from '../lib/theme';
import {drift, E, k} from '../lib/anim';

/*
 * ГЛАВА 06 · ЭРА PUBG · 2017–2018
 * Тёплый «пыльный» свет прожектора. Плащ-тренч висит в луче, рядом
 * ценник, который перещёлкивается с 3 000 ₽ до 53 000 ₽ (данные из архива
 * курса, как в сценарии), и счётчик онлайна декабря 2017 года.
 *
 * 0–20    из темноты — луч прожектора, пыль, плащ
 * 16–60   ценник растёт, счётчик онлайна
 * 60–74   сцена гаснет, титр «штампуется» словами
 * 114+    полёт вперёд, затемнение
 */
export const CH06_DURATION = 135;

const fmt = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

export const Ch06Pubg: React.FC = () => {
  const f = useCurrentFrame();
  const d = drift(f, 6.6, 6);
  const sway = Math.sin(f * 0.07) * 2.2;
  const price = 3000 + (53000 - 3000) * k(f, [18, 58], [0, 1], E.in);
  const online = 3000000 * k(f, [10, 50], [0, 1], E.out);
  const dim = k(f, [62, 76], [1, 0.38]);
  const blur = k(f, [62, 78], [0, 6], E.inOut);
  const push = k(f, [0, 80], [1.0, 1.08], E.soft);
  const ex = k(f, [114, 134], [0, 1], E.in);
  const beam = k(f, [0, 16], [0, 1]);

  return (
    <Shell glow="#D08A3C" glowOpacity={0.13} glowY={20} base="#120E0A">
      {/* ящики на заднем плане */}
      <AbsoluteFill style={{filter: `blur(${7 + blur}px) brightness(${dim * 0.7})`}}>
        {[
          {x: 240, y: 640, s: 260, r: -8},
          {x: 1520, y: 700, s: 300, r: 6},
          {x: 1660, y: 240, s: 180, r: 14},
          {x: 120, y: 200, s: 160, r: -16},
        ].map((c, i) => (
          <div key={i} style={{position: 'absolute', left: c.x + d.x * (0.6 + i * 0.2) - ex * (960 - c.x) * 0.8, top: c.y + d.y - f * 0.12, transform: `rotate(${c.r + Math.sin(f * 0.03 + i) * 3}deg) scale(${1 + ex})`, opacity: 0.55}}>
            <Crate size={c.s} />
          </div>
        ))}
      </AbsoluteFill>

      {/* луч прожектора */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 1920,
          height: 1080,
          background: `linear-gradient(180deg, ${hexA('#F2C27A', 0.22)}, ${hexA('#F2C27A', 0.04)} 85%, transparent)`,
          clipPath: 'polygon(46% 0, 58% 0, 74% 100%, 24% 100%)',
          opacity: beam * dim,
          filter: 'blur(18px)',
        }}
      />

      <AbsoluteFill style={{transform: `scale(${push + ex * 0.3})`, filter: `blur(${blur + ex * 10}px) brightness(${dim})`, opacity: 1 - ex * 0.8}}>
        {/* плащ */}
        <div style={{position: 'absolute', left: 760 - 180 + d.x, top: 150 + d.y, transformOrigin: '50% 0%', transform: `rotate(${sway}deg)`, filter: `drop-shadow(0 40px 60px rgba(0,0,0,0.7))`}}>
          <Coat size={360} />
        </div>
        {/* нить и ценник */}
        <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
          <path d={`M${760 + d.x + 40} ${330 + d.y} Q ${940} ${300} ${1090 + d.x * 1.4} ${396 + d.y * 1.2}`} fill="none" stroke={hexA(C.ivory, 0.35)} strokeWidth={1.5} />
        </svg>
        <div
          style={{
            position: 'absolute',
            left: 1090 + d.x * 1.4,
            top: 380 + d.y * 1.2,
            width: 500,
            padding: '26px 30px',
            background: 'linear-gradient(180deg, #1E1812, #15110C)',
            border: `1px solid ${hexA(C.gold, 0.45)}`,
            borderRadius: 6,
            transform: `rotate(${-sway * 0.6 + 2}deg)`,
            transformOrigin: '0% 0%',
            opacity: k(f, [14, 22], [0, 1]),
            boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
          }}
        >
          <div style={{fontFamily: FONT.mono, fontSize: 14, letterSpacing: '0.28em', color: C.muted}}>TRENCH COAT · PUBG</div>
          <div style={{fontFamily: FONT.mono, fontWeight: 700, fontSize: 64, color: f > 56 ? C.goldHi : C.ivory, marginTop: 10, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em'}}>
            {fmt(price)} ₽
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 12, marginTop: 14}}>
            <div style={{fontFamily: FONT.mono, fontSize: 13, letterSpacing: '0.16em', color: C.dim}}>3 000 ₽ → 53 000 ₽ · ЗА ПОЛГОДА</div>
            <div style={{marginLeft: 'auto', fontFamily: FONT.mono, fontWeight: 700, fontSize: 16, color: C.green, opacity: k(f, [56, 62], [0, 1])}}>≈ ×18</div>
          </div>
          <div style={{fontFamily: FONT.mono, fontSize: 11, letterSpacing: '0.2em', color: C.dim, marginTop: 10}}>ИСТОЧНИК: АРХИВ КУРСА</div>
        </div>

        {/* онлайн */}
        <div style={{position: 'absolute', left: 200, top: 150, opacity: k(f, [8, 16], [0, 1])}}>
          <Chip color={hexA(C.gold, 0.5)}>
            <span style={{color: C.gold}}>03.2017</span> РАННИЙ ДОСТУП STEAM
          </Chip>
          <div style={{fontFamily: FONT.mono, fontSize: 13, letterSpacing: '0.3em', color: C.muted, marginTop: 30}}>ОДНОВРЕМЕННО В ИГРЕ · ДЕКАБРЬ 2017</div>
          <div style={{fontFamily: FONT.mono, fontWeight: 700, fontSize: 52, color: C.ivory, marginTop: 6, fontVariantNumeric: 'tabular-nums'}}>
            {fmt(online)}
            <span style={{color: C.gold}}>{f > 50 ? '+' : ''}</span>
          </div>
        </div>
      </AbsoluteFill>

      <Dust seed="d06" count={90} color="#F5D29A" opacity={0.85} speed={0.6 + ex * 6} camX={-ex * 400} />

      <TitleBlock
        f={f}
        num="06"
        lines={['ЭРА PUBG']}
        years="2017 — 2018"
        from={2017}
        to={2018}
        start={68}
        exitStart={114}
        variant="stamp"
        size={190}
        sub={
          <>
            <Ev d="03.2017">РАННИЙ ДОСТУП</Ev>
            <Ev d="12.2017">БОЛЕЕ 3 МЛН ИГРОКОВ ОНЛАЙН</Ev>
          </>
        }
      />
    </Shell>
  );
};
