/**
 * Central motion tokens. Every GSAP tween should pull its ease/duration from here —
 * no magic numbers in components.
 */
export const ease = {
  /** Heavy fabric: slow start, slow settle. Matches --ease-curtain in CSS. */
  curtain: "power4.inOut",
  outSoft: "expo.out",
  out: "power3.out",
  inOut: "power2.inOut",
  linear: "none",
} as const

export const duration = {
  instant: 0.15,
  fast: 0.35,
  base: 0.6,
  slow: 1,
  curtain: 1.6,
  light: 2.2,
} as const

export const stagger = {
  chars: 0.025,
  words: 0.06,
  lines: 0.12,
  items: 0.08,
} as const

export const intro = {
  /** Progress past which a release/idle completes the opening automatically. */
  autoCompleteAt: 0.42,
  /** Wheel delta (px) that equals a full open. */
  wheelRange: 1400,
  /** Fraction of viewport width a drag must cover for a full open. */
  dragRange: 0.6,
  /** Quiet period (ms) of wheel input required before page scrolling resumes. */
  wheelSettleMs: 250,
  /** How far the panels gather toward the edges (scaleX at full open). */
  gatheredScale: 0.18,
} as const

/** Hero window: pointer-driven tilt and sky parallax. */
export const heroWindow = {
  /** Max tilt (deg) at the window's edges. */
  tiltX: 5,
  tiltY: 7,
  /** Max sun drift (px) opposite the pointer — the sky sits "behind" the glass. */
  skyShift: 18,
  /** Auto-cycle (ms): the blind rises and falls on its own while the hero is in view. */
  autoFirstDelay: 900,
  autoOpenHold: 4200,
  autoClosedHold: 2800,
  /** After a tap, leave the visitor's choice alone for this long before resuming. */
  tapPause: 8000,
  /** Longest wait (ms) for an idle moment before the view behind the glass starts loading. */
  viewIdleTimeout: 2000,
} as const

/** "How it works" demo on product pages: idle back-and-forth until the visitor takes over. */
export const productDemo = {
  /** Zebra: height (px) of one solid + one sheer band pair is twice this. */
  band: 22,
  autoHold: 2600,
  /** Roman: fabric panels, and how far each one squashes (fraction left) when folded. */
  romanFolds: 6,
  romanFolded: 0.16,
  /** Roman: delay (ms) between folds, bottom one first. */
  romanStagger: 70,
  /** Honeycomb: cells in the full drop, and the fraction of the drop that lifts away. */
  pleats: 18,
  pleatLift: 0.86,
  /** Pergola: louvre count, max rotation (deg), delay (ms) between louvres. */
  louvres: 9,
  louvreTilt: 78,
  louvreStagger: 30,
  /** Shutter: ms for the motor to run end to end. */
  motorTravel: 3600,
} as const

/** Home rooms bento: each photo is uncovered by a zebra blind, then drifts on scroll. */
export const roomsBento = {
  /** Slats covering each tile before it opens. */
  bands: 7,
  bandStagger: 0.06,
  /** Photo starts slightly zoomed and settles as the blind lifts. */
  mediaScale: 1.18,
  /** Parallax travel (yPercent of the photo layer, which bleeds 8% past the tile). */
  parallax: 6,
} as const

/** Photo + word ribbons: seconds per full loop, and how hard scrolling pushes them. */
export const marquee = {
  photoLoop: 70,
  wordLoop: 55,
  /** Associate partners ribbon. One copy holds two name pairs, so each name returns every ~8s. */
  partnerLoop: 16,
  /** Reviews: seconds per card, so the drift keeps one reading pace as reviews are added. */
  reviewPerCard: 10,
  /** Scroll velocity (px/s) that adds +1× speed. */
  velocityScale: 900,
  maxBoost: 4,
  /** Clear space (px) kept beside an item when keyboard focus slides it into view. */
  focusGutter: 24,
} as const

/** Reviews stage: a blind closes over the card, the quote swaps, the blind lifts. */
export const reviewStage = {
  /** Seconds each review stays up while autoplaying. */
  interval: 7,
  slats: 8,
  slatStagger: 0.035,
  /** Pause (s) with the blind shut while the quote swaps. */
  hold: 0.08,
  /** Horizontal travel (px) that counts as a swipe on touch. */
  swipe: 48,
} as const

/** Footer wordmark: drawn in blind slats that open into solid letters as the page ends. */
export const footerWordmark = {
  /** Fraction of each slat that shows before the footer scrolls in. */
  closed: 0.12,
} as const

/** Showcase video: buffers (after page load) once within a viewport, plays once partly on screen. */
export const videoTile = {
  preloadMargin: "100% 0px",
  /** Fraction of the video that must be visible before it plays (so it starts from frame one in view). */
  playThreshold: 0.2,
} as const

export const reveal = {
  y: 28,
  start: "top 85%",
} as const
