# Animation Implementation Examples

Quick reference for adding animations to common UI patterns in AuthenticaDetector.

---

## Quick Reference

### Most Common Use Cases

```javascript
// Loading state
AnimationUtils.setButtonLoading(button, true);

// Success feedback
AnimationUtils.setButtonSuccess(button, 'Complete!');

// Error feedback
AnimationUtils.setButtonError(button, 'Failed!');

// Celebrate achievement
AnimationUtils.createConfetti();
AnimationUtils.showNotification('Achievement unlocked!', 3000, 'success');

// Toast message
AnimationUtils.showNotification('Scan saved to history', 3000);
```

---

## Example 1: Scan Button with Full Animation Flow

### Current HTML
```html
<button class="deep-btn" onclick="runDeepScan()">
    <div class="scan-btn-title">🔬 Deep Scan</div>
    <div class="scan-btn-desc">Comprehensive AI detection</div>
</button>
```

### Enhanced with Animations
```html
<button class="deep-btn" id="deepScanBtn" onclick="runDeepScan()">
    <div class="scan-btn-title">🔬 Deep Scan</div>
    <div class="scan-btn-desc">Comprehensive AI detection</div>
</button>

<script>
async function runDeepScan() {
    const btn = document.getElementById('deepScanBtn');

    // 1. Show loading spinner
    AnimationUtils.setButtonLoading(btn, true);

    try {
        // 2. Run scan
        await startDeepScan();

        // 3. Show success
        AnimationUtils.setButtonSuccess(btn, 'Analysis Complete!');

        // 4. Celebrate
        AnimationUtils.createConfetti();
        AnimationUtils.showNotification('Scan complete! Check your results.', 4000, 'success');

    } catch (error) {
        // Show error
        AnimationUtils.setButtonError(btn, 'Scan Failed');
        AnimationUtils.showNotification('Error: ' + error.message, 4000, 'error');
    }
}
</script>
```

---

## Example 2: Progress Bar Animation During Scan

### Enhanced Progress Display
```html
<div class="progress-card hidden" id="progressCard">
    <div class="progress-header">
        <div class="progress-title" id="progressTitle">🔍 Analyzing...</div>
        <button class="progress-cancel" onclick="cancelScan()">Cancel</button>
    </div>
    <div class="progress-bar-wrap">
        <div class="progress-bar" id="progressBar" style="width:0%"></div>
    </div>
    <div class="progress-status" id="progressStatus">Initializing...</div>
</div>

<script>
async function analyzeWithAnimation(phases) {
    let currentProgress = 0;

    for (const phase of phases) {
        // Update status message
        document.getElementById('progressStatus').textContent = phase.name;

        // Animate progress bar
        const startProgress = currentProgress;
        const endProgress = phase.progress;
        const steps = 10;
        const stepSize = (endProgress - startProgress) / steps;

        for (let i = 0; i < steps; i++) {
            currentProgress += stepSize;
            AnimationUtils.updateProgress(
                document.getElementById('progressBar'),
                currentProgress
            );
            await AnimationUtils.delay(100);
        }

        // Animate checkmark on phase completion
        const checkmark = document.createElement('span');
        checkmark.textContent = '✓';
        checkmark.className = 'module-checkmark';
        phase.element.appendChild(checkmark);
    }

    // Final animation
    AnimationUtils.updateProgress(document.getElementById('progressBar'), 100);
}
</script>
```

---

## Example 3: Leaderboard Entry Animation

### HTML
```html
<div class="leaderboard-entry" id="userRank">
    <span class="rank">🏆 #1</span>
    <span class="name">Your Username</span>
    <span class="score">9,250 pts</span>
</div>

<script>
function userRankedUp() {
    const rankElement = document.getElementById('userRank');

    // Animate rank up
    AnimationUtils.animateRankUp(rankElement);

    // Show celebration
    AnimationUtils.showNotification('You ranked up! 🎉', 4000, 'success');

    // Confetti burst
    const rect = rankElement.getBoundingClientRect();
    AnimationUtils.createConfetti(
        40,
        rect.left / window.innerWidth,
        rect.top / window.innerHeight
    );
}
</script>
```

---

## Example 4: Badge Unlock Animation

### HTML
```html
<div class="achievement-card">
    <div class="badge-container" id="aiDetectorBadge">
        🤖
    </div>
    <div class="badge-name">AI Detective</div>
    <div class="badge-desc">Detected 100 AI images</div>
</div>

<script>
function unlockBadge(badgeId) {
    const badge = document.getElementById(badgeId);

    // Animate badge unlock
    AnimationUtils.animateBadgeUnlock(badge);

    // Show notification
    AnimationUtils.showNotification('Badge Unlocked: AI Detective! 🎉', 4000, 'success');

    // Add glow effect
    badge.classList.add('success-glow');
}
</script>
```

---

## Example 5: Quest List with Cascade Animation

### HTML
```html
<div id="quests-container" class="quests-list"></div>

<script>
function renderQuests(quests) {
    const container = document.getElementById('quests-container');
    container.innerHTML = ''; // Clear

    quests.forEach((quest, index) => {
        const card = document.createElement('div');
        card.className = 'quest-card card-cascade';
        card.style.animationDelay = (index * 60) + 'ms';
        card.innerHTML = `
            <div class="quest-card-header">
                <div class="quest-title">${quest.title}</div>
                <div class="quest-reward">+${quest.reward} pts</div>
            </div>
            <div class="quest-desc">${quest.description}</div>
            <div class="quest-progress">
                <div class="quest-progress-bar" style="width: ${quest.progress}%"></div>
            </div>
        `;

        container.appendChild(card);
    });
}

// Add card lift to all quest cards
function enhanceQuestCards() {
    document.querySelectorAll('.quest-card').forEach(card => {
        AnimationUtils.addCardLift(card);
    });
}
</script>
```

---

## Example 6: Result Card with Score Reveal

### Enhanced Result Display
```html
<div class="result-card" id="resultCard">
    <div class="result-header">
        <div class="result-icon" id="resultIcon">🤖</div>
        <div class="result-info">
            <div class="result-label" id="resultLabel">Likely AI</div>
            <div class="result-sublabel" id="resultSublabel">Deep Scan</div>
        </div>
    </div>
    <div class="result-score">
        <div class="score-bar">
            <div class="score-fill" id="scoreFill"></div>
        </div>
        <div class="score-value" id="scoreValue">AI Probability: 0%</div>
    </div>
</div>

<script>
async function displayResult(result) {
    const card = document.getElementById('resultCard');

    // Fade in card
    card.classList.remove('hidden');
    AnimationUtils.fadeInView(card);

    // Animate score fill bar
    const scoreFill = document.getElementById('scoreFill');
    scoreFill.style.width = result.probability + '%';

    // Reveal score with animation
    await AnimationUtils.delay(500);
    AnimationUtils.revealScore(
        document.getElementById('scoreValue'),
        Math.round(result.probability)
    );

    // Show success burst if high confidence
    if (result.probability > 85) {
        setTimeout(() => {
            AnimationUtils.createSuccessBurst(card);
            AnimationUtils.createConfetti(20);
        }, 800);
    }
}
</script>
```

---

## Example 7: Level Up Animation

### HTML
```html
<div class="user-level-display" id="levelDisplay">
    <div class="level-number">Level 5</div>
    <div class="level-bar">
        <div class="level-progress" id="levelProgress" style="width: 45%"></div>
    </div>
</div>

<script>
function userLeveledUp(newLevel) {
    const container = document.getElementById('levelDisplay');

    // Animate level up
    AnimationUtils.animateLevelUp(container);

    // Update level display
    document.querySelector('.level-number').textContent = 'Level ' + newLevel;

    // Confetti celebration
    AnimationUtils.createConfetti(50);

    // Show notification
    AnimationUtils.showNotification(
        `Level Up! You reached Level ${newLevel}! 🎊`,
        4000,
        'success'
    );
}
</script>
```

---

## Example 8: History List with Delete Animation

### HTML
```html
<div class="history-list" id="historyList">
    <div class="history-item" data-id="1">
        <span class="history-image">🖼️</span>
        <span class="history-result">Likely Real - 92%</span>
        <button onclick="deleteHistoryItem(this)" class="delete-btn">✕</button>
    </div>
</div>

<script>
function deleteHistoryItem(btn) {
    const item = btn.closest('.history-item');
    const itemId = item.dataset.id;

    // Show confirmation toast
    AnimationUtils.showNotification('Removing from history...', 2000);

    // Animate removal
    AnimationUtils.removeItemAnimated(item, () => {
        // Remove from database
        removeHistoryFromDB(itemId);

        // Show confirmation
        AnimationUtils.showNotification('Removed from history', 2000, 'success');
    });
}
</script>
```

---

## Example 9: Shop Item with Hover and Purchase Animation

### HTML
```html
<div class="shop-item card-lift" id="item-booster">
    <div class="shop-item-icon">⚡</div>
    <div class="shop-item-name">Score Booster</div>
    <div class="shop-item-desc">+20% points for 1 hour</div>
    <button class="shop-item-btn" onclick="purchaseItem(this, 'booster')">
        🎫 100 points
    </button>
</div>

<script>
async function purchaseItem(btn, itemId) {
    // Show loading
    AnimationUtils.setButtonLoading(btn, true);

    try {
        // Process purchase
        await purchaseFromServer(itemId);

        // Show success
        AnimationUtils.setButtonSuccess(btn, 'Purchased! ✓');

        // Animate item glow
        btn.closest('.shop-item').classList.add('success-glow');

        // Celebrate
        AnimationUtils.createConfetti(20);
        AnimationUtils.showNotification('Item purchased!', 3000, 'success');

    } catch (error) {
        AnimationUtils.setButtonError(btn, 'Failed to purchase');
        AnimationUtils.showNotification(error.message, 3000, 'error');
    }
}
</script>
```

---

## Example 10: Loading Skeleton Placeholder

### HTML
```html
<div class="leaderboard-container" id="leaderboard">
    <!-- Skeletons while loading -->
</div>

<script>
async function loadLeaderboard() {
    const container = document.getElementById('leaderboard');

    // Show skeletons
    container.innerHTML = '';
    for (let i = 0; i < 5; i++) {
        const skeleton = document.createElement('div');
        skeleton.className = 'leaderboard-item-skeleton';
        skeleton.innerHTML = `
            <div class="skeleton skeleton-circle" style="width: 40px; height: 40px;"></div>
            <div style="flex: 1;">
                <div class="skeleton skeleton-text" style="width: 120px; margin-bottom: 8px;"></div>
                <div class="skeleton skeleton-bar" style="width: 80px;"></div>
            </div>
        `;
        container.appendChild(skeleton);
    }

    // Fetch data
    const leaderboard = await fetchLeaderboard();

    // Clear skeletons and show content
    container.innerHTML = '';
    leaderboard.forEach((entry, i) => {
        const item = document.createElement('div');
        item.className = 'leaderboard-item card-cascade';
        item.style.animationDelay = (i * 60) + 'ms';
        item.innerHTML = `
            <span class="rank">${entry.rank}</span>
            <span class="name">${entry.name}</span>
            <span class="score">${entry.score}</span>
        `;
        container.appendChild(item);
    });
}
</script>
```

---

## Example 11: Expandable Section Animation

### HTML
```html
<div class="help-section">
    <button class="help-header" onclick="toggleHelp()">
        📖 How to use Deep Scan
        <span class="toggle-icon">▼</span>
    </button>
    <div class="help-content" id="helpContent">
        Deep Scan uses multiple AI detection models...
    </div>
</div>

<script>
let isOpen = false;

function toggleHelp() {
    const content = document.getElementById('helpContent');

    if (isOpen) {
        // Collapse
        AnimationUtils.collapseElement(content);
        isOpen = false;
    } else {
        // Expand
        AnimationUtils.expandElement(content);
        isOpen = true;
    }
}
</script>
```

---

## Example 12: Status Chips with Animation

### HTML
```html
<div class="status-bar" id="statusBar">
    <!-- Status chips rendered here -->
</div>

<script>
function updateStatusBar(statuses) {
    const bar = document.getElementById('statusBar');

    statuses.forEach((status, i) => {
        const chip = document.createElement('button');
        chip.className = `status-chip ${status.type}`;
        chip.textContent = status.icon + ' ' + status.text;
        chip.style.animationDelay = (i * 60) + 'ms';
        chip.classList.add('card-cascade');

        // Add hover effect
        chip.addEventListener('mouseenter', () => {
            AnimationUtils.bounceIcon(chip);
        });

        bar.appendChild(chip);
    });
}
</script>
```

---

## Example 13: Input Focus Animation with Tooltip

### HTML
```html
<input
    type="text"
    id="usernameInput"
    placeholder="Enter username"
    onfocus="onUsernameFocus(this)"
    onblur="onUsernameBlur()"
    class="smooth-transition"
>

<script>
function onUsernameFocus(input) {
    // Show helpful tooltip
    AnimationUtils.showTooltip('Username must be 3+ characters', input);
}

function onUsernameBlur() {
    // Hide tooltip
    AnimationUtils.hideTooltip();
}
</script>
```

---

## Example 14: Floating Icon Animation

### HTML
```html
<div class="upload-hero">
    <div class="upload-icon" id="uploadIcon">📤</div>
    <h1>Upload Image to Scan</h1>
</div>

<script>
// Make upload icon float
AnimationUtils.addFloatingIcon(document.getElementById('uploadIcon'));
</script>
```

---

## Example 15: Notification System Integration

### HTML
```html
<button onclick="testNotifications()">Test Notifications</button>

<script>
function testNotifications() {
    // Success
    AnimationUtils.showNotification(
        'This is a success message! ✓',
        3000,
        'success'
    );

    // Error after 1 second
    setTimeout(() => {
        AnimationUtils.showNotification(
            'This is an error message! ✗',
            3000,
            'error'
        );
    }, 1000);

    // Warning after 2 seconds
    setTimeout(() => {
        AnimationUtils.showNotification(
            'This is a warning message! ⚠️',
            3000,
            'warning'
        );
    }, 2000);

    // Info after 3 seconds
    setTimeout(() => {
        AnimationUtils.showNotification(
            'This is an info message! ℹ️',
            3000,
            'info'
        );
    }, 3000);
}
</script>
```

---

## Animation Timing Patterns

### Fast Feedback (Microsocial)
```javascript
// Immediate button feedback
button.addEventListener('click', () => {
    AnimationUtils.bounceIcon(button);  // 400ms
});
```

### Standard Flow (Page/Component)
```javascript
// Page transition
await AnimationUtils.fadeInView(newView);  // 300ms
```

### Celebration (Achievement)
```javascript
// Achievement unlock
AnimationUtils.animateBadgeUnlock(badge);  // 600ms
AnimationUtils.createConfetti();            // 800ms
```

---

## Performance Considerations

### For Mobile Devices
```javascript
// Reduce confetti on low-end devices
const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);
const confettiCount = isMobile ? 15 : 30;

AnimationUtils.createConfetti(confettiCount);
```

### Disable Animations for Power Users
```javascript
// Check prefers-reduced-motion
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReduced) {
    // Run animations
    AnimationUtils.createConfetti();
}
```

---

## Testing Animations

```javascript
// Test all animations
function testAllAnimations() {
    console.log('Testing animations...');

    // Test button states
    const btn = document.querySelector('button');
    AnimationUtils.setButtonLoading(btn, true);
    setTimeout(() => {
        AnimationUtils.setButtonSuccess(btn);
    }, 1000);

    // Test notifications
    setTimeout(() => {
        AnimationUtils.showNotification('Notification test', 3000, 'success');
    }, 2000);

    // Test confetti
    setTimeout(() => {
        AnimationUtils.createConfetti();
    }, 3000);

    console.log('Animation tests complete!');
}

// Run in console
testAllAnimations();
```

---

## Integration Checklist

When adding animations to a feature:

- [ ] Add loading state feedback
- [ ] Add success/error feedback
- [ ] Add hover animations for interactive elements
- [ ] Use cascade for list items
- [ ] Use tooltips for help text
- [ ] Add celebratory effects for achievements
- [ ] Test on mobile devices
- [ ] Verify `prefers-reduced-motion` support
- [ ] Performance test with DevTools
- [ ] Test on low-end devices

---

**Happy Animating! 🎉**
