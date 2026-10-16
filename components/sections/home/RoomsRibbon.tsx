"use client"

import { useState, type ReactNode } from "react"
import { Pause, Play } from "lucide-react"
import { Marquee } from "@/components/sections/Marquee"
import { marquee } from "@/lib/motion"
import { useReducedMotion } from "@/hooks/useReducedMotion"

/** Photo ribbon drifting one way, product names the other, with one shared pause. */
export function RoomsRibbon({
  label,
  photos,
  words,
}: {
  label: string
  photos: ReactNode
  words: ReactNode
}) {
  const [paused, setPaused] = useState(false)
  const reduced = useReducedMotion()

  return (
    <div className="mt-20 sm:mt-28">
      <div className="container-site flex items-center justify-between gap-4">
        <p className="eyebrow text-teal-600">{label}</p>
        {!reduced && (
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? "Play the moving ribbons" : "Pause the moving ribbons"}
            className="inline-flex h-9 items-center gap-2 rounded-full border border-teal-700/20 px-4 text-teal-800 transition-colors outline-none hover:bg-teal-700/5 focus-visible:ring-2 focus-visible:ring-teal-600"
          >
            {paused ? (
              <Play className="size-3.5" aria-hidden />
            ) : (
              <Pause className="size-3.5" aria-hidden />
            )}
            <span className="eyebrow">{paused ? "Play" : "Pause"}</span>
          </button>
        )}
      </div>

      <Marquee
        loop={marquee.photoLoop}
        paused={paused}
        className="mt-6 sm:mt-8"
        rowClassName="gap-3 pr-3 sm:gap-4 sm:pr-4"
      >
        {photos}
      </Marquee>

      <div aria-hidden>
        <Marquee
          loop={marquee.wordLoop}
          reverse
          paused={paused}
          swipeable={false}
          className="mt-8 py-2 sm:mt-10"
          rowClassName="gap-[0.4em] pr-[0.4em] font-display text-[clamp(3rem,9vw,7.5rem)] leading-none"
        >
          {words}
        </Marquee>
      </div>
    </div>
  )
}
