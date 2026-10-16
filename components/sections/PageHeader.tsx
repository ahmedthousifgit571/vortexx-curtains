import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

/** Opening band for inner pages. */
export function PageHeader({
  eyebrow,
  title,
  children,
  tone = "light",
}: {
  eyebrow: string
  title: ReactNode
  children?: ReactNode
  tone?: "light" | "dark"
}) {
  const dark = tone === "dark"
  return (
    <section
      className={cn(
        "relative isolate overflow-hidden pt-[calc(var(--header-h)+4rem)] pb-16 sm:pb-24",
        dark ? "bg-teal-900 text-white" : "bg-ivory",
      )}
    >
      {dark ? (
        <div
          aria-hidden
          className="absolute inset-y-0 right-0 -z-10 w-2/5 stripes [mask-image:linear-gradient(90deg,transparent,black)] [--slat-gap:20px] [--slat:3px] [--stripe-alpha:0.07]"
        />
      ) : (
        <div
          aria-hidden
          className="absolute inset-0 -z-10 light-slats [mask-image:radial-gradient(ellipse_at_85%_20%,black,transparent_60%)] opacity-50"
        />
      )}
      <div className="container-site">
        <p className={cn("eyebrow", dark ? "text-teal-200" : "text-teal-600")}>{eyebrow}</p>
        <h1
          className={cn(
            "mt-5 max-w-4xl text-[clamp(2.5rem,6vw,4.75rem)] leading-[0.98] font-bold",
            dark ? "text-white" : "text-teal-900",
          )}
        >
          {title}
        </h1>
        {children && (
          <div
            className={cn(
              "mt-6 max-w-2xl text-lg leading-relaxed",
              dark ? "text-white/70" : "text-ink/65",
            )}
          >
            {children}
          </div>
        )}
      </div>
    </section>
  )
}
