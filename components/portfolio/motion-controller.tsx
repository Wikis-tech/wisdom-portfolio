"use client";

import {useEffect} from "react";
import {usePathname} from "next/navigation";

export function MotionController(){
 const pathname=usePathname();

 useEffect(()=>{
  const root=document.documentElement;
  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  root.classList.add("motion-ready");

  const nodes=Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
  if(reduced){
   nodes.forEach(node=>node.classList.add("is-visible"));
   return;
  }

  nodes.forEach(node=>{
   const delay=Math.max(0,Math.min(900,Number(node.dataset.delay||0)));
   node.style.setProperty("--reveal-delay",`${delay}ms`);
  });

  const observer=new IntersectionObserver(entries=>{
   for(const entry of entries){
    if(entry.isIntersecting){
     (entry.target as HTMLElement).classList.add("is-visible");
     observer.unobserve(entry.target);
    }
   }
  },{rootMargin:"0px 0px -9% 0px",threshold:0.08});

  nodes.forEach(node=>observer.observe(node));
  return()=>observer.disconnect();
 },[pathname]);

 return null;
}
