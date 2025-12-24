# Explorer Community Profiles - Integration Guide

## Overview
This package adds a complete Explorer Community section to the Friends view with 10 placeholder character profiles featuring rank-based styling, online/offline status indicators, stats, achievement badges, and action buttons.

## Files Created
1. `explorer-profiles-addition.html` - HTML markup for the profiles
2. `explorer-profiles-styles.css` - Complete CSS styling
3. `explorer-profiles-functions.js` - JavaScript functions
4. `EXPLORER_PROFILES_INTEGRATION_GUIDE.md` - This guide

## Features Implemented

### 10 Character Profiles
- **2 Platinum players** (Lv 47, Lv 51) - Top tier with cyan glow
- **3 Gold players** (Lv 36-42) - High tier with gold shimmer
- **3 Silver players** (Lv 27-31) - Mid tier
- **2 Bronze players** (Lv 12-15) - Entry tier

### Online/Offline Status
- **5 online** - Pulsing green dot with glow animation
- **5 offline** - Gray dot

### Profile Information
Each profile card includes:
- Avatar with gradient background (emoji placeholder)
- Username
- Rank badge (Bronze/Silver/Gold/Platinum with tier)
- Level
- Stats: Wins, Beasts Captured, Accuracy %
- Achievement badges (1-3 mini badges)
- "View Profile" and "Add Friend" buttons

## Integration Steps

### Step 1: Add CSS Styles
Add the contents of `explorer-profiles-styles.css` to the `<style>` section in `index.html`:

```html
<style>
    /* ... existing styles ... */

    /* ═══════════════════════════════════════════════════════════════════════ */
    /* EXPLORER COMMUNITY PROFILE STYLES                                        */
    /* ═══════════════════════════════════════════════════════════════════════ */

    [Paste contents of explorer-profiles-styles.css here]
</style>
```

### Step 2: Add HTML Markup
Insert the contents of `explorer-profiles-addition.html` into the Friends view:

**Location:** Around line 7168 in `index.html`, **BEFORE** the `<!-- All Friends -->` section

```html
        <!-- Online Friends -->
        <div class="friends-section">
            <!-- ... existing Online Friends code ... -->
        </div>

        <!-- ═══════════════════════════════════════════════════════════════════════ -->
        <!-- INSERT EXPLORER PROFILES HERE                                            -->
        <!-- ═══════════════════════════════════════════════════════════════════════ -->

        [Paste contents of explorer-profiles-addition.html here]

        <!-- All Friends -->
        <div class="friends-section">
            <!-- ... existing All Friends code ... -->
        </div>
```

### Step 3: Add JavaScript Functions
Add the contents of `explorer-profiles-functions.js` to the `<script>` section in `index.html`:

**Location:** Near the end of the main script block, before the closing `</script>` tag

```html
<script>
    // ... existing JavaScript ...

    /* ═══════════════════════════════════════════════════════════════════════ */
    /* EXPLORER COMMUNITY PROFILE FUNCTIONS                                     */
    /* ═══════════════════════════════════════════════════════════════════════ */

    [Paste contents of explorer-profiles-functions.js here]

</script>
```

## Styling Details

### Rank-Based Borders
- **Bronze**: Copper gradient (#cd7f32)
- **Silver**: Silver gradient (#c0c0c0)
- **Gold**: Gold gradient (#ffd700) with glow
- **Platinum**: Platinum/cyan gradient (#e5e4e2, #b9f2ff) with glow

### Online Status Animation
The online dot pulses with a glowing animation:
```css
@keyframes pulse-online {
    0%, 100% { box-shadow: 0 0 12px rgba(34, 197, 94, 0.8); }
    50% { box-shadow: 0 0 20px rgba(34, 197, 94, 1); }
}
```

### Hover Effects
- Card lifts up 4px
- Border becomes more visible
- Avatar scales up 5%
- Buttons have lift effect

### Responsive Design
- **Desktop** (>768px): 3+ columns
- **Tablet** (481-768px): 2 columns
- **Mobile** (<480px): 1 column

## Character Profile Data

### Profile 1: TruthSeeker_99 (Platinum V, Lv 47)
- Status: Online
- Wins: 892
- Beasts: 143
- Accuracy: 94%
- Badges: Deep Scan Expert, Tank Commander, Beast Master

### Profile 2: PixelHunter (Gold III, Lv 38)
- Status: Online
- Wins: 567
- Beasts: 98
- Accuracy: 89%
- Badges: Outbreak Champion, Squad Leader

### Profile 3: DeepScanPro (Silver II, Lv 29)
- Status: Offline
- Wins: 324
- Beasts: 67
- Accuracy: 85%
- Badges: Forensics Expert, Beast Hunter

### Profile 4: AI_Detective (Gold I, Lv 42)
- Status: Online
- Wins: 645
- Beasts: 121
- Accuracy: 91%
- Badges: Truth Hunter, Trading Master, Squad MVP

### Profile 5: NewbSlayer (Bronze IV, Lv 15)
- Status: Offline
- Wins: 89
- Beasts: 23
- Accuracy: 72%
- Badges: First Scan, Rising Star

### Profile 6: BotBuster_X (Silver I, Lv 31)
- Status: Online
- Wins: 412
- Beasts: 78
- Accuracy: 87%
- Badges: Tank Ace, Quick Scan Master

### Profile 7: CyberGuardian (Platinum II, Lv 51)
- Status: Offline
- Wins: 1034
- Beasts: 187
- Accuracy: 96%
- Badges: Legendary Hunter, Perfect Scan, Squad Veteran

### Profile 8: NeuralNinja (Gold II, Lv 36)
- Status: Online
- Wins: 521
- Beasts: 94
- Accuracy: 88%
- Badges: AI Analyst, Arena Master

### Profile 9: TruthRookie (Bronze II, Lv 12)
- Status: Online
- Wins: 54
- Beasts: 15
- Accuracy: 68%
- Badges: Newcomer

### Profile 10: ArtifactSeeker (Silver III, Lv 27)
- Status: Offline
- Wins: 298
- Beasts: 61
- Accuracy: 83%
- Badges: Beast Collector, Explorer

## JavaScript Functions

### Core Functions
- `viewProfile(username)` - Opens full profile view (placeholder)
- `addFriend(username)` - Sends friend request (placeholder with button state change)

### Utility Functions
- `filterExplorerProfiles(rank)` - Filter by rank ('all', 'bronze', 'silver', 'gold', 'platinum')
- `sortExplorerProfiles(sortBy)` - Sort by 'level', 'wins', 'accuracy', or 'beasts'
- `toggleOnlineExplorers(onlineOnly)` - Show only online users
- `getExplorerStats()` - Returns profile statistics

### Auto-initialization
The `initializeExplorerCommunity()` function automatically runs on page load.

## Future Enhancements

### Database Integration
1. Connect to `profiles` table in Supabase
2. Fetch real user data
3. Update stats in real-time
4. Implement actual friend request system

### Profile Modal
Create detailed profile view showing:
- Complete stats and progression
- Achievement showcase
- Beast collection gallery
- Battle history timeline
- Trading activity log

### Filtering UI
Add filter buttons above the grid:
```html
<div class="explorer-filters">
    <button data-explorer-filter="all">All</button>
    <button data-explorer-filter="platinum">Platinum</button>
    <button data-explorer-filter="gold">Gold</button>
    <button data-explorer-filter="silver">Silver</button>
    <button data-explorer-filter="bronze">Bronze</button>
</div>
```

### Sorting UI
Add sort dropdown:
```html
<div class="explorer-sort">
    <select onchange="sortExplorerProfiles(this.value)">
        <option value="level">Level</option>
        <option value="wins">Wins</option>
        <option value="accuracy">Accuracy</option>
        <option value="beasts">Beasts</option>
    </select>
</div>
```

### Live Status Updates
Use Supabase Realtime to update online/offline status:
```javascript
supabase
    .channel('presence')
    .on('presence', { event: 'sync' }, () => {
        // Update online status indicators
    })
    .subscribe();
```

## Testing Checklist

- [ ] CSS styles applied correctly
- [ ] HTML inserted in correct location
- [ ] JavaScript functions available globally
- [ ] All 10 profiles render correctly
- [ ] Online/offline status dots display
- [ ] Rank borders show correct colors
- [ ] Hover effects work smoothly
- [ ] Buttons are clickable
- [ ] Mobile responsive design works
- [ ] Console logs show initialization
- [ ] No JavaScript errors

## Color Palette Reference

### Rank Colors
- **Bronze**: #cd7f32, #e8a87c
- **Silver**: #c0c0c0, #e8e8e8
- **Gold**: #ffd700, #ffed4e
- **Platinum**: #e5e4e2, #b9f2ff

### Status Colors
- **Online**: #22c55e (green with glow)
- **Offline**: #6b7280 (gray)

### Button Colors
- **Primary**: #14b8a6 → #0d9488 (teal gradient)
- **Secondary**: rgba(255, 255, 255, 0.05) with border

## Notes

- All profiles use emoji placeholders for avatars
- Achievement badges are placeholder emojis with tooltips
- Button functions are stubs that need backend integration
- Stats are static and need to pull from database
- Online status is hardcoded (5 online, 5 offline)
- Grid automatically adjusts columns based on screen width
- Compatible with existing CSS variables (--text1, --text2, --text3)

## Credits

Created for AuthenticaDetector - Session 11 (Dec 23, 2025)
Explorer Community Social Feature Implementation
