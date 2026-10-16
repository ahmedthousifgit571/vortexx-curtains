import Link from "next/link"
import { Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { site } from "@/lib/site"
import { HeaderNav } from "./HeaderNav"
import { MobileMenu } from "./MobileMenu"
import { Wordmark } from "./Wordmark"

export function Header() {
  const primary = site.contacts[0]
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[var(--header-h)]">
      <div
        data-hide-during-intro
        className="absolute inset-0 border-b border-ink/5 bg-ivory/80 backdrop-blur-md transition-opacity duration-500"
      />
      <div className="relative container-site flex h-full items-center justify-between gap-6">
        <Link
          href="/"
          data-hide-during-intro
          aria-label="Lourtex home"
          className="pointer-events-auto text-teal-800 transition-opacity duration-500"
        >
          <Wordmark />
        </Link>
        <div className="pointer-events-auto flex items-center gap-2 sm:gap-4 lg:gap-8">
          <HeaderNav />
          <a
            href={`tel:${primary.tel}`}
            data-hide-during-intro
            className="hidden items-center gap-2 text-sm font-semibold text-teal-800 transition-opacity duration-500 hover:text-teal-600 xl:inline-flex"
          >
            <Phone className="size-4" aria-hidden />
            {primary.phone}
          </a>
          <Button asChild size="cta" className="h-10 px-4 sm:px-5" data-quote-cta>
            <Link href="/contact">Get a Quote</Link>
          </Button>
          <MobileMenu />
        </div>
      </div>
    </header>
  )
}
