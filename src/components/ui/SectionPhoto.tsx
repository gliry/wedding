import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { useRef } from 'react'

type SectionPhotoProps = {
  /** Gallery slug, e.g. "img_2304" — resolves to /photos/sections/<slug>-{sm,md}.{avif,webp,jpg} */
  slug: string
  alt: string
  /** Frame classes — sizing, aspect, radius (e.g. "aspect-[3/4] rounded-t-full"). */
  className?: string
  /** Responsive `sizes` attr; defaults to half-width on desktop. */
  sizes?: string
  /** Extra classes on the <img> — e.g. `object-[center_25%]` to reframe. */
  imgClassName?: string
  /** Subtle vertical scroll parallax inside the frame. Off by default —
   *  scrubbed transforms on large images compete with the WebGL hero loop
   *  and make scrolling janky. */
  parallax?: boolean
}

const BASE = '/photos/sections'

/**
 * Responsive, optimized photo for in-section use. The frame clips an
 * over-scaled image and drifts it vertically on scroll for depth. Pass
 * radius/aspect via `className` (e.g. `rounded-t-full` for an arch).
 */
export function SectionPhoto({
  slug,
  alt,
  className = '',
  sizes = '(max-width: 768px) 100vw, 45vw',
  imgClassName = '',
  parallax = false,
}: SectionPhotoProps) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!parallax || !ref.current) return
      const img = ref.current.querySelector('img')
      if (!img) return
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) return

      gsap.fromTo(
        img,
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: 'none',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      )
    },
    { scope: ref, dependencies: [slug, parallax] }
  )

  return (
    <div ref={ref} className={`overflow-hidden bg-bg-soft ${className}`}>
      <picture>
        <source
          type="image/avif"
          srcSet={`${BASE}/${slug}-sm.avif 720w, ${BASE}/${slug}-md.avif 1200w, ${BASE}/${slug}-lg.avif 1920w`}
          sizes={sizes}
        />
        <source
          type="image/webp"
          srcSet={`${BASE}/${slug}-sm.webp 720w, ${BASE}/${slug}-md.webp 1200w, ${BASE}/${slug}-lg.webp 1920w`}
          sizes={sizes}
        />
        <img
          src={`${BASE}/${slug}-lg.jpg`}
          alt={alt}
          loading="lazy"
          decoding="async"
          className={`h-full w-full object-cover ${imgClassName} ${parallax ? 'scale-[1.15] will-change-transform' : ''}`}
        />
      </picture>
    </div>
  )
}
