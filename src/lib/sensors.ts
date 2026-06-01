export type Accel = { x: number; y: number; z: number }

/** True when frame-to-frame acceleration jump exceeds threshold. */
export function isDeviceShake(prev: Accel | null, cur: Accel, threshold = 32): boolean {
  if (!prev) return false
  const delta =
    Math.abs(cur.x - prev.x) + Math.abs(cur.y - prev.y) + Math.abs(cur.z - prev.z)
  return delta > threshold
}

/** Rolling cursor-velocity + direction-flip detector for desktop "shake". */
export class CursorShake {
  private samples: { x: number; t: number }[] = []
  private windowMs: number
  private minFlips: number
  private minSpeed: number
  constructor(windowMs = 400, minFlips = 4, minSpeed = 1.2) {
    this.windowMs = windowMs
    this.minFlips = minFlips
    this.minSpeed = minSpeed
  }
  push(x: number, t: number): boolean {
    this.samples.push({ x, t })
    this.samples = this.samples.filter((s) => t - s.t <= this.windowMs)
    if (this.samples.length < 4) return false
    let flips = 0
    let lastDir = 0
    let dist = 0
    for (let i = 1; i < this.samples.length; i++) {
      const dx = this.samples[i].x - this.samples[i - 1].x
      dist += Math.abs(dx)
      const dir = Math.sign(dx)
      if (dir !== 0 && dir !== lastDir && lastDir !== 0) flips++
      if (dir !== 0) lastDir = dir
    }
    const speed = dist / this.windowMs
    return flips >= this.minFlips && speed >= this.minSpeed
  }
  reset() { this.samples = [] }
}
