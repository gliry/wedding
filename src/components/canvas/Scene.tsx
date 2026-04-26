import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { gsap } from 'gsap'
import { HeroScene } from './HeroScene'
import { useIntroPhase } from '../../lib/useIntroPhase'

const CAMERA_Z = 5

export function Scene() {
  const { state, dispatch } = useIntroPhase()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const introOnCanvas =
    state.phase === 'waiting' || state.phase === 'dragging'

  // Filter for waiting/dragging phases — drag progress drives blur and
  // brightness, but grayscale stays at 1 (B&W) until the dive starts.
  const dragFilter = useMemo(() => {
    if (state.phase !== 'waiting' && state.phase !== 'dragging') return null
    const p = state.progress
    const blur = 20 * (1 - p)
    const brightness = 0.55 + p * 0.25
    return `blur(${blur}px) grayscale(1) brightness(${brightness})`
  }, [state.phase, state.progress])

  // GSAP-driven color reveal during 'diving': grayscale 1→0 + brightness
  // bloom 0.8 → 1.15 → 1.0 + saturation overshoot 1 → 1.15 → 1.0.
  // Owns DIVE_COMPLETE dispatch.
  useEffect(() => {
    if (state.phase !== 'diving') return
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const fx = { gray: 1, bright: 0.8, sat: 1 }
    const apply = () => {
      wrapper.style.filter = `blur(0px) grayscale(${fx.gray}) brightness(${fx.bright}) saturate(${fx.sat})`
    }

    const tl = gsap.timeline({
      onComplete: () => dispatch({ type: 'DIVE_COMPLETE' }),
    })
    tl.to(fx, {
      gray: 0,
      duration: 0.9,
      ease: 'power2.out',
      onUpdate: apply,
    })
    tl.to(
      fx,
      {
        bright: 1.15,
        sat: 1.18,
        duration: 0.4,
        ease: 'power2.out',
        onUpdate: apply,
      },
      0
    )
    tl.to(
      fx,
      {
        bright: 1.0,
        sat: 1.0,
        duration: 0.6,
        ease: 'power2.inOut',
        onUpdate: apply,
      },
      '>'
    )

    return () => {
      tl.kill()
    }
  }, [state.phase, dispatch])

  // Apply drag-driven filter directly to wrapper element (skip React style
  // diff loops on every drag tick — direct DOM write).
  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return
    if (dragFilter !== null) {
      wrapper.style.filter = dragFilter
    } else if (state.phase === 'done' || state.phase === 'skipped') {
      wrapper.style.filter = 'none'
    }
    // 'diving' phase is owned by the GSAP effect above — don't override here.
  }, [dragFilter, state.phase])

  return (
    <div
      ref={wrapperRef}
      className={`pointer-events-none fixed inset-0 ${introOnCanvas ? 'z-0' : '-z-10'}`}
      style={{ filter: 'blur(20px) grayscale(1) brightness(0.55)' }}
    >
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
    </div>
  )
}
