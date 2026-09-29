# Phase 7 — Quote CRM, Contact Inbox & Testimonials

## Delivered

### Public
- /contact with live submission form
- /quote with structured quote request form
- Optional private brief upload (PDF/JPG/PNG/WebP, max 10 MB)
- Budget remains optional
- Contact/quote success and failure states
- Honeypot spam field
- Database-backed rate limits
- Public forms submit through Supabase Edge Function, not directly to Postgres
- Pricing package CTAs can now route to /quote
- Published testimonials can appear on the homepage
- Testimonials section renders nothing when no real testimonial is published

### Admin
- /admin/messages
- /admin/messages/[id]
- /admin/quotes
- /admin/quotes/[id]
- /admin/testimonials
- /admin/testimonials/[id]
- Message statuses: unread, read, replied, archived
- Quote statuses: new, reviewed, contacted, negotiating, accepted, declined, completed, archived
- Quick email actions
- Quick WhatsApp action when a phone number exists
- Private quote attachment download via short-lived signed URL
- Dashboard counters for unread messages and new quotes
- System activity for incoming public messages and quote requests
- Testimonials use safe archive/restore before permanent deletion

## Security model

1. Anonymous users have NO INSERT privilege on contact_messages or quote_requests.
2. Public forms call the public portfolio-lead-submit Edge Function.
3. The Edge Function validates and normalizes every field.
4. The Edge Function uses honeypot + IP/email/content-based database rate limits.
5. The Edge Function alone uses Supabase's server-side service role credential.
6. The service role credential is never shipped in Next.js client code or GitHub.
7. Quote attachments are uploaded only into portfolio-private.
8. File type, extension and 10 MB size are validated before storage.
9. Admin downloads use expiring signed URLs.
10. CMS reads/updates are protected with authenticated RLS policies.
11. Permanent message/quote deletion requires admin.
12. Testimonials are public only when visibility=true and deleted_at is null.
13. form_rate_limits has RLS plus an explicit false client policy and no anon/authenticated grants.

## Rate limits

Contact:
- 5 per IP / hour
- 3 per email / hour
- exact duplicate: 1 / 10 minutes

Quote:
- 3 per IP / 6 hours
- 2 per email / 6 hours
- exact duplicate: 1 / 30 minutes

These are application-level controls. Phase 10 should additionally review Vercel Firewall / bot controls for production.

## Acceptance checklist

### Contact
- Submit a valid message and see a success state.
- Verify it appears in /admin/messages.
- Change status through unread → read → replied → archived.
- Use Email Client.
- Verify anonymous Supabase Data API cannot insert directly into contact_messages.
- Submit malformed/empty input and confirm rejection.
- Fill the hidden honeypot and confirm no real inbox row is created.

### Quote
- Submit every project type.
- Submit with no budget.
- Submit every budget range.
- Submit every contact preference.
- Upload PDF/JPG/PNG/WebP under 10 MB.
- Reject executable, unsupported or oversized files.
- Verify the private attachment is not publicly accessible.
- Open it from admin through a short-lived signed URL.
- Move a quote through the full CRM workflow.
- Test Email and WhatsApp actions.

### Testimonials
- With no published testimonials, homepage section must not render.
- Add a real testimonial as hidden: it must remain private.
- Publish it and verify homepage rendering.
- Archive it and verify immediate public removal.
- Restore it from Trash; it must return hidden, not auto-publish.

### Dashboard
- Unread message count is accurate.
- New quote count is accurate.
- Public lead events appear in recent activity.

### Security
- RLS enabled on all Phase 7 public-schema tables.
- anon has no insert privilege on contact_messages or quote_requests.
- rate-limit RPC executable only by service_role.
- private bucket remains private.
- service role never appears in NEXT_PUBLIC_* variables or repository files.
- Supabase Security Advisor has no new actionable Phase 7 database exposure finding.

## Known project-level item

Supabase Auth currently still reports Leaked Password Protection Disabled. Enable it before launch as part of final hardening.

## Vercel note

The Next.js project excludes supabase/functions/**/* from its TypeScript compile because Edge Functions run in the Supabase Deno runtime, not the Next.js runtime.

## Deployment verification marker

A fresh Vercel preview must build from this branch after the quote-page syntax repair. Do not accept deployments pinned to commit c25adc or older.
