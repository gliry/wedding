import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { ShaderMaterial, Vector2, LinearFilter, type Mesh } from 'three'

/**
 * Hero scene — two-layer parallax.
 *
 * Background plane: AI-inpainted version of the beach photo with the couple
 * removed. Fixed position, never moves.
 *
 * Foreground plane: original photo with a depth-derived alpha mask that keeps
 * only the couple's silhouettes visible. Translates slightly with mouse for
 * real layer separation — silhouettes float over the clean background without
 * any screen-space artifacts.
 *
 * This approach is the correct, production-proven technique (Facebook 3D
 * Photos, Apple Live Photos). Every previous attempt (naive UV offset, POM,
 * displacement mesh) was a screen-space hack that hit fundamental limits of
 * single-view 2D photos.
 */

const PASSTHROUGH_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const COVER_FIT_HELPER = /* glsl */ `
  vec2 coverUv(vec2 uv, vec2 planeSize, vec2 imageSize) {
    vec2 ratio = vec2(
      min((planeSize.x / planeSize.y) / (imageSize.x / imageSize.y), 1.0),
      min((planeSize.y / planeSize.x) / (imageSize.y / imageSize.x), 1.0)
    );
    return vec2(
      uv.x * ratio.x + (1.0 - ratio.x) * 0.5,
      uv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );
  }
`

const BACKGROUND_FRAGMENT = /* glsl */ `
  uniform sampler2D uColor;
  uniform vec2 uResolution;
  uniform vec2 uImageResolution;
  uniform float uOpacity;
  varying vec2 vUv;

  ${COVER_FIT_HELPER}

  void main() {
    vec2 uv = coverUv(vUv, uResolution, uImageResolution);
    vec4 color = texture2D(uColor, uv);
    gl_FragColor = vec4(color.rgb, color.a * uOpacity);
  }
`

const FOREGROUND_FRAGMENT = /* glsl */ `
  uniform sampler2D uColor;
  uniform sampler2D uDepth;
  uniform vec2 uResolution;
  uniform vec2 uImageResolution;
  uniform float uThresholdLow;
  uniform float uThresholdHigh;
  uniform float uOpacity;
  varying vec2 vUv;

  ${COVER_FIT_HELPER}

  void main() {
    vec2 uv = coverUv(vUv, uResolution, uImageResolution);
    vec4 color = texture2D(uColor, uv);

    // Pre-blurred depth map (Gaussian sigma 8) as alpha mask — soft edges
    // without pixelation. Sand and water ride along with the couple because
    // they are physically closer to camera in the depth map.
    float depth = texture2D(uDepth, uv).r;
    float mask = smoothstep(uThresholdLow, uThresholdHigh, depth);

    gl_FragColor = vec4(color.rgb, color.a * mask * uOpacity);
  }
`

interface HeroSceneProps {
  /** Max fraction of viewport width that foreground plane shifts at full mouse deflection. */
  parallax?: number
  /** Lerp factor for mouse follower. Lower = smoother/laggier. */
  damping?: number
  /** Depth values below this are fully transparent (background). */
  thresholdLow?: number
  /** Depth values above this are fully opaque (foreground/couple). */
  thresholdHigh?: number
}

export function HeroScene({
  parallax = 0.08,
  damping = 0.08,
  // Thresholds apply to the pre-blurred (Gaussian σ=8) depth map. Couple
  // core is ~0.37 in the raw map, but blur erodes silhouette edges down to
  // ~0.15-0.25. Lowering thresholdLow to 0.1 catches the eroded edges so
  // silhouettes are not "eaten" by the feather zone, while thresholdHigh
  // at 0.2 keeps the falloff short (avoiding visible halo).
  thresholdLow = 0.1,
  thresholdHigh = 0.2,
}: HeroSceneProps) {
  const fgMeshRef = useRef<Mesh>(null)
  const fgMatRef = useRef<ShaderMaterial>(null)
  const bgMatRef = useRef<ShaderMaterial>(null)
  const { viewport, size } = useThree()

  const targetMouse = useRef(new Vector2(0, 0))
  const currentMouse = useRef(new Vector2(0, 0))

  const [foregroundColor, backgroundColor, depth] = useTexture([
    '/photos/hero/main-lg.jpg',
    '/photos/hero/main-lg-no-people.jpg',
    '/photos/hero/main-lg-depth-soft.png',
  ])

  for (const tex of [foregroundColor, backgroundColor, depth]) {
    tex.minFilter = LinearFilter
    tex.magFilter = LinearFilter
  }

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      targetMouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      targetMouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('mousemove', handleMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  useFrame(() => {
    // Lerp mouse for smooth motion
    currentMouse.current.x +=
      (targetMouse.current.x - currentMouse.current.x) * damping
    currentMouse.current.y +=
      (targetMouse.current.y - currentMouse.current.y) * damping

    // Translate foreground mesh — couple silhouettes slide over fixed background
    if (fgMeshRef.current) {
      fgMeshRef.current.position.x =
        currentMouse.current.x * parallax * viewport.width
      fgMeshRef.current.position.y =
        currentMouse.current.y * parallax * viewport.height
    }

    // Scroll-based opacity fade — both layers fade together so the content
    // sections below visually "cover" the hero smoothly.
    const scrolled = window.scrollY
    const vh = window.innerHeight
    const fadeStart = vh * 0.3
    const fadeEnd = vh * 1.0
    const t = Math.max(
      0,
      Math.min(1, (scrolled - fadeStart) / (fadeEnd - fadeStart))
    )
    const opacity = 1 - t
    if (fgMatRef.current) fgMatRef.current.uniforms.uOpacity.value = opacity
    if (bgMatRef.current) bgMatRef.current.uniforms.uOpacity.value = opacity
  })

  const planeScale = 1.1

  return (
    <>
      {/* Background plane — fixed, never moves */}
      <mesh
        position={[0, 0, -0.5]}
        scale={[viewport.width * planeScale, viewport.height * planeScale, 1]}
      >
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          ref={bgMatRef}
          transparent
          vertexShader={PASSTHROUGH_VERTEX}
          fragmentShader={BACKGROUND_FRAGMENT}
          uniforms={{
            uColor: { value: backgroundColor },
            uResolution: { value: new Vector2(size.width, size.height) },
            uImageResolution: { value: new Vector2(2000, 1334) },
            uOpacity: { value: 1 },
          }}
        />
      </mesh>

      {/* Foreground plane — couple silhouettes, shifts with mouse */}
      <mesh
        ref={fgMeshRef}
        position={[0, 0, 0]}
        scale={[viewport.width * planeScale, viewport.height * planeScale, 1]}
      >
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          ref={fgMatRef}
          transparent
          vertexShader={PASSTHROUGH_VERTEX}
          fragmentShader={FOREGROUND_FRAGMENT}
          uniforms={{
            uColor: { value: foregroundColor },
            uDepth: { value: depth },
            uResolution: { value: new Vector2(size.width, size.height) },
            uImageResolution: { value: new Vector2(2000, 1334) },
            uThresholdLow: { value: thresholdLow },
            uThresholdHigh: { value: thresholdHigh },
            uOpacity: { value: 1 },
          }}
        />
      </mesh>
    </>
  )
}
