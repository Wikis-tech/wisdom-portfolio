# Wisdom Portfolio - Project Handoff

> Primary continuity document for any future developer or AI assistant taking over this repository.

## 1. Project identity

**Project:** Wisdom Portfolio / Wikis Tech Portfolio  
**Repository:** https://github.com/Wikis-tech/wisdom-portfolio  
**Public production URL:** https://wisdom-portfolio-five.vercel.app  
**Current development branch:** `phase/09-visual-experience`  
**Current Phase 9 PR:** #9 - _Phase 9 - Visual Experience, Work System and Brand Asset Uploads_  
**Supabase project ref:** `mgzvfhrnrrvbmajkrmgp`  
**Vercel project:** `wisdom-portfolio`

The product is both:

1. a public portfolio for Wisdom / Wikis Tech; and
2. a private Admin CMS used to manage projects, design work, experiments, profile content, services, pricing, messages, quote requests, media, SEO, navigation and global site settings without editing code.

Normal content publishing must not require a GitHub commit or Vercel redeploy.

## 2. Product positioning

Current public positioning:

> **I BUILD WEBSITES & DIGITAL PRODUCTS THAT [WORK / CONNECT / CONVERT / SCALE / MOVE].**

Supporting copy:

> I turn ideas and business problems into useful websites, digital products and intelligent tools - combining software, design, AI and strategy.

Brand framework:

> **CODE x DESIGN x AI x STRATEGY**

The homepage hero intentionally uses rotating outcome words rather than a static generic tagline.

## 3. Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Supabase PostgreSQL
- Supabase Auth
- Supabase Storage
- Vercel
- GitHub

The public site is server-first. Client Components are used for motion, theme controls, navigation interactions and upload UX.

## 4. Architecture

GitHub is source control. Vercel runs the application. Supabase owns persistent content, authentication and media storage.

The public site reads published/public data only.

The Admin CMS:
- requires authenticated CMS users;
- checks `profiles.role` and `profiles.is_active`;
- uses RLS;
- validates mutations;
- logs meaningful activity;
- uses draft/publish separation for projects.

Never add a service-role/secret key to browser code or a `NEXT_PUBLIC_` variable.

## 5. Delivery status

### Phase 1 - Foundation, Design System & Supabase Core
Implemented.

Includes:
- Next.js project foundation
- TypeScript/Tailwind
- environment validation
- Supabase browser/server clients
- authentication
- profiles/roles
- protected admin routes
- RLS baseline
- public/admin layouts

### Phase 2 - Media, Admin Shell & CMS Infrastructure
Implemented.

Includes:
- admin shell/sidebar
- dashboard foundations
- media library
- public/private Storage buckets
- storage RLS
- activity logs
- soft-delete/trash foundations
- error/loading/empty states

### Phase 3 - Projects CMS & Publishing Engine
Implemented.

Includes:
- projects
- categories
- project blocks
- media relationships
- draft/publish model
- public/private visibility
- confidential mode
- per-project SEO
- public publication snapshots

### Phase 4 - Homepage CMS & Public Core
Implemented.

Includes:
- editable hero
- rotating hero words
- selected work
- homepage sections
- public navigation/footer
- Work index
- dynamic case-study routes

### Phase 5 - Design Archive, About & Experience
Implemented.

Includes:
- Design Archive
- About
- education
- experience
- journey
- skills
- technologies
- profile system

### Phase 6 - Lab, Services, Pricing & Now
Implemented.

Includes:
- experiments/Lab
- services
- pricing
- service-pricing links
- Now items

### Phase 7 - Quote CRM, Contact & Testimonials
Implemented.

Includes:
- contact inbox
- quote request workflow
- public contact/quote forms
- validation
- rate-limit foundations
- testimonials management

### Phase 8 - Navigation, SEO & Global Settings
Implemented.

Includes:
- Navigation CMS
- Site Settings
- social links
- SEO defaults
- page/project metadata
- sitemap
- robots
- logo/favicon controls

### Phase 9 - Public Experience, Motion & Work Presentation
**Current active phase.**

Implemented work includes:
- dark/light mode
- black/deep-blue dark UI
- warm editorial light mode
- large editorial hero
- portrait treatment
- rotating hero outcome word
- motion/reveal system
- hover/elevation effects
- responsive mobile navigation
- work grouped by discipline
- software/product project cards
- Pinterest-style Design Archive
- project preview image + hero image
- logo/favicon upload controls
- loading animations for public/admin navigation
- reduced-motion support
- fail-open reveal animation architecture

Latest important fixes:
- reveal animations can no longer permanently hide content;
- media uploads no longer send large file bodies through a Server Action;
- published public projects can appear on the homepage with Featured used as priority/pinning;
- project editor explicitly warns when a project is Private.

### Phase 10 - Security, Performance, Full QA & Launch
**Not completed. This is the major remaining phase.**

## 6. Current Git/Vercel checkpoint

At the latest verified checkpoint:

- Phase 9 branch head: `4bcea7b59633f5fef46934f75c40e387e326c46d`
- Latest Phase 1-9 GitHub quality gate: **SUCCESS**
- Latest Phase 9 Vercel preview for this commit: **READY**
- Preview alias: `wisdom-portfolio-git-phase-09-visual-experience-campus-link.vercel.app`
- Production had previously been promoted to commit `8fcb7eca...`; verify Vercel before assuming production is on the latest Phase 9 head.

Important: Vercel deployments are immutable. Never diagnose a fixed commit by opening an old failed deployment.

## 7. Current CMS content checkpoint

Latest verified Supabase counts:

- Projects: 9
- Public project publications: 3
- Media records: 2
- Services: 6
- Experiments/Lab: 3
- Skills: 25
- Technologies: 24
- Experiences: 6
- Testimonials: 0
- Now items: 4
- Designs: 2

Latest verified project states:

Public/published:
- Campus Link
- Wisdom Portfolio
- SPIP - SCM Prospect Intelligence Platform

Private drafts:
- FMJ Handicraft Website
- GPA Calculator
- PixVault Backend
- Wikis Tech Legacy Website
- SCM Capital Creative & Financial Communications
- Edusplit School Partnership Pitch

Do not publish employer/client-sensitive work merely because it exists in the CMS. Public visibility must be intentional.

## 8. Content and positioning rules

Projects should tell the story in this order:

1. **Here is the problem.**
2. **Here is what I built.**
3. **Here is why it mattered.**
4. **Here is what changed.**

Do not turn case studies into technology lists.

For public work:
- software/web/product work should be visual and product-first;
- design work belongs in a masonry/Pinterest-style archive;
- research/presentation/branding work should use an editorial presentation.

No fake testimonials, metrics, awards, client outcomes or analytics.

## 9. Media upload architecture

The original Media Library used a Server Action to receive the file body. Vercel returned:

> Body exceeded 1 MB limit.

The current Phase 9 branch changed this architecture:

1. authenticated browser uploads directly to Supabase Storage;
2. Storage RLS authorizes the upload;
3. a small Server Action verifies ownership/path/file metadata;
4. the server inserts the `media_library` record.

Current limits:
- public assets: 15 MB
- private assets: 10 MB
- images: JPG, PNG, WebP, AVIF
- PDFs allowed where applicable

Do not revert this back to large multipart file uploads through Next.js Server Actions without understanding the Vercel body-size constraint.

## 10. Project publishing logic

Current intended behavior:

**Public + Save & Publish**
- creates/updates the public publication snapshot;
- appears in Work;
- can appear on homepage Selected Work.

**Featured**
- means pin/prioritize on homepage;
- it is no longer the sole condition for homepage visibility.

**Private + Save & Publish**
- keeps a published CMS state/snapshot if needed;
- must not create a public listing.

Project publishing should:
- save the current editor values first;
- validate the four case-study fields for public projects;
- update `project_publications`;
- revalidate `/`, `/work`, project route and admin editor.

## 11. Motion/loading rules

Loading system:
- public and admin route loaders exist;
- navigation and form submits display feedback;
- instant controls such as mobile-menu toggle and theme switch are excluded.

Reveal animation rule:
- **content must be visible by default**;
- JavaScript may mark content as `reveal-pending` before animation;
- animations must fail open;
- content must never depend on JavaScript successfully revealing it.

This was introduced after a bug caused most content below the hero to remain at `opacity: 0`.

## 12. Theme direction

Dark mode:
- nearly black foundation
- deep navy / dark-blue depth
- restrained blue illumination
- premium technical feel

Light mode:
- warm off-white/editorial feel
- derived from the supplied Dribbble/video interaction reference
- not a direct copy

Motion direction:
- floating hero/media entrance
- editorial text reveals
- smooth hover reactions
- section transitions
- subtle image scaling/elevation
- respect `prefers-reduced-motion`

## 13. Security posture

Required principles:
- RLS on exposed public tables
- approved CMS roles only
- no public signup
- no service-role secret in frontend
- private Storage bucket stays private
- public bucket does not imply public write access
- upload type/size validation
- confidential content must be removed from public payloads, not merely hidden with CSS
- soft-delete/trash for major content
- activity logging for meaningful admin actions

Latest Supabase Security Advisor warning:

> **Leaked Password Protection Disabled**

This remains a Phase 10 action.

## 14. Known credentials rule

An admin Auth user has already been provisioned. **No password or secret belongs in this repository or documentation.** If access is lost, reset credentials through Supabase Auth rather than copying passwords into code or docs.

## 15. Important repository files

Start here:

- `README.md`
- `docs/ROADMAP.md`
- `docs/ARCHITECTURE.md`
- `docs/DATABASE_AND_SECURITY.md`
- `docs/CMS_SPEC.md`
- `docs/PHASE_9_VISUAL_EXPERIENCE.md`
- `docs/TESTING_AND_RELEASE.md`
- `content/portfolio-content-seed.json`
- `supabase/migrations/`
- `.github/workflows/phase7-build.yml`

Key code:

- `app/page.tsx`
- `app/work/`
- `app/admin/(protected)/`
- `components/portfolio/`
- `components/loading/`
- `components/admin/`
- `lib/supabase/`
- `lib/auth/require-cms-user.ts`
- `features/projects/validation.ts`

## 16. What the next developer/AI should do first

1. Connect GitHub, Supabase and Vercel.
2. Confirm repository is `Wikis-tech/wisdom-portfolio`.
3. Confirm Supabase project ref is `mgzvfhrnrrvbmajkrmgp`.
4. Inspect PR #9 and branch `phase/09-visual-experience`.
5. Check latest Vercel deployment and production target.
6. Run/inspect the Phase 1-9 quality gate.
7. Smoke-test public routes and protected admin.
8. Test Media upload with a >1 MB image.
9. Test Public project Save & Publish and confirm Work/home visibility.
10. Only after Phase 9 is verified should Phase 10 begin.

## 17. Phase 10 required work

Phase 10 must include at minimum:

- full RLS audit
- auth/session audit
- leaked-password protection decision/enablement
- public signup verification disabled
- secret/env scan
- dependency audit
- Storage abuse tests
- upload size/MIME tests
- contact/quote rate-limit tests
- private attachment access tests
- confidential project tests
- admin role/authorization tests
- public draft-leak tests
- full CMS CRUD journeys
- trash/restore tests
- cache/revalidation tests
- loading/error/offline UX
- mobile/tablet/desktop QA
- cross-browser smoke tests
- keyboard/focus accessibility
- reduced-motion accessibility
- image optimization
- Core Web Vitals review
- error monitoring/observability
- backup/rollback runbook
- production migration verification
- final content/confidentiality review
- final production promotion

## 18. Non-negotiable continuity rules

- Do not work on Campus Link when asked to modify Wisdom Portfolio. Campus Link may be portfolio content, but it is a separate software project/repository.
- Preserve database portability by keeping migrations and important content snapshots in GitHub.
- Do not silently change project visibility from Private to Public.
- Do not publish confidential SCM/client material without explicit approval.
- Do not remove security controls to make a feature work.
- Do not use service-role keys to bypass an RLS problem.
- Do not treat a green build as proof of complete UX correctness; test actual admin-to-public flows.
- Do not copy the reference portfolio literally; adapt interaction principles to Wikis Tech identity.

---

**Handoff checkpoint:** Phase 9 active, Phase 1-9 CI green at `4bcea7b...`, latest preview verified READY, Phase 10 still outstanding.
