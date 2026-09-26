"use client";
import {useEffect,useRef,useState,type PointerEvent} from "react";

type Props={line1:string;line2:string;words:string[];enabled:boolean;intervalMs:number};

export function HeroRotator({line1,line2,words,enabled,intervalMs}:Props){
 const safeWords=words.length?words:["WORK."];
 const [index,setIndex]=useState(0);
 const ref=useRef<HTMLDivElement>(null);

 useEffect(()=>{
  if(!enabled||safeWords.length<2)return;
  const timer=window.setInterval(()=>setIndex(i=>(i+1)%safeWords.length),intervalMs);
  return()=>window.clearInterval(timer);
 },[enabled,intervalMs,safeWords.length]);

 function move(e:PointerEvent<HTMLDivElement>){
  if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  const rect=e.currentTarget.getBoundingClientRect();
  const x=(e.clientX-rect.left)/rect.width-.5;
  const y=(e.clientY-rect.top)/rect.height-.5;
  ref.current?.style.setProperty("--rx",`${-y*3.5}deg`);
  ref.current?.style.setProperty("--ry",`${x*4.5}deg`);
 }
 function reset(){ref.current?.style.setProperty("--rx","0deg");ref.current?.style.setProperty("--ry","0deg")}

 return <div ref={ref} onPointerMove={move} onPointerLeave={reset} className="hero-depth relative" aria-label={`${line1} ${line2} ${safeWords[index]}`}>
  <div className="hero-orbit hero-orbit-a" aria-hidden="true"/>
  <div className="hero-orbit hero-orbit-b" aria-hidden="true"/>
  <h1 className="relative z-10 max-w-[980px] text-[clamp(2.65rem,5.35vw,5.4rem)] font-semibold leading-[.94] tracking-[-.06em]">
   <span className="block text-balance">{line1}</span>
   <span className="block text-balance">{line2}</span>
   <span className="hero-word-wrap mt-1 block overflow-hidden" aria-live="polite"><span key={safeWords[index]} className="hero-word block">{safeWords[index]}</span></span>
  </h1>
 </div>
}
