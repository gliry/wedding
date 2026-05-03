import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { useId, useRef, useState } from 'react'

const ITEMS = [
  {
    q: 'А если дождь?',
    a: 'У нас есть план Б — церемонию перенесём в крытую часть площадки. Свадьба состоится в любую погоду.',
  },
  {
    q: 'Где оставить машину?',
    a: 'На территории Wolki & Lipki есть бесплатная парковка. Можно оставить машину до утра — территория охраняется.',
  },
  {
    q: 'Какую обувь надеть?',
    a: 'Церемония пройдёт на газоне — рекомендуем танкетку или плоскую обувь. Шпильки утонут 🙂',
  },
  {
    q: 'Можно ли с детьми?',
    a: 'Конечно! Отметьте это в анкете — подготовим детский стол и уголок.',
  },
  {
    q: 'Где остановиться приезжим?',
    a: 'На территории клуба есть отель. Также можем помочь с подбором — отметьте в анкете.',
  },
  {
    q: 'К кому обращаться в день свадьбы?',
    a: 'К нашему координатору **Дарине** — не к жениху и невесте! У Дарины все ответы и контакты всех служб.',
  },
]

function FAQItem({
  q,
  a,
  isOpen,
  onToggle,
  filterId,
}: {
  q: string
  a: string
  isOpen: boolean
  onToggle: () => void
  filterId: string
}) {
  const contentRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!contentRef.current) return
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) {
        contentRef.current.style.height = isOpen ? 'auto' : '0px'
        contentRef.current.style.transform = ''
        return
      }
      if (isOpen) {
        gsap.fromTo(
          contentRef.current,
          { rotateX: -90, height: 0, opacity: 0 },
          {
            rotateX: 0,
            height: 'auto',
            opacity: 1,
            duration: 0.4,
            ease: 'power2.out',
            transformOrigin: 'top center',
          }
        )
      } else {
        gsap.to(contentRef.current, {
          rotateX: -90,
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in',
          transformOrigin: 'top center',
        })
      }
    },
    { dependencies: [isOpen] }
  )

  return (
    <div className="border-b border-ink/10 py-2">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between py-2 text-left text-lg md:text-xl text-ink"
        style={{ filter: `url(#${filterId})` }}
      >
        <span>{q}</span>
        <span
          className={`text-2xl text-olive transition-transform duration-200 ${
            isOpen ? 'rotate-45' : ''
          }`}
        >
          +
        </span>
      </button>
      <div
        ref={contentRef}
        style={{ height: 0, overflow: 'hidden', transformStyle: 'preserve-3d' }}
      >
        <p className="py-2 text-ink text-base">{a}</p>
      </div>
    </div>
  )
}

export function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null)
  const reactId = useId()
  const filterId = `faq-ink-bleed-${reactId.replace(/:/g, '')}`

  return (
    <section className="px-6 py-24 max-w-2xl mx-auto">
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden>
        <defs>
          <filter id={filterId}>
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" />
            <feDisplacementMap in="SourceGraphic" scale="1.5" />
          </filter>
        </defs>
      </svg>

      <h2 className="font-display text-4xl md:text-5xl font-light text-ink mb-8 text-center">
        Частые вопросы
      </h2>

      {ITEMS.map((item, i) => (
        <FAQItem
          key={i}
          q={item.q}
          a={item.a}
          isOpen={openIdx === i}
          onToggle={() => setOpenIdx(openIdx === i ? null : i)}
          filterId={filterId}
        />
      ))}
    </section>
  )
}
