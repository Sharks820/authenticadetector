// ENHANCED SHOP RENDERING FUNCTIONS
// Replace the renderShopCategory function in index.html with this enhanced version

function renderShopCategory(category) {
    const container = document.getElementById(`${category}Shop`);
    if (!container) return;

    const items = Object.values(SHOP_ITEMS).filter(item => item.category === category);

    let html = '';
    items.forEach(item => {
        const owned = userOwnedItems.has(item.id);
        const currentCoins = userProgression?.truth_coins || 0;
        const canAfford = item.realMoney || currentCoins >= item.cost;

        // Badge HTML
        let badgeHTML = '';
        if (item.badge) {
            badgeHTML = `<div class="shop-item-badge ${item.badge.toLowerCase()}">${item.badge}</div>`;
        }

        // Price/Cost HTML
        let costHTML = '';
        if (item.realMoney) {
            costHTML = `<div class="shop-item-price">${item.price}</div>`;
        } else {
            costHTML = `
                <div class="shop-item-cost">
                    <span class="shop-item-cost-icon"><span class="ad-icon-slot" data-ad-icon="coins" data-ad-size="14"></span></span>
                    <span>${item.cost}</span>
                </div>
            `;
        }

        // Purchase Button HTML
        let buttonHTML = '';
        if (owned) {
            buttonHTML = `<button class="shop-item-btn owned" disabled>Owned</button>`;
        } else if (item.realMoney) {
            buttonHTML = `<button class="shop-item-btn purchase" onclick="purchaseRealMoneyItem('${item.id}')">Buy Now</button>`;
        } else {
            buttonHTML = `
                <button class="shop-item-btn purchase ${!canAfford ? 'insufficient' : ''}"
                    onclick="purchaseItem('${item.id}')"
                    ${!canAfford ? 'disabled' : ''}>
                    ${!canAfford ? 'Not Enough Coins' : 'Buy'}
                </button>
            `;
        }

        html += `
            <div class="shop-item ${owned ? 'purchased' : ''} ${!canAfford && !owned ? 'locked' : ''} ${item.realMoney ? 'real-money' : ''}" data-rarity="${item.rarity}">
                ${badgeHTML}
                <div class="shop-item-rarity" data-rarity="${item.rarity}">${item.rarity}</div>
                <div class="shop-item-icon"><span class="ad-icon-slot" data-ad-icon="${item.icon}" data-ad-size="28"></span></div>
                <div class="shop-item-name">${item.name}</div>
                <div class="shop-item-desc">${item.desc}</div>
                ${costHTML}
                ${buttonHTML}
            </div>
        `;
    });

    container.innerHTML = html;

    // Apply icon library if available
    if (window.IconLibrary) {
        window.IconLibrary.apply(container);
    }
}

// Enhanced loadShopView to support new categories
async function loadShopView() {
    console.log('[Shop] Loading enhanced Shop view');

    // Update coins display in shop header
    const shopCoinsDisplay = document.getElementById('shopCoinsDisplay');
    if (shopCoinsDisplay && userProgression) {
        shopCoinsDisplay.textContent = userProgression.truth_coins || 0;
    }

    // Load user owned items from localStorage
    loadOwnedItems();

    // Render all shop categories with new subcategories
    renderShopCategory('skins');
    renderShopCategory('outfits');
    renderShopCategory('accessories');
    renderShopCategory('potions');
    renderShopCategory('buffs');
    renderShopCategory('battle_items');
    renderShopCategory('currency_packs');
    renderShopCategory('premium');

    // Original categories still supported
    renderShopCategory('cosmetics'); // Legacy items
    renderShopCategory('powerups');
    renderShopCategory('tank_upgrades');
    renderShopCategory('boosters');
}

// Placeholder for real money purchases
function purchaseRealMoneyItem(itemId) {
    const item = SHOP_ITEMS[itemId];
    if (!item) return;

    // TODO: Integrate payment gateway (Stripe, PayPal, etc.)
    toast(`Payment integration coming soon! Item: ${item.name} - ${item.price}`, 'info');
    console.log('[Shop] Real money purchase attempted:', item);

    // For demo purposes, you could show a modal here
    alert(`This would open payment gateway for:\n${item.name}\nPrice: ${item.price}\n\nPayment integration coming soon!`);
}
