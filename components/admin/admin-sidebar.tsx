"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {useState} from "react";

const groups=[
 {label:"",items:[["Overview","/admin"]]},
 {label:"CONTENT",items:[["Home","/admin/pages/home"],["Projects","/admin/projects"],["Design Archive","/admin/designs"],["Lab","/admin/lab"],["About","/admin/about"],["Experience","/admin/experience"],["Now","/admin/now"]]},
 {label:"BUSINESS",items:[["Services","/admin/services"],["Pricing","/admin/pricing"],["Quotes","/admin/quotes"],["Messages","/admin/messages"]]},
 {label:"SITE",items:[["Skills","/admin/skills"],["Technologies","/admin/technologies"],["Testimonials","/admin/testimonials"],["Navigation","/admin/navigation"],["Media","/admin/media"],["SEO","/admin/seo"]]},
 {label:"SETTINGS",items:[["Site Settings","/admin/settings"],["Trash","/admin/trash"]]},
] as const;

export function AdminSidebar(){
 const pathname=usePathname();
 const [open,setOpen]=useState(false);
 const close=()=>setOpen(false);

 const contents=<>
  <Link href="/admin" onClick={close} className="mb-7 block">
   <span className="text-sm font-bold tracking-[0.24em] text-white">WIKIS TECH</span>
   <span className="mt-1 block text-xs text-white/40">Portfolio OS</span>
  </Link>
  <nav className="space-y-6" aria-label="Admin navigation">
   {groups.map(group=><div key={group.label||"root"}>
    {group.label&&<p className="mb-2 px-2 text-[10px] font-semibold tracking-[0.2em] text-white/30">{group.label}</p>}
    <div className="space-y-1">{group.items.map(([label,href])=>{const active=pathname===href||(href!=="/admin"&&pathname.startsWith(href+"/"));return <Link onClick={close} key={href} href={href} aria-current={active?"page":undefined} className={`block rounded-lg px-3 py-2 text-sm transition ${active?"bg-white/[.07] text-white":"text-white/55 hover:bg-white/[.05] hover:text-white"}`}>{label}</Link>})}</div>
   </div>)}
  </nav>
  <Link href="/" onClick={close} className="mt-auto rounded-xl border border-white/10 px-3 py-3 text-sm text-white/70 transition hover:bg-white/[.05]">View Portfolio ↗</Link>
 </>;

 return <>
  <div className="flex min-h-14 items-center justify-between border-b border-white/10 bg-[#080a10] px-4 lg:hidden">
   <Link href="/admin" onClick={close} className="text-xs font-bold tracking-[.22em]">WIKIS TECH</Link>
   <button type="button" onClick={()=>setOpen(true)} className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white/70" aria-label="Open admin navigation">Menu</button>
  </div>
  {open&&<button aria-label="Close admin navigation" className="fixed inset-0 z-40 bg-black/65 lg:hidden" onClick={close}/>}
  <aside className={`fixed inset-y-0 left-0 z-50 w-[min(86vw,280px)] border-r border-white/10 bg-[#080a10] transition-transform duration-300 lg:w-64 lg:translate-x-0 ${open?"translate-x-0":"-translate-x-full"}`}>
   <div className="flex h-full flex-col overflow-y-auto p-5">
    <div className="mb-4 flex justify-end lg:hidden"><button type="button" onClick={close} className="rounded-lg border border-white/10 px-3 py-2 text-xs text-white/60">Close</button></div>
    {contents}
   </div>
  </aside>
 </>;
}
