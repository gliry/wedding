#!/usr/bin/env node
/**
 * Generate a precise "people mask" by diffing the original photo against
 * the AI-inpainted people-removed version. Pixels that differ between the
 * two photos are the couple (and any other subjects inpainting removed).
 *
 * Output: grayscale PNG where white = person, black = background.
 * Used as alpha mask in 2-layer parallax shader — far more accurate than
 * relying on a monocular depth map when people are standing in water at
 * similar depth to their surroundings.
 *
 * Usage: node scripts/generate-people-mask.mjs
 */
import sharp from 'sharp'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

const ORIGINAL = resolve(ROOT, 'public/photos/hero/main-lg.jpg')
const NO_PEOPLE = resolve(ROOT, 'public/photos/hero/main-lg-no-people.jpg')
const OUTPUT = resolve(ROOT, 'public/photos/hero/main-lg-people-mask.png')

// Threshold on per-pixel color distance. Lower = more sensitive (catches
// small differences from inpainting artifacts). Higher = only real subjects.
const DIFF_THRESHOLD = 30 // 0-255 range, Euclidean distance in RGB

// Blur radius in pixels applied to the binary mask to feather edges.
// Higher = softer silhouette outline, avoids pixelated edges in shader.
const MASK_BLUR = 12

async function main() {
  console.log(`📸 Original:   ${ORIGINAL}`)
  console.log(`📸 No people:  ${NO_PEOPLE}`)
  console.log(`🗺️  Output mask: ${OUTPUT}\n`)

  const [origMeta, bgMeta] = await Promise.all([
    sharp(ORIGINAL).metadata(),
    sharp(NO_PEOPLE).metadata(),
  ])

  console.log(`   Original:   ${origMeta.width}×${origMeta.height}`)
  console.log(`   No people:  ${bgMeta.width}×${bgMeta.height}`)

  if (origMeta.width !== bgMeta.width || origMeta.height !== bgMeta.height) {
    throw new Error(
      'Both images must have the same dimensions. Resize inpainted version to match original.'
    )
  }

  const width = origMeta.width
  const height = origMeta.height

  console.log('\n🔬 Reading raw RGB from both photos...')
  const [orig, bg] = await Promise.all([
    sharp(ORIGINAL).raw().toBuffer(),
    sharp(NO_PEOPLE).raw().toBuffer(),
  ])

  console.log('📐 Computing per-pixel diff...')
  const mask = new Uint8Array(width * height)
  for (let i = 0, p = 0; p < mask.length; i += 3, p++) {
    const dr = orig[i] - bg[i]
    const dg = orig[i + 1] - bg[i + 1]
    const db = orig[i + 2] - bg[i + 2]
    const dist = Math.sqrt(dr * dr + dg * dg + db * db)
    // Soft threshold: 0 below threshold, linear ramp up to 2×threshold,
    // then saturated. This gives a softer mask than a hard binary cut.
    const normalized = Math.min(1, Math.max(0, (dist - DIFF_THRESHOLD * 0.5) / DIFF_THRESHOLD))
    mask[p] = Math.round(normalized * 255)
  }

  let whiteCount = 0
  for (let i = 0; i < mask.length; i++) if (mask[i] > 128) whiteCount++
  console.log(
    `   Diff pixels > 128: ${whiteCount} (${((whiteCount / mask.length) * 100).toFixed(1)}%)`
  )

  console.log(`\n✨ Applying Gaussian blur (${MASK_BLUR}px) for smooth edges...`)

  await sharp(Buffer.from(mask), {
    raw: { width, height, channels: 1 },
  })
    .blur(MASK_BLUR)
    .png({ compressionLevel: 9, palette: false })
    .toFile(OUTPUT)

  console.log(`✅ Saved ${OUTPUT}`)
}

main().catch((err) => {
  console.error('❌ Error:', err.message)
  console.error(err.stack)
  process.exit(1)
})
