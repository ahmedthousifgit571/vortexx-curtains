import { cn } from "@/lib/utils"
import {
  logoViewBox,
  markPath,
  markViewBox,
  taglinePath,
  wordPath,
  wordViewBox,
} from "./logo-paths"

/** The slatted blind from the Lourtex logo. Takes its colour from `currentColor`. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox={markViewBox} aria-hidden fill="currentColor" className={cn("size-8", className)}>
      <path d={markPath} />
    </svg>
  )
}

/** Horizontal lockup for tight spots (header, menu): the mark beside "Lourtex". */
export function Wordmark({
  className,
  withMark = true,
}: {
  className?: string
  withMark?: boolean
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 sm:gap-3", className)}>
      {withMark && <LogoMark className="size-8 sm:size-9" />}
      <svg viewBox={wordViewBox} aria-hidden fill="currentColor" className="h-5 w-auto sm:h-6">
        <path fillRule="evenodd" d={wordPath} />
      </svg>
    </span>
  )
}

/** The full stacked logo as supplied: mark, "Lourtex", then the tagline. */
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox={logoViewBox}
      aria-hidden
      fill="currentColor"
      className={cn("h-auto w-36", className)}
    >
      <path d={markPath} />
      <path fillRule="evenodd" d={wordPath} />
      <path fillRule="evenodd" d={taglinePath} />
    </svg>
  )
}
