"use client"

import Image from "next/image"
import { useState, type CSSProperties } from "react"
import { ImageIcon } from "lucide-react"
import type { Mechanic, ProductImage } from "@/lib/products"
import { cn } from "@/lib/utils"

const BANDS = 9

/** Each mechanic's fabric texture, scaled by `--u` (1px on a swatch, larger on a placeholder). */
const texture: Record<Mechanic, string> = {
  zebra:
    "repeating-linear-gradient(180deg, transparent 0 calc(var(--u) * 4), rgb(255 255 255 / 0.35) calc(var(--u) * 4) calc(var(--u) * 7))",
  fold: "repeating-linear-gradient(180deg, transparent 0 calc(var(--u) * 6), rgb(0 0 0 / 0.16) calc(var(--u) * 6) calc(var(--u) * 7))",
  roll: "linear-gradient(180deg, rgb(255 255 255 / 0.3), transparent 60%, rgb(0 0 0 / 0.12))",
  pleat:
    "repeating-linear-gradient(180deg, rgb(0 0 0 / 0.14) 0 calc(var(--u) * 0.6), transparent calc(var(--u) * 0.6) calc(var(--u) * 2.5))",
  motor:
    "repeating-linear-gradient(180deg, rgb(255 255 255 / 0.25) 0 calc(var(--u) * 0.6), transparent calc(var(--u) * 0.6) calc(var(--u) * 3.4), rgb(0 0 0 / 0.2) calc(var(--u) * 3.4) calc(var(--u) * 4))",
  tilt: "repeating-linear-gradient(180deg, rgb(255 255 255 / 0.35) 0 calc(var(--u) * 2), rgb(0 0 0 / 0.16) calc(var(--u) * 2) calc(var(--u) * 5))",
}

/**
 * Arched photo of the product with shade swatches. On first paint the photo is
 * uncovered by teal bands lifting away — a zebra blind opening. Shades without
 * a photo yet show a tinted placeholder in their place.
 */
export function ProductShowcase({
  images,
  name,
  mechanic,
}: {
  images: ProductImage[]
  name: string
  mechanic: Mechanic
}) {
  const [active, setActive] = useState(0)

  return (
    <div className="mx-auto w-full max-w-lg">
      <div className="relative">
        {/* Warm light spilling round the frame */}
        <div aria-hidden className="absolute -inset-8 rounded-full bg-sunlight/30 blur-3xl" />
        <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-2xl bg-teal-900 p-2.5 shadow-[0_40px_80px_-30px_rgb(11_40_51/0.6)]">
          <div className="relative size-full overflow-hidden rounded-t-[999px] rounded-b-xl bg-ivory-200">
            {images.map((img, i) => {
              const shown = cn(
                "transition-[opacity,transform] duration-1000 ease-[var(--ease-out-soft)]",
                i === active ? "scale-100 opacity-100" : "scale-105 opacity-0",
              )
              return img.src ? (
                <Image
                  key={img.shade}
                  src={img.src}
                  alt={i === active ? img.alt : ""}
                  aria-hidden={i !== active}
                  fill
                  placeholder="blur"
                  preload={i === 0}
                  sizes="(min-width: 1024px) 34rem, 92vw"
                  className={cn("object-cover", shown)}
                  style={{ objectPosition: img.position ?? "50% 50%" }}
                />
              ) : (
                <Placeholder key={img.shade} image={img} mechanic={mechanic} className={shown} />
              )
            })}

            {/* Zebra reveal: bands lift away top-down on load */}
            <div aria-hidden className="pointer-events-none absolute inset-0 flex flex-col">
              {Array.from({ length: BANDS }, (_, i) => (
                <div
                  key={i}
                  className="flex-1 origin-top animate-band-out bg-teal-800"
                  style={{ animationDelay: `${0.25 + i * 0.07}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Shade picker */}
      <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
        <p className="eyebrow text-teal-700/70">
          Shade <span className="ml-2 text-teal-900">{images[active].shade}</span>
        </p>
        <div role="radiogroup" aria-label={`${name} shades`} className="flex gap-2.5">
          {images.map((img, i) => (
            <button
              key={img.shade}
              type="button"
              role="radio"
              aria-checked={i === active}
              aria-label={img.shade}
              onClick={() => setActive(i)}
              className={cn(
                "grid size-10 place-items-center rounded-full ring-1 ring-teal-900/15 transition-[box-shadow,transform] outline-none hover:scale-110 focus-visible:ring-2 focus-visible:ring-teal-600",
                i === active && "ring-2 ring-teal-700",
              )}
            >
              <span
                className="size-7 rounded-full shadow-inner"
                style={
                  {
                    "--u": "1px",
                    backgroundColor: img.swatch,
                    backgroundImage: texture[mechanic],
                  } as CSSProperties
                }
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

/** Stand-in until the shade is photographed: its colour and texture, clearly labelled. */
function Placeholder({
  image,
  mechanic,
  className,
}: {
  image: ProductImage
  mechanic: Mechanic
  className?: string
}) {
  return (
    <div
      aria-hidden
      className={cn("absolute inset-0 grid place-items-center", className)}
      style={
        {
          "--u": "6px",
          backgroundColor: image.swatch,
          backgroundImage: `radial-gradient(ellipse 70% 55% at 50% 30%, rgb(255 255 255 / 0.28), transparent 70%), ${texture[mechanic]}`,
        } as CSSProperties
      }
    >
      <div className="flex items-center gap-2.5 rounded-full bg-ivory/85 px-4 py-2 text-teal-900 shadow-sm backdrop-blur-sm">
        <ImageIcon className="size-4" aria-hidden />
        <span className="eyebrow">Photo coming soon</span>
      </div>
    </div>
  )
}
