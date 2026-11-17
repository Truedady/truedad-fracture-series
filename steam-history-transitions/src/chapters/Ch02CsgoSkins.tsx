import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Dust, hexA} from '../components/Atmosphere';
import {Key, RIFLE_D} from '../components/Icons';
import {Extruded, SkinnedRifle} from '../components/Items2';
import {At, Chip, Shell, Stage3D} from '../components/Shell';
import {Ev, TitleBlock} from '../components/TitleBlock';
import {C, FONT} from '../lib/theme';
import {drift, E, k} from '../lib/anim';

/*
 * ГЛАВА 02 · ПОЯВЛЕНИЕ CS:GO И РЫНКА СКИНОВ · 2013
 * Связка с главой 01: ключ TF2 раскручивается в золотую полосу света,
 * из которой «выковывается» первый оружейный скин. Камера облетает его,
 * под ним — шкала редкостей и кнопка продажи: косметика стала товаром.
 *
 * 0–18   ключ TF2 медленно вращается в пространстве
 * 14–30  ключ раскручивается и схлопывается в полосу света
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

  // ключ → полоса
  const keySpin = k(f, [0, 14], [-20, 20]) + k(f, [14, 28], [0, 540], E.in);
  const keyS = k(f, [14, 28], [1, 0.25], E.in);
  const keyO = k(f, [0, 8], [0, 1]) * k(f, [24, 29], [1, 0]);
  const streak = k(f, [22, 28, 38], [0, 1, 0]);
  const streakW = k(f, [22, 30], [80, 1300], E.out);

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

      {/* ключ TF2 */}
      <Stage3D camera={`translate3d(${d.x}px, ${-30 + d.y}px, 0px)`}>
        <At w={360} h={360} ry={keySpin} s={keyS} style={{opacity: keyO, filter: `drop-shadow(0 0 30px ${hexA(C.gold, 0.35)})`}} preserve>
          <Extruded layers={6} depth={3}>
            <Key size={360} />
          </Extruded>
        </At>
      </Stage3D>

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
          <At w={1000} h={400} style={{clipPath: `inset(${50 - reveal * 50}% 0 ${50 - reveal * 50}% 0)`}} preserve>
            <Extruded layers={9} depth={2.6} dark={0.22}>
              <SkinnedRifle size={1000} skin="arms" lit={lit} id="ch02" />
            </Extruded>
          </At>
          {/* блик по раскраске */}
          <At w={1000} h={400} z={2} style={{opacity: reveal * 0.85, mixBlendMode: 'screen', pointerEvents: 'none'}}>
            <div
              style={{
                width: '100%',
                height: '100%',
                background: `linear-gradient(105deg, transparent ${sheen - 8}%, rgba(255,245,215,0.45) ${sheen}%, transparent ${sheen + 8}%)`,
                WebkitMaskImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(
                  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 80'><path d='${RIFLE_D}'/></svg>`,
                )}")`,
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
          <span style={{color: C.gold}}>14.08.2013</span> ARMS DEAL
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
