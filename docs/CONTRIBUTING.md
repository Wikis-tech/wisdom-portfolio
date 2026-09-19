# Contribution & Delivery Workflow

## Branching

Keep `main` deployable.

Recommended implementation branches:

- `phase/01-foundation`
- `phase/02-media-admin-core`
- `phase/03-projects-cms`
- `phase/04-home-public-core`
- `phase/05-profile-archive`
- `phase/06-lab-services-pricing`
- `phase/07-leads-messaging`
- `phase/08-site-operations`
- `phase/09-experience-polish`
- `phase/10-launch-hardening`

Use PRs for review and phase acceptance.

## Commit convention

Prefer scoped conventional messages:

- `feat(projects): add draft publishing workflow`
- `fix(auth): enforce admin role server-side`
- `docs(roadmap): update phase acceptance criteria`
- `test(rls): cover anonymous project reads`
- `perf(media): optimize gallery image loading`

## Definition of done

A feature is not done because its UI exists. It is done when:

- persistence works
- authorization is enforced
- validation exists server-side
- loading/error/empty states exist
- responsive behavior is checked
- accessibility basics pass
- tests cover critical logic
- no fake action/buttons remain
- docs/schema are updated when necessary

## Database changes

All schema/policy/function changes go through versioned Supabase migrations. Never make an undocumented production-only schema change.

## Content

Seed data is clearly identified and must not invent professional claims. Sensitive SCM material is never used as development seed content.

## Pull requests

PR descriptions should state scope, migrations, security implications, routes changed, test evidence, screenshots where useful and known follow-ups.
