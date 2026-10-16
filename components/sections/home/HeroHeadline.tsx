"use client"

import { useRef, type ReactNode } from "react"
import { gsap, SplitText, useGSAP } from "@/lib/gsap"
import { duration, ease, stagger } from "@/lib/motion"
import { INTRO_DONE_EVENT } from "@/components/scenes/Intro"

/**
 * Hero copy that rises into place as the intro curtains part. When there is no
 * intro (repeat visit, reduced motion, no JS) it simply renders, untouched.
 */
export function HeroHeadline({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (document.documentElement.dataset.intro !== "active" || !ref.current) return
      const heading = ref.current.querySelector("h1")
      if (!heading) return

      const split = SplitText.create(heading, { type: "words", mask: "words" })
      const fades = ref.current.querySelectorAll("[data-hero-fade]")
      gsap.set(split.words, { yPercent: 110 })
      gsap.set(fades, { autoAlpha: 0, y: 16 })

      const play = () =>
        gsap
          .timeline({ onComplete: () => split.revert() })
          .to(split.words, {
            yPercent: 0,
            duration: duration.slow,
            ease: ease.outSoft,
            stagger: stagger.words,
          })
          .to(
            fades,
            { autoAlpha: 1, y: 0, duration: duration.base, ease: ease.out, stagger: stagger.items },
            "-=0.6",
          )

      window.addEventListener(INTRO_DONE_EVENT, play, { once: true })
      return () => window.removeEventListener(INTRO_DONE_EVENT, play)
    },
    { scope: ref },
  )

  return <div ref={ref}>{children}</div>
}
