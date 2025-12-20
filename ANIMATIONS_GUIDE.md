# Animation & Micro-Interactions Guide

## Overview

This document describes the comprehensive animation system built into AuthenticaDetector. All animations are optimized for 150-300ms durations, smooth motion curves, and full support for users who prefer reduced motion.

## Quick Start

All animations are automatically initialized. Use the global `AnimationUtils` object to trigger animations programmatically.

```javascript
// Show loading state
AnimationUtils.setButtonLoading(button, true);

// Show success
AnimationUtils.setButtonSuccess(button, 'Scan Complete!');

// Create confetti celebration
AnimationUtils.createConfetti(30);
```

---

## 1. Page Transitions

### Fade + Slide Animations

When users navigate between views, smooth transitions occur automatically:

```css
/* Automatic on view activation */
.view.active {
    animation: fadeInUp 300ms ease-out forwards;
}
```

**Available Animations:**
- `fadeInUp` - Fade in while sliding up (300ms)
- `fadeOutDown` - Fade out while sliding down (300ms)
- `slideInRight` - Slide in from right (300ms)
- `slideOutLeft` - Slide out to left (300ms)
- `fadeIn` / `fadeOut` - Simple opacity fade (300ms)

### Usage

```javascript
// Manual control if needed
AnimationUtils.fadeInView(viewElement);
AnimationUtils.fadeOutView(viewElement);
```

### Loading Skeletons

Show placeholder skeletons while data loads:

```html
<!-- Create skeleton loaders -->
<div id="loader"></div>

<script>
    const loader = document.getElementById('loader');
    loader.appendChild(AnimationUtils.createSkeleton());
    loader.appendChild(AnimationUtils.createSkeletonBar());
</script>
```

**CSS Classes:**
- `.skeleton` - Base skeleton with shimmer effect
- `.skeleton-bar` - Bar-shaped skeleton (12px height)
- `.skeleton-text` - Text-like skeleton (16px height)
- `.skeleton-circle` - Circle skeleton (40px)

---

## 2. Button Interactions

### Hover State (Scale 1.02, Lift Shadow)

All buttons automatically get smooth hover effects:

```css
button:hover:not(:disabled) {
    transform: scale(1.02);
    box-shadow: var(--shadow-glow);
    transition: 150ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

### Active State (Scale 0.98, Depress)

```css
button:active:not(:disabled) {
    transform: scale(0.98);
    transition: 150ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

### Loading State with Spinner

```javascript
// Start loading
AnimationUtils.setButtonLoading(button, true);

// Stop loading
AnimationUtils.setButtonLoading(button, false);
```

HTML Result:
```html
<button class="btn-loading">
    <span class="btn-spinner"></span> Loading...
</button>
```

### Success State with Checkmark

```javascript
AnimationUtils.setButtonSuccess(button, 'Scan Complete!');
```

- Shows green background
- Displays checkmark icon
- Auto-resets after 2 seconds

### Error State with Shake

```javascript
AnimationUtils.setButtonError(button, 'Failed to scan');
```

- Shows red background
- Triggers shake animation (400ms)
- Auto-resets after 2.5 seconds

---

## 3. Scan Progress Animations

### Animated Progress Bar with Gradient

Progress bar automatically flows during scans:

```html
<div class="progress-bar" id="progressBar" style="width:0%"></div>
```

```javascript
// Update progress
AnimationUtils.updateProgress(progressBar, 45); // 45%
```

**Features:**
- Gradient background that flows left to right
- Smooth width transitions (300ms)
- Infinite animation cycle during loading

### Pulsing Scan Indicator

```javascript
const indicator = AnimationUtils.addScanIndicator(container);
```

Creates a pulsing 🔍 icon that scales up and down at 1.5s interval.

### Module Completion Checkmarks

```javascript
AnimationUtils.animateCheckmark(element);
```

- Scales in horizontally with bouncy easing
- Duration: 400ms
- Perfect for marking completed analysis modules

### Score Reveal Animation

Count up to final score with animation:

```javascript
AnimationUtils.revealScore(scoreElement, 87); // Counts up to 87%
```

- Smooth scale and translate in
- Animated number counter
- Duration: 600ms

---

## 4. List/Card Animations

### Staggered Entry (Cascade Effect)

Cards automatically cascade in sequence:

```html
<div class="card-cascade">Card 1</div>
<div class="card-cascade">Card 2</div>
<div class="card-cascade">Card 3</div>
```

**Stagger Pattern:**
- Card 1: 0ms delay
- Card 2: 60ms delay
- Card 3: 120ms delay
- Card 4: 180ms delay
- Card 5: 240ms delay
- Card 6+: 300ms delay

**Duration:** 400ms each

### Hover Lift on Cards

Cards automatically lift on hover:

```html
<div class="card-lift">Hover over me!</div>
```

```javascript
// Manual application
AnimationUtils.addCardLift(card);
```

- Lifts 6px upward
- Enhanced box-shadow glow
- Duration: 250ms

### Smooth Expand/Collapse

```javascript
// Expand with animation
AnimationUtils.expandElement(element);

// Collapse with animation
AnimationUtils.collapseElement(element);
```

- Smooth height change from 0 to content height
- Opacity fade in/out
- Duration: 300ms

### Delete/Remove Animations

```javascript
AnimationUtils.removeItemAnimated(element, () => {
    console.log('Item removed!');
});
```

- Slides out to right and fades
- Auto-removes DOM element after animation
- Duration: 300ms

---

## 5. Celebratory Moments

### Badge Unlock Animation

```javascript
AnimationUtils.animateBadgeUnlock(badgeElement);
```

**Effect:**
- Rotates 180° while scaling from 0 to 1
- Creates confetti burst
- Duration: 600ms
- Bouncy easing for delight

### Level Up Animation

```javascript
AnimationUtils.animateLevelUp(container);
```

Creates floating "⬆️ Level Up!" text with pulse effect:
- Scales from 0.8 to 1.15 then back to 1
- Duration: 600ms
- Auto-removes after animation

### High Accuracy Result (Success Burst)

```javascript
AnimationUtils.createSuccessBurst(resultElement);
```

- Exploding checkmark effect
- Scales outward with opacity fade
- Duration: 500ms

### Leaderboard Rank Up

```javascript
AnimationUtils.animateRankUp(leaderboardRow);
```

- Glowing box-shadow pulse
- Duration: 800ms
- Highlights rank progression

### Confetti Celebration

```javascript
// Standard confetti (30 pieces)
AnimationUtils.createConfetti();

// Custom amount and origin
AnimationUtils.createConfetti(50, 0.5, 0.5);
```

**Parameters:**
- `count` - Number of confetti pieces (default: 30)
- `originX` - Horizontal origin (0-1, default: 0.5)
- `originY` - Vertical origin (0-1, default: 0.5)

**Features:**
- Radiates from origin point
- Rotates during flight
- Auto-cleanup after 800ms
- Uses theme colors

---

## 6. Subtle Details

### Tooltip Fade-In

```javascript
AnimationUtils.showTooltip('Great scan!', element);

// Hide tooltip
AnimationUtils.hideTooltip();
```

**Features:**
- Auto-positions above trigger element
- Fade-in animation (200ms)
- Styled with theme colors

### Icon Hover Effects

```javascript
AnimationUtils.bounceIcon(iconElement);
```

- Vertical bounce animation
- Drop shadow glow effect
- Duration: 400ms

### Floating Icons

```javascript
AnimationUtils.addFloatingIcon(element);
```

- Continuous up/down float animation
- Duration: 3s per cycle
- Good for decorative elements

### Input Focus Glow

Inputs automatically glow on focus:

```css
input:focus {
    box-shadow: 0 0 0 3px var(--primary-glow) !important;
    animation: focusGlow 300ms ease-out;
    border-color: var(--primary) !important;
}
```

- Pulse outward glow effect
- Primary color border highlight
- Duration: 300ms

### Notification Slide-In

```javascript
AnimationUtils.showNotification('Scan complete!', 3000, 'success');
```

**Types:**
- `'success'` - Green background
- `'error'` - Red background
- `'warning'` - Orange background
- `'info'` - Purple background (default)

**Duration:** 3000ms (auto-dismisses)

Notification slides in from right, auto-slides out after duration.

### Loading Spinner

```javascript
const spinner = AnimationUtils.createSpinner('md');
container.appendChild(spinner);
```

**Sizes:**
- `'sm'` - 16px spinner
- `'md'` - 24px spinner (default)
- `'lg'` - 40px spinner

Creates rotating border-top spinner effect.

---

## 7. Utility Animations

### Heartbeat Effect

```javascript
AnimationUtils.addHeartbeat(element);
```

- Pulse scale animation
- Grabs attention
- Duration: 600ms

### Text Reveal

```javascript
AnimationUtils.revealText(element, 'New text');
```

- Horizontal clip-path reveal
- Fade in effect
- Duration: 400ms

### Pop-In Animation

```javascript
AnimationUtils.popIn(element);
```

- Scales from 0.8 with overshoot
- Opacity fade in
- Duration: 300ms

### Smooth Transitions

```javascript
AnimationUtils.smoothTransition(element);
```

Adds `transition: all 200ms ease-out` to any element.

---

## CSS Classes Reference

### Animation Classes

| Class | Effect | Duration |
|-------|--------|----------|
| `.card-cascade` | Staggered cascade in | 400ms |
| `.card-lift` | Hover lift effect | 250ms |
| `.collapse-enter` | Smooth expand | 300ms |
| `.collapse-exit` | Smooth collapse | 300ms |
| `.item-remove` | Slide out remove | 300ms |
| `.item-delete-fade` | Fade scale remove | 300ms |
| `.badge-unlock` | Badge pop with bounce | 600ms |
| `.level-up` | Level up pulse | 600ms |
| `.success-burst` | Exploding effect | 500ms |
| `.rank-up` | Glow pulse | 800ms |
| `.float` | Floating bob | 3s loop |
| `.heartbeat` | Pulse scale | 600ms |
| `.text-reveal` | Clip-path reveal | 400ms |
| `.pop-in` | Pop scale-in | 300ms |
| `.skeleton` | Shimmer effect | 2s loop |
| `.btn-spinner` | Rotating spinner | 600ms |
| `.spinner` | Border-top spinner | 800ms |

### Delay Classes

For staggering animations in sequences:

```html
<div class="my-animation delay-1">First (100ms delay)</div>
<div class="my-animation delay-2">Second (200ms delay)</div>
<div class="my-animation delay-3">Third (300ms delay)</div>
<div class="my-animation delay-4">Fourth (400ms delay)</div>
<div class="my-animation delay-5">Fifth (500ms delay)</div>
```

---

## Advanced Usage

### Chaining Animations

```javascript
async function scanSequence() {
    // Show loading spinner
    const spinner = AnimationUtils.createSpinner();
    container.appendChild(spinner);

    // Wait for scan
    await AnimationUtils.delay(3000);

    // Remove spinner
    spinner.remove();

    // Show confetti
    AnimationUtils.createConfetti(30);

    // Animate success
    AnimationUtils.setButtonSuccess(scanButton, 'Complete!');
}

scanSequence();
```

### Sequence Animation

```javascript
const elements = document.querySelectorAll('.quest-card');

// Cascade all quest cards in
await animateSequence(elements, 'cascadeIn', 400, 100);
```

### Custom Timings

```javascript
// Create custom animation
element.style.animation = 'fadeInUp 500ms ease-in-out forwards';

// Or use helper
animate(element, 'fadeInUp', 500);
```

---

## Performance Tips

1. **Use CSS animations over JS** when possible - they run on GPU
2. **Reduce confetti count** on low-end devices:
   ```javascript
   const count = navigator.deviceMemory < 4 ? 15 : 30;
   AnimationUtils.createConfetti(count);
   ```

3. **Cache animated elements**:
   ```javascript
   const cards = document.querySelectorAll('.card');
   AnimationUtils.cascadeCards(cards);
   ```

4. **Batch animations** rather than triggering individually

---

## Accessibility: Prefers-Reduced-Motion

The animation system fully respects user preferences:

```css
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
```

**For users with `prefers-reduced-motion`:**
- All animations run instantly (0.01ms)
- Only 1 iteration
- Transitions become immediate
- UI remains fully functional

---

## Color Palette for Animations

Animations use the theme's color variables:

```css
--primary: #00d4aa        /* Teal - main theme */
--secondary: #6366f1      /* Purple - accent */
--danger: #ff4757         /* Red - errors */
--warning: #ffa502        /* Orange - warnings */
--success: #2ed573        /* Green - success */
```

---

## Motion Curves Used

**Fast & Energetic:**
```css
cubic-bezier(0.34, 1.56, 0.64, 1)  /* Bouncy overshoot */
```

**Smooth & Natural:**
```css
ease-out                            /* Natural deceleration */
ease-in-out                         /* Smooth both ways */
```

**Linear:**
```css
linear                              /* For continuous spins */
```

---

## Integration with Existing Code

### Hook into Scan Complete

```javascript
const originalHandleScanComplete = window.handleScanComplete;
window.handleScanComplete = function(...args) {
    originalHandleScanComplete.apply(this, args);

    // Add celebration animation
    AnimationUtils.createConfetti();
    AnimationUtils.setButtonSuccess(scanButton, 'Analysis Complete!');
};
```

### Hook into User Actions

```javascript
// Listen for button clicks and add feedback
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'BUTTON' && !e.target.disabled) {
        AnimationUtils.bounceIcon(e.target);
    }
}, true);
```

---

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (iOS 13+)
- Mobile browsers: Full support with `prefers-reduced-motion` support

---

## Timeline Recommendations

**For optimal UX, follow these timing guidelines:**

- **Page transitions:** 300ms
- **Button states:** 150ms (hover), 100ms (active)
- **Progress updates:** 300ms
- **Scan animations:** 400-600ms
- **Celebratory:** 600-800ms
- **Micro-interactions:** 150-200ms

---

## Troubleshooting

### Animation not showing

1. Ensure element has `display: block` or is visible
2. Check browser console for errors
3. Verify CSS is loaded (check `<style>` tag)
4. Use DevTools animation inspector

### Animation too slow/fast

Adjust timing in animation definitions:
```css
.my-element {
    animation: fadeInUp 500ms ease-out;  /* Change 500ms to desired duration */
}
```

### Jank or stuttering

- Reduce confetti count
- Use `transform` and `opacity` instead of position changes
- Enable hardware acceleration: `will-change: transform;`

---

## Examples

### Complete Scan Flow

```javascript
async function completeScan() {
    // 1. Show progress
    AnimationUtils.setButtonLoading(scanBtn);

    // 2. Animate progress bar
    AnimationUtils.updateProgress(progressBar, 0);
    for (let i = 0; i <= 100; i += 5) {
        AnimationUtils.updateProgress(progressBar, i);
        await AnimationUtils.delay(200);
    }

    // 3. Reveal score
    AnimationUtils.revealScore(scoreElement, 87);

    // 4. Celebrate
    AnimationUtils.createConfetti();
    AnimationUtils.setButtonSuccess(scanBtn, 'Complete!');
}
```

### Quest Card List

```javascript
function displayQuests(quests) {
    const container = document.getElementById('quests');

    quests.forEach((quest, i) => {
        const card = createQuestCard(quest);
        card.classList.add('card-cascade');
        card.style.animationDelay = (i * 60) + 'ms';
        container.appendChild(card);
    });
}
```

---

## Future Enhancements

Potential animations to add:
- [ ] Page swipe transitions for mobile
- [ ] Gesture-based animations
- [ ] Parallax scrolling effects
- [ ] SVG path animations
- [ ] Advanced morph animations
- [ ] Spring physics animations

---

**Last Updated:** December 20, 2024
**Version:** 1.0
