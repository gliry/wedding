import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef } from 'react'
import { getTimePath } from '../../lib/svg/handwriting'

const ITEMS = [
  { time: '15:30', title: 'Сбор гостей', desc: 'Фуршет, приветственные напитки' },
  { time: '15:30', title: 'Выездная церемония', desc: 'На газоне — захватите удобную обувь' },
  { time: '16:00', title: 'Фото с гостями', desc: 'Обнимашки, групповые кадры' },
  { time: '16:30', title: 'Банкет', desc: 'Ужин, тосты, танцы' },
  { time: '23:00', title: 'Afterparty', desc: 'Бассейн, баня, отдых на территории' },
  { time: '30.08', title: 'Второй день', desc: 'Детали позже' },
]

export function Schedule() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (!ref.current) return
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      const items = ref.current.querySelectorAll('.schedule-item')
      const timePaths = ref.current.querySelectorAll('path.time-path')
      const descs = ref.current.querySelectorAll('.schedule-desc')

      if (reduced) {
        gsap.set(timePaths, { drawSVG: '100%' })
        gsap.set(descs, { opacity: 1, y: 0 })
        return
      }

      ScrollTrigger.create({
        trigger: ref.current,
        start: 'top top',
        end: () =>
          window.matchMedia('(pointer: coarse)').matches ? '+=200%' : '+=300%',
        pin: true,
        pinSpacing: true,
        scrub: 0.5,
        invalidateOnRefresh: true,
      })

      items.forEach((item, i) => {
        const path = item.querySelector('path.time-path')
        const desc = item.querySelector('.schedule-desc')
        if (!path || !desc) return
        const start = `top top+=${i * 25}%`
        const end = `top top+=${(i + 1) * 25}%`
        gsap.fromTo(
          path,
          { drawSVG: '0%' },
          {
            drawSVG: '100%',
            ease: 'none',
            scrollTrigger: { trigger: ref.current, start, end, scrub: true },
          }
        )
        gsap.fromTo(
          desc,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power2.out',
            scrollTrigger: { trigger: ref.current, start: `top top+=${i * 25 + 12}%`, toggleActions: 'play none none reverse' },
          }
        )
      })
    },
    { scope: ref, dependencies: [] }
  )

  return (
    <section ref={ref} className="relative px-6 py-24 max-w-3xl mx-auto min-h-screen">
      <h2 className="font-display text-4xl md:text-5xl font-light text-ink mb-12 text-center">
        Программа дня
      </h2>
      <ol className="relative pl-8 border-l-2 border-sage/40">
        {ITEMS.map((item, i) => (
          <li key={i} className="schedule-item relative mb-8 pl-6">
            <span className="absolute -left-[1.4rem] top-2 w-3 h-3 rounded-full bg-olive" />
            <svg viewBox="0 0 80 40" className="block w-24 mb-2" aria-label={item.time}>
              <path
                className="time-path"
                d={getTimePath(item.time)}
                stroke="#5E6B4B"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
            <div className="schedule-desc">
              <h3 className="font-display text-lg md:text-xl text-ink mb-1">{item.title}</h3>
              <p className="text-ink-muted text-sm md:text-base">{item.desc}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
