import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Dust, hexA} from '../components/Atmosphere';
import {Extruded} from '../components/Items2';
import {Skin, skinUrl} from '../components/Skins';
import {At, Chip, Shell, Stage3D} from '../components/Shell';
import {Ev, TitleBlock} from '../components/TitleBlock';
import {C, FONT} from '../lib/theme';
import {drift, E, k} from '../lib/anim';

/*
 * ГЛАВА 02 · ПОЯВЛЕНИЕ CS:GO И РЫНКА СКИНОВ · 2013
 * Из глубины навстречу камере пролетают первые скины CS:GO 2013 года
 * (AK-47 | Fire Serpent, Desert Eagle | Blaze), затем вспыхивает полоса света,
 * из которой раскрывается AWP | Lightning Strike из Arms Deal. Камера облетает его,
 * под ним — шкала редкостей и кнопка продажи: косметика стала товаром.
 *
 * 0–28   скины 2013 года пролетают мимо камеры из глубины
 * 20–34  полоса света
 * 26–60  из полосы раскрывается автомат с раскраской, облёт камерой, блик по скину
 * 40–64  шкала редкостей, «Arms Deal · 14.08.2013», «Выставить на продажу»
 * 58–70  скин уходит на задний план, титр стирается световой кромкой
 * 112+   полёт вперёд, затемнение
 */
export const CH02_DURATION = 135;

const RARITIES = [
  {name: 'MIL-SPEC', c: C.milspec},
  {name: 'RESTRICTED', c: C.restricted},
  {name: 'CLASSIFIED', c: C.classified},
  {name: 'COVERT', c: C.covert},
];

export const Ch02CsgoSkins: React.FC = () => {
  const f = useCurrentFrame();
  const d = drift(f, 2.1, 5);

  // пролёт скинов 2013 года из глубины
  const PARADE = [
    {key: 'akFireSerpent' as const, s: -7, x0: -260, x1: -1500, y0: -60, y1: -380, ry: 24},
    {key: 'deagleBlaze' as const, s: 3, x0: 300, x1: 1500, y0: 70, y1: 420, ry: -22},
  ];
  const streak = k(f, [20, 28, 38], [0, 1, 0]);
  const streakW = k(f, [20, 30], [80, 1300], E.out);

  // скин
  const reveal = k(f, [27, 40], [0, 1], E.out);
  const orbit = k(f, [27, 110], [-48, 18], E.soft);
  const tilt = k(f, [27, 110], [14, -4], E.soft);
  const lit = k(f, [34, 58], [0.1, 1], E.inOut);
  const sheen = k(f, [40, 66], [-30, 130], E.inOut);
  const back = k(f, [58, 76], [0, 1], E.inOut);
  const ex = k(f, [112, 132], [0, 1], E.in);

  const ui = k(f, [42, 52], [0, 1], E.out) * (1 - back);

  return (
    <Shell glowOpacity={0.08 + streak * 0.12} glowY={46} fadeOut={8}>
      <Dust seed="d02" count={60} camX={-orbit * 6 - ex * 300} opacity={0.8} speed={1 + ex * 6} />

      {/* скины 2013 года пролетают мимо камеры */}
      <AbsoluteFill style={{perspective: 1200}}>
        {PARADE.map((p, i) => {
          const t = k(f, [p.s, p.s + 22], [0, 1], E.in);
          if (t <= 0 || t >= 1) return null;
          const z = -1800 + t * 2700;
          const near = Math.max(0, (z - 300) / 600);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 960 - 450 + p.x0 + (p.x1 - p.x0) * t * t,
                top: 520 - 140 + p.y0 + (p.y1 - p.y0) * t * t,
                transform: `translateZ(${z}px) rotateY(${p.ry}deg)`,
                opacity: k(t, [0, 0.15], [0, 1]) * k(t, [0.72, 0.92], [1, 0]),
                filter: `blur(${(1 - t) * 6 + near * 14}px) brightness(${0.6 + t * 0.5})`,
              }}
            >
              <Skin k={p.key} w={900} h={280} />
            </div>
          );
        })}
      </AbsoluteFill>

      {/* полоса света */}
      <div
        style={{
          position: 'absolute',
          left: 960 - streakW / 2,
          top: 510,
          width: streakW,
          height: 6,
          borderRadius: 3,
          background: `linear-gradient(90deg, transparent, ${C.goldHi}, #FFF8E0, ${C.goldHi}, transparent)`,
          boxShadow: `0 0 40px ${hexA(C.gold, 0.7)}`,
          opacity: streak,
        }}
      />

      {/* оружейный скин с облётом */}
      <AbsoluteFill style={{filter: `blur(${back * 7 + ex * 8}px)`, opacity: 1 - back * 0.62 - ex * 0.3}}>
        <Stage3D
          perspective={1300}
          camera={`translate3d(${d.x * 1.5}px, ${-30 - back * 150 + d.y}px, ${-back * 500 + ex * 600}px) rotateX(${tilt}deg) rotateY(${orbit}deg)`}
        >
          <At w={1100} h={223} style={{clipPath: `inset(${50 - reveal * 50}% -5% ${50 - reveal * 50}% -5%)`, filter: `brightness(${0.55 + lit * 0.55}) saturate(${0.6 + lit * 0.5})`}} preserve>
            <Extruded layers={7} depth={2.4} dark={0.18}>
              <Skin k="awpLightning" w={1100} />
            </Extruded>
          </At>
          {/* блик по раскраске */}
          <At w={1100} h={223} z={2} style={{opacity: reveal * 0.9, mixBlendMode: 'screen', pointerEvents: 'none'}}>
            <div
              style={{
                width: '100%',
                height: '100%',
                background: `linear-gradient(105deg, transparent ${sheen - 8}%, rgba(255,245,215,0.55) ${sheen}%, transparent ${sheen + 8}%)`,
                WebkitMaskImage: `url("${skinUrl('awpLightning')}")`,
                WebkitMaskSize: '100% 100%',
              }}
            />
          </At>
        </Stage3D>
      </AbsoluteFill>

      {/* интерфейс рынка: редкости + продажа */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 750, display: 'flex', justifyContent: 'center', gap: 10, opacity: ui}}>
        {RARITIES.map((r, i) => {
          const o = k(f, [44 + i * 3, 50 + i * 3], [0, 1]);
          return (
            <div key={r.name} style={{width: 190, opacity: o, transform: `translateY(${(1 - o) * 12}px)`}}>
              <div style={{height: 4, background: r.c, borderRadius: 2}} />
              <div style={{fontFamily: FONT.mono, fontSize: 14, letterSpacing: '0.16em', color: C.muted, marginTop: 10, textAlign: 'center'}}>{r.name}</div>
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 230, top: 230, opacity: ui}}>
        <Chip color={hexA(C.gold, 0.8)}>
          <span style={{color: C.gold}}>ARMS DEAL</span> AWP | LIGHTNING STRIKE
        </Chip>
      </div>
      <div style={{position: 'absolute', right: 230, top: 230, opacity: ui * k(f, [50, 56], [0, 1])}}>
        <Chip color={C.line} style={{background: hexA(C.gold, 0.14), color: C.goldHi}}>
          ВЫСТАВИТЬ НА ПРОДАЖУ ▸
        </Chip>
      </div>

      <TitleBlock
        f={f}
        num="02"
        lines={['ПОЯВЛЕНИЕ CS:GO', 'И РЫНКА СКИНОВ']}
        years="2013"
        from={2013}
        to={2013}
        start={64}
        exitStart={112}
        variant="wipe"
        sub={
          <>
            <Ev d="14.08.2013">ARMS DEAL</Ev>
            <Ev>ПЕРВЫЕ СКИНЫ · КЕЙСЫ · НОЖИ</Ev>
          </>
        }
      />
    </Shell>
  );
};
