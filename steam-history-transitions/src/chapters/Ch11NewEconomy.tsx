import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Dust, hexA} from '../components/Atmosphere';
import {Shield} from '../components/Icons';
import {Extruded} from '../components/Items2';
import {Chip, Shell} from '../components/Shell';
import {Skin, SkinKey, skinUrl} from '../components/Skins';
import {Ev, TitleBlock} from '../components/TitleBlock';
import {C, FONT} from '../lib/theme';
import {drift, E, k, lerp} from '../lib/anim';

/*
 * ГЛАВА 11 · НОВАЯ ЭКОНОМИКА CS2 · 2025–2026
 * Самая насыщенная заставка. Современный интерфейс контракта: пять скинов
 * с красной полосой редкости встают в слоты, контракт подтверждается,
 * скины закручиваются в спираль и сжимаются в точку света, из которой
 * выходит нож. Рядом появляется метка Trade Protection.
 * Набор скинов иллюстративный — в реальном контракте нужны Covert из одной коллекции.
 *
 * 0–30    слоты контракта заполняются 1/5 … 5/5
 * 30–36   «Подтвердить»
 * 36–66   скины поднимаются и спиралью сходятся в центр
 * 62–72   вспышка-ядро и кольцо
 * 66–100  из света разворачивается нож, блик, метки 22.10.2025 и Trade Protection
 * 100–146 нож уходит за титр, титр (разрядка сжимается), удержание
 * 136–165 нож пролетает мимо камеры → чёрный
 */
export const CH11_DURATION = 165;

const FIVE: SkinKey[] = ['akFireSerpent', 'awpLightning', 'akVulcan', 'awpNeon', 'akClawsA'];
const SLOT_W = 300;
const SLOT_H = 150;
const GAP = 22;
const ROW_W = 5 * SLOT_W + 4 * GAP;
const ROW_X = (1920 - ROW_W) / 2;
const ROW_Y = 470;
const CX = 960;
const CY = 520;
const KNIFE: SkinKey = 'karambitTiger';
const KW = 820;

export const Ch11NewEconomy: React.FC = () => {
  const f = useCurrentFrame();
  const d = drift(f, 11.4, 5);
  const panelO = k(f, [0, 8], [0, 1]) * k(f, [36, 50], [1, 0]);
  const filled = Math.min(5, Math.max(0, Math.floor(k(f, [4, 28], [0, 5.99]))));
  const press = k(f, [30, 33, 36], [1, 0.94, 1]);
  const core = k(f, [60, 66, 74], [0, 1, 0]);
  const ring = k(f, [62, 84], [0, 1], E.out);
  const kIn = k(f, [64, 92], [0, 1], E.out);
  const kRy = lerp(170, -12, kIn) + k(f, [92, 146], [0, 18]);
  const kBack = k(f, [98, 114], [0, 1], E.inOut);
  const kFly = k(f, [136, 156], [0, 1], E.inOut);
  const sheen = k(f, [80, 112], [-20, 120], E.inOut);

  const slotPos = (i: number) => ({x: ROW_X + i * (SLOT_W + GAP) + SLOT_W / 2, y: ROW_Y + 60 + SLOT_H / 2});

  return (
    <Shell glow="#E8584A" glowOpacity={0.05 + core * 0.15} glowY={48} base="#0B0C10" fadeOut={6}>
      {/* интерфейс контракта */}
      <div style={{position: 'absolute', left: ROW_X - 40, top: ROW_Y - 40, width: ROW_W + 80, opacity: panelO}}>
        <div style={{display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 24, padding: '0 40px'}}>
          <div style={{fontFamily: FONT.mono, fontSize: 18, letterSpacing: '0.3em', color: C.ivory}}>КОНТРАКТ ОБМЕНА</div>
          <div style={{fontFamily: FONT.mono, fontWeight: 700, fontSize: 26, color: filled === 5 ? C.covert : C.muted}}>{filled} / 5</div>
        </div>
        <div style={{display: 'flex', gap: GAP, padding: '0 40px'}}>
          {FIVE.map((_, i) => (
            <div key={i} style={{width: SLOT_W, height: SLOT_H, border: `1px dashed ${i < filled ? 'transparent' : '#2E3642'}`, borderRadius: 6, background: '#0F1318'}} />
          ))}
        </div>
        <div style={{display: 'flex', justifyContent: 'center', marginTop: 34}}>
          <div
            style={{
              transform: `scale(${press})`,
              padding: '14px 46px',
              borderRadius: 4,
              background: filled === 5 ? C.gold : '#2A2F37',
              color: filled === 5 ? C.bg : C.dim,
              fontFamily: FONT.mono,
              fontWeight: 700,
              fontSize: 18,
              letterSpacing: '0.24em',
            }}
          >
            ПОДТВЕРДИТЬ
          </div>
        </div>
      </div>

      {/* пять скинов: слоты → спираль → центр */}
      {FIVE.map((key, i) => {
        const t0 = 4 + i * 4.8;
        const drop = k(f, [t0, t0 + 8], [0, 1], E.out);
        if (drop <= 0) return null;
        const sp = slotPos(i);
        const sw = k(f, [36 + i * 1.5, 64], [0, 1], E.in);
        const ang0 = Math.atan2(sp.y - CY, sp.x - CX);
        const r0 = Math.hypot(sp.x - CX, sp.y - CY);
        const at = (s: number) => {
          const a = ang0 + s * Math.PI * 2.4;
          const r = r0 * (1 - s);
          return {x: CX + Math.cos(a) * r, y: CY + Math.sin(a) * r * 0.62};
        };
        const p = sw > 0 ? at(sw) : {x: sp.x, y: sp.y - (1 - drop) * 80};
        const scale = lerp(1, 0.18, sw);
        const ghosts = sw > 0.02 && sw < 0.98 ? [1, 2, 3] : [];
        const node = (x: number, y: number, o: number, kk: string, glow: boolean) => (
          <div
            key={kk}
            style={{
              position: 'absolute',
              left: x - (SLOT_W - 30) / 2,
              top: y - 50,
              opacity: o * (1 - k(f, [62, 66], [0, 1])),
              transform: `scale(${scale}) rotate(${sw * 200}deg)`,
              filter: glow ? `drop-shadow(0 0 ${8 + sw * 20}px ${hexA(C.covert, 0.5 + sw * 0.4)})` : undefined,
            }}
          >
            <Skin k={key} w={SLOT_W - 30} h={100} />
            {sw === 0 && <div style={{height: 4, background: C.covert, borderRadius: 2, marginTop: 14, opacity: drop}} />}
          </div>
        );
        return (
          <React.Fragment key={i}>
            {ghosts.map((g) => {
              const q = at(Math.max(0, sw - g * 0.035));
              return node(q.x, q.y, 0.18 / g, `g${i}${g}`, false);
            })}
            {node(p.x, p.y, drop, `m${i}`, true)}
          </React.Fragment>
        );
      })}

      {/* ядро и кольцо */}
      <div
        style={{
          position: 'absolute',
          left: CX - 300,
          top: CY - 300,
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(255,250,235,${core}) 0%, ${hexA(C.goldHi, core * 0.6)} 12%, ${hexA(C.covert, core * 0.25)} 35%, transparent 65%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: CX - 40 - ring * 520,
          top: CY - 40 - ring * 520 * 0.62,
          width: 80 + ring * 1040,
          height: 80 + ring * 1040 * 0.62,
          borderRadius: '50%',
          border: `2px solid ${hexA(C.goldHi, (1 - ring) * 0.8)}`,
          opacity: f > 62 ? 1 : 0,
        }}
      />

      {/* нож */}
      <AbsoluteFill
        style={{
          perspective: 1600,
          filter: `blur(${kBack * 7 + kFly * 16}px) brightness(${1 - kBack * 0.55 + kFly * 0.4})`,
          opacity: kIn > 0 ? 1 : 0,
          zIndex: kFly > 0.15 ? 5 : 0,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: CX - KW / 2 + d.x - kFly * kFly * 700,
            top: CY - KW / 2.156 / 2 - kBack * 80 + d.y + kFly * kFly * 900,
            transformStyle: 'preserve-3d',
            transform: `translateZ(${-kBack * 300 + kFly * 1450}px) rotateY(${kRy}deg) rotateZ(${lerp(-20, 0, kIn) + kFly * 30}deg) scale(${lerp(0.15, 1, kIn)})`,
          }}
        >
          <Extruded layers={6} depth={2.4} dark={0.2}>
            <Skin k={KNIFE} w={KW} imgStyle={{filter: `drop-shadow(0 0 30px ${hexA(C.gold, 0.35)})`}} />
          </Extruded>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              transform: 'translateZ(1px)',
              background: `linear-gradient(110deg, transparent ${sheen - 10}%, rgba(255,250,235,0.6) ${sheen}%, transparent ${sheen + 10}%)`,
              WebkitMaskImage: `url("${skinUrl(KNIFE)}")`,
              WebkitMaskSize: '100% 100%',
              mixBlendMode: 'screen',
            }}
          />
        </div>
      </AbsoluteFill>

      {/* метки */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 790, display: 'flex', justifyContent: 'center', gap: 24, opacity: k(f, [80, 88], [0, 1]) * k(f, [98, 106], [1, 0])}}>
        <Chip color={hexA(C.gold, 0.7)}>
          <span style={{color: C.gold}}>★</span> KARAMBIT | TIGER TOOTH
        </Chip>
        <Chip color={hexA(C.covert, 0.7)}>
          <span style={{color: C.covert}}>22.10.2025</span> 5 COVERT → НОЖ
        </Chip>
        <Chip color={hexA(C.ivory, 0.5)}>
          <Shield size={18} /> TRADE PROTECTION · 7 ДНЕЙ
        </Chip>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 860, textAlign: 'center', fontFamily: FONT.mono, fontSize: 12, letterSpacing: '0.24em', color: C.dim, opacity: k(f, [84, 92], [0, 1]) * k(f, [98, 106], [1, 0])}}>
        ИЛЛЮСТРАЦИЯ МЕХАНИКИ КОНТРАКТА
      </div>

      <Dust seed="d11" count={70} opacity={0.7} speed={1 + kFly * 8} camX={-kFly * 400} />

      <TitleBlock
        f={f}
        num="11"
        lines={['НОВАЯ ЭКОНОМИКА CS2']}
        years="2025 — 2026"
        from={2025}
        to={2026}
        start={104}
        exitStart={136}
        variant="track"
        size={116}
        sub={
          <>
            <Ev d="15.07.2025">TRADE PROTECTION</Ev>
            <Ev d="22.10.2025">5 COVERT → НОЖ ИЛИ ПЕРЧАТКИ</Ev>
          </>
        }
      />
    </Shell>
  );
};
