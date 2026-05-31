import { useState } from 'react'
import { Button } from '../ui/Button'
import { GuestBlock } from './GuestBlock'
import { submitRSVP } from './submit'
import { validateForm } from './validation'
import { INITIAL_STATE, MAIN_GUEST_ID, MAX_GUESTS, TG_COUPLE_URL } from './constants'
import type {
  FormState,
  GuestData,
  SubmitState,
  ThanksVariant,
  ValidationErrors,
} from './types'

interface Props {
  onSubmitted: (variant: ThanksVariant) => void
}

function makeCompanion(): GuestData {
  return {
    id: crypto.randomUUID(),
    name: '',
    allergies: '',
    alcohol: [],
  }
}

export function RSVPForm({ onSubmitted }: Props) {
  const [state, setState] = useState<FormState>(INITIAL_STATE)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [submitState, setSubmitState] = useState<SubmitState>('idle')
  const [lastAddedGuestId, setLastAddedGuestId] = useState<string | null>(null)

  const isAttending = state.willAttend === 'Да'
  const submitting = submitState === 'submitting'
  // state.guests always has the main guest at [0]; companions count is length - 1.
  const companionCount = state.guests.length - 1

  function setPhone(val: string) {
    setState((s) => ({ ...s, phone: val }))
  }

  function addGuest() {
    if (companionCount >= MAX_GUESTS) return
    const g = makeCompanion()
    setLastAddedGuestId(g.id)
    setState((s) => ({ ...s, guests: [...s.guests, g] }))
  }

  function updateGuest(next: GuestData) {
    setState((s) => ({
      ...s,
      guests: s.guests.map((g) => (g.id === next.id ? next : g)),
    }))
  }

  function removeGuest(id: string) {
    if (id === MAIN_GUEST_ID) return // safety: main is not removable
    setState((s) => ({ ...s, guests: s.guests.filter((g) => g.id !== id) }))
  }

  function focusFirstError(errs: ValidationErrors) {
    const order: string[] = []
    if (errs.willAttend) order.push('will-attend-yes')
    if (state.willAttend === 'Нет') {
      const mainErr = errs.guests?.[state.guests[0]?.id ?? '']?.name
      if (mainErr) order.push('not-attending-name')
    } else if (state.willAttend === 'Да') {
      for (const g of state.guests) {
        if (errs.guests?.[g.id]?.name) order.push(`guest-${g.id}-name`)
      }
      if (errs.phone) order.push('main-phone')
    }
    const id = order[0]
    if (!id) return
    const el = document.getElementById(id)
    if (!el) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' })
    el.focus({ preventScroll: true })
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (submitting) return
    const result = validateForm(state)
    if (!result.ok) {
      setErrors(result.errors)
      focusFirstError(result.errors)
      return
    }
    setErrors({})
    setSubmitState('submitting')
    try {
      await submitRSVP(state)
      onSubmitted(isAttending ? 'attending' : 'not-attending')
    } catch {
      setSubmitState('error')
    }
  }

  const main = state.guests[0]
  const mainNameError = errors.guests?.[main.id]?.name

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-10">
      {/* Will attend? */}
      <fieldset>
        <legend className="text-2xl md:text-3xl text-ink mb-4">
          Будете на свадьбе?
        </legend>
        <div className="space-y-2">
          <label className="flex items-center gap-3 text-xl md:text-2xl text-ink">
            <input
              id="will-attend-yes"
              type="radio"
              name="willAttend"
              value="Да"
              checked={state.willAttend === 'Да'}
              onChange={() => setState((s) => ({ ...s, willAttend: 'Да' }))}
              disabled={submitting}
              className="h-4 w-4 accent-olive"
            />
            Да, приду
          </label>
          <label className="flex items-center gap-3 text-xl md:text-2xl text-ink">
            <input
              type="radio"
              name="willAttend"
              value="Нет"
              checked={state.willAttend === 'Нет'}
              onChange={() => setState((s) => ({ ...s, willAttend: 'Нет' }))}
              disabled={submitting}
              className="h-4 w-4 accent-olive"
            />
            К сожалению, не смогу
          </label>
        </div>
        {errors.willAttend && (
          <p role="alert" className="mt-2 text-base md:text-lg text-red-700">{errors.willAttend}</p>
        )}
      </fieldset>

      {/* Not-attending branch — just name */}
      {state.willAttend === 'Нет' && (
        <div>
          <label htmlFor="not-attending-name" className="block text-base md:text-lg text-ink-muted">
            Фамилия и имя
          </label>
          <input
            id="not-attending-name"
            type="text"
            autoComplete="name"
            required
            value={main.name}
            onChange={(e) => updateGuest({ ...main, name: e.target.value })}
            disabled={submitting}
            aria-invalid={!!mainNameError}
            className={`block w-full text-xl md:text-2xl mt-1 px-3 py-2 bg-bg-warm rounded border ${
              mainNameError ? 'border-red-500' : 'border-ink/20'
            } focus:border-olive focus:outline-none`}
          />
          {mainNameError && (
            <p role="alert" className="mt-1 text-base md:text-lg text-red-700">{mainNameError}</p>
          )}
        </div>
      )}

      {/* Attending branch — guests + phone + extras */}
      {isAttending && (
        <fieldset>
          <legend className="text-2xl md:text-3xl text-ink mb-2">Гости</legend>
          <p className="text-base md:text-lg text-ink-muted mb-4">
            Если приходите один — пропустите добавление гостей.
          </p>

          {state.guests.map((g, i) => (
            <GuestBlock
              key={g.id}
              guest={g}
              index={i}
              onChange={updateGuest}
              onRemove={() => removeGuest(g.id)}
              autoFocus={g.id === lastAddedGuestId}
              canRemove={i !== 0}
              disabled={submitting}
              errors={errors.guests?.[g.id]}
            />
          ))}

          {companionCount < MAX_GUESTS ? (
            <Button
              variant="secondary"
              onClick={addGuest}
              disabled={submitting}
              className="mt-6"
            >
              + Добавить гостя
            </Button>
          ) : (
            <p className="mt-6 text-base md:text-lg text-ink-muted">
              Если вас больше —{' '}
              <a href={TG_COUPLE_URL} target="_blank" rel="noopener" className="text-olive underline">
                напишите нам в Telegram
              </a>
              .
            </p>
          )}
        </fieldset>
      )}

      {/* Phone — below the guest cards */}
      {isAttending && (
        <div>
          <label htmlFor="main-phone" className="block text-base md:text-lg text-ink-muted">
            Телефон
          </label>
          <input
            id="main-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            value={state.phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={submitting}
            aria-invalid={!!errors.phone}
            className={`block w-full text-xl md:text-2xl mt-1 px-3 py-2 bg-bg-warm rounded border ${
              errors.phone ? 'border-red-500' : 'border-ink/20'
            } focus:border-olive focus:outline-none`}
          />
          {errors.phone && (
            <p role="alert" className="mt-1 text-base md:text-lg text-red-700">{errors.phone}</p>
          )}
        </div>
      )}

      {/* Second day */}
      {isAttending && (
        <fieldset>
          <legend className="text-2xl md:text-3xl text-ink mb-4">
            Останетесь на второй день?
          </legend>
          <div className="space-y-2">
            {(['Да', 'Нет', 'Пока не уверен(а)'] as const).map((v) => (
              <label key={v} className="flex items-center gap-3 text-xl md:text-2xl text-ink">
                <input
                  type="radio"
                  name="secondDay"
                  value={v}
                  checked={state.secondDay === v}
                  onChange={() => setState((s) => ({ ...s, secondDay: v }))}
                  disabled={submitting}
                  className="h-4 w-4 accent-olive"
                />
                {v}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {/* Vibe */}
      {isAttending && (
        <div>
          <label htmlFor="main-song" className="block text-base md:text-lg text-ink-muted">
            Без какой песни не сможете?
          </label>
          <input
            id="main-song"
            type="text"
            placeholder="название и исполнитель"
            value={state.song}
            onChange={(e) => setState((s) => ({ ...s, song: e.target.value }))}
            disabled={submitting}
            className="block w-full text-xl md:text-2xl mt-1 px-3 py-2 bg-bg-warm rounded border border-ink/20 focus:border-olive focus:outline-none"
          />

          <label htmlFor="main-comment" className="block text-base md:text-lg text-ink-muted mt-4">
            Комментарий / пожелания
          </label>
          <textarea
            id="main-comment"
            rows={3}
            value={state.comment}
            onChange={(e) => setState((s) => ({ ...s, comment: e.target.value }))}
            disabled={submitting}
            className="block w-full text-xl md:text-2xl mt-1 px-3 py-2 bg-bg-warm rounded border border-ink/20 focus:border-olive focus:outline-none"
          />
        </div>
      )}

      {submitState === 'error' && (
        <p role="alert" className="text-base md:text-lg text-red-700">
          Не удалось отправить. Проверьте интернет и попробуйте ещё раз. Если не получится —{' '}
          <a href={TG_COUPLE_URL} target="_blank" rel="noopener" className="text-olive underline">
            напишите нам в Telegram
          </a>
          .
        </p>
      )}

      <div>
        <Button
          type="submit"
          variant="primary"
          disabled={submitting}
          aria-busy={submitting}
        >
          {submitting
            ? 'Отправляем…'
            : submitState === 'error'
            ? 'Отправить ещё раз'
            : 'Отправить анкету'}
        </Button>
      </div>
    </form>
  )
}
