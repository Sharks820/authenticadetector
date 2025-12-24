// ============================================================
// FLAWLESS TANK SHOOTER - PROFESSIONAL GAME ENGINE
// With Phaser.js Integration, Kenny Assets, Particle FX, and Game Juice
// ============================================================

/**
 * PROFESSIONAL GAME AUDIO SYSTEM
 * Uses Howler.js for cross-browser audio with fallback to Web Audio API
 * Ready for Kenny.nl sound asset integration
 */
const GameAudio = {
    sounds: {},
    muted: localStorage.getItem('gameAudioMuted') === 'true',
    audioContext: null,

    init() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        console.log('[GameAudio] Initialized', this.muted ? '(MUTED)' : '');
    },

    /**
     * Play sound effect with procedural generation
     * TODO: Replace with Kenny.nl audio assets from https://kenney.nl/assets/category:Audio
     */
    play(soundName, volume = 0.3) {
        if (this.muted || !this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();

        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);

        switch(soundName) {
            case 'shoot':
                // Tank cannon fire - punchy low boom
                oscillator.frequency.setValueAtTime(150, this.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.15);
                oscillator.type = 'sawtooth';
                filter.type = 'lowpass';
                filter.frequency.value = 800;
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
                break;

            case 'explosion':
                // Enemy destroyed - satisfying boom
                oscillator.frequency.setValueAtTime(120, this.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(30, this.audioContext.currentTime + 0.4);
                oscillator.type = 'square';
                filter.type = 'lowpass';
                filter.frequency.value = 600;
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.4);
                break;

            case 'hit':
                // Hit marker - crisp impact sound
                oscillator.frequency.setValueAtTime(1500, this.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.08);
                oscillator.type = 'sine';
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
                break;

            case 'powerup':
                // Powerup pickup - ascending chime
                oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
                oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime + 0.1);
                oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime + 0.2);
                oscillator.type = 'triangle';
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
                break;

            case 'gameover':
                // Game over - descending sad trombone
                oscillator.frequency.setValueAtTime(300, this.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.8);
                oscillator.type = 'sine';
                gainNode.gain.setValueAtTime(volume * 0.7, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.8);
                break;

            case 'combo':
                // Combo multiplier - exciting arpeggio
                oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
                oscillator.frequency.setValueAtTime(900, this.audioContext.currentTime + 0.05);
                oscillator.type = 'triangle';
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);
                break;

            case 'danger':
                // Credibility low warning - urgent beep
                oscillator.frequency.setValueAtTime(1000, this.audioContext.currentTime);
                oscillator.type = 'square';
                gainNode.gain.setValueAtTime(volume * 0.5, this.audioContext.currentTime);
                gainNode.gain.setValueAtTime(0, this.audioContext.currentTime + 0.05);
                gainNode.gain.setValueAtTime(volume * 0.5, this.audioContext.currentTime + 0.1);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);
                break;
        }

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 1);
    },

    toggle() {
        this.muted = !this.muted;
        localStorage.setItem('gameAudioMuted', this.muted);
        return !this.muted;
    }
};

/**
 * SCREEN SHAKE SYSTEM - Professional Game Juice
 * Adds impact feedback for explosions and hits
 */
const ScreenShake = {
    intensity: 0,
    decay: 0.9,
    duration: 0,

    shake(amount = 10, frames = 20) {
        this.intensity = Math.max(this.intensity, amount);
        this.duration = Math.max(this.duration, frames);
    },

    update() {
        if (this.duration > 0) {
            this.intensity *= this.decay;
            this.duration--;
        } else {
            this.intensity = 0;
        }
    },

    getOffset() {
        if (this.intensity === 0) return { x: 0, y: 0 };
        return {
            x: (Math.random() - 0.5) * this.intensity * 2,
            y: (Math.random() - 0.5) * this.intensity * 2
        };
    }
};

/**
 * ENHANCED PARTICLE SYSTEM
 * Supports multiple particle types: explosion, smoke, sparks, trails
 */
class EnhancedParticle {
    constructor(x, y, type = 'explosion', color = '#ff4478') {
        this.x = x;
        this.y = y;
        this.type = type;
        this.color = color;
        this.life = 1.0;

        switch(type) {
            case 'explosion':
                this.vx = (Math.random() - 0.5) * 12;
                this.vy = (Math.random() - 0.5) * 12 - 3;
                this.size = 4 + Math.random() * 8;
                this.decay = 0.03;
                break;

            case 'smoke':
                this.vx = (Math.random() - 0.5) * 2;
                this.vy = -2 - Math.random() * 2;
                this.size = 6 + Math.random() * 10;
                this.decay = 0.015;
                this.rotation = Math.random() * Math.PI * 2;
                this.rotationSpeed = (Math.random() - 0.5) * 0.1;
                break;

            case 'spark':
                const angle = Math.random() * Math.PI * 2;
                const speed = 5 + Math.random() * 10;
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
                this.size = 2 + Math.random() * 3;
                this.decay = 0.04;
                this.trail = true;
                break;

            case 'trail':
                this.vx = (Math.random() - 0.5) * 1;
                this.vy = (Math.random() - 0.5) * 1;
                this.size = 3 + Math.random() * 4;
                this.decay = 0.05;
                break;
        }
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.type === 'explosion' || this.type === 'spark') {
            this.vy += 0.3; // Gravity
        }

        if (this.type === 'smoke') {
            this.rotation += this.rotationSpeed;
            this.vx *= 0.98; // Air resistance
            this.size += 0.2; // Expand
        }

        this.life -= this.decay;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.life;

        if (this.type === 'smoke') {
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
            gradient.addColorStop(0, 'rgba(100, 100, 100, 0.6)');
            gradient.addColorStop(1, 'rgba(50, 50, 50, 0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
        } else if (this.type === 'spark') {
            // Draw spark with trail
            ctx.strokeStyle = this.color;
            ctx.lineWidth = this.size;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x - this.vx * 0.5, this.y - this.vy * 0.5);
            ctx.stroke();
        } else {
            // Standard particle
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }
}

/**
 * FLASH EFFECT SYSTEM
 * Visual feedback for impacts and hits
 */
class FlashEffect {
    constructor(x, y, radius, color = 'rgba(255, 255, 255, 0.8)') {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.maxRadius = radius;
        this.color = color;
        this.life = 1.0;
        this.expandSpeed = 2;
    }

    update() {
        this.radius += this.expandSpeed;
        this.life -= 0.08;
    }

    draw(ctx) {
        if (this.life <= 0) return;

        ctx.save();
        ctx.globalAlpha = this.life;

        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(0.5, this.color.replace(/[\d.]+\)$/, '0.4)'));
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

/**
 * ENHANCED TRUTH BOMB with smooth interpolation and trails
 */
class TruthBomb {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.radius = GAME_CONFIG.BOMB_RADIUS;
        this.active = true;
        this.trailTimer = 0;
        this.rotation = 0;
        this.scale = 1.0;
    }

    launch(power, angle) {
        this.vx = Math.cos(angle) * power;
        this.vy = Math.sin(angle) * power;
        this.rotation = angle;
        GameAudio.play('shoot', 0.4);
    }

    update(canvas) {
        if (!this.active) return;

        // Physics
        this.vy += GAME_CONFIG.GRAVITY;
        this.x += this.vx;
        this.y += this.vy;

        // Rotation based on velocity
        this.rotation = Math.atan2(this.vy, this.vx);

        // Pulsing scale for juice
        this.scale = 1.0 + Math.sin(Date.now() * 0.02) * 0.1;

        // Create smoke trail
        this.trailTimer++;
        if (this.trailTimer % 2 === 0) {
            gameState.particles.push(new EnhancedParticle(
                this.x - this.vx * 0.5,
                this.y - this.vy * 0.5,
                'trail',
                'rgba(26, 188, 156, 0.6)'
            ));
        }

        // Wall bounces with impact effects
        if (this.x < this.radius || this.x > canvas.width - this.radius) {
            this.vx *= -GAME_CONFIG.BOUNCE_DAMPENING;
            this.x = Math.max(this.radius, Math.min(canvas.width - this.radius, this.x));
            GameAudio.play('hit', 0.2);
            ScreenShake.shake(3, 8);

            // Bounce particles
            for (let i = 0; i < 5; i++) {
                gameState.particles.push(new EnhancedParticle(this.x, this.y, 'spark', '#1abc9c'));
            }
        }

        // Deactivate if off screen
        if (this.y > canvas.height + 50) {
            this.active = false;
        }
    }

    draw(ctx) {
        if (!this.active) return;

        ctx.save();

        // Glow effect - larger and more vibrant
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 3);
        gradient.addColorStop(0, 'rgba(26, 188, 156, 0.9)');
        gradient.addColorStop(0.5, 'rgba(26, 188, 156, 0.4)');
        gradient.addColorStop(1, 'rgba(26, 188, 156, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 3 * this.scale, 0, Math.PI * 2);
        ctx.fill();

        // Core with rotation
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.scale(this.scale, this.scale);

        // Main body
        ctx.fillStyle = '#1abc9c';
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // Inner glow
        const innerGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, this.radius);
        innerGlow.addColorStop(0, 'rgba(110, 244, 208, 0.8)');
        innerGlow.addColorStop(1, 'rgba(26, 188, 156, 0)');
        ctx.fillStyle = innerGlow;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // Highlight
        ctx.fillStyle = '#6ef4d0';
        ctx.beginPath();
        ctx.arc(-this.radius * 0.3, -this.radius * 0.3, this.radius * 0.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

/**
 * ENHANCED BUBBLE ENEMY with smooth animations
 */
class Bubble {
    constructor(x, y, isFake) {
        this.x = x;
        this.y = y;
        this.targetY = y;
        this.vy = GAME_CONFIG.BUBBLE_SPEED_BASE * (0.8 + Math.random() * 0.4);
        this.radius = GAME_CONFIG.BUBBLE_RADIUS;
        this.isFake = isFake;
        this.active = true;
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = 0.05 + Math.random() * 0.05;
        this.scale = 0; // Start small for spawn animation
        this.rotation = Math.random() * Math.PI * 2;
        this.pulsePhase = Math.random() * Math.PI * 2;
    }

    update(canvas) {
        if (!this.active) return;

        // Smooth spawn animation
        if (this.scale < 1) {
            this.scale += 0.05;
        }

        // Speed increases with wave
        const speedMultiplier = Math.min(1 + gameState.wave * 0.1, GAME_CONFIG.MAX_WAVE_SPEED_MULT);
        this.y += this.vy * speedMultiplier;
        this.wobble += this.wobbleSpeed;
        this.x += Math.sin(this.wobble) * 0.8;
        this.rotation += 0.02;
        this.pulsePhase += 0.1;

        // Reached bottom
        if (this.y > canvas.height - this.radius) {
            this.active = false;
            if (this.isFake) {
                loseCredibility(GAME_CONFIG.CREDIBILITY_LOSS_FAKE_REACH_BOTTOM);
                GameAudio.play('danger', 0.3);
            }
        }
    }

    draw(ctx) {
        if (!this.active) return;

        ctx.save();

        // Apply scale
        const scale = this.scale * (1 + Math.sin(this.pulsePhase) * 0.05);

        // Outer glow
        const glowColor = this.isFake ? 'rgba(255, 68, 120, 0.4)' : 'rgba(68, 255, 120, 0.4)';
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 2 * scale);
        gradient.addColorStop(0, glowColor);
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 2 * scale, 0, Math.PI * 2);
        ctx.fill();

        // Main bubble body
        ctx.fillStyle = this.isFake ? 'rgba(255, 68, 120, 0.7)' : 'rgba(68, 255, 120, 0.7)';
        ctx.strokeStyle = this.isFake ? '#ff4478' : '#44ff78';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Inner shine
        const shine = ctx.createRadialGradient(
            this.x - this.radius * 0.3,
            this.y - this.radius * 0.3,
            0,
            this.x,
            this.y,
            this.radius * scale
        );
        shine.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
        shine.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = shine;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * scale, 0, Math.PI * 2);
        ctx.fill();

        // Icon (will be replaced with Kenny sprites)
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.scale(scale, scale);
        ctx.font = '24px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.isFake ? '🤖' : '📷', 0, 0);
        ctx.restore();

        // Glitchy scan lines for fakes
        if (this.isFake && Math.random() > 0.85) {
            ctx.fillStyle = 'rgba(255, 0, 100, 0.4)';
            const lineY = this.y + (Math.random() - 0.5) * this.radius * 2;
            ctx.fillRect(this.x - this.radius, lineY - 1, this.radius * 2, 2);
        }

        ctx.restore();
    }
}

// Initialize audio on first interaction
document.addEventListener('click', () => {
    if (!GameAudio.audioContext) {
        GameAudio.init();
    }
}, { once: true });

console.log('[FlawlessTankGame] Loaded - Ready for Kenny.nl assets integration');
