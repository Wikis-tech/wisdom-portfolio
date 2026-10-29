import Link from "next/link";
import {createClient} from "@/lib/supabase/server";
import {createQuickService} from "./actions";

const input="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm";

export default async function ServicesAdmin({searchParams}:{searchParams:Promise<{error?:string;saved?:string}>}){
 const params=await searchParams;
 const s=await createClient();
 const {data:items}=await s.from("services").select("id,title,slug,short_description,enabled,featured,sort_order").is("deleted_at",null).order("sort_order");
 return <main className="mx-auto max-w-5xl">
  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
   <div><p className="text-xs font-semibold tracking-[.18em] text-[#6f8cff]">SERVICES</p><h1 className="mt-3 text-3xl font-semibold sm:text-4xl">What you offer</h1><p className="mt-2 text-sm text-white/45">Add the service, a short explanation and an optional starting price. The technical fields are handled for you.</p></div>
   <Link href="/services" className="text-sm text-white/50">View public page ↗</Link>
  </div>

  {params.error?<div className="mt-6 rounded-xl border border-red-400/20 bg-red-400/[.06] px-4 py-3 text-sm text-red-200">{params.error}</div>:null}
  {params.saved?<div className="mt-6 rounded-xl border border-emerald-400/20 bg-emerald-400/[.06] px-4 py-3 text-sm text-emerald-200">Service added successfully.</div>:null}

  <section className="mt-8 rounded-2xl border border-white/[.08] bg-white/[.025] p-5 sm:p-6">
   <h2 className="text-lg font-semibold">Add a service</h2>
   <form action={createQuickService} className="mt-5 space-y-4">
    <label className="block text-sm text-white/70">Service name<input name="title" required maxLength={120} placeholder="e.g. Web Development" className={"mt-2 "+input}/></label>
    <label className="block text-sm text-white/70">Short description<textarea name="shortDescription" required rows={3} maxLength={500} placeholder="What do you do, and what does it help the client achieve?" className={"mt-2 "+input}/></label>
    <label className="block text-sm text-white/70">Starting price <span className="text-white/30">(optional)</span><div className="mt-2 grid grid-cols-[90px_1fr] gap-2"><input value="NGN" readOnly className={input+" text-white/40"}/><input name="startingPrice" type="number" min="0" placeholder="70000" className={input}/></div></label>
    <input type="hidden" name="currency" value="NGN"/>
    <input type="hidden" name="enabled" value="on"/>
    <button className="w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black">Add service →</button>
   </form>
  </section>

  <section className="mt-6 overflow-hidden rounded-2xl border border-white/[.08]">
   {items?.length?items.map(x=><div key={x.id} className="flex flex-col gap-3 border-b border-white/[.06] px-5 py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between">
    <div><p className="font-medium">{x.title}</p><p className="mt-1 max-w-2xl text-xs leading-5 text-white/35">{x.short_description}</p><p className="mt-2 text-[11px] uppercase tracking-[.12em] text-white/25">{x.enabled?"Visible":"Hidden"}{x.featured?" · Featured":""}</p></div>
    <Link href={"/admin/services/"+x.id} className="w-fit rounded-lg border border-white/10 px-3 py-2 text-sm text-[#9eafff]">Edit</Link>
   </div>):<div className="p-12 text-center text-sm text-white/35">No services yet.</div>}
  </section>
 </main>;
}
