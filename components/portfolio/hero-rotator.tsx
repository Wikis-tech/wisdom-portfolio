"use client";
import {useEffect,useRef,useState} from "react";

type Props={line1:string;line2:string;words:string[];enabled:boolean;intervalMs:number};
export function HeroRotator({line1,line2,words,enabled,intervalMs}:Props){
 const safeWords=words.length?words:["WORK."]; const [index,setIndex]=useState(0); const ref=useRef<HTMLDivElement>(null);
 useEffect(()=>{if(!enabled||safeWords.length<2)return;const t=window.setInterval(()=>setIndex(i=>(i+1)%safeWords.length),intervalMs);return()=>window.clearInterval(t)},[enabled,intervalMs,safeWords.length]);
 function move(e:React.PointerEvent<HTMLDivElement>){if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;const r=e.currentTarget.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;ref.current?.style.setProperty("--rx",`${-y*5}deg`);ref.current?.style.setProperty("--ry",`${x*6}deg`)}
 function reset(){ref.current?.style.setProperty("--rx","0deg");ref.current?.style.setProperty("--ry","0deg")}
 return <div ref={ref} onPointerMove={move} onPointerLeave={reset} className="hero-depth relative" aria-label={`${line1} ${line2} ${safeWords[index]}`}>
  <div className="hero-orbit hero-orbit-a" aria-hidden="true"/><div className="hero-orbit hero-orbit-b" aria-hidden="true"/>
  <h1 className="relative z-10 max-w-[920px] text-[clamp(3rem,6.4vw,6.2rem)] font-semibold leading-[.91] tracking-[-.065em]">
   <span className="block">{line1}</span><span className="block">{line2}</span>
   <span className="hero-word-wrap mt-1 block overflow-hidden"><span key={safeWords[index]} className="hero-word block">{safeWords[index]}</span></span>
  </h1>
 </div>
}