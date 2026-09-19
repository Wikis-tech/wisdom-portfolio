import Link from "next/link";
import { requireCmsUser } from "@/lib/auth/require-cms-user";
import { signOut } from "./actions";

export default async function AdminProtectedLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await requireCmsUser();
  return (
    <div className="min-h-screen bg-[var(--background-soft)]">
      <header className="border-b border-[var(--border)]">
        <div className="shell flex min-h-16 items-center justify-between gap-4">
          <div><p className="text-xs font-bold tracking-[0.22em]">WIKIS TECH</p><p className="text-xs text-[var(--text-muted)]">Portfolio Control Center</p></div>
          <nav className="flex items-center gap-3 text-sm">
            <Link className="text-[var(--text-secondary)]" href="/">View Portfolio ↗</Link>
            <form action={signOut}><button className="rounded-lg border border-[var(--border)] px-3 py-2" type="submit">Sign out</button></form>
          </nav>
        </div>
      </header>
      <div className="shell py-10">
        <p className="text-sm text-[var(--text-muted)]">Signed in as {user.role}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">Good to see you, {user.displayName || "Wisdom"}.</h1>
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
