import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <section className="grid min-h-[80svh] place-items-center bg-teal-950 px-6 pt-[var(--header-h)] text-center text-white">
      <div>
        <p className="eyebrow text-sunlight">404</p>
        <h1 className="mt-5 text-5xl font-bold sm:text-6xl">This window&apos;s still covered.</h1>
        <p className="mx-auto mt-5 max-w-md text-white/65">
          The page you&apos;re looking for isn&apos;t here. Let&apos;s get you back into the light.
        </p>
        <Button asChild size="cta" variant="light" className="mt-9">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </section>
  )
}
