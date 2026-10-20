import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Kicker, MaskLine, Panel, SceneShell, SourceTag} from '../brand/primitives';
import {C, F, SAFE} from '../brand/tokens';
import {DayCounter} from '../components/DayCounter';
import {MetricTicker} from '../components/MetricTicker';
import {cumulative, dailyQty} from '../components/PurchaseLadder';
import {SteamEvidenceFrame} from '../components/SteamEvidenceFrame';
import {EASE_IN_OUT, at, pop, prog, sec} from '../lib/anim';
import type {SceneProps} from './types';

// Source-pixel geometry inside footage-curated.mp4 (1600×900), measured on the frames.
const DIALOG_FIELDS = {qty: {x: 985, y: 273, w: 70, h: 22}, max: {x: 1005, y: 292, w: 54, h: 18}, price: {x: 985, y: 254, w: 70, h: 20}};
const INVENTORY_TILES = (() => {
  const tiles: Array<{x: number; y: number}> = [];
  // 20 Fracture Case tiles: rows of 9, 9 and 2 (inventory sorted by "newest").
  for (let r = 0; r < 3; r++) for (let col = 0; col < (r < 2 ? 9 : 2); col++) tiles.push({x: 62 + col * 160, y: 140 + r * 158});
  return tiles;
})();
// Reveal order matches the camera: left 6 columns first, then pan right.
const TILE_ORDER = [...INVENTORY_TILES.keys()].sort((a, b) => {
  const ta = INVENTORY_TILES[a];
  const tb = INVENTORY_TILES[b];
  const ga = ta.x > 62 + 5 * 160 ? 1 : 0;
  const gb = tb.x > 62 + 5 * 160 ? 1 : 0;
  return ga - gb || ta.y - tb.y || ta.x - tb.x;
});

const Hl: React.FC<{r: {x: number; y: number; w: number; h: number}; t: number; color?: string}> = ({r, t, color = C.gold}) => (
  <div
    style={{
      position: 'absolute',
      left: r.x,
      top: r.y,
      width: r.w,
      height: r.h,
      borderRadius: 4,
      border: `2px solid ${color}`,
      boxShadow: `0 0 10px ${color}`,
      opacity: t,
      transform: `scale(${1.3 - 0.3 * t})`,
    }}
  />
);

const ValueChip: React.FC<{k: string; v: string; t: number}> = ({k, v, t}) => (
  <div style={{opacity: t, transform: `translateY(${(1 - t) * 20}px)`, padding: '14px 20px', borderRadius: 14, border: `1.5px solid ${C.border}`, background: C.card}}>
    <div style={{fontFamily: F.mono, fontSize: 20, color: C.muted, letterSpacing: 1.5}}>{k}</div>
    <div style={{fontFamily: F.mono, fontWeight: 600, fontSize: 38, color: C.ivory, marginTop: 4}}>{v}</div>
  </div>
);

/** 29.5–33.6s: real Steam buy-order dialog → «Success» → 20 cases in the CS2 inventory → $9.60. */
export const ProofScene: React.FC<SceneProps> = ({ep, start, dur}) => {
  const frame = useCurrentFrame();
  const c = ep.cues;
  const L = (s: number) => sec(s) - sec(start);
  const fSuccess = L(c.bought - 0.12);
  const fInv = L(c.spent - 0.02);
  const phase = frame < fSuccess ? 0 : frame < fInv ? 1 : 2;
  const push = prog(frame, L(c.first20) - 8, L(c.first20) + 6, EASE_IN_OUT);
  const stamp = pop(frame, L(c.bought), 30, 11, 220);
  const swap = (f: number) => prog(frame, f, f + 7);
  const pan = prog(frame, fInv + 26, fInv + 44, EASE_IN_OUT);
  const tileStart = fInv + 4;
  const tilesShown = TILE_ORDER.map((_, k) => {
    const s = k < 14 ? tileStart + k * 1.4 : fInv + 44 + (k - 14) * 1.6;
    return prog(frame, s, s + 5);
  });
  const count = tilesShown.filter((t) => t > 0.5).length;
  const usd = at(frame, start, c.usd - 0.05, 10);
  const label = phase === 0 ? 'STEAM · BUY ORDER' : phase === 1 ? 'STEAM · ПОДТВЕРЖДЕНИЕ' : 'CS2 · ИНВЕНТАРЬ';
  return (
    <SceneShell dur={dur} enter="whip" exit="push">
      <div style={{position: 'absolute', left: SAFE.left, top: 250}}>
        <Kicker t={prog(frame, 0, 10)}>Реальная покупка · день 01</Kicker>
      </div>
      <div style={{position: 'absolute', left: 60, top: 310, transform: `perspective(1600px) rotateY(${-5 + 5 * prog(frame, 0, 20)}deg)`}}>
        {phase === 0 && (
          <SteamEvidenceFrame
            footage={ep.footage}
            fromSec={ep.clips.buyDialog.from}
            boxW={960}
            boxH={600}
            rectA={{x: 486, y: 214, w: 624, h: 390}}
            rectB={{x: 640, y: 205, w: 470, h: 294}}
            t={push}
            label={label}
            overlay={
              <>
                <Hl r={DIALOG_FIELDS.qty} t={prog(frame, L(c.first20), L(c.first20) + 6)} />
                <Hl r={DIALOG_FIELDS.max} t={prog(frame, L(c.first20) + 6, L(c.first20) + 12)} />
              </>
            }
          />
        )}
        {phase === 1 && (
          <div style={{opacity: swap(fSuccess), position: 'relative'}}>
            <SteamEvidenceFrame
              footage={ep.footage}
              fromSec={ep.clips.buySuccess.from}
              boxW={960}
              boxH={600}
              rectA={{x: 486, y: 214, w: 624, h: 390}}
              rectB={{x: 494, y: 300, w: 450, h: 281}}
              t={prog(frame, fSuccess, fInv)}
              label={label}
              overlay={<Hl r={{x: 506, y: 344, w: 300, h: 22}} t={prog(frame, fSuccess + 3, fSuccess + 9)} color={C.gain} />}
            />
          </div>
        )}
        {phase === 2 && (
          <div style={{opacity: swap(fInv)}}>
            <SteamEvidenceFrame
              footage={ep.footage}
              fromSec={ep.clips.inventory.from}
              boxW={960}
              boxH={600}
              rectA={{x: 40, y: 122, w: 960, h: 600}}
              rectB={{x: 540, y: 122, w: 960, h: 600}}
              t={pan}
              label={label}
              live={false}
              overlay={
                <>
                  {TILE_ORDER.map((idx, k) => (
                    <Hl key={idx} r={{x: INVENTORY_TILES[idx].x, y: INVENTORY_TILES[idx].y, w: 144, h: 126}} t={tilesShown[k]} />
                  ))}
                </>
              }
            />
          </div>
        )}
        {phase >= 1 && (
          <div
            style={{
              position: 'absolute',
              right: 26,
              bottom: 26,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '14px 22px',
              borderRadius: 16,
              background: 'rgba(11,14,19,0.9)',
              border: `2px solid ${C.gold}`,
              fontFamily: F.text,
              fontWeight: 800,
              fontSize: 36,
              color: C.ivory,
              transform: `scale(${1.4 - 0.4 * stamp})`,
              opacity: Math.min(1, stamp * 1.5),
            }}
          >
            <span style={{width: 40, height: 40, borderRadius: 40, background: C.gold, color: C.canvas, display: 'grid', placeItems: 'center', fontSize: 26}}>✓</span>
            {phase === 1 ? 'Ордер размещён' : (
              <span>
                <span style={{fontFamily: F.mono, color: C.gold}}>{String(count).padStart(2, '0')}/20</span> в инвентаре
              </span>
            )}
          </div>
        )}
      </div>
      {/* Facts from the real dialog */}
      <div style={{position: 'absolute', left: SAFE.left, right: SAFE.right, top: 950, display: 'flex', gap: 16, opacity: 1 - prog(frame, L(c.usd) - 6, L(c.usd) + 2)}}>
        <ValueChip k="КОЛ-ВО" v="20 шт." t={prog(frame, L(c.first20), L(c.first20) + 8)} />
        <ValueChip k="ЦЕНА ОРДЕРА" v="40,30 ₽" t={prog(frame, L(c.first20) + 4, L(c.first20) + 12)} />
        <ValueChip k="МАКСИМУМ" v="806 ₽" t={prog(frame, L(c.first20) + 8, L(c.first20) + 16)} />
      </div>
      {/* Spend, as spoken and as recorded in the portfolio tracker */}
      <div style={{position: 'absolute', left: SAFE.left, right: SAFE.right, top: 950, opacity: usd, transform: `translateY(${(1 - usd) * 30}px)`}}>
        <div style={{display: 'flex', alignItems: 'flex-end', gap: 24}}>
          <div style={{fontFamily: F.mono, fontSize: 26, color: C.muted, letterSpacing: 2, paddingBottom: 20}}>ПОТРАЧЕНО</div>
          <MetricTicker to={9.6} decimals={2} prefix="$" startFrame={L(c.usd)} endFrame={L(c.usdEnd)} size={150} color={C.gold} style={{letterSpacing: -6}} />
        </div>
        <SourceTag style={{marginTop: 14}}>20 × $0,48 · запись портфеля TrueSkins</SourceTag>
      </div>
    </SceneShell>
  );
};

/** 33.6–36.0s: weekly portfolio reports — the real portfolio entry, plus report days on the calendar. */
export const PortfolioScene: React.FC<SceneProps> = ({ep, start, dur}) => {
  const frame = useCurrentFrame();
  const c = ep.cues;
  const weeks = at(frame, start, c.portfolio - 0.1, 14);
  return (
    <SceneShell dur={dur} enter="push" exit="whip">
      <div style={{position: 'absolute', left: SAFE.left, top: 250}}>
        <Kicker t={prog(frame, 0, 10)}>Отчёт · каждую неделю</Kicker>
      </div>
      <div style={{position: 'absolute', left: 60, top: 310, transform: `perspective(1600px) rotateX(${6 - 6 * prog(frame, 0, dur)}deg)`}}>
        <SteamEvidenceFrame
          footage={ep.footage}
          fromSec={ep.clips.portfolio.from}
          playbackRate={ep.clips.portfolio.rate}
          boxW={960}
          boxH={420}
          rectA={{x: 180, y: 210, w: 680, h: 298}}
          rectB={{x: 196, y: 222, w: 630, h: 276}}
          t={prog(frame, 0, dur - 6, EASE_IN_OUT)}
          label="ПОРТФЕЛЬ · TRUESKINS"
          labelSide="right"
          live={false}
          overlay={<Hl r={{x: 214, y: 448, w: 600, h: 28}} t={prog(frame, 14, 22)} />}
        />
      </div>
      <div style={{position: 'absolute', left: SAFE.left, top: 790}}>
        <div style={{fontFamily: F.text, fontWeight: 800, fontSize: 48, color: C.ivory, marginBottom: 22, opacity: weeks}}>
          Результаты — <span style={{color: C.gold}}>дни 7 · 14 · 21 · 28</span>
        </div>
        <DayCounter
          days={ep.totalDays}
          today={ep.day}
          start={ep.dailyStart}
          step={ep.dailyStep}
          reveal={() => 1}
          cols={10}
          cell={82}
          showQty={0}
          markDays={[7, 14, 21, 28]}
          markT={weeks}
        />
      </div>
    </SceneShell>
  );
};

/** 36.0–38.2s: tomorrow +25, cumulative progress. */
export const TomorrowScene: React.FC<SceneProps> = ({ep, start, dur}) => {
  const frame = useCurrentFrame();
  const c = ep.cues;
  const next = dailyQty(ep.day + 1, ep.dailyStart, ep.dailyStep);
  const total = cumulative(ep.totalDays, ep.dailyStart, ep.dailyStep);
  const done = cumulative(ep.day, ep.dailyStart, ep.dailyStep);
  const after = done + next;
  const t = at(frame, start, c.tomorrow - 0.05, 10);
  const big = pop(frame, sec(c.plus25) - sec(start), 30, 12, 200);
  const bar = prog(frame, 6, 22);
  const ghost = at(frame, start, c.plus25, 14);
  return (
    <SceneShell dur={dur} enter="whip" exit="push">
      <div style={{position: 'absolute', left: SAFE.left, top: 250}}>
        <Kicker t={prog(frame, 0, 10)}>Завтра · день {String(ep.day + 1).padStart(2, '0')}</Kicker>
      </div>
      <div style={{position: 'absolute', left: SAFE.left, top: 320}}>
        <MaskLine t={t}>
          <div style={{fontFamily: F.text, fontWeight: 800, fontSize: 92, color: C.ivory, letterSpacing: -2}}>ЗАВТРА</div>
        </MaskLine>
        <div style={{display: 'flex', alignItems: 'flex-end', gap: 24}}>
          <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 300, lineHeight: 0.95, color: C.gold, letterSpacing: -12, opacity: 0.25 + 0.75 * Math.min(1, big * 1.4), transform: `scale(${0.8 + 0.2 * big})`, transformOrigin: 'left bottom'}}>
            +{frame >= sec(c.plus25) - sec(start) - 3 ? next : '··'}
          </div>
          <div style={{fontFamily: F.text, fontWeight: 800, fontSize: 60, color: C.ivory, paddingBottom: 40, opacity: big}}>кейсов</div>
        </div>
      </div>
      <div style={{position: 'absolute', left: SAFE.left, right: SAFE.right, top: 860}}>
        <Panel style={{padding: '30px 34px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: F.mono, fontSize: 24, color: C.muted, letterSpacing: 1.5}}>
            <span>ПРОГРЕСС ЭКСПЕРИМЕНТА</span>
            <span>
              <span style={{color: C.gold}}>{done}</span>
              {ghost > 0.5 ? <span style={{color: C.ivory}}> → {after}</span> : null} / {total.toLocaleString('ru-RU')}
            </span>
          </div>
          <div style={{marginTop: 22, height: 26, borderRadius: 26, background: '#0F1319', border: `1.5px solid ${C.border}`, overflow: 'hidden', position: 'relative'}}>
            <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${(after / total) * 100 * ghost}%`, background: `repeating-linear-gradient(45deg, ${C.gold}55 0 8px, transparent 8px 16px)`}} />
            <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${Math.max(1.4, (done / total) * 100) * bar}%`, background: C.gold, boxShadow: `0 0 18px ${C.gold}`}} />
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 16, fontFamily: F.mono, fontSize: 22, color: C.dim}}>
            <span>ДЕНЬ {String(ep.day).padStart(2, '0')} ✓</span>
            <span>ДЕНЬ {ep.totalDays}</span>
          </div>
        </Panel>
      </div>
    </SceneShell>
  );
};

/** 38.2–44.0s: audience question + follow cue, synced to the spoken CTA. */
export const OutroCTA: React.FC<SceneProps> = ({ep, start, dur}) => {
  const frame = useCurrentFrame();
  const c = ep.cues;
  const q = prog(frame, 0, 12);
  const a = at(frame, start, c.onTime - 0.08, 10);
  const b = at(frame, start, c.throwAway - 0.08, 10);
  const cm = at(frame, start, c.comment - 0.05, 12);
  const fl = at(frame, start, c.follow - 0.05, 12);
  const total = cumulative(ep.totalDays, ep.dailyStart, ep.dailyStep);
  const done = cumulative(ep.day, ep.dailyStart, ep.dailyStep);
  const pulse = 0.5 + 0.5 * Math.sin(frame / 6);
  const card = (t: number, active: boolean): React.CSSProperties => ({
    width: 900,
    boxSizing: 'border-box',
    padding: '28px 34px',
    borderRadius: 22,
    border: `2px solid ${active ? C.gold : C.border}`,
    background: active ? `linear-gradient(120deg, ${C.gold}22, ${C.card})` : C.card,
    opacity: t,
    transform: `translateX(${(1 - t) * 90}px)`,
    display: 'flex',
    alignItems: 'center',
    gap: 26,
  });
  const badge = (txt: string, active: boolean) => (
    <div style={{width: 64, height: 64, borderRadius: 16, display: 'grid', placeItems: 'center', fontFamily: F.display, fontWeight: 800, fontSize: 32, background: active ? C.gold : '#232A35', color: active ? C.canvas : C.ivory}}>{txt}</div>
  );
  return (
    <SceneShell dur={dur} enter="whip" exit="cut">
      <div style={{position: 'absolute', left: SAFE.left, top: 250}}>
        <Kicker t={q}>Твой прогноз</Kicker>
      </div>
      <div style={{position: 'absolute', left: SAFE.left, right: SAFE.right, top: 312}}>
        <MaskLine t={q}>
          <div style={{fontFamily: F.text, fontWeight: 800, fontSize: 84, color: C.ivory, lineHeight: 1.02, letterSpacing: -2}}>
            ГЕНИЙ <span style={{color: C.muted}}>ИЛИ</span> ДУРАК?
          </div>
        </MaskLine>
      </div>
      <div style={{position: 'absolute', left: SAFE.left, top: 470, display: 'flex', flexDirection: 'column', gap: 20}}>
        <div style={card(a, true)}>
          {badge('A', true)}
          <div style={{fontFamily: F.text, fontWeight: 800, fontSize: 52, color: C.ivory}}>Вовремя начал</div>
        </div>
        <div style={card(b, false)}>
          {badge('B', false)}
          <div style={{fontFamily: F.text, fontWeight: 800, fontSize: 52, color: C.ivory}}>Выбрасываю деньги</div>
        </div>
      </div>
      <div style={{position: 'absolute', left: SAFE.left, right: SAFE.right, top: 840, opacity: cm, transform: `translateY(${(1 - cm) * 40}px)`, display: 'flex', alignItems: 'center', gap: 22}}>
        <svg width={72} height={72} viewBox="0 0 72 72">
          <path d="M10 14 h52 a6 6 0 0 1 6 6 v28 a6 6 0 0 1 -6 6 h-30 l-14 12 v-12 h-8 a6 6 0 0 1 -6 -6 v-28 a6 6 0 0 1 6 -6z" fill="none" stroke={C.gold} strokeWidth={4} />
          <circle cx={24} cy={34} r={4} fill={C.gold} />
          <circle cx={36} cy={34} r={4} fill={C.gold} />
          <circle cx={48} cy={34} r={4} fill={C.gold} />
        </svg>
        <div style={{fontFamily: F.text, fontWeight: 800, fontSize: 56, color: C.ivory}}>
          Пиши <span style={{color: C.gold}}>A</span> или <span style={{color: C.ivory, opacity: 0.8}}>B</span> в комментах
        </div>
      </div>
      <div style={{position: 'absolute', left: SAFE.left, right: SAFE.right, top: 980, opacity: fl, transform: `translateY(${(1 - fl) * 40}px)`}}>
        <Panel style={{padding: '24px 30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <div>
            <div style={{fontFamily: F.mono, fontSize: 22, color: C.muted, letterSpacing: 2}}>ДЕНЬ {String(ep.day).padStart(2, '0')}/{ep.totalDays}</div>
            <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 56, color: C.ivory, marginTop: 4}}>
              <span style={{color: C.gold}}>{done}</span>
              <span style={{color: C.dim}}> / </span>
              {total.toLocaleString('ru-RU').replace(/\s/g, ' ')}
            </div>
          </div>
          <div
            style={{
              padding: '18px 26px',
              borderRadius: 999,
              background: C.gold,
              color: C.canvas,
              fontFamily: F.text,
              fontWeight: 800,
              fontSize: 32,
              boxShadow: `0 0 ${20 + 20 * pulse}px ${C.gold}66`,
            }}
          >
            Следить →
          </div>
        </Panel>
      </div>
    </SceneShell>
  );
};
