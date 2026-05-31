import { describe, it, expect } from 'vitest'
import { validateForm } from './validation'
import type { FormState, GuestData } from './types'
import { INITIAL_STATE, MAIN_GUEST_ID } from './constants'

function companion(over: Partial<GuestData> = {}): GuestData {
  return { id: 'c1', name: '', allergies: '', alcohol: [], ...over }
}

function state(over: Partial<FormState> = {}, mainOver: Partial<GuestData> = {}): FormState {
  const base: FormState = {
    ...INITIAL_STATE,
    guests: [{ id: MAIN_GUEST_ID, name: '', allergies: '', alcohol: [] }],
    ...over,
  }
  // Apply main-guest field overrides on top of guests[0] unless `over.guests` was provided.
  if (!over.guests) {
    base.guests = [{ ...base.guests[0], ...mainOver }]
  }
  return base
}

describe('validateForm', () => {
  it('flags empty guests[0] (main) name', () => {
    const r = validateForm(state({ phone: '+7 999 1234567', willAttend: 'Нет' }))
    expect(r.ok).toBe(false)
    expect(r.errors.guests?.[MAIN_GUEST_ID]?.name).toBeTruthy()
  })

  it('flags whitespace-only main name', () => {
    const r = validateForm(state({ phone: '+7 999 1234567', willAttend: 'Нет' }, { name: '   ' }))
    expect(r.errors.guests?.[MAIN_GUEST_ID]?.name).toBeTruthy()
  })

  it('flags phone with fewer than 7 digits when attending', () => {
    const r = validateForm(state({ phone: '+7 (12) 34', willAttend: 'Да' }, { name: 'Иван' }))
    expect(r.errors.phone).toBeTruthy()
  })

  it('accepts phone with exactly 7 digits ignoring formatting (attending)', () => {
    const r = validateForm(state({ phone: '+7 (12) 34-567', willAttend: 'Да' }, { name: 'Иван' }))
    expect(r.errors.phone).toBeUndefined()
  })

  it('does not require phone when not attending', () => {
    const r = validateForm(state({ phone: '', willAttend: 'Нет' }, { name: 'Иван' }))
    expect(r.errors.phone).toBeUndefined()
    expect(r.ok).toBe(true)
  })

  it('flags missing willAttend', () => {
    const r = validateForm(state({ phone: '+7 999 1234567' }, { name: 'Иван' }))
    expect(r.errors.willAttend).toBeTruthy()
  })

  it('flags empty companion name when attending', () => {
    const r = validateForm(state({
      phone: '+7 999 1234567',
      willAttend: 'Да',
      guests: [
        { id: MAIN_GUEST_ID, name: 'Иван', allergies: '', alcohol: [] },
        companion({ id: 'c1', name: '' }),
      ],
    }))
    expect(r.errors.guests?.['c1']?.name).toBeTruthy()
  })

  it('ignores companion name when not attending', () => {
    const r = validateForm(state({
      phone: '+7 999 1234567',
      willAttend: 'Нет',
      guests: [
        { id: MAIN_GUEST_ID, name: 'Иван', allergies: '', alcohol: [] },
        companion({ id: 'c1', name: '' }),
      ],
    }))
    expect(r.ok).toBe(true)
    expect(r.errors.guests).toBeUndefined()
  })

  it('still flags main name as missing even when not attending', () => {
    const r = validateForm(state({
      phone: '+7 999 1234567',
      willAttend: 'Нет',
      guests: [
        { id: MAIN_GUEST_ID, name: '', allergies: '', alcohol: [] },
        companion({ id: 'c1', name: '' }),
      ],
    }))
    expect(r.ok).toBe(false)
    expect(r.errors.guests?.[MAIN_GUEST_ID]?.name).toBeTruthy()
    // companion name is not flagged
    expect(r.errors.guests?.['c1']).toBeUndefined()
  })

  it('returns ok=true and no errors for fully valid state', () => {
    const r = validateForm(state({
      phone: '+7 (999) 123-45-67',
      willAttend: 'Да',
      guests: [
        { id: MAIN_GUEST_ID, name: 'Иван Иванов', allergies: '', alcohol: [] },
        companion({ id: 'c1', name: 'Маша Петрова' }),
      ],
    }))
    expect(r.ok).toBe(true)
    expect(Object.keys(r.errors)).toHaveLength(0)
  })
})
