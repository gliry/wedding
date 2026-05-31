import type { FormState, ValidationErrors } from './types'

export interface ValidationResult {
  ok: boolean
  errors: ValidationErrors
}

const ERR = {
  phone: 'Укажите номер телефона (минимум 7 цифр)',
  willAttend: 'Выберите вариант ответа',
  guestName: 'Укажите имя гостя',
} as const

function digitsOnly(s: string): string {
  return s.replace(/\D/g, '')
}

export function validateForm(state: FormState): ValidationResult {
  const errors: ValidationErrors = {}

  if (state.willAttend !== 'Да' && state.willAttend !== 'Нет') {
    errors.willAttend = ERR.willAttend
  }

  // Phone only required when attending.
  if (state.willAttend === 'Да' && digitsOnly(state.phone).length < 7) {
    errors.phone = ERR.phone
  }

  const guestErrors: Record<string, { name?: string }> = {}
  state.guests.forEach((g, i) => {
    // Main guest (index 0) name is always required;
    // companion (index ≥ 1) names are required only when attending.
    const required = i === 0 || state.willAttend === 'Да'
    if (required && !g.name.trim()) {
      guestErrors[g.id] = { name: ERR.guestName }
    }
  })
  if (Object.keys(guestErrors).length > 0) errors.guests = guestErrors

  return { ok: Object.keys(errors).length === 0, errors }
}
