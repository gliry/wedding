type HeroNamesProps = {
  /** Text colour. Hero uses pure white; the intro keeps the cream tone. */
  color?: string
}

/**
 * The editorial hero text block (mobile): Cormorant uppercase names, a script
 * ampersand, a heart divider, and a script date. Shared by the Hero section and
 * the intro lockscreen so the blur screen is identical to the hero and the dive
 * hands off seamlessly. Place inside a centered, top-aligned column.
 */
export function HeroNames({ color = '#ffffff' }: HeroNamesProps) {
  return (
    <div className="flex w-full flex-col items-center" style={{ color }}>
      <h1
        className="font-serif not-italic font-light uppercase"
        style={{
          fontSize: 'clamp(2.3rem, 12vw, 4.3rem)',
          lineHeight: 1.0,
          letterSpacing: '0.015em',
          textShadow: '0 2px 26px rgba(15,25,35,0.32)',
        }}
      >
        <span className="block">Ильдар</span>
        <span className="my-1 block font-script normal-case" style={{ fontSize: '0.7em' }} aria-hidden>
          &amp;
        </span>
        <span className="block">Екатерина</span>
      </h1>

      {/* Decorative divider with a heart */}
      <div className="mt-6 flex w-full max-w-[15rem] items-center justify-center gap-3">
        <span className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.75)' }} />
        <svg width="15" height="13" viewBox="0 0 15 13" fill="none" aria-hidden>
          <path
            d="M7.5 12.2 C7.5 12.2 1 8.1 1 4.3 C1 2.4 2.5 1 4.2 1 C5.5 1 6.7 1.8 7.5 3.1 C8.3 1.8 9.5 1 10.8 1 C12.5 1 14 2.4 14 4.3 C14 8.1 7.5 12.2 7.5 12.2 Z"
            stroke="rgba(255,255,255,0.85)"
            strokeWidth="1"
          />
        </svg>
        <span className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.75)' }} />
      </div>

      <p
        className="mt-4 font-script"
        style={{ fontSize: '1.7rem', letterSpacing: '0.02em', textShadow: '0 1px 16px rgba(15,25,35,0.35)' }}
      >
        29 августа 2026
      </p>
    </div>
  )
}
