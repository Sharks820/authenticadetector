// ============================================================
// TANK SHOOTER - TOP-DOWN WAVE-BASED SHOOTER
// ============================================================
// File: tank-shooter.js
// Purpose: Replacement for Truth Cannon game
// Design: See TANK_SHOOTER_DESIGN.md

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
    ctx: null
};

// ==================== CONFIGURATION ====================

const TANK_CONFIG = {
    // Player stats
    PLAYER_SPEED: 150,
    PLAYER_HP: 100,
    PLAYER_MAX_HP: 100,
    PLAYER_FIRE_RATE: 500,
    PLAYER_DAMAGE: 25,
    PLAYER_RADIUS: 20,
    PLAYER_REGEN_RATE: 2, // HP per second
    PLAYER_REGEN_DELAY: 5000, // 5 seconds without damage

    // Projectile stats
    PROJECTILE_SPEED: 300,
    PROJECTILE_RADIUS: 4,
    PROJECTILE_LIFETIME: 3000,

    // Enemy stats
    ENEMIES: {
        spam: { hp: 25, speed: 75, damage: 10, score: 10, coins: 1, radius: 15, color: '#ff4478' },
        fakenews: { hp: 50, speed: 100, damage: 15, score: 25, coins: 2, radius: 18, color: '#ff6b9d' },
        deepfake: { hp: 100, speed: 50, damage: 30, score: 50, coins: 5, radius: 22, color: '#ff1744', canShoot: true },
        swarm: { hp: 15, speed: 120, damage: 5, score: 5, coins: 0.33, radius: 10, color: '#ff8a9d' },
        boss: { hp: 500, speed: 30, damage: 50, score: 500, coins: 25, radius: 40, color: '#8e44ad', canShoot: true }
    },

    // Wave config
    WAVE_TRANSITION_TIME: 3000,
    SPAWN_INTERVAL: 1500,
    HP_SCALE_PER_WAVE: 0.05, // +5% HP per wave
    SPEED_SCALE_PER_WAVE: 0.03, // +3% speed per wave
    MAX_HP_SCALE: 1.0, // Cap at +100% HP
    MAX_SPEED_SCALE: 0.5, // Cap at +50% speed

    // Power-up durations/cooldowns (ms)
    POWERUP_SLOW_MO: { duration: 10000, cooldown: 45000, timeScale: 0.25 },
    POWERUP_SCATTER: { duration: 8000, cooldown: 30000, spreadCount: 5 },
    POWERUP_XRAY: { duration: 12000, cooldown: 60000, damageBoost: 0.5 },
    POWERUP_SHIELD: { hp: 100, cooldown: 40000, reflectPercent: 0.5 },
    POWERUP_EMP: { damage: 50, stun: 2000, cooldown: 90000 },

    // Performance limits
    MAX_ENEMIES: 50,
    MAX_PROJECTILES: 100,
    MAX_PARTICLES: 200,

    // Scoring
    WAVE_COMPLETE_POINTS: 100, // * wave number
    NO_DAMAGE_BONUS: 200,
    COMBO_WINDOW: 2000, // 2 seconds
    COMBO_INCREMENT: 0.5,
    MAX_COMBO: 5.0
};

// ==================== ENTITY CLASSES ====================

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.angle = 0; // turret rotation
        this.bodyAngle = 0; // tank body rotation
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
    }

    update(deltaTime, canvas) {
        const dt = deltaTime / 1000; // Convert to seconds

        // Movement
        let moveX = 0;
        let moveY = 0;

        if (tankGame.keys['w'] || tankGame.keys['ArrowUp']) moveY -= 1;
        if (tankGame.keys['s'] || tankGame.keys['ArrowDown']) moveY += 1;
        if (tankGame.keys['a'] || tankGame.keys['ArrowLeft']) moveX -= 1;
        if (tankGame.keys['d'] || tankGame.keys['ArrowRight']) moveX += 1;

        // Normalize diagonal movement
        if (moveX !== 0 && moveY !== 0) {
            moveX *= 0.707; // 1/sqrt(2)
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
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        // Tank body
        ctx.rotate(this.bodyAngle);
        ctx.fillStyle = '#1abc9c';
        ctx.strokeStyle = '#16a085';
        ctx.lineWidth = 3;
        ctx.fillRect(-this.radius, -this.radius * 0.6, this.radius * 2, this.radius * 1.2);
        ctx.strokeRect(-this.radius, -this.radius * 0.6, this.radius * 2, this.radius * 1.2);

        ctx.restore();
        ctx.save();
        ctx.translate(this.x, this.y);

        // Turret
        ctx.rotate(this.angle);
        ctx.fillStyle = '#16a085';
        ctx.fillRect(0, -6, this.radius * 1.5, 12);

        // Turret base
        ctx.beginPath();
        ctx.arc(0, 0, this.radius * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = '#1abc9c';
        ctx.fill();
        ctx.strokeStyle = '#16a085';
        ctx.stroke();

        ctx.restore();

        // Health bar
        const barWidth = this.radius * 2;
        const barHeight = 5;
        const barX = this.x - this.radius;
        const barY = this.y - this.radius - 12;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(barX, barY, barWidth, barHeight);

        const hpPercent = this.hp / this.maxHP;
        ctx.fillStyle = hpPercent > 0.5 ? '#00ff88' : hpPercent > 0.25 ? '#ffcc00' : '#ff4444';
        ctx.fillRect(barX, barY, barWidth * hpPercent, barHeight);

        // Shield effect
        if (tankGame.powerUps.shield.shieldHP > 0) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius + 10, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(26, 188, 156, 0.8)';
            ctx.lineWidth = 3;
            ctx.stroke();

            ctx.strokeStyle = 'rgba(26, 188, 156, 0.4)';
            ctx.lineWidth = 6;
            ctx.stroke();
        }
    }

    shoot() {
        const now = Date.now();
        if (now - this.lastShot < this.fireRate) return;

        this.lastShot = now;

        if (tankGame.powerUps.scatterShot.active) {
            // Scatter shot - 5 projectiles in cone
            const spreadAngle = Math.PI / 6; // 30 degrees total spread
            for (let i = -2; i <= 2; i++) {
                const angle = this.angle + (i * spreadAngle / 4);
                tankGame.projectiles.push(new Projectile(this.x, this.y, angle, this.getCurrentDamage(), 'player'));
            }
        } else {
            tankGame.projectiles.push(new Projectile(this.x, this.y, this.angle, this.getCurrentDamage(), 'player'));
        }

        // Haptic feedback
        if (navigator.vibrate) navigator.vibrate(20);
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

            // Reflect damage
            // (Would need reference to attacker - simplified for now)
        }

        this.hp -= amount;
        this.lastDamageTime = Date.now();

        if (this.hp <= 0) {
            this.hp = 0;
            gameOver();
        }
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
        this.canShoot = stats.canShoot || false;
        this.angle = 0;
        this.active = true;
        this.lastShot = 0;
        this.fireRate = 2000; // Enemies shoot every 2 seconds
        this.stunned = false;
        this.stunTimer = 0;
    }

    update(deltaTime, player, canvas) {
        if (!this.active) return;

        const dt = deltaTime / 1000;

        // Handle stun
        if (this.stunned) {
            this.stunTimer -= deltaTime;
            if (this.stunTimer <= 0) {
                this.stunned = false;
            }
            return; // Can't move while stunned
        }

        // AI behavior - move toward player
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        this.angle = Math.atan2(dy, dx);

        // Different behaviors based on type
        if (this.type === 'swarm') {
            // Swarms move faster and directly at player
            this.x += (dx / dist) * this.speed * dt * tankGame.timeScale;
            this.y += (dy / dist) * this.speed * dt * tankGame.timeScale;
        } else if (this.type === 'fakenews') {
            // Zigzag pattern
            const wobble = Math.sin(Date.now() / 500) * 50;
            const perpX = -dy / dist;
            const perpY = dx / dist;
            this.x += ((dx / dist) * this.speed + perpX * wobble) * dt * tankGame.timeScale;
            this.y += ((dy / dist) * this.speed + perpY * wobble) * dt * tankGame.timeScale;
        } else {
            // Normal movement
            this.x += (dx / dist) * this.speed * dt * tankGame.timeScale;
            this.y += (dy / dist) * this.speed * dt * tankGame.timeScale;
        }

        // Shoot at player if capable and in range
        if (this.canShoot && dist < 300 && Date.now() - this.lastShot > this.fireRate) {
            this.lastShot = Date.now();
            tankGame.projectiles.push(new Projectile(this.x, this.y, this.angle, this.damage, 'enemy'));
        }

        // Collision with player (melee damage)
        const playerDist = Math.sqrt(Math.pow(this.x - player.x, 2) + Math.pow(this.y - player.y, 2));
        if (playerDist < this.radius + player.radius) {
            player.takeDamage(this.damage);
            this.active = false;
            createExplosion(this.x, this.y, this.color);
        }
    }

    draw(ctx) {
        if (!this.active) return;

        // Glow effect
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 1.5);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Enemy body
        ctx.fillStyle = this.color;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Enemy icon
        ctx.font = `${this.radius}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const icons = { spam: '📧', fakenews: '📰', deepfake: '🤖', swarm: '⚡', boss: '🧠' };
        ctx.fillText(icons[this.type], this.x, this.y);

        // Health bar
        if (this.hp < this.maxHP || tankGame.powerUps.xRay.active) {
            const barWidth = this.radius * 2;
            const barHeight = 4;
            const barX = this.x - this.radius;
            const barY = this.y - this.radius - 8;

            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(barX, barY, barWidth, barHeight);

            const hpPercent = this.hp / this.maxHP;
            ctx.fillStyle = '#ff4444';
            ctx.fillRect(barX, barY, barWidth * hpPercent, barHeight);
        }

        // Stun effect
        if (this.stunned) {
            ctx.strokeStyle = '#ffcc00';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius + 5, 0, Math.PI * 2);
            ctx.stroke();
        }
    }

    takeDamage(amount) {
        this.hp -= amount;
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
        this.owner = owner; // 'player' or 'enemy'
        this.radius = TANK_CONFIG.PROJECTILE_RADIUS;
        this.active = true;
        this.lifetime = 0;
        this.maxLifetime = TANK_CONFIG.PROJECTILE_LIFETIME;
    }

    update(deltaTime, canvas) {
        const dt = deltaTime / 1000;
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.lifetime += deltaTime;

        // Deactivate if out of bounds or lifetime expired
        if (this.lifetime > this.maxLifetime ||
            this.x < 0 || this.x > canvas.width ||
            this.y < 0 || this.y > canvas.height) {
            this.active = false;
        }
    }

    draw(ctx) {
        if (!this.active) return;

        // Glow effect
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 2);
        const color = this.owner === 'player' ? '#1abc9c' : '#ff4478';
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 2, 0, Math.PI * 2);
        ctx.fill();

        // Projectile core
        ctx.fillStyle = this.owner === 'player' ? '#00ff88' : '#ff1744';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 200;
        this.vy = (Math.random() - 0.5) * 200;
        this.life = 1.0;
        this.color = color;
        this.size = 2 + Math.random() * 4;
    }

    update(deltaTime) {
        const dt = deltaTime / 1000;
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.life -= dt * 2; // 0.5 second lifetime
    }

    draw(ctx) {
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

// ==================== GAME LOGIC ====================

function startTankShooter() {
    console.log('[TankShooter] Starting game...');

    const gameContainer = document.getElementById('truthCannonGame');
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    // Setup canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 200; // Account for UI

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

    // Reset power-ups
    for (let key in tankGame.powerUps) {
        tankGame.powerUps[key] = { ready: true, cooldown: 0, active: false, duration: 0, shieldHP: 0 };
    }

    // Show game UI
    gameContainer.style.display = 'flex';
    document.getElementById('gameOverScreen').style.display = 'none';
    updateGameUI();

    // Setup controls
    setupControls(canvas);

    // Detect mobile and show virtual joystick
    if (window.innerWidth < 768) {
        document.getElementById('mobileControls').style.display = 'block';
        setupVirtualJoystick();
    }

    // Start first wave
    startWave(1);

    // Start game loop
    requestAnimationFrame(gameLoop);
}

function gameLoop() {
    if (!tankGame.running) return;

    try {
        const now = Date.now();
        const deltaTime = Math.min(now - tankGame.lastTime, 100); // Cap delta to prevent huge jumps
        tankGame.lastTime = now;

        // Clear canvas
        tankGame.ctx.clearRect(0, 0, tankGame.canvas.width, tankGame.canvas.height);

        // Draw background grid
        drawGrid(tankGame.ctx);

        // Update game logic
        updateGame(deltaTime);

        // Draw everything
        drawGame(tankGame.ctx);

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

        // Auto-aim on mobile (aim at nearest enemy)
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

    // Check collisions
    checkCollisions();

    // Update power-up cooldowns
    updatePowerUpCooldowns(deltaTime);

    // Spawn enemies
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
    // Draw entities in order (back to front)
    tankGame.particles.forEach(p => p.draw(ctx));
    tankGame.enemies.forEach(e => e.draw(ctx));
    if (tankGame.player) tankGame.player.draw(ctx);
    tankGame.projectiles.forEach(p => p.draw(ctx));

    // Draw power-up effects
    drawPowerUpEffects(ctx);
}

function drawGrid(ctx) {
    ctx.strokeStyle = 'rgba(26, 188, 156, 0.1)';
    ctx.lineWidth = 1;

    const gridSize = 50;
    for (let x = 0; x < tankGame.canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, tankGame.canvas.height);
        ctx.stroke();
    }
    for (let y = 0; y < tankGame.canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(tankGame.canvas.width, y);
        ctx.stroke();
    }
}

function drawPowerUpEffects(ctx) {
    // Slow-mo effect
    if (tankGame.powerUps.slowMo.active) {
        ctx.fillStyle = 'rgba(100, 150, 255, 0.1)';
        ctx.fillRect(0, 0, tankGame.canvas.width, tankGame.canvas.height);
    }

    // X-Ray effect
    if (tankGame.powerUps.xRay.active) {
        ctx.strokeStyle = 'rgba(0, 255, 100, 0.3)';
        ctx.lineWidth = 2;
        for (let x = 0; x < tankGame.canvas.width; x += 20) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, tankGame.canvas.height);
            ctx.stroke();
        }
    }
}

function checkCollisions() {
    // Projectile vs Enemy/Player
    tankGame.projectiles.forEach(proj => {
        if (!proj.active) return;

        if (proj.owner === 'player') {
            // Check vs enemies
            tankGame.enemies.forEach(enemy => {
                if (!enemy.active) return;
                if (circleCollision(proj, enemy)) {
                    enemy.takeDamage(proj.damage);
                    proj.active = false;
                }
            });
        } else if (proj.owner === 'enemy') {
            // Check vs player
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
    tankGame.score += Math.floor(enemy.score * tankGame.combo);

    // Update combo
    tankGame.combo = Math.min(tankGame.combo + TANK_CONFIG.COMBO_INCREMENT, TANK_CONFIG.MAX_COMBO);
    tankGame.comboTimer = TANK_CONFIG.COMBO_WINDOW;

    createExplosion(enemy.x, enemy.y, enemy.color);

    // Haptic feedback
    if (navigator.vibrate) navigator.vibrate(30);
}

function createExplosion(x, y, color) {
    for (let i = 0; i < 20; i++) {
        tankGame.particles.push(new Particle(x, y, color));
    }
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

    console.log(`[TankShooter] Starting wave ${waveNum} with ${tankGame.enemiesToSpawn.length} enemies`);
}

function generateWaveEnemies(wave) {
    const enemies = [];

    // Boss every 5 waves
    if (wave % 5 === 0) {
        enemies.push('boss');
    }

    // Base enemy count scales with wave
    const spamCount = 5 + wave * 2;
    const fakeNewsCount = wave >= 2 ? 3 + wave : 0;
    const deepfakeCount = wave >= 4 ? 1 + Math.floor(wave / 2) : 0;
    const swarmCount = wave >= 6 ? 5 + wave : 0;

    for (let i = 0; i < spamCount; i++) enemies.push('spam');
    for (let i = 0; i < fakeNewsCount; i++) enemies.push('fakenews');
    for (let i = 0; i < deepfakeCount; i++) enemies.push('deepfake');
    for (let i = 0; i < swarmCount; i++) enemies.push('swarm');

    return enemies;
}

function updateWaveSpawning(deltaTime) {
    if (!tankGame.waveActive) {
        // Check if wave complete
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
    // Spawn from random edge
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

function waveComplete() {
    tankGame.waveActive = false;
    tankGame.score += TANK_CONFIG.WAVE_COMPLETE_POINTS * tankGame.wave;

    // Heal player between waves
    if (tankGame.player) {
        tankGame.player.hp = Math.min(tankGame.player.maxHP, tankGame.player.hp + 20);
    }

    // Start next wave after transition
    setTimeout(() => {
        startWave(tankGame.wave + 1);
    }, TANK_CONFIG.WAVE_TRANSITION_TIME);
}

// ==================== POWER-UPS ====================

window.activatePowerUp = function(type) {
    const powerUp = tankGame.powerUps[type];

    if (!powerUp.ready || powerUp.active) {
        console.log(`[TankShooter] Power-up ${type} not ready (cooldown: ${powerUp.cooldown}ms)`);
        return;
    }

    powerUp.ready = false;
    powerUp.active = true;

    console.log(`[TankShooter] Activating power-up: ${type}`);

    switch(type) {
        case 'slowMo':
            tankGame.timeScale = TANK_CONFIG.POWERUP_SLOW_MO.timeScale;
            powerUp.duration = TANK_CONFIG.POWERUP_SLOW_MO.duration;
            setTimeout(() => {
                tankGame.timeScale = 1.0;
                powerUp.active = false;
                startPowerUpCooldown(type, TANK_CONFIG.POWERUP_SLOW_MO.cooldown);
            }, TANK_CONFIG.POWERUP_SLOW_MO.duration);
            break;

        case 'scatterShot':
            powerUp.duration = TANK_CONFIG.POWERUP_SCATTER.duration;
            setTimeout(() => {
                powerUp.active = false;
                startPowerUpCooldown(type, TANK_CONFIG.POWERUP_SCATTER.cooldown);
            }, TANK_CONFIG.POWERUP_SCATTER.duration);
            break;

        case 'xRay':
            powerUp.duration = TANK_CONFIG.POWERUP_XRAY.duration;
            setTimeout(() => {
                powerUp.active = false;
                startPowerUpCooldown(type, TANK_CONFIG.POWERUP_XRAY.cooldown);
            }, TANK_CONFIG.POWERUP_XRAY.duration);
            break;

        case 'shield':
            powerUp.shieldHP = TANK_CONFIG.POWERUP_SHIELD.hp;
            setTimeout(() => {
                if (powerUp.shieldHP > 0) powerUp.shieldHP = 0;
                startPowerUpCooldown(type, TANK_CONFIG.POWERUP_SHIELD.cooldown);
            }, 30000); // Shield lasts until broken or 30 seconds
            break;

        case 'emp':
            // Damage all enemies and stun them
            tankGame.enemies.forEach(enemy => {
                enemy.takeDamage(TANK_CONFIG.POWERUP_EMP.damage);
                enemy.stun(TANK_CONFIG.POWERUP_EMP.stun);
            });
            createEMPEffect();
            startPowerUpCooldown(type, TANK_CONFIG.POWERUP_EMP.cooldown);
            powerUp.active = false;
            break;
    }

    // Update UI
    updatePowerUpUI();

    // Haptic feedback
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
        const powerUp = tankGame.powerUps[type];
        const cooldownDiv = btn.querySelector('.powerup-cooldown');

        if (powerUp.active) {
            btn.classList.add('active');
            btn.disabled = true;
        } else {
            btn.classList.remove('active');
            btn.disabled = !powerUp.ready;
        }

        if (powerUp.cooldown > 0) {
            cooldownDiv.style.display = 'block';
            cooldownDiv.textContent = `${Math.ceil(powerUp.cooldown / 1000)}s`;
        } else {
            cooldownDiv.style.display = 'none';
        }
    }
}

function createEMPEffect() {
    // Visual EMP pulse
    for (let i = 0; i < 100; i++) {
        const angle = (Math.PI * 2 * i) / 100;
        const x = tankGame.player.x + Math.cos(angle) * 50;
        const y = tankGame.player.y + Math.sin(angle) * 50;
        tankGame.particles.push(new Particle(x, y, '#9b59b6'));
    }
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
    // Simplified virtual joystick - would use nipplejs library in production
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

        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 50;

        // Simulate WASD based on joystick direction
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

    // Fire button
    fireBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (tankGame.player) tankGame.player.shoot();
    });

    // Auto-fire while holding
    let fireTouchId = null;
    fireBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        fireTouchId = setInterval(() => {
            if (tankGame.player && tankGame.running) tankGame.player.shoot();
        }, 200);
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

    // Calculate coins
    const grade = calculateGrade(tankGame.score);
    const totalCoins = calculateCoins(grade);

    // Award coins
    if (typeof user !== 'undefined' && user && typeof userProgression !== 'undefined' && userProgression) {
        awardTankShooterCoins(totalCoins);
    }

    // Show game over screen
    document.getElementById('finalWave').textContent = tankGame.wave;
    document.getElementById('finalScore').textContent = tankGame.score.toLocaleString();
    document.getElementById('finalFakes').textContent = tankGame.enemiesKilled;
    document.getElementById('coinsEarned').textContent = `+${totalCoins}`;
    document.getElementById('gameOverGrade').textContent = grade;
    document.getElementById('gameOverScreen').style.display = 'flex';

    console.log(`[TankShooter] Game Over - Wave: ${tankGame.wave}, Score: ${tankGame.score}, Grade: ${grade}, Coins: ${totalCoins}`);
}

function calculateGrade(score) {
    if (score >= 10000) return 'S';
    if (score >= 7500) return 'A';
    if (score >= 5000) return 'B';
    if (score >= 2500) return 'C';
    return 'D';
}

function calculateCoins(grade) {
    const baseCoins = Math.floor(tankGame.score / 100);
    const waveBonus = tankGame.wave * 2;
    const killBonus = tankGame.enemiesKilled * 1;

    const gradeMultipliers = { S: 2.0, A: 1.5, B: 1.25, C: 1.0, D: 0.75 };
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

// Export for debugging
if (typeof window !== 'undefined') {
    window.tankGame = tankGame;
    window.startTankShooter = startTankShooter;
}

console.log('[TankShooter] Loaded successfully');
