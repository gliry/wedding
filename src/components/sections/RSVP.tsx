import { useState } from 'react'
import { RSVPForm } from '../rsvp/RSVPForm'
import { Thanks } from '../rsvp/Thanks'
import { SectionPhoto } from '../ui/SectionPhoto'
import type { ThanksVariant } from '../rsvp/types'

export function RSVP() {
  const [done, setDone] = useState<ThanksVariant | null>(null)

  return (
    <section id="rsvp" className="bg-bg py-16">
      <div className="px-6 max-w-2xl mx-auto">
      <h2 className="font-display text-4xl md:text-5xl font-light text-ink mb-3 text-center">
        Ваш ответ
      </h2>
      <p className="text-xl md:text-2xl text-ink-muted text-center mb-10">
        Подтвердите своё участие{' '}
        <span className="whitespace-nowrap rounded-lg bg-sage-soft px-3 py-1 text-olive">
          до 1 августа
        </span>
      </p>

      <SectionPhoto
        slug="img_2305"
        alt="Ильдар и Екатерина"
        className="mx-auto mb-12 w-full max-w-xs aspect-[2/3] rounded-t-full rounded-b-2xl border-2 border-olive shadow-sm"
        imgClassName="object-cover object-top"
        sizes="(max-width: 768px) 70vw, 20rem"
      />

      {done ? <Thanks variant={done} /> : <RSVPForm onSubmitted={setDone} />}
      </div>
    </section>
  )
}
