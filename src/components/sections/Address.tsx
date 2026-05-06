export function Address() {
  return (
    <section className="px-6 py-24 max-w-2xl mx-auto text-center">
      <p className="font-display text-4xl md:text-5xl leading-snug text-ink mb-6">
        Дорогие гости!
      </p>
      <p className="text-xl md:text-2xl leading-relaxed text-ink-muted mb-10">
        Приглашаем вас разделить радость этого особенного для нас события и стать частью начала нашей семейной истории!
      </p>
      <p className="font-script text-4xl md:text-5xl text-olive mb-4">
        Август
      </p>
      <div
        className="flex items-center justify-center gap-3 md:gap-5 mb-8"
        aria-label="29 августа 2026"
      >
        <span className="font-numeric text-2xl md:text-3xl text-ink-muted/60">27</span>
        <span className="font-numeric text-2xl md:text-3xl text-ink-muted/70">28</span>
        <span
          className="relative inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16"
          aria-hidden
        >
          <svg viewBox="0 0 32 30" className="absolute inset-0 w-full h-full">
            <path
              d="M16 28 C 0 14 0 2 10 2 C 13 2 15 4 16 7 C 17 4 19 2 22 2 C 32 2 32 14 16 28 Z"
              fill="rgba(43,39,25,0.85)"
            />
          </svg>
          <span className="relative font-numeric text-2xl md:text-3xl font-medium text-bg">
            29
          </span>
        </span>
        <span className="font-numeric text-2xl md:text-3xl text-ink-muted/70">30</span>
        <span className="font-numeric text-2xl md:text-3xl text-ink-muted/60">31</span>
      </div>
    </section>
  )
}
