# Phase 9 — Visual Experience & Work Presentation

## Direction

Phase 9 uses the interaction and layout principles from the supplied portfolio reference and video without copying its visual identity. The portfolio remains dark, technical and distinctly Wikis Tech, with a restrained deep-blue layer added to the existing black system.

Key principles:
- stronger project-first presentation
- large editorial typography
- calm dark surfaces with dark-blue depth
- visible hover states and subtle motion
- different presentation systems for different kinds of work
- responsive, reduced-motion-safe interactions

## Admin improvements

### Brand assets
Admin → Site Settings now includes direct upload controls for:
- logo
- favicon

Uploads:
- use the existing portfolio-public bucket
- require an authenticated CMS user
- accept PNG, JPG, WebP or AVIF
- use unique non-overwriting paths
- never require a service-role or secret key
- update site_settings.logo_url / favicon_url after upload

### Project visuals
Project Editor now includes:
- Work preview image
- Case-study hero image

These use the existing projects.card_media_id and projects.hero_media_id fields and the existing media_library table. The uploaded image becomes part of the published snapshot after Save & Publish, preserving draft/publish separation.

## Public work system

### Websites / software / digital products
Projects categorised as Software, Product, UI/UX or AI render as large visual product cards with preview image, problem/short description, outcome, live-site affordance when available, and a case-study link.

### Research / strategy / presentations
Business Research, Presentation and Branding projects are grouped into a more editorial project section.

### Design work
Designs use a masonry / Pinterest-style visual wall with varied card ratios and hover motion.

### Other projects
Projects not captured by the main groups fall into a separate selected-work section rather than disappearing.

## Motion & UI

- deep-blue radial background accents
- blue-tinted card surfaces
- hover elevation
- subtle border illumination
- image scale on hover
- service-card hover states
- masonry-card hover states
- reduced-motion support remains respected

## Security review

- branding and project uploads use authenticated server actions
- uploads use existing Storage RLS policies
- no service-role key is introduced
- public bucket affects read access only; upload/update/delete still require Storage RLS
- file types and sizes are validated server-side
- paths are randomised and non-overwriting

## Verification

Phase 1–9 quality gate:
- dependencies ✅
- ESLint ✅
- TypeScript ✅
- production build ✅
- server boot ✅
- public route smoke tests ✅

Vercel Phase 9 preview: READY.