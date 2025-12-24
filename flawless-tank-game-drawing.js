// ============================================================
// FLAWLESS TANK GAME - ENHANCED DRAWING & COLLISION SYSTEMS
// Professional visual effects and precise collision detection
// ============================================================

/**
 * ENHANCED CANNON DRAWING with 3D effect and animation
 */
function drawCannon(ctx) {
    const x = gameState.cannonX;
    const y = gameState.cannonY;

    ctx.save();

    // Shadow for depth
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(x, y + 25, 28, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tank base platform
    ctx.fillStyle = '#34495e';
    ctx.beginPath();
    ctx.roundRect(x - 35, y + 10, 70, 15, 5);
    ctx.fill();

    // Base gradient for 3D effect
    const baseGradient = ctx.createLinearGradient(x - 25, y - 5, x - 25, y + 20);
    baseGradient.addColorStop(0, '#3d566e');
    baseGradient.addColorStop(1, '#2c3e50');
    ctx.fillStyle = baseGradient;
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2);
    ctx.fill();

    // Base border
    ctx.strokeStyle = '#1a252f';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Turret (points at pull direction when aiming)
    let barrelAngle = -Math.PI / 2; // Default: pointing up

    if (gameState.isPulling) {
        const dx = gameState.pullX - x;
        const dy = gameState.pullY - y;
        barrelAngle = Math.atan2(dy, dx);
    }

    // Barrel shadow
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(barrelAngle);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(2, -8, 32, 16);
    ctx.restore();

    // Barrel
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(barrelAngle);

    // Barrel gradient
    const barrelGradient = ctx.createLinearGradient(0, -8, 0, 8);
    barrelGradient.addColorStop(0, '#475f7b');
    barrelGradient.addColorStop(0.5, '#34495e');
    barrelGradient.addColorStop(1, '#2c3e50');
    ctx.fillStyle = barrelGradient;
    ctx.fillRect(0, -7, 30, 14);

    // Barrel highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(0, -6, 30, 4);

    // Barrel end cap
    ctx.fillStyle = '#1a252f';
    ctx.beginPath();
    ctx.arc(30, 0, 7, 0, Math.PI * 2);
    ctx.fill();

    // Muzzle
    ctx.fillStyle = '#0d1418';
    ctx.beginPath();
    ctx.arc(30, 0, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Turret dome
    const domeGradient = ctx.createRadialGradient(x - 5, y - 5, 0, x, y, 18);
    domeGradient.addColorStop(0, '#5a7a9a');
    domeGradient.addColorStop(1, '#34495e');
    ctx.fillStyle = domeGradient;
    ctx.beginPath();
    ctx.arc(x, y, 18, 0, Math.PI * 2);
    ctx.fill();

    // Turret highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.arc(x - 5, y - 5, 8, 0, Math.PI * 2);
    ctx.fill();

    // Pulsing glow when ready to fire
    if (!gameState.truthBomb) {
        const pulseIntensity = (Math.sin(Date.now() * 0.005) + 1) * 0.3;
        const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, 35);
        glowGradient.addColorStop(0, `rgba(26, 188, 156, ${pulseIntensity})`);
        glowGradient.addColorStop(1, 'rgba(26, 188, 156, 0)');
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(x, y, 35, 0, Math.PI * 2);
        ctx.fill();
    }

    // Charging indicator when pulling
    if (gameState.isPulling) {
        const dx = gameState.cannonX - gameState.pullX;
        const dy = gameState.cannonY - gameState.pullY;
        const pullDistance = Math.sqrt(dx * dx + dy * dy);
        const powerPercent = Math.min(pullDistance / GAME_CONFIG.MAX_PULL, 1);

        // Power arc
        ctx.strokeStyle = `rgba(26, 188, 156, ${0.5 + powerPercent * 0.5})`;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(x, y, 32, -Math.PI, -Math.PI + Math.PI * 2 * powerPercent);
        ctx.stroke();

        // Pull line
        ctx.strokeStyle = 'rgba(26, 188, 156, 0.4)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(gameState.pullX, gameState.pullY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Pull point indicator
        ctx.fillStyle = 'rgba(26, 188, 156, 0.6)';
        ctx.beginPath();
        ctx.arc(gameState.pullX, gameState.pullY, 8, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.restore();
}

/**
 * ENHANCED TRAJECTORY PREDICTION with arc visualization
 */
function drawTrajectory(ctx) {
    if (!gameState.isPulling) return;

    const dx = gameState.cannonX - gameState.pullX;
    const dy = gameState.cannonY - gameState.pullY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 20) return;

    const power = Math.min(distance / 8, 15);
    const angle = Math.atan2(dy, dx);

    // Simulate trajectory with dotted arc
    let simX = gameState.cannonX;
    let simY = gameState.cannonY;
    let simVx = Math.cos(angle) * power;
    let simVy = Math.sin(angle) * power;

    const dots = [];
    for (let i = 0; i < 50; i++) {
        simVy += GAME_CONFIG.GRAVITY;
        simX += simVx;
        simY += simVy;

        if (simY > gameState.cannonY || simX < 0 || simX > ctx.canvas.width) break;

        if (i % 3 === 0) { // Every 3rd point
            dots.push({ x: simX, y: simY });
        }
    }

    // Draw trajectory dots with fade
    dots.forEach((dot, i) => {
        const alpha = 1 - (i / dots.length);
        ctx.fillStyle = `rgba(26, 188, 156, ${alpha * 0.6})`;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 3, 0, Math.PI * 2);
        ctx.fill();
    });

    // Draw aiming arc line
    if (dots.length > 0) {
        ctx.strokeStyle = 'rgba(26, 188, 156, 0.3)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(gameState.cannonX, gameState.cannonY);
        dots.forEach(dot => ctx.lineTo(dot.x, dot.y));
        ctx.stroke();
        ctx.setLineDash([]);
    }

    // Impact prediction indicator
    if (dots.length > 0) {
        const lastDot = dots[dots.length - 1];
        ctx.strokeStyle = 'rgba(26, 188, 156, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(lastDot.x, lastDot.y, 15, 0, Math.PI * 2);
        ctx.stroke();

        // Crosshair at impact point
        ctx.beginPath();
        ctx.moveTo(lastDot.x - 10, lastDot.y);
        ctx.lineTo(lastDot.x + 10, lastDot.y);
        ctx.moveTo(lastDot.x, lastDot.y - 10);
        ctx.lineTo(lastDot.x, lastDot.y + 10);
        ctx.stroke();
    }
}

/**
 * DRAW FUNCTIONS for game objects
 */
function drawBubbles(ctx) {
    gameState.bubbles.forEach(bubble => bubble.draw(ctx));
}

function drawTruthBomb(ctx) {
    if (gameState.truthBomb) {
        gameState.truthBomb.draw(ctx);
    }
}

/**
 * UPDATE FUNCTIONS for game objects
 */
function updateBubbles(canvas, deltaTime) {
    gameState.bubbleSpawnTimer += deltaTime;

    // Spawn new bubbles
    const spawnInterval = Math.max(
        GAME_CONFIG.MIN_SPAWN_INTERVAL,
        GAME_CONFIG.BUBBLE_SPAWN_INTERVAL - gameState.wave * 100
    );

    if (gameState.bubbleSpawnTimer > spawnInterval && gameState.bubbles.length < GAME_CONFIG.MAX_BUBBLES) {
        gameState.bubbleSpawnTimer = 0;

        const x = GAME_CONFIG.BUBBLE_RADIUS + Math.random() * (canvas.width - GAME_CONFIG.BUBBLE_RADIUS * 2);
        const isFake = Math.random() < Math.min(0.7, 0.3 + gameState.wave * 0.05);

        gameState.bubbles.push(new Bubble(x, -GAME_CONFIG.BUBBLE_RADIUS, isFake));
    }

    // Update all bubbles
    gameState.bubbles.forEach(bubble => bubble.update(canvas));

    // Remove inactive bubbles
    gameState.bubbles = gameState.bubbles.filter(b => b.active);
}

function updateTruthBomb(canvas) {
    if (gameState.truthBomb) {
        gameState.truthBomb.update(canvas);
        if (!gameState.truthBomb.active) {
            gameState.truthBomb = null;
        }
    }
}

/**
 * ENHANCED COLLISION DETECTION with visual feedback
 */
function checkCollisions() {
    if (!gameState.truthBomb || !gameState.truthBomb.active) return;

    const bomb = gameState.truthBomb;

    for (let i = gameState.bubbles.length - 1; i >= 0; i--) {
        const bubble = gameState.bubbles[i];
        if (!bubble.active || bubble.scale < 0.9) continue; // Don't hit spawning bubbles

        const dx = bomb.x - bubble.x;
        const dy = bomb.y - bubble.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < (bomb.radius + bubble.radius * bubble.scale)) {
            // HIT!
            bubble.active = false;
            bomb.active = false;

            if (bubble.isFake) {
                // GOOD HIT - Destroyed fake
                handleGoodHit(bubble);
            } else {
                // BAD HIT - Hit real image
                handleBadHit(bubble);
            }

            updateGameUI();
            break;
        }
    }
}

/**
 * GOOD HIT HANDLER - Maximum juice and feedback
 */
function handleGoodHit(bubble) {
    gameState.fakesDestroyed++;
    gameState.score += GAME_CONFIG.POINTS_PER_FAKE * gameState.combo;
    gameState.combo = Math.min(gameState.combo + 0.5, 5);
    gameState.lastComboTime = Date.now();

    // Sound
    GameAudio.play('explosion', 0.5);
    if (gameState.combo > 2) {
        setTimeout(() => GameAudio.play('combo', 0.3), 100);
    }

    // Screen shake
    ScreenShake.shake(8 + gameState.combo * 2, 15);

    // Haptic
    if (navigator.vibrate) {
        navigator.vibrate([30, 50, 30]);
    }

    // Explosion particles - lots of them!
    const particleCount = Math.floor(20 + gameState.combo * 5);
    for (let i = 0; i < particleCount; i++) {
        gameState.particles.push(new EnhancedParticle(bubble.x, bubble.y, 'explosion', '#ff4478'));
    }

    // Sparks
    for (let i = 0; i < 15; i++) {
        gameState.particles.push(new EnhancedParticle(bubble.x, bubble.y, 'spark', '#ffaa44'));
    }

    // Smoke cloud
    for (let i = 0; i < 8; i++) {
        gameState.particles.push(new EnhancedParticle(bubble.x, bubble.y, 'smoke'));
    }

    // Flash effect
    gameState.flashEffects.push(new FlashEffect(
        bubble.x,
        bubble.y,
        bubble.radius * 2,
        'rgba(255, 68, 120, 0.8)'
    ));

    // Damage number popup
    createDamageNumber(bubble.x, bubble.y - 30, `+${Math.floor(GAME_CONFIG.POINTS_PER_FAKE * gameState.combo)}`);

    // Combo text
    if (gameState.combo > 2) {
        createComboText(bubble.x, bubble.y + 30, `${gameState.combo.toFixed(1)}x COMBO!`);
    }
}

/**
 * BAD HIT HANDLER - Negative feedback
 */
function handleBadHit(bubble) {
    loseCredibility(GAME_CONFIG.CREDIBILITY_LOSS_REAL_HIT);
    gameState.combo = 1;
    gameState.lastComboTime = Date.now();

    // Sound
    GameAudio.play('danger', 0.4);

    // Screen shake
    ScreenShake.shake(12, 20);

    // Haptic
    if (navigator.vibrate) {
        navigator.vibrate(100);
    }

    // Green explosion (real image)
    for (let i = 0; i < 15; i++) {
        gameState.particles.push(new EnhancedParticle(bubble.x, bubble.y, 'explosion', '#44ff78'));
    }

    // Flash effect
    gameState.flashEffects.push(new FlashEffect(
        bubble.x,
        bubble.y,
        bubble.radius * 2,
        'rgba(68, 255, 120, 0.8)'
    ));

    // Damage text
    createDamageNumber(bubble.x, bubble.y - 30, `-20 CRED`, '#ff4444');
}

/**
 * FLOATING DAMAGE NUMBERS - Professional feedback
 */
function createDamageNumber(x, y, text, color = '#1abc9c') {
    const damageText = {
        x: x,
        y: y,
        text: text,
        color: color,
        life: 1.0,
        vy: -2,
        scale: 1.5,

        update() {
            this.y += this.vy;
            this.vy *= 0.95;
            this.life -= 0.02;
            this.scale = 1.5 - (1 - this.life) * 0.5;
        },

        draw(ctx) {
            if (this.life <= 0) return;

            ctx.save();
            ctx.globalAlpha = this.life;
            ctx.font = `bold ${24 * this.scale}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // Shadow
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillText(this.text, this.x + 2, this.y + 2);

            // Text
            ctx.fillStyle = this.color;
            ctx.fillText(this.text, this.x, this.y);
            ctx.restore();
        }
    };

    if (!gameState.damageNumbers) gameState.damageNumbers = [];
    gameState.damageNumbers.push(damageText);
}

/**
 * COMBO TEXT FEEDBACK
 */
function createComboText(x, y, text) {
    createDamageNumber(x, y, text, '#ffd700');
}

/**
 * Update damage numbers in game loop (call this in enhancedGameLoop)
 */
function updateDamageNumbers() {
    if (!gameState.damageNumbers) return;

    gameState.damageNumbers.forEach(dn => dn.update());
    gameState.damageNumbers = gameState.damageNumbers.filter(dn => dn.life > 0);
}

function drawDamageNumbers(ctx) {
    if (!gameState.damageNumbers) return;
    gameState.damageNumbers.forEach(dn => dn.draw(ctx));
}

/**
 * CREDIBILITY LOSS with visual warning
 */
function loseCredibility(amount) {
    gameState.credibility = Math.max(0, gameState.credibility - amount);
    updateGameUI();

    // Red flash on screen
    const canvas = $('gameCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.save();
        ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
    }

    // Warning at low credibility
    if (gameState.credibility < 30 && gameState.credibility > 0) {
        GameAudio.play('danger', 0.3);
    }

    if (gameState.credibility <= 0) {
        gameOver();
    }
}

/**
 * UPDATE GAME UI
 */
function updateGameUI() {
    const $$ = (id) => document.getElementById(id);
    if ($$('gameWave')) $$('gameWave').textContent = gameState.wave;
    if ($$('gameScore')) $$('gameScore').textContent = gameState.score.toLocaleString();
    if ($$('gameCombo')) $$('gameCombo').textContent = `x${gameState.combo.toFixed(1)}`;
    if ($$('credibilityPercent')) $$('credibilityPercent').textContent = `${Math.round(gameState.credibility)}%`;
    if ($$('credibilityFill')) $$('credibilityFill').style.width = `${gameState.credibility}%`;
}

/**
 * GAME OVER with coin rewards
 */
function gameOver() {
    gameState.running = false;

    // Sound
    GameAudio.play('gameover', 0.5);

    // Calculate rewards
    const coinsEarned = Math.floor(gameState.score / 100) + gameState.fakesDestroyed * 2;

    // Award coins
    if (typeof user !== 'undefined' && user && typeof userProgression !== 'undefined' && userProgression) {
        userProgression.truth_coins = (userProgression.truth_coins || 0) + coinsEarned;
        if (typeof saveUserProgression === 'function') saveUserProgression();
        if (typeof updateCoinsDisplay === 'function') updateCoinsDisplay();
    }

    // Show game over screen
    const $$ = (id) => document.getElementById(id);
    if ($$('finalWave')) $$('finalWave').textContent = gameState.wave;
    if ($$('finalScore')) $$('finalScore').textContent = gameState.score.toLocaleString();
    if ($$('finalFakes')) $$('finalFakes').textContent = gameState.fakesDestroyed;
    if ($$('coinsEarned')) $$('coinsEarned').textContent = `+${coinsEarned}`;
    if ($$('gameOverScreen')) $$('gameOverScreen').style.display = 'flex';

    console.log('[FlawlessTankGame] Game Over - Score:', gameState.score, 'Coins:', coinsEarned);
}

console.log('[FlawlessTankGame] Drawing & collision systems loaded');
