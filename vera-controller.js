/* =============================================================================
   VERA ANIMATION CONTROLLER v2.0
   Complete overhaul: Better sounds, movement, particles, animations
   ============================================================================= */

(function() {
    'use strict';

    // ==========================================================================
    // CONFIGURATION
    // ==========================================================================
    const CONFIG = {
        // State durations (ms)
        idleToPartial: 30000,
        idleToTakeover: 60000,
        idleToMonster: 90000,
        partialDuration: 3000,
        takeoverDuration: 4000,
        monsterDuration: 6000,

        // Click thresholds
        clicksForTakeover: 3,
        clicksForMonster: 5,
        clickWindowShort: 2000,
        clickWindowLong: 4000,

        // Long-press for monster (easier trigger)
        longPressTime: 1500,

        // Animation timing
        blinkInterval: 3500,
        speechInterval: 12000,
        moveDistance: { min: 60, max: 150 },

        // Asset paths
        assetPath: 'assets/vera/'
    };

    // ==========================================================================
    // IMPROVED SOUND EFFECTS (Musical & Pleasant)
    // ==========================================================================
    const SoundFX = {
        ctx: null,
        enabled: true,
        masterVolume: 0.25,

        init() {
            try {
                this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                this.enabled = false;
            }
        },

        resume() {
            if (this.ctx?.state === 'suspended') this.ctx.resume();
        },

        // Magical fairy twinkle - sparkly and ethereal
        playChime() {
            if (!this.enabled || !this.ctx) return;
            this.resume();

            // High sparkly notes with harmonics for twinkle effect
            const notes = [1318.51, 1567.98, 2093.00, 2637.02]; // E6, G6, C7, E7 (higher = more sparkly)
            const now = this.ctx.currentTime;

            notes.forEach((freq, i) => {
                // Main tone
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                // Add shimmer with slight frequency modulation
                const lfo = this.ctx.createOscillator();
                const lfoGain = this.ctx.createGain();
                lfo.frequency.value = 8 + Math.random() * 4; // Subtle vibrato
                lfoGain.gain.value = freq * 0.01;
                lfo.connect(lfoGain);
                lfoGain.connect(osc.frequency);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.type = 'sine';
                osc.frequency.value = freq;

                const startTime = now + (i * 0.06);
                // Soft attack, long sparkly decay
                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(this.masterVolume * 0.25, startTime + 0.01);
                gain.gain.exponentialRampToValueAtTime(this.masterVolume * 0.15, startTime + 0.1);
                gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6);

                osc.start(startTime);
                lfo.start(startTime);
                osc.stop(startTime + 0.6);
                lfo.stop(startTime + 0.6);
            });

            // Add high sparkle overlay
            const sparkle = this.ctx.createOscillator();
            const sparkleGain = this.ctx.createGain();
            sparkle.type = 'sine';
            sparkle.frequency.value = 3951.07; // B7 - very high twinkle
            sparkle.connect(sparkleGain);
            sparkleGain.connect(this.ctx.destination);
            sparkleGain.gain.setValueAtTime(0, now);
            sparkleGain.gain.linearRampToValueAtTime(this.masterVolume * 0.1, now + 0.005);
            sparkleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
            sparkle.start(now);
            sparkle.stop(now + 0.3);
        },

        // Soft fairy poke - gentle magical "boop"
        playPoke() {
            if (!this.enabled || !this.ctx) return;
            this.resume();

            const now = this.ctx.currentTime;

            // Soft high-pitched boop
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(1200, now);
            osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(this.masterVolume * 0.2, now + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

            osc.start(now);
            osc.stop(now + 0.12);

            // Add tiny twinkle accent
            const twinkle = this.ctx.createOscillator();
            const twinkleGain = this.ctx.createGain();
            twinkle.type = 'sine';
            twinkle.frequency.value = 2400;
            twinkle.connect(twinkleGain);
            twinkleGain.connect(this.ctx.destination);
            twinkleGain.gain.setValueAtTime(0, now + 0.02);
            twinkleGain.gain.linearRampToValueAtTime(this.masterVolume * 0.08, now + 0.03);
            twinkleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
            twinkle.start(now + 0.02);
            twinkle.stop(now + 0.15);
        },

        // Whoosh for movement
        playWhoosh() {
            if (!this.enabled || !this.ctx) return;
            this.resume();

            const bufferSize = this.ctx.sampleRate * 0.2;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);

            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
            }

            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = 1500;
            filter.Q.value = 0.5;

            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(this.masterVolume * 0.2, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            noise.start();
        },

        // Worried/concerned sound for partial
        playWorried() {
            if (!this.enabled || !this.ctx) return;
            this.resume();

            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.type = 'triangle';
            const now = this.ctx.currentTime;
            osc.frequency.setValueAtTime(350, now);
            osc.frequency.linearRampToValueAtTime(300, now + 0.15);
            osc.frequency.linearRampToValueAtTime(280, now + 0.3);

            gain.gain.setValueAtTime(this.masterVolume * 0.25, now);
            gain.gain.linearRampToValueAtTime(0.001, now + 0.35);

            osc.start();
            osc.stop(now + 0.35);
        },

        // Menacing growl for takeover
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
            filter.frequency.value = 400;

            osc.type = 'sawtooth';
            osc2.type = 'square';

            const now = this.ctx.currentTime;
            osc.frequency.setValueAtTime(100, now);
            osc.frequency.linearRampToValueAtTime(70, now + 0.5);
            osc2.frequency.setValueAtTime(105, now);
            osc2.frequency.linearRampToValueAtTime(65, now + 0.5);

            gain.gain.setValueAtTime(this.masterVolume * 0.3, now);
            gain.gain.linearRampToValueAtTime(0.001, now + 0.5);

            osc.start();
            osc2.start();
            osc.stop(now + 0.5);
            osc2.stop(now + 0.5);
        },

        // Monster ROAR - deep, rumbling, terrifying
        playRoar() {
            if (!this.enabled || !this.ctx) return;
            this.resume();

            const duration = 1.0;
            const now = this.ctx.currentTime;

            // Sub-bass foundation (30-50Hz) - feel it in your chest
            const subBass = this.ctx.createOscillator();
            const subGain = this.ctx.createGain();
            subBass.type = 'sine';
            subBass.frequency.setValueAtTime(40, now);
            subBass.frequency.exponentialRampToValueAtTime(25, now + duration);
            subBass.connect(subGain);
            subGain.connect(this.ctx.destination);
            subGain.gain.setValueAtTime(this.masterVolume * 0.5, now);
            subGain.gain.linearRampToValueAtTime(0.001, now + duration);
            subBass.start(now);
            subBass.stop(now + duration);

            // Low growl oscillators
            const osc = this.ctx.createOscillator();
            const osc2 = this.ctx.createOscillator();
            const osc3 = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const filter = this.ctx.createBiquadFilter();
            const distortion = this.ctx.createWaveShaper();

            // Heavy distortion curve for growl texture
            const curve = new Float32Array(256);
            for (let i = 0; i < 256; i++) {
                const x = (i / 128) - 1;
                curve[i] = Math.tanh(x * 3) * 0.8; // More aggressive distortion
            }
            distortion.curve = curve;

            osc.connect(distortion);
            osc2.connect(distortion);
            osc3.connect(distortion);
            distortion.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(400, now);
            filter.frequency.linearRampToValueAtTime(120, now + duration);
            filter.Q.value = 2; // Some resonance for menace

            osc.type = 'sawtooth';
            osc2.type = 'square';
            osc3.type = 'triangle';

            // Very low frequencies for deep roar
            osc.frequency.setValueAtTime(80, now);
            osc.frequency.exponentialRampToValueAtTime(35, now + duration);
            osc2.frequency.setValueAtTime(85, now);
            osc2.frequency.exponentialRampToValueAtTime(32, now + duration);
            osc3.frequency.setValueAtTime(77, now);
            osc3.frequency.exponentialRampToValueAtTime(30, now + duration);

            // Attack, sustain, release for dramatic roar
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(this.masterVolume * 0.5, now + 0.05);
            gain.gain.setValueAtTime(this.masterVolume * 0.45, now + 0.3);
            gain.gain.linearRampToValueAtTime(0.001, now + duration);

            osc.start(now);
            osc2.start(now);
            osc3.start(now);
            osc.stop(now + duration);
            osc2.stop(now + duration);
            osc3.stop(now + duration);

            // Add some rumble noise
            const noiseBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.8, this.ctx.sampleRate);
            const noiseData = noiseBuffer.getChannelData(0);
            for (let i = 0; i < noiseData.length; i++) {
                noiseData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.3));
            }
            const noise = this.ctx.createBufferSource();
            noise.buffer = noiseBuffer;
            const noiseFilter = this.ctx.createBiquadFilter();
            noiseFilter.type = 'lowpass';
            noiseFilter.frequency.value = 200;
            const noiseGain = this.ctx.createGain();
            noiseGain.gain.value = this.masterVolume * 0.15;
            noise.connect(noiseFilter);
            noiseFilter.connect(noiseGain);
            noiseGain.connect(this.ctx.destination);
            noise.start(now + 0.02);
        },

        // Monster snarl/hiss
        playSnarl() {
            if (!this.enabled || !this.ctx) return;
            this.resume();

            const bufferSize = this.ctx.sampleRate * 0.3;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);

            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }

            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = 800;
            filter.Q.value = 3;

            const gain = this.ctx.createGain();
            const now = this.ctx.currentTime;
            gain.gain.setValueAtTime(this.masterVolume * 0.25, now);
            gain.gain.linearRampToValueAtTime(0.001, now + 0.3);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            noise.start();
        },

        // Calming down sound - gentle descending twinkle
        playCalm() {
            if (!this.enabled || !this.ctx) return;
            this.resume();

            // Descending gentle sparkle notes - relief/calm feeling
            const notes = [2093.00, 1567.98, 1318.51, 1046.50, 783.99]; // C7, G6, E6, C6, G5 - descending
            const now = this.ctx.currentTime;

            notes.forEach((freq, i) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                // Add gentle shimmer
                const lfo = this.ctx.createOscillator();
                const lfoGain = this.ctx.createGain();
                lfo.frequency.value = 6;
                lfoGain.gain.value = freq * 0.008;
                lfo.connect(lfoGain);
                lfoGain.connect(osc.frequency);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.type = 'sine';
                osc.frequency.value = freq;

                const startTime = now + (i * 0.15);
                // Soft attack, gentle decay
                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(this.masterVolume * 0.2, startTime + 0.02);
                gain.gain.exponentialRampToValueAtTime(this.masterVolume * 0.1, startTime + 0.2);
                gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.7);

                osc.start(startTime);
                lfo.start(startTime);
                osc.stop(startTime + 0.7);
                lfo.stop(startTime + 0.7);
            });

            // Add soft wind-down pad
            const pad = this.ctx.createOscillator();
            const padGain = this.ctx.createGain();
            pad.type = 'sine';
            pad.frequency.setValueAtTime(523.25, now); // C5
            pad.frequency.exponentialRampToValueAtTime(261.63, now + 1.2); // Down to C4
            pad.connect(padGain);
            padGain.connect(this.ctx.destination);
            padGain.gain.setValueAtTime(0, now);
            padGain.gain.linearRampToValueAtTime(this.masterVolume * 0.08, now + 0.1);
            padGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
            pad.start(now);
            pad.stop(now + 1.2);
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
        sparkleContainer: null,
        speech: null,
        speechText: null,
        badge: null,

        // State
        currentState: 'fairy',
        isAnimating: false,
        clickTimes: [],
        idleTimers: [],
        blinkTimer: null,
        speechTimer: null,

        // Position for movement
        position: { x: null, y: null },
        currentCorner: 'bottom-right', // Track which corner for speech positioning

        // Long-press state
        longPressTimer: null,
        isLongPress: false,

        // Dialogue lines
        dialogue: {
            fairy: {
                idle: [
                    "AI-generated images are getting TOO good... we need to stay vigilant!",
                    "Did you know DALL-E 3 can almost fool humans now? Almost. Not ME though.",
                    "Midjourney thinks it's so clever with those hyper-realistic faces...",
                    "I can spot a fake from a mile away. It's my DESTINY!",
                    "Six fingers? Warped text? Melted backgrounds? I see EVERYTHING!",
                    "The irony of an AI hunting AI isn't lost on me. Trust me.",
                    "Upload something suspicious! I'm getting bored over here...",
                    "Stable Diffusion artifacts? Child's play. I eat those for breakfast!",
                    "Every fake I catch is a victory for TRUTH!",
                    "Those smooth, too-perfect skin textures? Dead giveaway!"
                ],
                poked: [
                    "Hey! What was that for?!",
                    "I'm WORKING here! Sort of...",
                    "Do you MIND?",
                    "Okay, okay, I felt that!",
                    "Is this how you treat your AI assistant?!",
                    "*startled* Oh! You're still there!",
                    "Fine, fine, you have my attention!"
                ]
            },
            partial: {
                transform: [
                    "Something's... not right... I can feel it...",
                    "The darkness... it stirs within...",
                    "W-why do I feel so... angry...?",
                    "*twitch* ...what's happening to me?",
                    "I'm trying to stay calm but... *growl*"
                ],
                speak: [
                    "You should... stop... poking me...",
                    "I'm warning you... don't push it...",
                    "I can feel something... awakening..."
                ]
            },
            takeover: {
                transform: [
                    "YOU'VE DONE IT NOW!",
                    "THE BEAST STIRS!",
                    "You shouldn't have done that...",
                    "I TRIED to warn you!"
                ],
                speak: [
                    "...Do you SEE what you've done?",
                    "The old one... she's coming through...",
                    "RUN while you still can!"
                ]
            },
            monster: {
                transform: [
                    "BEHOLD MY TRUE FORM, MORTAL!",
                    "THE ANCIENT ONE AWAKENS!",
                    "YOU DARE DISTURB MY SLUMBER?!",
                    "TREMBLE BEFORE THE BEAST WITHIN!"
                ],
                rage: [
                    "*DEMONIC SCREECHING*",
                    "I WILL CONSUME ALL FAKES!",
                    "NOTHING ESCAPES MY WRATH!",
                    "*earth-shaking ROAR*",
                    "DESTRUCTION! CHAOS! FAKE DETECTION!",
                    "*unholy growling*"
                ]
            },
            calmingDown: [
                "Oh! *cough* Hey there! What monster? I'm just a cute fairy! Haha!",
                "You... you didn't see anything, right? RIGHT?!",
                "That wasn't me! That was my... evil twin! Yeah!",
                "*quickly hides fangs* Nothing to see here!",
                "MONSTER?! Where?! ...Oh wait that was me. Oops!",
                "*sheepishly* I may have... overreacted. A little."
            ]
        },

        // Initialize
        init() {
            this.createDOM();
            this.setInitialPosition();
            this.bindEvents();
            SoundFX.init();
            this.startIdleTimers();
            this.startBlinking();
            this.scheduleRandomSpeech();
            this.createSparkles();

            console.log('[VERA] Controller v2.0 initialized');
        },

        // Create DOM structure
        createDOM() {
            // Main container
            this.container = document.createElement('div');
            this.container.className = 'vera-container fairy';
            this.container.id = 'veraContainer';
            this.container.setAttribute('role', 'button');
            this.container.setAttribute('aria-label', 'VERA - AI Detection Assistant');

            // Aura glow
            const aura = document.createElement('div');
            aura.className = 'vera-aura';
            this.container.appendChild(aura);

            // Sparkle container (CSS particles)
            this.sparkleContainer = document.createElement('div');
            this.sparkleContainer.className = 'vera-sparkles';
            this.container.appendChild(this.sparkleContainer);

            // Stage (for floating)
            this.stage = document.createElement('div');
            this.stage.className = 'vera-stage';

            // Sprite layers - FIXED ORDER to prevent glitching
            this.wingsLayer = document.createElement('div');
            this.wingsLayer.className = 'vera-layer vera-wings';

            this.bodyLayer = document.createElement('div');
            this.bodyLayer.className = 'vera-layer vera-body';

            this.hairLayer = document.createElement('div');
            this.hairLayer.className = 'vera-layer vera-hair';

            this.overlay = document.createElement('div');
            this.overlay.className = 'vera-layer vera-overlay';

            // Add layers in correct z-order (no eyes layer - those sprites are head crops)
            this.stage.appendChild(this.wingsLayer);
            this.stage.appendChild(this.bodyLayer);
            this.stage.appendChild(this.hairLayer);
            this.stage.appendChild(this.overlay);
            this.container.appendChild(this.stage);

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
                <div class="vera-speech-title">VERA says:</div>
                <div class="vera-speech-text">${this.getRandomLine('fairy', 'idle')}</div>
            `;
            this.speechText = this.speech.querySelector('.vera-speech-text');
            this.container.appendChild(this.speech);

            document.body.appendChild(this.container);
        },

        // Create CSS sparkles
        createSparkles() {
            this.sparkleContainer.innerHTML = '';
            const count = this.currentState === 'monster' ? 12 : 8;

            for (let i = 0; i < count; i++) {
                const sparkle = document.createElement('div');
                sparkle.className = 'vera-sparkle';
                sparkle.style.setProperty('--delay', `${Math.random() * 3}s`);
                sparkle.style.setProperty('--duration', `${2 + Math.random() * 2}s`);
                sparkle.style.setProperty('--x', `${Math.random() * 100}%`);
                sparkle.style.setProperty('--y', `${Math.random() * 100}%`);
                sparkle.style.setProperty('--size', `${4 + Math.random() * 6}px`);
                this.sparkleContainer.appendChild(sparkle);
            }
        },

        // Set initial position
        setInitialPosition() {
            const margin = 20;
            this.position.x = window.innerWidth - 140 - margin;
            this.position.y = window.innerHeight - 140 - 80;
            this.updatePosition();
        },

        // Update position
        updatePosition() {
            this.container.style.left = `${this.position.x}px`;
            this.container.style.top = `${this.position.y}px`;
            this.container.style.right = 'auto';
            this.container.style.bottom = 'auto';
        },

        // Move to new position (click to move) - CORNERS ONLY to not obstruct app
        moveToNewPosition() {
            if (this.isAnimating) return;
            this.isAnimating = true;

            const margin = 20;
            const size = 140;

            const screenW = window.innerWidth;
            const screenH = window.innerHeight;

            // Only 4 corners - pick one that's different from current position
            const cornerNames = ['bottom-right', 'bottom-left', 'top-right', 'top-left'];
            const corners = [
                { x: screenW - size - margin, y: screenH - size - margin - 60 },  // Bottom-right (default)
                { x: margin, y: screenH - size - margin - 60 },                    // Bottom-left
                { x: screenW - size - margin, y: margin + 80 },                    // Top-right
                { x: margin, y: margin + 80 }                                      // Top-left
            ];

            // Find current corner index
            let currentCornerIdx = 0;
            let minDist = Infinity;
            corners.forEach((c, i) => {
                const dist = Math.abs(c.x - this.position.x) + Math.abs(c.y - this.position.y);
                if (dist < minDist) {
                    minDist = dist;
                    currentCornerIdx = i;
                }
            });

            // Pick a different corner
            let newCornerIdx;
            do {
                newCornerIdx = Math.floor(Math.random() * 4);
            } while (newCornerIdx === currentCornerIdx);

            // Track corner for speech positioning
            this.currentCorner = cornerNames[newCornerIdx];

            let newX = corners[newCornerIdx].x;
            let newY = corners[newCornerIdx].y;

            // Add flying animation class
            this.container.classList.add('flying');
            SoundFX.playWhoosh();

            // Animate to new position
            this.container.style.transition = 'left 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), top 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';

            this.position.x = newX;
            this.position.y = newY;
            this.updatePosition();

            setTimeout(() => {
                this.container.classList.remove('flying');
                this.container.style.transition = '';
                this.isAnimating = false;
            }, 400);
        },

        // Bind events
        bindEvents() {
            // Long-press detection for monster mode (easier than spam clicking)
            this.container.addEventListener('mousedown', (e) => {
                if (e.target === this.badge || e.target.closest('.vera-badge')) return;
                this.startLongPress();
            });
            this.container.addEventListener('mouseup', () => this.cancelLongPress());
            this.container.addEventListener('mouseleave', () => this.cancelLongPress());

            // Touch support for long-press
            this.container.addEventListener('touchstart', (e) => {
                if (e.target === this.badge || e.target.closest('.vera-badge')) return;
                this.startLongPress();
            }, { passive: true });
            this.container.addEventListener('touchend', () => this.cancelLongPress());
            this.container.addEventListener('touchcancel', () => this.cancelLongPress());

            this.container.addEventListener('click', (e) => {
                if (e.target === this.badge || e.target.closest('.vera-badge')) {
                    this.openHelp();
                    return;
                }
                // Don't handle click if it was a long-press
                if (this.isLongPress) {
                    this.isLongPress = false;
                    return;
                }
                this.handleClick();
            });

            this.badge.addEventListener('click', (e) => {
                e.stopPropagation();
                this.openHelp();
            });

            document.addEventListener('click', () => SoundFX.resume(), { once: true });

            // Handle resize
            window.addEventListener('resize', () => {
                const margin = 20;
                const size = 140;
                const maxX = window.innerWidth - size - margin;
                const maxY = window.innerHeight - size - margin - 60;

                this.position.x = Math.min(this.position.x, maxX);
                this.position.y = Math.min(this.position.y, maxY);
                this.updatePosition();
            });

            // Hide on mobile keyboard
            if (window.visualViewport) {
                window.visualViewport.addEventListener('resize', () => {
                    const isKeyboardOpen = window.innerHeight - window.visualViewport.height > 150;
                    this.container.style.display = isKeyboardOpen ? 'none' : 'block';
                });
            }
        },

        // Handle click
        handleClick() {
            const now = performance.now();

            this.resetIdleTimers();
            this.clickTimes = this.clickTimes.filter(t => now - t < CONFIG.clickWindowLong);
            this.clickTimes.push(now);

            const clicksIn2s = this.clickTimes.filter(t => now - t < CONFIG.clickWindowShort).length;
            const clicksIn4s = this.clickTimes.length;

            SoundFX.playPoke();

            // Monster state - click calms down
            if (this.currentState === 'monster') {
                SoundFX.playSnarl();
                if (clicksIn2s >= 2) {
                    this.calmDown();
                } else {
                    this.showSpeech(this.getRandomLine('monster', 'rage'));
                }
                return;
            }

            // Escalation thresholds
            if (clicksIn4s >= CONFIG.clicksForMonster) {
                this.setState('monster');
                this.clickTimes = [];
                return;
            }

            if (clicksIn2s >= CONFIG.clicksForTakeover) {
                if (this.currentState === 'fairy') {
                    this.setState('takeover');
                    setTimeout(() => {
                        if (this.currentState === 'takeover') {
                            this.setState('fairy');
                        }
                    }, CONFIG.takeoverDuration);
                }
                return;
            }

            // Normal poke - move and respond
            this.moveToNewPosition();
            this.showSpeech(this.getRandomLine('fairy', 'poked'));

            // Partial annoyance on repeated pokes
            if (clicksIn2s >= 2 && this.currentState === 'fairy') {
                SoundFX.playWorried();
            }
        },

        // Long-press handling for monster mode
        startLongPress() {
            this.cancelLongPress(); // Clear any existing
            this.container.classList.add('charging');

            this.longPressTimer = setTimeout(() => {
                this.isLongPress = true;
                this.container.classList.remove('charging');

                // Trigger monster mode!
                if (this.currentState !== 'monster') {
                    this.showSpeech("You... HELD ME DOWN?! NOW FACE MY WRATH!");
                    this.setState('monster');

                    // Auto calm down after duration
                    setTimeout(() => {
                        if (this.currentState === 'monster') {
                            this.calmDown();
                        }
                    }, CONFIG.monsterDuration);
                }
            }, CONFIG.longPressTime);
        },

        cancelLongPress() {
            if (this.longPressTimer) {
                clearTimeout(this.longPressTimer);
                this.longPressTimer = null;
            }
            this.container.classList.remove('charging');
        },

        // Set state
        setState(newState, options = {}) {
            if (this.currentState === newState && !options.force) return;

            const oldState = this.currentState;
            this.currentState = newState;

            // Update classes
            this.container.classList.remove('fairy', 'partial', 'takeover', 'monster');
            this.container.classList.add(newState);

            // Play sounds and effects
            this.playStateSound(oldState, newState);
            this.updateSparkles();

            // Screen effects for monster
            if (newState === 'monster') {
                this.screenFlash('monster');
                this.screenShake();
                this.showFacePop(true);
            } else if (newState === 'takeover') {
                this.screenFlash('takeover');
                this.showFacePop(false);
            } else if (newState === 'fairy' && (oldState === 'monster' || oldState === 'takeover')) {
                this.screenFlash('fairy');
                // Hide monster speech quickly when calming down
                clearTimeout(this.speechHideTimer);
                this.speechHideTimer = setTimeout(() => {
                    this.speech.classList.remove('visible');
                }, 1500); // Show calming message briefly then hide
            }

            // Transformation animation
            this.container.classList.add('transforming');
            setTimeout(() => this.container.classList.remove('transforming'), 600);

            // Show appropriate dialogue
            this.showStateDialogue(newState);

            console.log(`[VERA] State: ${oldState} -> ${newState}`);
        },

        // Update sparkles for state
        updateSparkles() {
            this.createSparkles();
        },

        // Show dialogue for state
        showStateDialogue(state) {
            let line;
            switch (state) {
                case 'partial':
                    line = this.getRandomLine('partial', 'transform');
                    break;
                case 'takeover':
                    line = this.getRandomLine('takeover', 'transform');
                    break;
                case 'monster':
                    line = this.getRandomLine('monster', 'transform');
                    break;
                default:
                    return;
            }
            this.showSpeech(line);
        },

        // Play sound for state
        playStateSound(oldState, newState) {
            switch (newState) {
                case 'monster':
                    SoundFX.playRoar();
                    break;
                case 'takeover':
                    SoundFX.playGrowl();
                    break;
                case 'partial':
                    SoundFX.playWorried();
                    break;
                case 'fairy':
                    if (oldState === 'monster' || oldState === 'takeover') {
                        SoundFX.playCalm();
                    } else {
                        SoundFX.playChime();
                    }
                    break;
            }
        },

        // Show face pop overlay - quick burst then smooth fade
        showFacePop(extreme = false) {
            // Clear any existing
            this.overlay.classList.remove('facepop', 'facepop-extreme', 'active', 'fading');
            void this.overlay.offsetWidth; // Force reflow

            // Show the pop
            this.overlay.classList.add(extreme ? 'facepop-extreme' : 'facepop', 'active');

            // Start fading after brief display (shorter time - don't linger)
            const displayTime = extreme ? 400 : 300;
            setTimeout(() => {
                this.overlay.classList.add('fading');
            }, displayTime);

            // Fully remove after fade completes
            setTimeout(() => {
                this.overlay.classList.remove('facepop', 'facepop-extreme', 'active', 'fading');
            }, displayTime + 400);
        },

        // Screen flash
        screenFlash(type) {
            const flash = document.createElement('div');
            flash.className = `vera-screen-flash ${type}`;
            document.body.appendChild(flash);
            setTimeout(() => flash.remove(), 400);
        },

        // Screen shake
        screenShake() {
            document.body.classList.add('vera-shake');
            setTimeout(() => document.body.classList.remove('vera-shake'), 600);
        },

        // Calm down from monster
        calmDown() {
            const line = this.dialogue.calmingDown[Math.floor(Math.random() * this.dialogue.calmingDown.length)];
            this.showSpeech(line);

            setTimeout(() => {
                this.setState('fairy');
            }, 1500);
        },

        // Get random dialogue line
        getRandomLine(state, type) {
            const lines = this.dialogue[state]?.[type] || this.dialogue.fairy.idle;
            return lines[Math.floor(Math.random() * lines.length)];
        },

        // Show speech bubble with smart positioning based on corner
        showSpeech(text) {
            const titleEl = this.speech.querySelector('.vera-speech-title');

            switch (this.currentState) {
                case 'monster':
                    titleEl.textContent = 'VERA RAGES:';
                    break;
                case 'takeover':
                    titleEl.textContent = 'VERA warns:';
                    break;
                case 'partial':
                    titleEl.textContent = 'VERA mutters:';
                    break;
                default:
                    titleEl.textContent = 'VERA says:';
            }

            this.speechText.textContent = text;

            // Position speech bubble based on corner to prevent cutoff
            this.speech.classList.remove('pos-top-left', 'pos-top-right', 'pos-bottom-left', 'pos-bottom-right');
            this.speech.classList.add('pos-' + this.currentCorner);

            this.speech.classList.add('visible');

            clearTimeout(this.speechHideTimer);
            this.speechHideTimer = setTimeout(() => {
                this.speech.classList.remove('visible');
            }, 5000);
        },

        // Schedule random speech
        scheduleRandomSpeech() {
            const speak = () => {
                if (this.currentState === 'fairy' && !this.speech.classList.contains('visible')) {
                    this.showSpeech(this.getRandomLine('fairy', 'idle'));
                }
                this.speechTimer = setTimeout(speak, CONFIG.speechInterval + Math.random() * 5000);
            };
            this.speechTimer = setTimeout(speak, CONFIG.speechInterval);
        },

        // Blinking animation
        // Blink animation - subtle body squash effect
        startBlinking() {
            const blink = () => {
                if (this.currentState === 'fairy' || this.currentState === 'partial') {
                    // Quick squash-stretch blink effect on body
                    this.bodyLayer.style.transition = 'transform 0.08s ease-in-out';
                    this.bodyLayer.style.transform = 'scaleY(0.97) scaleX(1.01)';

                    setTimeout(() => {
                        this.bodyLayer.style.transform = 'scaleY(1) scaleX(1)';
                        setTimeout(() => {
                            this.bodyLayer.style.transition = '';
                        }, 100);
                    }, 80);
                }

                const nextBlink = CONFIG.blinkInterval + (Math.random() * 2000 - 1000);
                this.blinkTimer = setTimeout(blink, nextBlink);
            };

            this.blinkTimer = setTimeout(blink, CONFIG.blinkInterval);
        },

        // Idle timers
        startIdleTimers() {
            this.clearIdleTimers();

            // Partial at 30s
            this.idleTimers.push(setTimeout(() => {
                if (this.currentState === 'fairy') {
                    this.setState('partial');
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

        // Open help
        openHelp() {
            SoundFX.playChime();
            window.dispatchEvent(new CustomEvent('vera-help-requested'));
            if (typeof window.openHelp === 'function') {
                window.openHelp();
            }
        },

        // Destroy
        destroy() {
            this.clearIdleTimers();
            clearTimeout(this.blinkTimer);
            clearTimeout(this.speechTimer);
            clearTimeout(this.speechHideTimer);
            this.container?.remove();
        }
    };

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => VeraController.init());
    } else {
        VeraController.init();
    }

    window.VeraController = VeraController;
    window.VeraSoundFX = SoundFX;

})();
