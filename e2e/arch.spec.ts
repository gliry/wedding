import { test, expect } from '@playwright/test'

// Schedule's arch photo renders with the cinema overlay, and the section
// content is intact (no crash, no console errors).
test('schedule arch renders with cinema overlay', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))

  await page.goto('/')
  const slider = page.getByRole('slider', { name: 'Разблокируйте приглашение' })
  if (await slider.isVisible().catch(() => false)) {
    await slider.focus()
    await slider.press('Enter')
    await page.waitForTimeout(2400)
  }

  const heading = page.getByText('Программа', { exact: false }).first()
  await heading.scrollIntoViewIfNeeded()
  await expect(heading).toBeVisible()

  // Cinema warm-grade layer is present (unique to ArchPhoto with cinema).
  await expect(page.locator('.cinema-bloom')).toHaveCount(1)
  expect(errors).toEqual([])
})
