import { describe, it, expect } from 'vitest'
import { buildFormData } from './submit'
import { ENTRY, INITIAL_STATE, MAIN_GUEST_ID } from './constants'
import type { FormState, GuestData } from './types'

function fdMap(fd: FormData): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [k, v] of fd.entries()) out[k] = String(v)
  return out
}

function companion(id: string, over: Partial<GuestData> = {}): GuestData {
  return { id, name: '', allergies: '', alcohol: [], ...over }
}

function mainGuest(over: Partial<GuestData> = {}): GuestData {
  return { id: MAIN_GUEST_ID, name: 'Иван Иванов', allergies: '', alcohol: [], ...over }
}

function base(over: Partial<FormState> = {}): FormState {
  return {
    ...INITIAL_STATE,
    phone: '+7 (999) 123-45-67',
    guests: [mainGuest()],
    ...over,
  }
}

describe('buildFormData', () => {
  it('scenario 1: not attending, main only', () => {
    const fd = fdMap(buildFormData(base({ willAttend: 'Нет' })))
    expect(fd[ENTRY.guest1_name]).toBe('Иван Иванов')
    expect(fd[ENTRY.phone]).toBe('+7 (999) 123-45-67')
    expect(fd[ENTRY.will_attend]).toBe('Нет')
    expect(fd[ENTRY.count_total]).toBe('0')
    expect(fd[ENTRY.guest2_name]).toBeUndefined()
    expect(fd[ENTRY.second_day]).toBeUndefined()
    expect(fd[ENTRY.song]).toBeUndefined()
    expect(fd[ENTRY.comment]).toBeUndefined()
  })

  it('scenario 2: attending, main only, picks Вино белое', () => {
    const fd = fdMap(buildFormData(base({
      phone: '+7 999 1234567',
      guests: [mainGuest({ allergies: 'нет', alcohol: ['Вино белое'] })],
      willAttend: 'Да',
      secondDay: 'Да',
      song: 'Numa Numa',
      comment: 'спасибо за приглашение',
    })))
    expect(fd[ENTRY.guest1_alcohol]).toBe('Вино белое')
    expect(fd[ENTRY.guest1_allergies]).toBe('нет')
    expect(fd[ENTRY.will_attend]).toBe('Да')
    expect(fd[ENTRY.count_total]).toBe('1')
    expect(fd[ENTRY.second_day]).toBe('Да')
    expect(fd[ENTRY.song]).toBe('Numa Numa')
    expect(fd[ENTRY.comment]).toBe('спасибо за приглашение')
    expect(fd[ENTRY.guest2_name]).toBeUndefined()
  })

  it('scenario 3: attending with 1 companion (multi alcohol)', () => {
    const fd = fdMap(buildFormData(base({
      willAttend: 'Да',
      guests: [
        mainGuest(),
        companion('c1', { name: 'Маша Петрова', alcohol: ['Вино красное', 'Виски'] }),
      ],
    })))
    expect(fd[ENTRY.guest2_name]).toBe('Маша Петрова')
    expect(fd[ENTRY.guest2_alcohol]).toBe('Вино красное, Виски')
    expect(fd[ENTRY.count_total]).toBe('2')
    expect(fd[ENTRY.guest3_name]).toBeUndefined()
  })

  it('scenario 4: family of 4 — partner + 2 children, no age suffix', () => {
    const fd = fdMap(buildFormData(base({
      willAttend: 'Да',
      guests: [
        mainGuest(),
        companion('c1', { name: 'Илья Иванов' }),
        companion('c2', { name: 'Петя Иванов' }),
        companion('c3', { name: 'Соня Иванова' }),
      ],
    })))
    expect(fd[ENTRY.guest2_name]).toBe('Илья Иванов')
    expect(fd[ENTRY.guest3_name]).toBe('Петя Иванов')
    expect(fd[ENTRY.guest4_name]).toBe('Соня Иванова')
    expect(fd[ENTRY.count_total]).toBe('4')
    expect(fd[ENTRY.guest5_name]).toBeUndefined()
  })

  it('scenario 5: max 7 companions (8 cards total)', () => {
    const companions = Array.from({ length: 7 }, (_, i) =>
      companion(`c${i}`, { name: `Гость ${i + 2}` }),
    )
    const fd = fdMap(buildFormData(base({
      willAttend: 'Да',
      guests: [mainGuest(), ...companions],
    })))
    const slotKeys = [
      ENTRY.guest2_name, ENTRY.guest3_name, ENTRY.guest4_name, ENTRY.guest5_name,
      ENTRY.guest6_name, ENTRY.guest7_name, ENTRY.guest8_name,
    ]
    slotKeys.forEach((entryKey, idx) => {
      expect(fd[entryKey]).toBe(`Гость ${idx + 2}`)
    })
    expect(fd[ENTRY.count_total]).toBe('8')
  })

  it('trims whitespace from text fields', () => {
    const fd = fdMap(buildFormData(base({
      phone: '+7 999 1234567',
      guests: [mainGuest({ name: '  Иван  ', allergies: ' аллергия ' })],
      willAttend: 'Да',
      song: '  Песня  ',
    })))
    expect(fd[ENTRY.guest1_name]).toBe('Иван')
    expect(fd[ENTRY.guest1_allergies]).toBe('аллергия')
    expect(fd[ENTRY.song]).toBe('Песня')
  })

  it('emits empty alcohol as empty string', () => {
    const fd = fdMap(buildFormData(base({ willAttend: 'Да' })))
    expect(fd[ENTRY.guest1_alcohol]).toBe('')
  })
})
