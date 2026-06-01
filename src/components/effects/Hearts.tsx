import { gsap } from 'gsap'

/** Spawns hearts from (x,y) viewport px that scatter, rotate, and fade out. */
export function burstHearts(container: HTMLElement, x: number, y: number, count = 12) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  for (let i = 0; i < count; i++) {
    const el = document.createElement('span')
    el.textContent = '❤'
    el.style.cssText = `position:fixed;left:${x}px;top:${y}px;z-index:70;font-size:${18 + Math.random() * 16}px;color:#C76B6B;pointer-events:none;will-change:transform,opacity;`
    container.appendChild(el)
    if (reduced) {
      gsap.to(el, { opacity: 0, duration: 0.4, delay: 0.3, onComplete: () => el.remove() })
      continue
    }
    gsap.to(el, {
      x: (Math.random() - 0.5) * 220,
      y: -100 - Math.random() * 160,
      rotation: (Math.random() - 0.5) * 80,
      scale: 0.4 + Math.random(),
      opacity: 0,
      duration: 1.1 + Math.random() * 0.6,
      ease: 'power2.out',
      onComplete: () => el.remove(),
    })
  }
}

/** Single small trailing heart at (x,y) — for the desktop cursor trail. */
export function trailHeart(container: HTMLElement, x: number, y: number) {
  const el = document.createElement('span')
  el.textContent = '❤'
  el.style.cssText = `position:fixed;left:${x}px;top:${y}px;z-index:69;font-size:14px;color:#C76B6B;pointer-events:none;`
  container.appendChild(el)
  gsap.to(el, { y: '+=24', opacity: 0, duration: 0.9, ease: 'power1.out', onComplete: () => el.remove() })
}
