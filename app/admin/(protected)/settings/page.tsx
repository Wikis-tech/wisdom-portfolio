import {createClient} from "@/lib/supabase/server";
import {BrandAssetUpload} from "@/components/admin/brand-asset-upload";
import {createSocial,deleteSocial,saveAnalytics,saveSiteSettings,saveSocial} from "./actions";

const input="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm outline-none transition focus:border-[#5f78ff]/60";

export default async function SettingsPage({searchParams}:{searchParams:Promise<{error?:string;saved?:string}>}){
 const params=await searchParams;
 const s=await createClient();
 const [{data:site},{data:socials},{data:analytics}]=await Promise.all([
  s.from("site_settings").select("*").eq("singleton_key","default").maybeSingle(),
  s.from("social_links").select("*").order("sort_order"),
  s.from("analytics_settings").select("*").eq("singleton_key","default").maybeSingle(),
 ]);

 return <main className="mx-auto max-w-5xl">
  <p className="text-xs font-semibold tracking-[.18em] text-[#6f8cff]">SITE SETTINGS</p>
  <h1 className="mt-3 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">Your website details</h1>
  <p className="mt-2 max-w-2xl text-sm leading-6 text-white/45">The important settings are first. Advanced technical options are still available, but they no longer get in your way.</p>

  {params.error?<div className="mt-6 rounded-xl border border-red-400/20 bg-red-400/[.06] px-4 py-3 text-sm text-red-200">{params.error}</div>:null}
  {params.saved?<div className="mt-6 rounded-xl border border-emerald-400/20 bg-emerald-400/[.06] px-4 py-3 text-sm text-emerald-200">Changes saved successfully.</div>:null}

  <section className="mt-8 rounded-2xl border border-white/[.08] bg-white/[.025] p-5 sm:p-6">
   <div><p className="text-xs font-semibold tracking-[.16em] text-[#8097ff]">BRAND</p><h2 className="mt-2 text-xl font-semibold">Logo & favicon</h2><p className="mt-2 text-sm leading-6 text-white/40">Upload directly from your computer. No image URL is required.</p></div>
   <div className="mt-5 grid gap-4 md:grid-cols-2">
    <BrandAssetUpload kind="logo" currentUrl={site?.logo_url}/>
    <BrandAssetUpload kind="favicon" currentUrl={site?.favicon_url}/>
   </div>
  </section>

  <form action={saveSiteSettings} className="mt-6 rounded-2xl border border-white/[.08] bg-white/[.025] p-5 sm:p-6">
   <h2 className="text-xl font-semibold">Basic information</h2>
   <p className="mt-1 text-sm text-white/40">These are the details you are most likely to change.</p>
   <div className="mt-5 grid gap-4 md:grid-cols-2">
    <Field label="Your name"><input name="professionalName" defaultValue={site?.professional_name??"Okoh Wisdom Uchechukwu"} required className={input}/></Field>
    <Field label="Public email"><input name="contactEmail" type="email" defaultValue={site?.contact_email??""} className={input}/></Field>
    <Field label="Location"><input name="location" defaultValue={site?.location??"Lagos, Nigeria"} className={input}/></Field>
    <Field label="WhatsApp / phone"><input name="whatsapp" defaultValue={site?.whatsapp??""} placeholder="Optional" className={input}/></Field>
    <Field label="Main tagline" wide><textarea name="tagline" defaultValue={site?.tagline??""} rows={3} maxLength={220} className={input}/></Field>
    <Field label="Availability message" wide><textarea name="availabilityMessage" defaultValue={site?.availability_message??""} rows={2} maxLength={220} className={input}/></Field>
   </div>
   <label className="mt-5 block text-sm text-white/60"><input name="availabilityEnabled" type="checkbox" defaultChecked={site?.availability_enabled} className="mr-2"/>Show that I am available for work</label>

   <details className="mt-6 rounded-xl border border-white/[.08] bg-black/15 p-4">
    <summary className="cursor-pointer text-sm font-semibold text-white/70">Advanced site settings</summary>
    <p className="mt-2 text-xs leading-5 text-white/35">You normally do not need to touch these. They control branding, links, footer copy and URL defaults.</p>
    <div className="mt-4 grid gap-4 md:grid-cols-2">
     <Field label="Brand name"><input name="brandName" defaultValue={site?.brand_name??"Wikis Tech Corporation"} required className={input}/></Field>
     <Field label="Navigation brand"><input name="navBrandName" defaultValue={site?.nav_brand_name??"WIKIS TECH"} required className={input}/></Field>
     <Field label="Site URL"><input name="siteUrl" type="url" defaultValue={site?.site_url??"https://wisdom-portfolio-five.vercel.app"} required className={input}/></Field>
     <Field label="Résumé / CV URL"><input name="resumeUrl" type="url" defaultValue={site?.resume_url??""} placeholder="https://…" className={input}/></Field>
     <Field label="Default button text"><input name="defaultCtaLabel" defaultValue={site?.default_cta_label??"Let's Work Together"} className={input}/></Field>
     <Field label="Default button link"><input name="defaultCtaUrl" defaultValue={site?.default_cta_url??"/contact"} className={input}/></Field>
     <Field label="Footer tagline"><input name="footerTagline" defaultValue={site?.footer_tagline??"CODE × DESIGN × AI × STRATEGY"} className={input}/></Field>
     <Field label="Copyright text"><input name="copyrightText" defaultValue={site?.copyright_text??""} className={input}/></Field>
     <input type="hidden" name="logoUrl" value={site?.logo_url??""}/>
     <input type="hidden" name="faviconUrl" value={site?.favicon_url??""}/>
    </div>
   </details>

   <div className="mt-6 flex justify-end"><button className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black">Save website details</button></div>
  </form>

  <details className="mt-6 rounded-2xl border border-white/[.08] bg-white/[.02] p-5 sm:p-6">
   <summary className="cursor-pointer text-lg font-semibold">Social profiles <span className="ml-2 text-sm font-normal text-white/35">Optional</span></summary>
   <form action={createSocial} className="mt-5 grid gap-3 md:grid-cols-2">
    <input name="platform" placeholder="Platform, e.g. github" required className={input}/>
    <input name="label" placeholder="Label, e.g. GitHub" required className={input}/>
    <input name="url" type="url" placeholder="https://…" required className={input+" md:col-span-2"}/>
    <input name="username" placeholder="@username (optional)" className={input}/>
    <input type="hidden" name="sortOrder" value="0"/>
    <label className="flex items-center text-sm text-white/50"><input name="enabled" type="checkbox" defaultChecked className="mr-2"/>Show publicly</label>
    <button className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black">Add social link</button>
   </form>
   <div className="mt-5 space-y-3">{socials?.map(x=><form action={saveSocial} key={x.id} className="rounded-xl border border-white/[.07] p-4">
    <input type="hidden" name="id" value={x.id}/><input type="hidden" name="sortOrder" value={x.sort_order}/>
    <div className="grid gap-3 md:grid-cols-2"><input name="platform" defaultValue={x.platform} className={input}/><input name="label" defaultValue={x.label} className={input}/><input name="url" type="url" defaultValue={x.url} className={input+" md:col-span-2"}/><input name="username" defaultValue={x.username??""} className={input}/><label className="flex items-center text-sm text-white/50"><input name="enabled" type="checkbox" defaultChecked={x.enabled} className="mr-2"/>Show publicly</label></div>
    <div className="mt-3 flex justify-between"><button formAction={deleteSocial} className="text-xs text-red-300/70">Delete</button><button className="rounded-lg border border-white/10 px-3 py-2 text-xs">Save</button></div>
   </form>)}</div>
  </details>

  <details className="mt-6 rounded-2xl border border-white/[.08] bg-white/[.02] p-5 sm:p-6">
   <summary className="cursor-pointer text-lg font-semibold">Analytics <span className="ml-2 text-sm font-normal text-white/35">Advanced</span></summary>
   <form action={saveAnalytics} className="mt-5">
    <div className="grid gap-4 md:grid-cols-2"><Field label="Provider"><select name="provider" defaultValue={analytics?.provider??"none"} className={input}><option value="none">None</option><option value="google_analytics">Google Analytics 4</option></select></Field><Field label="Measurement ID"><input name="measurementId" defaultValue={analytics?.measurement_id??""} placeholder="G-XXXXXXXXXX" className={input}/></Field></div>
    <div className="mt-4 flex flex-wrap gap-5 text-sm text-white/50"><label><input name="enabled" type="checkbox" defaultChecked={analytics?.enabled} className="mr-2"/>Enable analytics</label><label><input name="externalClicks" type="checkbox" defaultChecked={analytics?.external_click_tracking??true} className="mr-2"/>Track external clicks</label><label><input name="conversions" type="checkbox" defaultChecked={analytics?.conversion_tracking??true} className="mr-2"/>Track CTA conversions</label></div>
    <div className="mt-5 flex justify-end"><button className="rounded-xl border border-white/10 px-4 py-2.5 text-sm">Save analytics</button></div>
   </form>
  </details>
 </main>
}

function Field({label,children,wide=false}:{label:string;children:React.ReactNode;wide?:boolean}){return <label className={wide?"md:col-span-2":""}><span className="mb-2 block text-xs text-white/45">{label}</span>{children}</label>}
