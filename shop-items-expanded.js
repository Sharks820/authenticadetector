// ==================== EXPANDED SHOP ITEMS ====================
// This file contains the enhanced shop inventory to be integrated into index.html

const EXPANDED_COSMETICS = {
    // Additional Borders
    avatar_border_crystal: {
        id: 'avatar_border_crystal',
        name: 'Crystal Border',
        desc: 'Sparkling crystal frame with prismatic shimmer',
        category: 'cosmetics',
        cost: 450,
        icon: 'sparkles',
        rarity: 'epic',
        stats: { prestige: +5 }
    },
    avatar_border_flame: {
        id: 'avatar_border_flame',
        name: 'Flame Border',
        desc: 'Animated flame border with heat waves',
        category: 'cosmetics',
        cost: 800,
        icon: 'warning',
        rarity: 'epic',
        stats: { prestige: +8 }
    },
    avatar_border_ice: {
        id: 'avatar_border_ice',
        name: 'Ice Border',
        desc: 'Frosty icicle border with frost particles',
        category: 'cosmetics',
        cost: 350,
        icon: 'sparkles',
        rarity: 'rare',
        stats: { prestige: +3 }
    },
    avatar_border_toxic: {
        id: 'avatar_border_toxic',
        name: 'Toxic Border',
        desc: 'Radioactive green border with dripping goo',
        category: 'cosmetics',
        cost: 420,
        icon: 'corruption',
        rarity: 'rare',
        stats: { prestige: +4 }
    },
    avatar_border_void: {
        id: 'avatar_border_void',
        name: 'Void Border',
        desc: 'Dimensional rift border that warps reality',
        category: 'cosmetics',
        cost: 1200,
        icon: 'corruption',
        rarity: 'legendary',
        stats: { prestige: +15 }
    },

    // Backgrounds
    bg_matrix: {
        id: 'bg_matrix',
        name: 'Matrix BG',
        desc: 'Falling code background - Enter the digital realm',
        category: 'cosmetics',
        cost: 280,
        icon: 'corruption',
        rarity: 'rare'
    },
    bg_aurora: {
        id: 'bg_aurora',
        name: 'Aurora BG',
        desc: 'Northern lights backdrop with color waves',
        category: 'cosmetics',
        cost: 320,
        icon: 'star',
        rarity: 'rare'
    },
    bg_cyber: {
        id: 'bg_cyber',
        name: 'Cyberpunk BG',
        desc: 'Neon city backdrop with flying cars',
        category: 'cosmetics',
        cost: 400,
        icon: 'sparkles',
        rarity: 'epic'
    },
    bg_galaxy: {
        id: 'bg_galaxy',
        name: 'Galaxy BG',
        desc: 'Cosmic space backdrop with nebulae',
        category: 'cosmetics',
        cost: 350,
        icon: 'star',
        rarity: 'rare'
    },
    bg_voidrift: {
        id: 'bg_voidrift',
        name: 'Void Rift BG',
        desc: 'Dimensional tear backdrop - Reality shattering',
        category: 'cosmetics',
        cost: 900,
        icon: 'corruption',
        rarity: 'legendary'
    },
    bg_ocean: {
        id: 'bg_ocean',
        name: 'Ocean Depths BG',
        desc: 'Underwater backdrop with bioluminescence',
        category: 'cosmetics',
        cost: 290,
        icon: 'sparkles',
        rarity: 'rare'
    },
    bg_volcano: {
        id: 'bg_volcano',
        name: 'Volcano BG',
        desc: 'Molten lava backdrop with ash particles',
        category: 'cosmetics',
        cost: 380,
        icon: 'warning',
        rarity: 'rare'
    },

    // Auras
    aura_lightning: {
        id: 'aura_lightning',
        name: 'Lightning Aura',
        desc: 'Electric crackling aura with chain lightning',
        category: 'cosmetics',
        cost: 720,
        icon: 'warning',
        rarity: 'epic',
        stats: { prestige: +7 }
    },
    aura_shadow: {
        id: 'aura_shadow',
        name: 'Shadow Aura',
        desc: 'Dark tendrils aura that writhes around you',
        category: 'cosmetics',
        cost: 680,
        icon: 'corruption',
        rarity: 'epic',
        stats: { prestige: +6 }
    },
    aura_rainbow: {
        id: 'aura_rainbow',
        name: 'Rainbow Aura',
        desc: 'Prismatic shimmer aura - Ultra rare spectrum',
        category: 'cosmetics',
        cost: 850,
        icon: 'sparkles',
        rarity: 'legendary',
        stats: { prestige: +12 }
    },
    aura_fire: {
        id: 'aura_fire',
        name: 'Fire Aura',
        desc: 'Blazing flames aura with smoke trails',
        category: 'cosmetics',
        cost: 690,
        icon: 'warning',
        rarity: 'epic',
        stats: { prestige: +7 }
    },
    aura_frost: {
        id: 'aura_frost',
        name: 'Frost Aura',
        desc: 'Freezing mist aura with ice crystals',
        category: 'cosmetics',
        cost: 650,
        icon: 'sparkles',
        rarity: 'epic',
        stats: { prestige: +6 }
    },

    // Profile Frames
    profile_neon: {
        id: 'profile_neon',
        name: 'Neon Frame',
        desc: 'Glowing neon profile frame with RGB cycle',
        category: 'cosmetics',
        cost: 380,
        icon: 'sparkles',
        rarity: 'rare'
    },
    profile_dragon: {
        id: 'profile_dragon',
        name: 'Dragon Frame',
        desc: 'Dragon-carved profile frame with scales',
        category: 'cosmetics',
        cost: 950,
        icon: 'boss',
        rarity: 'legendary'
    },
    profile_tech: {
        id: 'profile_tech',
        name: 'Tech Frame',
        desc: 'Circuit board profile frame with data flow',
        category: 'cosmetics',
        cost: 340,
        icon: 'scan',
        rarity: 'rare'
    },
    profile_royal: {
        id: 'profile_royal',
        name: 'Royal Frame',
        desc: 'Ornate gold profile frame with jewels',
        category: 'cosmetics',
        cost: 880,
        icon: 'trophy',
        rarity: 'legendary'
    },

    // Nameplates
    nameplate_diamond: {
        id: 'nameplate_diamond',
        name: 'Diamond Nameplate',
        desc: 'Crystalline premium nameplate with sparkles',
        category: 'cosmetics',
        cost: 820,
        icon: 'sparkles',
        rarity: 'epic'
    },
    nameplate_void: {
        id: 'nameplate_void',
        name: 'Void Nameplate',
        desc: 'Dark matter nameplate with cosmic swirl',
        category: 'cosmetics',
        cost: 1100,
        icon: 'corruption',
        rarity: 'legendary'
    },
    nameplate_emerald: {
        id: 'nameplate_emerald',
        name: 'Emerald Nameplate',
        desc: 'Green gem nameplate with nature motif',
        category: 'cosmetics',
        cost: 760,
        icon: 'sparkles',
        rarity: 'epic'
    },

    // Titles
    title_hunter: {
        id: 'title_hunter',
        name: 'Beast Hunter Title',
        desc: 'Display "Beast Hunter" under name',
        category: 'cosmetics',
        cost: 500,
        icon: 'crosshair',
        rarity: 'rare'
    },
    title_veilbreaker: {
        id: 'title_veilbreaker',
        name: 'Veilbreaker Title',
        desc: 'Display "Veilbreaker" under name',
        category: 'cosmetics',
        cost: 750,
        icon: 'wand',
        rarity: 'epic'
    },
    title_legend: {
        id: 'title_legend',
        name: 'Legend Title',
        desc: 'Display "Legend" under name in gold',
        category: 'cosmetics',
        cost: 1200,
        icon: 'trophy',
        rarity: 'legendary'
    },
    title_champion: {
        id: 'title_champion',
        name: 'Champion Title',
        desc: 'Display "Champion" under name',
        category: 'cosmetics',
        cost: 900,
        icon: 'trophy',
        rarity: 'epic'
    },

    // Emotes
    emote_victory: {
        id: 'emote_victory',
        name: 'Victory Emote',
        desc: 'Animated victory celebration with fireworks',
        category: 'cosmetics',
        cost: 300,
        icon: 'star',
        rarity: 'rare'
    },
    emote_taunt: {
        id: 'emote_taunt',
        name: 'Taunt Emote',
        desc: 'Playful taunt animation - Show dominance',
        category: 'cosmetics',
        cost: 250,
        icon: 'chat',
        rarity: 'common'
    },
    emote_dance: {
        id: 'emote_dance',
        name: 'Dance Emote',
        desc: 'Victory dance animation with music notes',
        category: 'cosmetics',
        cost: 350,
        icon: 'sparkles',
        rarity: 'rare'
    },

    // Avatar Parts (link to Avatar Builder)
    avatar_part_cyber_eye: {
        id: 'avatar_part_cyber_eye',
        name: 'Cyber Eye',
        desc: 'Cybernetic eye implant - Opens Avatar Builder',
        category: 'cosmetics',
        cost: 600,
        icon: 'search',
        rarity: 'epic',
        avatarPart: 'eyes',
        linkToBuilder: true
    },
    avatar_part_mech_arm: {
        id: 'avatar_part_mech_arm',
        name: 'Mech Arm',
        desc: 'Robotic arm - Opens Avatar Builder',
        category: 'cosmetics',
        cost: 700,
        icon: 'shield',
        rarity: 'epic',
        avatarPart: 'arm',
        linkToBuilder: true
    },
    avatar_part_wings: {
        id: 'avatar_part_wings',
        name: 'Digital Wings',
        desc: 'Holographic wings - Opens Avatar Builder',
        category: 'cosmetics',
        cost: 900,
        icon: 'sparkles',
        rarity: 'legendary',
        avatarPart: 'back',
        linkToBuilder: true
    },
    avatar_part_helmet: {
        id: 'avatar_part_helmet',
        name: 'Cyber Helmet',
        desc: 'Futuristic helmet - Opens Avatar Builder',
        category: 'cosmetics',
        cost: 550,
        icon: 'shield',
        rarity: 'rare',
        avatarPart: 'head',
        linkToBuilder: true
    },
    avatar_part_visor: {
        id: 'avatar_part_visor',
        name: 'HUD Visor',
        desc: 'Heads-up display visor - Opens Avatar Builder',
        category: 'cosmetics',
        cost: 480,
        icon: 'scan',
        rarity: 'rare',
        avatarPart: 'eyes',
        linkToBuilder: true
    },
    avatar_part_cape: {
        id: 'avatar_part_cape',
        name: 'Hero Cape',
        desc: 'Flowing hero cape - Opens Avatar Builder',
        category: 'cosmetics',
        cost: 680,
        icon: 'shield',
        rarity: 'epic',
        avatarPart: 'back',
        linkToBuilder: true
    },
    avatar_part_horns: {
        id: 'avatar_part_horns',
        name: 'Demon Horns',
        desc: 'Demonic horns - Opens Avatar Builder',
        category: 'cosmetics',
        cost: 620,
        icon: 'corruption',
        rarity: 'epic',
        avatarPart: 'head',
        linkToBuilder: true
    }
};

const EXPANDED_POWERUPS = {
    // Additional Power-Ups
    mega_xp_boost: {
        id: 'mega_xp_boost',
        name: 'Mega XP Surge',
        desc: 'Game-only: 5x XP for 1 hour - Stack with other boosts',
        category: 'powerups',
        cost: 1200,
        icon: 'stats',
        rarity: 'legendary',
        duration: '1 hour',
        effect: { xp_mult: 5 }
    },
    detection_master: {
        id: 'detection_master',
        name: 'Detection Master',
        desc: 'Game-only: +15% detection accuracy for 24h',
        category: 'powerups',
        cost: 850,
        icon: 'search',
        rarity: 'epic',
        duration: '24 hours',
        effect: { accuracy: +15 }
    },
    coin_magnet_pro: {
        id: 'coin_magnet_pro',
        name: 'Coin Magnet Pro',
        desc: 'Game-only: +200% coin drops for 12h',
        category: 'powerups',
        cost: 950,
        icon: 'coins',
        rarity: 'epic',
        duration: '12 hours',
        effect: { coin_mult: 3 }
    },
    key_generator: {
        id: 'key_generator',
        name: 'Key Generator',
        desc: 'Game-only: +5 hunt keys immediately',
        category: 'powerups',
        cost: 600,
        icon: 'wand',
        rarity: 'rare',
        effect: { keys: +5 }
    },
    auto_scanner: {
        id: 'auto_scanner',
        name: 'Auto Scanner',
        desc: 'Game-only: Auto-scan 10 images (queued)',
        category: 'powerups',
        cost: 1100,
        icon: 'scan',
        rarity: 'epic',
        effect: { auto_scans: 10 }
    },
    legendary_luck: {
        id: 'legendary_luck',
        name: 'Legendary Luck',
        desc: 'Game-only: +50% legendary drop rate for 6h',
        category: 'powerups',
        cost: 1500,
        icon: 'star',
        rarity: 'legendary',
        duration: '6 hours',
        effect: { legendary_rate: +50 }
    },
    double_rewards: {
        id: 'double_rewards',
        name: 'Double Rewards',
        desc: 'Game-only: 2x all rewards for next 10 battles',
        category: 'powerups',
        cost: 800,
        icon: 'trophy',
        rarity: 'epic',
        effect: { reward_mult: 2, battles: 10 }
    },
    instant_refresh: {
        id: 'instant_refresh',
        name: 'Instant Refresh',
        desc: 'Game-only: Reset all cooldowns immediately',
        category: 'powerups',
        cost: 700,
        icon: 'refresh',
        rarity: 'rare',
        effect: { reset_cooldowns: true }
    },
    beast_magnet: {
        id: 'beast_magnet',
        name: 'Beast Magnet',
        desc: 'Game-only: Attracts rare beasts for 2h',
        category: 'powerups',
        cost: 920,
        icon: 'boss',
        rarity: 'epic',
        duration: '2 hours',
        effect: { rare_beast_rate: +75 }
    },
    squad_boost: {
        id: 'squad_boost',
        name: 'Squad Power Boost',
        desc: 'Game-only: +25% squad-wide XP for 24h',
        category: 'powerups',
        cost: 750,
        icon: 'shield',
        rarity: 'rare',
        duration: '24 hours',
        effect: { squad_xp: +25 }
    },
    premium_pass_day: {
        id: 'premium_pass_day',
        name: 'Premium Day Pass',
        desc: 'Game-only: All premium features for 24h',
        category: 'powerups',
        cost: 2000,
        icon: 'trophy',
        rarity: 'legendary',
        duration: '24 hours',
        effect: { premium: true }
    },
    forensics_expert: {
        id: 'forensics_expert',
        name: 'Forensics Expert',
        desc: 'Game-only: Deep scan cost reduced 50% for 48h',
        category: 'powerups',
        cost: 680,
        icon: 'info',
        rarity: 'rare',
        duration: '48 hours',
        effect: { scan_discount: 50 }
    }
};

const EXPANDED_BOOSTERS = {
    // Additional Boosters
    mega_ammo_pack: {
        id: 'mega_ammo_pack',
        name: 'Mega Ammo Pack',
        desc: '200 truth cannon rounds - Stock up',
        category: 'boosters',
        cost: 1200,
        icon: 'crosshair',
        rarity: 'epic',
        quantity: 200
    },
    raid_commander: {
        id: 'raid_commander',
        name: 'Raid Commander',
        desc: '+100% raid damage for next 5 raids',
        category: 'boosters',
        cost: 850,
        icon: 'boss',
        rarity: 'epic',
        effect: { raid_damage: +100, uses: 5 }
    },
    perfect_aim: {
        id: 'perfect_aim',
        name: 'Perfect Aim',
        desc: '100% accuracy for next 20 shots',
        category: 'boosters',
        cost: 900,
        icon: 'crosshair',
        rarity: 'epic',
        effect: { accuracy: 100, shots: 20 }
    },
    treasure_hunter: {
        id: 'treasure_hunter',
        name: 'Treasure Hunter',
        desc: '+100% rare item drop rate for 3h',
        category: 'boosters',
        cost: 780,
        icon: 'coins',
        rarity: 'rare',
        duration: '3 hours',
        effect: { drop_rate: +100 }
    },
    zone_master: {
        id: 'zone_master',
        name: 'Zone Master',
        desc: 'Instant zone completion (1 use)',
        category: 'boosters',
        cost: 1400,
        icon: 'wand',
        rarity: 'legendary',
        effect: { instant_zone: true }
    },
    beast_tamer: {
        id: 'beast_tamer',
        name: 'Beast Tamer',
        desc: '+50% beast capture rate for 6h',
        category: 'boosters',
        cost: 720,
        icon: 'boss',
        rarity: 'rare',
        duration: '6 hours',
        effect: { capture_rate: +50 }
    },
    speed_demon: {
        id: 'speed_demon',
        name: 'Speed Demon',
        desc: '+100% movement speed for 1h',
        category: 'boosters',
        cost: 650,
        icon: 'stats',
        rarity: 'rare',
        duration: '1 hour',
        effect: { speed: +100 }
    },
    invincibility: {
        id: 'invincibility',
        name: 'Invincibility',
        desc: 'Immune to all damage for 5 minutes',
        category: 'boosters',
        cost: 2500,
        icon: 'shield',
        rarity: 'legendary',
        duration: '5 minutes',
        effect: { invincible: true }
    },
    resource_doubler: {
        id: 'resource_doubler',
        name: 'Resource Doubler',
        desc: '2x all resource gains for 8h',
        category: 'boosters',
        cost: 880,
        icon: 'coins',
        rarity: 'epic',
        duration: '8 hours',
        effect: { resource_mult: 2 }
    },
    energy_refill: {
        id: 'energy_refill',
        name: 'Energy Refill',
        desc: 'Restore 100% energy immediately',
        category: 'boosters',
        cost: 550,
        icon: 'heart',
        rarity: 'rare',
        effect: { energy: 100 }
    },
    combo_extender: {
        id: 'combo_extender',
        name: 'Combo Extender',
        desc: 'Combo timer +10 seconds for 30 min',
        category: 'boosters',
        cost: 620,
        icon: 'star',
        rarity: 'rare',
        duration: '30 minutes',
        effect: { combo_timer: +10 }
    },
    mega_shield: {
        id: 'mega_shield',
        name: 'Mega Shield',
        desc: 'Absorb 1000 damage points',
        category: 'boosters',
        cost: 1100,
        icon: 'shield',
        rarity: 'epic',
        effect: { shield: 1000 }
    }
};

// Combine all expanded items
const ALL_EXPANDED_ITEMS = {
    ...EXPANDED_COSMETICS,
    ...EXPANDED_POWERUPS,
    ...EXPANDED_BOOSTERS
};

// Export for integration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EXPANDED_COSMETICS, EXPANDED_POWERUPS, EXPANDED_BOOSTERS, ALL_EXPANDED_ITEMS };
}
