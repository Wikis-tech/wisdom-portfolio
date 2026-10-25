import Link from "next/link";
import {createClient} from "@/lib/supabase/server";
import {PublicNav} from "@/components/portfolio/public-nav";
import {PublicFooter} from "@/components/portfolio/public-footer";
import {getPageMetadata} from "@/lib/site/seo";

type CategoryLink={project_categories?:{name?:string;slug?:string}|null};
type ProjectItem={project_id:string;slug:string;title:string;short_description:string|null;status:string;confidential:boolean;snapshot:unknown;published_at?:string|null};
type Snap={
 problem?:string;outcome?:string;live_url?:string|null;card_media_url?:string|null;
 categories?:CategoryLink[];
};

export async function generateMetadata(){
 return getPageMetadata("work",{title:"Selected Work — Okoh Wisdom",description:"Case studies showing the problem, what I built, why it mattered and what changed.",path:"/work"});
}

function slugs(s:Snap){return new Set((s.categories??[]).map(x=>x.project_categories?.slug).filter((x):x is string=>Boolean(x)))}
function isIn(s:Snap,choices:string[]){const set=slugs(s);return choices.some(x=>set.has(x))}
function previewHref(s:Snap,slug:string){return s.live_url||`/work/${slug}`}

export default async function WorkPage(){
 const s=await createClient();
 const [{data:projects},{data:designs}]=await Promise.all([
  s.from("project_publications").select("project_id,slug,title,short_description,status,confidential,snapshot,published_at").order("sort_order").order("published_at",{ascending:false}),
  s.from("designs").select("id,title,client,year,description,image_url,tags,design_categories(name)").eq("visibility","public").is("deleted_at",null).order("sort_order")
 ]);
 const digital=(projects??[]).filter(p=>isIn((p.snapshot??{}) as Snap,["software","product","ui-ux","ai"]));
 const strategy=(projects??[]).filter(p=>isIn((p.snapshot??{}) as Snap,["business-research","presentation","branding"]));
 const used=new Set([...digital,...strategy].map(x=>x.project_id));
 const other=(projects??[]).filter(p=>!used.has(p.project_id));

 return <main className="public-page min-h-screen bg-[#050812] text-white">
  <PublicNav/>
  <section data-reveal="up" className="mx-auto w-[min(1360px,calc(100%-32px))] py-14 sm:w-[min(1360px,calc(100%-40px))] sm:py-20">
   <p className="text-xs font-semibold tracking-[.18em] text-[#6f8cff]">SELECTED WORK</p>
   <div className="mt-5 grid gap-8 lg:grid-cols-[1.25fr_.75fr] lg:items-end">
    <h1 className="max-w-5xl text-[clamp(3rem,8vw,7rem)] font-semibold leading-[.88] tracking-[-.065em]">Different work deserves a different stage.</h1>
    <p className="max-w-xl text-base leading-8 text-white/45">Websites and software are shown like products. Design work lives in a visual masonry archive. Research and strategy stay editorial and easy to scan.</p>
   </div>
  </section>

  <ProjectSection title="Websites, software & digital products" kicker="BUILD" items={digital} empty="Publish projects under Software, Product, UI/UX or AI to fill this section."/>
  <ProjectSection title="Research, strategy & presentations" kicker="THINK" items={strategy} compact empty="Business research, presentation and branding projects will appear here."/>
  {other.length?<ProjectSection title="More selected work" kicker="MORE" items={other} compact/>:null}

  <section data-reveal="up" className="mx-auto w-[min(1360px,calc(100%-32px))] py-20 sm:w-[min(1360px,calc(100%-40px))] sm:py-24">
   <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
    <div><p className="text-xs font-semibold tracking-[.18em] text-[#6f8cff]">DESIGN / VISUAL WORK</p><h2 className="mt-4 max-w-4xl text-4xl font-semibold tracking-[-.05em] sm:text-6xl">A Pinterest-like wall for the work that should be seen, not over-explained.</h2></div>
    <Link href="/archive" className="text-sm text-white/45 transition hover:text-white">Open full archive ↗</Link>
   </div>
   {designs?.length?<div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3">{designs.slice(0,12).map((d,i)=><article key={d.id} data-reveal="scale" data-delay={Math.min(i*55,330)} className="masonry-card mb-4 break-inside-avoid overflow-hidden rounded-[22px] border border-white/[.08] bg-[#081024]/70">
    <div className="relative overflow-hidden bg-[#0a1530]"><div className="min-h-72 w-full bg-cover bg-center transition duration-700 ease-out group-hover:scale-[1.03]" style={{backgroundImage:`url("${d.image_url}")`,aspectRatio:"4 / 5"}}/></div>
    <div className="p-4"><p className="text-[10px] uppercase tracking-[.16em] text-[#7890ff]">{(d.design_categories as {name?:string}|null)?.name||"Design"}{d.year?` · ${d.year}`:""}</p><h3 className="mt-2 text-lg font-semibold">{d.title}</h3><p className="mt-1 text-sm text-white/35">{d.client}</p>{d.description&&<p className="mt-3 text-sm leading-6 text-white/42">{d.description}</p>}</div>
   </article>)}</div>:<Empty text="Publish design work from the Design Archive CMS to build this visual wall."/>}
  </section>
  <PublicFooter/>
 </main>
}

function ProjectSection({title,kicker,items,compact=false,empty}:{title:string;kicker:string;items:ProjectItem[];compact?:boolean;empty?:string}){
 return <section data-reveal="up" className="mx-auto w-[min(1360px,calc(100%-32px))] py-16 sm:w-[min(1360px,calc(100%-40px))] sm:py-20">
  <p className="text-xs font-semibold tracking-[.18em] text-[#6f8cff]">{kicker}</p><h2 className="mt-4 max-w-4xl text-4xl font-semibold tracking-[-.05em] sm:text-6xl">{title}</h2>
  {items.length?<div className={`mt-10 grid gap-6 ${compact?"md:grid-cols-2":"lg:grid-cols-2"}`}>{items.map((p,i)=>{const snap=(p.snapshot??{}) as Snap;const href=previewHref(snap,p.slug);const external=Boolean(snap.live_url);return <article key={p.project_id} data-reveal="up" data-delay={Math.min(i*90,360)} className="portfolio-card group overflow-hidden rounded-[28px] border border-white/[.08] bg-[linear-gradient(145deg,rgba(10,24,57,.88),rgba(7,9,16,.96))]">
   <a href={href} target={external?"_blank":undefined} rel={external?"noreferrer":undefined} className="block overflow-hidden" aria-label={external?`Open live ${p.title}`:`Open ${p.title} case study`}>
    <div className={`relative overflow-hidden border-b border-white/[.07] bg-[#081024] ${compact?"aspect-[16/8]":"aspect-[16/10]"}`}>
     {snap.card_media_url?<div className="h-full w-full bg-cover bg-center transition duration-700 ease-out group-hover:scale-[1.025]" style={{backgroundImage:`url("${snap.card_media_url}")`}}/>:<div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(40,103,232,.24),transparent_35%),linear-gradient(145deg,#0a1a3c,#070910)]"/>}
     <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent opacity-0 transition duration-500 group-hover:opacity-100"/>
     <span className="absolute right-4 top-4 rounded-full border border-white/10 bg-black/35 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[.14em] text-white/65 backdrop-blur">{external?"Visit live ↗":"View case study ↗"}</span>
    </div>
   </a>
   <div className="p-5 sm:p-6"><div className="flex items-center justify-between gap-4"><p className="text-[10px] uppercase tracking-[.16em] text-[#7890ff]">0{i+1} · {p.status.replaceAll("_"," ")}</p>{p.confidential?<span className="text-[10px] uppercase tracking-[.14em] text-white/25">Confidential</span>:null}</div><Link href={`/work/${p.slug}`} className="mt-3 block"><h3 className="text-2xl font-semibold tracking-[-.035em] transition group-hover:text-[#b9c5ff] sm:text-3xl">{p.title}</h3></Link><p className="mt-3 max-w-2xl text-sm leading-6 text-white/45">{snap.problem||p.short_description}</p>{snap.outcome&&<p className="mt-5 text-xs font-medium uppercase tracking-[.14em] text-white/30">What changed → <span className="text-[#8fa1ff]">{snap.outcome}</span></p>}</div>
  </article>})}</div>:<Empty text={empty||"Published work will appear here."}/>}
 </section>
}

function Empty({text}:{text:string}){return <div className="mt-10 rounded-3xl border border-dashed border-[#1b356d] bg-[#071025]/45 p-9 text-center text-sm text-white/35">{text}</div>}
