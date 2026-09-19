# Phase 1 Live Status

- Dedicated Supabase project: `wisdom-portfolio`
- Phase 1 migration applied: `phase_1_foundation`
- Public tables: `profiles`, `site_settings`
- RLS: enabled on both public tables
- Supabase security advisor: no Phase 1 security lints after migration
- Vercel production branch remains `main`
- Phase 1 is validated through a Preview deployment from `phase/01-foundation` before merge.

## Portability

The database definition remains source-controlled under `supabase/migrations/`. Supabase is the current managed PostgreSQL/Auth provider, but application data models are documented separately so future database migration is not dependent on dashboard-only schema changes.

## Security gate

Do not merge Phase 1 until:
1. Preview build is READY.
2. Auth redirect/login/logout tests pass.
3. An approved admin profile exists.
4. RLS behavior is verified.
5. No secret/service-role key is exposed to the browser.
