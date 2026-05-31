import { useEffect, useRef } from 'react'
import type { GuestData, AlcoholChoice } from './types'
import { AlcoholChecks } from './AlcoholChecks'

interface Props {
  guest: GuestData
  index: number
  onChange: (next: GuestData) => void
  onRemove: () => void
  /** When true, mount-effect autofocuses name and scrolls into view. Set true for the just-added block. */
  autoFocus: boolean
  /** When false, the «×» remove button is not rendered. Defaults to true. */
  canRemove?: boolean
  disabled?: boolean
  errors?: { name?: string }
}

export function GuestBlock({
  guest,
  index,
  onChange,
  onRemove,
  autoFocus,
  canRemove = true,
  disabled,
  errors,
}: Props) {
  const nameRef = useRef<HTMLInputElement>(null)
  const blockRef = useRef<HTMLFieldSetElement>(null)

  useEffect(() => {
    if (!autoFocus) return
    nameRef.current?.focus()
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    blockRef.current?.scrollIntoView({
      block: 'center',
      behavior: reduced ? 'auto' : 'smooth',
    })
  }, [autoFocus])

  function set<K extends keyof GuestData>(key: K, val: GuestData[K]) {
    onChange({ ...guest, [key]: val })
  }

  const nameId = `guest-${guest.id}-name`
  const allergiesId = `guest-${guest.id}-allergies`

  return (
    <fieldset
      ref={blockRef}
      className="relative mt-6 p-5 border border-ink/15 rounded-md bg-bg-warm"
    >
      <legend className="px-2 text-2xl md:text-3xl text-ink">Гость {index + 1}</legend>
      {canRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Удалить гостя"
          disabled={disabled}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center text-2xl leading-none text-ink-muted hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-olive rounded"
        >
          ×
        </button>
      )}

      <label htmlFor={nameId} className="block mt-2 text-base md:text-lg text-ink-muted">
        Фамилия и имя
      </label>
      <input
        ref={nameRef}
        id={nameId}
        type="text"
        autoComplete="name"
        value={guest.name}
        onChange={(e) => set('name', e.target.value)}
        disabled={disabled}
        aria-invalid={!!errors?.name}
        className={`block w-full text-xl md:text-2xl mt-1 px-3 py-2 bg-bg rounded border ${
          errors?.name ? 'border-red-500' : 'border-ink/20'
        } focus:border-olive focus:outline-none`}
      />
      {errors?.name && (
        <p role="alert" className="mt-1 text-base md:text-lg text-red-700">
          {errors.name}
        </p>
      )}

      <label htmlFor={allergiesId} className="block mt-3 text-base md:text-lg text-ink-muted">
        Аллергии
      </label>
      <input
        id={allergiesId}
        type="text"
        placeholder="нет"
        value={guest.allergies}
        onChange={(e) => set('allergies', e.target.value)}
        disabled={disabled}
        className="block w-full text-xl md:text-2xl mt-1 px-3 py-2 bg-bg rounded border border-ink/20 focus:border-olive focus:outline-none"
      />

      <AlcoholChecks
        legend="Алкоголь"
        value={guest.alcohol}
        onChange={(alc: AlcoholChoice[]) => set('alcohol', alc)}
        disabled={disabled}
        idPrefix={`guest-${guest.id}-alcohol`}
      />
    </fieldset>
  )
}
