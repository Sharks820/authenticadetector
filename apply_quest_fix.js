// Quest and Rewards Fix Script
// This script fixes the quest system to use the correct storage system
// Run this in the browser console or include before index.html loads

console.log('[FIX] Applying quest and rewards system fixes...');

// Store the original functions
const originalPopulateQuestsPopup = window.populateQuestsPopup || function(){};
const originalUpdateQuestsBadge = window.updateQuestsBadge || function(){};

// Helper function (in case it's not defined)
if (typeof getStorage !== 'function') {
    window.getStorage = function(key, defaultValue) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error('[Storage] Error reading:', key, e);
            return defaultValue;
        }
    };
}

// FIXED: Populate quests popup with daily quests (uses NEW userQuests system)
window.populateQuestsPopup = function() {
    const body = document.getElementById('questsPopupBody');
    if (!body) return;

    // FIXED: Use the NEW userQuests system, not the old questProgress
    const userQuests = getStorage('userQuests', null);
    if (!userQuests || !userQuests.daily || !userQuests.daily.quests) {
        body.innerHTML = '<p style="text-align:center;color:var(--text2)">No quests available</p>';
        const badge = document.getElementById('questsBadge');
        if (badge) {
            badge.textContent = '0';
            badge.style.display = 'none';
        }
        return;
    }

    const dailyQuests = window.QUEST_DEFINITIONS?.daily || [];

    let html = '';
    let claimableCount = 0;

    // Show first 5 daily quests from the userQuests system
    userQuests.daily.quests.slice(0, 5).forEach(quest => {
        const def = dailyQuests.find(q => q.id === quest.id);
        if (!def) return;

        const progress = Math.min(quest.progress, def.target);
        const isComplete = quest.completed;
        const isClaimed = quest.claimed;
        const isClaimable = isComplete && !isClaimed;

        if (isClaimable) claimableCount++;

        html += `
            <div class="popup-quest-item ${isClaimable ? 'claimable' : ''}">
                <div class="popup-quest-icon">${def.icon}</div>
                <div class="popup-quest-info">
                    <div class="popup-quest-title">${def.title}</div>
                    <div class="popup-quest-progress">${progress}/${def.target} ${isComplete ? (isClaimed ? '(Claimed!)' : '(Complete!)') : ''}</div>
                </div>
                <div class="popup-quest-reward">
                    <span>🪙</span>
                    <span>${def.reward.coins}</span>
                </div>
            </div>
        `;
    });

    body.innerHTML = html || '<p style="text-align:center;color:var(--text2)">No quests available</p>';

    // Update badge count
    const badge = document.getElementById('questsBadge');
    if (badge) {
        badge.textContent = claimableCount;
        badge.style.display = claimableCount > 0 ? 'flex' : 'none';
    }

    console.log('[FIX] Quest popup populated:', claimableCount, 'claimable quests');
};

// FIXED: Update quests badge on home screen (uses NEW userQuests system)
window.updateQuestsBadge = function() {
    // FIXED: Use the NEW userQuests system, not the old questProgress
    const userQuests = getStorage('userQuests', null);
    if (!userQuests || !userQuests.daily || !userQuests.daily.quests) {
        const badge = document.getElementById('questsBadge');
        if (badge) {
            badge.textContent = '0';
            badge.style.display = 'none';
        }
        return;
    }

    const dailyQuests = window.QUEST_DEFINITIONS?.daily || [];

    let claimableCount = 0;
    userQuests.daily.quests.forEach(quest => {
        const def = dailyQuests.find(q => q.id === quest.id);
        if (def && quest.completed && !quest.claimed) {
            claimableCount++;
        }
    });

    const badge = document.getElementById('questsBadge');
    if (badge) {
        badge.textContent = claimableCount;
        badge.style.display = claimableCount > 0 ? 'flex' : 'none';
    }

    console.log('[FIX] Quest badge updated:', claimableCount, 'claimable quests');
};

// FIXED: Enhance claimDailyBonus to ensure coin display updates
const originalClaimDailyBonus = window.claimDailyBonus;
if (originalClaimDailyBonus) {
    window.claimDailyBonus = function() {
        // Call original function
        originalClaimDailyBonus();

        // Force update all coin displays after a short delay
        setTimeout(() => {
            // Try all possible update functions
            if (typeof updateAllCoinDisplays === 'function') {
                updateAllCoinDisplays();
            }
            if (typeof updateCoinsDisplay === 'function') {
                updateCoinsDisplay();
            }
            if (typeof updateCurrencyDisplay === 'function') {
                updateCurrencyDisplay();
            }

            // Directly update any coin display elements
            const coinDisplays = document.querySelectorAll('[id*="coin" i], [id*="currency" i]');
            const currentCoins = parseInt(localStorage.getItem('truthCoins') || '0');
            coinDisplays.forEach(el => {
                if (el.textContent && !isNaN(parseInt(el.textContent))) {
                    el.textContent = currentCoins;
                }
            });

            console.log('[FIX] Force-updated all coin displays to:', currentCoins);
        }, 100);
    };
}

// Clean up old questProgress storage to prevent confusion
if (localStorage.getItem('questProgress')) {
    console.warn('[FIX] Found old questProgress storage, removing to prevent conflicts...');
    localStorage.removeItem('questProgress');
}

console.log('[FIX] Quest and rewards system fixes applied successfully!');
console.log('[FIX] - Fixed populateQuestsPopup to use userQuests');
console.log('[FIX] - Fixed updateQuestsBadge to use userQuests');
console.log('[FIX] - Enhanced claimDailyBonus coin display updates');
console.log('[FIX] - Removed old questProgress storage');
