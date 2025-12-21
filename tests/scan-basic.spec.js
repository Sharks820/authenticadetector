// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Scan Basic Tests', () => {

  test('should load page and detect UI elements', async ({ page }) => {
    const consoleMessages = [];
    const errors = [];

    page.on('console', msg => {
      consoleMessages.push(`[${msg.type()}] ${msg.text()}`);
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    page.on('pageerror', err => {
      errors.push(`PAGE ERROR: ${err.message}`);
    });

    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Check main UI elements exist
    const dropzone = page.locator('#dropzone');
    await expect(dropzone).toBeVisible({ timeout: 10000 });

    const quickBtn = page.locator('#quickBtn');
    const deepBtn = page.locator('#deepBtn');

    // Log what we found
    console.log('Dropzone visible:', await dropzone.isVisible());
    console.log('Quick button visible:', await quickBtn.isVisible());
    console.log('Deep button visible:', await deepBtn.isVisible());

    // Check for critical errors on load
    const criticalErrors = errors.filter(e =>
      !e.includes('favicon') &&
      !e.includes('ServiceWorker')
    );

    if (criticalErrors.length > 0) {
      console.log('Errors on page load:', criticalErrors);
    }

    // Take screenshot
    await page.screenshot({ path: 'test-results/page-loaded.png', fullPage: true });
  });

  test('should upload image and run quick scan', async ({ page }) => {
    const consoleMessages = [];
    const errors = [];

    page.on('console', msg => {
      const text = msg.text();
      consoleMessages.push(`[${msg.type()}] ${text}`);
      if (msg.type() === 'error') {
        errors.push(text);
      }
      // Log scan-related messages
      if (text.includes('[Scan]') || text.includes('[DeepScan]') || text.includes('[Ensemble]')) {
        console.log(text);
      }
    });

    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    // Upload a small test image using base64
    const testImageData = 'iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAABKElEQVRoge3YsQ3CMBBA0TvG4EgMwBCswAhswQgMwQgMwRJMwBJQGQkJCYlAkX3n/pT+Cv/YhyRJkv6DA+wK5X+LqB5whstD+e8RVQPeYHoov0dE1YAneB7K7xNRNeCB+aH8fhFVAy5gfCi/T0TVgBNcPZT/WkTVgAMuD+UfF1E14A7ODuW/JqJqwAWu+5R/R0TVgAucD+WfF1E1YA+3o/zXRVQN2MLNKP+6iKoBa7j/lH96RNWA+08P5V8TUTVgA4+f8q+NqBqwhPtP+UdGVA2YwbOl/FMjqgaMYO9T/rERVQNG8Owp/1hE1YAB/H3K3z+iasAE/j3l7x9RNaAP/5fyD42oGtCDl0/5B0VUDQjwOso/KKJqQIBXD+UHRVQN0ECSJEk2fgGCNsIz8YsqRAAAAABJRU5ErkJggg==';

    // Inject test image
    const uploaded = await page.evaluate(async (base64Data) => {
      try {
        // Convert base64 to blob
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/png' });

        // Create File
        const file = new File([blob], 'test.png', { type: 'image/png' });

        // Find dropzone and trigger file handling
        const dropzone = document.querySelector('#dropzone');
        if (!dropzone) return { success: false, error: 'No dropzone found' };

        // Create DataTransfer
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);

        // Dispatch drop event
        const dropEvent = new DragEvent('drop', {
          bubbles: true,
          cancelable: true,
          dataTransfer: dataTransfer
        });
        dropzone.dispatchEvent(dropEvent);

        return { success: true };
      } catch (e) {
        return { success: false, error: e.message };
      }
    }, testImageData);

    console.log('Upload result:', uploaded);

    // Wait for image preview
    await page.waitForTimeout(2000);

    // Check if scan buttons are now enabled/visible
    const quickBtn = page.locator('#quickBtn');
    const isQuickVisible = await quickBtn.isVisible();
    console.log('Quick scan button visible:', isQuickVisible);

    if (isQuickVisible) {
      // Take screenshot before scan
      await page.screenshot({ path: 'test-results/before-scan.png', fullPage: true });

      // Click quick scan
      await quickBtn.click();
      console.log('Clicked Quick Scan');

      // Monitor progress with timeout
      const startTime = Date.now();
      const maxWait = 25000;
      let scanCompleted = false;

      while (!scanCompleted && (Date.now() - startTime) < maxWait) {
        // Check result card visibility
        const resultHidden = await page.locator('#resultCard').evaluate(el =>
          el.classList.contains('hidden')
        ).catch(() => true);

        if (!resultHidden) {
          scanCompleted = true;
          console.log(`Scan completed in ${Date.now() - startTime}ms`);
        } else {
          // Get progress status
          const status = await page.locator('#progressStatus').textContent().catch(() => '?');
          const progressWidth = await page.locator('#progressBar').evaluate(el =>
            el.style.width
          ).catch(() => '?');
          console.log(`Progress: ${status} (${progressWidth})`);
          await page.waitForTimeout(500);
        }
      }

      // Take screenshot after scan attempt
      await page.screenshot({ path: 'test-results/after-scan.png', fullPage: true });

      if (!scanCompleted) {
        // Log final console messages for debugging
        console.log('=== Console Messages ===');
        consoleMessages.slice(-30).forEach(m => console.log(m));
        console.log('=== Errors ===');
        errors.forEach(e => console.log(e));

        throw new Error(`Scan did not complete within ${maxWait}ms - STALLED`);
      }

      // Verify result is shown
      const verdict = await page.locator('#verdictLabel').textContent().catch(() => 'not found');
      console.log('Verdict:', verdict);

      expect(scanCompleted).toBe(true);
    }
  });
});
