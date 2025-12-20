// ============================================================
// TANK SHOOTER - ENHANCED VERSION WITH IMPROVED GRAPHICS
// ============================================================
// Enhancements: Better graphics, visual effects, more bosses, improved controls

// ==================== GAME STATE ====================

let tankGame = {
    running: false,
    paused: false,
    wave: 1,
    score: 0,
    combo: 1,
    comboTimer: 0,
    enemiesKilled: 0,
    player: null,
    enemies: [],
    projectiles: [],
    particles: [],
    powerUps: {
        slowMo: { ready: true, cooldown: 0, active: false, duration: 0 },
        scatterShot: { ready: true, cooldown: 0, active: false, duration: 0 },
        xRay: { ready: true, cooldown: 0, active: false, duration: 0 },
        shield: { ready: true, cooldown: 0, shieldHP: 0 },
        emp: { ready: true, cooldown: 0 }
    },
    waveActive: false,
    waveTransitionTimer: 0,
    enemiesSpawned: 0,
    enemiesToSpawn: [],
    spawnTimer: 0,
    timeScale: 1.0,
    lastTime: 0,
    keys: {},
    mouseX: 0,
    mouseY: 0,
    canvas: null,
    ctx: null,
    screenShake: 0,
    screenShakeX: 0,
    screenShakeY: 0,
    bossActive: false,
    currentBoss: null
};

// ==================== ENHANCED CONFIGURATION ====================

const TANK_CONFIG = {
    // Player stats
    PLAYER_SPEED: 150,
    PLAYER_HP: 100,
    PLAYER_MAX_HP: 100,
    PLAYER_FIRE_RATE: 400, // Faster (was 500)
    PLAYER_DAMAGE: 30, // Higher (was 25)
    PLAYER_RADIUS: 20,
    PLAYER_REGEN_RATE: 3, // Faster (was 2)
    PLAYER_REGEN_DELAY: 4000, // Quicker (was 5000)

    // Projectile stats
    PROJECTILE_SPEED: 350, // Faster (was 300)
    PROJECTILE_RADIUS: 5, // Bigger (was 4)
    PROJECTILE_LIFETIME: 3500, // Longer (was 3000)

    // Enemy stats - EXPANDED
    ENEMIES: {
        spam: { hp: 30, speed: 80, damage: 10, score: 15, coins: 2, radius: 15, color: '#ff4478', icon: '📧' },
        fakenews: { hp: 60, speed: 110, damage: 15, score: 30, coins: 3, radius: 18, color: '#ff6b9d', icon: '📰' },
        deepfake: { hp: 120, speed: 55, damage: 35, score: 60, coins: 7, radius: 22, color: '#ff1744', icon: '🤖', canShoot: true },
        swarm: { hp: 20, speed: 140, damage: 5, score: 8, coins: 1, radius: 10, color: '#ff8a9d', icon: '⚡' },
        troll: { hp: 90, speed: 65, damage: 25, score: 45, coins: 5, radius: 20, color: '#ff5722', icon: '👹' },
        botnet: { hp: 150, speed: 40, damage: 40, score: 80, coins: 10, radius: 25, color: '#e91e63', icon: '🕸️', canShoot: true },

        // BOSSES - Multiple types
        bossAI: { hp: 800, speed: 35, damage: 60, score: 1000, coins: 50, radius: 50, color: '#8e44ad', icon: '🧠', canShoot: true, isBoss: true },
        bossGAN: { hp: 1200, speed: 25, damage: 80, score: 1500, coins: 75, radius: 55, color: '#9c27b0', icon: '👾', canShoot: true, isBoss: true },
        bossDiffusion: { hp: 1600, speed: 20, damage: 100, score: 2000, coins: 100, radius: 60, color: '#673ab7', icon: '🌀', canShoot: true, isBoss: true },
        bossLLM: { hp: 2000, speed: 30, damage: 120, score: 2500, coins: 125, radius: 65, color: '#3f51b5', icon: '💬', canShoot: true, isBoss: true },
        bossUltimate: { hp: 3000, speed: 40, damage: 150, score: 5000, coins: 200, radius: 70, color: '#1a237e', icon: '👑', canShoot: true, isBoss: true }
    },

    // Wave config
    WAVE_TRANSITION_TIME: 2500, // Faster (was 3000)
    SPAWN_INTERVAL: 1200, // Faster spawns (was 1500)
    HP_SCALE_PER_WAVE: 0.08, // More scaling (was 0.05)
    SPEED_SCALE_PER_WAVE: 0.04, // More scaling (was 0.03)
    MAX_HP_SCALE: 1.5, // Higher cap (was 1.0)
    MAX_SPEED_SCALE: 0.75, // Higher cap (was 0.5)

    // Power-up durations/cooldowns (ms) - IMPROVED
    POWERUP_SLOW_MO: { duration: 12000, cooldown: 35000, timeScale: 0.2 }, // Longer, better slow
    POWERUP_SCATTER: { duration: 10000, cooldown: 25000, spreadCount: 7 }, // More projectiles
    POWERUP_XRAY: { duration: 15000, cooldown: 50000, damageBoost: 0.75 }, // Better boost
    POWERUP_SHIELD: { hp: 150, cooldown: 35000, reflectPercent: 0.75 }, // Stronger shield
    POWERUP_EMP: { damage: 75, stun: 3000, cooldown: 70000 }, // Better EMP

    // Performance limits
    MAX_ENEMIES: 80, // More (was 50)
    MAX_PROJECTILES: 150, // More (was 100)
    MAX_PARTICLES: 400, // More (was 200)

    // Scoring
    WAVE_COMPLETE_POINTS: 150, // More (was 100)
    NO_DAMAGE_BONUS: 300, // More (was 200)
    COMBO_WINDOW: 2500, // Longer (was 2000)
    COMBO_INCREMENT: 0.6, // Faster (was 0.5)
    MAX_COMBO: 8.0 // Higher (was 5.0)
};

// ==================== ENHANCED ENTITY CLASSES ====================

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.angle = 0;
        this.bodyAngle = 0;
        this.vx = 0;
        this.vy = 0;
        this.speed = TANK_CONFIG.PLAYER_SPEED;
        this.hp = TANK_CONFIG.PLAYER_HP;
        this.maxHP = TANK_CONFIG.PLAYER_MAX_HP;
        this.fireRate = TANK_CONFIG.PLAYER_FIRE_RATE;
        this.lastShot = 0;
        this.lastDamageTime = 0;
        this.damage = TANK_CONFIG.PLAYER_DAMAGE;
        this.radius = TANK_CONFIG.PLAYER_RADIUS;
        this.muzzleFlash = 0;
        this.dashCooldown = 0;
        this.dashReady = true;
    }

    update(deltaTime, canvas) {
        const dt = deltaTime / 1000;

        // Movement
        let moveX = 0;
        let moveY = 0;

        if (tankGame.keys['w'] || tankGame.keys['ArrowUp']) moveY -= 1;
        if (tankGame.keys['s'] || tankGame.keys['ArrowDown']) moveY += 1;
        if (tankGame.keys['a'] || tankGame.keys['ArrowLeft']) moveX -= 1;
        if (tankGame.keys['d'] || tankGame.keys['ArrowRight']) moveX += 1;

        // Normalize diagonal movement
        if (moveX !== 0 && moveY !== 0) {
            moveX *= 0.707;
            moveY *= 0.707;
        }

        this.vx = moveX * this.speed;
        this.vy = moveY * this.speed;

        this.x += this.vx * dt;
        this.y += this.vy * dt;

        // Keep player in bounds
        this.x = Math.max(this.radius, Math.min(canvas.width - this.radius, this.x));
        this.y = Math.max(this.radius, Math.min(canvas.height - this.radius, this.y));

        // Update body angle based on movement
        if (this.vx !== 0 || this.vy !== 0) {
            this.bodyAngle = Math.atan2(this.vy, this.vx);
        }

        // Health regeneration
        if (Date.now() - this.lastDamageTime > TANK_CONFIG.PLAYER_REGEN_DELAY) {
            this.hp = Math.min(this.maxHP, this.hp + TANK_CONFIG.PLAYER_REGEN_RATE * dt);
        }

        // Muzzle flash decay
        if (this.muzzleFlash > 0) {
            this.muzzleFlash -= deltaTime / 100;
        }

        // Dash cooldown
        if (this.dashCooldown > 0) {
            this.dashCooldown -= deltaTime;
            if (this.dashCooldown <= 0) {
                this.dashReady = true;
            }
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        // Tank treads/tracks
        ctx.rotate(this.bodyAngle);
        ctx.fillStyle = '#0d7a5f';
        ctx.fillRect(-this.radius - 2, -this.radius * 0.8, this.radius * 2 + 4, this.radius * 0.3);
        ctx.fillRect(-this.radius - 2, this.radius * 0.5, this.radius * 2 + 4, this.radius * 0.3);

        // Tank body - gradient
        const bodyGradient = ctx.createLinearGradient(-this.radius, -this.radius * 0.6, this.radius, this.radius * 0.6);
        bodyGradient.addColorStop(0, '#1ed6a0');
        bodyGradient.addColorStop(1, '#16a085');
        ctx.fillStyle = bodyGradient;
        ctx.strokeStyle = '#0d7a5f';
        ctx.lineWidth = 3;
        ctx.fillRect(-this.radius, -this.radius * 0.6, this.radius * 2, this.radius * 1.2);
        ctx.strokeRect(-this.radius, -this.radius * 0.6, this.radius * 2, this.radius * 1.2);

        // Tank details (panels)
        ctx.fillStyle = '#0d7a5f';
        ctx.fillRect(-this.radius * 0.7, -this.radius * 0.4, this.radius * 0.4, this.radius * 0.8);
        ctx.fillRect(this.radius * 0.3, -this.radius * 0.4, this.radius * 0.4, this.radius * 0.8);

        ctx.restore();
        ctx.save();
        ctx.translate(this.x, this.y);

        // Turret
        ctx.rotate(this.angle);

        // Turret barrel - gradient
        const barrelGradient = ctx.createLinearGradient(0, -8, 0, 8);
        barrelGradient.addColorStop(0, '#0d7a5f');
        barrelGradient.addColorStop(0.5, '#16a085');
        barrelGradient.addColorStop(1, '#0d7a5f');
        ctx.fillStyle = barrelGradient;
        ctx.fillRect(0, -8, this.radius * 1.7, 16);

        // Barrel tip
        ctx.fillStyle = '#000';
        ctx.fillRect(this.radius * 1.7, -6, 5, 12);

        // Muzzle flash effect
        if (this.muzzleFlash > 0) {
            ctx.save();
            ctx.globalAlpha = this.muzzleFlash;
            const flashGradient = ctx.createRadialGradient(
                this.radius * 1.7 + 10, 0, 0,
                this.radius * 1.7 + 10, 0, 20
            );
            flashGradient.addColorStop(0, '#fff');
            flashGradient.addColorStop(0.3, '#ffee00');
            flashGradient.addColorStop(1, 'transparent');
            ctx.fillStyle = flashGradient;
            ctx.beginPath();
            ctx.arc(this.radius * 1.7 + 10, 0, 20, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // Turret base - 3D effect
        ctx.beginPath();
        ctx.arc(0, 0, this.radius * 0.8, 0, Math.PI * 2);
        const turretGradient = ctx.createRadialGradient(0, -5, 0, 0, 0, this.radius * 0.8);
        turretGradient.addColorStop(0, '#1ed6a0');
        turretGradient.addColorStop(1, '#0d7a5f');
        ctx.fillStyle = turretGradient;
        ctx.fill();
        ctx.strokeStyle = '#0a5f4a';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();

        // Health bar - enhanced
        const barWidth = this.radius * 2.5;
        const barHeight = 6;
        const barX = this.x - this.radius * 1.25;
        const barY = this.y - this.radius - 16;

        // Background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(barX - 1, barY - 1, barWidth + 2, barHeight + 2);

        const hpPercent = this.hp / this.maxHP;

        // HP bar gradient
        const hpGradient = ctx.createLinearGradient(barX, 0, barX + barWidth * hpPercent, 0);
        if (hpPercent > 0.5) {
            hpGradient.addColorStop(0, '#00ff88');
            hpGradient.addColorStop(1, '#00cc66');
        } else if (hpPercent > 0.25) {
            hpGradient.addColorStop(0, '#ffee00');
            hpGradient.addColorStop(1, '#ffaa00');
        } else {
            hpGradient.addColorStop(0, '#ff6644');
            hpGradient.addColorStop(1, '#ff3322');
        }
        ctx.fillStyle = hpGradient;
        ctx.fillRect(barX, barY, barWidth * hpPercent, barHeight);

        // Shield effect - ENHANCED
        if (tankGame.powerUps.shield.shieldHP > 0) {
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius + 12 + i * 4, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(26, 188, 156, ${0.6 - i * 0.15})`;
                ctx.lineWidth = 4 - i;
                ctx.stroke();
            }

            // Animated shield hexagons
            const time = Date.now() / 1000;
            for (let j = 0; j < 6; j++) {
                const angle = (j * Math.PI / 3) + time;
                const distance = this.radius + 15;
                const hexX = this.x + Math.cos(angle) * distance;
                const hexY = this.y + Math.sin(angle) * distance;

                ctx.save();
                ctx.translate(hexX, hexY);
                ctx.rotate(time);
                ctx.strokeStyle = 'rgba(26, 188, 156, 0.8)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                for (let k = 0; k < 6; k++) {
                    const hexAngle = k * Math.PI / 3;
                    const hx = Math.cos(hexAngle) * 5;
                    const hy = Math.sin(hexAngle) * 5;
                    if (k === 0) ctx.moveTo(hx, hy);
                    else ctx.lineTo(hx, hy);
                }
                ctx.closePath();
                ctx.stroke();
                ctx.restore();
            }
        }

        // Power-up visual indicators
        const activeY = this.y + this.radius + 25;
        let offsetX = -20;

        if (tankGame.powerUps.slowMo.active) {
            ctx.fillStyle = '#6495ed';
            ctx.font = 'bold 12px monospace';
            ctx.fillText('⏱️', this.x + offsetX, activeY);
            offsetX += 15;
        }
        if (tankGame.powerUps.scatterShot.active) {
            ctx.fillStyle = '#ff6b9d';
            ctx.font = 'bold 12px monospace';
            ctx.fillText('💥', this.x + offsetX, activeY);
            offsetX += 15;
        }
        if (tankGame.powerUps.xRay.active) {
            ctx.fillStyle = '#00ff88';
            ctx.font = 'bold 12px monospace';
            ctx.fillText('🔍', this.x + offsetX, activeY);
            offsetX += 15;
        }
    }

    shoot() {
        const now = Date.now();
        if (now - this.lastShot < this.fireRate) return;

        this.lastShot = now;
        this.muzzleFlash = 1.0;

        // Screen shake on shoot
        tankGame.screenShake = Math.min(tankGame.screenShake + 2, 10);

        if (tankGame.powerUps.scatterShot.active) {
            // Scatter shot - 7 projectiles in cone
            const spreadAngle = Math.PI / 5; // 36 degrees
            for (let i = -3; i <= 3; i++) {
                const angle = this.angle + (i * spreadAngle / 6);
                tankGame.projectiles.push(new Projectile(this.x, this.y, angle, this.getCurrentDamage(), 'player'));
            }
        } else {
            tankGame.projectiles.push(new Projectile(this.x, this.y, this.angle, this.getCurrentDamage(), 'player'));
        }

        // Enhanced shooting particles
        const barrelX = this.x + Math.cos(this.angle) * (this.radius * 1.7);
        const barrelY = this.y + Math.sin(this.angle) * (this.radius * 1.7);
        for (let i = 0; i < 3; i++) {
            tankGame.particles.push(new Particle(barrelX, barrelY, '#ffee00', 'smoke'));
        }

        // Haptic feedback
        if (navigator.vibrate) navigator.vibrate(15);
    }

    getCurrentDamage() {
        let dmg = this.damage;
        if (tankGame.powerUps.xRay.active) {
            dmg *= (1 + TANK_CONFIG.POWERUP_XRAY.damageBoost);
        }
        return dmg;
    }

    takeDamage(amount) {
        // Shield absorbs damage first
        if (tankGame.powerUps.shield.shieldHP > 0) {
            const absorbed = Math.min(tankGame.powerUps.shield.shieldHP, amount);
            tankGame.powerUps.shield.shieldHP -= absorbed;
            amount -= absorbed;

            // Shield hit particles
            for (let i = 0; i < 10; i++) {
                tankGame.particles.push(new Particle(this.x, this.y, '#1abc9c', 'spark'));
            }
        }

        if (amount > 0) {
            this.hp -= amount;
            this.lastDamageTime = Date.now();

            // Screen shake on hit
            tankGame.screenShake = Math.min(tankGame.screenShake + amount / 2, 20);

            // Damage particles
            for (let i = 0; i < 8; i++) {
                tankGame.particles.push(new Particle(this.x, this.y, '#ff4444', 'spark'));
            }
        }

        if (this.hp <= 0) {
            this.hp = 0;
            gameOver();
        }
    }

    dash() {
        if (!this.dashReady) return;

        this.dashReady = false;
        this.dashCooldown = 5000;

        // Dash in movement direction
        let dashX = 0;
        let dashY = 0;
        if (tankGame.keys['w'] || tankGame.keys['ArrowUp']) dashY -= 1;
        if (tankGame.keys['s'] || tankGame.keys['ArrowDown']) dashY += 1;
        if (tankGame.keys['a'] || tankGame.keys['ArrowLeft']) dashX -= 1;
        if (tankGame.keys['d'] || tankGame.keys['ArrowRight']) dashX += 1;

        if (dashX === 0 && dashY === 0) {
            dashX = Math.cos(this.bodyAngle);
            dashY = Math.sin(this.bodyAngle);
        }

        // Normalize
        const magnitude = Math.sqrt(dashX * dashX + dashY * dashY);
        if (magnitude > 0) {
            dashX /= magnitude;
            dashY /= magnitude;
        }

        const dashDistance = 150;
        this.x += dashX * dashDistance;
        this.y += dashY * dashDistance;

        // Dash particles trail
        for (let i = 0; i < 20; i++) {
            tankGame.particles.push(new Particle(this.x, this.y, '#1abc9c', 'dash'));
        }

        if (navigator.vibrate) navigator.vibrate([30, 50, 30]);
    }
}

class Enemy {
    constructor(type, x, y) {
        this.type = type;
        this.x = x;
        this.y = y;
        const stats = TANK_CONFIG.ENEMIES[type];

        const hpScale = Math.min(1 + tankGame.wave * TANK_CONFIG.HP_SCALE_PER_WAVE, 1 + TANK_CONFIG.MAX_HP_SCALE);
        const speedScale = Math.min(1 + tankGame.wave * TANK_CONFIG.SPEED_SCALE_PER_WAVE, 1 + TANK_CONFIG.MAX_SPEED_SCALE);

        this.hp = stats.hp * hpScale;
        this.maxHP = this.hp;
        this.speed = stats.speed * speedScale;
        this.damage = stats.damage;
        this.score = stats.score;
        this.coins = stats.coins;
        this.radius = stats.radius;
        this.color = stats.color;
        this.icon = stats.icon;
        this.canShoot = stats.canShoot || false;
        this.isBoss = stats.isBoss || false;
        this.angle = 0;
        this.active = true;
        this.lastShot = 0;
        this.fireRate = this.isBoss ? 1200 : 2000;
        this.stunned = false;
        this.stunTimer = 0;
        this.hitFlash = 0;
    }

    update(deltaTime, player, canvas) {
        if (!this.active) return;

        const dt = deltaTime / 1000;

        // Hit flash decay
        if (this.hitFlash > 0) {
            this.hitFlash -= deltaTime / 50;
        }

        // Handle stun
        if (this.stunned) {
            this.stunTimer -= deltaTime;
            if (this.stunTimer <= 0) {
                this.stunned = false;
            }
            return;
        }

        // AI behavior
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        this.angle = Math.atan2(dy, dx);

        // Different behaviors
        if (this.type === 'swarm') {
            this.x += (dx / dist) * this.speed * dt * tankGame.timeScale;
            this.y += (dy / dist) * this.speed * dt * tankGame.timeScale;
        } else if (this.type === 'fakenews') {
            const wobble = Math.sin(Date.now() / 500) * 50;
            const perpX = -dy / dist;
            const perpY = dx / dist;
            this.x += ((dx / dist) * this.speed + perpX * wobble) * dt * tankGame.timeScale;
            this.y += ((dy / dist) * this.speed + perpY * wobble) * dt * tankGame.timeScale;
        } else if (this.isBoss) {
            // Boss circular movement
            const circleSpeed = 30;
            const perpX = -dy / dist;
            const perpY = dx / dist;
            this.x += ((dx / dist) * this.speed + perpX * circleSpeed) * dt * tankGame.timeScale;
            this.y += ((dy / dist) * this.speed + perpY * circleSpeed) * dt * tankGame.timeScale;
        } else {
            this.x += (dx / dist) * this.speed * dt * tankGame.timeScale;
            this.y += (dy / dist) * this.speed * dt * tankGame.timeScale;
        }

        // Shoot at player
        const shootRange = this.isBoss ? 400 : 300;
        if (this.canShoot && dist < shootRange && Date.now() - this.lastShot > this.fireRate) {
            this.lastShot = Date.now();
            if (this.isBoss) {
                // Bosses shoot triple shot
                for (let i = -1; i <= 1; i++) {
                    const shotAngle = this.angle + (i * Math.PI / 12);
                    tankGame.projectiles.push(new Projectile(this.x, this.y, shotAngle, this.damage, 'enemy'));
                }
            } else {
                tankGame.projectiles.push(new Projectile(this.x, this.y, this.angle, this.damage, 'enemy'));
            }
        }

        // Collision with player
        const playerDist = Math.sqrt(Math.pow(this.x - player.x, 2) + Math.pow(this.y - player.y, 2));
        if (playerDist < this.radius + player.radius) {
            player.takeDamage(this.damage);
            this.active = false;
            createExplosion(this.x, this.y, this.color, this.isBoss ? 'large' : 'normal');
        }
    }

    draw(ctx) {
        if (!this.active) return;

        // Enhanced glow effect
        const glowLayers = this.isBoss ? 4 : 2;
        for (let i = 0; i < glowLayers; i++) {
            const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * (2 + i * 0.5));
            gradient.addColorStop(0, this.color);
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.globalAlpha = 0.4 - i * 0.1;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius * (2 + i * 0.5), 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;

        // Enemy body with gradient
        const bodyGradient = ctx.createRadialGradient(this.x - this.radius/3, this.y - this.radius/3, 0, this.x, this.y, this.radius);
        const lightColor = this.lightenColor(this.color, 20);
        bodyGradient.addColorStop(0, lightColor);
        bodyGradient.addColorStop(1, this.color);
        ctx.fillStyle = bodyGradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // Border
        ctx.strokeStyle = this.isBoss ? '#ffffff' : this.darkenColor(this.color, 20);
        ctx.lineWidth = this.isBoss ? 4 : 2;
        ctx.stroke();

        // Hit flash
        if (this.hitFlash > 0) {
            ctx.save();
            ctx.globalAlpha = this.hitFlash;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // Boss crown effect
        if (this.isBoss) {
            ctx.save();
            ctx.translate(this.x, this.y - this.radius - 10);
            ctx.fillStyle = '#ffd700';
            ctx.font = 'bold 20px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('👑', 0, 0);
            ctx.restore();
        }

        // Enemy icon - larger for bosses
        const iconSize = this.isBoss ? this.radius * 1.2 : this.radius;
        ctx.font = `${iconSize}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.icon, this.x, this.y);

        // Health bar - always show for bosses
        if (this.hp < this.maxHP || tankGame.powerUps.xRay.active || this.isBoss) {
            const barWidth = this.radius * (this.isBoss ? 3 : 2);
            const barHeight = this.isBoss ? 8 : 5;
            const barX = this.x - barWidth / 2;
            const barY = this.y - this.radius - (this.isBoss ? 15 : 10);

            // Background
            ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            ctx.fillRect(barX - 1, barY - 1, barWidth + 2, barHeight + 2);

            const hpPercent = this.hp / this.maxHP;

            // HP gradient
            const hpGradient = ctx.createLinearGradient(barX, 0, barX + barWidth, 0);
            hpGradient.addColorStop(0, '#ff4444');
            hpGradient.addColorStop(1, '#ff1111');
            ctx.fillStyle = hpGradient;
            ctx.fillRect(barX, barY, barWidth * hpPercent, barHeight);

            // Boss HP text
            if (this.isBoss) {
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 10px monospace';
                ctx.textAlign = 'center';
                ctx.fillText(`${Math.ceil(this.hp)}/${Math.ceil(this.maxHP)}`, this.x, barY - 8);
            }
        }

        // Stun effect - enhanced
        if (this.stunned) {
            const time = Date.now() / 100;
            for (let i = 0; i < 3; i++) {
                const angle = time + (i * Math.PI * 2 / 3);
                const starX = this.x + Math.cos(angle) * (this.radius + 10);
                const starY = this.y + Math.sin(angle) * (this.radius + 10) - 10;
                ctx.fillStyle = '#ffee00';
                ctx.font = 'bold 16px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('⭐', starX, starY);
            }
        }
    }

    lightenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.min(255, (num >> 16) + amt);
        const G = Math.min(255, (num >> 8 & 0x00FF) + amt);
        const B = Math.min(255, (num & 0x0000FF) + amt);
        return '#' + (0x1000000 + (R << 16) + (G << 8) + B).toString(16).slice(1);
    }

    darkenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.max(0, (num >> 16) - amt);
        const G = Math.max(0, (num >> 8 & 0x00FF) - amt);
        const B = Math.max(0, (num & 0x0000FF) - amt);
        return '#' + (0x1000000 + (R << 16) + (G << 8) + B).toString(16).slice(1);
    }

    takeDamage(amount) {
        this.hp -= amount;
        this.hitFlash = 1.0;

        // Damage number popup
        createDamageNumber(this.x, this.y, amount);

        if (this.hp <= 0) {
            this.active = false;
            killEnemy(this);
        }
    }

    stun(duration) {
        this.stunned = true;
        this.stunTimer = duration;
    }
}

class Projectile {
    constructor(x, y, angle, damage, owner) {
        this.x = x;
        this.y = y;
        this.vx = Math.cos(angle) * TANK_CONFIG.PROJECTILE_SPEED;
        this.vy = Math.sin(angle) * TANK_CONFIG.PROJECTILE_SPEED;
        this.damage = damage;
        this.owner = owner;
        this.radius = TANK_CONFIG.PROJECTILE_RADIUS;
        this.active = true;
        this.lifetime = 0;
        this.maxLifetime = TANK_CONFIG.PROJECTILE_LIFETIME;
        this.trail = [];
    }

    update(deltaTime, canvas) {
        const dt = deltaTime / 1000;

        // Store trail positions
        this.trail.push({ x: this.x, y: this.y, life: 1.0 });
        if (this.trail.length > 5) this.trail.shift();

        // Update trail life
        this.trail.forEach(t => t.life -= 0.15);

        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.lifetime += deltaTime;

        if (this.lifetime > this.maxLifetime ||
            this.x < 0 || this.x > canvas.width ||
            this.y < 0 || this.y > canvas.height) {
            this.active = false;
        }
    }

    draw(ctx) {
        if (!this.active) return;

        const color = this.owner === 'player' ? '#1abc9c' : '#ff4478';
        const coreColor = this.owner === 'player' ? '#00ff88' : '#ff1744';

        // Draw trail
        this.trail.forEach((t, i) => {
            if (t.life <= 0) return;
            ctx.save();
            ctx.globalAlpha = t.life * 0.6;
            const trailGradient = ctx.createRadialGradient(t.x, t.y, 0, t.x, t.y, this.radius * (1 + i * 0.3));
            trailGradient.addColorStop(0, color);
            trailGradient.addColorStop(1, 'transparent');
            ctx.fillStyle = trailGradient;
            ctx.beginPath();
            ctx.arc(t.x, t.y, this.radius * (1 + i * 0.3), 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });

        // Glow effect - enhanced
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 3);
        gradient.addColorStop(0, color);
        gradient.addColorStop(0.5, color);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2);
        ctx.fill();

        // Core - bright center
        ctx.fillStyle = coreColor;
        ctx.shadowColor = coreColor;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Inner highlight
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x - this.radius/3, this.y - this.radius/3, this.radius/2, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Particle {
    constructor(x, y, color, type = 'explosion') {
        this.x = x;
        this.y = y;
        this.type = type;

        if (type === 'smoke') {
            this.vx = (Math.random() - 0.5) * 50;
            this.vy = (Math.random() - 0.5) * 50;
            this.size = 3 + Math.random() * 3;
            this.life = 0.8;
        } else if (type === 'spark') {
            this.vx = (Math.random() - 0.5) * 300;
            this.vy = (Math.random() - 0.5) * 300;
            this.size = 2 + Math.random() * 2;
            this.life = 0.6;
        } else if (type === 'dash') {
            this.vx = (Math.random() - 0.5) * 100;
            this.vy = (Math.random() - 0.5) * 100;
            this.size = 4 + Math.random() * 4;
            this.life = 0.5;
        } else { // explosion
            this.vx = (Math.random() - 0.5) * 250;
            this.vy = (Math.random() - 0.5) * 250;
            this.size = 3 + Math.random() * 5;
            this.life = 1.0;
        }

        this.color = color;
        this.gravity = type === 'smoke' ? -20 : 100;
    }

    update(deltaTime) {
        const dt = deltaTime / 1000;
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.vy += this.gravity * dt;
        this.life -= dt * (this.type === 'spark' ? 3 : 2);

        // Fade size
        if (this.type === 'smoke') {
            this.size += dt * 5;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.life);

        if (this.type === 'spark') {
            // Spark particles are elongated
            ctx.fillStyle = this.color;
            ctx.shadowColor = this.color;
            ctx.shadowBlur = 5;
            ctx.fillRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size * 1.5);
        } else {
            // Round particles
            const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
            gradient.addColorStop(0, this.color);
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }
}

// Damage numbers
class DamageNumber {
    constructor(x, y, damage) {
        this.x = x + (Math.random() - 0.5) * 20;
        this.y = y - 20;
        this.damage = Math.ceil(damage);
        this.vy = -80;
        this.life = 1.0;
        this.isCrit = damage > 50;
    }

    update(deltaTime) {
        const dt = deltaTime / 1000;
        this.y += this.vy * dt;
        this.vy += 40 * dt; // Gravity
        this.life -= dt * 1.2;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.life);
        ctx.font = this.isCrit ? 'bold 24px monospace' : 'bold 18px monospace';
        ctx.fillStyle = this.isCrit ? '#ffee00' : '#ffffff';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.textAlign = 'center';
        ctx.strokeText(this.damage, this.x, this.y);
        ctx.fillText(this.damage, this.x, this.y);
        ctx.restore();
    }
}

const damageNumbers = [];

function createDamageNumber(x, y, damage) {
    damageNumbers.push(new DamageNumber(x, y, damage));
    if (damageNumbers.length > 50) damageNumbers.shift();
}

// ==================== GAME LOGIC ====================

function startTankShooter() {
    console.log('[TankShooter] Starting ENHANCED game...');

    const gameContainer = document.getElementById('truthCannonGame');
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 200;

    // Reset game state
    tankGame.running = true;
    tankGame.paused = false;
    tankGame.wave = 1;
    tankGame.score = 0;
    tankGame.combo = 1;
    tankGame.comboTimer = 0;
    tankGame.enemiesKilled = 0;
    tankGame.player = new Player(canvas.width / 2, canvas.height / 2);
    tankGame.enemies = [];
    tankGame.projectiles = [];
    tankGame.particles = [];
    tankGame.timeScale = 1.0;
    tankGame.lastTime = Date.now();
    tankGame.canvas = canvas;
    tankGame.ctx = ctx;
    tankGame.screenShake = 0;
    tankGame.bossActive = false;
    tankGame.currentBoss = null;
    damageNumbers.length = 0;

    // Reset power-ups
    for (let key in tankGame.powerUps) {
        tankGame.powerUps[key] = { ready: true, cooldown: 0, active: false, duration: 0, shieldHP: 0 };
    }

    gameContainer.style.display = 'flex';
    document.getElementById('gameOverScreen').style.display = 'none';
    updateGameUI();

    setupControls(canvas);

    if (window.innerWidth < 768) {
        document.getElementById('mobileControls').style.display = 'block';
        setupVirtualJoystick();
    }

    startWave(1);
    requestAnimationFrame(gameLoop);
}

function gameLoop() {
    if (!tankGame.running) return;

    try {
        const now = Date.now();
        const deltaTime = Math.min(now - tankGame.lastTime, 100);
        tankGame.lastTime = now;

        // Clear canvas
        tankGame.ctx.save();

        // Screen shake effect
        if (tankGame.screenShake > 0) {
            tankGame.screenShakeX = (Math.random() - 0.5) * tankGame.screenShake;
            tankGame.screenShakeY = (Math.random() - 0.5) * tankGame.screenShake;
            tankGame.ctx.translate(tankGame.screenShakeX, tankGame.screenShakeY);
            tankGame.screenShake *= 0.9; // Decay
            if (tankGame.screenShake < 0.5) tankGame.screenShake = 0;
        }

        tankGame.ctx.clearRect(-50, -50, tankGame.canvas.width + 100, tankGame.canvas.height + 100);

        // Draw background
        drawEnhancedBackground(tankGame.ctx);

        // Update game logic
        updateGame(deltaTime);

        // Draw everything
        drawGame(tankGame.ctx);

        tankGame.ctx.restore();

        // Update UI
        updateGameUI();

        requestAnimationFrame(gameLoop);
    } catch (error) {
        console.error('[TankShooter] Error in game loop:', error);
        requestAnimationFrame(gameLoop);
    }
}

function updateGame(deltaTime) {
    // Update player
    if (tankGame.player) {
        tankGame.player.update(deltaTime, tankGame.canvas);

        // Auto-aim on mobile
        if (window.innerWidth < 768 && tankGame.enemies.length > 0) {
            let nearest = null;
            let minDist = Infinity;
            tankGame.enemies.forEach(enemy => {
                const dist = distance(tankGame.player, enemy);
                if (dist < minDist) {
                    minDist = dist;
                    nearest = enemy;
                }
            });
            if (nearest) {
                const dx = nearest.x - tankGame.player.x;
                const dy = nearest.y - tankGame.player.y;
                tankGame.player.angle = Math.atan2(dy, dx);
            }
        }
    }

    // Update enemies
    tankGame.enemies.forEach(enemy => enemy.update(deltaTime, tankGame.player, tankGame.canvas));
    tankGame.enemies = tankGame.enemies.filter(e => e.active);

    // Update projectiles
    tankGame.projectiles.forEach(proj => proj.update(deltaTime, tankGame.canvas));
    tankGame.projectiles = tankGame.projectiles.filter(p => p.active);

    // Update particles
    tankGame.particles.forEach(p => p.update(deltaTime));
    tankGame.particles = tankGame.particles.filter(p => p.life > 0);
    if (tankGame.particles.length > TANK_CONFIG.MAX_PARTICLES) {
        tankGame.particles = tankGame.particles.slice(-TANK_CONFIG.MAX_PARTICLES);
    }

    // Update damage numbers
    damageNumbers.forEach(d => d.update(deltaTime));
    damageNumbers.forEach((d, i) => {
        if (d.life <= 0) damageNumbers.splice(i, 1);
    });

    checkCollisions();
    updatePowerUpCooldowns(deltaTime);
    updateWaveSpawning(deltaTime);

    // Update combo timer
    if (tankGame.comboTimer > 0) {
        tankGame.comboTimer -= deltaTime;
        if (tankGame.comboTimer <= 0) {
            tankGame.combo = 1;
        }
    }
}

function drawGame(ctx) {
    // Draw entities
    tankGame.particles.forEach(p => p.draw(ctx));
    tankGame.enemies.forEach(e => e.draw(ctx));
    if (tankGame.player) tankGame.player.draw(ctx);
    tankGame.projectiles.forEach(p => p.draw(ctx));
    damageNumbers.forEach(d => d.draw(ctx));

    // Draw power-up effects
    drawPowerUpEffects(ctx);

    // Draw combo indicator
    if (tankGame.combo > 1.5) {
        ctx.save();
        ctx.font = 'bold 32px monospace';
        ctx.fillStyle = '#ffee00';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 4;
        ctx.textAlign = 'center';
        const comboText = `COMBO x${tankGame.combo.toFixed(1)}`;
        ctx.strokeText(comboText, tankGame.canvas.width / 2, 60);
        ctx.fillText(comboText, tankGame.canvas.width / 2, 60);
        ctx.restore();
    }

    // Boss warning
    if (tankGame.bossActive && tankGame.currentBoss && tankGame.currentBoss.active) {
        ctx.save();
        const bossWarningAlpha = Math.abs(Math.sin(Date.now() / 300));
        ctx.globalAlpha = bossWarningAlpha * 0.8;
        ctx.font = 'bold 48px monospace';
        ctx.fillStyle = '#ff1744';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 5;
        ctx.textAlign = 'center';
        ctx.strokeText('⚠️ BOSS ⚠️', tankGame.canvas.width / 2, 120);
        ctx.fillText('⚠️ BOSS ⚠️', tankGame.canvas.width / 2, 120);
        ctx.restore();
    }
}

function drawEnhancedBackground(ctx) {
    // Animated grid
    const time = Date.now() / 2000;
    const gridSize = 50;
    const offset = (time * 20) % gridSize;

    ctx.strokeStyle = 'rgba(26, 188, 156, 0.15)';
    ctx.lineWidth = 1;

    for (let x = -offset; x < tankGame.canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, tankGame.canvas.height);
        ctx.stroke();
    }
    for (let y = -offset; y < tankGame.canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(tankGame.canvas.width, y);
        ctx.stroke();
    }

    // Scanlines effect
    ctx.strokeStyle = 'rgba(0, 255, 136, 0.02)';
    for (let y = 0; y < tankGame.canvas.height; y += 4) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(tankGame.canvas.width, y);
        ctx.stroke();
    }
}

function drawPowerUpEffects(ctx) {
    // Slow-mo effect - enhanced
    if (tankGame.powerUps.slowMo.active) {
        ctx.fillStyle = 'rgba(100, 150, 255, 0.15)';
        ctx.fillRect(0, 0, tankGame.canvas.width, tankGame.canvas.height);

        // Time dilation ripples
        const time = Date.now() / 100;
        for (let i = 0; i < 5; i++) {
            const radius = ((time + i * 50) % 300);
            ctx.beginPath();
            ctx.arc(tankGame.canvas.width / 2, tankGame.canvas.height / 2, radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(100, 150, 255, ${0.3 - radius / 1000})`;
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }

    // X-Ray effect - enhanced
    if (tankGame.powerUps.xRay.active) {
        const time = Date.now();
        ctx.strokeStyle = 'rgba(0, 255, 100, 0.4)';
        ctx.lineWidth = 2;

        // Horizontal scan lines
        for (let x = 0; x < tankGame.canvas.width; x += 30) {
            const offset = (time / 10 + x) % 40 - 20;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x + offset, tankGame.canvas.height);
            ctx.stroke();
        }

        // Vertical scan lines
        for (let y = 0; y < tankGame.canvas.height; y += 30) {
            const offset = (time / 10 + y) % 40 - 20;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(tankGame.canvas.width, y + offset);
            ctx.stroke();
        }
    }
}

function checkCollisions() {
    tankGame.projectiles.forEach(proj => {
        if (!proj.active) return;

        if (proj.owner === 'player') {
            tankGame.enemies.forEach(enemy => {
                if (!enemy.active) return;
                if (circleCollision(proj, enemy)) {
                    enemy.takeDamage(proj.damage);
                    proj.active = false;
                    // Impact particles
                    for (let i = 0; i < 5; i++) {
                        tankGame.particles.push(new Particle(proj.x, proj.y, enemy.color, 'spark'));
                    }
                }
            });
        } else if (proj.owner === 'enemy') {
            if (tankGame.player && circleCollision(proj, tankGame.player)) {
                tankGame.player.takeDamage(proj.damage);
                proj.active = false;
            }
        }
    });
}

function circleCollision(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    return dist < a.radius + b.radius;
}

function distance(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function killEnemy(enemy) {
    tankGame.enemiesKilled++;
    const points = Math.floor(enemy.score * tankGame.combo);
    tankGame.score += points;

    // Update combo
    tankGame.combo = Math.min(tankGame.combo + TANK_CONFIG.COMBO_INCREMENT, TANK_CONFIG.MAX_COMBO);
    tankGame.comboTimer = TANK_CONFIG.COMBO_WINDOW;

    createExplosion(enemy.x, enemy.y, enemy.color, enemy.isBoss ? 'massive' : 'normal');

    // Check if boss defeated
    if (enemy.isBoss) {
        tankGame.bossActive = false;
        tankGame.currentBoss = null;
        tankGame.screenShake = 30;

        // Boss defeat notification
        showNotification('BOSS DEFEATED! +' + points);
    }

    if (navigator.vibrate) navigator.vibrate(enemy.isBoss ? [50, 100, 50] : 30);
}

function createExplosion(x, y, color, size = 'normal') {
    const particleCount = size === 'massive' ? 80 : size === 'large' ? 50 : 25;

    for (let i = 0; i < particleCount; i++) {
        tankGame.particles.push(new Particle(x, y, color, 'explosion'));
    }

    // Add smoke
    for (let i = 0; i < particleCount / 3; i++) {
        tankGame.particles.push(new Particle(x, y, '#888', 'smoke'));
    }

    // Add sparks
    for (let i = 0; i < particleCount / 2; i++) {
        tankGame.particles.push(new Particle(x, y, '#ffee00', 'spark'));
    }

    // Screen shake based on size
    if (size === 'massive') tankGame.screenShake = Math.min(tankGame.screenShake + 25, 40);
    else if (size === 'large') tankGame.screenShake = Math.min(tankGame.screenShake + 15, 30);
    else tankGame.screenShake = Math.min(tankGame.screenShake + 5, 15);
}

function updateGameUI() {
    document.getElementById('gameWave').textContent = tankGame.wave;
    document.getElementById('gameScore').textContent = tankGame.score.toLocaleString();
    document.getElementById('gameCombo').textContent = `x${tankGame.combo.toFixed(1)}`;

    const hpPercent = tankGame.player ? (tankGame.player.hp / tankGame.player.maxHP * 100) : 100;
    document.getElementById('credibilityPercent').textContent = `${Math.round(hpPercent)}%`;
    document.getElementById('credibilityFill').style.width = `${hpPercent}%`;
}

// ==================== WAVE SYSTEM ====================

function startWave(waveNum) {
    tankGame.wave = waveNum;
    tankGame.waveActive = true;
    tankGame.enemiesSpawned = 0;
    tankGame.enemiesToSpawn = generateWaveEnemies(waveNum);
    tankGame.spawnTimer = 0;

    showNotification(`WAVE ${waveNum} START!`);

    console.log(`[TankShooter] Wave ${waveNum}: ${tankGame.enemiesToSpawn.length} enemies`);
}

function generateWaveEnemies(wave) {
    const enemies = [];

    // Boss every 5 waves - DIFFERENT BOSSES
    if (wave % 5 === 0) {
        const bossTypes = ['bossAI', 'bossGAN', 'bossDiffusion', 'bossLLM'];
        const bossIndex = Math.min(Math.floor(wave / 5) - 1, bossTypes.length - 1);

        if (wave >= 20) {
            enemies.push('bossUltimate'); // Ultimate boss at wave 20+
        } else {
            enemies.push(bossTypes[bossIndex]);
        }
    }

    // Scaled enemy counts
    const spamCount = 8 + wave * 3;
    const fakeNewsCount = wave >= 2 ? 4 + wave * 2 : 0;
    const deepfakeCount = wave >= 4 ? 2 + Math.floor(wave / 2) : 0;
    const swarmCount = wave >= 6 ? 8 + wave * 2 : 0;
    const trollCount = wave >= 8 ? 3 + Math.floor(wave / 3) : 0;
    const botnetCount = wave >= 10 ? 1 + Math.floor(wave / 5) : 0;

    for (let i = 0; i < spamCount; i++) enemies.push('spam');
    for (let i = 0; i < fakeNewsCount; i++) enemies.push('fakenews');
    for (let i = 0; i < deepfakeCount; i++) enemies.push('deepfake');
    for (let i = 0; i < swarmCount; i++) enemies.push('swarm');
    for (let i = 0; i < trollCount; i++) enemies.push('troll');
    for (let i = 0; i < botnetCount; i++) enemies.push('botnet');

    return enemies;
}

function updateWaveSpawning(deltaTime) {
    if (!tankGame.waveActive) {
        if (tankGame.enemies.length === 0 && tankGame.enemiesToSpawn.length === 0 && tankGame.enemiesSpawned > 0) {
            waveComplete();
        }
        return;
    }

    tankGame.spawnTimer += deltaTime;

    if (tankGame.spawnTimer > TANK_CONFIG.SPAWN_INTERVAL && tankGame.enemiesToSpawn.length > 0) {
        tankGame.spawnTimer = 0;
        const type = tankGame.enemiesToSpawn.shift();
        spawnEnemy(type);
        tankGame.enemiesSpawned++;
    }
}

function spawnEnemy(type) {
    const stats = TANK_CONFIG.ENEMIES[type];
    const isBoss = stats.isBoss;

    if (isBoss) {
        tankGame.bossActive = true;
        // Bosses spawn at center top
        const enemy = new Enemy(type, tankGame.canvas.width / 2, -60);
        tankGame.currentBoss = enemy;
        tankGame.enemies.push(enemy);
        showNotification('⚠️ BOSS INCOMING! ⚠️', 'warning');
    } else {
        // Regular enemies spawn from edges
        const edge = Math.floor(Math.random() * 4);
        let x, y;

        if (edge === 0) { // Top
            x = Math.random() * tankGame.canvas.width;
            y = -30;
        } else if (edge === 1) { // Right
            x = tankGame.canvas.width + 30;
            y = Math.random() * tankGame.canvas.height;
        } else if (edge === 2) { // Bottom
            x = Math.random() * tankGame.canvas.width;
            y = tankGame.canvas.height + 30;
        } else { // Left
            x = -30;
            y = Math.random() * tankGame.canvas.height;
        }

        tankGame.enemies.push(new Enemy(type, x, y));
    }
}

function waveComplete() {
    tankGame.waveActive = false;
    const bonus = TANK_CONFIG.WAVE_COMPLETE_POINTS * tankGame.wave;
    tankGame.score += bonus;

    showNotification(`WAVE ${tankGame.wave} COMPLETE! +${bonus}`);

    // Heal player
    if (tankGame.player) {
        tankGame.player.hp = Math.min(tankGame.player.maxHP, tankGame.player.hp + 30);
    }

    setTimeout(() => {
        startWave(tankGame.wave + 1);
    }, TANK_CONFIG.WAVE_TRANSITION_TIME);
}

// ==================== NOTIFICATIONS ====================
const notifications = [];

function showNotification(text, type = 'info') {
    notifications.push({
        text,
        type,
        life: 1.0,
        y: 180
    });

    if (notifications.length > 3) notifications.shift();
}

function updateNotifications(deltaTime) {
    notifications.forEach((n, i) => {
        n.life -= deltaTime / 2000;
        n.y = 180 + i * 40;
    });

    notifications.forEach((n, i) => {
        if (n.life <= 0) notifications.splice(i, 1);
    });
}

function drawNotifications(ctx) {
    notifications.forEach(n => {
        ctx.save();
        ctx.globalAlpha = Math.max(0, n.life);
        ctx.font = 'bold 24px monospace';
        ctx.textAlign = 'center';

        const color = n.type === 'warning' ? '#ff4444' : '#1abc9c';

        ctx.strokeStyle = '#000';
        ctx.lineWidth = 5;
        ctx.strokeText(n.text, tankGame.canvas.width / 2, n.y);
        ctx.fillStyle = color;
        ctx.fillText(n.text, tankGame.canvas.width / 2, n.y);
        ctx.restore();
    });
}

// Call in gameLoop after drawing game
// updateNotifications(deltaTime);
// drawNotifications(tankGame.ctx);

// ==================== POWER-UPS ====================

window.activatePowerUp = function(type) {
    const powerUp = tankGame.powerUps[type];

    if (!powerUp.ready || powerUp.active) {
        console.log(`[TankShooter] Power-up ${type} not ready (cooldown: ${Math.ceil(powerUp.cooldown/1000)}s)`);
        return;
    }

    powerUp.ready = false;
    powerUp.active = true;

    console.log(`[TankShooter] Activating power-up: ${type}`);

    switch(type) {
        case 'slowMo':
            tankGame.timeScale = TANK_CONFIG.POWERUP_SLOW_MO.timeScale;
            powerUp.duration = TANK_CONFIG.POWERUP_SLOW_MO.duration;
            showNotification('⏱️ SLOW-MO ACTIVATED!');
            setTimeout(() => {
                tankGame.timeScale = 1.0;
                powerUp.active = false;
                startPowerUpCooldown(type, TANK_CONFIG.POWERUP_SLOW_MO.cooldown);
            }, TANK_CONFIG.POWERUP_SLOW_MO.duration);
            break;

        case 'scatterShot':
            powerUp.duration = TANK_CONFIG.POWERUP_SCATTER.duration;
            showNotification('💥 SCATTER SHOT!');
            setTimeout(() => {
                powerUp.active = false;
                startPowerUpCooldown(type, TANK_CONFIG.POWERUP_SCATTER.cooldown);
            }, TANK_CONFIG.POWERUP_SCATTER.duration);
            break;

        case 'xRay':
            powerUp.duration = TANK_CONFIG.POWERUP_XRAY.duration;
            showNotification('🔍 X-RAY VISION!');
            setTimeout(() => {
                powerUp.active = false;
                startPowerUpCooldown(type, TANK_CONFIG.POWERUP_XRAY.cooldown);
            }, TANK_CONFIG.POWERUP_XRAY.duration);
            break;

        case 'shield':
            powerUp.shieldHP = TANK_CONFIG.POWERUP_SHIELD.hp;
            showNotification('🛡️ SHIELD UP!');
            setTimeout(() => {
                if (powerUp.shieldHP > 0) powerUp.shieldHP = 0;
                startPowerUpCooldown(type, TANK_CONFIG.POWERUP_SHIELD.cooldown);
            }, 30000);
            break;

        case 'emp':
            tankGame.enemies.forEach(enemy => {
                enemy.takeDamage(TANK_CONFIG.POWERUP_EMP.damage);
                enemy.stun(TANK_CONFIG.POWERUP_EMP.stun);
            });
            createEMPEffect();
            showNotification('⚡ EMP BLAST!');
            startPowerUpCooldown(type, TANK_CONFIG.POWERUP_EMP.cooldown);
            powerUp.active = false;
            break;
    }

    updatePowerUpUI();

    if (navigator.vibrate) navigator.vibrate([50, 100, 50]);
};

function startPowerUpCooldown(type, duration) {
    const powerUp = tankGame.powerUps[type];
    powerUp.cooldown = duration;
}

function updatePowerUpCooldowns(deltaTime) {
    for (let type in tankGame.powerUps) {
        const powerUp = tankGame.powerUps[type];
        if (powerUp.cooldown > 0) {
            powerUp.cooldown -= deltaTime;
            if (powerUp.cooldown <= 0) {
                powerUp.cooldown = 0;
                powerUp.ready = true;
            }
        }
    }
    updatePowerUpUI();
}

function updatePowerUpUI() {
    const powerUpMap = {
        slowMo: 'powerup1',
        scatterShot: 'powerup2',
        xRay: 'powerup3',
        shield: 'powerup4',
        emp: 'powerup5'
    };

    for (let type in powerUpMap) {
        const btn = document.getElementById(powerUpMap[type]);
        if (!btn) continue;

        const powerUp = tankGame.powerUps[type];
        const cooldownDiv = btn.querySelector('.powerup-cooldown');

        if (powerUp.active) {
            btn.classList.add('active');
            btn.disabled = true;
        } else {
            btn.classList.remove('active');
            btn.disabled = !powerUp.ready;
        }

        if (cooldownDiv) {
            if (powerUp.cooldown > 0) {
                cooldownDiv.style.display = 'block';
                cooldownDiv.textContent = `${Math.ceil(powerUp.cooldown / 1000)}s`;
            } else {
                cooldownDiv.style.display = 'none';
            }
        }
    }
}

function createEMPEffect() {
    // Massive EMP shockwave
    for (let i = 0; i < 200; i++) {
        const angle = (Math.PI * 2 * i) / 200;
        const distance = 30 + Math.random() * 100;
        const x = tankGame.player.x + Math.cos(angle) * distance;
        const y = tankGame.player.y + Math.sin(angle) * distance;
        tankGame.particles.push(new Particle(x, y, '#9b59b6', 'spark'));
    }

    tankGame.screenShake = 25;
}

// ==================== CONTROLS ====================

function setupControls(canvas) {
    // Keyboard
    document.addEventListener('keydown', (e) => {
        tankGame.keys[e.key] = true;

        // Shooting (space)
        if (e.key === ' ' && tankGame.player) {
            e.preventDefault();
            tankGame.player.shoot();
        }

        // Dash (Shift)
        if (e.key === 'Shift' && tankGame.player) {
            tankGame.player.dash();
        }

        // Power-ups (1-5)
        if (e.key >= '1' && e.key <= '5') {
            const powerUpTypes = ['slowMo', 'scatterShot', 'xRay', 'shield', 'emp'];
            const index = parseInt(e.key) - 1;
            activatePowerUp(powerUpTypes[index]);
        }

        // Pause (ESC)
        if (e.key === 'Escape') {
            tankGame.paused = !tankGame.paused;
        }
    });

    document.addEventListener('keyup', (e) => {
        tankGame.keys[e.key] = false;
    });

    // Mouse aim
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        tankGame.mouseX = e.clientX - rect.left;
        tankGame.mouseY = e.clientY - rect.top;

        if (tankGame.player) {
            const dx = tankGame.mouseX - tankGame.player.x;
            const dy = tankGame.mouseY - tankGame.player.y;
            tankGame.player.angle = Math.atan2(dy, dx);
        }
    });

    // Mouse shoot
    canvas.addEventListener('click', () => {
        if (tankGame.player) tankGame.player.shoot();
    });

    // Auto-shoot (hold mouse)
    let mouseDown = false;
    canvas.addEventListener('mousedown', () => { mouseDown = true; });
    canvas.addEventListener('mouseup', () => { mouseDown = false; });

    setInterval(() => {
        if (mouseDown && tankGame.player && tankGame.running) {
            tankGame.player.shoot();
        }
    }, 100);
}

function setupVirtualJoystick() {
    const joystickZone = document.getElementById('joystickZone');
    const fireBtn = document.getElementById('fireBtn');

    if (!joystickZone || !fireBtn) return;

    let joystickActive = false;
    let joystickCenterX = 0;
    let joystickCenterY = 0;

    joystickZone.addEventListener('touchstart', (e) => {
        e.preventDefault();
        joystickActive = true;
        const touch = e.touches[0];
        const rect = joystickZone.getBoundingClientRect();
        joystickCenterX = touch.clientX - rect.left;
        joystickCenterY = touch.clientY - rect.top;
    });

    joystickZone.addEventListener('touchmove', (e) => {
        if (!joystickActive) return;
        e.preventDefault();
        const touch = e.touches[0];
        const rect = joystickZone.getBoundingClientRect();
        const dx = (touch.clientX - rect.left) - joystickCenterX;
        const dy = (touch.clientY - rect.top) - joystickCenterY;

        tankGame.keys['w'] = dy < -15;
        tankGame.keys['s'] = dy > 15;
        tankGame.keys['a'] = dx < -15;
        tankGame.keys['d'] = dx > 15;
    });

    joystickZone.addEventListener('touchend', () => {
        joystickActive = false;
        tankGame.keys['w'] = false;
        tankGame.keys['s'] = false;
        tankGame.keys['a'] = false;
        tankGame.keys['d'] = false;
    });

    // Fire button
    let fireTouchId = null;
    fireBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        fireTouchId = setInterval(() => {
            if (tankGame.player && tankGame.running) tankGame.player.shoot();
        }, 150);
    });

    fireBtn.addEventListener('touchend', () => {
        if (fireTouchId) {
            clearInterval(fireTouchId);
            fireTouchId = null;
        }
    });
}

// ==================== GAME OVER ====================

function gameOver() {
    tankGame.running = false;

    const grade = calculateGrade(tankGame.score);
    const totalCoins = calculateCoins(grade);

    if (typeof user !== 'undefined' && user && typeof userProgression !== 'undefined' && userProgression) {
        awardTankShooterCoins(totalCoins);
    }

    document.getElementById('finalWave').textContent = tankGame.wave;
    document.getElementById('finalScore').textContent = tankGame.score.toLocaleString();
    document.getElementById('finalFakes').textContent = tankGame.enemiesKilled;
    document.getElementById('coinsEarned').textContent = `+${totalCoins}`;
    document.getElementById('gameOverGrade').textContent = grade;
    document.getElementById('gameOverScreen').style.display = 'flex';

    console.log(`[TankShooter] Game Over - Wave: ${tankGame.wave}, Score: ${tankGame.score}, Grade: ${grade}, Coins: ${totalCoins}`);
}

function calculateGrade(score) {
    if (score >= 20000) return 'S+';
    if (score >= 15000) return 'S';
    if (score >= 10000) return 'A';
    if (score >= 7500) return 'B';
    if (score >= 5000) return 'C';
    return 'D';
}

function calculateCoins(grade) {
    const baseCoins = Math.floor(tankGame.score / 80);
    const waveBonus = tankGame.wave * 3;
    const killBonus = tankGame.enemiesKilled * 2;

    const gradeMultipliers = { 'S+': 2.5, S: 2.0, A: 1.5, B: 1.25, C: 1.0, D: 0.75 };
    const multiplier = gradeMultipliers[grade] || 1.0;

    return Math.floor((baseCoins + waveBonus + killBonus) * multiplier);
}

async function awardTankShooterCoins(amount) {
    try {
        if (typeof supabase === 'undefined') {
            console.error('[TankShooter] Supabase not available');
            return;
        }

        const { data, error } = await supabase.rpc('award_coins_atomic', {
            p_user_id: user.id,
            p_amount: amount
        });

        if (!error && data && data.length > 0) {
            userProgression.truth_coins = data[0].truth_coins;
            if (typeof updateCoinsDisplay === 'function') {
                updateCoinsDisplay();
            }
            console.log(`[TankShooter] Awarded ${amount} coins. New total: ${userProgression.truth_coins}`);
        } else {
            console.error('[TankShooter] Error awarding coins:', error);
        }
    } catch (err) {
        console.error('[TankShooter] Exception awarding coins:', err);
    }
}

window.retryTankShooter = function() {
    startTankShooter();
};

window.closeTankShooter = function() {
    tankGame.running = false;
    document.getElementById('truthCannonGame').style.display = 'none';
    document.getElementById('mobileControls').style.display = 'none';
};

// Export
if (typeof window !== 'undefined') {
    window.tankGame = tankGame;
    window.startTankShooter = startTankShooter;
}

console.log('[TankShooter] ENHANCED version loaded successfully');
