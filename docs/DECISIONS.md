# Architecture Decision Log

## ADR-001 — One Next.js product, two experiences

**Decision:** public portfolio and admin CMS live in one Next.js codebase with separated route/component/domain boundaries.

**Reason:** shared types/data logic, simpler deployment and reliable publish-to-revalidate behavior while preserving distinct visual systems.

## ADR-002 — Supabase is content source of truth

**Decision:** PostgreSQL + Storage own mutable portfolio content; GitHub owns application code.

**Reason:** normal portfolio updates must not require commits or redeployments.

## ADR-003 — Server-first data and mutations

**Decision:** public content is primarily server-rendered; privileged mutations execute through trusted server boundaries.

**Reason:** reduce client JavaScript and avoid exposing privileged credentials or trusting browser authorization.

## ADR-004 — RLS is mandatory

**Decision:** authorization is enforced in PostgreSQL in addition to application checks.

**Reason:** hidden navigation is not security; defense in depth is required.

## ADR-005 — Structured modular case studies

**Decision:** projects use typed ordered content blocks rather than one giant rich-text field.

**Reason:** supports distinctive editorial compositions while keeping content manageable.

## ADR-006 — Draft and published states are separated

**Decision:** editing published content must not immediately change the public site.

**Reason:** supports safe long-form editing, preview and intentional publishing.

## ADR-007 — Media is reusable first-class content

**Decision:** assets live in a media library and can be selected across editors.

**Reason:** avoids duplicate uploads and allows alt/caption metadata management.

## ADR-008 — Soft deletion for major entities

**Decision:** projects and other important content move to Trash before permanent deletion.

**Reason:** reduces accidental destructive operations.

## ADR-009 — No fabricated portfolio proof

**Decision:** unsupported metrics/testimonials/outcomes are never seeded to make the site appear fuller.

**Reason:** credibility is a core product requirement.

## ADR-010 — Public art direction and admin UI are intentionally different

**Decision:** public is editorial/expressive; admin is compact/productivity-focused.

**Reason:** each surface serves a different job and should not share aesthetics blindly.
