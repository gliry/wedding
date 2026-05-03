import { Countdown } from '../ui/Countdown'

export function Address() {
  return (
    <section className="px-6 py-24 max-w-2xl mx-auto text-center">
      <p className="font-display text-4xl md:text-5xl leading-snug text-ink mb-6">
        Дорогие наши!
      </p>
      <p className="text-lg md:text-xl leading-relaxed text-ink-muted mb-10">
        Приглашаем вас разделить радость этого особенного для нас события и стать частью начала нашей семейной истории!
      </p>
      <p className="font-script text-4xl md:text-5xl text-olive mb-6">
        29 августа 2026
      </p>
      <Countdown variant="finale" className="text-ink" />
    </section>
  )
}
