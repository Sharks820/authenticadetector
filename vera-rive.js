/* =============================================================================
   VERA RIVE ANIMATION CONTROLLER
   Uses Rive for professional bone-rigged animations
   Falls back to CSS if .riv file not available
   ============================================================================= */

(function() {
    'use strict';

    const VeraRive = {
        // Rive instances for each state
        instances: {},
        canvas: null,
        currentState: 'fairy',
        isRiveLoaded: false,

        // Asset paths - UPDATE THESE when you export from Rive
        assets: {
            fairy: 'assets/vera/vera_fairy.riv',
            partial: 'assets/vera/vera_partial.riv',
            takeover: 'assets/vera/vera_takeover.riv',
            monster: 'assets/vera/vera_monster.riv'
        },

        // State machine names (set these up in Rive editor)
        stateMachines: {
            fairy: 'FairyStateMachine',
            partial: 'PartialStateMachine',
            takeover: 'TakeoverStateMachine',
            monster: 'MonsterStateMachine'
        },

        // Animation names within state machines
        animations: {
            idle: 'Idle',
            flap: 'WingFlap',
            hairSway: 'HairSway',
            float: 'Float',
            blink: 'Blink',
            angry: 'Angry',
            rage: 'Rage'
        },

        // Initialize Rive for VERA
        async init() {
            // Check if Rive runtime is loaded
            if (typeof rive === 'undefined') {
                console.warn('[VERA Rive] Rive runtime not loaded, using CSS fallback');
                return false;
            }

            // Create canvas for Rive
            this.createCanvas();

            // Try to load the fairy state first
            const loaded = await this.loadState('fairy');

            if (loaded) {
                this.isRiveLoaded = true;
                this.hideCSSlayers();
                console.log('[VERA Rive] Rive animation loaded successfully!');
                return true;
            } else {
                console.warn('[VERA Rive] Could not load .riv file, using CSS fallback');
                return false;
            }
        },

        // Create canvas element for Rive
        createCanvas() {
            const container = document.getElementById('veraContainer');
            if (!container) {
                console.error('[VERA Rive] Container not found');
                return;
            }

            // Check if canvas already exists
            if (this.canvas) return;

            this.canvas = document.createElement('canvas');
            this.canvas.id = 'veraRiveCanvas';
            this.canvas.className = 'vera-rive-canvas';
            this.canvas.width = 280;  // 2x for retina
            this.canvas.height = 280;
            this.canvas.style.cssText = `
                position: absolute;
                inset: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 5;
            `;

            // Insert before the stage
            const stage = container.querySelector('.vera-stage');
            if (stage) {
                container.insertBefore(this.canvas, stage);
            } else {
                container.appendChild(this.canvas);
            }
        },

        // Hide CSS sprite layers when using Rive
        hideCSSlayers() {
            const container = document.getElementById('veraContainer');
            if (!container) return;

            const layers = container.querySelectorAll('.vera-layer');
            layers.forEach(layer => {
                layer.style.opacity = '0';
            });
        },

        // Show CSS sprite layers (fallback)
        showCSSlayers() {
            const container = document.getElementById('veraContainer');
            if (!container) return;

            const layers = container.querySelectorAll('.vera-layer');
            layers.forEach(layer => {
                layer.style.opacity = '';
            });
        },

        // Load a specific state's .riv file
        async loadState(state) {
            if (!this.canvas || typeof rive === 'undefined') return false;

            const rivePath = this.assets[state];
            if (!rivePath) {
                console.warn(`[VERA Rive] No .riv path for state: ${state}`);
                return false;
            }

            try {
                // Check if file exists
                const response = await fetch(rivePath, { method: 'HEAD' });
                if (!response.ok) {
                    console.warn(`[VERA Rive] File not found: ${rivePath}`);
                    return false;
                }

                // Clean up existing instance for this state
                if (this.instances[state]) {
                    this.instances[state].cleanup();
                }

                // Create new Rive instance
                this.instances[state] = new rive.Rive({
                    src: rivePath,
                    canvas: this.canvas,
                    autoplay: true,
                    stateMachines: this.stateMachines[state],
                    onLoad: () => {
                        this.instances[state].resizeDrawingSurfaceToCanvas();
                        console.log(`[VERA Rive] Loaded state: ${state}`);
                    },
                    onLoadError: (err) => {
                        console.error(`[VERA Rive] Error loading ${state}:`, err);
                    }
                });

                return true;
            } catch (err) {
                console.warn(`[VERA Rive] Could not load ${rivePath}:`, err.message);
                return false;
            }
        },

        // Switch to a different state
        async setState(newState) {
            if (!this.isRiveLoaded) return;

            // Stop current animation
            if (this.instances[this.currentState]) {
                this.instances[this.currentState].stop();
            }

            // Load new state if not already loaded
            if (!this.instances[newState]) {
                const loaded = await this.loadState(newState);
                if (!loaded) {
                    console.warn(`[VERA Rive] Could not load state: ${newState}`);
                    return;
                }
            }

            // Play new state
            this.instances[newState].play();
            this.currentState = newState;

            console.log(`[VERA Rive] Switched to state: ${newState}`);
        },

        // Trigger a specific animation/input in the state machine
        triggerInput(inputName, value = true) {
            if (!this.isRiveLoaded) return;

            const instance = this.instances[this.currentState];
            if (!instance) return;

            const inputs = instance.stateMachineInputs(this.stateMachines[this.currentState]);
            if (!inputs) return;

            const input = inputs.find(i => i.name === inputName);
            if (input) {
                if (typeof value === 'boolean') {
                    input.fire(); // For triggers
                } else {
                    input.value = value; // For numbers/booleans
                }
            }
        },

        // Trigger wing flap
        flapWings() {
            this.triggerInput('Flap');
        },

        // Trigger blink
        blink() {
            this.triggerInput('Blink');
        },

        // Set anger level (0-100)
        setAngerLevel(level) {
            this.triggerInput('AngerLevel', Math.min(100, Math.max(0, level)));
        },

        // Cleanup
        destroy() {
            Object.values(this.instances).forEach(instance => {
                if (instance) instance.cleanup();
            });
            this.instances = {};
            this.canvas?.remove();
            this.canvas = null;
            this.isRiveLoaded = false;
        }
    };

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            // Wait for VeraController to create the container
            setTimeout(() => VeraRive.init(), 500);
        });
    } else {
        setTimeout(() => VeraRive.init(), 500);
    }

    // Expose globally
    window.VeraRive = VeraRive;

    // Hook into existing VeraController state changes
    const originalSetState = window.VeraController?.setState;
    if (originalSetState) {
        window.VeraController.setState = function(newState, options) {
            originalSetState.call(this, newState, options);
            if (VeraRive.isRiveLoaded) {
                VeraRive.setState(newState);
            }
        };
    }

})();
