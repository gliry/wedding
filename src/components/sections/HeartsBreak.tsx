import { useEffect, useRef, useState } from 'react'
import { burstHearts, trailHeart } from '../effects/Hearts'
import { vibrate } from '../../lib/vibrate'

/**
 * Interactive break section ("hearts"): tap/click anywhere to scatter hearts.
 * On desktop, a heart also trails the moving cursor.
 */
export function HeartsBreak() {
  const ref = useRef<HTMLElement>(null)
  const [isTouch] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
  )

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onTap = (e: PointerEvent) => {
      burstHearts(document.body, e.clientX, e.clientY)
      if (isTouch) vibrate(30)
    }
    el.addEventListener('pointerdown', onTap)
    let lastTrail = 0
    const onMove = (e: PointerEvent) => {
      if (isTouch) return
      const now = performance.now()
      if (now - lastTrail > 60) {
        lastTrail = now
        trailHeart(document.body, e.clientX, e.clientY)
      }
    }
    el.addEventListener('pointermove', onMove)
    return () => {
      el.removeEventListener('pointerdown', onTap)
      el.removeEventListener('pointermove', onMove)
    }
  }, [isTouch])

  return (
    <section
      ref={ref}
      className="relative flex h-[70vh] cursor-pointer items-center justify-center bg-sage-soft px-6 text-center"
    >
      <p className="font-script text-olive" style={{ fontSize: 'clamp(2rem, 9vw, 3.5rem)' }}>
        {isTouch ? 'Коснитесь экрана 💛' : 'Кликните с любовью 💛'}
      </p>
    </section>
  )
}
