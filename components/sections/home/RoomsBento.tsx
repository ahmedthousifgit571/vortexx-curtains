"use client"

import { useRef, type ReactNode } from "react"
import { gsap, ScrollTrigger } from "@/lib/gsap"
import { duration, ease, reveal, roomsBento, stagger } from "@/lib/motion"
import { useScrollScene } from "@/hooks/useScrollScene"

/**
 * Scene for the rooms bento. Each `[data-tile]` opens like a zebra blind: its
 * `[data-band]` slats lift away top-down while the `[data-parallax]` layer
 * settles from a slight zoom. On desktop that layer then drifts against the
 * scroll. Tiles without slats simply fade up. Bands start `invisible`, so
 * nothing is covered without JS or with reduced motion.
 */
export function RoomsBento({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useScrollScene(ref, ({ reduced }) => {
    const el = ref.current
    if (reduced || !el) return
    const tiles = gsap.utils.toArray<HTMLElement>("[data-tile]", el)
    const openers = new Map<Element, gsap.core.Timeline>()

    for (const tile of tiles) {
      const bands = tile.querySelectorAll("[data-band]")
      const layer = tile.querySelector("[data-parallax]")
      const tl = gsap.timeline({ paused: true })
      if (bands.length) {
        tl.fromTo(
          bands,
          { autoAlpha: 1, scaleY: 1 },
          {
            scaleY: 0,
            duration: duration.slow,
            ease: ease.curtain,
            stagger: roomsBento.bandStagger,
          },
        )
        if (layer) {
          tl.fromTo(
            layer,
            { scale: roomsBento.mediaScale },
            { scale: 1, duration: duration.light, ease: ease.outSoft },
            0,
          )
        }
      } else {
        tl.fromTo(
          tile,
          { autoAlpha: 0, y: reveal.y },
          { autoAlpha: 1, y: 0, duration: duration.slow, ease: ease.outSoft },
        )
      }
      openers.set(tile, tl)
    }

    // Tiles entering together open one after another.
    ScrollTrigger.batch(tiles, {
      start: reveal.start,
      once: true,
      onEnter: (batch) =>
        batch.forEach((tile, i) =>
          openers
            .get(tile)
            ?.delay(i * stagger.items)
            .restart(true),
        ),
    })

    const mm = gsap.matchMedia()
    mm.add("(min-width: 64rem)", () => {
      for (const tile of tiles) {
        const layer = tile.querySelector("[data-parallax]")
        if (!layer) continue
        gsap.fromTo(
          layer,
          { yPercent: -roomsBento.parallax },
          {
            yPercent: roomsBento.parallax,
            ease: ease.linear,
            scrollTrigger: { trigger: tile, start: "top bottom", end: "bottom top", scrub: true },
          },
        )
      }
    })
    return () => mm.revert()
  })

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
