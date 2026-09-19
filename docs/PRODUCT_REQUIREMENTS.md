# Product Requirements Document

## 1. Product

**Wikis Tech Portfolio + Admin CMS** is one product with two surfaces: a public portfolio and a private portfolio operating system.

Professional identity: **Wisdom / Wikis Tech Corporation**  
Positioning: **Software Developer · Digital Product Builder · Creative Technologist**  
Working intersection: **CODE × DESIGN × AI × STRATEGY**

Core narrative:

> I use technology, design and intelligent systems to turn ideas and real-world problems into useful digital products and experiences.

Typical workflow:

Problem → Research → Strategy → Product Thinking → Design → Development → Deployment → Communication

## 2. Goals

1. Demonstrate real capability through real work rather than unsupported claims.
2. Present multidisciplinary work as one coherent problem-solving practice.
3. Give Wisdom complete ownership of portfolio content through an admin CMS.
4. Make publishing, repricing, rearranging, uploading and archiving content possible without code changes.
5. Demonstrate production engineering: architecture, authentication, authorization, data modelling, storage, CMS workflows, security and product thinking.
6. Protect confidential client/employer information.

## 3. Public experience

Routes: Home, Work, dynamic Project Detail, About, Lab, Services, Pricing, Quote and Contact.

Home is CMS-composed and initially supports Hero, Selected Work, About Preview, Capabilities, Creative Archive, Lab Preview, Services, Pricing, Now and Contact CTA. Sections can be reordered, hidden and configured.

Work supports filtering without requiring page reloads. Project pages render only populated sections and support modular content blocks.

Visual Archive presents standalone design work in an editorial/masonry presentation.

## 4. Admin experience

The private CMS manages:

- Homepage composition and hero
- Projects and project categories
- Modular project blocks and media
- Design Archive
- Lab/experiments
- About, education and journey
- Experience
- Services and pricing
- Quote requests and contact messages
- Skills and technologies
- Testimonials
- Now items
- Media library
- Navigation
- SEO
- Site settings
- Trash
- Activity history

## 5. Editorial workflows

Content lifecycle must support Draft → Preview → Publish. Existing published content remains public while unpublished edits are prepared.

Long editors autosave. Navigation away from dirty forms warns the administrator.

Major content is soft-deleted to Trash before permanent deletion.

Homepage featured projects are database-driven, reorderable and independent of source code.

## 6. Public forms

Contact stores name, email, subject and message.

Quote captures name, email, phone/WhatsApp, project type, description, optional budget, timeline, optional brief and preferred contact method.

Quote workflow: New → Reviewed → Contacted → Negotiating → Accepted/Declined → Completed.

Forms require server-side validation, anti-spam controls and rate limiting.

## 7. Portfolio content guardrails

Never invent testimonials, awards, revenue, user counts, project statistics, outcomes, client identities or technologies.

SPIP must be described as an internal prospect-intelligence and relationship-management platform around Asset Management workflows. Confidential information, repositories, private URLs and sensitive screenshots must not be exposed.

Concept/experimental work must be labelled accordingly.

## 8. Quality attributes

- Responsive at 360, 390, 430, 768, 1024, 1280, 1440 and 1920 widths.
- Keyboard accessible and semantic.
- Reduced-motion support.
- Strong Core Web Vitals.
- Responsive optimized imagery.
- Clear loading, empty, error, offline/network and upload-failure states.
- Public pages query only published/public records.
- Admin access is authenticated and authorized server-side and by RLS.

## 9. Definition of success

Wisdom can return months later and independently add a project, change the hero, upload designs, alter pricing, change availability, hide old work, replace the résumé and rearrange the homepage without touching React or redeploying.
