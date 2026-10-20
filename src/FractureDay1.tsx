import React from 'react';
import {AbsoluteFill,Audio,Img,OffthreadVideo,Sequence,interpolate,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import day from '../data/day01.json';
const C={bg:'#0B0E13',panel:'#151A22',gold:'#D9A93D',white:'#F4F1E9',muted:'#98A3B5',red:'#E54C58'};
const Box:React.FC<{children:React.ReactNode}>=({children})=><div style={{padding:40,background:C.panel,border:'1px solid #2B3440',borderRadius:24}}>{children}</div>;
const Head:React.FC<{tag:string,title:string,accent?:string}>=({tag,title,accent})=><div><div style={{fontSize:28,color:C.gold,fontFamily:'monospace',letterSpacing:3,marginBottom:20}}>{tag}</div><div style={{fontSize:110,fontWeight:900,lineHeight:1,color:accent||C.white}}>{title}</div></div>;
const Market:React.FC=()=> <AbsoluteFill style={{padding:'340px 85px 250px'}}><Head tag="DAY 01 / MARKET FALL" title="РЫНОК ПАДАЕТ" accent={C.red}/><div style={{fontSize:47,marginTop:45}}>Я начинаю покупать.</div><div style={{marginTop:110}}><Box><Img src={staticFile('assets/proof/steam_chart.jpg')} style={{width:'100%',height:660,objectFit:'cover'}}/></Box></div></AbsoluteFill>;
const Plan:React.FC=()=> <AbsoluteFill style={{padding:'370px 85px 250px'}}><Head tag="30 ДНЕЙ / ПРАВИЛА" title="КАЖДЫЙ ДЕНЬ"/><div style={{fontSize:74,fontWeight:900,color:C.gold,marginTop:30}}>НА 5 БОЛЬШЕ</div><div style={{display:'flex',justifyContent:'space-between',fontSize:70,fontWeight:800,marginTop:170,color:C.white}}><span>20</span><span>›</span><span>25</span><span>›</span><span>30</span><span>›</span><span style={{color:C.gold}}>165</span></div><div style={{marginTop:160}}><Box><div style={{fontSize:30,color:C.muted}}>ЦЕЛЬ ЗА 30 ДНЕЙ</div><div style={{fontSize:160,color:C.gold,fontWeight:900}}>{day.monthlyTargetCases.toLocaleString('ru-RU')}</div><div style={{fontSize:35}}>КЕЙСОВ</div></Box></div></AbsoluteFill>;
const Purchase:React.FC=()=> <AbsoluteFill style={{padding:'350px 85px 260px'}}><Head tag="FRACTURE / REAL PURCHASE" title="ПЕРВЫЕ 20"/><div style={{marginTop:100}}><Box><Img src={staticFile('assets/proof/inventory_20.jpg')} style={{width:'100%',height:850,objectFit:'cover'}}/></Box></div><div style={{fontSize:40,marginTop:55}}>ПОДТВЕРЖДЕНО В ИНВЕНТАРЕ</div></AbsoluteFill>;
const Close:React.FC=()=> <AbsoluteFill style={{padding:'410px 85px 300px'}}><Head tag="ЭКСПЕРИМЕНТ / ДЕНЬ 1" title="20 / 2775"/><div style={{marginTop:150}}><Box><div style={{fontSize:38,color:C.muted}}>ЗАВТРА ПОКУПАЮ</div><div style={{fontSize:210,color:C.gold,fontWeight:900}}>25</div><div style={{fontSize:48}}>КЕЙСОВ</div></Box></div><div style={{fontSize:65,fontWeight:900,marginTop:110}}>ГЕНИЙ ИЛИ ДУРАК?</div><div style={{fontSize:35,color:C.muted,marginTop:30}}>Пиши свой прогноз.</div></AbsoluteFill>;
export const FractureDay1:React.FC=()=>{
 const frame=useCurrentFrame(),{durationInFrames}=useVideoConfig();
 const alpha=interpolate(frame,[0,9],[0,1],{extrapolateRight:'clamp'});
 return <AbsoluteFill style={{background:C.bg,color:C.white,fontFamily:'Arial, sans-serif',overflow:'hidden'}}>
   <AbsoluteFill style={{opacity:0.12,backgroundSize:'90px 90px',backgroundImage:'linear-gradient(#536172 1px,transparent 1px),linear-gradient(90deg,#536172 1px,transparent 1px)'}}/>
   <div style={{position:'absolute',top:125,left:85,right:85,fontWeight:900,fontSize:34,zIndex:10}}>TRUE<span style={{color:C.gold}}>DAD</span><span style={{float:'right',fontSize:23,color:C.muted}}>CS2 / INVESTING</span></div>
   <Sequence from={0} durationInFrames={220}><Market/></Sequence>
   <Sequence from={220} durationInFrames={540}><Plan/></Sequence>
   <Sequence from={760} durationInFrames={445}><Purchase/></Sequence>
   <Sequence from={1205} durationInFrames={117}><Close/></Sequence>
   <Audio src={staticFile('assets/voiceover-day01.mp3')}/>
   <div style={{position:'absolute',left:85,right:85,bottom:165,height:3,background:'#303746'}}><div style={{background:C.gold,width:`${(frame+1)/durationInFrames*100}%`,height:'100%'}}/></div>
 </AbsoluteFill>;
};
