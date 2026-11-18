import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {DateTag, Key, Page, Photo, k} from './components';
import {C, FONT} from './theme';
import dims from './dims.json';

/* Конструктор планов для сцен 19–78. Каждый план — настоящий материал + спокойная камера. */
export type Plan = {dur: number; el: React.FC};
export type Scene = {n: number; plans: Plan[]};
const D = dims as unknown as Record<string, [number, number]>;
const src = (id: string) => `sources/${id}.jpg`;

// центр колонки текста для разных типов страниц (CSS-пиксели страницы шириной 1600)
const COL: Record<string, number> = {steam: 645, support: 640, blog: 560, article: 640, event: 720, csnet: 800, center: 800};

/** Страница-источник: обзор → медленный наезд к фокусу (fy — по вертикали, CSS px). */
export const pg = (id: string, kind: keyof typeof COL, fy = 560, opts: {dur?: number; tag?: string; z?: number; fx?: number; startY?: number; gray?: boolean} = {}): Plan => {
  const dur = opts.dur ?? 6;
  const [w, h] = D[id];
  const fx = opts.fx ?? COL[kind];
  const keys: Key[] = [
    {t: 0, x: 800, y: opts.startY ?? Math.max(450, fy - 140), z: 1.2},
    {t: dur, x: fx, y: fy, z: opts.z ?? 1.38},
  ];
  return {
    dur,
    el: () => (
      <Gray on={opts.gray}>
        <Page src={src(id)} w={w} h={h} keys={keys} />
        {opts.tag && <DateTag text={opts.tag} />}
      </Gray>
    ),
  };
};

/** Картинка карточкой по центру. */
export const ph = (id: string, width: number, opts: {dur?: number; tag?: string; gray?: boolean} = {}): Plan => ({
  dur: opts.dur ?? 6,
  el: () => (
    <Gray on={opts.gray}>
      <Photo src={src(id)} width={width} />
      {opts.tag && <DateTag text={opts.tag} />}
    </Gray>
  ),
});

/** Локальный архив/графика курса на весь кадр (или с полями), с лёгким наездом к точке. */
export const loc = (file: string, key: string, opts: {dur?: number; tag?: string; to?: [number, number, number]} = {}): Plan => {
  const dur = opts.dur ?? 6;
  const [w, h] = D[key];
  const to = opts.to ?? [w / 2, h / 2, 1.06];
  return {
    dur,
    el: () => (
      <>
        <Page src={`local/${file}`} w={w} h={h} keys={[{t: 0, x: w / 2, y: h / 2, z: 0}, {t: dur, x: to[0], y: to[1], z: to[2]}]} />
        {opts.tag && <DateTag text={opts.tag} />}
      </>
    ),
  };
};

/** Два материала рядом (сравнение / флешбэк). */
export const duo = (a: string, b: string, opts: {dur?: number; tag?: string; gray?: boolean; crop?: number} = {}): Plan => ({
  dur: opts.dur ?? 6,
  el: () => {
    const f = useCurrentFrame();
    const {durationInFrames: d} = useVideoConfig();
    const card = (id: string, i: number) => {
      const [w] = D[id];
      const crop = opts.crop ?? 700;
      return (
        <div key={id} style={{width: 820, height: 620, overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.7)', opacity: k(f, [i * 10, i * 10 + 14], [0, 1])}}>
          <Img src={staticFile(src(id))} style={{width: 820, display: 'block', transform: `translateY(${-Math.min(crop, D[id][1] - 620 * (w / 820)) * (820 / w) * k(f, [0, d], [0.15, 0.3])}px)`}} />
        </div>
      );
    };
    return (
      <Gray on={opts.gray}>
        <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 45%, ${C.bg} 0%, ${C.black} 85%)`, flexDirection: 'row', gap: 60, alignItems: 'center', justifyContent: 'center', transform: `scale(${1 + (f / d) * 0.03})`}}>
          {card(a, 0)}
          {card(b, 1)}
        </AbsoluteFill>
        {opts.tag && <DateTag text={opts.tag} />}
      </Gray>
    );
  },
});

/** Простая схема из шагов — только там, где механику нельзя показать настоящим материалом. */
export const steps = (title: string, items: string[], note: string, dur = 6): Plan => ({
  dur,
  el: () => {
    const f = useCurrentFrame();
    const {fps} = useVideoConfig();
    return (
      <AbsoluteFill style={{background: C.bg, alignItems: 'center', justifyContent: 'center'}}>
        <div style={{width: 1600}}>
          <div style={{fontFamily: FONT.mono, fontSize: 24, letterSpacing: '0.2em', color: C.gold}}>{title}</div>
          <div style={{display: 'flex', alignItems: 'center', gap: 28, marginTop: 50}}>
            {items.map((t, i) => (
              <React.Fragment key={t}>
                <div style={{flex: 1, minHeight: 200, background: '#1B212B', borderRadius: 12, padding: '36px 34px', display: 'flex', alignItems: 'center', opacity: k(f / fps, [0.4 + i * 0.9, 0.9 + i * 0.9], [0, 1]), fontFamily: FONT.display, fontWeight: 700, fontSize: 44, color: C.ivory, lineHeight: 1.15}}>
                  {t}
                </div>
                {i < items.length - 1 && <div style={{fontSize: 56, color: C.ivory, opacity: k(f / fps, [0.9 + i * 0.9, 1.3 + i * 0.9], [0, 1])}}>→</div>}
              </React.Fragment>
            ))}
          </div>
          <div style={{fontFamily: FONT.text, fontSize: 24, color: C.muted, marginTop: 50}}>{note}</div>
        </div>
      </AbsoluteFill>
    );
  },
});

const Gray: React.FC<{on?: boolean; children: React.ReactNode}> = ({on, children}) => <AbsoluteFill style={{filter: on ? 'grayscale(0.85) brightness(0.85)' : undefined}}>{children}</AbsoluteFill>;

/** Дословная цитата из официального текста (когда оформленная страница недоступна): текст + источник. */
export const quote = (head: string, text: string, source: string, dur = 6.5): Plan => ({
  dur,
  el: () => {
    const f = useCurrentFrame();
    const {fps, durationInFrames: d} = useVideoConfig();
    return (
      <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 45%, ${C.bg} 0%, ${C.black} 85%)`, alignItems: 'center', justifyContent: 'center'}}>
        <div style={{width: 1480, transform: `scale(${1 + (f / d) * 0.04})`, opacity: k(f / fps, [0.2, 0.8], [0, 1])}}>
          <div style={{fontFamily: FONT.mono, fontSize: 30, color: C.gold, letterSpacing: '0.08em'}}>{head}</div>
          <div style={{fontFamily: FONT.text, fontSize: 52, lineHeight: 1.35, color: C.ivory, marginTop: 30}}>{text}</div>
          <div style={{fontFamily: FONT.mono, fontSize: 24, color: C.muted, marginTop: 40}}>{source}</div>
        </div>
      </AbsoluteFill>
    );
  },
});
