import { useEffect, useRef, useState } from 'react'
import { calculateRemaining } from '../../lib/countdown'

type Cell = { unit: string; value: number; label: string }

type CountdownProps = {
  /** Visual variant. 'hero' = larger text, 'finale' = smaller, fits with rings. */
  variant?: 'hero' | 'finale'
  className?: string
}

export function Countdown({ variant = 'hero', className = '' }: CountdownProps) {
  const [state, setState] = useState(() => calculateRemaining())
  const cellRefs = useRef<Record<string, HTMLElement | null>>({})

  useEffect(() => {
    const interval = setInterval(() => {
      setState(calculateRemaining())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const { days, hours, minutes, seconds } = state
  useEffect(() => {
    const units: Array<keyof typeof cellRefs.current> = ['days', 'hours', 'minutes', 'seconds']
    for (const unit of units) {
      const el = cellRefs.current[unit]
      if (!el) continue
      el.classList.remove('countdown-tick')
      void el.offsetWidth
      el.classList.add('countdown-tick')
    }
  }, [days, hours, minutes, seconds])

  const cells: Cell[] = state.done
    ? [{ unit: 'days', value: 0, label: '🎉 свадьба сегодня!' }]
    : [
        { unit: 'days', value: state.days, label: 'дней' },
        { unit: 'hours', value: state.hours, label: 'часов' },
        { unit: 'minutes', value: state.minutes, label: 'минут' },
        { unit: 'seconds', value: state.seconds, label: 'секунд' },
      ]

  const sizes = variant === 'hero'
    ? { num: 'text-4xl md:text-5xl', label: 'text-[0.65rem]' }
    : { num: 'text-3xl md:text-4xl', label: 'text-[0.6rem]' }

  return (
    <div
      className={`flex flex-wrap items-end justify-center gap-x-6 gap-y-2 ${className}`}
      aria-label={
        state.done
          ? 'Свадьба сегодня'
          : `До свадьбы ${state.days} дней`
      }
    >
      {cells.map((cell) => (
        <div key={cell.unit} className="flex flex-col items-center" aria-hidden="true">
          <span
            ref={(el) => {
              cellRefs.current[cell.unit] = el
            }}
            className={`font-display font-light leading-none text-bg ${sizes.num}`}
          >
            {String(cell.value).padStart(2, '0')}
          </span>
          <span
            className={`mt-1 font-sans uppercase tracking-[0.2em] text-bg/60 ${sizes.label}`}
          >
            {cell.label}
          </span>
        </div>
      ))}
    </div>
  )
}
