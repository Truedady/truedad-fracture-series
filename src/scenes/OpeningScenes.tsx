import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Kicker, MaskLine, Panel, SceneShell, SourceTag} from '../brand/primitives';
import {C, F, SAFE} from '../brand/tokens';
import {MarketDrop, chartFacts} from '../components/MarketDrop';
import {MetricTicker} from '../components/MetricTicker';
import {PurchaseLadder} from '../components/PurchaseLadder';
import {SteamEvidenceFrame} from '../components/SteamEvidenceFrame';
import {EASE_IN_OUT, at, prog, sec} from '../lib/anim';
import type {SceneProps} from './types';

const pct = Math.round(((chartFacts.last.rub - chartFacts.peak.rub) / chartFacts.peak.rub) * 100); // from the digitized Steam curve
const ruDate = (iso: string) => iso.split('-').reverse().slice(0, 2).join('.');

const Chip: React.FC<{children: React.ReactNode; color: string; t: number; style?: React.CSSProperties}> = ({children, color, t, style}) => (
  <div
    style={{
      display: 'inline-flex',
      padding: '10px 18px',
      borderRadius: 12,
      background: `${color}22`,
      border: `1.5px solid ${color}`,
      color,
      fontFamily: F.mono,
      fontWeight: 600,
      fontSize: 34,
      transform: `scale(${0.7 + 0.3 * t})`,
      opacity: t,
      ...style,
    }}
  >
    {children}
  </div>
);

/** 0–2.9s: falling market (real curve) vs. my growing purchases. Something strong is on screen from frame 0. */
export const HookScene: React.FC<SceneProps> = ({ep, start, dur}) => {
  const frame = useCurrentFrame();
  const c = ep.cues;
  const draw = interpolate(frame, [0, sec(0.95)], [0.62, 1], {extrapolateRight: 'clamp', easing: EASE_IN_OUT});
  const split = prog(frame, sec(c.iBuy) - 4, sec(c.iBuy) + 10, EASE_IN_OUT); // camera move into the contrast layout
  const t1 = 1;
  const tFalls = at(frame, start, c.falls - 0.1, 9);
  const tChip = at(frame, start, c.falls + 0.05, 8);
  const tBuy = at(frame, start, c.iBuy + 0.05, 10);
  const chartY = interpolate(split, [0, 1], [620, 300]);
  const chartScale = interpolate(split, [0, 1], [1, 0.62]);
  return (
    <SceneShell dur={dur} enter="cut" exit="whip">
      {/* Market block */}
      <div style={{position: 'absolute', left: SAFE.left, top: 250, right: SAFE.right, opacity: 1 - split}}>
        <MaskLine t={t1}>
          <div style={{fontFamily: F.text, fontWeight: 800, fontSize: 104, color: C.ivory, letterSpacing: -2, lineHeight: 1}}>РЫНОК CS2</div>
        </MaskLine>
        <MaskLine t={tFalls}>
          <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 136, color: C.loss, letterSpacing: -3, lineHeight: 1.05}}>ПАДАЕТ</div>
        </MaskLine>
      </div>
      <div style={{position: 'absolute', left: SAFE.left, top: 236, opacity: split, transform: `translateY(${(1 - split) * 30}px)`}}>
        <Kicker color={C.loss}>Рынок CS2 · Fracture Case · Steam</Kicker>
      </div>
      <div
        style={{
          position: 'absolute',
          left: SAFE.left,
          top: chartY,
          width: 860,
          height: 460,
          transformOrigin: '0 0',
          transform: `perspective(1400px) rotateX(${10 - split * 6}deg) rotateY(${-8 + frame * 0.12}deg) scale(${chartScale * (1 + frame * 0.0015)})`,
        }}
      >
        <MarketDrop
          width={860}
          height={460}
          draw={draw}
          window={{from: '2026-03-01'}}
          yMin={35}
          yMax={95}
          stroke={8}
          gridLabels={false}
          peakLabel={<Chip color={C.ivory} t={1} style={{fontSize: 28, padding: '6px 12px'}}>пик {Math.round(chartFacts.peak.rub)} ₽</Chip>}
          peakT={prog(frame, 6, 14)}
          endLabel={<Chip color={C.loss} t={tChip}>{pct}%</Chip>}
        />
      </div>
      <SourceTag t={1 - split} style={{position: 'absolute', left: SAFE.left, top: 1130}}>
        Steam · медиана продаж Fracture Case · мар–окт 2026
      </SourceTag>
      {/* Buying block */}
      <div style={{position: 'absolute', left: SAFE.left, right: SAFE.right, top: 660, opacity: tBuy, transform: `translateY(${(1 - tBuy) * 120}px)`}}>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 22}}>
          <span style={{fontFamily: F.text, fontWeight: 800, fontSize: 66, color: C.ivory}}>А Я</span>
          <span style={{fontFamily: F.display, fontWeight: 800, fontSize: 92, color: C.gold, letterSpacing: -2}}>ПОКУПАЮ</span>
        </div>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 20, marginTop: 6}}>
          <span style={{fontFamily: F.text, fontWeight: 700, fontSize: 52, color: C.muted}}>почти</span>
          <MetricTicker to={3000} style={{marginRight: 12}} startFrame={sec(c.iBuy + 0.2) - sec(start)} endFrame={sec(2.5) - sec(start)} size={150} color={C.ivory} />
          <span style={{fontFamily: F.text, fontWeight: 800, fontSize: 52, color: C.ivory}}>кейсов</span>
        </div>
      </div>
      <div style={{position: 'absolute', left: SAFE.left, top: 1000, opacity: tBuy}}>
        <PurchaseLadder
          width={880}
          height={230}
          days={ep.totalDays}
          start={ep.dailyStart}
          step={ep.dailyStep}
          bought={0}
          reveal={(i) => prog(frame, sec(c.iBuy) + i * 1.1, sec(c.iBuy) + i * 1.1 + 10)}
          depth={12}
        />
      </div>
    </SceneShell>
  );
};

/** 2.9–6.4s: real Steam listing, camera pushes into the "−38% за месяц" widget on «месяц». */
export const EvidenceScene: React.FC<SceneProps> = ({ep, start, dur}) => {
  const frame = useCurrentFrame();
  const c = ep.cues;
  const push = at(frame, start, c.cheaper - 0.1, sec(c.month - c.cheaper + 0.1), EASE_IN_OUT);
  const ring = at(frame, start, c.month, 8);
  const big = at(frame, start, c.month + 0.02, 10);
  const lost = at(frame, start, c.lostValue, 10);
  return (
    <SceneShell dur={dur} enter="whip" exit="push">
      <div style={{position: 'absolute', left: SAFE.left, top: 236}}>
        <Kicker t={at(frame, start, start, 10)}>Steam Market · запись экрана</Kicker>
      </div>
      <div style={{position: 'absolute', left: 60, top: 300, transform: `perspective(1600px) rotateY(${-7 + 7 * push}deg) rotateX(${3 - 3 * push}deg)`}}>
        <SteamEvidenceFrame
          src={ep.footage.src}
          srcW={ep.footage.width}
          srcH={ep.footage.height}
          fromSec={0.2}
          playbackRate={0.9}
          boxW={960}
          boxH={700}
          rectA={{x: 410, y: 245, w: 760, h: 554}}
          rectB={{x: 712, y: 290, w: 400, h: 292}}
          t={push}
          label="REC · 20.10.2026"
          overlay={
            <div
              style={{
                position: 'absolute',
                left: 934,
                top: 341,
                width: 70,
                height: 23,
                borderRadius: 5,
                border: `2px solid ${C.loss}`,
                boxShadow: `0 0 12px ${C.loss}`,
                opacity: ring,
                transform: `scale(${1.4 - 0.4 * ring})`,
              }}
            />
          }
        />
      </div>
      <div style={{position: 'absolute', left: SAFE.left, right: SAFE.right, top: 1035, display: 'flex', alignItems: 'flex-end', gap: 26}}>
        <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 150, color: C.loss, lineHeight: 0.9, opacity: big, transform: `translateY(${(1 - big) * 40}px)`}}>−38%</div>
        <div style={{paddingBottom: 10, opacity: big}}>
          <div style={{fontFamily: F.text, fontWeight: 800, fontSize: 48, color: C.ivory}}>за месяц</div>
          <div style={{fontFamily: F.text, fontWeight: 700, fontSize: 30, color: C.muted, opacity: lost}}>цена Fracture Case</div>
        </div>
      </div>
      <SourceTag t={big} style={{position: 'absolute', left: SAFE.left, top: 1226}}>
        виджет SIH на странице Steam · цена в € · 20.10.2026
      </SourceTag>
    </SceneShell>
  );
};

/** 6.4–11.2s: the question, over the real 12-month curve; the fall from the peak lights up red. */
export const QuestionScene: React.FC<SceneProps> = ({ep, start, dur}) => {
  const frame = useCurrentFrame();
  const c = ep.cues;
  const l1 = at(frame, start, 7.6, 10);
  const l2 = at(frame, start, c.earn - 0.05, 10);
  const l3 = at(frame, start, c.falling - 0.12, 10);
  const draw = at(frame, start, start, sec(2.4), EASE_IN_OUT);
  const focus = at(frame, start, 9.2, 18);
  const startDot = at(frame, start, c.falling, 10);
  return (
    <SceneShell dur={dur} enter="push" exit="whip">
      <div style={{position: 'absolute', left: SAFE.left, right: SAFE.right, top: 250}}>
        <Kicker t={at(frame, start, start + 0.1, 10)}>Гипотеза</Kicker>
        <MaskLine t={at(frame, start, 6.66, 10)}>
          <div style={{fontFamily: F.text, fontWeight: 700, fontSize: 48, color: C.muted, marginTop: 18}}>Я решил проверить:</div>
        </MaskLine>
        <div style={{marginTop: 10}}>
          <MaskLine t={l1}>
            <div style={{fontFamily: F.text, fontWeight: 800, fontSize: 92, color: C.ivory, lineHeight: 1.02, letterSpacing: -2}}>МОЖНО ЛИ</div>
          </MaskLine>
          <MaskLine t={l2}>
            <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 96, color: C.gold, lineHeight: 1.08, letterSpacing: -3}}>ЗАРАБОТАТЬ</div>
          </MaskLine>
          <MaskLine t={l3}>
            <div style={{fontFamily: F.text, fontWeight: 800, fontSize: 92, color: C.ivory, lineHeight: 1.02, letterSpacing: -2}}>
              НА <span style={{color: C.loss}}>ПАДЕНИИ?</span>
            </div>
          </MaskLine>
        </div>
      </div>
      <div style={{position: 'absolute', left: SAFE.left, top: 790, transform: `perspective(1600px) rotateX(8deg) rotateY(${4 - frame * 0.06}deg)`}}>
        <Panel style={{width: 900, height: 470, padding: '34px 30px 30px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: F.mono, fontSize: 22, color: C.muted, letterSpacing: 1}}>
            <span>FRACTURE CASE · МЕДИАНА ПРОДАЖ</span>
            <span>12 МЕС.</span>
          </div>
          <div style={{position: 'absolute', left: 30, top: 100}}>
            <MarketDrop
              width={760}
              height={300}
              draw={draw}
              color={C.loss}
              baseColor={C.dim}
              focusFrom={chartFacts.peak.date}
              focusT={focus}
              yMin={30}
              yMax={95}
              stroke={5}
              showEnd={false}
              peakLabel={
                <div style={{fontFamily: F.mono, fontSize: 24, color: C.ivory, background: C.canvas, padding: '4px 10px', borderRadius: 8, border: `1px solid ${C.border}`}}>
                  {Math.round(chartFacts.peak.rub)} ₽ · {ruDate(chartFacts.peak.date)}
                </div>
              }
              peakT={focus}
            />
            <div style={{position: 'absolute', left: 760 - 11, top: 300 - ((chartFacts.last.rub - 30) / 65) * 300 - 11, opacity: startDot}}>
              <div style={{width: 22, height: 22, borderRadius: 22, background: C.gold, boxShadow: `0 0 0 ${10 * startDot}px ${C.gold}33, 0 0 24px ${C.gold}`}} />
              <div style={{position: 'absolute', right: -6, top: 34, whiteSpace: 'nowrap', fontFamily: F.mono, fontWeight: 600, fontSize: 24, color: C.gold}}>СТАРТ · ДЕНЬ 1</div>
            </div>
          </div>
        </Panel>
        <SourceTag t={draw} style={{marginTop: 18}}>
          Steam Market · оцифровано со скриншота 20.10.2026
        </SourceTag>
      </div>
    </SceneShell>
  );
};
