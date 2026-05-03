import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { useRef, useState } from 'react'
import { Button } from '../ui/Button'

const MAP_IFRAME_URL =
  'https://yandex.ru/map-widget/v1/?ll=53.103278%2C56.863846&z=16&pt=53.103278%2C56.863846,pm2rdm'
const ROUTE_URL =
  'https://yandex.ru/maps/?rtext=~56.863846%2C53.103278&rtt=auto'
const GCAL_URL =
  'https://calendar.google.com/calendar/render?action=TEMPLATE&text=%D0%A1%D0%B2%D0%B0%D0%B4%D1%8C%D0%B1%D0%B0%20%D0%98%D0%BB%D1%8C%D0%B4%D0%B0%D1%80%20%D0%B8%20%D0%95%D0%BA%D0%B0%D1%82%D0%B5%D1%80%D0%B8%D0%BD%D0%B0&dates=20260829T113000Z%2F20260830T020000Z&details=%D0%A1%D0%B1%D0%BE%D1%80%20%D0%B3%D0%BE%D1%81%D1%82%D0%B5%D0%B9%20%D0%BA%2015%3A30.&location=Wolki%20%26%20Lipki%20Country%20Club%2C%20%D1%83%D0%BB.%20%D0%90.%20%D0%9D%D0%B5%D0%B2%D1%81%D0%BA%D0%BE%D0%B3%D0%BE%2C%202%D0%90%2C%20%D0%98%D0%B6%D0%B5%D0%B2%D1%81%D0%BA'
const ICS_URL = '/assets/invite.ics'

export function WhenWhere() {
  const ref = useRef<HTMLElement>(null)
  const mapWrapRef = useRef<HTMLDivElement>(null)
  const [showIframe, setShowIframe] = useState(false)

  useGSAP(
    () => {
      if (!ref.current || !mapWrapRef.current) return
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) {
        setShowIframe(true)
        return
      }

      gsap.fromTo(
        mapWrapRef.current,
        { scale: 0.9, clipPath: 'circle(0% at 50% 50%)' },
        {
          scale: 1.0,
          clipPath: 'circle(100% at 50% 50%)',
          duration: 0.8,
          ease: 'power3.out',
          onComplete: () => setShowIframe(true),
          scrollTrigger: {
            trigger: mapWrapRef.current,
            start: 'top 70%',
            once: true,
          },
        }
      )
    },
    { scope: ref, dependencies: [] }
  )

  return (
    <section ref={ref} className="px-6 py-24 max-w-3xl mx-auto">
      <h2 className="font-display text-4xl md:text-5xl font-light text-ink mb-8 text-center">
        Когда и где
      </h2>
      <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 mb-8 text-base md:text-lg">
        <dt className="font-medium text-ink-muted">Дата</dt>
        <dd className="font-display">29 августа 2026 (суббота)</dd>
        <dt className="font-medium text-ink-muted">Сбор гостей</dt>
        <dd className="font-display">15:30</dd>
        <dt className="font-medium text-ink-muted">Место</dt>
        <dd className="font-display">Wolki & Lipki Country Club<br />ул. А. Невского, 2а, Ижевск</dd>
      </dl>

      <div ref={mapWrapRef} className="relative mb-8 aspect-video rounded-md overflow-hidden bg-sage">
        {showIframe ? (
          <iframe
            src={MAP_IFRAME_URL}
            className="w-full h-full border-0"
            title="Карта: Wolki & Lipki"
            loading="lazy"
            allowFullScreen
          />
        ) : (
          <img
            src="/photos/map-preview.jpg"
            alt=""
            aria-hidden
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none'
            }}
          />
        )}
      </div>

      <div className="flex flex-col gap-3">
        <Button href={ROUTE_URL} target="_blank" rel="noopener" variant="primary" icon="🚗" className="w-full">
          Построить маршрут
        </Button>
        <div className="flex gap-3">
          <Button href={GCAL_URL} target="_blank" rel="noopener" variant="secondary" icon="📅" className="w-full flex-1">
            Google Календарь
          </Button>
          <Button href={ICS_URL} variant="secondary" icon="🍎" className="w-full flex-1">
            Apple Календарь
          </Button>
        </div>
      </div>
    </section>
  )
}
