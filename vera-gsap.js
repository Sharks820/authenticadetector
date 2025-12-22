/* =============================================================================
   VERA GSAP ANIMATION CONTROLLER
   Professional smooth animations using GreenSock Animation Platform
   Replaces glitchy CSS animations with silky smooth GSAP timelines
   ============================================================================= */

(function() {
    'use strict';

    const VeraGSAP = {
        // Timeline references
        wingTimeline: null,
        hairTimeline: null,
        floatTimeline: null,
        breatheTimeline: null,
        sparkleTimelines: [],

        // State
        currentState: 'fairy',
        isInitialized: false,

        // Animation speeds per state
        speeds: {
            fairy: { wing: 1.4, hair: 4, float: 3.5 },
            partial: { wing: 1.1, hair: 2.5, float: 2.8 },
            takeover: { wing: 0.8, hair: 1.5, float: 2 },
            monster: { wing: 0.5, hair: 0.8, float: 0.8 }
        },

        // Initialize GSAP animations
        init() {
            if (typeof gsap === 'undefined') {
                console.warn('[VERA GSAP] GSAP not loaded, animations will use CSS fallback');
                return false;
            }

            // Wait for VERA container to exist
            const container = document.getElementById('veraContainer');
            if (!container) {
                console.warn('[VERA GSAP] Container not found, retrying...');
                setTimeout(() => this.init(), 500);
                return false;
            }

            // Get layer elements
            this.wings = container.querySelector('.vera-wings');
            this.hair = container.querySelector('.vera-hair');
            this.body = container.querySelector('.vera-body');
            this.stage = container.querySelector('.vera-stage');
            this.container = container;

            if (!this.wings || !this.hair || !this.body) {
                console.warn('[VERA GSAP] Sprite layers not found');
                return false;
            }

            // Kill any existing CSS animations
            this.disableCSSAnimations();

            // Create GSAP timelines
            this.createWingAnimation();
            this.createHairAnimation();
            this.createFloatAnimation();
            this.createBreatheAnimation();
            this.createSparkleAnimations();

            this.isInitialized = true;
            console.log('[VERA GSAP] Smooth animations initialized!');

            return true;
        },

        // Disable CSS animations on layers
        disableCSSAnimations() {
            if (this.wings) this.wings.style.animation = 'none';
            if (this.hair) this.hair.style.animation = 'none';
            if (this.stage) this.stage.style.animation = 'none';

            // Reset transforms
            gsap.set([this.wings, this.hair, this.body, this.stage], {
                clearProps: 'transform'
            });
        },

        // Wing flapping animation - organic butterfly-like motion
        createWingAnimation() {
            if (this.wingTimeline) this.wingTimeline.kill();

            const speed = this.speeds[this.currentState].wing;

            this.wingTimeline = gsap.timeline({ repeat: -1, yoyo: false });

            // Organic wing flap cycle
            this.wingTimeline
                .to(this.wings, {
                    scaleY: 0.88,
                    scaleX: 1.05,
                    rotation: 3,
                    y: -2,
                    duration: speed * 0.25,
                    ease: 'sine.inOut'
                })
                .to(this.wings, {
                    scaleY: 0.92,
                    scaleX: 1.03,
                    rotation: 1.5,
                    y: 0,
                    duration: speed * 0.2,
                    ease: 'sine.out'
                })
                .to(this.wings, {
                    scaleY: 1,
                    scaleX: 1,
                    rotation: -1,
                    y: 1,
                    duration: speed * 0.3,
                    ease: 'sine.inOut'
                })
                .to(this.wings, {
                    scaleY: 0.96,
                    scaleX: 1.02,
                    rotation: 0.5,
                    y: -1,
                    duration: speed * 0.25,
                    ease: 'sine.in'
                });

            // Adjust for monster state - more aggressive
            if (this.currentState === 'monster' || this.currentState === 'takeover') {
                this.wingTimeline.timeScale(1.5);
            }
        },

        // Hair swaying animation - natural follow-through
        createHairAnimation() {
            if (this.hairTimeline) this.hairTimeline.kill();

            const speed = this.speeds[this.currentState].hair;

            this.hairTimeline = gsap.timeline({ repeat: -1, yoyo: true });

            this.hairTimeline
                .to(this.hair, {
                    rotation: 1.5,
                    x: 2,
                    duration: speed * 0.5,
                    ease: 'sine.inOut'
                })
                .to(this.hair, {
                    rotation: -1.2,
                    x: -1,
                    duration: speed * 0.5,
                    ease: 'sine.inOut'
                });

            // More dramatic for angry states
            if (this.currentState === 'monster') {
                this.hairTimeline
                    .clear()
                    .to(this.hair, {
                        rotation: 5,
                        x: 4,
                        scaleX: 1.02,
                        duration: 0.15,
                        ease: 'power2.inOut'
                    })
                    .to(this.hair, {
                        rotation: -4,
                        x: -3,
                        scaleX: 0.99,
                        duration: 0.15,
                        ease: 'power2.inOut'
                    });
            }
        },

        // Floating animation - gentle hover
        createFloatAnimation() {
            if (this.floatTimeline) this.floatTimeline.kill();

            const speed = this.speeds[this.currentState].float;

            this.floatTimeline = gsap.timeline({ repeat: -1, yoyo: true });

            if (this.currentState === 'monster') {
                // Aggressive shaking for monster
                this.floatTimeline
                    .to(this.stage, {
                        y: -3,
                        rotation: -2,
                        duration: 0.1,
                        ease: 'power1.inOut'
                    })
                    .to(this.stage, {
                        y: -5,
                        rotation: 2,
                        duration: 0.1,
                        ease: 'power1.inOut'
                    })
                    .to(this.stage, {
                        y: -2,
                        rotation: -1.5,
                        duration: 0.1,
                        ease: 'power1.inOut'
                    });
            } else {
                // Gentle floating
                this.floatTimeline
                    .to(this.stage, {
                        y: -8,
                        rotation: 0.5,
                        duration: speed * 0.5,
                        ease: 'sine.inOut'
                    });
            }
        },

        // Subtle breathing/pulsing on body
        createBreatheAnimation() {
            if (this.breatheTimeline) this.breatheTimeline.kill();

            this.breatheTimeline = gsap.timeline({ repeat: -1, yoyo: true });

            this.breatheTimeline.to(this.body, {
                scaleY: 1.015,
                scaleX: 0.99,
                duration: 2,
                ease: 'sine.inOut'
            });
        },

        // Sparkle animations
        createSparkleAnimations() {
            // Kill existing
            this.sparkleTimelines.forEach(tl => tl?.kill());
            this.sparkleTimelines = [];

            const sparkles = this.container.querySelectorAll('.vera-sparkle');
            if (!sparkles.length) return;

            sparkles.forEach((sparkle, i) => {
                const tl = gsap.timeline({ repeat: -1, delay: i * 0.3 });

                const randomX = (Math.random() - 0.5) * 30;
                const randomY = Math.random() * -30;

                tl.fromTo(sparkle, {
                    opacity: 0,
                    scale: 0.3,
                    y: 10
                }, {
                    opacity: 0.9,
                    scale: 1,
                    y: 0,
                    duration: 0.5,
                    ease: 'power2.out'
                })
                .to(sparkle, {
                    opacity: 0.9,
                    scale: 1.1,
                    x: randomX,
                    y: randomY,
                    duration: 1.5,
                    ease: 'sine.inOut'
                })
                .to(sparkle, {
                    opacity: 0,
                    scale: 0.3,
                    y: randomY - 20,
                    duration: 0.5,
                    ease: 'power2.in'
                });

                this.sparkleTimelines.push(tl);
            });
        },

        // Change animation state
        setState(newState) {
            if (!this.isInitialized) return;
            if (newState === this.currentState) return;

            this.currentState = newState;

            // Recreate all animations with new timing
            this.createWingAnimation();
            this.createHairAnimation();
            this.createFloatAnimation();
            this.createSparkleAnimations();

            console.log(`[VERA GSAP] State changed to: ${newState}`);
        },

        // Trigger a single wing flap burst
        triggerFlap() {
            if (!this.wings) return;

            gsap.to(this.wings, {
                scaleY: 0.75,
                scaleX: 1.1,
                rotation: 5,
                duration: 0.1,
                ease: 'power2.out',
                yoyo: true,
                repeat: 1
            });
        },

        // Trigger angry shake
        triggerShake() {
            if (!this.container) return;

            gsap.to(this.container, {
                x: '+=5',
                duration: 0.05,
                yoyo: true,
                repeat: 5,
                ease: 'power1.inOut',
                onComplete: () => {
                    gsap.set(this.container, { x: 0 });
                }
            });
        },

        // Pause all animations
        pause() {
            this.wingTimeline?.pause();
            this.hairTimeline?.pause();
            this.floatTimeline?.pause();
            this.breatheTimeline?.pause();
            this.sparkleTimelines.forEach(tl => tl?.pause());
        },

        // Resume all animations
        resume() {
            this.wingTimeline?.resume();
            this.hairTimeline?.resume();
            this.floatTimeline?.resume();
            this.breatheTimeline?.resume();
            this.sparkleTimelines.forEach(tl => tl?.resume());
        },

        // Cleanup
        destroy() {
            this.wingTimeline?.kill();
            this.hairTimeline?.kill();
            this.floatTimeline?.kill();
            this.breatheTimeline?.kill();
            this.sparkleTimelines.forEach(tl => tl?.kill());
            this.isInitialized = false;
        }
    };

    // Auto-initialize when DOM is ready
    const initWhenReady = () => {
        // Wait for GSAP to be loaded
        if (typeof gsap === 'undefined') {
            setTimeout(initWhenReady, 100);
            return;
        }

        // Wait a bit for VeraController to create elements
        setTimeout(() => {
            VeraGSAP.init();
        }, 800);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWhenReady);
    } else {
        initWhenReady();
    }

    // Expose globally
    window.VeraGSAP = VeraGSAP;

    // Hook into VeraController state changes
    const hookIntoController = () => {
        if (!window.VeraController) {
            setTimeout(hookIntoController, 500);
            return;
        }

        const originalSetState = window.VeraController.setState;
        window.VeraController.setState = function(newState, options) {
            originalSetState.call(this, newState, options);
            if (VeraGSAP.isInitialized) {
                VeraGSAP.setState(newState);
            }
        };

        // Also hook into click for extra flap
        const originalHandleClick = window.VeraController.handleClick;
        window.VeraController.handleClick = function() {
            if (VeraGSAP.isInitialized) {
                VeraGSAP.triggerFlap();
            }
            originalHandleClick.call(this);
        };

        console.log('[VERA GSAP] Hooked into VeraController');
    };

    hookIntoController();

})();
