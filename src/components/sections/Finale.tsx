import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { useRef } from 'react'
import { Countdown } from '../ui/Countdown'

export function Finale() {
  const ref = useRef<HTMLElement>(null)
  const ring1Ref = useRef<SVGCircleElement>(null)
  const ring2Ref = useRef<SVGCircleElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useGSAP(
    () => {
      if (!ref.current) return
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (titleRef.current) {
        if (reduced) {
          gsap.set(titleRef.current, { opacity: 1 })
        } else {
          const split = new SplitText(titleRef.current, { type: 'chars' })
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

      if (ring1Ref.current && ring2Ref.current) {
        if (reduced) {
          gsap.set([ring1Ref.current, ring2Ref.current], { drawSVG: '100%' })
        } else {
          gsap.fromTo(
            [ring1Ref.current, ring2Ref.current],
            { drawSVG: '0%' },
            {
              drawSVG: '100%',
              duration: 1.6,
              ease: 'power3.inOut',
              stagger: 0.15,
              scrollTrigger: { trigger: ref.current, start: 'top 70%', once: true },
            }
          )
        }
      }
    },
    { scope: ref, dependencies: [] }
  )

  return (
    <section ref={ref} className="px-6 py-24 max-w-3xl mx-auto text-center">
      <svg
        viewBox="0 0 280 160"
        className="block mx-auto w-72 mb-8"
        aria-hidden
      >
        <circle
          ref={ring1Ref}
          cx="100"
          cy="80"
          r="60"
          stroke="#A79177"
          strokeWidth="3"
          fill="none"
        />
        <circle
          ref={ring2Ref}
          cx="180"
          cy="80"
          r="60"
          stroke="#A79177"
          strokeWidth="3"
          fill="none"
        />
      </svg>

      <h2
        ref={titleRef}
        className="font-display font-light text-ink mb-2"
        style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)' }}
      >
        До встречи 29 августа 2026
      </h2>
      <p className="font-script text-3xl text-olive mb-8 leading-tight">
        <span className="block">с любовью,</span>
        <span className="block">Ильдар</span>
        <span className="block" aria-hidden>&amp;</span>
        <span className="block">Екатерина</span>
      </p>

      <Countdown variant="finale" className="mb-8" />

      <p className="text-2xl">💍</p>
    </section>
  )
}
