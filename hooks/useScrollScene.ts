"use client"

import type { RefObject } from "react"
import { useGSAP } from "@/lib/gsap"
import { useReducedMotion } from "./useReducedMotion"

type SceneContext = { reduced: boolean }

/**
 * Scroll-driven scene scoped to `scope`. Everything created inside `build`
 * (tweens, timelines, ScrollTriggers, SplitTexts) is reverted on unmount and
 * rebuilt when `deps` or the reduced-motion preference change.
 */
export function useScrollScene(
  scope: RefObject<HTMLElement | null>,
  build: (ctx: SceneContext) => void | (() => void),
  deps: unknown[] = [],
) {
  const reduced = useReducedMotion()
  useGSAP(() => build({ reduced }), {
    scope,
    dependencies: [reduced, ...deps],
    revertOnUpdate: true,
  })
}
