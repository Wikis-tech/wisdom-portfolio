"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useState} from "react";
import type {NavigationItem} from "@/lib/site/content";

export function PublicNavClient({items,brand,logoUrl}:{items:NavigationItem[];brand:string;logoUrl?:string|null}){
 const pathname=usePathname();
 const [open,setOpen]=useState(false);
 const close=()=>setOpen(false);
 const links=items.filter(x=>x.style==="link");
 const cta=items.find(x=>x.style==="cta");
 const itemActive=(href:string)=>!href.startsWith("http")&&(pathname===href||(href!=="/"&&pathname.startsWith(href+"/")));

 return <header className="nav-enter sticky top-0 z-50 border-b border-white/[.06] bg-[#050812]/88 backdrop-blur-xl">
  <nav className="mx-auto flex min-h-16 w-[min(1440px,calc(100%-32px))] items-center justify-between sm:w-[min(1440px,calc(100%-40px))]" aria-label="Primary navigation">
   <Link href="/" onClick={close} className="flex items-center gap-2 text-xs font-bold tracking-[.24em] text-white">
    {logoUrl?<span aria-hidden="true" className="h-7 w-7 rounded-md bg-contain bg-center bg-no-repeat" style={{backgroundImage:`url("${logoUrl}")`}}/>:null}
    <span>{brand}</span>
   </Link>
   <div className="hidden items-center gap-7 text-sm md:flex">
    {links.map(item=>{const active=itemActive(item.href);const external=item.is_external||item.href.startsWith("http");return external?<a key={item.id} href={item.href} target="_blank" rel="noreferrer" data-analytics-event="external_click" className="nav-link-motion py-2 text-white/50 hover:text-white">{item.label}</a>:<Link key={item.id} href={item.href} aria-current={active?"page":undefined} className={`nav-link-motion relative py-2 ${active?"text-white":"text-white/50 hover:text-white"}`}>{item.label}{active&&<span className="absolute inset-x-0 -bottom-0.5 h-px bg-white/70"/>}</Link>})}
   </div>
   <div className="flex items-center gap-2">
    {cta?(cta.is_external||cta.href.startsWith("http")?<a href={cta.href} target="_blank" rel="noreferrer" data-analytics-event="conversion_cta" className="hidden rounded-full border border-[#4969c8]/25 bg-[#0a1733]/70 px-4 py-2 text-sm text-white/80 transition duration-300 hover:-translate-y-0.5 hover:border-[#6d8cff]/45 hover:bg-[#11244b] sm:inline-flex">{cta.label} ↗</a>:<Link href={cta.href} onClick={close} data-analytics-event="conversion_cta" className="hidden rounded-full border border-white/10 bg-white/[.04] px-4 py-2 text-sm text-white/80 transition hover:bg-white/[.08] sm:inline-flex">{cta.label} ↗</Link>):null}
    <button type="button" onClick={()=>setOpen(v=>!v)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open?"Close navigation":"Open navigation"} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[.035] md:hidden">
     <span className="sr-only">{open?"Close menu":"Open menu"}</span><span aria-hidden="true" className="relative block h-3.5 w-4"><span className={`absolute left-0 top-0 h-px w-4 bg-white transition ${open?"translate-y-[6px] rotate-45":""}`}/><span className={`absolute left-0 top-[6px] h-px w-4 bg-white transition ${open?"opacity-0":""}`}/><span className={`absolute left-0 top-[12px] h-px w-4 bg-white transition ${open?"-translate-y-[6px] -rotate-45":""}`}/></span>
    </button>
   </div>
  </nav>
  <div id="mobile-menu" className={`overflow-hidden border-t border-white/[.06] transition-[max-height,opacity] duration-300 md:hidden ${open?"max-h-[32rem] opacity-100":"max-h-0 opacity-0"}`}>
   <div className="mx-auto w-[min(1440px,calc(100%-32px))] py-3">
    {links.map(item=>{const external=item.is_external||item.href.startsWith("http");const active=itemActive(item.href);return external?<a onClick={close} key={item.id} href={item.href} target="_blank" rel="noreferrer" data-analytics-event="external_click" className="flex items-center justify-between rounded-xl px-3 py-3 text-base text-white/55"><span>{item.label}</span><span className="text-white/25">↗</span></a>:<Link onClick={close} key={item.id} href={item.href} aria-current={active?"page":undefined} className={`flex items-center justify-between rounded-xl px-3 py-3 text-base ${active?"bg-white/[.055] text-white":"text-white/55"}`}><span>{item.label}</span><span className="text-white/25">↗</span></Link>})}
    {cta&&(cta.is_external||cta.href.startsWith("http")?<a href={cta.href} target="_blank" rel="noreferrer" data-analytics-event="conversion_cta" className="mt-2 flex items-center justify-between rounded-xl bg-white px-3 py-3 text-sm font-semibold text-[#06070b]"><span>{cta.label}</span><span>↗</span></a>:<Link onClick={close} href={cta.href} data-analytics-event="conversion_cta" className="mt-2 flex items-center justify-between rounded-xl bg-white px-3 py-3 text-sm font-semibold text-[#06070b]"><span>{cta.label}</span><span>↗</span></Link>)}
   </div>
  </div>
 </header>
}
