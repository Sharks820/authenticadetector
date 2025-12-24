/* ═══════════════════════════════════════════════════════════════════════ */
/* EXPLORER COMMUNITY PROFILE FUNCTIONS                                     */
/* Add these functions to the <script> section in index.html               */
/* ═══════════════════════════════════════════════════════════════════════ */

/**
 * View a user's full profile
 * @param {string} username - The username of the profile to view
 */
function viewProfile(username) {
    console.log('Viewing profile for:', username);

    // TODO: Implement full profile modal showing:
    // - Full stats and achievements
    // - Beast collection
    // - Recent activity
    // - Tank battle history
    // - Trading history

    // For now, show a simple alert
    alert(`Profile view for ${username} coming soon!\n\nThis will show:\n- Complete stats\n- Achievement showcase\n- Beast collection\n- Battle history\n- Trading activity`);
}

/**
 * Send a friend request to a user
 * @param {string} username - The username to add as friend
 */
function addFriend(username) {
    console.log('Adding friend:', username);

    // TODO: Implement friend request system:
    // - Check if already friends
    // - Check if request already sent
    // - Send friend request to database
    // - Update UI with pending state

    // For now, show a simple confirmation
    if (confirm(`Send friend request to ${username}?`)) {
        // Simulate adding friend
        const button = event.target;
        button.textContent = 'Request Sent';
        button.style.background = 'rgba(34, 197, 94, 0.2)';
        button.style.borderColor = '#22c55e';
        button.style.color = '#22c55e';
        button.disabled = true;

        // Show success message
        showToast && showToast(`Friend request sent to ${username}!`, 'success');
    }
}

/**
 * Filter explorer profiles by rank
 * @param {string} rank - The rank to filter by ('all', 'bronze', 'silver', 'gold', 'platinum')
 */
function filterExplorerProfiles(rank = 'all') {
    const profiles = document.querySelectorAll('.explorer-profile');

    profiles.forEach(profile => {
        if (rank === 'all') {
            profile.style.display = 'block';
        } else {
            const profileRank = profile.getAttribute('data-rank');
            profile.style.display = profileRank === rank ? 'block' : 'none';
        }
    });
}

/**
 * Sort explorer profiles by different criteria
 * @param {string} sortBy - The sorting criteria ('level', 'wins', 'accuracy', 'beasts')
 */
function sortExplorerProfiles(sortBy = 'level') {
    const grid = document.getElementById('explorerProfileGrid');
    if (!grid) return;

    const profiles = Array.from(grid.querySelectorAll('.explorer-profile'));

    profiles.sort((a, b) => {
        let valueA, valueB;

        switch (sortBy) {
            case 'level':
                valueA = parseInt(a.querySelector('.explorer-level').textContent.replace('Lv ', ''));
                valueB = parseInt(b.querySelector('.explorer-level').textContent.replace('Lv ', ''));
                break;
            case 'wins':
                valueA = parseInt(a.querySelectorAll('.stat-value')[0].textContent);
                valueB = parseInt(b.querySelectorAll('.stat-value')[0].textContent);
                break;
            case 'beasts':
                valueA = parseInt(a.querySelectorAll('.stat-value')[1].textContent);
                valueB = parseInt(b.querySelectorAll('.stat-value')[1].textContent);
                break;
            case 'accuracy':
                valueA = parseInt(a.querySelectorAll('.stat-value')[2].textContent.replace('%', ''));
                valueB = parseInt(b.querySelectorAll('.stat-value')[2].textContent.replace('%', ''));
                break;
            default:
                return 0;
        }

        return valueB - valueA; // Sort descending
    });

    // Re-append sorted profiles
    profiles.forEach(profile => grid.appendChild(profile));
}

/**
 * Toggle between online and all explorer profiles
 * @param {boolean} onlineOnly - Show only online users if true
 */
function toggleOnlineExplorers(onlineOnly = false) {
    const profiles = document.querySelectorAll('.explorer-profile');

    profiles.forEach(profile => {
        const statusDot = profile.querySelector('.status-dot');
        const isOnline = statusDot && statusDot.classList.contains('online');

        if (onlineOnly) {
            profile.style.display = isOnline ? 'block' : 'none';
        } else {
            profile.style.display = 'block';
        }
    });
}

/**
 * Get explorer profile stats count
 * @returns {object} Object containing profile statistics
 */
function getExplorerStats() {
    const profiles = document.querySelectorAll('.explorer-profile');
    const stats = {
        total: profiles.length,
        online: 0,
        offline: 0,
        byRank: {
            bronze: 0,
            silver: 0,
            gold: 0,
            platinum: 0
        }
    };

    profiles.forEach(profile => {
        const statusDot = profile.querySelector('.status-dot');
        const isOnline = statusDot && statusDot.classList.contains('online');

        if (isOnline) {
            stats.online++;
        } else {
            stats.offline++;
        }

        const rank = profile.getAttribute('data-rank');
        if (rank && stats.byRank.hasOwnProperty(rank)) {
            stats.byRank[rank]++;
        }
    });

    return stats;
}

/**
 * Initialize explorer community features
 * Call this on page load
 */
function initializeExplorerCommunity() {
    console.log('Explorer Community initialized');

    // Get and log stats
    const stats = getExplorerStats();
    console.log('Explorer Stats:', stats);

    // Add event listeners for any filter/sort controls if they exist
    const filterButtons = document.querySelectorAll('[data-explorer-filter]');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const rank = this.getAttribute('data-explorer-filter');
            filterExplorerProfiles(rank);
        });
    });

    const sortButtons = document.querySelectorAll('[data-explorer-sort]');
    sortButtons.forEach(button => {
        button.addEventListener('click', function() {
            const sortBy = this.getAttribute('data-explorer-sort');
            sortExplorerProfiles(sortBy);
        });
    });
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeExplorerCommunity);
} else {
    initializeExplorerCommunity();
}
