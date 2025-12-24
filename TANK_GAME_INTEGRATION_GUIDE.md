# Tank Game Wave System Integration Guide

## Overview
This guide explains how to integrate the enhanced wave system with different AI attackers into the tank game (Truth Cannon).

## Files Created
- `tank-game-enhancements.js` - Complete wave system with 5 AI behavior types

## Features Added
1. **Wave System (21+ waves)**
   - Waves 1-5: Basic enemies (slow, single shot)
   - Waves 6-10: Fast enemies (quick movement)
   - Waves 11-15: Heavy enemies (more HP, armor)
   - Waves 16-20: Elite enemies (fast + strong)
   - Waves 21+: Mixed waves with variety

2. **AI Behavior Types**
   - **Standard**: Moves toward player, shoots periodically
   - **Flanker**: Approaches from sides with zigzag pattern
   - **Sniper**: Stays at distance, slow but accurate
   - **Rusher**: Charges directly at player with high speed
   - **Tank**: Slow but heavily armored (2.5x HP)

3. **Wave Announcements**
   - 3-second announcement between waves
   - Shows wave name, enemy count, and coin reward
   - Countdown timer

4. **Scaled Rewards**
   - Wave 1: 12 coins
   - Wave 5: 20 coins
   - Wave 10: 40 coins
   - Wave 15: 70 coins
   - Wave 20: 107 coins
   - Wave 21+: 100+ coins per wave

## Integration Steps

### Step 1: Add Script Tag
Add this line after `tank-shooter-enhanced.js`:

```html
<script src="tank-game-enhancements.js"></script>
```

Location: Around line 7545 in index.html

### Step 2: Modify Game State Initialization
In the `startTruthCannon` function (around line 13007), add wave tracking:

```javascript
// Reset game state
gameState = {
    running: true,
    wave: 1,
    score: 0,
    combo: 1,
    credibility: 100,
    fakesDestroyed: 0,
    cannonX: canvas.width / 2,
    cannonY: canvas.height - 40,
    isPulling: false,
    pullX: canvas.width / 2,
    pullY: canvas.height - 40,
    truthBomb: null,
    bubbles: [],
    particles: [],
    bubbleSpawnTimer: 0,
    waveTimer: 0,
    lastTime: Date.now(),
    enemiesInWave: 0,           // ADD THIS
    enemiesDestroyed: 0,        // ADD THIS
    waveActive: false,           // ADD THIS
    showingWaveAnnouncement: false, // ADD THIS
    waveAnnouncementTimer: 0    // ADD THIS
};
```

### Step 3: Enable Enhanced System
At the end of `startTruthCannon` function (after requestAnimationFrame), add:

```javascript
// Enable enhanced wave system
if (typeof enableEnhancedWaveSystem === 'function') {
    enableEnhancedWaveSystem();
}
```

### Step 4: Modify Enemy Spawning
In `updateBubbles` function (around line 13163-13222), replace the spawn logic:

**OLD CODE:**
```javascript
const spawnInterval = Math.max(GAME_CONFIG.MIN_SPAWN_INTERVAL, GAME_CONFIG.BUBBLE_SPAWN_INTERVAL - gameState.wave * 100);
if (gameState.bubbleSpawnTimer > spawnInterval && gameState.bubbles.length < GAME_CONFIG.MAX_BUBBLES) {
    gameState.bubbleSpawnTimer = 0;

    const x = GAME_CONFIG.BUBBLE_RADIUS + Math.random() * (canvas.width - GAME_CONFIG.BUBBLE_RADIUS * 2);
    const isFake = Math.random() < Math.min(0.7, 0.3 + gameState.wave * 0.05);

    gameState.bubbles.push(new Bubble(x, -GAME_CONFIG.BUBBLE_RADIUS, isFake));
}
```

**NEW CODE:**
```javascript
// Use enhanced wave system if available
if (typeof WAVE_CONFIGS !== 'undefined' && gameState.waveActive) {
    const waveConfig = WAVE_CONFIGS.getWaveConfig(gameState.wave);
    const spawnInterval = waveConfig.spawnInterval;

    if (gameState.bubbleSpawnTimer > spawnInterval && gameState.bubbles.length < GAME_CONFIG.MAX_BUBBLES) {
        gameState.bubbleSpawnTimer = 0;

        const newBubble = spawnEnhancedBubble(canvas, gameState.wave);
        if (newBubble) {
            gameState.bubbles.push(newBubble);
        }
    }
} else {
    // Fallback to original spawning
    const spawnInterval = Math.max(GAME_CONFIG.MIN_SPAWN_INTERVAL, GAME_CONFIG.BUBBLE_SPAWN_INTERVAL - gameState.wave * 100);
    if (gameState.bubbleSpawnTimer > spawnInterval && gameState.bubbles.length < GAME_CONFIG.MAX_BUBBLES) {
        gameState.bubbleSpawnTimer = 0;

        const x = GAME_CONFIG.BUBBLE_RADIUS + Math.random() * (canvas.width - GAME_CONFIG.BUBBLE_RADIUS * 2);
        const isFake = Math.random() < Math.min(0.7, 0.3 + gameState.wave * 0.05);

        gameState.bubbles.push(new Bubble(x, -GAME_CONFIG.BUBBLE_RADIUS, isFake));
    }
}
```

### Step 5: Update Bubble Update Calls
In `updateBubbles` function, change bubble update to pass gameState:

**OLD CODE:**
```javascript
gameState.bubbles.forEach(bubble => bubble.update(canvas));
```

**NEW CODE:**
```javascript
gameState.bubbles.forEach(bubble => {
    if (bubble.update.length > 1) {
        bubble.update(canvas, gameState); // Enhanced bubbles
    } else {
        bubble.update(canvas); // Original bubbles
    }
});
```

### Step 6: Modify Collision Detection for HP System
In `checkCollisions` function (around line 13264-13280), modify hit detection:

**OLD CODE:**
```javascript
if (distance < bomb.radius + bubble.radius) {
    // HIT!
    bubble.active = false;
    bomb.active = false;

    if (bubble.isFake) {
        // Destroyed a fake - GOOD!
        gameState.fakesDestroyed++;
        gameState.score += GAME_CONFIG.POINTS_PER_FAKE * gameState.combo;
        gameState.combo = Math.min(gameState.combo + 0.5, 5);
        createExplosion(bubble.x, bubble.y, '#ff4478');

        // Screen shake
        if (navigator.vibrate) navigator.vibrate([30, 50, 30]);
    }
```

**NEW CODE:**
```javascript
if (distance < bomb.radius + bubble.radius) {
    // HIT!
    bomb.active = false;

    if (bubble.isFake) {
        // Check if bubble has HP system (enhanced bubble)
        let destroyed = true;
        if (typeof bubble.takeDamage === 'function') {
            destroyed = bubble.takeDamage(1.0);
        }

        if (destroyed) {
            bubble.active = false;
            gameState.fakesDestroyed++;
            gameState.enemiesDestroyed++; // Track for wave completion

            gameState.score += GAME_CONFIG.POINTS_PER_FAKE * gameState.combo;
            gameState.combo = Math.min(gameState.combo + 0.5, 5);
            createExplosion(bubble.x, bubble.y, bubble.behavior ? bubble.behavior.color : '#ff4478');

            // Check wave completion
            if (typeof checkWaveComplete === 'function') {
                checkWaveComplete();
            }

            // Screen shake
            if (navigator.vibrate) navigator.vibrate([30, 50, 30]);
        } else {
            // Damaged but not destroyed
            createExplosion(bubble.x, bubble.y, bubble.behavior.color);
            if (navigator.vibrate) navigator.vibrate(20);
        }
    }
```

### Step 7: Update Game Loop for Wave Announcements
In `gameLoop` function (around line 13120-13157), add wave announcement timer:

Add this after `const deltaTime = ...` line:

```javascript
// Update wave announcement timer
if (gameState.showingWaveAnnouncement) {
    gameState.waveAnnouncementTimer -= deltaTime;
    if (gameState.waveAnnouncementTimer <= 0) {
        gameState.showingWaveAnnouncement = false;
    }
    // Don't update game logic during announcement
    requestAnimationFrame(gameLoop);
    return;
}
```

### Step 8: Modify Game Over to Show Wave Stats
In `gameOver` function (around line 13277-13292), update coin calculation:

**OLD CODE:**
```javascript
// Calculate coins earned
const coinsEarned = Math.floor(gameState.score / 100) + gameState.fakesDestroyed * 2;
```

**NEW CODE:**
```javascript
// Calculate coins earned (bonus for higher waves)
const waveBonus = gameState.wave > 1 ? (gameState.wave - 1) * 5 : 0;
const coinsEarned = Math.floor(gameState.score / 100) + gameState.fakesDestroyed * 2 + waveBonus;
```

## Testing

1. Start the game and verify wave announcement appears
2. Check that different enemy types spawn (different colors/icons/speeds)
3. Test that heavy tanks require multiple hits
4. Verify wave completion triggers coin rewards
5. Confirm wave progression increases difficulty

## Enemy Behavior Reference

| Type | Icon | Speed | HP | Movement | Color |
|------|------|-------|----|----|-------|
| Standard | 🤖 | 1.0x | 1.0x | Straight | Red |
| Flanker | 🦾 | 1.2x | 0.8x | Zigzag | Pink |
| Sniper | 🎯 | 0.6x | 0.7x | Hover | Purple |
| Rusher | 💥 | 1.8x | 0.6x | Charge | Bright Red |
| Tank | 🛡️ | 0.5x | 2.5x | Steady | Dark Gray |

## Wave Progression Table

| Wave | Enemy Count | Enemy Types | Coin Reward |
|------|-------------|-------------|-------------|
| 1 | 10 | Standard | 12 |
| 5 | 18 | Standard | 20 |
| 6 | 14 | Standard, Rusher | 28 |
| 10 | 22 | Standard, Rusher | 40 |
| 11 | 12 | Standard, Tank, Flanker | 50 |
| 15 | 20 | Standard, Tank, Flanker | 70 |
| 16 | 17 | Rusher, Tank, Sniper, Flanker | 83 |
| 20 | 25 | All types (Elite) | 107 |
| 21+ | 20+ | All types (Ultimate) | 100+ |

## Notes

- The system is backward compatible - if integration fails, it falls back to original behavior
- All changes are non-breaking additions
- Wave announcements pause gameplay for strategic planning
- HP bars only show for enemies with >1.0 HP
- Different movement patterns make each wave unique
- Coin rewards scale with difficulty to encourage progression
