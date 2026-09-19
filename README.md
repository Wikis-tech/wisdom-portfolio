# WIKIS TECH — Portfolio + Admin CMS

Production portfolio and portfolio operating system for **Wisdom / Wikis Tech Corporation**.

## Product thesis

> I use technology, design and intelligent systems to turn ideas and real-world problems into useful digital products and experiences.

The product combines two connected experiences:

- **Public portfolio** — a premium, editorial showcase of work across software, product, design, AI, strategy and business technology.
- **Private Admin CMS** — a secure portfolio operating system for managing projects, designs, experiments, services, pricing, messages, quote requests, media, SEO, navigation and site settings without editing source code.

Both experiences share **Supabase/PostgreSQL + Supabase Storage** as the source of truth.

## Core principle

Normal content changes must never require a GitHub commit or Vercel redeployment. Publishing from the CMS updates the public portfolio through database-backed content and cache revalidation.

## Planned stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- Supabase PostgreSQL
- Supabase Auth
- Supabase Storage
- Vercel
- GitHub

## Public routes

- /
- /work
- /work/[slug]
- /about
- /lab
- /services
- /pricing
- /quote
- /contact

## Private routes

- /admin/login
- /admin
- /admin/pages/home
- /admin/projects
- /admin/projects/new
- /admin/projects/[id]
- /admin/designs
- /admin/lab
- /admin/about
- /admin/experience
- /admin/services
- /admin/pricing
- /admin/quotes
- /admin/messages
- /admin/skills
- /admin/technologies
- /admin/testimonials
- /admin/media
- /admin/navigation
- /admin/seo
- /admin/settings
- /admin/trash

## Documentation

See the `docs/` directory:

- [Product Requirements](docs/PRODUCT_REQUIREMENTS.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Database & Security](docs/DATABASE_AND_SECURITY.md)
- [CMS Specification](docs/CMS_SPEC.md)
- [Design System](docs/DESIGN_SYSTEM.md)
- [Content Model](docs/CONTENT_MODEL.md)
- [10-Phase Delivery Plan](docs/ROADMAP.md)
- [Testing & Production Readiness](docs/TESTING_AND_RELEASE.md)
- [Contribution & Branching](docs/CONTRIBUTING.md)
- [Decision Log](docs/DECISIONS.md)

## Status

**Phase 0 / Documentation foundation complete.**

Implementation begins with Phase 1: application foundation, design system, Supabase setup, authentication and authorization.

## Non-negotiables

- No fake testimonials, analytics, project metrics, clients, outcomes or awards.
- No confidential SCM information is to be published.
- Public reads are restricted to published/public content.
- Admin writes require authenticated role-based access.
- RLS is mandatory.
- Service-role secrets must never reach the browser.
- Important CMS actions must work; no decorative fake buttons.
- Long-form editing supports drafts, autosave and safe publish workflows.
- Major content uses trash/restore before permanent deletion.
