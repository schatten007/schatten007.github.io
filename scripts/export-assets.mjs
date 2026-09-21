// Run against a local `npm run dev` server after updating the CV or social artwork.
import { chromium } from '@playwright/test';
import { fileURLToPath } from 'node:url';

const base = process.env.PREVIEW_URL || 'http://127.0.0.1:4321';
const publicFile = name => fileURLToPath(new URL(`../public/${name}`, import.meta.url));
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  const artwork = await page.goto(`${base}/social-card.svg`);
  if (!artwork?.ok()) throw new Error('The social-card SVG did not load. Is the local server running?');
  await page.screenshot({ path: publicFile('social-card.png') });
  const cv = await page.goto(`${base}/cv/`);
  if (!cv?.ok()) throw new Error('The CV page did not load.');
  await page.evaluate(() => document.fonts.ready);
  await page.emulateMedia({ media: 'print' });
  await page.pdf({ path: publicFile('cv.pdf'), format: 'A4', preferCSSPageSize: true, printBackground: true, tagged: true });
  console.log('Exported public/social-card.png and public/cv.pdf from the local site.');
} finally {
  await browser.close();
}
