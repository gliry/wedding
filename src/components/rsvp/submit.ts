import { ENTRY, FORM_ENDPOINT } from './constants'
import type { FormState } from './types'

/**
 * Slot 1 is the main guest (state.guests[0]); slots 2..8 are companions
 * (state.guests[1..7]). The indexed lookup avoids dynamic `keyof typeof ENTRY`
 * casts when iterating, keeping strict-TS clean.
 */
const GUEST_SLOT_ENTRIES = [
  null, // index 0 unused
  { name: ENTRY.guest1_name, allergies: ENTRY.guest1_allergies, alcohol: ENTRY.guest1_alcohol },
  { name: ENTRY.guest2_name, allergies: ENTRY.guest2_allergies, alcohol: ENTRY.guest2_alcohol },
  { name: ENTRY.guest3_name, allergies: ENTRY.guest3_allergies, alcohol: ENTRY.guest3_alcohol },
  { name: ENTRY.guest4_name, allergies: ENTRY.guest4_allergies, alcohol: ENTRY.guest4_alcohol },
  { name: ENTRY.guest5_name, allergies: ENTRY.guest5_allergies, alcohol: ENTRY.guest5_alcohol },
  { name: ENTRY.guest6_name, allergies: ENTRY.guest6_allergies, alcohol: ENTRY.guest6_alcohol },
  { name: ENTRY.guest7_name, allergies: ENTRY.guest7_allergies, alcohol: ENTRY.guest7_alcohol },
  { name: ENTRY.guest8_name, allergies: ENTRY.guest8_allergies, alcohol: ENTRY.guest8_alcohol },
] as const

export function buildFormData(state: FormState): FormData {
  const fd = new FormData()

  const main = state.guests[0]
  fd.append(ENTRY.guest1_name,      main.name.trim())
  fd.append(ENTRY.guest1_allergies, main.allergies.trim())
  fd.append(ENTRY.guest1_alcohol,   main.alcohol.join(', '))
  fd.append(ENTRY.phone,            state.phone.trim())
  fd.append(ENTRY.will_attend,      state.willAttend)

  if (state.willAttend === 'Да') {
    state.guests.slice(1, 8).forEach((g, i) => {
      const slot = i + 2 // 2..8
      const slotEntries = GUEST_SLOT_ENTRIES[slot]
      if (!slotEntries) return
      fd.append(slotEntries.name,      g.name.trim())
      fd.append(slotEntries.allergies, g.allergies.trim())
      fd.append(slotEntries.alcohol,   g.alcohol.join(', '))
    })

    fd.append(ENTRY.count_total, String(state.guests.length))
    fd.append(ENTRY.second_day,  state.secondDay)
    fd.append(ENTRY.song,        state.song.trim())
    fd.append(ENTRY.comment,     state.comment.trim())
  } else {
    fd.append(ENTRY.count_total, '0')
  }

  return fd
}

export async function submitRSVP(state: FormState): Promise<void> {
  await fetch(FORM_ENDPOINT, {
    method: 'POST',
    mode: 'no-cors',
    body: buildFormData(state),
  })
  // No-cors response is opaque; if fetch did not throw, treat as success.
}
