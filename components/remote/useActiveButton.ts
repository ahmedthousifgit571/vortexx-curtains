"use client"

import { usePathname } from "next/navigation"
import type { RemoteButton } from "@/lib/nav"
import { getProduct } from "@/lib/products"

/** Returns a predicate telling whether a remote button matches the current route. */
export function useActiveButton() {
  const pathname = usePathname()
  const productSlug = pathname.startsWith("/products/") ? pathname.split("/")[2] : undefined
  const category = productSlug ? getProduct(productSlug)?.category : undefined

  return (button: Pick<RemoteButton, "href" | "category">) =>
    button.category ? button.category === category : pathname === button.href
}
