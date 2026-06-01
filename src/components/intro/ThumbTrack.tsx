import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { useCallback, useRef, useState, type PointerEvent } from 'react'

type ThumbTrackProps = {
  onDragStart?: () => void
  onDragProgress?: (progress: number) => void
  onComplete: (endpointPx: [number, number]) => void
  label?: string
  className?: string
}

const COMPLETE_THRESHOLD = 0.95

export function ThumbTrack({
  onDragStart,
  onDragProgress,
  onComplete,
  label = 'РАЗБЛОКИРОВАТЬ ПРИГЛАШЕНИЕ',
  className = '',
}: ThumbTrackProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const draggingRef = useRef(false)
  const startXRef = useRef(0)
  const trackWidthRef = useRef(0)

  const setProgressBoth = useCallback(
    (value: number) => {
      const clamped = Math.max(0, Math.min(1, value))
      setProgress(clamped)
      onDragProgress?.(clamped)
    },
    [onDragProgress]
  )

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (!trackRef.current || !thumbRef.current) return
    e.currentTarget.setPointerCapture(e.pointerId)
    const rect = trackRef.current.getBoundingClientRect()
    const thumbWidth = thumbRef.current.offsetWidth
    trackWidthRef.current = rect.width - thumbWidth
    startXRef.current = e.clientX - progress * trackWidthRef.current
    draggingRef.current = true
    // kill any in-flight snap-back tween
    gsap.killTweensOf({ progress })
    onDragStart?.()
  }

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current || trackWidthRef.current === 0) return
    const dx = e.clientX - startXRef.current
    setProgressBoth(dx / trackWidthRef.current)
  }

  const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return
    draggingRef.current = false
    e.currentTarget.releasePointerCapture(e.pointerId)

    if (progress >= COMPLETE_THRESHOLD && thumbRef.current) {
      const rect = thumbRef.current.getBoundingClientRect()
      const endpoint: [number, number] = [
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
      ]
      // commit to 1.0 visually, then fire onComplete
      setProgressBoth(1)
      onComplete(endpoint)
      return
    }

    // snap back
    const tween = { value: progress }
    gsap.to(tween, {
      value: 0,
      duration: 0.4,
      ease: 'power2.out',
      onUpdate: () => setProgressBoth(tween.value),
    })
  }

  // Keyboard a11y — Space/Enter triggers a 1.5s auto-progress
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== ' ' && e.key !== 'Enter') return
    e.preventDefault()
    if (progress >= COMPLETE_THRESHOLD || draggingRef.current) return
    onDragStart?.()
    const tween = { value: 0 }
    gsap.to(tween, {
      value: 1,
      duration: 1.5,
      ease: 'power2.inOut',
      onUpdate: () => setProgressBoth(tween.value),
      onComplete: () => {
        if (!thumbRef.current) return
        const rect = thumbRef.current.getBoundingClientRect()
        onComplete([rect.left + rect.width / 2, rect.top + rect.height / 2])
      },
    })
  }

  // Idle pulse animation on the thumb when not dragging and progress is 0
  useGSAP(
    () => {
      if (!thumbRef.current) return
      if (progress > 0) return
      const tween = gsap.to(thumbRef.current, {
        scale: 1.06,
        duration: 1,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      })
      return () => {
        tween.kill()
        if (thumbRef.current) thumbRef.current.style.transform = ''
      }
    },
    { dependencies: [progress === 0] }
  )

  const trackInnerWidth = `calc((100% - 48px) * ${progress})`

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      {/* Label above the track */}
      <span
        aria-hidden
        className="font-ui text-xs uppercase tracking-[0.25em] text-bg/75 transition-opacity duration-300"
        style={{ opacity: 1 - progress }}
      >
        {label}
      </span>
      <div
        ref={trackRef}
        role="slider"
        tabIndex={0}
        aria-label="Разблокируйте приглашение"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
        aria-valuetext={
          progress >= COMPLETE_THRESHOLD
            ? 'Готово'
            : `${Math.round(progress * 100)} процентов`
        }
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={handleKeyDown}
        className="relative h-14 w-[min(280px,80vw)] cursor-grab touch-none rounded-full border border-bg/25 bg-ink/40 backdrop-blur-sm select-none"
      >
        {/* Fill behind thumb */}
        <div
          aria-hidden
          className="absolute left-1 top-1 h-12 rounded-full bg-bg/15"
          style={{ width: trackInnerWidth }}
        />
        {/* Thumb */}
        <div
          ref={thumbRef}
          aria-hidden
          className="absolute top-1 flex h-12 w-12 items-center justify-center rounded-full bg-bg text-ink shadow-lg"
          style={{ left: `calc(4px + (100% - 56px) * ${progress})` }}
        >
          <span className="font-sans text-lg leading-none">→</span>
        </div>
      </div>
    </div>
  )
}
