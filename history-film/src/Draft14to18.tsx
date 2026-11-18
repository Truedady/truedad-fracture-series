import React from 'react';
import {AbsoluteFill, Sequence, useVideoConfig} from 'remotion';
import {DateTag, Fade, Page, Photo, VoicePending} from './components';
import {C} from './theme';

/*
 * ЧЕРНОВИК КАДРОВ 14–18 (VOICE_PENDING). Тайминги условные — до записи озвучки.
 * Каждый план 5–7 с, кроссфейды, спокойная камера. Выделений текста — только 1 на весь черновик.
 * Источники: SOURCES.json (A11, A25–A27, A30, A02, A36) + локальные архивы курса.
 */
export type Shot = {scene: number; from: number; dur: number; note: string; el: React.FC};

export const SHOTS: Shot[] = [
  {
    scene: 14,
    from: 0,
    dur: 5.5,
    note: 'Arms Deal Collection 2013 (официальный арт Valve, A11) — AK-47 Case Hardened в коллекции',
    el: () => (
      <>
        <Photo src="sources/A11_armsdeal_collection_2013.jpg" width={1120} push={0.06} />
        <DateTag text="2013 · ARMS DEAL COLLECTION" />
      </>
    ),
  },
  {
    scene: 14,
    from: 5.0,
    dur: 6.5,
    note: 'Skinory: AK-47 Case Hardened seed 661 — паттерн 76.1% blue (A27)',
    el: () => <Page src="sources/A27_skinory_ak661.jpg" h={1000} keys={[{t: 0, x: 800, y: 520, z: 1.0}, {t: 6.5, x: 560, y: 470, z: 1.3}]} />,
  },
  {
    scene: 14,
    from: 11.0,
    dur: 6.5,
    note: 'Dexerto 2024: самый дорогой скин CS2 — AK #661 (A26)',
    el: () => (
      <>
        <Page src="sources/A26_dexerto_2024.jpg" h={860} keys={[{t: 0, x: 760, y: 420, z: 1.1}, {t: 2.5, x: 740, y: 330, z: 1.2}, {t: 6.5, x: 460, y: 560, z: 1.35}]} />
        <DateTag text="2024" at={1.0} />
      </>
    ),
  },
  {
    scene: 14,
    from: 17.0,
    dur: 5.5,
    note: 'PC Gamer: история M4A4 Howl (A25), скин 2014 года',
    el: () => (
      <>
        <Page src="sources/A25_pcgamer_howl_2014.jpg" h={1200} keys={[{t: 0, x: 800, y: 560, z: 1.0}, {t: 5.5, x: 760, y: 720, z: 1.25}]} />
        <DateTag text="M4A4 HOWL · 2014" />
      </>
    ),
  },
  {
    scene: 15,
    from: 22.0,
    dur: 7.0,
    note: 'Архив курса: Steam Holiday Sale 2013, CS:GO −75% (локальный PNG 04)',
    el: () => (
      <Page
        src="local/Архив_курса/04_Steam_Winter_Sale_75pct_архив_курса.png"
        w={1566}
        h={1440}
        keys={[
          {t: 0, x: 783, y: 560, z: 0.82},
          {t: 3.0, x: 783, y: 900, z: 0.9},
          {t: 7.0, x: 783, y: 1008, z: 1.25},
        ]}
      />
    ),
  },
  {
    scene: 15,
    from: 28.5,
    dur: 6.5,
    note: 'Valve, 21.12.2013: Holiday Sale Day 3 — Counter-Strike: Global Offensive 75% off (A30). Единственное выделение.',
    el: () => (
      <Page
        src="sources/A30_steam_holiday_day3_2013.jpg"
        h={1200}
        keys={[{t: 0, x: 800, y: 480, z: 1.0}, {t: 2.5, x: 600, y: 480, z: 1.3}, {t: 6.5, x: 560, y: 500, z: 1.35}]}
        mark={{t: 2.8, x: 218, y: 546, w: 285, h: 17}}
      />
    ),
  },
  {
    scene: 16,
    from: 34.5,
    dur: 6.5,
    note: 'Valve: Steam Trading Feature Is Live — обмен предметами и подарками (A02)',
    el: () => <Page src="sources/A02_steam_trading_2011.jpg" h={1200} keys={[{t: 0, x: 800, y: 500, z: 1.0}, {t: 6.5, x: 640, y: 420, z: 1.3}]} />,
  },
  {
    scene: 17,
    from: 40.5,
    dur: 6.5,
    note: 'PC Gamer, 2014: Valve ограничивает подарки между регионами (A36)',
    el: () => (
      <>
        <Page src="sources/A36_pcgamer_regions_2014.jpg" h={1200} keys={[{t: 0, x: 800, y: 560, z: 1.0}, {t: 6.5, x: 640, y: 560, z: 1.3}]} />
        <DateTag text="PC GAMER · 2014" />
      </>
    ),
  },
  {
    scene: 18,
    from: 46.5,
    dur: 6.5,
    note: 'Готовая графика курса: условный пример 500 → 1 500 ₽ (локальный PNG 06)',
    el: () => (
      <Page src="local/Готовая_графика/06_Региональная_цена_пример.png" w={1920} h={1080} keys={[{t: 0, x: 960, y: 540, z: 0.94}, {t: 6.5, x: 960, y: 540, z: 0.99}]} />
    ),
  },
];

export const DRAFT_SECONDS = Math.max(...SHOTS.map((s) => s.from + s.dur));

export const Draft14to18: React.FC<{voicePending?: boolean}> = ({voicePending = false}) => {
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill style={{background: C.black}}>
      {SHOTS.map((s, i) => {
        const El = s.el;
        return (
          <Sequence key={i} from={Math.round(s.from * fps)} durationInFrames={Math.round(s.dur * fps)}>
            <Fade>
              <El />
            </Fade>
          </Sequence>
        );
      })}
      {voicePending && <VoicePending />}
    </AbsoluteFill>
  );
};
