export default function HomePage() {
  return (
    <main className="shell flex min-h-screen items-center py-20">
      <section className="max-w-5xl">
        <p className="mb-8 text-xs font-semibold tracking-[0.26em] text-[var(--text-muted)]">
          WISDOM / WIKIS TECH · LAGOS, NG
        </p>
        <h1 className="max-w-5xl text-[clamp(3rem,9vw,7rem)] font-semibold leading-[0.92] tracking-[-0.06em]">
          I BUILD DIGITAL
          <br />
          THINGS THAT WORK.
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-8 text-[var(--text-secondary)]">
          Software developer, product builder and creative technologist combining
          code, design, AI and business thinking to turn ideas into useful digital
          experiences.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <a
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black"
            href="#work"
          >
            View Selected Work ↓
          </a>
          <a
            className="rounded-full border border-[var(--border)] px-6 py-3 text-sm font-semibold"
            href="/contact"
          >
            Let&apos;s Work Together ↗
          </a>
        </div>
        <p className="mt-10 text-sm text-[var(--text-secondary)]">
          <span aria-hidden="true" className="mr-2 text-emerald-400">●</span>
          Available for selected freelance & collaboration opportunities
        </p>
      </section>
    </main>
  );
}
