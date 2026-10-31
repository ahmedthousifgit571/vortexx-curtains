"use client"

import Image, { type StaticImageData } from "next/image"
import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "@/hooks/useReducedMotion"
import { windowCard } from "@/lib/motion"
import type { Mechanic } from "@/lib/products"
import { cn } from "@/lib/utils"

/**
 * A window dressed in one treatment. Hovering (or focusing) the nearest `.group`
 * plays that treatment's mechanic in CSS; touch screens, which can't hover, get
 * the same motion on a loop (data-open) while the window is in view.
 */
export function WindowFrame({
  mechanic,
  view,
  className,
}: {
  mechanic: Mechanic
  /** The outdoor scene behind the glass. */
  view: StaticImageData
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || reduced || window.matchMedia("(hover: hover)").matches) return

    let timer: number | undefined
    let next = true
    const tick = () => {
      setOpen(next)
      timer = window.setTimeout(tick, next ? windowCard.openHold : windowCard.closedHold)
      next = !next
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        window.clearTimeout(timer)
        next = true
        if (!entry.isIntersecting) return setOpen(false)
        // Cards side by side take turns rather than opening in unison.
        const column = entry.boundingClientRect.left / window.innerWidth
        timer = window.setTimeout(tick, windowCard.firstDelay + column * windowCard.columnStagger)
      },
      { rootMargin: windowCard.inView },
    )
    io.observe(el)

    return () => {
      window.clearTimeout(timer)
      io.disconnect()
    }
  }, [reduced])

  return (
    <div
      ref={ref}
      aria-hidden
      data-open={open || undefined}
      className={cn(
        "group/window relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-md bg-teal-950 p-2 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.06)] [perspective:900px]",
        // Sunlight spills out of the frame as the treatment opens.
        "transition-shadow group-hover:shadow-[inset_0_0_0_1px_rgb(255_255_255/0.06),0_0_70px_4px_rgb(242_200_121/0.5)] group-focus-visible:shadow-[inset_0_0_0_1px_rgb(255_255_255/0.06),0_0_70px_4px_rgb(242_200_121/0.5)] group-data-open/window:shadow-[inset_0_0_0_1px_rgb(255_255_255/0.06),0_0_70px_4px_rgb(242_200_121/0.5)]",
        ease,
        className,
      )}
    >
      {/* Daylight outside */}
      <div className="absolute inset-2 overflow-hidden rounded-t-[999px] rounded-b-sm bg-sunlight-soft">
        <Image
          src={view}
          alt=""
          fill
          placeholder="blur"
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className={cn(
            "scale-110 object-cover brightness-90 transition-[scale,filter] group-hover:scale-100 group-hover:brightness-105 group-focus-visible:scale-100 group-focus-visible:brightness-105 group-data-open/window:scale-100 group-data-open/window:brightness-105",
            ease,
          )}
        />
        {/* Light floods in once the view is uncovered. */}
        <div
          className={cn(
            "absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgb(248_226_180/0.75),transparent_65%)] opacity-0 mix-blend-screen transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 group-data-open/window:opacity-100",
            ease,
          )}
        />
      </div>
      <div className="absolute inset-2 overflow-hidden rounded-t-[999px] rounded-b-sm">
        <Treatment mechanic={mechanic} />
      </div>
    </div>
  )
}

const ease = "duration-[1100ms] ease-[var(--ease-curtain)]"
const move = `transition-transform ${ease}`

function Treatment({ mechanic }: { mechanic: Mechanic }) {
  switch (mechanic) {
    case "roll":
      return (
        <>
          <div className="absolute inset-x-0 top-0 z-10 h-3 bg-teal-900 shadow-md" />
          <div
            className={cn(
              "absolute inset-0 origin-top bg-teal-700 group-hover:scale-y-[0.06] group-focus-visible:scale-y-[0.06] group-data-open/window:scale-y-[0.06]",
              move,
            )}
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgb(255 255 255 / 0.06), transparent 40%, rgb(0 0 0 / 0.25))",
            }}
          >
            <div className="absolute inset-x-0 bottom-0 h-2 bg-teal-950/70" />
          </div>
        </>
      )
    case "tilt":
      return (
        <div className="absolute inset-0 flex flex-col">
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              className={cn(
                "flex-1 bg-ivory-300 shadow-[0_1px_0_rgb(0_0_0/0.25)] group-hover:[transform:rotateX(72deg)] group-focus-visible:[transform:rotateX(72deg)] group-data-open/window:[transform:rotateX(72deg)]",
                move,
              )}
              style={{
                transitionDelay: `${i * 30}ms`,
                // Aluminium louvre: lit top edge, shaded underside.
                backgroundImage:
                  "linear-gradient(180deg, rgb(255 255 255 / 0.7), transparent 35%, rgb(0 0 0 / 0.14))",
              }}
            />
          ))}
        </div>
      )
    case "fold":
      return (
        <div
          className={cn(
            "absolute inset-x-0 top-0 flex h-full origin-top flex-col group-hover:scale-y-[0.32] group-focus-visible:scale-y-[0.32] group-data-open/window:scale-y-[0.32]",
            move,
          )}
        >
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className="flex-1 border-b border-black/15 bg-teal-600"
              style={{
                backgroundImage:
                  "linear-gradient(180deg, rgb(255 255 255 / 0.12), transparent 50%, rgb(0 0 0 / 0.18))",
              }}
            />
          ))}
        </div>
      )
    case "zebra":
      // Two banded layers: offset = solid bands cover the sheers (closed);
      // hover slides the front layer one band (3.5 = 14px) so the sheers line up.
      return (
        <>
          <div className="absolute inset-0" style={{ backgroundImage: zebraBands }} />
          <div
            className={cn(
              "absolute inset-x-0 -top-3.5 bottom-0 group-hover:translate-y-3.5 group-focus-visible:translate-y-3.5 group-data-open/window:translate-y-3.5",
              move,
            )}
            style={{ backgroundImage: zebraBands }}
          />
          <div className="absolute inset-x-0 top-0 z-10 h-3 bg-teal-900 shadow-md" />
        </>
      )
    case "pleat":
      return (
        <div
          className={cn(
            "absolute inset-x-0 top-0 flex h-full origin-top flex-col group-hover:scale-y-[0.14] group-focus-visible:scale-y-[0.14] group-data-open/window:scale-y-[0.14]",
            move,
          )}
        >
          {Array.from({ length: 14 }, (_, i) => (
            <div
              key={i}
              className="flex-1 bg-ivory-200"
              style={{
                backgroundImage:
                  "linear-gradient(180deg, rgb(0 0 0 / 0.12), rgb(255 255 255 / 0.5) 45%, rgb(0 0 0 / 0.16))",
              }}
            />
          ))}
        </div>
      )
    case "motor":
      // Aluminium roller shutter: slow, linear, motor-driven, with a status LED.
      return (
        <>
          <div
            className={cn(
              "absolute inset-0 origin-top bg-teal-900 group-hover:scale-y-[0.04] group-focus-visible:scale-y-[0.04] group-data-open/window:scale-y-[0.04]",
              move,
              "duration-1800 ease-linear",
            )}
            style={{
              backgroundImage:
                "repeating-linear-gradient(180deg, rgb(255 255 255 / 0.14) 0 1px, rgb(255 255 255 / 0.04) 2px 7px, rgb(0 0 0 / 0.35) 8px 9px)",
            }}
          />
          <div className="absolute inset-x-0 top-0 z-10 h-4 bg-teal-950 shadow-md" />
          <span className="absolute top-1.5 left-1/2 z-10 size-1.5 -translate-x-1/2 rounded-full bg-sunlight shadow-[0_0_8px_2px_rgb(242_200_121/0.8)] group-hover:animate-pulse group-data-open/window:animate-pulse" />
        </>
      )
  }
}

const zebraBands =
  "repeating-linear-gradient(180deg, var(--color-teal-700) 0 14px, rgb(255 255 255 / 0.28) 14px 28px)"
