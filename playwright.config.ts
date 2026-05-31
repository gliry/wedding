import { defineConfig, devices } from '@playwright/test'

/**
 * Visual smoke tests. `reducedMotion: 'reduce'` makes the intro lockscreen
 * short-circuit straight to `done`, so content renders without the slide
 * gesture. The mobile project sets isMobile/hasTouch so `(pointer: coarse)`
 * matches and the Scene renders the static photo path (not WebGL).
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:5173',
    reducedMotion: 'reduce',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
    timeout: 60_000,
  },
  projects: [
    {
      name: 'desktop',
      use: { browserName: 'chromium', viewport: { width: 1280, height: 900 } },
    },
    {
      name: 'mobile',
      use: {
        browserName: 'chromium',
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
        userAgent: devices['iPhone 13'].userAgent,
      },
    },
  ],
})
