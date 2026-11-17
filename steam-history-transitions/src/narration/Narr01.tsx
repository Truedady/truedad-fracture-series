import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Backdrop, Dust, Finish, hexA} from '../components/Atmosphere';
import {Chip} from '../components/Shell';
import {ArticleShot} from '../components/Article';
import {C, FONT} from '../lib/theme';
import {E, k, lerp, rnd} from '../lib/anim';

/*
 * ОЗВУЧКА · ГЛАВА 01 «ПЕРВЫЕ ОБМЕНЫ» — минимальный монтаж под голос (84 с).
 * Тайминги — по паузам в записи и длине фраз (±1 с), см. SHOTS ниже.
 * Кадры из монтажной карты: 04–10.
 */
export const NARR01_DURATION = Math.ceil(83.9 * 30);
const s = (sec: number) => Math.round(sec * 30);

const tf2 = (n: string) => staticFile(`tf2/${n}.png`);

/** Плавное появление/уход плана + медленный наезд. */
const Shot: React.FC<{dur: number; children: (f: number, p: number) => React.ReactNode; push?: number}> = ({dur, children, push = 0.05}) => {
  const f = useCurrentFrame();
  const o = k(f, [0, 12], [0, 1]) * k(f, [dur - 12, dur], [1, 0]);
  const p = f / dur;
  return <AbsoluteFill style={{opacity: o, transform: `scale(${1 + p * push})`}}>{children(f, p)}</AbsoluteFill>;
};

const Label: React.FC<{f: number; at?: number; children: React.ReactNode}> = ({f, at = 10, children}) => (
  <div style={{position: 'absolute', left: 200, top: 130, opacity: k(f, [at, at + 10], [0, 1])}}>
    <Chip color={hexA(C.gold, 0.6)}>{children}</Chip>
  </div>
);

/** Заглушка под скрин новостной страницы (пока сайт недоступен из среды). */
// (заглушка больше не используется)
const _NewsPlaceholder: React.FC<{f: number; title: string; date: string; url: string; marks: string[]}> = ({f, title, date, url, marks}) => (
  <div style={{position: 'absolute', left: 360, top: 170, width: 1200, height: 740, background: '#171A21', border: `1px solid ${C.line}`, borderRadius: 10, overflow: 'hidden', boxShadow: '0 40px 120px rgba(0,0,0,0.6)'}}>
    <div style={{height: 46, background: '#0F1217', display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px'}}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{width: 11, height: 11, borderRadius: 6, background: '#2E3642'}} />
      ))}
      <div style={{marginLeft: 14, fontFamily: FONT.mono, fontSize: 14, color: C.dim}}>{url}</div>
    </div>
    <div style={{padding: '60px 70px'}}>
      <div style={{fontFamily: FONT.mono, fontSize: 18, color: C.gold, letterSpacing: '0.1em'}}>{date}</div>
      <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 64, color: C.ivory, marginTop: 14}}>{title}</div>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div key={i} style={{height: 14, width: `${60 + rnd(`np${title}${i}`) * 35}%`, background: '#252B35', borderRadius: 4, marginTop: 26}} />
      ))}
      <div style={{display: 'flex', gap: 14, marginTop: 40}}>
        {marks.map((m, i) => (
          <div key={m} style={{opacity: k(f, [40 + i * 30, 50 + i * 30], [0, 1]), padding: '6px 14px', background: hexA(C.gold, 0.85), color: C.bg, fontFamily: FONT.text, fontWeight: 600, fontSize: 22}}>
            {m}
          </div>
        ))}
      </div>
    </div>
    <div style={{position: 'absolute', right: 20, bottom: 16, fontFamily: FONT.mono, fontSize: 13, color: C.red, letterSpacing: '0.12em'}}>ЗАГЛУШКА · СЮДА СКРИН ОРИГИНАЛЬНОЙ НОВОСТИ</div>
  </div>
);

const Item: React.FC<{n: string; size: number; style?: React.CSSProperties}> = ({n, size, style}) => <Img src={tf2(n)} style={{width: size, height: size, display: 'block', ...style}} />;

const TRADE = {src: 'news/steam-trading-2011.jpg', w: 2000, h: 1258, source: 'store.steampowered.com · Valve · 07.09.2011'};
const TF2NEWS = {src: 'news/tf2-update-2010-hd.jpg', w: 1600, h: 1450, source: 'store.steampowered.com · Valve · 30.09.2010'};
const MANNCO = {src: 'news/tf2-mannconomy-2010.jpg', w: 1600, h: 4255, source: 'teamfortress.com · Mann-Conomy Update · 30.09.2010'};
const MARKET = {src: 'news/community-market-2012.jpg', w: 2000, h: 1307, source: 'store.steampowered.com · Valve · 12.12.2012'};

// ── Планы ──────────────────────────────────────────────────────────────
const SHOTS: {from: number; to: number; el: React.FC<{dur: number}>}[] = [
  // 0.0–8.4 «Если открыть Steam в 2010… торговой площадки пока нет»
  {
    from: 0,
    to: 8.6,
    el: ({dur}) => (
      <Shot dur={dur}>
        {(f) => (
          <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
            <div style={{fontFamily: FONT.mono, fontWeight: 700, fontSize: 220, color: C.gold, letterSpacing: '0.1em', opacity: k(f, [0, 20], [0, 1])}}>2010</div>
            <div style={{display: 'flex', flexDirection: 'column', gap: 18, marginTop: 30}}>
              {[
                {t: 'CS:GO', at: s(3.8)},
                {t: 'НОЖИ ЗА ТЫСЯЧИ ДОЛЛАРОВ', at: s(5.4)},
                {t: 'ТОРГОВАЯ ПЛОЩАДКА STEAM', at: s(6.9)},
              ].map((r) => (
                <div key={r.t} style={{display: 'flex', alignItems: 'center', gap: 20, opacity: k(f, [r.at, r.at + 8], [0, 1])}}>
                  <div style={{position: 'relative', fontFamily: FONT.display, fontWeight: 600, fontSize: 44, color: C.muted}}>
                    {r.t}
                    <div style={{position: 'absolute', left: -6, right: -6, top: '52%', height: 3, background: C.red, transformOrigin: 'left', transform: `scaleX(${k(f, [r.at + 6, r.at + 16], [0, 1], E.out)})`}} />
                  </div>
                  <div style={{fontFamily: FONT.mono, fontSize: 22, color: C.red, opacity: k(f, [r.at + 14, r.at + 20], [0, 1])}}>ЕЩЁ НЕТ</div>
                </div>
              ))}
            </div>
          </AbsoluteFill>
        )}
      </Shot>
    ),
  },
  // 8.4–11.9 «Зато уже есть Team Fortress 2…» — новость Steam об обновлении TF2 (30.09.2010), мягкий наезд
  {
    from: 8.4,
    to: 11.9,
    el: ({dur}) => (
      <Shot dur={dur} push={0}>
        {() => (
          <ArticleShot
            {...TF2NEWS}
            cams={[
              {t: 0, x: 540, y: 460, z: 1.25},
              {t: 3.5, x: 520, y: 440, z: 1.45},
            ]}
            marks={[
              {t: 1.0, x: 218, y: 414, w: 470, h: 48, spot: true},
              {t: 2.2, x: 236, y: 497, w: 98, h: 18, spot: true},
            ]}
          />
        )}
      </Shot>
    ),
  },
  // 11.7–14.1 скриншоты из игры TF2 (официальные, из магазина Steam)
  {
    from: 11.7,
    to: 14.2,
    el: ({dur}) => (
      <Shot dur={dur} push={0.04}>
        {(f) => (
          <>
            {[
              {img: 'tf2-ingame-07', x: 150, y: 250, r: -4},
              {img: 'tf2-ingame-09', x: 660, y: 330, r: 2},
              {img: 'tf2-ingame-10', x: 1170, y: 230, r: -2},
            ].map((c, i) => {
              const a = k(f, [i * 6, i * 6 + 14], [0, 1], E.out);
              return (
                <div key={c.img} style={{position: 'absolute', left: c.x, top: c.y + (1 - a) * 80, width: 600, opacity: a, transform: `rotate(${c.r}deg)`, boxShadow: '0 30px 80px rgba(0,0,0,0.7)', border: `3px solid ${C.ivory}`}}>
                  <Img src={staticFile(`news/${c.img}.jpg`)} style={{width: 600, display: 'block'}} />
                </div>
              );
            })}
            <div style={{position: 'absolute', left: 0, right: 0, bottom: 120, textAlign: 'center', fontFamily: FONT.mono, fontSize: 18, letterSpacing: '0.2em', color: C.muted}}>
              TEAM FORTRESS 2 · СКРИНШОТЫ ИЗ ИГРЫ · STORE.STEAMPOWERED.COM
            </div>
          </>
        )}
      </Shot>
    ),
  },
  // 13.9–16.8 каталог Mann Co. из обновления Mann-Conomy: шапки, раскрашиваемые предметы
  {
    from: 13.9,
    to: 16.8,
    el: ({dur}) => (
      <Shot dur={dur} push={0}>
        {() => (
          <ArticleShot
            {...MANNCO}
            cams={[
              {t: 0, x: 800, y: 3080, z: 1.0},
              {t: 2.9, x: 800, y: 3240, z: 1.15},
            ]}
          />
        )}
      </Shot>
    ),
  },
  // 16.6–22.1 «В сентябре 2011 года Steam Trading выходит из беты» — заголовок по центру, без сильного наезда
  {
    from: 16.6,
    to: 22.1,
    el: ({dur}) => (
      <Shot dur={dur} push={0}>
        {() => (
          <ArticleShot
            {...TRADE}
            cams={[
              {t: 0, x: 640, y: 480, z: 1.0},
              {t: 5.5, x: 640, y: 460, z: 1.12},
            ]}
            marks={[{t: 0.9, x: 183, y: 128, w: 907, h: 56, spot: true}]}
          />
        )}
      </Shot>
    ),
  },
  // 21.9–35.8 «разница в оценке… шапка за несколько предметов»
  {
    from: 21.9,
    to: 36.0,
    el: ({dur}) => (
      <Shot dur={dur} push={0.04}>
        {(f) => {
          const give = ['ticket', 'fox', 'bag', 'boot'];
          const bars = k(f, [s(9.5), s(12)], [0, 1], E.inOut);
          return (
            <>
              <div style={{position: 'absolute', left: 260, top: 180, width: 1400, display: 'flex', justifyContent: 'space-between'}}>
                {[
                  {t: 'ИГРОК ОТДАЁТ', items: give},
                  {t: 'ИГРОК ПОЛУЧАЕТ', items: ['witch-hat']},
                ].map((col, ci) => (
                  <div key={ci} style={{width: 620, padding: 30, background: hexA('#151A22', 0.9), border: `1px solid ${C.line}`, borderRadius: 8, opacity: k(f, [ci * 10, ci * 10 + 14], [0, 1])}}>
                    <div style={{fontFamily: FONT.mono, fontSize: 18, letterSpacing: '0.3em', color: C.muted}}>{col.t}</div>
                    <div style={{display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 24, minHeight: 300, alignItems: 'center', justifyContent: 'center'}}>
                      {col.items.map((n, i) => (
                        <div key={n} style={{background: '#10141A', borderRadius: 6, padding: 10, opacity: k(f, [s(4.4) + i * 8, s(4.4) + i * 8 + 10], [0, 1])}}>
                          <Item n={n} size={col.items.length > 1 ? 120 : 260} />
                        </div>
                      ))}
                    </div>
                    {/* «ценность» — условные полосы без цифр */}
                    <div style={{marginTop: 20, height: 12, background: '#1F252E', borderRadius: 6, overflow: 'hidden'}}>
                      <div style={{width: `${bars * (ci === 0 ? 92 : 48)}%`, height: '100%', background: ci === 0 ? C.gold : C.muted}} />
                    </div>
                    <div style={{fontFamily: FONT.mono, fontSize: 14, color: C.dim, marginTop: 10, opacity: bars}}>ОЦЕНКА РЫНКА</div>
                  </div>
                ))}
              </div>
              <div style={{position: 'absolute', left: 0, right: 0, top: 400, textAlign: 'center', fontSize: 64, color: C.gold, opacity: k(f, [s(5), s(6)], [0, 1])}}>⇄</div>
              <div style={{position: 'absolute', left: 0, right: 0, bottom: 150, textAlign: 'center', fontFamily: FONT.display, fontWeight: 700, fontSize: 52, color: C.ivory, opacity: k(f, [s(10.5), s(11.5)], [0, 1])}}>
                Заработок на разнице в оценке
              </div>
            </>
          );
        }}
      </Shot>
    ),
  },
  // 35.8–44.9 «…не было агрегаторов цен; форумы, обмены, опыт» — инвентари публичных профилей
  {
    from: 35.8,
    to: 45.1,
    el: ({dur}) => (
      <Shot dur={dur} push={0}>
        {(f) => (
          <>
            <ArticleShot
              {...TRADE}
              cams={[
                {t: 0, x: 640, y: 800, z: 1.05},
                {t: 9.3, x: 640, y: 860, z: 1.15},
              ]}
              marks={[
                {t: 0.8, x: 183, y: 780, w: 907, h: 100, spot: true},
                {t: 3.2, x: 183, y: 908, w: 820, h: 50, spot: true},
              ]}
            />
            <div style={{position: 'absolute', left: 0, right: 0, top: 120, display: 'flex', justifyContent: 'center', opacity: k(f, [s(3.4), s(4.2)], [0, 1])}}>
              <div style={{padding: '14px 26px', background: 'rgba(5,6,8,0.82)', borderLeft: `3px solid ${C.gold}`, fontFamily: FONT.display, fontWeight: 600, fontSize: 38, color: C.ivory}}>
                Агрегаторов цен не было — только форумы, обмены и опыт
              </div>
            </div>
          </>
        )}
      </Shot>
    ),
  },
  // 44.9–53.6 «валюта — ключи и металл Refined»
  {
    from: 44.9,
    to: 53.8,
    el: ({dur}) => (
      <Shot dur={dur} push={0.07}>
        {(f) => (
          <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
            <div style={{display: 'flex', gap: 160, alignItems: 'center'}}>
              {[
                {n: 'key', t: 'КЛЮЧИ'},
                {n: 'refined-metal', t: 'REFINED METAL'},
              ].map((c, i) => (
                <div key={c.n} style={{textAlign: 'center', opacity: k(f, [i * 25, i * 25 + 14], [0, 1]), transform: `translateY(${Math.sin(f * 0.05 + i) * 10}px)`}}>
                  <Item n={c.n} size={380} style={{filter: `drop-shadow(0 0 40px ${hexA(C.gold, 0.25)})`}} />
                  <div style={{fontFamily: FONT.mono, fontSize: 28, letterSpacing: '0.3em', color: C.gold, marginTop: 20}}>{c.t}</div>
                </div>
              ))}
            </div>
            <div style={{fontFamily: FONT.display, fontWeight: 600, fontSize: 40, color: C.muted, marginTop: 40, opacity: k(f, [40, 55], [0, 1])}}>Валюта TF2</div>
          </AbsoluteFill>
        )}
      </Shot>
    ),
  },
  // 53.6–65.3 «тысячи процентов… сегодня парсеры и боты, раньше вручную»
  {
    from: 53.6,
    to: 65.5,
    el: ({dur}) => (
      <Shot dur={dur} push={0.03}>
        {(f) => {
          const split = k(f, [s(7.4), s(8.4)], [0, 1], E.inOut);
          return (
            <>
              <div style={{position: 'absolute', left: 0, right: 0, top: 360, textAlign: 'center', fontFamily: FONT.display, fontWeight: 700, fontSize: 110, color: C.gold, opacity: k(f, [0, 14], [0, 1]) * (1 - split)}}>
                ТЫСЯЧИ %
              </div>
              <div style={{position: 'absolute', left: 0, right: 0, top: 520, textAlign: 'center', fontFamily: FONT.mono, fontSize: 22, letterSpacing: '0.24em', color: C.muted, opacity: k(f, [10, 24], [0, 1]) * (1 - split)}}>
                ОТДЕЛЬНЫЕ СДЕЛКИ · ЗНАНИЕ ЦЕН И ОПЫТ
              </div>
              {[
                {t: 'РАНЬШЕ', sub: 'ОЦЕНКА ВРУЧНУЮ', x: 260},
                {t: 'СЕГОДНЯ', sub: 'ПАРСЕРЫ И БОТЫ', x: 1000},
              ].map((c, i) => (
                <div key={c.t} style={{position: 'absolute', left: c.x, top: 260, width: 660, height: 520, opacity: split, border: `1px solid ${C.line}`, borderRadius: 8, background: '#12161C', padding: 40}}>
                  <div style={{fontFamily: FONT.mono, fontSize: 20, letterSpacing: '0.3em', color: i ? C.gold : C.muted}}>{c.t}</div>
                  <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 52, color: C.ivory, marginTop: 12}}>{c.sub}</div>
                  {Array.from({length: 6}, (_, r) => (
                    <div key={r} style={{display: 'flex', gap: 14, marginTop: 22, alignItems: 'center'}}>
                      <div style={{width: 44, height: 22, borderRadius: 4, background: '#232A34'}} />
                      <div style={{flex: 1, height: 10, borderRadius: 5, background: i && ((f / 3 + r) % 6 < 1) ? C.gold : '#232A34'}} />
                    </div>
                  ))}
                </div>
              ))}
            </>
          );
        }}
      </Shot>
    ),
  },
  // 65.3–79.3 «В декабре 2012 года Valve запускает Community Market…»
  {
    from: 65.3,
    to: 79.5,
    el: ({dur}) => (
      <Shot dur={dur} push={0}>
        {() => (
          <ArticleShot
            {...MARKET}
            cams={[
              {t: 0, x: 967, y: 560, z: 0.97},
              {t: 1.5, x: 967, y: 380, z: 1.0},
              {t: 5.0, x: 967, y: 460, z: 1.0},
              {t: 7.0, x: 967, y: 540, z: 1.0},
              {t: 11.0, x: 967, y: 720, z: 1.0},
              {t: 14.2, x: 967, y: 740, z: 1.02},
            ]}
            marks={[
              {t: 1.2, x: 160, y: 132, w: 1615, h: 56, spot: true},
              {t: 2.8, x: 958, y: 286, w: 144, h: 22, spot: true},
              {t: 4.6, x: 160, y: 375, w: 920, h: 80, spot: true},
              {t: 6.6, x: 160, y: 482, w: 918, h: 53, spot: true},
              {t: 10.6, x: 160, y: 802, w: 900, h: 53, spot: true},
            ]}
          />
        )}
      </Shot>
    ),
  },
  // 79.3–83.9 «…появилась игра, которая вывела торговлю на другой уровень» — скриншоты Counter-Strike (магазин Steam)
  {
    from: 79.3,
    to: 83.9,
    el: ({dur}) => (
      <Shot dur={dur} push={0}>
        {(f) => {
          const shots = [
            {img: 'cs-ss-a', cap: 'COUNTER-STRIKE · STEAM'},
            {img: 'cs-ss-b', cap: 'COUNTER-STRIKE · STEAM'},
            {img: 'cs-ss-c', cap: 'COUNTER-STRIKE · STEAM'},
            {img: 'cs-ss-d', cap: 'COUNTER-STRIKE · STEAM'},
          ];
          const seg = dur / shots.length;
          return (
            <>
              {shots.map((sh, i) => {
                const a0 = i * seg;
                const o = k(f, [a0 - 6, a0 + 4], [0, 1]) * k(f, [a0 + seg - 2, a0 + seg + 6], [1, 0]);
                const z = 1.02 + ((f - a0) / seg) * 0.05;
                return o > 0 ? (
                  <AbsoluteFill key={sh.img} style={{opacity: i === 0 ? Math.min(1, o + (f < 6 ? 1 : 0)) : o}}>
                    <Img src={staticFile(`news/${sh.img}.jpg`)} style={{width: 1920, height: 1080, objectFit: 'cover', transform: `scale(${z})`}} />
                    <div style={{position: 'absolute', left: 60, bottom: 44, padding: '8px 14px', background: 'rgba(5,6,8,0.75)', borderRadius: 4, fontFamily: FONT.mono, fontSize: 16, letterSpacing: '0.12em', color: C.ivory}}>{sh.cap}</div>
                  </AbsoluteFill>
                ) : null;
              })}
            </>
          );
        }}
      </Shot>
    ),
  },
];

export const Narr01: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: C.black}}>
      <Backdrop glowOpacity={0.08} />
      <Dust seed="n01" count={50} opacity={0.6} speed={0.6} />
      {SHOTS.map((sh, i) => (
        <Sequence key={i} from={s(sh.from)} durationInFrames={s(sh.to) - s(sh.from)}>
          <sh.el dur={s(sh.to) - s(sh.from)} />
        </Sequence>
      ))}
      <Audio src={staticFile('audio/narr01.mp3')} />
      <Finish vignette={0.75} grain={0.06} />
      <div style={{position: 'absolute', right: 40, bottom: 30, fontFamily: FONT.mono, fontSize: 14, color: C.dim, opacity: 0.0 * f}} />
    </AbsoluteFill>
  );
};
