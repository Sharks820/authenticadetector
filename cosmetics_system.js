// ==================== COSMETICS & GACHA SYSTEM ====================
// Avatar Customization with AI-themed Cosmetics
// Gacha system with rarity tiers and duplicate protection

let COSMETICS = {};
let userCosmetics = null;
let activeCosmeticTab = 'avatars';
let recentlyAcquired = new Set();

// Initialize all cosmetic items with rarity tiers
function initializeCosmetics() {
    COSMETICS = {
        avatars: [
            // LEGENDARY (3%)
            { id: 'av_neural_god', icon: '🧠', name: 'Neural God', rarity: 'legendary' },
            { id: 'av_quantum_king', icon: '👑', name: 'Quantum King', rarity: 'legendary' },
            { id: 'av_digital_oracle', icon: '🔮', name: 'Digital Oracle', rarity: 'legendary' },
            { id: 'av_matrix_master', icon: '🌐', name: 'Matrix Master', rarity: 'legendary' },
            { id: 'av_cyber_supreme', icon: '⚡', name: 'Cyber Supreme', rarity: 'legendary' },

            // EPIC (12%)
            { id: 'av_fire_bot', icon: '🔥', name: 'Fire Bot', rarity: 'epic' },
            { id: 'av_ice_algorithm', icon: '❄️', name: 'Ice Algorithm', rarity: 'epic' },
            { id: 'av_star_ai', icon: '🌟', name: 'Star AI', rarity: 'epic' },
            { id: 'av_moon_chip', icon: '🌙', name: 'Moon Chip', rarity: 'epic' },
            { id: 'av_deep_fake', icon: '🎭', name: 'Deep Fake', rarity: 'epic' },
            { id: 'av_quantum_face', icon: '🌀', name: 'Quantum Face', rarity: 'epic' },
            { id: 'av_neon_ghost', icon: '👻', name: 'Neon Ghost', rarity: 'epic' },
            { id: 'av_cosmic_mind', icon: '🪐', name: 'Cosmic Mind', rarity: 'epic' },
            { id: 'av_glitch_master', icon: '📺', name: 'Glitch Master', rarity: 'epic' },
            { id: 'av_void_walker', icon: '🕳️', name: 'Void Walker', rarity: 'epic' },

            // RARE (25%)
            { id: 'av_cyborg', icon: '🦾', name: 'Cyborg', rarity: 'rare' },
            { id: 'av_pixel_ai', icon: '👾', name: 'Pixel AI', rarity: 'rare' },
            { id: 'av_electric_mind', icon: '⚡', name: 'Electric Mind', rarity: 'rare' },
            { id: 'av_hologram', icon: '🎆', name: 'Hologram', rarity: 'rare' },
            { id: 'av_data_ghost', icon: '💾', name: 'Data Ghost', rarity: 'rare' },
            { id: 'av_cyber_ninja', icon: '🥷', name: 'Cyber Ninja', rarity: 'rare' },
            { id: 'av_neon_samurai', icon: '⚔️', name: 'Neon Samurai', rarity: 'rare' },
            { id: 'av_digital_mage', icon: '🧙', name: 'Digital Mage', rarity: 'rare' },
            { id: 'av_code_witch', icon: '🧙‍♀️', name: 'Code Witch', rarity: 'rare' },
            { id: 'av_byte_knight', icon: '🛡️', name: 'Byte Knight', rarity: 'rare' },
            { id: 'av_pixel_wizard', icon: '🪄', name: 'Pixel Wizard', rarity: 'rare' },
            { id: 'av_data_dragon', icon: '🐉', name: 'Data Dragon', rarity: 'rare' },
            { id: 'av_cyber_phoenix', icon: '🦅', name: 'Cyber Phoenix', rarity: 'rare' },
            { id: 'av_neon_tiger', icon: '🐯', name: 'Neon Tiger', rarity: 'rare' },
            { id: 'av_quantum_cat', icon: '🐱', name: 'Quantum Cat', rarity: 'rare' },

            // COMMON (60%)
            { id: 'av_bot_basic', icon: '🤖', name: 'Bot Basic', rarity: 'common' },
            { id: 'av_simple_ai', icon: '🔬', name: 'Simple AI', rarity: 'common' },
            { id: 'av_chip_face', icon: '💻', name: 'Chip Face', rarity: 'common' },
            { id: 'av_binary_head', icon: '0️⃣', name: 'Binary Head', rarity: 'common' },
            { id: 'av_circuit_soul', icon: '🔌', name: 'Circuit Soul', rarity: 'common' },
            { id: 'av_code_runner', icon: '💨', name: 'Code Runner', rarity: 'common' },
            { id: 'av_data_seeker', icon: '🔍', name: 'Data Seeker', rarity: 'common' },
            { id: 'av_pixel_newbie', icon: '🟦', name: 'Pixel Newbie', rarity: 'common' },
            { id: 'av_byte_walker', icon: '🚶', name: 'Byte Walker', rarity: 'common' },
            { id: 'av_code_scout', icon: '🔭', name: 'Code Scout', rarity: 'common' },
            { id: 'av_digital_explorer', icon: '🧭', name: 'Digital Explorer', rarity: 'common' },
            { id: 'av_ai_apprentice', icon: '📚', name: 'AI Apprentice', rarity: 'common' },
            { id: 'av_cyber_student', icon: '🎓', name: 'Cyber Student', rarity: 'common' },
            { id: 'av_neon_rookie', icon: '🌱', name: 'Neon Rookie', rarity: 'common' },
            { id: 'av_matrix_novice', icon: '🔰', name: 'Matrix Novice', rarity: 'common' },
            { id: 'av_bit_buddy', icon: '🤝', name: 'Bit Buddy', rarity: 'common' },
            { id: 'av_code_pal', icon: '👋', name: 'Code Pal', rarity: 'common' },
            { id: 'av_pixel_friend', icon: '😊', name: 'Pixel Friend', rarity: 'common' },
            { id: 'av_data_companion', icon: '🐕', name: 'Data Companion', rarity: 'common' },
            { id: 'av_cyber_helper', icon: '🦸‍♂️', name: 'Cyber Helper', rarity: 'common' },
            { id: 'av_neon_guide', icon: '🗺️', name: 'Neon Guide', rarity: 'common' },
            { id: 'av_quantum_learner', icon: '📖', name: 'Quantum Learner', rarity: 'common' },
            { id: 'av_digital_trainee', icon: '🎯', name: 'Digital Trainee', rarity: 'common' },
            { id: 'av_ai_starter', icon: '⭐', name: 'AI Starter', rarity: 'common' },
            { id: 'av_cyber_beginner', icon: '🌟', name: 'Cyber Beginner', rarity: 'common' },
            { id: 'av_matrix_initiate', icon: '🔑', name: 'Matrix Initiate', rarity: 'common' },
            { id: 'av_code_newb', icon: '👶', name: 'Code Newb', rarity: 'common' },
            { id: 'av_pixel_noob', icon: '🥚', name: 'Pixel Noob', rarity: 'common' },
            { id: 'av_data_novice', icon: '🌼', name: 'Data Novice', rarity: 'common' },
            { id: 'av_cyber_cadet', icon: '👨‍🚀', name: 'Cyber Cadet', rarity: 'common' }
        ],

        frames: [
            // LEGENDARY
            { id: 'fr_rainbow_infinity', icon: '🌈', name: 'Rainbow Infinity', rarity: 'legendary' },
            { id: 'fr_cosmic_crown', icon: '👑', name: 'Cosmic Crown', rarity: 'legendary' },
            { id: 'fr_dragon_aura', icon: '🐉', name: 'Dragon Aura', rarity: 'legendary' },

            // EPIC
            { id: 'fr_black_hole', icon: '⚫', name: 'Black Hole', rarity: 'epic' },
            { id: 'fr_rgb_glitch', icon: '🌈', name: 'RGB Glitch', rarity: 'epic' },
            { id: 'fr_diamond_core', icon: '🔶', name: 'Diamond Core', rarity: 'epic' },
            { id: 'fr_plasma_ring', icon: '💫', name: 'Plasma Ring', rarity: 'epic' },
            { id: 'fr_void_portal', icon: '🕳️', name: 'Void Portal', rarity: 'epic' },

            // RARE
            { id: 'fr_neon_circuit', icon: '🟢', name: 'Neon Circuit', rarity: 'rare' },
            { id: 'fr_data_stream', icon: '🔵', name: 'Data Stream', rarity: 'rare' },
            { id: 'fr_quantum_field', icon: '🟣', name: 'Quantum Field', rarity: 'rare' },
            { id: 'fr_gold_processing', icon: '🟡', name: 'Gold Processing', rarity: 'rare' },
            { id: 'fr_hologram_ring', icon: '⭕', name: 'Hologram Ring', rarity: 'rare' },
            { id: 'fr_cyber_hexagon', icon: '⬡', name: 'Cyber Hexagon', rarity: 'rare' },
            { id: 'fr_neon_octagon', icon: '🛑', name: 'Neon Octagon', rarity: 'rare' },
            { id: 'fr_matrix_square', icon: '🟦', name: 'Matrix Square', rarity: 'rare' },

            // COMMON
            { id: 'fr_basic_circle', icon: '⚪', name: 'Basic Circle', rarity: 'common' },
            { id: 'fr_simple_square', icon: '⬜', name: 'Simple Square', rarity: 'common' },
            { id: 'fr_gray_border', icon: '⚫', name: 'Gray Border', rarity: 'common' },
            { id: 'fr_blue_outline', icon: '🔵', name: 'Blue Outline', rarity: 'common' },
            { id: 'fr_green_edge', icon: '🟢', name: 'Green Edge', rarity: 'common' },
            { id: 'fr_red_frame', icon: '🔴', name: 'Red Frame', rarity: 'common' },
            { id: 'fr_yellow_ring', icon: '🟡', name: 'Yellow Ring', rarity: 'common' },
            { id: 'fr_purple_box', icon: '🟣', name: 'Purple Box', rarity: 'common' },
            { id: 'fr_orange_border', icon: '🟠', name: 'Orange Border', rarity: 'common' },
            { id: 'fr_cyan_outline', icon: '🔷', name: 'Cyan Outline', rarity: 'common' },
            { id: 'fr_pink_frame', icon: '🩷', name: 'Pink Frame', rarity: 'common' },
            { id: 'fr_white_glow', icon: '⚪', name: 'White Glow', rarity: 'common' },
            { id: 'fr_black_edge', icon: '⚫', name: 'Black Edge', rarity: 'common' }
        ],

        effects: [
            // LEGENDARY
            { id: 'ef_reality_tear', icon: '💥', name: 'Reality Tear', rarity: 'legendary' },
            { id: 'ef_quantum_flux', icon: '🌌', name: 'Quantum Flux', rarity: 'legendary' },

            // EPIC
            { id: 'ef_fireworks', icon: '🎆', name: 'Fireworks', rarity: 'epic' },
            { id: 'ef_lightning', icon: '⚡', name: 'Lightning', rarity: 'epic' },
            { id: 'ef_flames', icon: '🔥', name: 'Flames', rarity: 'epic' },
            { id: 'ef_frost', icon: '❄️', name: 'Frost', rarity: 'epic' },

            // RARE
            { id: 'ef_sparkle', icon: '✨', name: 'Sparkle', rarity: 'rare' },
            { id: 'ef_shine', icon: '🌟', name: 'Shine', rarity: 'rare' },
            { id: 'ef_vortex', icon: '🌀', name: 'Vortex', rarity: 'rare' },
            { id: 'ef_stars', icon: '💫', name: 'Stars', rarity: 'rare' },
            { id: 'ef_waves', icon: '🌊', name: 'Waves', rarity: 'rare' },
            { id: 'ef_paint_splash', icon: '🎨', name: 'Paint Splash', rarity: 'rare' },

            // COMMON
            { id: 'ef_glow', icon: '💡', name: 'Glow', rarity: 'common' },
            { id: 'ef_pulse', icon: '📡', name: 'Pulse', rarity: 'common' },
            { id: 'ef_shimmer', icon: '✨', name: 'Shimmer', rarity: 'common' },
            { id: 'ef_twinkle', icon: '⭐', name: 'Twinkle', rarity: 'common' },
            { id: 'ef_flicker', icon: '💫', name: 'Flicker', rarity: 'common' },
            { id: 'ef_aura', icon: '🔆', name: 'Aura', rarity: 'common' },
            { id: 'ef_radiance', icon: '🌞', name: 'Radiance', rarity: 'common' },
            { id: 'ef_gleam', icon: '✴️', name: 'Gleam', rarity: 'common' }
        ],

        titles: [
            // LEGENDARY
            { id: 'ti_ai_god', icon: '👑', name: 'AI God', rarity: 'legendary' },
            { id: 'ti_ultimate_detector', icon: '🏆', name: 'Ultimate Detector', rarity: 'legendary' },
            { id: 'ti_reality_guardian', icon: '🛡️', name: 'Reality Guardian', rarity: 'legendary' },
            { id: 'ti_truth_legend', icon: '⭐', name: 'Truth Legend', rarity: 'legendary' },

            // EPIC
            { id: 'ti_detection_master', icon: '🎖️', name: 'Detection Master', rarity: 'epic' },
            { id: 'ti_neural_knight', icon: '⚔️', name: 'Neural Knight', rarity: 'epic' },
            { id: 'ti_algorithm_slayer', icon: '🗡️', name: 'Algorithm Slayer', rarity: 'epic' },
            { id: 'ti_digital_detective', icon: '🕵️', name: 'Digital Detective', rarity: 'epic' },
            { id: 'ti_data_wizard', icon: '🧙', name: 'Data Wizard', rarity: 'epic' },
            { id: 'ti_verification_king', icon: '👑', name: 'Verification King', rarity: 'epic' },

            // RARE
            { id: 'ti_ai_hunter', icon: '🎯', name: 'AI Hunter', rarity: 'rare' },
            { id: 'ti_truth_seeker', icon: '🔍', name: 'Truth Seeker', rarity: 'rare' },
            { id: 'ti_bot_buster', icon: '🤖', name: 'Bot Buster', rarity: 'rare' },
            { id: 'ti_fake_finder', icon: '🔎', name: 'Fake Finder', rarity: 'rare' },
            { id: 'ti_scan_expert', icon: '📊', name: 'Scan Expert', rarity: 'rare' },
            { id: 'ti_authenticity_pro', icon: '✅', name: 'Authenticity Pro', rarity: 'rare' },
            { id: 'ti_cyber_scout', icon: '🔭', name: 'Cyber Scout', rarity: 'rare' },
            { id: 'ti_pixel_analyst', icon: '🖼️', name: 'Pixel Analyst', rarity: 'rare' },
            { id: 'ti_code_breaker', icon: '🔓', name: 'Code Breaker', rarity: 'rare' },
            { id: 'ti_pattern_master', icon: '🧩', name: 'Pattern Master', rarity: 'rare' },

            // COMMON
            { id: 'ti_ai_spotter', icon: '👁️', name: 'AI Spotter', rarity: 'common' },
            { id: 'ti_image_checker', icon: '📷', name: 'Image Checker', rarity: 'common' },
            { id: 'ti_scan_rookie', icon: '🌱', name: 'Scan Rookie', rarity: 'common' },
            { id: 'ti_detection_newbie', icon: '🔰', name: 'Detection Newbie', rarity: 'common' },
            { id: 'ti_truth_apprentice', icon: '📚', name: 'Truth Apprentice', rarity: 'common' },
            { id: 'ti_fake_scout', icon: '🕵️‍♂️', name: 'Fake Scout', rarity: 'common' },
            { id: 'ti_ai_trainee', icon: '🎓', name: 'AI Trainee', rarity: 'common' },
            { id: 'ti_scan_student', icon: '📖', name: 'Scan Student', rarity: 'common' },
            { id: 'ti_pixel_learner', icon: '🖼️', name: 'Pixel Learner', rarity: 'common' },
            { id: 'ti_data_novice', icon: '💾', name: 'Data Novice', rarity: 'common' },
            { id: 'ti_code_cadet', icon: '👨‍💻', name: 'Code Cadet', rarity: 'common' },
            { id: 'ti_cyber_beginner', icon: '🌟', name: 'Cyber Beginner', rarity: 'common' },
            { id: 'ti_truth_starter', icon: '⭐', name: 'Truth Starter', rarity: 'common' },
            { id: 'ti_scan_initiate', icon: '🔑', name: 'Scan Initiate', rarity: 'common' },
            { id: 'ti_ai_explorer', icon: '🧭', name: 'AI Explorer', rarity: 'common' },
            { id: 'ti_detection_seeker', icon: '🔦', name: 'Detection Seeker', rarity: 'common' },
            { id: 'ti_fake_hunter', icon: '🏹', name: 'Fake Hunter', rarity: 'common' },
            { id: 'ti_truth_defender', icon: '🛡️', name: 'Truth Defender', rarity: 'common' },
            { id: 'ti_pixel_guardian', icon: '👮', name: 'Pixel Guardian', rarity: 'common' },
            { id: 'ti_scan_warrior', icon: '⚔️', name: 'Scan Warrior', rarity: 'common' }
        ]
    };

    console.log('[Cosmetics] Initialized:',
        `${COSMETICS.avatars.length} avatars,`,
        `${COSMETICS.frames.length} frames,`,
        `${COSMETICS.effects.length} effects,`,
        `${COSMETICS.titles.length} titles`
    );
}

// Load user cosmetics from localStorage
function loadUserCosmetics() {
    const saved = getStorage('userCosmetics', null);

    if (!saved) {
        // First time - give starter cosmetics
        userCosmetics = {
            avatars: { equipped: 'av_bot_basic', owned: ['av_bot_basic'] },
            frames: { equipped: 'fr_basic_circle', owned: ['fr_basic_circle'] },
            effects: { equipped: null, owned: [] },
            titles: { equipped: 'ti_scan_rookie', owned: ['ti_scan_rookie'] }
        };
        saveUserCosmetics();
        console.log('[Cosmetics] Created new user cosmetics with starter items');
    } else {
        userCosmetics = saved;
        console.log('[Cosmetics] Loaded user cosmetics:', userCosmetics);
    }

    return userCosmetics;
}

// Save user cosmetics to localStorage
function saveUserCosmetics() {
    if (!userCosmetics) return;
    setStorage('userCosmetics', userCosmetics);
}

// Open avatar customization view
window.openAvatarView = function() {
    if (!user) {
        toast('Sign in to customize your avatar!');
        openLogin();
        return;
    }

    loadUserCosmetics();
    initializeCosmetics();
    showView('avatarView');

    // Update coins display
    if ($('avatarViewCoins')) {
        const coins = userProgression?.truth_coins || 0;
        $('avatarViewCoins').querySelector('span:last-child').textContent = coins.toLocaleString();
    }

    // Set initial tab
    switchCosmeticTab('avatars');
    updateAvatarPreview();
};

// Switch cosmetic category tab
window.switchCosmeticTab = function(type) {
    activeCosmeticTab = type;

    // Update tab buttons
    document.querySelectorAll('.cosmetic-tab').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase().includes(type.slice(0, -1))) {
            btn.classList.add('active');
        }
    });

    // Render cosmetics for this category
    renderCosmeticGrid(type);
};

// Render cosmetic grid for active category
function renderCosmeticGrid(type) {
    const grid = $('cosmeticGrid');
    if (!grid) return;

    const items = COSMETICS[type] || [];
    const owned = userCosmetics[type]?.owned || [];
    const equipped = userCosmetics[type]?.equipped;

    grid.innerHTML = items.map(item => {
        const isOwned = owned.includes(item.id);
        const isEquipped = equipped === item.id;
        const isNew = recentlyAcquired.has(item.id);

        const rarityColors = {
            common: '#9e9e9e',
            rare: '#2196F3',
            epic: '#9C27B0',
            legendary: '#FFD700'
        };

        return `
            <div class="cosmetic-item ${isOwned ? 'owned' : 'locked'} ${isEquipped ? 'equipped' : ''} ${isNew ? 'new' : ''}"
                 onclick="equipCosmetic('${type}', '${item.id}')"
                 style="border-color: ${rarityColors[item.rarity]}">
                <div class="cosmetic-item-icon">${item.icon}</div>
                <div class="cosmetic-item-name">${item.name}</div>
                <div class="cosmetic-item-rarity" style="color: ${rarityColors[item.rarity]}">
                    ${item.rarity.toUpperCase()}
                </div>
                ${!isOwned ? '<div class="cosmetic-item-lock">🔒</div>' : ''}
                ${isEquipped ? '<div class="cosmetic-item-equipped">✓ EQUIPPED</div>' : ''}
                ${isNew ? '<div class="cosmetic-item-new">NEW!</div>' : ''}
            </div>
        `;
    }).join('');
}

// Equip a cosmetic item
window.equipCosmetic = function(type, id) {
    if (!userCosmetics) return;

    const owned = userCosmetics[type]?.owned || [];

    if (!owned.includes(id)) {
        toast('You don\'t own this cosmetic yet!');
        return;
    }

    // Equip the item
    userCosmetics[type].equipped = id;
    saveUserCosmetics();

    // Remove NEW badge
    recentlyAcquired.delete(id);

    // Update UI
    renderCosmeticGrid(type);
    updateAvatarPreview();

    // Update profile avatar if visible
    updateProfileAvatar();

    toast(`Equipped: ${COSMETICS[type].find(c => c.id === id)?.name || 'Item'}`);
};

// Roll gacha (1 or 10 times)
window.rollGacha = function(count) {
    if (!user || !userProgression) {
        toast('Sign in to roll the gacha!');
        openLogin();
        return;
    }

    const cost = count === 1 ? 100 : 900; // 10% discount for 10 rolls
    const currentCoins = userProgression.truth_coins || 0;

    if (currentCoins < cost) {
        toast(`Not enough coins! Need ${cost} 🪙`);
        return;
    }

    // Deduct coins
    userProgression.truth_coins -= cost;
    saveUserProgression();
    updateCoinsDisplay();

    // Update avatar view coins if open
    if ($('avatarViewCoins')) {
        $('avatarViewCoins').querySelector('span:last-child').textContent = userProgression.truth_coins.toLocaleString();
    }

    // Roll items
    const rolledItems = [];
    for (let i = 0; i < count; i++) {
        const item = rollRandomCosmetic();
        rolledItems.push(item);

        // Add to owned if not already owned
        const type = getCosmeticType(item.id);
        if (!userCosmetics[type].owned.includes(item.id)) {
            userCosmetics[type].owned.push(item.id);
            recentlyAcquired.add(item.id);
            item.isNew = true;
        } else {
            item.isNew = false;
            item.isDuplicate = true;
        }
    }

    saveUserCosmetics();

    // Show results modal
    showGachaResults(rolledItems);

    console.log('[Gacha] Rolled', count, 'items:', rolledItems);
};

// Roll a random cosmetic with weighted rarity
function rollRandomCosmetic() {
    const rand = Math.random() * 100;
    let rarity;

    // Duplicate protection: increase epic/legendary chance if user owns most commons
    const totalCommons = getAllCosmetics().filter(c => c.rarity === 'common').length;
    const ownedCommons = getAllOwnedCosmetics().filter(c => c.rarity === 'common').length;
    const commonOwnership = ownedCommons / totalCommons;

    let legendaryChance = 3;
    let epicChance = 12;

    if (commonOwnership > 0.7) {
        legendaryChance = 5; // Boost legendary to 5%
        epicChance = 18; // Boost epic to 18%
    }

    if (rand < legendaryChance) {
        rarity = 'legendary';
    } else if (rand < legendaryChance + epicChance) {
        rarity = 'epic';
    } else if (rand < legendaryChance + epicChance + 25) {
        rarity = 'rare';
    } else {
        rarity = 'common';
    }

    // Pick random item of this rarity
    const itemsOfRarity = getAllCosmetics().filter(c => c.rarity === rarity);
    const item = itemsOfRarity[Math.floor(Math.random() * itemsOfRarity.length)];

    return { ...item };
}

// Get all cosmetics as flat array
function getAllCosmetics() {
    return [
        ...COSMETICS.avatars,
        ...COSMETICS.frames,
        ...COSMETICS.effects,
        ...COSMETICS.titles
    ];
}

// Get all owned cosmetics
function getAllOwnedCosmetics() {
    const owned = [];

    for (const type of ['avatars', 'frames', 'effects', 'titles']) {
        const ownedIds = userCosmetics[type]?.owned || [];
        for (const id of ownedIds) {
            const item = COSMETICS[type].find(c => c.id === id);
            if (item) owned.push(item);
        }
    }

    return owned;
}

// Get cosmetic type from ID
function getCosmeticType(id) {
    if (id.startsWith('av_')) return 'avatars';
    if (id.startsWith('fr_')) return 'frames';
    if (id.startsWith('ef_')) return 'effects';
    if (id.startsWith('ti_')) return 'titles';
    return 'avatars';
}

// Show gacha results modal
function showGachaResults(items) {
    const modal = $('gachaResultModal');
    const grid = $('gachaResultsGrid');

    if (!modal || !grid) return;

    const rarityColors = {
        common: '#9e9e9e',
        rare: '#2196F3',
        epic: '#9C27B0',
        legendary: '#FFD700'
    };

    // Render results with staggered animation
    grid.innerHTML = items.map((item, index) => `
        <div class="gacha-result-item ${item.isNew ? 'new' : ''}"
             style="animation-delay: ${index * 0.1}s; border: 2px solid ${rarityColors[item.rarity]}">
            <div class="gacha-result-item-icon">${item.icon}</div>
            <div class="gacha-result-item-name">${item.name}</div>
            <div class="gacha-result-item-rarity" style="color: ${rarityColors[item.rarity]}">
                ${item.rarity.toUpperCase()}
            </div>
            ${item.isDuplicate ? '<div style="font-size:10px;color:var(--text2);margin-top:4px">DUPLICATE</div>' : ''}
        </div>
    `).join('');

    modal.style.display = 'flex';

    // Haptic feedback
    if (navigator.vibrate && items.some(i => i.rarity === 'legendary')) {
        navigator.vibrate([100, 50, 100, 50, 200]);
    } else if (navigator.vibrate && items.some(i => i.rarity === 'epic')) {
        navigator.vibrate([50, 50, 100]);
    }
}

// Close gacha results modal
window.closeGachaResult = function() {
    const modal = $('gachaResultModal');
    if (modal) modal.style.display = 'none';

    // Refresh cosmetic grid to show new items
    renderCosmeticGrid(activeCosmeticTab);
};

// Update avatar preview
function updateAvatarPreview() {
    if (!userCosmetics) return;

    const avatarEl = $('avatarPreviewAvatar');
    const frameEl = $('avatarPreviewFrame');
    const effectsEl = $('avatarPreviewEffects');

    // Update avatar
    if (avatarEl && userCosmetics.avatars?.equipped) {
        const avatar = COSMETICS.avatars.find(a => a.id === userCosmetics.avatars.equipped);
        if (avatar) {
            avatarEl.textContent = avatar.icon;
        }
    }

    // Update frame
    if (frameEl && userCosmetics.frames?.equipped) {
        const frame = COSMETICS.frames.find(f => f.id === userCosmetics.frames.equipped);
        if (frame) {
            frameEl.textContent = frame.icon;
            const rarityColors = {
                common: '#9e9e9e',
                rare: '#2196F3',
                epic: '#9C27B0',
                legendary: '#FFD700'
            };
            frameEl.style.color = rarityColors[frame.rarity] || '#9e9e9e';
        }
    }

    // Update effects
    if (effectsEl && userCosmetics.effects?.equipped) {
        const effect = COSMETICS.effects.find(e => e.id === userCosmetics.effects.equipped);
        if (effect) {
            effectsEl.textContent = effect.icon;
            effectsEl.style.animation = 'pulse 2s infinite';
        } else {
            effectsEl.textContent = '';
            effectsEl.style.animation = 'none';
        }
    }
}

// Update profile avatar with cosmetics
function updateProfileAvatar() {
    if (!userCosmetics) return;

    // Update profile view avatar
    const profileAvatar = $('profileAvatar');
    if (profileAvatar && userCosmetics.avatars?.equipped) {
        const avatar = COSMETICS.avatars.find(a => a.id === userCosmetics.avatars.equipped);
        if (avatar) {
            profileAvatar.textContent = avatar.icon;
        }
    }

    // Update user button
    const userBtn = $('userBtn');
    if (userBtn && user && userCosmetics.avatars?.equipped) {
        const avatar = COSMETICS.avatars.find(a => a.id === userCosmetics.avatars.equipped);
        if (avatar) {
            const initial = userBtn.querySelector('#userInitial');
            if (initial) {
                initial.textContent = avatar.icon;
            }
        }
    }
}

// Initialize cosmetics on app load
function initCosmetics() {
    initializeCosmetics();

    if (user) {
        loadUserCosmetics();
        updateProfileAvatar();
    }
}

// Add CSS for cosmetic items (inject dynamically)
function injectCosmeticStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .cosmetic-item {
            background: var(--surface2);
            border-radius: 12px;
            padding: 16px;
            text-align: center;
            cursor: pointer;
            position: relative;
            transition: all 0.2s ease;
            border: 2px solid transparent;
        }
        .cosmetic-item:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 16px rgba(0,0,0,0.3);
        }
        .cosmetic-item.locked {
            opacity: 0.5;
            filter: grayscale(100%);
        }
        .cosmetic-item.equipped {
            border-color: var(--primary) !important;
            box-shadow: 0 0 20px rgba(0, 212, 170, 0.3);
        }
        .cosmetic-item-icon {
            font-size: 48px;
            margin-bottom: 8px;
        }
        .cosmetic-item-name {
            font-size: 12px;
            font-weight: 700;
            color: var(--text1);
            margin-bottom: 4px;
        }
        .cosmetic-item-rarity {
            font-size: 10px;
            font-weight: 700;
        }
        .cosmetic-item-lock {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 32px;
            opacity: 0.8;
        }
        .cosmetic-item-equipped {
            position: absolute;
            bottom: 8px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--primary);
            color: #000;
            font-size: 8px;
            font-weight: 900;
            padding: 2px 8px;
            border-radius: 4px;
        }
        .cosmetic-item-new {
            position: absolute;
            top: 8px;
            right: 8px;
            background: #FFD700;
            color: #000;
            font-size: 8px;
            font-weight: 900;
            padding: 2px 6px;
            border-radius: 4px;
            animation: pulse 1s infinite;
        }
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }
    `;
    document.head.appendChild(style);
}

// Call inject on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectCosmeticStyles);
} else {
    injectCosmeticStyles();
}
