import React from 'react';
import {AbsoluteFill, Sequence, useVideoConfig} from 'remotion';
import {PageShot, PhotoShot, Move, Sfx, Tr, TR_SEC, TR_SFX, TransitionWrap} from './engine';
import {C} from './theme';
import narration from './narration.json';

/* План: материал + вес (доля времени сцены) + переход на входе. */
export type Plan = {w: number; tr?: Tr; el: React.FC; kind: 'page' | 'photo' | 'graphic'};
export type Scene = {n: number; plans: Plan[]};

export const P = (id: string, move: Move, o: {fy?: number; fx?: number; z?: number; w?: number; tr?: Tr; gray?: boolean} = {}): Plan => ({
  w: o.w ?? 1, tr: o.tr, kind: 'page',
  el: () => <PageShot src={id.startsWith('A') ? `sources/${id}.jpg` : id} id={id} move={move} fy={o.fy} fx={o.fx} zMax={o.z} gray={o.gray} />,
});
export const I = (id: string, o: {dir?: 'in' | 'out' | 'left' | 'right' | 'up'; mode?: 'full' | 'card'; width?: number; w?: number; tr?: Tr; gray?: boolean} = {}): Plan => ({
  w: o.w ?? 1, tr: o.tr, kind: 'photo',
  el: () => <PhotoShot src={`sources/${id}.jpg`} id={id} dir={o.dir} mode={o.mode} width={o.width} gray={o.gray} />,
});
export const L = (file: string, key: string, o: {dir?: 'in' | 'out' | 'left' | 'right' | 'up'; mode?: 'full' | 'card'; w?: number; tr?: Tr; gray?: boolean} = {}): Plan => ({
  w: o.w ?? 1, tr: o.tr, kind: 'photo',
  el: () => <PhotoShot src={`local/${file}`} id={key} dir={o.dir} mode={o.mode} gray={o.gray} />,
});
export const G = (El: React.FC, o: {w?: number; tr?: Tr} = {}): Plan => ({w: o.w ?? 1, tr: o.tr, kind: 'graphic', el: El});

const N = narration as Record<string, {sec: number; text: string}>;
export const sceneSec = (n: number) => N[String(n)].sec;

/* Автоматический выбор перехода, если не задан: разнообразие + смысл. */
const autoTr = (prev: Plan | undefined, cur: Plan, idx: number, firstOfScene: boolean): Tr => {
  if (!prev) return 'dip';
  if (cur.kind === 'graphic' || prev.kind === 'graphic') return idx % 2 ? 'zoom' : 'blur';
  if (cur.kind === 'photo') return idx % 3 === 0 ? 'blur' : 'fade';
  if (firstOfScene) return (['slide', 'whip', 'slideUp', 'fade'] as Tr[])[idx % 4];
  return idx % 2 ? 'fade' : 'slide';
};

type Placed = {plan: Plan; from: number; dur: number; trIn: Tr; trOut?: Tr; n: number};
export const layout = (scenes: Scene[]) => {
  const out: Placed[] = [];
  let t = 0;
  let idx = 0;
  let prev: Plan | undefined;
  for (const s of scenes) {
    const sec = sceneSec(s.n);
    const W = s.plans.reduce((a, p) => a + p.w, 0);
    s.plans.forEach((p, i) => {
      const share = (sec * p.w) / W;
      const trIn = p.tr ?? autoTr(prev, p, idx, i === 0);
      const ov = idx === 0 ? 0 : trIn === 'dip' ? 0 : TR_SEC[trIn];
      out.push({plan: p, from: t - ov, dur: share + ov, trIn, n: s.n});
      t += share;
      prev = p;
      idx++;
    });
  }
  out.forEach((p, i) => (p.trOut = out[i + 1]?.trIn));
  // dip: уход в чёрный в конце предыдущего плана
  return {placed: out, total: t};
};

export const Film: React.FC<{scenes: Scene[]}> = ({scenes}) => {
  const {fps} = useVideoConfig();
  if (!scenes.length) return null;
  const {placed} = layout(scenes);
  return (
    <AbsoluteFill style={{background: C.black}}>
      {placed.map((p, i) => {
        const El = p.plan.el;
        const sfx = TR_SFX[p.trIn];
        return (
          <Sequence key={i} from={Math.round(p.from * fps)} durationInFrames={Math.round(p.dur * fps)} name={`Кадр ${p.n}`}>
            <TransitionWrap trIn={i === 0 ? undefined : p.trIn} trOut={p.trOut}>
              <El />
            </TransitionWrap>
            {i > 0 && sfx && <Sfx name={sfx} at={0} vol={0.35} />}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
