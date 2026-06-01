import { gsap } from 'gsap'

const COLORS = ['#A79177', '#8B9579', '#5E6B4B', '#F8F3E8', '#DCE0D0']

/** Spawns `count` confetti from (x,y) viewport px; removes nodes when done.
 *  No-op under prefers-reduced-motion. */
export function burstConfetti(container: HTMLElement, x: number, y: number, count = 80) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced) return
  for (let i = 0; i < count; i++) {
    const el = document.createElement('span')
    el.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:9px;height:14px;z-index:70;border-radius:2px;pointer-events:none;background:${COLORS[i % COLORS.length]};`
    container.appendChild(el)
    gsap.to(el, {
      duration: 1.6 + Math.random() * 0.8,
      physics2D: { velocity: 350 + Math.random() * 350, angle: 240 + Math.random() * 60, gravity: 700 },
      rotation: Math.random() * 720 - 360,
      opacity: 0,
      ease: 'none',
      onComplete: () => el.remove(),
    })
  }
}
