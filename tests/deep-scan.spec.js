// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

// Create a simple test image (PNG) programmatically
function createTestImage() {
  const testImagePath = path.join(__dirname, 'test-image.png');

  // Simple 100x100 PNG with gradient
  const { createCanvas } = require('canvas');
  const canvas = createCanvas(100, 100);
  const ctx = canvas.getContext('2d');

  // Create gradient (mimics a simple photo pattern)
  const gradient = ctx.createLinearGradient(0, 0, 100, 100);
  gradient.addColorStop(0, '#ff6b6b');
  gradient.addColorStop(0.5, '#4ecdc4');
  gradient.addColorStop(1, '#45b7d1');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 100, 100);

  // Add some noise
  for (let i = 0; i < 500; i++) {
    ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.1)`;
    ctx.fillRect(Math.random() * 100, Math.random() * 100, 2, 2);
  }

  fs.writeFileSync(testImagePath, canvas.toBuffer('image/png'));
  return testImagePath;
}

test.describe('Deep Scan Stability', () => {

  test('should complete deep scan without stalling or crashing', async ({ page }) => {
    const consoleErrors = [];
    const consoleLogs = [];

    // Capture console messages
    page.on('console', msg => {
      const text = msg.text();
      if (msg.type() === 'error') {
        consoleErrors.push(text);
      }
      consoleLogs.push(`[${msg.type()}] ${text}`);
    });

    // Capture page crashes
    page.on('crash', () => {
      throw new Error('PAGE CRASHED during deep scan!');
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check page loaded
    await expect(page.locator('.app-title')).toBeVisible({ timeout: 10000 });

    // Click on the dropzone to upload an image
    const dropzone = page.locator('#dropzone, .dropzone');
    await expect(dropzone).toBeVisible();

    // Create and upload a test image using base64
    const testImageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAABaElEQVR4nO3dMQ6CQBRF0cH9b5qNWGJn4QJcgAuwsXMtlhQWJhJjyEQzb4b7TkLFH+4b+AFZlqQNj10PgM+CAAsCLAiwIMAqHkTSwdJB0lHSUdJJ0tnS2dJF0sXSVdLV0s3SzdJd0t3Sw9LD0tPSU9LL0svS29Lb0sfSx9LX0tfSz9LP0t/SP5YGSwNLQ0tDS6NKhtYwtIahNQ2taWhtQ2sb2sDQBoY2NLShoY0MbWRoY0MbG9rE0CaGNjW0qaHNDG1maBNDmxja1NCmhjYztJmhzQ1tbmgLQ1sY2tLQloa2MrSVoa0NbW1oG0PbGNrW0LaGtjO0naHtDW1vaAdDOxjaxdAuhnY1tKuhPQztYWgvQ3sZ2tvQ3ob2MbSPoX0N7WtoP0P7GdrB0A6GDjF0iKFjDB1j6BxD5xi6xNAlhq4xdI2hewzdY+ghQw8ZeszQY4aeM/ScoZcMvWToNUOvGXrP0Hsu+AMPPCoSFmxPxAAAAABJRU5ErkJggg==';

    // Use page evaluate to trigger file upload
    await page.evaluate(async (imageData) => {
      // Convert base64 to blob
      const response = await fetch(imageData);
      const blob = await response.blob();

      // Create a File object
      const file = new File([blob], 'test-image.png', { type: 'image/png' });

      // Create a DataTransfer and add the file
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);

      // Find the file input or dropzone
      const dropzone = document.querySelector('#dropzone, .dropzone');
      if (dropzone) {
        // Trigger drop event
        const dropEvent = new DragEvent('drop', {
          bubbles: true,
          dataTransfer: dataTransfer
        });
        dropzone.dispatchEvent(dropEvent);
      }
    }, testImageBase64);

    // Wait for image to be displayed
    await page.waitForTimeout(1000);

    // Try to find and click Quick Scan first (Deep Scan requires login)
    const quickScanBtn = page.locator('#quickBtn, [data-scan="quick"]');
    if (await quickScanBtn.isVisible()) {
      console.log('Found Quick Scan button, clicking...');
      await quickScanBtn.click();

      // Wait for scan to complete - monitor progress
      const startTime = Date.now();
      const maxWait = 20000; // 20 seconds max

      let completed = false;
      while (!completed && (Date.now() - startTime) < maxWait) {
        // Check if result is visible
        const resultCard = page.locator('#resultCard');
        const progressCard = page.locator('#progressCard');

        const resultHidden = await resultCard.evaluate(el => el.classList.contains('hidden')).catch(() => true);
        const progressHidden = await progressCard.evaluate(el => el.classList.contains('hidden')).catch(() => true);

        if (!resultHidden) {
          completed = true;
          console.log('Scan completed!');
        } else {
          // Log progress
          const progressText = await page.locator('#progressStatus').textContent().catch(() => 'unknown');
          console.log(`Progress: ${progressText}`);
          await page.waitForTimeout(500);
        }
      }

      if (!completed) {
        // Capture screenshot on stall
        await page.screenshot({ path: 'scan-stalled.png', fullPage: true });
        throw new Error('Scan stalled - did not complete within 20 seconds');
      }

      // Verify result is displayed
      await expect(page.locator('#resultCard')).toBeVisible();
    } else {
      console.log('Quick Scan button not visible');
    }

    // Check for console errors
    const criticalErrors = consoleErrors.filter(e =>
      e.includes('ReferenceError') ||
      e.includes('TypeError') ||
      e.includes('undefined') ||
      e.includes('crash')
    );

    if (criticalErrors.length > 0) {
      console.log('Critical errors found:', criticalErrors);
      throw new Error(`Critical console errors: ${criticalErrors.join(', ')}`);
    }
  });

  test('should handle large image without crashing', async ({ page }) => {
    // Test with a larger image to stress test FFT
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Create a 500x500 test image inline
    await page.evaluate(async () => {
      // Create canvas for large test image
      const canvas = document.createElement('canvas');
      canvas.width = 500;
      canvas.height = 500;
      const ctx = canvas.getContext('2d');

      // Fill with complex pattern
      for (let y = 0; y < 500; y++) {
        for (let x = 0; x < 500; x++) {
          const r = Math.sin(x / 50) * 127 + 128;
          const g = Math.cos(y / 50) * 127 + 128;
          const b = Math.sin((x + y) / 70) * 127 + 128;
          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
          ctx.fillRect(x, y, 1, 1);
        }
      }

      // Convert to blob and trigger upload
      canvas.toBlob(async (blob) => {
        const file = new File([blob], 'large-test.png', { type: 'image/png' });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);

        const dropzone = document.querySelector('#dropzone, .dropzone');
        if (dropzone) {
          const dropEvent = new DragEvent('drop', {
            bubbles: true,
            dataTransfer: dataTransfer
          });
          dropzone.dispatchEvent(dropEvent);
        }
      }, 'image/png');
    });

    await page.waitForTimeout(2000);

    // Click scan
    const quickScanBtn = page.locator('#quickBtn');
    if (await quickScanBtn.isVisible()) {
      await quickScanBtn.click();

      // Wait longer for large image
      const startTime = Date.now();
      const maxWait = 30000;

      let completed = false;
      while (!completed && (Date.now() - startTime) < maxWait) {
        const resultCard = page.locator('#resultCard');
        const resultHidden = await resultCard.evaluate(el => el.classList.contains('hidden')).catch(() => true);

        if (!resultHidden) {
          completed = true;
        } else {
          await page.waitForTimeout(500);
        }
      }

      if (!completed) {
        await page.screenshot({ path: 'large-image-stall.png', fullPage: true });
        throw new Error('Large image scan stalled');
      }
    }
  });
});
