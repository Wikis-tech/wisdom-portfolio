# Phase 1–7 Hardening Audit

This audit records the cross-phase hardening pass performed before Phase 8.

## Positioning

Homepage hero:
- OKOH WISDOM / WIKIS TECH
- I BUILD WEBSITES &
- DIGITAL PRODUCTS THAT
- WORK. / CONNECT. / CONVERT. / SCALE. / MOVE.
- Supporting copy is outcome-oriented rather than a list of job titles.

## Case-study standard

Every public project must answer:
1. Here is the problem.
2. Here is what I built.
3. Here is why it mattered.
4. Here is what changed.

The Project CMS stores these fields explicitly and blocks publication of a public project when any of the four is missing. Supporting screenshots, technology and implementation notes come after the value story.

## UI / UX hardening

- Responsive public navigation with mobile menu, active state and accessible controls.
- Responsive admin drawer instead of a horizontally overflowing admin navigation.
- Future Phase 8 admin links that did not exist yet were removed from the live sidebar.
- Hero typography uses clamp sizing and reduced motion support.
- Portrait remains visible on mobile with responsive dimensions.
- Public sections use 32 px mobile / 40 px larger page gutters.
- Media Library upload/preview layout is responsive.
- Focus-visible and reduced-motion behavior are globally defined.

## Security hardening

- Every public-schema table has RLS enabled.
- Anonymous INSERT/UPDATE/DELETE grants were removed from public tables.
- Anonymous direct inserts into contact_messages and quote_requests remain disabled.
- Public form submissions continue through the hardened Edge Function.
- Public project details are read from project_publications rather than draft project rows.
- Database hardening is source-controlled as migrations 0008 and 0009.

Known launch item:
- Supabase Auth Leaked Password Protection remains disabled and must be enabled before final launch.

## Automated Phase 1–7 quality gate

The branch quality workflow checks:
- npm dependency installation
- ESLint
- TypeScript
- production Next.js build
- production server boot
- public route smoke tests for /, /work, /about, /archive, /lab, /services, /pricing, /contact, /quote and /admin/login

A successful CI run plus a READY Vercel build is required before this audit is considered passed.

## Human acceptance still required

Automation cannot prove visual perfection on every physical device or validate authenticated admin workflows without using the owner account. Before launch, manually test the agreed breakpoint matrix and the authenticated CMS flows. Phase 9 and Phase 10 remain the final experience, accessibility, performance and release gates.
