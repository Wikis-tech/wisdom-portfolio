import Link from "next/link";
import {createQuickProject} from "../actions";

export default async function NewProjectPage({searchParams}:{searchParams:Promise<{error?:string}>}){
 const {error}=await searchParams;
 const input="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-[#5f78ff]/60";
 return <main className="mx-auto max-w-2xl">
  <Link href="/admin/projects" className="text-sm text-white/50 hover:text-white">← Back to Websites & Apps</Link>
  <p className="mt-8 text-xs font-semibold uppercase tracking-[.18em] text-[#8196ff]">WEBSITES & APPS</p>
  <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Add a website or app</h1>
  <p className="mt-3 text-sm leading-6 text-white/50">Start with the essentials. Screenshot, visibility and publishing come next.</p>
  {error?<div className="mt-6 rounded-xl border border-red-400/20 bg-red-400/[.06] px-4 py-3 text-sm text-red-200">{error}</div>:null}
  <form action={createQuickProject} className="mt-8 space-y-5 rounded-2xl border border-white/10 bg-white/[.025] p-5 sm:p-8">
   <label className="block text-sm font-medium">Project name <span className="text-rose-300">*</span><input required name="title" maxLength={120} placeholder="e.g. Campus Link" className={input}/></label>
   <label className="block text-sm font-medium">Website link <span className="text-white/35">(optional)</span><input name="liveUrl" type="url" placeholder="https://example.com" className={input}/></label>
   <label className="block text-sm font-medium">Short description <span className="text-white/35">(optional)</span><textarea name="shortDescription" rows={3} maxLength={500} placeholder="What did you build, and who is it for?" className={input}/></label>
   <div className="rounded-lg border border-blue-400/15 bg-blue-400/[.04] p-3 text-xs leading-5 text-white/55">The project starts Private so nothing incomplete can appear publicly by accident.</div>
   <button className="w-full rounded-xl bg-white px-5 py-3 font-semibold text-black hover:bg-blue-100">Create draft & continue →</button>
  </form>
 </main>;
}
