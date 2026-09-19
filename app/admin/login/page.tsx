import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signIn } from "./actions";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: Props) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (data?.claims?.sub) {
    redirect("/admin");
  }

  const { error } = await searchParams;
  const message =
    error === "unauthorized"
      ? "This account is not approved for the Wikis Tech CMS."
      : error
        ? "Check your email and password and try again."
        : null;

  return (
    <main className="shell grid min-h-screen place-items-center py-12">
      <section className="surface w-full max-w-md rounded-3xl p-8 md:p-10">
        <p className="text-xs font-semibold tracking-[0.25em] text-[var(--blue-bright)]">
          WIKIS TECH
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em]">
          Portfolio Control Center
        </h1>
        <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
          Private access for approved portfolio administrators.
        </p>

        {message ? (
          <p className="mt-6 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">
            {message}
          </p>
        ) : null}

        <form action={signIn} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm" htmlFor="email">Email</label>
            <input
              className="w-full rounded-xl border border-[var(--border)] bg-black/20 px-4 py-3 outline-none"
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm" htmlFor="password">Password</label>
            <input
              className="w-full rounded-xl border border-[var(--border)] bg-black/20 px-4 py-3 outline-none"
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>
          <button
            className="w-full rounded-xl bg-[var(--blue-bright)] px-4 py-3 font-semibold text-white"
            type="submit"
          >
            Sign In
          </button>
        </form>
        <p className="mt-6 text-xs text-[var(--text-muted)]">
          Public registration is intentionally disabled.
        </p>
      </section>
    </main>
  );
}
