// Boss System for Tank Game
// Add this code to index.html before the Bubble class

class Boss {
    constructor(type, wave) {
        this.x = Math.random() * 600 + 100;
        this.y = -100;
        this.type = type;
        this.wave = wave;
        this.active = true;
        this.radius = 60; // Larger than normal bubbles

        const bossData = this.getBossData();
        this.maxHealth = bossData.health;
        this.health = this.maxHealth;
        this.speed = bossData.speed;
        this.icon = bossData.icon;
        this.name = bossData.name;
        this.color = bossData.color;
        this.glowColor = bossData.glowColor;

        this.vx = (Math.random() - 0.5) * 2;
        this.vy = this.speed;
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = 0.03;

        this.attackTimer = 0;
        this.attackInterval = bossData.attackInterval;
        this.projectiles = [];

        this.pulsePhase = 0;
        this.introComplete = false;
        this.deathAnimationFrame = 0;
        this.dying = false;
        this.visible = true;
        this.coinsReward = bossData.coins;
        this.xpReward = bossData.xp;
    }

    getBossData() {
        const bosses = {
            heavy: {
                name: 'Heavy Tank',
                health: 500,
                speed: 0.3,
                icon: '🛡️',
                color: '#555',
                glowColor: 'rgba(100, 100, 100, 0.5)',
                attackInterval: 3000,
                coins: 50,
                xp: 100
            },
            twin: {
                name: 'Twin Tank',
                health: 300,
                speed: 0.5,
                icon: '⚔️',
                color: '#c44',
                glowColor: 'rgba(200, 70, 70, 0.5)',
                attackInterval: 1000,
                coins: 75,
                xp: 150
            },
            siege: {
                name: 'Siege Tank',
                health: 400,
                speed: 0.2,
                icon: '💥',
                color: '#d90',
                glowColor: 'rgba(220, 150, 0, 0.5)',
                attackInterval: 4000,
                coins: 100,
                xp: 200
            },
            stealth: {
                name: 'Stealth Tank',
                health: 250,
                speed: 0.6,
                icon: '👻',
                color: '#66d',
                glowColor: 'rgba(100, 100, 220, 0.5)',
                attackInterval: 2000,
                coins: 125,
                xp: 250
            },
            mega: {
                name: 'MEGA TANK',
                health: 800,
                speed: 0.4,
                icon: '👑',
                color: '#d4af37',
                glowColor: 'rgba(212, 175, 55, 0.6)',
                attackInterval: 2000,
                coins: 200,
                xp: 500
            }
        };
        return bosses[this.type] || bosses.heavy;
    }

    update(canvas, deltaTime) {
        if (!this.active) return;

        // Intro animation - boss slides in from top
        if (!this.introComplete) {
            this.y += 1;
            if (this.y >= 150) {
                this.introComplete = true;
                // Show boss intro notification
                if (window.showBossIntro) {
                    window.showBossIntro(this.name, this.icon);
                }
            }
            return;
        }

        // Death animation - expanding explosion
        if (this.dying) {
            this.deathAnimationFrame++;
            if (this.deathAnimationFrame > 60) {
                this.active = false;
            }
            return;
        }

        // Movement pattern - sine wave
        this.wobble += this.wobbleSpeed;
        this.x += Math.sin(this.wobble) * 2;
        this.y += this.vy;

        // Bounce off walls
        if (this.x < this.radius) {
            this.x = this.radius;
            this.vx *= -1;
        }
        if (this.x > canvas.width - this.radius) {
            this.x = canvas.width - this.radius;
            this.vx *= -1;
        }

        // Stealth invisibility toggle
        if (this.type === 'stealth') {
            this.visible = Math.sin(Date.now() / 1000) > 0;
        }

        // Attack pattern
        this.attackTimer += deltaTime;
        if (this.attackTimer >= this.attackInterval) {
            this.attack(canvas);
            this.attackTimer = 0;
        }

        // Update projectiles
        this.projectiles.forEach(p => {
            p.y += p.vy;
            p.x += p.vx || 0;
        });
        this.projectiles = this.projectiles.filter(p => p.y < canvas.height);

        // Pulse animation
        this.pulsePhase += 0.05;

        // Check if reached bottom - causes damage
        if (this.y > canvas.height - this.radius) {
            this.active = false;
            if (window.loseCredibility) {
                loseCredibility(30); // Bosses cause more damage
            }
        }
    }

    attack(canvas) {
        switch(this.type) {
            case 'heavy':
                // Single big slow shot
                this.projectiles.push({
                    x: this.x,
                    y: this.y + this.radius,
                    vy: 2,
                    radius: 20,
                    damage: 30,
                    color: '#555'
                });
                break;

            case 'twin':
                // Two rapid shots
                this.projectiles.push({
                    x: this.x - 20,
                    y: this.y + this.radius,
                    vy: 4,
                    radius: 12,
                    damage: 15,
                    color: '#c44'
                });
                this.projectiles.push({
                    x: this.x + 20,
                    y: this.y + this.radius,
                    vy: 4,
                    radius: 12,
                    damage: 15,
                    color: '#c44'
                });
                break;

            case 'siege':
                // Artillery with area damage
                this.projectiles.push({
                    x: this.x,
                    y: this.y + this.radius,
                    vy: 1.5,
                    radius: 25,
                    damage: 40,
                    color: '#d90',
                    aoe: true,
                    aoeRadius: 80
                });
                break;

            case 'stealth':
                // Fast tracking shot when visible
                if (this.visible) {
                    this.projectiles.push({
                        x: this.x,
                        y: this.y + this.radius,
                        vy: 5,
                        radius: 10,
                        damage: 20,
                        color: '#66d'
                    });
                }
                break;

            case 'mega':
                // All abilities!
                // Heavy shot
                this.projectiles.push({
                    x: this.x,
                    y: this.y + this.radius,
                    vy: 2.5,
                    radius: 18,
                    damage: 25,
                    color: '#d4af37'
                });
                // Twin shots
                this.projectiles.push({
                    x: this.x - 30,
                    y: this.y + this.radius,
                    vy: 3.5,
                    radius: 10,
                    damage: 15,
                    color: '#ffd700'
                });
                this.projectiles.push({
                    x: this.x + 30,
                    y: this.y + this.radius,
                    vy: 3.5,
                    radius: 10,
                    damage: 15,
                    color: '#ffd700'
                });
                break;
        }
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.health = 0;
            this.dying = true;
            return true; // Boss defeated
        }
        return false;
    }

    draw(ctx) {
        if (!this.active) return;
        if (this.type === 'stealth' && !this.visible) return;

        // Death animation
        if (this.dying) {
            const explosionRadius = this.radius + (this.deathAnimationFrame * 3);
            const alpha = 1 - (this.deathAnimationFrame / 60);

            ctx.globalAlpha = alpha;
            for (let i = 0; i < 3; i++) {
                const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, explosionRadius - i * 20);
                gradient.addColorStop(0, this.color);
                gradient.addColorStop(1, 'rgba(255, 100, 0, 0)');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(this.x, this.y, explosionRadius - i * 20, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;
            return;
        }

        // Pulsing glow
        const pulseSize = this.radius + Math.sin(this.pulsePhase) * 10;
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, pulseSize * 1.5);
        gradient.addColorStop(0, this.glowColor);
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, pulseSize * 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Boss body
        ctx.fillStyle = this.color;
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Boss icon
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 40px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.icon, this.x, this.y);

        // Health bar
        this.drawHealthBar(ctx);

        // Draw projectiles
        this.projectiles.forEach(p => {
            if (p.aoe) {
                // AOE indicator
                ctx.strokeStyle = 'rgba(220, 150, 0, 0.3)';
                ctx.lineWidth = 2;
                ctx.setLineDash([5, 5]);
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.aoeRadius, 0, Math.PI * 2);
                ctx.stroke();
                ctx.setLineDash([]);
            }

            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    drawHealthBar(ctx) {
        const barWidth = this.radius * 2;
        const barHeight = 8;
        const barX = this.x - barWidth / 2;
        const barY = this.y - this.radius - 20;

        // Background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(barX, barY, barWidth, barHeight);

        // Health fill
        const healthPercent = this.health / this.maxHealth;
        const healthColor = healthPercent > 0.5 ? '#4f4' : healthPercent > 0.25 ? '#ff4' : '#f44';
        ctx.fillStyle = healthColor;
        ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);

        // Border
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.strokeRect(barX, barY, barWidth, barHeight);

        // Boss name above health bar
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(this.name, this.x, barY - 10);
    }
}

// Boss spawn logic - add to game state
function shouldSpawnBoss(wave) {
    // Boss every 5 waves
    return wave % 5 === 0 && wave > 0;
}

function getBossType(wave) {
    // Boss 1 (Wave 5): Heavy Tank
    // Boss 2 (Wave 10): Twin Tank
    // Boss 3 (Wave 15): Siege Tank
    // Boss 4 (Wave 20): Stealth Tank
    // Boss 5 (Wave 25+): Mega Tank
    const bossTypes = ['heavy', 'twin', 'siege', 'stealth', 'mega'];
    const bossIndex = Math.min(Math.floor(wave / 5) - 1, 4);
    return bossTypes[bossIndex];
}

// Boss intro notification (add to your UI functions)
window.showBossIntro = function(bossName, bossIcon) {
    const intro = document.createElement('div');
    intro.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.9);
        color: #fff;
        padding: 40px 60px;
        border-radius: 20px;
        border: 4px solid #ffd700;
        font-size: 32px;
        font-weight: bold;
        text-align: center;
        z-index: 9999;
        animation: bossIntroAnim 3s ease-out forwards;
        box-shadow: 0 0 40px rgba(255, 215, 0, 0.6);
    `;
    intro.innerHTML = `
        <div style="font-size:80px;margin-bottom:20px">${bossIcon}</div>
        <div>${bossName}</div>
        <div style="font-size:20px;margin-top:10px;color:#ffd700">WARNING</div>
    `;
    document.body.appendChild(intro);

    // Vibrate if supported
    if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200, 100, 200]);
    }

    // Remove after 3 seconds
    setTimeout(() => {
        intro.remove();
    }, 3000);
};

// Add CSS animation for boss intro
const style = document.createElement('style');
style.textContent = `
@keyframes bossIntroAnim {
    0% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.5);
    }
    50% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1.1);
    }
    80% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
    }
    100% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.9);
    }
}
`;
document.head.appendChild(style);
