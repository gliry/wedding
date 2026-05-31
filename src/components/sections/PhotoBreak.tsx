import { SectionPhoto } from '../ui/SectionPhoto'

type PhotoBreakProps = {
  slug: string
  /** Optional script caption overlaid on the photo (light text on dark). */
  caption?: string
  /** Height utility classes. */
  heightClass?: string
}

/**
 * Full-bleed photo moment — edge-to-edge image with a soft dark gradient and
 * an optional script caption. Breaks the rhythm of text-on-cream sections and
 * provides the light-text-on-photo colour inversion.
 */
export function PhotoBreak({
  slug,
  caption,
  heightClass = 'h-[72vh] md:h-[90vh]',
}: PhotoBreakProps) {
  return (
    <section className={`relative ${heightClass} overflow-hidden`}>
      <SectionPhoto
        slug={slug}
        alt=""
        className="absolute inset-0 h-full w-full"
        sizes="100vw"
      />
      <div
        className="absolute inset-0"
        aria-hidden
        style={{
          background:
            'linear-gradient(to top, rgba(28,25,16,0.6) 0%, rgba(28,25,16,0.15) 40%, rgba(28,25,16,0.1) 100%)',
        }}
      />
      {caption && (
        <p
          className="absolute inset-x-0 bottom-16 px-6 text-center font-script text-4xl md:text-6xl text-bg-warm"
          style={{ textShadow: '0 2px 12px rgba(0,0,0,0.5)' }}
        >
          {caption}
        </p>
      )}
    </section>
  )
}
