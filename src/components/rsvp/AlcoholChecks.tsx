import { ALCOHOL_OPTIONS, type AlcoholChoice } from './types'

interface Props {
  legend: string
  value: AlcoholChoice[]
  onChange: (next: AlcoholChoice[]) => void
  disabled?: boolean
  /** stable prefix for input ids/names to avoid collisions when multiple groups render */
  idPrefix: string
}

export function AlcoholChecks({ legend, value, onChange, disabled, idPrefix }: Props) {
  function toggle(opt: AlcoholChoice) {
    if (value.includes(opt)) onChange(value.filter((o) => o !== opt))
    else onChange([...value, opt])
  }

  return (
    <fieldset className="mt-3">
      <legend className="font-sans text-base md:text-lg text-ink-muted mb-2">{legend}</legend>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        {ALCOHOL_OPTIONS.map((opt) => {
          const id = `${idPrefix}-${opt}`
          return (
            <label key={opt} htmlFor={id} className="inline-flex items-center gap-2 text-xl md:text-2xl text-ink">
              <input
                id={id}
                type="checkbox"
                checked={value.includes(opt)}
                onChange={() => toggle(opt)}
                disabled={disabled}
                className="h-4 w-4 accent-olive"
              />
              {opt}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
