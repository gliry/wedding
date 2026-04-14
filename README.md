# Wedding Site v2 — Ильдар & Екатерина

Cinematic 3D wedding site built with Vite + React + R3F + GSAP.

**Stack:**

- Vite + React 19 + TypeScript
- Tailwind CSS v3
- GSAP + ScrollTrigger (@gsap/react)
- Lenis smooth scroll
- Three.js + @react-three/fiber + @react-three/drei
- @react-three/postprocessing (bloom, vignette, noise)
- @14islands/r3f-scroll-rig (DOM-synced 3D scenes)

## Dev

```bash
cd projects/wedding/site-v2
npm run dev
```

Opens at http://localhost:5173

## Build

```bash
npm run build
npm run preview
```

## Structure

```
src/
├── components/
│   ├── providers/     # SmoothScroll (Lenis + GSAP ticker)
│   ├── canvas/        # R3F Canvas + scenes + postprocessing
│   ├── sections/      # Hero, When/Where, Schedule, FAQ, etc.
│   └── ui/            # Buttons, typography primitives
├── hooks/             # useScrollCamera and friends
├── lib/               # Utilities
├── styles/            # Additional CSS
├── App.tsx            # Root layout
├── main.tsx           # Entry
└── index.css          # Tailwind + Google Fonts
public/
└── photos/
    ├── hero/          # Processed hero photos (AVIF/WebP)
    ├── gallery/       # Source photos uploaded by user
    └── raw/           # Originals
```

## Reference repos (open source)

Cloned to `/tmp/wedding-refs/` for study:

- **three-story-controls** (NYT, Apache-2.0) — scroll camera system
- **r3f-scroll-rig** (14islands, ISC) — DOM-synced 3D + useImageAsTexture
- **award-winning-website** (adrianhajdin, MIT) — GSAP + Vite patterns

## Status

See **[PLAN.md](./PLAN.md)** for the living roadmap, decisions log, open questions, and detailed phase breakdown.

Short version:

- [x] Phase 0 — Scaffold + stack + Tailwind + fonts + empty Canvas
- [x] Phase 1 — Photo prep (resize, AVIF/WebP, depth maps via local Depth Anything)
- [x] Phase 2 — Hero 2-layer parallax with inpainted background (couple silhouettes slide over clean beach)
- [ ] Phase 3 — Content sections migration from `site/` (NEXT)
- [ ] Phase 4 — Envelope opening scene
- [ ] Phase 5 — Sectional cinematic moments
- [ ] Phase 6 — Polish + deploy
