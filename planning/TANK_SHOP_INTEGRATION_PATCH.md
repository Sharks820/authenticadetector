# TANK SHOP INTEGRATION PATCH
**Date:** 2025-12-23
**Purpose:** Fix tank upgrade purchases to actually work in-game
**Files Modified:** index.html
**Dependencies:** tank-shop-bridge.js (already created)

---

## STEP 1: Add tank-shop-bridge.js to index.html

**Location:** After tank-shooter-enhanced.js script tag

**FIND:**
```html
<script src="tank-shooter-enhanced.js"></script>
```

**ADD IMMEDIATELY AFTER:**
```html
<!-- Tank Shop Bridge - Connects shop to game economy -->
<script src="tank-shop-bridge.js"></script>
```

**Complete section should look like:**
```html
<!-- Tank Shooter Game -->
<script src="tank-shooter-enhanced.js"></script>

<!-- Tank Shop Bridge - Connects shop to game economy -->
<script src="tank-shop-bridge.js"></script>

<!-- Avatar & Cosmetics System -->
<script src="avatar-cosmetics-system.js"></script>
```

---

## STEP 2: Modify purchaseItem() Function

**Location:** index.html, around line 10710

**FIND THIS ENTIRE FUNCTION:**
```javascript
async function purchaseItem(itemId) {
    if (!user || !userProgression) {
        toast('Please log in first');
        return;
    }

    const item = SHOP_ITEMS[itemId];
    if (!item) {
        console.error('[Shop] Item not found:', itemId);
        return;
    }

    if (userOwnedItems.has(itemId)) {
        toast('You already own this item');
        return;
    }

    const currentCoins = userProgression.truth_coins || 0;
    if (currentCoins < item.cost) {
        toast('Not enough coins');
        return;
    }

    try {
        // Deduct coins atomically using existing awardCoins function with negative amount
        const { data, error } = await supabase.rpc('award_coins_atomic', {
            p_user_id: user.id,
            p_amount: -item.cost
        });

        if (error) {
            console.error('[Shop] Purchase error:', error);
            toast('Purchase failed. Try again.');
            return;
        }

        if (data && data.length > 0) {
            // Update local state
            userProgression.truth_coins = data[0].truth_coins;

            // Add to owned items
            userOwnedItems.add(itemId);
            saveOwnedItems();

            // Update UI
            updateCoinsDisplay();
            updateShopDisplay();

            toast(`Purchased ${item.name}!`);
            console.log(`[Shop] Successfully purchased ${item.name} for ${item.cost} coins`);
        }
    } catch (err) {
        console.error('[Shop] Purchase failed:', err);
        toast('Purchase failed. Try again.');
    }
}
```

**REPLACE WITH THIS ENHANCED VERSION:**
```javascript
async function purchaseItem(itemId) {
    if (!user || !userProgression) {
        toast('Please log in first');
        return;
    }

    const item = SHOP_ITEMS[itemId];
    if (!item) {
        console.error('[Shop] Item not found:', itemId);
        return;
    }

    if (userOwnedItems.has(itemId)) {
        toast('You already own this item');
        return;
    }

    const currentCoins = userProgression.truth_coins || 0;
    if (currentCoins < item.cost) {
        toast('Not enough coins');
        return;
    }

    try {
        // Deduct coins atomically using existing awardCoins function with negative amount
        const { data, error } = await supabase.rpc('award_coins_atomic', {
            p_user_id: user.id,
            p_amount: -item.cost
        });

        if (error) {
            console.error('[Shop] Purchase error:', error);
            toast('Purchase failed. Try again.');
            return;
        }

        if (data && data.length > 0) {
            // Update local state
            userProgression.truth_coins = data[0].truth_coins;

            // Add to owned items
            userOwnedItems.add(itemId);
            saveOwnedItems();

            // ✅ NEW: Apply tank effects if it's a tank upgrade item
            if (item.category === 'tank_upgrades' && typeof applyTankPurchase === 'function') {
                console.log('[Shop] Applying tank upgrade:', itemId);

                const applied = await applyTankPurchase(itemId);

                if (applied) {
                    // Sync coin counts between systems
                    if (typeof syncTankCoins === 'function') {
                        syncTankCoins();
                    }

                    // Show success with effect description
                    const mapping = typeof TANK_ITEM_MAPPINGS !== 'undefined' ? TANK_ITEM_MAPPINGS[itemId] : null;
                    const effectDesc = mapping ? mapping.description : item.desc;

                    toast(`${item.name} equipped! ${effectDesc}`);
                    console.log(`[Shop] ✅ Tank upgrade applied: ${itemId}`);
                } else {
                    // Purchase succeeded but effect failed to apply
                    toast(`Purchased ${item.name}! (Effect will apply when you play Tank Shooter)`);
                    console.warn(`[Shop] ⚠️ Tank upgrade purchased but not applied yet: ${itemId}`);
                }
            } else {
                // Non-tank item or bridge not loaded
                toast(`Purchased ${item.name}!`);
                console.log(`[Shop] Successfully purchased ${item.name} for ${item.cost} coins`);
            }

            // Update UI
            updateCoinsDisplay();
            updateShopDisplay();
        }
    } catch (err) {
        console.error('[Shop] Purchase failed:', err);
        toast('Purchase failed. Try again.');
    }
}
```

**KEY CHANGES:**
1. Added tank upgrade detection: `if (item.category === 'tank_upgrades' ...)`
2. Calls `applyTankPurchase(itemId)` from bridge module
3. Calls `syncTankCoins()` to keep coin counts in sync
4. Shows enhanced toast with effect description
5. Graceful fallback if bridge not loaded

---

## STEP 3: Test the Integration

### Manual Testing Steps

1. **Open the game** in browser
2. **Navigate to Shop** view
3. **Find Tank Upgrades** category
4. **Purchase "Light Armor"** (500 coins)
5. **Expected Results:**
   - ✅ Coins deducted
   - ✅ "Owned" badge appears on item
   - ✅ Toast shows "Light Armor equipped! Medium Armor: +40 HP"
   - ✅ Console shows: `[Tank Bridge] ✅ Upgraded armor to level 1`
6. **Start Tank Shooter Game**
7. **Check tank HP:**
   - ✅ Should be 140 HP (100 base + 40 from armor)
   - ✅ HP bar shows increased maximum
8. **Reload page**
9. **Start Tank Shooter again**
10. **Verify HP still 140**
    - ✅ Upgrade persisted to localStorage

### Console Testing

```javascript
// Check if bridge loaded
console.log(typeof applyTankPurchase);
// Expected: "function"

// Check if tankEconomy loaded
console.log(tankEconomy);
// Expected: Object with upgrades, coins, ownedTanks, etc.

// Check current upgrades
console.log(tankEconomy.upgrades);
// Expected: { armor: 1, barrel: 0, tracks: 0, fireRate: 0 }

// Check tank stats
console.log(getTankStatsSummary());
// Expected: { tankName: "Starter Tank", hp: 140, damage: 30, speed: 180, ... }

// Sync coins
syncTankCoins();
console.log('Tank coins:', tankEconomy.coins);
console.log('Progression coins:', userProgression.truth_coins);
// Expected: Both should match
```

### Testing Checklist

- [ ] Bridge script loads without errors
- [ ] Purchase Light Armor (500 coins)
  - [ ] Coins deducted ✅
  - [ ] Item marked owned ✅
  - [ ] Toast shows effect ✅
  - [ ] Console shows upgrade applied ✅
- [ ] Start tank game
  - [ ] Tank HP is 140 (not 100) ✅
  - [ ] Armor upgrade visible in stats ✅
- [ ] Reload page
  - [ ] Upgrade persists ✅
  - [ ] Still have Light Armor owned ✅
- [ ] Purchase Speed Treads (800 coins)
  - [ ] Tank speed increases by +30 ✅
  - [ ] Movement feels faster in game ✅
- [ ] Test invalid purchase (item already owned)
  - [ ] Shows "already own" message ✅
  - [ ] No coins deducted ✅

---

## STEP 4: Add Missing Tank Types (OPTIONAL)

The shop has items for Stealth, Destroyer, and Titan tanks, but these don't exist in TANK_TYPES yet.

**Location:** tank-shooter-enhanced.js, line 237 (inside TANK_TYPES)

**ADD THESE NEW TANKS:**
```javascript
const TANK_TYPES = {
    starter: {
        name: 'Starter Tank',
        cost: 0,
        baseHP: 100,
        baseDamage: 30,
        baseSpeed: 180,
        baseFireRate: 300
    },
    assault: {
        name: 'Assault Tank',
        cost: 2500,
        baseHP: 150,
        baseDamage: 40,
        baseSpeed: 200,
        baseFireRate: 250
    },
    heavy: {
        name: 'Heavy Tank',
        cost: 5000,
        baseHP: 250,
        baseDamage: 50,
        baseSpeed: 140,
        baseFireRate: 400
    },
    sniper: {
        name: 'Sniper Tank',
        cost: 7500,
        baseHP: 120,
        baseDamage: 80,
        baseSpeed: 160,
        baseFireRate: 500
    },

    // ✅ NEW TANKS (for shop items)
    stealth: {
        name: 'Stealth Tank',
        cost: 3500,
        baseHP: 100,
        baseDamage: 35,
        baseSpeed: 220,
        baseFireRate: 280,
        description: 'Invisible when stationary',
        special: 'stealth' // Can be used for special abilities later
    },
    destroyer: {
        name: 'Destroyer Tank',
        cost: 5000,
        baseHP: 150,
        baseDamage: 60,  // 2x starter (30)
        baseSpeed: 180,
        baseFireRate: 150,  // 2x fire rate (half the delay)
        description: '2x damage and fire rate'
    },
    titan: {
        name: 'TITAN Tank',
        cost: 10000,
        baseHP: 300,  // 3x starter (100)
        baseDamage: 60,  // 2x starter (30)
        baseSpeed: 160,
        baseFireRate: 300,
        description: 'Ultimate tank with massive HP and damage',
        special: 'shield'  // Has auto-shield
    }
};
```

**Then test:**
1. Purchase "Destroyer Tank" from shop (5000 coins)
2. Start tank game
3. Tank should have 2x damage and 2x fire rate
4. Verify you're using the Destroyer tank, not Starter

---

## STEP 5: Verify Coin Sync (OPTIONAL)

To ensure coins earned in tank game also update the main progression:

**Location:** tank-shooter-enhanced.js, line 393 (awardCoins function)

**FIND:**
```javascript
function awardCoins(amount, source = 'gameplay') {
    tankEconomy.coins += amount;
    tankEconomy.stats.coinsEarned += amount;
    saveTankEconomy();

    console.log(`[Tank Economy] Awarded ${amount} coins from ${source}. Total: ${tankEconomy.coins}`);
    showCoinAward(amount);
}
```

**ENHANCE TO:**
```javascript
function awardCoins(amount, source = 'gameplay') {
    tankEconomy.coins += amount;
    tankEconomy.stats.coinsEarned += amount;
    saveTankEconomy();

    console.log(`[Tank Economy] Awarded ${amount} coins from ${source}. Total: ${tankEconomy.coins}`);
    showCoinAward(amount);

    // ✅ NEW: Sync to main progression (if bridge loaded)
    if (typeof awardCoinsToMainProgression === 'function') {
        awardCoinsToMainProgression(amount).then(success => {
            if (success) {
                console.log('[Tank Economy] ✅ Coins synced to main progression');
            }
        });
    }
}
```

**This ensures:**
- Coins earned in tank game → Added to userProgression.truth_coins
- Coins spent in shop → Reflected in tank game
- Both systems stay in sync

---

## FILES SUMMARY

### Files Created
1. ✅ `tank-shop-bridge.js` - Bridge module connecting systems
2. ✅ `TANK_ECONOMY_VERIFICATION_REPORT.md` - Full analysis
3. ✅ `TANK_SHOP_INTEGRATION_PATCH.md` - This file (instructions)

### Files to Modify
1. ⚠️ `index.html` - Add script tag, modify purchaseItem()
2. ⚠️ `tank-shooter-enhanced.js` - Add new tanks (optional), enhance awardCoins (optional)

### Files NOT Modified (Already Working)
1. ✅ `avatar-cosmetics-system.js` - Avatar shop (separate system)
2. ✅ `ai-cosmetics-gacha.js` - Gacha system (separate system)
3. ✅ `shop-items-expanded.js` - Shop catalog (not integrated yet)

---

## DEPLOYMENT CHECKLIST

- [ ] 1. Create tank-shop-bridge.js (DONE ✅)
- [ ] 2. Add <script src="tank-shop-bridge.js"></script> to index.html
- [ ] 3. Modify purchaseItem() function in index.html
- [ ] 4. (Optional) Add stealth/destroyer/titan tanks to TANK_TYPES
- [ ] 5. (Optional) Enhance awardCoins() to sync coins
- [ ] 6. Test purchase flow in browser
- [ ] 7. Test tank game with upgraded stats
- [ ] 8. Test persistence (reload page)
- [ ] 9. Test coin sync between systems
- [ ] 10. Deploy to production

---

## TROUBLESHOOTING

### Issue: "applyTankPurchase is not defined"
**Cause:** tank-shop-bridge.js not loaded
**Fix:** Check script tag is added after tank-shooter-enhanced.js

### Issue: "tankEconomy is not defined"
**Cause:** tank-shooter-enhanced.js not loaded or loaded after bridge
**Fix:** Ensure script order is correct

### Issue: Purchase succeeds but stats don't update
**Cause:** Bridge applied effect but game not started
**Fix:** Start tank shooter game - stats will update on load

### Issue: Coins desynced between systems
**Cause:** Coin sync not running
**Fix:** Call syncTankCoins() manually or check bridge auto-sync

### Issue: Tank type not found (stealth/destroyer/titan)
**Cause:** New tanks not added to TANK_TYPES yet
**Fix:** Add tank definitions to tank-shooter-enhanced.js

---

## SUCCESS CRITERIA

✅ **Integration Successful If:**
1. Purchasing tank upgrades in shop → Stats change in game
2. Coins deducted correctly from both systems
3. Upgrades persist after page reload
4. Tank game loads with correct stats
5. Console shows no errors
6. Bridge functions exist: `applyTankPurchase`, `syncTankCoins`

---

**Patch Version:** 1.0
**Date:** 2025-12-23
**Status:** Ready for Integration
**Estimated Integration Time:** 15-30 minutes
