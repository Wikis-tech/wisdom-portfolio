# Architecture

## 1. System context

```text
                         SUPABASE
              PostgreSQL + Auth + Storage
                         |
          +--------------+--------------+
          |                             |
          v                             v
 PUBLIC NEXT.JS APP                PRIVATE ADMIN CMS
 reads published data             authenticated CRUD
 server-first rendering           draft/publish workflows
          |                             |
          +--------------+--------------+
                         |
                 cache revalidation
                         |
                       VERCEL
```

The public portfolio and CMS are route groups/surfaces of the same Next.js application and share typed domain/data layers.

## 2. Application structure

Target structure:

```text
app/
  (portfolio)/
  admin/
  api/
components/
  portfolio/
  admin/
  shared/
features/
  projects/
  media/
  quotes/
  cms/
lib/
  supabase/
  auth/
  validation/
  seo/
types/
hooks/
styles/
supabase/
  migrations/
  seed/
docs/
```

Prefer Server Components for public data-heavy pages. Use Client Components only for interaction, animation and local UI state. Use Server Actions or Route Handlers for mutations depending on boundary needs.

## 3. Data flow

Public:
request → server query → published/public database rows → render → cache/revalidation strategy.

Admin:
authenticated request → server authorization → validation → mutation → activity log → revalidate affected public paths/tags → feedback toast.

No public content management depends on Git commits.

## 4. Domain modules

Projects: metadata, categories, blocks, media, draft/publish, featured ordering, confidentiality.

Pages: homepage sections and section settings.

Media: shared asset library backed by Supabase Storage.

Business: services, pricing, quote mini-CRM and messages.

Profile: about, education, experience, skills, technologies, testimonials, now.

Site: navigation, SEO, settings and social links.

Operations: activity logs, trash, search, filtering and analytics integration state.

## 5. Draft/publish model

Published content must be stable while edits are drafted. Prefer versioned/draft records or a clear published snapshot model rather than blindly exposing mutable rows.

Preview requires an authenticated admin session and explicitly reads draft state. Public queries must never return drafts.

## 6. Cache strategy

Use tag/path revalidation after publish operations. Editing a draft does not invalidate public pages. Publishing a project should revalidate its project route, Work and any homepage section that references it.

## 7. Media

Supabase Storage buckets:

- `portfolio-public`: public project/design/profile assets.
- `portfolio-private`: quote briefs and confidential material.

Database media records hold metadata and relationships. Private media is delivered through short-lived signed URLs only after authorization.

## 8. Search

Admin search is server-backed and can initially use PostgreSQL search/ILIKE for small datasets. Keep interfaces abstract enough to move to full-text search later.

## 9. Observability

Production should capture application errors, failed mutations, upload failures and form abuse signals. Analytics is optional/configurable; never fabricate metrics when not connected.

## 10. Deployment

GitHub is source control; Vercel is deployment; Supabase is persistent application data. Schema changes are migration-driven and reviewed like code. Content changes occur through CMS.
