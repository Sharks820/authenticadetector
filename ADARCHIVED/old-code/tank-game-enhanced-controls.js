// ============================================================
// TANK GAME - ENHANCED MOBILE/WEB CONTROLS OVERHAUL
// ============================================================

// Enhanced game state with new control properties
const ENHANCED_GAME_STATE = {
    // Movement controls
    keys: {},
    mouseX: 0,
    mouseY: 0,
    cannonAngle: -Math.PI / 2,
    joystick: null,
    isMobile: ('ontouchstart' in window || navigator.maxTouchPoints > 0),
    controlHintsShown: false,
    canvasScale: 1,

    // Tank movement
    tankVelocityX: 0,
    tankVelocityY: 0,

    // Fire control
    canFire: true,
    fireRate: 300, // ms between shots
    lastFireTime: 0
};

// Enhanced config
const ENHANCED_CONFIG = {
    TANK_SPEED: 4,
    MIN_TOUCH_SIZE: 44,        // Minimum touch target size (accessibility)
    JOYSTICK_DEAD_ZONE: 0.15,  // Dead zone for joystick (prevent drift)
    JOYSTICK_RADIUS: 60,
    JOYSTICK_KNOB_RADIUS: 25
};

// ============================================================
// VIRTUAL JOYSTICK CLASS (Mobile)
// ============================================================
class VirtualJoystick {
    constructor(container, onMove) {
        this.container = container;
        this.onMove = onMove;
        this.active = false;
        this.startX = 0;
        this.startY = 0;
        this.currentX = 0;
        this.currentY = 0;
        this.baseRadius = ENHANCED_CONFIG.JOYSTICK_RADIUS;
        this.knobRadius = ENHANCED_CONFIG.JOYSTICK_KNOB_RADIUS;

        this.createElements();
        this.attachListeners();
    }

    createElements() {
        // Base circle
        this.base = document.createElement('div');
        this.base.style.cssText = `
            position: absolute;
            width: ${this.baseRadius * 2}px;
            height: ${this.baseRadius * 2}px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.2);
            border: 3px solid rgba(255, 255, 255, 0.5);
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
        `;

        // Knob
        this.knob = document.createElement('div');
        this.knob.style.cssText = `
            position: absolute;
            width: ${this.knobRadius * 2}px;
            height: ${this.knobRadius * 2}px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.7);
            border: 3px solid rgba(255, 255, 255, 0.9);
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            transition: transform 0.1s ease-out;
            pointer-events: none;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        `;

        this.container.appendChild(this.base);
        this.container.appendChild(this.knob);
    }

    attachListeners() {
        this.container.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: false });
        this.container.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
        this.container.addEventListener('touchend', this.onTouchEnd.bind(this), { passive: false });
    }

    onTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = this.container.getBoundingClientRect();
        this.startX = rect.left + rect.width / 2;
        this.startY = rect.top + rect.height / 2;
        this.currentX = touch.clientX;
        this.currentY = touch.clientY;
        this.active = true;
        this.updateKnob();
    }

    onTouchMove(e) {
        if (!this.active) return;
        e.preventDefault();
        const touch = e.touches[0];
        this.currentX = touch.clientX;
        this.currentY = touch.clientY;
        this.updateKnob();
    }

    onTouchEnd(e) {
        e.preventDefault();
        this.active = false;
        this.currentX = this.startX;
        this.currentY = this.startY;
        this.updateKnob();
        if (this.onMove) this.onMove(0, 0);
    }

    updateKnob() {
        const dx = this.currentX - this.startX;
        const dy = this.currentY - this.startY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Constrain to base radius
        let constrainedX = dx;
        let constrainedY = dy;
        if (distance > this.baseRadius) {
            const ratio = this.baseRadius / distance;
            constrainedX = dx * ratio;
            constrainedY = dy * ratio;
        }

        // Update knob position
        this.knob.style.transform = `translate(calc(-50% + ${constrainedX}px), calc(-50% + ${constrainedY}px))`;

        // Calculate normalized direction (with dead zone)
        const normalizedDistance = Math.min(distance / this.baseRadius, 1.0);
        if (normalizedDistance < ENHANCED_CONFIG.JOYSTICK_DEAD_ZONE) {
            if (this.onMove) this.onMove(0, 0);
            return;
        }

        const angle = Math.atan2(dy, dx);
        const strength = normalizedDistance;

        if (this.onMove) {
            this.onMove(Math.cos(angle) * strength, Math.sin(angle) * strength);
        }
    }
}

// ============================================================
// ENHANCED KEYBOARD CONTROLS
// ============================================================
function initKeyboardControls() {
    document.addEventListener('keydown', (e) => {
        if (!gameState.running) return;

        // Movement keys
        if (['w', 'a', 's', 'd', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'].includes(e.key.toLowerCase())) {
            e.preventDefault();
            gameState.keys[e.key.toLowerCase()] = true;
        }

        // Fire key (Space)
        if (e.key === ' ' || e.key === 'Spacebar') {
            e.preventDefault();
            fireProjectile();
        }
    });

    document.addEventListener('keyup', (e) => {
        if (['w', 'a', 's', 'd', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'].includes(e.key.toLowerCase())) {
            gameState.keys[e.key.toLowerCase()] = false;
        }
    });
}

// ============================================================
// ENHANCED MOUSE CONTROLS
// ============================================================
function initMouseControls(canvas) {
    canvas.addEventListener('mousemove', (e) => {
        if (!gameState.running) return;

        const rect = canvas.getBoundingClientRect();
        gameState.mouseX = (e.clientX - rect.left) / gameState.canvasScale;
        gameState.mouseY = (e.clientY - rect.top) / gameState.canvasScale;

        // Update cannon angle to point at mouse
        const dx = gameState.mouseX - gameState.cannonX;
        const dy = gameState.mouseY - gameState.cannonY;
        gameState.cannonAngle = Math.atan2(dy, dx);
    });

    canvas.addEventListener('click', (e) => {
        if (!gameState.running) return;
        fireProjectile();
    });
}

// ============================================================
// FIRE PROJECTILE
// ============================================================
function fireProjectile() {
    if (!gameState.canFire || gameState.truthBomb) return;

    const now = Date.now();
    if (now - gameState.lastFireTime < gameState.fireRate) return;

    gameState.lastFireTime = now;

    // Create and launch projectile
    const power = 12; // Fixed power for keyboard/mouse
    gameState.truthBomb = new TruthBomb(gameState.cannonX, gameState.cannonY);
    gameState.truthBomb.launch(power, gameState.cannonAngle);

    // Haptic feedback
    if (navigator.vibrate) navigator.vibrate(30);
}

// ============================================================
// UPDATE TANK MOVEMENT
// ============================================================
function updateTankMovement(canvas) {
    let moveX = 0;
    let moveY = 0;

    // Keyboard movement (WASD or Arrow keys)
    if (gameState.keys['w'] || gameState.keys['arrowup']) moveY -= 1;
    if (gameState.keys['s'] || gameState.keys['arrowdown']) moveY += 1;
    if (gameState.keys['a'] || gameState.keys['arrowleft']) moveX -= 1;
    if (gameState.keys['d'] || gameState.keys['arrowright']) moveX += 1;

    // Normalize diagonal movement
    if (moveX !== 0 && moveY !== 0) {
        const len = Math.sqrt(moveX * moveX + moveY * moveY);
        moveX /= len;
        moveY /= len;
    }

    // Apply movement
    const speed = ENHANCED_CONFIG.TANK_SPEED;
    gameState.cannonX += moveX * speed;
    gameState.cannonY += moveY * speed;

    // Constrain to canvas bounds
    const margin = 30;
    gameState.cannonX = Math.max(margin, Math.min(canvas.width - margin, gameState.cannonX));
    gameState.cannonY = Math.max(margin, Math.min(canvas.height - margin, gameState.cannonY));
}

// ============================================================
// RESPONSIVE CANVAS HANDLING
// ============================================================
function resizeCanvas(canvas) {
    const container = canvas.parentElement;
    const header = document.querySelector('.game-header');
    const healthBar = document.querySelector('.credibility-bar-container');
    const powerups = document.querySelector('.powerups-bar');

    const headerHeight = header ? header.offsetHeight : 60;
    const healthBarHeight = healthBar ? healthBar.offsetHeight : 40;
    const powerupsHeight = powerups ? powerups.offsetHeight : 60;

    const availableHeight = window.innerHeight - headerHeight - healthBarHeight - powerupsHeight;
    const availableWidth = window.innerWidth;

    // Maintain aspect ratio (16:9 or fill)
    let canvasWidth = availableWidth;
    let canvasHeight = availableHeight;

    // Update canvas size
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Update scale for touch coordinates
    gameState.canvasScale = canvas.offsetWidth / canvas.width;

    // Reposition cannon if it's out of bounds
    if (gameState.running) {
        gameState.cannonX = Math.max(30, Math.min(canvas.width - 30, gameState.cannonX));
        gameState.cannonY = Math.max(30, Math.min(canvas.height - 30, gameState.cannonY));
    }
}

// ============================================================
// ORIENTATION CHANGE HANDLER
// ============================================================
function handleOrientationChange() {
    setTimeout(() => {
        const canvas = document.getElementById('gameCanvas');
        if (canvas && gameState.running) {
            resizeCanvas(canvas);
        }
    }, 100); // Small delay for browser to update dimensions
}

// ============================================================
// CONTROL HINTS OVERLAY
// ============================================================
function showControlHints() {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas || gameState.controlHintsShown) return;

    const hints = document.createElement('div');
    hints.id = 'controlHints';
    hints.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.85);
        padding: 24px 32px;
        border-radius: 16px;
        color: white;
        font-family: monospace;
        font-size: 14px;
        z-index: 1000;
        text-align: center;
        border: 2px solid rgba(255, 255, 255, 0.3);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        animation: fadeIn 0.3s ease;
        pointer-events: none;
    `;

    const isMobile = gameState.isMobile;

    hints.innerHTML = isMobile ? `
        <div style="font-size: 18px; font-weight: bold; margin-bottom: 16px;">📱 MOBILE CONTROLS</div>
        <div style="margin-bottom: 8px;">🕹️ Left Joystick - Move Tank</div>
        <div style="margin-bottom: 8px;">🔥 Fire Button - Shoot</div>
        <div style="margin-bottom: 8px;">👆 Tap Screen - Quick Fire</div>
        <div style="margin-top: 16px; font-size: 12px; opacity: 0.7;">Hint: Use thumb for joystick, index for fire!</div>
    ` : `
        <div style="font-size: 18px; font-weight: bold; margin-bottom: 16px;">⌨️ DESKTOP CONTROLS</div>
        <div style="margin-bottom: 8px;">WASD / Arrow Keys - Move Tank</div>
        <div style="margin-bottom: 8px;">Mouse - Aim Cannon</div>
        <div style="margin-bottom: 8px;">Click / Space - Fire</div>
        <div style="margin-top: 16px; font-size: 12px; opacity: 0.7;">Tip: Move while aiming for best results!</div>
    `;

    const gameContainer = document.getElementById('truthCannonGame');
    if (gameContainer) {
        gameContainer.appendChild(hints);

        // Auto-hide after 5 seconds
        setTimeout(() => {
            hints.style.animation = 'fadeOut 0.5s ease';
            setTimeout(() => hints.remove(), 500);
        }, 5000);
    }

    gameState.controlHintsShown = true;
}

// Add fade animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
        to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    }
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(style);

// ============================================================
// MOBILE CONTROLS INITIALIZATION
// ============================================================
function initMobileControls() {
    const mobileControls = document.getElementById('mobileControls');
    const fireBtn = document.getElementById('fireBtn');
    const joystickZone = document.getElementById('joystickZone');

    if (!mobileControls || !fireBtn || !joystickZone) return;

    // Show mobile controls
    mobileControls.style.display = 'block';

    // Make fire button bigger and thumb-friendly
    fireBtn.style.cssText = `
        position: absolute;
        bottom: 100px;
        right: 20px;
        width: 80px;
        height: 80px;
        min-width: ${ENHANCED_CONFIG.MIN_TOUCH_SIZE}px;
        min-height: ${ENHANCED_CONFIG.MIN_TOUCH_SIZE}px;
        border-radius: 50%;
        background: linear-gradient(135deg, #ff4478, #ff6b9d);
        border: 4px solid rgba(255, 255, 255, 0.9);
        font-size: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: all;
        box-shadow: 0 8px 24px rgba(255, 68, 120, 0.5);
        cursor: pointer;
        user-select: none;
        transition: transform 0.1s ease, box-shadow 0.1s ease;
    `;

    // Fire button events
    fireBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        fireBtn.style.transform = 'scale(0.9)';
        fireProjectile();
    });

    fireBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        fireBtn.style.transform = 'scale(1)';
    });

    // Initialize joystick
    gameState.joystick = new VirtualJoystick(joystickZone, (x, y) => {
        // Update tank position based on joystick
        const speed = ENHANCED_CONFIG.TANK_SPEED;
        const canvas = document.getElementById('gameCanvas');
        if (!canvas) return;

        gameState.cannonX += x * speed;
        gameState.cannonY += y * speed;

        // Constrain to bounds
        const margin = 30;
        gameState.cannonX = Math.max(margin, Math.min(canvas.width - margin, gameState.cannonX));
        gameState.cannonY = Math.max(margin, Math.min(canvas.height - margin, gameState.cannonY));

        // Update angle if moving
        if (x !== 0 || y !== 0) {
            gameState.cannonAngle = Math.atan2(y, x);
        }
    });
}

// ============================================================
// COLLISION DETECTION OPTIMIZATION
// ============================================================
function optimizedCheckCollisions() {
    if (!gameState.truthBomb || !gameState.truthBomb.active) return;

    const bomb = gameState.truthBomb;
    const bombRadiusSq = (bomb.radius + GAME_CONFIG.BUBBLE_RADIUS) ** 2; // Pre-square for faster comparison

    // Use spatial partitioning for larger bubble counts (optimization)
    for (let i = gameState.bubbles.length - 1; i >= 0; i--) {
        const bubble = gameState.bubbles[i];
        if (!bubble.active) continue;

        const dx = bomb.x - bubble.x;
        const dy = bomb.y - bubble.y;
        const distanceSq = dx * dx + dy * dy; // Avoid sqrt until necessary

        if (distanceSq < bombRadiusSq) {
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
            } else {
                // Hit a real image - BAD!
                loseCredibility(GAME_CONFIG.CREDIBILITY_LOSS_REAL_HIT);
                gameState.combo = 1;
                createExplosion(bubble.x, bubble.y, '#44ff78');

                // Sad vibration
                if (navigator.vibrate) navigator.vibrate(100);
            }

            updateGameUI();
            break; // Exit after first collision
        }
    }
}

// Export functions to window for integration
window.initEnhancedControls = function() {
    initKeyboardControls();

    if (gameState.isMobile) {
        initMobileControls();
    }

    const canvas = document.getElementById('gameCanvas');
    if (canvas) {
        initMouseControls(canvas);
        resizeCanvas(canvas);
    }

    // Show control hints
    setTimeout(showControlHints, 500);

    // Handle orientation changes
    window.addEventListener('resize', handleOrientationChange);
    window.addEventListener('orientationchange', handleOrientationChange);
};

window.updateEnhancedGameLoop = function(canvas) {
    if (!gameState.isMobile) {
        updateTankMovement(canvas);
    }
};

window.enhancedCheckCollisions = optimizedCheckCollisions;
