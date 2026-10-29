import Link from "next/link";
import {createClient} from "@/lib/supabase/server";
import {createQuickService} from "./actions";

const input="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm outline-none focus:border-[#5f78ff]/60";

export default async function ServicesAdmin({searchParams}:{searchParams:Promise<{error?:string;saved?:string;trashed?:string}>}){
 const params=await searchParams;
 const s=await createClient();
 const {data:items,error:queryError}=await s.from("services").select("id,title,short_description,enabled,featured,starting_price,currency,sort_order").is("deleted_at",null).order("sort_order");
 return <main className="mx-auto max-w-5xl">
  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
   <div><p className="text-xs font-semibold tracking-[.18em] text-[#6f8cff]">SERVICES</p><h1 className="mt-3 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">What you offer</h1><p className="mt-2 text-sm text-white/45">Keep this simple: service name, short explanation and optional starting price.</p></div>
   <Link href="/services" className="text-sm text-white/50">View public Services ↗</Link>
  </div>

  {params.error?<div className="mt-6 rounded-xl border border-red-400/20 bg-red-400/[.06] px-4 py-3 text-sm text-red-200">{params.error}</div>:null}
  {params.trashed?<div className="mt-6 rounded-xl border border-emerald-400/20 bg-emerald-400/[.06] px-4 py-3 text-sm text-emerald-200">Service moved to Trash.</div>:null}
  {queryError?<div className="mt-6 rounded-xl border border-red-400/20 bg-red-400/[.06] px-4 py-3 text-sm text-red-200">Services could not be loaded. Refresh the page or sign in again.</div>:null}

  <section className="mt-8 rounded-2xl border border-white/[.08] bg-white/[.025] p-5 sm:p-6">
   <h2 className="text-lg font-semibold">Add a service</h2>
   <form action={createQuickService} className="mt-5 grid gap-4">
    <label><span className="mb-2 block text-sm text-white/60">Service name</span><input name="title" required placeholder="e.g. Web Development" maxLength={120} className={input}/></label>
    <label><span className="mb-2 block text-sm text-white/60">Short description</span><textarea name="shortDescription" required rows={3} maxLength={500} placeholder="What do you help the client achieve?" className={input}/></label>
    <label className="max-w-sm"><span className="mb-2 block text-sm text-white/60">Starting price <span className="text-white/30">(optional, NGN)</span></span><input name="startingPrice" type="number" min="0" placeholder="70000" className={input}/></label>
    <div className="rounded-lg border border-blue-400/15 bg-blue-400/[.04] p-3 text-xs leading-5 text-white/50">The service is enabled immediately. You can edit advanced details, CTA and pricing links after creation.</div>
    <button className="w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black sm:w-fit">+ Add service</button>
   </form>
  </section>

  <section className="mt-6 overflow-hidden rounded-2xl border border-white/[.08]">
   {items?.length?items.map(x=><div key={x.id} className="flex flex-col gap-3 border-b border-white/[.06] px-5 py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between">
    <div><div className="flex flex-wrap items-center gap-2"><p className="font-medium">{x.title}</p><span className={"rounded-full border px-2 py-0.5 text-[10px] "+(x.enabled?"border-emerald-400/20 text-emerald-300":"border-white/10 text-white/35")}>{x.enabled?"Live":"Hidden"}</span>{x.featured?<span className="rounded-full border border-blue-400/20 px-2 py-0.5 text-[10px] text-blue-200">Featured</span>:null}</div><p className="mt-1 max-w-2xl text-xs leading-5 text-white/35">{x.short_description}</p>{x.starting_price!=null?<p className="mt-2 text-xs text-white/45">From {x.currency==="NGN"?"₦":x.currency+" "}{Number(x.starting_price).toLocaleString()}</p>:null}</div>
    <Link href={"/admin/services/"+x.id} className="w-fit rounded-lg border border-white/10 px-3 py-2 text-xs text-white/65">Edit</Link>
   </div>):<div className="p-10 text-center text-sm text-white/35">No services yet.</div>}
  </section>
 </main>
}
