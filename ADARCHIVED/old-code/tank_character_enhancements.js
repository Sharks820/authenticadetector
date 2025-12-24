/**
 * Tank Character & Powerup System
 * Add this code to index.html in the Truth Cannon game section
 */

// ============================================================
// STEP 1: Add to gameState initialization (in startTruthCannon function)
// ============================================================
/*
Add these properties to the gameState object:

        // Powerup system
        powerups: {
            shield: false,
            rapidFire: false,
            missile: false,
            speedBoost: false,
            multiShot: false
        },
        powerupTimers: {},
        powerupPickups: [], // Powerups dropping from enemies
        // Character animation states
        shootingFlash: null,
        damageFlash: null,
        victoryPose: null
*/

// ============================================================
// STEP 2: Powerup Pickup Class
// ============================================================
class PowerupPickup {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type; // 'shield', 'rapidFire', 'missile', 'speedBoost', 'multiShot'
        this.radius = 15;
        this.active = true;
        this.vy = 2; // Falling speed
        this.wobble = 0;
        this.wobbleSpeed = 0.1;

        // Visual properties by type
        const powerupStyles = {
            shield: { icon: '🛡️', color: '#22d3ee', glow: 'rgba(34, 211, 238, 0.3)' },
            rapidFire: { icon: '⚡', color: '#dc2626', glow: 'rgba(220, 38, 38, 0.3)' },
            missile: { icon: '🚀', color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.3)' },
            speedBoost: { icon: '💨', color: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.3)' },
            multiShot: { icon: '🎯', color: '#ec4899', glow: 'rgba(236, 72, 153, 0.3)' }
        };

        this.style = powerupStyles[type] || powerupStyles.shield;
    }

    update(canvas) {
        this.y += this.vy;
        this.wobble += this.wobbleSpeed;
        this.x += Math.sin(this.wobble) * 0.5;

        // Remove if off screen
        if (this.y > canvas.height + this.radius) {
            this.active = false;
        }
    }

    draw(ctx) {
        if (!this.active) return;

        // Glow effect
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 2);
        gradient.addColorStop(0, this.style.glow);
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 2, 0, Math.PI * 2);
        ctx.fill();

        // Circle background
        ctx.fillStyle = this.style.color;
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Icon
        ctx.font = '20px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.style.icon, this.x, this.y);
    }

    checkCollision(cannonX, cannonY, cannonRadius) {
        const dx = this.x - cannonX;
        const dy = this.y - cannonY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < this.radius + cannonRadius;
    }
}

// ============================================================
// STEP 3: Powerup Functions
// ============================================================

function spawnPowerupFromBubble(x, y) {
    // 30% chance to drop a powerup when bubble is destroyed
    if (Math.random() > 0.3) return;

    const powerupTypes = ['shield', 'rapidFire', 'missile', 'speedBoost', 'multiShot'];
    const randomType = powerupTypes[Math.floor(Math.random() * powerupTypes.length)];

    gameState.powerupPickups.push(new PowerupPickup(x, y, randomType));
}

function updatePowerupPickups(canvas) {
    gameState.powerupPickups.forEach(pickup => pickup.update(canvas));

    // Check collisions with cannon
    for (let i = gameState.powerupPickups.length - 1; i >= 0; i--) {
        const pickup = gameState.powerupPickups[i];

        if (pickup.checkCollision(gameState.cannonX, gameState.cannonY, 40)) {
            // Activate powerup
            activatePowerup(pickup.type);
            pickup.active = false;

            // Visual feedback
            createExplosion(pickup.x, pickup.y, pickup.style.color);
            if (navigator.vibrate) navigator.vibrate(30);
        }
    }

    // Remove inactive pickups
    gameState.powerupPickups = gameState.powerupPickups.filter(p => p.active);
}

function activatePowerup(type) {
    const durations = {
        shield: 10000,      // 10 seconds
        rapidFire: 8000,    // 8 seconds
        missile: 12000,     // 12 seconds
        speedBoost: 6000,   // 6 seconds
        multiShot: 10000    // 10 seconds
    };

    // Activate powerup
    gameState.powerups[type] = true;

    // Clear existing timer if any
    if (gameState.powerupTimers[type]) {
        clearTimeout(gameState.powerupTimers[type]);
    }

    // Set deactivation timer
    gameState.powerupTimers[type] = setTimeout(() => {
        gameState.powerups[type] = false;
        delete gameState.powerupTimers[type];
    }, durations[type]);

    console.log(`[Powerup] ${type} activated for ${durations[type]/1000}s`);
}

function drawPowerupPickups(ctx) {
    gameState.powerupPickups.forEach(pickup => pickup.draw(ctx));
}

function drawPowerupIndicators(ctx, canvas) {
    // Show active powerups in top-right corner
    const activeP powerups = Object.entries(gameState.powerups).filter(([_, active]) => active);

    activeP powerups.forEach(([type, _], index) => {
        const x = canvas.width - 40 - (index * 35);
        const y = 20;

        const styles = {
            shield: { icon: '🛡️', color: '#22d3ee' },
            rapidFire: { icon: '⚡', color: '#dc2626' },
            missile: { icon: '🚀', color: '#f59e0b' },
            speedBoost: { icon: '💨', color: '#8b5cf6' },
            multiShot: { icon: '🎯', color: '#ec4899' }
        };

        const style = styles[type];

        // Background circle
        ctx.fillStyle = style.color;
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        ctx.fill();

        // Icon
        ctx.font = '16px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(style.icon, x, y);

        // Glow pulse
        const pulseAlpha = 0.3 + Math.sin(Date.now() / 200) * 0.2;
        ctx.globalAlpha = pulseAlpha;
        ctx.strokeStyle = style.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y, 18, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
    });
}

// ============================================================
// STEP 4: Replace drawCannon function with this enhanced version
// ============================================================

function drawCannon(ctx) {
    const x = gameState.cannonX;
    const y = gameState.cannonY;

    // Calculate angle based on pulling or default
    let angle = -Math.PI / 2; // Default pointing up
    if (gameState.isPulling) {
        const dx = gameState.pullX - x;
        const dy = gameState.pullY - y;
        angle = Math.atan2(dy, dx);
    }

    // Tank body (base)
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(x - 30, y - 10, 60, 20);

    // Tank tracks
    ctx.fillStyle = '#1a252f';
    ctx.fillRect(x - 32, y - 12, 64, 4);
    ctx.fillRect(x - 32, y + 8, 64, 4);

    // Tank turret
    ctx.fillStyle = '#34495e';
    ctx.beginPath();
    ctx.arc(x, y, 18, 0, Math.PI * 2);
    ctx.fill();

    // Main cannon barrel
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillStyle = '#465a6b';
    ctx.fillRect(0, -5, 35, 10);
    ctx.restore();

    // Active powerup weapon visuals
    if (gameState.powerups.rapidFire) {
        // Machine gun mounts (twin barrels)
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(0, -8, 25, 3);
        ctx.fillRect(0, 5, 25, 3);
        ctx.restore();
    }

    if (gameState.powerups.missile) {
        // Missile launcher tubes on sides
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(x - 35, y - 15, 8, 8);
        ctx.fillRect(x + 27, y - 15, 8, 8);
    }

    if (gameState.powerups.shield) {
        // Shield generator glow
        const shieldGradient = ctx.createRadialGradient(x, y, 0, x, y, 50);
        shieldGradient.addColorStop(0, 'rgba(34, 211, 238, 0.4)');
        shieldGradient.addColorStop(0.7, 'rgba(34, 211, 238, 0.2)');
        shieldGradient.addColorStop(1, 'rgba(34, 211, 238, 0)');
        ctx.fillStyle = shieldGradient;
        ctx.beginPath();
        ctx.arc(x, y, 50, 0, Math.PI * 2);
        ctx.fill();

        // Shield hexagon pattern
        ctx.strokeStyle = 'rgba(34, 211, 238, 0.6)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, 45, 0, Math.PI * 2);
        ctx.stroke();
    }

    // Character riding in tank
    drawTankCharacter(ctx, x, y, angle);

    // Tank base glow
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, 30);
    gradient.addColorStop(0, 'rgba(26, 188, 156, 0.3)');
    gradient.addColorStop(1, 'rgba(26, 188, 156, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fill();
}

function drawTankCharacter(ctx, tankX, tankY, tankAngle) {
    // Character position (on top of tank, slight offset)
    const charX = tankX - 5;
    const charY = tankY - 25;

    // Bounce animation when moving
    const bounceOffset = gameState.isPulling ? Math.sin(Date.now() / 100) * 2 : 0;
    const finalY = charY + bounceOffset;

    // Damage flash effect
    const isDamaged = gameState.damageFlash && Date.now() - gameState.damageFlash < 200;

    ctx.save();

    // Flash red on damage
    if (isDamaged) {
        ctx.globalAlpha = 0.6;
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.arc(charX, finalY, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }

    // Character head (simple circle)
    ctx.fillStyle = isDamaged ? '#ff4444' : '#fcd34d';
    ctx.beginPath();
    ctx.arc(charX, finalY, 8, 0, Math.PI * 2);
    ctx.fill();

    // Character face direction follows tank aim
    ctx.save();
    ctx.translate(charX, finalY);

    // Rotate face to match tank angle
    const faceAngle = tankAngle + Math.PI / 2;
    ctx.rotate(faceAngle);

    // Helmet/goggles
    ctx.fillStyle = '#0d9488';
    ctx.fillRect(-6, -3, 12, 6);

    // Eyes (simple dots)
    ctx.fillStyle = '#1f2937';
    ctx.beginPath();
    ctx.arc(-2, -1, 1.5, 0, Math.PI * 2);
    ctx.arc(2, -1, 1.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Shooting animation (muzzle flash)
    if (gameState.shootingFlash && Date.now() - gameState.shootingFlash < 100) {
        const flashX = tankX + Math.cos(tankAngle) * 40;
        const flashY = tankY + Math.sin(tankAngle) * 40;

        ctx.fillStyle = 'rgba(255, 200, 0, 0.8)';
        ctx.beginPath();
        ctx.arc(flashX, flashY, 8, 0, Math.PI * 2);
        ctx.fill();

        // Character recoil animation (lean back slightly)
        const recoilOffset = 2;
        ctx.fillStyle = '#fcd34d';
        ctx.beginPath();
        ctx.arc(charX - Math.cos(tankAngle) * recoilOffset,
                finalY - Math.sin(tankAngle) * recoilOffset, 8, 0, Math.PI * 2);
        ctx.fill();
    }

    // Victory pose (wave cleared)
    if (gameState.victoryPose && Date.now() - gameState.victoryPose < 2000) {
        // Confetti particles
        for (let i = 0; i < 5; i++) {
            const particleAngle = (Date.now() / 500 + i) % (Math.PI * 2);
            const particleX = charX + Math.cos(particleAngle) * 15;
            const particleY = finalY + Math.sin(particleAngle) * 15 - 10;

            ctx.fillStyle = ['#fcd34d', '#22d3ee', '#a78bfa', '#fb923c'][i % 4];
            ctx.fillRect(particleX, particleY, 3, 3);
        }

        // Character arms up in victory
        ctx.strokeStyle = '#fcd34d';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';

        // Left arm raised
        ctx.beginPath();
        ctx.moveTo(charX - 6, finalY);
        ctx.lineTo(charX - 12, finalY - 10);
        ctx.stroke();

        // Right arm raised
        ctx.beginPath();
        ctx.moveTo(charX + 6, finalY);
        ctx.lineTo(charX + 12, finalY - 10);
        ctx.stroke();
    }

    ctx.restore();
}

// ============================================================
// STEP 5: Update gameLoop to include powerup rendering
// ============================================================
/*
In the gameLoop function, add these lines in the update section:

        updatePowerupPickups(canvas);

And in the draw section:

        drawPowerupPickups(ctx);
        drawPowerupIndicators(ctx, canvas);
*/

// ============================================================
// STEP 6: Modify checkCollisions to spawn powerups
// ============================================================
/*
In checkCollisions function, when a bubble is destroyed, add:

        if (bubble.isFake) {
            // Existing code...
            spawnPowerupFromBubble(bubble.x, bubble.y); // ADD THIS LINE
        }
*/

// ============================================================
// STEP 7: Modify releasePull to trigger shooting animation
// ============================================================
/*
In releasePull function, after creating truthBomb, add:

        gameState.shootingFlash = Date.now(); // ADD THIS LINE
*/

// ============================================================
// STEP 8: Modify loseCredibility to trigger damage flash
// ============================================================
/*
In loseCredibility function, add at the beginning:

        gameState.damageFlash = Date.now(); // ADD THIS LINE
*/

// ============================================================
// INTEGRATION SUMMARY
// ============================================================
/*
1. Add powerup properties to gameState
2. Add PowerupPickup class before startTruthCannon function
3. Add powerup helper functions
4. Replace drawCannon with enhanced version
5. Add drawTankCharacter function
6. Update gameLoop to call powerup update/draw functions
7. Modify checkCollisions to spawn powerups
8. Modify releasePull to show shooting animation
9. Modify loseCredibility to show damage flash

FEATURES ADDED:
- Tank visual with tracks, turret, and cannon
- Character riding on top facing tank direction
- Character bounces when aiming
- Shooting animation with muzzle flash and recoil
- Damage flash (red) when hit
- Victory pose with confetti when wave complete
- 5 powerup types with pickup system
- Weapon visuals for each powerup
- Shield visual effect
- Active powerup indicators in UI
- Powerups drop from destroyed enemies
*/
