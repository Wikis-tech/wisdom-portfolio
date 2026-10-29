"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {useState} from "react";

const primary=[
 ["Dashboard","/admin"],
 ["Websites & Apps","/admin/projects"],
 ["Graphic Designs","/admin/designs"],
 ["Edit Homepage","/admin/pages/home"],
 ["About Me","/admin/about"],
 ["Work Experience","/admin/experience"],
 ["Services","/admin/services"],
 ["Messages","/admin/messages"],
 ["Media Library","/admin/media"],
 ["Site Settings","/admin/settings"],
] as const;

const advanced=[
 ["Lab / Experiments","/admin/lab"],
 ["Pricing Packages","/admin/pricing"],
 ["Now / Current Focus","/admin/now"],
 ["Skills","/admin/skills"],
 ["Technologies","/admin/technologies"],
 ["Testimonials","/admin/testimonials"],
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
  return "block rounded-lg px-3 py-2.5 text-sm transition "+(active?"bg-white/[.08] text-white":"text-white/55 hover:bg-white/[.05] hover:text-white");
 };

 const contents=<>
  <Link href="/admin" onClick={close} className="mb-6 block">
   <span className="text-sm font-bold tracking-[0.22em] text-white">WIKIS TECH</span>
   <span className="mt-1 block text-xs text-white/40">Portfolio manager</span>
  </Link>

  <div className="mb-4 rounded-xl border border-blue-400/10 bg-blue-400/[.035] p-3 text-xs leading-5 text-white/50">
   Most updates happen in just four places: <span className="text-white/80">Websites & Apps, Graphic Designs, Homepage, and Messages.</span>
  </div>

  <nav className="space-y-1" aria-label="Admin navigation">
   {primary.map(([label,href])=><Link key={href} href={href} onClick={close} className={linkClass(href)}>{label}</Link>)}
  </nav>

  <details className="mt-5 rounded-xl border border-white/[.06] bg-white/[.015] p-2">
   <summary className="cursor-pointer list-none rounded-lg px-2 py-2 text-xs font-semibold tracking-[.12em] text-white/35">MORE TOOLS</summary>
   <nav className="mt-1 space-y-1" aria-label="Advanced admin navigation">
    {advanced.map(([label,href])=><Link key={href} href={href} onClick={close} className={linkClass(href)}>{label}</Link>)}
   </nav>
  </details>

  <Link href="/" onClick={close} className="mt-auto rounded-xl border border-white/10 px-3 py-3 text-sm text-white/70 transition hover:bg-white/[.05]">View Portfolio ↗</Link>
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
