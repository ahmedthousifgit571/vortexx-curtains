"use client"

import { useState, type ReactNode } from "react"
import { Pause, Play } from "lucide-react"
import { Marquee } from "@/components/sections/Marquee"
import { marquee } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/hooks/useReducedMotion"

/**
 * Review cards drifting across the page, fading out at both edges. Hovering a
 * card stops it to read; the pause button stops it for good. Keyboard focus
 * drops the edge fade so the focused card is never half hidden.
 */
export function ReviewRibbon({ cards, children }: { cards: number; children: ReactNode }) {
  const [paused, setPaused] = useState(false)
  const reduced = useReducedMotion()

  return (
    <div className="mt-14 sm:mt-20">
      <Marquee
        loop={cards * marquee.reviewPerCard}
        paused={paused}
        className={cn(
          // Room for the lifted card's shadow, which the edge mask would otherwise clip.
          "py-8",
          reduced
            ? "px-(--gutter)"
            : "[mask-image:linear-gradient(90deg,transparent,black_9%,black_91%,transparent)] has-[:focus-visible]:[mask-image:none]",
        )}
        rowClassName="gap-4 pr-4 sm:gap-6 sm:pr-6"
      >
        {children}
      </Marquee>

      {!reduced && (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? "Play the moving reviews" : "Pause the moving reviews"}
            className="inline-flex h-9 items-center gap-2 rounded-full border border-teal-700/20 px-4 text-teal-800 transition-colors outline-none hover:bg-teal-700/5 focus-visible:ring-2 focus-visible:ring-teal-600"
          >
            {paused ? (
              <Play className="size-3.5" aria-hidden />
            ) : (
              <Pause className="size-3.5" aria-hidden />
            )}
            <span className="eyebrow">{paused ? "Play" : "Pause"}</span>
          </button>
        </div>
      )}
    </div>
  )
}
