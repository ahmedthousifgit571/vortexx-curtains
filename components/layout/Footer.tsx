import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { footerNav } from "@/lib/nav"
import { products } from "@/lib/products"
import { fullAddress, mapsLink, site, whatsappLink } from "@/lib/site"
import { FooterWordmark } from "./FooterWordmark"
import { Logo } from "./Wordmark"

const linkClass = "text-white/60 transition-colors hover:text-white"

/**
 * A dark rounded panel inset from the page edges: brand and address, link
 * columns, then a giant slatted LOURTEX. Below xl the bottom padding clears
 * the floating WhatsApp button.
 */
export function Footer() {
  return (
    <footer className="px-2.5 pt-2.5 pb-20 sm:px-4 sm:pt-4 xl:pb-4">
      <div className="relative isolate overflow-hidden rounded-[1.75rem] bg-teal-950 text-white sm:rounded-[2.5rem]">
        {/* Daylight pooling under the wordmark */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-[radial-gradient(ellipse_55%_60%_at_50%_100%,rgb(242_200_121/0.12),transparent)]"
        />

        <div className="container-site pt-14 sm:pt-20">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-5">
              <Link href="/" aria-label="Lourtex home" className="inline-block">
                <Logo className="w-32 sm:w-36" />
              </Link>
              <p className="mt-6 max-w-sm leading-relaxed text-white/60">
                Made-to-measure blinds, motorised shutters and pergolas for homes and businesses.
                Measured, made and installed by our own team.
              </p>
              <address className="mt-6 max-w-xs text-sm leading-relaxed text-white/50 not-italic">
                {fullAddress}
              </address>
              <a
                href={mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-white/75 transition-colors hover:text-white"
              >
                Get directions
                <ArrowUpRight
                  aria-hidden
                  className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 lg:col-span-7">
              <nav aria-labelledby="footer-products">
                <h2
                  id="footer-products"
                  className="font-sans text-base font-semibold tracking-normal"
                >
                  Products
                </h2>
                <ul className="mt-5 space-y-3">
                  {products.map((p) => (
                    <li key={p.slug}>
                      <Link href={`/products/${p.slug}`} className={linkClass}>
                        {p.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <nav aria-labelledby="footer-explore">
                <h2
                  id="footer-explore"
                  className="font-sans text-base font-semibold tracking-normal"
                >
                  Explore
                </h2>
                <ul className="mt-5 space-y-3">
                  {footerNav.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className={linkClass}>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="col-span-2 sm:col-span-1">
                <h2 className="font-sans text-base font-semibold tracking-normal">Contact</h2>
                <ul className="mt-5 space-y-3">
                  {site.contacts.map((c) => (
                    <li key={c.tel}>
                      <a href={`tel:${c.tel}`} className="group block">
                        <span className="block text-white/60 transition-colors group-hover:text-white">
                          {c.phone}
                        </span>
                        <span className="text-xs text-white/45">{c.name}</span>
                      </a>
                    </li>
                  ))}
                  <li>
                    <a href={`mailto:${site.email}`} className={`${linkClass} break-all`}>
                      {site.email}
                    </a>
                  </li>
                  <li>
                    <a
                      href={whatsappLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={linkClass}
                    >
                      WhatsApp
                    </a>
                  </li>
                  <li>
                    <Link href="/contact" className={linkClass}>
                      Book a free measure
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-20 sm:mt-28">
            <FooterWordmark />
          </div>

          <div className="mt-6 flex flex-col gap-2 border-t border-white/10 py-7 text-sm text-white/50 sm:flex-row sm:justify-between">
            <p>© {site.copyrightYear} Lourtex · Horamavu, Bangalore</p>
            <p>GSTIN {site.gstin}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
