# Phase 8 — Navigation, SEO & Global Settings

## Delivered

### Navigation CMS
- Header and footer links are database-driven.
- Links support internal routes and HTTPS external destinations.
- Header items can render as normal links or a single CTA style.
- Items can be enabled/disabled and ordered without code changes.
- Desktop and mobile navigation share the same CMS source.

### Global Site Settings
- Professional name and brand name
- Navigation brand label
- Site origin / canonical base URL
- Contact email and WhatsApp/phone
- Logo and favicon URLs
- Résumé URL
- Availability status/message
- Global/default CTA
- Footer tagline and copyright text
- Social profiles

### SEO
- Editable metadata for Home, Work, About, Archive, Lab, Services, Pricing, Contact and Quote.
- Editable title, description, Open Graph image, canonical override and noindex setting.
- Project-level SEO overrides stored with project content and copied into the published snapshot.
- Lab experiment SEO overrides.
- Dynamic project and Lab metadata.
- XML sitemap from indexable static pages, published projects and public Lab experiments.
- robots.txt blocks private admin routes and the noindex quote flow.
- Root metadata includes canonical origin, application identity, favicon, Open Graph and Twitter metadata.

### Analytics readiness
- Analytics is OFF by default.
- Admin explicitly shows Not connected when disabled.
- Optional GA4 measurement ID support.
- No secret key is stored in the CMS or shipped to the browser.
- External-link and CTA conversion event hooks only run when analytics is enabled.

### Public experience
- Shared CMS-driven footer across public pages.
- Branded 404 page.
- Branded global error recovery screen.
- Navigation logo/brand is CMS-driven.

## Security model

- navigation_items, social_links, seo_settings and analytics_settings use RLS.
- Anonymous users receive SELECT only.
- Anonymous INSERT/UPDATE/DELETE privileges are not granted.
- CMS writes require an authenticated active admin/editor through private.is_cms_user().
- External URLs accepted by Phase 8 settings must use HTTPS.
- Analytics settings contain public measurement configuration only, never provider secrets.
- Database changes are stored in supabase/migrations/0011_phase_8_site_operations.sql for portability.

## Acceptance checklist

### Navigation
- Edit a label in Admin → Navigation and verify public desktop/mobile nav.
- Disable an item and verify it disappears.
- Reorder items and verify order.
- Add an internal route beginning with /.
- Add an HTTPS external route and verify it opens safely.
- Confirm invalid non-HTTPS external destinations are rejected.

### Global settings
- Change navigation brand and verify it appears globally.
- Change availability/footer text and verify public footer.
- Add/remove social links.
- Add favicon/logo URLs and verify metadata/navigation.
- Verify changing Site URL changes canonical/sitemap host only to an HTTPS origin.

### SEO
- Verify page source/metadata for each major public route.
- Verify /sitemap.xml is valid and contains indexable pages plus public projects/experiments.
- Verify /robots.txt blocks /admin and /quote.
- Verify Quote has noindex metadata.
- Add project SEO overrides, publish, and verify /work/[slug].
- Add Lab SEO overrides and verify /lab/[slug].

### Analytics
- With analytics disabled, verify no Google Analytics script is emitted.
- With analytics enabled and a valid G- measurement ID, verify the GA script appears.
- Verify invalid measurement IDs are rejected.
- Verify external-click/CTA hooks do not execute while analytics is disabled.

### Security
- RLS enabled on all four Phase 8 tables.
- anon SELECT = true.
- anon INSERT/UPDATE/DELETE = false.
- unauthenticated writes fail.
- authenticated inactive/non-CMS users cannot write.
- Supabase Security Advisor has no new Phase 8 exposure finding.

### Build/release gate
- ESLint passes.
- TypeScript passes.
- next build passes.
- Production server boots.
- Smoke tests pass for /, /work, /about, /archive, /lab, /services, /pricing, /contact, /quote, /sitemap.xml, /robots.txt and /admin/login.
- Vercel Phase 8 preview reaches READY.

## Deferred to Phase 10

- Enable Supabase leaked-password protection.
- Final authentication policy review including disabling public sign-ups for the private CMS.
- Full accessibility and performance audit.
- Final browser/device matrix and authenticated admin end-to-end testing.
