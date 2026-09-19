# Database & Security

## 1. Principles

PostgreSQL is the source of truth. Use relational modelling for relationships and structured JSON only where flexible block payloads are genuinely appropriate.

Every public-facing table must have an explicit publication/visibility policy. Every admin mutation must be authenticated, authorized and validated server-side.

## 2. Core tables

Identity: `profiles`.

Site: `site_settings`, `social_links`, `navigation_items`, `page_sections`, `seo_settings`.

Projects: `projects`, `project_categories`, `project_category_links`, `project_blocks`, `project_media`.

Creative: `designs`, `design_categories`, optional link table.

Lab: `experiments`.

Business: `services`, `pricing_packages`, optional `service_pricing_links`, `quote_requests`, `contact_messages`.

Profile: `about_content`, `journey_items`, `experiences`, `education`, `skills`, `technologies`, `testimonials`, `now_items`.

Media/operations: `media_library`, `activity_logs`.

## 3. Shared lifecycle columns

Where applicable:

- `id uuid primary key`
- `visibility`
- `sort_order`
- `created_at`
- `updated_at`
- `published_at`
- `archived_at`
- `deleted_at`

Use database triggers/functions for reliable `updated_at` where appropriate.

## 4. Project model

Projects include title, slug, summary, year, client, role, status, visibility, featured flag, confidential flag, hero/card media relationships, live URL, GitHub URL and ordering.

Project status enum candidates: Shipped, Live, In Development, Prototype, Experiment, Concept, Archived.

A project can have many categories, ordered blocks and media assets.

Blocks use a controlled `block_type` plus validated payload schema. Supported types include heading, paragraph, image, gallery, video, quote, stats, two-column text, full-width image, technology/code, before/after, embed, spacer and CTA.

## 5. Roles

Initial roles:

- `admin`: full CMS management.
- `editor`: content operations allowed by explicit policy.

No public signup. Admin users are provisioned deliberately.

## 6. RLS policy intent

Public anonymous role:
- SELECT only published, visible, non-deleted public content.
- INSERT only through controlled server endpoints for contact/quote submissions; direct broad table access is not granted.

Authenticated CMS users:
- policies require approved profile role.
- admin receives intended CRUD.
- editor receives only scoped CRUD.

Private quote attachments are never public.

## 7. Secrets

Allowed in browser: public Supabase URL and anon/publishable key.

Server-only: service-role key and any privileged third-party secrets.

Never prefix server secrets with `NEXT_PUBLIC_`. Never log credentials or private signed URLs unnecessarily.

## 8. Upload security

Images: JPEG, PNG, WebP, AVIF.

Documents: PDF only where required.

Validate extension, MIME type, byte size and ownership. Generate safe storage paths rather than trusting client filenames. Reject executable/arbitrary uploads.

Quote attachments go to the private bucket.

## 9. Public form protection

Use server-side schema validation, rate limiting, honeypot and optional CAPTCHA escalation. Normalize and bound text lengths. Validate URLs/phone/email formats as applicable.

Do not expose raw database mutation credentials to the browser.

## 10. Confidentiality

`confidential=true` causes public rendering to suppress repository/private links and sensitive fields. Public screenshots must be intentionally sanitized; confidentiality cannot be solved by CSS-hiding sensitive DOM.

## 11. Deletion

Major entities use soft deletion and Trash. Permanent deletion is a privileged explicit action. Media deletion must check references before destroying the underlying object.

## 12. Audit

Record meaningful admin operations with user ID, action, entity type/id, minimal metadata and timestamp. Avoid storing secrets or unnecessary personal data in activity metadata.
