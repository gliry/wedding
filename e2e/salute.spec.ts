import { test, expect } from '@playwright/test'

// Force motion so confetti actually spawns (config defaults to reduce).
test.use({ reducedMotion: 'no-preference' })

test('salute: interacting bursts confetti that clears', async ({ page }) => {
  await page.goto('/')
  const slider = page.getByRole('slider', { name: 'Разблокируйте приглашение' })
  if (await slider.isVisible().catch(() => false)) {
    await slider.focus()
    await slider.press('Enter')
    await page.waitForTimeout(2400)
  }

  const prompt = page.getByText(/Тряхните телефон|Поводите мышкой/)
  await prompt.scrollIntoViewIfNeeded()
  await prompt.click() // universal click fallback fires the salute

  await page.waitForTimeout(120)
  expect(await page.locator('body > span').count()).toBeGreaterThan(0)

  await page.waitForTimeout(3200)
  expect(await page.locator('body > span').count()).toBe(0)
})
