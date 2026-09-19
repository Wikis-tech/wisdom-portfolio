"use client";

import {FormEvent,useState} from "react";

type State={kind:"idle"|"sending"|"success"|"error";message:string};

const projectTypes=[
 ["website","Website"],["web_application","Web Application"],["ui_ux","UI/UX"],["brand_graphics","Brand / Graphics"],["ai_solution","AI Solution"],["business_technology","Business Technology"],["other","Something Else"]
];
const budgets=[
 ["","Select a range (optional)"],["under_100k","Under ₦100k"],["100k_300k","₦100k–₦300k"],["300k_750k","₦300k–₦750k"],["750k_plus","₦750k+"],["discuss","Let's discuss"]
];

export function QuoteForm(){
 const [state,setState]=useState<State>({kind:"idle",message:""});
 async function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault();const form=e.currentTarget;setState({kind:"sending",message:"Submitting…"});
  const body=new FormData(form);body.set("kind","quote");
  try{
   const base=process.env.NEXT_PUBLIC_SUPABASE_URL;
   if(!base) throw new Error("Quote service is unavailable.");
   const res=await fetch(`${base}/functions/v1/portfolio-lead-submit`,{method:"POST",body});
   const data=await res.json().catch(()=>({}));
   if(!res.ok||!data.ok) throw new Error(data.message||"Could not submit your request.");
   form.reset();setState({kind:"success",message:data.message||"Quote request received."});
  }catch(error){setState({kind:"error",message:error instanceof Error?error.message:"Could not submit your request."})}
 }
 const input="w-full rounded-2xl border border-white/10 bg-white/[.025] px-4 py-3 text-white outline-none transition focus:border-[#5f78ff]/60";
 return <form onSubmit={submit} className="space-y-5" noValidate>
  <input name="companyWebsite" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[10000px] h-px w-px opacity-0"/>
  <div className="grid gap-4 sm:grid-cols-2">
   <L text="Name"><input name="name" required maxLength={120} autoComplete="name" className={input}/></L>
   <L text="Email"><input name="email" type="email" required maxLength={254} autoComplete="email" className={input}/></L>
   <L text="Phone / WhatsApp"><input name="phone" maxLength={40} autoComplete="tel" className={input}/></L>
   <L text="What are we building?"><select name="projectType" required className={input}><option value="">Choose one</option>{projectTypes.map(([v,l])=><option value={v} key={v}>{l}</option>)}</select></L>
  </div>
  <L text="Tell me about the project"><textarea name="description" required minLength={20} maxLength={8000} rows={7} className={input} placeholder="The problem, audience, what already exists, and what a successful result should look like."/></L>
  <div className="grid gap-4 sm:grid-cols-2">
   <L text="Budget"><select name="budget" className={input}>{budgets.map(([v,l])=><option value={v} key={v}>{l}</option>)}</select></L>
   <L text="Timeline"><input name="timeline" maxLength={180} placeholder="e.g. 4–6 weeks, flexible, before November" className={input}/></L>
   <L text="Preferred contact method"><select name="contactMethod" defaultValue="email" className={input}><option value="email">Email</option><option value="whatsapp">WhatsApp</option><option value="phone">Phone</option></select></L>
   <L text="Upload brief (optional)"><input name="brief" type="file" accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp" className={`${input} file:mr-3 file:rounded-full file:border-0 file:bg-white file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-black`}/><span className="mt-2 block text-xs text-white/30">PDF/JPG/PNG/WebP · max 10 MB.</span></L>
  </div>
  <div className="flex flex-wrap items-center gap-4"><button disabled={state.kind==="sending"} className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50">{state.kind==="sending"?"Submitting…":"Request a quote ↗"}</button><p aria-live="polite" className={`text-sm ${state.kind==="error"?"text-red-300":state.kind==="success"?"text-emerald-300":"text-white/35"}`}>{state.message}</p></div>
 </form>
}
function L({text,children}:{text:string;children:React.ReactNode}){return <label className="block"><span className="mb-2 block text-sm text-white/55">{text}</span>{children}</label>}
