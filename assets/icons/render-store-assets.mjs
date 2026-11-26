#!/usr/bin/env node
/**
 * SIGIL OS Store Asset Generator (Node/sharp edition)
 *
 * Renders the Sigil Eye mark into every PNG size required by the app
 * stores and desktop bundlers. Use this instead of generate-store-assets.py
 * on machines without native Cairo.
 *
 * Setup (one time, inside this folder):
 *   npm install sharp
 *
 * Run:
 *   node render-store-assets.mjs
 */
import sharp from 'sharp'
import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'

const DIR = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(DIR, '..', '..')
const MASTER_SVG = path.join(DIR, 'sigil-mark.svg')
const FG_SVG = path.join(DIR, 'sigil-mark-foreground.svg')
const MOBILE_ASSETS = path.join(ROOT, 'sigil-mobile', 'assets')
const WEB_APP = path.join(ROOT, 'web-console', 'src', 'app')

const render = (svg, size) =>
  sharp(svg, { density: 384 }).resize(size, size).png().toBuffer()

const save = async (buf, file) => {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, buf)
  console.log(`  ok  ${path.relative(ROOT, file)}`)
}

const main = async () => {
  console.log('='.repeat(56))
  console.log('SIGIL OS — Store Asset Generator')
  console.log('='.repeat(56))

  // 1) Mobile app icon — full bleed, alpha stripped (store requirement)
  const icon = await render(MASTER_SVG, 1024)
  await save(await sharp(icon).removeAlpha().png().toBuffer(), path.join(MOBILE_ASSETS, 'icon.png'))

  // 2) Android adaptive icon foreground — transparent, mark in safe zone
  const adaptive = await render(FG_SVG, 1024)
  await save(adaptive, path.join(MOBILE_ASSETS, 'adaptive-icon.png'))

  // 3) Splash — transparent 1242x2436, mark centered ~1/3 height
  const mark = await sharp(FG_SVG, { density: 384 }).resize({ height: 850 }).png().toBuffer()
  const meta = await sharp(mark).metadata()
  const splash = await sharp({
    create: { width: 1242, height: 2436, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: mark, left: Math.round((1242 - meta.width) / 2), top: Math.round((2436 - meta.height) / 2) }])
    .png()
    .toBuffer()
  await save(splash, path.join(MOBILE_ASSETS, 'splash.png'))

  // 4) Mobile favicon
  await save(await render(MASTER_SVG, 48), path.join(MOBILE_ASSETS, 'favicon.png'))

  // 5) Web console favicons (Next.js app-router convention)
  await save(await render(MASTER_SVG, 512), path.join(WEB_APP, 'icon.png'))
  await save(await render(MASTER_SVG, 180), path.join(WEB_APP, 'apple-icon.png'))

  // 6) Master raster for `tauri icon` and other tooling
  await save(await sharp(icon).removeAlpha().png().toBuffer(), path.join(DIR, 'sigil-icon-1024.png'))

  console.log('\nDone.')
}

main().catch((e) => { console.error(e); process.exit(1) })
