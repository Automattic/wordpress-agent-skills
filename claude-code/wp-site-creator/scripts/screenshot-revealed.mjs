#!/usr/bin/env node
/**
 * Screenshot wrapper that forces all .reveal elements visible after scrolling.
 * Usage: node screenshot-revealed.mjs <url> <output-path> [viewport-width]
 */

let puppeteer;
try {
  puppeteer = await import('puppeteer-core');
  puppeteer = puppeteer.default || puppeteer;
} catch (e) {
  const { execSync } = await import('child_process');
  const scriptDir = '/Users/josephpascucci/.claude/plugins/cache/wordpress-agent-skills/create-wp-site/0.0.1B/scripts';
  execSync('npm install', { cwd: scriptDir, stdio: 'inherit' });
  puppeteer = await import('puppeteer-core');
  puppeteer = puppeteer.default || puppeteer;
}

import { resolve, dirname } from 'path';
import { mkdirSync } from 'fs';

const CHROME_PATH = process.env.CHROME_PATH
  || `${process.env.HOME}/.cache/puppeteer/chrome/mac-145.0.7632.77/chrome-mac-x64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`;

const [url, outputPath, viewportWidthArg] = process.argv.slice(2);
if (!url || !outputPath) {
  console.error('Usage: node screenshot-revealed.mjs <url> <output-path> [viewport-width]');
  process.exit(1);
}

const viewportWidth = parseInt(viewportWidthArg, 10) || 1440;
const resolvedOutput = resolve(outputPath);
mkdirSync(dirname(resolvedOutput), { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME_PATH,
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: viewportWidth, height: 900 });
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 });
  await page.evaluate(() => document.fonts.ready);

  // Scroll through the page slowly to trigger IntersectionObservers
  await page.evaluate(async () => {
    const scrollStep = Math.max(200, window.innerHeight * 0.4);
    const maxScroll = document.body.scrollHeight;
    for (let y = 0; y < maxScroll; y += scrollStep) {
      window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, 150));
    }
    window.scrollTo(0, maxScroll);
    await new Promise(r => setTimeout(r, 500));
  });

  // Force all .reveal elements to be visible as a safety net
  await page.evaluate(() => {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    document.querySelectorAll('.animate-on-scroll').forEach(el => el.classList.add('is-visible'));
  });

  // Wait for transitions to complete
  await new Promise(r => setTimeout(r, 2000));

  // Scroll back to top
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 300));

  await page.screenshot({ path: resolvedOutput, fullPage: true });
  console.log(`Screenshot saved: ${resolvedOutput} (${viewportWidth}px wide)`);
} finally {
  await browser.close();
}
