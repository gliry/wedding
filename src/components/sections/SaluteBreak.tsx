import { useEffect, useRef, useState } from 'react'
import { burstConfetti } from '../effects/Confetti'
import { isDeviceShake, CursorShake, type Accel } from '../../lib/sensors'
import { vibrate } from '../../lib/vibrate'

type MotionPermFn = { requestPermission?: () => Promise<'granted' | 'denied'> }

/**
 * Interactive break ("salute"): shake the phone (or shake the cursor / click on
 * desktop) to burst confetti. A universal tap/click fallback always fires it.
 *
 * Device shake uses `devicemotion`, which needs a secure context (HTTPS) and,
 * on iOS 13+, an explicit permission requested from a user gesture — so the
 * first tap both fires confetti AND requests motion access, enabling shake.
 */
export function SaluteBreak() {
  const ref = useRef<HTMLElement>(null)
  const cooldown = useRef(0)
  const motionHandler = useRef<((e: DeviceMotionEvent) => void) | null>(null)
  const [isTouch] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
  )

  const fire = () => {
    if (!ref.current) return
    const now = performance.now()
    if (now - cooldown.current < 1000) return
    cooldown.current = now
    const r = ref.current.getBoundingClientRect()
    burstConfetti(document.body, r.left + r.width / 2, r.top + r.height * 0.55)
    vibrate([0, 40, 30, 60])
  }

  const bindMotion = () => {
    if (motionHandler.current) return
    let prev: Accel | null = null
    const h = (e: DeviceMotionEvent) => {
      const a = e.accelerationIncludingGravity
      if (!a) return
      const cur = { x: a.x ?? 0, y: a.y ?? 0, z: a.z ?? 0 }
      if (isDeviceShake(prev, cur)) fire()
      prev = cur
    }
    motionHandler.current = h
    window.addEventListener('devicemotion', h)
  }

  // Tap/click: fire + (iOS) request motion permission to unlock shake.
  const onTap = () => {
    fire()
    const DM = (window as unknown as { DeviceMotionEvent?: MotionPermFn }).DeviceMotionEvent
    if (DM && typeof DM.requestPermission === 'function') {
      DM.requestPermission()
        .then((s) => {
          if (s === 'granted') bindMotion()
        })
        .catch(() => {})
    }
  }

  // Android / browsers without a permission gate: bind shake immediately.
  useEffect(() => {
    if (!isTouch) return
    const DM = (window as unknown as { DeviceMotionEvent?: MotionPermFn }).DeviceMotionEvent
    if (!(DM && typeof DM.requestPermission === 'function')) bindMotion()
    return () => {
      if (motionHandler.current) {
        window.removeEventListener('devicemotion', motionHandler.current)
        motionHandler.current = null
      }
    }
  }, [isTouch])

  // Desktop: cursor shake.
  useEffect(() => {
    if (isTouch || !ref.current) return
    const det = new CursorShake()
    const el = ref.current
    const onMove = (e: PointerEvent) => {
      if (det.push(e.clientX, performance.now())) {
        det.reset()
        fire()
      }
    }
    el.addEventListener('pointermove', onMove)
    return () => el.removeEventListener('pointermove', onMove)
  }, [isTouch])

  return (
    <section
      ref={ref}
      onClick={onTap}
      className="relative flex h-[70vh] cursor-pointer items-center justify-center bg-olive px-6 text-center"
    >
      <p className="font-script text-bg-warm" style={{ fontSize: 'clamp(2rem, 9vw, 3.5rem)' }}>
        {isTouch ? 'Тряхните телефон ✨' : 'Поводите мышкой ✨'}
      </p>
    </section>
  )
}
