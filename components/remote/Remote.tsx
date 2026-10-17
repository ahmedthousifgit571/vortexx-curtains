"use client"

import Link from "next/link"
import { MessageCircle } from "lucide-react"
import { LogoMark } from "@/components/layout/Wordmark"
import { remoteButtons } from "@/lib/nav"
import { whatsappLink } from "@/lib/site"
import { cn } from "@/lib/utils"
import { useActiveButton } from "./useActiveButton"

/** The IR window at the top of the remote, in the slat motif. */
function IrWindow({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "relative h-4 overflow-hidden rounded-full bg-teal-700 ring-1 ring-white/10",
        className,
      )}
    >
      <div className="absolute inset-0 stripes [--slat-gap:5px] [--slat:2px] [--stripe-alpha:0.55]" />
      <span className="absolute top-1/2 right-2 size-1.5 -translate-y-1/2 rounded-full bg-sunlight shadow-[0_0_8px_2px_rgb(242_200_121/0.7)]" />
    </div>
  )
}

const remoteKey =
  "block rounded-full text-center font-label font-semibold tracking-[0.16em] font-stretch-expanded uppercase outline-none transition-[background-color,color,transform] duration-200 focus-visible:ring-2 focus-visible:ring-sunlight active:scale-95"
const remoteKeyIdle = "bg-white/[0.06] text-white/75 hover:bg-white/[0.14] hover:text-white"
const remoteKeyActive = "bg-white text-teal-900"

/** Desktop: floating remote on the right edge. */
function DesktopRemote() {
  const isActive = useActiveButton()
  return (
    <nav
      aria-label="Remote control navigation"
      data-hide-during-intro
      className="fixed top-1/2 right-5 z-[65] hidden -translate-y-1/2 transition-opacity duration-700 xl:block"
    >
      <div className="w-[5.5rem] rounded-[2.4rem] bg-gradient-to-b from-teal-900 to-teal-950 p-2.5 shadow-[0_24px_60px_-20px_rgb(11_40_51/0.7),inset_0_1px_0_rgb(255_255_255/0.08)] ring-1 ring-white/10">
        <IrWindow className="mx-1.5 mt-1" />
        <Link
          href="/"
          aria-label="Home"
          className="mx-auto my-3 grid size-12 place-items-center rounded-full bg-teal-700 shadow-inner ring-1 ring-white/15 transition-transform outline-none hover:scale-105 focus-visible:ring-2 focus-visible:ring-sunlight active:scale-95"
        >
          <LogoMark className="size-6 text-white" />
        </Link>
        <ul className="flex flex-col gap-1.5">
          {remoteButtons.map((b) => {
            const active = isActive(b)
            return (
              <li key={b.href}>
                <Link
                  href={b.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    remoteKey,
                    // Narrow remote: normal width so "MOTORISED" fits the key.
                    "py-2.5 text-[0.6rem] tracking-[0.08em] font-stretch-normal",
                    active ? remoteKeyActive : remoteKeyIdle,
                  )}
                >
                  {b.label}
                </Link>
              </li>
            )
          })}
        </ul>
        <p
          aria-hidden
          className="mt-3 mb-1 text-center text-[0.5rem] tracking-[0.35em] text-white/30"
        >
          LOURTEX
        </p>
      </div>
    </nav>
  )
}

/** Below xl the remote is replaced by the header menu; WhatsApp stays one tap away. */
function WhatsAppFab() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Lourtex on WhatsApp"
      data-hide-during-intro
      className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-[65] transition-opacity duration-500 xl:hidden"
    >
      <span className="fab-in relative grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_14px_30px_-10px_rgb(11_40_51/0.6)] outline-none active:scale-95">
        <span aria-hidden className="fab-ring absolute inset-0 rounded-full bg-[#25D366]" />
        <MessageCircle className="relative size-6" aria-hidden />
      </span>
    </a>
  )
}

export function Remote() {
  return (
    <>
      <DesktopRemote />
      <WhatsAppFab />
    </>
  )
}
