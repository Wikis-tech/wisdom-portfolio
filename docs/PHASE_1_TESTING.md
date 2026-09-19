# Phase 1 Acceptance Tests

Phase 1 passes only when every critical item below succeeds.

## Build
- npm install succeeds and creates a lockfile.
- npm run typecheck, npm run lint and npm run build pass.
- / renders without horizontal overflow.
- No secret/service-role key exists in source or client bundle.

## Supabase
- Migration applies cleanly; profiles and site_settings exist.
- RLS is enabled.
- Run Supabase security advisors and resolve critical findings introduced by Phase 1.

## Authentication
- Signed-out /admin redirects to /admin/login.
- Wrong password cannot enter.
- Approved admin credentials enter /admin.
- Refresh preserves the authenticated session.
- Sign out returns to login.
- Incognito/direct /admin access is denied.

## Authorization / RLS
- admin and active editor can enter the Phase 1 CMS shell.
- is_active=false is denied.
- anonymous user can read site_settings but cannot write it.
- anonymous user cannot read profiles.
- authenticated user can read only their own profile.
- normal profile update cannot change role.
- approved CMS user can perform permitted site_settings writes.

## UI
Check 360, 390, 430, 768, 1024, 1280 and 1440 widths. Login and dashboard must remain usable; keyboard focus must be visible; reduced-motion must be respected.

## Vercel Preview
- phase branch Preview reaches READY.
- / loads.
- admin authentication works against the dedicated portfolio Supabase project.
- build/runtime logs show no repeated auth errors or secrets.

Any auth, RLS or build failure blocks Phase 2.
