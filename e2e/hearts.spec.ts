import { test, expect } from '@playwright/test'

test.use({ reducedMotion: 'no-preference' })

test('finale: tap/click scatters hearts that clear', async ({ page }) => {
  await page.goto('/')
  const slider = page.getByRole('slider', { name: 'Разблокируйте приглашение' })
  if (await slider.isVisible().catch(() => false)) {
    await slider.focus()
    await slider.press('Enter')
    await page.waitForTimeout(2400)
  }

  const finale = page.getByText('До встречи', { exact: false })
  await finale.scrollIntoViewIfNeeded()
  await finale.click()

  await page.waitForTimeout(120)
  expect(await page.locator('body > span', { hasText: '❤' }).count()).toBeGreaterThan(0)

  await page.waitForTimeout(2200)
  expect(await page.locator('body > span', { hasText: '❤' }).count()).toBe(0)
})
