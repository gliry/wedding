import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { HeroScene } from './HeroScene'
import { useIntroPhase } from '../../lib/useIntroPhase'

const CAMERA_Z = 5

// Mobile hero photo — a calm "standing together" frame that crops well in
// portrait, unlike the landscape depth-parallax shot (couple walking apart).
const MOBILE_HERO = 'img_2309'

export function Scene() {
  const { state, dispatch } = useIntroPhase()
  const wrapperRef = useRef<HTMLDivElement>(null)
  // Touch devices get a static photo instead of the WebGL depth scene: mouse
  // parallax never fires there anyway, the landscape shot frames badly in
  // portrait, and dropping the render loop keeps mobile scrolling smooth.
  const [isTouch] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
  )

  // Filter for waiting/dragging phases — slide leaves a small residual blur
  // (4px) and slightly damped brightness (0.92). The remaining settle to
  // (0, 1.0) is animated during the 'diving' phase via CSS transition,
  // which masks any compositor reflow / colour-grade flicker behind a soft
  // visible motion.
  const dragFilter = useMemo(() => {
    if (state.phase !== 'waiting' && state.phase !== 'dragging') return null
    const p = state.progress
    const blur = 4 + 16 * (1 - p) // p=0 → 20, p=1 → 4
    const brightness = 0.55 + p * 0.37 // p=0 → 0.55, p=1 → 0.92
    return `blur(${blur}px) brightness(${brightness})`
  }, [state.phase, state.progress])

  // 'diving': just hold the residual blur/brightness while the ThumbTrack
  // fades. The photo stays slightly soft so the lockscreen → Hero handoff
  // happens UNDER a visible blur — any colour-grade flicker is masked.
  useEffect(() => {
    if (state.phase !== 'diving') return
    const t = setTimeout(() => dispatch({ type: 'DIVE_COMPLETE' }), 600)
    return () => clearTimeout(t)
  }, [state.phase, dispatch])

  // 'done'/'skipped': Hero is mounted, lockscreen unmounted. Finish the
  // unblur via rAF + direct style writes (NOT CSS transition) — CSS filter
  // transitions can re-promote the compositor layer mid-flight, causing a
  // 1-px jerk at the start of the animation.
  useEffect(() => {
    if (state.phase !== 'done' && state.phase !== 'skipped') return
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const startBlur = 4
    const startBright = 0.92
    const duration = 500
    const startTime = performance.now()
    let rafId = 0

    const tick = (now: number) => {
      const t = Math.min(1, (now - startTime) / duration)
      const ease = 1 - Math.pow(1 - t, 3) // ease-out cubic
      const blur = startBlur * (1 - ease)
      const bright = startBright + (1 - startBright) * ease
      wrapper.style.filter = `blur(${blur}px) brightness(${bright})`
      if (t < 1) rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(rafId)
  }, [state.phase])

  // Apply drag-driven filter directly to wrapper element (skip React style
  // diff loops on every drag tick — direct DOM write).
  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return
    if (dragFilter !== null) {
      wrapper.style.filter = dragFilter
    }
    // 'diving'/'done'/'skipped': leave filter as-is (last value from
    // dragging is `blur(0) brightness(1)` — visually identical to 'none').
  }, [dragFilter, state.phase])

  return (
    <div
      ref={wrapperRef}
      className="pointer-events-none fixed inset-0 -z-10"
      style={{ filter: 'blur(20px) brightness(0.55)' }}
    >
      {isTouch ? (
        <picture>
          <source
            type="image/avif"
            srcSet={`/photos/sections/${MOBILE_HERO}-md.avif 1200w, /photos/sections/${MOBILE_HERO}-lg.avif 1920w`}
            sizes="100vw"
          />
          <source
            type="image/webp"
            srcSet={`/photos/sections/${MOBILE_HERO}-md.webp 1200w, /photos/sections/${MOBILE_HERO}-lg.webp 1920w`}
            sizes="100vw"
          />
          <img
            src={`/photos/sections/${MOBILE_HERO}-lg.jpg`}
            alt=""
            aria-hidden
            className="h-full w-full object-cover"
          />
        </picture>
      ) : (
        <Canvas
          className="!fixed !inset-0"
          camera={{ position: [0, 0, CAMERA_Z], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]}
        >
          <Suspense fallback={null}>
            <HeroScene phase={state.phase} />
          </Suspense>
        </Canvas>
      )}
    </div>
  )
}
