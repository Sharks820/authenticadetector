// ============================================================
// TANK SHOP BRIDGE MODULE
// ============================================================
// Connects index.html shop to tank-shooter-enhanced.js economy
// Fixes the critical bug where tank upgrades don't apply
// Author: Claude Code
// Date: 2025-12-23
// ============================================================

console.log('[Tank Bridge] Initializing tank shop bridge...');

// ==================== ITEM MAPPINGS ====================

// Map index.html shop items to tank-shooter-enhanced.js economy
const TANK_ITEM_MAPPINGS = {
    // Armor upgrades (map to armor upgrade levels)
    'tank_armor_light': {
        type: 'upgrade',
        upgradeType: 'armor',
        level: 1,
        requiresLevel: 0,
        description: 'Medium Armor: +40 HP'
    },
    'tank_armor_heavy': {
        type: 'upgrade',
        upgradeType: 'armor',
        level: 2,
        requiresLevel: 1,
        description: 'Heavy Armor: +80 HP'
    },

    // Track upgrades (map to tracks upgrade levels)
    'tank_treads_speed': {
        type: 'upgrade',
        upgradeType: 'tracks',
        level: 1,
        requiresLevel: 0,
        description: 'All-Terrain Tracks: +30 Speed'
    },
    'tank_treads_allterrain': {
        type: 'upgrade',
        upgradeType: 'tracks',
        level: 2,
        requiresLevel: 1,
        description: 'Speed Tracks: +60 Speed'
    },

    // Ammo/barrel upgrades (map to barrel or fireRate)
    'tank_ammo_blast': {
        type: 'customPowerup',
        powerupId: 'blastRadius',
        effect: { blastRadius: 0.40 },
        description: 'Blast Radius Ammo: +40% explosion radius'
    },
    'tank_ammo_pierce': {
        type: 'customPowerup',
        powerupId: 'piercing',
        effect: { pierceCount: 2 },
        description: 'Piercing Rounds: Shots pierce 2 enemies'
    },

    // Tank models (map to tank types)
    'tank_model_stealth': {
        type: 'tank',
        tankId: 'stealth',
        description: 'Stealth Tank: Invisible when stationary'
    },
    'tank_model_destroyer': {
        type: 'tank',
        tankId: 'destroyer',
        description: 'Destroyer Tank: 2x damage, 2x fire rate'
    },
    'tank_model_titan': {
        type: 'tank',
        tankId: 'titan',
        description: 'TITAN Tank: 3x HP, 2x damage, shield'
    },

    // Turret upgrades (map to fireRate)
    'turret_overclock': {
        type: 'upgrade',
        upgradeType: 'fireRate',
        level: 2,
        requiresLevel: 1,
        description: 'Fast Fire: -100ms fire delay'
    }
};

// ==================== CORE BRIDGE FUNCTION ====================

/**
 * Apply tank purchase effects to the game
 * Called after successful purchase in index.html shop
 * @param {string} itemId - Shop item ID
 * @returns {Promise<boolean>} - True if effect applied successfully
 */
async function applyTankPurchase(itemId) {
    console.log('[Tank Bridge] Applying tank purchase:', itemId);

    const mapping = TANK_ITEM_MAPPINGS[itemId];
    if (!mapping) {
        console.warn('[Tank Bridge] No mapping for item:', itemId);
        return false;
    }

    // Check if tank economy is loaded
    if (typeof tankEconomy === 'undefined') {
        console.error('[Tank Bridge] tankEconomy not loaded! Is tank-shooter-enhanced.js included?');
        return false;
    }

    // Check if required functions exist
    if (typeof saveTankEconomy !== 'function') {
        console.error('[Tank Bridge] saveTankEconomy function not found!');
        return false;
    }

    if (typeof updateTankStatsFromEconomy !== 'function') {
        console.error('[Tank Bridge] updateTankStatsFromEconomy function not found!');
        return false;
    }

    try {
        // Apply based on mapping type
        switch (mapping.type) {
            case 'upgrade':
                return await applyUpgradeEffect(mapping);

            case 'tank':
                return await applyTankSwitch(mapping);

            case 'customPowerup':
                return await applyCustomPowerup(mapping);

            default:
                console.error('[Tank Bridge] Unknown mapping type:', mapping.type);
                return false;
        }
    } catch (error) {
        console.error('[Tank Bridge] Error applying purchase:', error);
        return false;
    }
}

// ==================== EFFECT HANDLERS ====================

/**
 * Apply upgrade effect (armor, barrel, tracks, fireRate)
 */
async function applyUpgradeEffect(mapping) {
    const { upgradeType, level, requiresLevel } = mapping;

    // Check current level
    const currentLevel = tankEconomy.upgrades[upgradeType];

    // Validate upgrade path
    if (currentLevel >= level) {
        console.warn('[Tank Bridge] Upgrade already owned or higher level:', upgradeType, currentLevel, 'vs', level);
        // Still return true since user already has it
        return true;
    }

    if (currentLevel < requiresLevel) {
        console.warn('[Tank Bridge] Missing prerequisite level:', upgradeType, 'needs', requiresLevel, 'has', currentLevel);
        showNotification(`You need ${mapping.requiresLevel} level first!`, 'warning');
        return false;
    }

    // Apply upgrade
    tankEconomy.upgrades[upgradeType] = level;
    saveTankEconomy();
    updateTankStatsFromEconomy();

    console.log(`[Tank Bridge] ✅ Upgraded ${upgradeType} to level ${level}`);
    showNotification(`Upgraded ${upgradeType}! ${mapping.description}`, 'success');

    return true;
}

/**
 * Apply tank switch (stealth, destroyer, titan)
 */
async function applyTankSwitch(mapping) {
    const { tankId } = mapping;

    // Check if tank type exists
    if (typeof TANK_TYPES === 'undefined' || !TANK_TYPES[tankId]) {
        console.error('[Tank Bridge] Tank type not found:', tankId);
        console.log('[Tank Bridge] Available tanks:', typeof TANK_TYPES !== 'undefined' ? Object.keys(TANK_TYPES) : 'TANK_TYPES undefined');

        // Fallback: Add tank to owned but don't switch
        if (!tankEconomy.ownedTanks.includes(tankId)) {
            tankEconomy.ownedTanks.push(tankId);
            saveTankEconomy();
        }

        showNotification(`Tank purchased but not available yet. Coming soon!`, 'warning');
        return false;
    }

    // Add to owned tanks if not already
    if (!tankEconomy.ownedTanks.includes(tankId)) {
        tankEconomy.ownedTanks.push(tankId);
    }

    // Switch to new tank
    tankEconomy.currentTank = tankId;
    saveTankEconomy();
    updateTankStatsFromEconomy();

    console.log(`[Tank Bridge] ✅ Switched to tank: ${tankId}`);
    showNotification(`Equipped ${TANK_TYPES[tankId].name}! ${mapping.description}`, 'success');

    return true;
}

/**
 * Apply custom powerup (blast radius, piercing, etc.)
 */
async function applyCustomPowerup(mapping) {
    const { powerupId, effect } = mapping;

    // Add to shop powerups inventory
    if (!tankEconomy.shopPowerups[powerupId]) {
        tankEconomy.shopPowerups[powerupId] = 0;
    }

    tankEconomy.shopPowerups[powerupId] += 1;
    saveTankEconomy();

    console.log(`[Tank Bridge] ✅ Added powerup: ${powerupId}`);
    showNotification(`Purchased powerup! ${mapping.description}`, 'success');

    return true;
}

// ==================== COIN SYNC ====================

/**
 * Sync coins between tank economy and main progression
 * Ensures both systems use the same coin count
 */
function syncTankCoins() {
    if (typeof tankEconomy === 'undefined') {
        console.warn('[Tank Bridge] Cannot sync coins - tankEconomy not loaded');
        return;
    }

    if (typeof userProgression === 'undefined') {
        console.warn('[Tank Bridge] Cannot sync coins - userProgression not loaded');
        return;
    }

    // userProgression.truth_coins is source of truth (Supabase)
    const truthCoins = userProgression.truth_coins || 0;

    if (tankEconomy.coins !== truthCoins) {
        console.log(`[Tank Bridge] Syncing coins: ${tankEconomy.coins} → ${truthCoins}`);
        tankEconomy.coins = truthCoins;

        if (typeof saveTankEconomy === 'function') {
            saveTankEconomy();
        }
    }
}

// ==================== REVERSE SYNC ====================

/**
 * Award coins from tank game to main progression
 * Called when coins earned in tank shooter game
 * @param {number} amount - Coins to award
 */
async function awardCoinsToMainProgression(amount) {
    console.log('[Tank Bridge] Awarding coins to main progression:', amount);

    if (typeof userProgression === 'undefined') {
        console.warn('[Tank Bridge] userProgression not loaded, cannot award to main');
        return false;
    }

    // Update local state
    userProgression.truth_coins = (userProgression.truth_coins || 0) + amount;

    // Update Supabase if logged in
    if (typeof supabase !== 'undefined' && typeof user !== 'undefined' && user && user.id) {
        try {
            const { data, error } = await supabase.rpc('award_coins_atomic', {
                p_user_id: user.id,
                p_amount: amount
            });

            if (!error && data && data.length > 0) {
                userProgression.truth_coins = data[0].truth_coins;
                console.log('[Tank Bridge] ✅ Coins awarded to Supabase:', amount);

                // Sync back to tank economy
                syncTankCoins();

                // Update UI
                if (typeof updateCoinsDisplay === 'function') {
                    updateCoinsDisplay();
                }

                return true;
            } else {
                console.error('[Tank Bridge] Failed to award coins to Supabase:', error);
                return false;
            }
        } catch (err) {
            console.error('[Tank Bridge] Exception awarding coins:', err);
            return false;
        }
    } else {
        // Offline mode - just update local
        console.log('[Tank Bridge] Offline mode - coins awarded locally only');

        if (typeof updateCoinsDisplay === 'function') {
            updateCoinsDisplay();
        }

        syncTankCoins();
        return true;
    }
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Show notification to user
 */
function showNotification(message, type = 'info') {
    // Try to use existing notification system
    if (typeof toast === 'function') {
        toast(message);
        return;
    }

    // Fallback: console log
    console.log(`[Tank Bridge] ${type.toUpperCase()}: ${message}`);

    // Could add custom toast here if needed
}

/**
 * Get current tank stats summary
 */
function getTankStatsSummary() {
    if (typeof tankEconomy === 'undefined' || typeof TANK_TYPES === 'undefined') {
        return null;
    }

    const tank = TANK_TYPES[tankEconomy.currentTank];
    if (!tank) return null;

    const armorTier = typeof UPGRADE_TIERS !== 'undefined' ? UPGRADE_TIERS.armor[tankEconomy.upgrades.armor] : null;
    const barrelTier = typeof UPGRADE_TIERS !== 'undefined' ? UPGRADE_TIERS.barrel[tankEconomy.upgrades.barrel] : null;
    const tracksTier = typeof UPGRADE_TIERS !== 'undefined' ? UPGRADE_TIERS.tracks[tankEconomy.upgrades.tracks] : null;

    return {
        tankName: tank.name,
        hp: tank.baseHP + (armorTier ? armorTier.hpBonus : 0),
        damage: tank.baseDamage + (barrelTier ? barrelTier.damageBonus : 0),
        speed: tank.baseSpeed + (tracksTier ? tracksTier.speedBonus : 0),
        fireRate: tank.baseFireRate,
        upgrades: tankEconomy.upgrades,
        coins: tankEconomy.coins
    };
}

// ==================== AUTO-SYNC ON LOAD ====================

// Sync coins when bridge loads
if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        // Wait a moment for other scripts to initialize
        setTimeout(() => {
            console.log('[Tank Bridge] Running auto-sync on load...');
            syncTankCoins();

            const stats = getTankStatsSummary();
            if (stats) {
                console.log('[Tank Bridge] Current tank stats:', stats);
            }
        }, 1000);
    });
}

// ==================== EXPORTS ====================

// Export to window for global access
if (typeof window !== 'undefined') {
    window.applyTankPurchase = applyTankPurchase;
    window.syncTankCoins = syncTankCoins;
    window.awardCoinsToMainProgression = awardCoinsToMainProgression;
    window.getTankStatsSummary = getTankStatsSummary;
    window.TANK_ITEM_MAPPINGS = TANK_ITEM_MAPPINGS;

    console.log('[Tank Bridge] ✅ Bridge module loaded successfully');
    console.log('[Tank Bridge] Available functions:', {
        applyTankPurchase: typeof applyTankPurchase,
        syncTankCoins: typeof syncTankCoins,
        awardCoinsToMainProgression: typeof awardCoinsToMainProgression,
        getTankStatsSummary: typeof getTankStatsSummary
    });
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        applyTankPurchase,
        syncTankCoins,
        awardCoinsToMainProgression,
        getTankStatsSummary,
        TANK_ITEM_MAPPINGS
    };
}
