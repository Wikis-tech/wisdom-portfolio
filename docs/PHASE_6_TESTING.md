# Phase 6 — Lab, Services, Pricing & Now

## Delivered

- Lab/Experiments CMS with public/draft/private/archive states
- Experiment detail pages
- CRAFT framework editor and public Lab presentation
- Services CMS with enable/disable, featured state, pricing associations, CTAs and ordering
- Pricing settings, packages, visibility, custom-quote mode, featured state, duplication and ordering
- Services ↔ pricing relationship table
- Now CMS and homepage "Right now" section
- Homepage sections now render in the exact order stored in `page_sections`
- Homepage Phase 6 previews for Lab, Services, Pricing and Now
- Phase 6 soft-delete support wired into Trash
- All Phase 6 public-schema tables use RLS
- SQL remains source-controlled under `supabase/migrations/0006_phase_6_lab_services_pricing_now.sql`

## Phase 6 security gate

- Anonymous users may only read public experiments.
- Anonymous users may only read enabled, non-deleted services.
- Anonymous users may only read visible, non-deleted pricing packages.
- Draft/private/archived experiments remain CMS-only.
- CMS writes require an active CMS user.
- Permanent deletion of experiments/services/pricing packages requires the admin role.
- No service-role or secret key belongs in client code.
- Public pages never query hidden draft experiment data intentionally.

## Acceptance checklist

### Lab
- Create experiment.
- Save it as Draft and verify it does not appear on `/lab`.
- Set visibility to Public and verify it appears.
- Open `/lab/[slug]`.
- Hide/archive it and verify public removal.
- Edit CRAFT and verify the public section changes.

### Services
- Create a service and verify it renders when Enabled.
- Disable it and verify it disappears publicly.
- Associate one or more pricing packages and save.
- Verify sort order is respected.

### Pricing
- Disable the entire pricing section and verify the public fallback.
- Re-enable it.
- Create fixed-price and Custom Quote packages.
- Toggle visibility.
- Duplicate a package; the copy must start hidden.
- Featured package uses differentiated presentation.

### Now
- Add, edit, hide and delete Now items.
- Verify homepage updates without redeploy.

### Homepage
- Reorder Home Editor section numbers.
- Verify actual public render order follows `page_sections.sort_order`.
- Disable a Phase 6 section and verify it is omitted.

### Security
- Anonymous requests cannot read draft/private experiments.
- Anonymous requests cannot read disabled services.
- Anonymous requests cannot read hidden pricing packages.
- An inactive CMS user cannot write Phase 6 content.
- Editor cannot permanently delete rows reserved for admin.
- Supabase Security Advisor has no new Phase 6 schema/RLS findings.

## Deferred intentionally

- Quote CRM and the real `/quote` submission workflow are Phase 7.
- Contact inbox is Phase 7.
- Global navigation/site settings/SEO are Phase 8.
- Final animation/accessibility/performance refinement is Phase 9–10.
