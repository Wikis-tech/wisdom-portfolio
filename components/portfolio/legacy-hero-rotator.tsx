"use client";
import {useEffect,useState} from "react";

export function LegacyHeroRotator({words,enabled=true,intervalMs=2200}:{words:string[];enabled?:boolean;intervalMs?:number}){
 const safe=words.length?words:["WORK."];
 const [i,setI]=useState(0);
 useEffect(()=>{if(!enabled||safe.length<2)return;const t=window.setInterval(()=>setI(v=>(v+1)%safe.length),intervalMs);return()=>window.clearInterval(t)},[enabled,intervalMs,safe.length]);
 return <span className="legacy-rotator" aria-live="polite"><span key={safe[i]}>{safe[i]}</span></span>
}
