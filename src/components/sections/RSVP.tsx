import { PaperCard } from '../ui/PaperCard'

// TODO: replace with real Google Form URL when available.
const GOOGLE_FORM_URL =
  'https://docs.google.com/forms/d/e/PLACEHOLDER_FORM_ID/viewform?embedded=true'
const FORM_FALLBACK_URL =
  'https://docs.google.com/forms/d/e/PLACEHOLDER_FORM_ID/viewform'

export function RSVP() {
  return (
    <section className="px-6 py-24 max-w-3xl mx-auto">
      <h2 className="font-display text-4xl md:text-5xl font-light text-ink mb-3 text-center">
        Ваш ответ
      </h2>
      <p className="text-xl md:text-2xl text-ink-muted text-center mb-8">
        Подтвердите своё участие до 1 августа
      </p>

      <PaperCard className="p-2" tilt={false}>
        <iframe
          src={GOOGLE_FORM_URL}
          className="w-full border-0 rounded"
          style={{ minHeight: '1200px' }}
          title="Анкета гостя"
          loading="lazy"
        />
      </PaperCard>

      <p className="text-center text-sm text-ink-muted mt-4">
        Не видно формы?{' '}
        <a
          href={FORM_FALLBACK_URL}
          target="_blank"
          rel="noopener"
          className="text-olive underline"
        >
          Открыть в новой вкладке →
        </a>
      </p>
    </section>
  )
}
