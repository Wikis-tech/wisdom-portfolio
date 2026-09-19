const cards = [["Published Projects","—"],["Draft Projects","—"],["Designs","—"],["Experiments","—"],["New Messages","—"],["Quote Requests","—"]];
export default function AdminDashboardPage() {
  return <main>
    <p className="max-w-xl text-[var(--text-secondary)]">Phase 1 establishes the secure CMS foundation. Content metrics become live as their modules are introduced in later phases.</p>
    <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map(([label,value]) => <article key={label} className="surface rounded-2xl p-5"><p className="text-sm text-[var(--text-secondary)]">{label}</p><p className="mt-5 text-3xl font-semibold">{value}</p></article>)}
    </section>
  </main>;
}
