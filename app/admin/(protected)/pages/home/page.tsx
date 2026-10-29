import Link from "next/link";
import {createClient} from "@/lib/supabase/server";
import {saveHome} from "./actions";

const input="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm";

export default async function HomeEditor({searchParams}:{searchParams:Promise<{error?:string;saved?:string}>}){
 const params=await searchParams;
 const s=await createClient();
 const [{data:h,error:heroError},{data:sections,error:sectionError}]=await Promise.all([
  s.from("hero_settings").select("*").eq("singleton_key","default").maybeSingle(),
  s.from("page_sections").select("*").eq("page_key","home").order("sort_order")
 ]);
 if(heroError||sectionError)return <main className="mx-auto max-w-4xl rounded-2xl border border-amber-300/20 bg-amber-300/[.04] p-8"><h1 className="text-2xl font-semibold">Homepage editor is temporarily unavailable</h1><p className="mt-3 text-sm text-white/60">Your current homepage has not been changed. Refresh the page and try again.</p></main>;
 const words=Array.isArray(h?.rotating_words)?h.rotating_words.join("\n"):"";
 return <main className="mx-auto max-w-4xl">
  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-semibold tracking-[.18em] text-[#6f8cff]">HOMEPAGE</p><h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Edit the first impression</h1><p className="mt-2 text-sm text-white/45">Change the words people see first. The technical controls are tucked away below.</p></div><Link href="/" className="text-sm text-white/50">View homepage ↗</Link></div>

  {params.error?<div className="mt-6 rounded-xl border border-red-400/20 bg-red-400/[.06] px-4 py-3 text-sm text-red-200">{params.error}</div>:null}
  {params.saved?<div className="mt-6 rounded-xl border border-emerald-400/20 bg-emerald-400/[.06] px-4 py-3 text-sm text-emerald-200">Homepage updated successfully.</div>:null}

  <form action={saveHome} className="mt-8 space-y-6">
   <section className="rounded-2xl border border-white/[.08] bg-white/[.025] p-5 sm:p-6">
    <h2 className="text-xl font-semibold">Main hero content</h2>
    <div className="mt-5 space-y-4">
     <label className="block text-sm text-white/70">Small label above the headline<input name="eyebrow" defaultValue={h?.eyebrow??"SOFTWARE · DESIGN · AI · STRATEGY"} required maxLength={140} className={"mt-2 "+input}/></label>
     <label className="block text-sm text-white/70">Supporting paragraph<textarea name="supporting" defaultValue={h?.supporting_text??""} required rows={4} maxLength={600} className={"mt-2 "+input}/></label>
     <label className="block text-sm text-white/70">Rotating outcome words <span className="text-white/30">(one per line)</span><textarea name="rotatingWords" defaultValue={words||"WORK.\nCONNECT.\nCONVERT.\nSCALE.\nMOVE."} rows={5} className={"mt-2 "+input}/></label>
     <label className="block text-sm text-white/70">Portrait / hero image URL <span className="text-white/30">(optional)</span><input name="heroMediaUrl" type="url" defaultValue={h?.hero_media_url??""} placeholder="Use an image from Media Library" className={"mt-2 "+input}/></label>
    </div>
   </section>

   <section className="rounded-2xl border border-white/[.08] bg-white/[.025] p-5 sm:p-6">
    <h2 className="text-xl font-semibold">Availability</h2>
    <div className="mt-4 space-y-3"><label className="block text-sm text-white/70">Availability message<input name="availabilityMessage" defaultValue={h?.availability_message??""} maxLength={240} className={"mt-2 "+input}/></label><label className="block text-sm text-white/60"><input name="availabilityEnabled" type="checkbox" defaultChecked={h?.availability_enabled} className="mr-2"/>Show this message publicly</label></div>
   </section>

   <details className="rounded-2xl border border-white/[.08] bg-white/[.02] p-5 sm:p-6">
    <summary className="cursor-pointer text-base font-semibold text-white/75">Advanced homepage controls</summary>
    <p className="mt-2 text-xs leading-5 text-white/35">These values already have sensible defaults. Only change them when you deliberately want a different behavior.</p>
    <div className="mt-5 grid gap-4 md:grid-cols-2">
     <Field l="Legacy headline line 1" n="line1" v={h?.headline_line_1||"I BUILD WEBSITES &"}/>
     <Field l="Legacy headline line 2" n="line2" v={h?.headline_line_2||"DIGITAL PRODUCTS THAT"}/>
     <Field l="Rotation interval (ms)" n="interval" t="number" v={String(h?.rotation_interval_ms??2200)}/>
     <label className="flex items-center text-sm text-white/55"><input name="rotationEnabled" type="checkbox" defaultChecked={h?.rotation_enabled??true} className="mr-2"/>Enable rotating words</label>
     <Field l="Primary button label" n="primaryLabel" v={h?.primary_cta_label||"View My Work"}/>
     <Field l="Primary button link" n="primaryUrl" v={h?.primary_cta_url||"/work"}/>
     <Field l="Secondary button label" n="secondaryLabel" v={h?.secondary_cta_label||"Let\'s Talk"}/>
     <Field l="Secondary button link" n="secondaryUrl" v={h?.secondary_cta_url||"/contact"}/>
    </div>
    <div className="mt-6 space-y-2"><p className="text-xs font-semibold tracking-[.14em] text-white/35">HOMEPAGE SECTIONS</p>{sections?.map(x=><div key={x.id} className="grid grid-cols-[1fr_90px] items-center gap-3 rounded-xl border border-white/[.06] px-4 py-3"><input type="hidden" name="sectionId" value={x.id}/><input type="hidden" name={"order:"+x.id} value={x.sort_order}/><span className="text-sm text-white/70">{x.title}</span><label className="text-sm text-white/55"><input name={"enabled:"+x.id} type="checkbox" defaultChecked={x.enabled} className="mr-2"/>Show</label></div>)}</div>
   </details>

   <div className="sticky bottom-4 z-10 flex justify-end rounded-2xl border border-white/10 bg-[#0b0d12]/95 p-3 shadow-2xl backdrop-blur"><button className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black">Save homepage</button></div>
  </form>
 </main>;
}

function Field({l,n,v,t="text"}:{l:string;n:string;v?:string|null;t?:string}){return <label><span className="mb-2 block text-xs text-white/45">{l}</span><input name={n} type={t} defaultValue={v??""} className={input}/></label>}
