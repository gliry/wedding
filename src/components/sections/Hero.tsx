import { HeroNames } from './HeroNames'

export function Hero() {
  return (
    <section className="relative min-h-[100svh] text-center text-bg">
      {/* Darkening gradients — desktop only. Mobile stays clean and airy. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-1/2 hidden md:block"
        style={{
          background:
            'linear-gradient(to bottom, rgba(20, 18, 10, 0.5) 0%, rgba(20, 18, 10, 0.22) 50%, transparent 100%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 hidden md:block"
        style={{
          background:
            'linear-gradient(to top, rgba(20, 18, 10, 0.78) 0%, rgba(20, 18, 10, 0.45) 50%, rgba(20, 18, 10, 0.15) 80%, transparent 100%)',
        }}
      />

      {/* ── MOBILE: editorial hero (Vogue-style) ── */}
      <div className="relative z-10 flex min-h-[100svh] flex-col items-center px-6 pb-9 pt-[8vh] md:hidden">
        <HeroNames color="#ffffff" />
      </div>

      {/* ── DESKTOP: original script hero ── */}
      <div className="relative z-10 hidden min-h-[100svh] flex-col items-center justify-between px-6 pb-8 pt-[18vh] md:flex">
        <div>
          <h1
            className="font-script font-light leading-[1.25] text-bg"
            style={{
              fontSize: 'clamp(3.5rem, 12.6vw, 7rem)',
              textShadow:
                '0 2px 10px rgba(0,0,0,0.78), 0 4px 28px rgba(0,0,0,0.6), 0 0 4px rgba(0,0,0,0.85)',
            }}
          >
            <span className="block">Ильдар</span>
            <span className="mt-2 block" aria-hidden>&amp;</span>
            <span className="mt-2 block">Екатерина</span>
          </h1>
        </div>
        <p
          className="font-sans text-xs uppercase tracking-[0.2em] text-bg"
          style={{ textShadow: '0 2px 6px rgba(0,0,0,0.65)' }}
        >
          ↓ листайте дальше ↓
        </p>
      </div>
    </section>
  )
}
