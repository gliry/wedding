export const ALCOHOL_OPTIONS = [
  'Вино белое',
  'Вино красное',
  'Водка',
  'Виски',
  'Пиво',
  'Шампанское',
  'Не пью',
] as const

export type AlcoholChoice = (typeof ALCOHOL_OPTIONS)[number]

export type WillAttend = '' | 'Да' | 'Нет'
export type SecondDay = '' | 'Да' | 'Нет' | 'Пока не уверен(а)'

export interface GuestData {
  /** Stable id for React keys; not sent to the server. The main guest is always id `'main'`. */
  id: string
  name: string
  allergies: string
  alcohol: AlcoholChoice[]
}

export interface FormState {
  phone: string
  willAttend: WillAttend
  /** Index 0 is the main guest; companions follow. */
  guests: GuestData[]
  secondDay: SecondDay
  song: string
  comment: string
}

export interface ValidationErrors {
  phone?: string
  willAttend?: string
  guests?: Record<string, { name?: string }>
}

export type SubmitState = 'idle' | 'submitting' | 'error'
export type ThanksVariant = 'attending' | 'not-attending'
