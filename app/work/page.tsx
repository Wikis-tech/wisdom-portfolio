import Link from "next/link";
import {PublicFooter} from "@/components/portfolio/public-footer";
import {createClient} from "@/lib/supabase/server";
import {PublicNav} from "@/components/portfolio/public-nav";
import {getPageMetadata} from "@/lib/site/seo";

type Snap={problem?:string;outcome?:string};


export async function generateMetadata(){return getPageMetadata("work",{"title":"Selected Work — Okoh Wisdom","description":"Case studies showing the problem, what I built, why it mattered and what changed.","path":"/work"});}
export default async function WorkPage(){
 const s=await createClient();
 const {data:projects}=await s.from("project_publications").select("project_id,slug,title,short_description,status,confidential,snapshot,published_at").order("sort_order").order("published_at",{ascending:false});
 return <main className="min-h-screen bg-[#06070b] text-white"><PublicNav/><section className="mx-auto w-[min(1320px,calc(100%-32px))] py-16 sm:w-[min(1320px,calc(100%-40px))] sm:py-20"><p className="text-xs font-semibold tracking-[.18em] text-[#6f8cff]">WORK</p><h1 className="mt-5 max-w-4xl text-[clamp(2.8rem,7vw,5.8rem)] font-semibold leading-[.95] tracking-[-.05em]">Problems understood. Products built. Outcomes made visible.</h1><p className="mt-6 max-w-2xl text-base leading-8 text-white/45 sm:text-lg">Each case study starts with the problem, shows what I built, explains why it mattered and ends with what changed.</p><div className="mt-12 grid gap-4 md:grid-cols-2 sm:mt-14">{projects?.length?projects.map((x,i)=>{const snap=(x.snapshot??{}) as Snap;return <Link key={x.project_id} href={`/work/${x.slug}`} className={`group rounded-3xl border border-white/[.08] bg-white/[.025] p-6 transition hover:-translate-y-1 hover:bg-white/[.045] ${i%5===0?"md:col-span-2 md:min-h-72":""}`}><p className="text-xs uppercase tracking-[.15em] text-white/30">{x.status.replaceAll("_"," ")}{x.confidential?" · confidential":""}</p><h2 className="mt-12 text-3xl font-semibold tracking-[-.04em] sm:mt-16 sm:text-4xl">{x.title}</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-white/45">{snap.problem||x.short_description}</p>{snap.outcome&&<p className="mt-5 text-xs font-medium uppercase tracking-[.14em] text-[#8097ff]">What changed → {snap.outcome}</p>}</Link>}):<div className="md:col-span-2 rounded-3xl border border-dashed border-white/10 p-10 text-center text-sm text-white/35 sm:p-14">No published projects yet. The project CMS now requires every public case study to answer the four value questions before publishing.</div>}</div></section><PublicFooter/></main>
}
