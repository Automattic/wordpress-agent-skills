#!/usr/bin/env node

/**
 * Screenshot utility for WordPress site creator plugin.
 *
 * Prerequisite: puppeteer-core must be installed.
 *   npm install -g puppeteer-core   (global)
 *   — or —
 *   npm install puppeteer-core      (local, run from this directory)
 *
 * Usage: node screenshot.mjs <url> <output-path> [viewport-width]
 *
 * Arguments:
 *   url            - URL to screenshot (http://... — never file:///)
 *   output-path    - Full path for the output PNG
 *   viewport-width - Optional viewport width in px (default: 1440, use 375 for mobile)
 */

import puppeteer from 'puppeteer-core';
import { resolve } from 'path';
import { mkdirSync } from 'fs';
import { dirname } from 'path';

const CHROME_PATH = process.env.CHROME_PATH
  || `${process.env.HOME}/.cache/puppeteer/chrome/mac-145.0.7632.77/chrome-mac-x64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`;

const [,, url, outputPath, viewportWidthArg] = process.argv;

if (!url || !outputPath) {
  console.error('Usage: node screenshot.mjs <url> <output-path> [viewport-width]');
  process.exit(1);
}

if (url.startsWith('file://')) {
  console.error('Error: file:// URLs are not supported — Google Fonts and external resources will not load. Serve the file via HTTP first.');
  process.exit(1);
}

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

  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

  // Wait for Google Fonts to finish loading
  await page.evaluate(() => document.fonts.ready);

  // Brief pause for CSS animations to reach initial state
  await new Promise(r => setTimeout(r, 500));

  await page.screenshot({ path: resolvedOutput, fullPage: true });

  console.log(`Screenshot saved: ${resolvedOutput} (${viewportWidth}px wide)`);
} finally {
  await browser.close();
}
