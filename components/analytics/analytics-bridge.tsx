"use client";
import {useEffect} from "react";
import type {AnalyticsSettings} from "@/lib/site/content";

declare global{interface Window{dataLayer?:unknown[];gtag?:(...args:unknown[])=>void}}

export function AnalyticsBridge({settings}:{settings:AnalyticsSettings}){
 useEffect(()=>{
  if(!settings.enabled)return;
  const onClick=(event:MouseEvent)=>{
   const target=event.target instanceof Element?event.target.closest("a"):null;
   if(!target)return;
   const label=(target.textContent||"").trim().slice(0,120);
   const href=(target as HTMLAnchorElement).href;
   const kind=target.getAttribute("data-analytics-event");
   const external=href&&new URL(href,window.location.href).origin!==window.location.origin;
   if(kind==="conversion_cta"&&settings.conversion_tracking)window.gtag?.("event","conversion_cta",{event_label:label,link_url:href});
   else if((kind==="external_click"||external)&&settings.external_click_tracking)window.gtag?.("event","external_click",{event_label:label,link_url:href});
  };
  document.addEventListener("click",onClick);
  return()=>document.removeEventListener("click",onClick);
 },[settings]);
 return null;
}
