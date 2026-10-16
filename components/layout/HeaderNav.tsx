"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { headerNav } from "@/lib/nav"
import { cn } from "@/lib/utils"

/** Desktop header links. The underline is a slat that slides in on hover. */
export function HeaderNav() {
  const pathname = usePathname()
  return (
    <nav
      aria-label="Main"
      data-hide-during-intro
      className="hidden transition-opacity duration-500 lg:block"
    >
      <ul className="flex items-center gap-8">
        {headerNav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group relative inline-block py-2 font-label text-[0.68rem] font-semibold tracking-[0.2em] uppercase font-stretch-expanded transition-colors outline-none focus-visible:text-teal-600",
                  active ? "text-teal-900" : "text-teal-800/70 hover:text-teal-900",
                )}
              >
                {item.label}
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-x-0 bottom-0 h-0.5 origin-left rounded-full bg-teal-700 transition-transform duration-300 ease-out-soft",
                    active
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100",
                  )}
                />
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
