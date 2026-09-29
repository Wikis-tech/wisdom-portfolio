"use client";

import {FormEvent,useState} from "react";

type State={kind:"idle"|"sending"|"success"|"error";message:string};

export function ContactForm(){
 const [state,setState]=useState<State>({kind:"idle",message:""});
 async function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault();const form=e.currentTarget;setState({kind:"sending",message:"Sending…"});
  const body=new FormData(form);body.set("kind","contact");
  try{
   const base=process.env.NEXT_PUBLIC_SUPABASE_URL;
   if(!base) throw new Error("Contact service is unavailable.");
   const res=await fetch(`${base}/functions/v1/portfolio-lead-submit`,{method:"POST",body});
   const data=await res.json().catch(()=>({}));
   if(!res.ok||!data.ok) throw new Error(data.message||"Could not send your message.");
   form.reset();setState({kind:"success",message:data.message||"Message sent."});
  }catch(error){setState({kind:"error",message:error instanceof Error?error.message:"Could not send your message."})}
 }
 return <form onSubmit={submit} className="space-y-4" noValidate>
  <input name="companyWebsite" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[10000px] h-px w-px opacity-0"/>
  <div className="grid gap-4 sm:grid-cols-2">
   <Field label="Name" name="name" autoComplete="name" required maxLength={120}/>
   <Field label="Email" name="email" type="email" autoComplete="email" required maxLength={254}/>
  </div>
  <Field label="Subject" name="subject" required maxLength={180}/>
  <label className="block"><span className="mb-2 block text-sm text-white/55">Message</span><textarea name="message" required minLength={10} maxLength={5000} rows={7} className="w-full rounded-2xl border border-white/10 bg-white/[.025] px-4 py-3 text-white outline-none transition placeholder:text-white/20 focus:border-[#5f78ff]/60" placeholder="What are you trying to make, fix or explore?"/></label>
  <div className="flex flex-wrap items-center gap-4"><button disabled={state.kind==="sending"} className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50">{state.kind==="sending"?"Sending…":"Send message ↗"}</button><p aria-live="polite" className={`text-sm ${state.kind==="error"?"text-red-300":state.kind==="success"?"text-emerald-300":"text-white/35"}`}>{state.message}</p></div>
 </form>
}

function Field({label,name,type="text",required=false,maxLength,autoComplete}:{label:string;name:string;type?:string;required?:boolean;maxLength?:number;autoComplete?:string}){
 return <label className="block"><span className="mb-2 block text-sm text-white/55">{label}</span><input name={name} type={type} required={required} maxLength={maxLength} autoComplete={autoComplete} className="w-full rounded-2xl border border-white/10 bg-white/[.025] px-4 py-3 text-white outline-none transition focus:border-[#5f78ff]/60"/></label>
}