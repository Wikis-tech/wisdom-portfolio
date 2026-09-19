# Admin CMS Specification

## Admin shell

Dark, calm, productivity-focused interface inspired by modern developer tools rather than the artistic public portfolio.

Sidebar:
Overview; Content: Home, Projects, Design Archive, Lab, About, Experience; Business: Services, Pricing, Quotes, Messages; Site: Skills, Technologies, Testimonials, Navigation, Media, SEO; Settings: Site Settings, Account; View Portfolio.

Mobile uses a drawer. Desktop sidebar is collapsible.

## Dashboard

Greeting is time-aware, e.g. “Good morning, Wisdom.”

Cards: Published Projects, Draft Projects, Designs, Experiments, New Messages, Quote Requests.

Quick actions: New Project, Upload Design, Edit Homepage, Add Experiment, View Messages, View Portfolio.

Recent Activity is database-backed.

## Home editor

`/admin/pages/home`

Initial sections: Hero, Selected Work, About Preview, Capabilities, Creative Archive, Lab Preview, Services, Pricing, Now, Contact CTA.

Each section supports reorder, show/hide and Edit. Selected Work supports heading, description, project count/selection and layout. Hero supports all copy, CTAs, media, availability and rotating-word controls.

## Projects

List columns: thumbnail, project, category, status, featured, visibility, updated, actions.

Actions: Edit, Preview, Duplicate, Archive, Delete-to-Trash.

Filters: All, Published, Draft, Featured, Archived, Confidential.

Editor includes basic information, categories, SEO, confidentiality, links, media and modular content builder.

Blocks are reorderable and independently editable.

## Media library

Upload, preview, search, filter, rename, delete, copy URL, alt text, caption, file size and dimensions. Categories: Projects, Design, Branding, Profile, Blog, Documents, Other.

Editors can select an existing asset to prevent duplicate uploads.

## Design Archive

Manage title, client, year, category, description, images, tags, featured, visibility and order.

## Lab

Manage title, description, status, technologies, images/video, GitHub, demo, date and optional case-study content. Supports publish, archive and feature.

## About / Experience

About manages headline, intro, biography, portrait, résumé, location, availability, education, philosophy and journey timeline.

Experience manages company, position, employment type, location, dates/current, description, responsibilities, logo, website, visibility and order.

## Services / Pricing

Services are reorderable and can be disabled. Pricing packages manage currency, starting price or custom quote, description, features, CTA, featured flag, visibility and order. Entire pricing section can be disabled.

Services can optionally link to pricing packages.

## Quotes

Inbox shows client, project, budget, submitted date and status. Detail view supports workflow transitions, archive/delete, Email Client and WhatsApp Client when available.

## Messages

Statuses: Unread, Read, Replied, Archived. Dashboard reflects unread count.

## Skills / Technologies

Skills support group, order and visibility. Technologies support category, icon/logo, URL, order and visibility. No proficiency percentages.

## Testimonials

Real testimonials only. If no published records exist, public section disappears automatically.

## Navigation / SEO / Settings

Navigation is CRUD/reorderable and supports internal/external destinations.

SEO manages global defaults plus per-page/project metadata.

Settings manages portfolio/professional name, tagline, logo, favicon, email, WhatsApp, location, résumé, availability, copyright, social links and analytics configuration.

## Editor UX

- Save Draft
- Preview Changes
- Publish
- autosave with “Saved … ago”
- dirty-form leave warning
- toast feedback
- useful empty states
- loading/error states
- search/filter where specified
- safe delete confirmation
- Trash restore/permanent delete

No important action is decorative.
