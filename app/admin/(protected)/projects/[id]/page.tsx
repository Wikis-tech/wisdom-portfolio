import Link from "next/link";
import {notFound} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
import {addBlock,deleteBlock,moveProjectToTrash,publishProject,updateProject,uploadProjectMedia} from "../actions";

const input="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none transition focus:border-[#5f78ff]/60";

export default async function ProjectEditor({params}:{params:Promise<{id:string}>}){
 const {id}=await params;
 const s=await createClient();
 const [{data:p},{data:c},{data:l},{data:blocks}]=await Promise.all([
  s.from("projects").select("*").eq("id",id).is("deleted_at",null).single(),
  s.from("project_categories").select("id,name").order("sort_order"),
  s.from("project_category_links").select("category_id").eq("project_id",id),
  s.from("project_blocks").select("*").eq("project_id",id).order("sort_order")
 ]);
 if(!p)notFound();
 const selected=new Set((l??[]).map(x=>x.category_id));
 const mediaIds=[p.card_media_id,p.hero_media_id].filter(Boolean);
 const {data:mediaRows}=mediaIds.length?await s.from("media_library").select("id,storage_bucket,storage_path").in("id",mediaIds):{data:[]};
 const mediaUrl=(mediaId:string|null)=>{const row=mediaRows?.find(x=>x.id===mediaId);return row?s.storage.from(row.storage_bucket).getPublicUrl(row.storage_path).data.publicUrl:null};
 const cardUrl=mediaUrl(p.card_media_id);
 const heroUrl=mediaUrl(p.hero_media_id);

 return <main className="mx-auto max-w-5xl">
  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
   <div>
    <p className="text-xs font-semibold tracking-[.18em] text-[#6f8cff]">PROJECT EDITOR</p>
    <h1 className="mt-3 text-4xl font-semibold">{p.title}</h1>
    <p className="mt-2 text-sm text-white/40">{p.content_state} · {p.status.replaceAll("_"," ")}</p>
   </div>
   <div className="flex flex-wrap gap-2">
    <Link href={`/admin/projects/${id}/preview`} className="rounded-xl border border-white/10 px-4 py-2.5 text-sm">Preview</Link>
    <button form="project-editor-form" formAction={publishProject} className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black">Save & Publish</button>
   </div>
  </div>

  <form id="project-editor-form" action={updateProject} className="mt-8 space-y-6">
   <input type="hidden" name="id" value={id}/>
   <section className="rounded-2xl border border-white/[.08] bg-white/[.02] p-6">
    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
     <div><h2 className="text-lg font-semibold">Project basics</h2><p className="mt-1 text-xs leading-5 text-white/35">Public + published = appears on Work and can appear in homepage Selected Work. Featured projects are pinned first. Private projects never appear publicly.</p></div>
     {p.content_state==="published"&&p.visibility==="public"&&<Link href={`/work/${p.slug}`} target="_blank" className="text-xs text-[#8097ff]">View public project ↗</Link>}
    </div>
    <div className="mt-5 grid gap-4 md:grid-cols-2">
     {["title","slug","client","role"].map(n=><label key={n}><span className="mb-2 block text-sm capitalize text-white/50">{n}</span><input name={n} defaultValue={p[n]??""} className={input}/></label>)}
     <label className="md:col-span-2"><span className="mb-2 block text-sm text-white/50">Short description</span><textarea name="shortDescription" defaultValue={p.short_description??""} rows={3} className={input}/></label>
     <label><span className="mb-2 block text-sm text-white/50">Year</span><input name="year" type="number" defaultValue={p.year??""} className={input}/></label>
     <label><span className="mb-2 block text-sm text-white/50">Status</span><select name="status" defaultValue={p.status} className="w-full rounded-xl border border-white/10 bg-[#11141c] px-4 py-3">{["in_development","live","shipped","prototype","experiment","concept","archived"].map(o=><option key={o} value={o}>{o.replaceAll("_"," ")}</option>)}</select></label>
     <label><span className="mb-2 block text-sm text-white/50">Visibility</span><select name="visibility" defaultValue={p.visibility} className="w-full rounded-xl border border-white/10 bg-[#11141c] px-4 py-3"><option value="public">Public — visible after publish</option><option value="private">Private — never shown publicly</option></select></label>
     <label><span className="mb-2 block text-sm text-white/50">Live URL</span><input name="liveUrl" type="url" defaultValue={p.live_url??""} className={input}/></label>
     <label><span className="mb-2 block text-sm text-white/50">GitHub URL</span><input name="githubUrl" type="url" defaultValue={p.github_url??""} className={input}/></label>
    </div>
    {p.visibility==="private"&&<div className="mt-5 rounded-xl border border-amber-300/20 bg-amber-300/[.05] px-4 py-3 text-xs leading-5 text-amber-100/70">This project is currently Private. Save & Publish will preserve it in the CMS, but it will not appear on the public website until Visibility is changed to Public.</div>}<div className="mt-5 flex flex-wrap gap-5 text-sm text-white/55">
     <label className="rounded-xl border border-white/[.08] bg-white/[.025] px-3 py-2"><input name="featured" type="checkbox" defaultChecked={p.featured} className="mr-2"/>Pin on homepage <span className="text-white/30">(Featured)</span></label>
     <label className="rounded-xl border border-white/[.08] bg-white/[.025] px-3 py-2"><input name="confidential" type="checkbox" defaultChecked={p.confidential} className="mr-2"/>Confidential</label>
    </div>
    <div className="mt-5 flex flex-wrap gap-2">{c?.map(x=><label key={x.id} className="rounded-full border border-white/10 px-3 py-2 text-sm text-white/50"><input name="categories" value={x.id} type="checkbox" defaultChecked={selected.has(x.id)} className="mr-2"/>{x.name}</label>)}</div>
   </section>

   <section className="rounded-2xl border border-[#183a7a]/45 bg-[linear-gradient(145deg,rgba(13,31,72,.22),rgba(255,255,255,.015))] p-6">
    <p className="text-xs font-semibold tracking-[.16em] text-[#7d95ff]">VISUAL PRESENTATION</p>
    <h2 className="mt-2 text-2xl font-semibold">How this work appears publicly</h2>
    <p className="mt-2 max-w-3xl text-sm leading-6 text-white/40">Upload a preview image for Work cards and an optional hero image for the case-study page. Web/software projects look best with a clean desktop or product screenshot.</p>
    <div className="mt-6 grid gap-4 lg:grid-cols-2">
     <form action={uploadProjectMedia} className="rounded-2xl border border-white/[.08] bg-black/20 p-4"><input type="hidden" name="projectId" value={id}/><input type="hidden" name="kind" value="card"/><div className="aspect-[16/10] overflow-hidden rounded-xl border border-dashed border-white/10 bg-[#081024]">{cardUrl?<div role="img" aria-label="Current project preview" className="h-full w-full bg-cover bg-center" style={{backgroundImage:`url("${cardUrl}")`}}/>:<div className="flex h-full items-center justify-center text-center"><div><p className="text-sm font-medium text-white/55">Project preview image</p><p className="mt-1 text-xs text-white/25">Shown on Work cards</p></div></div>}</div><input name="file" type="file" accept="image/png,image/jpeg,image/webp,image/avif" required className="mt-4 block w-full text-xs text-white/45 file:mr-3 file:rounded-lg file:border-0 file:bg-white file:px-3 file:py-2 file:text-xs file:font-semibold file:text-black"/><button className="mt-3 w-full rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black">Update preview image</button></form>
     <form action={uploadProjectMedia} className="rounded-2xl border border-white/[.08] bg-black/20 p-4"><input type="hidden" name="projectId" value={id}/><input type="hidden" name="kind" value="hero"/><div className="aspect-[16/10] overflow-hidden rounded-xl border border-dashed border-white/10 bg-[#081024]">{heroUrl?<div role="img" aria-label="Current project hero" className="h-full w-full bg-cover bg-center" style={{backgroundImage:`url("${heroUrl}")`}}/>:<div className="flex h-full items-center justify-center text-center"><div><p className="text-sm font-medium text-white/55">Case-study hero image</p><p className="mt-1 text-xs text-white/25">Optional large visual</p></div></div>}</div><input name="file" type="file" accept="image/png,image/jpeg,image/webp,image/avif" required className="mt-4 block w-full text-xs text-white/45 file:mr-3 file:rounded-lg file:border-0 file:bg-white file:px-3 file:py-2 file:text-xs file:font-semibold file:text-black"/><button className="mt-3 w-full rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium">Update hero image</button></form>
    </div>
   </section>

   <section className="rounded-2xl border border-[#536dfe]/20 bg-[#536dfe]/[.035] p-6">
    <p className="text-xs font-semibold tracking-[.16em] text-[#8097ff]">PROBLEM-FIRST CASE STUDY</p>
    <h2 className="mt-2 text-2xl font-semibold">Make the value obvious.</h2>
    <p className="mt-2 max-w-3xl text-sm leading-6 text-white/40">Every public project must answer these four questions before it can be published. Write for the person viewing the work, not for the technology stack.</p>
    <div className="mt-6 grid gap-4">
     <Case label="Here is the problem." name="problem" value={p.problem} placeholder="What frustration, inefficiency, risk or opportunity existed before this project?"/>
     <Case label="Here is what I built." name="solution" value={p.solution} placeholder="What did you design or build, and how does it solve the problem?"/>
     <Case label="Here is why it mattered." name="whyItMattered" value={p.why_it_mattered} placeholder="Why was solving this useful to the audience, business, user or workflow?"/>
     <Case label="Here is what changed." name="outcome" value={p.outcome} placeholder="What improved, became possible, was validated, shipped or learned? Use measurable evidence when you have it."/>
    </div>
   </section>

   <section className="rounded-2xl border border-white/[.08] bg-white/[.02] p-6">
    <p className="text-xs font-semibold tracking-[.16em] text-[#8097ff]">SEO / SHARING</p>
    <h2 className="mt-2 text-2xl font-semibold">Project metadata</h2>
    <p className="mt-2 text-sm leading-6 text-white/40">Optional overrides. Leave blank to use the project title and short description.</p>
    <div className="mt-5 grid gap-4 md:grid-cols-2">
     <label><span className="mb-2 block text-sm text-white/50">SEO title</span><input name="seoTitle" defaultValue={p.seo_title??""} maxLength={80} className={input}/></label>
     <label><span className="mb-2 block text-sm text-white/50">Social preview image URL</span><input name="seoImageUrl" type="url" defaultValue={p.seo_image_url??""} placeholder="https://…" className={input}/></label>
     <label className="md:col-span-2"><span className="mb-2 block text-sm text-white/50">SEO description</span><textarea name="seoDescription" defaultValue={p.seo_description??""} rows={3} maxLength={320} className={input}/></label>
     <label className="md:col-span-2 text-sm text-white/50"><input name="seoNoindex" type="checkbox" defaultChecked={p.seo_noindex} className="mr-2"/>Keep this project out of search engines</label>
    </div>
   </section>

   <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
    <button className="rounded-xl border border-white/10 bg-white/[.04] px-5 py-3 text-sm font-medium">Save draft</button>
    <button formAction={publishProject} className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black">Save & Publish</button>
   </div>
  </form>

  <section className="mt-8 rounded-2xl border border-white/[.08] bg-white/[.02] p-6">
   <p className="text-xs font-semibold tracking-[.16em] text-white/30">ADDITIONAL STORY</p><h2 className="mt-2 text-xl font-semibold">Supporting content blocks</h2><p className="mt-2 text-sm text-white/35">Use these for screenshots, implementation details, process notes, technology and supporting evidence after the four core questions.</p>
   <div className="mt-5 space-y-2">{blocks?.length?blocks.map(b=><div key={b.id} className="flex justify-between gap-4 rounded-xl border border-white/[.07] p-4"><div><p className="text-xs uppercase tracking-wider text-[#7d91ff]">{b.block_type.replaceAll("_"," ")}</p><p className="mt-2 whitespace-pre-wrap text-sm text-white/55">{(b.data as {content?:string})?.content||"—"}</p></div><form action={deleteBlock}><input type="hidden" name="blockId" value={b.id}/><input type="hidden" name="projectId" value={id}/><button className="text-xs text-red-300/70">Remove</button></form></div>):<p className="rounded-xl border border-dashed border-white/10 p-8 text-center text-sm text-white/35">No supporting blocks yet.</p>}</div>
   <form action={addBlock} className="mt-6 grid gap-3 md:grid-cols-[220px_1fr_auto]"><input type="hidden" name="projectId" value={id}/><select name="blockType" className="rounded-xl border border-white/10 bg-[#11141c] px-4 py-3">{["heading","paragraph","image","gallery","video","quote","stats","two_column","full_width_image","technology","before_after","embed","spacer","cta"].map(o=><option key={o} value={o}>{o.replaceAll("_"," ")}</option>)}</select><textarea name="content" rows={2} placeholder="Supporting content…" className={input}/><button className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black">Add block</button></form>
  </section>
  <form action={moveProjectToTrash} className="mt-8 flex justify-end"><input type="hidden" name="id" value={id}/><button className="text-sm text-red-300/70">Move to Trash</button></form>
 </main>
}

function Case({label,name,value,placeholder}:{label:string;name:string;value?:string|null;placeholder:string}){return <label><span className="mb-2 block text-sm font-medium text-white/70">{label}</span><textarea name={name} defaultValue={value??""} rows={4} maxLength={4000} placeholder={placeholder} className={input}/></label>}
