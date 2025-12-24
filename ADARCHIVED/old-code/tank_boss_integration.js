// Integration code for Boss System
// Add these changes to the existing game code in index.html

// 1. UPDATE gameState to include boss and bossRushMode
/*
let gameState = {
    running: false,
    wave: 1,
    score: 0,
    combo: 1,
    credibility: 100,
    fakesDestroyed: 0,
    cannonX: 0,
    cannonY: 0,
    isPulling: false,
    pullX: 0,
    pullY: 0,
    truthBomb: null,
    bubbles: [],
    particles: [],
    bubbleSpawnTimer: 0,
    waveTimer: 0,
    lastTime: 0,
    // ADD THESE:
    boss: null,
    bossActive: false,
    bossRushMode: false,
    bossRushIndex: 0
};
*/

// 2. UPDATE updateBubbles function to include boss logic
/*
function updateBubbles(canvas, deltaTime) {
    // Check if boss wave
    if (shouldSpawnBoss(gameState.wave) && !gameState.bossActive && !gameState.boss) {
        // Spawn boss
        const bossType = getBossType(gameState.wave);
        gameState.boss = new Boss(bossType, gameState.wave);
        gameState.bossActive = true;

        // Stop spawning regular bubbles during boss fight
        return;
    }

    // Update boss if active
    if (gameState.boss) {
        gameState.boss.update(canvas, deltaTime);
        if (!gameState.boss.active) {
            // Boss defeated
            if (gameState.boss.dying && gameState.boss.deathAnimationFrame === 60) {
                handleBossDefeated(gameState.boss);
            }
            if (!gameState.boss.active) {
                gameState.boss = null;
                gameState.bossActive = false;

                // In boss rush mode, immediately spawn next boss
                if (gameState.bossRushMode) {
                    spawnNextBossRushBoss();
                }
            }
        }
        return;
    }

    // Regular bubble spawning (existing code)
    gameState.bubbleSpawnTimer += deltaTime;

    const spawnInterval = Math.max(GAME_CONFIG.MIN_SPAWN_INTERVAL, GAME_CONFIG.BUBBLE_SPAWN_INTERVAL - gameState.wave * 100);
    if (gameState.bubbleSpawnTimer > spawnInterval && gameState.bubbles.length < GAME_CONFIG.MAX_BUBBLES) {
        gameState.bubbleSpawnTimer = 0;

        const x = GAME_CONFIG.BUBBLE_RADIUS + Math.random() * (canvas.width - GAME_CONFIG.BUBBLE_RADIUS * 2);
        const isFake = Math.random() < Math.min(0.7, 0.3 + gameState.wave * 0.05);

        gameState.bubbles.push(new Bubble(x, -GAME_CONFIG.BUBBLE_RADIUS, isFake));
    }

    gameState.bubbles.forEach(bubble => bubble.update(canvas));
    gameState.bubbles = gameState.bubbles.filter(b => b.active);
}
*/

// 3. UPDATE drawBubbles to include boss
/*
function drawBubbles(ctx) {
    gameState.bubbles.forEach(bubble => bubble.draw(ctx));

    // Draw boss if active
    if (gameState.boss) {
        gameState.boss.draw(ctx);
    }
}
*/

// 4. UPDATE checkCollisions to include boss hits
/*
function checkCollisions() {
    if (!gameState.truthBomb || !gameState.truthBomb.active) return;

    const bomb = gameState.truthBomb;

    // Check boss collision first
    if (gameState.boss && gameState.boss.active && !gameState.boss.dying) {
        const dx = bomb.x - gameState.boss.x;
        const dy = bomb.y - gameState.boss.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < bomb.radius + gameState.boss.radius) {
            // Hit boss!
            const defeated = gameState.boss.takeDamage(50); // Bomb does 50 damage to boss
            bomb.active = false;

            createExplosion(gameState.boss.x, gameState.boss.y, gameState.boss.color);

            if (defeated) {
                // Boss defeated - will be handled in updateBubbles
                gameState.score += 1000; // Bonus points for boss
            }

            if (navigator.vibrate) navigator.vibrate(100);
            updateGameUI();
            return;
        }
    }

    // Regular bubble collision (existing code)
    for (let i = gameState.bubbles.length - 1; i >= 0; i--) {
        const bubble = gameState.bubbles[i];
        if (!bubble.active) continue;

        const dx = bomb.x - bubble.x;
        const dy = bomb.y - bubble.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < bomb.radius + bubble.radius) {
            bubble.active = false;
            bomb.active = false;

            if (bubble.isFake) {
                gameState.fakesDestroyed++;
                gameState.score += GAME_CONFIG.POINTS_PER_FAKE * gameState.combo;
                gameState.combo = Math.min(gameState.combo + 0.5, 5);
                createExplosion(bubble.x, bubble.y, '#ff4478');

                if (navigator.vibrate) navigator.vibrate([30, 50, 30]);
            } else {
                loseCredibility(GAME_CONFIG.CREDIBILITY_LOSS_REAL_HIT);
                gameState.combo = 1;
                createExplosion(bubble.x, bubble.y, '#44ff78');

                if (navigator.vibrate) navigator.vibrate(100);
            }

            updateGameUI();
            break;
        }
    }
}
*/

// 5. Add boss defeated handler
function handleBossDefeated(boss) {
    // Award coins and XP
    if (user && userProgression) {
        userProgression.truth_coins = (userProgression.truth_coins || 0) + boss.coinsReward;
        saveUserProgression();
        updateCoinsDisplay();
    }

    // Big explosion particles
    for (let i = 0; i < 50; i++) {
        gameState.particles.push(new Particle(boss.x, boss.y, boss.color));
    }

    // Show reward notification
    showBossReward(boss.name, boss.coinsReward, boss.xpReward);

    // Vibrate
    if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100, 50, 200]);
    }

    // Advance wave if not in boss rush
    if (!gameState.bossRushMode) {
        gameState.wave++;
        updateGameUI();
    }
}

// 6. Boss reward notification
function showBossReward(bossName, coins, xp) {
    const reward = document.createElement('div');
    reward.style.cssText = `
        position: fixed;
        top: 20%;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #ffd700, #ff8c00);
        color: #000;
        padding: 20px 40px;
        border-radius: 15px;
        border: 3px solid #fff;
        font-size: 24px;
        font-weight: bold;
        text-align: center;
        z-index: 9999;
        animation: bossRewardAnim 2s ease-out forwards;
        box-shadow: 0 0 30px rgba(255, 215, 0, 0.8);
    `;
    reward.innerHTML = `
        <div style="font-size:16px;margin-bottom:10px">BOSS DEFEATED!</div>
        <div style="margin-bottom:10px">${bossName}</div>
        <div style="font-size:18px">+${coins} 🪙  +${xp} XP</div>
    `;
    document.body.appendChild(reward);

    setTimeout(() => {
        reward.remove();
    }, 2000);
}

// 7. Boss Rush Mode functions
function startBossRushMode() {
    console.log('[TankBattle] Starting Boss Rush Mode');

    const gameContainer = document.getElementById('truthCannonGame');
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 160;

    // Initialize boss rush mode
    gameState = {
        running: true,
        wave: 5, // Start at wave 5 (first boss wave)
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
        boss: null,
        bossActive: false,
        bossRushMode: true,
        bossRushIndex: 0
    };

    gameContainer.style.display = 'flex';
    document.getElementById('gameOverScreen').style.display = 'none';
    updateGameUI();

    // Spawn first boss immediately
    spawnNextBossRushBoss();

    // Start game loop (reuse existing gameLoop or create new one)
    requestAnimationFrame(gameLoop);
}

function spawnNextBossRushBoss() {
    const bossTypes = ['heavy', 'twin', 'siege', 'stealth', 'mega'];

    if (gameState.bossRushIndex >= bossTypes.length) {
        // All bosses defeated!
        showBossRushComplete();
        return;
    }

    const bossType = bossTypes[gameState.bossRushIndex];
    gameState.boss = new Boss(bossType, gameState.wave);
    gameState.bossActive = true;
    gameState.bossRushIndex++;
}

function showBossRushComplete() {
    const complete = document.createElement('div');
    complete.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #ff6b6b, #ffd700);
        color: #fff;
        padding: 40px 60px;
        border-radius: 20px;
        border: 4px solid #fff;
        font-size: 36px;
        font-weight: bold;
        text-align: center;
        z-index: 9999;
        box-shadow: 0 0 50px rgba(255, 215, 0, 1);
    `;
    complete.innerHTML = `
        <div style="font-size:80px;margin-bottom:20px">🏆</div>
        <div>BOSS RUSH COMPLETE!</div>
        <div style="font-size:24px;margin-top:20px">All Bosses Defeated!</div>
        <div style="font-size:20px;margin-top:10px">Score: ${gameState.score.toLocaleString()}</div>
    `;
    document.body.appendChild(complete);

    if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200, 100, 200, 100, 400]);
    }

    setTimeout(() => {
        gameOver();
    }, 4000);
}

// 8. Add Boss Rush button to UI
// Add this HTML to your game UI (near the play button):
/*
<button class="boss-rush-btn" onclick="startBossRushMode()" style="
    width: 100%;
    background: linear-gradient(135deg, #dc2626, #b91c1c);
    border: none;
    color: #fff;
    padding: 15px;
    border-radius: 8px;
    font-weight: 800;
    font-size: 14px;
    cursor: pointer;
    margin-top: 10px;
">
    🏆 BOSS RUSH MODE 🏆
</button>
*/

// CSS animation for boss reward
const style2 = document.createElement('style');
style2.textContent = `
@keyframes bossRewardAnim {
    0% {
        opacity: 0;
        transform: translateX(-50%) translateY(-30px);
    }
    20% {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
    }
    80% {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
    }
    100% {
        opacity: 0;
        transform: translateX(-50%) translateY(30px);
    }
}
`;
document.head.appendChild(style2);

// Export functions for use in main game
window.handleBossDefeated = handleBossDefeated;
window.startBossRushMode = startBossRushMode;
window.spawnNextBossRushBoss = spawnNextBossRushBoss;
