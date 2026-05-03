import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { useRef, useEffect } from 'react'

type ColorSplashProps = {
  color: string
  /** Origin in viewport pixels. */
  origin: [number, number]
  onDone: () => void
}

/**
 * SVG blob that morphs from a small blob at `origin` to a large irregular
 * shape covering ~80% of viewport, then fades. Color is the chosen color
 * at 35% alpha. Calls onDone when fully unmounted.
 */
export function ColorSplash({ color, origin, onDone }: ColorSplashProps) {
  const ref = useRef<SVGCircleElement>(null)
  const wrapRef = useRef<SVGSVGElement>(null)

  useGSAP(
    () => {
      if (!ref.current || !wrapRef.current) return
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) {
        onDone()
        return
      }

      const tl = gsap.timeline({ onComplete: onDone })
      tl.fromTo(
        ref.current,
        { attr: { r: 8 }, opacity: 0.35 },
        { attr: { r: Math.max(window.innerWidth, window.innerHeight) * 0.6 }, duration: 1.0, ease: 'power2.out' }
      )
      tl.to(wrapRef.current, { opacity: 0, duration: 0.5, ease: 'power2.in' }, '+=0.1')

      return () => {
        tl.kill()
      }
    },
    { dependencies: [color, origin[0], origin[1]] }
  )

  // Auto-cleanup after ~2s in case GSAP doesn't fire onDone (defensive)
  useEffect(() => {
    const t = setTimeout(onDone, 2000)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <svg
      ref={wrapRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[58]"
      style={{ width: '100vw', height: '100vh' }}
    >
      <circle ref={ref} cx={origin[0]} cy={origin[1]} r="8" fill={color} fillOpacity="0.35" />
    </svg>
  )
}
