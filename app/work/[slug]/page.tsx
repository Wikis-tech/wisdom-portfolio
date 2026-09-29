import Link from "next/link";
import {notFound} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
import {PublicNav} from "@/components/portfolio/public-nav";
import {PublicFooter} from "@/components/portfolio/public-footer";
import {entityMetadata} from "@/lib/site/seo";
import {getSiteSettings,siteOrigin} from "@/lib/site/content";

type Snap={
 title:string;short_description?:string;problem?:string;solution?:string;why_it_mattered?:string;outcome?:string;
 year?:number;client?:string;role?:string;status:string;confidential:boolean;live_url?:string|null;github_url?:string|null;card_media_url?:string|null;hero_media_url?:string|null;
 seo_title?:string;seo_description?:string;seo_image_url?:string;seo_noindex?:boolean;
 categories?:Array<{project_categories?:{name?:string;slug?:string}|null}>;
 blocks?:Array<{id:string;block_type:string;data:{content?:string}}>
};


export async function generateMetadata({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;const s=await createClient();
 const [{data},site]=await Promise.all([s.from("project_publications").select("title,short_description,snapshot").eq("slug",slug).maybeSingle(),getSiteSettings()]);
 if(!data)return {};
 const snap=data.snapshot as unknown as Snap;
 return entityMetadata({title:snap.seo_title||data.title,description:snap.seo_description||data.short_description||"Project case study by Okoh Wisdom.",path:`/work/${slug}`,image:snap.seo_image_url||null,noindex:snap.seo_noindex||false,siteName:site.brand_name,origin:siteOrigin(site)});
}

export default async function ProjectPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;
 const s=await createClient();
 const {data}=await s.from("project_publications").select("title,short_description,status,confidential,snapshot,published_at").eq("slug",slug).single();
 if(!data)notFound();
 const snap=data.snapshot as unknown as Snap;
 const story=[
  ["01","THE PROBLEM",snap.problem],
  ["02","WHAT I BUILT",snap.solution],
  ["03","WHY IT MATTERED",snap.why_it_mattered],
  ["04","WHAT CHANGED",snap.outcome],
 ].filter((item):item is [string,string,string]=>typeof item[2]==="string"&&item[2].trim().length>0);

 return <main className="min-h-screen bg-[#06070b] text-white">
  <PublicNav/>
  <article className="mx-auto w-[min(1120px,calc(100%-32px))] py-12 sm:w-[min(1120px,calc(100%-40px))] sm:py-16">
   <p className="text-xs font-semibold uppercase tracking-[.18em] text-[#6f8cff]">{snap.status.replaceAll("_"," ")}</p>
   <h1 className="mt-5 max-w-5xl text-[clamp(2.8rem,7vw,5.8rem)] font-semibold leading-[.94] tracking-[-.055em]">{snap.title}</h1>
   <p className="mt-6 max-w-3xl text-base leading-8 text-white/50 sm:text-lg">{snap.short_description}</p>
   {snap.hero_media_url?<div className="mt-10 overflow-hidden rounded-[30px] border border-[#3153a4]/25 bg-[#081024] shadow-[0_30px_100px_rgba(0,0,0,.28)]"><div role="img" aria-label={`${snap.title} project preview`} className="aspect-[16/8] w-full bg-cover bg-center" style={{backgroundImage:`url("${snap.hero_media_url}")`}}/></div>:snap.card_media_url?<div className="mt-10 overflow-hidden rounded-[30px] border border-[#3153a4]/20 bg-[#081024]"><div role="img" aria-label={`${snap.title} project preview`} className="aspect-[16/8] w-full bg-cover bg-center" style={{backgroundImage:`url("${snap.card_media_url}")`}}/></div>:null}
   {snap.confidential&&<p className="mt-8 rounded-2xl border border-white/10 bg-white/[.025] p-4 text-sm text-white/45">Selected interface information has been anonymised for confidentiality.</p>}
   <dl className="mt-10 grid gap-5 border-y border-white/[.08] py-6 sm:grid-cols-3">{snap.year&&<div><dt className="text-xs uppercase tracking-wider text-white/30">Year</dt><dd className="mt-2 text-sm">{snap.year}</dd></div>}{snap.client&&<div><dt className="text-xs uppercase tracking-wider text-white/30">Client</dt><dd className="mt-2 text-sm">{snap.client}</dd></div>}{snap.role&&<div><dt className="text-xs uppercase tracking-wider text-white/30">Role</dt><dd className="mt-2 text-sm">{snap.role}</dd></div>}</dl>

   {story.length>0&&<section className="mt-16 overflow-hidden rounded-[28px] border border-white/[.08]">
    {story.map(([number,label,content])=><div key={label} className="grid gap-4 border-b border-white/[.07] bg-white/[.018] p-6 last:border-b-0 sm:p-8 md:grid-cols-[150px_1fr]"><div><p className="text-xs font-semibold text-[#8097ff]">{number}</p><h2 className="mt-2 text-xs font-semibold tracking-[.16em] text-white/45">{label}</h2></div><p className="max-w-3xl whitespace-pre-wrap text-base leading-8 text-white/68">{content}</p></div>)}
   </section>}

   {snap.blocks?.length?<section className="mt-16"><p className="text-xs font-semibold tracking-[.18em] text-white/30">DETAILS & PROCESS</p><div className="mt-8 space-y-12">{snap.blocks.map(b=>b.block_type==="heading"?<h2 key={b.id} className="text-3xl font-semibold tracking-[-.03em]">{b.data.content}</h2>:b.block_type==="spacer"?<div key={b.id} className="h-8"/>:<p key={b.id} className="max-w-3xl whitespace-pre-wrap text-base leading-8 text-white/55">{b.data.content}</p>)}</div></section>:null}

   <div className="mt-16 flex flex-wrap gap-3">{snap.live_url&&<Link href={snap.live_url} target="_blank" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black">Visit Live Site ↗</Link>}{snap.github_url&&<Link href={snap.github_url} target="_blank" className="rounded-full border border-white/10 px-5 py-3 text-sm">GitHub ↗</Link>}<Link href="/work" className="rounded-full border border-white/10 px-5 py-3 text-sm text-white/65">Back to Work</Link></div>
  </article><PublicFooter/>
 </main>
}
