export default function AdminLoading(){
 return <main className="mx-auto max-w-5xl animate-pulse">
  <div className="h-3 w-28 rounded bg-white/10"/>
  <div className="mt-4 h-9 w-72 max-w-full rounded bg-white/10"/>
  <div className="mt-3 h-4 w-[520px] max-w-full rounded bg-white/[.06]"/>
  <div className="mt-8 grid gap-4 sm:grid-cols-2">
   {[0,1,2,3].map(i=><div key={i} className="h-40 rounded-2xl border border-white/[.06] bg-white/[.025]"/>)}
  </div>
 </main>;
}