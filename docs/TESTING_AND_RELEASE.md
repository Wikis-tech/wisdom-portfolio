# Testing & Production Readiness

## Test layers

Static: TypeScript strict checks, linting and formatting.

Unit: validation, authorization helpers, content transformations, slug/status logic.

Integration: database queries, RLS expectations, draft/publish, storage metadata, form workflows.

End-to-end: login, project CRUD, media upload, homepage publish, public project visibility, quote/contact submission, quote workflow, trash restore.

Accessibility: automated checks plus keyboard/manual focus and reduced-motion verification.

Visual/responsive: target widths 360, 390, 430, 768, 1024, 1280, 1440, 1920.

## Critical security tests

- anonymous admin route/data access denied
- non-admin privileged mutation denied
- draft records never leak publicly
- private storage object cannot be fetched publicly
- service-role key absent from client bundle
- disallowed upload rejected
- oversized upload rejected
- rate limiting works
- confidential project fields do not render publicly
- deleted/trash records do not appear publicly

## CMS acceptance journeys

1. Create project → autosave → preview → publish → public route visible.
2. Edit published project as draft → public remains unchanged → publish → public updates.
3. Feature/reorder project → homepage order updates.
4. Upload media once → reuse in another editor.
5. Reorder/hide homepage section → publish → public home updates.
6. Change price → publish → public price updates.
7. Submit quote → admin sees New → move through workflow.
8. Submit contact → unread count increments → archive.
9. Replace résumé → public download uses current asset.
10. Trash project → public disappears → restore → republish as intended.

## Performance

Measure LCP, CLS and INP on representative mobile and desktop pages. Ensure responsive `next/image` sizing, lazy loading for non-critical media, optimized fonts and lazy-loaded heavy interaction libraries.

## Release checklist

- migrations applied and versioned
- production env variables verified
- RLS audited
- storage policies audited
- admin account/role verified
- no public registration
- no fake seed content in production
- robots/sitemap/canonical metadata verified
- 404/error/loading states verified
- contact/quote abuse controls enabled
- monitoring/logging configured
- backup and rollback procedure documented/tested
- cross-browser smoke test passed
- public confidentiality review completed
