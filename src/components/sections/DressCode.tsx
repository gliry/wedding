import { useRef, useState } from 'react'
import { ColorSplash } from '../effects/ColorSplash'

const STORAGE_KEY = 'wedding:dress-color'

const MESSAGES = [
  'Отличный выбор! Вам точно пойдёт 💕',
  'Прекрасный цвет. Серьёзно.',
  'О, это очень вам к лицу!',
  'Бесподобно. Мы в восторге.',
  'Этот оттенок — просто 🔥',
  'Ого. Вкус у вас — на зависть.',
  'Идеально. Мы бы сами так оделись.',
  'Вот это попадание в палитру.',
  'Бабушки будут в восторге.',
  'Этот цвет — новая классика.',
  'Стильно. Модно. Молодёжно.',
  'Прямо как на обложке Vogue.',
  'Браво. Без комментариев — просто браво.',
  'Если бы у вкуса был цвет — это был бы он.',
  'Этот оттенок делает комнату уютнее.',
  'Гости попросят у вас визитку стилиста.',
  'Дизайнеры интерьеров рыдают от зависти.',
  'Это не цвет, это настроение.',
  'Смело. Уверенно. Неожиданно. Мы в восторге.',
  'Декоратор уже думает, как вписать этот оттенок в букет.',
]

const RED_WHITE_WARNING =
  'Опа! Красный и белый зарезервированы для невесты 😉 Попробуйте другой оттенок.'

function isRedOrWhite(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  if (r > 240 && g > 240 && b > 240) return true
  if (r > 200 && g < 100 && b < 100) return true
  return false
}

const RAINBOW_GRADIENT =
  'conic-gradient(from 0deg, #ff0000, #ff8800, #ffee00, #33cc33, #00ccff, #3366ff, #9933ff, #ff3399, #ff0000)'

export function DressCode() {
  const initial = (typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEY)) || '#8B9579'
  const [color, setColor] = useState(initial)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [message, setMessage] = useState('')
  const [splash, setSplash] = useState<{ color: string; origin: [number, number] } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const wheelRef = useRef<HTMLSpanElement>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const next = e.target.value
    setColor(next)
    setHasInteracted(true)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* private mode */
    }
    if (isRedOrWhite(next)) {
      setMessage(RED_WHITE_WARNING)
    } else {
      setMessage(MESSAGES[Math.floor(Math.random() * MESSAGES.length)])
    }
    if (wheelRef.current) {
      const rect = wheelRef.current.getBoundingClientRect()
      setSplash({
        color: next,
        origin: [rect.left + rect.width / 2, rect.top + rect.height / 2],
      })
    }
  }

  return (
    <section className="px-6 py-24 max-w-2xl mx-auto text-center">
      <h2 className="font-display text-4xl md:text-5xl font-light text-ink mb-8">
        Дресс-код
      </h2>

      <div className="bg-bg-warm rounded-md border-2 border-dashed border-sage/40 p-8 mb-8">
        <p className="mb-6 text-base">
          Наша <strong>«официальная палитра»</strong>. Нажмите на круг и выберите{' '}
          <em>любой</em> цвет, <strong>все подходят</strong>:
        </p>

        {message && (
          <p className="mb-4 font-display text-xl text-olive min-h-[1.7em]" aria-live="polite">
            {message}
          </p>
        )}

        <label className="relative block mx-auto w-40 h-40 cursor-pointer rounded-full transition-transform duration-200 hover:scale-105 active:scale-95">
          <span
            ref={wheelRef}
            className="absolute inset-0 rounded-full border-4 border-bg-warm shadow-lg"
            style={{
              background: hasInteracted ? color : RAINBOW_GRADIENT,
            }}
            aria-hidden
          />
          <input
            ref={inputRef}
            type="color"
            value={color}
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            aria-label="Выбрать цвет наряда"
          />
        </label>
      </div>

      <p className="font-display text-3xl text-olive mb-4">Никакого дресс-кода нет.</p>
      <p className="text-lg text-ink-muted">
        Приходите в том, в чём вам комфортно. Без красного и белого.
      </p>

      {splash && (
        <ColorSplash
          color={splash.color}
          origin={splash.origin}
          onDone={() => setSplash(null)}
        />
      )}
    </section>
  )
}
