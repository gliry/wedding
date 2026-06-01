import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { useRef } from 'react'
import { Countdown } from '../ui/Countdown'
import { SectionPhoto } from '../ui/SectionPhoto'

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
    <section ref={ref} className="relative overflow-hidden py-20 text-center">
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
            stroke="#DCE0D0"
            strokeWidth="3"
            fill="none"
          />
          <circle
            ref={ring2Ref}
            cx="180"
            cy="80"
            r="60"
            stroke="#DCE0D0"
            strokeWidth="3"
            fill="none"
          />
        </svg>

        <h2
          ref={titleRef}
          className="text-bg-warm mb-10"
          style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)' }}
        >
          До встречи 29 августа
        </h2>

        <Countdown variant="finale" className="mb-8" />

        <p className="text-2xl">💍</p>
      </div>
    </section>
  )
}
