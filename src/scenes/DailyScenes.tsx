import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Digits, Kicker, MaskLine, SceneShell} from '../brand/primitives';
import {C, F, SAFE} from '../brand/tokens';
import {CompareCard} from '../components/CompareCard';
import {FootageStage} from '../components/FootageStage';
import {cumulative, dailyQty} from '../components/PurchaseLadder';
import type {Episode, StageClip} from '../episodes/types';
import {EASE_OUT, pop, sec} from '../lib/anim';
import type {SceneProps} from './types';

// Format for daily update episodes (day 2+): ~90% real footage, numbers laid over the interface.

/** Appear/disappear progress between absolute seconds. */
const useWin = (start: number) => {
  const f = useCurrentFrame() + sec(start);
  return (from: number, to = 1e9, inF = 10, outF = 6) =>
    Math.min(
      interpolate(f, [sec(from), sec(from) + inF], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT}),
      interpolate(f, [sec(to) - outF, sec(to)], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
    );
};

const Stage: React.FC<{ep: Episode; clip: StageClip; start: number; overlay?: Parameters<typeof FootageStage>[0]['overlay']}> = ({ep, clip, start, overlay}) => (
  <FootageStage footage={ep.footage} fromSec={clip.from} rate={clip.rate} start={start} shots={clip.shots} spots={clip.spots} overlay={overlay} />
);

const Top: React.FC<{children: React.ReactNode; t?: number; color?: string}> = ({children, t = 1, color}) => (
  <div style={{position: 'absolute', left: SAFE.left, top: 236}}>
    <Kicker t={t} color={color}>
      {children}
    </Kicker>
  </div>
);

const Pill: React.FC<{t: number; children: React.ReactNode; color?: string; style?: React.CSSProperties}> = ({t, children, color = C.gold, style}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 14,
      padding: '14px 24px',
      borderRadius: 16,
      background: 'rgba(11,14,19,0.9)',
      border: `2px solid ${color}`,
      fontFamily: F.text,
      fontWeight: 800,
      fontSize: 40,
      color: C.ivory,
      opacity: t,
      transform: `translateY(${(1 - t) * 24}px) scale(${0.92 + 0.08 * t})`,
      boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
      ...style,
    }}
  >
    {children}
  </div>
);

const fmt2 = (n: number) => n.toFixed(2).replace('.', ',');
const fmtInt = (n: number) => n.toLocaleString('ru-RU').replace(/\s/g, ' ');

/** 0–5.9 s: the case no longer drops — yet the supply keeps growing. Hook is on screen from frame 0. */
export const DailyHook: React.FC<SceneProps> = ({ep, start, dur}) => {
  const d = ep.daily!;
  const c = ep.cues;
  const w = useWin(start);
  const f = useCurrentFrame() + sec(start);
  const lotsV = interpolate(f, [sec(1.75), sec(c.grows + 0.2)], [d.yesterday.lots, d.today.lots], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT});
  const strike = interpolate(f, [sec(c.notDrop), sec(c.notDrop) + 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT});
  const head = w(-1, 1.62, 1, 6);
  return (
    <SceneShell dur={dur} enter="cut" exit="push">
      <Stage
        ep={ep}
        clip={d.stages.hook}
        start={start}
        overlay={() => (
          <>
            <Top t={w(-1, 4.04, 1)}>CS2 · {ep.caseName}</Top>
            {/* Beat 1: no drops */}
            <div style={{position: 'absolute', left: 0, right: 0, top: 820, height: 420, opacity: head, background: 'linear-gradient(to bottom, transparent, rgba(11,14,19,0.92) 30%, rgba(11,14,19,0.92) 85%, transparent)'}} />
            <div style={{position: 'absolute', left: SAFE.left, right: SAFE.right, top: 920, opacity: head}}>
              <div style={{fontFamily: F.text, fontWeight: 800, fontSize: 60, color: C.ivory, lineHeight: 1}}>Больше</div>
              <div style={{position: 'relative', display: 'inline-block', marginTop: 10}}>
                <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 90, color: C.ivory, letterSpacing: -2, lineHeight: 1, whiteSpace: 'nowrap'}}>НЕ ВЫПАДАЕТ</div>
                <div style={{position: 'absolute', left: -6, top: '52%', height: 9, width: `${strike * 104}%`, background: C.loss, borderRadius: 6, transform: 'rotate(-2deg)'}} />
              </div>
            </div>
            {/* Beat 2: supply keeps growing */}
            <div style={{position: 'absolute', left: SAFE.left, right: SAFE.right, top: 960, opacity: w(1.7, 4.04)}}>
              <div style={{fontFamily: F.mono, fontWeight: 600, fontSize: 26, letterSpacing: 3, color: C.muted}}>ЛОТОВ НА ПРОДАЖЕ · STEAM</div>
              <div style={{display: 'flex', alignItems: 'center', gap: 22, marginTop: 10}}>
                <Digits value={Math.round(lotsV)} digitWidth={0.66} style={{fontFamily: F.display, fontWeight: 800, fontSize: 132, color: C.ivory, letterSpacing: -3, lineHeight: 1}} />
                <div
                  style={{
                    fontFamily: F.display,
                    fontWeight: 800,
                    fontSize: 46,
                    color: C.canvas,
                    background: C.gold,
                    borderRadius: 14,
                    padding: '8px 16px',
                    opacity: w(c.grows - 0.05),
                    transform: `scale(${0.7 + 0.3 * w(c.grows - 0.05)})`,
                  }}
                >
                  ▲
                </div>
              </div>
            </div>
            {/* Beat 3: the experiment */}
            <div style={{position: 'absolute', left: SAFE.left, right: SAFE.right, top: 268, opacity: w(4.2)}}>
              <MaskLine t={w(4.2)}>
                <div style={{fontFamily: F.text, fontWeight: 800, fontSize: 64, color: C.ivory, letterSpacing: -1}}>
                  Скупаю <span style={{color: C.gold}}>целый месяц</span>
                </div>
              </MaskLine>
            </div>
            <div style={{position: 'absolute', left: 0, right: 0, top: 1216, display: 'flex', justifyContent: 'center'}}>
              <Pill t={w(c.month - 0.1)} style={{fontSize: 30, fontFamily: F.mono, fontWeight: 600}}>
                30 ДНЕЙ · 20 → 165 В ДЕНЬ · {fmtInt(cumulative(ep.totalDays, ep.dailyStart, ep.dailyStep))}
              </Pill>
            </div>
          </>
        )}
      />
    </SceneShell>
  );
};

/** 5.9–9.1 s: «сегодня второй день» over the real listing. */
export const DailyIntro: React.FC<SceneProps> = ({ep, start, dur}) => {
  const w = useWin(start);
  const c = ep.cues;
  const s = pop(useCurrentFrame(), sec(c.secondDay) - sec(start), 30, 12, 200);
  const done = cumulative(ep.day - 1, ep.dailyStart, ep.dailyStep);
  return (
    <SceneShell dur={dur} enter="whip" exit="push">
      <Stage
        ep={ep}
        clip={ep.daily!.stages.intro}
        start={start}
        overlay={() => (
          <>
            <Top t={w(start)}>Инвестиционный эксперимент</Top>
            <div style={{position: 'absolute', left: SAFE.left, top: 300, display: 'flex', alignItems: 'flex-end', gap: 26}}>
              <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 96, color: C.ivory, lineHeight: 1, paddingBottom: 26, opacity: w(start + 0.1)}}>ДЕНЬ</div>
              <div
                style={{fontFamily: F.display, fontWeight: 800, fontSize: 290, color: C.gold, lineHeight: 0.9, letterSpacing: -12, opacity: Math.min(1, s * 1.5), transform: `scale(${0.85 + 0.15 * s})`, transformOrigin: 'left bottom'}}
              >
                {String(ep.day).padStart(2, '0')}
              </div>
              <div style={{fontFamily: F.mono, fontWeight: 600, fontSize: 40, color: C.muted, paddingBottom: 30, opacity: s}}>/{ep.totalDays}</div>
            </div>
            <div style={{position: 'absolute', left: SAFE.left, right: SAFE.right, top: 640, display: 'flex', gap: 16, opacity: w(c.secondDay + 0.4)}}>
              <Pill t={w(c.secondDay + 0.4)} style={{fontSize: 30, fontFamily: F.mono, fontWeight: 600}} color={C.border}>
                <span style={{color: C.muted}}>КУПЛЕНО</span> {done}
              </Pill>
              <Pill t={w(c.secondDay + 0.7)} style={{fontSize: 30, fontFamily: F.mono, fontWeight: 600}}>
                <span style={{color: C.muted}}>СЕГОДНЯ</span> +{dailyQty(ep.day, ep.dailyStart, ep.dailyStep)}
              </Pill>
            </div>
          </>
        )}
      />
    </SceneShell>
  );
};

/** 9.1–21.5 s: lots 172 025 → 173 854, then min price unchanged — counted over the real orderbook. */
export const DailyMarket: React.FC<SceneProps> = ({ep, start, dur}) => {
  const d = ep.daily!;
  const c = ep.cues;
  const w = useWin(start);
  const dLots = d.today.lots - d.yesterday.lots;
  const pct = ((dLots / d.yesterday.lots) * 100).toFixed(2).replace('.', ',');
  const dMin = d.today.minPrice - d.yesterday.minPrice;
  return (
    <SceneShell dur={dur} enter="push" exit="whip">
      <Stage
        ep={ep}
        clip={d.stages.market}
        start={start}
        overlay={() => (
          <>
            <Top t={w(start)}>Steam Market · за сутки</Top>
            <CompareCard
              start={start}
              show={c.from172 - 0.4}
              hide={17.36}
              label="ЛОТОВ НА ПРОДАЖЕ"
              before={d.yesterday.lots}
              after={d.today.lots}
              countFrom={c.to174}
              countTo={c.to174End}
              delta={{at: c.plus1800, text: `▲ +${fmtInt(dLots)} · +${pct.replace(/0$/, '')} %`, color: C.gold}}
              note="Steam · 20.10 → 21.10"
              style={{top: 940}}
            />
            <CompareCard
              start={start}
              show={17.5}
              hide={21.5}
              label="МИНИМАЛЬНАЯ ЦЕНА ЛОТА"
              before={d.yesterday.minPrice}
              after={d.today.minPrice}
              countFrom={c.price4061}
              countTo={c.price4061 + 0.6}
              decimals={2}
              suffix=" ₽"
              delta={{at: c.unchanged, text: dMin === 0 ? '= 0,00 ₽' : `${dMin > 0 ? '+' : '−'}${fmt2(Math.abs(dMin))} ₽`, color: C.muted}}
              note="без изменений"
              style={{top: 940}}
            />
          </>
        )}
      />
    </SceneShell>
  );
};

/** 21.5–25.3 s: the real Place Buy Order dialog (40,78 → 40 ₽, 25 шт.) + order price comparison. */
export const DailyOrder: React.FC<SceneProps> = ({ep, start, dur}) => {
  const d = ep.daily!;
  const c = ep.cues;
  const w = useWin(start);
  const dOrder = d.today.orderPrice - d.yesterday.orderPrice;
  return (
    <SceneShell dur={dur} enter="whip" exit="push">
      <Stage
        ep={ep}
        clip={d.stages.order}
        start={start}
        overlay={() => (
          <>
            <Top t={w(start)}>Steam · Place Buy Order</Top>
            <CompareCard
              start={start}
              show={c.orderPrice}
              label="ЦЕНА ОРДЕРА НА ПОКУПКУ"
              before={d.yesterday.orderPrice}
              after={d.today.orderPrice}
              countFrom={c.from4030 + 0.3}
              countTo={c.to40End}
              decimals={2}
              suffix=" ₽"
              delta={{at: c.to40End, text: `▼ ${dOrder < 0 ? '−' : '+'}${fmt2(Math.abs(dOrder))} ₽`, color: C.ivory}}
              note="заявка, ещё не сделка"
              style={{top: 940}}
            />
          </>
        )}
      />
    </SceneShell>
  );
};

/** 25.3–28.7 s: my open order on the real page (SIH chip «25 шт. | 40.00 ₽»). */
export const DailyMyOrder: React.FC<SceneProps> = ({ep, start, dur}) => {
  const d = ep.daily!;
  const c = ep.cues;
  const w = useWin(start);
  return (
    <SceneShell dur={dur} enter="push" exit="push">
      <Stage
        ep={ep}
        clip={d.stages.myOrder}
        start={start}
        overlay={() => (
          <>
            <Top t={w(start)}>Мой ордер · активен</Top>
            <div style={{position: 'absolute', left: SAFE.left, right: SAFE.right, top: 1030, display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start'}}>
              <Pill t={w(start + 0.5)}>
                <span style={{fontFamily: F.mono, color: C.gold}}>{d.today.qty} шт.</span> × <span style={{fontFamily: F.mono}}>{fmt2(d.today.orderPrice)} ₽</span>
              </Pill>
              <Pill t={w(c.cheaper - 0.1)} color={C.border} style={{fontSize: 32}}>
                на <span style={{color: C.gold}}>{fmt2(Math.abs(d.today.orderPrice - d.yesterday.orderPrice))} ₽</span> дешевле вчерашнего ордера
              </Pill>
            </div>
          </>
        )}
      />
    </SceneShell>
  );
};

/** 28.7–30.3 s: Steam confirms the order was placed. */
export const DailySuccess: React.FC<SceneProps> = ({ep, start, dur}) => {
  const d = ep.daily!;
  const w = useWin(start);
  return (
    <SceneShell dur={dur} enter="push" exit="whip">
      <Stage
        ep={ep}
        clip={d.stages.success}
        start={start}
        overlay={() => (
          <>
            <Top t={w(start)}>Объём растёт</Top>
            <div style={{position: 'absolute', left: 0, right: 0, top: 960, display: 'flex', justifyContent: 'center'}}>
              <Pill t={w(start + 0.25)}>
                <span style={{width: 40, height: 40, borderRadius: 40, background: C.gold, color: C.canvas, display: 'grid', placeItems: 'center', fontSize: 26}}>✓</span>
                Ордер на {d.today.qty} шт. размещён
              </Pill>
            </div>
          </>
        )}
      />
    </SceneShell>
  );
};

/** 30.3–35.2 s: CS2 inventory «Новый предмет 1/25» + the 20 → 25 → 30 ladder. */
export const DailyInventory: React.FC<SceneProps> = ({ep, start, dur}) => {
  const d = ep.daily!;
  const c = ep.cues;
  const w = useWin(start);
  const steps: Array<{day: number; at: number; state: 'done' | 'today' | 'plan'}> = [
    {day: ep.day - 1, at: c.y20, state: 'done'},
    {day: ep.day, at: c.t25, state: 'today'},
    {day: ep.day + 1, at: c.tomorrow30, state: 'plan'},
  ];
  return (
    <SceneShell dur={dur} enter="whip" exit="push">
      <Stage
        ep={ep}
        clip={d.stages.inventory}
        start={start}
        overlay={() => (
          <>
            <Top t={w(start)}>CS2 · инвентарь</Top>
            <div style={{position: 'absolute', left: SAFE.left - 20, right: SAFE.right - 20, top: 1112, display: 'flex', gap: 14}}>
              {steps.map((s) => {
                const t = w(s.at - 0.08);
                const gold = s.state === 'today';
                return (
                  <div
                    key={s.day}
                    style={{
                      flex: 1,
                      padding: '16px 18px',
                      borderRadius: 18,
                      background: gold ? `linear-gradient(150deg, ${C.goldHi}, ${C.gold})` : 'rgba(11,14,19,0.9)',
                      border: `2px ${s.state === 'plan' ? 'dashed' : 'solid'} ${gold ? C.gold : C.border}`,
                      opacity: t,
                      transform: `translateY(${(1 - t) * 30}px)`,
                    }}
                  >
                    <div style={{fontFamily: F.mono, fontWeight: 600, fontSize: 22, letterSpacing: 2, color: gold ? C.canvas : C.muted}}>
                      ДЕНЬ {String(s.day).padStart(2, '0')} {s.state === 'done' ? '✓' : s.state === 'plan' ? '· ПЛАН' : ''}
                    </div>
                    <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 72, color: gold ? C.canvas : C.ivory, lineHeight: 1.05}}>
                      {dailyQty(s.day, ep.dailyStart, ep.dailyStep)}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      />
    </SceneShell>
  );
};

/** 35.2–41.8 s: forecast question over the real monthly chart + next-day outro. */
export const DailyForecast: React.FC<SceneProps> = ({ep, start, dur}) => {
  const d = ep.daily!;
  const c = ep.cues;
  const w = useWin(start);
  const total = cumulative(ep.totalDays, ep.dailyStart, ep.dailyStep);
  const held = cumulative(ep.day, ep.dailyStart, ep.dailyStep);
  const next = dailyQty(ep.day + 1, ep.dailyStart, ep.dailyStep);
  const row = (t: number, color: string, badge: string, text: React.ReactNode): React.ReactNode => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 22,
        padding: '18px 26px',
        borderRadius: 18,
        background: 'rgba(11,14,19,0.9)',
        border: `2px solid ${color}`,
        opacity: t,
        transform: `translateX(${(1 - t) * 80}px)`,
      }}
    >
      <div style={{width: 54, height: 54, borderRadius: 14, display: 'grid', placeItems: 'center', background: color, color: C.canvas, fontFamily: F.display, fontWeight: 800, fontSize: 30}}>{badge}</div>
      <div style={{fontFamily: F.text, fontWeight: 800, fontSize: 46, color: C.ivory}}>{text}</div>
    </div>
  );
  return (
    <SceneShell dur={dur} enter="whip" exit="cut">
      <Stage
        ep={ep}
        clip={d.stages.forecast}
        start={start}
        overlay={() => (
          <>
            <Top t={w(start)}>Твой прогноз · через месяц</Top>
            <div style={{position: 'absolute', left: SAFE.left, right: SAFE.right, top: 790, display: 'flex', flexDirection: 'column', gap: 14}}>
              {row(w(c.pricier - 0.1), C.gold, '↑', 'Будет дороже')}
              {row(w(c.cheaperFc - 0.1), C.loss, '↓', 'Рынок упадёт — дешевле')}
            </div>
            <div style={{position: 'absolute', left: SAFE.left, right: SAFE.right, top: 1092, opacity: w(c.comment - 0.05), transform: `translateY(${(1 - w(c.comment - 0.05)) * 30}px)`}}>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 26px', borderRadius: 20, background: C.card, border: `1.5px solid ${C.border}`}}>
                <div>
                  <div style={{fontFamily: F.mono, fontSize: 22, letterSpacing: 2, color: C.muted}}>ЗАВТРА · ДЕНЬ {String(ep.day + 1).padStart(2, '0')}/{ep.totalDays}</div>
                  <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 52, color: C.ivory, marginTop: 4}}>
                    <span style={{color: C.gold}}>+{next}</span> кейсов
                  </div>
                </div>
                <div style={{textAlign: 'right'}}>
                  <div style={{fontFamily: F.mono, fontSize: 22, letterSpacing: 2, color: C.muted}}>ВСЕГО</div>
                  <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 40, color: C.ivory, marginTop: 6}}>
                    <span style={{color: C.gold}}>{held}</span>
                    <span style={{color: C.dim}}> / </span>
                    {fmtInt(total)}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      />
    </SceneShell>
  );
};
