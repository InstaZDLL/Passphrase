#!/usr/bin/env node
/**
 * Render scripts/og/template.html to public/og-image.png at 1200x630
 * using the system Chrome via puppeteer-core. Re-run whenever the
 * landing brand or copy changes.
 *
 *   pnpm og
 */
import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import puppeteer from 'puppeteer-core'

const here = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(here, '..', '..')
const TEMPLATE = path.join(here, 'template.html')
const OUT = path.join(repoRoot, 'public', 'og-image.png')

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
].filter(Boolean)

function findChrome() {
  for (const candidate of CHROME_CANDIDATES) {
    if (existsSync(candidate)) return candidate
  }
  throw new Error(
    'Chrome introuvable. Définis CHROME_PATH ou installe google-chrome / chromium.'
  )
}

async function main() {
  const executablePath = findChrome()
  console.log(`[og] using ${executablePath}`)
  console.log(`[og] rendering ${path.relative(repoRoot, TEMPLATE)} → ${path.relative(repoRoot, OUT)}`)

  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  try {
    const page = await browser.newPage()
    await page.setViewport({
      width: 1200,
      height: 630,
      deviceScaleFactor: 2
    })

    await page.goto(pathToFileURL(TEMPLATE).href, { waitUntil: 'networkidle0' })
    await page.evaluateHandle('document.fonts.ready')

    await page.screenshot({
      path: OUT,
      type: 'png',
      clip: { x: 0, y: 0, width: 1200, height: 630 },
      omitBackground: false
    })

    console.log(`[og] done — ${OUT}`)
  } finally {
    await browser.close()
  }

  // Downscale 2x → 1x (puppeteer captures at deviceScaleFactor=2 for crisp
  // rendering of the gaussian blur, then we resize down to the OG spec
  // 1200x630 and strip metadata to keep the PNG small).
  try {
    execFileSync('magick', [OUT, '-resize', '1200x630', '-strip', '-quality', '90', OUT], {
      stdio: 'inherit'
    })
    console.log(`[og] resized to 1200x630`)
  } catch {
    console.warn('[og] magick not available — skipping resize. Install ImageMagick to optimize the PNG.')
  }
}

main().catch((err) => {
  console.error('[og] failed:', err)
  process.exit(1)
})
