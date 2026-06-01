/**
 * Fires navigator.vibrate when supported; silently no-ops where it isn't
 * (iOS Safari has no Vibration API — the call is just ignored, no error).
 */
export function vibrate(pattern: number | number[]): void {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(pattern)
    } catch {
      /* ignore */
    }
  }
}
