# Ready-to-Use HTML Snippets

## Quick Copy-Paste Examples

---

## 1. Add to `<head>` Section

**Location:** Around line 10-15 in index.html

```html
<!-- Enhanced Play Buttons & VERA Interaction System -->
<link rel="stylesheet" href="enhanced-play-buttons.css">
```

---

## 2. Add Before `</body>` Tag

**Location:** Near end of index.html (around line 11500+)

```html
<!-- VERA Interaction System -->
<script src="vera-interactions.js"></script>
```

---

## 3. Tank Shooter PLAY Button

**Find this (around line 6139):**
```html
<button onclick="startTankShooter()" style="width:100%;background:linear-gradient(135deg,#dc2626,#b91c1c);border:none;color:#fff;padding:10px;border-radius:8px;font-weight:800;font-size:12px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px">
    <img src="assets/icons/play.svg" alt="" style="width:16px;height:16px"> PLAY NOW
</button>
```

**Replace with this:**
```html
<button class="game-play-btn danger" onclick="showVERAInteraction('tankShooter')">
    <img src="assets/icons/play.svg" alt="Play">
    PLAY NOW
</button>
```

---

## 4. Veilbreakers Button (Coming Soon)

**Find this (around line 6104):**
```html
<button onclick="showToast('Veilbreakers coming soon! Build your beast army!', 'info')" style="width:100%;background:linear-gradient(135deg,#8b5cf6,#7c3aed);border:none;color:#fff;padding:11px;border-radius:10px;font-weight:800;font-size:13px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;box-shadow:0 4px 20px rgba(139,92,246,0.4)">
    <img src="assets/icons/play.svg" alt="" style="width:16px;height:16px"> COMING SOON
</button>
```

**Replace with this:**
```html
<button class="game-play-btn purple locked" onclick="showVERAInteraction('veilbreakers')">
    <img src="assets/icons/play.svg" alt="Play">
    COMING SOON
</button>
```

---

## 5. Beast Training Button (Coming Soon)

**Find this (around line 6200):**
```html
<button onclick="showToast('Beast Training coming soon!', 'info')" style="width:100%;background:linear-gradient(135deg,rgba(16,185,129,0.3),rgba(5,150,105,0.2));border:1px solid rgba(16,185,129,0.4);color:#6ee7b7;padding:10px;border-radius:8px;font-weight:800;font-size:12px;cursor:pointer">🔒 Coming Q1 2025</button>
```

**Replace with this:**
```html
<button class="game-play-btn green locked" onclick="showVERAInteraction('veilbreakers')">
    <img src="assets/icons/play.svg" alt="Play">
    COMING Q1 2025
</button>
```

---

## 6. Generic Game Button Templates

### Red/Danger Theme (Action Games)
```html
<button class="game-play-btn danger" onclick="yourGameFunction()">
    <img src="assets/icons/play.svg" alt="Play">
    PLAY NOW
</button>
```

### Purple Theme (Collection/RPG Games)
```html
<button class="game-play-btn purple" onclick="yourGameFunction()">
    <img src="assets/icons/play.svg" alt="Play">
    START ADVENTURE
</button>
```

### Green Theme (Training/Peaceful Games)
```html
<button class="game-play-btn green" onclick="yourGameFunction()">
    <img src="assets/icons/play.svg" alt="Play">
    BEGIN TRAINING
</button>
```

### Locked/Coming Soon
```html
<button class="game-play-btn purple locked" onclick="showVERAInteraction('veilbreakers')">
    <img src="assets/icons/play.svg" alt="Play">
    COMING SOON
</button>
```

---

## 7. VERA Interaction Triggers

### Show Welcome to New Users
```html
<script>
// Add to your initialization code
if (!localStorage.getItem('veraWelcomeSeen')) {
    setTimeout(() => {
        showVERAInteraction('welcome');
        localStorage.setItem('veraWelcomeSeen', 'true');
    }, 2000);
}
</script>
```

### Show on First Scan
```html
<script>
// Add to your scan button click handler
function handleScanClick() {
    if (!localStorage.getItem('hasScanned')) {
        showVERAInteraction('firstScan');
    } else {
        // Proceed with scan
        startScan();
    }
}
</script>
```

### Show on Level Up
```html
<script>
// Add to your level up function
function onLevelUp(newLevel) {
    // Update UI
    updateUserLevel(newLevel);

    // Show VERA celebration
    showVERAInteraction('levelUp');

    // Play sound
    if (window.playSound) {
        playSound('levelUp');
    }
}
</script>
```

### Show Shop Introduction
```html
<button onclick="showVERAInteraction('shop')">
    Open Shop
</button>
```

---

## 8. Custom Button Styles (Optional)

### Custom Color Theme
```html
<style>
/* Add to your CSS or inline */
.game-play-btn.custom {
    background: linear-gradient(135deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 50%, #YOUR_COLOR_1 100%);
    box-shadow:
        0 8px 32px rgba(YOUR_R, YOUR_G, YOUR_B, 0.5),
        0 0 0 0 rgba(YOUR_R, YOUR_G, YOUR_B, 0.4);
    animation: customPulse 3s ease-in-out infinite;
}

@keyframes customPulse {
    0%, 100% {
        background-position: 0% 0;
        box-shadow: 0 8px 32px rgba(YOUR_R, YOUR_G, YOUR_B, 0.4);
    }
    50% {
        background-position: 100% 0;
        box-shadow: 0 12px 48px rgba(YOUR_R, YOUR_G, YOUR_B, 0.6);
    }
}

.game-play-btn.custom:hover {
    box-shadow:
        0 16px 64px rgba(YOUR_R, YOUR_G, YOUR_B, 0.7),
        0 0 30px 8px rgba(YOUR_R, YOUR_G, YOUR_B, 0.6);
}
</style>

<button class="game-play-btn custom" onclick="yourFunction()">
    <img src="assets/icons/play.svg" alt="Play">
    YOUR TEXT
</button>
```

---

## 9. Custom VERA Interaction

### Add to vera-interactions.js

```javascript
// Add this to VERA_INTERACTIONS object
myCustomInteraction: {
    title: "Your Custom Title",
    subtitle: "Your subtitle here",
    message: "Your message with <strong>HTML support</strong>!<br><br>You can add multiple paragraphs and formatting.",
    avatar: "assets/icons/your-icon.svg",
    actions: [
        {
            text: "Primary Action",
            type: "primary",
            icon: "🚀",
            callback: () => {
                closeVERAInteraction();
                // Your code here
                alert('Primary action clicked!');
            }
        },
        {
            text: "Secondary Action",
            type: "secondary",
            icon: "ℹ️",
            callback: () => {
                // Your code here
                console.log('Secondary clicked');
            }
        }
    ],
    tips: [
        "First pro tip here",
        "Second pro tip here",
        "Third pro tip here"
    ]
}
```

### Use it in HTML
```html
<button onclick="showVERAInteraction('myCustomInteraction')">
    Show Custom VERA
</button>
```

---

## 10. Complete Example: Game Card with New Button

```html
<!-- Complete game card with enhanced button -->
<div style="border-radius:16px;margin-bottom:14px;overflow:hidden;border:1px solid rgba(220,38,38,0.3);box-shadow:0 6px 24px rgba(0,0,0,0.3)">
    <!-- Hero image -->
    <div class="game-card-hero" style="position:relative;height:100px;background:linear-gradient(135deg,#1a0a0a 0%,#2d1515 50%,#1a0f0f 100%);overflow:hidden">
        <div style="position:absolute;right:-10%;top:-20%;width:50%;height:70%;background:radial-gradient(circle,rgba(220,38,38,0.3) 0%,transparent 70%)"></div>
        <div style="position:absolute;right:16px;top:50%;transform:translateY(-50%)">
            <img src="assets/icons/action-attack.svg" alt="Tank" style="width:70px;height:70px;filter:drop-shadow(0 6px 20px rgba(220,38,38,0.7))">
        </div>
        <div style="position:absolute;left:16px;top:50%;transform:translateY(-50%)">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
                <span style="font-size:16px;font-weight:900;color:#fff">AI Outbreak: Tank Battle</span>
                <span class="feature-badge hot">🔥 HOT</span>
            </div>
            <p style="margin:0;font-size:10px;color:#fca5a5;max-width:200px">Destroy AI fakes in epic tank battles!</p>
        </div>
    </div>

    <!-- Game modes -->
    <div style="padding:10px 14px;background:rgba(0,0,0,0.2);display:flex;gap:6px;flex-wrap:wrap">
        <span style="background:rgba(220,38,38,0.2);padding:4px 8px;border-radius:5px;font-size:9px;font-weight:700;color:#fca5a5;display:inline-flex;align-items:center;gap:4px">
            <img src="assets/icons/map.svg" alt="" style="width:12px;height:12px"> Campaign
        </span>
        <span style="background:rgba(220,38,38,0.2);padding:4px 8px;border-radius:5px;font-size:9px;font-weight:700;color:#fca5a5;display:inline-flex;align-items:center;gap:4px">
            <img src="assets/icons/energy.svg" alt="" style="width:12px;height:12px"> Endless
        </span>
        <span style="background:rgba(220,38,38,0.2);padding:4px 8px;border-radius:5px;font-size:9px;font-weight:700;color:#fca5a5;display:inline-flex;align-items:center;gap:4px">
            <img src="assets/icons/boss.svg" alt="" style="width:12px;height:12px"> Boss Rush
        </span>
    </div>

    <!-- ENHANCED PLAY BUTTON -->
    <div style="padding:10px 14px;background:linear-gradient(180deg,rgba(220,38,38,0.1),rgba(0,0,0,0.4))">
        <button class="game-play-btn danger" onclick="showVERAInteraction('tankShooter')">
            <img src="assets/icons/play.svg" alt="Play">
            PLAY NOW
        </button>
    </div>
</div>
```

---

## 11. Testing Snippets

### Test Button Animations
```html
<!-- Add temporarily to test animations -->
<div style="padding: 20px; max-width: 400px; margin: 20px auto;">
    <h3>Button Animation Test</h3>

    <!-- Red theme -->
    <button class="game-play-btn danger" onclick="alert('Red clicked!')">
        <img src="assets/icons/play.svg" alt="Play">
        RED THEME TEST
    </button>

    <br><br>

    <!-- Purple theme -->
    <button class="game-play-btn purple" onclick="alert('Purple clicked!')">
        <img src="assets/icons/play.svg" alt="Play">
        PURPLE THEME TEST
    </button>

    <br><br>

    <!-- Green theme -->
    <button class="game-play-btn green" onclick="alert('Green clicked!')">
        <img src="assets/icons/play.svg" alt="Play">
        GREEN THEME TEST
    </button>

    <br><br>

    <!-- Locked state -->
    <button class="game-play-btn purple locked">
        <img src="assets/icons/play.svg" alt="Play">
        LOCKED TEST
    </button>
</div>
```

### Test VERA Interactions
```html
<!-- Add temporarily to test VERA -->
<div style="padding: 20px; max-width: 400px; margin: 20px auto;">
    <h3>VERA Interaction Test</h3>

    <button class="game-play-btn purple" onclick="showVERAInteraction('welcome')">
        <img src="assets/icons/nav-vera.svg" alt="VERA">
        TEST WELCOME
    </button>

    <br><br>

    <button class="game-play-btn danger" onclick="showVERAInteraction('tankShooter')">
        <img src="assets/icons/action-attack.svg" alt="Tank">
        TEST TANK INTRO
    </button>

    <br><br>

    <button class="game-play-btn green" onclick="showVERAInteraction('levelUp')">
        <img src="assets/icons/stats.svg" alt="Level">
        TEST LEVEL UP
    </button>
</div>
```

---

## 12. Debug Console Commands

```javascript
// Check if files are loaded
console.log('VERA System:', window.showVERAInteraction ? 'LOADED' : 'NOT LOADED');
console.log('VERA Interactions:', window.VERA_INTERACTIONS ? Object.keys(window.VERA_INTERACTIONS) : 'NOT LOADED');

// Test VERA interaction
showVERAInteraction('welcome');

// Close VERA
closeVERAInteraction();

// Test contextual VERA
showContextualVERA();

// List all available interactions
console.table(Object.keys(window.VERA_INTERACTIONS || {}));
```

---

## 13. Mobile Testing Code

```html
<!-- Add to test mobile responsiveness -->
<style>
.mobile-test-wrapper {
    max-width: 375px;
    margin: 20px auto;
    border: 2px solid #666;
    border-radius: 20px;
    padding: 10px;
    background: #0a0f1e;
}
</style>

<div class="mobile-test-wrapper">
    <h4 style="text-align:center;color:#93c5fd;">iPhone SE Simulation</h4>

    <button class="game-play-btn danger" onclick="showVERAInteraction('tankShooter')">
        <img src="assets/icons/play.svg" alt="Play">
        PLAY NOW
    </button>

    <p style="text-align:center;font-size:11px;color:#666;margin-top:10px;">
        Tap the button to test mobile interaction
    </p>
</div>
```

---

## Quick Integration Checklist

```
☐ 1. Add CSS file to <head>
☐ 2. Add JS file before </body>
☐ 3. Replace Tank Shooter button
☐ 4. Replace Veilbreakers button
☐ 5. Replace Beast Training button
☐ 6. Test on desktop (hover, click)
☐ 7. Test on mobile (tap, size)
☐ 8. Test VERA modal (open, close, actions)
☐ 9. Clear browser cache
☐ 10. Deploy to production
```

---

## Support

If something doesn't work:
1. Check browser console for errors
2. Verify CSS and JS files are loading
3. Clear browser cache (Ctrl+F5)
4. Check integration guide for details
5. Review troubleshooting section

---

**Ready to use!** Just copy and paste the snippets above.
