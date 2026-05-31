#!/usr/bin/env node
/**
 * Section photo pipeline — optimizes gallery photos for in-section use
 * (arched frames, full-bleed bands). Outputs AVIF/WebP/JPEG at two widths
 * into public/photos/sections/.
 *
 * Usage: node scripts/process-sections.mjs
 */
import sharp from 'sharp'
import { mkdir, readdir } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const SRC_DIR = join(ROOT, 'public/photos/gallery')
const OUT_DIR = join(ROOT, 'public/photos/sections')

// long-side widths — lg covers full-screen retina without serving the raw
// ~42MP originals (which would make the page ~100 MB).
const SIZES = [
  { name: 'lg', width: 1920 },
  { name: 'md', width: 1200 },
  { name: 'sm', width: 720 },
]

// Near-lossless quality — sharpness matters more than bytes here.
const FORMATS = [
  { name: 'avif', options: { quality: 72, effort: 6 } },
  { name: 'webp', options: { quality: 90, effort: 6 } },
  { name: 'jpg', options: { quality: 92, mozjpeg: true } },
]

async function run() {
  await mkdir(OUT_DIR, { recursive: true })
  const files = (await readdir(SRC_DIR)).filter((f) => /\.jpe?g$/i.test(f))
  for (const file of files) {
    const slug = file.replace(/\.jpe?g$/i, '').toLowerCase() // img_2304
    for (const size of SIZES) {
      for (const fmt of FORMATS) {
        const out = join(OUT_DIR, `${slug}-${size.name}.${fmt.name}`)
        await sharp(join(SRC_DIR, file))
          .rotate()
          .resize({ width: size.width, withoutEnlargement: true })
          .toFormat(fmt.name, fmt.options)
          .toFile(out)
      }
    }
    console.log('processed', slug)
  }
  console.log('done →', OUT_DIR)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
