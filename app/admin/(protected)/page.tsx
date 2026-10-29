import Link from "next/link";
import {createClient} from "@/lib/supabase/server";

export default async function AdminDashboardPage(){
 const s=await createClient();
 const [{count:published},{count:drafts},{count:designs},{count:messages},{count:quotes},{data:activity}]=await Promise.all([
  s.from("project_publications").select("*",{count:"exact",head:true}),
  s.from("projects").select("*",{count:"exact",head:true}).eq("content_state","draft").is("deleted_at",null),
  s.from("designs").select("*",{count:"exact",head:true}).is("deleted_at",null),
  s.from("contact_messages").select("*",{count:"exact",head:true}).eq("status","unread"),
  s.from("quote_requests").select("*",{count:"exact",head:true}).eq("status","new"),
  s.from("activity_logs").select("id,action,entity_type,created_at").order("created_at",{ascending:false}).limit(6)
 ]);

 const start=[
  {title:"Add a website or app",text:"Create the draft with only the name, live link and short description.",href:"/admin/projects/new",cta:"Add project →"},
  {title:"Upload a graphic design",text:"Choose the artwork from your computer, add a title, then publish it.",href:"/admin/designs",cta:"Upload design →"},
  {title:"Edit the homepage",text:"Change your intro text, rotating words, portrait and availability message.",href:"/admin/pages/home",cta:"Edit homepage →"},
 ];
 const stats=[
  ["Published projects",published??0,"/admin/projects"],
  ["Draft projects",drafts??0,"/admin/projects"],
  ["Designs",designs??0,"/admin/designs"],
  ["Unread messages",messages??0,"/admin/messages"],
  ["New quote requests",quotes??0,"/admin/quotes"],
 ] as const;

 return <main className="mx-auto max-w-6xl">
  <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
   <div><p className="text-xs font-semibold tracking-[.18em] text-[#6f8cff]">OVERVIEW</p><h1 className="mt-3 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">Manage your portfolio</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-white/48">You should not need to understand the database. Pick what you want to change below, save it, then check the live website.</p></div>
   <Link href="/" className="w-fit rounded-xl border border-white/10 px-4 py-2.5 text-sm text-white/70 transition hover:bg-white/[.05]">View live portfolio ↗</Link>
  </div>

  <section className="mt-8 grid gap-4 lg:grid-cols-3">
   {start.map(x=><Link key={x.href} href={x.href} className="group rounded-2xl border border-white/[.08] bg-white/[.025] p-5 transition hover:-translate-y-1 hover:border-blue-400/25 hover:bg-[#0d1f48]/35">
    <p className="text-lg font-semibold">{x.title}</p><p className="mt-2 text-sm leading-6 text-white/43">{x.text}</p><p className="mt-6 text-sm font-medium text-[#9eafff]">{x.cta}</p>
   </Link>)}
  </section>

  <section className="mt-8">
   <div className="flex items-center justify-between"><div><p className="text-xs font-semibold tracking-[.15em] text-white/30">STATUS</p><h2 className="mt-2 text-xl font-semibold">What needs attention</h2></div></div>
   <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">{stats.map(([label,value,href])=><Link key={label} href={href} className="rounded-2xl border border-white/[.08] bg-white/[.02] p-4 transition hover:bg-white/[.04]"><p className="text-sm text-white/42">{label}</p><p className="mt-4 text-3xl font-semibold">{value}</p></Link>)}</div>
  </section>

  <section className="mt-9 rounded-2xl border border-white/[.08] bg-white/[.02] p-5 sm:p-6">
   <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-semibold tracking-[.15em] text-white/30">RECENT ACTIVITY</p><h2 className="mt-2 text-lg font-semibold">Latest changes</h2></div><Link href="/admin/trash" className="text-sm text-white/40 hover:text-white">Open Trash →</Link></div>
   <div className="mt-5 space-y-2">{activity?.length?activity.map(i=><div key={i.id} className="flex flex-col gap-1 rounded-xl border border-white/[.06] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"><span className="text-sm text-white/72">{i.action}</span><span className="text-xs text-white/28">{i.entity_type} · {new Date(i.created_at).toLocaleString()}</span></div>):<p className="rounded-xl border border-dashed border-white/10 p-8 text-center text-sm text-white/40">No activity yet.</p>}</div>
  </section>
 </main>;
}
