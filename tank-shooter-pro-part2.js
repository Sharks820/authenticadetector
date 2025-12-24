// ============================================================
// TANK BATTLE PRO - PART 2 (Enemy System, Particles, Waves)
// ============================================================

// ==================== ENEMY CLASS WITH DIVERSE BEHAVIORS ====================

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
        this.behavior = stats.behavior || 'rush';
        this.hasShield = stats.hasShield || false;
        this.shieldHP = this.hasShield ? this.maxHP * 0.5 : 0;
        this.angle = 0;
        this.active = true;
        this.lastShot = 0;
        this.fireRate = stats.fireRate || (this.isBoss ? 1000 : 2000);
        this.stunned = false;
        this.stunTimer = 0;
        this.hitFlash = 0;

        // Boss-specific
        this.pattern = stats.pattern || 'normal';
        this.spawnsMinions = stats.spawnsMinions || false;
        this.teleports = stats.teleports || false;
        this.adaptive = stats.adaptive || false;
        this.phases = stats.phases || false;
        this.lastMinionSpawn = 0;
        this.lastTeleport = 0;
        this.phaseTransitioned = false;

        // Behavior-specific variables
        this.strafeDirection = Math.random() < 0.5 ? -1 : 1;
        this.strafeTimer = 0;
        this.circleAngle = Math.random() * Math.PI * 2;
        this.circleDistance = 200 + Math.random() * 100;
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

        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        this.angle = Math.atan2(dy, dx);

        // BEHAVIOR SYSTEM
        switch(this.behavior) {
            case 'rush':
                // Direct rush toward player
                this.x += (dx / dist) * this.speed * dt * tankGame.timeScale;
                this.y += (dy / dist) * this.speed * dt * tankGame.timeScale;
                break;

            case 'zigzag':
                // Zigzag movement
                const wobble = Math.sin(Date.now() / 400) * 60;
                const perpX = -dy / dist;
                const perpY = dx / dist;
                this.x += ((dx / dist) * this.speed * 0.7 + perpX * wobble) * dt * tankGame.timeScale;
                this.y += ((dy / dist) * this.speed * 0.7 + perpY * wobble) * dt * tankGame.timeScale;
                break;

            case 'flank':
                // Try to circle around player
                this.strafeTimer += deltaTime;
                if (this.strafeTimer > 2000) {
                    this.strafeDirection *= -1;
                    this.strafeTimer = 0;
                }
                const flankPerpX = -dy / dist * this.strafeDirection;
                const flankPerpY = dx / dist * this.strafeDirection;
                this.x += ((dx / dist) * this.speed * 0.5 + flankPerpX * this.speed * 0.8) * dt * tankGame.timeScale;
                this.y += ((dy / dist) * this.speed * 0.5 + flankPerpY * this.speed * 0.8) * dt * tankGame.timeScale;
                break;

            case 'tank':
                // Slow but steady advance
                this.x += (dx / dist) * this.speed * dt * tankGame.timeScale;
                this.y += (dy / dist) * this.speed * dt * tankGame.timeScale;
                break;

            case 'sniper':
                // Keep distance and shoot
                if (dist < 250) {
                    // Back away
                    this.x -= (dx / dist) * this.speed * dt * tankGame.timeScale;
                    this.y -= (dy / dist) * this.speed * dt * tankGame.timeScale;
                } else if (dist > 350) {
                    // Get closer
                    this.x += (dx / dist) * this.speed * 0.5 * dt * tankGame.timeScale;
                    this.y += (dy / dist) * this.speed * 0.5 * dt * tankGame.timeScale;
                } else {
                    // Strafe to avoid shots
                    const strafePerpX = -dy / dist;
                    const strafePerpY = dx / dist;
                    this.x += strafePerpX * this.speed * dt * tankGame.timeScale;
                    this.y += strafePerpY * this.speed * dt * tankGame.timeScale;
                }
                break;

            case 'swarm':
                // Fast, erratic movement
                const swarmWobble = Math.sin(Date.now() / 200 + this.x) * 80;
                this.x += ((dx / dist) * this.speed + swarmWobble * 0.3) * dt * tankGame.timeScale;
                this.y += ((dy / dist) * this.speed + swarmWobble * 0.3) * dt * tankGame.timeScale;
                break;

            case 'artillery':
                // Stay back and shoot
                if (dist < 400) {
                    this.x -= (dx / dist) * this.speed * dt * tankGame.timeScale;
                    this.y -= (dy / dist) * this.speed * dt * tankGame.timeScale;
                }
                break;

            case 'teleport':
                // Teleport periodically
                if (Date.now() - this.lastTeleport > 5000 && dist > 200) {
                    this.lastTeleport = Date.now();
                    const teleportAngle = Math.random() * Math.PI * 2;
                    const teleportDist = 150 + Math.random() * 100;
                    this.x = player.x + Math.cos(teleportAngle) * teleportDist;
                    this.y = player.y + Math.sin(teleportAngle) * teleportDist;

                    // Teleport particles
                    for (let i = 0; i < 30; i++) {
                        tankGame.particles.push(new Particle(this.x, this.y, this.color, 'explosion'));
                    }
                } else {
                    this.x += (dx / dist) * this.speed * 0.6 * dt * tankGame.timeScale;
                    this.y += (dy / dist) * this.speed * 0.6 * dt * tankGame.timeScale;
                }
                break;

            case 'boss_ai':
                // Circular movement around player
                this.circleAngle += 0.02 * dt;
                const circleX = player.x + Math.cos(this.circleAngle) * this.circleDistance;
                const circleY = player.y + Math.sin(this.circleAngle) * this.circleDistance;
                const circleDX = circleX - this.x;
                const circleDY = circleY - this.y;
                this.x += circleDX * 0.03 * this.speed * dt;
                this.y += circleDY * 0.03 * this.speed * dt;
                break;

            case 'boss_gan':
                // Spiral pattern
                this.circleAngle += 0.03 * dt;
                this.circleDistance = 200 + Math.sin(Date.now() / 2000) * 100;
                const spiralX = player.x + Math.cos(this.circleAngle) * this.circleDistance;
                const spiralY = player.y + Math.sin(this.circleAngle) * this.circleDistance;
                this.x += (spiralX - this.x) * 0.02 * this.speed * dt;
                this.y += (spiralY - this.y) * 0.02 * this.speed * dt;

                // Spawn minions
                if (this.spawnsMinions && Date.now() - this.lastMinionSpawn > 8000) {
                    this.lastMinionSpawn = Date.now();
                    for (let i = 0; i < 3; i++) {
                        const minionAngle = Math.random() * Math.PI * 2;
                        const minionX = this.x + Math.cos(minionAngle) * 50;
                        const minionY = this.y + Math.sin(minionAngle) * 50;
                        tankGame.enemies.push(new Enemy('spam', minionX, minionY));
                    }
                }
                break;

            case 'boss_diffusion':
                // Teleport and burst attacks
                if (this.teleports && Date.now() - this.lastTeleport > 6000) {
                    this.lastTeleport = Date.now();
                    const tpAngle = Math.random() * Math.PI * 2;
                    this.x = player.x + Math.cos(tpAngle) * 300;
                    this.y = player.y + Math.sin(tpAngle) * 300;

                    // Burst fire on teleport
                    for (let i = 0; i < 12; i++) {
                        const burstAngle = (i / 12) * Math.PI * 2;
                        tankGame.projectiles.push(new Projectile(this.x, this.y, burstAngle, this.damage, 'enemy'));
                    }

                    for (let i = 0; i < 40; i++) {
                        tankGame.particles.push(new Particle(this.x, this.y, this.color, 'explosion'));
                    }
                } else {
                    this.x += (dx / dist) * this.speed * 0.4 * dt * tankGame.timeScale;
                    this.y += (dy / dist) * this.speed * 0.4 * dt * tankGame.timeScale;
                }
                break;

            case 'boss_llm':
                // Adaptive movement - predicts player movement
                const predictedX = player.x + player.vx * 0.5;
                const predictedY = player.y + player.vy * 0.5;
                const predDX = predictedX - this.x;
                const predDY = predictedY - this.y;
                const predDist = Math.sqrt(predDX * predDX + predDY * predDY);
                this.angle = Math.atan2(predDY, predDX);
                this.x += (predDX / predDist) * this.speed * dt * tankGame.timeScale;
                this.y += (predDY / predDist) * this.speed * dt * tankGame.timeScale;
                break;

            case 'boss_ultimate':
                // Phase-based behavior
                const hpPercent = this.hp / this.maxHP;

                if (hpPercent < 0.5 && !this.phaseTransitioned) {
                    this.phaseTransitioned = true;
                    this.speed *= 1.5;
                    this.fireRate *= 0.6;
                    showNotification('⚠️ BOSS ENRAGED! ⚠️', 'warning');
                }

                // Combination of all patterns
                this.circleAngle += 0.04 * dt;
                const comboX = player.x + Math.cos(this.circleAngle) * 250;
                const comboY = player.y + Math.sin(this.circleAngle) * 250;
                this.x += (comboX - this.x) * 0.03 * this.speed * dt;
                this.y += (comboY - this.y) * 0.03 * this.speed * dt;

                // Spawn minions in enraged phase
                if (hpPercent < 0.5 && this.spawnsMinions && Date.now() - this.lastMinionSpawn > 5000) {
                    this.lastMinionSpawn = Date.now();
                    for (let i = 0; i < 5; i++) {
                        const types = ['swarm', 'rusher', 'bot'];
                        const type = types[Math.floor(Math.random() * types.length)];
                        const minionAngle = (i / 5) * Math.PI * 2;
                        const minionX = this.x + Math.cos(minionAngle) * 70;
                        const minionY = this.y + Math.sin(minionAngle) * 70;
                        tankGame.enemies.push(new Enemy(type, minionX, minionY));
                    }
                }
                break;

            default:
                // Default behavior
                this.x += (dx / dist) * this.speed * dt * tankGame.timeScale;
                this.y += (dy / dist) * this.speed * dt * tankGame.timeScale;
        }

        // Shoot at player
        const shootRange = this.isBoss ? 500 : (this.behavior === 'sniper' || this.behavior === 'artillery' ? 400 : 300);
        if (this.canShoot && dist < shootRange && Date.now() - this.lastShot > this.fireRate) {
            this.lastShot = Date.now();
            this.shootAtPlayer(player, dist);
        }

        // Collision with player (melee damage)
        const playerDist = Math.sqrt(Math.pow(this.x - player.x, 2) + Math.pow(this.y - player.y, 2));
        if (playerDist < this.radius + player.radius) {
            player.takeDamage(this.damage);
            this.active = false;
            createExplosion(this.x, this.y, this.color, this.isBoss ? 'massive' : 'large');
        }

        // Keep in bounds
        this.x = Math.max(this.radius, Math.min(canvas.width - this.radius, this.x));
        this.y = Math.max(this.radius, Math.min(canvas.height - this.radius, this.y));
    }

    shootAtPlayer(player, dist) {
        if (this.pattern === 'circle') {
            // Circular pattern
            for (let i = 0; i < 8; i++) {
                const angle = (i / 8) * Math.PI * 2;
                tankGame.projectiles.push(new Projectile(this.x, this.y, angle, this.damage * 0.7, 'enemy'));
            }
        } else if (this.pattern === 'spiral') {
            // Spiral pattern
            const time = Date.now() / 1000;
            for (let i = 0; i < 5; i++) {
                const angle = this.angle + (i / 5) * Math.PI * 2 + time;
                tankGame.projectiles.push(new Projectile(this.x, this.y, angle, this.damage * 0.8, 'enemy'));
            }
        } else if (this.pattern === 'burst') {
            // Burst fire
            for (let i = -2; i <= 2; i++) {
                const angle = this.angle + (i * Math.PI / 12);
                tankGame.projectiles.push(new Projectile(this.x, this.y, angle, this.damage, 'enemy'));
            }
        } else if (this.pattern === 'predict') {
            // Predictive shot
            const timeToImpact = dist / TANK_CONFIG.PROJECTILE_SPEED;
            const predictX = player.x + player.vx * timeToImpact;
            const predictY = player.y + player.vy * timeToImpact;
            const predictAngle = Math.atan2(predictY - this.y, predictX - this.x);
            tankGame.projectiles.push(new Projectile(this.x, this.y, predictAngle, this.damage * 1.2, 'enemy'));
        } else if (this.pattern === 'all') {
            // Combination attack
            const attacks = ['triple', 'burst', 'predict'];
            const chosen = attacks[Math.floor(Math.random() * attacks.length)];

            if (chosen === 'triple') {
                for (let i = -1; i <= 1; i++) {
                    const angle = this.angle + (i * Math.PI / 8);
                    tankGame.projectiles.push(new Projectile(this.x, this.y, angle, this.damage, 'enemy'));
                }
            } else if (chosen === 'burst') {
                for (let i = 0; i < 12; i++) {
                    const angle = (i / 12) * Math.PI * 2;
                    tankGame.projectiles.push(new Projectile(this.x, this.y, angle, this.damage * 0.6, 'enemy'));
                }
            } else {
                const timeToImpact = dist / TANK_CONFIG.PROJECTILE_SPEED;
                const predictX = player.x + player.vx * timeToImpact;
                const predictY = player.y + player.vy * timeToImpact;
                const predictAngle = Math.atan2(predictY - this.y, predictX - this.x);
                tankGame.projectiles.push(new Projectile(this.x, this.y, predictAngle, this.damage * 1.3, 'enemy'));
            }
        } else {
            // Normal shot
            if (this.isBoss) {
                // Triple shot for bosses
                for (let i = -1; i <= 1; i++) {
                    const angle = this.angle + (i * Math.PI / 16);
                    tankGame.projectiles.push(new Projectile(this.x, this.y, angle, this.damage, 'enemy'));
                }
            } else {
                tankGame.projectiles.push(new Projectile(this.x, this.y, this.angle, this.damage, 'enemy'));
            }
        }
    }

    draw(ctx) {
        if (!this.active) return;

        // Enhanced glow effect
        const glowLayers = this.isBoss ? 5 : 3;
        for (let i = 0; i < glowLayers; i++) {
            const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * (2 + i * 0.6));
            gradient.addColorStop(0, this.color);
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.globalAlpha = 0.5 - i * 0.08;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius * (2 + i * 0.6), 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;

        // Enemy body with metallic gradient
        const bodyGradient = ctx.createRadialGradient(
            this.x - this.radius/2, this.y - this.radius/2, 0,
            this.x, this.y, this.radius
        );
        bodyGradient.addColorStop(0, this.lightenColor(this.color, 30));
        bodyGradient.addColorStop(0.5, this.color);
        bodyGradient.addColorStop(1, this.darkenColor(this.color, 20));
        ctx.fillStyle = bodyGradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // Shield effect for shielded enemies
        if (this.hasShield && this.shieldHP > 0) {
            const shieldRadius = this.radius + 6;
            ctx.strokeStyle = 'rgba(100, 200, 255, 0.7)';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(this.x, this.y, shieldRadius, 0, Math.PI * 2);
            ctx.stroke();

            // Shield segments
            const time = Date.now() / 1000;
            for (let i = 0; i < 6; i++) {
                const angle = (i / 6) * Math.PI * 2 + time;
                const x1 = this.x + Math.cos(angle) * shieldRadius;
                const y1 = this.y + Math.sin(angle) * shieldRadius;
                const x2 = this.x + Math.cos(angle + Math.PI / 6) * shieldRadius;
                const y2 = this.y + Math.sin(angle + Math.PI / 6) * shieldRadius;

                ctx.strokeStyle = 'rgba(100, 200, 255, 0.5)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
            }
        }

        // Border
        ctx.strokeStyle = this.isBoss ? '#ffffff' : this.darkenColor(this.color, 30);
        ctx.lineWidth = this.isBoss ? 5 : 3;
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

        // Boss crown effect with glow
        if (this.isBoss) {
            ctx.save();
            ctx.shadowColor = '#ffd700';
            ctx.shadowBlur = 10;
            ctx.translate(this.x, this.y - this.radius - 15);
            ctx.font = 'bold 24px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('👑', 0, 0);
            ctx.restore();
        }

        // Enemy icon
        const iconSize = this.isBoss ? this.radius * 1.3 : this.radius * 1.1;
        ctx.font = `${iconSize}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.icon, this.x, this.y);

        // Health bar
        if (this.hp < this.maxHP || tankGame.powerUps.xRay.active || this.isBoss) {
            const barWidth = this.radius * (this.isBoss ? 3.5 : 2.5);
            const barHeight = this.isBoss ? 10 : 6;
            const barX = this.x - barWidth / 2;
            const barY = this.y - this.radius - (this.isBoss ? 25 : 15);

            // Shadow
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            ctx.shadowBlur = 4;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
            ctx.fillRect(barX - 2, barY - 2, barWidth + 4, barHeight + 4);
            ctx.shadowBlur = 0;

            const hpPercent = this.hp / this.maxHP;

            // HP gradient with glow
            const hpGradient = ctx.createLinearGradient(barX, 0, barX + barWidth, 0);
            hpGradient.addColorStop(0, '#ef4444');
            hpGradient.addColorStop(1, '#dc2626');
            ctx.fillStyle = hpGradient;
            ctx.shadowColor = '#ef4444';
            ctx.shadowBlur = 4;
            ctx.fillRect(barX, barY, barWidth * hpPercent, barHeight);
            ctx.shadowBlur = 0;

            // Boss HP text
            if (this.isBoss) {
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 11px monospace';
                ctx.textAlign = 'center';
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 3;
                ctx.strokeText(`${Math.ceil(this.hp)}/${Math.ceil(this.maxHP)}`, this.x, barY - 10);
                ctx.fillText(`${Math.ceil(this.hp)}/${Math.ceil(this.maxHP)}`, this.x, barY - 10);
            }
        }

        // Stun effect
        if (this.stunned) {
            const time = Date.now() / 150;
            for (let i = 0; i < 4; i++) {
                const angle = time + (i * Math.PI / 2);
                const starX = this.x + Math.cos(angle) * (this.radius + 15);
                const starY = this.y + Math.sin(angle) * (this.radius + 15) - 12;

                ctx.save();
                ctx.shadowColor = '#ffee00';
                ctx.shadowBlur = 8;
                ctx.font = 'bold 18px sans-serif';
                ctx.fillText('⭐', starX, starY);
                ctx.restore();
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
        // Shield absorbs damage first
        if (this.hasShield && this.shieldHP > 0) {
            const absorbed = Math.min(this.shieldHP, amount);
            this.shieldHP -= absorbed;
            amount -= absorbed;

            // Shield break particles
            if (this.shieldHP <= 0) {
                for (let i = 0; i < 25; i++) {
                    tankGame.particles.push(new Particle(this.x, this.y, '#64c8ff', 'spark'));
                }
                showNotification('🛡️ SHIELD BROKEN!');
            } else {
                for (let i = 0; i < 8; i++) {
                    tankGame.particles.push(new Particle(this.x, this.y, '#64c8ff', 'shield'));
                }
            }
        }

        this.hp -= amount;
        this.hitFlash = 1.0;

        // Damage number popup
        createDamageNumber(this.x, this.y, amount, this.isBoss);

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

// Continued in part 3...
console.log('[TankShooter-Pro] Enemy classes loaded (part 2)');
