import type { Mechanic } from "@/lib/products"
import { cn } from "@/lib/utils"

/**
 * A window dressed in one treatment. Hovering (or focusing) the nearest `.group`
 * plays that treatment's mechanic in CSS. Phase 3's Wall of Windows builds on this.
 */
export function WindowFrame({ mechanic, className }: { mechanic: Mechanic; className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-md bg-teal-950 p-2 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.06)] [perspective:900px]",
        className,
      )}
    >
      {/* Daylight outside */}
      <div className="absolute inset-2 overflow-hidden rounded-t-[999px] rounded-b-sm bg-gradient-to-b from-sunlight-soft via-ivory to-teal-100">
        <div className="absolute top-[18%] left-1/2 size-1/3 -translate-x-1/2 rounded-full bg-sunlight/70 blur-2xl" />
        {/* Mullions */}
        <div className="absolute inset-y-0 left-1/2 w-1 -translate-x-1/2 bg-teal-950/80" />
        <div className="absolute inset-x-0 top-[58%] h-1 bg-teal-950/80" />
      </div>
      <div className="absolute inset-2 overflow-hidden rounded-t-[999px] rounded-b-sm">
        <Treatment mechanic={mechanic} />
      </div>
    </div>
  )
}

const move = "transition-transform duration-[1100ms] ease-[var(--ease-curtain)]"

function Treatment({ mechanic }: { mechanic: Mechanic }) {
  switch (mechanic) {
    case "roll":
      return (
        <>
          <div className="absolute inset-x-0 top-0 z-10 h-3 bg-teal-900 shadow-md" />
          <div
            className={cn(
              "absolute inset-0 origin-top bg-teal-700 group-hover:scale-y-[0.06] group-focus-visible:scale-y-[0.06]",
              move,
            )}
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgb(255 255 255 / 0.06), transparent 40%, rgb(0 0 0 / 0.25))",
            }}
          >
            <div className="absolute inset-x-0 bottom-0 h-2 bg-teal-950/70" />
          </div>
        </>
      )
    case "tilt":
      return (
        <div className="absolute inset-0 flex flex-col">
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              className={cn(
                "flex-1 bg-ivory-300 shadow-[0_1px_0_rgb(0_0_0/0.25)] group-hover:[transform:rotateX(72deg)] group-focus-visible:[transform:rotateX(72deg)]",
                move,
              )}
              style={{
                transitionDelay: `${i * 30}ms`,
                // Aluminium louvre: lit top edge, shaded underside.
                backgroundImage:
                  "linear-gradient(180deg, rgb(255 255 255 / 0.7), transparent 35%, rgb(0 0 0 / 0.14))",
              }}
            />
          ))}
        </div>
      )
    case "fold":
      return (
        <div
          className={cn(
            "absolute inset-x-0 top-0 flex h-full origin-top flex-col group-hover:scale-y-[0.32] group-focus-visible:scale-y-[0.32]",
            move,
          )}
        >
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className="flex-1 border-b border-black/15 bg-teal-600"
              style={{
                backgroundImage:
                  "linear-gradient(180deg, rgb(255 255 255 / 0.12), transparent 50%, rgb(0 0 0 / 0.18))",
              }}
            />
          ))}
        </div>
      )
    case "zebra":
      // Two banded layers: offset = solid bands cover the sheers (closed);
      // hover slides the front layer one band (3.5 = 14px) so the sheers line up.
      return (
        <>
          <div className="absolute inset-0" style={{ backgroundImage: zebraBands }} />
          <div
            className={cn(
              "absolute inset-x-0 -top-3.5 bottom-0 group-hover:translate-y-3.5 group-focus-visible:translate-y-3.5",
              move,
            )}
            style={{ backgroundImage: zebraBands }}
          />
          <div className="absolute inset-x-0 top-0 z-10 h-3 bg-teal-900 shadow-md" />
        </>
      )
    case "pleat":
      return (
        <div
          className={cn(
            "absolute inset-x-0 top-0 flex h-full origin-top flex-col group-hover:scale-y-[0.14] group-focus-visible:scale-y-[0.14]",
            move,
          )}
        >
          {Array.from({ length: 14 }, (_, i) => (
            <div
              key={i}
              className="flex-1 bg-ivory-200"
              style={{
                backgroundImage:
                  "linear-gradient(180deg, rgb(0 0 0 / 0.12), rgb(255 255 255 / 0.5) 45%, rgb(0 0 0 / 0.16))",
              }}
            />
          ))}
        </div>
      )
    case "motor":
      // Aluminium roller shutter: slow, linear, motor-driven, with a status LED.
      return (
        <>
          <div
            className={cn(
              "absolute inset-0 origin-top bg-teal-900 group-hover:scale-y-[0.04] group-focus-visible:scale-y-[0.04]",
              move,
              "duration-1800 ease-linear",
            )}
            style={{
              backgroundImage:
                "repeating-linear-gradient(180deg, rgb(255 255 255 / 0.14) 0 1px, rgb(255 255 255 / 0.04) 2px 7px, rgb(0 0 0 / 0.35) 8px 9px)",
            }}
          />
          <div className="absolute inset-x-0 top-0 z-10 h-4 bg-teal-950 shadow-md" />
          <span className="absolute top-1.5 left-1/2 z-10 size-1.5 -translate-x-1/2 rounded-full bg-sunlight shadow-[0_0_8px_2px_rgb(242_200_121/0.8)] group-hover:animate-pulse" />
        </>
      )
  }
}

const zebraBands =
  "repeating-linear-gradient(180deg, var(--color-teal-700) 0 14px, rgb(255 255 255 / 0.28) 14px 28px)"
