# Design System

## Direction

Clarity over clutter. Personality over templates. Motion with purpose.

The public site should feel premium, technical, creative, mature, personal, editorial, modern, precise, confident and human.

Avoid generic developer/SaaS/crypto aesthetics, excessive glow, gradient blobs, glass everywhere, generic AI imagery, random 3D decoration, skill bars and typewriter hero effects.

## Color tokens

```css
--background: #06070B;
--background-soft: #0B0D14;
--surface: rgba(255,255,255,.045);
--surface-hover: rgba(255,255,255,.075);
--border: rgba(255,255,255,.10);
--blue: #174FC4;
--blue-bright: #2867E8;
--blue-deep: #102C83;
--purple: #6935C7;
--purple-bright: #8654E8;
--text-primary: #F7F8FC;
--text-secondary: #A9AFBF;
--text-muted: #707788;
```

Near-black and white carry most UI. Blue indicates technical/product energy; purple is a restrained creative/experimental accent.

## Typography

Maximum two principal families.

Display: Space Grotesk or Manrope. Body/interface: Inter.

Desktop hero 72–110px; tablet 48–64px; mobile 38–52px. Section headings 48–72px. Project titles 32–56px. Body 16–18px. Metadata 12–14px.

## Spacing and grid

Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160.

Major section padding: 120px desktop, 72px mobile.

Grid: 12 desktop, 8 tablet, 4 mobile. Max width 1440px; primary content 1200–1320px. Editorial project layouts may intentionally break the grid.

## Navigation

Desktop floating compact glass navigation: logo; Work, About, Lab, Services, Pricing; Let’s Talk ↗. On scroll, slightly compact and increase opacity/blur.

Mobile: logo + Menu opening a refined full-screen navigation.

## Hero

Headline:
“I BUILD DIGITAL / THINGS THAT WORK.”

Supporting copy:
“Software developer, product builder and creative technologist combining code, design, AI and business thinking to turn ideas into useful digital experiences.”

Metadata: WISDOM / WIKIS TECH; LAGOS, NG.

Primary CTA: View Selected Work ↓. Secondary: Let’s Work Together ↗.

Logo visual can use restrained pointer depth/parallax and blue/purple reflection. No distracting perpetual animation.

## Work presentation

Avoid a uniform six-card grid. Use flagship, paired, full-width and asymmetric editorial compositions. Project detail composition comes from CMS blocks.

## Glass

Use selectively for navbar, pricing, floating metadata, controls, modals and admin overlays. Not every section.

## Motion

Micro 150–250ms; UI 250–400ms; section 500–800ms; editorial 800–1200ms.

Allowed: masked headline reveals, image clipping, slight parallax, sticky storytelling, section-number transitions, gallery motion, subtle fades.

Avoid scroll hijacking, constant spinning, heavy WebGL and animation that blocks usability.

## Cursor

Desktop-only understated enhancement: project “VIEW”, gallery “DRAG”, external “↗”. Completely disabled on touch.

## Responsive behavior

Mobile is recomposed, not shrunk. Reduce blur, parallax and decorative animation on smaller/low-power devices.

## Accessibility

Semantic HTML, visible focus, keyboard navigation, labels, alt text, contrast, heading hierarchy and `prefers-reduced-motion` are mandatory.
