// ============================================================
// TANK GAME WAVE & AI ENHANCEMENTS
// Enhanced wave system with different enemy types and behaviors
// ============================================================

// Wave Configuration System
const WAVE_CONFIGS = {
    // Waves 1-5: Basic enemies (slow, single shot)
    getWaveConfig(waveNum) {
        if (waveNum <= 5) {
            return {
                name: `Wave ${waveNum} - Basic Assault`,
                enemyCount: 8 + waveNum * 2,
                enemyTypes: [
                    { type: 'standard', weight: 1.0 }
                ],
                spawnInterval: 2200 - waveNum * 100,
                announcement: `Wave ${waveNum}: Basic AI Detected`,
                coinReward: 10 + waveNum * 2
            };
        }
        // Waves 6-10: Fast enemies
        else if (waveNum <= 10) {
            return {
                name: `Wave ${waveNum} - Speed Attack`,
                enemyCount: 12 + (waveNum - 5) * 2,
                enemyTypes: [
                    { type: 'standard', weight: 0.3 },
                    { type: 'rusher', weight: 0.7 }
                ],
                spawnInterval: 1800 - (waveNum - 5) * 80,
                announcement: `Wave ${waveNum}: Fast Attackers Incoming!`,
                coinReward: 25 + (waveNum - 5) * 3
            };
        }
        // Waves 11-15: Heavy enemies (more HP, armor)
        else if (waveNum <= 15) {
            return {
                name: `Wave ${waveNum} - Heavy Assault`,
                enemyCount: 10 + (waveNum - 10) * 2,
                enemyTypes: [
                    { type: 'standard', weight: 0.2 },
                    { type: 'tank', weight: 0.6 },
                    { type: 'flanker', weight: 0.2 }
                ],
                spawnInterval: 2000,
                announcement: `Wave ${waveNum}: Armored Units Detected!`,
                coinReward: 45 + (waveNum - 10) * 5
            };
        }
        // Waves 16-20: Elite enemies (fast + strong)
        else if (waveNum <= 20) {
            return {
                name: `Wave ${waveNum} - Elite Force`,
                enemyCount: 15 + (waveNum - 15) * 2,
                enemyTypes: [
                    { type: 'rusher', weight: 0.3 },
                    { type: 'tank', weight: 0.3 },
                    { type: 'sniper', weight: 0.2 },
                    { type: 'flanker', weight: 0.2 }
                ],
                spawnInterval: 1600,
                announcement: `Wave ${waveNum}: ELITE FORCES!`,
                coinReward: 75 + (waveNum - 15) * 8
            };
        }
        // Waves 21+: Mixed waves with variety
        else {
            const varietyLevel = Math.min(waveNum - 20, 10);
            return {
                name: `Wave ${waveNum} - Ultimate Challenge`,
                enemyCount: 20 + varietyLevel * 3,
                enemyTypes: [
                    { type: 'standard', weight: 0.15 },
                    { type: 'rusher', weight: 0.25 },
                    { type: 'tank', weight: 0.25 },
                    { type: 'sniper', weight: 0.15 },
                    { type: 'flanker', weight: 0.20 }
                ],
                spawnInterval: Math.max(1200, 1800 - varietyLevel * 60),
                announcement: `Wave ${waveNum}: CHAOS MODE ACTIVATED`,
                coinReward: 100 + varietyLevel * 10
            };
        }
    }
};

// Enemy AI Behavior Types
const ENEMY_BEHAVIORS = {
    // Standard: Moves toward player, shoots periodically
    standard: {
        name: 'Standard Bot',
        speedMultiplier: 1.0,
        hpMultiplier: 1.0,
        color: '#ff4478',
        icon: '🤖',
        wobbleSpeed: 0.05,
        movementPattern: 'straight'
    },

    // Flanker: Tries to approach from sides
    flanker: {
        name: 'Flanker',
        speedMultiplier: 1.2,
        hpMultiplier: 0.8,
        color: '#ff6b9d',
        icon: '🦾',
        wobbleSpeed: 0.12,
        movementPattern: 'zigzag'
    },

    // Sniper: Stays at distance, accurate shots (slow movement)
    sniper: {
        name: 'Sniper',
        speedMultiplier: 0.6,
        hpMultiplier: 0.7,
        color: '#9b59b6',
        icon: '🎯',
        wobbleSpeed: 0.03,
        movementPattern: 'hover'
    },

    // Rusher: Charges directly at player
    rusher: {
        name: 'Rusher',
        speedMultiplier: 1.8,
        hpMultiplier: 0.6,
        color: '#e74c3c',
        icon: '💥',
        wobbleSpeed: 0.18,
        movementPattern: 'charge'
    },

    // Tank: Slow but heavily armored
    tank: {
        name: 'Heavy Tank',
        speedMultiplier: 0.5,
        hpMultiplier: 2.5,
        color: '#34495e',
        icon: '🛡️',
        wobbleSpeed: 0.02,
        movementPattern: 'steady'
    }
};

// Enhanced Bubble Class with AI Behavior
class EnhancedBubble {
    constructor(x, y, isFake, behaviorType = 'standard', wave = 1) {
        this.x = x;
        this.y = y;
        this.startX = x;
        const behavior = ENEMY_BEHAVIORS[behaviorType] || ENEMY_BEHAVIORS.standard;

        this.vy = GAME_CONFIG.BUBBLE_SPEED_BASE * (0.8 + Math.random() * 0.4) * behavior.speedMultiplier;
        this.vx = 0; // Horizontal velocity for movement patterns

        this.radius = GAME_CONFIG.BUBBLE_RADIUS;
        this.isFake = isFake;
        this.active = true;
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = behavior.wobbleSpeed;

        // AI behavior properties
        this.behaviorType = behaviorType;
        this.behavior = behavior;
        this.hp = behavior.hpMultiplier; // HP system (1.0 = normal, 2.5 = tank)
        this.maxHp = behavior.hpMultiplier;
        this.wave = wave;
        this.movementTimer = 0;
    }

    update(canvas, gameState) {
        if (!this.active) return;

        // Speed increases with wave but caps at MAX_WAVE_SPEED_MULT
        const speedMultiplier = Math.min(1 + gameState.wave * 0.1, GAME_CONFIG.MAX_WAVE_SPEED_MULT);

        // Apply movement pattern based on behavior type
        this.movementTimer += 0.016; // Assuming 60fps

        switch (this.behavior.movementPattern) {
            case 'straight':
                // Standard straight down movement
                this.y += this.vy * speedMultiplier;
                this.wobble += this.wobbleSpeed;
                this.x = this.startX + Math.sin(this.wobble) * 0.5;
                break;

            case 'zigzag':
                // Flanker: Zigzag pattern
                this.y += this.vy * speedMultiplier;
                this.wobble += this.wobbleSpeed;
                this.x = this.startX + Math.sin(this.wobble) * 40;
                break;

            case 'hover':
                // Sniper: Slow descent with hovering
                this.y += this.vy * speedMultiplier * 0.5;
                this.wobble += this.wobbleSpeed;
                this.x = this.startX + Math.sin(this.wobble * 0.5) * 15;
                break;

            case 'charge':
                // Rusher: Direct charge with slight wobble
                this.y += this.vy * speedMultiplier * 1.5;
                this.wobble += this.wobbleSpeed;
                this.x = this.startX + Math.sin(this.wobble) * 5;
                break;

            case 'steady':
                // Tank: Slow, steady, minimal wobble
                this.y += this.vy * speedMultiplier * 0.7;
                this.wobble += this.wobbleSpeed;
                this.x = this.startX + Math.sin(this.wobble) * 2;
                break;
        }

        // Reached bottom
        if (this.y > canvas.height - this.radius) {
            this.active = false;
            if (this.isFake) {
                loseCredibility(GAME_CONFIG.CREDIBILITY_LOSS_FAKE_REACH_BOTTOM);
            }
        }
    }

    draw(ctx) {
        if (!this.active) return;

        // HP bar for enemies with more than 1 HP
        if (this.maxHp > 1.0) {
            const hpBarWidth = this.radius * 2;
            const hpBarHeight = 4;
            const hpX = this.x - this.radius;
            const hpY = this.y - this.radius - 10;

            // Background
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(hpX, hpY, hpBarWidth, hpBarHeight);

            // HP fill
            const hpPercent = this.hp / this.maxHp;
            const hpColor = hpPercent > 0.6 ? '#2ecc71' : hpPercent > 0.3 ? '#f39c12' : '#e74c3c';
            ctx.fillStyle = hpColor;
            ctx.fillRect(hpX, hpY, hpBarWidth * hpPercent, hpBarHeight);
        }

        // Glow (use behavior color)
        const glowColor = this.isFake ? `${this.behavior.color}50` : 'rgba(68, 255, 120, 0.3)';
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 1.5);
        gradient.addColorStop(0, glowColor);
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Bubble body
        ctx.fillStyle = this.isFake ? `${this.behavior.color}99` : 'rgba(68, 255, 120, 0.6)';
        ctx.strokeStyle = this.isFake ? this.behavior.color : '#44ff78';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Icon (use behavior icon)
        ctx.fillStyle = '#fff';
        ctx.font = '24px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.isFake ? this.behavior.icon : '📷', this.x, this.y);

        // Glitchy effect for fakes
        if (this.isFake && Math.random() > 0.9) {
            ctx.fillStyle = `${this.behavior.color}50`;
            ctx.fillRect(this.x - this.radius, this.y - 2, this.radius * 2, 4);
        }
    }

    takeDamage(amount = 1.0) {
        this.hp -= amount;
        return this.hp <= 0;
    }
}

// Wave announcement system
function showWaveAnnouncement(waveConfig) {
    gameState.showingWaveAnnouncement = true;
    gameState.waveAnnouncementTimer = 3000; // Show for 3 seconds

    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Store original animation frame
    const originalGameLoop = window.gameLoopFunction;

    // Override with announcement screen
    function announcementLoop() {
        if (!gameState.showingWaveAnnouncement) {
            // Resume normal game
            if (originalGameLoop) requestAnimationFrame(originalGameLoop);
            return;
        }

        // Draw announcement
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Wave title
        ctx.fillStyle = '#1abc9c';
        ctx.font = 'bold 48px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(waveConfig.announcement, canvas.width / 2, canvas.height / 2 - 40);

        // Wave details
        ctx.fillStyle = '#ecf0f1';
        ctx.font = '24px sans-serif';
        ctx.fillText(`${waveConfig.enemyCount} Enemies`, canvas.width / 2, canvas.height / 2 + 20);
        ctx.fillText(`Reward: ${waveConfig.coinReward} coins`, canvas.width / 2, canvas.height / 2 + 60);

        // Countdown
        const secondsLeft = Math.ceil(gameState.waveAnnouncementTimer / 1000);
        ctx.fillStyle = '#f39c12';
        ctx.font = 'bold 36px sans-serif';
        ctx.fillText(`Starting in ${secondsLeft}...`, canvas.width / 2, canvas.height / 2 + 120);

        requestAnimationFrame(announcementLoop);
    }

    announcementLoop();
}

// Start new wave
function startNewWave() {
    const waveConfig = WAVE_CONFIGS.getWaveConfig(gameState.wave);

    gameState.enemiesInWave = waveConfig.enemyCount;
    gameState.enemiesDestroyed = 0;
    gameState.waveActive = true;
    gameState.bubbles = []; // Clear existing enemies

    // Show announcement
    showWaveAnnouncement(waveConfig);
}

// Check if wave is complete
function checkWaveComplete() {
    if (!gameState.waveActive) return;

    // Wave complete when all enemies destroyed and no more on screen
    if (gameState.enemiesDestroyed >= gameState.enemiesInWave && gameState.bubbles.length === 0) {
        completeWave();
    }
}

// Complete current wave
function completeWave() {
    const waveConfig = WAVE_CONFIGS.getWaveConfig(gameState.wave);

    // Award coins
    const coinsEarned = waveConfig.coinReward;
    if (user && userProgression) {
        userProgression.truth_coins = (userProgression.truth_coins || 0) + coinsEarned;
        saveUserProgression();
        updateCoinsDisplay();
    }

    // Show completion message
    toast(`Wave ${gameState.wave} Complete! +${coinsEarned} coins`, 'success');

    // Increment wave
    gameState.wave++;
    gameState.waveActive = false;

    // Restore some credibility as bonus
    gameState.credibility = Math.min(100, gameState.credibility + 10);
    updateGameUI();

    // Start next wave after delay
    setTimeout(() => {
        if (gameState.running) {
            startNewWave();
        }
    }, 2000);
}

// Enhanced spawn function with AI types
function spawnEnhancedBubble(canvas, wave) {
    const waveConfig = WAVE_CONFIGS.getWaveConfig(wave);

    // Don't spawn more than wave limit
    if (gameState.enemiesDestroyed + gameState.bubbles.filter(b => b.isFake).length >= gameState.enemiesInWave) {
        return null;
    }

    const x = GAME_CONFIG.BUBBLE_RADIUS + Math.random() * (canvas.width - GAME_CONFIG.BUBBLE_RADIUS * 2);
    const isFake = Math.random() < Math.min(0.7, 0.3 + wave * 0.05);

    // Select behavior type based on wave config
    let behaviorType = 'standard';
    if (isFake) {
        const rand = Math.random();
        let cumulative = 0;

        for (const enemyType of waveConfig.enemyTypes) {
            cumulative += enemyType.weight;
            if (rand <= cumulative) {
                behaviorType = enemyType.type;
                break;
            }
        }
    }

    return new EnhancedBubble(x, -GAME_CONFIG.BUBBLE_RADIUS, isFake, behaviorType, wave);
}

// Integration function - call this to enable enhanced system
function enableEnhancedWaveSystem() {
    console.log('[TankGame] Enabling enhanced wave system with AI behaviors...');

    // Replace the Bubble class globally
    window.Bubble = EnhancedBubble;

    // Start first wave
    startNewWave();

    console.log('[TankGame] Enhanced wave system active!');
}

// Export functions for integration
window.enableEnhancedWaveSystem = enableEnhancedWaveSystem;
window.startNewWave = startNewWave;
window.checkWaveComplete = checkWaveComplete;
window.spawnEnhancedBubble = spawnEnhancedBubble;
window.WAVE_CONFIGS = WAVE_CONFIGS;
window.ENEMY_BEHAVIORS = ENEMY_BEHAVIORS;
