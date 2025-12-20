# TESTING.md - AuthenticaDetector Testing Guide

## Current State

**No automated tests exist yet.** This is a known issue that should be addressed before major refactoring.

---

## Manual Testing Checklist

Use this checklist after any code changes:

### Core Functionality

- [ ] **File Upload**
  - [ ] Drag and drop works
  - [ ] Click to select works
  - [ ] Image preview displays
  - [ ] Invalid file types rejected
  - [ ] Files > 50MB rejected

- [ ] **Quick Scan**
  - [ ] Progress bar animates
  - [ ] Results display correctly
  - [ ] Score between 0-100
  - [ ] Confidence shown
  - [ ] Explainers display

- [ ] **Deep Scan** (requires login)
  - [ ] Models load (first time ~10 seconds)
  - [ ] All modules fire
  - [ ] Generator detection works
  - [ ] Results more detailed than Quick

- [ ] **Results**
  - [ ] Correct label (Likely AI, Probably Real, etc.)
  - [ ] Explainers toggle works
  - [ ] All modules toggle works
  - [ ] Share button works
  - [ ] New Scan button works

### Authentication

- [ ] **Login**
  - [ ] Email validation
  - [ ] Password validation
  - [ ] Error messages display
  - [ ] Successful login updates UI

- [ ] **Signup**
  - [ ] Name field required
  - [ ] Email validation
  - [ ] Password min length
  - [ ] Confirmation email sent

- [ ] **Logout**
  - [ ] Session cleared
  - [ ] UI updates to guest state
  - [ ] Deep Scan disabled

- [ ] **Password Reset**
  - [ ] Reset email sent
  - [ ] Success message shown

### Navigation

- [ ] **Views**
  - [ ] Home view loads
  - [ ] History opens and displays
  - [ ] Leaderboard loads and displays
  - [ ] Profile shows user data
  - [ ] Badges view opens
  - [ ] Help view opens
  - [ ] Shop view opens
  - [ ] Quests view opens

- [ ] **Back Navigation**
  - [ ] Back button returns to home
  - [ ] Browser back works correctly
  - [ ] No view stuck states

### PWA Features

- [ ] **Install**
  - [ ] Install banner shows (if not installed)
  - [ ] Install prompt works
  - [ ] iOS helper shows on Safari

- [ ] **Share Target**
  - [ ] Receiving shared image works
  - [ ] Auto-analyze triggers

- [ ] **Offline**
  - [ ] Cached pages load
  - [ ] Graceful degradation

### Game Features

- [ ] **Shop**
  - [ ] Items display
  - [ ] Categories filter
  - [ ] Purchase works (with points)
  - [ ] Insufficient points message

- [ ] **Quests**
  - [ ] Daily quests display
  - [ ] Weekly quests display
  - [ ] Timer counts down
  - [ ] Progress updates

- [ ] **Badges**
  - [ ] Earned badges shown
  - [ ] Locked badges shown
  - [ ] New badge notification

---

## Test Images

### AI-Generated (Should Score High)

Keep a collection of known AI images:
1. Midjourney v6 output
2. DALL-E 3 output
3. Stable Diffusion output
4. Old-style GAN output

### Real Photos (Should Score Low)

Keep a collection of known real images:
1. DSLR camera photo
2. iPhone photo with EXIF
3. Screenshot (should score low)
4. Scanned document

### Edge Cases

1. Heavily compressed JPEG
2. Very small image (<100px)
3. Transparent PNG
4. Animated GIF (first frame)
5. Photo of AI-generated image

---

## Automated Testing (Planned)

### Framework Recommendation

| Type | Framework | Reason |
|------|-----------|--------|
| Unit | Vitest | Fast, ESM-native |
| Integration | Vitest | Same as unit |
| E2E | Playwright | Cross-browser |

### Installation (Future)

```bash
npm install -D vitest @vitest/ui playwright
```

### Unit Test Structure

```
tests/
├── unit/
│   ├── detection/
│   │   ├── noiseAnalysis.test.js
│   │   ├── compressionAnalysis.test.js
│   │   └── ensemble.test.js
│   ├── auth/
│   │   └── session.test.js
│   └── utils/
│       └── helpers.test.js
├── integration/
│   ├── scanFlow.test.js
│   └── authFlow.test.js
└── e2e/
    ├── upload.spec.js
    ├── scan.spec.js
    └── auth.spec.js
```

### Example Unit Test

```javascript
// tests/unit/detection/noiseAnalysis.test.js
import { describe, it, expect } from 'vitest';
import { analyzeNoisePatterns } from '../../../src/js/detection/heuristics';

describe('analyzeNoisePatterns', () => {
    it('returns a number between 0 and 100', async () => {
        const testImage = await loadTestImage('test-photo.jpg');
        const result = analyzeNoisePatterns(testImage);

        expect(result).toBeTypeOf('number');
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThanOrEqual(100);
    });

    it('scores AI images higher than real photos', async () => {
        const aiImage = await loadTestImage('ai-generated.jpg');
        const realImage = await loadTestImage('real-photo.jpg');

        const aiScore = analyzeNoisePatterns(aiImage);
        const realScore = analyzeNoisePatterns(realImage);

        expect(aiScore).toBeGreaterThan(realScore);
    });
});
```

### Example E2E Test

```javascript
// tests/e2e/scan.spec.js
import { test, expect } from '@playwright/test';

test('user can upload and scan an image', async ({ page }) => {
    await page.goto('/');

    // Upload image
    const fileInput = page.locator('#fileInput');
    await fileInput.setInputFiles('./tests/fixtures/test-image.jpg');

    // Wait for preview
    await expect(page.locator('#dropzonePreview')).toBeVisible();

    // Click Quick Scan
    await page.click('#quickBtn');

    // Wait for results
    await expect(page.locator('#resultCard')).toBeVisible({ timeout: 30000 });

    // Verify result displayed
    const score = await page.locator('#scoreValue').textContent();
    expect(score).toMatch(/AI Probability: \d+%/);
});
```

---

## CI/CD Pipeline (Future)

### GitHub Actions

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run test:unit

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
```

---

## Performance Testing

### Metrics to Track

1. **Time to Interactive:** < 2 seconds
2. **Quick Scan Duration:** < 3 seconds
3. **Deep Scan Duration:** < 15 seconds
4. **Model Load Time:** < 10 seconds (first load)

### Lighthouse

Run Lighthouse in Chrome DevTools:
- Performance score > 80
- Accessibility score > 90
- Best Practices score > 90
- PWA score: Installable

---

*Last Updated: December 20, 2025*
