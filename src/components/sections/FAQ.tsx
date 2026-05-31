import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { useRef, useState } from 'react'

const ITEMS = [
  {
    q: 'Будет ли трансфер?',
    a: 'Загородный клуб находится в черте города, удобно добраться на такси.',
  },
  {
    q: 'Где оставить машину?',
    a: 'На территории клуба есть парковка.',
  },
  {
    q: 'Где остановиться приезжим?',
    a: 'На территории клуба есть отель с приятными номерами. Если возникнут сложности с размещением — напишите нам, поможем.',
  },
  {
    q: 'Какую обувь надеть?',
    a: 'Будем много танцевать, а часть территории — газон. К туфлям захватите что-нибудь удобное.',
  },
  {
    q: 'К кому обращаться в день свадьбы?',
    a: 'К организаторам — молодожёны будут заняты свадебными хлопотами и не смогут оперативно отвечать.',
  },
]

function FAQItem({
  q,
  a,
  isOpen,
  onToggle,
}: {
  q: string
  a: string
  isOpen: boolean
  onToggle: () => void
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
        className="w-full flex items-center justify-between py-2 text-left text-2xl md:text-3xl text-ink"
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
        <p className="py-2 text-ink text-xl md:text-2xl">{a}</p>
      </div>
    </div>
  )
}

export function FAQ() {
  const [openSet, setOpenSet] = useState<Set<number>>(() => new Set())

  function toggle(i: number) {
    setOpenSet((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  return (
    <section className="bg-sage-soft py-24">
      <div className="px-6 max-w-2xl mx-auto">
      <h2 className="font-display text-4xl md:text-5xl font-light text-ink mb-8 text-center">
        Частые вопросы
      </h2>

      {ITEMS.map((item, i) => (
        <FAQItem
          key={i}
          q={item.q}
          a={item.a}
          isOpen={openSet.has(i)}
          onToggle={() => toggle(i)}
        />
      ))}
      </div>
    </section>
  )
}
