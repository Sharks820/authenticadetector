# Forensics Mode - Implementation Fix Guide

**Status:** Ready to Implement
**Estimated Effort:** 2-3 hours
**Risk Level:** Medium (core analysis logic)
**Files to Modify:** 1 (index.html)

---

## Overview

This guide provides exact code changes needed to implement a proper Forensics scan mode that provides actual enhanced analysis beyond Deep Scan.

---

## Code Changes Required

### CHANGE #1: Update startScan() Function

**Location:** `index.html` around line 5291

**Current Code:**
```javascript
const startScan = async (mode) => {
    if (!currentDataUrl) {
        toast('Please upload an image first');
        return;
    }

    if (analysisAborted) return;

    $('dropZone').style.display = 'none';
    $('resultsContainer').style.display = 'none';
    $('progressContainer').style.display = 'flex';
    $('progressStatus').textContent = 'Initializing analysis...';
```

**Fixed Code:**
```javascript
const startScan = async (mode) => {
    if (!currentDataUrl) {
        toast('Please upload an image first');
        return;
    }

    if (analysisAborted) return;

    // FORENSICS: Convert deep+forensicsMode to forensics mode
    let scanMode = mode;
    if (mode === 'deep' && forensicsMode) {
        scanMode = 'forensics';
    }

    $('dropZone').style.display = 'none';
    $('resultsContainer').style.display = 'none';
    $('progressContainer').style.display = 'flex';

    // FORENSICS: Show proper mode label
    const modeLabel = scanMode === 'forensics' ? '🔬 Forensics' :
                      scanMode === 'deep' ? '🔬 Deep' : '⚡ Quick';
    $('progressTitle').textContent = `${modeLabel} Scan...`;
    $('progressStatus').textContent = `Initializing ${scanMode} analysis...`;
```

---

### CHANGE #2: Update analyzeImage() Function Signature

**Location:** `index.html` around line 5586

**Current Code:**
```javascript
async function analyzeImage(dataUrl, mode = 'deep') {
    // Mode can be 'quick' or 'deep'
    // analyzeImage is called without forensics awareness
```

**Fixed Code:**
```javascript
async function analyzeImage(dataUrl, mode = 'deep') {
    // FORENSICS FIX: mode can now be 'quick', 'deep', or 'forensics'
    // Normalize mode - if 'forensics' passed as mode, use it
    // If mode is 'deep' but forensicsMode is true, convert to 'forensics'
    const normalizedMode = (mode === 'forensics' || (mode === 'deep' && forensicsMode)) ? 'forensics' : mode;
    const finalMode = normalizedMode;
```

---

### CHANGE #3: Update Analysis Size for Forensics

**Location:** `index.html` around line 5614

**Current Code:**
```javascript
    const analysisSize = mode === 'deep' ? 256 : 256;  // Reduced from 512 to 256 - prevents FFT freeze
    canvas.width = Math.min(img.width, analysisSize);
    canvas.height = Math.min(img.height, analysisSize);
```

**Fixed Code:**
```javascript
    // FORENSICS: Higher resolution analysis for forensics mode
    let analysisSize = 256;
    if (finalMode === 'forensics') {
        analysisSize = 512;  // Forensics uses higher resolution
    } else if (finalMode === 'deep') {
        analysisSize = 256;  // Deep uses 256 (FFT safe size)
    } else {
        analysisSize = 128;  // Quick uses 128 (faster)
    }
    canvas.width = Math.min(img.width, analysisSize);
    canvas.height = Math.min(img.height, analysisSize);

    console.log(`[Scan] Using ${analysisSize}x${analysisSize} for ${finalMode} mode`);
```

---

### CHANGE #4: Update FFT Frequency Analysis for Forensics

**Location:** `index.html` around line 5671

**Current Code:**
```javascript
    if (mode === 'deep') {
        console.log('[DeepScan] 3/12: FFT frequency analysis...');
        // Only run FFT on reasonably sized images (max 256x256)
        if (width <= 256 && height <= 256) {
            const frequencyResult = await runDetectorSafe('FFT Analysis',
                () => analyzeFrequencyDomain(pixels, width, height),
                3000 // 3 second timeout for FFT
            );
            addResults(frequencyResult);
        } else {
            console.log('[DeepScan] Image too large for FFT, skipping to prevent freeze');
        }
        await yieldToMain();
    }
```

**Fixed Code:**
```javascript
    if (finalMode === 'deep' || finalMode === 'forensics') {
        const isForensics = finalMode === 'forensics';
        console.log(`[Scan] 3/12: FFT frequency analysis (${isForensics ? 'Forensics' : 'Deep'})...`);

        // FORENSICS: More aggressive FFT analysis
        const fftMaxSize = isForensics ? 512 : 256;
        const fftTimeout = isForensics ? 6000 : 3000;

        if (width <= fftMaxSize && height <= fftMaxSize) {
            const frequencyResult = await runDetectorSafe('FFT Analysis',
                () => analyzeFrequencyDomain(pixels, width, height),
                fftTimeout
            );
            addResults(frequencyResult);
        } else if (isForensics && width > fftMaxSize) {
            // FORENSICS: Try FFT on large images by downsampling
            console.log('[Forensics] Image large, attempting FFT on downsampled version...');
            const downsampled = downsamplePixelsSimple(pixels, width, height, fftMaxSize);
            const frequencyResult = await runDetectorSafe('FFT Analysis (Downsampled)',
                () => analyzeFrequencyDomain(downsampled.data, downsampled.width, downsampled.height),
                8000  // Extended timeout
            );
            addResults(frequencyResult);
        } else if (!isForensics) {
            console.log('[DeepScan] Image too large for FFT, skipping to prevent freeze');
        }
        await yieldToMain();
    }
```

---

### CHANGE #5: Increase Module Timeouts for Forensics

**Location:** `index.html` around line 5744 (Model Fingerprints)

**Current Code:**
```javascript
        const modelResult = await runDetectorSafe('Model Fingerprints',
            () => analyzeModelSpecificFingerprints(pixels, width, height),
            4000
        );
```

**Fixed Code:**
```javascript
        // FORENSICS: Extended timeout for forensics mode
        const timeout = finalMode === 'forensics' ? 6000 : 4000;
        const modelResult = await runDetectorSafe('Model Fingerprints',
            () => analyzeModelSpecificFingerprints(pixels, width, height),
            timeout
        );
```

**Apply Same Pattern to Lines:**
- 5758 (Face/Anatomy Analysis) - change 4000 to timeout variable
- 5772 (Semantic Analysis) - change 4000 to timeout variable
- 5786 (Advanced Texture Analysis) - change 4000 to timeout variable

---

### CHANGE #6: Add Forensics-Specific Thresholds and Confidence Boosting

**Location:** `index.html` around line 5929

**Current Code:**
```javascript
    // Determine verdict based on calibrated score and indicator counts
    let verdict, confidence;

    // Deep scan has stricter thresholds but more reliable results
    if (mode === 'deep') {
        if (aiScore >= 75 && aiIndicatorCount >= minAIIndicators) {
            verdict = 'ai';
            confidence = aiScore >= 88 ? 'high' : 'medium';
        } else if (aiScore <= 25 || realIndicators.length >= 3) {
            verdict = 'real';
            confidence = aiScore <= 12 ? 'high' : 'medium';
        } else {
            verdict = 'uncertain';
            confidence = 'low';
        }
    } else {
        // Quick scan is more conservative
        if (aiScore >= 70 && aiIndicatorCount >= minAIIndicators) {
            verdict = 'ai';
            confidence = aiScore >= 85 ? 'high' : 'medium';
        } else if (aiScore <= 30 || realIndicators.length >= 2) {
            verdict = 'real';
            confidence = aiScore <= 15 ? 'high' : 'medium';
        } else {
            verdict = 'uncertain';
            confidence = 'low';
        }
    }
```

**Fixed Code:**
```javascript
    // Determine verdict based on calibrated score and indicator counts
    let verdict, confidence;

    // FORENSICS: Stricter thresholds for professional use
    if (finalMode === 'forensics') {
        // Forensics mode: Maximum accuracy, stricter thresholds
        if (aiScore >= 78 && aiIndicatorCount >= minAIIndicators) {
            verdict = 'ai';
            // Harder to reach 'high' confidence in forensics mode
            confidence = aiScore >= 90 ? 'high' : 'medium';
        } else if (aiScore <= 22 || realIndicators.length >= 4) {
            verdict = 'real';
            confidence = aiScore <= 10 ? 'high' : 'medium';
        } else {
            verdict = 'uncertain';
            confidence = 'low';
        }
    } else if (finalMode === 'deep') {
        // Deep scan has stricter thresholds but more reliable results
        if (aiScore >= 75 && aiIndicatorCount >= minAIIndicators) {
            verdict = 'ai';
            confidence = aiScore >= 88 ? 'high' : 'medium';
        } else if (aiScore <= 25 || realIndicators.length >= 3) {
            verdict = 'real';
            confidence = aiScore <= 12 ? 'high' : 'medium';
        } else {
            verdict = 'uncertain';
            confidence = 'low';
        }
    } else {
        // Quick scan is more conservative
        if (aiScore >= 70 && aiIndicatorCount >= minAIIndicators) {
            verdict = 'ai';
            confidence = aiScore >= 85 ? 'high' : 'medium';
        } else if (aiScore <= 30 || realIndicators.length >= 2) {
            verdict = 'real';
            confidence = aiScore <= 15 ? 'high' : 'medium';
        } else {
            verdict = 'uncertain';
            confidence = 'low';
        }
    }

    // FORENSICS: Additional confidence boost for high indicator agreement
    if (finalMode === 'forensics' && indicators.length >= 8) {
        // If 8+ AI indicators strongly agree, boost to high confidence
        if (verdict === 'ai') {
            confidence = 'high';
        }
    }
```

---

### CHANGE #7: Update Forensics Mode Explanation

**Location:** `index.html` around line 5920

**Current Code:**
```javascript
    // Forensics mode in deep scan
    if (mode === 'deep' && forensicsMode) {
        explainers.push({
            icon: 'SCAN',
            text: 'Forensics mode: Full multi-layer analysis with 12 detection modules',
            type: 'info'
        });
    }
```

**Fixed Code:**
```javascript
    // FORENSICS: Enhanced explainer for forensics mode
    if (finalMode === 'forensics') {
        explainers.push({
            icon: 'SCAN',
            text: `Forensics mode: Maximum accuracy analysis with ${indicators.length + realIndicators.length} detection signals across 12 modules (stricter thresholds, extended analysis)`,
            type: 'info'
        });
    }
```

---

### CHANGE #8: Update Summary Explainer

**Location:** `index.html` around line 5959

**Current Code:**
```javascript
    // Add summary explainer with scan type info
    const scanTypeInfo = mode === 'deep' ? '(12 analysis modules)' : '(5 quick modules)';
    explainers.unshift({
        icon: 'INFO',
        text: `${mode === 'deep' ? 'Deep' : 'Quick'} scan found ${aiIndicatorCount} AI indicator(s) and ${realIndicators.length} authenticity indicator(s) ${scanTypeInfo}`,
        type: 'summary'
    });
```

**Fixed Code:**
```javascript
    // Add summary explainer with scan type info
    // FORENSICS: Include forensics in label
    let scanTypeLabel = 'Quick';
    let scanTypeInfo = '(5 quick modules)';
    if (finalMode === 'forensics') {
        scanTypeLabel = 'Forensics';
        scanTypeInfo = '(12 forensics modules, stricter verification)';
    } else if (finalMode === 'deep') {
        scanTypeLabel = 'Deep';
        scanTypeInfo = '(12 analysis modules)';
    }

    explainers.unshift({
        icon: 'INFO',
        text: `${scanTypeLabel} scan found ${aiIndicatorCount} AI indicator(s) and ${realIndicators.length} authenticity indicator(s) ${scanTypeInfo}`,
        type: 'summary'
    });
```

---

### CHANGE #9: Update Result Object

**Location:** `index.html` around line 5974

**Current Code:**
```javascript
    return {
        verdict,
        aiScore: round(aiScore),
        confidence,
        explainers,
        mode,
        timestamp: Date.now(),
        indicatorCounts: {
            ai: aiIndicatorCount,
            real: realIndicators.length
        }
    };
```

**Fixed Code:**
```javascript
    return {
        verdict,
        aiScore: round(aiScore),
        confidence,
        explainers,
        mode: finalMode,  // FORENSICS: Return correct mode (forensics, not deep)
        timestamp: Date.now(),
        indicatorCounts: {
            ai: aiIndicatorCount,
            real: realIndicators.length
        }
    };
```

---

### CHANGE #10: Add Helper Function for Downsampling

**Location:** `index.html` - Add near top of script before analyzeImage()

**New Code:**
```javascript
// FORENSICS: Helper function to downsample pixels for FFT on large images
function downsamplePixelsSimple(pixelData, width, height, targetSize) {
    if (width <= targetSize && height <= targetSize) {
        return { data: pixelData, width: width, height: height };
    }

    const scale = Math.min(width, height) / targetSize;
    const newWidth = Math.ceil(width / scale);
    const newHeight = Math.ceil(height / scale);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = newWidth;
    canvas.height = newHeight;

    // Reconstruct image from pixels
    const imageData = ctx.createImageData(width, height);
    imageData.data.set(pixelData);
    ctx.putImageData(imageData, 0, 0);

    // Draw downsampled version
    const canvas2 = document.createElement('canvas');
    const ctx2 = canvas2.getContext('2d');
    canvas2.width = newWidth;
    canvas2.height = newHeight;
    ctx2.drawImage(canvas, 0, 0, newWidth, newHeight);

    const downsampled = ctx2.getImageData(0, 0, newWidth, newHeight);
    return {
        data: downsampled.data,
        width: newWidth,
        height: newHeight
    };
}
```

---

## Testing Checklist

After implementing changes:

- [ ] Deep scan still works normally
- [ ] Quick scan still works normally
- [ ] Forensics toggle appears in Advanced panel
- [ ] Toggling forensics on/off shows notification
- [ ] Forensics scan completes without errors
- [ ] Result object has mode='forensics' when applicable
- [ ] Explainers show forensics-specific text
- [ ] Progress bar shows "Forensics Scan" label
- [ ] Test on 3 AI images
- [ ] Test on 3 real images
- [ ] Test on mobile viewport (375px)
- [ ] No console errors or warnings
- [ ] Performance acceptable (<10 seconds)
- [ ] Forensics badge candidate check (result.mode === 'forensics')

---

## Expected Behavior After Fix

### Before: Current (Broken)
```
User enables Forensics toggle
→ Clicks "Deep Scan"
→ Deep scan runs identically (same modules, same thresholds, same duration)
→ Result shows "Deep Scan" in results
→ Explains "Full multi-layer analysis with 12 detection modules"
→ Forensics badge never awarded (result.mode never = 'forensics')
```

### After: Fixed
```
User enables Forensics toggle
→ Clicks "Deep Scan"
→ Scan starts as "Forensics" mode
→ Uses 512x512 resolution (vs 256x256)
→ Extends FFT timeout to 6000ms (vs 3000ms)
→ Extends module timeouts to 6000ms (vs 4000ms)
→ Applies stricter AI threshold (78 vs 75)
→ Applies stricter real threshold (22 vs 25)
→ Applies higher confidence requirements (90 vs 88)
→ Can boost confidence on high indicator agreement (8+)
→ Result shows "Forensics" scan type
→ Takes 6-10 seconds (vs 3-6 seconds)
→ Forensics badge awarded when result.mode === 'forensics'
```

---

## Rollback Plan

If issues arise:

1. Revert changes to analyzeImage() function
2. Comment out FORENSICS blocks
3. Restore originalmode logic
4. Clear browser cache/localStorage

---

## Performance Impact

**Expected:**
- Forensics mode: +2-4 seconds (due to higher resolution + extended timeouts)
- Deep scan: No change
- Quick scan: No change

**Trade-off:** Longer duration acceptable for "maximum accuracy" label

---

## Files Modified

- [x] `/index.html` - 10 code changes

**Total Lines Changed:** ~150 lines

**Risk Assessment:** Medium (affects core detection logic, but changes are isolated to mode-specific paths)

---

**Ready to implement after review.**
