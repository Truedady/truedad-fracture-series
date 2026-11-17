import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Dust, hexA} from '../components/Atmosphere';
import {Gift} from '../components/Items2';
import {At, Shell, Stage3D} from '../components/Shell';
import {Ev, TitleBlock} from '../components/TitleBlock';
import {LAND_DOTS, MAP_H, MAP_W, mapXY} from '../components/WorldMap';
import {C, FONT} from '../lib/theme';
import {E, k, lerp} from '../lib/anim';

/*
 * ГЛАВА 03 · ТОРГОВЛЯ РЕГИОНАЛЬНЫМИ ИГРАМИ · 2011–2017
 * Точечная карта мира в наклоне. Из России расходятся подарочные копии игр
 * по золотым дугам в США и Великобританию; над городами — валюты регионов.
 *
 * 0–20   карта «прорастает» точками от Москвы
 * 12–60  подарочные копии летят по дугам, валютные метки, камера плывёт над Европой
 * 56–70  карта уходит в расфокус, титр поднимается из-под маски
 * 112+   полёт вперёд, затемнение
 */
export const CH03_DURATION = 135;

const MOSCOW = mapXY(37.6, 55.7);
const NY = mapXY(-74, 40.7);
const LONDON = mapXY(-0.1, 51.5);
const CITIES = [
  {p: MOSCOW, code: 'RUB', sym: '₽', color: C.gold, t: 10},
  {p: LONDON, code: 'GBP', sym: '£', color: C.ivory, t: 22},
  {p: NY, code: 'USD', sym: '$', color: C.ivory, t: 28},
];
const GIFTS = [
  {to: NY, s: 12},
  {to: LONDON, s: 18},
  {to: NY, s: 24},
  {to: LONDON, s: 30},
  {to: NY, s: 36},
  {to: LONDON, s: 42},
];
const DUR = 24;

const ctrl = (a: {x: number; y: number}, b: {x: number; y: number}) => {
  const d = Math.hypot(b.x - a.x, b.y - a.y);
  return {x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 - d * 0.35};
};
const qb = (a: {x: number; y: number}, m: {x: number; y: number}, b: {x: number; y: number}, t: number) => ({
  x: (1 - t) ** 2 * a.x + 2 * (1 - t) * t * m.x + t * t * b.x,
  y: (1 - t) ** 2 * a.y + 2 * (1 - t) * t * m.y + t * t * b.y,
});

export const Ch03RegionalGames: React.FC = () => {
  const f = useCurrentFrame();
  const RX = 46;
  const panX = k(f, [0, 110], [-60, -190], E.soft);
  const camZ = k(f, [0, 60], [120, 380], E.soft);
  const rack = k(f, [56, 72], [0, 6], E.inOut);
  const dim = k(f, [56, 72], [1, 0.5]);
  const ex = k(f, [112, 132], [0, 1], E.in);
  const grow = k(f, [0, 26], [0, 1500], E.out);

  return (
    <Shell glow="#7C8FAE" glowOpacity={0.07} glowY={40}>
      <AbsoluteFill style={{filter: `blur(${rack + ex * 6}px) brightness(${dim})`}}>
        <Stage3D
          perspective={1400}
          origin="50% 30%"
          top="56%"
          camera={`translate3d(${-panX}px, 0px, ${camZ + ex * 500}px) rotateX(${RX}deg) translate(${-MOSCOW.x + 120}px, ${-MOSCOW.y + 60}px)`}
        >
          <div style={{position: 'absolute', left: 0, top: 0, width: MAP_W, height: MAP_H, transformStyle: 'preserve-3d'}}>
            <svg width={MAP_W} height={MAP_H} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
              {LAND_DOTS.map((d, i) => {
                const dist = Math.hypot(d.x - MOSCOW.x, d.y - MOSCOW.y);
                const o = Math.max(0, Math.min(1, (grow - dist) / 160));
                const near = Math.max(0, 1 - Math.min(Math.hypot(d.x - NY.x, d.y - NY.y), Math.hypot(d.x - LONDON.x, d.y - LONDON.y), dist) / 120);
                return <circle key={i} cx={d.x} cy={d.y} r={2.6 + near * 1.2} fill={near > 0.2 ? hexA(C.gold, 0.35 + near * 0.5) : '#3A4556'} opacity={o} />;
              })}
              {/* дуги */}
              {GIFTS.map((g, i) => {
                const m = ctrl(MOSCOW, g.to);
                const p = k(f, [g.s, g.s + DUR], [0, 1], E.inOut);
                const len = 1400;
                return (
                  <path
                    key={i}
                    d={`M${MOSCOW.x} ${MOSCOW.y} Q${m.x} ${m.y} ${g.to.x} ${g.to.y}`}
                    fill="none"
                    stroke={C.gold}
                    strokeWidth={2}
                    strokeDasharray={len}
                    strokeDashoffset={len * (1 - p)}
                    opacity={0.55 * k(f, [g.s + DUR, g.s + DUR + 30], [1, 0.35])}
                  />
                );
              })}
              {/* пульсирующие кольца */}
              {CITIES.map((c, i) => {
                const t = ((f - c.t) % 30) / 30;
                return f > c.t ? (
                  <g key={i}>
                    <circle cx={c.p.x} cy={c.p.y} r={6} fill={c.color} />
                    <circle cx={c.p.x} cy={c.p.y} r={8 + t * 40} fill="none" stroke={c.color} strokeWidth={2} opacity={(1 - t) * 0.7} />
                  </g>
                ) : null;
              })}
            </svg>

            {/* летящие подарочные копии (повёрнуты к камере) */}
            {GIFTS.map((g, i) => {
              const p = k(f, [g.s, g.s + DUR], [0, 1], E.inOut);
              if (p <= 0 || p >= 1) return null;
              const m = ctrl(MOSCOW, g.to);
              const pos = qb(MOSCOW, m, g.to, p);
              const lift = Math.sin(p * Math.PI) * 120;
              return (
                <At key={i} x={pos.x} y={pos.y} z={lift + 10} w={80} h={80} rx={-RX} s={0.8 + Math.sin(p * Math.PI) * 0.35}>
                  <Gift size={80} />
                </At>
              );
            })}

            {/* валютные метки над городами */}
            {CITIES.map((c, i) => {
              const o = k(f, [c.t, c.t + 8], [0, 1], E.out);
              return (
                <At key={i} x={c.p.x} y={c.p.y} z={60 + (1 - o) * 30} w={180} h={120} rx={-RX} style={{opacity: o}}>
                  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
                    <div
                      style={{
                        fontFamily: FONT.display,
                        fontWeight: 700,
                        fontSize: 54,
                        color: c.color,
                        lineHeight: 1,
                        textShadow: `0 0 30px ${hexA(c.color, 0.35)}`,
                      }}
                    >
                      {c.sym}
                    </div>
                    <div style={{fontFamily: FONT.mono, fontSize: 15, letterSpacing: '0.3em', color: C.muted}}>{c.code}</div>
                    <div style={{width: 1, height: 26, background: `linear-gradient(${c.color}, transparent)`}} />
                  </div>
                </At>
              );
            })}
          </div>
        </Stage3D>
      </AbsoluteFill>

      <Dust seed="d03" count={40} camX={panX - ex * 300} opacity={0.5} speed={1 + ex * 5} color="#DDE6F5" />

      <div style={{position: 'absolute', left: 200, top: 130, opacity: k(f, [8, 18], [0, 1]) * k(f, [54, 66], [1, 0]), fontFamily: FONT.mono}}>
        <div style={{fontSize: 13, letterSpacing: '0.3em', color: C.dim}}>ПОДАРОЧНЫЕ КОПИИ</div>
        <div style={{fontSize: 22, color: C.ivory, marginTop: 8, letterSpacing: '0.08em'}}>
          ×{Math.floor(lerp(1, 6, k(f, [12, 60], [0, 1])))} В ПУТИ
        </div>
      </div>

      <TitleBlock
        f={f}
        num="03"
        lines={['ТОРГОВЛЯ', 'РЕГИОНАЛЬНЫМИ ИГРАМИ']}
        years="2011 — 2017"
        from={2011}
        to={2017}
        start={62}
        exitStart={112}
        variant="riseMask"
        size={112}
        sub={
          <>
            <Ev>ПОДАРОЧНЫЕ КОПИИ · РЕГИОНАЛЬНЫЕ ЦЕНЫ</Ev>
            <Ev d="03.05.2017">ОТМЕНА GIFT TO INVENTORY</Ev>
          </>
        }
      />
    </Shell>
  );
};
