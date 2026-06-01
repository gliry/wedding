import { SectionPhoto } from './SectionPhoto'

type ArchPhotoProps = {
  slug: string
  alt: string
  /** Sizing classes for the frame (the arch radius + border are built in). */
  className?: string
  sizes?: string
  imgClassName?: string
  /** Adds a static warm-light grade + faint film grain over the photo. */
  cinema?: boolean
}

// Faint film grain as a data-URI. Kept on the main layer (no mix-blend, no
// animation) so it is never promoted to its own compositor layer — a promoted
// layer would be clipped to a rectangle and gnaw the rounded arch corners.
const GRAIN_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='g'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23g)'/></svg>`
const GRAIN_URI = `url("data:image/svg+xml;utf8,${encodeURIComponent(GRAIN_SVG)}")`

/**
 * Photo in the classic arched frame (rounded top, olive outline). Optionally
 * adds a cinema look — a static warm-light grade plus faint film grain. No
 * reveal animation and no mix-blend, so the rounded clip stays crisp.
 */
export function ArchPhoto({
  slug,
  alt,
  className = '',
  sizes = '(max-width: 768px) 75vw, 28vw',
  imgClassName = '',
  cinema = false,
}: ArchPhotoProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-t-full rounded-b-2xl border-2 border-olive shadow-sm ${className}`}
    >
      <SectionPhoto
        slug={slug}
        alt={alt}
        className="absolute inset-0 h-full w-full"
        sizes={sizes}
        imgClassName={imgClassName}
      />
      {cinema && (
        <>
          <div aria-hidden className="cinema-bloom pointer-events-none absolute inset-0" />
          <div
            aria-hidden
            className="cinema-grain pointer-events-none absolute inset-0"
            style={{ backgroundImage: GRAIN_URI, backgroundRepeat: 'repeat' }}
          />
        </>
      )}
    </div>
  )
}
