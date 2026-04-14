#!/usr/bin/env node
/**
 * Photo pipeline for wedding site v2.
 *
 * Reads raw photos from public/photos/gallery/, outputs optimized versions
 * to public/photos/hero/ in multiple formats and sizes.
 *
 * Usage: node scripts/process-photos.mjs
 */
import sharp from 'sharp'
import { mkdir, readdir, stat } from 'node:fs/promises'
import { join, basename, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const SRC_DIR = join(ROOT, 'public/photos/gallery')
const OUT_DIR = join(ROOT, 'public/photos/hero')

// Hero photo mapping — which gallery photos become which hero slots
const HERO_MAP = {
  main: 'IMG_2306.JPG', // primary hero — Катя & Ильдар, landscape
}

// Output sizes (long side in px) — responsive breakpoints
const SIZES = [
  { name: 'lg', width: 2000 }, // desktop 2x
  { name: 'md', width: 1440 }, // desktop 1x
  { name: 'sm', width: 800 },  // mobile
]

// Output formats (fallback order: AVIF → WebP → JPEG)
const FORMATS = [
  { name: 'avif', options: { quality: 62, effort: 6 } },
  { name: 'webp', options: { quality: 82, effort: 5 } },
  { name: 'jpg', options: { quality: 88, mozjpeg: true } },
]

async function processPhoto(srcPath, slotName) {
  const base = basename(srcPath, extname(srcPath))
  const results = []
  for (const size of SIZES) {
    const pipeline = sharp(srcPath).resize({
      width: size.width,
      withoutEnlargement: true,
    })
    for (const format of FORMATS) {
      const outName = `${slotName}-${size.name}.${format.name}`
      const outPath = join(OUT_DIR, outName)
      const buf = await pipeline
        .clone()
        .toFormat(format.name === 'jpg' ? 'jpeg' : format.name, format.options)
        .toFile(outPath)
      results.push({
        file: outName,
        size: size.name,
        format: format.name,
        width: buf.width,
        height: buf.height,
        bytes: buf.size,
      })
    }
  }
  return { base, slot: slotName, variants: results }
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true })

  console.log(`📸 Processing photos from ${SRC_DIR}`)
  console.log(`📤 Output to ${OUT_DIR}\n`)

  for (const [slotName, filename] of Object.entries(HERO_MAP)) {
    const srcPath = join(SRC_DIR, filename)
    try {
      await stat(srcPath)
    } catch {
      console.error(`❌ Missing: ${filename}`)
      continue
    }

    console.log(`🔄 ${filename} → hero[${slotName}]`)
    const result = await processPhoto(srcPath, slotName)
    for (const v of result.variants) {
      const kb = (v.bytes / 1024).toFixed(0)
      console.log(`   ${v.file}  ${v.width}×${v.height}  ${kb} KB`)
    }
    console.log()
  }

  // Summary
  const all = await readdir(OUT_DIR)
  const heroFiles = all.filter((f) =>
    SIZES.some((s) => FORMATS.some((fm) => f.endsWith(`-${s.name}.${fm.name}`)))
  )
  console.log(`✅ Generated ${heroFiles.length} hero variants`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
