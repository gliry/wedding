import { test, expect } from '@playwright/test'

const SECTIONS = [
  { id: 'when', text: 'Ждём вас в' },
  { id: 'schedule', text: 'Программа' },
  { id: 'dresscode', text: 'Дресс-код' },
  { id: 'rsvp', text: 'Будете на свадьбе' },
  { id: 'contacts', text: 'Контакты' },
  { id: 'finale', text: 'До встречи' },
]

test('renders and captures section screenshots', async ({ page }, testInfo) => {
  const proj = testInfo.project.name
  await page.goto('/')
  await page.waitForLoadState('networkidle')

  // Dismiss the intro lockscreen via its keyboard a11y path (Enter triggers a
  // 1.5s auto-unlock), then wait for the dive to settle.
  const slider = page.getByRole('slider', { name: 'Разблокируйте приглашение' })
  if (await slider.isVisible().catch(() => false)) {
    await slider.focus()
    await slider.press('Enter')
    await page.waitForTimeout(2400)
  }
  await expect(page.getByText('Дорогие гости', { exact: false })).toBeVisible({ timeout: 15_000 })
  await page.waitForTimeout(800)

  // Hero (WebGL on desktop, static photo on mobile-touch).
  await page.screenshot({ path: `e2e/shots/${proj}-00-hero.png` })

  for (const [i, s] of SECTIONS.entries()) {
    const target = page.getByText(s.text, { exact: false }).first()
    await target.scrollIntoViewIfNeeded()
    await page.waitForTimeout(500)
    await page.screenshot({
      path: `e2e/shots/${proj}-${String(i + 1).padStart(2, '0')}-${s.id}.png`,
    })
  }

  // Sanity: key content is present after the intro short-circuits.
  await expect(page.getByText('Дорогие гости', { exact: false })).toBeVisible()
  await expect(page.getByText('Будете на свадьбе', { exact: false })).toBeVisible()
})
