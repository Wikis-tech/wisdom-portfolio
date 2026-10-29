import Link from "next/link";
import {notFound} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
import {ProjectImageUpload} from "@/components/admin/project-image-upload";
import {ConfirmTrashButton} from "@/components/admin/confirm-trash-button";
import {addBlock,deleteBlock,moveProjectToTrash,publishProject,updateProject} from "../actions";

const input="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none transition focus:border-[#5f78ff]/60";

export default async function ProjectEditor({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<{error?:string;saved?:string}>}){
 const {id}=await params;
 const messages=await searchParams;
 const s=await createClient();
 const [{data:p,error:projectError},{data:categories},{data:links},{data:blocks}]=await Promise.all([
  s.from("projects").select("*").eq("id",id).is("deleted_at",null).maybeSingle(),
  s.from("project_categories").select("id,name").order("sort_order"),
  s.from("project_category_links").select("category_id").eq("project_id",id),
  s.from("project_blocks").select("*").eq("project_id",id).order("sort_order")
 ]);
 if(projectError)return <main className="mx-auto max-w-4xl rounded-2xl border border-amber-300/20 bg-amber-300/[.04] p-8"><h1 className="text-2xl font-semibold">Project editor could not load</h1><p className="mt-3 text-sm text-white/55">Nothing was changed. Refresh the page or sign in again.</p></main>;
 if(!p)notFound();

 const selected=new Set((links??[]).map(x=>x.category_id));
 const mediaIds=[p.card_media_id,p.hero_media_id].filter(Boolean);
 const {data:mediaRows}=mediaIds.length?await s.from("media_library").select("id,storage_bucket,storage_path").in("id",mediaIds):{data:[]};
 const mediaUrl=(mediaId:string|null)=>{const row=mediaRows?.find(x=>x.id===mediaId);return row?s.storage.from(row.storage_bucket).getPublicUrl(row.storage_path).data.publicUrl:null};
 const cardUrl=mediaUrl(p.card_media_id);
 const heroUrl=mediaUrl(p.hero_media_id);
 const publicLive=p.visibility==="public"&&p.content_state==="published";

 return <main className="mx-auto max-w-5xl">
  <Link href="/admin/projects" className="text-sm text-white/45 hover:text-white">← Back to projects</Link>

  <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
   <div><p className="text-xs font-semibold tracking-[.18em] text-[#6f8cff]">WEBSITE / APP</p><h1 className="mt-2 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">{p.title}</h1><p className="mt-2 text-sm text-white/40">{publicLive?"Live on portfolio":p.content_state==="published"?"Published privately":"Draft"} · {p.visibility==="public"?"Public":"Private"}</p></div>
   <div className="flex flex-wrap gap-2">{publicLive?<Link href={"/work/"+p.slug} target="_blank" className="rounded-xl border border-white/10 px-4 py-2.5 text-sm">View public ↗</Link>:null}<Link href={"/admin/projects/"+id+"/preview"} className="rounded-xl border border-white/10 px-4 py-2.5 text-sm">Preview</Link></div>
  </div>

  {messages.error?<div className="mt-6 rounded-xl border border-red-400/20 bg-red-400/[.06] px-4 py-3 text-sm text-red-200">{messages.error}</div>:null}
  {messages.saved?<div className="mt-6 rounded-xl border border-emerald-400/20 bg-emerald-400/[.06] px-4 py-3 text-sm text-emerald-200">{messages.saved==="published"?"Published successfully.":"Changes saved."}</div>:null}

  <div className="mt-7 rounded-2xl border border-blue-400/15 bg-blue-400/[.04] p-4 text-sm leading-6 text-white/55">
   <strong className="text-white/80">Simple workflow:</strong> fill the basics → add a screenshot → optionally tell the project story → choose Public → click <strong className="text-white/80">Save & Publish</strong>.
  </div>

  <form id="project-editor-form" action={updateProject} className="mt-6 space-y-6">
   <input type="hidden" name="id" value={id}/>

   <section className="rounded-2xl border border-white/[.08] bg-white/[.025] p-5 sm:p-6">
    <div className="flex items-center justify-between gap-4"><div><p className="text-xs font-semibold tracking-[.15em] text-[#8196ff]">STEP 1</p><h2 className="mt-2 text-xl font-semibold">Basic information</h2></div><span className="text-xs text-white/25">Required first</span></div>
    <div className="mt-5 grid gap-4">
     <label><span className="mb-2 block text-sm text-white/60">Project name</span><input name="title" defaultValue={p.title} required maxLength={120} className={input}/></label>
     <label><span className="mb-2 block text-sm text-white/60">Short description</span><textarea name="shortDescription" defaultValue={p.short_description??""} rows={3} maxLength={500} placeholder="What did you build, and who is it for?" className={input}/></label>
     <div className="grid gap-4 md:grid-cols-2">
      <label><span className="mb-2 block text-sm text-white/60">Live website link <span className="text-white/30">(optional)</span></span><input name="liveUrl" type="url" defaultValue={p.live_url??""} placeholder="https://…" className={input}/></label>
      <label><span className="mb-2 block text-sm text-white/60">Who can see it?</span><select name="visibility" defaultValue={p.visibility} className="w-full rounded-xl border border-white/10 bg-[#11141c] px-4 py-3 text-sm"><option value="private">Private — hidden from visitors</option><option value="public">Public — show after publishing</option></select></label>
     </div>
     <label><span className="mb-2 block text-sm text-white/60">Project status</span><select name="status" defaultValue={p.status} className="w-full rounded-xl border border-white/10 bg-[#11141c] px-4 py-3 text-sm">{["live","shipped","in_development","prototype","experiment","concept","archived"].map(o=><option key={o} value={o}>{o.replaceAll("_"," ")}</option>)}</select></label>
    </div>
    <div className="mt-5"><p className="mb-2 text-sm text-white/55">Type of work <span className="text-white/28">(choose any that fit)</span></p><div className="flex flex-wrap gap-2">{categories?.map(x=><label key={x.id} className="rounded-full border border-white/10 px-3 py-2 text-xs text-white/55 transition hover:border-blue-400/25"><input name="categories" value={x.id} type="checkbox" defaultChecked={selected.has(x.id)} className="mr-2"/>{x.name}</label>)}</div></div>
   </section>

   <section className="rounded-2xl border border-[#183a7a]/45 bg-[linear-gradient(145deg,rgba(13,31,72,.22),rgba(255,255,255,.015))] p-5 sm:p-6">
    <p className="text-xs font-semibold tracking-[.15em] text-[#8196ff]">STEP 2</p><h2 className="mt-2 text-xl font-semibold">Add project images</h2><p className="mt-1 text-sm leading-6 text-white/40">Upload a clean screenshot for the Work card. The larger hero image is optional.</p>
    <div className="mt-5 grid gap-4 lg:grid-cols-2"><ProjectImageUpload projectId={id} kind="card" currentUrl={cardUrl}/><ProjectImageUpload projectId={id} kind="hero" currentUrl={heroUrl}/></div>
   </section>

   <section className="rounded-2xl border border-white/[.08] bg-white/[.025] p-5 sm:p-6">
    <div><p className="text-xs font-semibold tracking-[.15em] text-[#8196ff]">STEP 3</p><h2 className="mt-2 text-xl font-semibold">Tell the story <span className="text-sm font-normal text-white/30">(recommended)</span></h2><p className="mt-1 text-sm text-white/40">These four answers make the case study useful. Keep them simple and human.</p></div>
    <div className="mt-5 grid gap-4">
     <Case label="What problem was there?" name="problem" value={p.problem} placeholder="What was difficult, missing or inefficient before this project?"/>
     <Case label="What did you build?" name="solution" value={p.solution} placeholder="What product, website, system or experience did you create?"/>
     <Case label="Why did it matter?" name="whyItMattered" value={p.why_it_mattered} placeholder="Why was this useful to the people or business involved?"/>
     <Case label="What changed?" name="outcome" value={p.outcome} placeholder="What shipped, improved, became easier or was learned?"/>
    </div>
   </section>

   <details className="rounded-2xl border border-white/[.08] bg-white/[.02] p-5 sm:p-6">
    <summary className="cursor-pointer text-base font-semibold text-white/70">More project details <span className="text-sm font-normal text-white/30">Optional / advanced</span></summary>
    <p className="mt-2 text-xs leading-5 text-white/35">You can ignore this entire section for a normal portfolio entry.</p>
    <div className="mt-5 grid gap-4 md:grid-cols-2">
     <label><span className="mb-2 block text-sm text-white/50">Client</span><input name="client" defaultValue={p.client??""} className={input}/></label>
     <label><span className="mb-2 block text-sm text-white/50">Your role</span><input name="role" defaultValue={p.role??""} className={input}/></label>
     <label><span className="mb-2 block text-sm text-white/50">Year</span><input name="year" type="number" min="2000" max="2100" defaultValue={p.year??""} className={input}/></label>
     <label><span className="mb-2 block text-sm text-white/50">GitHub link</span><input name="githubUrl" type="url" defaultValue={p.github_url??""} className={input}/></label>
     <label><span className="mb-2 block text-sm text-white/50">Project URL slug</span><input name="slug" defaultValue={p.slug} className={input}/></label>
     <label><span className="mb-2 block text-sm text-white/50">SEO title</span><input name="seoTitle" defaultValue={p.seo_title??""} maxLength={80} className={input}/></label>
     <label className="md:col-span-2"><span className="mb-2 block text-sm text-white/50">SEO description</span><textarea name="seoDescription" defaultValue={p.seo_description??""} rows={3} maxLength={320} className={input}/></label>
     <label className="md:col-span-2"><span className="mb-2 block text-sm text-white/50">Social preview image URL</span><input name="seoImageUrl" type="url" defaultValue={p.seo_image_url??""} className={input}/></label>
    </div>
    <div className="mt-5 grid gap-3 text-sm text-white/55 sm:grid-cols-3">
     <label className="rounded-xl border border-white/[.07] p-3"><input name="featured" type="checkbox" defaultChecked={p.featured} className="mr-2"/>Prioritise on homepage</label>
     <label className="rounded-xl border border-white/[.07] p-3"><input name="confidential" type="checkbox" defaultChecked={p.confidential} className="mr-2"/>Confidential</label>
     <label className="rounded-xl border border-white/[.07] p-3"><input name="seoNoindex" type="checkbox" defaultChecked={p.seo_noindex} className="mr-2"/>Hide from search engines</label>
    </div>
   </details>

   <div className="sticky bottom-4 z-10 rounded-2xl border border-white/10 bg-[#0b0d12]/95 p-3 shadow-2xl backdrop-blur">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
     <p className="text-xs leading-5 text-white/38">{p.visibility==="private"?"Currently Private — publishing will not expose it publicly until Visibility is changed to Public.":"Public projects become visible after Save & Publish succeeds."}</p>
     <div className="flex gap-2"><button className="flex-1 rounded-xl border border-white/10 bg-white/[.04] px-5 py-3 text-sm font-medium sm:flex-none">Save draft</button><button formAction={publishProject} className="flex-1 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black sm:flex-none">Save & Publish</button></div>
    </div>
   </div>
  </form>

  <details className="mt-8 rounded-2xl border border-white/[.08] bg-white/[.02] p-5 sm:p-6">
   <summary className="cursor-pointer text-sm font-semibold text-white/55">Extra content blocks <span className="font-normal text-white/25">(rarely needed)</span></summary>
   <div className="mt-5 space-y-2">{blocks?.length?blocks.map(b=><div key={b.id} className="flex justify-between gap-4 rounded-xl border border-white/[.07] p-4"><div><p className="text-xs uppercase tracking-wider text-[#7d91ff]">{b.block_type.replaceAll("_"," ")}</p><p className="mt-2 whitespace-pre-wrap text-sm text-white/55">{(b.data as {content?:string})?.content||"—"}</p></div><form action={deleteBlock}><input type="hidden" name="blockId" value={b.id}/><input type="hidden" name="projectId" value={id}/><button className="text-xs text-red-300/70">Remove</button></form></div>):<p className="rounded-xl border border-dashed border-white/10 p-6 text-center text-sm text-white/35">No extra blocks.</p>}</div>
   <form action={addBlock} className="mt-5 grid gap-3 md:grid-cols-[180px_1fr_auto]"><input type="hidden" name="projectId" value={id}/><select name="blockType" className="rounded-xl border border-white/10 bg-[#11141c] px-4 py-3 text-sm">{["heading","paragraph","image","gallery","video","quote","stats","technology","cta"].map(o=><option key={o} value={o}>{o.replaceAll("_"," ")}</option>)}</select><textarea name="content" rows={2} placeholder="Supporting content…" className={input}/><button className="rounded-xl border border-white/10 px-4 py-3 text-sm">Add</button></form>
  </details>

  <form action={moveProjectToTrash} className="mt-8 flex justify-end"><input type="hidden" name="id" value={id}/><ConfirmTrashButton/></form>
 </main>
}

function Case({label,name,value,placeholder}:{label:string;name:string;value?:string|null;placeholder:string}){return <label><span className="mb-2 block text-sm font-medium text-white/60">{label}</span><textarea name={name} defaultValue={value??""} rows={3} maxLength={4000} placeholder={placeholder} className={input}/></label>}
