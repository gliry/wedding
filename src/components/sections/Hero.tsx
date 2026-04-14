export function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
      {/* Bottom gradient only — darkens the lower third so the text + couple at
          top of photo stay crisp. Center stays untouched so the couple is fully
          visible through the overlay. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
        style={{
          background:
            'linear-gradient(to top, rgba(20, 18, 10, 0.55) 0%, rgba(20, 18, 10, 0.15) 60%, transparent 100%)',
        }}
      />

      {/* Text anchored to bottom half so it does not cover the couple at image center. */}
      <div className="relative z-10 mt-auto pb-16 md:pb-24">
        <p className="mb-4 font-sans text-xs uppercase tracking-[0.3em] text-bg/90 drop-shadow-lg">
          Приглашаем вас на свадьбу
        </p>

        <h1
          className="font-display font-light leading-[0.95] text-bg drop-shadow-2xl"
          style={{ fontSize: 'clamp(3rem, 11vw, 6rem)' }}
        >
          <span className="block">Ильдар</span>
          <span className="mt-2 block">Екатерина</span>
        </h1>

        <p className="mt-6 font-script text-4xl text-bg drop-shadow-lg md:text-5xl">
          29 августа 2026
        </p>

        <p className="mt-12 font-sans text-xs uppercase tracking-[0.2em] text-bg/80">
          ↓ Scroll to explore ↓
        </p>
      </div>
    </section>
  )
}
