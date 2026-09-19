import Link from "next/link";
import { HeroRotator } from "@/components/portfolio/hero-rotator";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#06070b] text-white">
      <div className="mx-auto flex min-h-screen w-[min(1440px,calc(100%-40px))] flex-col">
        <nav className="flex items-center justify-between py-6">
          <Link href="/" className="text-xs font-bold tracking-[.24em]">WIKIS TECH</Link>
          <div className="hidden items-center gap-7 text-sm text-white/55 md:flex">
            <Link href="#work">Work</Link><Link href="/about">About</Link><Link href="/lab">Lab</Link><Link href="/services">Services</Link>
          </div>
          <Link href="/contact" className="rounded-full border border-white/10 bg-white/[.04] px-4 py-2 text-sm text-white/80 backdrop-blur-xl">Let&apos;s Talk ↗</Link>
        </nav>
        <section className="grid flex-1 items-center gap-10 py-16 lg:grid-cols-[1fr_340px] lg:py-20">
          <div>
            <p className="mb-8 text-[11px] font-semibold tracking-[.22em] text-white/35">WISDOM / WIKIS TECH · LAGOS, NG</p>
            <HeroRotator />
            <p className="mt-10 max-w-2xl text-base leading-7 text-white/50 sm:text-lg">Software developer, product builder and creative technologist combining code, design, AI and business thinking to turn ideas into useful digital experiences.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="#work" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black">View Selected Work ↓</Link>
              <Link href="/contact" className="rounded-full border border-white/10 px-5 py-3 text-sm font-medium text-white/70">Let&apos;s Work Together ↗</Link>
            </div>
          </div>
          <aside className="relative hidden min-h-[420px] lg:block" aria-hidden="true">
            <div className="hero-monolith absolute inset-6 rounded-[44px] border border-white/10 bg-gradient-to-b from-white/[.08] to-white/[.015] shadow-2xl">
              <div className="absolute inset-8 rounded-[34px] border border-white/[.07]" />
              <div className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-[40px] border border-[#4f6fff]/40 bg-[#174fc4]/10 shadow-[0_0_90px_rgba(40,103,232,.18)]" />
              <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-3xl border border-[#986fff]/30 bg-[#6935c7]/10" />
            </div>
          </aside>
        </section>
        <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-white/[.07] py-5 text-xs text-white/35">
          <span>● Available for selected freelance & collaboration opportunities</span><span>CODE × DESIGN × AI × STRATEGY</span>
        </footer>
      </div>
    </main>
  );
}
