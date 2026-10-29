"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {useState} from "react";

const primary=[
 ["Overview","/admin"],
 ["Websites & Apps","/admin/projects"],
 ["Graphic Designs","/admin/designs"],
 ["Homepage","/admin/pages/home"],
 ["About Me","/admin/about"],
 ["Services","/admin/services"],
 ["Inbox","/admin/messages"],
] as const;

const manage=[
 ["Media Library","/admin/media"],
 ["Work Experience","/admin/experience"],
 ["Lab / Experiments","/admin/lab"],
 ["Pricing","/admin/pricing"],
 ["Now / Current Focus","/admin/now"],
 ["Skills","/admin/skills"],
 ["Technologies","/admin/technologies"],
 ["Testimonials","/admin/testimonials"],
] as const;

const site=[
 ["Site Settings","/admin/settings"],
 ["Navigation","/admin/navigation"],
 ["SEO","/admin/seo"],
 ["Quote Requests","/admin/quotes"],
 ["Trash","/admin/trash"],
] as const;

export function AdminSidebar(){
 const pathname=usePathname();
 const [open,setOpen]=useState(false);
 const close=()=>setOpen(false);
 const linkClass=(href:string)=>{
  const active=pathname===href||(href!=="/admin"&&pathname.startsWith(href+"/"));
  return "block rounded-xl px-3 py-2.5 text-sm transition "+(active?"bg-[#183a7a]/55 text-white ring-1 ring-blue-400/15":"text-white/58 hover:bg-white/[.05] hover:text-white");
 };
 const links=(items:readonly (readonly [string,string])[])=>items.map(([label,href])=><Link key={href} href={href} onClick={close} className={linkClass(href)}>{label}</Link>);

 const contents=<>
  <Link href="/admin" onClick={close} className="mb-5 block">
   <span className="text-sm font-bold tracking-[0.22em] text-white">WIKIS TECH</span>
   <span className="mt-1 block text-xs text-white/40">Simple portfolio manager</span>
  </Link>

  <div className="mb-5 rounded-2xl border border-blue-400/10 bg-blue-400/[.04] p-3 text-xs leading-5 text-white/52">
   <strong className="text-white/80">Normal workflow:</strong><br/>
   add work → add image → publish → check live site.
  </div>

  <p className="mb-2 px-3 text-[10px] font-semibold tracking-[.16em] text-white/25">EVERYDAY</p>
  <nav className="space-y-1" aria-label="Everyday admin navigation">{links(primary)}</nav>

  <details className="mt-5 rounded-2xl border border-white/[.06] bg-white/[.015] p-2">
   <summary className="cursor-pointer list-none rounded-xl px-2 py-2 text-xs font-semibold tracking-[.12em] text-white/38">MORE CONTENT</summary>
   <nav className="mt-1 space-y-1" aria-label="More content navigation">{links(manage)}</nav>
  </details>

  <details className="mt-3 rounded-2xl border border-white/[.06] bg-white/[.015] p-2">
   <summary className="cursor-pointer list-none rounded-xl px-2 py-2 text-xs font-semibold tracking-[.12em] text-white/38">WEBSITE SETTINGS</summary>
   <nav className="mt-1 space-y-1" aria-label="Site settings navigation">{links(site)}</nav>
  </details>

  <Link href="/" onClick={close} className="mt-auto rounded-xl border border-white/10 px-3 py-3 text-sm text-white/70 transition hover:bg-white/[.05]">View live portfolio ↗</Link>
 </>;

 return <>
  <div className="flex min-h-14 items-center justify-between border-b border-white/10 bg-[#080a10] px-4 lg:hidden">
   <Link href="/admin" onClick={close} className="text-xs font-bold tracking-[.22em]">WIKIS TECH</Link>
   <button type="button" onClick={()=>setOpen(true)} className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white/70" aria-label="Open admin navigation">Menu</button>
  </div>
  {open&&<button aria-label="Close admin navigation" className="fixed inset-0 z-40 bg-black/65 lg:hidden" onClick={close}/>}
  <aside className={"fixed inset-y-0 left-0 z-50 w-[min(88vw,300px)] border-r border-white/10 bg-[#080a10] transition-transform duration-300 lg:w-64 lg:translate-x-0 "+(open?"translate-x-0":"-translate-x-full")}>
   <div className="flex h-full flex-col overflow-y-auto p-5">
    <div className="mb-4 flex justify-end lg:hidden"><button type="button" onClick={close} className="rounded-lg border border-white/10 px-3 py-2 text-xs text-white/60">Close</button></div>
    {contents}
   </div>
  </aside>
 </>;
}
