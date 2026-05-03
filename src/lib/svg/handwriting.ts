/**
 * Pre-built SVG paths for each timeline timestamp. Each is designed for an
 * 80×40 viewBox and looks "handwritten enough" when revealed via DrawSVG.
 * Replace with hand-traced paths during polish pass for full Caveat fidelity.
 */
/** Generic underline used when a time string isn't in the table. */
export const FALLBACK_TIME_PATH = 'M 5 25 Q 40 22, 75 25'

export function getTimePath(time: string): string {
  const path = TIME_PATHS[time]
  if (!path) {
    if (import.meta.env?.DEV) {
      console.warn(`[Schedule] no handwriting path for time "${time}" — using fallback`)
    }
    return FALLBACK_TIME_PATH
  }
  return path
}

export const TIME_PATHS: Record<string, string> = {
  '15:30': 'M 5 10 L 5 30 M 12 10 Q 22 10, 22 20 Q 22 30, 12 30 M 28 18 Q 30 12, 36 12 Q 42 12, 42 22 Q 42 32, 30 32 M 50 10 L 50 30 L 60 30 M 65 12 Q 75 12, 75 20 Q 75 28, 65 28 L 65 30',
  '16:00': 'M 5 10 L 5 30 M 12 12 Q 18 10, 22 14 Q 25 18, 22 22 Q 18 26, 12 24 M 28 18 Q 30 12, 36 12 Q 42 12, 42 22 Q 42 32, 30 32 M 50 12 Q 60 12, 60 20 Q 60 28, 50 28 Q 50 12, 50 12 Z M 65 12 Q 75 12, 75 20 Q 75 28, 65 28 Q 65 12, 65 12 Z',
  '16:30': 'M 5 10 L 5 30 M 12 12 Q 18 10, 22 14 Q 25 18, 22 22 Q 18 26, 12 24 M 28 18 Q 30 12, 36 12 Q 42 12, 42 22 Q 42 32, 30 32 M 50 10 L 50 30 L 60 30 M 65 12 Q 75 12, 75 20 Q 75 28, 65 28 L 65 30',
  '23:00': 'M 5 12 Q 12 8, 18 14 L 5 30 L 18 30 M 22 10 L 30 30 L 25 22 M 38 18 Q 40 12, 46 12 Q 52 12, 52 22 Q 52 32, 40 32 M 60 12 Q 70 12, 70 20 Q 70 28, 60 28 Q 60 12, 60 12 Z M 75 12 Q 85 12, 85 20 Q 85 28, 75 28 Q 75 12, 75 12 Z',
  '30.08': 'M 5 12 Q 12 8, 18 14 Q 22 22, 18 26 Q 12 32, 5 26 M 22 10 L 32 30 L 27 22 M 38 26 L 38 30 L 42 30 L 42 26 Z M 50 12 Q 58 12, 58 20 Q 58 28, 50 28 Q 50 12, 50 12 Z M 65 18 Q 67 12, 73 12 Q 79 12, 79 22 Q 79 32, 67 32',
}
