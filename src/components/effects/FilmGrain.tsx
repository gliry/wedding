/**
 * Static SVG noise overlay across the full viewport. Mounts on top of
 * MainContent (z-60) — sits above sections but doesn't intercept pointer
 * events. Editorial film grain texture, no animation.
 */
export function FilmGrain() {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'>
    <filter id='n'>
      <feTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/>
      <feColorMatrix type='saturate' values='0'/>
    </filter>
    <rect width='100%' height='100%' filter='url(%23n)' opacity='0.08'/>
  </svg>`
  const dataUri = `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60]"
      style={{
        backgroundImage: dataUri,
        backgroundRepeat: 'repeat',
        mixBlendMode: 'multiply',
        opacity: 0.5,
      }}
    />
  )
}
