// ============================================================
// TANK BATTLE - PROFESSIONAL ENHANCED VERSION
// ============================================================
// Features: Professional assets, 20+ waves, diverse enemies, boss battles,
// powerups, visual effects, coin rewards, mobile support

// ==================== GAME STATE ====================

let tankGame = {
    running: false,
    paused: false,
    wave: 1,
    score: 0,
    combo: 1,
    comboTimer: 0,
    coinsEarned: 0,
    enemiesKilled: 0,
    player: null,
    enemies: [],
    projectiles: [],
    particles: [],
    powerUpDrops: [],
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
    PLAYER_SPEED: 160,
    PLAYER_HP: 100,
    PLAYER_MAX_HP: 100,
    PLAYER_FIRE_RATE: 350,
    PLAYER_DAMAGE: 35,
    PLAYER_RADIUS: 22,
    PLAYER_REGEN_RATE: 3,
    PLAYER_REGEN_DELAY: 4000,

    // Projectile stats
    PROJECTILE_SPEED: 400,
    PROJECTILE_RADIUS: 6,
    PROJECTILE_LIFETIME: 4000,

    // Enemy stats - MASSIVE EXPANSION
    ENEMIES: {
        // Basic enemies (Waves 1-5)
        spam: { hp: 35, speed: 90, damage: 8, score: 15, coins: 2, radius: 14, color: '#ff6b9d', icon: '📧', behavior: 'rush' },
        bot: { hp: 45, speed: 70, damage: 12, score: 20, coins: 3, radius: 16, color: '#ff8fab', icon: '🤖', behavior: 'zigzag' },

        // Mid-tier enemies (Waves 3-10)
        fakenews: { hp: 70, speed: 110, damage: 15, score: 35, coins: 4, radius: 18, color: '#ff4478', icon: '📰', behavior: 'flank' },
        troll: { hp: 95, speed: 65, damage: 22, score: 50, coins: 6, radius: 20, color: '#ff5722', icon: '👹', behavior: 'tank' },
        deepfake: { hp: 130, speed: 55, damage: 30, score: 70, coins: 8, radius: 22, color: '#e91e63', icon: '🎭', canShoot: true, behavior: 'sniper' },

        // Advanced enemies (Waves 5-15)
        swarm: { hp: 25, speed: 150, damage: 5, score: 10, coins: 1, radius: 10, color: '#ff8a9d', icon: '⚡', behavior: 'swarm' },
        shielder: { hp: 160, speed: 50, damage: 25, score: 80, coins: 10, radius: 24, color: '#9c27b0', icon: '🛡️', hasShield: true, behavior: 'tank' },
        sniper: { hp: 60, speed: 40, damage: 50, score: 90, coins: 12, radius: 18, color: '#673ab7', icon: '🎯', canShoot: true, behavior: 'sniper', fireRate: 1500 },
        rusher: { hp: 50, speed: 180, damage: 30, score: 45, coins: 5, radius: 15, color: '#f44336', icon: '💨', behavior: 'rush' },

        // Elite enemies (Waves 10-20)
        botnet: { hp: 200, speed: 45, damage: 35, score: 100, coins: 15, radius: 26, color: '#3f51b5', icon: '🕸️', canShoot: true, behavior: 'artillery' },
        phantom: { hp: 80, speed: 120, damage: 20, score: 110, coins: 14, radius: 20, color: '#00bcd4', icon: '👻', behavior: 'teleport', canShoot: true },
        juggernaut: { hp: 350, speed: 30, damage: 50, score: 150, coins: 20, radius: 30, color: '#795548', icon: '🏛️', behavior: 'tank', hasShield: true },

        // BOSSES - Unique mechanics per boss
        bossAI: {
            hp: 1000, speed: 40, damage: 60, score: 1500, coins: 100, radius: 55,
            color: '#8e44ad', icon: '🧠', canShoot: true, isBoss: true, behavior: 'boss_ai',
            fireRate: 800, pattern: 'circle'
        },
        bossGAN: {
            hp: 1500, speed: 35, damage: 75, score: 2000, coins: 150, radius: 60,
            color: '#9c27b0', icon: '👾', canShoot: true, isBoss: true, behavior: 'boss_gan',
            fireRate: 600, pattern: 'spiral', spawnsMinions: true
        },
        bossDiffusion: {
            hp: 2000, speed: 30, damage: 90, score: 2500, coins: 200, radius: 65,
            color: '#673ab7', icon: '🌀', canShoot: true, isBoss: true, behavior: 'boss_diffusion',
            fireRate: 500, pattern: 'burst', teleports: true
        },
        bossLLM: {
            hp: 2500, speed: 45, damage: 110, score: 3000, coins: 250, radius: 70,
            color: '#3f51b5', icon: '💬', canShoot: true, isBoss: true, behavior: 'boss_llm',
            fireRate: 400, pattern: 'predict', adaptive: true
        },
        bossUltimate: {
            hp: 4000, speed: 50, damage: 150, score: 5000, coins: 500, radius: 80,
            color: '#1a237e', icon: '👑', canShoot: true, isBoss: true, behavior: 'boss_ultimate',
            fireRate: 300, pattern: 'all', phases: true, spawnsMinions: true
        }
    },

    // Powerup drops
    POWERUPS: {
        health: { radius: 15, color: '#4caf50', icon: '❤️', heal: 40, dropChance: 0.15 },
        rapidFire: { radius: 15, color: '#ff9800', icon: '⚡', duration: 8000, rateBoost: 0.5, dropChance: 0.10 },
        shield: { radius: 15, color: '#2196f3', icon: '🛡️', hp: 100, dropChance: 0.12 },
        nuke: { radius: 15, color: '#f44336', icon: '💣', damage: 200, range: 300, dropChance: 0.05 },
        speedBoost: { radius: 15, color: '#9c27b0', icon: '💨', duration: 10000, speedMult: 1.5, dropChance: 0.13 },
        spreadShot: { radius: 15, color: '#00bcd4', icon: '💥', duration: 12000, count: 5, dropChance: 0.08 }
    },

    // Wave config
    WAVE_TRANSITION_TIME: 2500,
    SPAWN_INTERVAL: 1000,
    HP_SCALE_PER_WAVE: 0.10,
    SPEED_SCALE_PER_WAVE: 0.05,
    MAX_HP_SCALE: 2.0,
    MAX_SPEED_SCALE: 1.0,

    // Power-up durations/cooldowns
    POWERUP_SLOW_MO: { duration: 12000, cooldown: 35000, timeScale: 0.2 },
    POWERUP_SCATTER: { duration: 10000, cooldown: 25000, spreadCount: 7 },
    POWERUP_XRAY: { duration: 15000, cooldown: 50000, damageBoost: 0.75 },
    POWERUP_SHIELD: { hp: 150, cooldown: 35000, reflectPercent: 0.75 },
    POWERUP_EMP: { damage: 100, stun: 3000, cooldown: 60000 },

    // Performance limits
    MAX_ENEMIES: 100,
    MAX_PROJECTILES: 200,
    MAX_PARTICLES: 500,

    // Scoring
    WAVE_COMPLETE_POINTS: 200,
    NO_DAMAGE_BONUS: 500,
    COMBO_WINDOW: 2500,
    COMBO_INCREMENT: 0.7,
    MAX_COMBO: 10.0,
    COINS_PER_WAVE: 10
};

// ==================== ENHANCED PLAYER CLASS ====================

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.angle = 0;
        this.bodyAngle = 0;
        this.vx = 0;
        this.vy = 0;
        this.speed = TANK_CONFIG.PLAYER_SPEED;
        this.baseSpeed = TANK_CONFIG.PLAYER_SPEED;
        this.hp = TANK_CONFIG.PLAYER_HP;
        this.maxHP = TANK_CONFIG.PLAYER_MAX_HP;
        this.fireRate = TANK_CONFIG.PLAYER_FIRE_RATE;
        this.baseFireRate = TANK_CONFIG.PLAYER_FIRE_RATE;
        this.lastShot = 0;
        this.lastDamageTime = 0;
        this.damage = TANK_CONFIG.PLAYER_DAMAGE;
        this.radius = TANK_CONFIG.PLAYER_RADIUS;
        this.muzzleFlash = 0;
        this.dashCooldown = 0;
        this.dashReady = true;

        // Active powerup effects
        this.rapidFireActive = false;
        this.speedBoostActive = false;
        this.spreadShotActive = false;
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

        // Create movement trail particles
        if ((this.vx !== 0 || this.vy !== 0) && Math.random() < 0.3) {
            tankGame.particles.push(new Particle(this.x, this.y, '#1abc9c', 'trail'));
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

        // Tank body - gradient with metallic shine
        const bodyGradient = ctx.createLinearGradient(-this.radius, -this.radius * 0.6, this.radius, this.radius * 0.6);
        bodyGradient.addColorStop(0, '#22d3ee');
        bodyGradient.addColorStop(0.5, '#14b8a6');
        bodyGradient.addColorStop(1, '#0d9488');
        ctx.fillStyle = bodyGradient;
        ctx.strokeStyle = '#0a5f4a';
        ctx.lineWidth = 3;

        // Rounded rectangle for body
        this.roundRect(ctx, -this.radius, -this.radius * 0.6, this.radius * 2, this.radius * 1.2, 4);
        ctx.fill();
        ctx.stroke();

        // Tank details (panels with highlights)
        ctx.fillStyle = '#0d7a5f';
        this.roundRect(ctx, -this.radius * 0.7, -this.radius * 0.4, this.radius * 0.4, this.radius * 0.8, 2);
        ctx.fill();
        this.roundRect(ctx, this.radius * 0.3, -this.radius * 0.4, this.radius * 0.4, this.radius * 0.8, 2);
        ctx.fill();

        // Highlight spots
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(-this.radius * 0.3, -this.radius * 0.3, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
        ctx.save();
        ctx.translate(this.x, this.y);

        // Turret
        ctx.rotate(this.angle);

        // Turret barrel - metallic gradient
        const barrelGradient = ctx.createLinearGradient(0, -10, 0, 10);
        barrelGradient.addColorStop(0, '#0d7a5f');
        barrelGradient.addColorStop(0.5, '#16a085');
        barrelGradient.addColorStop(1, '#0d7a5f');
        ctx.fillStyle = barrelGradient;
        this.roundRect(ctx, 0, -10, this.radius * 1.8, 20, 3);
        ctx.fill();

        // Barrel tip
        ctx.fillStyle = '#000';
        ctx.fillRect(this.radius * 1.8, -7, 6, 14);

        // Muzzle flash effect (enhanced)
        if (this.muzzleFlash > 0) {
            ctx.save();
            ctx.globalAlpha = this.muzzleFlash;
            const flashGradient = ctx.createRadialGradient(
                this.radius * 1.8 + 15, 0, 0,
                this.radius * 1.8 + 15, 0, 25
            );
            flashGradient.addColorStop(0, '#fff');
            flashGradient.addColorStop(0.2, '#ffee00');
            flashGradient.addColorStop(0.5, '#ff8800');
            flashGradient.addColorStop(1, 'transparent');
            ctx.fillStyle = flashGradient;
            ctx.beginPath();
            ctx.arc(this.radius * 1.8 + 15, 0, 25, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // Turret base - 3D metallic effect
        ctx.beginPath();
        ctx.arc(0, 0, this.radius * 0.85, 0, Math.PI * 2);
        const turretGradient = ctx.createRadialGradient(0, -8, 0, 0, 0, this.radius * 0.85);
        turretGradient.addColorStop(0, '#22d3ee');
        turretGradient.addColorStop(0.6, '#14b8a6');
        turretGradient.addColorStop(1, '#0a5f4a');
        ctx.fillStyle = turretGradient;
        ctx.fill();
        ctx.strokeStyle = '#0a5f4a';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Turret highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.arc(-5, -5, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        // Health bar - enhanced with glow
        const barWidth = this.radius * 2.8;
        const barHeight = 8;
        const barX = this.x - barWidth / 2;
        const barY = this.y - this.radius - 20;

        // Background with shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 4;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.roundRect(ctx, barX - 2, barY - 2, barWidth + 4, barHeight + 4, 4);
        ctx.fill();
        ctx.shadowBlur = 0;

        const hpPercent = this.hp / this.maxHP;

        // HP bar gradient with glow
        const hpGradient = ctx.createLinearGradient(barX, 0, barX + barWidth * hpPercent, 0);
        if (hpPercent > 0.5) {
            hpGradient.addColorStop(0, '#10b981');
            hpGradient.addColorStop(1, '#059669');
            ctx.shadowColor = '#10b981';
        } else if (hpPercent > 0.25) {
            hpGradient.addColorStop(0, '#f59e0b');
            hpGradient.addColorStop(1, '#d97706');
            ctx.shadowColor = '#f59e0b';
        } else {
            hpGradient.addColorStop(0, '#ef4444');
            hpGradient.addColorStop(1, '#dc2626');
            ctx.shadowColor = '#ef4444';
        }
        ctx.fillStyle = hpGradient;
        ctx.shadowBlur = 6;
        this.roundRect(ctx, barX, barY, barWidth * hpPercent, barHeight, 3);
        ctx.fill();
        ctx.shadowBlur = 0;

        // HP text
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`${Math.ceil(this.hp)}/${this.maxHP}`, this.x, barY + barHeight + 12);

        // Shield effect - MASSIVE ENHANCEMENT
        if (tankGame.powerUps.shield.shieldHP > 0) {
            const time = Date.now() / 1000;

            // Multiple shield layers
            for (let i = 0; i < 4; i++) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius + 15 + i * 5, 0, Math.PI * 2);
                const opacity = 0.7 - i * 0.15;
                ctx.strokeStyle = `rgba(34, 211, 238, ${opacity})`;
                ctx.lineWidth = 5 - i;
                ctx.stroke();
            }

            // Animated shield hexagons (more of them)
            for (let j = 0; j < 12; j++) {
                const angle = (j * Math.PI / 6) + time * 0.5;
                const distance = this.radius + 18;
                const hexX = this.x + Math.cos(angle) * distance;
                const hexY = this.y + Math.sin(angle) * distance;

                ctx.save();
                ctx.translate(hexX, hexY);
                ctx.rotate(time + j);
                ctx.strokeStyle = 'rgba(34, 211, 238, 0.9)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                for (let k = 0; k < 6; k++) {
                    const hexAngle = k * Math.PI / 3;
                    const hx = Math.cos(hexAngle) * 6;
                    const hy = Math.sin(hexAngle) * 6;
                    if (k === 0) ctx.moveTo(hx, hy);
                    else ctx.lineTo(hx, hy);
                }
                ctx.closePath();
                ctx.stroke();
                ctx.restore();
            }

            // Shield particles
            if (Math.random() < 0.3) {
                const angle = Math.random() * Math.PI * 2;
                const x = this.x + Math.cos(angle) * (this.radius + 18);
                const y = this.y + Math.sin(angle) * (this.radius + 18);
                tankGame.particles.push(new Particle(x, y, '#22d3ee', 'shield'));
            }
        }

        // Active powerup indicators
        const activeY = this.y + this.radius + 35;
        let offsetX = -30;

        if (this.rapidFireActive) {
            this.drawPowerupIcon(ctx, '⚡', '#ff9800', this.x + offsetX, activeY);
            offsetX += 18;
        }
        if (this.speedBoostActive) {
            this.drawPowerupIcon(ctx, '💨', '#9c27b0', this.x + offsetX, activeY);
            offsetX += 18;
        }
        if (this.spreadShotActive) {
            this.drawPowerupIcon(ctx, '💥', '#00bcd4', this.x + offsetX, activeY);
            offsetX += 18;
        }
        if (tankGame.powerUps.slowMo.active) {
            this.drawPowerupIcon(ctx, '⏱️', '#6495ed', this.x + offsetX, activeY);
            offsetX += 18;
        }
        if (tankGame.powerUps.xRay.active) {
            this.drawPowerupIcon(ctx, '🔍', '#00ff88', this.x + offsetX, activeY);
            offsetX += 18;
        }
    }

    drawPowerupIcon(ctx, icon, color, x, y) {
        ctx.save();
        ctx.shadowColor = color;
        ctx.shadowBlur = 8;
        ctx.font = 'bold 14px monospace';
        ctx.fillText(icon, x, y);
        ctx.restore();
    }

    roundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }

    shoot() {
        const now = Date.now();
        if (now - this.lastShot < this.fireRate) return;

        this.lastShot = now;
        this.muzzleFlash = 1.0;

        // Screen shake on shoot
        tankGame.screenShake = Math.min(tankGame.screenShake + 2, 10);

        const barrelX = this.x + Math.cos(this.angle) * (this.radius * 1.8);
        const barrelY = this.y + Math.sin(this.angle) * (this.radius * 1.8);

        if (tankGame.powerUps.scatterShot.active || this.spreadShotActive) {
            // Scatter/Spread shot
            const count = this.spreadShotActive ? 5 : 7;
            const spreadAngle = Math.PI / 5;
            const halfCount = Math.floor(count / 2);
            for (let i = -halfCount; i <= halfCount; i++) {
                const angle = this.angle + (i * spreadAngle / (count - 1));
                tankGame.projectiles.push(new Projectile(barrelX, barrelY, angle, this.getCurrentDamage(), 'player'));
            }
        } else {
            tankGame.projectiles.push(new Projectile(barrelX, barrelY, this.angle, this.getCurrentDamage(), 'player'));
        }

        // Enhanced shooting particles
        for (let i = 0; i < 5; i++) {
            tankGame.particles.push(new Particle(barrelX, barrelY, '#ffee00', 'smoke'));
        }

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
            for (let i = 0; i < 15; i++) {
                tankGame.particles.push(new Particle(this.x, this.y, '#22d3ee', 'spark'));
            }
        }

        if (amount > 0) {
            this.hp -= amount;
            this.lastDamageTime = Date.now();

            // Screen shake on hit
            tankGame.screenShake = Math.min(tankGame.screenShake + amount / 2, 20);

            // Damage particles
            for (let i = 0; i < 10; i++) {
                tankGame.particles.push(new Particle(this.x, this.y, '#ff4444', 'spark'));
            }
        }

        if (this.hp <= 0) {
            this.hp = 0;
            gameOver();
        }
    }

    heal(amount) {
        this.hp = Math.min(this.maxHP, this.hp + amount);

        // Healing particles
        for (let i = 0; i < 20; i++) {
            tankGame.particles.push(new Particle(this.x, this.y, '#4caf50', 'heal'));
        }
    }

    dash() {
        if (!this.dashReady) return;

        this.dashReady = false;
        this.dashCooldown = 5000;

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

        const magnitude = Math.sqrt(dashX * dashX + dashY * dashY);
        if (magnitude > 0) {
            dashX /= magnitude;
            dashY /= magnitude;
        }

        const dashDistance = 150;
        this.x += dashX * dashDistance;
        this.y += dashY * dashDistance;

        // Dash particles trail
        for (let i = 0; i < 30; i++) {
            const t = i / 30;
            const px = this.x - dashX * dashDistance * t;
            const py = this.y - dashY * dashDistance * t;
            tankGame.particles.push(new Particle(px, py, '#22d3ee', 'dash'));
        }

        if (navigator.vibrate) navigator.vibrate([30, 50, 30]);
    }
}

// To be continued in next message due to length...
console.log('[TankShooter-Pro] Classes loaded (part 1)');
