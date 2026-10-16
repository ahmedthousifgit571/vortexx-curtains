# CURTTEX — Master Prompts

Brand reference (from the business card):
- **Primary:** Deep Teal `#154A5E` (confirm with an eyedropper on the original logo file)
- **Secondary:** Pure White `#FFFFFF`
- **Signature motif:** vertical white stripes on teal, like blind slats
- **Wordmark:** bold geometric sans, all caps — "CURTTEX"

---

## PART 1 — Claude Code Master Prompt

> Paste this as your first message in Claude Code inside an empty project folder. Save a copy as `CLAUDE.md` in the repo root so it stays as persistent project context.

```
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
- Primary: Deep Teal #154A5E. Secondary: White #FFFFFF.
- Supporting palette (derive tokens): teal-950 #0B2833, teal-800 #123F50,
  teal-600 #1F6A85, ivory #F7F4EE (warm surface), sunlight #F2C879 (light/glow accent
  only, used sparingly), ink #0E1A1F.
- Signature motif: vertical white stripes on teal (from their card) = blind slats.
  Reuse it in the loader, section dividers, the remote, and hover states.
- Typography: a bold geometric sans for display (e.g. "Clash Display" or "General Sans"
  via next/font/local, or "Manrope"/"Outfit" via next/font/google as fallback), and a
  clean sans for body. All-caps tracking for labels.
- Tone: premium, warm, confident, local. Not cluttered.

## Contact details (use in footer, contact page, and JSON-LD)
- Juffal K.M — +91 95675 74451
- Sabir K.S — +91 98476 50005
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
2. THE REMOTE. After the intro a floating remote control becomes the primary nav
   (buttons: Curtains, Blinds, Shutters, Motorised, Gallery, About, Contact). Styled
   with the stripe motif. Button press = motorised-blind wipe transition (a teal slatted
   panel rolls down then up) between routes. On mobile it becomes a bottom pill bar
   that expands into a sheet. Must be fully keyboard accessible with aria labels.
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

Start with Phase 1.
```

### Follow-up prompts (use between phases)

```
Phase review: open the site at 375px and 1440px widths, list any jank, layout shift,
or console warnings, fix them, then continue to the next phase.
```

```
Performance pass: run a production build and Lighthouse (mobile). Report the scores,
the top 5 issues, and fix them without removing the storytelling interactions —
use fallbacks for low-tier devices instead.
```

```
I've added videos to /public/media/. Wire them into the slots in media.config.ts,
generate poster frames with ffmpeg, and make sure nothing loads until it is near the
viewport.
```

---

## PART 2 — Prep Your Images (Gemini image editing)

Before turning photos into videos, clean them up so every clip looks like one brand
film. Upload each photo to Gemini and use:

**A. Clean & extend to 16:9 (desktop) and 9:16 (mobile)**
```
Extend this photo of a real curtain/blind installation to a 16:9 frame. Keep the
curtains, fabric colour, pattern and window exactly as they are — do not change the
product. Clean up clutter, wires and stains in the room, straighten the verticals,
and give it soft, warm natural daylight. Photorealistic interior photography, no text,
no logos.
```
(Repeat with "9:16 portrait frame" for mobile versions.)

**B. Make a "closed / before" start frame from an "open" photo**
```
Edit this photo so the curtains are fully closed and the room is dim, with only a thin
beam of warm light through the gap in the middle. Keep the exact same fabric, colour,
folds style, rod, window and room. Photorealistic, same camera angle.
```

**C. Brand-colour hero still (for the intro)**
```
A premium living room at dusk, floor-to-ceiling deep teal (#154A5E) velvet curtains
fully closed, a thin vertical beam of warm golden sunlight through the centre gap,
dust particles floating in the beam, dark moody atmosphere, cinematic interior
photography, 16:9, no text.
```

---

## PART 3 — Video Prompts (Gemini / Veo image-to-video, also work in Kling)

### Global rules — paste this paragraph at the start of every video prompt
```
Photorealistic cinematic interior footage, premium home brand film. Keep the
uploaded product (fabric, colour, pattern, hardware, window) exactly as in the image —
do not invent or change the product. Smooth, slow, steady camera. Soft natural
warm daylight, gentle contrast, colour grade with deep teal shadows and warm
highlights. No people, no text, no logos, no watermarks, no flicker, no warping
of straight lines.
```

> Tips: generate 8-second clips, pick the best of 3–4 tries, and for Kling use
> **start frame + end frame** (closed photo from Part 2B → original open photo) — it
> gives the most accurate opening motion.

### 1. hero-curtain-open (landing page)
Upload: the closed-curtain still (Part 2C or 2B)
```
[Global rules] Static locked-off camera facing the window. The heavy curtains slowly
part from the centre to both sides, revealing a bright sunlit view. Golden light
floods into the room, dust particles glowing in the beam. The fabric moves with
realistic weight and soft folds. 8 seconds, ease in and out.
```

### 2. venetian-light-sweep
Upload: photo of their venetian / wooden blinds
```
[Global rules] Camera slowly dollies along the room. The venetian slats slowly tilt
from closed to open, and parallel stripes of warm sunlight move across the floor and
wall as the angle changes. Calm, hypnotic, 8 secopernds.
```

### 3. roller-rollup
Upload: photo of a roller blind
```
[Global rules] Locked-off camera. The roller blind rolls up smoothly and evenly from
the bottom, revealing the window and daylight behind it. The fabric stays flat and
straight while rolling. 6 seconds.
```

### 4. roman-fold
Upload: photo of a roman blind
```
[Global rules] Slow push-in. The roman blind lifts upward, folding into neat, even
horizontal pleats, revealing soft daylight. Crisp, tidy folds. 6 seconds.
```

### 5. sheer-breeze (seamless loop)
Upload: photo of sheer curtains
```
[Global rules] Locked-off camera. Light sheer curtains sway gently in a soft breeze
from an open window, sunlight glowing through the translucent fabric. Subtle, calm,
continuous motion that loops seamlessly. 6 seconds.
```

### 6. shutters-open
Upload: photo of shutters
```
[Global rules] Slow push-in toward the window. The shutter panels swing open inward,
and the louvres tilt to let in warm morning light. 7 seconds.
```

### 7. motorised-remote
Upload: photo of a motorised curtain/blind (and a remote if available)
```
[Global rules] Close-up of a hand-free remote control resting on a side table in the
foreground, slightly out of focus; in the background the motorised curtains glide open
smoothly and silently on their track. Focus pulls from the remote to the curtains.
7 seconds.
```

### 8. fabric-macro-[name] (one per fabric, seamless loop)
Upload: close-up photo of the fabric
```
[Global rules] Extreme macro shot of the fabric weave. Very slow sideways camera
slide, light grazing across the texture to reveal the threads and sheen. Shallow
depth of field. Seamless loop, 5 seconds.
```

### 9. room-ambient (section background loop)
Upload: best wide photo of an installed room
```
[Global rules] Very slow forward dolly through the furnished room toward the window
dressed in curtains. Afternoon light shifts subtly; a light breeze barely moves the
curtains. Calm, luxurious, loopable. 8 seconds.
```

### 10. finale-curtain-close
Upload: the open-curtain photo from #1
```
[Global rules] Locked-off camera. At warm sunset light, the curtains slowly and
gracefully close from both sides toward the centre, the room becoming softly dim,
ending on the closed curtains with a thin line of golden light. 7 seconds.
```

### 11. logo-reveal (optional, text-to-video)
```
Cinematic brand reveal: a wall of vertical deep teal (#154A5E) and white blind slats,
softly lit. The slats rotate open one by one from left to right, light bursting
through the gaps, then settle into a clean striped pattern on a deep teal background
with empty space in the centre for a logo. Minimal, premium, 6 seconds, no text.
```
(Add the real CURTTEX wordmark in code on top — AI tools mangle logos.)

### Do NOT generate with AI
- **Before/after gallery images and the main gallery** — use real install photos.
  AI-made "results" can misrepresent their work.
- **Product close-ups customers will order from** — keep these as real photos.

---

## PART 4 — Compress Videos for the Web

Run in a terminal (or ask Claude Code to do it for you):

```bash
# MP4 (H.264) — universal fallback, ~1–2MB target
ffmpeg -i input.mp4 -vf "scale=1920:-2,fps=30" -c:v libx264 -crf 26 -preset slow -an -movflags +faststart output.mp4

# WebM (VP9) — smaller, for modern browsers
ffmpeg -i input.mp4 -vf "scale=1920:-2,fps=30" -c:v libvpx-vp9 -crf 34 -b:v 0 -an output.webm

# Mobile version (portrait)
ffmpeg -i input-portrait.mp4 -vf "scale=720:-2,fps=30" -c:v libx264 -crf 28 -an -movflags +faststart output-mobile.mp4

# Poster frame
ffmpeg -i output.mp4 -frames:v 1 -q:v 3 poster.jpg

# Image sequence for scroll-scrubbing (e.g. venetian tilt)
ffmpeg -i input.mp4 -vf "scale=1280:-2,fps=24" -c:v libwebp -quality 70 frames/frame_%03d.webp
```
