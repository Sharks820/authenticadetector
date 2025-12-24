// ============================================================
// UNITY-STYLE AVATAR CUSTOMIZATION SYSTEM
// ============================================================
// Professional character designer with 50+ parts, rarity tiers,
// color customization, and anime/cartoon style characters

// ==================== AVATAR PARTS DATABASE ====================

const AVATAR_PARTS = {
    // HEAD - Base character faces (20 options)
    head: {
        default: { id: 'default', name: 'Default Face', emoji: '😊', rarity: 'common', price: 0, colors: ['skin'] },

        // Common Heads (50-100 coins)
        anime_boy: { id: 'anime_boy', name: 'Anime Boy', emoji: '👦', rarity: 'common', price: 50, colors: ['skin', 'blush'] },
        anime_girl: { id: 'anime_girl', name: 'Anime Girl', emoji: '👧', rarity: 'common', price: 50, colors: ['skin', 'blush'] },
        robot_head: { id: 'robot_head', name: 'Robot Head', emoji: '🤖', rarity: 'common', price: 80, colors: ['metal'] },
        cat_face: { id: 'cat_face', name: 'Cat Face', emoji: '😺', rarity: 'common', price: 70, colors: ['fur'] },

        // Uncommon Heads (150-250 coins)
        cyborg_face: { id: 'cyborg_face', name: 'Cyborg Face', emoji: '🦾', rarity: 'uncommon', price: 150, colors: ['skin', 'metal'] },
        alien_head: { id: 'alien_head', name: 'Alien Head', emoji: '👽', rarity: 'uncommon', price: 180, colors: ['skin'] },
        masked_hero: { id: 'masked_hero', name: 'Masked Hero', emoji: '🦸', rarity: 'uncommon', price: 200, colors: ['mask'] },
        elf_face: { id: 'elf_face', name: 'Elf Face', emoji: '🧝', rarity: 'uncommon', price: 220, colors: ['skin'] },

        // Rare Heads (300-500 coins)
        demon_face: { id: 'demon_face', name: 'Demon Face', emoji: '👹', rarity: 'rare', price: 300, colors: ['skin', 'horns'] },
        angel_face: { id: 'angel_face', name: 'Angel Face', emoji: '😇', rarity: 'rare', price: 350, colors: ['skin', 'halo'] },
        vampire_face: { id: 'vampire_face', name: 'Vampire Face', emoji: '🧛', rarity: 'rare', price: 400, colors: ['skin'] },
        dragon_face: { id: 'dragon_face', name: 'Dragon Face', emoji: '🐉', rarity: 'rare', price: 450, colors: ['scales'] },

        // Epic Heads (600-900 coins)
        mecha_pilot: { id: 'mecha_pilot', name: 'Mecha Pilot', emoji: '🎮', rarity: 'epic', price: 600, colors: ['skin', 'visor'] },
        neon_face: { id: 'neon_face', name: 'Neon Face', emoji: '✨', rarity: 'epic', price: 700, colors: ['glow'] },
        hologram: { id: 'hologram', name: 'Hologram', emoji: '👾', rarity: 'epic', price: 800, colors: ['hologram'] },

        // Legendary Heads (1000+ coins)
        ultimate_hero: { id: 'ultimate_hero', name: 'Ultimate Hero', emoji: '🌟', rarity: 'legendary', price: 1000, colors: ['skin', 'aura'] },
        divine_being: { id: 'divine_being', name: 'Divine Being', emoji: '👼', rarity: 'legendary', price: 1500, colors: ['divine'] },
        cosmic_entity: { id: 'cosmic_entity', name: 'Cosmic Entity', emoji: '🌌', rarity: 'legendary', price: 2000, colors: ['cosmic'] }
    },

    // HAIR - Hairstyles (15 options)
    hair: {
        none: { id: 'none', name: 'Bald', emoji: '🦲', rarity: 'common', price: 0, colors: [] },

        // Common Hair (50-100 coins)
        short_hair: { id: 'short_hair', name: 'Short Hair', emoji: '💇', rarity: 'common', price: 50, colors: ['hair'] },
        long_hair: { id: 'long_hair', name: 'Long Hair', emoji: '💇‍♀️', rarity: 'common', price: 60, colors: ['hair'] },
        spiky_hair: { id: 'spiky_hair', name: 'Spiky Hair', emoji: '💥', rarity: 'common', price: 70, colors: ['hair'] },
        ponytail: { id: 'ponytail', name: 'Ponytail', emoji: '🎀', rarity: 'common', price: 80, colors: ['hair'] },

        // Uncommon Hair (150-250 coins)
        twin_tails: { id: 'twin_tails', name: 'Twin Tails', emoji: '🎭', rarity: 'uncommon', price: 150, colors: ['hair'] },
        mohawk: { id: 'mohawk', name: 'Mohawk', emoji: '🎸', rarity: 'uncommon', price: 180, colors: ['hair'] },
        afro: { id: 'afro', name: 'Afro', emoji: '💈', rarity: 'uncommon', price: 200, colors: ['hair'] },

        // Rare Hair (300-500 coins)
        anime_spikes: { id: 'anime_spikes', name: 'Anime Spikes', emoji: '⚡', rarity: 'rare', price: 300, colors: ['hair'] },
        flowing_locks: { id: 'flowing_locks', name: 'Flowing Locks', emoji: '🌊', rarity: 'rare', price: 350, colors: ['hair'] },

        // Epic Hair (600-900 coins)
        rainbow_hair: { id: 'rainbow_hair', name: 'Rainbow Hair', emoji: '🌈', rarity: 'epic', price: 600, colors: ['hair1', 'hair2', 'hair3'] },
        fire_hair: { id: 'fire_hair', name: 'Fire Hair', emoji: '🔥', rarity: 'epic', price: 700, colors: ['fire'] },

        // Legendary Hair (1000+ coins)
        cosmic_hair: { id: 'cosmic_hair', name: 'Cosmic Hair', emoji: '🌌', rarity: 'legendary', price: 1000, colors: ['cosmic'] },
        energy_hair: { id: 'energy_hair', name: 'Energy Hair', emoji: '⚡', rarity: 'legendary', price: 1500, colors: ['energy'] }
    },

    // FACE - Facial features (10 options)
    face: {
        none: { id: 'none', name: 'Default', emoji: '😐', rarity: 'common', price: 0, colors: [] },

        smile: { id: 'smile', name: 'Happy Smile', emoji: '😊', rarity: 'common', price: 30, colors: [] },
        serious: { id: 'serious', name: 'Serious', emoji: '😐', rarity: 'common', price: 40, colors: [] },
        angry: { id: 'angry', name: 'Angry', emoji: '😠', rarity: 'uncommon', price: 150, colors: [] },
        excited: { id: 'excited', name: 'Excited', emoji: '😄', rarity: 'uncommon', price: 180, colors: [] },
        cool: { id: 'cool', name: 'Cool', emoji: '😎', rarity: 'rare', price: 300, colors: [] },
        determined: { id: 'determined', name: 'Determined', emoji: '😤', rarity: 'rare', price: 350, colors: [] },
        smirk: { id: 'smirk', name: 'Smirk', emoji: '😏', rarity: 'epic', price: 600, colors: [] },
        warrior: { id: 'warrior', name: 'Warrior', emoji: '⚔️', rarity: 'epic', price: 700, colors: [] },
        ultimate: { id: 'ultimate', name: 'Ultimate', emoji: '🌟', rarity: 'legendary', price: 1000, colors: [] }
    },

    // EYES - Eye styles (12 options)
    eyes: {
        default: { id: 'default', name: 'Normal Eyes', emoji: '👀', rarity: 'common', price: 0, colors: ['eyes'] },

        anime_eyes: { id: 'anime_eyes', name: 'Anime Eyes', emoji: '✨', rarity: 'common', price: 50, colors: ['eyes'] },
        robot_eyes: { id: 'robot_eyes', name: 'Robot Eyes', emoji: '🤖', rarity: 'common', price: 60, colors: ['eyes'] },
        cat_eyes: { id: 'cat_eyes', name: 'Cat Eyes', emoji: '😸', rarity: 'uncommon', price: 150, colors: ['eyes'] },
        snake_eyes: { id: 'snake_eyes', name: 'Snake Eyes', emoji: '🐍', rarity: 'uncommon', price: 180, colors: ['eyes'] },
        glowing_eyes: { id: 'glowing_eyes', name: 'Glowing Eyes', emoji: '👁️', rarity: 'rare', price: 300, colors: ['eyes', 'glow'] },
        laser_eyes: { id: 'laser_eyes', name: 'Laser Eyes', emoji: '🔴', rarity: 'rare', price: 350, colors: ['laser'] },
        fire_eyes: { id: 'fire_eyes', name: 'Fire Eyes', emoji: '🔥', rarity: 'epic', price: 600, colors: ['fire'] },
        galaxy_eyes: { id: 'galaxy_eyes', name: 'Galaxy Eyes', emoji: '🌌', rarity: 'epic', price: 700, colors: ['cosmic'] },
        divine_eyes: { id: 'divine_eyes', name: 'Divine Eyes', emoji: '✨', rarity: 'legendary', price: 1000, colors: ['divine'] }
    },

    // TOP - Upper body clothing (15 options)
    top: {
        none: { id: 'none', name: 'Bare Chest', emoji: '👕', rarity: 'common', price: 0, colors: [] },

        // Common Tops (50-100 coins)
        tshirt: { id: 'tshirt', name: 'T-Shirt', emoji: '👕', rarity: 'common', price: 50, colors: ['shirt'] },
        hoodie: { id: 'hoodie', name: 'Hoodie', emoji: '🧥', rarity: 'common', price: 70, colors: ['hoodie'] },
        tank_top: { id: 'tank_top', name: 'Tank Top', emoji: '🎽', rarity: 'common', price: 60, colors: ['shirt'] },

        // Uncommon Tops (150-250 coins)
        jacket: { id: 'jacket', name: 'Jacket', emoji: '🧥', rarity: 'uncommon', price: 150, colors: ['jacket'] },
        vest: { id: 'vest', name: 'Tactical Vest', emoji: '🦺', rarity: 'uncommon', price: 180, colors: ['vest'] },
        suit: { id: 'suit', name: 'Business Suit', emoji: '🤵', rarity: 'uncommon', price: 200, colors: ['suit'] },

        // Rare Tops (300-500 coins)
        armor: { id: 'armor', name: 'Battle Armor', emoji: '🛡️', rarity: 'rare', price: 300, colors: ['armor'] },
        ninja_gi: { id: 'ninja_gi', name: 'Ninja Gi', emoji: '🥋', rarity: 'rare', price: 350, colors: ['gi'] },
        cyber_jacket: { id: 'cyber_jacket', name: 'Cyber Jacket', emoji: '💾', rarity: 'rare', price: 400, colors: ['cyber'] },

        // Epic Tops (600-900 coins)
        power_armor: { id: 'power_armor', name: 'Power Armor', emoji: '🦾', rarity: 'epic', price: 600, colors: ['armor', 'energy'] },
        mecha_suit: { id: 'mecha_suit', name: 'Mecha Suit', emoji: '🤖', rarity: 'epic', price: 700, colors: ['mecha'] },

        // Legendary Tops (1000+ coins)
        divine_robe: { id: 'divine_robe', name: 'Divine Robe', emoji: '👼', rarity: 'legendary', price: 1000, colors: ['divine'] },
        cosmic_armor: { id: 'cosmic_armor', name: 'Cosmic Armor', emoji: '🌌', rarity: 'legendary', price: 1500, colors: ['cosmic'] }
    },

    // BOTTOM - Lower body clothing (12 options)
    bottom: {
        none: { id: 'none', name: 'Default', emoji: '👖', rarity: 'common', price: 0, colors: [] },

        jeans: { id: 'jeans', name: 'Jeans', emoji: '👖', rarity: 'common', price: 50, colors: ['pants'] },
        shorts: { id: 'shorts', name: 'Shorts', emoji: '🩳', rarity: 'common', price: 60, colors: ['shorts'] },
        cargo_pants: { id: 'cargo_pants', name: 'Cargo Pants', emoji: '🪖', rarity: 'uncommon', price: 150, colors: ['pants'] },
        skirt: { id: 'skirt', name: 'Skirt', emoji: '👗', rarity: 'uncommon', price: 180, colors: ['skirt'] },
        tactical_pants: { id: 'tactical_pants', name: 'Tactical Pants', emoji: '🦺', rarity: 'rare', price: 300, colors: ['tactical'] },
        ninja_pants: { id: 'ninja_pants', name: 'Ninja Pants', emoji: '🥋', rarity: 'rare', price: 350, colors: ['ninja'] },
        armor_legs: { id: 'armor_legs', name: 'Armor Legs', emoji: '🛡️', rarity: 'epic', price: 600, colors: ['armor'] },
        mecha_legs: { id: 'mecha_legs', name: 'Mecha Legs', emoji: '🤖', rarity: 'epic', price: 700, colors: ['mecha'] },
        cosmic_pants: { id: 'cosmic_pants', name: 'Cosmic Pants', emoji: '🌌', rarity: 'legendary', price: 1000, colors: ['cosmic'] }
    },

    // SHOES - Footwear (10 options)
    shoes: {
        none: { id: 'none', name: 'Barefoot', emoji: '🦶', rarity: 'common', price: 0, colors: [] },

        sneakers: { id: 'sneakers', name: 'Sneakers', emoji: '👟', rarity: 'common', price: 50, colors: ['shoes'] },
        boots: { id: 'boots', name: 'Boots', emoji: '🥾', rarity: 'common', price: 60, colors: ['boots'] },
        sandals: { id: 'sandals', name: 'Sandals', emoji: '🩴', rarity: 'common', price: 40, colors: ['sandals'] },
        combat_boots: { id: 'combat_boots', name: 'Combat Boots', emoji: '🥾', rarity: 'uncommon', price: 150, colors: ['boots'] },
        ninja_shoes: { id: 'ninja_shoes', name: 'Ninja Shoes', emoji: '🥋', rarity: 'rare', price: 300, colors: ['ninja'] },
        rocket_boots: { id: 'rocket_boots', name: 'Rocket Boots', emoji: '🚀', rarity: 'epic', price: 600, colors: ['boots', 'fire'] },
        hover_boots: { id: 'hover_boots', name: 'Hover Boots', emoji: '✨', rarity: 'epic', price: 700, colors: ['boots', 'energy'] },
        cosmic_boots: { id: 'cosmic_boots', name: 'Cosmic Boots', emoji: '🌌', rarity: 'legendary', price: 1000, colors: ['cosmic'] }
    },

    // ACCESSORIES - Hats, glasses, etc (20 options)
    accessories: {
        none: { id: 'none', name: 'None', emoji: '❌', rarity: 'common', price: 0, colors: [] },

        // Hats (Common to Epic)
        cap: { id: 'cap', name: 'Baseball Cap', emoji: '🧢', rarity: 'common', price: 50, colors: ['cap'] },
        beanie: { id: 'beanie', name: 'Beanie', emoji: '🎩', rarity: 'common', price: 60, colors: ['beanie'] },
        helmet: { id: 'helmet', name: 'Helmet', emoji: '⛑️', rarity: 'uncommon', price: 150, colors: ['helmet'] },
        crown: { id: 'crown', name: 'Crown', emoji: '👑', rarity: 'rare', price: 300, colors: ['gold'] },
        halo: { id: 'halo', name: 'Halo', emoji: '😇', rarity: 'epic', price: 600, colors: ['divine'] },

        // Glasses
        sunglasses: { id: 'sunglasses', name: 'Sunglasses', emoji: '🕶️', rarity: 'common', price: 80, colors: ['lens'] },
        goggles: { id: 'goggles', name: 'Goggles', emoji: '🥽', rarity: 'uncommon', price: 180, colors: ['goggles'] },
        visor: { id: 'visor', name: 'Cyber Visor', emoji: '👾', rarity: 'rare', price: 350, colors: ['visor'] },

        // Masks
        mask: { id: 'mask', name: 'Face Mask', emoji: '😷', rarity: 'common', price: 70, colors: ['mask'] },
        ninja_mask: { id: 'ninja_mask', name: 'Ninja Mask', emoji: '🥷', rarity: 'uncommon', price: 200, colors: ['mask'] },
        gas_mask: { id: 'gas_mask', name: 'Gas Mask', emoji: '⚠️', rarity: 'rare', price: 400, colors: ['mask'] },

        // Wings/Back Items
        wings: { id: 'wings', name: 'Angel Wings', emoji: '👼', rarity: 'epic', price: 700, colors: ['wings'] },
        demon_wings: { id: 'demon_wings', name: 'Demon Wings', emoji: '👹', rarity: 'epic', price: 750, colors: ['wings'] },
        jetpack: { id: 'jetpack', name: 'Jetpack', emoji: '🚀', rarity: 'epic', price: 800, colors: ['jetpack'] },

        // Legendary
        divine_aura: { id: 'divine_aura', name: 'Divine Aura', emoji: '✨', rarity: 'legendary', price: 1000, colors: ['aura'] },
        cosmic_aura: { id: 'cosmic_aura', name: 'Cosmic Aura', emoji: '🌌', rarity: 'legendary', price: 1500, colors: ['cosmic'] }
    }
};

// ==================== COLOR PALETTES ====================

const COLOR_PALETTES = {
    skin: [
        { name: 'Light', hex: '#FFDFC4' },
        { name: 'Medium', hex: '#F0C4A0' },
        { name: 'Tan', hex: '#D1A684' },
        { name: 'Dark', hex: '#8D5524' },
        { name: 'Pale', hex: '#FFE5D9' },
        { name: 'Olive', hex: '#C4A582' }
    ],
    hair: [
        { name: 'Black', hex: '#1a1a1a' },
        { name: 'Brown', hex: '#5C4033' },
        { name: 'Blonde', hex: '#F4D03F' },
        { name: 'Red', hex: '#C0392B' },
        { name: 'Blue', hex: '#3498DB' },
        { name: 'Pink', hex: '#E91E63' },
        { name: 'Purple', hex: '#9B59B6' },
        { name: 'Green', hex: '#27AE60' },
        { name: 'White', hex: '#ECF0F1' },
        { name: 'Silver', hex: '#BDC3C7' }
    ],
    eyes: [
        { name: 'Brown', hex: '#5C4033' },
        { name: 'Blue', hex: '#3498DB' },
        { name: 'Green', hex: '#27AE60' },
        { name: 'Gray', hex: '#7F8C8D' },
        { name: 'Amber', hex: '#F39C12' },
        { name: 'Red', hex: '#E74C3C' },
        { name: 'Purple', hex: '#9B59B6' },
        { name: 'Yellow', hex: '#F1C40F' }
    ],
    clothing: [
        { name: 'White', hex: '#ECF0F1' },
        { name: 'Black', hex: '#2C3E50' },
        { name: 'Red', hex: '#E74C3C' },
        { name: 'Blue', hex: '#3498DB' },
        { name: 'Green', hex: '#27AE60' },
        { name: 'Yellow', hex: '#F39C12' },
        { name: 'Purple', hex: '#9B59B6' },
        { name: 'Pink', hex: '#E91E63' },
        { name: 'Orange', hex: '#E67E22' },
        { name: 'Gray', hex: '#95A5A6' },
        { name: 'Brown', hex: '#A0826D' },
        { name: 'Navy', hex: '#34495E' }
    ],
    special: [
        { name: 'Gold', hex: '#FFD700' },
        { name: 'Silver', hex: '#C0C0C0' },
        { name: 'Bronze', hex: '#CD7F32' },
        { name: 'Neon Blue', hex: '#00FFFF' },
        { name: 'Neon Pink', hex: '#FF00FF' },
        { name: 'Neon Green', hex: '#00FF00' },
        { name: 'Fire', hex: '#FF4500' },
        { name: 'Ice', hex: '#00CED1' },
        { name: 'Lightning', hex: '#FFFF00' },
        { name: 'Cosmic', hex: '#4B0082' }
    ]
};

// ==================== RARITY SYSTEM ====================

const RARITY_TIERS = {
    common: {
        color: '#95a5a6',
        gradient: 'linear-gradient(135deg, #95a5a6, #7f8c8d)',
        glow: 'rgba(149, 165, 166, 0.3)',
        weight: 50
    },
    uncommon: {
        color: '#3498db',
        gradient: 'linear-gradient(135deg, #3498db, #2980b9)',
        glow: 'rgba(52, 152, 219, 0.4)',
        weight: 30
    },
    rare: {
        color: '#9b59b6',
        gradient: 'linear-gradient(135deg, #9b59b6, #8e44ad)',
        glow: 'rgba(155, 89, 182, 0.5)',
        weight: 15
    },
    epic: {
        color: '#f39c12',
        gradient: 'linear-gradient(135deg, #f39c12, #e67e22)',
        glow: 'rgba(243, 156, 18, 0.6)',
        weight: 4
    },
    legendary: {
        color: '#e74c3c',
        gradient: 'linear-gradient(135deg, #e74c3c, #c0392b)',
        glow: 'rgba(231, 76, 60, 0.7)',
        weight: 1
    }
};

// ==================== USER AVATAR STATE ====================

let userAvatar = {
    equipped: {
        head: 'default',
        hair: 'short_hair',
        face: 'smile',
        eyes: 'default',
        top: 'tshirt',
        bottom: 'jeans',
        shoes: 'sneakers',
        accessories: 'none'
    },
    colors: {
        skin: '#FFDFC4',
        hair: '#5C4033',
        eyes: '#3498DB',
        shirt: '#3498DB',
        pants: '#2C3E50',
        shoes: '#ECF0F1'
    },
    owned: {
        head: ['default'],
        hair: ['none', 'short_hair'],
        face: ['none', 'smile'],
        eyes: ['default'],
        top: ['none', 'tshirt'],
        bottom: ['none', 'jeans'],
        shoes: ['none', 'sneakers'],
        accessories: ['none']
    },
    stats: {
        totalPurchases: 0,
        coinsSpent: 0,
        favoriteCategory: null
    }
};

// ==================== INITIALIZATION ====================

function initAvatarSystem() {
    console.log('[Avatar] Initializing Unity-style avatar system...');

    // Load saved avatar
    loadAvatarFromStorage();

    // Render UI
    renderAvatarPreview();
    renderItemsGrid('all');
    updateEquippedSlots();

    console.log('[Avatar] System initialized');
}

function loadAvatarFromStorage() {
    try {
        const saved = localStorage.getItem('user_avatar_v2');
        if (saved) {
            const data = JSON.parse(saved);
            userAvatar = { ...userAvatar, ...data };
            console.log('[Avatar] Loaded from storage');
        }
    } catch (e) {
        console.error('[Avatar] Load error:', e);
    }
}

function saveAvatarToStorage() {
    try {
        localStorage.setItem('user_avatar_v2', JSON.stringify(userAvatar));
        console.log('[Avatar] Saved to storage');
    } catch (e) {
        console.error('[Avatar] Save error:', e);
    }
}

// ==================== PREVIEW RENDERING ====================

function renderAvatarPreview() {
    const container = document.getElementById('characterContainer');
    if (!container) return;

    // Clear existing layers
    const layers = ['charBack', 'charHat', 'charHead', 'charGlasses', 'charLeftArm',
                   'charTorso', 'charRightArm', 'charWeapon', 'charLegs', 'charPet'];

    layers.forEach(layerId => {
        const layer = document.getElementById(layerId);
        if (layer) {
            layer.innerHTML = '';
            layer.style.background = 'transparent';
        }
    });

    // Render each body part
    renderBodyPart('head', 'charHead');
    renderBodyPart('hair', 'charHead');
    renderBodyPart('face', 'charHead');
    renderBodyPart('eyes', 'charGlasses');
    renderBodyPart('top', 'charTorso');
    renderBodyPart('bottom', 'charLegs');
    renderBodyPart('shoes', 'charLegs');
    renderBodyPart('accessories', 'charHat');

    // Update character name
    updateCharacterName();
}

function renderBodyPart(slot, layerId) {
    const partId = userAvatar.equipped[slot];
    if (!partId || partId === 'none') return;

    const parts = AVATAR_PARTS[slot];
    if (!parts) return;

    const part = parts[partId];
    if (!part) return;

    const layer = document.getElementById(layerId);
    if (!layer) return;

    // Create visual element
    const visual = document.createElement('div');
    visual.className = 'avatar-part-visual';
    visual.style.cssText = `
        font-size: 80px;
        text-align: center;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        filter: drop-shadow(0 2px 8px rgba(0,0,0,0.3));
    `;
    visual.textContent = part.emoji;

    // Apply colors
    if (part.colors && part.colors.length > 0) {
        const primaryColor = part.colors[0];
        if (userAvatar.colors[primaryColor]) {
            visual.style.filter = `drop-shadow(0 2px 8px ${userAvatar.colors[primaryColor]})`;
        }
    }

    layer.appendChild(visual);
}

function updateCharacterName() {
    const nameLabel = document.getElementById('characterNameLabel');
    if (nameLabel) {
        const head = AVATAR_PARTS.head[userAvatar.equipped.head];
        nameLabel.textContent = head ? head.name : 'Truth Seeker';
    }
}

// ==================== ITEMS GRID RENDERING ====================

function renderItemsGrid(category) {
    const grid = document.getElementById('itemsSelectionGrid');
    if (!grid) return;

    grid.innerHTML = '';

    // Determine which categories to show
    const categories = category === 'all'
        ? Object.keys(AVATAR_PARTS)
        : [category];

    categories.forEach(cat => {
        const parts = AVATAR_PARTS[cat];
        if (!parts) return;

        Object.values(parts).forEach(part => {
            const owned = userAvatar.owned[cat]?.includes(part.id) || false;
            const equipped = userAvatar.equipped[cat] === part.id;

            const item = createItemCard(part, cat, owned, equipped);
            grid.appendChild(item);
        });
    });
}

function createItemCard(part, category, owned, equipped) {
    const card = document.createElement('div');
    card.className = `avatar-item-card ${owned ? 'owned' : 'locked'} ${equipped ? 'equipped' : ''}`;
    card.style.cssText = `
        background: ${RARITY_TIERS[part.rarity].gradient};
        border: 2px solid ${RARITY_TIERS[part.rarity].color};
        border-radius: 12px;
        padding: 16px;
        cursor: ${owned ? 'pointer' : 'default'};
        position: relative;
        transition: all 0.3s;
        opacity: ${owned ? '1' : '0.6'};
    `;

    // Emoji icon
    const icon = document.createElement('div');
    icon.className = 'item-icon';
    icon.style.cssText = 'font-size: 48px; text-align: center; margin-bottom: 8px;';
    icon.textContent = part.emoji;

    // Name
    const name = document.createElement('div');
    name.className = 'item-name';
    name.style.cssText = 'font-size: 14px; font-weight: 600; color: white; text-align: center; margin-bottom: 4px;';
    name.textContent = part.name;

    // Rarity badge
    const rarity = document.createElement('div');
    rarity.className = 'item-rarity';
    rarity.style.cssText = `font-size: 11px; color: ${RARITY_TIERS[part.rarity].color}; text-align: center; text-transform: uppercase; font-weight: 700; margin-bottom: 8px;`;
    rarity.textContent = part.rarity;

    card.appendChild(icon);
    card.appendChild(name);
    card.appendChild(rarity);

    // Price or status
    if (!owned) {
        const price = document.createElement('div');
        price.className = 'item-price';
        price.style.cssText = 'font-size: 13px; color: #f39c12; text-align: center; font-weight: 700;';
        price.textContent = `🪙 ${part.price}`;
        card.appendChild(price);

        card.onclick = () => purchaseAvatarPart(category, part.id);
    } else {
        if (equipped) {
            const status = document.createElement('div');
            status.className = 'item-status';
            status.style.cssText = 'font-size: 11px; color: #2ecc71; text-align: center; font-weight: 700;';
            status.textContent = '✓ EQUIPPED';
            card.appendChild(status);
        } else {
            const button = document.createElement('button');
            button.className = 'equip-btn';
            button.style.cssText = `
                width: 100%;
                padding: 8px;
                background: rgba(255, 255, 255, 0.2);
                border: 1px solid rgba(255, 255, 255, 0.3);
                border-radius: 6px;
                color: white;
                font-size: 12px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s;
            `;
            button.textContent = 'EQUIP';
            button.onclick = (e) => {
                e.stopPropagation();
                equipAvatarPart(category, part.id);
            };
            card.appendChild(button);
        }

        card.onclick = () => equipAvatarPart(category, part.id);
    }

    // Hover effect
    card.onmouseenter = () => {
        if (owned) {
            card.style.transform = 'translateY(-4px)';
            card.style.boxShadow = `0 8px 24px ${RARITY_TIERS[part.rarity].glow}`;
        }
    };
    card.onmouseleave = () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = 'none';
    };

    return card;
}

// ==================== PURCHASE & EQUIP ====================

async function purchaseAvatarPart(category, partId) {
    const parts = AVATAR_PARTS[category];
    if (!parts) return;

    const part = parts[partId];
    if (!part) return;

    // Check if already owned
    if (userAvatar.owned[category]?.includes(partId)) {
        showNotification('You already own this item!', 'warning');
        return;
    }

    // Check coins (integrate with existing coin system)
    if (typeof userProgression !== 'undefined') {
        if (userProgression.truth_coins < part.price) {
            showNotification(`Not enough coins! Need ${part.price} 🪙`, 'error');
            return;
        }

        // Deduct coins (use existing spendCoins if available)
        if (typeof spendCoins === 'function') {
            const success = await spendCoins(part.price);
            if (!success) {
                showNotification('Purchase failed!', 'error');
                return;
            }
        } else {
            userProgression.truth_coins -= part.price;
        }
    }

    // Add to owned
    if (!userAvatar.owned[category]) {
        userAvatar.owned[category] = [];
    }
    userAvatar.owned[category].push(partId);

    // Update stats
    userAvatar.stats.totalPurchases++;
    userAvatar.stats.coinsSpent += part.price;

    // Save
    saveAvatarToStorage();

    // Update UI
    renderItemsGrid(category);
    updateEquippedSlots();

    showNotification(`Purchased ${part.name}! 🎉`, 'success');

    // Auto-equip
    equipAvatarPart(category, partId);
}

function equipAvatarPart(category, partId) {
    if (!userAvatar.owned[category]?.includes(partId)) {
        showNotification('You don\'t own this item!', 'error');
        return;
    }

    userAvatar.equipped[category] = partId;
    saveAvatarToStorage();

    // Update preview
    renderAvatarPreview();
    updateEquippedSlots();

    // Update UI
    const activeTab = document.querySelector('.body-part-tab.active');
    if (activeTab) {
        const activeCat = activeTab.dataset.part;
        renderItemsGrid(activeCat);
    }

    // Update profile avatar if visible
    updateProfileAvatar();

    const part = AVATAR_PARTS[category][partId];
    showNotification(`Equipped ${part.name}!`, 'success');
}

// ==================== COLOR CUSTOMIZATION ====================

function openColorPicker(slot, colorKey) {
    const palette = getColorPaletteForKey(colorKey);
    if (!palette) return;

    // Create color picker modal
    const modal = document.createElement('div');
    modal.className = 'color-picker-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
    `;

    const content = document.createElement('div');
    content.style.cssText = `
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        border: 2px solid #1abc9c;
        border-radius: 20px;
        padding: 24px;
        max-width: 500px;
        width: 100%;
    `;

    const title = document.createElement('h3');
    title.style.cssText = 'color: white; margin: 0 0 16px 0; text-align: center;';
    title.textContent = `Choose ${colorKey} Color`;

    const grid = document.createElement('div');
    grid.style.cssText = `
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
        gap: 12px;
        margin-bottom: 16px;
    `;

    palette.forEach(color => {
        const swatch = document.createElement('div');
        swatch.style.cssText = `
            width: 60px;
            height: 60px;
            background: ${color.hex};
            border: 3px solid ${userAvatar.colors[colorKey] === color.hex ? '#1abc9c' : 'transparent'};
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s;
        `;
        swatch.title = color.name;

        swatch.onclick = () => {
            userAvatar.colors[colorKey] = color.hex;
            saveAvatarToStorage();
            renderAvatarPreview();
            modal.remove();
            showNotification(`Color changed to ${color.name}!`, 'success');
        };

        swatch.onmouseenter = () => {
            swatch.style.transform = 'scale(1.1)';
            swatch.style.boxShadow = `0 4px 12px ${color.hex}`;
        };
        swatch.onmouseleave = () => {
            swatch.style.transform = 'scale(1)';
            swatch.style.boxShadow = 'none';
        };

        grid.appendChild(swatch);
    });

    const closeBtn = document.createElement('button');
    closeBtn.style.cssText = `
        width: 100%;
        padding: 12px;
        background: linear-gradient(135deg, #e74c3c, #c0392b);
        border: none;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        cursor: pointer;
    `;
    closeBtn.textContent = 'Close';
    closeBtn.onclick = () => modal.remove();

    content.appendChild(title);
    content.appendChild(grid);
    content.appendChild(closeBtn);
    modal.appendChild(content);
    document.body.appendChild(modal);
}

function getColorPaletteForKey(key) {
    if (key === 'skin') return COLOR_PALETTES.skin;
    if (key === 'hair' || key === 'hair1' || key === 'hair2' || key === 'hair3') return COLOR_PALETTES.hair;
    if (key === 'eyes') return COLOR_PALETTES.eyes;
    if (key.includes('cosmic') || key.includes('divine') || key.includes('energy')) return COLOR_PALETTES.special;
    return COLOR_PALETTES.clothing;
}

// ==================== EQUIPPED SLOTS UI ====================

function updateEquippedSlots() {
    const slots = ['head', 'torso', 'legs', 'weapon', 'hat', 'glasses', 'back', 'pet'];

    slots.forEach(slotName => {
        const slotIcon = document.getElementById(`slot${capitalize(slotName)}Icon`);
        if (!slotIcon) return;

        const category = getSlotCategory(slotName);
        const partId = userAvatar.equipped[category];

        if (!partId || partId === 'none') {
            slotIcon.textContent = '❌';
            return;
        }

        const parts = AVATAR_PARTS[category];
        if (!parts) return;

        const part = parts[partId];
        if (part) {
            slotIcon.textContent = part.emoji;
        }
    });

    // Update count
    const count = Object.values(userAvatar.equipped).filter(id => id && id !== 'none').length;
    const countEl = document.getElementById('equippedCount');
    if (countEl) {
        countEl.textContent = `${count}/8`;
    }
}

function getSlotCategory(slotName) {
    const mapping = {
        head: 'head',
        torso: 'top',
        legs: 'bottom',
        weapon: 'accessories',
        hat: 'accessories',
        glasses: 'accessories',
        back: 'accessories',
        pet: 'accessories'
    };
    return mapping[slotName] || slotName;
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// ==================== FILTER ITEMS ====================

window.filterDesignerItems = function(category, button) {
    // Update active tab
    document.querySelectorAll('.body-part-tab').forEach(btn => {
        btn.classList.remove('active');
    });
    if (button) {
        button.classList.add('active');
    }

    // Render items
    renderItemsGrid(category);
};

window.selectBodyPart = function(slotName) {
    const category = getSlotCategory(slotName);
    const button = document.querySelector(`.body-part-tab[data-part="${category}"]`);
    if (button) {
        filterDesignerItems(category, button);
    }
};

// ==================== PROFILE INTEGRATION ====================

function updateProfileAvatar() {
    // Update large profile avatar
    const profileAvatar = document.getElementById('homeAvatarDisplay');
    if (profileAvatar) {
        const avatarEmoji = document.getElementById('homeAvatarEmoji');
        if (avatarEmoji) {
            const head = AVATAR_PARTS.head[userAvatar.equipped.head];
            if (head) {
                avatarEmoji.textContent = head.emoji;
            }
        }
    }

    // Update small avatars (leaderboard, etc)
    updateLeaderboardAvatars();
}

function updateLeaderboardAvatars() {
    // This will be called from leaderboard rendering
    // Return current avatar emoji for display
    const head = AVATAR_PARTS.head[userAvatar.equipped.head];
    return head ? head.emoji : '🧑‍🚀';
}

// ==================== TANK INTEGRATION ====================

function getAvatarForTank() {
    // Return avatar data for tank game
    return {
        head: userAvatar.equipped.head,
        headEmoji: AVATAR_PARTS.head[userAvatar.equipped.head]?.emoji || '🧑‍🚀',
        accessories: userAvatar.equipped.accessories,
        colors: userAvatar.colors
    };
}

// ==================== NOTIFICATIONS ====================

function showNotification(message, type = 'info') {
    // Use existing notification system if available
    if (typeof showCosmeticNotification === 'function') {
        showCosmeticNotification(message, type);
        return;
    }

    const colors = {
        success: '#2ecc71',
        error: '#e74c3c',
        warning: '#f39c12',
        info: '#3498db'
    };

    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        font-weight: 600;
        z-index: 20000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ==================== CHARACTER MODE ====================

window.setCharacterMode = function(mode) {
    const container = document.getElementById('characterContainer');
    const tankContainer = document.getElementById('tankRideContainer');
    const standBtn = document.getElementById('standModeBtn');
    const tankBtn = document.getElementById('tankModeBtn');

    if (mode === 'stand') {
        container?.classList.remove('riding');
        tankContainer?.style.setProperty('display', 'none');
        standBtn?.classList.add('active');
        tankBtn?.classList.remove('active');
    } else {
        container?.classList.add('riding');
        tankContainer?.style.setProperty('display', 'flex');
        standBtn?.classList.remove('active');
        tankBtn?.classList.add('active');
    }
};

// ==================== EXPORTS ====================

window.initAvatarSystem = initAvatarSystem;
window.purchaseAvatarPart = purchaseAvatarPart;
window.equipAvatarPart = equipAvatarPart;
window.openColorPicker = openColorPicker;
window.updateProfileAvatar = updateProfileAvatar;
window.updateLeaderboardAvatars = updateLeaderboardAvatars;
window.getAvatarForTank = getAvatarForTank;

console.log('[Avatar] Unity-style avatar system loaded - 50+ parts, rarity tiers, color customization');
