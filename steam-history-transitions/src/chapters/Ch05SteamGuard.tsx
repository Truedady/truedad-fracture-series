import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Dust, hexA} from '../components/Atmosphere';
import {Hourglass} from '../components/Items2';
import {Shell} from '../components/Shell';
import {rarityColor, Skin, WEAPONS} from '../components/Skins';
import {Ev, TitleBlock} from '../components/TitleBlock';
import {C, FONT} from '../lib/theme';
import {E, k, rnd} from '../lib/anim';

/*
 * ГЛАВА 05 · STEAM GUARD И ПЯТНАДЦАТИДНЕВНЫЕ ЗАДЕРЖКИ · 2016
 * Строгая, холодная сцена почти без движения камеры. Над инвентарём
 * прорисовывается щит Steam Guard, код аутентификатора перебирается и
 * застывает, затем по одному загораются 15 дней задержки, а на предметах
 * появляются песочные часы — обмен поставлен на паузу.
 *
 * 0–30    инвентарь 2016, щит рисуется линией, код перебирается
 * 30–70   «без мобильного аутентификатора — до 15 дней», 15 ячеек, часы на предметах
 * 70–84   сцена уходит в тень, титр раскрывается двумя половинками
 * 122+    титр схлопывается в линию → чёрный
 */
export const CH05_DURATION = 140;

const COLS = 6;
const ROWS = 3;
const CW = 210;
const CH = 118;
const GAP = 12;
const GRID_W = COLS * CW + (COLS - 1) * GAP;
const GRID_H = ROWS * CH + (ROWS - 1) * GAP;
const CODE = 'R7K2Q';
const CHARS = 'ABCDEFGHJKMNPQRTVWXY2346789';

export const Ch05SteamGuard: React.FC = () => {
  const f = useCurrentFrame();
  const push = k(f, [0, 140], [1, 1.06]);
  const shield = k(f, [6, 28], [0, 1], E.inOut);
  const dim = k(f, [70, 86], [1, 0.32]);
  const blur = k(f, [70, 86], [0, 7], E.inOut);
  const ex = k(f, [122, 132], [0, 1]);

  return (
    <Shell glow="#6E8BB3" glowOpacity={0.08} glowY={42} base="#0A0E14" fadeOut={5}>
      <AbsoluteFill style={{transform: `scale(${push})`, filter: `blur(${blur}px) brightness(${dim})`, opacity: 1 - ex}}>
        {/* инвентарь */}
        <div
          style={{
            position: 'absolute',
            left: (1920 - GRID_W) / 2 - 30,
            top: 330,
            width: GRID_W + 60,
            padding: 30,
            background: 'linear-gradient(180deg, #16202D, #111821)',
            border: '1px solid #233041',
            borderRadius: 6,
            opacity: k(f, [0, 10], [0, 1]),
          }}
        >
          <div style={{display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20, fontFamily: FONT.mono, fontSize: 15, letterSpacing: '0.18em', color: '#8FA3BC'}}>
            <span style={{color: C.ivory}}>ИНВЕНТАРЬ</span>
            <span>·</span>
            <span>COUNTER-STRIKE: GLOBAL OFFENSIVE</span>
          </div>
          <div style={{position: 'relative', width: GRID_W, height: GRID_H}}>
            {Array.from({length: COLS * ROWS}, (_, i) => {
              const c = i % COLS;
              const r = Math.floor(i / COLS);
              const key = WEAPONS[Math.floor(rnd(`g5${i}`) * WEAPONS.length)];
              const hold = k(f, [36 + ((c * 3 + r * 5) % 17) * 1.6, 42 + ((c * 3 + r * 5) % 17) * 1.6], [0, 1]);
              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: c * (CW + GAP),
                    top: r * (CH + GAP),
                    width: CW,
                    height: CH,
                    background: '#0E141C',
                    border: '1px solid #1F2B3A',
                    borderRadius: 3,
                    overflow: 'hidden',
                  }}
                >
                  <div style={{filter: `grayscale(${hold * 0.85}) brightness(${1 - hold * 0.45})`}}>
                    <Skin k={key} w={CW - 20} h={CH - 20} style={{margin: 10}} />
                  </div>
                  <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 3, background: rarityColor(key), opacity: 0.8}} />
                  <div style={{position: 'absolute', right: 8, top: 8, opacity: hold, transform: `scale(${1.4 - hold * 0.4})`}}>
                    <Hourglass size={26} color={C.ivory} t={k(f, [40, 140], [0, 1])} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* щит Steam Guard */}
        <div style={{position: 'absolute', left: 960 - 110, top: 70, width: 220, height: 240}}>
          <svg width={220} height={240} viewBox="0 0 220 240">
            <path
              d="M110 10 L196 42 V112 Q196 186 110 228 Q24 186 24 112 V42Z"
              fill={hexA('#0E141C', 0.85 * shield)}
              stroke={C.ivory}
              strokeWidth={4}
              strokeLinejoin="round"
              strokeDasharray={700}
              strokeDashoffset={700 * (1 - shield)}
            />
            <path d="M72 120 L100 148 L150 92" fill="none" stroke={C.gold} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={120} strokeDashoffset={120 * (1 - k(f, [26, 34], [0, 1], E.out))} />
          </svg>
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 70, textAlign: 'center', transform: 'translateX(330px)', opacity: k(f, [12, 20], [0, 1])}}>
          <div style={{fontFamily: FONT.mono, fontSize: 13, letterSpacing: '0.3em', color: C.muted}}>КОД STEAM GUARD</div>
          <div style={{fontFamily: FONT.mono, fontWeight: 700, fontSize: 48, letterSpacing: '0.24em', color: C.ivory, marginTop: 8}}>
            {CODE.split('')
              .map((ch, i) => (f < 18 + i * 3 ? CHARS[Math.floor(rnd(`c${i}${Math.floor(f / 2)}`) * CHARS.length)] : ch))
              .join('')}
          </div>
          <div style={{width: 280, height: 3, margin: '10px auto 0', background: '#1F2B3A'}}>
            <div style={{width: `${(1 - ((f % 30) / 30)) * 100}%`, height: '100%', background: C.gold}} />
          </div>
        </div>

        {/* задержка до 15 дней */}
        <div style={{position: 'absolute', left: 0, right: 0, top: 820, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, opacity: k(f, [32, 40], [0, 1])}}>
          <div style={{fontFamily: FONT.mono, fontSize: 16, letterSpacing: '0.2em', color: C.muted}}>
            БЕЗ МОБИЛЬНОГО АУТЕНТИФИКАТОРА · ЗАДЕРЖКА ОБМЕНА <span style={{color: C.red}}>ДО 15 ДНЕЙ</span>
          </div>
          <div style={{display: 'flex', gap: 6}}>
            {Array.from({length: 15}, (_, i) => {
              const fill = k(f, [38 + i * 2, 41 + i * 2], [0, 1]);
              return (
                <div key={i} style={{width: 52, height: 12, background: '#1A1D24', borderRadius: 2, overflow: 'hidden'}}>
                  <div style={{width: `${fill * 100}%`, height: '100%', background: i === 14 ? C.red : hexA(C.red, 0.7)}} />
                </div>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>

      <Dust seed="d05" count={30} color="#C9D6EA" opacity={0.4} speed={0.5} />

      <TitleBlock
        f={f}
        num="05"
        lines={['STEAM GUARD', 'И ПЯТНАДЦАТИДНЕВНЫЕ', 'ЗАДЕРЖКИ']}
        years="2016"
        from={2016}
        to={2016}
        start={76}
        exitStart={122}
        variant="split"
        exit="collapse"
        size={108}
        sub={
          <>
            <Ev d="09.03.2016">НОВЫЕ ПРАВИЛА STEAM GUARD</Ev>
            <Ev>ЗАДЕРЖКА ОБМЕНА ДО 15 ДНЕЙ</Ev>
          </>
        }
      />
    </Shell>
  );
};
