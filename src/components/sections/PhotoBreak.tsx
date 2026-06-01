import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { useRef } from 'react'
import { SectionPhoto } from '../ui/SectionPhoto'

type PhotoBreakProps = {
  slug: string
  /** Optional script caption overlaid on the photo (light text on dark). */
  caption?: string
  /** Height utility classes (ignored when pinZoom is on). */
  heightClass?: string
  /** Tall sticky section: the image scrubs from `zoomFrom`→1.0 as it scrolls
   *  through, and the caption fades in late. Uses CSS `sticky` for the hold
   *  (robust on iOS native scroll) + a ScrollTrigger scrub — no GSAP pin. */
  pinZoom?: boolean
  /** Starting scale for the pin&zoom (bigger = stronger zoom-in). Default 1.5. */
  zoomFrom?: number
  /** Fraction of the scroll (0–1) at which the image reaches scale 1.0; the
   *  remainder holds the frame. Lower = faster zoom-out. Default 1 (spans all). */
  zoomOutAt?: number
}

/**
 * Full-bleed photo moment — edge-to-edge image with a soft dark gradient and
 * an optional script caption. Breaks the rhythm of text-on-cream sections and
 * provides the light-text-on-photo colour inversion.
 *
 * With `pinZoom`, becomes a tall sticky cinematic moment instead.
 */
export function PhotoBreak({
  slug,
  caption,
  heightClass = 'h-[72vh] md:h-[90vh]',
  pinZoom = false,
  zoomFrom = 1.5,
  zoomOutAt = 1,
}: PhotoBreakProps) {
  const ref = useRef<HTMLElement>(null)
  const imgWrapRef = useRef<HTMLDivElement>(null)
  const capRef = useRef<HTMLParagraphElement>(null)

  useGSAP(
    () => {
      if (!pinZoom || !ref.current || !imgWrapRef.current) return
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) {
        gsap.set(imgWrapRef.current, { scale: 1 })
        if (capRef.current) gsap.set(capRef.current, { opacity: 1, y: 0 })
        return
      }
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        },
      })
      // Zoom out over the first `zoomOutAt` of the scroll, then hold the frame.
      const out = Math.max(0.05, Math.min(1, zoomOutAt))
      tl.fromTo(
        imgWrapRef.current,
        { scale: zoomFrom },
        { scale: 1, ease: 'power1.out', duration: out },
        0
      )
      if (out < 1) {
        tl.to(imgWrapRef.current, { scale: 1, duration: 1 - out })
      }
      if (capRef.current) {
        tl.fromTo(
          capRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, ease: 'none', duration: 0.001 },
          0.55
        )
      }
    },
    { scope: ref, dependencies: [pinZoom, slug] }
  )

  if (pinZoom) {
    return (
      <section ref={ref} className="relative h-[260vh]">
        <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden">
          <div ref={imgWrapRef} className="absolute inset-0 will-change-transform">
            <SectionPhoto
              slug={slug}
              alt=""
              className="absolute inset-0 h-full w-full"
              sizes="100vw"
            />
          </div>
          <div
            className="absolute inset-0"
            aria-hidden
            style={{
              background:
                'linear-gradient(to top, rgba(28,25,16,0.6) 0%, rgba(28,25,16,0.15) 40%, rgba(28,25,16,0.1) 100%)',
            }}
          />
          {caption && (
            <p
              ref={capRef}
              className="absolute inset-x-0 bottom-16 px-6 text-center font-script text-4xl md:text-6xl text-bg-warm"
              style={{ textShadow: '0 2px 12px rgba(0,0,0,0.5)' }}
            >
              {caption}
            </p>
          )}
        </div>
      </section>
    )
  }

  return (
    <section className={`relative ${heightClass} overflow-hidden`}>
      <SectionPhoto
        slug={slug}
        alt=""
        className="absolute inset-0 h-full w-full"
        sizes="100vw"
      />
      <div
        className="absolute inset-0"
        aria-hidden
        style={{
          background:
            'linear-gradient(to top, rgba(28,25,16,0.6) 0%, rgba(28,25,16,0.15) 40%, rgba(28,25,16,0.1) 100%)',
        }}
      />
      {caption && (
        <p
          className="absolute inset-x-0 bottom-16 px-6 text-center font-script text-4xl md:text-6xl text-bg-warm"
          style={{ textShadow: '0 2px 12px rgba(0,0,0,0.5)' }}
        >
          {caption}
        </p>
      )}
    </section>
  )
}
