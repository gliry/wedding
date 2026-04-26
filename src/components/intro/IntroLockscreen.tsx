import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { useRef } from 'react'
import { ThumbTrack } from './ThumbTrack'
import { useIntroPhase } from '../../lib/useIntroPhase'

/**
 * DOM overlay above the R3F canvas during waiting/dragging/diving.
 *
 * The canvas (Scene.tsx) renders the actual hero scene at all times — this
 * overlay only contributes a darken layer + names + thumb track. The blur
 * is applied to the canvas itself via CSS `filter: blur()` (in Scene.tsx),
 * not via backdrop-filter here. That way the lockscreen and hero share the
 * same image source — no "double image blink" on dive.
 */
export function IntroLockscreen() {
  const { state, dispatch } = useIntroPhase()
  const overlayRef = useRef<HTMLDivElement>(null)
  const namesRef = useRef<HTMLDivElement>(null)
  const darkenLayerRef = useRef<HTMLDivElement>(null)

  // Bind darken to drag progress (cheap GPU update via inline style)
  useGSAP(
    () => {
      const darken = 0.25 * (1 - state.progress)
      if (darkenLayerRef.current) {
        darkenLayerRef.current.style.backgroundColor = `rgba(43,39,25,${darken})`
      }
    },
    { dependencies: [state.progress] }
  )

  // Subtle ambient: names breathe on a 4s sine while waiting
  useGSAP(
    () => {
      if (state.phase !== 'waiting' || !namesRef.current) return
      const tween = gsap.to(namesRef.current, {
        y: -3,
        duration: 2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      })
      return () => {
        tween.kill()
        if (namesRef.current) namesRef.current.style.transform = ''
      }
    },
    { dependencies: [state.phase] }
  )

  // Fade out overlay during dive — canvas remains visible underneath
  useGSAP(
    () => {
      if (state.phase !== 'diving') return
      if (!overlayRef.current) return
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.5,
        delay: 0.1,
        ease: 'power2.in',
      })
    },
    { dependencies: [state.phase] }
  )

  if (state.phase === 'done' || state.phase === 'skipped') return null

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Свадебный сайт — экран входа"
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
    >
      {/* Darken overlay (binds to progress) */}
      <div
        ref={darkenLayerRef}
        aria-hidden
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(43,39,25,0.25)' }}
      />
      {/* Content — names + thumb. Pointer events re-enabled here so the thumb
          is interactive while the rest of the overlay is click-through. */}
      <div className="pointer-events-auto relative flex h-full flex-col items-center justify-between px-6 pb-8 pt-[20vh] text-center">
        <div ref={namesRef}>
          <h1
            className="font-display font-light leading-[0.95] text-bg drop-shadow-2xl"
            style={{ fontSize: 'clamp(2.5rem, 9vw, 5rem)' }}
          >
            <span className="block">Ильдар</span>
            <span className="mt-2 block">Екатерина</span>
          </h1>
          <p className="mt-6 font-sans text-xs uppercase tracking-[0.3em] text-bg/70">
            29 · 08 · 2026
          </p>
        </div>

        <ThumbTrack
          onDragStart={() => dispatch({ type: 'DRAG_START' })}
          onDragProgress={(value) =>
            dispatch({ type: 'DRAG_PROGRESS', value })
          }
          onComplete={(endpoint) =>
            dispatch({
              type: 'DRAG_END',
              value: 1,
              origin: endpoint,
            })
          }
        />
      </div>
    </div>
  )
}
