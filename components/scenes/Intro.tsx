"use client"

import { useEffect, useRef, useSyncExternalStore, type CSSProperties } from "react"
import { useLenis } from "lenis/react"
import { gsap, useGSAP } from "@/lib/gsap"
import { duration, ease, intro } from "@/lib/motion"

/** Fired when the curtains have parted far enough for the hero to start revealing. */
export const INTRO_DONE_EVENT = "lourtex:intro-done"

/* ---------------------------------------------------------------- */
/* "Is the intro active?" — read from the attribute the pre-paint    */
/* script sets on <html>, so server markup and first paint agree.    */
/* ---------------------------------------------------------------- */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributeFilter: ["data-intro"] })
  return () => observer.disconnect()
}
const isActive = () => document.documentElement.dataset.intro === "active"

function finishIntro() {
  document.documentElement.removeAttribute("data-intro")
}

/* Deterministic dust motes (same on server and client). */
const rand = (i: number, n: number) => {
  const x = Math.sin(i * 12.9898 + n * 78.233) * 43758.5453
  return Math.round((x - Math.floor(x)) * 1000) / 1000
}
const DUST = Array.from({ length: 26 }, (_, i) => ({
  left: `${(rand(i, 1) * 100).toFixed(1)}%`,
  top: `${(8 + rand(i, 2) * 84).toFixed(1)}%`,
  size: `${(1 + rand(i, 3) * 2.2).toFixed(2)}px`,
  delay: `${(-rand(i, 4) * 9).toFixed(2)}s`,
  duration: `${(7 + rand(i, 5) * 6).toFixed(2)}s`,
  dx: `${((rand(i, 6) - 0.5) * 40).toFixed(1)}px`,
  dy: `${(-20 - rand(i, 7) * 50).toFixed(1)}px`,
}))

const clamp01 = gsap.utils.clamp(0, 1)

export function Intro() {
  const root = useRef<HTMLDivElement>(null)
  const active = useSyncExternalStore(subscribe, isActive, () => true)
  const lenis = useLenis()
  const api = useRef<{ complete: (seconds: number) => void } | null>(null)

  // Hold the page still while the curtains are closed.
  useEffect(() => {
    if (!lenis) return
    if (active) {
      window.scrollTo(0, 0)
      lenis.stop()
      return
    }
    // Wheel momentum from opening the curtains keeps firing for a second or two
    // (trackpad inertia, smooth wheel ticks). Hold the page until it settles so
    // the visitor isn't carried straight past the hero.
    let timer = setTimeout(start, intro.wheelSettleMs)
    const onWheel = () => {
      clearTimeout(timer)
      timer = setTimeout(start, intro.wheelSettleMs)
    }
    function start() {
      window.removeEventListener("wheel", onWheel)
      lenis?.start()
    }
    window.addEventListener("wheel", onWheel, { passive: true })
    return () => {
      clearTimeout(timer)
      start()
    }
  }, [lenis, active])

  // Navigating away mid-intro (e.g. "Get a Quote") must never leave the page locked.
  // With cacheComponents the home route isn't unmounted but hidden in an <Activity>
  // (its DOM stays connected), so this runs on effect cleanup rather than DOM removal.
  // Deferred a tick so a re-run in the same commit (StrictMode's dev-only remount,
  // Lenis becoming ready) cancels it instead of ending the intro.
  const leaving = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => {
    clearTimeout(leaving.current)
    return () => {
      leaving.current = setTimeout(() => {
        if (!isActive()) return
        finishIntro()
        lenis?.start()
      }, 0)
    }
  }, [lenis])

  useGSAP(
    () => {
      if (!active || !root.current) return
      const q = gsap.utils.selector(root)
      const [left, right] = [q("[data-curtain=left]"), q("[data-curtain=right]")]
      const s = { p: 0, target: 0, completing: false }

      // Tweens started from input handlers live outside this context, so they are
      // tracked here and killed on cleanup; render also bails once unmounted.
      let opening: gsap.core.Timeline | undefined
      const render = () => {
        if (!root.current) return
        const p = s.p
        const gather = 1 - (1 - intro.gatheredScale) * p
        gsap.set(left, { scaleX: gather, skewY: p * 1.2 })
        gsap.set(right, { scaleX: gather, skewY: -p * 1.2 })
        gsap.set(q("[data-intro=beam]"), { scaleX: 1 + p * 18, opacity: 1 - p * 0.4 })
        gsap.set(q("[data-intro=dark]"), { opacity: 1 - p })
        gsap.set(q("[data-intro=flood]"), { opacity: p })
        gsap.set(q("[data-intro=mark]"), { opacity: 1 - p * 1.8, y: -p * 32 })
        gsap.set(q("[data-intro=hint]"), { opacity: 1 - p * 4 })
      }

      const follow = gsap.quickTo(s, "p", {
        duration: duration.base,
        ease: ease.out,
        onUpdate: render,
      })
      const setTarget = (t: number) => {
        if (s.completing) return
        s.target = clamp01(t)
        follow(s.target)
        if (s.target >= 1) complete(duration.curtain * 0.7)
      }

      const complete = (seconds: number) => {
        if (s.completing) return
        s.completing = true
        tease.kill()
        gsap.killTweensOf(s)
        opening = gsap
          .timeline({ onComplete: finishIntro })
          .to(s, { p: 1, duration: seconds, ease: ease.curtain, onUpdate: render })
          .call(() => window.dispatchEvent(new Event(INTRO_DONE_EVENT)), [], `-=${duration.fast}`)
          .to(root.current, { autoAlpha: 0, duration: duration.base, ease: ease.inOut }, "<")
      }
      api.current = { complete }

      // A small "breath" of the curtains hints that they can be moved.
      const tease = gsap
        .timeline({ delay: 1.8 })
        .call(() => s.target === 0 && setTarget(0.07))
        .call(() => s.target <= 0.07 && setTarget(0), [], 0.9)

      /* Wheel / trackpad */
      let idle: ReturnType<typeof setTimeout> | undefined
      const onWheel = (e: WheelEvent) => {
        const unit = e.deltaMode === 1 ? 16 : 1
        setTarget(s.target + ((e.deltaY + e.deltaX) * unit) / intro.wheelRange)
        clearTimeout(idle)
        idle = setTimeout(() => {
          if (s.target >= intro.autoCompleteAt) complete(duration.curtain * 0.8)
        }, 220)
      }

      /* Drag (mouse) and swipe (touch) — any outward or upward pull opens */
      let drag: { x: number; y: number; from: number } | null = null
      const onDown = (e: PointerEvent) => {
        if ((e.target as Element).closest("button, a")) return
        drag = { x: e.clientX, y: e.clientY, from: s.target }
        root.current?.setPointerCapture(e.pointerId)
      }
      const onMove = (e: PointerEvent) => {
        if (!drag) return
        const pull = Math.abs(e.clientX - drag.x) + Math.max(0, drag.y - e.clientY)
        setTarget(drag.from + pull / (window.innerWidth * intro.dragRange))
      }
      const onUp = () => {
        if (!drag) return
        drag = null
        if (s.target >= intro.autoCompleteAt) complete(duration.curtain * 0.8)
        else setTarget(0) // heavy fabric falls back
      }

      /* Keyboard */
      const onKey = (e: KeyboardEvent) => {
        if ((e.target as Element).closest?.("button, a")) return
        if (["ArrowDown", "ArrowRight", "PageDown", " ", "Enter"].includes(e.key)) {
          e.preventDefault()
          complete(duration.curtain)
        }
      }

      const el = root.current
      window.addEventListener("wheel", onWheel, { passive: true })
      window.addEventListener("keydown", onKey)
      el.addEventListener("pointerdown", onDown)
      el.addEventListener("pointermove", onMove)
      el.addEventListener("pointerup", onUp)
      el.addEventListener("pointercancel", onUp)
      render()

      return () => {
        clearTimeout(idle)
        opening?.kill()
        tease.kill()
        gsap.killTweensOf(s)
        api.current = null
        window.removeEventListener("wheel", onWheel)
        window.removeEventListener("keydown", onKey)
        el.removeEventListener("pointerdown", onDown)
        el.removeEventListener("pointermove", onMove)
        el.removeEventListener("pointerup", onUp)
        el.removeEventListener("pointercancel", onUp)
      }
    },
    { scope: root, dependencies: [active], revertOnUpdate: true },
  )

  if (!active) return null

  return (
    <div
      ref={root}
      role="region"
      aria-label="Intro: open the curtains to enter"
      className="intro-overlay fixed inset-0 z-[60] cursor-grab touch-none overflow-hidden bg-ink select-none active:cursor-grabbing"
    >
      {/* The sunlit room waiting behind the curtains (matches the hero surface) */}
      <div
        data-intro="flood"
        className="absolute inset-0 bg-ivory opacity-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 70% 60% at 50% 40%, rgb(242 200 121 / 0.55), transparent 70%)",
        }}
      />

      {/* The dark room */}
      <div
        data-intro="dark"
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 60% 80% at 50% 45%, #123F50 0%, #0B2833 45%, #05141A 100%)",
        }}
      />

      {/* Beam of warm light through the gap */}
      <div aria-hidden className="absolute inset-y-0 left-1/2 w-[22vw] -translate-x-1/2">
        <div
          data-intro="beam"
          className="absolute inset-y-0 left-1/2 w-[3px] -translate-x-1/2"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, #F2C879 18%, #F8E2B4 55%, #F2C879 85%, transparent 100%)",
            boxShadow:
              "0 0 24px 6px rgb(242 200 121 / 0.55), 0 0 90px 30px rgb(242 200 121 / 0.18)",
          }}
        />
        {DUST.map((d, i) => (
          <span
            key={i}
            className="absolute animate-dust rounded-full bg-sunlight-soft"
            style={
              {
                left: d.left,
                top: d.top,
                width: d.size,
                height: d.size,
                animationDelay: d.delay,
                animationDuration: d.duration,
                "--dust-x": d.dx,
                "--dust-y": d.dy,
                boxShadow: "0 0 6px 1px rgb(248 226 180 / 0.6)",
              } as CSSProperties
            }
          />
        ))}
      </div>

      {/* The drapes */}
      <div
        data-curtain="left"
        aria-hidden
        className="curtain-fabric absolute inset-y-0 left-0 w-[calc(50%+1px)] origin-left shadow-[18px_0_40px_rgb(0_0_0/0.45)]"
      />
      <div
        data-curtain="right"
        aria-hidden
        className="curtain-fabric absolute inset-y-0 right-0 w-[calc(50%+1px)] origin-right shadow-[-18px_0_40px_rgb(0_0_0/0.45)]"
      />
      {/* Rod / pelmet shadow */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 to-transparent"
      />

      {/* Wordmark */}
      <div
        data-intro="mark"
        className="pointer-events-none absolute inset-0 grid place-items-center"
      >
        <div className="px-6 text-center text-white">
          <p className="font-display text-[clamp(3.75rem,17vw,13rem)] leading-[0.85] tracking-[0.04em] uppercase [text-shadow:0_6px_40px_rgb(0_0_0/0.5)]">
            Lourtex
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute inset-x-0 bottom-24 flex justify-center px-6 sm:bottom-12">
        <button
          type="button"
          data-intro="hint"
          onClick={() => api.current?.complete(duration.curtain)}
          className="group flex flex-col items-center gap-3 rounded-full px-5 py-3 text-white/75 outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-sunlight"
        >
          <span className="eyebrow">
            <span className="hidden sm:inline">Scroll or drag</span>
            <span className="sm:hidden">Swipe</span> to let the light in
          </span>
          <span aria-hidden className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-5 w-[3px] animate-pulse rounded-full bg-white/60"
                style={{ animationDelay: `${i * 0.18}s` }}
              />
            ))}
          </span>
        </button>
      </div>
      <button
        type="button"
        onClick={() => api.current?.complete(duration.base)}
        className="absolute right-5 bottom-6 rounded-full border border-white/25 px-4 py-2 font-label text-[0.62rem] font-semibold tracking-[0.2em] text-white/80 uppercase font-stretch-expanded backdrop-blur-sm outline-none hover:border-white hover:text-white focus-visible:ring-2 focus-visible:ring-sunlight"
      >
        Skip intro
      </button>
    </div>
  )
}
