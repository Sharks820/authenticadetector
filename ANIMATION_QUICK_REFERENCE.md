# Animation Quick Reference Card

**Copy-paste snippets for common animation needs.**

---

## Loading States

### Button Loading
```javascript
const button = document.getElementById('myButton');
AnimationUtils.setButtonLoading(button, true);
// ... do work ...
AnimationUtils.setButtonLoading(button, false);
```

### Show Spinner
```javascript
const spinner = AnimationUtils.createSpinner('md');
container.appendChild(spinner);
```

### Skeleton Loaders
```javascript
const skeleton = AnimationUtils.createSkeleton();
container.appendChild(skeleton);

const bar = AnimationUtils.createSkeletonBar();
container.appendChild(bar);
```

---

## Feedback States

### Success
```javascript
AnimationUtils.setButtonSuccess(button, 'Complete!');
// Auto-resets after 2 seconds
```

### Error
```javascript
AnimationUtils.setButtonError(button, 'Failed!');
// Auto-resets after 2.5 seconds
```

### Toast Notification
```javascript
AnimationUtils.showNotification('Success!', 3000, 'success');
AnimationUtils.showNotification('Error!', 3000, 'error');
AnimationUtils.showNotification('Warning!', 3000, 'warning');
AnimationUtils.showNotification('Info', 3000, 'info');
```

---

## Progress Animations

### Animated Progress Bar
```html
<div class="progress-bar" id="progress" style="width:0%"></div>
```

```javascript
const bar = document.getElementById('progress');
AnimationUtils.updateProgress(bar, 50); // 50%
```

### Score Count-Up
```javascript
AnimationUtils.revealScore(scoreElement, 87); // Counts to 87%
```

### Scan Indicator
```javascript
const indicator = AnimationUtils.addScanIndicator(container);
```

---

## List/Grid Animations

### Cascade Cards
```javascript
const cards = document.querySelectorAll('.quest-card');
AnimationUtils.cascadeCards(cards);
```

### Add Hover Lift
```javascript
const card = document.querySelector('.shop-item');
AnimationUtils.addCardLift(card);
```

### Remove with Animation
```javascript
AnimationUtils.removeItemAnimated(itemElement, () => {
    console.log('Item removed!');
});
```

### Expand/Collapse
```javascript
AnimationUtils.expandElement(content);
// ... later ...
AnimationUtils.collapseElement(content);
```

---

## Celebratory Effects

### Confetti Burst
```javascript
// Simple
AnimationUtils.createConfetti();

// Customized
AnimationUtils.createConfetti(50, 0.5, 0.5); // count, x, y
```

### Badge Unlock
```javascript
AnimationUtils.animateBadgeUnlock(badgeElement);
```

### Level Up
```javascript
AnimationUtils.animateLevelUp(container);
```

### Success Burst
```javascript
AnimationUtils.createSuccessBurst(element);
```

### Rank Up Glow
```javascript
AnimationUtils.animateRankUp(leaderboardRow);
```

---

## Micro-interactions

### Bounce Icon
```javascript
AnimationUtils.bounceIcon(iconElement);
```

### Float Animation (Continuous)
```javascript
AnimationUtils.addFloatingIcon(element);
```

### Heartbeat
```javascript
AnimationUtils.addHeartbeat(element);
```

### Pop-In Animation
```javascript
AnimationUtils.popIn(element);
```

### Reveal Text
```javascript
AnimationUtils.revealText(element, 'New text here');
```

---

## Tooltips & Help

### Show Tooltip
```javascript
AnimationUtils.showTooltip('Help text', element);
```

### Hide Tooltip
```javascript
AnimationUtils.hideTooltip();
```

---

## View Transitions

### Fade In View
```javascript
AnimationUtils.fadeInView(viewElement);
```

### Fade Out View
```javascript
AnimationUtils.fadeOutView(viewElement);
```

---

## Helper Functions

### Delay
```javascript
await AnimationUtils.delay(500); // Wait 500ms
```

### Chain Animations
```javascript
async function sequence() {
    await animate(el1, 'fadeInUp', 300);
    await animate(el2, 'fadeInUp', 300);
    await animate(el3, 'fadeInUp', 300);
}

sequence();
```

### Staggered Sequence
```javascript
const cards = document.querySelectorAll('.card');
await animateSequence(cards, 'cascadeIn', 400, 100); // 100ms between
```

---

## CSS Classes (No JavaScript Needed)

### Cards
```html
<!-- Cascade in on render -->
<div class="quest-card card-cascade">Quest 1</div>
<div class="quest-card card-cascade" style="animation-delay: 60ms">Quest 2</div>

<!-- Lift on hover -->
<div class="shop-item card-lift">Item</div>
```

### Expand/Collapse
```javascript
// Expand
element.classList.add('collapse-enter');

// Collapse
element.classList.add('collapse-exit');
```

### Delete
```html
<div class="item-remove">This slides out</div>
<!-- or -->
<div class="item-delete-fade">This fades out</div>
```

### Celebrate
```html
<div class="badge-unlock">🎖️</div>
<div class="level-up">⬆️ Level Up!</div>
<div class="success-burst">✓</div>
```

### Utilities
```html
<div class="float">⭐</div> <!-- Floating animation -->
<div class="heartbeat">❤️</div> <!-- Heartbeat pulse -->
<div class="pop-in">🎉</div> <!-- Pop-in animation -->
<div class="text-reveal">Revealing...</div> <!-- Text reveal -->
<div class="smooth-transition">Smooth changes</div> <!-- Smooth transitions -->
```

### Loading
```html
<div class="skeleton">Placeholder</div>
<div class="skeleton skeleton-bar">Placeholder bar</div>
<div class="skeleton skeleton-circle">Placeholder circle</div>
<div class="spinner"></div>
<div class="spinner spinner-sm"></div>
<div class="spinner spinner-lg"></div>
```

### Delays
```html
<div class="cascade-in delay-1">First (100ms)</div>
<div class="cascade-in delay-2">Second (200ms)</div>
<div class="cascade-in delay-3">Third (300ms)</div>
<div class="cascade-in delay-4">Fourth (400ms)</div>
<div class="cascade-in delay-5">Fifth (500ms)</div>
```

---

## Common Patterns

### Complete Scan Flow
```javascript
async function runScan() {
    const btn = document.getElementById('scanBtn');
    const progress = document.getElementById('progress');
    const score = document.getElementById('score');

    AnimationUtils.setButtonLoading(btn, true);

    for (let i = 0; i <= 100; i += 10) {
        AnimationUtils.updateProgress(progress, i);
        await AnimationUtils.delay(200);
    }

    const result = 85; // Example
    AnimationUtils.revealScore(score, result);
    AnimationUtils.setButtonSuccess(btn, 'Done!');
    AnimationUtils.createConfetti();
    AnimationUtils.showNotification('Scan complete!', 3000, 'success');
}
```

### Load List with Skeletons
```javascript
async function loadQuests() {
    const container = document.getElementById('quests');

    // Show skeletons
    container.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        const skeleton = document.createElement('div');
        skeleton.className = 'skeleton skeleton-bar';
        container.appendChild(skeleton);
    }

    // Fetch data
    const quests = await fetch('/quests').then(r => r.json());

    // Show with cascade
    container.innerHTML = '';
    quests.forEach((quest, i) => {
        const el = document.createElement('div');
        el.className = 'quest-card card-cascade';
        el.style.animationDelay = (i * 60) + 'ms';
        el.innerHTML = quest.title;
        container.appendChild(el);
    });
}
```

### Achievement Celebration
```javascript
function unlockAchievement(name, icon) {
    const container = document.getElementById('achievement');
    const badge = document.createElement('div');
    badge.id = 'achievement-badge';
    badge.textContent = icon;
    container.appendChild(badge);

    AnimationUtils.animateBadgeUnlock(badge);
    AnimationUtils.showNotification(
        `Achievement: ${name}`,
        3000,
        'success'
    );
}
```

### Shop Purchase
```javascript
async function buyItem(btn, itemId) {
    AnimationUtils.setButtonLoading(btn, true);

    try {
        await purchaseFromServer(itemId);
        AnimationUtils.setButtonSuccess(btn, 'Purchased!');
        AnimationUtils.createConfetti(20);
    } catch (err) {
        AnimationUtils.setButtonError(btn, 'Failed');
    }
}
```

---

## Accessibility Check

```javascript
// Check if user prefers reduced motion
const prefersReduced = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
).matches;

if (!prefersReduced) {
    // Run celebratory animation
    AnimationUtils.createConfetti();
}
```

---

## Performance Tips

### Reduce Confetti on Mobile
```javascript
const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);
const count = isMobile ? 15 : 30;
AnimationUtils.createConfetti(count);
```

### Preload Animations
```javascript
// After page load, prepare animations
window.addEventListener('load', () => {
    // Animations are ready
    console.log('AnimationUtils ready');
});
```

### Monitor Performance
```javascript
// Simple FPS counter
let frameCount = 0;
let lastTime = performance.now();

function checkFPS() {
    const now = performance.now();
    if (now >= lastTime + 1000) {
        console.log('FPS:', frameCount);
        frameCount = 0;
        lastTime = now;
    }
    frameCount++;
    requestAnimationFrame(checkFPS);
}

checkFPS();
```

---

## Troubleshooting

### Animation Not Showing?
```javascript
// Check if element exists
console.log(element);

// Check if AnimationUtils available
console.log(AnimationUtils);

// Try manually triggering
element.style.animation = 'fadeInUp 300ms ease-out forwards';
```

### Check prefers-reduced-motion
```javascript
const prefersReduced = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
).matches;
console.log('Prefers reduced motion:', prefersReduced);
```

### Monitor Animations
```javascript
// Open DevTools > Elements, select animated element
// Check Animation panel for active animations

// Or in console:
const el = document.querySelector('.animating-element');
console.log(getComputedStyle(el).animation);
```

---

## File Locations

- **Main:** `/c/Users/Conner/Downloads/AuthenticaDetector/index.html`
- **Full Guide:** `ANIMATIONS_GUIDE.md`
- **Examples:** `ANIMATION_EXAMPLES.md`
- **Summary:** `ANIMATIONS_SUMMARY.md`
- **Checklist:** `ANIMATION_INTEGRATION_CHECKLIST.md`
- **This File:** `ANIMATION_QUICK_REFERENCE.md`

---

## One-Liners

```javascript
// Show loading
AnimationUtils.setButtonLoading(btn, true);

// Show success
AnimationUtils.setButtonSuccess(btn);

// Show error
AnimationUtils.setButtonError(btn);

// Celebrate
AnimationUtils.createConfetti();

// Toast
AnimationUtils.showNotification('Done!', 3000, 'success');

// Tooltip
AnimationUtils.showTooltip('Help text', element);

// Cascade list
AnimationUtils.cascadeCards(document.querySelectorAll('.card'));

// Progress
AnimationUtils.updateProgress(bar, 75);

// Score reveal
AnimationUtils.revealScore(el, 87);

// Remove item
AnimationUtils.removeItemAnimated(element);

// Expand
AnimationUtils.expandElement(content);

// Collapse
AnimationUtils.collapseElement(content);

// Badge
AnimationUtils.animateBadgeUnlock(badge);

// Level up
AnimationUtils.animateLevelUp(container);

// Bounce
AnimationUtils.bounceIcon(icon);

// Float
AnimationUtils.addFloatingIcon(icon);

// Pop
AnimationUtils.popIn(element);

// Text
AnimationUtils.revealText(el, 'text');

// Heartbeat
AnimationUtils.addHeartbeat(element);

// Delay
await AnimationUtils.delay(500);
```

---

**Print this page for quick reference!**
**Last Updated:** December 20, 2024
