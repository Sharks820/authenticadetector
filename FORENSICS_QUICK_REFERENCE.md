# Forensics Scan Mode - Quick Reference

**Test Status:** Investigation Complete
**Finding:** Forensics mode is incomplete - UI exists but provides NO enhanced functionality
**Severity:** P1-CRITICAL
**Fix Effort:** 2-3 hours
**Files:** FORENSICS_TEST_REPORT.md (detailed) + FORENSICS_IMPLEMENTATION_FIX.md (code changes)

---

## The Problem in One Sentence

**The Forensics toggle exists but does nothing - enabling it on a Deep Scan doesn't change the analysis, thresholds, confidence, or results in any way.**

---

## What Currently Happens

```
User enables Forensics
└─→ Sets forensicsMode = true
    └─→ When user clicks Deep Scan
        └─→ Deep scan runs IDENTICALLY
            └─→ Only adds one explanation message
            └─→ Result.mode = 'deep' (not 'forensics')
            └─→ Thresholds unchanged
            └─→ Timeouts unchanged
            └─→ Resolution unchanged
            └─→ No badge awarded
```

---

## What SHOULD Happen

```
User enables Forensics
└─→ Sets forensicsMode = true
    └─→ When user clicks Deep Scan
        └─→ Scan mode becomes 'forensics'
            ├─→ Uses 512x512 (vs 256x256)
            ├─→ FFT timeout: 6000ms (vs 3000ms)
            ├─→ Module timeout: 6000ms (vs 4000ms)
            ├─→ AI threshold: ≥78 (vs ≥75)
            ├─→ Real threshold: ≤22 (vs ≤25)
            ├─→ High confidence: ≥90 (vs ≥88)
            ├─→ Duration: 6-10s (vs 3-6s)
            ├─→ Result.mode = 'forensics'
            └─→ Badge awarded when result.mode = 'forensics'
```

---

## Critical Bugs Found

| # | Issue | Impact | Fix Time |
|---|-------|--------|----------|
| 1 | No 'forensics' scan mode path | Can't enable forensics logic | 15 min |
| 2 | forensicsMode flag not passed to analyzeImage() | Function can't differentiate behavior | 30 min |
| 3 | Result.mode never = 'forensics' | Results look like Deep Scan, badge broken | 5 min |
| 4 | No forensics thresholds | Same accuracy as Deep Scan | 15 min |
| 5 | Analysis size same (256x256) | No improvement in detail | 10 min |
| 6 | FFT skipped for large images | Frequency analysis lost | 30 min |
| 7 | Module timeouts fixed (4s) | No extra analysis time | 20 min |
| 8 | Badge system broken | "Forensics Fan" unawardable | 5 min (after fix #3) |

---

## Code Changes Summary

**File:** `index.html`

### Essential Changes (Must Do)

1. **Add forensics mode parameter to analyzeImage()** → Allows function to know it's forensics mode
2. **Create 'forensics' mode path in scanning logic** → Different thresholds, timeouts, resolution
3. **Return correct mode in results** → result.mode must = 'forensics'
4. **Apply stricter thresholds** → AI: ≥78 (not 75), Real: ≤22 (not 25)
5. **Extend timeouts for forensics** → 6000ms for modules (not 4000ms)

### Nice-to-Have Improvements

6. Higher resolution (512x512) for forensics
7. Extended FFT on large images via downsampling
8. Confidence boosting logic (8+ indicators → high confidence)
9. Updated progress messages and explainers

---

## Test Images Available

**Location:** `C:\Users\Conner\Downloads\`

**AI-Generated (Test Set):**
- ChatGPT Image Apr 11, 2025, 10_47_07 PM.png
- ChatGPT Image Apr 14, 2025, 06_33_44 PM.png (×2)
- ChatGPT Image Apr 14, 2025, 10_04_18 PM.png
- ChatGPT Image Apr 15, 2025, 09_17_59 PM.png (×7)
- ChatGPT Image Aug 24, 2025, 02_08_13 PM.png (×2)
- ChatGPT Image Dec 17, 2025, 08_10_17 PM.png

**Total:** 20+ test images available

---

## Implementation Roadmap

### Phase 1: Core Fix (1 hour)
- [ ] Fix analyzeImage() signature
- [ ] Add forensics mode path
- [ ] Apply forensics thresholds
- [ ] Ensure result.mode = 'forensics'

### Phase 2: Enhancement (1 hour)
- [ ] Extend FFT for forensics
- [ ] Increase module timeouts
- [ ] Higher resolution analysis
- [ ] Confidence boosting

### Phase 3: Testing (1 hour)
- [ ] Test on 10 AI images
- [ ] Test on 10 real images
- [ ] Mobile viewport test
- [ ] Performance measurement

---

## Key Metrics (After Fix)

### Performance Comparison

| Metric | Quick | Deep | Forensics |
|--------|-------|------|-----------|
| Duration | 1-2s | 3-6s | 6-10s |
| Modules | 5 | 12 | 12 |
| Resolution | 128px | 256px | 512px |
| AI Threshold | ≥70 | ≥75 | ≥78 |
| Real Threshold | ≤30 | ≤25 | ≤22 |
| High Confidence | ≥85 | ≥88 | ≥90 |

### Indicator Thresholds

- Quick: Detects with 2+ real indicators = "real"
- Deep: Detects with 3+ real indicators = "real"
- Forensics: Requires 4+ real indicators = "real" (stricter)

---

## Forensics Badge System

**Current Status:** BROKEN

```javascript
forensics_fan: {
    id: 'forensics_fan',
    name: 'Forensics Fan',
    desc: '5 Forensics scans',
    icon: '🔬',
    req: 5,           // Requires 5 scans
    type: 'forensics',
    rarity: 'rare',
    points: 60
}
```

**Problem:** Badge never awarded because:
1. No scan returns mode='forensics'
2. Badge system looks for result.mode === 'forensics'
3. Current code returns result.mode = 'deep'

**After Fix:** Badge automatically awarded when result.mode = 'forensics'

---

## Mobile Considerations

**Status:** Unknown (untested)

**Expected Issues:**
- Longer scans (6-10s) on slow connections
- Memory constraints on 375px devices
- Canvas size limits on some phones

**Recommendation:** Test on:
- iPhone SE (375x667)
- Samsung S21 (360x800)
- iPad (810x1080)

---

## Risk Assessment

| Risk | Before Fix | After Fix |
|------|-----------|-----------|
| Users misled about forensics features | HIGH | LOW |
| Deep scan accuracy affected | LOW | NONE |
| Performance degradation | LOW | Acceptable (expected) |
| Mobile compatibility | UNKNOWN | TBD |
| Badge system broken | HIGH | FIXED |

---

## Files to Review

1. **FORENSICS_TEST_REPORT.md** (44 KB)
   - Comprehensive analysis of current implementation
   - 10 bugs documented with code locations
   - Test plan for 10+ images
   - Mobile viewport considerations
   - Detailed recommendations

2. **FORENSICS_IMPLEMENTATION_FIX.md** (12 KB)
   - Exact code changes required
   - Before/after code comparisons
   - 10 specific changes to make
   - Testing checklist
   - Rollback plan

3. **FORENSICS_QUICK_REFERENCE.md** (This file)
   - One-page overview
   - Quick decision guide
   - Key metrics
   - Status summary

---

## Decision Points

### Option A: Implement Forensics Mode (Recommended)
**Effort:** 2-3 hours
**Benefit:** Professional-grade scanning feature
**Risk:** Medium (core logic modification)
**Status:** Ready to implement (fixes documented)

### Option B: Remove Forensics Feature
**Effort:** 15 minutes
**Benefit:** Remove misleading UI
**Risk:** Low (delete code)
**Drawback:** Lose planned professional feature

### Option C: Rename to "Deep+" Mode
**Effort:** 1 hour
**Benefit:** More honest about capabilities
**Risk:** Low
**Drawback:** Less impressive name, still incomplete

---

## Recommendation

**Implement Option A (Full Forensics Mode)**

Reasoning:
1. Feature is already in UI
2. Fixes are documented and ready
3. Professional users expect this feature
4. Badge system depends on it
5. Expected effort is reasonable (2-3 hours)
6. Performance impact acceptable (6-10s for "maximum accuracy")

---

## Next Steps

1. Review FORENSICS_TEST_REPORT.md for detailed findings
2. Review FORENSICS_IMPLEMENTATION_FIX.md for exact code changes
3. Implement changes in order (Essential first, then enhancements)
4. Run test suite on 10+ images
5. Verify mobile compatibility
6. Measure performance metrics
7. Commit with message: "Fix: Implement proper Forensics scan mode with stricter thresholds and enhanced analysis"

---

## Contact & Questions

**Agent:** Detection-Forensics
**Investigation Date:** Dec 20, 2025
**Status:** COMPLETE - AWAITING IMPLEMENTATION

For detailed technical analysis, see FORENSICS_TEST_REPORT.md
For exact code changes, see FORENSICS_IMPLEMENTATION_FIX.md
