export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-between px-6 pb-8 pt-[8vh] md:pt-[18vh] text-center">
      {/* Top gradient — contrast for the names sitting over the bright sky */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-1/2"
        style={{
          background:
            'linear-gradient(to bottom, rgba(20, 18, 10, 0.5) 0%, rgba(20, 18, 10, 0.22) 50%, transparent 100%)',
        }}
      />
      {/* Bottom gradient for text legibility over the bright sky/beach backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3"
        style={{
          background:
            'linear-gradient(to top, rgba(20, 18, 10, 0.78) 0%, rgba(20, 18, 10, 0.45) 50%, rgba(20, 18, 10, 0.15) 80%, transparent 100%)',
        }}
      />

      <div className="relative z-10">
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
        className="relative z-10 font-sans text-xs uppercase tracking-[0.2em] text-bg"
        style={{ textShadow: '0 2px 6px rgba(0,0,0,0.65)' }}
      >
        ↓ листайте дальше ↓
      </p>
    </section>
  )
}
