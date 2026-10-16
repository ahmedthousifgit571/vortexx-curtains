"use client"

import { useEffect, useRef, type FocusEvent, type PointerEvent, type ReactNode } from "react"
import { gsap, ScrollTrigger } from "@/lib/gsap"
import { duration, ease, marquee } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/hooks/useReducedMotion"
import { useScrollScene } from "@/hooks/useScrollScene"

type MarqueeProps = {
  children: ReactNode
  /** Seconds for one full loop at rest. */
  loop: number
  reverse?: boolean
  /** Visitor pressed pause (WCAG 2.2.2). */
  paused?: boolean
  className?: string
  /** Each copy is a flex row: give it a gap AND a matching right padding so the seam lines up. */
  rowClassName?: string
  /** With reduced motion, let visitors swipe the static row. Off for decorative rows. */
  swipeable?: boolean
}

type Hold = { paused: boolean; visible: boolean; held: boolean; focused: boolean }

/** The ribbon runs unless the visitor paused it, it's off-screen, or keyboard focus is inside. */
const syncPlayback = (tween: gsap.core.Tween | null, hold: Hold) =>
  tween?.paused(hold.paused || !hold.visible || hold.focused)

/**
 * Endless ribbon. Two copies of `children` slide by one copy's width, so the
 * loop is seamless. Scrolling pushes it faster, a mouse hovering eases it to a
 * stop, and it idles while off-screen. Keyboard focus stops it and slides the
 * focused item into view. Reduced motion: a static row you can swipe.
 */
export function Marquee({
  children,
  loop,
  reverse = false,
  paused = false,
  className,
  rowClassName,
  swipeable = true,
}: MarqueeProps) {
  const root = useRef<HTMLDivElement>(null)
  const tween = useRef<gsap.core.Tween | null>(null)
  const state = useRef<Hold>({ paused, visible: false, held: false, focused: false })
  const reduced = useReducedMotion()

  useScrollScene(
    root,
    ({ reduced }) => {
      const el = root.current
      if (reduced || !el) return
      const track = el.querySelector("[data-marquee-track]")
      const t = gsap.fromTo(
        track,
        { xPercent: reverse ? -50 : 0 },
        {
          xPercent: reverse ? 0 : -50,
          duration: loop,
          ease: ease.linear,
          repeat: -1,
          paused: true,
        },
      )
      tween.current = t

      ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => {
          state.current.visible = self.isActive
          syncPlayback(t, state.current)
        },
        onUpdate: (self) => {
          // A boost would also cut short the slide that brings a focused item into view.
          if (state.current.held || state.current.focused) return
          const boost =
            1 + Math.min(Math.abs(self.getVelocity()) / marquee.velocityScale, marquee.maxBoost)
          gsap.to(t, { timeScale: boost, duration: duration.instant, overwrite: true })
          gsap.to(t, {
            timeScale: 1,
            duration: duration.slow,
            delay: duration.instant,
            ease: ease.out,
          })
        },
      })

      return () => {
        tween.current = null
      }
    },
    [loop, reverse],
  )

  useEffect(() => {
    state.current.paused = paused
    syncPlayback(tween.current, state.current)
  }, [paused])

  const hold = (e: PointerEvent, on: boolean) => {
    if (e.pointerType !== "mouse" || !tween.current) return
    state.current.held = on
    gsap.to(tween.current, {
      timeScale: on ? 0 : 1,
      duration: duration.base,
      ease: ease.out,
      overwrite: true,
    })
  }

  const onFocus = (e: FocusEvent<HTMLDivElement>) => {
    const t = tween.current
    const el = root.current
    const target = e.target as HTMLElement
    // A mouse click focuses links too; only keyboard focus should stop the ribbon.
    if (!t || !el || !target.matches(":focus-visible")) return
    state.current.focused = true
    syncPlayback(t, state.current)

    const item = target.closest("[data-marquee-track] > * > *") ?? target
    const view = el.getBoundingClientRect()
    const box = item.getBoundingClientRect()
    const gutter = marquee.focusGutter
    const shift =
      box.left < view.left + gutter
        ? view.left + gutter - box.left
        : box.right > view.right - gutter
          ? view.right - gutter - box.right
          : 0
    if (!shift) return
    // One copy of the row is half the track; that's one full loop of progress.
    const copy = el.querySelector<HTMLElement>("[data-marquee-track]")!.offsetWidth / 2
    // Only the first copy is focusable, so the item is always reachable without wrapping.
    const progress = gsap.utils.clamp(0, 0.999, t.progress() + (reverse ? shift : -shift) / copy)
    gsap.to(t, { progress, duration: duration.base, ease: ease.out, overwrite: true })
  }

  const onBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (e.currentTarget.contains(e.relatedTarget as Node | null)) return
    state.current.focused = false
    syncPlayback(tween.current, state.current)
  }

  return (
    <div
      ref={root}
      onPointerEnter={(e) => hold(e, true)}
      onPointerLeave={(e) => hold(e, false)}
      onFocus={onFocus}
      onBlur={onBlur}
      className={cn(
        reduced && swipeable ? "overflow-x-auto overscroll-x-contain" : "overflow-x-clip",
        className,
      )}
    >
      <div data-marquee-track className="flex w-max will-change-transform">
        <div className={cn("flex shrink-0", rowClassName)}>{children}</div>
        <div aria-hidden inert className={cn("flex shrink-0", rowClassName, reduced && "hidden")}>
          {children}
        </div>
      </div>
    </div>
  )
}
