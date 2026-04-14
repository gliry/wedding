#!/usr/bin/env node
/**
 * Generates a grayscale depth map for a photo using Depth Anything v2 (local inference).
 *
 * Downloads model on first run (~100 MB), then runs fully offline.
 * No watermarks, no paywalls, no external services.
 *
 * Usage: node scripts/generate-depth.mjs <input> [output]
 * Example: node scripts/generate-depth.mjs public/photos/hero/main-lg.jpg public/photos/hero/main-lg-depth.png
 */
import { pipeline, env } from '@huggingface/transformers'
import sharp from 'sharp'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

// Let transformers.js cache models in node_modules/.transformers-cache to avoid polluting home dir
env.cacheDir = join(ROOT, 'node_modules/.transformers-cache')

async function main() {
  const [, , inputArg, outputArg] = process.argv

  if (!inputArg) {
    console.error('Usage: node scripts/generate-depth.mjs <input> [output]')
    process.exit(1)
  }

  const input = resolve(ROOT, inputArg)
  const output =
    outputArg
      ? resolve(ROOT, outputArg)
      : input.replace(/\.(jpg|jpeg|png|webp|avif)$/i, '-depth.png')

  console.log(`📸 Input:  ${input}`)
  console.log(`🗺️  Output: ${output}\n`)

  console.log('⏳ Loading Depth Anything v2 (downloads ~100 MB on first run)...')
  const depth = await pipeline(
    'depth-estimation',
    'onnx-community/depth-anything-v2-small',
    { dtype: 'fp32' }
  )

  console.log('🔬 Running inference...')
  const result = await depth(input)
  const predicted_depth = result.predicted_depth

  console.log(`   Tensor dims: ${JSON.stringify(predicted_depth.dims)}`)

  // predicted_depth may be [H, W] or [1, H, W] depending on model
  let h, w
  if (predicted_depth.dims.length === 2) {
    ;[h, w] = predicted_depth.dims
  } else if (predicted_depth.dims.length === 3) {
    ;[, h, w] = predicted_depth.dims
  } else {
    throw new Error(`Unexpected dims: ${predicted_depth.dims}`)
  }
  const data = predicted_depth.data // Float32Array length = h * w

  // Normalize to 0..255 grayscale (white = closer, black = further)
  let min = Infinity
  let max = -Infinity
  for (let i = 0; i < data.length; i++) {
    if (data[i] < min) min = data[i]
    if (data[i] > max) max = data[i]
  }
  const range = max - min || 1
  const gray = new Uint8Array(data.length)
  for (let i = 0; i < data.length; i++) {
    // Invert so closer = brighter (Depth Anything outputs inverse depth natively, but double-check)
    gray[i] = Math.round(((data[i] - min) / range) * 255)
  }

  console.log(`   Model output: ${w}×${h}`)
  console.log(`   Depth range: ${min.toFixed(2)} — ${max.toFixed(2)}`)

  // Save as grayscale PNG at model's native resolution, then upscale to match original image
  const { width: origW, height: origH } = await sharp(input).metadata()
  console.log(`   Original:     ${origW}×${origH}`)

  await sharp(Buffer.from(gray), {
    raw: { width: w, height: h, channels: 1 },
  })
    .resize(origW, origH, { kernel: 'lanczos3' })
    .toColorspace('b-w')
    .png({ compressionLevel: 9, palette: false })
    .toFile(output)

  console.log(`✅ Saved ${output}`)
}

main().catch((err) => {
  console.error('❌ Error:', err.message)
  console.error(err.stack)
  process.exit(1)
})
