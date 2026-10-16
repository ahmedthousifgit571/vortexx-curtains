"use client"

import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react"
import { ChevronDown, ChevronUp, Square } from "lucide-react"
import { useReducedMotion } from "@/hooks/useReducedMotion"
import type { HowItWorks, Mechanic } from "@/lib/products"
import { productDemo } from "@/lib/motion"
import { cn } from "@/lib/utils"

type Demo = HowItWorks["demo"]

const bands = (solid: string) =>
  `repeating-linear-gradient(180deg, ${solid} 0 var(--band), rgb(255 255 255 / 0.34) var(--band) calc(var(--band) * 2))`

/** Skyline outside the window — a few towers, Bangalore-apartment style. */
const towers = [
  { left: "6%", w: "11%", h: "34%" },
  { left: "19%", w: "8%", h: "48%" },
  { left: "29%", w: "13%", h: "28%" },
  { left: "45%", w: "9%", h: "56%" },
  { left: "57%", w: "12%", h: "38%" },
  { left: "72%", w: "8%", h: "46%" },
  { left: "83%", w: "12%", h: "30%" },
]

/** Clouds for views looking straight up (skylights, pergola roofs). */
const clouds = [
  { left: "6%", top: "24%", w: "42%" },
  { left: "50%", top: "52%", w: "34%" },
  { left: "14%", top: "74%", w: "28%" },
]

const fabric = {
  roll: "linear-gradient(180deg, rgb(255 255 255 / 0.08), transparent 40%, rgb(0 0 0 / 0.22))",
  // Open weave: fine threads both ways over a see-through tint.
  mesh: "repeating-linear-gradient(90deg, rgb(0 0 0 / 0.22) 0 1px, transparent 1px 3px), repeating-linear-gradient(180deg, rgb(0 0 0 / 0.22) 0 1px, transparent 1px 3px)",
  fold: "linear-gradient(180deg, rgb(255 255 255 / 0.14), transparent 45%, rgb(0 0 0 / 0.26))",
  cell: "linear-gradient(180deg, rgb(0 0 0 / 0.16), rgb(255 255 255 / 0.55) 45%, rgb(0 0 0 / 0.1) 88%, rgb(0 0 0 / 0.3))",
  slats:
    "repeating-linear-gradient(180deg, rgb(255 255 255 / 0.16) 0 1px, rgb(255 255 255 / 0.04) 2px 11px, rgb(0 0 0 / 0.38) 12px 14px)",
  louvre: "linear-gradient(180deg, rgb(255 255 255 / 0.75), transparent 35%, rgb(0 0 0 / 0.16))",
}

function readout(v: number, [closed, partway, open]: Demo["labels"]) {
  if (v < 20) return closed
  if (v < 80) return partway
  return open
}

/**
 * A product's mechanic, operable: 0 = closed, 100 = open. It eases back and
 * forth on its own until the visitor takes over with the slider (or, for
 * motorised shutters, the remote).
 */
export function ProductDemo({
  mechanic,
  demo,
  name,
}: {
  mechanic: Mechanic
  demo: Demo
  name: string
}) {
  const id = useId()
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const [value, setValue] = useState(0)
  const [auto, setAuto] = useState(true)
  // Remote-driven motor: -1 lowering, 0 still, 1 raising.
  const [motor, setMotor] = useState<-1 | 0 | 1>(0)
  const valueRef = useRef(value)

  useEffect(() => {
    valueRef.current = value
  }, [value])

  useEffect(() => {
    const el = ref.current
    if (!el || !auto || reduced) return
    let timer: number | undefined
    const io = new IntersectionObserver(([entry]) => {
      window.clearInterval(timer)
      if (entry.isIntersecting) {
        setValue((v) => (v > 50 ? 0 : 100))
        timer = window.setInterval(() => setValue((v) => (v > 50 ? 0 : 100)), productDemo.autoHold)
      }
    })
    io.observe(el)
    return () => {
      window.clearInterval(timer)
      io.disconnect()
    }
  }, [auto, reduced])

  // The motor runs at a constant speed until it hits an end stop or Stop is pressed.
  useEffect(() => {
    if (!motor) return
    let raf = 0
    let last = performance.now()
    const step = (now: number) => {
      // A frame's timestamp can predate the effect, so never let time run backwards.
      const elapsed = Math.max(0, now - last)
      const next = Math.min(
        100,
        Math.max(0, valueRef.current + (motor * elapsed * 100) / productDemo.motorTravel),
      )
      last = now
      valueRef.current = next
      setValue(next)
      if (next === (motor > 0 ? 100 : 0)) setMotor(0)
      else raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [motor])

  const press = (dir: -1 | 0 | 1) => {
    setAuto(false)
    if (reduced && dir) setValue(dir > 0 ? 100 : 0)
    else setMotor(dir)
  }

  const light = demo.mesh ? 0.35 + (value / 100) * 0.65 : value / 100
  const state = readout(value, demo.labels)

  return (
    <div ref={ref} className="mx-auto w-full max-w-md">
      <div
        aria-hidden
        className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-teal-950 p-2.5 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.6)]"
        style={{ "--band": `${productDemo.band}px` } as CSSProperties}
      >
        <View kind={demo.view ?? "skyline"} />
        <div className="absolute inset-2.5 overflow-hidden rounded-xl">
          <Treatment
            mechanic={mechanic}
            value={value}
            smooth={auto}
            demo={demo}
            running={motor !== 0}
          />
        </div>
      </div>

      {/* Light falling into the room */}
      <div
        aria-hidden
        className={cn(
          "mx-auto h-16 w-[86%] [mask-image:linear-gradient(180deg,black,transparent)]",
          auto && "transition-opacity duration-1400",
        )}
        style={{
          opacity: 0.15 + light * 0.75,
          backgroundImage:
            "repeating-linear-gradient(180deg, rgb(242 200 121 / 0.6) 0 6px, transparent 6px 14px)",
          transform: "perspective(260px) rotateX(55deg)",
          transformOrigin: "top",
        }}
      />

      {mechanic === "motor" ? (
        <div className="mt-2 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow text-teal-200">Use the remote</p>
            <output className="mt-2 block font-display text-2xl text-white">{state}</output>
          </div>
          <div
            role="group"
            aria-label={`${name} remote`}
            className="flex items-center gap-1.5 rounded-full bg-teal-950 p-1.5 ring-1 ring-white/10"
          >
            <RemoteButton label="Raise" onClick={() => press(1)} active={motor === 1}>
              <ChevronUp className="size-5" aria-hidden />
            </RemoteButton>
            <RemoteButton label="Stop" onClick={() => press(0)}>
              <Square className="size-3.5 fill-current" aria-hidden />
            </RemoteButton>
            <RemoteButton label="Lower" onClick={() => press(-1)} active={motor === -1}>
              <ChevronDown className="size-5" aria-hidden />
            </RemoteButton>
          </div>
        </div>
      ) : (
        <div className="mt-2">
          <div className="flex items-baseline justify-between">
            <label htmlFor={id} className="eyebrow text-teal-200">
              Slide to adjust
            </label>
            <output htmlFor={id} className="font-display text-2xl text-white">
              {state}
            </output>
          </div>
          <input
            id={id}
            type="range"
            min={0}
            max={100}
            value={value}
            aria-valuetext={state}
            onChange={(e) => {
              setAuto(false)
              setValue(Number(e.target.value))
            }}
            className="mt-4 w-full cursor-pointer accent-sunlight"
          />
          <div className="mt-2 flex justify-between text-xs text-white/50">
            <span>{demo.labels[0]}</span>
            <span>{demo.labels[2]}</span>
          </div>
        </div>
      )}
    </div>
  )
}

function RemoteButton({
  label,
  onClick,
  active,
  children,
}: {
  label: string
  onClick: () => void
  active?: boolean
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "grid size-12 place-items-center rounded-full bg-white/5 text-white transition-colors outline-none hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-sunlight",
        active && "bg-sunlight text-ink hover:bg-sunlight",
      )}
    >
      {children}
    </button>
  )
}

/** What's behind the glass. */
function View({ kind }: { kind: "skyline" | "sky" }) {
  if (kind === "sky")
    return (
      <div className="absolute inset-2.5 overflow-hidden rounded-xl bg-gradient-to-b from-teal-200 via-teal-100 to-sunlight-soft">
        <div className="absolute top-[10%] left-[58%] size-1/3 rounded-full bg-sunlight blur-2xl" />
        {clouds.map((c) => (
          <div
            key={c.left}
            className="absolute h-[9%] rounded-full bg-white/75 blur-md"
            style={{ left: c.left, top: c.top, width: c.w }}
          />
        ))}
      </div>
    )
  return (
    <div className="absolute inset-2.5 overflow-hidden rounded-xl bg-gradient-to-b from-sunlight-soft via-ivory to-teal-100">
      <div className="absolute top-[16%] left-[62%] size-1/3 rounded-full bg-sunlight blur-2xl" />
      {towers.map((t) => (
        <div
          key={t.left}
          className="absolute bottom-0 rounded-t-sm bg-teal-600/25"
          style={{ left: t.left, width: t.w, height: t.h }}
        />
      ))}
    </div>
  )
}

const Headrail = () => <div className="absolute inset-x-0 top-0 z-10 h-5 bg-teal-900 shadow-lg" />

function Treatment({
  mechanic,
  value,
  smooth,
  demo,
  running,
}: {
  mechanic: Mechanic
  value: number
  /** CSS transitions only for the idle cycle; dragging and the motor move it directly. */
  smooth: boolean
  demo: Demo
  running: boolean
}) {
  const t = value / 100
  const glide = smooth && "transition-transform duration-1400 ease-[var(--ease-curtain)]"

  switch (mechanic) {
    case "zebra": {
      // Back layer fixed, front layer slides by up to one band.
      const offset = (1 - t) * productDemo.band
      return (
        <>
          <div
            className="absolute inset-0"
            style={{ backgroundImage: bands("var(--color-teal-700)") }}
          />
          <div
            className={cn("absolute inset-x-0 -top-[var(--band)] bottom-0", glide)}
            style={{
              backgroundImage: bands("var(--color-teal-700)"),
              transform: `translateY(${productDemo.band - offset}px)`,
            }}
          />
          <Headrail />
        </>
      )
    }

    case "roll":
      // Fabric winds up into the headrail; the bottom bar parks just beneath it.
      return (
        <>
          <div
            className={cn("absolute inset-0", glide)}
            style={{ transform: `translateY(calc((1.875rem - 100%) * ${t}))` }}
          >
            <div
              className={cn("absolute inset-0", demo.mesh ? "bg-teal-900/55" : "bg-teal-700")}
              style={{ backgroundImage: demo.mesh ? fabric.mesh : fabric.roll }}
            />
            <div className="absolute inset-x-0 bottom-0 h-2.5 bg-teal-950" />
          </div>
          {demo.channels && (
            <>
              <div className="absolute inset-y-0 left-0 z-10 w-3 bg-teal-800 shadow-[inset_-2px_0_0_rgb(255_255_255/0.18),2px_0_6px_rgb(0_0_0/0.3)]" />
              <div className="absolute inset-y-0 right-0 z-10 w-3 bg-teal-800 shadow-[inset_2px_0_0_rgb(255_255_255/0.18),-2px_0_6px_rgb(0_0_0/0.3)]" />
            </>
          )}
          <Headrail />
        </>
      )

    case "fold": {
      // Bottom panel folds first, so the stack of pleats rides up with the hem.
      const n = productDemo.romanFolds
      return (
        <>
          <div className="absolute inset-0">
            {Array.from({ length: n }, (_, i) => {
              const folded = Math.min(1, Math.max(0, t * n - (n - 1 - i)))
              return (
                <div
                  key={i}
                  className={cn(
                    "relative border-b border-black/20 bg-teal-600",
                    i === n - 1 && "border-b-4 border-teal-950",
                    smooth && "transition-[height] duration-1400 ease-[var(--ease-curtain)]",
                  )}
                  style={{
                    height: `${(100 / n) * (1 - folded * (1 - productDemo.romanFolded))}%`,
                    backgroundImage: fabric.fold,
                    transitionDelay: smooth
                      ? `${(n - 1 - i) * productDemo.romanStagger}ms`
                      : undefined,
                  }}
                />
              )
            })}
          </div>
          <Headrail />
        </>
      )
    }

    case "pleat": {
      // Fixed cell count, so the pleats press together as the blind rises.
      const lift = t * productDemo.pleatLift
      return (
        <>
          <div
            className={cn("absolute inset-0 origin-top bg-ivory-200", glide)}
            style={{
              transform: `scaleY(${1 - lift})`,
              backgroundImage: fabric.cell,
              backgroundSize: `100% ${100 / productDemo.pleats}%`,
            }}
          />
          <div
            className={cn("absolute inset-0", glide)}
            style={{ transform: `translateY(${-lift * 100}%)` }}
          >
            <div className="absolute inset-x-0 bottom-0 h-2 bg-ivory-300 shadow-[0_2px_4px_rgb(0_0_0/0.25)]" />
          </div>
          <Headrail />
        </>
      )
    }

    case "motor":
      // Slow, linear, motor-driven; the box LED glows while it runs.
      return (
        <>
          <div
            className={cn(
              "absolute inset-0",
              smooth && "transition-transform duration-1800 ease-linear",
            )}
            style={{ transform: `translateY(calc((2.25rem - 100%) * ${t}))` }}
          >
            <div
              className="absolute inset-0 bg-teal-900"
              style={{ backgroundImage: fabric.slats }}
            />
            <div className="absolute inset-x-0 bottom-0 h-2 bg-teal-950" />
          </div>
          <div className="absolute inset-y-0 left-0 z-10 w-1.5 bg-teal-950/90" />
          <div className="absolute inset-y-0 right-0 z-10 w-1.5 bg-teal-950/90" />
          <div className="absolute inset-x-0 top-0 z-10 h-7 bg-teal-950 shadow-lg" />
          <span
            className={cn(
              "absolute top-2.5 left-1/2 z-10 size-2 -translate-x-1/2 rounded-full bg-sunlight/40",
              (running || smooth) &&
                "animate-pulse bg-sunlight shadow-[0_0_10px_3px_rgb(242_200_121/0.8)]",
            )}
          />
        </>
      )

    case "tilt": {
      // Looking up through the roof: louvres turn edge-on as the roof opens.
      const angle = t * productDemo.louvreTilt
      return (
        <>
          <div className="absolute inset-0 flex flex-col [perspective:900px]">
            {Array.from({ length: productDemo.louvres }, (_, i) => (
              <div
                key={i}
                className={cn(
                  "flex-1 bg-ivory-300 shadow-[0_1px_0_rgb(0_0_0/0.25)]",
                  smooth && "transition-transform duration-1400 ease-[var(--ease-curtain)]",
                )}
                style={{
                  transform: `rotateX(${angle}deg)`,
                  backgroundImage: fabric.louvre,
                  transitionDelay: smooth ? `${i * productDemo.louvreStagger}ms` : undefined,
                }}
              />
            ))}
          </div>
          {/* Frame beams */}
          <div className="absolute inset-y-0 left-0 w-3 bg-teal-950" />
          <div className="absolute inset-y-0 right-0 w-3 bg-teal-950" />
        </>
      )
    }
  }
}
