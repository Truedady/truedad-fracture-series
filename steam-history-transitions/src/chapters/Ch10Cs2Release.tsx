import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Dust, hexA} from '../components/Atmosphere';
import {Chip, Shell} from '../components/Shell';
import {Skin, skinUrl} from '../components/Skins';
import {Ev, TitleBlock} from '../components/TitleBlock';
import {C, FONT} from '../lib/theme';
import {drift, E, k, lerp} from '../lib/anim';

/*
 * ГЛАВА 10 · ВЫХОД COUNTER-STRIKE 2 · 2023–2024
 * Один и тот же скин (AK-47 | Fire Serpent) сначала в плоском, тусклом
 * свете «эпохи CS:GO». Вертикальная линия сканирования проходит по кадру
 * и «пересвечивает» его: контраст, блики, тёплый и холодный контровой свет.
 * Это стилизация смены освещения, а не настоящие внутриигровые рендеры.
 *
 * 0–16    скин в старом свете, подпись CS:GO
 * 16–60   линия сканирования, за ней — новый свет, подпись CS2, даты анонса и релиза
 * 64–78   сцена гаснет, титр проявляется той же линией
 * 114+    полёт вперёд, затемнение
 */
export const CH10_DURATION = 135;

const SW = 1320;

export const Ch10Cs2Release: React.FC = () => {
  const f = useCurrentFrame();
  const d = drift(f, 10.1, 5);
  const scan = k(f, [16, 60], [-4, 104], E.inOut);
  const ry = k(f, [0, 135], [-10, 8]);
  const dim = k(f, [62, 76], [1, 0.36]);
  const blur = k(f, [62, 78], [0, 7], E.inOut);
  const ex = k(f, [114, 134], [0, 1], E.in);
  const sheen = k(f, [40, 80], [-20, 120]);
  const clipNew = `inset(0 ${100 - Math.max(0, scan)}% 0 0)`;

  const skin = (style: React.CSSProperties) => (
    <div style={{position: 'absolute', left: 960 - SW / 2 + d.x, top: 470 - SW / 3.414 / 2 + d.y, transform: `perspective(1800px) rotateY(${ry}deg) scale(${1 + ex * 0.4})`, ...style}}>
      <Skin k="akFireSerpent" w={SW} />
    </div>
  );

  return (
    <Shell glowOpacity={0.05} glowY={44} base="#0C0E11">
      <AbsoluteFill style={{filter: `blur(${blur + ex * 10}px) brightness(${dim})`, opacity: 1 - ex * 0.7}}>
        {/* фон «старого» света */}
        <AbsoluteFill style={{background: 'radial-gradient(ellipse 60% 50% at 50% 45%, #2A2C2F 0%, #0C0D0F 75%)'}} />
        {/* фон «нового» света */}
        <AbsoluteFill
          style={{
            clipPath: clipNew,
            background: 'radial-gradient(ellipse 45% 55% at 30% 40%, rgba(232,138,60,0.28), transparent 70%), radial-gradient(ellipse 45% 55% at 75% 55%, rgba(60,170,200,0.22), transparent 70%), radial-gradient(ellipse 70% 60% at 50% 45%, #161B22 0%, #07090C 80%)',
          }}
        />
        {/* старый свет */}
        {skin({filter: 'saturate(0.45) brightness(0.62) contrast(0.82) sepia(0.18)'})}
        {/* новый свет */}
        <div style={{position: 'absolute', inset: 0, clipPath: clipNew}}>
          {skin({filter: `saturate(1.25) contrast(1.18) brightness(1.06) drop-shadow(-14px -6px 22px ${hexA('#E88A3C', 0.45)}) drop-shadow(14px 10px 26px ${hexA('#3CAAC8', 0.35)})`})}
          <div
            style={{
              position: 'absolute',
              left: 960 - SW / 2 + d.x,
              top: 470 - SW / 3.414 / 2 + d.y,
              width: SW,
              height: SW / 3.414,
              transform: `perspective(1800px) rotateY(${ry}deg) scale(${1 + ex * 0.4})`,
              background: `linear-gradient(100deg, transparent ${sheen - 10}%, rgba(255,250,235,0.5) ${sheen}%, transparent ${sheen + 10}%)`,
              WebkitMaskImage: `url("${skinUrl('akFireSerpent')}")`,
              WebkitMaskSize: '100% 100%',
              mixBlendMode: 'screen',
            }}
          />
        </div>
        {/* линия сканирования */}
        <div
          style={{
            position: 'absolute',
            left: `${scan}%`,
            top: 0,
            bottom: 0,
            width: 2,
            background: C.ivory,
            boxShadow: `0 0 30px ${hexA(C.ivory, 0.8)}, 0 0 80px ${hexA('#9FD6FF', 0.5)}`,
            opacity: k(f, [16, 20, 56, 62], [0, 1, 1, 0]),
          }}
        />
        {/* подписи эпох */}
        <div style={{position: 'absolute', left: 200, top: 200, fontFamily: FONT.mono, fontWeight: 700, fontSize: 34, letterSpacing: '0.2em', color: C.muted, opacity: k(f, [4, 12], [0, 1]) * (scan > 12 ? 0.35 : 1)}}>
          CS:GO
        </div>
        <div style={{position: 'absolute', right: 200, top: 200, fontFamily: FONT.mono, fontWeight: 700, fontSize: 34, letterSpacing: '0.2em', color: C.ivory, opacity: k(scan, [80, 92], [0, 1])}}>
          CS2
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 770, display: 'flex', justifyContent: 'center', gap: 24}}>
          <div style={{opacity: k(f, [26, 32], [0, 1])}}>
            <Chip color={hexA(C.gold, 0.6)}>
              <span style={{color: C.gold}}>22.03.2023</span> АНОНС
            </Chip>
          </div>
          <div style={{opacity: k(f, [42, 48], [0, 1])}}>
            <Chip color={hexA(C.gold, 0.6)}>
              <span style={{color: C.gold}}>27.09.2023</span> РЕЛИЗ
            </Chip>
          </div>
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 840, textAlign: 'center', fontFamily: FONT.mono, fontSize: 12, letterSpacing: '0.24em', color: C.dim, opacity: k(f, [30, 40], [0, 1])}}>
          AK-47 | FIRE SERPENT · СТИЛИЗАЦИЯ СМЕНЫ ОСВЕЩЕНИЯ
        </div>
      </AbsoluteFill>

      <Dust seed="d10" count={50} opacity={0.5} camX={lerp(0, -300, ex)} speed={1 + ex * 6} color="#DDE6F5" />

      <TitleBlock
        f={f}
        num="10"
        lines={['ВЫХОД', 'COUNTER-STRIKE 2']}
        years="2023 — 2024"
        from={2023}
        to={2024}
        start={70}
        exitStart={114}
        variant="scan"
        size={136}
        sub={
          <>
            <Ev d="27.09.2023">РЕЛИЗ CS2</Ev>
            <Ev d="02.10.2024">7 ДНЕЙ ДО ПОВТОРНОЙ ПЕРЕДАЧИ</Ev>
          </>
        }
      />
    </Shell>
  );
};
