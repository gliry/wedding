export const WEDDING_ISO = '2026-08-29T15:00:00+04:00'
export const WEDDING_TS = new Date(WEDDING_ISO).getTime()

export type Remaining = {
  days: number
  hours: number
  minutes: number
  seconds: number
  done: boolean
}

export function calculateRemaining(now: number = Date.now()): Remaining {
  const diff = WEDDING_TS - now
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true }
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    done: false,
  }
}
