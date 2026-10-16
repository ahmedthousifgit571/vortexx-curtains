"use client"

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react"
import { INTRO_DONE_EVENT } from "@/components/scenes/Intro"
import { useReducedMotion } from "@/hooks/useReducedMotion"
import { heroWindow } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { WindowView } from "./WindowView"

/** Fixed positions (no Math.random) so server and client markup match. */
const dust = [
  { left: "22%", top: "38%", x: "10px", y: "-34px", delay: "0s" },
  { left: "34%", top: "62%", x: "-8px", y: "-46px", delay: "-2.1s" },
  { left: "46%", top: "30%", x: "14px", y: "-28px", delay: "-4.3s" },
  { left: "58%", top: "70%", x: "-12px", y: "-40px", delay: "-1.2s" },
  { left: "66%", top: "44%", x: "9px", y: "-52px", delay: "-6.4s" },
  { left: "74%", top: "58%", x: "-6px", y: "-30px", delay: "-3.6s" },
  { left: "40%", top: "80%", x: "11px", y: "-44px", delay: "-5.2s" },
  { left: "28%", top: "52%", x: "-10px", y: "-38px", delay: "-7.5s" },
]

/** "Open" = hover, or data-open (set by the auto-cycle and by taps on touch). */
const curtainEase = "ease-[var(--ease-curtain)]"

/**
 * Arched window — the "sunlit home" the intro opens onto. The roller blind rises
 * and falls on its own while the hero is in view; hover (or tap) opens it on
 * demand. The window also tilts toward the pointer. Decorative only.
 */
export function HeroWindow() {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const [open, setOpen] = useState(false)
  // The real view is playing behind the glass: the overlays soften so it can be seen.
  const [live, setLive] = useState(false)
  // Mirrors `open` for the timer loop, which must not read stale state.
  const openRef = useRef(false)
  const pausedUntil = useRef(0)
  const resume = useRef<(delay: number) => void>(() => {})

  const setBlind = (next: boolean) => {
    openRef.current = next
    setOpen(next)
  }

  // Auto-cycle: starts after the intro, runs only while on screen and the tab is visible.
  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return

    let timer: number | undefined
    let visible = false
    let started = document.documentElement.dataset.intro !== "active"

    const schedule = (delay: number) => {
      window.clearTimeout(timer)
      timer = window.setTimeout(tick, delay)
    }
    const stop = () => window.clearTimeout(timer)
    const tick = () => {
      if (!visible || document.hidden) return stop()
      const wait = pausedUntil.current - Date.now()
      if (wait > 0) return schedule(wait)
      const next = !openRef.current
      setBlind(next)
      schedule(next ? heroWindow.autoOpenHold : heroWindow.autoClosedHold)
    }
    const kick = (delay: number) => {
      if (started && visible && !document.hidden) schedule(delay)
    }
    resume.current = kick

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) kick(heroWindow.autoFirstDelay)
      else stop()
    })
    io.observe(el)

    const onVisibility = () => (document.hidden ? stop() : kick(heroWindow.autoFirstDelay))
    const onIntroDone = () => {
      started = true
      kick(heroWindow.autoFirstDelay)
    }
    document.addEventListener("visibilitychange", onVisibility)
    window.addEventListener(INTRO_DONE_EVENT, onIntroDone, { once: true })

    return () => {
      stop()
      io.disconnect()
      document.removeEventListener("visibilitychange", onVisibility)
      window.removeEventListener(INTRO_DONE_EVENT, onIntroDone)
    }
  }, [reduced])

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el || reduced || e.pointerType !== "mouse") return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.setProperty("--rx", `${(-y * heroWindow.tiltX * 2).toFixed(2)}deg`)
    el.style.setProperty("--ry", `${(x * heroWindow.tiltY * 2).toFixed(2)}deg`)
    el.style.setProperty("--sx", `${(-x * heroWindow.skyShift * 2).toFixed(1)}px`)
    el.style.setProperty("--sy", `${(-y * heroWindow.skyShift).toFixed(1)}px`)
  }

  const onPointerLeave = () => {
    const el = ref.current
    if (!el) return
    for (const v of ["--rx", "--ry", "--sx", "--sy"]) el.style.removeProperty(v)
  }

  // Touch has no hover: a tap toggles the blind and holds it for a while.
  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse") return
    setBlind(!openRef.current)
    pausedUntil.current = Date.now() + heroWindow.tapPause
    resume.current(heroWindow.tapPause)
  }

  return (
    <div
      ref={ref}
      aria-hidden
      data-open={open || undefined}
      data-live={live || undefined}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onPointerUp={onPointerUp}
      className="group relative mx-auto w-full max-w-md cursor-pointer select-none [perspective:1200px]"
    >
      {/* Halo: the room warms up as light comes in */}
      <div
        className={cn(
          "absolute -inset-10 rounded-full bg-sunlight/35 blur-3xl transition-[transform,opacity] duration-1600",
          curtainEase,
          "group-hover:scale-125 group-hover:bg-sunlight/55 group-data-open:scale-125 group-data-open:bg-sunlight/55",
        )}
      />

      {/* Tilting body: frame + sill + floor light move as one */}
      <div className="relative [transform:rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))] transition-transform duration-700 ease-[var(--ease-out-soft)] [transform-style:preserve-3d]">
        <div className="relative aspect-[3/4] overflow-hidden rounded-t-[999px] rounded-b-lg bg-teal-900 p-3 shadow-[0_40px_80px_-30px_rgb(11_40_51/0.55)]">
          {/* Sky, sun and glazing bars */}
          <div className="absolute inset-3 overflow-hidden rounded-t-[999px] rounded-b-md bg-gradient-to-b from-sunlight-soft via-ivory to-teal-100">
            <div className="absolute inset-0 [transform:translate(var(--sx,0px),var(--sy,0px))] transition-transform duration-700 ease-[var(--ease-out-soft)]">
              {/* The real view outside; bleeds past the glass so the parallax never shows an edge */}
              <WindowView
                onShow={() => setLive(true)}
                className="absolute -top-6 -left-6 h-[calc(100%+3rem)] w-[calc(100%+3rem)] max-w-none"
              />
              {/* Sun and rays: dialled right down over the real view so the sky reads */}
              <div className="absolute inset-0 transition-opacity duration-1600 group-data-live:opacity-35">
                {/* Slow sun rays, only once the blind is up */}
                <div
                  className={cn(
                    "absolute top-[22%] left-1/2 aspect-square w-[180%] -translate-1/2 animate-[spin_60s_linear_infinite] opacity-0 transition-opacity duration-1600",
                    "[mask-image:radial-gradient(circle,black_10%,transparent_60%)]",
                    "group-hover:opacity-100 group-data-open:opacity-100",
                  )}
                  style={{
                    backgroundImage:
                      "repeating-conic-gradient(rgb(242 200 121 / 0.35) 0deg 5deg, transparent 5deg 15deg)",
                  }}
                />
                <div
                  className={cn(
                    "absolute top-[14%] left-1/2 size-2/5 -translate-x-1/2 rounded-full bg-sunlight opacity-85 blur-2xl transition-[transform,opacity] duration-1600",
                    curtainEase,
                    "group-hover:scale-150 group-hover:opacity-100 group-data-open:scale-150 group-data-open:opacity-100",
                  )}
                />
              </div>
            </div>
            {/* The glass itself, once there's a real view behind it: the frame's shadow
                falling onto the pane, and a faint diagonal reflection */}
            <div
              className="absolute inset-0 opacity-0 shadow-[inset_0_0_36px_6px_rgb(11_40_51/0.4)] transition-opacity duration-1600 group-data-live:opacity-100"
              style={{
                backgroundImage:
                  "linear-gradient(118deg, transparent 32%, rgb(255 255 255 / 0.16) 44%, rgb(255 255 255 / 0.04) 52%, transparent 60%)",
              }}
            />
            <div className="absolute inset-y-0 left-1/2 w-1.5 -translate-x-1/2 bg-teal-900/85 group-data-live:shadow-[0_0_8px_rgb(11_40_51/0.45)]" />
            <div className="absolute inset-x-0 top-[52%] h-1.5 bg-teal-900/85 group-data-live:shadow-[0_0_8px_rgb(11_40_51/0.45)]" />
          </div>

          <div className="absolute inset-3 overflow-hidden rounded-t-[999px] rounded-b-md">
            {/* Roller blind: half down at rest, rolls up on hover */}
            <div
              className={cn(
                "absolute inset-0 -translate-y-[52%] transition-transform duration-1400",
                curtainEase,
                "group-hover:-translate-y-[97%] group-data-open:-translate-y-[97%]",
              )}
            >
              <div
                className="absolute inset-0 bg-teal-700"
                style={{
                  backgroundImage:
                    "linear-gradient(180deg, transparent 60%, rgb(242 200 121 / 0.18)), repeating-linear-gradient(90deg, rgb(255 255 255 / 0.05) 0 2px, transparent 2px 9px)",
                }}
              />
              {/* Bottom rail with the stripe motif + pull cord */}
              <div className="absolute inset-x-0 bottom-0 h-3 bg-teal-950 stripes [--slat-gap:7px] [--slat:2px] [--stripe-alpha:0.18]" />
              <div className="absolute top-full left-[72%] h-10 w-px bg-teal-950/70">
                <span className="absolute -bottom-1.5 left-1/2 h-3 w-2 -translate-x-1/2 rounded-full bg-teal-950" />
              </div>
            </div>

            {/* Sheers: draw aside on hover, keep swaying in the breeze. Lighter once the real
                view is playing, so it shows through them the way it would through voile. */}
            <div className="absolute inset-0 transition-opacity duration-1600 group-data-live:opacity-70">
              {[
                {
                  side: "left-0",
                  sway: "origin-top-left",
                  aside: "group-hover:-translate-x-[55%] group-data-open:-translate-x-[55%]",
                },
                {
                  side: "right-0",
                  sway: "origin-top-right [animation-delay:-3.5s]",
                  aside: "group-hover:translate-x-[55%] group-data-open:translate-x-[55%]",
                },
              ].map(({ side, sway, aside }) => (
                <div
                  key={side}
                  className={cn(
                    "absolute inset-y-0 w-[34%] transition-transform duration-1200",
                    curtainEase,
                    side,
                    aside,
                  )}
                >
                  <div
                    className={cn("size-full animate-sway bg-white/60", sway)}
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(90deg, rgb(255 255 255 / 0.65) 0 7%, rgb(255 255 255 / 0.15) 11%, rgb(255 255 255 / 0.65) 15%)",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sill */}
        <div className="relative mx-auto -mt-1 h-3 w-[108%] -translate-x-[3.7%] rounded-sm bg-teal-950" />

        {/* Light falling into the room: stretches and brightens as the blind rises */}
        <div className="relative">
          <div
            className={cn(
              "mx-auto h-24 w-[90%] origin-top opacity-60 transition-[transform,opacity] delay-200 duration-1600",
              curtainEase,
              "group-hover:scale-y-150 group-hover:opacity-100 group-data-open:scale-y-150 group-data-open:opacity-100",
            )}
          >
            <div
              className="size-full [mask-image:linear-gradient(180deg,black,transparent)]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(90deg, rgb(242 200 121 / 0.55) 0 14%, transparent 14% 20%)",
                transform: "perspective(300px) rotateX(55deg)",
                transformOrigin: "top",
              }}
            />
          </div>
        </div>
      </div>

      {/* Dust drifting in the sunbeam */}
      <div className="pointer-events-none absolute inset-x-[8%] top-[8%] bottom-[18%] opacity-0 transition-opacity delay-500 duration-1000 group-hover:opacity-100 group-data-open:opacity-100">
        {dust.map((d) => (
          <span
            key={d.left + d.top}
            className="absolute size-1 animate-dust rounded-full bg-white shadow-[0_0_6px_1px_rgb(242_200_121/0.9)]"
            style={
              {
                left: d.left,
                top: d.top,
                animationDelay: d.delay,
                "--dust-x": d.x,
                "--dust-y": d.y,
                "--dust-opacity": 0.85,
              } as CSSProperties
            }
          />
        ))}
      </div>

      {/* Hint — fades once the light is in */}
      <p className="mt-2 text-center eyebrow text-teal-700/60 transition-opacity duration-500 group-hover:opacity-0">
        <span className="pointer-coarse:hidden">Hover to let the light in</span>
        <span className="hidden pointer-coarse:inline">Tap to let the light in</span>
      </p>
    </div>
  )
}
