#!/usr/bin/env node
/**
 * Render Chrome Web Store promo + screenshot assets.
 *
 *   pnpm store-assets
 *
 * Output: chrome-store/*.png (gitignored)
 *
 * Specs:
 *   - 1280x800 screenshot — sans alpha
 *   - 440x280 small promo — sans alpha
 *   - 1400x560 top promo  — sans alpha
 *
 * The store icon already exists at extension/icons/icon-128.png and
 * is copied as-is — alpha is allowed on the store icon.
 */
import { execFileSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import puppeteer from 'puppeteer-core'

const here = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(here, '..', '..')
const OUT_DIR = path.join(repoRoot, 'chrome-store')

const TARGETS = [
  { name: 'screenshot', width: 1280, height: 800, template: 'screenshot.html' },
  { name: 'promo-small', width: 440, height: 280, template: 'promo-small.html' },
  { name: 'promo-top', width: 1400, height: 560, template: 'promo-top.html' }
]

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
  throw new Error('Chrome introuvable. Définis CHROME_PATH ou installe google-chrome / chromium.')
}

function ensureDir(dir) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
}

async function renderTarget(browser, target) {
  const tmpPath = path.join(OUT_DIR, `${target.name}-tmp.png`)
  const finalPath = path.join(OUT_DIR, `${target.name}.png`)
  const templatePath = path.join(here, target.template)

  console.log(`[store] ${target.name} (${target.width}x${target.height}) ← ${target.template}`)

  const page = await browser.newPage()
  await page.setViewport({
    width: target.width,
    height: target.height,
    deviceScaleFactor: 2
  })
  await page.goto(pathToFileURL(templatePath).href, { waitUntil: 'networkidle0' })
  await page.evaluateHandle('document.fonts.ready')
  await page.screenshot({
    path: tmpPath,
    type: 'png',
    clip: { x: 0, y: 0, width: target.width, height: target.height }
  })
  await page.close()

  // Downscale 2x → 1x and FLATTEN alpha (Chrome Web Store requires PNG-24 sans alpha
  // for screenshot and promo assets).
  execFileSync('magick', [
    tmpPath,
    '-resize', `${target.width}x${target.height}`,
    '-background', 'white',
    '-alpha', 'remove',
    '-alpha', 'off',
    '-strip',
    '-quality', '92',
    finalPath
  ], { stdio: 'inherit' })

  execFileSync('rm', ['-f', tmpPath])
}

async function main() {
  ensureDir(OUT_DIR)

  // Store icon — keep alpha, just copy
  const iconSrc = path.join(repoRoot, 'extension', 'icons', 'icon-128.png')
  const iconDst = path.join(OUT_DIR, 'store-icon-128.png')
  copyFileSync(iconSrc, iconDst)
  console.log(`[store] store-icon-128.png ← extension/icons/icon-128.png (copied)`)

  const executablePath = findChrome()
  console.log(`[store] using ${executablePath}`)

  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  try {
    for (const target of TARGETS) {
      await renderTarget(browser, target)
    }
  } finally {
    await browser.close()
  }

  console.log(`\n[store] done — files in ${path.relative(repoRoot, OUT_DIR)}/`)
  console.log('[store] required: store-icon-128.png + screenshot.png')
  console.log('[store] optional: promo-small.png + promo-top.png')
}

main().catch((err) => {
  console.error('[store] failed:', err)
  process.exit(1)
})
