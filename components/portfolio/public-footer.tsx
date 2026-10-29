import Link from "next/link";
import {getNavigation,getSiteSettings,getSocialLinks} from "@/lib/site/content";

export async function PublicFooter(){
 const [items,site,socials]=await Promise.all([getNavigation("footer"),getSiteSettings(),getSocialLinks()]);
 return <footer className="legacy-footer public-footer">
  <div>
   <p className="legacy-footer-logo">{site.professional_name}</p>
   <p className="legacy-footer-tagline">{site.tagline}</p>
  </div>
  <nav className="legacy-footer-links" aria-label="Footer navigation">
   {items.map(item=>item.is_external||item.href.startsWith("http")?<a key={item.id} href={item.href} target="_blank" rel="noreferrer">{item.label}</a>:<Link key={item.id} href={item.href}>{item.label}</Link>)}
   {socials.map(x=><a key={x.id} href={x.url} target="_blank" rel="noreferrer">{x.label}</a>)}
  </nav>
  <p className="legacy-footer-copy">{site.copyright_text||`© ${new Date().getFullYear()} ${site.professional_name}`} · {site.footer_tagline}</p>
 </footer>
}
