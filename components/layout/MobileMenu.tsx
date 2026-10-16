"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState, type CSSProperties } from "react"
import { useLenis } from "lenis/react"
import { ArrowRight, MessageCircle, Phone, X } from "lucide-react"
import { Dialog } from "radix-ui"
import { Button } from "@/components/ui/button"
import { mobileNav } from "@/lib/nav"
import { site, whatsappLink } from "@/lib/site"
import { cn } from "@/lib/utils"
import { Wordmark } from "./Wordmark"

const STAGGER_MS = 55
const FIRST_DELAY_MS = 260

const delay = (i: number) =>
  ({ "--menu-delay": `${FIRST_DELAY_MS + i * STAGGER_MS}ms` }) as CSSProperties

/**
 * Mobile/tablet navigation: a full-screen teal blind that rolls down over the page,
 * then the links rise in one by one. Desktop uses the header links and the remote.
 */
export function MobileMenu() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const lenis = useLenis()

  // Hold the page still behind the menu (Lenis ignores the dialog's scroll lock).
  useEffect(() => {
    if (!lenis) return
    if (open) lenis.stop()
    else lenis.start()
  }, [open, lenis])

  const close = () => setOpen(false)

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        data-hide-during-intro
        aria-label="Open menu"
        className="group grid size-10 place-items-center rounded-full border border-teal-700/25 bg-white/60 text-teal-800 transition-[opacity,background-color] duration-500 outline-none hover:bg-white focus-visible:ring-2 focus-visible:ring-teal-600 lg:hidden"
      >
        <span aria-hidden className="flex w-4 flex-col items-end gap-[5px]">
          <span className="h-0.5 w-4 rounded-full bg-current" />
          <span className="h-0.5 w-2.5 rounded-full bg-current transition-[width] duration-300 group-hover:w-4" />
        </span>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Content
          data-lenis-prevent
          onCloseAutoFocus={(e) => e.preventDefault()}
          className="menu-panel fixed inset-0 z-[90] flex flex-col overflow-y-auto bg-teal-950 text-white outline-none"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 stripes opacity-[0.035] [--slat-gap:38px] [--slat:2px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-[60%]"
            style={{
              backgroundImage:
                "radial-gradient(ellipse 70% 60% at 80% 0%, rgb(242 200 121 / 0.14), transparent 70%)",
            }}
          />

          <div className="relative container-site flex h-[var(--header-h)] shrink-0 items-center justify-between">
            <Link href="/" onClick={close} aria-label="Lourtex home" className="text-white">
              <Wordmark />
            </Link>
            <Dialog.Close
              aria-label="Close menu"
              className="menu-close grid size-10 place-items-center rounded-full border border-white/20 text-white outline-none hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-sunlight"
            >
              <X className="size-5" aria-hidden />
            </Dialog.Close>
          </div>
          <div
            aria-hidden
            className="h-2 shrink-0 bg-teal-700 stripes [--slat-gap:8px] [--slat:3px] [--stripe-alpha:0.5]"
          />

          <Dialog.Title className="sr-only">Menu</Dialog.Title>
          <Dialog.Description className="sr-only">Pages on the Lourtex site.</Dialog.Description>

          <nav aria-label="Mobile" className="relative container-site flex-1 py-6">
            <ul>
              {mobileNav.map((item, i) => {
                const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
                return (
                  <li
                    key={item.href}
                    className="menu-row border-b border-white/10"
                    style={delay(i)}
                  >
                    <Link
                      href={item.href}
                      onClick={close}
                      aria-current={active ? "page" : undefined}
                      className="group flex items-baseline gap-4 overflow-hidden py-3 outline-none focus-visible:text-sunlight"
                    >
                      <span className="menu-rise w-6 font-label text-[0.6rem] tracking-[0.2em] text-white/35 font-stretch-expanded">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={cn(
                          "menu-rise font-display text-[clamp(2.1rem,9vw,3rem)] leading-[1.05] transition-colors",
                          active
                            ? "text-sunlight italic"
                            : "text-white group-hover:text-sunlight-soft",
                        )}
                      >
                        {item.label}
                      </span>
                      <ArrowRight
                        aria-hidden
                        className="menu-rise ml-auto size-5 self-center text-white/30 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-sunlight"
                      />
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div
            className="menu-row relative container-site shrink-0 space-y-5 pt-2 pb-[max(2rem,env(safe-area-inset-bottom))]"
            style={delay(mobileNav.length)}
          >
            <div className="flex gap-3">
              <Button asChild size="cta" variant="light" className="flex-1">
                <Link href="/contact" onClick={close}>
                  Get a quote <ArrowRight aria-hidden />
                </Link>
              </Button>
              <Button
                asChild
                size="cta"
                className="bg-[#25D366] px-5 text-white hover:bg-[#25D366]/90"
              >
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chat with Lourtex on WhatsApp"
                >
                  <MessageCircle aria-hidden />
                </a>
              </Button>
            </div>
            <ul className="grid grid-cols-2 gap-3 text-sm">
              {site.contacts.map((c) => (
                <li key={c.tel}>
                  <a
                    href={`tel:${c.tel}`}
                    className="block rounded-2xl border border-white/10 px-4 py-3 transition-colors hover:border-white/30 hover:bg-white/5"
                  >
                    <span className="flex items-center gap-1.5 text-xs text-white/50">
                      <Phone className="size-3" aria-hidden /> {c.name}
                    </span>
                    <span className="mt-1 block font-semibold text-white">{c.phone}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
