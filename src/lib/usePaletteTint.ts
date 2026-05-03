import { useEffect, useRef } from 'react'

/**
 * Mounts a fixed full-viewport overlay <div> with mix-blend-mode: multiply
 * and a color that lerps from transparent (top of page) to subtle olive tint
 * (bottom). Creates a felt "morning → evening" palette shift without
 * touching Tailwind tokens.
 *
 * Returns nothing — manages a single DOM node attached to <body>.
 */
export function usePaletteTint() {
  const nodeRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const node = document.createElement('div')
    node.setAttribute('aria-hidden', 'true')
    Object.assign(node.style, {
      position: 'fixed',
      inset: '0',
      pointerEvents: 'none',
      mixBlendMode: 'multiply',
      zIndex: '55',
      backgroundColor: 'rgba(94, 107, 75, 0)',
    })
    document.body.appendChild(node)
    nodeRef.current = node

    if (reduced) {
      node.style.backgroundColor = 'rgba(94, 107, 75, 0.06)'
      return () => {
        node.remove()
        nodeRef.current = null
      }
    }

    const doc = document.documentElement
    let max = doc.scrollHeight - doc.clientHeight
    let rafId = 0
    let scheduled = false

    function recomputeMax() {
      max = doc.scrollHeight - doc.clientHeight
    }

    function applyTint() {
      scheduled = false
      const progress = max > 0 ? Math.min(1, Math.max(0, doc.scrollTop / max)) : 0
      const alpha = progress * 0.18
      node.style.backgroundColor = `rgba(94, 107, 75, ${alpha})`
    }

    function onScroll() {
      if (scheduled) return
      scheduled = true
      rafId = requestAnimationFrame(applyTint)
    }

    applyTint()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', recomputeMax, { passive: true })

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', recomputeMax)
      node.remove()
      nodeRef.current = null
    }
  }, [])
}
