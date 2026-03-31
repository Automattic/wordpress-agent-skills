#!/usr/bin/env node

/**
 * Screenshot utility for WordPress site creator plugin.
 *
 * Dependencies are auto-installed on first run from package.json in this directory.
 *
 * Usage: node screenshot.mjs <url> <output-path> [viewport-width] [--dev-server=URL]
 *
 * Arguments:
 *   url            - URL to screenshot (http://... — never file:///)
 *   output-path    - Full path for the output PNG
 *   viewport-width - Optional viewport width in px (default: 1440, use 375 for mobile)
 *   --dev-server   - Optional dev server base URL. If provided and the target URL
 *                    is a WordPress proxy route containing design-asset=<path>,
 *                    the URL is transformed to hit the dev server directly
 *                    (e.g., --dev-server=http://localhost:8888).
 */

let puppeteer;
try {
  puppeteer = await import('puppeteer-core');
  puppeteer = puppeteer.default || puppeteer;
} catch (e) {
  console.error('puppeteer-core not found. Installing...');
  const { execSync } = await import('child_process');
  execSync('npm install', { cwd: new URL('.', import.meta.url).pathname, stdio: 'inherit' });
  puppeteer = await import('puppeteer-core');
  puppeteer = puppeteer.default || puppeteer;
}

import { resolve } from 'path';
import { mkdirSync } from 'fs';
import { dirname } from 'path';

const CHROME_PATH = process.env.CHROME_PATH
  || `${process.env.HOME}/.cache/puppeteer/chrome/mac-145.0.7632.77/chrome-mac-x64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`;

// Parse positional and named arguments
const positional = [];
let devServerBase = null;

for (const arg of process.argv.slice(2)) {
  if (arg.startsWith('--dev-server=')) {
    devServerBase = arg.slice('--dev-server='.length);
  } else {
    positional.push(arg);
  }
}

const [url, outputPath, viewportWidthArg] = positional;

if (!url || !outputPath) {
  console.error('Usage: node screenshot.mjs <url> <output-path> [viewport-width] [--dev-server=URL]');
  process.exit(1);
}

if (url.startsWith('file://')) {
  console.error('Error: file:// URLs are not supported — Google Fonts and external resources will not load. Serve the file via HTTP first.');
  process.exit(1);
}

/**
 * Detect whether a URL is a WordPress proxy route.
 * Proxy routes contain "design-asset=" or "design-gallery" in the query/path.
 */
function isWordPressProxyRoute(targetUrl) {
  return targetUrl.includes('design-asset=') || targetUrl.includes('design-gallery');
}

/**
 * If the URL is a proxy route with design-asset=<path> and a dev server was
 * provided, rewrite the URL to point at the dev server directly.
 * e.g. https://example.com/?design-asset=pages/home.html
 *   -> http://localhost:8888/pages/home.html
 */
function maybeRewriteForDevServer(targetUrl) {
  if (!devServerBase || !targetUrl.includes('design-asset=')) {
    return targetUrl;
  }
  try {
    const parsed = new URL(targetUrl);
    const assetPath = parsed.searchParams.get('design-asset');
    if (assetPath) {
      const base = devServerBase.replace(/\/+$/, '');
      const rewritten = `${base}/${assetPath.replace(/^\/+/, '')}`;
      console.log(`Dev-server rewrite: ${targetUrl} -> ${rewritten}`);
      return rewritten;
    }
  } catch (_) {
    // URL parsing failed — fall through to original
  }
  return targetUrl;
}

let effectiveUrl = maybeRewriteForDevServer(url);
const isProxy = isWordPressProxyRoute(url);

const viewportWidth = parseInt(viewportWidthArg, 10) || 1440;
const viewportHeight = 900;

const resolvedOutput = resolve(outputPath);
mkdirSync(dirname(resolvedOutput), { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME_PATH,
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: viewportWidth, height: viewportHeight });

  // WordPress proxy routes can be slow and stream HTML; use domcontentloaded
  // with a longer timeout. Regular URLs use networkidle2 for full resource load.
  if (isProxy) {
    console.log('Detected WordPress proxy route — using domcontentloaded strategy.');
    await page.goto(effectiveUrl, { waitUntil: 'domcontentloaded', timeout: 90000 });
  } else {
    await page.goto(effectiveUrl, { waitUntil: 'networkidle2', timeout: 90000 });
  }

  // Wait for Google Fonts to finish loading
  await page.evaluate(() => document.fonts.ready);

  // Scroll through the entire page to trigger IntersectionObserver-based
  // scroll-reveal animations, then scroll back to top
  await page.evaluate(async () => {
    const scrollStep = Math.max(300, window.innerHeight * 0.6);
    const maxScroll = document.body.scrollHeight;
    for (let y = 0; y < maxScroll; y += scrollStep) {
      window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, 100));
    }
    // Hit the very bottom
    window.scrollTo(0, maxScroll);
    await new Promise(r => setTimeout(r, 200));
    // Back to top
    window.scrollTo(0, 0);
    await new Promise(r => setTimeout(r, 200));
  });

  // Wait for all animations to finish (reveal duration + stagger delays)
  await new Promise(r => setTimeout(r, 1500));

  await page.screenshot({ path: resolvedOutput, fullPage: true });

  console.log(`Screenshot saved: ${resolvedOutput} (${viewportWidth}px wide)`);
} finally {
  await browser.close();
}
