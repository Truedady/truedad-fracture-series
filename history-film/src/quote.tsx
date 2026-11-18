import React from 'react';
import {AbsoluteFill} from 'remotion';
import {easeOut, k, Sfx, useSec} from './engine';
import {C, FONT} from './theme';

/** Дословная цитата из официального текста: слова появляются по очереди. */
export const Quote: React.FC<{head: string; text: string}> = ({head, text}) => {
  const {t, dur} = useSec();
  const words = text.split(' ');
  const per = (dur * 0.6) / words.length;
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 45%, #141B25 0%, ${C.black} 85%)`, alignItems: 'center', justifyContent: 'center'}}>
      <div style={{width: 1500, transform: `scale(${1 + (t / dur) * 0.04})`}}>
        <div style={{fontFamily: FONT.mono, fontSize: 32, color: C.gold, letterSpacing: '0.06em', opacity: k(t, [0.2, 0.7], [0, 1])}}>{head}</div>
        <div style={{fontFamily: FONT.text, fontSize: 58, lineHeight: 1.35, color: C.ivory, marginTop: 34}}>
          {words.map((w, i) => {
            const p = k(t, [0.7 + i * per, 0.7 + i * per + 0.4], [0, 1], easeOut);
            const hot = /7|re-trade|re-market/.test(w);
            return <span key={i} style={{opacity: p, color: hot ? C.gold : C.ivory}}>{w} </span>;
          })}
        </div>
      </div>
      <Sfx name="whoosh_short" at={0.2} vol={0.3} />
    </AbsoluteFill>
  );
};
