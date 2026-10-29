import Link from "next/link";
import {notFound} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
import {ConfirmTrashButton} from "@/components/admin/confirm-trash-button";
import {saveService,trashService} from "../actions";

const input="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm outline-none focus:border-[#5f78ff]/60";

export default async function ServiceEditor({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<{error?:string;saved?:string}>}){
 const {id}=await params;
 const messages=await searchParams;
 const s=await createClient();
 const [{data:x},{data:packages},{data:links}]=await Promise.all([
  s.from("services").select("*").eq("id",id).is("deleted_at",null).maybeSingle(),
  s.from("pricing_packages").select("id,package_name").is("deleted_at",null).order("sort_order"),
  s.from("service_pricing_links").select("pricing_package_id").eq("service_id",id)
 ]);
 if(!x)notFound();
 const selected=new Set((links??[]).map(v=>v.pricing_package_id));

 return <main className="mx-auto max-w-4xl">
  <Link href="/admin/services" className="text-sm text-white/45 hover:text-white">← Back to Services</Link>
  <p className="mt-7 text-xs font-semibold tracking-[.18em] text-[#6f8cff]">SERVICE</p><h1 className="mt-2 text-3xl font-semibold sm:text-4xl">{x.title}</h1>
  {messages.error?<div className="mt-6 rounded-xl border border-red-400/20 bg-red-400/[.06] px-4 py-3 text-sm text-red-200">{messages.error}</div>:null}
  {messages.saved?<div className="mt-6 rounded-xl border border-emerald-400/20 bg-emerald-400/[.06] px-4 py-3 text-sm text-emerald-200">Service saved.</div>:null}

  <form action={saveService} className="mt-8 space-y-6">
   <input type="hidden" name="id" value={id}/>
   <section className="rounded-2xl border border-white/[.08] bg-white/[.025] p-5 sm:p-6">
    <h2 className="text-lg font-semibold">Basic details</h2>
    <div className="mt-5 grid gap-4">
     <label><span className="mb-2 block text-sm text-white/60">Service name</span><input name="title" defaultValue={x.title} required className={input}/></label>
     <label><span className="mb-2 block text-sm text-white/60">Short description</span><textarea name="shortDescription" defaultValue={x.short_description} rows={3} required className={input}/></label>
     <div className="grid gap-4 md:grid-cols-2">
      <label><span className="mb-2 block text-sm text-white/60">Starting price</span><input name="startingPrice" type="number" min="0" defaultValue={x.starting_price??""} className={input}/></label>
      <label className="flex items-end"><span className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/60"><input name="enabled" type="checkbox" defaultChecked={x.enabled} className="mr-2"/>Show this service publicly</span></label>
     </div>
    </div>
   </section>

   <details className="rounded-2xl border border-white/[.08] bg-white/[.02] p-5 sm:p-6">
    <summary className="cursor-pointer text-base font-semibold text-white/75">Optional description & CTA</summary>
    <div className="mt-5 grid gap-4">
     <label><span className="mb-2 block text-sm text-white/50">Full description</span><textarea name="fullDescription" defaultValue={x.full_description??""} rows={5} className={input}/></label>
     <div className="grid gap-4 md:grid-cols-2"><label><span className="mb-2 block text-sm text-white/50">Button text</span><input name="ctaLabel" defaultValue={x.cta_label||"Let's talk ↗"} className={input}/></label><label><span className="mb-2 block text-sm text-white/50">Button link</span><input name="ctaUrl" defaultValue={x.cta_url||"/contact"} className={input}/></label></div>
    </div>
   </details>

   <details className="rounded-2xl border border-white/[.08] bg-white/[.02] p-5 sm:p-6">
    <summary className="cursor-pointer text-base font-semibold text-white/75">Advanced settings</summary>
    <div className="mt-5 grid gap-4 md:grid-cols-2">
     <label><span className="mb-2 block text-sm text-white/50">URL slug</span><input name="slug" defaultValue={x.slug} className={input}/></label>
     <label><span className="mb-2 block text-sm text-white/50">Currency</span><input name="currency" defaultValue={x.currency||"NGN"} maxLength={3} className={input}/></label>
     <label><span className="mb-2 block text-sm text-white/50">Icon / symbol</span><input name="icon" defaultValue={x.icon??""} className={input}/></label>
     <label><span className="mb-2 block text-sm text-white/50">Featured image URL</span><input name="imageUrl" type="url" defaultValue={x.featured_image_url??""} className={input}/></label>
     <label><span className="mb-2 block text-sm text-white/50">Sort order</span><input name="sortOrder" type="number" defaultValue={x.sort_order??0} className={input}/></label>
     <label className="flex items-end"><span className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/60"><input name="featured" type="checkbox" defaultChecked={x.featured} className="mr-2"/>Feature this service</span></label>
    </div>
    {packages?.length?<div className="mt-5"><p className="text-sm text-white/55">Related pricing packages</p><div className="mt-3 flex flex-wrap gap-2">{packages.map(p=><label key={p.id} className="rounded-full border border-white/10 px-3 py-2 text-xs text-white/50"><input name="packageIds" value={p.id} type="checkbox" defaultChecked={selected.has(p.id)} className="mr-2"/>{p.package_name}</label>)}</div></div>:null}
   </details>

   <div className="flex justify-end"><button className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black">Save service</button></div>
  </form>

  <form action={trashService} className="mt-8 flex justify-end"><input type="hidden" name="id" value={id}/><ConfirmTrashButton/></form>
 </main>
}
