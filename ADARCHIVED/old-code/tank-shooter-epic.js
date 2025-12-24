// ============================================================
// TANK SHOOTER - EPIC EDITION
// ============================================================
// File: tank-shooter-epic.js
// Purpose: Massively upgraded Tank Shooter with EPIC graphics, power-ups, waves, and bosses
// Version: 2.0 EPIC EDITION

// ==================== GAME STATE ====================

let tankGame = {
    running: false,
    paused: false,
    wave: 1,
    score: 0,
    combo: 1,
    comboTimer: 0,
    comboCount: 0,
    enemiesKilled: 0,
    player: null,
    enemies: [],
    projectiles: [],
    particles: [],
    damageNumbers: [],
    powerUps: {
        slowMo: { ready: true, cooldown: 0, active: false, duration: 0 },
        scatterShot: { ready: true, cooldown: 0, active: false, duration: 0 },
        xRay: { ready: true, cooldown: 0, active: false, duration: 0 },
        shield: { ready: true, cooldown: 0, shieldHP: 0 },
        emp: { ready: true, cooldown: 0 },
        laserBeam: { ready: true, cooldown: 0, active: false, duration: 0 },
        missileBarrage: { ready: true, cooldown: 0, missiles: 0 },
        reflectorShield: { ready: true, cooldown: 0, active: false, duration: 0 },
        speedBoost: { ready: true, cooldown: 0, active: false, duration: 0 },
        doubleDamage: { ready: true, cooldown: 0, active: false, duration: 0 },
        healthPack: { ready: true, cooldown: 0 },
        nuke: { ready: true, cooldown: 0 }
    },
    waveActive: false,
    waveTransitionTimer: 0,
    waveTransitionActive: false,
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
    bossActive: false,
    perfectWave: true,
    autoPowerUpMode: false
};

// ==================== CONFIGURATION ====================

const TANK_CONFIG = {
    // Player stats
    PLAYER_SPEED: 180,
    PLAYER_HP: 100,
    PLAYER_MAX_HP: 100,
    PLAYER_FIRE_RATE: 400,
    PLAYER_DAMAGE: 30,
    PLAYER_RADIUS: 22,
    PLAYER_REGEN_RATE: 3,
    PLAYER_REGEN_DELAY: 4000,

    // Projectile stats
    PROJECTILE_SPEED: 400,
    PROJECTILE_RADIUS: 5,
    PROJECTILE_LIFETIME: 3000,

    // Enemy stats (11 types total)
    ENEMIES: {
        spam: { hp: 30, speed: 80, damage: 10, score: 15, coins: 1, radius: 16, color: '#ff4478', icon: '📧' },
        fakenews: { hp: 60, speed: 110, damage: 15, score: 30, coins: 2, radius: 19, color: '#ff6b9d', icon: '📰' },
        deepfake: { hp: 120, speed: 55, damage: 35, score: 60, coins: 5, radius: 23, color: '#ff1744', icon: '🤖', canShoot: true },
        swarm: { hp: 18, speed: 140, damage: 6, score: 8, coins: 0.5, radius: 11, color: '#ff8a9d', icon: '⚡' },
        drone: { hp: 45, speed: 150, damage: 12, score: 25, coins: 3, radius: 14, color: '#9c27b0', icon: '🚁', canShoot: true },
        sniper: { hp: 40, speed: 0, damage: 50, score: 40, coins: 4, radius: 18, color: '#ff9800', icon: '🎯', canShoot: true },
        kamikaze: { hp: 25, speed: 200, damage: 60, score: 35, coins: 3, radius: 15, color: '#f44336', icon: '💣' },
        shielder: { hp: 80, speed: 70, damage: 20, score: 50, coins: 6, radius: 21, color: '#2196f3', icon: '🛡️', hasShield: true },
        splitter: { hp: 50, speed: 90, damage: 15, score: 45, coins: 4, radius: 17, color: '#4caf50', icon: '🧬', splits: true },
        healer: { hp: 70, speed: 60, damage: 10, score: 55, coins: 7, radius: 20, color: '#00bcd4', icon: '💊', heals: true },
        elite: { hp: 200, speed: 80, damage: 45, score: 100, coins: 10, radius: 25, color: '#673ab7', icon: '👑', canShoot: true },

        // Bosses (6 unique bosses)
        spamKing: { hp: 500, speed: 35, damage: 60, score: 500, coins: 30, radius: 45, color: '#e91e63', icon: '👑', boss: true, canShoot: true },
        droneCommander: { hp: 800, speed: 50, damage: 70, score: 800, coins: 50, radius: 50, color: '#9c27b0', icon: '🚁', boss: true, canShoot: true, summons: true },
        tankColossus: { hp: 1200, speed: 25, damage: 90, score: 1200, coins: 75, radius: 60, color: '#607d8b', icon: '🏰', boss: true, canShoot: true },
        swarmQueen: { hp: 1000, speed: 40, damage: 75, score: 1000, coins: 60, radius: 55, color: '#ff5722', icon: '👸', boss: true, summons: true, teleports: true },
        aiOverlord: { hp: 2000, speed: 45, damage: 100, score: 2000, coins: 100, radius: 65, color: '#3f51b5', icon: '🧠', boss: true, canShoot: true, summons: true },
        singularity: { hp: 3000, speed: 30, damage: 120, score: 3000, coins: 150, radius: 70, color: '#000000', icon: '⚫', boss: true, canShoot: true, summons: true, phases: 3 }
    },

    // Wave config (30+ waves)
    WAVE_TRANSITION_TIME: 3000,
    SPAWN_INTERVAL: 1200,
    HP_SCALE_PER_WAVE: 0.04,
    SPEED_SCALE_PER_WAVE: 0.02,
    MAX_HP_SCALE: 1.5,
    MAX_SPEED_SCALE: 0.75,

    // Power-up durations/cooldowns (12 power-ups total)
    POWERUP_SLOW_MO: { duration: 10000, cooldown: 45000, timeScale: 0.3 },
    POWERUP_SCATTER: { duration: 8000, cooldown: 30000, spreadCount: 5 },
    POWERUP_XRAY: { duration: 12000, cooldown: 60000, damageBoost: 0.5 },
    POWERUP_SHIELD: { hp: 100, cooldown: 40000, reflectPercent: 0 },
    POWERUP_EMP: { damage: 60, stun: 2500, cooldown: 90000 },
    POWERUP_LASER: { duration: 10000, cooldown: 50000, damage: 15 },
    POWERUP_MISSILES: { count: 5, cooldown: 35000, damage: 80 },
    POWERUP_REFLECTOR: { duration: 15000, cooldown: 55000, reflectPercent: 0.8 },
    POWERUP_SPEED: { duration: 12000, cooldown: 40000, speedMult: 2.0 },
    POWERUP_DOUBLE_DAMAGE: { duration: 10000, cooldown: 50000, damageMult: 2.0 },
    POWERUP_HEALTH: { amount: 50, cooldown: 25000 },
    POWERUP_NUKE: { damage: 200, radius: 300, cooldown: 120000 },

    // Performance limits
    MAX_ENEMIES: 60,
    MAX_PROJECTILES: 150,
    MAX_PARTICLES: 300,
    MAX_DAMAGE_NUMBERS: 20,

    // Scoring
    WAVE_COMPLETE_POINTS: 150,
    NO_DAMAGE_BONUS: 300,
    PERFECT_WAVE_BONUS: 500,
    COMBO_WINDOW: 2000,
    COMBO_INCREMENT: 0.5,
    MAX_COMBO: 10.0
};

// ==================== ENTITY CLASSES ====================

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
        this.muzzleFlashTimer = 0;
        this.rotation = 0;
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

        const currentSpeed = tankGame.powerUps.speedBoost.active ?
            this.speed * TANK_CONFIG.POWERUP_SPEED.speedMult : this.speed;

        this.vx = moveX * currentSpeed;
        this.vy = moveY * currentSpeed;

        this.x += this.vx * dt;
        this.y += this.vy * dt;

        // Keep player in bounds
        this.x = Math.max(this.radius, Math.min(canvas.width - this.radius, this.x));
        this.y = Math.max(this.radius, Math.min(canvas.height - this.radius, this.y));

        // Update body angle based on movement
        if (this.vx !== 0 || this.vy !== 0) {
            this.bodyAngle = Math.atan2(this.vy, this.vx);
        }

        // Subtle rotation animation
        this.rotation += dt * 0.5;

        // Health regeneration
        if (Date.now() - this.lastDamageTime > TANK_CONFIG.PLAYER_REGEN_DELAY) {
            this.hp = Math.min(this.maxHP, this.hp + TANK_CONFIG.PLAYER_REGEN_RATE * dt);
        }

        // Update muzzle flash
        if (this.muzzleFlashTimer > 0) {
            this.muzzleFlashTimer -= deltaTime;
        }

        // Laser beam active
        if (tankGame.powerUps.laserBeam.active) {
            this.fireLaser();
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        // Tank shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(2, 4, this.radius * 1.2, this.radius * 0.8, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
        ctx.save();
        ctx.translate(this.x, this.y);

        // Tank body with gradient
        ctx.rotate(this.bodyAngle);
        const gradient = ctx.createLinearGradient(-this.radius, -this.radius, this.radius, this.radius);
        gradient.addColorStop(0, '#1abc9c');
        gradient.addColorStop(1, '#16a085');
        ctx.fillStyle = gradient;
        ctx.strokeStyle = '#0d7a68';
        ctx.lineWidth = 3;

        // Tank body shape (rounded rectangle)
        ctx.beginPath();
        ctx.roundRect(-this.radius, -this.radius * 0.7, this.radius * 2, this.radius * 1.4, 5);
        ctx.fill();
        ctx.stroke();

        // Tank treads
        ctx.fillStyle = '#0d7a68';
        ctx.fillRect(-this.radius, -this.radius * 0.85, this.radius * 2, 4);
        ctx.fillRect(-this.radius, this.radius * 0.85 - 4, this.radius * 2, 4);

        ctx.restore();
        ctx.save();
        ctx.translate(this.x, this.y);

        // Turret
        ctx.rotate(this.angle);

        // Turret barrel
        ctx.fillStyle = '#16a085';
        ctx.strokeStyle = '#0d7a68';
        ctx.lineWidth = 2;
        ctx.fillRect(0, -7, this.radius * 1.8, 14);
        ctx.strokeRect(0, -7, this.radius * 1.8, 14);

        // Muzzle flash
        if (this.muzzleFlashTimer > 0) {
            const flashSize = 8 + Math.random() * 6;
            ctx.fillStyle = `rgba(255, 200, 50, ${this.muzzleFlashTimer / 100})`;
            ctx.beginPath();
            ctx.arc(this.radius * 1.8, 0, flashSize, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = `rgba(255, 255, 255, ${this.muzzleFlashTimer / 150})`;
            ctx.beginPath();
            ctx.arc(this.radius * 1.8, 0, flashSize * 0.6, 0, Math.PI * 2);
            ctx.fill();
        }

        // Turret base with highlight
        ctx.beginPath();
        ctx.arc(0, 0, this.radius * 0.8, 0, Math.PI * 2);
        const turretGradient = ctx.createRadialGradient(-5, -5, 0, 0, 0, this.radius * 0.8);
        turretGradient.addColorStop(0, '#6ef4d0');
        turretGradient.addColorStop(1, '#1abc9c');
        ctx.fillStyle = turretGradient;
        ctx.fill();
        ctx.strokeStyle = '#16a085';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.restore();

        // Glowing aura for active power-ups
        const activePowerUps = Object.values(tankGame.powerUps).filter(p => p.active).length;
        if (activePowerUps > 0) {
            const pulseSize = this.radius + 15 + Math.sin(Date.now() / 200) * 5;
            const pulseGradient = ctx.createRadialGradient(this.x, this.y, this.radius, this.x, this.y, pulseSize);
            pulseGradient.addColorStop(0, 'rgba(26, 188, 156, 0.3)');
            pulseGradient.addColorStop(1, 'rgba(26, 188, 156, 0)');
            ctx.fillStyle = pulseGradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, pulseSize, 0, Math.PI * 2);
            ctx.fill();
        }

        // Health bar with animation
        const barWidth = this.radius * 2.5;
        const barHeight = 6;
        const barX = this.x - barWidth / 2;
        const barY = this.y - this.radius - 18;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(barX, barY, barWidth, barHeight);

        const hpPercent = this.hp / this.maxHP;
        const barColor = hpPercent > 0.6 ? '#00ff88' :
                        hpPercent > 0.3 ? '#ffcc00' : '#ff4444';

        // Pulsing effect when low health
        if (hpPercent < 0.3 && Math.sin(Date.now() / 200) > 0) {
            ctx.fillStyle = '#ff6666';
        } else {
            ctx.fillStyle = barColor;
        }
        ctx.fillRect(barX, barY, barWidth * hpPercent, barHeight);

        // Shield effect with reflector visual
        if (tankGame.powerUps.shield.shieldHP > 0 || tankGame.powerUps.reflectorShield.active) {
            const shieldRadius = this.radius + 12;
            const time = Date.now() / 1000;

            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI * 2 * i / 6) + time;
                const x = this.x + Math.cos(angle) * shieldRadius;
                const y = this.y + Math.sin(angle) * shieldRadius;

                ctx.fillStyle = tankGame.powerUps.reflectorShield.active ?
                    'rgba(255, 200, 50, 0.8)' : 'rgba(26, 188, 156, 0.8)';
                ctx.beginPath();
                ctx.arc(x, y, 3, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.beginPath();
            ctx.arc(this.x, this.y, shieldRadius, 0, Math.PI * 2);
            ctx.strokeStyle = tankGame.powerUps.reflectorShield.active ?
                'rgba(255, 200, 50, 0.5)' : 'rgba(26, 188, 156, 0.5)';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }

    shoot() {
        const now = Date.now();
        if (now - this.lastShot < this.fireRate) return;

        this.lastShot = now;
        this.muzzleFlashTimer = 150;

        const currentDamage = this.getCurrentDamage();

        if (tankGame.powerUps.scatterShot.active) {
            const spreadAngle = Math.PI / 5;
            for (let i = -2; i <= 2; i++) {
                const angle = this.angle + (i * spreadAngle / 4);
                tankGame.projectiles.push(new Projectile(this.x, this.y, angle, currentDamage, 'player'));
                createMuzzleSmoke(this.x, this.y, angle);
            }
        } else {
            tankGame.projectiles.push(new Projectile(this.x, this.y, this.angle, currentDamage, 'player'));
            createMuzzleSmoke(this.x, this.y, this.angle);
        }

        if (navigator.vibrate) navigator.vibrate(20);
    }

    fireLaser() {
        // Laser beam damage to enemies in line of sight
        const laserLength = 500;
        const laserEnd = {
            x: this.x + Math.cos(this.angle) * laserLength,
            y: this.y + Math.sin(this.angle) * laserLength
        };

        tankGame.enemies.forEach(enemy => {
            if (!enemy.active) return;

            // Simple line-circle intersection
            const dist = distanceToLine(enemy, {x: this.x, y: this.y}, laserEnd);
            if (dist < enemy.radius) {
                enemy.takeDamage(TANK_CONFIG.POWERUP_LASER.damage * (tankGame.lastTime / 1000));
            }
        });
    }

    getCurrentDamage() {
        let dmg = this.damage;
        if (tankGame.powerUps.xRay.active) {
            dmg *= (1 + TANK_CONFIG.POWERUP_XRAY.damageBoost);
        }
        if (tankGame.powerUps.doubleDamage.active) {
            dmg *= TANK_CONFIG.POWERUP_DOUBLE_DAMAGE.damageMult;
        }
        return dmg;
    }

    takeDamage(amount) {
        // Shield absorbs damage first
        if (tankGame.powerUps.shield.shieldHP > 0) {
            const absorbed = Math.min(tankGame.powerUps.shield.shieldHP, amount);
            tankGame.powerUps.shield.shieldHP -= absorbed;
            amount -= absorbed;
        }

        // Reflector shield
        if (tankGame.powerUps.reflectorShield.active && amount > 0) {
            // Reflect damage is handled elsewhere
            amount *= (1 - TANK_CONFIG.POWERUP_REFLECTOR.reflectPercent);
        }

        this.hp -= amount;
        this.lastDamageTime = Date.now();
        tankGame.perfectWave = false;

        // Screen shake
        tankGame.screenShake = Math.min(tankGame.screenShake + 5, 15);

        if (this.hp <= 0) {
            this.hp = 0;
            gameOver();
        }

        // Create damage number
        createDamageNumber(this.x, this.y - 30, -Math.round(amount), '#ff4444');
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
        this.angle = 0;
        this.active = true;
        this.lastShot = 0;
        this.fireRate = stats.boss ? 1500 : 2500;
        this.stunned = false;
        this.stunTimer = 0;
        this.boss = stats.boss || false;
        this.hasShield = stats.hasShield || false;
        this.shieldHP = this.hasShield ? this.maxHP * 0.5 : 0;
        this.splits = stats.splits || false;
        this.heals = stats.heals || false;
        this.summons = stats.summons || false;
        this.teleports = stats.teleports || false;
        this.phases = stats.phases || 1;
        this.currentPhase = 1;
        this.lastHeal = 0;
        this.lastSummon = 0;
        this.lastTeleport = 0;
        this.pulseEffect = 0;
    }

    update(deltaTime, player, canvas) {
        if (!this.active) return;

        const dt = deltaTime / 1000;
        this.pulseEffect = Math.sin(Date.now() / 200);

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

        // Type-specific behavior
        if (this.type === 'swarm') {
            // Fast direct attack
            this.x += (dx / dist) * this.speed * dt * tankGame.timeScale;
            this.y += (dy / dist) * this.speed * dt * tankGame.timeScale;
        } else if (this.type === 'fakenews') {
            // Zigzag pattern
            const wobble = Math.sin(Date.now() / 400) * 60;
            const perpX = -dy / dist;
            const perpY = dx / dist;
            this.x += ((dx / dist) * this.speed + perpX * wobble) * dt * tankGame.timeScale;
            this.y += ((dy / dist) * this.speed + perpY * wobble) * dt * tankGame.timeScale;
        } else if (this.type === 'drone') {
            // Circular strafe
            const strafeAngle = Math.atan2(dy, dx) + Math.PI / 2;
            this.x += ((dx / dist) * this.speed * 0.5 + Math.cos(strafeAngle) * 80) * dt * tankGame.timeScale;
            this.y += ((dy / dist) * this.speed * 0.5 + Math.sin(strafeAngle) * 80) * dt * tankGame.timeScale;
        } else if (this.type === 'sniper') {
            // Stationary (already at spawn position)
        } else if (this.type === 'kamikaze') {
            // Extremely fast direct attack
            this.x += (dx / dist) * this.speed * dt * tankGame.timeScale;
            this.y += (dy / dist) * this.speed * dt * tankGame.timeScale;
        } else if (this.type === 'healer') {
            // Stay at distance, heal nearby enemies
            if (dist > 200) {
                this.x += (dx / dist) * this.speed * dt * tankGame.timeScale;
                this.y += (dy / dist) * this.speed * dt * tankGame.timeScale;
            }

            if (Date.now() - this.lastHeal > 3000) {
                this.healNearbyEnemies();
                this.lastHeal = Date.now();
            }
        } else if (this.teleports && Date.now() - this.lastTeleport > 5000) {
            // Boss teleport
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.lastTeleport = Date.now();
            createExplosion(this.x, this.y, this.color, 30);
        } else {
            // Normal movement
            this.x += (dx / dist) * this.speed * dt * tankGame.timeScale;
            this.y += (dy / dist) * this.speed * dt * tankGame.timeScale;
        }

        // Boss summoning
        if (this.summons && Date.now() - this.lastSummon > 8000 && tankGame.enemies.length < TANK_CONFIG.MAX_ENEMIES) {
            this.summonMinions();
            this.lastSummon = Date.now();
        }

        // Shooting
        if (this.canShoot && dist < 400 && Date.now() - this.lastShot > this.fireRate) {
            this.lastShot = Date.now();

            if (this.boss) {
                // Boss shoots 3-way spread
                for (let i = -1; i <= 1; i++) {
                    const spreadAngle = this.angle + (i * Math.PI / 12);
                    tankGame.projectiles.push(new Projectile(this.x, this.y, spreadAngle, this.damage, 'enemy'));
                }
            } else {
                tankGame.projectiles.push(new Projectile(this.x, this.y, this.angle, this.damage, 'enemy'));
            }
        }

        // Collision with player (melee damage)
        const playerDist = Math.sqrt(Math.pow(this.x - player.x, 2) + Math.pow(this.y - player.y, 2));
        if (playerDist < this.radius + player.radius) {
            player.takeDamage(this.damage);
            this.active = false;
            createExplosion(this.x, this.y, this.color, this.boss ? 40 : 20);

            if (navigator.vibrate) navigator.vibrate(50);
        }

        // Boss phase transitions
        if (this.phases > 1) {
            const phaseHP = this.maxHP / this.phases;
            const newPhase = Math.ceil(this.hp / phaseHP);
            if (newPhase !== this.currentPhase) {
                this.currentPhase = newPhase;
                this.enrage();
            }
        }
    }

    draw(ctx) {
        if (!this.active) return;

        // Boss dramatic entrance animation
        if (this.boss) {
            const bossGlow = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 3);
            bossGlow.addColorStop(0, `${this.color}88`);
            bossGlow.addColorStop(1, 'transparent');
            ctx.fillStyle = bossGlow;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2);
            ctx.fill();
        }

        // Glow effect
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 2);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 2, 0, Math.PI * 2);
        ctx.fill();

        // Enemy body with pulsing animation
        const pulseRadius = this.radius + (this.boss ? this.pulseEffect * 3 : 0);
        ctx.fillStyle = this.color;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = this.boss ? 4 : 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, pulseRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Shield visual
        if (this.shieldHP > 0) {
            ctx.strokeStyle = '#2196f3';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius + 5, 0, Math.PI * 2);
            ctx.stroke();
        }

        // Enemy icon (spinning for bosses)
        ctx.save();
        ctx.translate(this.x, this.y);
        if (this.boss) {
            ctx.rotate(Date.now() / 1000);
        }
        ctx.font = `${this.radius * (this.boss ? 1.2 : 1)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.icon, 0, 0);
        ctx.restore();

        // Health bar (always visible for bosses, visible when damaged for others)
        if (this.hp < this.maxHP || tankGame.powerUps.xRay.active || this.boss) {
            const barWidth = this.radius * 2.5;
            const barHeight = this.boss ? 8 : 5;
            const barX = this.x - barWidth / 2;
            const barY = this.y - this.radius - (this.boss ? 15 : 10);

            ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
            ctx.fillRect(barX, barY, barWidth, barHeight);

            const hpPercent = this.hp / this.maxHP;
            ctx.fillStyle = this.boss ? '#ff1744' : '#ff4444';
            ctx.fillRect(barX, barY, barWidth * hpPercent, barHeight);

            // Boss name
            if (this.boss) {
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 14px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(this.type.toUpperCase(), this.x, barY - 10);
            }
        }

        // Stun effect
        if (this.stunned) {
            ctx.strokeStyle = '#ffcc00';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius + 6, 0, Math.PI * 2);
            ctx.stroke();

            // Stun stars
            for (let i = 0; i < 3; i++) {
                const angle = (Date.now() / 500 + i * Math.PI * 2 / 3);
                const sx = this.x + Math.cos(angle) * (this.radius + 15);
                const sy = this.y + Math.sin(angle) * (this.radius + 15);
                ctx.fillText('⭐', sx, sy);
            }
        }
    }

    takeDamage(amount) {
        // Shield absorbs damage
        if (this.shieldHP > 0) {
            const absorbed = Math.min(this.shieldHP, amount);
            this.shieldHP -= absorbed;
            amount -= absorbed;
            createDamageNumber(this.x, this.y - 20, -Math.round(absorbed), '#2196f3');
        }

        this.hp -= amount;
        createDamageNumber(this.x, this.y - 20, -Math.round(amount), '#ffcc00');

        if (this.hp <= 0) {
            this.active = false;
            killEnemy(this);
        }
    }

    stun(duration) {
        if (this.boss) duration *= 0.5; // Bosses resist stun
        this.stunned = true;
        this.stunTimer = duration;
    }

    healNearbyEnemies() {
        const healRadius = 150;
        const healAmount = 20;

        tankGame.enemies.forEach(enemy => {
            if (enemy === this || !enemy.active) return;
            const dist = Math.sqrt(Math.pow(enemy.x - this.x, 2) + Math.pow(enemy.y - this.y, 2));
            if (dist < healRadius) {
                enemy.hp = Math.min(enemy.maxHP, enemy.hp + healAmount);
                createDamageNumber(enemy.x, enemy.y - 20, `+${healAmount}`, '#00ff88');
            }
        });

        // Visual effect
        for (let i = 0; i < 20; i++) {
            const angle = Math.PI * 2 * i / 20;
            const px = this.x + Math.cos(angle) * healRadius;
            const py = this.y + Math.sin(angle) * healRadius;
            tankGame.particles.push(new Particle(px, py, '#00ff88', 'heal'));
        }
    }

    summonMinions() {
        const minionCount = this.boss ? 3 : 2;
        const minionType = this.type === 'droneCommander' ? 'drone' : 'swarm';

        for (let i = 0; i < minionCount; i++) {
            const angle = Math.PI * 2 * i / minionCount;
            const spawnX = this.x + Math.cos(angle) * 50;
            const spawnY = this.y + Math.sin(angle) * 50;
            tankGame.enemies.push(new Enemy(minionType, spawnX, spawnY));
            createExplosion(spawnX, spawnY, TANK_CONFIG.ENEMIES[minionType].color, 15);
        }
    }

    enrage() {
        this.speed *= 1.2;
        this.damage *= 1.1;
        this.fireRate *= 0.8;
        createExplosion(this.x, this.y, '#ff0000', 50);
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

        // Store trail position
        this.trail.push({x: this.x, y: this.y});
        if (this.trail.length > 5) this.trail.shift();

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

        // Draw trail
        this.trail.forEach((pos, i) => {
            const alpha = (i / this.trail.length) * 0.5;
            const size = this.radius * (i / this.trail.length);
            ctx.globalAlpha = alpha;
            ctx.fillStyle = this.owner === 'player' ? '#1abc9c' : '#ff4478';
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1;

        // Glow effect
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 3);
        const color = this.owner === 'player' ? '#1abc9c' : '#ff4478';
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2);
        ctx.fill();

        // Projectile core
        ctx.fillStyle = this.owner === 'player' ? '#00ff88' : '#ff1744';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Particle {
    constructor(x, y, color, type = 'explosion') {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 250;
        this.vy = (Math.random() - 0.5) * 250;
        this.life = 1.0;
        this.color = color;
        this.size = type === 'smoke' ? 4 + Math.random() * 6 : 2 + Math.random() * 5;
        this.type = type;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 5;
    }

    update(deltaTime) {
        const dt = deltaTime / 1000;
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.vy += 100 * dt; // Gravity
        this.life -= dt * (this.type === 'smoke' ? 1 : 2);
        this.rotation += this.rotationSpeed * dt;

        if (this.type === 'smoke') {
            this.size += dt * 5;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        if (this.type === 'smoke') {
            ctx.fillStyle = '#888888';
        } else {
            ctx.fillStyle = this.color;
        }

        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

class DamageNumber {
    constructor(x, y, value, color) {
        this.x = x;
        this.y = y;
        this.value = value;
        this.color = color;
        this.life = 1.0;
        this.vy = -80;
    }

    update(deltaTime) {
        const dt = deltaTime / 1000;
        this.y += this.vy * dt;
        this.life -= dt * 1.5;
    }

    draw(ctx) {
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.font = 'bold 16px monospace';
        ctx.textAlign = 'center';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.strokeText(this.value, this.x, this.y);
        ctx.fillText(this.value, this.x, this.y);
        ctx.globalAlpha = 1;
    }
}

// ==================== GAME LOGIC ====================

function startTankShooter() {
    console.log('[TankShooter EPIC] Starting game...');

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
    tankGame.comboCount = 0;
    tankGame.enemiesKilled = 0;
    tankGame.player = new Player(canvas.width / 2, canvas.height / 2);
    tankGame.enemies = [];
    tankGame.projectiles = [];
    tankGame.particles = [];
    tankGame.damageNumbers = [];
    tankGame.timeScale = 1.0;
    tankGame.lastTime = Date.now();
    tankGame.canvas = canvas;
    tankGame.ctx = ctx;
    tankGame.screenShake = 0;
    tankGame.bossActive = false;
    tankGame.perfectWave = true;

    // Reset power-ups
    for (let key in tankGame.powerUps) {
        const config = TANK_CONFIG[`POWERUP_${key.toUpperCase().replace('BARRAGE', 'MISSILES').replace('PACK', '').replace('BOOST', '')}`];
        tankGame.powerUps[key] = {
            ready: true,
            cooldown: 0,
            active: false,
            duration: 0,
            shieldHP: 0,
            missiles: 0
        };
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

        // Apply screen shake
        if (tankGame.screenShake > 0) {
            tankGame.ctx.save();
            tankGame.ctx.translate(
                (Math.random() - 0.5) * tankGame.screenShake,
                (Math.random() - 0.5) * tankGame.screenShake
            );
            tankGame.screenShake *= 0.9;
        }

        tankGame.ctx.clearRect(0, 0, tankGame.canvas.width, tankGame.canvas.height);

        drawGrid(tankGame.ctx);
        updateGame(deltaTime);
        drawGame(tankGame.ctx);
        updateGameUI();

        if (tankGame.screenShake > 0) {
            tankGame.ctx.restore();
        }

        requestAnimationFrame(gameLoop);
    } catch (error) {
        console.error('[TankShooter EPIC] Error:', error);
        requestAnimationFrame(gameLoop);
    }
}

function updateGame(deltaTime) {
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

    tankGame.enemies.forEach(enemy => enemy.update(deltaTime, tankGame.player, tankGame.canvas));
    tankGame.enemies = tankGame.enemies.filter(e => e.active);

    tankGame.projectiles.forEach(proj => proj.update(deltaTime, tankGame.canvas));
    tankGame.projectiles = tankGame.projectiles.filter(p => p.active);

    tankGame.particles.forEach(p => p.update(deltaTime));
    tankGame.particles = tankGame.particles.filter(p => p.life > 0);
    if (tankGame.particles.length > TANK_CONFIG.MAX_PARTICLES) {
        tankGame.particles = tankGame.particles.slice(-TANK_CONFIG.MAX_PARTICLES);
    }

    tankGame.damageNumbers.forEach(d => d.update(deltaTime));
    tankGame.damageNumbers = tankGame.damageNumbers.filter(d => d.life > 0);
    if (tankGame.damageNumbers.length > TANK_CONFIG.MAX_DAMAGE_NUMBERS) {
        tankGame.damageNumbers.shift();
    }

    checkCollisions();
    updatePowerUpCooldowns(deltaTime);
    updateWaveSpawning(deltaTime);

    if (tankGame.comboTimer > 0) {
        tankGame.comboTimer -= deltaTime;
        if (tankGame.comboTimer <= 0) {
            tankGame.combo = 1;
            tankGame.comboCount = 0;
        }
    }
}

function drawGame(ctx) {
    tankGame.particles.forEach(p => p.draw(ctx));
    tankGame.enemies.forEach(e => e.draw(ctx));
    if (tankGame.player) {
        // Draw laser beam
        if (tankGame.powerUps.laserBeam.active) {
            drawLaserBeam(ctx);
        }
        tankGame.player.draw(ctx);
    }
    tankGame.projectiles.forEach(p => p.draw(ctx));
    tankGame.damageNumbers.forEach(d => d.draw(ctx));
    drawPowerUpEffects(ctx);

    // Wave transition animation
    if (tankGame.waveTransitionActive) {
        drawWaveTransition(ctx);
    }
}

function drawGrid(ctx) {
    ctx.strokeStyle = 'rgba(26, 188, 156, 0.15)';
    ctx.lineWidth = 1;

    const gridSize = 50;
    const time = Date.now() / 5000;

    for (let x = 0; x < tankGame.canvas.width; x += gridSize) {
        ctx.globalAlpha = 0.5 + Math.sin(time + x / 100) * 0.3;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, tankGame.canvas.height);
        ctx.stroke();
    }
    for (let y = 0; y < tankGame.canvas.height; y += gridSize) {
        ctx.globalAlpha = 0.5 + Math.sin(time + y / 100) * 0.3;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(tankGame.canvas.width, y);
        ctx.stroke();
    }
    ctx.globalAlpha = 1;
}

function drawLaserBeam(ctx) {
    const laserLength = 600;
    const player = tankGame.player;
    const endX = player.x + Math.cos(player.angle) * laserLength;
    const endY = player.y + Math.sin(player.angle) * laserLength;

    // Laser glow
    const gradient = ctx.createLinearGradient(player.x, player.y, endX, endY);
    gradient.addColorStop(0, 'rgba(255, 50, 50, 0.8)');
    gradient.addColorStop(1, 'rgba(255, 50, 50, 0)');

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(player.x + Math.cos(player.angle) * 30, player.y + Math.sin(player.angle) * 30);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    // Core beam
    ctx.strokeStyle = '#ffff00';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(player.x + Math.cos(player.angle) * 30, player.y + Math.sin(player.angle) * 30);
    ctx.lineTo(endX, endY);
    ctx.stroke();
}

function drawPowerUpEffects(ctx) {
    if (tankGame.powerUps.slowMo.active) {
        ctx.fillStyle = 'rgba(100, 150, 255, 0.15)';
        ctx.fillRect(0, 0, tankGame.canvas.width, tankGame.canvas.height);
    }

    if (tankGame.powerUps.xRay.active) {
        ctx.strokeStyle = 'rgba(0, 255, 100, 0.4)';
        ctx.lineWidth = 2;
        for (let x = 0; x < tankGame.canvas.width; x += 25) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, tankGame.canvas.height);
            ctx.stroke();
        }
    }

    if (tankGame.powerUps.doubleDamage.active) {
        const pulseAlpha = 0.1 + Math.sin(Date.now() / 200) * 0.05;
        ctx.fillStyle = `rgba(255, 100, 100, ${pulseAlpha})`;
        ctx.fillRect(0, 0, tankGame.canvas.width, tankGame.canvas.height);
    }
}

function drawWaveTransition(ctx) {
    const progress = 1 - (tankGame.waveTransitionTimer / TANK_CONFIG.WAVE_TRANSITION_TIME);

    ctx.fillStyle = `rgba(0, 0, 0, ${0.7 * (1 - Math.abs(progress - 0.5) * 2)})`;
    ctx.fillRect(0, 0, tankGame.canvas.width, tankGame.canvas.height);

    const fontSize = 48 + Math.sin(progress * Math.PI) * 20;
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const text = tankGame.bossActive ? `BOSS WAVE ${tankGame.wave}` : `WAVE ${tankGame.wave}`;
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 4;
    ctx.strokeText(text, tankGame.canvas.width / 2, tankGame.canvas.height / 2);
    ctx.fillText(text, tankGame.canvas.width / 2, tankGame.canvas.height / 2);

    if (tankGame.bossActive) {
        ctx.font = 'bold 24px sans-serif';
        ctx.fillStyle = '#ff4444';
        const bossName = getBossName(tankGame.wave);
        ctx.strokeText(bossName, tankGame.canvas.width / 2, tankGame.canvas.height / 2 + 50);
        ctx.fillText(bossName, tankGame.canvas.width / 2, tankGame.canvas.height / 2 + 50);
    }
}

function getBossName(wave) {
    if (wave === 5) return "SPAM KING";
    if (wave === 10) return "DRONE COMMANDER";
    if (wave === 15) return "TANK COLOSSUS";
    if (wave === 20) return "SWARM QUEEN";
    if (wave === 25) return "AI OVERLORD";
    if (wave === 30) return "THE SINGULARITY";
    return "BOSS";
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
                    createImpactEffect(proj.x, proj.y);
                }
            });
        } else if (proj.owner === 'enemy') {
            if (tankGame.player && circleCollision(proj, tankGame.player)) {
                tankGame.player.takeDamage(proj.damage);
                proj.active = false;
                createImpactEffect(proj.x, proj.y);
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

function distanceToLine(point, lineStart, lineEnd) {
    const A = point.x - lineStart.x;
    const B = point.y - lineStart.y;
    const C = lineEnd.x - lineStart.x;
    const D = lineEnd.y - lineStart.y;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;
    if (lenSq != 0) param = dot / lenSq;

    let xx, yy;
    if (param < 0) {
        xx = lineStart.x;
        yy = lineStart.y;
    } else if (param > 1) {
        xx = lineEnd.x;
        yy = lineEnd.y;
    } else {
        xx = lineStart.x + param * C;
        yy = lineStart.y + param * D;
    }

    const dx = point.x - xx;
    const dy = point.y - yy;
    return Math.sqrt(dx * dx + dy * dy);
}

function killEnemy(enemy) {
    tankGame.enemiesKilled++;
    tankGame.score += Math.floor(enemy.score * tankGame.combo);
    tankGame.comboCount++;

    tankGame.combo = Math.min(tankGame.combo + TANK_CONFIG.COMBO_INCREMENT, TANK_CONFIG.MAX_COMBO);
    tankGame.comboTimer = TANK_CONFIG.COMBO_WINDOW;

    createExplosion(enemy.x, enemy.y, enemy.color, enemy.boss ? 50 : 25);
    tankGame.screenShake = Math.min(tankGame.screenShake + (enemy.boss ? 20 : 5), 25);

    // Splitter enemy splits into 2
    if (enemy.splits && tankGame.enemies.length < TANK_CONFIG.MAX_ENEMIES) {
        for (let i = 0; i < 2; i++) {
            const angle = Math.PI * 2 * i / 2;
            const spawnX = enemy.x + Math.cos(angle) * 30;
            const spawnY = enemy.y + Math.sin(angle) * 30;
            const mini = new Enemy('swarm', spawnX, spawnY);
            mini.hp *= 0.5;
            mini.maxHP *= 0.5;
            tankGame.enemies.push(mini);
        }
    }

    if (navigator.vibrate) navigator.vibrate(enemy.boss ? 100 : 40);
}

function createExplosion(x, y, color, count = 25) {
    for (let i = 0; i < count; i++) {
        tankGame.particles.push(new Particle(x, y, color, 'explosion'));
    }
}

function createImpactEffect(x, y) {
    for (let i = 0; i < 8; i++) {
        tankGame.particles.push(new Particle(x, y, '#ffffff', 'explosion'));
    }
}

function createMuzzleSmoke(x, y, angle) {
    const smokeX = x + Math.cos(angle) * 25;
    const smokeY = y + Math.sin(angle) * 25;
    for (let i = 0; i < 3; i++) {
        tankGame.particles.push(new Particle(smokeX, smokeY, '#888888', 'smoke'));
    }
}

function createDamageNumber(x, y, value, color) {
    tankGame.damageNumbers.push(new DamageNumber(x, y, value, color));
}

function updateGameUI() {
    document.getElementById('gameWave').textContent = tankGame.wave;
    document.getElementById('gameScore').textContent = tankGame.score.toLocaleString();
    document.getElementById('gameCombo').textContent = `x${tankGame.combo.toFixed(1)}`;

    const hpPercent = tankGame.player ? (tankGame.player.hp / tankGame.player.maxHP * 100) : 100;
    document.getElementById('credibilityPercent').textContent = `${Math.round(hpPercent)}%`;
    document.getElementById('credibilityFill').style.width = `${hpPercent}%`;
}

// ==================== WAVE SYSTEM (30+ waves) ====================

function startWave(waveNum) {
    tankGame.wave = waveNum;
    tankGame.waveActive = true;
    tankGame.enemiesSpawned = 0;
    tankGame.enemiesToSpawn = generateWaveEnemies(waveNum);
    tankGame.spawnTimer = 0;
    tankGame.bossActive = waveNum % 5 === 0;
    tankGame.perfectWave = true;
    tankGame.waveTransitionActive = true;
    tankGame.waveTransitionTimer = TANK_CONFIG.WAVE_TRANSITION_TIME;

    console.log(`[TankShooter EPIC] Wave ${waveNum} - ${tankGame.enemiesToSpawn.length} enemies${tankGame.bossActive ? ' - BOSS WAVE' : ''}`);

    setTimeout(() => {
        tankGame.waveTransitionActive = false;
    }, TANK_CONFIG.WAVE_TRANSITION_TIME);
}

function generateWaveEnemies(wave) {
    const enemies = [];

    // Boss waves (every 5 waves)
    if (wave % 5 === 0) {
        if (wave === 5) enemies.push('spamKing');
        else if (wave === 10) enemies.push('droneCommander');
        else if (wave === 15) enemies.push('tankColossus');
        else if (wave === 20) enemies.push('swarmQueen');
        else if (wave === 25) enemies.push('aiOverlord');
        else if (wave === 30) enemies.push('singularity');
        return enemies;
    }

    // Waves 1-5: Training (Spam Bots)
    if (wave <= 5) {
        const count = 5 + wave * 3;
        for (let i = 0; i < count; i++) enemies.push('spam');
    }

    // Waves 6-10: Drones introduced
    else if (wave <= 10) {
        const spam = 8 + wave;
        const drones = 2 + wave;
        for (let i = 0; i < spam; i++) enemies.push('spam');
        for (let i = 0; i < drones; i++) enemies.push('drone');
    }

    // Waves 11-15: Tank battalion
    else if (wave <= 15) {
        const spam = 10 + wave;
        const fakeNews = 5 + wave;
        const deepfake = 2 + Math.floor(wave / 2);
        for (let i = 0; i < spam; i++) enemies.push('spam');
        for (let i = 0; i < fakeNews; i++) enemies.push('fakenews');
        for (let i = 0; i < deepfake; i++) enemies.push('deepfake');
    }

    // Waves 16-20: Swarm chaos
    else if (wave <= 20) {
        const spam = 12 + wave;
        const swarms = 10 + wave * 2;
        const snipers = 1 + Math.floor(wave / 3);
        const kamikazes = 2 + Math.floor(wave / 2);
        for (let i = 0; i < spam; i++) enemies.push('spam');
        for (let i = 0; i < swarms; i++) enemies.push('swarm');
        for (let i = 0; i < snipers; i++) enemies.push('sniper');
        for (let i = 0; i < kamikazes; i++) enemies.push('kamikaze');
    }

    // Waves 21-25: Elite forces
    else if (wave <= 25) {
        const spam = 15 + wave;
        const elites = 3 + Math.floor(wave / 2);
        const shielders = 2 + Math.floor(wave / 3);
        const splitters = 2 + Math.floor(wave / 4);
        const healers = 1 + Math.floor(wave / 5);
        for (let i = 0; i < spam; i++) enemies.push('spam');
        for (let i = 0; i < elites; i++) enemies.push('elite');
        for (let i = 0; i < shielders; i++) enemies.push('shielder');
        for (let i = 0; i < splitters; i++) enemies.push('splitter');
        for (let i = 0; i < healers; i++) enemies.push('healer');
    }

    // Waves 26-30: Final onslaught
    else {
        const spam = 20 + wave * 2;
        const swarms = 15 + wave * 2;
        const elites = 5 + wave;
        const deepfakes = 4 + wave;
        const drones = 5 + wave;
        const mixed = ['sniper', 'kamikaze', 'shielder', 'splitter', 'healer'];

        for (let i = 0; i < spam; i++) enemies.push('spam');
        for (let i = 0; i < swarms; i++) enemies.push('swarm');
        for (let i = 0; i < elites; i++) enemies.push('elite');
        for (let i = 0; i < deepfakes; i++) enemies.push('deepfake');
        for (let i = 0; i < drones; i++) enemies.push('drone');
        for (let i = 0; i < 10; i++) enemies.push(mixed[i % mixed.length]);
    }

    return enemies;
}

function updateWaveSpawning(deltaTime) {
    if (tankGame.waveTransitionActive) {
        tankGame.waveTransitionTimer -= deltaTime;
        return;
    }

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
    const edge = Math.floor(Math.random() * 4);
    let x, y;

    if (edge === 0) {
        x = Math.random() * tankGame.canvas.width;
        y = -30;
    } else if (edge === 1) {
        x = tankGame.canvas.width + 30;
        y = Math.random() * tankGame.canvas.height;
    } else if (edge === 2) {
        x = Math.random() * tankGame.canvas.width;
        y = tankGame.canvas.height + 30;
    } else {
        x = -30;
        y = Math.random() * tankGame.canvas.height;
    }

    tankGame.enemies.push(new Enemy(type, x, y));
}

function waveComplete() {
    tankGame.waveActive = false;
    const waveBonus = TANK_CONFIG.WAVE_COMPLETE_POINTS * tankGame.wave;
    tankGame.score += waveBonus;

    if (tankGame.perfectWave) {
        tankGame.score += TANK_CONFIG.PERFECT_WAVE_BONUS;
        createDamageNumber(tankGame.canvas.width / 2, tankGame.canvas.height / 2 - 50,
            `PERFECT +${TANK_CONFIG.PERFECT_WAVE_BONUS}`, '#00ff88');
    }

    // Heal player
    if (tankGame.player) {
        tankGame.player.hp = Math.min(tankGame.player.maxHP, tankGame.player.hp + 30);
    }

    setTimeout(() => {
        startWave(tankGame.wave + 1);
    }, TANK_CONFIG.WAVE_TRANSITION_TIME);
}

// ==================== POWER-UPS (12 total) ====================

window.activatePowerUp = function(type) {
    const powerUp = tankGame.powerUps[type];

    if (!powerUp.ready || (powerUp.active && type !== 'emp' && type !== 'healthPack' && type !== 'nuke' && type !== 'missileBarrage')) {
        console.log(`[TankShooter EPIC] Power-up ${type} not ready`);
        return;
    }

    powerUp.ready = false;

    console.log(`[TankShooter EPIC] Activating: ${type}`);

    switch(type) {
        case 'slowMo':
            tankGame.timeScale = TANK_CONFIG.POWERUP_SLOW_MO.timeScale;
            powerUp.active = true;
            powerUp.duration = TANK_CONFIG.POWERUP_SLOW_MO.duration;
            setTimeout(() => {
                tankGame.timeScale = 1.0;
                powerUp.active = false;
                startPowerUpCooldown(type, TANK_CONFIG.POWERUP_SLOW_MO.cooldown);
            }, TANK_CONFIG.POWERUP_SLOW_MO.duration);
            break;

        case 'scatterShot':
            powerUp.active = true;
            powerUp.duration = TANK_CONFIG.POWERUP_SCATTER.duration;
            setTimeout(() => {
                powerUp.active = false;
                startPowerUpCooldown(type, TANK_CONFIG.POWERUP_SCATTER.cooldown);
            }, TANK_CONFIG.POWERUP_SCATTER.duration);
            break;

        case 'xRay':
            powerUp.active = true;
            powerUp.duration = TANK_CONFIG.POWERUP_XRAY.duration;
            setTimeout(() => {
                powerUp.active = false;
                startPowerUpCooldown(type, TANK_CONFIG.POWERUP_XRAY.cooldown);
            }, TANK_CONFIG.POWERUP_XRAY.duration);
            break;

        case 'shield':
            powerUp.shieldHP = TANK_CONFIG.POWERUP_SHIELD.hp;
            powerUp.active = true;
            setTimeout(() => {
                if (powerUp.shieldHP > 0) powerUp.shieldHP = 0;
                powerUp.active = false;
                startPowerUpCooldown(type, TANK_CONFIG.POWERUP_SHIELD.cooldown);
            }, 30000);
            break;

        case 'emp':
            tankGame.enemies.forEach(enemy => {
                enemy.takeDamage(TANK_CONFIG.POWERUP_EMP.damage);
                enemy.stun(TANK_CONFIG.POWERUP_EMP.stun);
            });
            createEMPEffect();
            tankGame.screenShake = 30;
            startPowerUpCooldown(type, TANK_CONFIG.POWERUP_EMP.cooldown);
            break;

        case 'laserBeam':
            powerUp.active = true;
            powerUp.duration = TANK_CONFIG.POWERUP_LASER.duration;
            setTimeout(() => {
                powerUp.active = false;
                startPowerUpCooldown(type, TANK_CONFIG.POWERUP_LASER.cooldown);
            }, TANK_CONFIG.POWERUP_LASER.duration);
            break;

        case 'missileBarrage':
            powerUp.missiles = TANK_CONFIG.POWERUP_MISSILES.count;
            fireMissiles();
            startPowerUpCooldown(type, TANK_CONFIG.POWERUP_MISSILES.cooldown);
            break;

        case 'reflectorShield':
            powerUp.active = true;
            powerUp.duration = TANK_CONFIG.POWERUP_REFLECTOR.duration;
            setTimeout(() => {
                powerUp.active = false;
                startPowerUpCooldown(type, TANK_CONFIG.POWERUP_REFLECTOR.cooldown);
            }, TANK_CONFIG.POWERUP_REFLECTOR.duration);
            break;

        case 'speedBoost':
            powerUp.active = true;
            powerUp.duration = TANK_CONFIG.POWERUP_SPEED.duration;
            setTimeout(() => {
                powerUp.active = false;
                startPowerUpCooldown(type, TANK_CONFIG.POWERUP_SPEED.cooldown);
            }, TANK_CONFIG.POWERUP_SPEED.duration);
            break;

        case 'doubleDamage':
            powerUp.active = true;
            powerUp.duration = TANK_CONFIG.POWERUP_DOUBLE_DAMAGE.duration;
            setTimeout(() => {
                powerUp.active = false;
                startPowerUpCooldown(type, TANK_CONFIG.POWERUP_DOUBLE_DAMAGE.cooldown);
            }, TANK_CONFIG.POWERUP_DOUBLE_DAMAGE.duration);
            break;

        case 'healthPack':
            if (tankGame.player) {
                tankGame.player.hp = Math.min(tankGame.player.maxHP,
                    tankGame.player.hp + TANK_CONFIG.POWERUP_HEALTH.amount);
                createDamageNumber(tankGame.player.x, tankGame.player.y - 30,
                    `+${TANK_CONFIG.POWERUP_HEALTH.amount}`, '#00ff88');
            }
            startPowerUpCooldown(type, TANK_CONFIG.POWERUP_HEALTH.cooldown);
            break;

        case 'nuke':
            tankGame.enemies.forEach(enemy => {
                const dist = distance(tankGame.player, enemy);
                if (dist < TANK_CONFIG.POWERUP_NUKE.radius) {
                    enemy.takeDamage(TANK_CONFIG.POWERUP_NUKE.damage);
                }
            });
            createNukeEffect();
            tankGame.screenShake = 50;
            startPowerUpCooldown(type, TANK_CONFIG.POWERUP_NUKE.cooldown);
            break;
    }

    updatePowerUpUI();
    if (navigator.vibrate) navigator.vibrate([50, 100, 50]);
};

function fireMissiles() {
    const missileInterval = 200;
    let count = 0;

    const missileTimer = setInterval(() => {
        if (count >= TANK_CONFIG.POWERUP_MISSILES.count || !tankGame.running) {
            clearInterval(missileTimer);
            return;
        }

        // Find random enemy
        if (tankGame.enemies.length > 0) {
            const target = tankGame.enemies[Math.floor(Math.random() * tankGame.enemies.length)];
            const angle = Math.atan2(target.y - tankGame.player.y, target.x - tankGame.player.x);

            const missile = new Projectile(tankGame.player.x, tankGame.player.y, angle,
                TANK_CONFIG.POWERUP_MISSILES.damage, 'player');
            missile.radius = 8;
            tankGame.projectiles.push(missile);

            createMuzzleSmoke(tankGame.player.x, tankGame.player.y, angle);
        }

        count++;
    }, missileInterval);
}

function createEMPEffect() {
    for (let i = 0; i < 150; i++) {
        const angle = (Math.PI * 2 * i) / 150;
        const radius = 50 + i * 2;
        const x = tankGame.player.x + Math.cos(angle) * radius;
        const y = tankGame.player.y + Math.sin(angle) * radius;
        tankGame.particles.push(new Particle(x, y, '#ffcc00', 'explosion'));
    }
}

function createNukeEffect() {
    for (let i = 0; i < 200; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * TANK_CONFIG.POWERUP_NUKE.radius;
        const x = tankGame.player.x + Math.cos(angle) * radius;
        const y = tankGame.player.y + Math.sin(angle) * radius;
        tankGame.particles.push(new Particle(x, y, '#ff6600', 'explosion'));
    }
}

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
    // This will be handled by index.html UI updates
    // Keep existing powerup UI update logic from original
}

// ==================== CONTROLS ====================

function setupControls(canvas) {
    document.addEventListener('keydown', (e) => {
        tankGame.keys[e.key] = true;

        if (e.key === ' ' && tankGame.player) {
            e.preventDefault();
            tankGame.player.shoot();
        }

        // Power-up shortcuts (1-9, 0, -, =)
        if (e.key >= '1' && e.key <= '9') {
            const powerUpTypes = ['slowMo', 'scatterShot', 'xRay', 'shield', 'emp',
                                  'laserBeam', 'missileBarrage', 'reflectorShield', 'speedBoost'];
            const index = parseInt(e.key) - 1;
            if (index < powerUpTypes.length) {
                activatePowerUp(powerUpTypes[index]);
            }
        }
        if (e.key === '0') activatePowerUp('doubleDamage');
        if (e.key === '-') activatePowerUp('healthPack');
        if (e.key === '=') activatePowerUp('nuke');

        if (e.key === 'Escape') {
            tankGame.paused = !tankGame.paused;
        }
    });

    document.addEventListener('keyup', (e) => {
        tankGame.keys[e.key] = false;
    });

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

    canvas.addEventListener('click', () => {
        if (tankGame.player) tankGame.player.shoot();
    });

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

        tankGame.keys['w'] = dy < -10;
        tankGame.keys['s'] = dy > 10;
        tankGame.keys['a'] = dx < -10;
        tankGame.keys['d'] = dx > 10;
    });

    joystickZone.addEventListener('touchend', () => {
        joystickActive = false;
        tankGame.keys['w'] = false;
        tankGame.keys['s'] = false;
        tankGame.keys['a'] = false;
        tankGame.keys['d'] = false;
    });

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

    const grade = calculateGrade(tankGame.score, tankGame.wave);
    const totalCoins = calculateCoins(grade, tankGame.wave, tankGame.perfectWave);

    if (typeof user !== 'undefined' && user && typeof userProgression !== 'undefined' && userProgression) {
        awardTankShooterCoins(totalCoins);
    }

    document.getElementById('finalWave').textContent = tankGame.wave;
    document.getElementById('finalScore').textContent = tankGame.score.toLocaleString();
    document.getElementById('finalFakes').textContent = tankGame.enemiesKilled;
    document.getElementById('coinsEarned').textContent = `+${totalCoins}`;
    document.getElementById('gameOverGrade').textContent = grade;
    document.getElementById('gameOverScreen').style.display = 'flex';

    console.log(`[TankShooter EPIC] Game Over - Wave: ${tankGame.wave}, Score: ${tankGame.score}, Grade: ${grade}, Coins: ${totalCoins}`);
}

function calculateGrade(score, wave) {
    if (wave >= 30) return 'S';
    if (wave >= 25 || score >= 15000) return 'S';
    if (wave >= 20 || score >= 10000) return 'A';
    if (wave >= 15 || score >= 7000) return 'B';
    if (wave >= 10 || score >= 4000) return 'C';
    return 'D';
}

function calculateCoins(grade, wave, perfect) {
    const baseCoins = Math.floor(tankGame.score / 80);
    const waveBonus = wave * 10;
    const killBonus = tankGame.enemiesKilled * 2;
    const perfectBonus = perfect ? 100 : 0;

    const gradeMultipliers = { S: 3.0, A: 2.0, B: 1.5, C: 1.25, D: 1.0 };
    const multiplier = gradeMultipliers[grade] || 1.0;

    return Math.floor((baseCoins + waveBonus + killBonus + perfectBonus) * multiplier);
}

async function awardTankShooterCoins(amount) {
    try {
        if (typeof supabase === 'undefined') {
            console.error('[TankShooter EPIC] Supabase not available');
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
            console.log(`[TankShooter EPIC] Awarded ${amount} coins. New total: ${userProgression.truth_coins}`);
        } else {
            console.error('[TankShooter EPIC] Error awarding coins:', error);
        }
    } catch (err) {
        console.error('[TankShooter EPIC] Exception:', err);
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

if (typeof window !== 'undefined') {
    window.tankGame = tankGame;
    window.startTankShooter = startTankShooter;
}

console.log('[TankShooter EPIC] Loaded successfully - 12 power-ups, 11 enemy types, 6 bosses, 30+ waves ready!');
