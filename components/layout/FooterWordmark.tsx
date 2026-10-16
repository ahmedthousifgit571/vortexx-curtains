"use client"

import { useRef } from "react"
import { gsap } from "@/lib/gsap"
import { ease, footerWordmark } from "@/lib/motion"
import { useScrollScene } from "@/hooks/useScrollScene"

/**
 * The giant LOURTEX across the foot of the page, cut into vertical blind slats
 * (`--open` = how much of each slat is filled). Scrolling to the end opens
 * them into solid letters. Without JS or with reduced motion it's solid.
 */
export function FooterWordmark() {
  const root = useRef<HTMLParagraphElement>(null)

  useScrollScene(root, ({ reduced }) => {
    if (reduced) return
    gsap.fromTo(
      root.current,
      { "--open": footerWordmark.closed },
      {
        "--open": 1,
        ease: ease.linear,
        scrollTrigger: {
          trigger: root.current,
          start: "top bottom",
          end: "bottom bottom",
          scrub: true,
        },
      },
    )
  })

  return (
    <div className="@container">
      <p
        ref={root}
        aria-hidden
        className="bg-clip-text text-center font-display text-[27cqw] leading-[0.8] tracking-[0.02em] whitespace-nowrap text-transparent uppercase select-none [--open:1] [--period:0.07em]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, var(--color-ivory) 0 calc(var(--period) * var(--open)), transparent 0 var(--period))",
        }}
      >
        Lourtex
      </p>
    </div>
  )
}
