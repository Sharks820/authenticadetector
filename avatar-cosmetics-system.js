// ============================================================
// AVATAR & COSMETICS SYSTEM
// ============================================================
// AI-themed avatars, cosmetics shop, gacha rolling system
// Integrated with Truth Coins economy

// ==================== COSMETICS DATABASE ====================

const COSMETICS = {
    // AI-themed avatars
    avatars: {
        default: { id: 'default', name: 'Truth Seeker', emoji: '👤', rarity: 'common', price: 0, description: 'The default avatar for truth seekers' },

        // Common avatars (50-100 coins)
        detective: { id: 'detective', name: 'AI Detective', emoji: '🕵️', rarity: 'common', price: 50, description: 'Investigates deepfakes with precision' },
        scientist: { id: 'scientist', name: 'Data Scientist', emoji: '👨‍🔬', rarity: 'common', price: 60, description: 'Analyzes patterns in AI generations' },
        hacker: { id: 'hacker', name: 'Ethical Hacker', emoji: '👨‍💻', rarity: 'common', price: 70, description: 'Breaks through AI deception' },
        guard: { id: 'guard', name: 'Truth Guard', emoji: '💂', rarity: 'common', price: 80, description: 'Protects authenticity' },

        // Uncommon avatars (150-250 coins)
        cyborg: { id: 'cyborg', name: 'Cyborg Analyzer', emoji: '🤖', rarity: 'uncommon', price: 150, description: 'Half-human, half-AI detector' },
        alien: { id: 'alien', name: 'Alien Observer', emoji: '👽', rarity: 'uncommon', price: 180, description: 'Sees through dimensional fakes' },
        robot: { id: 'robot', name: 'Truth Bot', emoji: '🦾', rarity: 'uncommon', price: 200, description: 'Mechanical precision detector' },
        wizard: { id: 'wizard', name: 'Tech Wizard', emoji: '🧙', rarity: 'uncommon', price: 220, description: 'Magical AI detection powers' },

        // Rare avatars (300-500 coins)
        neural: { id: 'neural', name: 'Neural Network', emoji: '🧠', rarity: 'rare', price: 300, description: 'Living AI detection algorithm' },
        ghost: { id: 'ghost', name: 'Ghost in Machine', emoji: '👻', rarity: 'rare', price: 350, description: 'Haunts AI generators' },
        vampire: { id: 'vampire', name: 'Data Vampire', emoji: '🧛', rarity: 'rare', price: 400, description: 'Drains fake pixels' },
        demon: { id: 'demon', name: 'Deepfake Hunter', emoji: '👹', rarity: 'rare', price: 450, description: 'Hunts AI deception' },

        // Epic avatars (600-900 coins)
        dragon: { id: 'dragon', name: 'Algorithm Dragon', emoji: '🐉', rarity: 'epic', price: 600, description: 'Breathes detection fire' },
        phoenix: { id: 'phoenix', name: 'Truth Phoenix', emoji: '🔥', rarity: 'epic', price: 700, description: 'Rises from fake ashes' },
        unicorn: { id: 'unicorn', name: 'Rare Detector', emoji: '🦄', rarity: 'epic', price: 800, description: 'Mythical accuracy' },
        crown: { id: 'crown', name: 'Detection Royalty', emoji: '👑', rarity: 'epic', price: 900, description: 'Rules the truth realm' },

        // Legendary avatars (1000-2000 coins)
        godmode: { id: 'godmode', name: 'AI God Mode', emoji: '⚡', rarity: 'legendary', price: 1000, description: 'Ultimate detection power' },
        sentinel: { id: 'sentinel', name: 'Truth Sentinel', emoji: '🛡️', rarity: 'legendary', price: 1500, description: 'Guardian of authenticity' },
        omega: { id: 'omega', name: 'Omega Detector', emoji: '🌟', rarity: 'legendary', price: 2000, description: 'Final form of truth' }
    },

    // Clothing items
    clothing: {
        // Tops
        hoodie: { id: 'hoodie', name: 'Hacker Hoodie', emoji: '🧥', slot: 'top', rarity: 'common', price: 100, description: 'Anonymous detection' },
        tshirt: { id: 'tshirt', name: 'Binary T-Shirt', emoji: '👕', slot: 'top', rarity: 'common', price: 80, description: '01010100 pattern' },
        suit: { id: 'suit', name: 'AI Executive Suit', emoji: '🤵', slot: 'top', rarity: 'uncommon', price: 200, description: 'Professional detector' },
        armor: { id: 'armor', name: 'Pixel Armor', emoji: '🛡️', slot: 'top', rarity: 'rare', price: 400, description: 'Protects from deepfakes' },
        cape: { id: 'cape', name: 'Truth Cape', emoji: '🦸', slot: 'top', rarity: 'epic', price: 700, description: 'Heroic detection powers' },

        // Bottoms
        jeans: { id: 'jeans', name: 'Data Jeans', emoji: '👖', slot: 'bottom', rarity: 'common', price: 90, description: 'Comfortable scanning' },
        shorts: { id: 'shorts', name: 'Pixel Shorts', emoji: '🩳', slot: 'bottom', rarity: 'common', price: 70, description: 'Quick analysis' },

        // Full body
        robe: { id: 'robe', name: 'AI Wizard Robe', emoji: '🧙‍♂️', slot: 'fullbody', rarity: 'rare', price: 500, description: 'Magical detection aura' },
        cybersuit: { id: 'cybersuit', name: 'Cyber Suit', emoji: '🦾', slot: 'fullbody', rarity: 'epic', price: 800, description: 'Full AI integration' }
    },

    // Weapons/Tools
    weapons: {
        magnify: { id: 'magnify', name: 'Truth Magnifier', emoji: '🔍', slot: 'weapon', rarity: 'common', price: 100, description: '+5% scan accuracy' },
        scanner: { id: 'scanner', name: 'Quantum Scanner', emoji: '📡', slot: 'weapon', rarity: 'uncommon', price: 200, description: '+10% scan accuracy' },
        sword: { id: 'sword', name: 'Pixel Sword', emoji: '⚔️', slot: 'weapon', rarity: 'rare', price: 350, description: 'Slices through fakes' },
        hammer: { id: 'hammer', name: 'Ban Hammer', emoji: '🔨', slot: 'weapon', rarity: 'rare', price: 400, description: 'Crushes AI deception' },
        wand: { id: 'wand', name: 'Detection Wand', emoji: '🪄', slot: 'weapon', rarity: 'epic', price: 600, description: '+20% accuracy magic' },
        laser: { id: 'laser', name: 'Truth Laser', emoji: '🔫', slot: 'weapon', rarity: 'epic', price: 750, description: 'Precision detection beam' },
        staff: { id: 'staff', name: 'Algorithm Staff', emoji: '🏹', slot: 'weapon', rarity: 'legendary', price: 1200, description: '+30% scan power' }
    },

    // Accessories
    accessories: {
        // Hats
        cap: { id: 'cap', name: 'Hacker Cap', emoji: '🧢', slot: 'hat', rarity: 'common', price: 80, description: 'Thinking cap activated' },
        helmet: { id: 'helmet', name: 'VR Helmet', emoji: '⛑️', slot: 'hat', rarity: 'uncommon', price: 150, description: 'See the matrix' },
        crown_acc: { id: 'crown_acc', name: 'Gold Crown', emoji: '👑', slot: 'hat', rarity: 'epic', price: 800, description: 'Royalty status' },
        halo: { id: 'halo', name: 'Truth Halo', emoji: '😇', slot: 'hat', rarity: 'legendary', price: 1000, description: 'Divine accuracy' },

        // Glasses
        shades: { id: 'shades', name: 'AI Shades', emoji: '🕶️', slot: 'glasses', rarity: 'common', price: 100, description: 'See through illusions' },
        goggles: { id: 'goggles', name: 'Tech Goggles', emoji: '🥽', slot: 'glasses', rarity: 'uncommon', price: 180, description: 'Enhanced vision' },
        monocle: { id: 'monocle', name: 'Sherlock Monocle', emoji: '🧐', slot: 'glasses', rarity: 'rare', price: 300, description: 'Detective vision' },

        // Pets/Companions
        cat: { id: 'cat', name: 'Cyber Cat', emoji: '🐱', slot: 'pet', rarity: 'uncommon', price: 200, description: 'Meows at fakes' },
        dog: { id: 'dog', name: 'Truth Dog', emoji: '🐕', slot: 'pet', rarity: 'uncommon', price: 220, description: 'Sniffs out AI' },
        bird: { id: 'bird', name: 'Scout Bird', emoji: '🦅', slot: 'pet', rarity: 'rare', price: 350, description: 'Aerial detection' },
        dragon_pet: { id: 'dragon_pet', name: 'Mini Dragon', emoji: '🐲', slot: 'pet', rarity: 'epic', price: 700, description: 'Legendary companion' },

        // Other accessories
        badge: { id: 'badge', name: 'Truth Badge', emoji: '🏅', slot: 'badge', rarity: 'common', price: 50, description: 'Official detector' },
        medal: { id: 'medal', name: 'Gold Medal', emoji: '🥇', slot: 'badge', rarity: 'rare', price: 400, description: 'Champion status' },
        trophy: { id: 'trophy', name: 'Master Trophy', emoji: '🏆', slot: 'badge', rarity: 'legendary', price: 1500, description: 'Ultimate achievement' }
    }
};

// Rarity colors and multipliers
const RARITY_INFO = {
    common: { color: '#95a5a6', weight: 50, rollCost: 100 },
    uncommon: { color: '#3498db', weight: 30, rollCost: 200 },
    rare: { color: '#9b59b6', weight: 15, rollCost: 400 },
    epic: { color: '#f39c12', weight: 4, rollCost: 700 },
    legendary: { color: '#e74c3c', weight: 1, rollCost: 1000 }
};

// ==================== USER COSMETICS STATE ====================

let userCosmetics = {
    avatarId: 'default',
    equipped: {
        top: null,
        bottom: null,
        fullbody: null,
        weapon: null,
        hat: null,
        glasses: null,
        pet: null,
        badge: null
    },
    owned: {
        avatars: ['default'],
        clothing: [],
        weapons: [],
        accessories: []
    },
    stats: {
        totalPurchases: 0,
        totalRolls: 0,
        coinsSpent: 0,
        favoriteItem: null
    }
};

// ==================== INITIALIZATION ====================

async function initCosmeticsSystem() {
    console.log('[Cosmetics] Initializing cosmetics system...');

    // Load from localStorage
    const saved = localStorage.getItem('user_cosmetics');
    if (saved) {
        try {
            userCosmetics = JSON.parse(saved);
            console.log('[Cosmetics] Loaded saved cosmetics');
        } catch (e) {
            console.error('[Cosmetics] Failed to load saved data:', e);
        }
    }

    // Load from Supabase if logged in
    if (typeof user !== 'undefined' && user && user.id) {
        await loadCosmeticsFromDB();
    }

    applyCurrentCosmetics();
}

async function loadCosmeticsFromDB() {
    try {
        if (typeof supabase === 'undefined') return;

        const { data, error } = await supabase
            .from('user_cosmetics')
            .select('*')
            .eq('user_id', user.id)
            .single();

        if (!error && data) {
            userCosmetics.avatarId = data.avatar_id || 'default';
            userCosmetics.equipped = data.equipped || userCosmetics.equipped;
            userCosmetics.owned = data.owned || userCosmetics.owned;
            userCosmetics.stats = data.stats || userCosmetics.stats;
            console.log('[Cosmetics] Loaded from database');
        }
    } catch (err) {
        console.error('[Cosmetics] Error loading from database:', err);
    }
}

async function saveCosmeticsToDB() {
    try {
        if (typeof supabase === 'undefined' || !user || !user.id) {
            // Save to localStorage only
            localStorage.setItem('user_cosmetics', JSON.stringify(userCosmetics));
            return;
        }

        const { error } = await supabase
            .from('user_cosmetics')
            .upsert({
                user_id: user.id,
                avatar_id: userCosmetics.avatarId,
                equipped: userCosmetics.equipped,
                owned: userCosmetics.owned,
                stats: userCosmetics.stats,
                updated_at: new Date().toISOString()
            });

        if (!error) {
            console.log('[Cosmetics] Saved to database');
        } else {
            console.error('[Cosmetics] Save error:', error);
        }

        // Also save to localStorage as backup
        localStorage.setItem('user_cosmetics', JSON.stringify(userCosmetics));
    } catch (err) {
        console.error('[Cosmetics] Exception saving:', err);
    }
}

// ==================== UI FUNCTIONS ====================

function openAvatarSelector() {
    console.log('[Cosmetics] Opening avatar selector...');

    const modal = document.getElementById('avatarModal');
    if (!modal) {
        createAvatarModal();
    }

    renderAvatarGrid();
    document.getElementById('avatarModal').style.display = 'flex';
}

function createAvatarModal() {
    const modal = document.createElement('div');
    modal.id = 'avatarModal';
    modal.className = 'cosmetic-modal';
    modal.innerHTML = `
        <div class="cosmetic-modal-content">
            <div class="cosmetic-modal-header">
                <h2>🎭 AI Avatar Selection</h2>
                <button onclick="closeAvatarModal()" class="close-btn">×</button>
            </div>

            <div class="cosmetic-tabs">
                <button class="cosmetic-tab active" onclick="switchCosmeticTab('avatars')">Avatars</button>
                <button class="cosmetic-tab" onclick="switchCosmeticTab('clothing')">Clothing</button>
                <button class="cosmetic-tab" onclick="switchCosmeticTab('weapons')">Weapons</button>
                <button class="cosmetic-tab" onclick="switchCosmeticTab('accessories')">Accessories</button>
                <button class="cosmetic-tab" onclick="switchCosmeticTab('gacha')">🎰 Roll</button>
            </div>

            <div id="cosmeticContent" class="cosmetic-content">
                <div id="avatarGrid" class="cosmetic-grid"></div>
            </div>

            <div class="cosmetic-footer">
                <div class="user-coins-display">
                    <span class="coin-icon">🪙</span>
                    <span id="modalCoinsAmount">0</span> Truth Coins
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Add styles
    if (!document.getElementById('cosmeticsStyles')) {
        const style = document.createElement('style');
        style.id = 'cosmeticsStyles';
        style.textContent = `
            .cosmetic-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                z-index: 10000;
                justify-content: center;
                align-items: center;
                animation: fadeIn 0.3s ease;
            }

            .cosmetic-modal-content {
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                border: 2px solid #1abc9c;
                border-radius: 20px;
                width: 90%;
                max-width: 900px;
                max-height: 85vh;
                display: flex;
                flex-direction: column;
                box-shadow: 0 10px 50px rgba(26, 188, 156, 0.3);
                overflow: hidden;
            }

            .cosmetic-modal-header {
                padding: 20px 30px;
                background: linear-gradient(90deg, #1abc9c, #16a085);
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 2px solid #0d7a5f;
            }

            .cosmetic-modal-header h2 {
                margin: 0;
                color: white;
                font-size: 28px;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            }

            .close-btn {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                font-size: 32px;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                cursor: pointer;
                transition: all 0.3s;
            }

            .close-btn:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: rotate(90deg);
            }

            .cosmetic-tabs {
                display: flex;
                gap: 10px;
                padding: 15px 20px;
                background: rgba(0, 0, 0, 0.3);
                overflow-x: auto;
            }

            .cosmetic-tab {
                padding: 12px 24px;
                background: rgba(255, 255, 255, 0.1);
                border: 2px solid transparent;
                border-radius: 10px;
                color: #bbb;
                font-size: 16px;
                cursor: pointer;
                transition: all 0.3s;
                white-space: nowrap;
            }

            .cosmetic-tab.active {
                background: linear-gradient(135deg, #1abc9c, #16a085);
                border-color: #0d7a5f;
                color: white;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(26, 188, 156, 0.4);
            }

            .cosmetic-tab:hover:not(.active) {
                background: rgba(26, 188, 156, 0.2);
                border-color: #1abc9c;
                color: white;
            }

            .cosmetic-content {
                flex: 1;
                padding: 20px;
                overflow-y: auto;
            }

            .cosmetic-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                gap: 15px;
            }

            .cosmetic-item {
                background: linear-gradient(135deg, rgba(26, 188, 156, 0.1), rgba(22, 160, 133, 0.05));
                border: 2px solid;
                border-radius: 15px;
                padding: 20px;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s;
                position: relative;
                overflow: hidden;
            }

            .cosmetic-item::before {
                content: '';
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
                transform: rotate(45deg);
                transition: all 0.5s;
                opacity: 0;
            }

            .cosmetic-item:hover::before {
                opacity: 1;
                animation: shimmer 1.5s infinite;
            }

            @keyframes shimmer {
                0% { transform: rotate(45deg) translate(-50%, -50%); }
                100% { transform: rotate(45deg) translate(50%, 50%); }
            }

            .cosmetic-item:hover {
                transform: translateY(-5px) scale(1.05);
                box-shadow: 0 10px 30px rgba(26, 188, 156, 0.4);
            }

            .cosmetic-item.owned {
                border-color: #1abc9c;
            }

            .cosmetic-item.equipped {
                border-color: #f39c12;
                box-shadow: 0 0 20px rgba(243, 156, 18, 0.5);
            }

            .cosmetic-item.equipped::after {
                content: '✓ EQUIPPED';
                position: absolute;
                top: 10px;
                right: 10px;
                background: #f39c12;
                color: white;
                padding: 4px 8px;
                border-radius: 5px;
                font-size: 11px;
                font-weight: bold;
            }

            .cosmetic-item.locked {
                opacity: 0.6;
                cursor: default;
            }

            .cosmetic-emoji {
                font-size: 64px;
                margin-bottom: 10px;
                filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
            }

            .cosmetic-name {
                font-size: 16px;
                font-weight: bold;
                color: white;
                margin: 10px 0 5px 0;
            }

            .cosmetic-rarity {
                font-size: 12px;
                text-transform: uppercase;
                font-weight: bold;
                margin: 5px 0;
            }

            .cosmetic-price {
                font-size: 14px;
                color: #f39c12;
                font-weight: bold;
                margin: 10px 0;
            }

            .cosmetic-description {
                font-size: 12px;
                color: #bbb;
                margin: 5px 0;
                line-height: 1.4;
            }

            .cosmetic-footer {
                padding: 20px 30px;
                background: rgba(0, 0, 0, 0.4);
                border-top: 2px solid rgba(26, 188, 156, 0.3);
                text-align: center;
            }

            .user-coins-display {
                font-size: 20px;
                color: #f39c12;
                font-weight: bold;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
            }

            .coin-icon {
                font-size: 28px;
            }

            .gacha-container {
                text-align: center;
                padding: 40px 20px;
            }

            .gacha-machine {
                background: linear-gradient(135deg, #8e44ad, #9b59b6);
                border: 3px solid #6c3483;
                border-radius: 20px;
                padding: 40px;
                margin: 20px auto;
                max-width: 500px;
                box-shadow: 0 10px 40px rgba(142, 68, 173, 0.4);
            }

            .gacha-title {
                font-size: 32px;
                color: white;
                margin-bottom: 20px;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            }

            .gacha-options {
                display: flex;
                gap: 20px;
                justify-content: center;
                margin: 30px 0;
            }

            .gacha-option {
                background: rgba(255, 255, 255, 0.1);
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-radius: 15px;
                padding: 20px;
                cursor: pointer;
                transition: all 0.3s;
                min-width: 150px;
            }

            .gacha-option:hover {
                transform: translateY(-5px);
                border-color: #f39c12;
                box-shadow: 0 10px 30px rgba(243, 156, 18, 0.4);
            }

            .gacha-option-name {
                font-size: 18px;
                color: white;
                font-weight: bold;
                margin-bottom: 10px;
            }

            .gacha-option-cost {
                font-size: 24px;
                color: #f39c12;
                font-weight: bold;
            }

            .gacha-result {
                margin-top: 30px;
                padding: 30px;
                background: rgba(0, 0, 0, 0.3);
                border-radius: 15px;
                min-height: 200px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }

            .gacha-result-emoji {
                font-size: 100px;
                margin: 20px 0;
                animation: bounceIn 0.6s ease;
            }

            @keyframes bounceIn {
                0% { transform: scale(0) rotate(0deg); opacity: 0; }
                50% { transform: scale(1.2) rotate(180deg); }
                100% { transform: scale(1) rotate(360deg); opacity: 1; }
            }

            .gacha-result-name {
                font-size: 28px;
                color: white;
                font-weight: bold;
                margin: 10px 0;
            }

            @media (max-width: 768px) {
                .cosmetic-grid {
                    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                }

                .cosmetic-modal-content {
                    width: 95%;
                    max-height: 90vh;
                }

                .gacha-options {
                    flex-direction: column;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

function renderAvatarGrid() {
    const grid = document.getElementById('avatarGrid');
    if (!grid) return;

    grid.innerHTML = '';

    Object.values(COSMETICS.avatars).forEach(avatar => {
        const owned = userCosmetics.owned.avatars.includes(avatar.id);
        const equipped = userCosmetics.avatarId === avatar.id;

        const item = document.createElement('div');
        item.className = `cosmetic-item ${owned ? 'owned' : 'locked'} ${equipped ? 'equipped' : ''}`;
        item.style.borderColor = RARITY_INFO[avatar.rarity].color;

        item.innerHTML = `
            <div class="cosmetic-emoji">${avatar.emoji}</div>
            <div class="cosmetic-name">${avatar.name}</div>
            <div class="cosmetic-rarity" style="color: ${RARITY_INFO[avatar.rarity].color}">${avatar.rarity}</div>
            <div class="cosmetic-description">${avatar.description}</div>
            ${!owned ? `<div class="cosmetic-price">🪙 ${avatar.price}</div>` : ''}
        `;

        if (owned && !equipped) {
            item.onclick = () => equipAvatar(avatar.id);
        } else if (!owned) {
            item.onclick = () => purchaseAvatar(avatar.id);
        }

        grid.appendChild(item);
    });

    updateModalCoins();
}

function updateModalCoins() {
    const modalCoins = document.getElementById('modalCoinsAmount');
    if (modalCoins && typeof userProgression !== 'undefined') {
        modalCoins.textContent = userProgression.truth_coins.toLocaleString();
    }
}

// ==================== PURCHASE & EQUIP ====================

async function purchaseAvatar(avatarId) {
    const avatar = COSMETICS.avatars[avatarId];
    if (!avatar) return;

    if (userCosmetics.owned.avatars.includes(avatarId)) {
        showCosmeticNotification('You already own this avatar!', 'warning');
        return;
    }

    if (typeof userProgression === 'undefined' || userProgression.truth_coins < avatar.price) {
        showCosmeticNotification(`Not enough coins! Need ${avatar.price} 🪙`, 'error');
        return;
    }

    // Deduct coins
    const success = await spendCoins(avatar.price);
    if (!success) {
        showCosmeticNotification('Purchase failed!', 'error');
        return;
    }

    // Add to owned
    userCosmetics.owned.avatars.push(avatarId);
    userCosmetics.stats.totalPurchases++;
    userCosmetics.stats.coinsSpent += avatar.price;

    await saveCosmeticsToDB();
    renderAvatarGrid();

    showCosmeticNotification(`Purchased ${avatar.name}! 🎉`, 'success');

    // Auto-equip
    equipAvatar(avatarId);
}

function equipAvatar(avatarId) {
    if (!userCosmetics.owned.avatars.includes(avatarId)) return;

    userCosmetics.avatarId = avatarId;
    saveCosmeticsToDB();
    applyCurrentCosmetics();
    renderAvatarGrid();

    const avatar = COSMETICS.avatars[avatarId];
    showCosmeticNotification(`Equipped ${avatar.name}!`, 'success');
}

async function purchaseCosmetic(category, itemId) {
    const item = COSMETICS[category][itemId];
    if (!item) return;

    const ownedList = userCosmetics.owned[category];
    if (ownedList && ownedList.includes(itemId)) {
        showCosmeticNotification('You already own this item!', 'warning');
        return;
    }

    if (typeof userProgression === 'undefined' || userProgression.truth_coins < item.price) {
        showCosmeticNotification(`Not enough coins! Need ${item.price} 🪙`, 'error');
        return;
    }

    const success = await spendCoins(item.price);
    if (!success) return;

    if (!ownedList) userCosmetics.owned[category] = [];
    userCosmetics.owned[category].push(itemId);
    userCosmetics.stats.totalPurchases++;
    userCosmetics.stats.coinsSpent += item.price;

    await saveCosmeticsToDB();
    switchCosmeticTab(category); // Refresh display

    showCosmeticNotification(`Purchased ${item.name}! 🎉`, 'success');
}

function equipCosmetic(category, itemId) {
    const item = COSMETICS[category][itemId];
    if (!item) return;

    const ownedList = userCosmetics.owned[category];
    if (!ownedList || !ownedList.includes(itemId)) return;

    userCosmetics.equipped[item.slot] = itemId;
    saveCosmeticsToDB();
    applyCurrentCosmetics();
    switchCosmeticTab(category); // Refresh display

    showCosmeticNotification(`Equipped ${item.name}!`, 'success');
}

function unequipCosmetic(slot) {
    userCosmetics.equipped[slot] = null;
    saveCosmeticsToDB();
    applyCurrentCosmetics();
}

// ==================== GACHA SYSTEM ====================

function renderGachaMachine() {
    const content = document.getElementById('cosmeticContent');
    if (!content) return;

    content.innerHTML = `
        <div class="gacha-container">
            <div class="gacha-machine">
                <div class="gacha-title">🎰 COSMETIC ROLL</div>
                <p style="color: #bbb; font-size: 16px; margin: 20px 0;">
                    Roll for random cosmetic items! Higher tier rolls have better odds.
                </p>

                <div class="gacha-options">
                    <div class="gacha-option" onclick="rollGacha('basic')">
                        <div class="gacha-option-name">Basic Roll</div>
                        <div class="gacha-option-cost">🪙 100</div>
                        <div style="font-size: 12px; color: #aaa; margin-top: 10px;">
                            Common/Uncommon
                        </div>
                    </div>

                    <div class="gacha-option" onclick="rollGacha('premium')">
                        <div class="gacha-option-name">Premium Roll</div>
                        <div class="gacha-option-cost">🪙 400</div>
                        <div style="font-size: 12px; color: #aaa; margin-top: 10px;">
                            Rare+
                        </div>
                    </div>

                    <div class="gacha-option" onclick="rollGacha('legendary')">
                        <div class="gacha-option-name">Legendary Roll</div>
                        <div class="gacha-option-cost">🪙 1000</div>
                        <div style="font-size: 12px; color: #aaa; margin-top: 10px;">
                            Epic/Legendary
                        </div>
                    </div>
                </div>

                <div id="gachaResult" class="gacha-result" style="display: none;"></div>
            </div>

            <div style="background: rgba(0,0,0,0.3); border-radius: 15px; padding: 20px; margin: 20px; color: #bbb;">
                <h3 style="color: white;">📊 Your Roll Stats</h3>
                <p>Total Rolls: ${userCosmetics.stats.totalRolls}</p>
                <p>Total Spent on Cosmetics: ${userCosmetics.stats.coinsSpent.toLocaleString()} 🪙</p>
            </div>
        </div>
    `;

    updateModalCoins();
}

async function rollGacha(tier) {
    const costs = {
        basic: 100,
        premium: 400,
        legendary: 1000
    };

    const cost = costs[tier];

    if (typeof userProgression === 'undefined' || userProgression.truth_coins < cost) {
        showCosmeticNotification(`Not enough coins! Need ${cost} 🪙`, 'error');
        return;
    }

    const success = await spendCoins(cost);
    if (!success) return;

    userCosmetics.stats.totalRolls++;
    userCosmetics.stats.coinsSpent += cost;

    // Determine rarity based on tier
    const rarity = determineGachaRarity(tier);

    // Select random item of that rarity
    const item = selectRandomItemByRarity(rarity);

    if (!item) {
        showCosmeticNotification('Roll failed! Refunding coins...', 'error');
        await refundCoins(cost);
        return;
    }

    // Add to inventory if not owned
    const categoryKey = item.category === 'avatars' ? 'avatars' :
                        item.category === 'clothing' ? 'clothing' :
                        item.category === 'weapons' ? 'weapons' : 'accessories';

    const isDuplicate = userCosmetics.owned[categoryKey].includes(item.id);

    if (!isDuplicate) {
        userCosmetics.owned[categoryKey].push(item.id);
    }

    await saveCosmeticsToDB();

    // Show result
    displayGachaResult(item, isDuplicate);
}

function determineGachaRarity(tier) {
    const rand = Math.random() * 100;

    if (tier === 'basic') {
        if (rand < 70) return 'common';
        if (rand < 95) return 'uncommon';
        return 'rare';
    } else if (tier === 'premium') {
        if (rand < 40) return 'uncommon';
        if (rand < 75) return 'rare';
        if (rand < 95) return 'epic';
        return 'legendary';
    } else { // legendary
        if (rand < 30) return 'rare';
        if (rand < 70) return 'epic';
        return 'legendary';
    }
}

function selectRandomItemByRarity(rarity) {
    const allItems = [];

    // Collect all items of the specified rarity
    for (const [category, items] of Object.entries(COSMETICS)) {
        for (const item of Object.values(items)) {
            if (item.rarity === rarity) {
                allItems.push({ ...item, category });
            }
        }
    }

    if (allItems.length === 0) return null;

    return allItems[Math.floor(Math.random() * allItems.length)];
}

function displayGachaResult(item, isDuplicate) {
    const result = document.getElementById('gachaResult');
    if (!result) return;

    result.style.display = 'flex';
    result.innerHTML = `
        <div class="gacha-result-emoji">${item.emoji}</div>
        <div class="gacha-result-name" style="color: ${RARITY_INFO[item.rarity].color}">
            ${item.name}
        </div>
        <div class="cosmetic-rarity" style="color: ${RARITY_INFO[item.rarity].color}">
            ${item.rarity.toUpperCase()}
        </div>
        <div class="cosmetic-description">${item.description}</div>
        ${isDuplicate ? '<div style="color: #f39c12; margin-top: 15px; font-weight: bold;">⚠️ DUPLICATE - Already Owned</div>' : '<div style="color: #1abc9c; margin-top: 15px; font-weight: bold;">✨ NEW ITEM!</div>'}
    `;

    if (!isDuplicate && item.rarity === 'legendary') {
        // Special celebration for legendary
        createConfettiEffect();
    }

    updateModalCoins();
}

function createConfettiEffect() {
    // Simple confetti effect (would be enhanced with a library in production)
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const colors = ['#1abc9c', '#f39c12', '#e74c3c', '#9b59b6', '#3498db'];
            console.log(`🎉 LEGENDARY ITEM! 🎉`);
        }, i * 50);
    }
}

// ==================== COIN MANAGEMENT ====================

async function spendCoins(amount) {
    try {
        if (typeof supabase === 'undefined' || !user || !user.id) {
            // Offline mode - just deduct from local
            if (userProgression.truth_coins >= amount) {
                userProgression.truth_coins -= amount;
                if (typeof updateCoinsDisplay === 'function') {
                    updateCoinsDisplay();
                }
                return true;
            }
            return false;
        }

        const { data, error } = await supabase.rpc('spend_coins_atomic', {
            p_user_id: user.id,
            p_amount: amount
        });

        if (!error && data && data.length > 0) {
            userProgression.truth_coins = data[0].truth_coins;
            if (typeof updateCoinsDisplay === 'function') {
                updateCoinsDisplay();
            }
            updateModalCoins();
            return true;
        }

        return false;
    } catch (err) {
        console.error('[Cosmetics] Error spending coins:', err);
        return false;
    }
}

async function refundCoins(amount) {
    try {
        if (typeof supabase === 'undefined' || !user || !user.id) {
            userProgression.truth_coins += amount;
            if (typeof updateCoinsDisplay === 'function') {
                updateCoinsDisplay();
            }
            return;
        }

        await supabase.rpc('award_coins_atomic', {
            p_user_id: user.id,
            p_amount: amount
        });

        if (typeof updateCoinsDisplay === 'function') {
            updateCoinsDisplay();
        }
    } catch (err) {
        console.error('[Cosmetics] Error refunding coins:', err);
    }
}

// ==================== APPLY COSMETICS ====================

function applyCurrentCosmetics() {
    // Update avatar display in UI
    const avatarDisplays = document.querySelectorAll('.user-avatar-display');
    const avatar = COSMETICS.avatars[userCosmetics.avatarId];

    if (avatar) {
        avatarDisplays.forEach(display => {
            display.textContent = avatar.emoji;
            display.title = avatar.name;
        });
    }

    // Apply stat bonuses from equipped items
    calculateCosmeticBonuses();
}

function calculateCosmeticBonuses() {
    let accuracyBonus = 0;

    // Weapons provide accuracy bonuses
    const weapon = userCosmetics.equipped.weapon;
    if (weapon) {
        const weaponData = COSMETICS.weapons[weapon];
        if (weaponData) {
            if (weapon === 'magnify') accuracyBonus += 5;
            else if (weapon === 'scanner') accuracyBonus += 10;
            else if (weapon === 'wand') accuracyBonus += 20;
            else if (weapon === 'staff') accuracyBonus += 30;
        }
    }

    // Store bonuses for use in detection system
    if (typeof window !== 'undefined') {
        window.cosmeticBonuses = {
            accuracy: accuracyBonus
        };
    }
}

// ==================== TAB SWITCHING ====================

function switchCosmeticTab(tab) {
    // Update tab buttons
    document.querySelectorAll('.cosmetic-tab').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase().includes(tab)) {
            btn.classList.add('active');
        }
    });

    const content = document.getElementById('cosmeticContent');
    if (!content) return;

    if (tab === 'avatars') {
        content.innerHTML = '<div id="avatarGrid" class="cosmetic-grid"></div>';
        renderAvatarGrid();
    } else if (tab === 'clothing') {
        renderCosmeticCategory('clothing', COSMETICS.clothing);
    } else if (tab === 'weapons') {
        renderCosmeticCategory('weapons', COSMETICS.weapons);
    } else if (tab === 'accessories') {
        renderCosmeticCategory('accessories', COSMETICS.accessories);
    } else if (tab === 'gacha') {
        renderGachaMachine();
    }

    updateModalCoins();
}

function renderCosmeticCategory(category, items) {
    const content = document.getElementById('cosmeticContent');
    if (!content) return;

    const grid = document.createElement('div');
    grid.className = 'cosmetic-grid';

    Object.values(items).forEach(item => {
        const ownedList = userCosmetics.owned[category] || [];
        const owned = ownedList.includes(item.id);
        const equipped = userCosmetics.equipped[item.slot] === item.id;

        const itemDiv = document.createElement('div');
        itemDiv.className = `cosmetic-item ${owned ? 'owned' : 'locked'} ${equipped ? 'equipped' : ''}`;
        itemDiv.style.borderColor = RARITY_INFO[item.rarity].color;

        itemDiv.innerHTML = `
            <div class="cosmetic-emoji">${item.emoji}</div>
            <div class="cosmetic-name">${item.name}</div>
            <div class="cosmetic-rarity" style="color: ${RARITY_INFO[item.rarity].color}">${item.rarity}</div>
            <div class="cosmetic-description">${item.description}</div>
            ${!owned ? `<div class="cosmetic-price">🪙 ${item.price}</div>` : ''}
        `;

        if (owned && !equipped) {
            itemDiv.onclick = () => equipCosmetic(category, item.id);
        } else if (owned && equipped) {
            itemDiv.onclick = () => unequipCosmetic(item.slot);
        } else if (!owned) {
            itemDiv.onclick = () => purchaseCosmetic(category, item.id);
        }

        grid.appendChild(itemDiv);
    });

    content.innerHTML = '';
    content.appendChild(grid);
}

// ==================== NOTIFICATIONS ====================

function showCosmeticNotification(message, type = 'info') {
    const colors = {
        success: '#1abc9c',
        error: '#e74c3c',
        warning: '#f39c12',
        info: '#3498db'
    };

    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        font-weight: bold;
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

// ==================== CLOSE MODAL ====================

window.closeAvatarModal = function() {
    const modal = document.getElementById('avatarModal');
    if (modal) {
        modal.style.display = 'none';
    }
};

// ==================== CLOSE GACHA RESULT MODAL ====================
// BUG FIX: This function was missing - called from index.html but not defined

window.closeGachaResult = function() {
    const modal = document.getElementById('gachaResultModal');
    if (modal) {
        modal.style.display = 'none';
    }
};

// ==================== OPEN AVATAR VIEW ====================
// BUG FIX: This function was missing - called from index.html but not defined

window.openAvatarView = function() {
    // Open the avatar selector/customization view
    if (typeof openAvatarSelector === 'function') {
        openAvatarSelector();
    } else {
        console.error('[Cosmetics] openAvatarSelector not available');
        // Fallback: show view directly if it exists
        const avatarView = document.getElementById('avatarView');
        if (avatarView) {
            document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
            avatarView.classList.add('active');
        }
    }
};

// ==================== EXPORTS ====================

window.openAvatarSelector = openAvatarSelector;
window.switchCosmeticTab = switchCosmeticTab;
window.rollGacha = rollGacha;
window.initCosmeticsSystem = initCosmeticsSystem;

console.log('[Cosmetics] Avatar & Cosmetics System loaded');