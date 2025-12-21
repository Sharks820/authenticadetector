const { test, expect } = require('@playwright/test');

function attachErrorHandlers(page) {
  const errors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  page.on('pageerror', err => {
    errors.push(`PAGE ERROR: ${err.message}`);
  });

  return errors;
}

test.describe('Visual Smoke', () => {
  test('renders core UI and VERA assets', async ({ page }, testInfo) => {
    const errors = attachErrorHandlers(page);

    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    await expect(page.locator('#dropzone')).toBeVisible();
    await expect(page.locator('#helpBot')).toBeVisible();
    await expect(page.locator('#helpBot img')).toHaveAttribute('src', /assets\/vera\/vera_fairy\.svg/);

    await page.screenshot({
      path: `test-results/visual-smoke-${testInfo.project.name}.png`,
      fullPage: true
    });

    const criticalErrors = errors.filter(e => !e.includes('favicon') && !e.includes('ServiceWorker'));
    expect(criticalErrors, `Console errors: ${criticalErrors.join('\n')}`).toHaveLength(0);
  });

  test('primary CTA click sweep', async ({ page }, testInfo) => {
    const errors = attachErrorHandlers(page);

    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    const targets = [
      { label: 'History', view: '#historyView' },
      { label: 'Ranks', view: '#leaderboardView' },
      { label: 'Shop', view: '#avatarView' },
      { label: 'VERA', view: '#helpView' }
    ];

    for (const target of targets) {
      const button = page.locator('.quick-nav-btn', { hasText: target.label });
      await expect(button).toBeVisible();
      await button.click();
      await expect(page.locator(target.view)).toBeVisible({ timeout: 10000 });

      const backButton = page.locator(`${target.view} .back-btn`).first();
      if (await backButton.isVisible().catch(() => false)) {
        await backButton.click();
      } else {
        await page.locator('#homeView').click({ position: { x: 10, y: 10 } });
      }
      await expect(page.locator('#homeView')).toBeVisible();
    }

    await page.screenshot({
      path: `test-results/cta-sweep-${testInfo.project.name}.png`,
      fullPage: true
    });

    const criticalErrors = errors.filter(e => !e.includes('favicon') && !e.includes('ServiceWorker'));
    expect(criticalErrors, `Console errors: ${criticalErrors.join('\n')}`).toHaveLength(0);
  });
});
