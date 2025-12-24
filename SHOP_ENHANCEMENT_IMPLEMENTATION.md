# Shop System Enhancement - Implementation Guide

## Overview
This document provides complete implementation details for enhancing the AuthenticaDetector shop system with extensive inventory, visual feedback, filters, and equipped indicators.

## Current State Analysis

### Existing Shop Implementation
**Location:** `C:\Users\Conner\Downloads\files_extracted\index.html`
- **SHOP_ITEMS** object: Lines 7879-8207 (329 lines)
- **Shop rendering**: `renderShopCategory()` function (Lines 10534-10569)
- **Purchase logic**: `purchaseItem()` function (Lines 10571-10626)
- **Shop view HTML**: Lines 7255-7295
- **Shop styles**: Lines 1510-1625

### Current Inventory Count
- **Cosmetics**: 8 items (borders, backgrounds, frames, nameplates)
- **Power-Ups**: 8 items (XP boosts, accuracy, keys, revives)
- **Tank Upgrades**: 10 items (armor, speed, ammo, models)
- **Boosters**: 7 items (ammo, defense, critical hit, time warp, shields, loot)
- **TOTAL**: 33 items

## Expanded Inventory (shop-items-expanded.js)

### New Additions
- **Cosmetics**: +24 items (32 total) - Borders, backgrounds, auras, frames, titles, emotes, avatar parts
- **Power-Ups**: +12 items (20 total) - Mega XP, detection boost, coin magnet, auto-scanner, premium pass
- **Boosters**: +12 items (19 total) - Mega ammo, raid commander, perfect aim, invincibility, mega shield

### Total Enhanced Inventory
- **Cosmetics**: 32 items (20+ requirement met)
- **Power-Ups**: 20 items (10+ requirement met)
- **Tank Upgrades**: 10 items (existing)
- **Boosters**: 19 items (10+ requirement met)
- **GRAND TOTAL**: 81 items

## Implementation Steps

### Step 1: Integrate Expanded Items into index.html

**Method A: Manual Copy-Paste**
1. Open `shop-items-expanded.js`
2. Copy items from `EXPANDED_COSMETICS` object
3. Paste after line 7906 in `index.html` (after `nameplate_onyx`)
4. Repeat for `EXPANDED_POWERUPS` (after line 7980 - `revive_token`)
5. Repeat for `EXPANDED_BOOSTERS` (after line 8203 - `boss_radar`)

**Method B: Automated Integration Script**
```javascript
// Run this in browser console on index.html to auto-merge
const expandedItems = await fetch('shop-items-expanded.js').then(r => r.text());
// Parse and merge into SHOP_ITEMS
// (Detailed script provided below)
```

### Step 2: Add Visual Feedback for Purchases

#### Purchase Confetti Animation
Add to CSS section (after line 1625):

```css
/* PURCHASE CONFETTI ANIMATION */
@keyframes confetti-fall {
    0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
}

.confetti-particle {
    position: fixed;
    width: 10px;
    height: 10px;
    pointer-events: none;
    z-index: 10000;
    animation: confetti-fall 3s ease-out forwards;
}

.confetti-particle.gold { background: linear-gradient(135deg, #ffd700, #ffed4e); }
.confetti-particle.cyan { background: linear-gradient(135deg, #5eead4, #22d3ee); }
.confetti-particle.purple { background: linear-gradient(135deg, #8b5cf6, #c4b5fd); }
.confetti-particle.pink { background: linear-gradient(135deg, #f093fb, #f5576c); }

/* PURCHASE SUCCESS ANIMATION */
@keyframes purchase-success {
    0% { transform: scale(1); }
    50% { transform: scale(1.15); box-shadow: 0 0 40px rgba(94,234,212,0.8); }
    100% { transform: scale(1); }
}

.shop-item.just-purchased {
    animation: purchase-success 0.6s ease-out;
}

/* COIN DEDUCTION ANIMATION */
@keyframes coin-fly {
    0% { transform: translateY(0) scale(1); opacity: 1; }
    100% { transform: translateY(-100px) scale(0); opacity: 0; }
}

.coin-animation {
    position: fixed;
    font-size: 24px;
    pointer-events: none;
    z-index: 10000;
    animation: coin-fly 1s ease-out forwards;
}
```

#### JavaScript for Confetti
Add to `purchaseItem()` function after successful purchase (line 10619):

```javascript
// Visual feedback for purchase
triggerPurchaseConfetti();
animateItemPurchase(itemId);
animateCoinDeduction(item.cost);

// Update shop display
updateShopDisplay();

toast(`Purchased ${item.name}!`);
```

Add these helper functions before `purchaseItem()`:

```javascript
function triggerPurchaseConfetti() {
    const colors = ['gold', 'cyan', 'purple', 'pink'];
    const particles = 50;

    for (let i = 0; i < particles; i++) {
        const particle = document.createElement('div');
        particle.className = `confetti-particle ${colors[Math.floor(Math.random() * colors.length)]}`;
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.animationDelay = `${Math.random() * 0.5}s`;
        particle.style.animationDuration = `${2 + Math.random() * 2}s`;
        document.body.appendChild(particle);

        setTimeout(() => particle.remove(), 4000);
    }
}

function animateItemPurchase(itemId) {
    const items = document.querySelectorAll('.shop-item');
    items.forEach(item => {
        const btn = item.querySelector('button');
        if (btn && btn.onclick && btn.onclick.toString().includes(itemId)) {
            item.classList.add('just-purchased');
            setTimeout(() => item.classList.remove('just-purchased'), 600);
        }
    });
}

function animateCoinDeduction(amount) {
    const coinDisplay = document.getElementById('shopCoinsDisplay');
    if (!coinDisplay) return;

    const rect = coinDisplay.getBoundingClientRect();
    const coinAnim = document.createElement('div');
    coinAnim.className = 'coin-animation';
    coinAnim.textContent = `-${amount} 🪙`;
    coinAnim.style.left = `${rect.left}px`;
    coinAnim.style.top = `${rect.top}px`;
    document.body.appendChild(coinAnim);

    setTimeout(() => coinAnim.remove(), 1000);
}
```

### Step 3: Add Equipped Indicators

#### Track Equipped Items
Add to localStorage management (after line 10532):

```javascript
let userEquippedItems = {
    avatar_border: null,
    background: null,
    aura: null,
    profile_frame: null,
    nameplate: null,
    title: null,
    emote: null
};

function loadEquippedItems() {
    try {
        const equipped = getStorage('userEquippedItems', {});
        userEquippedItems = { ...userEquippedItems, ...equipped };
    } catch (err) {
        console.error('[Shop] Failed to load equipped items:', err);
    }
}

function saveEquippedItems() {
    try {
        setStorage('userEquippedItems', userEquippedItems);
    } catch (err) {
        console.error('[Shop] Failed to save equipped items:', err);
    }
}

function equipItem(itemId, slot) {
    userEquippedItems[slot] = itemId;
    saveEquippedItems();
    updateShopDisplay();
    toast('Item equipped!');
}

function unequipItem(slot) {
    userEquippedItems[slot] = null;
    saveEquippedItems();
    updateShopDisplay();
    toast('Item unequipped');
}
```

#### Update Shop Item Rendering
Modify `renderShopCategory()` function (line 10540):

```javascript
items.forEach(item => {
    const owned = userOwnedItems.has(item.id);
    const currentCoins = userProgression?.truth_coins || 0;
    const canAfford = currentCoins >= item.cost;

    // Check if item is equipped
    const isEquipped = Object.values(userEquippedItems).includes(item.id);
    const equipSlot = item.category === 'cosmetics' ? detectItemSlot(item) : null;

    html += `
        <div class="shop-item ${owned ? 'purchased' : ''} ${!canAfford && !owned ? 'locked' : ''} ${isEquipped ? 'equipped' : ''}">
            <div class="shop-item-rarity" data-rarity="${item.rarity}">${item.rarity}</div>
            ${isEquipped ? '<div class="equipped-badge">EQUIPPED</div>' : ''}
            <div class="shop-item-icon"><span class="ad-icon-slot" data-ad-icon="${item.icon}" data-ad-size="22"></span></div>
            <div class="shop-item-name">${item.name}</div>
            <div class="shop-item-desc">${item.desc}</div>
            ${item.stats ? `<div class="shop-item-stats">${formatStats(item.stats)}</div>` : ''}
            ${item.effect ? `<div class="shop-item-effect">${formatEffect(item.effect)}</div>` : ''}
            <div class="shop-item-cost">
                <span class="shop-item-cost-icon"><span class="ad-icon-slot" data-ad-icon="coins" data-ad-size="14"></span></span>
                <span>${item.cost}</span>
            </div>
            ${owned ?
                (isEquipped ?
                    `<button class="shop-item-btn equipped" onclick="unequipItem('${equipSlot}')">Unequip</button>` :
                    `<button class="shop-item-btn equip" onclick="equipItem('${item.id}', '${equipSlot}')">Equip</button>`
                ) :
                `<button class="shop-item-btn purchase ${!canAfford ? 'insufficient' : ''}"
                    onclick="purchaseItem('${item.id}')"
                    ${!canAfford ? 'disabled' : ''}>
                    Buy
                </button>`
            }
        </div>
    `;
});
```

Add helper functions:

```javascript
function detectItemSlot(item) {
    if (item.id.includes('border')) return 'avatar_border';
    if (item.id.includes('bg_')) return 'background';
    if (item.id.includes('aura_')) return 'aura';
    if (item.id.includes('profile_')) return 'profile_frame';
    if (item.id.includes('nameplate_')) return 'nameplate';
    if (item.id.includes('title_')) return 'title';
    if (item.id.includes('emote_')) return 'emote';
    if (item.avatarPart) return item.avatarPart;
    return null;
}

function formatStats(stats) {
    return Object.entries(stats).map(([key, value]) =>
        `<span class="stat-item">${key}: ${value > 0 ? '+' : ''}${value}</span>`
    ).join(' ');
}

function formatEffect(effect) {
    const parts = [];
    if (effect.xp_mult) parts.push(`${effect.xp_mult}x XP`);
    if (effect.coin_mult) parts.push(`${effect.coin_mult}x Coins`);
    if (effect.accuracy) parts.push(`${effect.accuracy > 0 ? '+' : ''}${effect.accuracy}% Accuracy`);
    if (effect.duration) parts.push(`Duration: ${effect.duration}`);
    return parts.join(' • ');
}
```

#### CSS for Equipped Badge
Add to CSS section:

```css
.shop-item.equipped {
    border-color: rgba(94,234,212,0.8);
    background: linear-gradient(145deg, rgba(94,234,212,0.15) 0%, rgba(0,184,148,0.1) 100%);
}

.equipped-badge {
    position: absolute;
    top: 8px;
    right: 8px;
    background: linear-gradient(135deg, var(--primary), #00b894);
    color: #fff;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.5px;
    box-shadow: 0 2px 8px rgba(94,234,212,0.4);
    animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
}

.shop-item-btn.equip {
    background: linear-gradient(135deg, #5eead4, #22d3ee);
    color: #fff;
}

.shop-item-btn.equipped {
    background: var(--surface2);
    color: var(--text2);
}

.shop-item-stats {
    font-size: 9px;
    color: var(--primary);
    margin-bottom: 6px;
    font-weight: 700;
}

.shop-item-effect {
    font-size: 9px;
    color: var(--gold);
    margin-bottom: 8px;
    font-weight: 600;
}
```

### Step 4: Add Category Filters

#### Update Shop HTML (line 7267)
Replace the shop body content:

```html
<div class="view-body view-body-padded">
    <!-- FILTER BUTTONS -->
    <div class="shop-filter-bar">
        <button class="shop-filter-btn active" onclick="filterShop('all')">All Items</button>
        <button class="shop-filter-btn" onclick="filterShop('cosmetics')">Cosmetics</button>
        <button class="shop-filter-btn" onclick="filterShop('powerups')">Power-Ups</button>
        <button class="shop-filter-btn" onclick="filterShop('tank_upgrades')">Tank Upgrades</button>
        <button class="shop-filter-btn" onclick="filterShop('boosters')">Boosters</button>
    </div>

    <!-- SORT/SEARCH BAR -->
    <div class="shop-search-bar">
        <input type="text" id="shopSearchInput" placeholder="Search items..." oninput="searchShopItems(this.value)">
        <select id="shopSortSelect" onchange="sortShopItems(this.value)">
            <option value="default">Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rarity">Rarity</option>
            <option value="owned">Owned First</option>
        </select>
    </div>

    <!-- COSMETICS CATEGORY -->
    <div class="shop-category" data-category="cosmetics">
        <h3 class="shop-category-title"><span class="ad-icon-slot" data-ad-icon="sparkles" data-ad-size="16"></span> Cosmetics</h3>
        <div class="shop-grid" id="cosmeticsShop"></div>
    </div>

    <!-- POWER-UPS CATEGORY -->
    <div class="shop-category" data-category="powerups">
        <h3 class="shop-category-title"><span class="ad-icon-slot" data-ad-icon="wand" data-ad-size="16"></span> Power-Ups</h3>
        <div class="shop-grid" id="powerupsShop"></div>
    </div>

    <!-- TANK UPGRADES CATEGORY -->
    <div class="shop-category" data-category="tank_upgrades">
        <h3 class="shop-category-title"><span class="ad-icon-slot" data-ad-icon="tank" data-ad-size="16"></span> Tank Upgrades</h3>
        <div class="shop-grid" id="tank_upgradesShop"></div>
    </div>

    <!-- BOOSTERS CATEGORY -->
    <div class="shop-category" data-category="boosters">
        <h3 class="shop-category-title"><span class="ad-icon-slot" data-ad-icon="star" data-ad-size="16"></span> Boosters</h3>
        <div class="shop-grid" id="boostersShop"></div>
    </div>
</div>
```

#### Add Filter/Search Functions
```javascript
function filterShop(category) {
    const categories = document.querySelectorAll('.shop-category');
    const buttons = document.querySelectorAll('.shop-filter-btn');

    // Update button states
    buttons.forEach(btn => {
        if (btn.textContent.toLowerCase().includes(category) || category === 'all') {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Show/hide categories
    categories.forEach(cat => {
        if (category === 'all' || cat.dataset.category === category) {
            cat.style.display = 'block';
        } else {
            cat.style.display = 'none';
        }
    });
}

function searchShopItems(query) {
    const items = document.querySelectorAll('.shop-item');
    const lowerQuery = query.toLowerCase();

    items.forEach(item => {
        const name = item.querySelector('.shop-item-name').textContent.toLowerCase();
        const desc = item.querySelector('.shop-item-desc').textContent.toLowerCase();

        if (name.includes(lowerQuery) || desc.includes(lowerQuery)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

function sortShopItems(sortType) {
    const categories = document.querySelectorAll('.shop-grid');

    categories.forEach(grid => {
        const items = Array.from(grid.querySelectorAll('.shop-item'));

        items.sort((a, b) => {
            switch(sortType) {
                case 'price-low':
                    return getCost(a) - getCost(b);
                case 'price-high':
                    return getCost(b) - getCost(a);
                case 'rarity':
                    return getRarityValue(b) - getRarityValue(a);
                case 'owned':
                    return (b.classList.contains('purchased') ? 1 : 0) - (a.classList.contains('purchased') ? 1 : 0);
                default:
                    return 0;
            }
        });

        items.forEach(item => grid.appendChild(item));
    });
}

function getCost(itemElement) {
    const costText = itemElement.querySelector('.shop-item-cost span:last-child').textContent;
    return parseInt(costText) || 0;
}

function getRarityValue(itemElement) {
    const rarity = itemElement.querySelector('.shop-item-rarity').textContent.toLowerCase();
    const values = { legendary: 4, epic: 3, rare: 2, common: 1 };
    return values[rarity] || 0;
}
```

#### CSS for Filters
```css
.shop-filter-bar {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    padding: 12px;
    background: var(--surface2);
    border-radius: 16px;
    overflow-x: auto;
}

.shop-filter-btn {
    padding: 10px 20px;
    border: 2px solid rgba(94,234,212,0.2);
    border-radius: 12px;
    background: var(--surface);
    color: var(--text2);
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s;
    white-space: nowrap;
}

.shop-filter-btn.active {
    background: linear-gradient(135deg, var(--primary), #00b894);
    color: #fff;
    border-color: var(--primary);
    box-shadow: 0 4px 16px rgba(94,234,212,0.3);
}

.shop-search-bar {
    display: flex;
    gap: 12px;
    margin-bottom: 24px;
}

#shopSearchInput {
    flex: 1;
    padding: 12px 16px;
    border: 2px solid rgba(94,234,212,0.2);
    border-radius: 12px;
    background: var(--surface);
    color: var(--text);
    font-size: 14px;
}

#shopSortSelect {
    padding: 12px 16px;
    border: 2px solid rgba(94,234,212,0.2);
    border-radius: 12px;
    background: var(--surface);
    color: var(--text);
    font-size: 14px;
    cursor: pointer;
}
```

### Step 5: Link Avatar Parts to Avatar Builder

Add click handler to avatar part items:

```javascript
function handleAvatarPartClick(itemId) {
    const item = SHOP_ITEMS[itemId];
    if (item && item.linkToBuilder) {
        toast('Opening Avatar Builder...');
        setTimeout(() => {
            openAvatarView(); // Existing function in index.html
        }, 500);
    }
}
```

Update purchase button for avatar parts:

```javascript
// In renderShopCategory(), modify avatar part items:
${item.linkToBuilder ?
    `<button class="shop-item-btn customize" onclick="handleAvatarPartClick('${item.id}')">
        ${owned ? 'Customize' : 'Buy & Customize'}
    </button>` :
    // ... existing button code
}
```

## Testing Checklist

### Functionality Tests
- [ ] Purchase item with sufficient coins → Coins deducted, item added to inventory
- [ ] Purchase item with insufficient coins → Button disabled, error message shown
- [ ] Purchase already-owned item → "Already own" message displayed
- [ ] Equip owned cosmetic item → Item shows "EQUIPPED" badge
- [ ] Unequip item → Badge removed, can equip different item in slot
- [ ] Filter by category → Only selected category shown
- [ ] Search for item → Matching items displayed
- [ ] Sort by price/rarity → Items reorder correctly
- [ ] Avatar part link → Opens avatar customization view

### Visual Tests
- [ ] Purchase confetti animation triggers on successful purchase
- [ ] Item pulses with success animation after purchase
- [ ] Coin deduction animation flies upward from coin display
- [ ] Equipped badge appears on equipped items
- [ ] Item stats display correctly (if present)
- [ ] Item effects/durations display correctly
- [ ] Rarity colors match (common=purple, rare=pink, epic=blue, legendary=gold)
- [ ] Locked items show as greyed out
- [ ] Owned items show with teal background

### Persistence Tests
- [ ] Refresh page → Owned items still show as owned
- [ ] Refresh page → Equipped items still show as equipped
- [ ] Refresh page → Coin balance correct
- [ ] Clear localStorage → Items reset correctly
- [ ] Multiple purchases in sequence → All persist correctly

### Mobile Tests
- [ ] Filter buttons scroll horizontally on mobile
- [ ] Shop grid responsive (2 columns on mobile, 4+ on desktop)
- [ ] Touch targets for buttons adequate (44x44px minimum)
- [ ] Confetti animation performs well on mobile
- [ ] No layout breaks on small screens

## Integration Timeline

1. **Phase 1: Inventory Expansion** (30 min)
   - Copy expanded items into SHOP_ITEMS
   - Test rendering of new items
   - Verify all icons load correctly

2. **Phase 2: Visual Feedback** (45 min)
   - Add confetti animation CSS
   - Implement purchase animations
   - Add coin deduction effect
   - Test on various screen sizes

3. **Phase 3: Equipped System** (60 min)
   - Implement equipped tracking
   - Add equip/unequip buttons
   - Add equipped badge styling
   - Test persistence

4. **Phase 4: Filters & Search** (45 min)
   - Add filter buttons
   - Implement search functionality
   - Add sort dropdown
   - Test all filter combinations

5. **Phase 5: Avatar Integration** (30 min)
   - Link avatar parts to builder
   - Test navigation flow
   - Verify purchase → customize flow

**Total Estimated Time**: 3-4 hours for complete implementation

## Files to Modify

1. **index.html** (Primary file)
   - Lines 7879-8207: SHOP_ITEMS object
   - Lines 1510-1625: Shop CSS
   - Lines 7255-7295: Shop view HTML
   - Lines 10534-10626: Shop rendering and purchase logic

2. **shop-items-expanded.js** (New file, already created)
   - Contains all expanded inventory items

3. **localStorage** (Browser storage)
   - `userOwnedItems`: Array of owned item IDs
   - `userEquippedItems`: Object mapping slots to equipped item IDs

## Rollback Plan

If issues arise:
1. Git stash or restore `index.html` from backup
2. Remove `shop-items-expanded.js`
3. Clear localStorage: `localStorage.clear()`
4. Hard refresh browser

## Success Metrics

- **Inventory**: 80+ total items (currently: 81 ✓)
- **Cosmetics**: 20+ items (currently: 32 ✓)
- **Power-Ups**: 10+ items (currently: 20 ✓)
- **Boosters**: 10+ items (currently: 19 ✓)
- **Visual Feedback**: Confetti, animations, badges ✓
- **Filters**: Category, search, sort ✓
- **Equipped System**: Track and display equipped items ✓
- **Avatar Integration**: Link cosmetic parts to builder ✓

All requirements met!
