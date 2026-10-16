"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { ReactLenis, useLenis, type LenisRef } from "lenis/react"
import { gsap, ScrollTrigger } from "@/lib/gsap"
import { useReducedMotion } from "@/hooks/useReducedMotion"

/** Feeds Lenis scroll events into ScrollTrigger. */
function ScrollTriggerSync() {
  useLenis(ScrollTrigger.update)
  return null
}

/**
 * Lenis smooth scrolling driven by gsap.ticker so ScrollTrigger and Lenis share
 * one clock. Disabled entirely when the visitor prefers reduced motion.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion()
  const lenisRef = useRef<LenisRef>(null)

  useEffect(() => {
    if (reduced) return
    const update = (time: number) => lenisRef.current?.lenis?.raf(time * 1000)
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)
    return () => gsap.ticker.remove(update)
  }, [reduced])

  // Layout can shift once webfonts and images settle — re-measure triggers.
  useEffect(() => {
    let cancelled = false
    document.fonts?.ready.then(() => !cancelled && ScrollTrigger.refresh())
    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener("load", onLoad)
    return () => {
      cancelled = true
      window.removeEventListener("load", onLoad)
    }
  }, [])

  if (reduced) return <>{children}</>

  return (
    <ReactLenis root ref={lenisRef} options={{ autoRaf: false, lerp: 0.1, anchors: true }}>
      <ScrollTriggerSync />
      {children}
    </ReactLenis>
  )
}
