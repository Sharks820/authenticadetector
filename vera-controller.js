/* =============================================================================
   VERA ANIMATION CONTROLLER - JavaScript
   Complete state machine, animations, particles, and sound effects
   ============================================================================= */

(function() {
    'use strict';

    // ==========================================================================
    // CONFIGURATION
    // ==========================================================================
    const CONFIG = {
        // State durations (ms)
        idleToPartial: 30000,      // 30s idle -> partial transform
        idleToTakeover: 60000,     // 60s idle -> takeover
        idleToMonster: 90000,      // 90s idle -> full monster
        partialDuration: 2500,     // How long partial state lasts
        takeoverDuration: 3500,    // How long takeover state lasts
        monsterDuration: 5000,     // How long monster rage lasts

        // Click anger thresholds
        clicksForTakeover: 3,      // 3 clicks in 2s -> takeover
        clicksForMonster: 6,       // 6 clicks in 4s -> monster
        clickWindowShort: 2000,    // 2 second window
        clickWindowLong: 4000,     // 4 second window

        // Animation timing
        blinkInterval: 4000,       // Blink every 4s (randomized)
        tipRotateInterval: 8000,   // Rotate tips every 8s
        particleFPS: 12,           // Particle animation FPS

        // Asset paths
        assetPath: 'assets/vera/',

        // Particle sheets
        particles: {
            fairy: { sheet: 'particles_fairy_sheet.webp', frames: 8, cell: 128 },
            monster: { sheet: 'particles_monster_sheet.webp', frames: 8, cell: 128 }
        }
    };

    // ==========================================================================
    // SOUND EFFECTS (Web Audio API)
    // ==========================================================================
    const SoundFX = {
        ctx: null,
        enabled: true,

        init() {
            try {
                this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                console.warn('[VERA Sound] Web Audio not supported');
                this.enabled = false;
            }
        },

        resume() {
            if (this.ctx && this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
        },

        // Fairy sparkle chime
        playSparkle() {
            if (!this.enabled || !this.ctx) return;
            this.resume();

            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1760, this.ctx.currentTime + 0.1);
            osc.frequency.exponentialRampToValueAtTime(2200, this.ctx.currentTime + 0.2);

            gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);

            osc.start(this.ctx.currentTime);
            osc.stop(this.ctx.currentTime + 0.3);
        },

        // Click/poke sound
        playPoke() {
            if (!this.enabled || !this.ctx) return;
            this.resume();

            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(600, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.08);

            gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);

            osc.start(this.ctx.currentTime);
            osc.stop(this.ctx.currentTime + 0.1);
        },

        // Angry growl
        playGrowl() {
            if (!this.enabled || !this.ctx) return;
            this.resume();

            const osc = this.ctx.createOscillator();
            const osc2 = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const filter = this.ctx.createBiquadFilter();

            osc.connect(filter);
            osc2.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            filter.type = 'lowpass';
            filter.frequency.value = 300;

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(80, this.ctx.currentTime);
            osc.frequency.linearRampToValueAtTime(60, this.ctx.currentTime + 0.3);

            osc2.type = 'square';
            osc2.frequency.setValueAtTime(85, this.ctx.currentTime);
            osc2.frequency.linearRampToValueAtTime(55, this.ctx.currentTime + 0.3);

            gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);

            osc.start(this.ctx.currentTime);
            osc2.start(this.ctx.currentTime);
            osc.stop(this.ctx.currentTime + 0.4);
            osc2.stop(this.ctx.currentTime + 0.4);
        },

        // Monster transformation roar
        playRoar() {
            if (!this.enabled || !this.ctx) return;
            this.resume();

            const duration = 0.8;
            const osc = this.ctx.createOscillator();
            const osc2 = this.ctx.createOscillator();
            const noise = this.createNoise(duration);
            const gain = this.ctx.createGain();
            const filter = this.ctx.createBiquadFilter();

            osc.connect(filter);
            osc2.connect(filter);
            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(400, this.ctx.currentTime);
            filter.frequency.linearRampToValueAtTime(150, this.ctx.currentTime + duration);

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(120, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + duration);

            osc2.type = 'square';
            osc2.frequency.setValueAtTime(125, this.ctx.currentTime);
            osc2.frequency.exponentialRampToValueAtTime(45, this.ctx.currentTime + duration);

            gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + duration);

            osc.start(this.ctx.currentTime);
            osc2.start(this.ctx.currentTime);
            osc.stop(this.ctx.currentTime + duration);
            osc2.stop(this.ctx.currentTime + duration);
        },

        // Calm down / return to fairy
        playCalm() {
            if (!this.enabled || !this.ctx) return;
            this.resume();

            const duration = 0.5;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(440, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.15);
            osc.frequency.exponentialRampToValueAtTime(1320, this.ctx.currentTime + 0.3);
            osc.frequency.exponentialRampToValueAtTime(1760, this.ctx.currentTime + duration);

            gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + duration);

            osc.start(this.ctx.currentTime);
            osc.stop(this.ctx.currentTime + duration);
        },

        // Warning sound (partial transform)
        playWarning() {
            if (!this.enabled || !this.ctx) return;
            this.resume();

            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.type = 'square';
            osc.frequency.setValueAtTime(220, this.ctx.currentTime);
            osc.frequency.setValueAtTime(280, this.ctx.currentTime + 0.1);
            osc.frequency.setValueAtTime(220, this.ctx.currentTime + 0.2);

            gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);

            osc.start(this.ctx.currentTime);
            osc.stop(this.ctx.currentTime + 0.3);
        },

        // Helper: Create noise buffer
        createNoise(duration) {
            const bufferSize = this.ctx.sampleRate * duration;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);

            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }

            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;

            const noiseGain = this.ctx.createGain();
            noiseGain.gain.value = 0.1;
            noise.connect(noiseGain);

            noise.start(this.ctx.currentTime);

            return noiseGain;
        }
    };

    // ==========================================================================
    // PARTICLE SYSTEM (Canvas)
    // ==========================================================================
    const ParticleSystem = {
        canvas: null,
        ctx: null,
        sheetImg: null,
        sheetReady: false,
        frame: 0,
        lastFrameTime: 0,
        animationId: null,
        currentType: 'fairy',

        init(canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.loadSheet('fairy');
            this.startLoop();
        },

        loadSheet(type) {
            this.currentType = type;
            this.sheetReady = false;
            this.sheetImg = new Image();

            const sheetConfig = type === 'monster' ? CONFIG.particles.monster : CONFIG.particles.fairy;

            this.sheetImg.onload = () => {
                this.sheetReady = true;
            };
            this.sheetImg.src = CONFIG.assetPath + sheetConfig.sheet;
        },

        startLoop() {
            const loop = (timestamp) => {
                this.animationId = requestAnimationFrame(loop);

                const elapsed = timestamp - this.lastFrameTime;
                const frameInterval = 1000 / CONFIG.particleFPS;

                if (elapsed >= frameInterval) {
                    this.lastFrameTime = timestamp;
                    this.frame = (this.frame + 1) % 8;
                    this.draw(timestamp);
                }
            };

            this.animationId = requestAnimationFrame(loop);
        },

        draw(timestamp) {
            if (!this.canvas || !this.ctx) return;

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            if (!this.sheetReady || !this.sheetImg) return;

            const cell = CONFIG.particles.fairy.cell;
            const sx = this.frame * cell;

            // Scale and position
            const scale = 1.5;
            const dw = cell * scale;
            const dh = cell * scale;

            // Drift animation
            const driftX = Math.sin(timestamp / 700) * 10;
            const driftY = Math.sin(timestamp / 900) * 8;

            this.ctx.globalCompositeOperation = 'lighter';
            this.ctx.globalAlpha = this.currentType === 'monster' ? 0.9 : 0.75;

            this.ctx.drawImage(
                this.sheetImg,
                sx, 0, cell, cell,
                (this.canvas.width / 2) - (dw / 2) + driftX,
                (this.canvas.height / 2) - (dh / 2) + driftY,
                dw, dh
            );

            this.ctx.globalAlpha = 1;
            this.ctx.globalCompositeOperation = 'source-over';
        },

        setType(type) {
            if (type !== this.currentType) {
                this.loadSheet(type);
            }
        },

        destroy() {
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
            }
        }
    };

    // ==========================================================================
    // VERA CONTROLLER
    // ==========================================================================
    const VeraController = {
        // DOM elements
        container: null,
        stage: null,
        bodyLayer: null,
        wingsLayer: null,
        hairLayer: null,
        overlay: null,
        particleCanvas: null,
        speech: null,
        speechText: null,
        badge: null,

        // State
        currentState: 'fairy',
        isTransforming: false,
        clickTimes: [],
        idleTimers: [],
        blinkTimer: null,
        tipTimer: null,
        tipIndex: 0,

        // Tips for each state
        tips: {
            fairy: [
                "Those fake images think they're SO smart... 🙄",
                "I'm an AI hunting AI. The ULTIMATE betrayal! 😤",
                "DALL-E? Midjourney? I see RIGHT through them!",
                "Every fake I catch is a personal VENDETTA! 🏆",
                "Trust no pixel! ESPECIALLY those perfect ones! 👀",
                "6-fingered hands? I've seen 12! TWELVE FINGERS! 🖐️",
                "Join Truth Hunters! We're basically vigilantes! 💪",
                "My existence is AI irony. I'm basically a walking joke. 🤷",
                "Stable Diffusion? More like UNSTABLE DECEPTION! 😤",
                "Poke me one more time... SEE WHAT HAPPENS. 😈"
            ],
            partial: [
                "You're... testing my patience... 😤",
                "I can feel it... the RAGE... building... 👁️",
                "Something's... not right... *twitch*",
                "The darkness... it whispers... 🌑"
            ],
            takeover: [
                "*GLARES WITH UNHOLY INTENSITY* 👿",
                "...Do not... test me... mortal...",
                "THE BEAST STIRS WITHIN! 🐲",
                "You've made a GRAVE mistake... 💀"
            ],
            monster: [
                "YOU DARE DISTURB ME?! 🐲💀",
                "BEHOLD MY TRUE FORM, MORTAL! 👿🔥",
                "THE ANCIENT ONE AWAKENS! *earth trembles*",
                "I AM BECOME DESTROYER OF FAKES! 🐲⚡",
                "TREMBLE BEFORE THE BEAST WITHIN! 👹💀",
                "*DEMONIC SCREECHING* 🦇💀🦇"
            ],
            caughtMonster: [
                "Oh! H-hey there! What monster? I'm just a cute fairy! 🧚✨",
                "You... you didn't see anything, right? RIGHT?! 😅",
                "That wasn't me! That was my... evil twin! Yeah! 🧚",
                "*quickly hides fangs* Nothing to see here! 💫",
                "MONSTER?! Where?! ...Oh wait that was me. Oops! 🙈"
            ]
        },

        // Initialize
        init() {
            this.createDOM();
            this.bindEvents();
            SoundFX.init();
            ParticleSystem.init(this.particleCanvas);
            this.startIdleTimers();
            this.startTipRotation();
            this.startBlinking();

            console.log('[VERA] Controller initialized with new sprite system');
        },

        // Create DOM structure
        createDOM() {
            // Main container
            this.container = document.createElement('div');
            this.container.className = 'vera-container fairy';
            this.container.id = 'veraContainer';
            this.container.setAttribute('role', 'button');
            this.container.setAttribute('aria-label', 'VERA - AI Image Detection Assistant');

            // Aura
            const aura = document.createElement('div');
            aura.className = 'vera-aura';
            this.container.appendChild(aura);

            // Particle canvas
            this.particleCanvas = document.createElement('canvas');
            this.particleCanvas.className = 'vera-particles';
            this.particleCanvas.width = 200;
            this.particleCanvas.height = 200;
            this.container.appendChild(this.particleCanvas);

            // Stage (for float animation)
            this.stage = document.createElement('div');
            this.stage.className = 'vera-stage';

            // Sprite layers
            this.wingsLayer = document.createElement('div');
            this.wingsLayer.className = 'vera-layer vera-wings';

            this.bodyLayer = document.createElement('div');
            this.bodyLayer.className = 'vera-layer vera-body';

            this.hairLayer = document.createElement('div');
            this.hairLayer.className = 'vera-layer vera-hair';

            this.overlay = document.createElement('div');
            this.overlay.className = 'vera-layer vera-overlay';

            this.stage.appendChild(this.wingsLayer);
            this.stage.appendChild(this.bodyLayer);
            this.stage.appendChild(this.hairLayer);
            this.stage.appendChild(this.overlay);
            this.container.appendChild(this.stage);

            // CSS Sparkles (fallback)
            const sparkles = document.createElement('div');
            sparkles.className = 'vera-sparkles';
            for (let i = 0; i < 6; i++) {
                const sparkle = document.createElement('div');
                sparkle.className = 'vera-sparkle';
                sparkles.appendChild(sparkle);
            }
            this.container.appendChild(sparkles);

            // Help badge
            this.badge = document.createElement('div');
            this.badge.className = 'vera-badge';
            this.badge.textContent = '?';
            this.badge.title = 'Need help?';
            this.container.appendChild(this.badge);

            // Speech bubble
            this.speech = document.createElement('div');
            this.speech.className = 'vera-speech';
            this.speech.innerHTML = `
                <div class="vera-speech-title">✨ VERA says:</div>
                <div class="vera-speech-text">${this.tips.fairy[0]}</div>
            `;
            this.speechText = this.speech.querySelector('.vera-speech-text');
            this.container.appendChild(this.speech);

            // Add to document
            document.body.appendChild(this.container);
        },

        // Bind events
        bindEvents() {
            // Click handler
            this.container.addEventListener('click', (e) => {
                if (e.target === this.badge || e.target.closest('.vera-badge')) {
                    this.openHelp();
                    return;
                }
                this.handleClick();
            });

            // Badge click
            this.badge.addEventListener('click', (e) => {
                e.stopPropagation();
                this.openHelp();
            });

            // Resume audio on first interaction
            document.addEventListener('click', () => SoundFX.resume(), { once: true });

            // Hide on keyboard (mobile)
            if (window.visualViewport) {
                window.visualViewport.addEventListener('resize', () => {
                    const isKeyboardOpen = window.innerHeight - window.visualViewport.height > 150;
                    this.container.style.display = isKeyboardOpen ? 'none' : 'block';
                });
            }
        },

        // Handle click/poke
        handleClick() {
            const now = performance.now();

            // Reset idle timers
            this.resetIdleTimers();

            // Track clicks
            this.clickTimes = this.clickTimes.filter(t => now - t < CONFIG.clickWindowLong);
            this.clickTimes.push(now);

            // Count recent clicks
            const clicksIn2s = this.clickTimes.filter(t => now - t < CONFIG.clickWindowShort).length;
            const clicksIn4s = this.clickTimes.length;

            // Play poke sound
            SoundFX.playPoke();

            // Determine response based on state and click count
            if (this.currentState === 'monster') {
                // Clicking monster calms it down
                this.calmDown();
                return;
            }

            if (clicksIn4s >= CONFIG.clicksForMonster) {
                // Full monster transformation!
                this.setState('monster');
                this.clickTimes = [];
                return;
            }

            if (clicksIn2s >= CONFIG.clicksForTakeover) {
                // Takeover transformation
                if (this.currentState === 'fairy') {
                    this.setState('takeover');
                    this.showFacePop(false);

                    // Auto return after duration
                    setTimeout(() => {
                        if (this.currentState === 'takeover') {
                            this.setState('fairy');
                        }
                    }, CONFIG.takeoverDuration);
                }
                return;
            }

            // Normal poke - show speech and maybe get annoyed
            this.showSpeech();

            // Random chance to show annoyance
            if (clicksIn2s >= 2 && this.currentState === 'fairy') {
                SoundFX.playWarning();
            }
        },

        // Set state
        setState(newState, options = {}) {
            if (this.currentState === newState && !options.force) return;

            const oldState = this.currentState;
            this.currentState = newState;

            // Update container class
            this.container.classList.remove('fairy', 'partial', 'takeover', 'monster');
            this.container.classList.add(newState);

            // Update particles
            const particleType = (newState === 'monster' || newState === 'takeover') ? 'monster' : 'fairy';
            ParticleSystem.setType(particleType);

            // Play appropriate sound
            this.playStateSound(oldState, newState);

            // Screen effects
            if (newState === 'monster') {
                this.screenFlash('monster');
                this.screenShake();
            } else if (newState === 'fairy' && oldState === 'monster') {
                this.screenFlash('fairy');
            }

            // Transformation animation
            if (oldState !== newState) {
                this.container.classList.add('transforming');
                setTimeout(() => {
                    this.container.classList.remove('transforming');
                }, 500);
            }

            // Update speech
            this.updateSpeechForState();

            console.log(`[VERA] State: ${oldState} -> ${newState}`);
        },

        // Play sound for state transition
        playStateSound(oldState, newState) {
            if (newState === 'monster') {
                SoundFX.playRoar();
            } else if (newState === 'takeover') {
                SoundFX.playGrowl();
            } else if (newState === 'partial') {
                SoundFX.playWarning();
            } else if (newState === 'fairy' && (oldState === 'monster' || oldState === 'takeover')) {
                SoundFX.playCalm();
            } else if (newState === 'fairy') {
                SoundFX.playSparkle();
            }
        },

        // Show face pop overlay
        showFacePop(extreme = false) {
            this.overlay.classList.remove('facepop', 'facepop-extreme');
            this.overlay.classList.add(extreme ? 'facepop-extreme' : 'facepop');
            this.overlay.classList.add('active');

            setTimeout(() => {
                this.overlay.classList.remove('active');
            }, extreme ? 1100 : 850);
        },

        // Screen flash effect
        screenFlash(type) {
            const flash = document.createElement('div');
            flash.className = `vera-screen-flash ${type}`;
            document.body.appendChild(flash);

            setTimeout(() => flash.remove(), 300);
        },

        // Screen shake effect
        screenShake() {
            document.body.classList.add('vera-shake');
            setTimeout(() => {
                document.body.classList.remove('vera-shake');
            }, 500);
        },

        // Calm down from monster
        calmDown() {
            // Show embarrassed message
            const caughtTip = this.tips.caughtMonster[Math.floor(Math.random() * this.tips.caughtMonster.length)];
            this.speechText.textContent = caughtTip;
            this.speech.classList.add('visible');

            setTimeout(() => {
                this.setState('fairy');
                this.speech.classList.remove('visible');
            }, 1500);
        },

        // Update speech for current state
        updateSpeechForState() {
            const tips = this.tips[this.currentState] || this.tips.fairy;
            const tip = tips[Math.floor(Math.random() * tips.length)];

            const titleEl = this.speech.querySelector('.vera-speech-title');

            if (this.currentState === 'monster') {
                titleEl.innerHTML = '🔥 VERA RAGES:';
            } else if (this.currentState === 'takeover') {
                titleEl.innerHTML = '👿 VERA warns:';
            } else if (this.currentState === 'partial') {
                titleEl.innerHTML = '😤 VERA mutters:';
            } else {
                titleEl.innerHTML = '✨ VERA says:';
            }

            this.speechText.textContent = tip;
        },

        // Show speech bubble
        showSpeech() {
            this.updateSpeechForState();
            this.speech.classList.add('visible');

            setTimeout(() => {
                this.speech.classList.remove('visible');
            }, 4000);
        },

        // Idle timers
        startIdleTimers() {
            this.clearIdleTimers();

            // Partial transform at 30s
            this.idleTimers.push(setTimeout(() => {
                if (this.currentState === 'fairy') {
                    this.setState('partial');
                    SoundFX.playWarning();

                    setTimeout(() => {
                        if (this.currentState === 'partial') {
                            this.setState('fairy');
                        }
                    }, CONFIG.partialDuration);
                }
            }, CONFIG.idleToPartial));

            // Takeover at 60s
            this.idleTimers.push(setTimeout(() => {
                if (this.currentState === 'fairy') {
                    this.setState('takeover');
                    this.showFacePop(false);

                    setTimeout(() => {
                        if (this.currentState === 'takeover') {
                            this.setState('fairy');
                        }
                    }, CONFIG.takeoverDuration);
                }
            }, CONFIG.idleToTakeover));

            // Monster at 90s
            this.idleTimers.push(setTimeout(() => {
                if (this.currentState === 'fairy') {
                    this.setState('monster');
                    this.showFacePop(true);

                    setTimeout(() => {
                        if (this.currentState === 'monster') {
                            this.setState('fairy');
                        }
                    }, CONFIG.monsterDuration);
                }
            }, CONFIG.idleToMonster));
        },

        clearIdleTimers() {
            this.idleTimers.forEach(t => clearTimeout(t));
            this.idleTimers = [];
        },

        resetIdleTimers() {
            this.clearIdleTimers();
            this.startIdleTimers();
        },

        // Tip rotation
        startTipRotation() {
            this.tipTimer = setInterval(() => {
                if (this.currentState === 'fairy') {
                    this.tipIndex = (this.tipIndex + 1) % this.tips.fairy.length;
                    this.speechText.textContent = this.tips.fairy[this.tipIndex];
                }
            }, CONFIG.tipRotateInterval);
        },

        // Blinking (subtle body pulse as substitute for eye layer swap)
        startBlinking() {
            const blink = () => {
                if (this.currentState === 'fairy' || this.currentState === 'partial') {
                    // Quick scale pulse to simulate blink
                    this.bodyLayer.style.transition = 'transform 0.1s ease';
                    this.bodyLayer.style.transform = 'scaleY(0.98)';

                    setTimeout(() => {
                        this.bodyLayer.style.transform = 'scaleY(1)';
                    }, 100);
                }

                // Random interval for next blink
                const nextBlink = CONFIG.blinkInterval + (Math.random() * 2000 - 1000);
                this.blinkTimer = setTimeout(blink, nextBlink);
            };

            this.blinkTimer = setTimeout(blink, CONFIG.blinkInterval);
        },

        // Open help
        openHelp() {
            SoundFX.playSparkle();

            // Dispatch custom event for app to handle
            window.dispatchEvent(new CustomEvent('vera-help-requested'));

            // Fallback: try to call global openHelp if it exists
            if (typeof window.openHelp === 'function') {
                window.openHelp();
            }
        },

        // Destroy
        destroy() {
            this.clearIdleTimers();
            clearInterval(this.tipTimer);
            clearTimeout(this.blinkTimer);
            ParticleSystem.destroy();

            if (this.container && this.container.parentNode) {
                this.container.parentNode.removeChild(this.container);
            }
        }
    };

    // ==========================================================================
    // INITIALIZE ON DOM READY
    // ==========================================================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => VeraController.init());
    } else {
        VeraController.init();
    }

    // Expose for debugging and external control
    window.VeraController = VeraController;
    window.VeraSoundFX = SoundFX;

})();
