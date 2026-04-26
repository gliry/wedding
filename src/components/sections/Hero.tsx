import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(SplitText, useGSAP)

export function Hero() {
  const container = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!container.current) return

      // Hero only mounts after the intro completes (gated in App.tsx), so this
      // effect runs fresh each time on a clean DOM — no intro-phase check
      // needed here.
      const split = new SplitText('.hero-name', {
        type: 'chars',
        charsClass: 'hero-char',
      })

      const tl = gsap.timeline({ delay: 0.2 })

      tl.from('.hero-eyebrow', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power3.out',
      })
        .from(
          split.chars,
          {
            opacity: 0,
            yPercent: 100,
            rotationX: -60,
            transformOrigin: 'center center -60',
            duration: 1,
            ease: 'power3.out',
            stagger: { each: 0.035, from: 'start' },
          },
          '-=0.3'
        )
        .from(
          '.hero-date',
          {
            opacity: 0,
            y: 24,
            duration: 1,
            ease: 'power3.out',
          },
          '-=0.6'
        )
        .from(
          '.hero-scroll-hint',
          {
            opacity: 0,
            y: 12,
            duration: 0.8,
            ease: 'power2.out',
          },
          '-=0.3'
        )

      return () => {
        split.revert()
      }
    },
    { scope: container }
  )

  return (
    <section
      ref={container}
      className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center"
    >
      {/* Bottom gradient for text legibility over the 3D photo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
        style={{
          background:
            'linear-gradient(to top, rgba(20, 18, 10, 0.55) 0%, rgba(20, 18, 10, 0.15) 60%, transparent 100%)',
        }}
      />

      <div className="relative z-10 mt-auto pb-16 md:pb-24">
        <p className="hero-eyebrow mb-4 font-sans text-xs uppercase tracking-[0.3em] text-bg/90 drop-shadow-lg">
          Приглашаем вас на свадьбу
        </p>

        <h1
          className="font-display font-light leading-[0.95] text-bg drop-shadow-2xl"
          style={{ fontSize: 'clamp(3rem, 11vw, 6rem)' }}
        >
          <span className="hero-name block">Ильдар</span>
          <span className="hero-name mt-2 block">Екатерина</span>
        </h1>

        <p className="hero-date mt-6 font-script text-4xl text-bg drop-shadow-lg md:text-5xl">
          29 августа 2026
        </p>

        <p className="hero-scroll-hint mt-12 font-sans text-xs uppercase tracking-[0.2em] text-bg/80">
          ↓ листайте дальше ↓
        </p>
      </div>
    </section>
  )
}
