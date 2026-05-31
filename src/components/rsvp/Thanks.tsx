import type { ThanksVariant } from './types'
import { TG_COUPLE_URL } from './constants'

interface Props {
  variant: ThanksVariant
}

export function Thanks({ variant }: Props) {
  if (variant === 'attending') {
    return (
      <div className="text-center py-12">
        <h3 className="font-display text-4xl md:text-5xl text-ink mb-4">Спасибо!</h3>
        <p className="text-xl md:text-2xl text-ink-muted">
          Увидимся 29 августа 🎉
        </p>
      </div>
    )
  }
  return (
    <div className="text-center py-12">
      <h3 className="font-display text-4xl md:text-5xl text-ink mb-4">Спасибо за ответ</h3>
      <p className="text-xl md:text-2xl text-ink-muted">
        Будем скучать 💕 Если планы изменятся —{' '}
        <a href={TG_COUPLE_URL} target="_blank" rel="noopener" className="text-olive underline">
          напишите нам в Telegram
        </a>
        .
      </p>
    </div>
  )
}
