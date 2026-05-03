import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { useRef } from 'react'
import { VINE_PATHS, type VineVariant } from '../../lib/svg/botanical'

type BotanicalVineProps = {
  variant: VineVariant
  /** Number of leaf dots along the path. */
  leafCount?: number
}

/**
 * Decorative SVG vine that draws on scroll via DrawSVG scrub. Sage color,
 * low opacity — feels like a watermark stroke between sections.
 */
export function BotanicalVine({ variant, leafCount = 6 }: BotanicalVineProps) {
  const ref = useRef<HTMLDivElement>(null)
  const path = VINE_PATHS[variant - 1]

  useGSAP(
    () => {
      if (!ref.current) return
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const pathEl = ref.current.querySelector('path.vine-stem')
      const leaves = ref.current.querySelectorAll('circle.vine-leaf')
      if (!pathEl) return

      if (reduced) {
        gsap.set(pathEl, { drawSVG: '100%' })
        gsap.set(leaves, { scale: 1 })
        return
      }

      gsap.fromTo(
        pathEl,
        { drawSVG: '0%' },
        {
          drawSVG: '100%',
          ease: 'none',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 90%',
            end: 'bottom 10%',
            scrub: true,
          },
        }
      )
      gsap.fromTo(
        leaves,
        { scale: 0, transformOrigin: 'center' },
        {
          scale: 1,
          ease: 'back.out(1.6)',
          stagger: 0.05,
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 80%',
            once: true,
          },
        }
      )
    },
    { scope: ref, dependencies: [variant] }
  )

  const leaves = Array.from({ length: leafCount }, (_, i) => {
    const x = 20 + ((180 - 20) / (leafCount - 1)) * i
    const y = 40
    return { x, y }
  })

  return (
    <div ref={ref} className="relative mx-auto my-12 w-full max-w-md opacity-50">
      <svg viewBox="0 0 200 80" className="block w-full" aria-hidden>
        <path
          className="vine-stem"
          d={path}
          stroke="#8B9579"
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
        />
        {leaves.map((p, i) => (
          <circle
            key={i}
            className="vine-leaf"
            cx={p.x}
            cy={p.y}
            r="1.8"
            fill="#8B9579"
          />
        ))}
      </svg>
    </div>
  )
}
