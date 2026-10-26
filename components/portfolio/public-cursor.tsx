"use client";
import {useEffect} from "react";

export function PublicCursor(){
 useEffect(()=>{
  if(window.matchMedia("(pointer: coarse)").matches)return;
  const dot=document.createElement("div"); dot.className="legacy-cursor";
  const ring=document.createElement("div"); ring.className="legacy-cursor-ring";
  document.body.append(dot,ring);
  let mx=0,my=0,rx=0,ry=0,raf=0;
  const move=(e:MouseEvent)=>{mx=e.clientX;my=e.clientY;dot.style.left=mx+"px";dot.style.top=my+"px"};
  const loop=()=>{rx+=(mx-rx)*.12;ry+=(my-ry)*.12;ring.style.left=rx+"px";ring.style.top=ry+"px";raf=requestAnimationFrame(loop)};
  const over=(e:Event)=>{if((e.target as Element)?.closest("a,button,input,textarea,select,[data-cursor-hover]")){dot.classList.add("is-hovering");ring.classList.add("is-hovering")}};
  const out=(e:Event)=>{if((e.target as Element)?.closest("a,button,input,textarea,select,[data-cursor-hover]")){dot.classList.remove("is-hovering");ring.classList.remove("is-hovering")}};
  window.addEventListener("mousemove",move);document.addEventListener("mouseover",over);document.addEventListener("mouseout",out);loop();
  return()=>{cancelAnimationFrame(raf);window.removeEventListener("mousemove",move);document.removeEventListener("mouseover",over);document.removeEventListener("mouseout",out);dot.remove();ring.remove()}
 },[]);
 return null;
}
