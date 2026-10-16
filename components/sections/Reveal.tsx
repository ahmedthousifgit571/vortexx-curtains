"use client"

import { useRef, type ReactNode } from "react"
import { gsap } from "@/lib/gsap"
import { duration, ease, reveal, stagger } from "@/lib/motion"
import { useScrollScene } from "@/hooks/useScrollScene"

/**
 * Fades children up as they enter the viewport. Mark children with `data-reveal`
 * to stagger them; otherwise the wrapper itself animates. Content stays visible
 * without JS and with reduced motion.
 */
export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useScrollScene(ref, ({ reduced }) => {
    const el = ref.current
    if (reduced || !el) return
    const items = el.querySelectorAll("[data-reveal]")
    gsap.from(items.length ? items : el, {
      y: reveal.y,
      autoAlpha: 0,
      duration: duration.slow,
      ease: ease.outSoft,
      stagger: stagger.items,
      scrollTrigger: { trigger: el, start: reveal.start, once: true },
    })
  })

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
