# Phase 1 — Connection & Setup Guide

GitHub stores code, Vercel builds/deploys Next.js, and a dedicated Supabase project stores Auth + PostgreSQL data (Storage follows in Phase 2).

## Connect everything

1. Create a new Supabase project named **Wikis Tech Portfolio**. Do not reuse SPIP or Zorah.
2. Apply `supabase/migrations/0001_phase_1_foundation.sql`.
3. In Supabase Authentication → Users, create Wisdom's private email/password user. Public signup remains disabled.
4. Promote the user with:
```sql
update public.profiles set role='admin', display_name='Wisdom' where id='<AUTH_USER_UUID>';
```
5. From Supabase Connect/API Keys copy the Project URL and current publishable key.
6. Locally copy `.env.example` to `.env.local` and set:
```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```
7. Run `npm install`, `npm run typecheck`, `npm run lint`, `npm run build`, then `npm run dev`. Commit the generated lockfile.
8. Import `Wikis-tech/wisdom-portfolio` into Vercel as a Next.js project. Keep `main` as production; phase branches should create Preview deployments.
9. Add the same three environment variables to Vercel Preview and Production. Production `NEXT_PUBLIC_SITE_URL` becomes the final domain.
10. In Supabase Auth URL configuration, set the production Site URL once available. Add localhost/preview redirects only for auth flows that require callbacks.

Never expose a Supabase secret/service-role key through `NEXT_PUBLIC_*`. Authorization is stored in the protected `profiles.role`, not user-editable metadata.

## Deployment order

Database migration → verify RLS/auth → Vercel Preview → acceptance tests → merge/promote → production.

The code is connection-ready, but live auth cannot be verified until the dedicated portfolio Supabase project exists.
