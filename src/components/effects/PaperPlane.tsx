import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { useRef } from 'react'

type PaperPlaneProps = {
  /** Origin in viewport pixels. */
  origin: [number, number]
  onDone: () => void
}

/**
 * SVG paper plane that flies in an arc from origin off the right edge of
 * the viewport over 1.2s. Calls onDone after.
 */
export function PaperPlane({ origin, onDone }: PaperPlaneProps) {
  const ref = useRef<SVGSVGElement>(null)

  useGSAP(
    () => {
      if (!ref.current) return
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) {
        onDone()
        return
      }

      const targetX = window.innerWidth + 100
      const targetY = origin[1] - 200
      gsap.fromTo(
        ref.current,
        { x: 0, y: 0, opacity: 1, rotation: 0 },
        {
          x: targetX - origin[0],
          y: targetY - origin[1],
          rotation: -25,
          opacity: 0,
          duration: 1.2,
          ease: 'power2.out',
          onComplete: onDone,
        }
      )
    },
    { dependencies: [origin[0], origin[1]] }
  )

  return (
    <svg
      ref={ref}
      aria-hidden
      viewBox="0 0 24 24"
      width="32"
      height="32"
      className="pointer-events-none fixed z-[55]"
      style={{ left: origin[0], top: origin[1], color: '#5E6B4B' }}
    >
      <path d="M2 12 L22 2 L18 22 L12 14 Z" fill="currentColor" />
    </svg>
  )
}
