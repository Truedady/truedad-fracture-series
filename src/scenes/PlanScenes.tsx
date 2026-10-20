import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Arrow, Kicker, MaskLine, Panel, SceneShell, SourceTag} from '../brand/primitives';
import {C, F, SAFE} from '../brand/tokens';
import {CaseHero} from '../components/CaseHero';
import {DayCounter} from '../components/DayCounter';
import {MarketDrop} from '../components/MarketDrop';
import {MetricTicker} from '../components/MetricTicker';
import {PurchaseLadder, cumulative, dailyQty} from '../components/PurchaseLadder';
import {EASE_IN_OUT, EASE_OUT, at, pop, prog, sec} from '../lib/anim';
import type {SceneProps} from './types';

/** 11.2–13.8s: «эксперимент на 30 дней» — the calendar assembles, the count lands on «тридцать». */
export const CalendarScene: React.FC<SceneProps> = ({ep, start, dur}) => {
  const frame = useCurrentFrame();
  const c = ep.cues;
  const landF = sec(c.thirty) - sec(start);
  const s = pop(frame, landF);
  return (
    <SceneShell dur={dur} enter="whip" exit="push">
      <div style={{position: 'absolute', left: SAFE.left, top: 250}}>
        <Kicker t={at(frame, start, start + 0.05, 10)}>Эксперимент · старт 20.10.2026</Kicker>
      </div>
      <div style={{position: 'absolute', left: SAFE.left, top: 310, display: 'flex', alignItems: 'flex-end', gap: 40}}>
        <div style={{transform: `scale(${0.92 + 0.08 * s})`, transformOrigin: 'left bottom'}}>
          <MetricTicker from={1} to={ep.totalDays} startFrame={sec(c.experiment) - sec(start)} endFrame={landF} size={300} color={C.gold} style={{letterSpacing: -10}} />
        </div>
        <div style={{paddingBottom: 34}}>
          <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 88, color: C.ivory, lineHeight: 1, opacity: prog(frame, landF - 4, landF + 4)}}>ДНЕЙ</div>
          <div style={{fontFamily: F.text, fontWeight: 700, fontSize: 34, color: C.muted, marginTop: 8}}>каждый день — покупка</div>
        </div>
      </div>
      <div style={{position: 'absolute', left: SAFE.left, top: 690}}>
        <DayCounter
          days={ep.totalDays}
          today={ep.day}
          start={ep.dailyStart}
          step={ep.dailyStep}
          reveal={(i) => prog(frame, 4 + i * 1.6, 4 + i * 1.6 + 10)}
          cell={138}
          showQty={prog(frame, landF, landF + 12)}
        />
      </div>
    </SceneShell>
  );
};

/** 13.8–15.5s: the real Fracture Case render, presented as a hero on «Fracture-кейс». */
export const CaseHeroScene: React.FC<SceneProps> = ({ep, start, dur}) => {
  const frame = useCurrentFrame();
  const c = ep.cues;
  const tIn = prog(frame, 0, 14, EASE_OUT);
  const title = at(frame, start, c.fracture - 0.08, 10);
  const sweep = at(frame, start, c.fracture - 0.1, 22, EASE_IN_OUT);
  return (
    <SceneShell dur={dur} enter="push" exit="whip">
      <div style={{position: 'absolute', left: SAFE.left, top: 250}}>
        <Kicker t={tIn}>Выбранный актив</Kicker>
      </div>
      <div style={{position: 'absolute', left: 130, top: 420}}>
        <CaseHero src="assets/derived/case_cutout.png" width={820} t={tIn} sweep={sweep} />
      </div>
      <div style={{position: 'absolute', left: SAFE.left, right: SAFE.right, top: 1000}}>
        <MaskLine t={title}>
          <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 118, color: C.ivory, letterSpacing: -3, lineHeight: 1}}>
            FRACTURE<span style={{color: C.gold}}> CASE</span>
          </div>
        </MaskLine>
        <div style={{marginTop: 18, fontFamily: F.mono, fontWeight: 500, fontSize: 28, color: C.muted, letterSpacing: 2, opacity: title}}>
          {ep.caseNameRu.toUpperCase()} · CS2
        </div>
      </div>
    </SceneShell>
  );
};

/** 15.5–22.2s: 20 → 25 → 30 … 165, each bar on its spoken number. */
export const LadderScene: React.FC<SceneProps> = ({ep, start, dur}) => {
  const frame = useCurrentFrame();
  const c = ep.cues;
  const L = (s: number) => sec(s) - sec(start);
  const fToday = L(c.today20);
  const fTomorrow = L(c.tomorrow25);
  const fAfter = L(c.after30);
  const fRun0 = L(c.everyDay);
  const fRun1 = L(c.plus5 + 0.3);
  const reveal = (i: number) => {
    if (i === 0) return prog(frame, fToday - 2, fToday + 8);
    if (i === 1) return prog(frame, fTomorrow - 2, fTomorrow + 8);
    if (i === 2) return prog(frame, fAfter - 2, fAfter + 8);
    const s = fRun0 + ((i - 3) / (ep.totalDays - 4)) * (fRun1 - fRun0);
    return prog(frame, s, s + 8);
  };
  // Which day the big counter shows
  let day = 1;
  if (frame >= fTomorrow - 1) day = 2;
  if (frame >= fAfter - 1) day = 3;
  if (frame >= fRun0) day = Math.min(ep.totalDays, 3 + Math.floor(interpolate(frame, [fRun0, fRun1], [0, ep.totalDays - 3], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})));
  const qty = dailyQty(day, ep.dailyStart, ep.dailyStep);
  const word = frame < fTomorrow - 4 ? 'СЕГОДНЯ' : frame < L(18.36) - 2 ? 'ЗАВТРА' : frame < fRun0 - 6 ? 'ПОСЛЕЗАВТРА' : 'КАЖДЫЙ ДЕНЬ';
  const wordKey = word;
  const wordStart = word === 'СЕГОДНЯ' ? 0 : word === 'ЗАВТРА' ? fTomorrow - 4 : word === 'ПОСЛЕЗАВТРА' ? L(18.36) - 2 : fRun0 - 6;
  const wT = prog(frame, wordStart, wordStart + 8);
  const bump = pop(frame, day === 1 ? fToday : day === 2 ? fTomorrow : day === 3 ? fAfter : fRun1 + 4);
  const plus5 = at(frame, start, c.plus5 - 0.05, 10);
  const legend = prog(frame, fRun0, fRun0 + 12);
  return (
    <SceneShell dur={dur} enter="whip" exit="push">
      <div style={{position: 'absolute', left: SAFE.left, top: 250}}>
        <Kicker t={prog(frame, 0, 10)}>План закупок · +5 кейсов в день</Kicker>
      </div>
      <div style={{position: 'absolute', left: SAFE.left, right: SAFE.right, top: 312, height: 330}}>
        <MaskLine t={wT} key={wordKey}>
          <div style={{fontFamily: F.text, fontWeight: 800, fontSize: 64, color: C.ivory, letterSpacing: -1}}>{word}</div>
        </MaskLine>
        <div style={{display: 'flex', alignItems: 'flex-end', gap: 26, marginTop: 6}}>
          <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 230, lineHeight: 0.95, color: C.gold, letterSpacing: -8, transform: `scale(${0.94 + 0.06 * bump})`, transformOrigin: 'left bottom', opacity: 0.25 + 0.75 * prog(frame, fToday - 6, fToday + 2)}}>
            {frame >= fToday - 4 ? qty : '··'}
          </div>
          <div style={{paddingBottom: 24, opacity: prog(frame, fToday - 6, fToday + 2)}}>
            <div style={{fontFamily: F.text, fontWeight: 800, fontSize: 52, color: C.ivory}}>кейсов</div>
            <div style={{fontFamily: F.mono, fontWeight: 600, fontSize: 30, color: C.muted, letterSpacing: 2}}>ДЕНЬ {String(day).padStart(2, '0')}</div>
          </div>
          <div
            style={{
              marginLeft: 'auto',
              marginBottom: 40,
              fontFamily: F.display,
              fontWeight: 800,
              fontSize: 64,
              color: C.canvas,
              background: C.gold,
              padding: '10px 22px',
              borderRadius: 16,
              opacity: plus5,
              transform: `scale(${0.6 + 0.4 * plus5}) rotate(${-4 * plus5}deg)`,
            }}
          >
            +5
          </div>
        </div>
      </div>
      <div style={{position: 'absolute', left: SAFE.left, top: 700, transform: `perspective(1500px) rotateX(${12 - 4 * prog(frame, 0, dur, EASE_IN_OUT)}deg) rotateY(${-12 + 10 * prog(frame, 0, dur, EASE_IN_OUT)}deg)`, transformOrigin: '50% 100%'}}>
        <PurchaseLadder
          width={890}
          height={470}
          days={ep.totalDays}
          start={ep.dailyStart}
          step={ep.dailyStep}
          bought={ep.day}
          reveal={reveal}
          ghost={prog(frame, 2, 14)}
          activeIdx={frame >= fToday - 2 ? day - 1 : -1}
          labels={{0: prog(frame, fToday, fToday + 6), 1: prog(frame, fTomorrow, fTomorrow + 6), 2: prog(frame, fAfter, fAfter + 6), [ep.totalDays - 1]: prog(frame, fRun1, fRun1 + 8)}}
        />
      </div>
      <div style={{position: 'absolute', left: SAFE.left, top: 1262, display: 'flex', gap: 34, fontFamily: F.mono, fontSize: 22, color: C.muted, opacity: legend}}>
        <span style={{display: 'flex', alignItems: 'center', gap: 10}}>
          <span style={{width: 18, height: 18, background: C.gold, borderRadius: 3}} />
          куплено
        </span>
        <span style={{display: 'flex', alignItems: 'center', gap: 10}}>
          <span style={{width: 18, height: 18, border: `1.5px solid ${C.gold}`, background: C.goldDim, borderRadius: 3}} />
          план
        </span>
      </div>
    </SceneShell>
  );
};

/** 22.2–25.8s: cumulative total lands exactly on «…семьдесят пять». */
export const TotalScene: React.FC<SceneProps> = ({ep, start, dur}) => {
  const frame = useCurrentFrame();
  const c = ep.cues;
  const L = (s: number) => sec(s) - sec(start);
  const total = cumulative(ep.totalDays, ep.dailyStart, ep.dailyStep);
  const f0 = 3; // count runs under «в итоге за месяц у меня накопится…» and lands on «…пять»
  const f1 = L(c.total2775End);
  const land = pop(frame, f1, 30, 12, 200);
  const curveT = prog(frame, 4, f1, EASE_IN_OUT);
  const W = 900;
  const Hh = 330;
  const pts = new Array(ep.totalDays).fill(0).map((_, i) => cumulative(i + 1, ep.dailyStart, ep.dailyStep));
  const n = Math.max(2, Math.floor(curveT * (pts.length - 1)) + 1);
  const xy = pts.slice(0, n).map((v, i) => [(i / (pts.length - 1)) * W, Hh - (v / total) * Hh] as const);
  const d = xy.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const [lx, ly] = xy[xy.length - 1];
  return (
    <SceneShell dur={dur} enter="push" exit="push">
      <div style={{position: 'absolute', left: SAFE.left, top: 250}}>
        <Kicker t={prog(frame, 0, 10)}>Итог за {ep.totalDays} дней · план</Kicker>
      </div>
      <div style={{position: 'absolute', left: SAFE.left - 6, top: 300, transform: `scale(${1 + 0.05 * land * (1 - prog(frame, f1 + 4, f1 + 20))})`, transformOrigin: 'left center'}}>
        <MetricTicker to={total} startFrame={f0} endFrame={f1} size={232} color={C.gold} style={{letterSpacing: -10}} />
      </div>
      <div style={{position: 'absolute', left: SAFE.left, top: 560, fontFamily: F.text, fontWeight: 800, fontSize: 64, color: C.ivory, opacity: prog(frame, f0, f0 + 10)}}>
        кейсов <span style={{color: C.muted, fontWeight: 700, fontSize: 44}}>в портфеле к 30-му дню</span>
      </div>
      <div style={{position: 'absolute', left: SAFE.left, top: 720}}>
        <svg width={W} height={Hh + 40} style={{overflow: 'visible'}}>
          <defs>
            <linearGradient id="cumArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={C.gold} stopOpacity={0.35} />
              <stop offset="100%" stopColor={C.gold} stopOpacity={0} />
            </linearGradient>
          </defs>
          {[0.25, 0.5, 0.75, 1].map((g) => (
            <line key={g} x1={0} x2={W} y1={Hh - g * Hh} y2={Hh - g * Hh} stroke={C.border} strokeDasharray="4 10" strokeWidth={1.5} />
          ))}
          <path d={`${d} L${lx},${Hh} L0,${Hh} Z`} fill="url(#cumArea)" />
          <path d={d} fill="none" stroke={C.gold} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
          <circle cx={lx} cy={ly} r={11} fill={C.gold} />
          <circle cx={lx} cy={ly} r={22} fill={C.gold} opacity={0.2} />
          <text x={0} y={Hh + 36} fill={C.dim} fontFamily={F.mono} fontSize={22}>
            ДЕНЬ 1
          </text>
          <text x={W} y={Hh + 36} fill={C.dim} fontFamily={F.mono} fontSize={22} textAnchor="end">
            ДЕНЬ 30
          </text>
        </svg>
      </div>
      <div style={{position: 'absolute', left: SAFE.left, top: 1150, fontFamily: F.mono, fontSize: 30, fontWeight: 500, color: C.muted, opacity: prog(frame, f0 + 6, f0 + 18)}}>
        20 + 25 + 30 + … + 165 = <span style={{color: C.ivory}}>{total.toLocaleString('ru-RU')}</span>
      </div>
    </SceneShell>
  );
};

/** 25.8–29.5s: market may keep falling (red, real recent curve) — purchases continue (gold). */
export const ResolveScene: React.FC<SceneProps> = ({ep, start, dur}) => {
  const frame = useCurrentFrame();
  const c = ep.cues;
  const r1 = at(frame, start, c.marketFalls - 0.15, 12);
  const r2 = at(frame, start, c.stopBuying - 0.15, 12);
  const stamp = at(frame, start, c.notGoing - 0.05, 9);
  const s = pop(frame, sec(c.notGoing) - sec(start), 30, 11, 220);
  const row: React.CSSProperties = {width: 900, height: 300, padding: '30px 34px', boxSizing: 'border-box'};
  return (
    <SceneShell dur={dur} enter="whip" exit="whip">
      <div style={{position: 'absolute', left: SAFE.left, top: 250}}>
        <Kicker t={prog(frame, 0, 10)}>Правило эксперимента</Kicker>
      </div>
      <div style={{position: 'absolute', left: SAFE.left, top: 316, opacity: r1, transform: `translateX(${(1 - r1) * -80}px)`}}>
        <Panel style={row}>
          <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
            <Arrow dir="down" color={C.loss} size={54} />
            <div>
              <div style={{fontFamily: F.text, fontWeight: 800, fontSize: 54, color: C.ivory, lineHeight: 1}}>РЫНОК</div>
              <div style={{fontFamily: F.mono, fontSize: 22, color: C.muted, marginTop: 6}}>если продолжит падать</div>
            </div>
          </div>
          <div style={{position: 'absolute', right: 40, top: 40}}>
            <MarketDrop width={380} height={210} draw={r1} window={{from: '2026-07-01'}} yMin={38} yMax={72} stroke={6} gridLabels={false} />
          </div>
        </Panel>
      </div>
      <div style={{position: 'absolute', left: SAFE.left, top: 650, opacity: r2, transform: `translateX(${(1 - r2) * 80}px)`}}>
        <Panel style={row} glow={`${C.gold}22`}>
          <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
            <Arrow dir="up" color={C.gold} size={54} />
            <div>
              <div style={{fontFamily: F.text, fontWeight: 800, fontSize: 54, color: C.gold, lineHeight: 1}}>ЗАКУПКИ</div>
              <div style={{fontFamily: F.mono, fontSize: 22, color: C.muted, marginTop: 6}}>продолжаются по плану</div>
            </div>
          </div>
          <div style={{position: 'absolute', right: 36, top: 52}}>
            <PurchaseLadder width={380} height={190} days={ep.totalDays} start={ep.dailyStart} step={ep.dailyStep} bought={ep.day} reveal={(i) => prog(frame, sec(c.stopBuying) - sec(start) + i * 0.6, sec(c.stopBuying) - sec(start) + i * 0.6 + 8)} depth={6} />
          </div>
        </Panel>
      </div>
      <div style={{position: 'absolute', left: SAFE.left, right: SAFE.right, top: 1010, display: 'flex', justifyContent: 'center'}}>
        <div
          style={{
            fontFamily: F.display,
            fontWeight: 800,
            fontSize: 74,
            color: C.gold,
            border: `5px solid ${C.gold}`,
            borderRadius: 18,
            padding: '16px 34px',
            letterSpacing: -1,
            opacity: stamp,
            transform: `rotate(-4deg) scale(${1.5 - 0.5 * s})`,
            background: 'rgba(11,14,19,0.6)',
            boxShadow: `0 0 50px ${C.gold}33`,
          }}
        >
          БЕЗ ОСТАНОВОК
        </div>
      </div>
      <SourceTag t={r1} style={{position: 'absolute', left: SAFE.left, top: 1235}}>
        красная линия — реальная медиана Steam с июля 2026
      </SourceTag>
    </SceneShell>
  );
};
