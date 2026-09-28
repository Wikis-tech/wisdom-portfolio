import Link from "next/link";
import {getNavigation,getSiteSettings,getSocialLinks} from "@/lib/site/content";

export async function PublicFooter(){
 const [items,site,socials]=await Promise.all([getNavigation("footer"),getSiteSettings(),getSocialLinks()]);
 return <footer className="border-t border-white/[.07] bg-[#06070b] text-white">
  <div className="mx-auto grid w-[min(1440px,calc(100%-32px))] gap-8 py-10 sm:w-[min(1440px,calc(100%-40px))] md:grid-cols-[1fr_auto] md:items-end">
   <div><p className="text-xs font-bold tracking-[.24em]">{site.nav_brand_name}</p><p className="mt-3 max-w-xl text-sm leading-6 text-white/38">{site.tagline}</p><p className="mt-5 text-xs text-white/28">{site.availability_enabled?"● ":""}{site.availability_message}</p></div>
   <div className="space-y-5 md:text-right"><nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/48 md:justify-end" aria-label="Footer navigation">{items.map(item=>item.is_external||item.href.startsWith("http")?<a key={item.id} href={item.href} target="_blank" rel="noreferrer" data-analytics-event="external_click" className="hover:text-white">{item.label}</a>:<Link key={item.id} href={item.href} className="hover:text-white">{item.label}</Link>)}</nav>{socials.length?<div className="flex flex-wrap gap-4 text-xs text-white/38 md:justify-end">{socials.map(x=><a key={x.id} href={x.url} target="_blank" rel="noreferrer" data-analytics-event="external_click" className="hover:text-white">{x.label} ↗</a>)}</div>:null}<p className="text-xs text-white/25">{site.copyright_text||site.professional_name} · {site.footer_tagline}</p></div>
  </div>
 </footer>
}
