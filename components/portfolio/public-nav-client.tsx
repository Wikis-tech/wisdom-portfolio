"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useState} from "react";
import type {NavigationItem} from "@/lib/site/content";
import {ThemeToggle} from "@/components/portfolio/theme-toggle";
import {PublicCursor} from "@/components/portfolio/public-cursor";

export function PublicNavClient({items,brand,logoUrl}:{items:NavigationItem[];brand:string;logoUrl?:string|null}){
 const pathname=usePathname(); const [open,setOpen]=useState(false);
 const links=items.filter(x=>x.style==="link"); const cta=items.find(x=>x.style==="cta");
 const active=(href:string)=>!href.startsWith("http")&&(pathname===href||(href!=="/"&&pathname.startsWith(href+"/")));
 const close=()=>setOpen(false);
 return <>
  <PublicCursor/>
  <header className="legacy-nav nav-enter">
   <Link href="/" onClick={close} className="legacy-nav-brand">
    {logoUrl?<span className="legacy-nav-mark" aria-hidden style={{backgroundImage:`url("${logoUrl}")`}}/>:null}
    <span>{brand||"WIKIS TECH"}</span>
   </Link>
   <nav className="legacy-nav-links" aria-label="Primary navigation">
    {links.map(item=>item.is_external||item.href.startsWith("http")
      ?<a key={item.id} href={item.href} target="_blank" rel="noreferrer">{item.label}</a>
      :<Link key={item.id} href={item.href} aria-current={active(item.href)?"page":undefined} className={active(item.href)?"is-active":""}>{item.label}</Link>)}
   </nav>
   <div className="legacy-nav-actions">
    <ThemeToggle/>
    {cta?(cta.is_external||cta.href.startsWith("http")
      ?<a href={cta.href} target="_blank" rel="noreferrer" className="legacy-nav-cta">{cta.label}</a>
      :<Link href={cta.href} onClick={close} className="legacy-nav-cta">{cta.label}</Link>):null}
    <button type="button" data-no-loading onClick={()=>setOpen(v=>!v)} className={`legacy-hamburger ${open?"is-open":""}`} aria-expanded={open} aria-controls="mobile-menu" aria-label={open?"Close navigation":"Open navigation"}><span/><span/><span/></button>
   </div>
  </header>
  <div id="mobile-menu" className={`legacy-mobile-menu ${open?"is-open":""}`}>
   {links.map(item=>item.is_external||item.href.startsWith("http")
    ?<a key={item.id} href={item.href} target="_blank" rel="noreferrer" onClick={close}>{item.label}</a>
    :<Link key={item.id} href={item.href} onClick={close}>{item.label}</Link>)}
   {cta?<Link href={cta.href} onClick={close} className="legacy-mobile-cta">{cta.label}</Link>:null}
  </div>
 </>;
}
