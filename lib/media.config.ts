/**
 * Video / image-sequence slots. Drop files into /public/media/<slot>/ and set
 * `ready: true` — components render their CSS/2D fallback until then.
 *
 * Expected files per video slot:
 *   <slot>.webm, <slot>.mp4, <slot>-mobile.mp4 (portrait), <slot>-poster.jpg
 * Scroll-scrubbed slots use an image sequence instead: frames/frame_001.webp …
 */
export type MediaSlot = {
  /** Folder under /public/media */
  dir: string
  kind: "video" | "sequence"
  loop: boolean
  ready: boolean
  /** Frame count for `sequence` slots */
  frames?: number
}

export const media = {
  "hero-curtain-open": { dir: "hero-curtain-open", kind: "video", loop: false, ready: false },
  "venetian-light-sweep": {
    dir: "venetian-light-sweep",
    kind: "sequence",
    loop: false,
    ready: false,
  },
  "roller-rollup": { dir: "roller-rollup", kind: "video", loop: false, ready: false },
  "roman-fold": { dir: "roman-fold", kind: "video", loop: false, ready: false },
  "sheer-breeze": { dir: "sheer-breeze", kind: "video", loop: true, ready: false },
  "shutters-open": { dir: "shutters-open", kind: "video", loop: false, ready: false },
  "motorised-remote": { dir: "motorised-remote", kind: "video", loop: false, ready: false },
  "room-ambient": { dir: "room-ambient", kind: "video", loop: true, ready: false },
  "finale-curtain-close": { dir: "finale-curtain-close", kind: "video", loop: false, ready: false },
  /** Home showcase: skylight blinds closing on a remote (portrait, 540×960, no mobile cut). */
  "skylight-showcase": { dir: "skylight-showcase", kind: "video", loop: true, ready: true },
  /**
   * "Let's talk": linen curtains in a breeze at an open garden door (1280×720, no mobile cut).
   * Pexels "Wind Blowing The Curtain" by Coverr, free licence:
   * https://www.pexels.com/video/wind-blowing-the-curtain-854116/
   * Trimmed to a seamless loop (last second cross-fades into the first).
   */
  "contact-breeze": { dir: "contact-breeze", kind: "video", loop: true, ready: true },
  /**
   * The view through the hero window: sunlit tree canopy and blue sky, leaves moving in the
   * breeze (3:4, 8 s seamless loop, warmed slightly, denoised and softened a touch the way a
   * view through glass reads). Desktop 540×720 WebM (~380 KB) + MP4, phones 360×480 MP4
   * (`-mobile`). No poster: the illustrated sky stands in until it plays.
   * Mixkit "Tree branches in the breeze" (Mixkit Stock Video Free License, commercial use):
   * https://mixkit.co/free-stock-video/tree-branches-in-the-breeze-1188/
   * Source kept in .media-original/hero-window-view/ (git-ignored).
   */
  "hero-window-view": { dir: "hero-window-view", kind: "video", loop: true, ready: true },
} satisfies Record<string, MediaSlot>

export type MediaSlotName = keyof typeof media

/** Fabric macro loops are keyed by fabric name: fabric-macro-<name>. */
export const fabricMacroDir = (name: string) => `fabric-macro-${name}`

export function videoSources(slot: MediaSlotName) {
  const base = `/media/${media[slot].dir}/${slot}`
  return {
    webm: `${base}.webm`,
    mp4: `${base}.mp4`,
    mobile: `${base}-mobile.mp4`,
    poster: `${base}-poster.jpg`,
  }
}
