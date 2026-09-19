import Link from "next/link";
import {PublicNav} from "@/components/portfolio/public-nav";
import {QuoteForm} from "@/components/forms/quote-form";

export default function QuotePage(){
  return (
    <main className="min-h-screen bg-[#06070b] text-white">
      <PublicNav/>
      <section className="mx-auto grid w-[min(1240px,calc(100%-40px))] gap-12 py-20 lg:grid-cols-[.7fr_1.3fr]">
        <div>
          <p className="text-xs font-semibold tracking-[.18em] text-[#6f8cff]">QUOTE REQUEST</p>
          <h1 className="mt-5 text-5xl font-semibold tracking-[-.05em] sm:text-7xl">Tell me what you’re trying to build.</h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-white/45">The form gives me enough context to understand the scope before we talk. Budget is optional. Clear problems are more useful than polished briefs.</p>
          <div className="mt-10 border-l border-white/10 pl-5 text-sm leading-7 text-white/35">Your uploaded brief is stored privately and is not exposed through the public portfolio.</div>
          <Link href="/contact" className="mt-8 inline-block text-sm text-white/65">Prefer a simple message? Contact me ↗</Link>
        </div>
        <div className="rounded-[32px] border border-white/[.08] bg-white/[.025] p-6 sm:p-8">
          <QuoteForm/>
        </div>
      </section>
    </main>
  );
}
