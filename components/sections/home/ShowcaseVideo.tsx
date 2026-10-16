"use client"

import { useEffect, useRef, useState } from "react"
import { Pause, Play } from "lucide-react"
import { videoSources, type MediaSlotName } from "@/lib/media.config"
import { videoTile } from "@/lib/motion"
import { useReducedMotion } from "@/hooks/useReducedMotion"

type NetworkInfo = { connection?: { saveData?: boolean } }

/**
 * Muted loop that downloads only its poster with the page. Once the page has
 * finished loading and the video is within a viewport, it buffers in the
 * background; it starts playing (from the first frame) when it's partly on
 * screen and pauses when it leaves. Reduced motion or Data Saver: poster only
 * until the visitor presses play. Renders a `data-parallax` layer so
 * RoomsBento can reveal and drift it like the photo tiles.
 */
export function ShowcaseVideo({
  slot,
  label,
  position,
}: {
  slot: MediaSlotName
  label: string
  /** object-position for the crop. */
  position?: string
}) {
  const ref = useRef<HTMLVideoElement>(null)
  const userPaused = useRef(false)
  const [playing, setPlaying] = useState(false)
  const reduced = useReducedMotion()
  const src = videoSources(slot)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    // Hydration doesn't always set the property, and autoplay needs it.
    video.muted = true
    const saveData = (navigator as Navigator & NetworkInfo).connection?.saveData
    if (reduced || saveData) return

    // Buffer ahead, but never compete with the page's own first load.
    const buffer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        buffer.disconnect()
        video.preload = "auto"
        // Nothing requested yet: restart resource selection with the new preload.
        if (video.paused && video.readyState === HTMLMediaElement.HAVE_NOTHING) video.load()
      },
      { rootMargin: videoTile.preloadMargin },
    )
    const watchBuffer = () => buffer.observe(video)
    if (document.readyState === "complete") watchBuffer()
    else window.addEventListener("load", watchBuffer, { once: true })

    const view = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!userPaused.current) video.play().catch(() => {})
        } else video.pause()
      },
      { threshold: videoTile.playThreshold },
    )
    view.observe(video)

    return () => {
      window.removeEventListener("load", watchBuffer)
      buffer.disconnect()
      view.disconnect()
    }
  }, [reduced])

  const toggle = () => {
    const video = ref.current
    if (!video) return
    userPaused.current = !video.paused
    if (video.paused) video.play().catch(() => {})
    else video.pause()
  }

  return (
    <>
      <div data-parallax className="absolute inset-x-0 inset-y-[-8%]">
        <video
          ref={ref}
          className="size-full object-cover"
          style={position ? { objectPosition: position } : undefined}
          aria-label={label}
          muted
          loop
          playsInline
          preload="none"
          poster={src.poster}
          disablePictureInPicture
          disableRemotePlayback
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        >
          <source src={src.webm} type="video/webm" />
          <source src={src.mp4} type="video/mp4" />
        </video>
      </div>
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause video" : "Play video"}
        className="absolute top-3 right-3 z-10 grid size-10 place-items-center rounded-full bg-ink/45 text-white ring-1 ring-white/25 transition-colors outline-none hover:bg-ink/70 focus-visible:ring-2 focus-visible:ring-white sm:top-4 sm:right-4"
      >
        {playing ? (
          <Pause className="size-4" aria-hidden />
        ) : (
          <Play className="size-4 translate-x-px" aria-hidden />
        )}
      </button>
    </>
  )
}
