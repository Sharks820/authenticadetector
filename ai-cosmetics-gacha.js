// ============================================================
// AI-GENERATED COSMETICS GACHA SYSTEM
// ============================================================
// Features:
// - 5 box types with different rarities
// - Body part slot system (8 slots)
// - AI generation for Epic/Legendary items
// - Exciting box opening animations
// - Sound effects for reveals
// - Super rare legendaries (0.01% in uncommon boxes)
// ============================================================

const COSMETICS_CONFIG = {
    // Box types with pricing and rarity odds
    boxTypes: {
        bronze: {
            name: 'Bronze Box',
            icon: '📦',
            cost: 100,
            color: '#cd7f32',
            rarityOdds: {
                common: 85,      // 85%
                uncommon: 14,    // 14%
                rare: 0.99,      // 0.99%
                epic: 0.009,     // 0.009%
                legendary: 0.001 // 0.001%
            }
        },
        silver: {
            name: 'Silver Box',
            icon: '📦',
            cost: 300,
            color: '#c0c0c0',
            rarityOdds: {
                common: 60,      // 60%
                uncommon: 30,    // 30%
                rare: 9,         // 9%
                epic: 0.99,      // 0.99%
                legendary: 0.01  // 0.01% (super rare!)
            }
        },
        gold: {
            name: 'Gold Box',
            icon: '🎁',
            cost: 700,
            color: '#ffd700',
            rarityOdds: {
                common: 0,       // 0%
                uncommon: 50,    // 50%
                rare: 40,        // 40%
                epic: 9.5,       // 9.5%
                legendary: 0.5   // 0.5%
            }
        },
        diamond: {
            name: 'Diamond Box',
            icon: '💎',
            cost: 1500,
            color: '#b9f2ff',
            rarityOdds: {
                common: 0,       // 0%
                uncommon: 0,     // 0%
                rare: 60,        // 60%
                epic: 35,        // 35%
                legendary: 5     // 5%
            }
        },
        rainbow: {
            name: 'Rainbow Box',
            icon: '🌈',
            cost: 3000,
            color: '#ff6ec7',
            rarityOdds: {
                common: 0,       // 0%
                uncommon: 0,     // 0%
                rare: 0,         // 0%
                epic: 40,        // 40%
                legendary: 60    // 60% (guaranteed epic+)
            }
        }
    },

    // Body part slots
    bodyParts: {
        head: { name: 'Head', icon: '👤', layer: 1 },
        torso: { name: 'Torso', icon: '👕', layer: 2 },
        armLeft: { name: 'Left Arm', icon: '🦾', layer: 3 },
        armRight: { name: 'Right Arm', icon: '🦾', layer: 4 },
        legs: { name: 'Legs', icon: '👖', layer: 5 },
        hat: { name: 'Hat', icon: '🎩', layer: 6 },
        glasses: { name: 'Glasses', icon: '👓', layer: 7 },
        back: { name: 'Back Item', icon: '🎒', layer: 8 },
        effect: { name: 'Effect/Aura', icon: '✨', layer: 9 }
    },

    // Rarity configuration
    rarities: {
        common: {
            name: 'Common',
            color: '#667eea',
            weight: 1,
            aiGenerated: false,
            soundEffect: 'pop'
        },
        uncommon: {
            name: 'Uncommon',
            color: '#48dbfb',
            weight: 2,
            aiGenerated: false,
            soundEffect: 'whoosh'
        },
        rare: {
            name: 'Rare',
            color: '#f093fb',
            weight: 3,
            aiGenerated: false,
            soundEffect: 'chime'
        },
        epic: {
            name: 'Epic',
            color: '#4facfe',
            weight: 4,
            aiGenerated: true,  // AI-generated unique item
            soundEffect: 'epic-reveal'
        },
        legendary: {
            name: 'Legendary',
            color: '#fee140',
            weight: 5,
            aiGenerated: true,  // AI-generated unique item
            soundEffect: 'legendary-explosion'
        }
    }
};

// ============================================================
// GACHA MECHANICS
// ============================================================

function rollGachaBox(boxType) {
    const box = COSMETICS_CONFIG.boxTypes[boxType];
    if (!box) {
        throw new Error(`Invalid box type: ${boxType}`);
    }

    // Determine rarity based on weighted odds
    const rarity = determineRarity(box.rarityOdds);

    // Determine body part slot
    const bodyPartSlot = rollBodyPartSlot();

    // Generate item
    const item = {
        id: generateItemId(),
        rarity: rarity,
        bodyPart: bodyPartSlot,
        name: generateItemName(rarity, bodyPartSlot),
        timestamp: Date.now(),
        isNew: true,
        aiGenerated: COSMETICS_CONFIG.rarities[rarity].aiGenerated
    };

    // If AI-generated, add generation metadata
    if (item.aiGenerated) {
        item.aiMetadata = {
            prompt: generateAIPrompt(rarity, bodyPartSlot),
            status: 'pending',  // pending, generating, complete, error
            imageUrl: null
        };
    } else {
        // Use predefined emoji/icon for non-AI items
        item.icon = getPredefinedIcon(rarity, bodyPartSlot);
    }

    return {
        item: item,
        boxType: boxType,
        animation: getAnimationForRarity(rarity),
        soundEffect: COSMETICS_CONFIG.rarities[rarity].soundEffect
    };
}

function determineRarity(odds) {
    const rand = Math.random() * 100;
    let cumulative = 0;

    const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary'];

    for (const rarity of rarities) {
        cumulative += odds[rarity];
        if (rand <= cumulative) {
            return rarity;
        }
    }

    return 'common'; // Fallback
}

function rollBodyPartSlot() {
    const slots = Object.keys(COSMETICS_CONFIG.bodyParts);
    return slots[Math.floor(Math.random() * slots.length)];
}

function generateItemId() {
    return `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function generateItemName(rarity, bodyPart) {
    const adjectives = {
        common: ['Simple', 'Basic', 'Plain', 'Standard', 'Regular'],
        uncommon: ['Sturdy', 'Polished', 'Refined', 'Enhanced', 'Improved'],
        rare: ['Exquisite', 'Masterful', 'Pristine', 'Superior', 'Exceptional'],
        epic: ['Mythical', 'Legendary', 'Divine', 'Celestial', 'Eternal'],
        legendary: ['Godlike', 'Cosmic', 'Ultimate', 'Supreme', 'Transcendent']
    };

    const partNames = {
        head: ['Helmet', 'Mask', 'Crown', 'Visor'],
        torso: ['Armor', 'Robe', 'Suit', 'Chestplate'],
        armLeft: ['Gauntlet', 'Bracer', 'Glove', 'Sleeve'],
        armRight: ['Gauntlet', 'Bracer', 'Glove', 'Sleeve'],
        legs: ['Greaves', 'Pants', 'Boots', 'Leggings'],
        hat: ['Cap', 'Fedora', 'Beret', 'Top Hat'],
        glasses: ['Goggles', 'Shades', 'Spectacles', 'Monocle'],
        back: ['Wings', 'Cloak', 'Cape', 'Backpack'],
        effect: ['Aura', 'Glow', 'Radiance', 'Essence']
    };

    const adj = adjectives[rarity][Math.floor(Math.random() * adjectives[rarity].length)];
    const part = partNames[bodyPart][Math.floor(Math.random() * partNames[bodyPart].length)];

    return `${adj} ${part}`;
}

// ============================================================
// AI GENERATION INTEGRATION
// ============================================================

function generateAIPrompt(rarity, bodyPart) {
    const rarityStyles = {
        epic: 'highly detailed, cinematic lighting, fantasy art style',
        legendary: 'ultra detailed, magical effects, glowing particles, masterpiece quality'
    };

    const bodyPartDescriptions = {
        head: 'futuristic helmet or headpiece',
        torso: 'advanced armor chest piece',
        armLeft: 'high-tech arm gauntlet',
        armRight: 'high-tech arm gauntlet',
        legs: 'sci-fi leg armor',
        hat: 'stylish magical hat',
        glasses: 'futuristic AR glasses',
        back: 'energy wings or glowing cape',
        effect: 'particle effect aura'
    };

    const style = rarityStyles[rarity] || 'detailed';
    const description = bodyPartDescriptions[bodyPart] || 'cosmetic item';

    return `${description}, ${style}, transparent background, PNG format, game asset`;
}

async function generateAIImage(item) {
    // This would integrate with DALL-E 3 or Stable Diffusion API
    // For now, we'll set up the structure

    item.aiMetadata.status = 'generating';

    try {
        // TODO: Integrate with actual AI API
        // const response = await fetch('DALLE_API_ENDPOINT', {
        //     method: 'POST',
        //     headers: { 'Authorization': 'Bearer API_KEY' },
        //     body: JSON.stringify({
        //         prompt: item.aiMetadata.prompt,
        //         size: '512x512',
        //         response_format: 'url'
        //     })
        // });

        // Placeholder: Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Placeholder: Use a temporary placeholder image
        item.aiMetadata.imageUrl = `https://via.placeholder.com/512x512/${item.rarity === 'legendary' ? 'fee140' : '4facfe'}/000000?text=${encodeURIComponent(item.name)}`;
        item.aiMetadata.status = 'complete';

        console.log(`[AI Gen] Generated image for ${item.name}`);

    } catch (error) {
        console.error('[AI Gen] Failed to generate image:', error);
        item.aiMetadata.status = 'error';
        item.aiMetadata.error = error.message;
    }

    return item;
}

// ============================================================
// PREDEFINED COSMETICS (Common/Uncommon/Rare)
// ============================================================

function getPredefinedIcon(rarity, bodyPart) {
    const icons = {
        head: {
            common: '👤',
            uncommon: '🎭',
            rare: '👑'
        },
        torso: {
            common: '👕',
            uncommon: '🦺',
            rare: '🎽'
        },
        armLeft: {
            common: '💪',
            uncommon: '🦾',
            rare: '⚔️'
        },
        armRight: {
            common: '💪',
            uncommon: '🦾',
            rare: '🛡️'
        },
        legs: {
            common: '👖',
            uncommon: '🥾',
            rare: '👢'
        },
        hat: {
            common: '🧢',
            uncommon: '🎩',
            rare: '👒'
        },
        glasses: {
            common: '👓',
            uncommon: '🕶️',
            rare: '🥽'
        },
        back: {
            common: '🎒',
            uncommon: '🪂',
            rare: '🦅'
        },
        effect: {
            common: '✨',
            uncommon: '💫',
            rare: '🌟'
        }
    };

    return icons[bodyPart]?.[rarity] || '❓';
}

function getAnimationForRarity(rarity) {
    return {
        common: 'pop',
        uncommon: 'slide-in',
        rare: 'sparkle',
        epic: 'epic-reveal',
        legendary: 'legendary-explosion'
    }[rarity] || 'pop';
}

// ============================================================
// UI FUNCTIONS
// ============================================================

function openGachaShop() {
    const modal = createGachaShopModal();
    document.body.appendChild(modal);

    // Animate in
    requestAnimationFrame(() => {
        modal.classList.add('active');
    });
}

function createGachaShopModal() {
    const modal = document.createElement('div');
    modal.className = 'gacha-modal';
    modal.innerHTML = `
        <div class="gacha-modal-backdrop" onclick="closeGachaShop()"></div>
        <div class="gacha-modal-content glass-panel">
            <div class="gacha-modal-header">
                <h2 class="gacha-modal-title">🎲 Cosmetics Gacha</h2>
                <button class="gacha-close-btn" onclick="closeGachaShop()">✕</button>
            </div>

            <div class="gacha-boxes-grid">
                ${Object.entries(COSMETICS_CONFIG.boxTypes).map(([key, box]) => `
                    <div class="gacha-box-card" data-box-type="${key}" onclick="selectBox('${key}')">
                        <div class="gacha-box-icon">${box.icon}</div>
                        <div class="gacha-box-name">${box.name}</div>
                        <div class="gacha-box-cost">💰 ${box.cost} coins</div>
                        <div class="gacha-box-odds">
                            ${Object.entries(box.rarityOdds)
                                .filter(([r, chance]) => chance > 0)
                                .map(([r, chance]) => `<span class="rarity-badge ${r}">${r}: ${chance}%</span>`)
                                .join('')
                            }
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    return modal;
}

function closeGachaShop() {
    const modal = document.querySelector('.gacha-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
}

async function selectBox(boxType) {
    const box = COSMETICS_CONFIG.boxTypes[boxType];

    // Check if user has enough coins
    const userCoins = await getUserCoins();
    if (userCoins < box.cost) {
        alert(`Not enough coins! You need ${box.cost} coins but only have ${userCoins}.`);
        return;
    }

    // Show confirmation
    if (!confirm(`Open ${box.name} for ${box.cost} coins?`)) {
        return;
    }

    // Close shop and show opening animation
    closeGachaShop();

    // Roll the gacha
    const result = rollGachaBox(boxType);

    // Show opening animation
    await showBoxOpeningAnimation(result);

    // If AI-generated, generate the image
    if (result.item.aiGenerated) {
        await generateAIImage(result.item);
    }

    // Show result reveal
    await showItemReveal(result);

    // Save to database
    await saveItemToInventory(result.item);
}

async function showBoxOpeningAnimation(result) {
    return new Promise(resolve => {
        const animation = document.createElement('div');
        animation.className = 'box-opening-animation';
        animation.innerHTML = `
            <div class="box-opening-content">
                <div class="box-shaking ${result.animation}">
                    ${COSMETICS_CONFIG.boxTypes[result.boxType].icon}
                </div>
                <div class="box-opening-text">Opening...</div>
            </div>
        `;

        document.body.appendChild(animation);

        // Play sound effect
        playSound('box-opening');

        // Remove after 2 seconds
        setTimeout(() => {
            animation.remove();
            resolve();
        }, 2000);
    });
}

async function showItemReveal(result) {
    return new Promise(resolve => {
        const reveal = document.createElement('div');
        reveal.className = `item-reveal-modal rarity-${result.item.rarity}`;
        reveal.innerHTML = `
            <div class="item-reveal-backdrop" onclick="this.parentElement.remove()"></div>
            <div class="item-reveal-content ${result.animation}">
                <div class="item-reveal-particles"></div>
                <div class="item-reveal-rarity">${COSMETICS_CONFIG.rarities[result.item.rarity].name}</div>

                <div class="item-reveal-icon">
                    ${result.item.aiGenerated && result.item.aiMetadata.imageUrl
                        ? `<img src="${result.item.aiMetadata.imageUrl}" alt="${result.item.name}">`
                        : result.item.icon
                    }
                </div>

                <div class="item-reveal-name">${result.item.name}</div>
                <div class="item-reveal-bodypart">${COSMETICS_CONFIG.bodyParts[result.item.bodyPart].name}</div>

                ${result.item.isNew ? '<div class="item-reveal-new">NEW!</div>' : '<div class="item-reveal-duplicate">Duplicate</div>'}

                <button class="pro-btn pro-btn-primary" onclick="this.closest('.item-reveal-modal').remove()">
                    Awesome! ✨
                </button>
            </div>
        `;

        document.body.appendChild(reveal);

        // Play rarity sound
        playSound(result.soundEffect);

        // Auto-close after 10 seconds
        setTimeout(() => {
            if (document.body.contains(reveal)) {
                reveal.remove();
                resolve();
            }
        }, 10000);
    });
}

function playSound(soundName) {
    // TODO: Implement actual sound playing
    console.log(`[Sound] Playing: ${soundName}`);
}

// ============================================================
// DATABASE INTEGRATION
// ============================================================

async function getUserCoins() {
    // TODO: Get from Supabase user_progression table
    return 5000; // Placeholder
}

async function saveItemToInventory(item) {
    console.log('[DB] Saving item to inventory:', item);
    // TODO: Save to Supabase cosmetics table
}

// ============================================================
// INVENTORY MANAGEMENT UI
// ============================================================

function openInventory() {
    const modal = createInventoryModal();
    document.body.appendChild(modal);

    // Load equipped items and collection
    loadEquippedItems();
    loadItemsCollection();

    // Animate in
    requestAnimationFrame(() => {
        modal.classList.add('active');
    });
}

function createInventoryModal() {
    const modal = document.createElement('div');
    modal.className = 'inventory-modal';
    modal.innerHTML = `
        <div class="inventory-modal-backdrop" onclick="closeInventory()"></div>
        <div class="inventory-modal-content glass-panel">
            <div class="inventory-header">
                <h2 class="inventory-title">👔 Cosmetics Inventory</h2>
                <button class="gacha-close-btn" onclick="closeInventory()">✕</button>
            </div>

            <div class="inventory-body">
                <!-- Left: Equipped Slots -->
                <div class="equipped-slots">
                    <h3 style="font-size: 16px; font-weight: 700; margin-bottom: 16px;">Equipped Items</h3>
                    <div id="equippedSlotsList">
                        <!-- Slots will be rendered here -->
                    </div>
                </div>

                <!-- Right: Items Collection -->
                <div class="items-collection">
                    <h3 style="font-size: 16px; font-weight: 700; margin-bottom: 16px;">Your Collection</h3>

                    <div class="items-filter">
                        <button class="filter-btn active" onclick="filterItems('all')">All</button>
                        <button class="filter-btn" onclick="filterItems('head')">Head</button>
                        <button class="filter-btn" onclick="filterItems('torso')">Torso</button>
                        <button class="filter-btn" onclick="filterItems('armLeft')">Arms</button>
                        <button class="filter-btn" onclick="filterItems('legs')">Legs</button>
                        <button class="filter-btn" onclick="filterItems('hat')">Hats</button>
                        <button class="filter-btn" onclick="filterItems('glasses')">Glasses</button>
                        <button class="filter-btn" onclick="filterItems('back')">Back</button>
                        <button class="filter-btn" onclick="filterItems('effect')">Effects</button>
                    </div>

                    <div class="items-grid" id="itemsGrid">
                        <!-- Items will be rendered here -->
                    </div>
                </div>
            </div>
        </div>
    `;

    return modal;
}

function closeInventory() {
    const modal = document.querySelector('.inventory-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
}

async function loadEquippedItems() {
    const container = document.getElementById('equippedSlotsList');
    if (!container) return;

    // TODO: Load from database
    const equipped = {
        head: null,
        torso: null,
        armLeft: null,
        armRight: null,
        legs: null,
        hat: null,
        glasses: null,
        back: null,
        effect: null
    };

    container.innerHTML = Object.entries(COSMETICS_CONFIG.bodyParts).map(([slot, config]) => {
        const item = equipped[slot];

        return `
            <div class="equipped-slot" data-slot="${slot}">
                <div class="equipped-slot-icon ${!item ? 'empty' : ''}">
                    ${item ? (item.icon || '✨') : config.icon}
                </div>
                <div class="equipped-slot-info">
                    <div class="equipped-slot-name">${config.name}</div>
                    ${item
                        ? `<div class="equipped-slot-item">${item.name}</div>`
                        : `<div class="equipped-slot-empty">Empty</div>`
                    }
                </div>
                ${item
                    ? `<button class="equipped-slot-unequip" onclick="unequipItem('${slot}')">Unequip</button>`
                    : ''
                }
            </div>
        `;
    }).join('');
}

async function loadItemsCollection(filter = 'all') {
    const container = document.getElementById('itemsGrid');
    if (!container) return;

    // TODO: Load from database
    // For now, generate some sample items
    const sampleItems = [
        { id: '1', name: 'Cyber Helmet', bodyPart: 'head', rarity: 'rare', icon: '🎭', equipped: false },
        { id: '2', name: 'Neon Armor', bodyPart: 'torso', rarity: 'epic', icon: '🦺', equipped: false },
        { id: '3', name: 'Plasma Gauntlet', bodyPart: 'armLeft', rarity: 'legendary', icon: '⚔️', equipped: false },
        { id: '4', name: 'Basic Cap', bodyPart: 'hat', rarity: 'common', icon: '🧢', equipped: false },
        { id: '5', name: 'Laser Goggles', bodyPart: 'glasses', rarity: 'uncommon', icon: '🕶️', equipped: false }
    ];

    const filteredItems = filter === 'all'
        ? sampleItems
        : sampleItems.filter(item => item.bodyPart === filter);

    if (filteredItems.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text3);">
                <div style="font-size: 48px; margin-bottom: 12px;">📦</div>
                <div>No items in this category</div>
            </div>
        `;
        return;
    }

    container.innerHTML = filteredItems.map(item => `
        <div class="inventory-item-card ${item.equipped ? 'equipped' : ''}" onclick="equipItem('${item.id}')">
            <div class="inventory-item-icon">
                ${item.aiMetadata?.imageUrl
                    ? `<img src="${item.aiMetadata.imageUrl}" alt="${item.name}">`
                    : item.icon
                }
            </div>
            <div class="inventory-item-name">${item.name}</div>
            <div class="inventory-item-rarity rarity-badge ${item.rarity}">${item.rarity}</div>
            ${item.equipped
                ? `<div class="inventory-item-equipped-badge">EQUIPPED</div>`
                : ''
            }
        </div>
    `).join('');
}

function filterItems(bodyPart) {
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Reload items with filter
    loadItemsCollection(bodyPart);
}

async function equipItem(itemId) {
    console.log('[Inventory] Equipping item:', itemId);

    // TODO: Update database
    // TODO: Refresh equipped slots display
    // TODO: Show success notification

    alert(`Item equipped! (Database integration pending)`);
    loadEquippedItems();
}

async function unequipItem(slot) {
    console.log('[Inventory] Unequipping slot:', slot);

    // TODO: Update database
    // TODO: Refresh equipped slots display
    // TODO: Show success notification

    alert(`Item unequipped! (Database integration pending)`);
    loadEquippedItems();
}

// ============================================================
// INITIALIZATION
// ============================================================

console.log('[AI Cosmetics Gacha] System loaded successfully');
console.log('[AI Cosmetics Gacha] Box types:', Object.keys(COSMETICS_CONFIG.boxTypes).length);
console.log('[AI Cosmetics Gacha] Body part slots:', Object.keys(COSMETICS_CONFIG.bodyParts).length);
