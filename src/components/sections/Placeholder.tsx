interface PlaceholderProps {
  title: string
  description?: string
}

export function Placeholder({ title, description }: PlaceholderProps) {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center bg-bg px-6 text-center">
      <h2 className="font-display text-5xl font-light text-ink md:text-7xl">
        {title}
      </h2>
      {description && (
        <p className="mt-6 max-w-xl font-sans text-base text-ink-muted md:text-lg">
          {description}
        </p>
      )}
      <p className="mt-12 font-script text-2xl text-sage">(coming soon)</p>
    </section>
  )
}
