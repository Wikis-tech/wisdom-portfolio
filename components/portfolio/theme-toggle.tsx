"use client";

import {useEffect,useState} from "react";

type Theme="dark"|"light";

function applyTheme(theme:Theme){
 document.documentElement.dataset.theme=theme;
 document.documentElement.style.colorScheme=theme;
 localStorage.setItem("wikis-portfolio-theme",theme);
}

export function ThemeToggle(){
 const [theme,setTheme]=useState<Theme>("dark");

 useEffect(()=>{
  const current=(document.documentElement.dataset.theme==="light"?"light":"dark") as Theme;
  setTheme(current);
 },[]);

 const next=theme==="dark"?"light":"dark";

 return <button
  type="button"
  onClick={()=>{applyTheme(next);setTheme(next)}}
  className="theme-toggle group inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[.035] transition duration-300 hover:-translate-y-0.5"
  aria-label={`Switch to ${next} mode`}
  title={`Switch to ${next} mode`}
 >
  <span className="relative block h-4 w-4" aria-hidden="true">
   <span className={`theme-icon absolute inset-0 transition duration-300 ${theme==="dark"?"scale-100 rotate-0 opacity-100":"scale-50 -rotate-45 opacity-0"}`}>
    <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-current"/>
    <span className="absolute left-1/2 top-[-2px] h-1 w-px -translate-x-1/2 bg-current"/><span className="absolute bottom-[-2px] left-1/2 h-1 w-px -translate-x-1/2 bg-current"/>
    <span className="absolute left-[-2px] top-1/2 h-px w-1 -translate-y-1/2 bg-current"/><span className="absolute right-[-2px] top-1/2 h-px w-1 -translate-y-1/2 bg-current"/>
   </span>
   <span className={`theme-icon absolute inset-[1px] rounded-full border border-current transition duration-300 before:absolute before:-right-[2px] before:-top-[2px] before:h-3 before:w-3 before:rounded-full before:bg-[var(--nav-bg-solid)] ${theme==="light"?"scale-100 rotate-0 opacity-100":"scale-50 rotate-45 opacity-0"}`}/>
  </span>
 </button>;
}
