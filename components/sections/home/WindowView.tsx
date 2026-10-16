"use client"

import { useEffect, useRef, useState } from "react"
import { INTRO_DONE_EVENT } from "@/components/scenes/Intro"
import { useReducedMotion } from "@/hooks/useReducedMotion"
import { media, videoSources } from "@/lib/media.config"
import { heroWindow } from "@/lib/motion"
import { cn } from "@/lib/utils"

type Connection = { saveData?: boolean; effectiveType?: string }

/** Data Saver, or a connection too slow to spend on scenery. */
function lowBandwidth() {
  const c = (navigator as Navigator & { connection?: Connection }).connection
  return !!c && (c.saveData === true || /2g|3g/.test(c.effectiveType ?? ""))
}

/** Waits for an idle moment, falling back to a timer where requestIdleCallback is missing (Safari). */
function whenIdle(run: () => void) {
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(run, { timeout: heroWindow.viewIdleTimeout })
    return () => window.cancelIdleCallback(id)
  }
  const id = window.setTimeout(run, 200)
  return () => window.clearTimeout(id)
}

/**
 * Real daylight behind the hero window's glass: a short muted loop that fades in
 * over the illustrated sky once it's playing.
 *
 * It costs nothing on first load. The HTML ships no source or poster; the clip is
 * only requested after the intro curtains are opened (on a fresh load of "/"),
 * the page has finished loading, the browser is idle and the window is on
 * screen. Opening the intro takes input, which ends LCP measurement, so the
 * clip can never become the LCP element. Phones get a lighter file. It pauses
 * off-screen and in background tabs, and is skipped for reduced motion, Data
 * Saver and 2G/3G.
 */
export function WindowView({
  className,
  onShow,
}: {
  className?: string
  /** Called once the clip is playing and fading in. */
  onShow?: () => void
}) {
  const ref = useRef<HTMLVideoElement>(null)
  const [shown, setShown] = useState(false)
  const reduced = useReducedMotion()
  // Read through a ref so a new callback identity never restarts loading.
  const onShowRef = useRef(onShow)
  useEffect(() => {
    onShowRef.current = onShow
  })

  useEffect(() => {
    const video = ref.current
    if (!video || reduced || !media["hero-window-view"].ready || lowBandwidth()) return
    // Hydration doesn't always set the property, and autoplay needs it.
    video.muted = true

    let started = false
    let visible = false
    const stops: (() => void)[] = []
    const sync = () => {
      if (!started) return
      if (visible && !document.hidden) video.play().catch(() => {})
      else video.pause()
    }

    const start = () => {
      started = true
      const src = videoSources("hero-window-view")
      const phone = window.matchMedia("(max-width: 767px)").matches
      video.src = phone
        ? src.mobile
        : video.canPlayType('video/webm; codecs="vp9"')
          ? src.webm
          : src.mp4
      video.addEventListener(
        "playing",
        () => {
          setShown(true)
          onShowRef.current?.()
        },
        { once: true },
      )
      sync()
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      sync()
    })
    io.observe(video)
    document.addEventListener("visibilitychange", sync)

    // intro → page load → idle → start (each step only if still needed)
    const afterLoad = () => stops.push(whenIdle(start))
    const afterIntro = () => {
      if (document.readyState === "complete") afterLoad()
      else {
        window.addEventListener("load", afterLoad, { once: true })
        stops.push(() => window.removeEventListener("load", afterLoad))
      }
    }
    if (document.documentElement.dataset.intro === "active") {
      window.addEventListener(INTRO_DONE_EVENT, afterIntro, { once: true })
      stops.push(() => window.removeEventListener(INTRO_DONE_EVENT, afterIntro))
    } else afterIntro()

    return () => {
      for (const stop of stops) stop()
      io.disconnect()
      document.removeEventListener("visibilitychange", sync)
      video.pause()
      // Drop the buffered clip.
      video.removeAttribute("src")
      video.load()
    }
  }, [reduced])

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      disablePictureInPicture
      disableRemotePlayback
      className={cn(
        "object-cover opacity-0 transition-opacity duration-1600 ease-out-soft",
        shown && "opacity-100",
        className,
      )}
    />
  )
}
