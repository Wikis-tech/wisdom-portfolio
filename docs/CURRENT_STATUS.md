# Current Project Status

Last verified handoff checkpoint for **Wisdom Portfolio**.

## Active development

- Branch: `phase/09-visual-experience`
- Draft PR: **#9**
- Head commit: `4bcea7b59633f5fef46934f75c40e387e326c46d`
- GitHub quality gate: **SUCCESS**
- Vercel preview for head commit: **READY**
- Supabase project ref: `mgzvfhrnrrvbmajkrmgp`

## Production warning

Production has not always matched the newest branch. Before testing a fix, confirm the production deployment commit in Vercel.

At the last verified checkpoint, production had previously been promoted to `8fcb7eca...` while newer Phase 9 preview builds existed.

## Latest fixes that must not be lost

1. **Reveal animation fail-open fix**
   - content is visible by default;
   - only `.reveal-pending` elements are temporarily hidden;
   - animation failure must never blank the site.

2. **Loading system**
   - branded public/admin loading animation;
   - navigation/forms show loading feedback;
   - theme/mobile-menu instant controls are excluded.

3. **Media upload fix**
   - file binary uploads directly from authenticated browser to Supabase Storage;
   - server verifies metadata/path and creates media record;
   - avoids Vercel/Next Server Action 1 MB body failure.

4. **Project publication fix**
   - public projects are listed from `project_publications`;
   - homepage can display published projects;
   - Featured acts as priority/pin;
   - Private projects never appear publicly.

## Current Supabase content snapshot

- Projects: 9
- Publications: 3
- Media: 2
- Services: 6
- Experiments: 3
- Skills: 25
- Technologies: 24
- Experiences: 6
- Testimonials: 0
- Now items: 4
- Designs: 2

Public projects:
- Campus Link
- Wisdom Portfolio
- SPIP

## Known security warning

Supabase Security Advisor currently reports:

- **Leaked Password Protection Disabled**

Do not fix authorization problems by adding service-role secrets to the browser.

## Next milestone

Finish Phase 9 verification, then execute **Phase 10 - Security, Performance, Full QA & Production Launch**.
