import { describe, it, expect } from 'vitest'
import { calculateRemaining, WEDDING_TS } from '../../lib/countdown'

describe('countdown', () => {
  it('returns done when now is past wedding', () => {
    const r = calculateRemaining(WEDDING_TS + 1000)
    expect(r.done).toBe(true)
  })
  it('returns approximately one year out', () => {
    const oneYearBefore = WEDDING_TS - 365 * 86400000
    const r = calculateRemaining(oneYearBefore)
    expect(r.done).toBe(false)
    expect(r.days).toBeGreaterThanOrEqual(364)
    expect(r.days).toBeLessThanOrEqual(366)
  })
  it('zero hours/minutes/seconds at exact day boundary', () => {
    const exactDayBefore = WEDDING_TS - 86400000
    const r = calculateRemaining(exactDayBefore)
    expect(r.days).toBe(1)
    expect(r.hours).toBe(0)
    expect(r.minutes).toBe(0)
    expect(r.seconds).toBe(0)
  })
})
