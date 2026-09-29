import {createClient} from "@/lib/supabase/server";
import {createSocial,deleteSocial,saveAnalytics,saveSiteSettings,saveSocial} from "./actions";
const input="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm outline-none focus:border-[#5f78ff]/60";
export default async function SettingsPage(){
 const s=await createClient();
 const [{data:site},{data:socials},{data:analytics}]=await Promise.all([
  s.from("site_settings").select("*").eq("singleton_key","default").single(),
  s.from("social_links").select("*").order("sort_order"),
  s.from("analytics_settings").select("*").eq("singleton_key","default").single(),
 ]);
 return <main className="mx-auto max-w-6xl">
  <p className="text-xs font-semibold tracking-[.18em] text-[#6f8cff]">SETTINGS / SITE</p><h1 className="mt-3 text-4xl font-semibold">Global site settings</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-white/40">Identity, contact details, site URLs, footer content, social profiles and analytics readiness. No secret keys belong here.</p>
  <form action={saveSiteSettings} className="mt-8 rounded-2xl border border-white/[.08] bg-white/[.02] p-5 sm:p-6">
   <h2 className="text-lg font-semibold">Identity & global defaults</h2>
   <div className="mt-5 grid gap-4 md:grid-cols-2">
    <F label="Professional name"><input name="professionalName" defaultValue={site?.professional_name??""} required className={input}/></F>
    <F label="Brand name"><input name="brandName" defaultValue={site?.brand_name??""} required className={input}/></F>
    <F label="Navigation brand"><input name="navBrandName" defaultValue={site?.nav_brand_name??"WIKIS TECH"} required className={input}/></F>
    <F label="Location"><input name="location" defaultValue={site?.location??""} className={input}/></F>
    <F label="Site URL"><input name="siteUrl" type="url" defaultValue={site?.site_url??"https://wisdom-portfolio-five.vercel.app"} required className={input}/></F>
    <F label="Contact email"><input name="contactEmail" type="email" defaultValue={site?.contact_email??""} className={input}/></F>
    <F label="WhatsApp / phone"><input name="whatsapp" defaultValue={site?.whatsapp??""} className={input}/></F>
    <F label="Résumé URL"><input name="resumeUrl" type="url" defaultValue={site?.resume_url??""} placeholder="https://…" className={input}/></F>
    <F label="Logo URL"><input name="logoUrl" type="url" defaultValue={site?.logo_url??""} placeholder="https://…" className={input}/></F>
    <F label="Favicon URL"><input name="faviconUrl" type="url" defaultValue={site?.favicon_url??""} placeholder="https://…" className={input}/></F>
    <F label="Default CTA label"><input name="defaultCtaLabel" defaultValue={site?.default_cta_label??"Let's Work Together"} className={input}/></F>
    <F label="Default CTA URL"><input name="defaultCtaUrl" defaultValue={site?.default_cta_url??"/contact"} className={input}/></F>
    <F label="Tagline" wide><textarea name="tagline" defaultValue={site?.tagline??""} rows={3} className={input}/></F>
    <F label="Availability message" wide><textarea name="availabilityMessage" defaultValue={site?.availability_message??""} rows={2} className={input}/></F>
    <F label="Footer tagline"><input name="footerTagline" defaultValue={site?.footer_tagline??"CODE × DESIGN × AI × STRATEGY"} className={input}/></F>
    <F label="Copyright text"><input name="copyrightText" defaultValue={site?.copyright_text??""} className={input}/></F>
   </div>
   <label className="mt-5 block text-sm text-white/55"><input name="availabilityEnabled" type="checkbox" defaultChecked={site?.availability_enabled} className="mr-2"/>Show availability status publicly</label>
   <div className="mt-5 flex justify-end"><button className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black">Save site settings</button></div>
  </form>

  <section className="mt-6 rounded-2xl border border-white/[.08] bg-white/[.02] p-5 sm:p-6"><h2 className="text-lg font-semibold">Social profiles</h2>
   <form action={createSocial} className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-[.7fr_1fr_1.5fr_1fr_100px_auto]"><input name="platform" placeholder="github" required className={input}/><input name="label" placeholder="GitHub" required className={input}/><input name="url" type="url" placeholder="https://…" required className={input}/><input name="username" placeholder="@username" className={input}/><input name="sortOrder" type="number" defaultValue={0} className={input}/><button className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black">Add</button><label className="text-sm text-white/50"><input name="enabled" type="checkbox" defaultChecked className="mr-2"/>Enabled</label></form>
   <div className="mt-5 space-y-3">{socials?.map(x=><form action={saveSocial} key={x.id} className="rounded-xl border border-white/[.07] p-4"><input type="hidden" name="id" value={x.id}/><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[.7fr_1fr_1.5fr_1fr_100px_auto]"><input name="platform" defaultValue={x.platform} className={input}/><input name="label" defaultValue={x.label} className={input}/><input name="url" type="url" defaultValue={x.url} className={input}/><input name="username" defaultValue={x.username??""} className={input}/><input name="sortOrder" type="number" defaultValue={x.sort_order} className={input}/><button className="rounded-xl border border-white/10 px-4 py-2.5 text-sm">Save</button></div><div className="mt-3 flex items-center justify-between"><label className="text-sm text-white/50"><input name="enabled" type="checkbox" defaultChecked={x.enabled} className="mr-2"/>Enabled</label><button formAction={deleteSocial} className="text-xs text-red-300/70">Delete</button></div></form>)}</div>
  </section>

  <form action={saveAnalytics} className="mt-6 rounded-2xl border border-white/[.08] bg-white/[.02] p-5 sm:p-6"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-lg font-semibold">Analytics readiness</h2><p className="mt-2 text-sm text-white/40">{analytics?.enabled?"Connected configuration is enabled.":"Not connected — no analytics script is loaded publicly."}</p></div><span className={`rounded-full border px-3 py-1 text-xs ${analytics?.enabled?"border-emerald-400/20 text-emerald-300":"border-white/10 text-white/35"}`}>{analytics?.enabled?"Enabled":"Not connected"}</span></div><div className="mt-5 grid gap-4 md:grid-cols-2"><F label="Provider"><select name="provider" defaultValue={analytics?.provider??"none"} className={input}><option value="none">None</option><option value="google_analytics">Google Analytics 4</option></select></F><F label="Measurement ID"><input name="measurementId" defaultValue={analytics?.measurement_id??""} placeholder="G-XXXXXXXXXX" className={input}/></F></div><div className="mt-5 flex flex-wrap gap-5 text-sm text-white/50"><label><input name="enabled" type="checkbox" defaultChecked={analytics?.enabled} className="mr-2"/>Enable analytics</label><label><input name="externalClicks" type="checkbox" defaultChecked={analytics?.external_click_tracking??true} className="mr-2"/>External click events</label><label><input name="conversions" type="checkbox" defaultChecked={analytics?.conversion_tracking??true} className="mr-2"/>CTA conversion events</label></div><div className="mt-5 flex justify-end"><button className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black">Save analytics</button></div></form>
 </main>
}
function F({label,children,wide=false}:{label:string;children:React.ReactNode;wide?:boolean}){return <label className={wide?"md:col-span-2":""}><span className="mb-2 block text-xs text-white/40">{label}</span>{children}</label>}
