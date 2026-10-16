"use client"

import { useRef, useState, type PointerEvent, type ReactNode } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, ArrowUpRight, Pause, Play, Star } from "lucide-react"
import { Reveal } from "@/components/sections/Reveal"
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap"
import { duration, ease, reviewStage as motion } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/hooks/useReducedMotion"

export type StageReview = {
  id: string
  name: string
  role: string
  area: string
  quote: string
  rating: number
  product: { slug: string; name: string }
}

const pad = (n: number) => String(n).padStart(2, "0")
const initials = (name: string) =>
  name
    .replace(/^Dr\.?\s+/, "")
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")

/**
 * One review at a time on a teal card. Changing review lowers a slatted blind
 * over the card, swaps the quote while it's shut, then lifts it. Autoplay runs
 * only while the stage is on screen, waits while it's hovered or focused, and
 * stops for good once the visitor navigates. The active slat in the picker
 * fills as its time runs out. All quotes share one grid cell, so the card
 * never changes height. Reduced motion: no autoplay, instant swaps.
 */
export function ReviewStage({ heading, reviews }: { heading: ReactNode; reviews: StageReview[] }) {
  const root = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const [autoplay, setAutoplay] = useState(true)
  const reduced = useReducedMotion()
  const transition = useRef<gsap.core.Timeline | null>(null)
  const progress = useRef<gsap.core.Tween | null>(null)
  const hold = useRef({ hover: false, focus: false, visible: false })
  const swipeFrom = useRef<number | null>(null)
  const count = reviews.length
  const canPlay = !reduced && count > 1
  const playing = autoplay && canPlay

  const syncProgress = () => {
    const { hover, focus, visible } = hold.current
    progress.current?.paused(hover || focus || !visible)
  }

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => {
          hold.current.visible = self.isActive
          syncProgress()
        },
      })
      // Called from handlers, so outside this context: stop a running blind on unmount.
      return () => transition.current?.kill()
    },
    { scope: root },
  )

  const show = (next: number) => {
    const target = (next + count) % count
    if (transition.current?.isActive() || target === index) return
    const slats = gsap.utils.toArray<HTMLElement>("[data-review-slat]", root.current)
    if (reduced || !slats.length) {
      setIndex(target)
      return
    }
    transition.current = gsap
      .timeline()
      .set(slats, { autoAlpha: 1, transformOrigin: "top" })
      .fromTo(
        slats,
        { scaleY: 0 },
        { scaleY: 1, duration: duration.fast, ease: ease.inOut, stagger: motion.slatStagger },
      )
      .add(() => setIndex(target))
      // The blind rises from its bottom rail.
      .to(
        slats,
        {
          scaleY: 0,
          duration: duration.base,
          ease: ease.curtain,
          stagger: { each: motion.slatStagger, from: "end" },
        },
        `+=${motion.hold}`,
      )
      .set(slats, { autoAlpha: 0 })
  }

  // The active picker slat fills over the interval, then the next review comes up.
  useGSAP(
    () => {
      progress.current = null
      if (!playing) return
      const fill = root.current?.querySelector(`[data-review-fill="${index}"]`)
      if (!fill) return
      progress.current = gsap.fromTo(
        fill,
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: motion.interval,
          ease: ease.linear,
          onComplete: () => show(index + 1),
        },
      )
      syncProgress()
    },
    { scope: root, dependencies: [index, playing], revertOnUpdate: true },
  )

  const go = (next: number) => {
    setAutoplay(false)
    show(next)
  }

  const setHold = (key: "hover" | "focus", on: boolean) => {
    hold.current[key] = on
    syncProgress()
  }

  const onSwipeEnd = (e: PointerEvent) => {
    if (swipeFrom.current === null) return
    const dx = e.clientX - swipeFrom.current
    swipeFrom.current = null
    if (Math.abs(dx) > motion.swipe) go(index + (dx < 0 ? 1 : -1))
  }

  return (
    <div
      ref={root}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHold("hover", true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setHold("hover", false)}
      onFocus={() => setHold("focus", true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHold("focus", false)
      }}
      className="grid gap-10 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-12 lg:gap-y-12"
    >
      <div className="lg:col-span-5">{heading}</div>

      {/* Stage */}
      <Reveal className="relative lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1">
        <div
          aria-hidden
          className="absolute inset-0 translate-x-3 translate-y-3 rounded-[2rem] bg-teal-600 stripes [--slat-gap:9px] [--slat:3px] [--stripe-alpha:0.2] sm:translate-x-5 sm:translate-y-5"
        />
        <div
          role="region"
          aria-roledescription="carousel"
          aria-label="Customer reviews"
          onPointerDown={(e) => {
            if (e.pointerType !== "mouse") swipeFrom.current = e.clientX
          }}
          onPointerUp={onSwipeEnd}
          onPointerCancel={() => void (swipeFrom.current = null)}
          className="relative isolate touch-pan-y overflow-hidden rounded-[2rem] bg-teal-800 px-6 pt-20 pb-7 text-white shadow-[0_40px_80px_-40px_rgb(11_40_51/0.7)] sm:px-12 sm:pt-24 sm:pb-10"
        >
          <div
            aria-hidden
            className="absolute -top-24 -right-20 -z-10 size-80 rounded-full bg-sunlight/20 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute inset-y-0 right-0 -z-10 w-2/5 stripes [mask-image:linear-gradient(90deg,transparent,black)] [--slat-gap:20px] [--slat:3px] [--stripe-alpha:0.05]"
          />
          <span
            aria-hidden
            className="absolute top-0 left-5 font-display text-[8rem] leading-none text-sunlight sm:left-10 sm:text-[10rem]"
          >
            &ldquo;
          </span>

          <div aria-live={playing ? "off" : "polite"} className="grid">
            {reviews.map((review, i) => {
              const active = i === index
              return (
                <figure
                  key={review.id}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${count}`}
                  aria-hidden={!active}
                  inert={!active}
                  className={cn("col-start-1 row-start-1 flex flex-col", !active && "invisible")}
                >
                  <Stars rating={review.rating} />
                  <blockquote className="mt-5 mb-9 font-display text-[1.65rem] leading-[1.15] text-pretty sm:text-4xl lg:text-[2.5rem]">
                    <p>{review.quote}</p>
                  </blockquote>
                  <figcaption className="mt-auto flex flex-wrap items-center justify-between gap-5 border-t border-white/10 pt-6">
                    <div className="flex items-center gap-4">
                      <span
                        aria-hidden
                        className="grid size-12 shrink-0 place-items-center rounded-full bg-sunlight font-display text-xl text-teal-900"
                      >
                        {initials(review.name)}
                      </span>
                      <div>
                        <p className="font-semibold">{review.name}</p>
                        <p className="text-sm text-white/60">
                          {review.role}, {review.area}
                        </p>
                      </div>
                    </div>
                    <Link
                      href={`/products/${review.product.slug}`}
                      className="group inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 font-label text-[0.62rem] font-semibold tracking-[0.18em] uppercase font-stretch-expanded transition-colors outline-none hover:border-white hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white"
                    >
                      {review.product.name}
                      <ArrowUpRight
                        className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        aria-hidden
                      />
                    </Link>
                  </figcaption>
                </figure>
              )
            })}
          </div>

          {/* The blind that drops between reviews */}
          <div aria-hidden className="pointer-events-none absolute inset-0 z-10 flex flex-col">
            {Array.from({ length: motion.slats }, (_, i) => (
              <div
                key={i}
                data-review-slat
                className={cn("invisible flex-1", i % 2 ? "bg-teal-700" : "bg-teal-900")}
              />
            ))}
          </div>
        </div>
      </Reveal>

      {/* Controls */}
      {count > 1 && (
        <div className="flex flex-wrap items-end justify-between gap-6 lg:col-span-5 lg:row-start-2 lg:self-end">
          <div role="group" aria-label="Choose a review" className="flex h-14 items-end">
            {reviews.map((review, i) => {
              const active = i === index
              return (
                <button
                  key={review.id}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Review ${i + 1} of ${count}: ${review.name}`}
                  aria-current={active || undefined}
                  className="group flex h-14 w-6 items-end justify-center rounded-md outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
                >
                  <span
                    className={cn(
                      "relative block w-1.5 overflow-hidden rounded-full transition-[height,background-color] duration-500 ease-[var(--ease-out-soft)]",
                      active ? "h-14" : "h-7 group-hover:h-10",
                      active && !playing ? "bg-teal-700" : "bg-teal-700/20",
                    )}
                  >
                    {/* Timer fill. GSAP alone drives its transform (an inline start, not a
                        scale utility, so the two never fight on revert). */}
                    <span
                      data-review-fill={i}
                      className="absolute inset-0 origin-bottom rounded-full bg-sunlight"
                      style={{ transform: "scaleY(0)" }}
                    />
                  </span>
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-2.5">
            <p
              aria-hidden
              className="mr-2 hidden font-label text-xs font-semibold tracking-[0.2em] text-teal-800 font-stretch-expanded tabular-nums sm:block"
            >
              {pad(index + 1)} <span className="text-teal-800/40">/ {pad(count)}</span>
            </p>
            {canPlay && (
              <button
                type="button"
                onClick={() => setAutoplay((a) => !a)}
                aria-label={autoplay ? "Pause the reviews" : "Play the reviews"}
                className="grid size-12 place-items-center rounded-full text-teal-800 transition-colors outline-none hover:bg-teal-700/10 focus-visible:ring-2 focus-visible:ring-teal-600"
              >
                {autoplay ? (
                  <Pause className="size-4" aria-hidden />
                ) : (
                  <Play className="size-4 translate-x-px" aria-hidden />
                )}
              </button>
            )}
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Previous review"
              className="grid size-12 place-items-center rounded-full border border-teal-700/25 text-teal-800 transition-colors outline-none hover:border-teal-800 hover:bg-teal-800 hover:text-white focus-visible:ring-2 focus-visible:ring-teal-600"
            >
              <ArrowLeft className="size-4" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Next review"
              className="grid size-12 place-items-center rounded-full bg-teal-800 text-white transition-colors outline-none hover:bg-teal-900 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
            >
              <ArrowRight className="size-4" aria-hidden />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function Stars({ rating }: { rating: number }) {
  return (
    <div role="img" aria-label={`Rated ${rating} out of 5`} className="flex gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          aria-hidden
          className={cn(
            "size-4",
            i < rating ? "fill-sunlight text-sunlight" : "fill-transparent text-white/25",
          )}
        />
      ))}
    </div>
  )
}
