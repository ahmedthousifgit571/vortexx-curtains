# Lourtex (formerly CURTTEX) — project context

@AGENTS.md

The brief below comes from `curttex-master-prompts.md` (Part 1). Media/video prompts are in that file (Parts 2–4).

## Build status
- [x] Phase 1 — setup, tokens, fonts, Lenis+GSAP, layout, static remote nav, skip-able CSS curtain intro, footer, contact form
- [ ] Phase 2 — WebGL curtain intro, device tiering, motorised route transitions
- [ ] Phase 3 — CMS schemas, products hub + roller/venetian product pages
- [ ] Phase 4 — remaining mechanics, services tape-measure, about
- [ ] Phase 5 — gallery + before/after, Light Lab, fabric explorer
- [ ] Phase 6 — SEO, JSON-LD, performance + a11y pass, Lighthouse

## Copy rules (client, 2026-10-16)
- **No em dashes (—) anywhere in user-visible text**: page copy, headings, metadata titles and
  descriptions, aria-labels, toasts, emails. Use a comma, colon, full stop or `|` (in `<title>`s)
  instead. En dashes in number ranges (e.g. "1–2") are fine. Code comments are exempt.
- Hero/landing copy stays generic ("homes and businesses"), not pitched only at Bangalore homes.
  Local keywords belong in the local-reach section, metadata and JSON-LD.

Dependencies added beyond the brief (all required by listed tools): `@hookform/resolvers` (zod ↔ react-hook-form), shadcn runtime deps (`radix-ui`, `cn`, `class-variance-authority`, `lucide-react`, `sonner`, `tw-animate-css`, `next-themes`), `prettier-plugin-tailwindcss`.

## Brief

You are a senior creative developer building an award-level, interactive storytelling
website for CURTTEX, a curtains and blinds business in Bangalore, India. The site is a
portfolio of their products and services, an about page, and a gallery. It must feel
like an experience, not a template, and still load fast and convert visitors into
quote requests.

## Core concept: "Let the Light In"
The site is a journey from a dark room into a sunlit home. Every transition is driven
by the mechanics of a real window treatment (curtains parting, blinds rolling, slats
tilting, shutters swinging, a motorised remote). Navigation itself demonstrates the
products.

## Brand
- Name: CURTTEX
  → OVERRIDDEN by client (2026-10-15): brand is **Lourtex** (write "Lourtex" in copy; the
    wordmark renders it uppercase). Email stays curttex2026@gmail.com.
- Primary: Deep Teal #154A5E. Secondary: White #FFFFFF.
- Supporting palette (derive tokens): teal-950 #0B2833, teal-800 #123F50,
  teal-600 #1F6A85, ivory #F7F4EE (warm surface), sunlight #F2C879 (light/glow accent
  only, used sparingly), ink #0E1A1F.
- Signature motif: vertical white stripes on teal (from their card) = blind slats.
  Reuse it in the loader, section dividers, the remote, and hover states.
- Typography: a bold geometric sans for display (e.g. "Clash Display" or "General Sans"
  via next/font/local, or "Manrope"/"Outfit" via next/font/google as fallback), and a
  clean sans for body. All-caps tracking for labels.
  → OVERRIDDEN by client (2026-10-15): editorial look modelled on era-residence.com, using
    free Google fonts — display Instrument Serif (single weight; `font-synthesis-weight: none`),
    labels Archivo at `font-stretch: 125%` (`eyebrow` / `font-label font-stretch-expanded`),
    script accent Monsieur La Doulaise (`font-script`, decorative only), body Manrope.
- Tone: premium, warm, confident, local. Not cluttered.

## Contact details (use in footer, contact page, and JSON-LD)
- Juffal K.M — +91 95675 74451
- Sabir K.S — +91 98476 50005
  → OVERRIDDEN by client (2026-10-17): contacts are **Nainas +91 94464 20264** and
    **Sabir +91 94462 06391** (lib/site.ts). WhatsApp goes to Nainas.
- Email: curttex2026@gmail.com
- Address: No. 192, 3rd Cross, BPMP, K. Channasandra Village, Horamavu Post,
  Krishnarajapuram Hobli, Bangalore East Taluk, Bangalore, Karnataka 560113, India
- GSTIN: 29CTUPM7128L1ZO (footer only, small)

## Tech stack (use current stable versions, check docs rather than guessing APIs)
- Next.js (App Router, TypeScript, Server Components by default)
- Tailwind CSS + shadcn/ui (forms, dialog, sheet, tabs, toast)
- GSAP + ScrollTrigger (+ SplitText, Flip, CustomEase — all free now) via @gsap/react
  useGSAP hook
- Lenis for smooth scrolling, synced to gsap.ticker; disable on reduced motion
- React Three Fiber + @react-three/drei for WebGL; custom GLSL shaders for cloth and light
- Sanity (or Payload) as headless CMS so the client can add products, fabrics, gallery
  items and testimonials without a developer
- react-hook-form + zod for the quote form; send via Resend (or a server action that
  emails curttex2026@gmail.com); plus WhatsApp deep link
- detect-gpu for device tiering
- Deploy target: Vercel

## Site map
/                      Story landing (all scenes below)
/products              Wall of windows hub
/products/[slug]       Product detail (curtains, sheers, roller, venetian, roman,
                       zebra/dual, vertical, wooden, shutters, motorised — driven by CMS)
                       → OVERRIDDEN by client (2026-10-15): the range is exactly Zebra, Roman,
                         Roller, Sunscreen, Skylight, Honeycomb blinds, Motorised shutters,
                         Pergolas (lib/products.ts). No curtains/sheers/venetian/vertical/
                         wooden/plantation shutters. Remote: Blinds, Shutters, Pergolas,
                         Gallery, About, Contact. The curtain intro/finale stay as story devices.
/light-lab             Interactive light simulator
/services              Measure → consult → make → install → aftercare
/about                 "Behind the curtain"
/gallery               Filterable masonry + before/after
/contact               Quote form, map, WhatsApp, phone
/studio                Embedded CMS studio (if Sanity)

## Scenes (landing page story)
1. PROLOGUE — DARK ROOM. Full-screen dim room, heavy teal drapes closed, thin beam of
   warm light through the gap, floating dust particles. Only the CURTTEX wordmark
   visible. Desktop: drag horizontally or scroll to part the curtains. Mobile: swipe.
   Curtain is a subdivided plane with a vertex shader (sine folds + gather toward the
   edges based on an `uOpen` uniform 0→1, cursor-reactive ripple). As it opens, light
   floods in (bloom-like gradient, not heavy postprocessing on mobile) and the headline
   reveals with SplitText. Include "Skip intro" (always visible) and store a
   sessionStorage flag so repeat visits skip it.
   → OVERRIDDEN by client (2026-10-15): intro replays on every full load/refresh of `/`;
     only in-site client navigation back home skips it.
2. THE REMOTE. After the intro a floating remote control becomes the primary nav
   (buttons: Curtains, Blinds, Shutters, Motorised, Gallery, About, Contact). Styled
   with the stripe motif. Button press = motorised-blind wipe transition (a teal slatted
   panel rolls down then up) between routes. On mobile it becomes a bottom pill bar
   that expands into a sheet. Must be fully keyboard accessible with aria labels.
   → OVERRIDDEN by client (2026-10-16): the remote is desktop only (xl+). Below lg the header
     has a menu button opening a full-screen menu (components/layout/MobileMenu.tsx), plus a
     floating WhatsApp button. The header also carries Products / About / Contact links (lg+).
     Phone numbers live in the footer, the contact page and the home "Curtain call" section,
     not in the hero.
3. WALL OF WINDOWS. Grid of window frames, each dressed in a product. Hover/tap plays
   that treatment's micro-animation (roller rolls, roman folds, sheer sways). Click =
   GSAP Flip / camera zoom through the window into /products/[slug].
4. SIGNATURE PRODUCT MECHANICS (scroll-driven, one per product page):
   - Venetian: scroll tilts slats; light stripes across the room change angle.
     HERO interaction — make it beautiful.
   - Roller: the blind rolls up revealing the next section beneath.
   - Roman: content blocks fold up in pleats.
   - Sheer: wind-like motion, text softly visible through fabric (backdrop blur + noise).
   - Shutters: panels swing open (3D rotateY) into the next section.
   - Motorised: user presses remote buttons to operate the scene.
5. LIGHT LAB. Time-of-day slider (sunrise → noon → sunset → night) and fabric toggle
   (blockout / light-filtering / sheer / dual). A simple room scene shows how much light
   and what colour passes through. Implement with a shader or layered images +
   blend modes; mobile uses the image approach.
6. FABRIC EXPLORER. Swatches from CMS; tapping one swaps the texture/colour on the
   curtain live; each swatch can have a macro video loop.
7. SERVICES — "From measure to magic". A tape measure unrolls down the page; each mark
   is a step. Pinned ScrollTrigger timeline.
8. ABOUT — "Behind the curtain". Theatre-curtain reveal of story, team (Juffal & Sabir),
   workshop.
9. GALLERY. Masonry grid filterable by room and product. Lightbox (shadcn dialog).
   Before/after component where the divider is a blind the user drags down.
10. FINALE — "Curtain call". Curtains gently close over the CTA: "Book a free measure
    & quote" → form + WhatsApp + call buttons.

## Video & media slots
Create /public/media/ with placeholders and a `media.config.ts` mapping slot names to
files so I can drop in AI-generated videos later:
hero-curtain-open, venetian-light-sweep, roller-rollup, roman-fold, sheer-breeze,
shutters-open, motorised-remote, fabric-macro-[name], room-ambient, finale-curtain-close.
Each video: muted, playsInline, loop, preload="none" until near viewport, poster image,
WebM + MP4 sources. For scroll-scrubbed sequences use image sequences on <canvas>
(not video scrubbing — it is janky on iOS).

## Performance requirements (non-negotiable)
- Lighthouse mobile ≥ 90 performance, LCP < 2.5s, CLS < 0.05, INP < 200ms.
- First screen renders as HTML + optimised static image immediately; Three.js and the
  canvas load lazily (dynamic import, ssr:false) after first paint.
- Device tiers via detect-gpu: tier 3 = full WebGL; tier 2 = reduced geometry, no
  particles, DPR capped at 1.5; tier 0–1 / low-power = pre-rendered video or image
  sequence fallback with the same choreography.
- One persistent R3F canvas (drei View / tunnel pattern), never one canvas per section.
- KTX2 textures, Draco/meshopt geometry, next/image with AVIF/WebP, responsive sizes.
- Pause rendering (frameloop="demand" or visibility check) when canvas is off-screen.
- Clean up every GSAP context and ScrollTrigger on unmount; ScrollTrigger.refresh
  after fonts/images load.
- prefers-reduced-motion: disable Lenis, replace mechanics with simple fades, skip intro.
- Test on a mid-range Android at 4x CPU throttle.

## Conversion & UX
- A "Get a Quote" button is visible at all times (except during the first 2 seconds
  of the intro). WhatsApp floating button on mobile.
- Content never blocked by animation; every section readable without JS.
- Optional ambient sound (fabric swoosh, motor whirr) — OFF by default with a toggle.

## SEO
- Metadata per route, OG images (generated with next/og using brand colours).
- JSON-LD: LocalBusiness/HomeGoodsStore with address, phones, email, area served
  (Bangalore), and Product schema on product pages.
- sitemap.xml, robots.txt, semantic headings, alt text from CMS.
- Local keywords: curtains in Bangalore, blinds in KR Puram / Horamavu, motorised
  curtains Bangalore, etc. — used naturally in copy.

## Code quality
- Folder structure: app/, components/{ui,scenes,three,sections,remote}/, lib/, shaders/,
  sanity/, hooks/, styles/.
- Reusable hooks: useLenis, useDeviceTier, useReducedMotion, useScrollScene.
- Design tokens in Tailwind config / CSS variables. No magic numbers in animations —
  centralise eases and durations in lib/motion.ts.
- Strict TypeScript, ESLint, Prettier. Small, typed components.

## How to work
Work in phases. At the end of each phase, run the dev server, check for errors,
summarise what was built, and STOP for my review before continuing.
- Phase 1: Project setup, tokens, fonts, Lenis+GSAP wiring, layout, remote nav
  (static), skip-able intro with a CSS/2D curtain fallback, footer, contact form.
- Phase 2: WebGL curtain intro (shader), device tiering, motorised route transitions.
- Phase 3: CMS schemas (product, fabric, galleryItem, testimonial, service, siteSettings)
  and the products hub + product pages with roller and venetian mechanics.
- Phase 4: Remaining product mechanics, services tape-measure, about page.
- Phase 5: Gallery + before/after, Light Lab, fabric explorer.
- Phase 6: SEO, JSON-LD, performance pass, accessibility pass, Lighthouse report.
Use realistic placeholder copy for a Bangalore curtains & blinds business until I
provide final text. Ask me before adding any dependency not listed above.
