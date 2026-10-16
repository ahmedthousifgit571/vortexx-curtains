/**
 * Runs synchronously during HTML parsing (before first paint) on hard loads.
 * On the client the tag becomes text/plain so React doesn't warn or re-run it.
 */
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
