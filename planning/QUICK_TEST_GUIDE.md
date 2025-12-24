# Deep Scan Quick Test Guide
**5-Minute Verification** - For manual testers

---

## What You're Testing

**Bug:** Deep Scan froze browser for 5-10 seconds on mobile
**Fix:** Reduced FFT computation from 512px to 256px
**Commit:** 70bc08c
**Priority:** P0 - CRITICAL

---

## How to Test (5 minutes)

### Setup (30 seconds)
1. Open Chrome browser
2. Press **F12** to open DevTools
3. Click **Console** tab
4. Navigate to: **https://authenticadetector-v7.pages.dev**
5. Login (create account if needed)
6. Navigate to **Deep Scan** feature

### Test 1: Small Image - FFT Should Run (1 min)
**What to do:**
- Upload any image < 256px (or use phone screenshot)
- Watch console output

**What to look for:**
```
✓ [DeepScan] 3/12: FFT frequency analysis...
✓ [DeepScan] Running FFT Analysis...
✓ [DeepScan] FFT Analysis completed in XXXms
✓ NO freeze
✓ Progress bar reaches 100%
```

**Pass/Fail:** _____________

---

### Test 2: Large Image - FFT Should Skip (1 min)
**What to do:**
- Upload any image > 256px (e.g., 1920×1080 screenshot)
- Watch console output

**What to look for:**
```
✓ [DeepScan] 3/12: FFT frequency analysis...
✓ [DeepScan] Image too large for FFT, skipping to prevent freeze
✓ NO "Running FFT Analysis..." message
✓ NO freeze
✓ Progress bar reaches 100%
```

**Pass/Fail:** _____________

---

### Test 3: Mobile Viewport (2 min)
**What to do:**
- In DevTools, press **Ctrl+Shift+M** (toggle device toolbar)
- Select **iPhone SE** (375×667)
- Upload 512×512 image
- Watch UI responsiveness

**What to look for:**
```
✓ FFT skipped in console
✓ UI remains responsive (no freeze)
✓ Progress bar updates smoothly
✓ Scan completes in < 10 seconds
```

**Pass/Fail:** _____________

---

### Test 4: Progress Bar Accuracy (1 min)
**What to do:**
- Upload any image
- Watch progress bar throughout scan
- Make sure it reaches 100%

**What to look for:**
```
✓ Progress starts at 0%
✓ Progress increments smoothly
✓ Progress reaches 100%
✓ NO hang at "Finalizing..."
✓ Results display correctly
```

**Pass/Fail:** _____________

---

## Quick Diagnosis

### If browser FREEZES:
❌ **FIX FAILED** - Report immediately
- Screenshot the freeze
- Note image size that caused it
- Check if FFT ran when it shouldn't

### If FFT runs on 512px image:
❌ **FIX NOT DEPLOYED** - Wrong code version
- Verify you're on: https://authenticadetector-v7.pages.dev
- Try hard refresh (Ctrl+F5)

### If console shows errors:
⚠️ **POTENTIAL REGRESSION** - Investigate
- Copy full error message
- Note which step failed
- Screenshot console output

### If all tests pass:
✅ **FIX VERIFIED** - Update status to VERIFIED FIXED

---

## Expected Console Output (Good Example)

```
[DeepScan] Starting deep scan...
[DeepScan] Image loaded: 1920x1080 pixels
[DeepScan] 1/12: Metadata analysis...
[DeepScan] Running Metadata Analysis...
[DeepScan] Metadata Analysis completed in 45ms
[DeepScan] 2/12: JPEG compression analysis...
[DeepScan] Running JPEG Compression Analysis...
[DeepScan] JPEG Compression Analysis completed in 123ms
[DeepScan] 3/12: FFT frequency analysis...
[DeepScan] Image too large for FFT, skipping to prevent freeze  ← KEY LINE
[DeepScan] 4/12: GAN fingerprint detection...
...
[DeepScan] deep scan complete! Score: 67%, Verdict: Likely AI, Time: 3456ms
```

---

## Test Results Summary

| Test Case | Expected | Pass/Fail | Notes |
|-----------|----------|-----------|-------|
| Small image (< 256px) | FFT runs | _____ | |
| Large image (> 256px) | FFT skips | _____ | |
| Mobile viewport | No freeze | _____ | |
| Progress bar | Reaches 100% | _____ | |

**Overall Status:** _______________

**Tester Name:** _______________
**Date/Time:** _______________

---

## Reporting Results

**If all tests pass:**
Update CLAUDE.md bug status:
```
Bug #3: Deep Scan Hang/Crash
Status: ✅ VERIFIED FIXED (Date: YYYY-MM-DD)
Verified by: [Your Name]
```

**If any test fails:**
Create issue report with:
1. Which test failed
2. Screenshot of console
3. Image size that caused failure
4. Browser/OS information

---

**Questions?** Check DEEP_SCAN_TEST_RESULTS.md for detailed test plan
