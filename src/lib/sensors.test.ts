import { describe, it, expect } from 'vitest'
import { isDeviceShake, CursorShake } from './sensors'

describe('isDeviceShake', () => {
  it('false on first sample', () => {
    expect(isDeviceShake(null, { x: 0, y: 0, z: 0 })).toBe(false)
  })
  it('true on big jump', () => {
    expect(isDeviceShake({ x: 0, y: 0, z: 0 }, { x: 40, y: 0, z: 0 })).toBe(true)
  })
  it('false on small jump', () => {
    expect(isDeviceShake({ x: 0, y: 0, z: 0 }, { x: 5, y: 0, z: 0 })).toBe(false)
  })
})

describe('CursorShake', () => {
  it('detects rapid back-and-forth', () => {
    const s = new CursorShake(400, 4, 0)
    let fired = false
    const xs = [0, 50, 0, 50, 0, 50]
    xs.forEach((x, i) => { if (s.push(x, i * 20)) fired = true })
    expect(fired).toBe(true)
  })
  it('ignores slow drift', () => {
    const s = new CursorShake(400, 4, 1.2)
    let fired = false
    for (let i = 0; i < 6; i++) if (s.push(i * 2, i * 100)) fired = true
    expect(fired).toBe(false)
  })
})
