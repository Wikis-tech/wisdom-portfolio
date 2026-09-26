"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useEffect,useState} from "react";

const links=[["Work","/work"],["About","/about"],["Lab","/lab"],["Services","/services"],["Pricing","/pricing"]] as const;

export function PublicNav(){
 const pathname=usePathname();
 const [open,setOpen]=useState(false);
 useEffect(()=>setOpen(false),[pathname]);

 return <header className="sticky top-0 z-50 border-b border-white/[.06] bg-[#06070b]/88 backdrop-blur-xl">
  <nav className="mx-auto flex min-h-16 w-[min(1440px,calc(100%-32px))] items-center justify-between sm:w-[min(1440px,calc(100%-40px))]" aria-label="Primary navigation">
   <Link href="/" className="text-xs font-bold tracking-[.24em] text-white">WIKIS TECH</Link>
   <div className="hidden items-center gap-7 text-sm md:flex">
    {links.map(([label,href])=>{const active=pathname===href||pathname.startsWith(href+"/");return <Link key={href} href={href} aria-current={active?"page":undefined} className={`relative py-2 transition ${active?"text-white":"text-white/50 hover:text-white"}`}>{label}{active&&<span className="absolute inset-x-0 -bottom-0.5 h-px bg-white/70"/>}</Link>})}
   </div>
   <div className="flex items-center gap-2">
    <Link href="/contact" className="hidden rounded-full border border-white/10 bg-white/[.04] px-4 py-2 text-sm text-white/80 transition hover:bg-white/[.08] sm:inline-flex">Let&apos;s Talk ↗</Link>
    <button type="button" onClick={()=>setOpen(v=>!v)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open?"Close navigation":"Open navigation"} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[.035] md:hidden">
     <span className="sr-only">{open?"Close menu":"Open menu"}</span>
     <span aria-hidden="true" className="relative block h-3.5 w-4">
      <span className={`absolute left-0 top-0 h-px w-4 bg-white transition ${open?"translate-y-[6px] rotate-45":""}`}/>
      <span className={`absolute left-0 top-[6px] h-px w-4 bg-white transition ${open?"opacity-0":""}`}/>
      <span className={`absolute left-0 top-[12px] h-px w-4 bg-white transition ${open?"-translate-y-[6px] -rotate-45":""}`}/>
     </span>
    </button>
   </div>
  </nav>
  <div id="mobile-menu" className={`overflow-hidden border-t border-white/[.06] transition-[max-height,opacity] duration-300 md:hidden ${open?"max-h-96 opacity-100":"max-h-0 opacity-0"}`}>
   <div className="mx-auto w-[min(1440px,calc(100%-32px))] py-3">
    {links.map(([label,href])=>{const active=pathname===href||pathname.startsWith(href+"/");return <Link key={href} href={href} aria-current={active?"page":undefined} className={`flex items-center justify-between rounded-xl px-3 py-3 text-base ${active?"bg-white/[.055] text-white":"text-white/55"}`}><span>{label}</span><span className="text-white/25">↗</span></Link>})}
    <Link href="/contact" className="mt-2 flex items-center justify-between rounded-xl bg-white px-3 py-3 text-sm font-semibold text-[#06070b]"><span>Let&apos;s Work Together</span><span>↗</span></Link>
   </div>
  </div>
 </header>
}
