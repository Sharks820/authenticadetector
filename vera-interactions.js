/**
 * VERA INTERACTION SYSTEM
 * AuthenticaDetector - Premium VERA Interaction Modal System
 * Created: 2025-12-23
 *
 * This system provides high-quality, popup/cutscene worthy VERA interactions
 * that feel like special events rather than simple tooltips.
 */

(function() {
    'use strict';

    // VERA Interaction Data Store
    const VERA_INTERACTIONS = {
        welcome: {
            title: "Welcome to AuthenticaDetector!",
            subtitle: "VERA - Virtual Entity for Reality Authentication",
            message: "Hello! I'm VERA, your AI detection assistant. I'm here to help you navigate the world of AI-generated content and earn rewards along the way!",
            avatar: "assets/icons/nav-vera.svg",
            actions: [
                {
                    text: "Let's Get Started!",
                    type: "primary",
                    icon: "🚀",
                    callback: () => {
                        closeVERAInteraction();
                        openView('scanView');
                    }
                },
                {
                    text: "Show Me Around",
                    type: "secondary",
                    icon: "🗺️",
                    callback: () => {
                        closeVERAInteraction();
                        showVERAInteraction('tutorial');
                    }
                }
            ],
            tips: [
                "Upload images to earn Truth Coins",
                "Deep scans reveal more artifacts and give bigger rewards",
                "Complete quests for bonus coins and exclusive badges"
            ]
        },

        firstScan: {
            title: "Your First Scan!",
            subtitle: "Let's detect some AI",
            message: "Great choice! <strong>Scanning images</strong> is how you earn coins and level up. I'll analyze the image using multiple AI detection algorithms and show you the results.",
            avatar: "assets/icons/nav-vera.svg",
            actions: [
                {
                    text: "Upload Image",
                    type: "primary",
                    icon: "📸",
                    callback: () => {
                        closeVERAInteraction();
                        document.querySelector('input[type="file"]')?.click();
                    }
                },
                {
                    text: "Not Yet",
                    type: "secondary",
                    icon: "⏸️",
                    callback: closeVERAInteraction
                }
            ],
            tips: [
                "Quick Scan is free and instant",
                "Deep Scan uses advanced forensics (requires login)",
                "You earn more coins for detecting harder AI images"
            ]
        },

        levelUp: {
            title: "Level Up!",
            subtitle: "You're getting stronger!",
            message: "Congratulations! You've leveled up! Your detection skills are improving, and you've unlocked new features. Keep scanning to climb the leaderboard!",
            avatar: "assets/icons/nav-vera.svg",
            actions: [
                {
                    text: "View Profile",
                    type: "primary",
                    icon: "👤",
                    callback: () => {
                        closeVERAInteraction();
                        openView('profileView');
                    }
                },
                {
                    text: "Continue Scanning",
                    type: "secondary",
                    icon: "🔍",
                    callback: closeVERAInteraction
                }
            ],
            tips: [
                "Higher levels unlock exclusive badges",
                "Level bonuses give you more coins per scan",
                "Reach level 20 to unlock PvP battles"
            ]
        },

        tankShooter: {
            title: "AI Outbreak: Tank Battle",
            subtitle: "Destroy the AI fakes!",
            message: "The AI have broken through! Use your tank to <strong>blast fake images</strong> and protect the truth. Survive waves of enemies and defeat massive bosses!",
            avatar: "assets/icons/action-attack.svg",
            actions: [
                {
                    text: "Start Battle!",
                    type: "primary",
                    icon: "💥",
                    callback: () => {
                        closeVERAInteraction();
                        startTankShooter();
                    }
                },
                {
                    text: "Learn Controls",
                    type: "secondary",
                    icon: "🎮",
                    callback: () => {
                        showVERAInteraction('tankControls');
                    }
                }
            ],
            tips: [
                "Earn coins for each wave you complete",
                "Defeat bosses for massive coin bonuses",
                "Grade S+ gives 2.5x coin multiplier!"
            ]
        },

        tankControls: {
            title: "Tank Controls",
            subtitle: "Master your tank",
            message: "<strong>Desktop:</strong> WASD or Arrow Keys to move, Mouse to aim, Click to shoot<br><br><strong>Mobile:</strong> Touch left side to move, Touch right side to aim and shoot",
            avatar: "assets/icons/action-attack.svg",
            actions: [
                {
                    text: "I'm Ready!",
                    type: "primary",
                    icon: "⚔️",
                    callback: () => {
                        closeVERAInteraction();
                        startTankShooter();
                    }
                },
                {
                    text: "Back",
                    type: "secondary",
                    icon: "←",
                    callback: () => {
                        showVERAInteraction('tankShooter');
                    }
                }
            ],
            tips: [
                "Collect power-ups by driving over them",
                "Shield power-up makes you invincible temporarily",
                "Use Dash (Shift) to dodge enemy fire"
            ]
        },

        veilbreakers: {
            title: "Veilbreakers - Beast Collection",
            subtitle: "Coming Soon!",
            message: "Collect and train powerful <strong>Veilbreaker beasts</strong> to fight alongside you! Fuse beasts, evolve them, and battle in arenas. This feature is coming in Q1 2025!",
            avatar: "assets/icons/nav-pets.svg",
            actions: [
                {
                    text: "Notify Me",
                    type: "primary",
                    icon: "🔔",
                    callback: () => {
                        closeVERAInteraction();
                        showToast('You\'ll be notified when Veilbreakers launches!', 'success');
                    }
                },
                {
                    text: "Close",
                    type: "secondary",
                    icon: "✕",
                    callback: closeVERAInteraction
                }
            ],
            tips: [
                "Catch beasts by scanning AI images",
                "Each beast has unique abilities",
                "PvP beast battles coming soon"
            ]
        },

        shop: {
            title: "Truth Coin Shop",
            subtitle: "Spend your hard-earned coins!",
            message: "Welcome to the shop! Use your <strong>Truth Coins</strong> to unlock cosmetics, power-ups, and boosts. All items are earned through gameplay - no pay-to-win!",
            avatar: "assets/icons/currency-coin.svg",
            actions: [
                {
                    text: "Browse Shop",
                    type: "primary",
                    icon: "🛒",
                    callback: () => {
                        closeVERAInteraction();
                        openShop();
                    }
                },
                {
                    text: "How to Earn Coins",
                    type: "secondary",
                    icon: "💰",
                    callback: () => {
                        showVERAInteraction('earnCoins');
                    }
                }
            ],
            tips: [
                "Cosmetics don't affect gameplay",
                "Weapon upgrades increase detection accuracy",
                "Save coins for limited-time items"
            ]
        },

        earnCoins: {
            title: "How to Earn Truth Coins",
            subtitle: "Maximize your rewards!",
            message: "There are many ways to earn coins:<br><br>🔍 <strong>Scan Images:</strong> +10-50 coins<br>✅ <strong>Complete Quests:</strong> +30-500 coins<br>🎮 <strong>Play Games:</strong> +50-300 coins<br>👍 <strong>Vote on Submissions:</strong> +10 coins",
            avatar: "assets/icons/currency-coin.svg",
            actions: [
                {
                    text: "View Quests",
                    type: "primary",
                    icon: "📋",
                    callback: () => {
                        closeVERAInteraction();
                        toggleQuestsPopup();
                    }
                },
                {
                    text: "Got It",
                    type: "secondary",
                    icon: "✓",
                    callback: closeVERAInteraction
                }
            ],
            tips: [
                "Daily quests reset every 24 hours",
                "Weekly challenges give massive coin bonuses",
                "Deep scans give more coins than quick scans"
            ]
        },

        tutorial: {
            title: "Quick Tutorial",
            subtitle: "Everything you need to know",
            message: "AuthenticaDetector helps you identify AI-generated images and earn rewards. Here's how it works:<br><br>1️⃣ Upload an image<br>2️⃣ VERA analyzes it<br>3️⃣ You earn coins<br>4️⃣ Spend coins in shop<br>5️⃣ Level up and compete!",
            avatar: "assets/icons/nav-vera.svg",
            actions: [
                {
                    text: "Start Scanning",
                    type: "primary",
                    icon: "🔍",
                    callback: () => {
                        closeVERAInteraction();
                        openView('scanView');
                    }
                },
                {
                    text: "Explore Features",
                    type: "secondary",
                    icon: "🗺️",
                    callback: () => {
                        closeVERAInteraction();
                        openHelp();
                    }
                }
            ],
            tips: [
                "Check the Help page for detailed guides",
                "Join the leaderboard to compete with others",
                "Complete daily quests for steady coin income"
            ]
        }
    };

    /**
     * Show VERA interaction modal
     * @param {string} interactionId - ID of the interaction to show
     */
    window.showVERAInteraction = function(interactionId) {
        const interaction = VERA_INTERACTIONS[interactionId];
        if (!interaction) {
            console.error('Unknown VERA interaction:', interactionId);
            return;
        }

        // Create backdrop if it doesn't exist
        let backdrop = document.getElementById('veraInteractionBackdrop');
        if (!backdrop) {
            backdrop = document.createElement('div');
            backdrop.id = 'veraInteractionBackdrop';
            backdrop.className = 'vera-interaction-backdrop';
            backdrop.addEventListener('click', (e) => {
                if (e.target === backdrop) {
                    closeVERAInteraction();
                }
            });
            document.body.appendChild(backdrop);
        }

        // Build modal HTML
        const modalHTML = `
            <div class="vera-interaction-modal">
                <div class="vera-modal-header">
                    <button class="vera-modal-close" onclick="closeVERAInteraction()">×</button>
                    <div class="vera-modal-avatar">
                        <img src="${interaction.avatar}" alt="VERA">
                    </div>
                    <h2 class="vera-modal-title">${interaction.title}</h2>
                    <p class="vera-modal-subtitle">${interaction.subtitle}</p>
                </div>
                <div class="vera-modal-content">
                    <div class="vera-message">
                        <p class="vera-message-text">${interaction.message}</p>
                    </div>
                    <div class="vera-actions">
                        ${interaction.actions.map(action => `
                            <button class="vera-action-btn ${action.type}" onclick="handleVERAAction('${interactionId}', ${interaction.actions.indexOf(action)})">
                                <span>${action.icon}</span>
                                <span>${action.text}</span>
                            </button>
                        `).join('')}
                    </div>
                    ${interaction.tips ? `
                        <div class="vera-tips">
                            <div class="vera-tips-title">
                                <span>💡</span>
                                <span>Pro Tips</span>
                            </div>
                            <ul class="vera-tips-list">
                                ${interaction.tips.map(tip => `<li>${tip}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        backdrop.innerHTML = modalHTML;
        backdrop.classList.add('active');

        // Play VERA sound effect
        if (window.playSound) {
            playSound('veraHello');
        }

        // Track analytics
        if (window.trackEvent) {
            trackEvent('vera_interaction_shown', { interactionId });
        }
    };

    /**
     * Handle VERA action button clicks
     * @param {string} interactionId - ID of the interaction
     * @param {number} actionIndex - Index of the action button
     */
    window.handleVERAAction = function(interactionId, actionIndex) {
        const interaction = VERA_INTERACTIONS[interactionId];
        if (!interaction || !interaction.actions[actionIndex]) {
            return;
        }

        const action = interaction.actions[actionIndex];
        if (action.callback) {
            action.callback();
        }

        // Track analytics
        if (window.trackEvent) {
            trackEvent('vera_action_clicked', {
                interactionId,
                actionText: action.text
            });
        }
    };

    /**
     * Close VERA interaction modal
     */
    window.closeVERAInteraction = function() {
        const backdrop = document.getElementById('veraInteractionBackdrop');
        if (backdrop) {
            backdrop.classList.remove('active');
            setTimeout(() => {
                backdrop.innerHTML = '';
            }, 300);
        }
    };

    /**
     * Show contextual VERA interaction based on user state
     */
    window.showContextualVERA = function() {
        // Get user state
        const hasScanned = localStorage.getItem('hasScanned') === 'true';
        const isLoggedIn = !!window.currentUser;
        const currentView = document.querySelector('.view.active')?.id;

        // Determine which interaction to show
        if (!hasScanned && currentView === 'scanView') {
            showVERAInteraction('firstScan');
        } else if (currentView === 'outbreaksView') {
            showVERAInteraction('tankShooter');
        } else if (!isLoggedIn) {
            showVERAInteraction('welcome');
        }
    };

    // Auto-show welcome message for new users (only once)
    window.addEventListener('load', () => {
        const hasSeenWelcome = localStorage.getItem('veraWelcomeSeen') === 'true';
        if (!hasSeenWelcome && !window.currentUser) {
            setTimeout(() => {
                showVERAInteraction('welcome');
                localStorage.setItem('veraWelcomeSeen', 'true');
            }, 2000); // Show after 2 seconds
        }
    });

    // Make VERA interactions available globally
    window.VERA_INTERACTIONS = VERA_INTERACTIONS;

    console.log('[VERA Interactions] System initialized with', Object.keys(VERA_INTERACTIONS).length, 'interactions');
})();
