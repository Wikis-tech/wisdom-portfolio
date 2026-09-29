"use client";

import {useEffect,useRef,useState} from "react";
import {usePathname} from "next/navigation";

function isModifiedClick(event:MouseEvent){
 return event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||event.button!==0;
}

export function GlobalLoadingIndicator(){
 const pathname=usePathname();
 const [active,setActive]=useState(false);
 const [admin,setAdmin]=useState(false);
 const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
 const startedAt=useRef(0);

 useEffect(()=>{
  setAdmin(pathname.startsWith("/admin"));
  const elapsed=Date.now()-startedAt.current;
  const wait=Math.max(0,260-elapsed);
  const id=setTimeout(()=>setActive(false),wait);
  return()=>clearTimeout(id);
 },[pathname]);

 useEffect(()=>{
  const stopLater=(ms=3200)=>{
   if(timer.current)clearTimeout(timer.current);
   timer.current=setTimeout(()=>setActive(false),ms);
  };
  const start=(kind:"nav"|"action")=>{
   startedAt.current=Date.now();
   setActive(true);
   stopLater(kind==="nav"?5000:2600);
  };

  const onClick=(event:MouseEvent)=>{
   if(isModifiedClick(event))return;
   const target=event.target as HTMLElement|null;
   if(!target)return;

   const anchor=target.closest<HTMLAnchorElement>("a[href]");
   if(anchor){
    if(anchor.dataset.noLoading!==undefined)return;
    if(anchor.target==="_blank"||anchor.hasAttribute("download"))return;
    const raw=anchor.getAttribute("href");
    if(!raw||raw.startsWith("#")||raw.startsWith("mailto:")||raw.startsWith("tel:")||raw.startsWith("javascript:"))return;
    try{
     const next=new URL(anchor.href,window.location.href);
     if(next.origin!==window.location.origin)return;
     if(next.pathname===window.location.pathname&&next.search===window.location.search)return;
     start("nav");
    }catch{return}
    return;
   }

   const button=target.closest<HTMLButtonElement>("button");
   if(!button||button.disabled||button.dataset.noLoading!==undefined)return;
   const type=(button.getAttribute("type")||"submit").toLowerCase();
   if(type==="submit"&&button.closest("form"))return;
   if(button.dataset.loadingAction!==undefined)start("action");
  };

  const onSubmit=(event:SubmitEvent)=>{
   const form=event.target as HTMLFormElement|null;
   if(!form||form.dataset.noLoading!==undefined)return;
   start("action");
  };

  document.addEventListener("click",onClick,true);
  document.addEventListener("submit",onSubmit,true);
  return()=>{
   document.removeEventListener("click",onClick,true);
   document.removeEventListener("submit",onSubmit,true);
   if(timer.current)clearTimeout(timer.current);
  };
 },[]);

 if(!active)return null;

 return <div className={`global-loader ${admin?"global-loader-admin":"global-loader-public"}`} role="status" aria-live="polite" aria-label="Loading">
  <div className="global-loader-progress" aria-hidden="true"/>
  <div className="global-loader-panel">
   <div className="global-loader-mark" aria-hidden="true">
    <span className="global-loader-ring global-loader-ring-a"/>
    <span className="global-loader-ring global-loader-ring-b"/>
    <span className="global-loader-core">W</span>
   </div>
   <p className="global-loader-label">{admin?"Updating portfolio":"Loading"}</p>
   <span className="sr-only">Please wait</span>
  </div>
 </div>;
}
