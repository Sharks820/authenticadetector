# Avatar Customization & Gacha System - Quick Start Guide

## How to Access

1. **Open the App:** Load index.html in browser
2. **Sign In:** Must be logged in to access cosmetics
3. **Navigate:** Click your profile icon → "🎨 Customize Avatar"

## How to Use

### Browsing Cosmetics

1. **Select Tab:** Click Avatars, Frames, Effects, or Titles
2. **View Items:** See all cosmetics in grid layout
   - **Locked:** Grayscale + 🔒 icon (need to unlock via gacha)
   - **Owned:** Full color (click to equip)
   - **Equipped:** Green glow + "✓ EQUIPPED" badge
   - **New:** "NEW!" gold badge (recently acquired)

### Equipping Cosmetics

1. **Click Any Owned Item:** Instantly equips it
2. **See Preview:** Top of screen shows live preview
3. **Changes Reflect:** Your profile and header avatars update

### Rolling Gacha

1. **Check Coins:** Displayed at top-right (need 100+ coins)
2. **Choose Roll Type:**
   - **Roll x1:** 100 coins (single item)
   - **Roll x10:** 900 coins (10 items, 10% discount)
3. **Watch Results:** Animated modal shows what you got
4. **Rarity Indicators:**
   - **Gray:** Common (60% chance)
   - **Blue:** Rare (25% chance)
   - **Purple:** Epic (12% chance)
   - **Gold:** Legendary (3% chance)

### Getting Coins

Earn coins by:
- Completing scans (10-50 coins per scan)
- Finding AI images (bonus coins)
- Playing Truth Cannon game
- Completing quests
- Daily rewards

## Testing the System

### Manual Test Steps

1. **Initial Load:**
   ```
   - Open index.html
   - Check console for: "[Cosmetics] Initialized: 50 avatars, 30 frames, 20 effects, 40 titles"
   ```

2. **Sign In:**
   ```
   - Click "Sign In"
   - Create test account or sign in
   - Check localStorage for userCosmetics
   ```

3. **Open Avatar View:**
   ```
   - Click profile icon
   - Click "🎨 Customize Avatar"
   - Verify view opens with 4 tabs
   ```

4. **Test Tabs:**
   ```
   - Click each tab (Avatars, Frames, Effects, Titles)
   - Verify grid re-renders
   - Check that starter items show as "owned"
   ```

5. **Test Equipping:**
   ```
   - Click "🤖 Bot Basic" (starter avatar)
   - Check preview updates
   - Close view, verify profile avatar changed
   ```

6. **Test Gacha (Need 100 Coins):**
   ```
   - Ensure you have 100+ coins
   - Click "Roll x1"
   - Verify modal appears with result
   - Check NEW badge on item
   - Close modal
   - Verify grid shows new item
   ```

7. **Test Persistence:**
   ```
   - Equip various cosmetics
   - Refresh page (F5)
   - Verify cosmetics still equipped
   ```

### Console Commands for Testing

Open browser console and run:

```javascript
// Give yourself coins for testing
userProgression.truth_coins = 10000;
saveUserProgression();
updateCoinsDisplay();
console.log('Added 10,000 coins for testing');

// View all cosmetics
console.log('Total cosmetics:', getAllCosmetics().length);

// View owned cosmetics
console.log('Your collection:', getAllOwnedCosmetics());

// Check current loadout
console.log('Equipped:', userCosmetics);

// Unlock all items (cheat code)
userCosmetics.avatars.owned = COSMETICS.avatars.map(a => a.id);
userCosmetics.frames.owned = COSMETICS.frames.map(f => f.id);
userCosmetics.effects.owned = COSMETICS.effects.map(e => e.id);
userCosmetics.titles.owned = COSMETICS.titles.map(t => t.id);
saveUserCosmetics();
console.log('Unlocked everything!');

// Reset to starter items
userCosmetics = {
    avatars: { equipped: 'av_bot_basic', owned: ['av_bot_basic'] },
    frames: { equipped: 'fr_basic_circle', owned: ['fr_basic_circle'] },
    effects: { equipped: null, owned: [] },
    titles: { equipped: 'ti_scan_rookie', owned: ['ti_scan_rookie'] }
};
saveUserCosmetics();
console.log('Reset to starter items');
```

### Expected Behavior

✅ **Correct:**
- Locked items are grayscale
- Equipped items have green glow
- NEW badge disappears after viewing item
- Profile avatar updates immediately
- Gacha deducts correct coins
- localStorage persists cosmetics

❌ **Incorrect:**
- Clicking locked item shows toast "You don't own this cosmetic yet!"
- Rolling gacha without coins shows "Not enough coins!"
- Signing out doesn't delete cosmetics (localStorage persists)

## Troubleshooting

### Issue: "openAvatarView is not defined"
**Solution:** Ensure cosmetics_system.js is loaded:
```html
<script src="cosmetics_system.js"></script>
```

### Issue: "Cosmetics not persisting"
**Solution:** Check localStorage:
```javascript
localStorage.getItem('userCosmetics'); // Should return JSON
```

### Issue: "No coins to roll gacha"
**Solution:** Add coins via console:
```javascript
userProgression.truth_coins = 1000;
saveUserProgression();
```

### Issue: "Gacha results modal won't close"
**Solution:** Click "Awesome!" button or run:
```javascript
closeGachaResult();
```

### Issue: "Avatar not updating in profile"
**Solution:** Force update:
```javascript
updateProfileAvatar();
```

## Item Count Summary

| Category | Common | Rare | Epic | Legendary | **Total** |
|----------|--------|------|------|-----------|-----------|
| Avatars  | 30     | 15   | 10   | 5         | **50**    |
| Frames   | 14     | 8    | 5    | 3         | **30**    |
| Effects  | 8      | 6    | 4    | 2         | **20**    |
| Titles   | 20     | 10   | 6    | 4         | **40**    |
| **TOTAL**| **62** | **39** | **25** | **14** | **140** |

## Rarity Drop Rates

| Rarity    | Base Rate | With Duplicate Protection |
|-----------|-----------|---------------------------|
| Common    | 60%       | ~55% (reduced)            |
| Rare      | 25%       | ~22% (unchanged)          |
| Epic      | 12%       | 18% (boosted)             |
| Legendary | 3%        | 5% (boosted)              |

**Duplicate Protection Triggers:** When you own 70%+ of common items

## Sample Cosmetics by Rarity

### Legendary (3% chance) - Gold Border
- 🧠 Neural God
- 👑 Quantum King
- 🔮 Digital Oracle
- 🌐 Matrix Master
- ⚡ Cyber Supreme

### Epic (12% chance) - Purple Border
- 🔥 Fire Bot
- ❄️ Ice Algorithm
- 🌟 Star AI
- 🌙 Moon Chip
- 🎭 Deep Fake

### Rare (25% chance) - Blue Border
- 🦾 Cyborg
- 👾 Pixel AI
- ⚡ Electric Mind
- 🎆 Hologram
- 💾 Data Ghost

### Common (60% chance) - Gray Border
- 🤖 Bot Basic (Starter)
- 🔬 Simple AI
- 💻 Chip Face
- 0️⃣ Binary Head
- 🔌 Circuit Soul

## Integration with Existing Systems

### Coins Economy
- Gacha costs: 100 (1 roll) or 900 (10 rolls)
- Coins earned from: Scans, Games, Quests, Badges
- No cosmetic sales (pure sink mechanic)

### Profile System
- Equipped avatar shows on profile picture
- Equipped title could be displayed (future: add title display)
- Frames could wrap profile picture (future: add frame rendering)

### Leaderboard Integration (Future)
- Show equipped cosmetics on leaderboard entries
- Top players flex rare cosmetics
- Rarity-based sorting option

## File Locations

```
C:\Users\Conner\Downloads\files_extracted\
├── index.html (MODIFIED - 3 changes)
├── cosmetics_system.js (NEW - 676 lines)
├── COSMETICS_IMPLEMENTATION_SUMMARY.md (NEW - docs)
└── COSMETICS_QUICK_START.md (THIS FILE)
```

## What's Next?

1. **Test thoroughly** using steps above
2. **Collect feedback** from users
3. **Monitor metrics:**
   - Average rolls per user
   - Most popular cosmetics
   - Coin spending patterns
   - Collection completion rates

4. **Potential Enhancements:**
   - Supabase sync for cross-device
   - Animated particle effects
   - Seasonal exclusive items
   - Trading/gifting system
   - Crafting (duplicate → rarer item)

---

**Status:** ✅ READY FOR TESTING

**Implementation Date:** Dec 20, 2025

**Total Development Time:** ~2 hours

**Lines of Code:** 676 lines JavaScript

**Dependencies:** None (uses existing helpers)

---

Happy collecting! 🎨✨
