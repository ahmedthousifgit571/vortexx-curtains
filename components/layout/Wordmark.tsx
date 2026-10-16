import { cn } from "@/lib/utils"

/** Slatted square mark — the stripe motif from the business card. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={cn("size-8", className)}>
      <rect width="32" height="32" rx="7" fill="#154A5E" />
      {[7, 12, 17, 22].map((x) => (
        <rect key={x} x={x} y="7" width="3" height="18" rx="1" fill="#FFFFFF" />
      ))}
    </svg>
  )
}

export function Wordmark({
  className,
  withMark = true,
}: {
  className?: string
  withMark?: boolean
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      {withMark && <LogoMark />}
      <span className="font-display text-xl leading-none tracking-[0.12em] uppercase sm:text-2xl">
        Lourtex
      </span>
    </span>
  )
}
