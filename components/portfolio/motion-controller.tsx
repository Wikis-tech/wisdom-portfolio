"use client";

import {useEffect} from "react";
import {usePathname} from "next/navigation";

export function MotionController(){
 const pathname=usePathname();

 useEffect(()=>{
  const root=document.documentElement;
  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  root.classList.add("motion-ready");

  if(reduced){
   document.querySelectorAll<HTMLElement>("[data-reveal]").forEach(node=>{
    node.classList.remove("reveal-pending");
    node.classList.add("is-visible");
   });
   return;
  }

  const observed=new WeakSet<Element>();
  const intersection=new IntersectionObserver(entries=>{
   for(const entry of entries){
    if(entry.isIntersecting){
     const node=entry.target as HTMLElement;
     node.classList.add("is-visible");
     node.classList.remove("reveal-pending");
     intersection.unobserve(node);
    }
   }
  },{rootMargin:"0px 0px -6% 0px",threshold:0.04});

  const register=(node:HTMLElement)=>{
   if(observed.has(node))return;
   observed.add(node);
   const delay=Math.max(0,Math.min(900,Number(node.dataset.delay||0)));
   node.style.setProperty("--reveal-delay",`${delay}ms`);

   const rect=node.getBoundingClientRect();
   const alreadyInView=rect.top<window.innerHeight*0.98&&rect.bottom>0;
   if(alreadyInView){
    node.classList.add("is-visible");
    node.classList.remove("reveal-pending");
    return;
   }

   node.classList.add("reveal-pending");
   intersection.observe(node);
  };

  const registerAll=(scope:ParentNode=document)=>{
   scope.querySelectorAll<HTMLElement>("[data-reveal]").forEach(register);
  };

  // Register anything already rendered.
  registerAll();

  // App Router can stream/replace Server Component content after this effect runs.
  // Observe DOM additions so late-rendered reveal elements can never remain hidden.
  const mutation=new MutationObserver(records=>{
   for(const record of records){
    for(const added of record.addedNodes){
     if(!(added instanceof HTMLElement))continue;
     if(added.matches("[data-reveal]"))register(added);
     registerAll(added);
    }
   }
  });
  mutation.observe(document.body,{childList:true,subtree:true});

  // Safety net: content should never stay invisible if an observer is interrupted.
  const failSafe=window.setTimeout(()=>{
   document.querySelectorAll<HTMLElement>(".reveal-pending").forEach(node=>{
    node.classList.add("is-visible");
    node.classList.remove("reveal-pending");
    intersection.unobserve(node);
   });
  },1800);

  return()=>{
   mutation.disconnect();
   intersection.disconnect();
   window.clearTimeout(failSafe);
   document.querySelectorAll<HTMLElement>(".reveal-pending").forEach(node=>{
    node.classList.remove("reveal-pending");
    node.classList.add("is-visible");
   });
  };
 },[pathname]);

 return null;
}
