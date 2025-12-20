# Animation Integration Checklist

Quick reference for integrating animations into existing features.

---

## Pre-Integration

- [x] Animations installed in `index.html`
- [x] `AnimationUtils` available globally
- [x] `prefers-reduced-motion` support enabled
- [x] All 39 keyframes loaded
- [x] No console errors

---

## Feature Integration Tasks

### 1. Scan Functionality

**Location:** `runQuickScan()` and `runDeepScan()` functions

```javascript
// BEFORE
async function runDeepScan() {
    // Start scan...
    updateProgress(0);
    // ... scan logic ...
    updateProgress(100);
}

// AFTER
async function runDeepScan() {
    const btn = document.getElementById('deepScanBtn');
    AnimationUtils.setButtonLoading(btn, true);

    try {
        updateProgress(0);
        // ... scan logic ...
        AnimationUtils.updateProgress(progressBar, 100);
        AnimationUtils.revealScore(scoreElement, result.score);
        AnimationUtils.setButtonSuccess(btn, 'Complete!');
        AnimationUtils.createConfetti();
    } catch (error) {
        AnimationUtils.setButtonError(btn, 'Failed');
    }
}
```

**Checklist:**
- [ ] Button shows loading spinner during scan
- [ ] Progress bar animates smoothly
- [ ] Score reveals with count-up animation
- [ ] Confetti bursts on completion
- [ ] Error state shows shake animation

---

### 2. Achievement Unlocks

**Location:** Badge/achievement unlock logic

```javascript
// BEFORE
function unlockAchievement(achievementId) {
    badges.push(achievementId);
    updateBadgeDisplay(achievementId);
}

// AFTER
function unlockAchievement(achievementId) {
    badges.push(achievementId);
    const badgeEl = document.getElementById(`badge-${achievementId}`);

    AnimationUtils.animateBadgeUnlock(badgeEl);
    AnimationUtils.showNotification(
        'Achievement Unlocked! 🎉',
        3000,
        'success'
    );
    AnimationUtils.createConfetti(40);

    updateBadgeDisplay(achievementId);
}
```

**Checklist:**
- [ ] Badge rotates and bounces
- [ ] Confetti creates burst effect
- [ ] Toast notification appears
- [ ] Animation doesn't block interaction

---

### 3. Level Progression

**Location:** User level-up logic

```javascript
// BEFORE
function levelUp() {
    user.level++;
    updateLevelDisplay();
}

// AFTER
function levelUp() {
    user.level++;
    const levelDisplay = document.getElementById('levelDisplay');

    AnimationUtils.animateLevelUp(levelDisplay);
    AnimationUtils.createConfetti(50);
    AnimationUtils.showNotification(
        `Level ${user.level}! 🎊`,
        4000,
        'success'
    );

    updateLevelDisplay();
}
```

**Checklist:**
- [ ] Level up text appears and scales
- [ ] Confetti burst creates celebration
- [ ] Notification shows new level
- [ ] Works with existing level system

---

### 4. Quest Lists

**Location:** `renderQuests()` function

```javascript
// BEFORE
function renderQuests() {
    const html = quests.map(q => `
        <div class="quest-card">
            <div>${q.title}</div>
        </div>
    `).join('');
    container.innerHTML = html;
}

// AFTER
function renderQuests() {
    container.innerHTML = '';
    const fragments = quests.map((q, i) => {
        const el = document.createElement('div');
        el.className = 'quest-card card-cascade';
        el.style.animationDelay = (i * 60) + 'ms';
        el.innerHTML = `
            <div class="quest-header">
                <span>${q.title}</span>
                <span class="quest-reward">+${q.reward}</span>
            </div>
            <div class="quest-progress">
                <div class="quest-progress-bar" style="width: ${q.progress}%"></div>
            </div>
        `;
        container.appendChild(el);
        return el;
    });

    // Add card lift effects
    fragments.forEach(card => {
        AnimationUtils.addCardLift(card);
    });
}
```

**Checklist:**
- [ ] Cards cascade in sequence
- [ ] Cards lift on hover
- [ ] Progress bars animate
- [ ] No animation stuttering

---

### 5. Leaderboard Updates

**Location:** Leaderboard rank change logic

```javascript
// BEFORE
function updateUserRank(newRank) {
    user.rank = newRank;
    updateLeaderboardDisplay();
}

// AFTER
function updateUserRank(newRank) {
    if (newRank < user.rank) {  // Ranked up!
        const rankEl = document.querySelector('[data-rank="self"]');
        AnimationUtils.animateRankUp(rankEl);
        AnimationUtils.createConfetti(30);
        AnimationUtils.showNotification(
            `You ranked up! #${newRank}`,
            3000,
            'success'
        );
    }

    user.rank = newRank;
    updateLeaderboardDisplay();
}
```

**Checklist:**
- [ ] Rank element glows when promoted
- [ ] Confetti bursts on rank up
- [ ] Toast notification appears
- [ ] Animation doesn't block updates

---

### 6. Shop Purchases

**Location:** Item purchase logic

```javascript
// BEFORE
async function purchaseItem(itemId) {
    const response = await buyItem(itemId);
    if (response.success) {
        user.inventory.push(itemId);
        updateShopDisplay();
    }
}

// AFTER
async function purchaseItem(itemId, button) {
    AnimationUtils.setButtonLoading(button, true);

    try {
        const response = await buyItem(itemId);
        if (response.success) {
            user.inventory.push(itemId);
            AnimationUtils.setButtonSuccess(button, 'Purchased!');
            AnimationUtils.createConfetti(20);
            AnimationUtils.showNotification(
                'Item purchased!',
                2000,
                'success'
            );
            updateShopDisplay();
        } else {
            AnimationUtils.setButtonError(button, 'Insufficient funds');
        }
    } catch (error) {
        AnimationUtils.setButtonError(button, 'Error');
    }
}
```

**Checklist:**
- [ ] Button shows loading spinner
- [ ] Success state appears on purchase
- [ ] Small confetti burst (not overwhelming)
- [ ] Error state on failure
- [ ] Notification confirms purchase

---

### 7. Data Loading

**Location:** Async data fetch functions

```javascript
// BEFORE
async function loadLeaderboard() {
    const data = await fetch('/leaderboard');
    const entries = await data.json();
    renderLeaderboard(entries);
}

// AFTER
async function loadLeaderboard() {
    const container = document.getElementById('leaderboard');

    // Show skeletons
    container.innerHTML = '';
    for (let i = 0; i < 5; i++) {
        const skeleton = document.createElement('div');
        skeleton.className = 'skeleton skeleton-bar';
        skeleton.style.marginBottom = '12px';
        container.appendChild(skeleton);
    }

    const data = await fetch('/leaderboard');
    const entries = await data.json();

    // Clear skeletons
    container.innerHTML = '';

    // Render with cascade
    renderLeaderboard(entries);
}

function renderLeaderboard(entries) {
    const container = document.getElementById('leaderboard');
    entries.forEach((entry, i) => {
        const el = document.createElement('div');
        el.className = 'leaderboard-item card-cascade';
        el.style.animationDelay = (i * 60) + 'ms';
        el.innerHTML = `<span>${entry.rank}</span> <span>${entry.name}</span> <span>${entry.score}</span>`;
        container.appendChild(el);
    });
}
```

**Checklist:**
- [ ] Skeletons show during load
- [ ] Skeleton shimmer animates
- [ ] Data loads without jank
- [ ] Entries cascade in on complete
- [ ] No layout shift

---

### 8. Error Handling

**Location:** Error display logic

```javascript
// BEFORE
function showError(message) {
    const errorEl = document.getElementById('error');
    errorEl.textContent = message;
    errorEl.style.display = 'block';
}

// AFTER
function showError(message) {
    // Option 1: Toast notification
    AnimationUtils.showNotification(message, 4000, 'error');

    // Option 2: Shake the button that triggered error
    const triggeringBtn = document.activeElement;
    if (triggeringBtn?.tagName === 'BUTTON') {
        AnimationUtils.setButtonError(triggeringBtn, 'Error');
    }
}
```

**Checklist:**
- [ ] Error appears with slide-in animation
- [ ] Toast notifications auto-dismiss
- [ ] Button shake grabs attention
- [ ] Error message is readable

---

### 9. Delete Confirmation

**Location:** Delete item logic

```javascript
// BEFORE
function deleteItem(itemId) {
    removeFromDB(itemId);
    removeFromUI(itemId);
}

// AFTER
function deleteItem(itemId) {
    const itemEl = document.querySelector(`[data-id="${itemId}"]`);

    AnimationUtils.showNotification('Removing...', 2000);
    AnimationUtils.removeItemAnimated(itemEl, () => {
        removeFromDB(itemId);
        AnimationUtils.showNotification(
            'Removed',
            2000,
            'success'
        );
    });
}
```

**Checklist:**
- [ ] Item slides out before deletion
- [ ] Loading notification appears
- [ ] Confirmation notification shown
- [ ] DOM element properly removed
- [ ] No jank in animation

---

### 10. Help/Tooltip System

**Location:** Interactive help elements

```javascript
// BEFORE
element.addEventListener('mouseenter', () => {
    showHelpText(element);
});

// AFTER
element.addEventListener('mouseenter', () => {
    AnimationUtils.showTooltip('Help text here', element);
});

element.addEventListener('mouseleave', () => {
    AnimationUtils.hideTooltip();
});
```

**Checklist:**
- [ ] Tooltip fades in on hover
- [ ] Positioned above element
- [ ] Fades out on mouse leave
- [ ] Mobile: use click instead of hover

---

## Global Checks

After implementing animations across features:

- [ ] Test on Chrome (desktop)
- [ ] Test on Firefox (desktop)
- [ ] Test on Safari (desktop)
- [ ] Test on iOS Safari
- [ ] Test on Android Chrome
- [ ] Enable `prefers-reduced-motion` in OS settings and test
- [ ] Check DevTools console for errors
- [ ] Monitor FPS during animations (should be 60fps)
- [ ] Test with throttled network (3G)
- [ ] Test with throttled CPU (4x slowdown)
- [ ] Verify no memory leaks (DevTools Memory tab)
- [ ] Test on low-end device if possible
- [ ] Verify keyboard navigation still works
- [ ] Test with screen reader

---

## Performance Monitoring

### Critical Metrics

Check DevTools > Performance tab:

**FPS During Animations:**
- Target: 60fps
- Acceptable: 50fps+
- Problem: Below 50fps

**Main Thread Time:**
- Target: <16ms per frame
- Acceptable: <33ms per frame
- Problem: >50ms

**Long Tasks:**
- Should be none during animations
- Check for blocking JavaScript

### Quick Performance Test

```javascript
// Run in console during animation
(function() {
    let lastTime = performance.now();
    let frameCount = 0;
    let totalTime = 0;

    function measure() {
        const now = performance.now();
        const delta = now - lastTime;
        lastTime = now;

        if (delta < 20) frameCount++;
        totalTime += 1;

        if (totalTime < 100) {
            requestAnimationFrame(measure);
        } else {
            console.log(`FPS: ${frameCount}%`);
        }
    }

    requestAnimationFrame(measure);
})();
```

---

## Rollback Instructions

If animations cause issues:

1. **Restore backup:**
   ```bash
   cp index.html.backup index.html
   ```

2. **Partial rollback:** Remove just the animation JS utilities:
   - Find `// ==================== ANIMATION UTILITIES ====================`
   - Remove section to closing `</script>`
   - CSS animations remain (less risky)

3. **Disable all animations:**
   ```css
   * {
       animation: none !important;
       transition: none !important;
   }
   ```

---

## Documentation Updates

After integrating animations, update:

- [ ] Feature README with animation callouts
- [ ] Code comments explaining animation purposes
- [ ] User guide if animations change UX flow
- [ ] Performance docs with metrics
- [ ] Accessibility notes for testers

---

## Browser Testing Checklist

### Desktop Browsers

- [ ] Chrome/Edge - Latest version
- [ ] Firefox - Latest version
- [ ] Safari - Latest version
- [ ] Chrome with DevTools throttling (slow 3G, 4x CPU)

### Mobile Browsers

- [ ] iOS Safari 13+
- [ ] Android Chrome
- [ ] Android Firefox
- [ ] Safari on iPhone/iPad

### Accessibility Testing

- [ ] System `prefers-reduced-motion` enabled
- [ ] VoiceOver (macOS) or TalkBack (Android)
- [ ] Keyboard-only navigation
- [ ] Tab order verification
- [ ] Color contrast maintained

---

## Common Issues & Solutions

### Problem: Animations feel sluggish

**Solution:**
```javascript
// Check if device is low-end
if (navigator.deviceMemory < 4) {
    // Reduce confetti
    AnimationUtils.createConfetti(15);
} else {
    // Full confetti
    AnimationUtils.createConfetti(30);
}
```

### Problem: Confetti appears but doesn't animate

**Solution:**
- Verify `var(--tx)` and `var(--ty)` CSS variables are set
- Check browser console for errors
- Ensure confetti elements are visible (z-index check)

### Problem: Animations jank on mobile

**Solution:**
```javascript
// Use GPU acceleration
element.style.willChange = 'transform, opacity';

// After animation
element.addEventListener('animationend', () => {
    element.style.willChange = 'auto';
});
```

### Problem: Animation doesn't respect `prefers-reduced-motion`

**Solution:**
```javascript
// Check before animating
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReduced) {
    AnimationUtils.createConfetti();
}
```

---

## Testing Scenarios

### Scenario 1: Complete Scan Flow
1. User selects image
2. Click scan button → Loading spinner appears
3. Progress bar animates 0-100%
4. Score reveals with count-up
5. Confetti bursts
6. Success notification appears
7. Result card fades in

### Scenario 2: Achievement Path
1. User completes quest
2. Badge animates unlock (scale + rotate)
3. Confetti burst
4. Success toast appears
5. Level bar updates
6. If level up: Level up animation triggers

### Scenario 3: Quest Completion
1. Quest cards load with cascade animation
2. User hovers cards → cards lift
3. User completes quest
4. Progress bar animates to 100%
5. Checkmark animates
6. Complete state shows
7. New quests load with cascade

---

## Commit Message Template

```
feat(animations): add [FEATURE_NAME] animations

- Implement [animation_name] animation (300ms)
- Add loading spinner feedback
- Add success/error states
- Update [function] to use AnimationUtils

Tested on:
- Chrome (desktop)
- Safari (iOS)
- Android Chrome

Performance: 60fps maintained
Accessibility: prefers-reduced-motion works
```

---

## Sign-off Checklist

Before marking animations complete:

- [ ] All features integrated with animations
- [ ] No console errors or warnings
- [ ] 60fps on desktop browsers
- [ ] No jank on mobile
- [ ] Accessibility verified
- [ ] Performance profiled
- [ ] Documentation updated
- [ ] Tests created (if applicable)
- [ ] Code reviewed
- [ ] Deployed to staging
- [ ] User tested
- [ ] Ready for production

---

**Last Updated:** December 20, 2024
**Version:** 1.0
**Status:** Ready for Implementation
