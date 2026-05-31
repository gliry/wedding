import type { AlcoholChoice, FormState } from './types'
import { ALCOHOL_OPTIONS } from './types'

export const FORM_ENDPOINT =
  'https://docs.google.com/forms/d/e/1FAIpQLSdUDXrJM0fwM6riamAjkokHVkWBzxR0azM97AZbLGlA7Z89KQ/formResponse'

export const ENTRY = {
  guest1_name:      'entry.180097329',
  guest1_allergies: 'entry.1005040273',
  guest1_alcohol:   'entry.709774740',
  phone:            'entry.73362123',

  guest2_name:      'entry.380597289',
  guest2_allergies: 'entry.1142637876',
  guest2_alcohol:   'entry.255685052',

  guest3_name:      'entry.1821889158',
  guest3_allergies: 'entry.405910385',
  guest3_alcohol:   'entry.1576298832',

  guest4_name:      'entry.1754526046',
  guest4_allergies: 'entry.1848780161',
  guest4_alcohol:   'entry.1260302128',

  guest5_name:      'entry.1801576225',
  guest5_allergies: 'entry.1025167827',
  guest5_alcohol:   'entry.1392982531',

  guest6_name:      'entry.1798188942',
  guest6_allergies: 'entry.828540065',
  guest6_alcohol:   'entry.249506562',

  guest7_name:      'entry.1267003127',
  guest7_allergies: 'entry.1866522495',
  guest7_alcohol:   'entry.1139180393',

  guest8_name:      'entry.1688933369',
  guest8_allergies: 'entry.667285108',
  guest8_alcohol:   'entry.1870107892',

  will_attend:      'entry.846992088',
  count_total:      'entry.630607032',
  second_day:       'entry.444120213',
  song:             'entry.1306250939',
  comment:          'entry.361103316',
} as const

export const MAX_GUESTS = 7 // companions; main is the always-present guests[0] (8 total slots)

export const MAIN_GUEST_ID = 'main'

// TODO: replace with real Telegram URL before launch.
// Same handle should also be wired into the "Ильдар & Екатерина" tile in Contacts.tsx.
export const TG_COUPLE_URL = 'https://t.me/PLACEHOLDER-COUPLE'

export const INITIAL_STATE: FormState = {
  phone: '',
  willAttend: '',
  guests: [
    { id: MAIN_GUEST_ID, name: '', allergies: '', alcohol: [] satisfies AlcoholChoice[] },
  ],
  secondDay: '',
  song: '',
  comment: '',
}

export { ALCOHOL_OPTIONS }
