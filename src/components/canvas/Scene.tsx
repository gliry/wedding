import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Vignette, Noise } from '@react-three/postprocessing'
import { HeroScene } from './HeroScene'

/**
 * Global fixed Canvas that renders behind all DOM content.
 *
 * Currently hosts the HeroScene (beach photo with depth parallax). As more
 * scroll-driven scenes are added (envelope intro, sectional moments), they
 * will live in this same Canvas and be activated by scroll position.
 *
 * Postprocessing: subtle vignette + film grain give DOM content a "lens" feel.
 */
export function Scene() {
  return (
    <Canvas
      className="!fixed !inset-0 !-z-10"
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
    >
      <Suspense fallback={null}>
        <HeroScene />
      </Suspense>

      <EffectComposer>
        <Vignette eskil={false} offset={0.2} darkness={0.4} />
        <Noise opacity={0.025} />
      </EffectComposer>
    </Canvas>
  )
}
