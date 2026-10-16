import { cn } from "@/lib/utils"

/** Teal band with white slats — the card motif used as a section divider. */
export function StripeDivider({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("relative h-14 overflow-hidden bg-teal-700", className)}>
      <div className="absolute inset-0 stripes [--slat-gap:14px] [--slat:5px] [--stripe-alpha:0.9]" />
      <div className="absolute inset-0 bg-gradient-to-r from-teal-700 via-transparent to-teal-700" />
    </div>
  )
}
