import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { FieldbookPage } from './fieldbook.page';

test('the fieldbook leads to real case studies without browser errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  const book = new FieldbookPage(page);
  await book.goto();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('ONE MORE');
  expect(await page.getByRole('article').count()).toBeGreaterThan(0);
  await page.getByRole('heading', { name: 'CV Tailor', exact: true }).getByRole('link').click();
  await expect(page).toHaveURL(/\/work\/cv-tailor\/$/);
  await expect(page.getByRole('heading', { name: 'What I built', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Read the code' })).toHaveAttribute('href', 'https://github.com/schatten007/cv-tailor');
  expect(errors).toEqual([]);
});

test('project filters update visible cards and announce the result', async ({ page }) => {
  const book = new FieldbookPage(page);
  await book.goto('/work/');
  const allCount = await book.workCards.count();
  await page.getByRole('button', { name: 'Developer tools', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Developer tools', exact: true })).toHaveAttribute('aria-pressed', 'true');
  const visibleCategories = await book.workCards.filter({ visible: true }).evaluateAll(cards => cards.map(card => card.getAttribute('data-category')));
  expect(visibleCategories.length).toBeGreaterThan(0);
  expect(visibleCategories.every(category => category === 'Developer tools')).toBe(true);
  await expect(page.getByRole('heading', { name: 'SchemaSentinel' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'CV Tailor', exact: true })).toBeHidden();
  await expect(page.getByRole('status').filter({ hasText: /projects? in Developer tools/ })).toBeVisible();
  await page.getByRole('button', { name: /^All/ }).click();
  await expect(book.workCards.filter({ visible: true })).toHaveCount(allCount);
});

test('search supports empty results, keyboard navigation, and focus restoration', async ({ page }) => {
  const book = new FieldbookPage(page);
  await book.goto();
  await book.search('there-is-no-such-project');
  await expect(book.searchDialog.getByText('Nothing found.', { exact: false })).toBeVisible();
  await book.searchInput.fill('schema');
  await expect(book.searchDialog.getByRole('link', { name: /^Project SchemaSentinel/ })).toBeVisible();
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
  await book.selectFixture('External reference');
  await book.inspectFixture();
  await expect(book.labResult).toContainText('EXIT 2 / UNSUPPORTED REFERENCE');
  await expect(book.labResult).toContainText('No trustworthy verdict.');
});

test('motion respects reduced-motion and the pause control persists', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const play = page.getByRole('button', { name: 'Play animations' });
  await expect(play).toHaveAttribute('aria-pressed', 'true');
  await play.click();
  const pause = page.getByRole('button', { name: 'Pause animations' });
  await expect(pause).toHaveAttribute('aria-pressed', 'false');
  await pause.click();
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.reload();
  await expect(page.getByRole('button', { name: 'Play animations' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'paused');
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
    expect.soft(violations, route).toEqual([]);
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
  await expect(page.getByRole('heading', { level: 1 })).toContainText('NOTES FROM');
});

test('case studies and navigation remain readable without JavaScript', async ({ browser, baseURL, isMobile }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: isMobile ? { width: 390, height: 844 } : { width: 1440, height: 1000 } });
  const page = await context.newPage();
  await page.goto(`${baseURL}/work/schema-sentinel/`);
  await expect(page.getByRole('heading', { name: 'Why the exit codes matter' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Read the code' })).toBeVisible();
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
  await expect(page.getByRole('heading', { name: 'That page isn’t here.' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Back home' })).toHaveAttribute('href', '/');
});

test('character loadouts reveal the owner’s real interests', async ({ page }) => {
  await page.goto('/');
  const controls = page.getByRole('group', { name: 'Choose a loadout' });
  await controls.getByRole('button', { name: 'Hardware', exact: true }).click();
  await expect(controls.getByRole('button', { name: 'Hardware', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('status').filter({ hasText: 'SIDE QUEST / HARDWARE TUNING' })).toContainText('overclocking');
  const offDuty = controls.getByRole('button', { name: 'Off-duty', exact: true });
  await offDuty.focus();
  await page.keyboard.press('Space');
  await expect(offDuty).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('status').filter({ hasText: 'OFF-DUTY / GAMES + ANIME' })).toContainText('Doom');
  await controls.getByRole('button', { name: 'AI & code', exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: 'EQUIPPED / PYTHON + TYPESCRIPT' })).toBeVisible();
});

test('power bench applies the cooling cap and resets to its documented baseline', async ({ page }) => {
  await page.goto('/lab/#power-bench');
  const slider = page.getByRole('slider', { name: 'Requested power' });
  await expect(slider).toHaveValue('45');
  await expect(page.locator('[data-throughput]')).toHaveText('100pt');
  await slider.focus();
  await slider.press('End');
  await expect(slider).toHaveValue('80');
  await expect(page.locator('[data-sustained]')).toHaveText('55W');
  await expect(page.locator('[data-throughput]')).toHaveText('107pt');
  await expect(page.getByRole('status').filter({ hasText: '80 W requested' })).toContainText('Cooling-limited');
  await page.getByRole('button', { name: /^Quiet/ }).click();
  await expect(page.locator('[data-sustained]')).toHaveText('35W');
  await expect(page.locator('[data-throughput]')).toHaveText('92pt');
  await slider.focus();
  await slider.press('Home');
  await expect(page.locator('[data-sustained]')).toHaveText('15W');
  await expect(page.locator('[data-throughput]')).toHaveText('69pt');
  await page.getByRole('button', { name: 'Reset to 45 W / balanced' }).click();
  await expect(slider).toHaveValue('45');
  await expect(page.getByRole('button', { name: /^Balanced/ })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-throughput]')).toHaveText('100pt');
  await expect(page.locator('[data-sustained]')).toHaveText('45W');
});

test('reading text stays large and narrow screens keep the layout intact', async ({ page, isMobile }) => {
  if (isMobile) await page.setViewportSize({ width: 360, height: 800 });
  for (const route of ['/', '/lab/', '/work/cv-tailor/', '/about/']) {
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), route).toBe(true);
    const smallText = await page.locator('.hero-description, .project-card-content > p, .experiment-description, .about-intro-text, .prose > p').evaluateAll(elements => elements.filter(element => parseFloat(getComputedStyle(element).fontSize) < 17).map(element => element.textContent));
    expect(smallText, `${route} has reading text under 17px`).toEqual([]);
    const smallControls = await page.locator('.loadout-controls button, .cooling-options button, .filter-list button, input[type="range"]').evaluateAll(elements => elements.filter(element => parseFloat(getComputedStyle(element).fontSize) < 16 || element.getBoundingClientRect().height < 44).map(element => element.textContent || element.getAttribute('id')));
    expect(smallControls, `${route} has undersized controls`).toEqual([]);
  }
});
