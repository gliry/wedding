import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { useRef } from 'react'

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
      const items = ref.current.querySelectorAll('.schedule-item')
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (reduced) {
        gsap.set(items, { opacity: 1, y: 0 })
        return
      }

      items.forEach((item) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: { trigger: item, start: 'top 85%', once: true },
          }
        )
      })
    },
    { scope: ref, dependencies: [] }
  )

  return (
    <section ref={ref} className="px-6 py-24 max-w-5xl mx-auto">
      <div className="md:grid md:grid-cols-[2fr_3fr] md:gap-16">
        {/* Left — large heading, pinned to the viewport while the list scrolls past */}
        <div className="md:sticky md:top-0 md:h-screen md:flex md:flex-col md:justify-center">
          <h2 className="font-display font-light text-ink leading-[0.95] text-4xl md:text-5xl text-center md:text-left mb-12 md:mb-0">
            Программа
            <br />
            дня
          </h2>
        </div>

        {/* Right — scrolling timeline */}
        <ol className="relative pl-8 border-l-2 border-sage/40 md:py-[12vh]">
          {ITEMS.map((item, i) => (
            <li key={i} className="schedule-item relative mb-16 pl-6 last:mb-0">
              <span className="absolute -left-[1.4rem] top-4 w-3 h-3 rounded-full bg-olive" />
              <p className="text-3xl md:text-4xl leading-none text-olive mb-2">
                {item.time}
              </p>
              <h3 className="text-xl md:text-2xl text-ink mb-1">{item.title}</h3>
              <p className="text-xl md:text-2xl text-ink-muted">{item.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
