import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { useRef } from 'react'
import { ArchPhoto } from '../ui/ArchPhoto'

type ScheduleItem = { time: string; title: string; desc: string; note?: string }

const ITEMS: ScheduleItem[] = [
  { time: '15:30', title: 'Сбор гостей', desc: 'Фуршет, приветственные напитки' },
  { time: '16:00', title: 'Выездная церемония', desc: 'На газоне, захватите удобную обувь' },
  { time: '16:30', title: 'Фото с гостями', desc: 'Обнимашки, групповые кадры' },
  { time: '17:00', title: 'Банкет', desc: 'Ужин, тосты, танцы' },
  {
    time: '23:00',
    title: 'Afterparty',
    desc: 'Бассейн, баня, отдых на территории',
    note: 'Захватите купальник/плавки',
  },
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
    <section
      ref={ref}
      className="relative z-10 -mt-10 rounded-t-[2.5rem] bg-bg pt-12 pb-16"
    >
      <div className="px-6 max-w-5xl mx-auto">
      <div className="md:grid md:grid-cols-[2fr_3fr] md:gap-16">
        {/* Left — large heading, pinned to the viewport while the list scrolls past */}
        <div className="md:sticky md:top-0 md:h-screen md:flex md:flex-col md:justify-center">
          <h2 className="font-display font-light text-ink leading-[0.95] text-4xl md:text-5xl text-center mb-10">
            Программа{' '}
            <br className="hidden md:block" />
            дня
          </h2>
          <ArchPhoto
            slug="img_2322"
            alt="Ильдар и Екатерина"
            className="mx-auto w-full max-w-[18rem] aspect-[2/3] mb-12 md:mb-0"
            imgClassName="object-cover object-top"
            sizes="(max-width: 768px) 75vw, 28vw"
            cinema
          />
        </div>

        {/* Right — scrolling timeline */}
        <ol className="relative pl-8 md:border-l-2 md:border-sage/40 md:py-[12vh]">
          {ITEMS.map((item, i) => (
            <li key={i} className="schedule-item relative mb-16 pl-6 last:mb-0">
              <span
                className="font-ui absolute -left-7 top-1 text-xl leading-none text-olive"
                aria-hidden
              >
                ✧
              </span>
              <p className="text-3xl md:text-4xl leading-none text-olive mb-2">
                {item.time}
              </p>
              <h3 className="text-xl md:text-2xl text-ink mb-1">{item.title}</h3>
              <p className="text-xl md:text-2xl text-ink-muted">{item.desc}</p>
              {item.note && (
                <p className="mt-3 inline-block rounded-xl bg-sage-soft px-4 py-2 text-lg md:text-xl text-olive">
                  {item.note}
                </p>
              )}
            </li>
          ))}
        </ol>
      </div>
      </div>
    </section>
  )
}
