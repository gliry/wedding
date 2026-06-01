import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * Initializes Lenis smooth scroll and synchronizes with GSAP ScrollTrigger.
 * Pattern borrowed from Darkroom Engineering's Satus starter.
 *
 * Disabled on touch devices (mobile/tablet) — native iOS scroll is more reliable.
 */
export function SmoothScroll() {
  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches
    if (isTouch) {
      // Native scroll on touch — do NOT normalizeScroll: it hijacks the touch
      // scroll pipeline and stops iOS Safari from collapsing its top/bottom
      // chrome on scroll. ignoreMobileResize keeps ScrollTrigger from
      // re-firing when the chrome hide/show resizes the viewport.
      ScrollTrigger.config({ ignoreMobileResize: true })
      return
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
    })

    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
    }
  }, [])

  return null
}
