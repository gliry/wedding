import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { useRef, type ReactNode } from 'react'

type MagneticCardProps = {
  children: ReactNode
  /** Multiplier on cursor offset (0..1). Lower = subtler pull. */
  strength?: number
  /** Pixel radius around card to start magnetic attraction. */
  radius?: number
  className?: string
}

export function MagneticCard({
  children,
  strength = 0.3,
  radius = 80,
  className = '',
}: MagneticCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!ref.current) return
      const isCoarse = window.matchMedia('(pointer: coarse)').matches
      if (isCoarse) return

      const el = ref.current
      const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' })
      const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' })

      // Cache rect; refresh only on scroll/resize, not per mousemove.
      let rect = el.getBoundingClientRect()
      function refreshRect() {
        rect = el.getBoundingClientRect()
      }

      function onMove(e: MouseEvent) {
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const dx = e.clientX - cx
        const dy = e.clientY - cy
        const dist = Math.hypot(dx, dy)
        if (dist > rect.width / 2 + radius) {
          xTo(0)
          yTo(0)
          return
        }
        xTo(dx * strength)
        yTo(dy * strength)
      }

      function onLeave() {
        xTo(0)
        yTo(0)
      }

      const ro = new ResizeObserver(refreshRect)
      ro.observe(el)
      window.addEventListener('mousemove', onMove)
      window.addEventListener('scroll', refreshRect, { passive: true })
      window.addEventListener('resize', refreshRect, { passive: true })
      el.addEventListener('mouseleave', onLeave)
      return () => {
        ro.disconnect()
        window.removeEventListener('mousemove', onMove)
        window.removeEventListener('scroll', refreshRect)
        window.removeEventListener('resize', refreshRect)
        el.removeEventListener('mouseleave', onLeave)
      }
    },
    { scope: ref, dependencies: [strength, radius] }
  )

  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  )
}
