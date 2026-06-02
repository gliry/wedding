import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { useEffect, useRef, useState } from 'react'
import { Countdown } from '../ui/Countdown'
import { SectionPhoto } from '../ui/SectionPhoto'
import { burstHearts, trailHeart } from '../effects/Hearts'
import { vibrate } from '../../lib/vibrate'

export function Finale() {
  const ref = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const [isTouch] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
  )

  // Tap/click anywhere on the closing screen scatters hearts (with a desktop
  // cursor trail). A small hint invites the interaction.
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
      if (now - lastTrail > 70) {
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

  useGSAP(
    () => {
      if (!ref.current) return
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (titleRef.current) {
        if (reduced) {
          gsap.set(titleRef.current, { opacity: 1 })
        } else {
          // Split into words AND chars so chars animate but words stay
          // unbreakable — otherwise a line break can split "2026" mid-number.
          const split = new SplitText(titleRef.current, { type: 'words,chars' })
          gsap.from(split.chars, {
            opacity: 0,
            y: 30,
            duration: 0.6,
            ease: 'power3.out',
            stagger: 0.04,
            scrollTrigger: { trigger: ref.current, start: 'top 70%', once: true },
          })
        }
      }

    },
    { scope: ref, dependencies: [] }
  )

  return (
    <section
      ref={ref}
      className="relative cursor-pointer overflow-hidden py-20 text-center md:flex md:min-h-[88vh] md:flex-col md:justify-center md:py-24"
    >
      <SectionPhoto
        slug="img_2307"
        alt=""
        className="absolute inset-0 h-full w-full"
        sizes="100vw"
      />
      <div
        className="absolute inset-0"
        aria-hidden
        style={{
          background:
            'linear-gradient(to top, rgba(28,25,16,0.82) 0%, rgba(28,25,16,0.55) 50%, rgba(28,25,16,0.45) 100%)',
        }}
      />

      <div className="relative px-6 max-w-3xl mx-auto text-bg-warm">
        <h2
          ref={titleRef}
          className="text-bg-warm mb-10"
          style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)' }}
        >
          До встречи 29 августа
        </h2>

        <Countdown variant="finale" className="mb-8" />

        <p className="text-2xl">💍</p>
        <p className="mt-4 font-ui text-[0.7rem] uppercase tracking-[0.25em] text-bg-warm/70">
          {isTouch ? 'коснитесь экрана ♡' : 'кликните ♡'}
        </p>
      </div>
    </section>
  )
}
