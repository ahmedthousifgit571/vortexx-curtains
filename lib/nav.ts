import type { ProductCategory } from "./products"

/** Remote-control buttons = primary navigation. */
export type RemoteButton = {
  label: string
  href: string
  /** Lights up on any product page in this category. */
  category?: ProductCategory
}

export const remoteButtons: RemoteButton[] = [
  { label: "Blinds", href: "/products#blinds", category: "blinds" },
  { label: "Shutters", href: "/products/motorised-shutters", category: "shutters" },
  { label: "Pergolas", href: "/products/pergolas", category: "pergolas" },
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
]

/** Header links (desktop). */
export const headerNav = [
  { label: "Products", href: "/products" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
]

/** Full-screen mobile menu, in story order. */
export const mobileNav = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Light Lab", href: "/light-lab" },
  { label: "Services", href: "/services" },
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
]

export const footerNav = [
  { label: "Products", href: "/products" },
  { label: "Light Lab", href: "/light-lab" },
  { label: "Services", href: "/services" },
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
]
