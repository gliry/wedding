/**
 * Five SVG path strings for botanical vine variants. Placeholder geometric
 * curves; replace with real botanical SVGs (Biodiversity Heritage Library)
 * during polish pass.
 *
 * All paths designed for a 200×80 viewBox.
 */
export const VINE_PATHS = [
  // 1: gentle S-curve descending
  'M 10 10 C 60 20, 100 70, 150 60 S 190 30, 195 50',
  // 2: shallow waves
  'M 5 40 C 50 10, 100 70, 150 40 S 195 20, 195 40',
  // 3: long arc rising then falling
  'M 5 60 Q 100 -10, 195 60',
  // 4: mirrored S
  'M 10 50 C 60 60, 100 10, 150 20 S 190 50, 195 30',
  // 5: tight corkscrew-like
  'M 10 20 Q 50 80, 100 40 T 195 60',
] as const

export type VineVariant = 1 | 2 | 3 | 4 | 5
