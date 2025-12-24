# LEADERBOARD OVERHAUL & QUEST FIX - Implementation Guide

## Overview
This document contains COMPLETE fixes for:
1. **LEADERBOARD**: Modern, sleek redesign with animated top 3, tier groupings, loading skeletons
2. **DAILY QUESTS**: Fixed collection button logic - only shows when actually claimable

---

## Part 1: LEADERBOARD CSS REPLACEMENT

### Find and Replace in index.html
**Location**: Around line 1811
**Find**: `/* LEADERBOARD - EPIC TIERS */` (and everything down to line 2008 ending with `.lb-tier{margin-left:6px}`)

**Replace with the contents of**: `leaderboard-overhaul.css` (already created in your directory)

### Verification
The new CSS file already exists at:
- `C:\Users\Conner\Downloads\files_extracted\leaderboard-overhaul.css`

Simply copy the ENTIRE contents of that file and replace the old leaderboard CSS section in index.html.

---

## Part 2: LEADERBOARD JAVASCRIPT - Enhanced Rendering

### Find the `renderLeaderboard` function (around line 10525)

Replace the ENTIRE function with this:

```javascript
function renderLeaderboard(leaderboard) {
    const container = $('leaderboardContent');
    const fallbackAvatar = 'assets/vera/vera_fairy.svg';
    const currentUserId = user?.id || null;

    if (!container) return;

    // Show loading skeleton
    container.innerHTML = `
        <div class="lb-skeleton"></div>
        <div class="lb-skeleton"></div>
        <div class="lb-skeleton"></div>
    `;

    // Simulate async loading (replace with actual data loading)
    setTimeout(() => {
        if (!leaderboard || leaderboard.length === 0) {
            container.innerHTML = `
                <div style="text-align:center;padding:40px 20px;color:var(--text3)">
                    <div style="font-size:48px;margin-bottom:16px">🏆</div>
                    <div style="font-size:16px;font-weight:600;margin-bottom:8px">No Rankings Yet</div>
                    <div style="font-size:13px">Be the first to climb the leaderboard!</div>
                </div>
            `;
            return;
        }

        let html = '';

        // Top 3 Podium - Sticky Container
        const top3 = leaderboard.slice(0, 3);
        const rest = leaderboard.slice(3);

        if (top3.length > 0) {
            html += `<div class="lb-top3-container"><div class="podium">`;

            top3.forEach((p, i) => {
                const pos = i === 0 ? 'first' : i === 1 ? 'second' : 'third';
                const tier = getTier(i + 1);
                const medal = i === 0 ? '👑' : i === 1 ? '🥈' : '🥉';
                const isCurrentUser = p.user_id === currentUserId;

                html += `
                    <div class="podium-item ${pos} ${isCurrentUser ? 'current-user' : ''}">
                        <div class="podium-avatar">
                            ${i === 0 ? `<span class="podium-crown">${medal}</span>` : `<span class="podium-medal">${medal}</span>`}
                            <img src="${p.avatar_url || fallbackAvatar}" alt="${p.display_name}">
                        </div>
                        <div class="podium-name">${p.display_name || 'Anonymous'}</div>
                        <div class="podium-stats">
                            <div class="podium-points">${(p.total_points || 0).toLocaleString()} pts</div>
                            <div class="podium-level">Lvl ${p.level || 1}</div>
                        </div>
                        <span class="podium-tier ${tier.class}">${tier.name}</span>
                    </div>
                `;
            });

            html += `</div></div>`;
        }

        // Rest of leaderboard - Grouped by Tier
        if (rest.length > 0) {
            const tierGroups = [
                { name: 'LEGEND', class: 'tier-legend', range: [4, 10], bracket: 'LEGEND TIER' },
                { name: 'ELITE', class: 'tier-elite', range: [11, 25], bracket: 'ELITE TIER' },
                { name: 'VETERAN', class: 'tier-veteran', range: [26, 50], bracket: 'VETERAN TIER' },
                { name: 'RISING', class: 'tier-rising', range: [51, 100], bracket: 'RISING TIER' }
            ];

            const grouped = {};
            rest.forEach((p, i) => {
                const rank = i + 4;
                const tier = getTier(rank);
                if (!grouped[tier.name]) {
                    grouped[tier.name] = [];
                }
                grouped[tier.name].push({ ...p, rank: rank, tier: tier });
            });

            html += `<div class="lb-list">`;

            tierGroups.forEach(group => {
                if (grouped[group.name] && grouped[group.name].length > 0) {
                    html += `
                        <div class="tier-group-section tier-group-${group.name.toLowerCase()}">
                            <div class="tier-group-header ${group.class}">
                                <span class="tier-group-bracket">[</span>
                                <span class="tier-group-label">${group.bracket}</span>
                                <span class="tier-group-bracket">]</span>
                            </div>
                            <div class="tier-group-content">
                    `;

                    grouped[group.name].forEach((p) => {
                        const isCurrentUser = p.user_id === currentUserId;
                        const rankClass = p.rank === 1 ? 'rank-1' :
                                          p.rank === 2 ? 'rank-2' :
                                          p.rank === 3 ? 'rank-3' :
                                          p.rank <= 10 ? 'top10' : 'normal';

                        html += `
                            <div class="lb-item ${p.rank <= 10 ? 'top10' : ''} ${isCurrentUser ? 'current-user' : ''}">
                                <div class="lb-rank ${rankClass}">${p.rank}</div>
                                <div class="lb-avatar ${p.tier.class}">
                                    <img src="${p.avatar_url || fallbackAvatar}" alt="${p.display_name}">
                                </div>
                                <div class="lb-info">
                                    <div class="lb-name">${p.display_name || 'Anonymous'}</div>
                                    <div class="lb-stats">
                                        <div class="lb-stat-item">Lvl ${p.level || 1}</div>
                                        <div class="lb-stat-item">${(p.total_scans || 0).toLocaleString()} scans</div>
                                    </div>
                                </div>
                                <div class="lb-points">${(p.total_points || 0).toLocaleString()}</div>
                                <span class="lb-tier ${p.tier.class}">${p.tier.name}</span>
                            </div>
                        `;
                    });

                    html += `
                            </div>
                        </div>
                    `;
                }
            });

            html += `</div>`;
        }

        container.innerHTML = html;

        // Apply icons if IconLibrary exists
        if (window.IconLibrary) {
            window.IconLibrary.apply(container);
        }
    }, 500); // 500ms delay for skeleton to show
}
```

---

## Part 3: DAILY QUESTS FIX - Collection Button Logic

### Problem
The quest "Claim" button was showing even when there was nothing to collect.

### Find the `renderQuestCard` function (around line 12578)

Replace line 12592-12596 (the button logic) with:

```javascript
    let buttonHtml = '';
    if (isClaimed) {
        buttonHtml = '<button class="quest-claim-btn" disabled>✓ Claimed</button>';
    } else if (isClaimable) {
        // FIXED: Only show Claim button when BOTH completed AND not claimed
        buttonHtml = `<button class="quest-claim-btn" onclick="claimQuestReward('${quest.id}', '${questType}')">Claim ${coinReward} Coins</button>`;
    } else if (isCompleted && isClaimed) {
        // Already completed and claimed - don't show any button
        buttonHtml = '';
    } else {
        // In progress - show disabled button with progress
        const progressPercent = Math.floor(percentage);
        buttonHtml = `<button class="quest-claim-btn" disabled>${progressPercent}% Complete</button>`;
    }
```

### Additional Fix: claimQuestReward function

Find the `claimQuestReward` function (around line 12412) and add better validation:

At the very start of the function, add:

```javascript
async function claimQuestReward(questId, questType) {
    console.log('[Quests] Claiming reward for:', questId, questType);

    const userQuests = getStorage('userQuests', null);
    if (!userQuests) {
        console.error('[Quests] No userQuests found');
        toast('Error: Quest data not found', 'error');
        return;
    }

    const questList = userQuests[questType]?.quests;
    if (!questList) {
        console.error('[Quests] Invalid quest type:', questType);
        toast('Error: Invalid quest type', 'error');
        return;
    }

    const quest = questList.find(q => q.id === questId);
    if (!quest) {
        console.error('[Quests] Quest not found:', questId);
        toast('Error: Quest not found', 'error');
        return;
    }

    // CRITICAL CHECK: Only allow claim if completed AND not already claimed
    if (!quest.completed) {
        console.warn('[Quests] Quest not completed yet:', questId);
        toast('Quest not completed yet!', 'warning');
        return;
    }

    if (quest.claimed) {
        console.warn('[Quests] Reward already claimed:', questId);
        toast('Reward already claimed!', 'warning');
        return;
    }

    // ... rest of existing function continues ...
```

---

## Part 4: HTML Changes - Podium Container

### Find the leaderboard view (around line 6371)

Change:
```html
<div class="podium" id="podium"></div>
<div id="leaderboardContent"></div>
```

To:
```html
<div id="leaderboardContent"></div>
```

(The podium is now rendered inside leaderboardContent via JavaScript)

---

## Summary of Changes

### CSS (line ~1811-2008)
- ✅ Replaced entire leaderboard CSS with modern design
- ✅ Added loading skeleton with shimmer animation
- ✅ Added sticky top-3 podium container
- ✅ Enhanced gold medal with rotating conic gradient border
- ✅ Added current user highlighting (.current-user class)
- ✅ Added tier-specific avatar borders
- ✅ Improved tier group headers with colored backgrounds
- ✅ Mobile responsive breakpoints

### JavaScript - renderLeaderboard (line ~10525)
- ✅ Added loading skeleton (shows for 500ms)
- ✅ Added current user detection and highlighting
- ✅ Changed podium to use medals (👑, 🥈, 🥉) instead of icons
- ✅ Enhanced podium stats display (points + level)
- ✅ Added rank-specific classes (rank-1, rank-2, rank-3, top10)
- ✅ Added tier-specific avatar border classes
- ✅ Wrapped top 3 in sticky .lb-top3-container

### JavaScript - Quest Fix (line ~12578, ~12412)
- ✅ Fixed Claim button logic - only shows when claimable
- ✅ Shows progress percentage for in-progress quests
- ✅ Added validation checks in claimQuestReward
- ✅ Prevents claiming if not completed or already claimed
- ✅ Shows toast warnings for invalid claim attempts

---

## Testing Checklist

- [ ] Leaderboard loads with skeleton animation
- [ ] Top 3 players have larger avatars and special effects
- [ ] Gold medal (#1) has rotating conic gradient
- [ ] Current user is highlighted with teal border
- [ ] Tier groupings show with bracketed headers
- [ ] Mobile view scales avatars appropriately
- [ ] Quest "Claim" button only appears when quest is completed
- [ ] Claimed quests show "✓ Claimed"
- [ ] In-progress quests show percentage
- [ ] Claiming a reward works correctly
- [ ] Cannot claim twice (shows toast warning)

---

## Files Modified

1. **index.html** (CSS section ~line 1811-2008)
2. **index.html** (JavaScript renderLeaderboard ~line 10525)
3. **index.html** (JavaScript renderQuestCard ~line 12578)
4. **index.html** (JavaScript claimQuestReward ~line 12412)
5. **index.html** (HTML leaderboard view ~line 6371)

---

## Quick Integration Steps

1. Open `C:\Users\Conner\Downloads\files_extracted\leaderboard-overhaul.css`
2. Copy ENTIRE contents
3. In index.html, find line 1811 `/* LEADERBOARD - EPIC TIERS */`
4. Select down to line 2008 (end of `.lb-tier{margin-left:6px}`)
5. Paste the new CSS
6. Apply JavaScript changes from sections above
7. Test!

---

**Generated**: 2025-12-23
**Status**: READY FOR IMPLEMENTATION
**Priority**: CRITICAL
