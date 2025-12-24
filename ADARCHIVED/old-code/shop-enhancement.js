// SHOP ENHANCEMENT PACKAGE - Extensive Shop Items with Anime/Gacha Aesthetics
// Add this to SHOP_ITEMS object in index.html

const SHOP_ITEMS_ENHANCED = {
    // ==================== SKINS (Character Skins) ====================
    skin_cyber_phantom: {
        id: 'skin_cyber_phantom',
        name: 'Cyber Phantom',
        desc: 'Digital ghost skin with neon trails',
        category: 'skins',
        cost: 800,
        icon: 'shop-skin',
        rarity: 'epic',
        badge: 'HOT'
    },
    skin_shadow_walker: {
        id: 'skin_shadow_walker',
        name: 'Shadow Walker',
        desc: 'Dark assassin appearance',
        category: 'skins',
        cost: 600,
        icon: 'shop-skin',
        rarity: 'rare'
    },
    skin_crystal_guardian: {
        id: 'skin_crystal_guardian',
        name: 'Crystal Guardian',
        desc: 'Crystalline armor with prismatic glow',
        category: 'skins',
        cost: 1200,
        icon: 'shop-skin',
        rarity: 'epic',
        badge: 'NEW'
    },
    skin_void_wanderer: {
        id: 'skin_void_wanderer',
        name: 'Void Wanderer',
        desc: 'Cosmic entity with starfield effects',
        category: 'skins',
        cost: 2000,
        icon: 'shop-skin',
        rarity: 'legendary'
    },
    skin_sakura_blossom: {
        id: 'skin_sakura_blossom',
        name: 'Sakura Blossom',
        desc: 'Anime-style cherry blossom theme',
        category: 'skins',
        cost: 950,
        icon: 'shop-skin',
        rarity: 'epic',
        badge: 'HOT'
    },
    skin_neon_runner: {
        id: 'skin_neon_runner',
        name: 'Neon Runner',
        desc: 'Cyberpunk speed lines',
        category: 'skins',
        cost: 700,
        icon: 'shop-skin',
        rarity: 'rare'
    },

    // ==================== OUTFITS (Outfits & Armor) ====================
    outfit_battle_mage: {
        id: 'outfit_battle_mage',
        name: 'Battle Mage Robes',
        desc: 'Enchanted combat attire',
        category: 'outfits',
        cost: 850,
        icon: 'shop-outfit',
        rarity: 'epic'
    },
    outfit_cyber_samurai: {
        id: 'outfit_cyber_samurai',
        name: 'Cyber Samurai',
        desc: 'Futuristic warrior armor',
        category: 'outfits',
        cost: 1100,
        icon: 'shop-outfit',
        rarity: 'epic',
        badge: 'HOT'
    },
    outfit_void_hunter: {
        id: 'outfit_void_hunter',
        name: 'Void Hunter Gear',
        desc: 'Legendary darkness slayer outfit',
        category: 'outfits',
        cost: 1800,
        icon: 'shop-outfit',
        rarity: 'legendary'
    },
    outfit_street_ninja: {
        id: 'outfit_street_ninja',
        name: 'Street Ninja',
        desc: 'Modern stealth operative',
        category: 'outfits',
        cost: 650,
        icon: 'shop-outfit',
        rarity: 'rare'
    },
    outfit_celestial_knight: {
        id: 'outfit_celestial_knight',
        name: 'Celestial Knight',
        desc: 'Holy crusader armor with divine glow',
        category: 'outfits',
        cost: 1500,
        icon: 'shop-outfit',
        rarity: 'legendary',
        badge: 'NEW'
    },
    outfit_demon_slayer: {
        id: 'outfit_demon_slayer',
        name: 'Demon Slayer',
        desc: 'Anime-inspired demon hunter attire',
        category: 'outfits',
        cost: 1350,
        icon: 'shop-outfit',
        rarity: 'epic',
        badge: 'HOT'
    },

    // ==================== ACCESSORIES ====================
    accessory_dragon_wings: {
        id: 'accessory_dragon_wings',
        name: 'Dragon Wings',
        desc: 'Majestic dragon wing back piece',
        category: 'accessories',
        cost: 2500,
        icon: 'shop-accessory',
        rarity: 'legendary',
        badge: 'NEW'
    },
    accessory_halo_crown: {
        id: 'accessory_halo_crown',
        name: 'Halo Crown',
        desc: 'Floating angelic halo',
        category: 'accessories',
        cost: 1200,
        icon: 'shop-accessory',
        rarity: 'epic'
    },
    accessory_demon_horns: {
        id: 'accessory_demon_horns',
        name: 'Demon Horns',
        desc: 'Fearsome demonic horns',
        category: 'accessories',
        cost: 900,
        icon: 'shop-accessory',
        rarity: 'epic'
    },
    accessory_fairy_wings: {
        id: 'accessory_fairy_wings',
        name: 'Fairy Wings',
        desc: 'Iridescent butterfly wings',
        category: 'accessories',
        cost: 800,
        icon: 'shop-accessory',
        rarity: 'rare'
    },
    accessory_energy_aura: {
        id: 'accessory_energy_aura',
        name: 'Energy Aura',
        desc: 'Swirling energy field',
        category: 'accessories',
        cost: 1500,
        icon: 'shop-accessory',
        rarity: 'legendary'
    },
    accessory_fox_tails: {
        id: 'accessory_fox_tails',
        name: 'Nine-Tailed Fox',
        desc: 'Mystical kitsune tails',
        category: 'accessories',
        cost: 1800,
        icon: 'shop-accessory',
        rarity: 'legendary',
        badge: 'HOT'
    },

    // ==================== POTIONS ====================
    potion_hp_small: {
        id: 'potion_hp_small',
        name: 'Health Potion',
        desc: 'Restores 50 HP instantly',
        category: 'potions',
        cost: 50,
        icon: 'shop-potion',
        rarity: 'common'
    },
    potion_hp_large: {
        id: 'potion_hp_large',
        name: 'Greater Health Potion',
        desc: 'Restores 200 HP instantly',
        category: 'potions',
        cost: 150,
        icon: 'shop-potion',
        rarity: 'rare'
    },
    potion_mana_small: {
        id: 'potion_mana_small',
        name: 'Mana Potion',
        desc: 'Restores 50 mana',
        category: 'potions',
        cost: 50,
        icon: 'shop-potion',
        rarity: 'common'
    },
    potion_elixir_life: {
        id: 'potion_elixir_life',
        name: 'Elixir of Life',
        desc: 'Full HP + temporary max HP boost',
        category: 'potions',
        cost: 500,
        icon: 'shop-potion',
        rarity: 'epic',
        badge: 'HOT'
    },
    potion_phoenix_tears: {
        id: 'potion_phoenix_tears',
        name: 'Phoenix Tears',
        desc: 'Auto-revive on death once',
        category: 'potions',
        cost: 1200,
        icon: 'shop-potion',
        rarity: 'legendary'
    },

    // ==================== BUFFS ====================
    buff_strength: {
        id: 'buff_strength',
        name: 'Strength Surge',
        desc: '+50% attack for 30 minutes',
        category: 'buffs',
        cost: 200,
        icon: 'shop-buff',
        rarity: 'rare'
    },
    buff_speed: {
        id: 'buff_speed',
        name: 'Velocity Boost',
        desc: '+40% movement speed for 20 min',
        category: 'buffs',
        cost: 180,
        icon: 'shop-buff',
        rarity: 'rare'
    },
    buff_defense: {
        id: 'buff_defense',
        name: 'Iron Skin',
        desc: '+60% defense for 30 min',
        category: 'buffs',
        cost: 220,
        icon: 'shop-buff',
        rarity: 'rare'
    },
    buff_xp_double: {
        id: 'buff_xp_double',
        name: 'Double XP Scroll',
        desc: '2x XP gain for 1 hour',
        category: 'buffs',
        cost: 400,
        icon: 'shop-buff',
        rarity: 'epic',
        badge: 'HOT'
    },
    buff_coin_rain: {
        id: 'buff_coin_rain',
        name: 'Coin Rain',
        desc: '+75% coin drops for 45 min',
        category: 'buffs',
        cost: 350,
        icon: 'shop-buff',
        rarity: 'epic'
    },
    buff_ultimate: {
        id: 'buff_ultimate',
        name: 'Divine Blessing',
        desc: 'All stats +100% for 15 min',
        category: 'buffs',
        cost: 1000,
        icon: 'shop-buff',
        rarity: 'legendary',
        badge: 'NEW'
    },

    // ==================== BATTLE ITEMS ====================
    battle_smoke_bomb: {
        id: 'battle_smoke_bomb',
        name: 'Smoke Bomb',
        desc: 'Escape from battle instantly',
        category: 'battle_items',
        cost: 100,
        icon: 'shield',
        rarity: 'common'
    },
    battle_freeze_grenade: {
        id: 'battle_freeze_grenade',
        name: 'Freeze Grenade',
        desc: 'Stun all enemies for 5 seconds',
        category: 'battle_items',
        cost: 300,
        icon: 'shield',
        rarity: 'rare'
    },
    battle_rage_crystal: {
        id: 'battle_rage_crystal',
        name: 'Rage Crystal',
        desc: 'Berserk mode - 3x damage, take 2x',
        category: 'battle_items',
        cost: 450,
        icon: 'shield',
        rarity: 'epic'
    },

    // ==================== CURRENCY PACKS ====================
    pack_coins_small: {
        id: 'pack_coins_small',
        name: 'Coin Pouch',
        desc: '+500 coins',
        category: 'currency_packs',
        cost: 0, // Real money item
        icon: 'shop-gem',
        rarity: 'common',
        realMoney: true,
        price: '$0.99'
    },
    pack_coins_medium: {
        id: 'pack_coins_medium',
        name: 'Coin Chest',
        desc: '+2000 coins (+10% bonus)',
        category: 'currency_packs',
        cost: 0,
        icon: 'shop-gem',
        rarity: 'rare',
        realMoney: true,
        price: '$4.99',
        badge: 'HOT'
    },
    pack_coins_large: {
        id: 'pack_coins_large',
        name: 'Coin Vault',
        desc: '+5000 coins (+20% bonus)',
        category: 'currency_packs',
        cost: 0,
        icon: 'shop-gem',
        rarity: 'epic',
        realMoney: true,
        price: '$9.99'
    },
    pack_gems_small: {
        id: 'pack_gems_small',
        name: 'Gem Pack',
        desc: '+100 premium gems',
        category: 'currency_packs',
        cost: 0,
        icon: 'shop-gem',
        rarity: 'epic',
        realMoney: true,
        price: '$2.99'
    },
    pack_starter: {
        id: 'pack_starter',
        name: 'Starter Bundle',
        desc: '1500 coins + 50 gems + rare outfit',
        category: 'currency_packs',
        cost: 0,
        icon: 'shop-gem',
        rarity: 'legendary',
        realMoney: true,
        price: '$4.99',
        badge: 'HOT'
    },

    // ==================== PREMIUM ITEMS ====================
    premium_vip_pass: {
        id: 'premium_vip_pass',
        name: 'VIP Pass (30 Days)',
        desc: 'Daily rewards + exclusive items + 2x XP',
        category: 'premium',
        cost: 5000,
        icon: 'shop-premium',
        rarity: 'legendary',
        badge: 'HOT'
    },
    premium_gacha_ticket: {
        id: 'premium_gacha_ticket',
        name: 'Premium Gacha Ticket',
        desc: 'Guaranteed epic or higher roll',
        category: 'premium',
        cost: 800,
        icon: 'shop-premium',
        rarity: 'epic'
    },
    premium_name_change: {
        id: 'premium_name_change',
        name: 'Name Change Card',
        desc: 'Change your display name once',
        category: 'premium',
        cost: 600,
        icon: 'shop-premium',
        rarity: 'rare'
    },
    premium_title_legendary: {
        id: 'premium_title_legendary',
        name: 'Legendary Title: Mythbreaker',
        desc: 'Exclusive title with gold shimmer',
        category: 'premium',
        cost: 3000,
        icon: 'shop-premium',
        rarity: 'legendary',
        badge: 'NEW'
    },
    premium_avatar_frame: {
        id: 'premium_avatar_frame',
        name: 'Animated Avatar Frame',
        desc: 'Pulsing legendary border',
        category: 'premium',
        cost: 2200,
        icon: 'shop-premium',
        rarity: 'legendary'
    },
};

// Merge with existing SHOP_ITEMS
Object.assign(SHOP_ITEMS, SHOP_ITEMS_ENHANCED);
