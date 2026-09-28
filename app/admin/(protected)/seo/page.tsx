import {createClient} from "@/lib/supabase/server";
import {saveSeo} from "./actions";

const input="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm outline-none focus:border-[#5f78ff]/60";

export default async function SeoPage(){
 const s=await createClient();
 const {data:items}=await s.from("seo_settings").select("*").order("route_path");
 return <main className="mx-auto max-w-6xl">
  <p className="text-xs font-semibold tracking-[.18em] text-[#6f8cff]">SITE / SEO</p>
  <h1 className="mt-3 text-4xl font-semibold">Search & share metadata</h1>
  <p className="mt-2 max-w-3xl text-sm leading-6 text-white/40">Edit titles, descriptions, canonical overrides and social preview images. Project and Lab detail metadata is managed on those records.</p>
  <div className="mt-8 space-y-4">{items?.map(x=><form action={saveSeo} key={x.id} className="rounded-2xl border border-white/[.08] bg-white/[.02] p-5 sm:p-6">
   <input type="hidden" name="id" value={x.id}/>
   <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-[#8097ff]">{x.page_key}</p><p className="mt-1 text-sm text-white/35">{x.route_path}</p></div><label className="text-sm text-white/50"><input name="noindex" type="checkbox" defaultChecked={x.noindex} className="mr-2"/>No index</label></div>
   <div className="mt-5 grid gap-3">
    <label><span className="mb-2 block text-xs text-white/40">SEO title</span><input name="title" defaultValue={x.title} maxLength={80} className={input}/></label>
    <label><span className="mb-2 block text-xs text-white/40">Description</span><textarea name="description" defaultValue={x.description} rows={3} maxLength={320} className={input}/></label>
    <div className="grid gap-3 md:grid-cols-2">
     <label><span className="mb-2 block text-xs text-white/40">Open Graph image URL</span><input name="ogImage" type="url" defaultValue={x.og_image_url??""} placeholder="https://…" className={input}/></label>
     <label><span className="mb-2 block text-xs text-white/40">Canonical override</span><input name="canonical" type="url" defaultValue={x.canonical_url??""} placeholder="Leave blank to use Site URL + route" className={input}/></label>
    </div>
   </div>
   <div className="mt-5 flex justify-end"><button className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black">Save SEO</button></div>
  </form>)}</div>
 </main>
}
