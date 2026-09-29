"use client";

import Link from "next/link";
import {useEffect} from "react";

export default function AdminError({error,reset}:{error:Error & {digest?:string};reset:()=>void}){
 useEffect(()=>{console.error("Admin route error",error)},[error]);
 return <main className="mx-auto grid min-h-[55vh] max-w-2xl place-items-center py-12">
  <section className="w-full rounded-3xl border border-white/[.08] bg-white/[.025] p-7 text-center sm:p-10">
   <p className="text-xs font-semibold tracking-[.18em] text-[#8097ff]">ADMIN RECOVERY</p>
   <h1 className="mt-4 text-3xl font-semibold tracking-[-.04em]">This admin page hit a temporary error.</h1>
   <p className="mt-4 text-sm leading-6 text-white/45">Your portfolio content is still safe. Retry the page first. If your session became stale after a deployment, sign in again.</p>
   {error.digest&&<p className="mt-4 text-xs text-white/25">Reference: {error.digest}</p>}
   <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
    <button onClick={()=>reset()} className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black">Retry</button>
    <button onClick={()=>window.location.reload()} className="rounded-full border border-white/10 px-5 py-3 text-sm text-white/70">Reload page</button>
    <Link href="/admin/login" className="rounded-full border border-white/10 px-5 py-3 text-sm text-white/70">Sign in again</Link>
   </div>
  </section>
 </main>
}
