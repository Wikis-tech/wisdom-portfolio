import Link from "next/link";
import {createClient} from "@/lib/supabase/server";

export default async function ProjectsPage({searchParams}:{searchParams:Promise<{trashed?:string}>}){
 const params=await searchParams;
 const s=await createClient();
 const {data:projects,error}=await s.from("projects")
  .select("id,title,slug,status,visibility,featured,content_state,confidential,short_description,live_url,updated_at")
  .is("deleted_at",null)
  .order("updated_at",{ascending:false});

 if(error)return <main className="mx-auto max-w-5xl rounded-2xl border border-amber-300/20 bg-amber-300/[.04] p-8"><h1 className="text-2xl font-semibold">Projects could not be loaded</h1><p className="mt-3 text-sm text-white/55">Nothing was changed. Refresh the page; if the problem continues, sign out and sign back in.</p></main>;

 return <main className="mx-auto max-w-6xl">
  <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
   <div><p className="text-xs font-semibold tracking-[.18em] text-[#6f8cff]">WEBSITES & APPS</p><h1 className="mt-3 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">Your projects</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-white/45">Add a project, upload its screenshot, then publish it. Everything technical is handled behind the scenes.</p></div>
   <Link href="/admin/projects/new" className="w-fit rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black">+ Add website or app</Link>
  </div>

  {params.trashed?<div className="mt-6 rounded-xl border border-emerald-400/20 bg-emerald-400/[.06] px-4 py-3 text-sm text-emerald-100">Project moved to Trash.</div>:null}

  <div className="mt-8 grid gap-4">
   {projects?.length?projects.map(project=>{
    const publicLive=project.visibility==="public"&&project.content_state==="published";
    return <article key={project.id} className="rounded-2xl border border-white/[.08] bg-white/[.022] p-5 transition hover:border-blue-400/20 hover:bg-white/[.035]">
     <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="min-w-0">
       <div className="flex flex-wrap items-center gap-2">
        <h2 className="truncate text-lg font-semibold">{project.title}</h2>
        <span className={"rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[.1em] "+(publicLive?"bg-emerald-400/10 text-emerald-200":"bg-white/[.05] text-white/40")}>{publicLive?"Live":"Not live"}</span>
        {project.visibility==="private"?<span className="rounded-full bg-amber-300/[.08] px-2.5 py-1 text-[10px] uppercase tracking-[.1em] text-amber-100/65">Private</span>:null}
        {project.featured?<span className="rounded-full bg-blue-400/[.08] px-2.5 py-1 text-[10px] uppercase tracking-[.1em] text-blue-100/70">Homepage priority</span>:null}
       </div>
       <p className="mt-2 max-w-3xl text-sm leading-6 text-white/42">{project.short_description||"No short description yet."}</p>
       <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/28">
        <span>Status: {project.status.replaceAll("_"," ")}</span>
        <span>Last updated: {new Date(project.updated_at).toLocaleDateString()}</span>
        {project.live_url?<a href={project.live_url} target="_blank" rel="noreferrer" className="text-[#91a5ff] hover:text-white">Open website ↗</a>:null}
       </div>
      </div>
      <div className="flex shrink-0 flex-wrap gap-2">
       {publicLive?<Link href={"/work/"+project.slug} target="_blank" className="rounded-xl border border-white/10 px-3 py-2.5 text-sm text-white/65">View public ↗</Link>:null}
       <Link href={"/admin/projects/"+project.id} className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black">Edit project</Link>
      </div>
     </div>
    </article>
   }):<div className="rounded-2xl border border-dashed border-white/10 p-12 text-center"><p className="text-base font-medium text-white/65">No projects yet</p><p className="mt-2 text-sm text-white/35">Add your first website or app. It starts private until you publish it.</p><Link href="/admin/projects/new" className="mt-5 inline-block rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black">Add first project</Link></div>}
  </div>
 </main>;
}
