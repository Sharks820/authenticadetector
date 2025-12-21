# P1 Bug Fix Verification Checklist
**Date:** December 20, 2025
**Commit:** 569abd3

---

## Quick Verification (5 minutes)

### Desktop Browser (Chrome/Firefox/Safari)
- [ ] Load https://authenticadetector.com
- [ ] Navigate between views (Home → Profile → Help → Home)
- [ ] Verify no console errors
- [ ] Share a result, verify URL contains authenticadetector.com

### Mobile Browser (iOS Safari or Android Chrome)
- [ ] Load app on mobile device
- [ ] Test back button navigation (if Android)
- [ ] Upload and analyze an image
- [ ] Verify quest notification appears correctly on screen

---

## Full Verification (15 minutes)

### P1-B: Mobile Layout ✅
**Device:** iPhone X+ or Android with notch

1. [ ] Open app on device with notch/camera cutout
2. [ ] Login or continue as guest
3. [ ] Complete a quest (scan 1 image)
4. [ ] Verify quest notification appears FULLY on screen
5. [ ] Notification should not be hidden by notch or status bar
6. [ ] Check in both portrait and landscape

**Pass Criteria:** Notification visible with no parts off-screen

---

### P1-C: Android Back Navigation ✅
**Device:** Android phone with physical back button

1. [ ] Open app
2. [ ] Navigate: Home → Profile → Badges → Leaderboard
3. [ ] Press physical back button (should go to Badges)
4. [ ] Press back again (should go to Profile)
5. [ ] Press back again (should go to Home)
6. [ ] Press back at Home view
7. [ ] Verify app STAYS OPEN (doesn't exit to browser)
8. [ ] Try rapid back button presses (5-10 times)
9. [ ] Verify no navigation loops or stuttering

**Pass Criteria:** 
- Smooth backward navigation through views
- No loops or crashes
- App stays open when pressing back at home

---

### P1-D: Persistence (Coins) ✅
**Device:** Any (desktop or mobile)

#### Test 1: Offline Submission
1. [ ] Login to app
2. [ ] Note current coin count
3. [ ] Open DevTools → Network → Set to "Offline"
4. [ ] Submit an image to Hunt view
5. [ ] Check coins increased by +50
6. [ ] Refresh page (F5)
7. [ ] Verify coins still show +50 increase

#### Test 2: Offline Vote
1. [ ] Still offline
2. [ ] Go to Verify view
3. [ ] Vote on an image
4. [ ] Check coins increased by +10
5. [ ] Refresh page
6. [ ] Verify coins persisted

#### Test 3: Game Coins
1. [ ] Set network back to "Online"
2. [ ] Play Truth Cannon game (from game menu)
3. [ ] End game (let credibility reach 0 or quit)
4. [ ] Note coins earned
5. [ ] Refresh page
6. [ ] Verify game coins persisted

**Pass Criteria:** All coin awards persist after refresh

---

### P1-E: Android Share Target ✅
**Device:** Android phone (PWA must be installed)

#### Setup (if PWA not installed)
1. [ ] Open app in Chrome
2. [ ] Menu → "Add to Home screen"
3. [ ] Install AuthenticaDetector PWA

#### Test Share Target
1. [ ] Open Android Gallery/Photos app
2. [ ] Select ANY image
3. [ ] Tap Share button
4. [ ] Select "AuthenticaDetector" from share sheet
5. [ ] App should open with image loaded
6. [ ] Image should appear in analyzer view
7. [ ] Should show toast: "Shared image loaded! Ready to analyze."
8. [ ] Tap "Quick Scan" or "Deep Scan"
9. [ ] Verify scan works correctly

**Pass Criteria:**
- Image loads from share target
- No errors in console
- Scan works on shared image

---

### P1-F: Domain Canonicalization ✅
**Device:** Any

#### Test from Custom Domain
1. [ ] Open https://authenticadetector.com
2. [ ] Scan an image
3. [ ] Tap "Share Result" button
4. [ ] Check shared text
5. [ ] Verify URL is: https://authenticadetector.com (NOT CF Pages)

#### Test from CF Pages
1. [ ] Open https://authenticadetector-v7.pages.dev
2. [ ] Scan an image
3. [ ] Tap "Share Result"
4. [ ] Verify URL is: https://authenticadetector-v7.pages.dev

**Pass Criteria:** Shared URL matches current domain (no hardcoded URL)

---

## Console Error Check

### What to Check
1. [ ] Open DevTools → Console
2. [ ] Navigate through app (all views)
3. [ ] Perform actions: upload, scan, vote, submit, play game
4. [ ] Check for errors (red text)

**Expected:**
- No critical errors (ERR_)
- Info/log messages are OK
- Warnings are OK (e.g., "[SW] Registration failed" on localhost)

**Red Flags:**
- ReferenceError
- TypeError
- Failed to fetch (when online)
- Uncaught exceptions

---

## Performance Check (Optional)

1. [ ] Lighthouse audit (DevTools → Lighthouse)
2. [ ] Run "Progressive Web App" audit
3. [ ] Target: >80 score
4. [ ] Check installability works
5. [ ] Verify service worker registered

---

## Sign-Off

**Tested By:** _________________
**Date:** _________________
**Device(s):** _________________
**Browser(s):** _________________

### Results
- [ ] All tests passed
- [ ] Minor issues found (document below)
- [ ] Critical issues found (STOP - report immediately)

### Issues Found (if any)
```
[Describe any issues here]
```

---

## Rollback Procedure (if needed)

If critical bugs found:

```bash
cd /path/to/files_extracted
git revert 569abd3
git push origin main
```

Wait 2 minutes for Cloudflare Pages auto-deploy.

---

**Note:** This checklist covers the 5 P1 bugs fixed in commit 569abd3. All tests should pass if fixes were implemented correctly.
