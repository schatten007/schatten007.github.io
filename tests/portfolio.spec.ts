import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { FieldbookPage } from './fieldbook.page';

test('the fieldbook leads to real case studies without browser errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  const book = new FieldbookPage(page);
  await book.goto();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Curiosity,');
  await expect(page.getByRole('article')).toHaveCount(3);
  await page.getByRole('heading', { name: 'CV Tailor', exact: true }).getByRole('link').click();
  await expect(page).toHaveURL(/\/work\/cv-tailor\/$/);
  await expect(page.getByRole('heading', { name: 'What I built', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Inspect the source' })).toHaveAttribute('href', 'https://github.com/schatten007/cv-tailor');
  expect(errors).toEqual([]);
});

test('project filters update visible cards and announce the result', async ({ page }) => {
  const book = new FieldbookPage(page);
  await book.goto('/work/');
  await page.getByRole('button', { name: 'Developer tools', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Developer tools', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(book.workCards.filter({ visible: true })).toHaveCount(1);
  await expect(page.getByRole('heading', { name: 'SchemaSentinel' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'CV Tailor', exact: true })).toBeHidden();
  await expect(page.getByRole('status').filter({ hasText: '1 project in Developer tools' })).toBeVisible();
  await page.getByRole('button', { name: /^All/ }).click();
  await expect(book.workCards.filter({ visible: true })).toHaveCount(3);
});

test('search supports empty results, keyboard navigation, and focus restoration', async ({ page }) => {
  const book = new FieldbookPage(page);
  await book.goto();
  await book.search('there-is-no-such-project');
  await expect(book.searchDialog.getByText('No trail here yet.', { exact: false })).toBeVisible();
  await book.searchInput.fill('schema');
  await expect(book.searchDialog.getByRole('link', { name: /SchemaSentinel/ })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(book.searchDialog).not.toBeVisible();
  await expect(book.searchButton).toBeFocused();
  await page.keyboard.press('Control+k');
  await book.searchInput.fill('CV Tailor');
  await page.keyboard.press('ArrowDown');
  await expect(book.searchDialog.getByRole('link', { name: /CV Tailor/ })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/work\/cv-tailor\/$/);
});

test('lab distinguishes a dangling reference, a repaired fixture, and an unsupported reference', async ({ page }) => {
  const book = new FieldbookPage(page);
  await book.goto('/lab/');
  await book.inspectFixture();
  await expect(book.labResult).toContainText('EXIT 1 / SS-REF-001');
  await expect(book.labResult).toContainText('restore the $defs block');
  await book.selectFixture('Restore the definition');
  await expect(book.labResult).toContainText('READY TO INSPECT');
  await expect(page.locator('[data-fixture-code]')).toContainText('"$defs"');
  await book.inspectFixture();
  await expect(book.labResult).toContainText('EXIT 0 / NO FINDINGS IN THIS EXAMPLE');
  await book.selectFixture('Cross the boundary');
  await book.inspectFixture();
  await expect(book.labResult).toContainText('EXIT 2 / UNSUPPORTED REFERENCE');
  await expect(book.labResult).toContainText('No trustworthy verdict.');
});

test('motion respects reduced-motion and the pause control persists', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const play = page.getByRole('button', { name: 'Play sculpture animation' });
  await expect(play).toHaveAttribute('aria-pressed', 'true');
  await play.click();
  const pause = page.getByRole('button', { name: 'Pause sculpture animation' });
  await expect(pause).toHaveAttribute('aria-pressed', 'false');
  await pause.click();
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.reload();
  await expect(page.getByRole('button', { name: 'Play sculpture animation' })).toHaveAttribute('aria-pressed', 'true');
});

test('core pages fit the viewport and have no serious accessibility violations', async ({ page }) => {
  test.setTimeout(90_000);
  for (const route of ['/', '/work/', '/work/schema-sentinel/', '/lab/', '/notes/', '/about/', '/cv/']) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(200);
    await page.evaluate(() => document.fonts.ready);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflow, `${route} must not overflow horizontally`).toBe(false);
    const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    const violations = audit.violations
      .filter(item => ['critical', 'serious'].includes(item.impact ?? ''))
      .map(item => ({ rule: item.id, nodes: item.nodes.map(node => ({ target: node.target, summary: node.failureSummary })) }));
    expect(violations, route).toEqual([]);
  }
});

test('navigation works on both desktop and mobile', async ({ page, isMobile }) => {
  await page.goto('/');
  if (isMobile) {
    const toggle = page.getByRole('button', { name: 'Open navigation' });
    await toggle.click();
    await expect(page.getByRole('button', { name: 'Close navigation' })).toHaveAttribute('aria-expanded', 'true');
    await page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: 'Notes', exact: true }).click();
  } else {
    await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Notes', exact: true }).click();
  }
  await expect(page).toHaveURL(/\/notes\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Follow the');
});

test('case studies and navigation remain readable without JavaScript', async ({ browser, baseURL, isMobile }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: isMobile ? { width: 390, height: 844 } : { width: 1440, height: 1000 } });
  const page = await context.newPage();
  await page.goto(`${baseURL}/work/schema-sentinel/`);
  await expect(page.getByRole('heading', { name: 'Why the exit codes matter' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Inspect the source' })).toBeVisible();
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'About', exact: true }).click();
  await expect(page).toHaveURL(/\/about\/$/);
  await context.close();
});

test('the CV print view is clean and the downloadable PDF is available', async ({ page, request }) => {
  await page.goto('/cv/');
  await expect(page.getByRole('link', { name: 'Download PDF' })).toHaveAttribute('download', 'HA-CV.pdf');
  await page.emulateMedia({ media: 'print' });
  await expect(page.getByRole('heading', { level: 1, name: 'H. A.' })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeHidden();
  const pdf = await request.get('/cv.pdf');
  expect(pdf.status()).toBe(200);
  expect(pdf.headers()['content-type']).toContain('application/pdf');
});

test('social metadata, sitemap, recovery page, and local reading links resolve', async ({ page, request }) => {
  const checked = new Set<string>();
  for (const route of ['/', '/work/', '/notes/']) {
    await page.goto(route);
    const links = await page.getByRole('link').evaluateAll(elements => elements.map(element => element.getAttribute('href')).filter((href): href is string => !!href && href.startsWith('/') && !href.startsWith('//')));
    for (const href of links) {
      const path = href.split('#')[0] || '/';
      if (checked.has(path)) continue;
      checked.add(path);
      expect((await request.get(path)).status(), `${path} must resolve`).toBe(200);
    }
  }
  expect((await request.get('/social-card.png')).status()).toBe(200);
  expect((await request.get('/sitemap-index.xml')).status()).toBe(200);
  await page.goto('/404.html');
  await expect(page.getByRole('heading', { name: 'A trail not taken.' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Back to the fieldbook' })).toHaveAttribute('href', '/');
});
