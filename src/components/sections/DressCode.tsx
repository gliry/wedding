import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'

const MESSAGES = [
  'Отличный выбор!',
  'Прекрасный цвет.',
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

function hslToHex(h: number, s: number, l: number): string {
  const sN = s / 100
  const lN = l / 100
  const a = sN * Math.min(lN, 1 - lN)
  const ch = (n: number) => {
    const k = (n + h / 30) % 12
    const c = lN - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * c)
      .toString(16)
      .padStart(2, '0')
  }
  return `#${ch(0)}${ch(8)}${ch(4)}`
}

// White → red → green → blue → black, expressed as 5 (t, h, s, l) anchors
// and lerped continuously. The CSS gradient below samples the same function
// at fine intervals so the strip you see matches the colour the picker emits.
type Anchor = readonly [t: number, h: number, s: number, l: number]
const ANCHORS: readonly Anchor[] = [
  [0.0,   0,   0, 100],
  [0.08,  0,  80,  55],
  [0.5,  120, 80,  55],
  [0.92, 240, 80,  55],
  [1.0,  240,  0,   0],
]

function colorFromRatio(t: number): string {
  const clamped = Math.max(0, Math.min(1, t))
  for (let i = 1; i < ANCHORS.length; i++) {
    const [t2] = ANCHORS[i]
    if (clamped <= t2) {
      const [t1, h1, s1, l1] = ANCHORS[i - 1]
      const [, h2, s2, l2] = ANCHORS[i]
      const u = (clamped - t1) / (t2 - t1)
      return hslToHex(h1 + (h2 - h1) * u, s1 + (s2 - s1) * u, l1 + (l2 - l1) * u)
    }
  }
  const [, h, s, l] = ANCHORS[ANCHORS.length - 1]
  return hslToHex(h, s, l)
}

const GRADIENT_CSS = (() => {
  const STEPS = 24
  const stops: string[] = []
  for (let i = 0; i <= STEPS; i++) {
    const t = i / STEPS
    stops.push(`${colorFromRatio(t)} ${(t * 100).toFixed(2)}%`)
  }
  return `linear-gradient(to right, ${stops.join(', ')})`
})()

export function DressCode() {
  const [color, setColor] = useState('')
  const [message, setMessage] = useState('')
  const stripRef = useRef<HTMLDivElement>(null)

  function pickFromX(clientX: number) {
    const el = stripRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    const hex = colorFromRatio(ratio)
    setColor(hex)
    if (isRedOrWhite(hex)) {
      setMessage(RED_WHITE_WARNING)
    } else {
      setMessage(MESSAGES[Math.floor(Math.random() * MESSAGES.length)])
    }
  }

  function handleStripPointer(e: ReactPointerEvent<HTMLDivElement>) {
    if (e.buttons === 0 && e.type !== 'pointerdown') return
    pickFromX(e.clientX)
  }

  return (
    <section className="px-6 py-24 max-w-2xl mx-auto text-center">
      <h2 className="font-display text-4xl md:text-5xl font-light text-ink mb-8">
        Дресс-код
      </h2>

      <p className="text-xl md:text-2xl text-ink-muted leading-relaxed mb-10">
        Никакого дресс-кода нет. Приходите в том, в чём вам комфортно.
        Только не красный и не белый.
      </p>

      <div
        className="relative mx-auto w-64 h-64 rounded-full overflow-hidden mb-6 border-4 border-sage/40"
        style={color ? { backgroundColor: color } : undefined}
      >
        {!color && (
          <span className="absolute inset-0 flex items-center justify-center text-ink text-lg md:text-xl leading-snug px-8 text-center pointer-events-none">
            Выбери любой цвет из палитры ниже
          </span>
        )}
      </div>

      <div
        ref={stripRef}
        role="slider"
        aria-label="Выбрать цвет"
        aria-valuemin={0}
        aria-valuemax={100}
        tabIndex={0}
        onPointerDown={handleStripPointer}
        onPointerMove={handleStripPointer}
        className="mx-auto h-10 w-full max-w-md rounded-full cursor-pointer border-2 border-bg-warm shadow-md touch-none"
        style={{ background: GRADIENT_CSS }}
      />

      {message && (
        <p
          className="mt-6 text-xl md:text-2xl text-olive min-h-[1.7em]"
          aria-live="polite"
        >
          {message}
        </p>
      )}
    </section>
  )
}
