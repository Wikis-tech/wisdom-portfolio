import Link from "next/link";

const groups = [
  { label: "", items: [["Overview","/admin"]] },
  { label: "CONTENT", items: [["Home","/admin/pages/home"],["Projects","/admin/projects"],["Design Archive","/admin/designs"],["Lab","/admin/lab"],["About","/admin/about"],["Experience","/admin/experience"]] },
  { label: "BUSINESS", items: [["Services","/admin/services"],["Pricing","/admin/pricing"],["Quotes","/admin/quotes"],["Messages","/admin/messages"]] },
  { label: "SITE", items: [["Skills","/admin/skills"],["Technologies","/admin/technologies"],["Testimonials","/admin/testimonials"],["Navigation","/admin/navigation"],["Media","/admin/media"],["SEO","/admin/seo"]] },
  { label: "SETTINGS", items: [["Site Settings","/admin/settings"],["Trash","/admin/trash"]] },
];

export function AdminSidebar() {
  return <aside className="border-b border-white/10 bg-[#080a10] lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:border-b-0 lg:border-r">
    <div className="flex h-full flex-col p-5">
      <Link href="/admin" className="mb-7 block">
        <span className="text-sm font-bold tracking-[0.24em] text-white">WIKIS TECH</span>
        <span className="mt-1 block text-xs text-white/40">Portfolio OS</span>
      </Link>
      <nav className="flex gap-2 overflow-x-auto pb-2 lg:block lg:space-y-6 lg:overflow-visible">
        {groups.map(group => <div key={group.label || "root"} className="min-w-max">
          {group.label && <p className="mb-2 hidden px-2 text-[10px] font-semibold tracking-[0.2em] text-white/30 lg:block">{group.label}</p>}
          <div className="flex gap-1 lg:block lg:space-y-1">
            {group.items.map(([label,href]) => <Link key={href} href={href} className="block rounded-lg px-3 py-2 text-sm text-white/60 transition hover:bg-white/[.06] hover:text-white">{label}</Link>)}
          </div>
        </div>)}
      </nav>
      <Link href="/" className="mt-auto hidden rounded-xl border border-white/10 px-3 py-3 text-sm text-white/70 transition hover:bg-white/[.05] lg:block">View Portfolio ↗</Link>
    </div>
  </aside>;
}
