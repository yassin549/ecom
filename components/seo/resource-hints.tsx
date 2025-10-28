/**
 * Resource Hints for DNS prefetch, preconnect, and preload
 * Add this to your root layout
 */

export function ResourceHints() {
  return (
    <>
      {/* DNS Prefetch - Resolve DNS for external domains early */}
      <link rel="dns-prefetch" href="https://images.unsplash.com" />
      <link rel="dns-prefetch" href="https://assets.mixkit.co" />
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      <link rel="dns-prefetch" href="https://fonts.gstatic.com" />

      {/* Preconnect - Establish early connections to important origins */}
      <link
        rel="preconnect"
        href="https://images.unsplash.com"
        crossOrigin="anonymous"
      />
      <link
        rel="preconnect"
        href="https://fonts.googleapis.com"
        crossOrigin="anonymous"
      />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />

      {/* Preload - Load critical resources early */}
      <link
        rel="preload"
        href="/fonts/inter-var.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
    </>
  )
}
