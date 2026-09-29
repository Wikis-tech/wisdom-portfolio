"use client";

type Theme="dark"|"light";

function currentTheme():Theme{
 return document.documentElement.dataset.theme==="light"?"light":"dark";
}
function applyTheme(theme:Theme){
 document.documentElement.dataset.theme=theme;
 document.documentElement.style.colorScheme=theme;
 localStorage.setItem("wikis-portfolio-theme",theme);
}

export function ThemeToggle(){
 function toggle(){
  applyTheme(currentTheme()==="dark"?"light":"dark");
 }

 return <button
  type="button"
  onClick={toggle}
  className="theme-toggle group inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[.035] transition duration-300 hover:-translate-y-0.5"
  aria-label="Toggle light and dark mode"
  title="Toggle light and dark mode"
 >
  <span className="relative block h-4 w-4" aria-hidden="true">
   <span className="theme-sun absolute inset-0 transition duration-300">
    <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-current"/>
    <span className="absolute left-1/2 top-[-2px] h-1 w-px -translate-x-1/2 bg-current"/><span className="absolute bottom-[-2px] left-1/2 h-1 w-px -translate-x-1/2 bg-current"/>
    <span className="absolute left-[-2px] top-1/2 h-px w-1 -translate-y-1/2 bg-current"/><span className="absolute right-[-2px] top-1/2 h-px w-1 -translate-y-1/2 bg-current"/>
   </span>
   <span className="theme-moon absolute inset-[1px] rounded-full border border-current transition duration-300 before:absolute before:-right-[2px] before:-top-[2px] before:h-3 before:w-3 before:rounded-full before:bg-[var(--nav-bg-solid)]"/>
  </span>
 </button>;
}
