# 10-Phase Delivery Roadmap

The roadmap deliberately builds the operating system before polishing the public showcase. A phase is complete only when its acceptance criteria pass.

## Phase 1 — Foundation, Design System & Supabase Core

Create Next.js/TypeScript/Tailwind application structure; tokens, typography and shared UI primitives; Supabase clients; migration framework; base schema; Auth; profiles/roles; protected admin routes; RLS baseline; environment validation; admin login; public/admin layouts.

**Exit:** app builds/deploys, admin login is private, unauthorized users cannot access admin data, design tokens work responsively, migrations are reproducible.

## Phase 2 — Media, Admin Shell & CMS Infrastructure

Build admin navigation/dashboard shell, media library, Storage buckets/policies, validated uploads, shared form patterns, toast/error/loading/empty states, activity log foundation, soft-delete/trash primitives, search foundations.

**Exit:** authenticated admin can safely upload/manage reusable media and operate a production-quality CMS shell.

## Phase 3 — Projects CMS & Publishing Engine

Implement projects/categories, featured ordering, modular project blocks, project media, confidential mode, draft/publish, preview, autosave, dirty-state warning, duplicate/archive/trash, per-project SEO and publish-triggered revalidation.

**Exit:** a complete case study can be created, previewed, published, reordered, edited as draft and safely removed/restored without code changes.

## Phase 4 — Homepage CMS & Public Portfolio Core

Implement page_sections, editable hero and rotating words, homepage drag/reorder/show-hide, Selected Work settings, public navigation/footer, public Home, Work filtering and dynamic /work/[slug] rendering from published CMS data.

**Exit:** changing/publishing hero, homepage order or featured project order changes the public site without deployment.

## Phase 5 — Creative Archive, About, Experience & Profile System

Implement Designs/Visual Archive, About, journey timeline, education, experience, résumé management, skills, technologies, CRAFT/capabilities and corresponding public surfaces.

**Exit:** professional profile and visual work are fully CMS-driven and public pages gracefully hide missing fields.

## Phase 6 — Lab, Services, Pricing & Now

Implement experiments/Lab, Services, pricing packages, service-package relationships, Now items, section disable/visibility and public Lab/Services/Pricing views.

**Exit:** Wisdom can launch/archive experiments, edit service offerings and change/disable prices without touching code.

## Phase 7 — Quote CRM, Contact Inbox & Testimonials

Implement public Quote/Contact forms, server validation, rate limiting, anti-spam, private brief uploads, quote workflow, message statuses, email/WhatsApp quick actions, real-testimonial management and conditional public testimonial rendering.

**Exit:** submissions are safely stored, visible only to authorized admin users, workflow transitions work and no testimonial section appears without published real data.

## Phase 8 — Site Operations: Navigation, SEO, Settings & Analytics Readiness

Implement navigation CMS, global/site settings, social links, favicon/logo/resume replacement, SEO defaults/per-page metadata, sitemap, robots, canonical URLs, structured metadata, analytics configuration state and external-click/conversion instrumentation hooks.

**Exit:** identity/navigation/SEO/social configuration is editable; search-engine outputs are valid; unconfigured analytics explicitly says it is not connected.

## Phase 9 — Public Experience, Motion, Responsive & Accessibility Polish

Complete editorial layouts, project storytelling compositions, masonry viewer, mobile navigation, restrained motion/parallax, desktop cursor enhancements, reduced-motion behavior, keyboard/focus semantics, responsive compositions and cross-device visual QA.

**Exit:** all target breakpoints and keyboard flows are usable, motion degrades correctly and the site feels intentionally designed rather than template-derived.

## Phase 10 — Security, Performance, Testing & Production Launch

RLS/authorization audit, secret/env audit, upload abuse tests, rate-limit tests, dependency review, Core Web Vitals/image optimization, code splitting, cache/revalidation verification, error/offline states, regression suite, cross-browser tests, production migrations, monitoring, backup/rollback runbook and final Vercel launch.

**Exit:** production checklist passes with no critical security or functional gaps; CMS and public site are verified end-to-end.

## Working rule

Each phase should use its own branch/PR, include migrations/tests/docs, and be accepted before the next phase is treated as complete. Do not jump ahead by hard-coding content that belongs in a later CMS phase.
