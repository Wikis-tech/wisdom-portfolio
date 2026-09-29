import Link from "next/link";
import {PublicNav} from "@/components/portfolio/public-nav";
import {PublicFooter} from "@/components/portfolio/public-footer";

export default function NotFound(){
 return <main className="min-h-screen bg-[#06070b] text-white"><PublicNav/><section className="mx-auto grid min-h-[65vh] w-[min(900px,calc(100%-32px))] place-items-center py-16 text-center"><div><p className="text-xs font-semibold tracking-[.18em] text-[#6f8cff]">404 / NOT FOUND</p><h1 className="mt-5 text-[clamp(3rem,9vw,7rem)] font-semibold leading-[.9] tracking-[-.06em]">This route doesn’t lead anywhere useful.</h1><p className="mx-auto mt-6 max-w-xl text-base leading-7 text-white/45">The page may have moved, been unpublished, or never existed. Head back to the portfolio or browse the work.</p><div className="mt-8 flex flex-wrap justify-center gap-3"><Link href="/" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black">Back home</Link><Link href="/work" className="rounded-full border border-white/10 px-5 py-3 text-sm text-white/70">View work</Link></div></div></section><PublicFooter/></main>
}
