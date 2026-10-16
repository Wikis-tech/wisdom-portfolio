# Operations & Continuity Runbook

## Services

### GitHub
Repository: `Wikis-tech/wisdom-portfolio`

GitHub is the source of truth for:
- application code
- migrations
- documentation
- CI
- portable content snapshot

### Supabase
Project ref: `mgzvfhrnrrvbmajkrmgp`

Supabase owns:
- PostgreSQL content
- Auth
- Storage
- RLS
- CMS data

Buckets:
- `portfolio-public`
- `portfolio-private`

Never expose secret/service keys in frontend code.

### Vercel
Project: `wisdom-portfolio`

Public URL:
- `https://wisdom-portfolio-five.vercel.app`

Preview branch alias:
- `https://wisdom-portfolio-git-phase-09-visual-experience-campus-link.vercel.app`

Always verify the deployment commit before diagnosing a problem.

## Required environment variables

Expected public variables:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
NEXT_PUBLIC_SITE_URL
```

Do not commit real values.

## Local validation

Before release:

```bash
npm install
npm run lint
npm run typecheck
npm run build
```

The repository also has a GitHub Actions quality gate in:

`.github/workflows/phase7-build.yml`

Despite the filename, it has evolved into the **Phase 1-9 Quality Gate**.

## Public route smoke test

Verify at least:

- `/`
- `/work`
- `/work/[slug]`
- `/about`
- `/lab`
- `/services`
- `/pricing`
- `/quote`
- `/contact`

Check:
- content renders
- no invisible reveal content
- theme toggle works
- mobile navigation works
- loading UI clears
- footer renders
- no server/runtime errors

## Admin smoke test

Verify:

- `/admin/login`
- `/admin`
- Home
- Projects
- Design Archive
- Lab
- About
- Experience
- Now
- Services
- Pricing
- Quotes
- Messages
- Skills
- Technologies
- Testimonials
- Navigation
- Media
- SEO
- Site Settings
- Trash

Critical journeys:

### Media
Upload an image larger than 1 MB.
Expected: direct Supabase Storage upload succeeds and media record appears.

### Project publishing
Create/edit a project:
- complete problem / built / mattered / changed;
- set Visibility = Public;
- Save & Publish.

Expected:
- record becomes published;
- publication exists in `project_publications`;
- project appears in Work;
- homepage Selected Work can show it;
- Featured pins/prioritizes it.

### Private project
Visibility = Private + publish.
Expected:
- never appears on public site.

### Draft separation
Edit a published project without republishing.
Expected:
- public snapshot remains stable until publish.

## Supabase security checks

Run Security Advisor after schema/security changes.

Confirm:
- public tables have RLS;
- anon only reads intended published/public data;
- authenticated CMS users require approved profile;
- private Storage cannot be fetched anonymously;
- Storage writes require CMS auth;
- public bucket does not allow public writes;
- no service-role key in browser environment.

## Release/promotion rule

Do not promote a deployment solely because it says READY.

Before promotion:
1. CI green
2. preview route smoke test
3. admin smoke test
4. runtime logs clean
5. publication flow tested
6. media upload tested
7. security advisor reviewed

## Content safety

The repository is public.

Never commit:
- passwords
- Supabase secret/service-role keys
- private signed URLs
- customer/client private information
- personal home address
- confidential SCM information

## Database portability

All schema changes should have matching SQL under `supabase/migrations/`.

Important portfolio content also has a source-controlled snapshot:

`content/portfolio-content-seed.json`

Keep this updated when doing major content migrations or handoffs.
