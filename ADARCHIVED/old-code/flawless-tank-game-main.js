// ============================================================
// FLAWLESS TANK GAME - MAIN GAME LOOP & CONTROLS
// Enhanced controls, animations, and game feel
// ============================================================

/**
 * ENHANCED GAME INITIALIZATION
 * Sets up canvas, controls, and starts professional game loop
 */
window.startTruthCannon = function() {
    console.log('[FlawlessTankGame] Starting enhanced game...');

    const gameContainer = $('truthCannonGame');
    const canvas = $('gameCanvas');
    if (!canvas) {
        console.error('[FlawlessTankGame] Canvas not found!');
        return;
    }

    const ctx = canvas.getContext('2d');

    // Setup canvas with proper DPI scaling
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = (window.innerHeight - 160) * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = (window.innerHeight - 160) + 'px';

    ctx.scale(dpr, dpr);

    // Initialize audio
    if (!GameAudio.audioContext) {
        GameAudio.init();
    }

    // Reset game state with enhanced features
    gameState = {
        running: true,
        wave: 1,
        score: 0,
        combo: 1,
        credibility: 100,
        fakesDestroyed: 0,
        cannonX: rect.width / 2,
        cannonY: (window.innerHeight - 160) - 40,
        isPulling: false,
        pullX: rect.width / 2,
        pullY: (window.innerHeight - 160) - 40,
        truthBomb: null,
        bubbles: [],
        particles: [],
        bubbleSpawnTimer: 0,
        waveTimer: 0,
        lastTime: Date.now(),
        smokeParticles: [],
        flashEffects: [],
        comboTimer: 0,
        powerups: [],
        lastComboTime: Date.now(),
        fps: 60,
        frameCount: 0
    };

    // Show game
    gameContainer.style.display = 'flex';
    $('gameOverScreen').style.display = 'none';
    updateGameUI();

    // Enhanced touch/mouse controls
    setupGameControls(canvas);

    // Start enhanced game loop
    requestAnimationFrame(enhancedGameLoop);

    console.log('[FlawlessTankGame] Game started successfully!');
};

/**
 * ENHANCED CONTROL SYSTEM
 * Smooth, responsive controls with visual feedback
 */
function setupGameControls(canvas) {
    let touchId = null;
    let isMouseDown = false;

    // Touch controls
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.changedTouches[0];
        touchId = touch.identifier;
        startPull(touch.clientX, touch.clientY);
    }, { passive: false });

    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = Array.from(e.changedTouches).find(t => t.identifier === touchId);
        if (touch) updatePull(touch.clientX, touch.clientY);
    }, { passive: false });

    canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        const touch = Array.from(e.changedTouches).find(t => t.identifier === touchId);
        if (touch) {
            releasePull();
            touchId = null;
        }
    }, { passive: false });

    // Mouse controls
    canvas.addEventListener('mousedown', (e) => {
        isMouseDown = true;
        startPull(e.clientX, e.clientY);
    });

    canvas.addEventListener('mousemove', (e) => {
        if (isMouseDown && gameState.isPulling) {
            updatePull(e.clientX, e.clientY);
        }
    });

    canvas.addEventListener('mouseup', () => {
        if (isMouseDown) {
            releasePull();
            isMouseDown = false;
        }
    });

    canvas.addEventListener('mouseleave', () => {
        if (isMouseDown) {
            releasePull();
            isMouseDown = false;
        }
    });

    // Keyboard controls for desktop
    document.addEventListener('keydown', (e) => {
        if (!gameState.running) return;

        switch(e.key) {
            case ' ':
            case 'Enter':
                e.preventDefault();
                // Quick fire at cursor position or straight up
                if (!gameState.truthBomb) {
                    const power = 12;
                    const angle = -Math.PI / 2; // Straight up
                    gameState.truthBomb = new TruthBomb(gameState.cannonX, gameState.cannonY);
                    gameState.truthBomb.launch(power, angle);
                }
                break;

            case 'm':
            case 'M':
                // Toggle mute
                const unmuted = GameAudio.toggle();
                toast(unmuted ? 'Sound ON' : 'Sound OFF', 'info');
                break;
        }
    });
}

/**
 * PULL TO SHOOT MECHANICS with smooth interpolation
 */
function startPull(clientX, clientY) {
    if (!gameState.running || gameState.truthBomb) return;

    const canvas = $('gameCanvas');
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // Check if near cannon
    const dx = x - gameState.cannonX;
    const dy = y - gameState.cannonY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 80) {
        gameState.isPulling = true;
        gameState.pullX = x;
        gameState.pullY = y;

        // Visual feedback
        if (navigator.vibrate) navigator.vibrate(10);
    }
}

function updatePull(clientX, clientY) {
    if (!gameState.isPulling) return;

    const canvas = $('gameCanvas');
    const rect = canvas.getBoundingClientRect();
    let x = clientX - rect.left;
    let y = clientY - rect.top;

    // Constrain pull distance with smooth easing
    const dx = gameState.cannonX - x;
    const dy = gameState.cannonY - y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > GAME_CONFIG.MAX_PULL) {
        const ratio = GAME_CONFIG.MAX_PULL / distance;
        x = gameState.cannonX - dx * ratio;
        y = gameState.cannonY - dy * ratio;
    }

    // Smooth interpolation
    gameState.pullX += (x - gameState.pullX) * GAME_CONFIG.INTERPOLATION_SPEED;
    gameState.pullY += (y - gameState.pullY) * GAME_CONFIG.INTERPOLATION_SPEED;
}

function releasePull() {
    if (!gameState.isPulling || gameState.truthBomb) return;

    gameState.isPulling = false;

    const dx = gameState.cannonX - gameState.pullX;
    const dy = gameState.cannonY - gameState.pullY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 20) {
        const power = Math.min(distance / 8, 15);
        const angle = Math.atan2(dy, dx);

        gameState.truthBomb = new TruthBomb(gameState.cannonX, gameState.cannonY);
        gameState.truthBomb.launch(power, angle);

        // Recoil effect
        ScreenShake.shake(5, 12);

        // Haptic feedback
        if (navigator.vibrate) navigator.vibrate(50);

        // Muzzle flash
        gameState.flashEffects.push(new FlashEffect(
            gameState.cannonX,
            gameState.cannonY,
            20,
            'rgba(26, 188, 156, 0.9)'
        ));

        // Smoke puff
        for (let i = 0; i < 8; i++) {
            gameState.particles.push(new EnhancedParticle(
                gameState.cannonX,
                gameState.cannonY,
                'smoke'
            ));
        }
    }
}

/**
 * ENHANCED GAME LOOP with smooth 60 FPS
 */
function enhancedGameLoop(timestamp) {
    if (!gameState.running) return;

    try {
        const canvas = $('gameCanvas');
        if (!canvas) {
            console.error('[FlawlessTankGame] Canvas lost, stopping game');
            gameState.running = false;
            return;
        }

        const ctx = canvas.getContext('2d');
        const now = Date.now();
        const deltaTime = Math.min(now - gameState.lastTime, 100);
        gameState.lastTime = now;

        // FPS counter
        gameState.frameCount++;
        if (gameState.frameCount % 60 === 0) {
            gameState.fps = Math.round(1000 / deltaTime);
        }

        // Clear canvas with screen shake
        ScreenShake.update();
        const shake = ScreenShake.getOffset();

        ctx.save();
        ctx.translate(shake.x, shake.y);

        ctx.clearRect(-shake.x, -shake.y, canvas.width, canvas.height);

        // Draw background gradient
        const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        bgGradient.addColorStop(0, '#1a1a2e');
        bgGradient.addColorStop(1, '#0f0f1e');
        ctx.fillStyle = bgGradient;
        ctx.fillRect(-shake.x, -shake.y, canvas.width, canvas.height);

        // Update game systems
        updateBubbles(canvas, deltaTime);
        updateTruthBomb(canvas);
        updateParticles();
        updateFlashEffects();
        checkCollisions();
        updateComboTimer();

        // Draw everything in correct order (back to front)
        drawParticles(ctx);
        drawBubbles(ctx);
        drawFlashEffects(ctx);
        drawTruthBomb(ctx);
        drawCannon(ctx);
        drawTrajectory(ctx);
        drawComboMultiplier(ctx);

        // Debug info (optional)
        if (window.location.search.includes('debug=1')) {
            drawDebugInfo(ctx);
        }

        ctx.restore();

        requestAnimationFrame(enhancedGameLoop);
    } catch (error) {
        console.error('[FlawlessTankGame] Error in game loop:', error);
        requestAnimationFrame(enhancedGameLoop);
    }
}

/**
 * COMBO SYSTEM with visual feedback
 */
function updateComboTimer() {
    const now = Date.now();
    if (now - gameState.lastComboTime > 3000 && gameState.combo > 1) {
        // Combo timeout
        gameState.combo = 1;
        gameState.comboTimer = 0;
        updateGameUI();
    } else if (gameState.combo > 1) {
        gameState.comboTimer = 1 - (now - gameState.lastComboTime) / 3000;
    }
}

function drawComboMultiplier(ctx) {
    if (gameState.combo <= 1) return;

    const canvas = $('gameCanvas');
    const x = canvas.width - 100;
    const y = 50;

    // Combo background
    ctx.save();
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = '#1abc9c';
    ctx.shadowColor = '#1abc9c';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.roundRect(x - 60, y - 25, 120, 50, 10);
    ctx.fill();

    // Combo text
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`x${gameState.combo.toFixed(1)}`, x, y);

    // Combo timer bar
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(x - 55, y + 18, 110, 4);
    ctx.fillStyle = '#fff';
    ctx.fillRect(x - 55, y + 18, 110 * gameState.comboTimer, 4);

    ctx.restore();
}

/**
 * ENHANCED PARTICLE UPDATE with pooling
 */
function updateParticles() {
    gameState.particles.forEach(p => p.update());
    gameState.particles = gameState.particles.filter(p => p.life > 0);

    // Cap particles for performance
    if (gameState.particles.length > GAME_CONFIG.MAX_PARTICLES) {
        gameState.particles = gameState.particles.slice(-GAME_CONFIG.MAX_PARTICLES);
    }
}

function updateFlashEffects() {
    gameState.flashEffects.forEach(f => f.update());
    gameState.flashEffects = gameState.flashEffects.filter(f => f.life > 0);
}

function drawParticles(ctx) {
    gameState.particles.forEach(p => p.draw(ctx));
}

function drawFlashEffects(ctx) {
    gameState.flashEffects.forEach(f => f.draw(ctx));
}

/**
 * DEBUG INFO OVERLAY
 */
function drawDebugInfo(ctx) {
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, 10, 200, 120);

    ctx.fillStyle = '#0f0';
    ctx.font = '12px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`FPS: ${gameState.fps}`, 20, 30);
    ctx.fillText(`Particles: ${gameState.particles.length}`, 20, 50);
    ctx.fillText(`Bubbles: ${gameState.bubbles.length}`, 20, 70);
    ctx.fillText(`Wave: ${gameState.wave}`, 20, 90);
    ctx.fillText(`Combo: x${gameState.combo.toFixed(1)}`, 20, 110);
    ctx.restore();
}

console.log('[FlawlessTankGame] Main game loop loaded');
