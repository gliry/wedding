import { test, expect } from '@playwright/test'

// The pin & zoom break has no caption text — assert the tall sticky section
// renders (one per responsive wrapper), no console errors, and the content
// after it (Schedule) is still reachable by scrolling through.
test('pinzoom section renders and content past it stays reachable', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))

  await page.goto('/')
  const slider = page.getByRole('slider', { name: 'Разблокируйте приглашение' })
  if (await slider.isVisible().catch(() => false)) {
    await slider.focus()
    await slider.press('Enter')
    await page.waitForTimeout(2400)
  }

  // Tall sticky pin&zoom section is present in the DOM.
  expect(await page.locator('section.h-\\[260vh\\]').count()).toBeGreaterThan(0)

  // Scrolling through it still reaches the Schedule section below.
  const schedule = page.getByText('Программа', { exact: false }).first()
  await schedule.scrollIntoViewIfNeeded()
  await expect(schedule).toBeVisible()
  expect(errors).toEqual([])
})
