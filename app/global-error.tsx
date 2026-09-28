"use client";

export default function GlobalError({reset}:{error:Error & {digest?:string};reset:()=>void}){
 return <html lang="en"><body className="min-h-screen bg-[#06070b] text-white"><main className="grid min-h-screen place-items-center px-5"><section className="max-w-xl text-center"><p className="text-xs font-semibold tracking-[.18em] text-[#6f8cff]">WIKIS TECH / RECOVERY</p><h1 className="mt-5 text-4xl font-semibold tracking-[-.04em] sm:text-6xl">Something unexpected happened.</h1><p className="mt-5 text-sm leading-7 text-white/45">Your content is safe. Retry the request first; if the issue persists, reload the site.</p><div className="mt-7 flex justify-center gap-3"><button onClick={()=>reset()} className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black">Try again</button><button onClick={()=>window.location.reload()} className="rounded-full border border-white/10 px-5 py-3 text-sm text-white/70">Reload</button></div></section></main></body></html>
}
