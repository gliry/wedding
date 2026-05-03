import { useId, useRef, type ReactNode } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'

type PaperCardProps = {
  children: ReactNode
  /** Animate entry with rotateX dive. Defaults true. */
  animateEntry?: boolean
  /** Apply resting rotateX(2deg). Disable when wrapping iframes — they can't tilt cleanly. */
  tilt?: boolean
  className?: string
}

/**
 * CSS 3D paper card with multi-layer shadow and torn-edge SVG filter.
 * On entry (if animateEntry): scale 0.9→1 + rotateX 8°→2° + opacity 0→1.
 * Resting state: rotateX(2deg) for slight depth (unless tilt={false}).
 */
export function PaperCard({
  children,
  animateEntry = true,
  tilt = true,
  className = '',
}: PaperCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const filterId = useId()

  useGSAP(
    () => {
      if (!ref.current || !animateEntry) return
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) return

      gsap.from(ref.current, {
        scale: 0.9,
        rotateX: 8,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 75%', once: true },
      })
    },
    { scope: ref, dependencies: [animateEntry] }
  )

  const tornId = `paper-torn-${filterId.replace(/:/g, '')}`

  return (
    <>
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden>
        <defs>
          <filter id={tornId}>
            <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="4" seed="42" />
            <feDisplacementMap in="SourceGraphic" scale="6" />
          </filter>
        </defs>
      </svg>
      <div
        ref={ref}
        className={`relative bg-bg-warm rounded-md ${className}`}
        style={{
          transform: tilt ? 'perspective(1000px) rotateX(2deg)' : undefined,
          transformStyle: tilt ? 'preserve-3d' : undefined,
          boxShadow: [
            '0 1px 1px hsl(30 20% 30% / 0.075)',
            '0 2px 2px hsl(30 20% 30% / 0.075)',
            '0 4px 4px hsl(30 20% 30% / 0.075)',
            '0 8px 8px hsl(30 20% 30% / 0.075)',
            '0 16px 16px hsl(30 20% 30% / 0.075)',
          ].join(', '),
        }}
      >
        {children}
      </div>
    </>
  )
}
