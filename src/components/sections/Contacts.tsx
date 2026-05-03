import { useRef, useState } from 'react'
import { MagneticCard } from '../ui/MagneticCard'
import { PaperPlane } from '../effects/PaperPlane'

// TODO: replace with real Telegram URLs when available.
const TG_GROUP_URL = 'https://t.me/PLACEHOLDER-WEDDING-GROUP'
const TG_DARINA_URL = 'https://t.me/PLACEHOLDER-DARINA'

export function Contacts() {
  const tgCardRef = useRef<HTMLAnchorElement>(null)
  const [plane, setPlane] = useState<{ origin: [number, number]; key: number } | null>(null)
  const [cooldown, setCooldown] = useState(false)

  function fireTgPlane() {
    if (cooldown || !tgCardRef.current) return
    const rect = tgCardRef.current.getBoundingClientRect()
    setPlane({
      origin: [rect.left + rect.width / 2, rect.top + rect.height / 2],
      key: Date.now(),
    })
    setCooldown(true)
    setTimeout(() => setCooldown(false), 1500)
  }

  return (
    <section className="px-6 py-24 max-w-3xl mx-auto">
      <h2 className="font-display text-4xl md:text-5xl font-light text-ink mb-8 text-center">
        Контакты
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        <MagneticCard>
          <a
            ref={tgCardRef}
            href={TG_GROUP_URL}
            target="_blank"
            rel="noopener"
            onMouseEnter={fireTgPlane}
            className="block bg-bg-warm rounded-md border border-ink/10 p-6 text-center transition-transform duration-150 hover:border-olive hover:-translate-y-0.5"
          >
            <span className="block text-3xl mb-2">💬</span>
            <strong className="block font-display text-lg mb-1">Telegram-группа свадьбы</strong>
            <span className="block text-sm text-ink-muted">
              Для всех гостей — новости, вопросы, координация
            </span>
          </a>
        </MagneticCard>

        <MagneticCard>
          <a
            href={TG_DARINA_URL}
            target="_blank"
            rel="noopener"
            className="block bg-bg-warm rounded-md border border-ink/10 p-6 text-center transition-transform duration-150 hover:border-olive hover:-translate-y-0.5"
          >
            <span className="block text-3xl mb-2">🎀</span>
            <strong className="block font-display text-lg mb-1">Дарина — координатор</strong>
            <span className="block text-sm text-ink-muted">
              Все вопросы в день свадьбы — к ней, не к паре!
            </span>
          </a>
        </MagneticCard>

        <div className="block bg-bg-warm rounded-md border border-ink/10 p-6 text-center">
          <span className="block text-3xl mb-2">💕</span>
          <strong className="block font-display text-lg mb-1">Ильдар & Екатерина</strong>
          <span className="block text-sm text-ink-muted">
            Только для экстренных случаев
          </span>
        </div>
      </div>

      {plane && (
        <PaperPlane
          key={plane.key}
          origin={plane.origin}
          onDone={() => setPlane(null)}
        />
      )}
    </section>
  )
}
