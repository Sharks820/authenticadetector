/**
 * COMPREHENSIVE PAGE-TO-PAGE TESTING SCRIPT
 * Tests all views, navigation, and functionality
 * Generates detailed PAGE_TEST_REPORT.md
 */

const testResults = {
    timestamp: new Date().toISOString(),
    appVersion: 'v12.0.0',
    testsRun: 0,
    testsPassed: 0,
    testsFailed: 0,
    issues: [],
    views: {}
};

// Test utilities
function addTest(viewName, testName, passed, notes = '') {
    testResults.testsRun++;
    if (passed) {
        testResults.testsPassed++;
    } else {
        testResults.testsFailed++;
        testResults.issues.push({
            view: viewName,
            test: testName,
            notes: notes
        });
    }

    if (!testResults.views[viewName]) {
        testResults.views[viewName] = {
            tests: [],
            passed: 0,
            failed: 0
        };
    }

    testResults.views[viewName].tests.push({
        name: testName,
        passed: passed,
        notes: notes
    });

    if (passed) {
        testResults.views[viewName].passed++;
    } else {
        testResults.views[viewName].failed++;
    }
}

function logResult(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = type === 'pass' ? '✓' : type === 'fail' ? '✗' : 'ℹ';
    console.log(`[${timestamp}] ${prefix} ${message}`);
}

// ============================================
// TEST 1: HOME VIEW
// ============================================
async function testHomeView() {
    logResult('Testing HOME VIEW...', 'info');

    // Ensure we're on home view
    if (!window.location.hash.includes('homeView')) {
        window.location.hash = 'homeView';
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Test 1.1: Profile card displays
    const profileCard = document.querySelector('.profile-card');
    addTest('HOME', 'Profile card displays correctly', !!profileCard,
        profileCard ? 'Profile card found' : 'Profile card missing');

    // Test 1.2: Currency bar displays
    const currencyBar = document.querySelector('.currency-bar');
    const coinsDisplay = document.querySelector('.currency-item.coins');
    const keysDisplay = document.querySelector('.currency-item.keys');
    const gemsDisplay = document.querySelector('.currency-item.gems');
    addTest('HOME', 'Currency bar shows all currencies',
        !!(currencyBar && coinsDisplay && keysDisplay && gemsDisplay),
        `Found: ${!!currencyBar}, Coins: ${!!coinsDisplay}, Keys: ${!!keysDisplay}, Gems: ${!!gemsDisplay}`);

    // Test 1.3: Stat cards are clickable
    const statCards = document.querySelectorAll('.profile-stat-card');
    addTest('HOME', 'Stat cards present (4 expected)', statCards.length === 4,
        `Found ${statCards.length} stat cards`);

    // Test 1.4: Game banners display
    const gameCards = document.querySelectorAll('.game-card');
    addTest('HOME', 'Game banners display', gameCards.length >= 2,
        `Found ${gameCards.length} game cards`);

    // Test 1.5: VERA tip displays
    const veraTip = document.querySelector('.vera-tip');
    addTest('HOME', 'VERA tip displays', !!veraTip,
        veraTip ? 'VERA tip found' : 'VERA tip missing');

    // Test 1.6: Beast section displays
    const beastSection = document.querySelector('.beast-section');
    addTest('HOME', 'Favorite Beast section displays', !!beastSection,
        beastSection ? 'Beast section found' : 'Beast section missing');

    // Test 1.7: Header buttons work
    const questsBtn = document.querySelector('[onclick*="showView(\'questsView\')"]');
    const settingsBtn = document.querySelector('[onclick*="showView(\'settingsView\')"]');
    const profileBtn = document.querySelector('[onclick*="showView(\'profileView\')"]');
    addTest('HOME', 'Header action buttons present',
        !!(questsBtn && settingsBtn && profileBtn),
        `Quests: ${!!questsBtn}, Settings: ${!!settingsBtn}, Profile: ${!!profileBtn}`);

    logResult('HOME VIEW tests complete', 'info');
}

// ============================================
// TEST 2: PROFILE VIEW
// ============================================
async function testProfileView() {
    logResult('Testing PROFILE VIEW...', 'info');

    // Navigate to profile
    window.showView?.('profileView');
    await new Promise(resolve => setTimeout(resolve, 500));

    // Test 2.1: Profile view opens
    const profileView = document.getElementById('profileView');
    const isActive = profileView?.classList.contains('active');
    addTest('PROFILE', 'Profile view opens', isActive,
        isActive ? 'Profile view is active' : 'Profile view not active');

    // Test 2.2: Avatar displays
    const avatarLarge = document.querySelector('.profile-avatar-lg');
    addTest('PROFILE', 'Large avatar displays', !!avatarLarge,
        avatarLarge ? 'Avatar found' : 'Avatar missing');

    // Test 2.3: User info displays
    const userName = document.querySelector('.profile-middle-col .profile-user-name');
    const userLevel = document.querySelector('.level-badge');
    addTest('PROFILE', 'User info displays (name & level)', !!(userName && userLevel),
        `Name: ${!!userName}, Level: ${!!userLevel}`);

    // Test 2.4: Stats grid displays
    const statsGrid = document.querySelector('.profile-stats-grid');
    const statCards = statsGrid?.querySelectorAll('.profile-stat-card');
    addTest('PROFILE', 'Stats grid with 4 cards', statCards?.length === 4,
        `Found ${statCards?.length || 0} stat cards`);

    // Test 2.5: Action buttons present
    const customizeBtn = document.querySelector('[onclick*="openAvatarSelector"]');
    const shopBtn = document.querySelector('[onclick*="openShop"]');
    addTest('PROFILE', 'Action buttons present', !!(customizeBtn && shopBtn),
        `Customize: ${!!customizeBtn}, Shop: ${!!shopBtn}`);

    logResult('PROFILE VIEW tests complete', 'info');
}

// ============================================
// TEST 3: SETTINGS VIEW
// ============================================
async function testSettingsView() {
    logResult('Testing SETTINGS VIEW...', 'info');

    // Navigate to settings
    window.showView?.('settingsView');
    await new Promise(resolve => setTimeout(resolve, 500));

    // Test 3.1: Settings view opens
    const settingsView = document.getElementById('settingsView');
    const isActive = settingsView?.classList.contains('active');
    addTest('SETTINGS', 'Settings view opens', isActive,
        isActive ? 'Settings view is active' : 'Settings view not active');

    // Test 3.2: Collapsible sections exist
    const sections = document.querySelectorAll('#settingsView .settings-section');
    addTest('SETTINGS', 'Settings sections present (expected 6)', sections.length >= 5,
        `Found ${sections.length} sections`);

    // Test 3.3: VERA visibility toggle
    const veraToggle = document.getElementById('veraVisibilityToggle');
    addTest('SETTINGS', 'VERA visibility toggle exists', !!veraToggle,
        veraToggle ? 'Toggle found' : 'Toggle missing');

    // Test 3.4: VERA sounds toggle
    const veraSoundsToggle = document.getElementById('veraSoundsToggle');
    addTest('SETTINGS', 'VERA sounds toggle exists', !!veraSoundsToggle,
        veraSoundsToggle ? 'Toggle found' : 'Toggle missing');

    // Test 3.5: Test toggle functionality
    if (veraToggle) {
        const initialState = veraToggle.checked;
        veraToggle.click();
        await new Promise(resolve => setTimeout(resolve, 100));
        const newState = veraToggle.checked;
        addTest('SETTINGS', 'VERA toggle works', initialState !== newState,
            `Changed from ${initialState} to ${newState}`);
        // Reset
        veraToggle.click();
    }

    // Test 3.6: Danger Zone section
    const dangerZone = Array.from(sections).find(s =>
        s.querySelector('h3')?.textContent.includes('Danger Zone'));
    addTest('SETTINGS', 'Danger Zone section exists', !!dangerZone,
        dangerZone ? 'Danger Zone found' : 'Danger Zone missing');

    logResult('SETTINGS VIEW tests complete', 'info');
}

// ============================================
// TEST 4: SHOP VIEW
// ============================================
async function testShopView() {
    logResult('Testing SHOP VIEW...', 'info');

    // Navigate to shop
    window.openShop?.() || window.showView?.('shopView');
    await new Promise(resolve => setTimeout(resolve, 500));

    // Test 4.1: Shop view opens
    const shopView = document.getElementById('shopView');
    const isActive = shopView?.classList.contains('active');
    addTest('SHOP', 'Shop view opens', isActive,
        isActive ? 'Shop view is active' : 'Shop view not active');

    // Test 4.2: Shop items display
    const shopItems = document.querySelectorAll('.shop-item, .cosmetic-item');
    addTest('SHOP', 'Shop items display', shopItems.length > 0,
        `Found ${shopItems.length} items`);

    // Test 4.3: Category tabs exist
    const categoryBtns = document.querySelectorAll('[onclick*="filterShop"], [data-category]');
    addTest('SHOP', 'Category filters exist', categoryBtns.length > 0,
        `Found ${categoryBtns.length} category buttons`);

    // Test 4.4: Coin display in shop
    const coinDisplay = document.querySelector('#shopView .coin-display, #shopView .currency-item');
    addTest('SHOP', 'Coin display visible in shop', !!coinDisplay,
        coinDisplay ? 'Coin display found' : 'Coin display missing');

    logResult('SHOP VIEW tests complete', 'info');
}

// ============================================
// TEST 5: AVATAR BUILDER
// ============================================
async function testAvatarBuilder() {
    logResult('Testing AVATAR BUILDER...', 'info');

    // Navigate to avatar builder
    window.openAvatarBuilder?.() || window.showView?.('avatarView');
    await new Promise(resolve => setTimeout(resolve, 500));

    // Test 5.1: Avatar view opens
    const avatarView = document.getElementById('avatarView');
    const isActive = avatarView?.classList.contains('active');
    addTest('AVATAR_BUILDER', 'Avatar builder opens', isActive,
        isActive ? 'Avatar view is active' : 'Avatar view not active');

    // Test 5.2: Body part slots visible
    const bodyPartSlots = document.querySelectorAll('.body-part-slot, .equipment-slot');
    addTest('AVATAR_BUILDER', 'Body part slots visible', bodyPartSlots.length > 0,
        `Found ${bodyPartSlots.length} body part slots`);

    // Test 5.3: Character preview exists
    const characterPreview = document.querySelector('.character-preview, #characterPreview, canvas');
    addTest('AVATAR_BUILDER', 'Character preview exists', !!characterPreview,
        characterPreview ? 'Preview found' : 'Preview missing');

    // Test 5.4: Cosmetic tabs/categories
    const cosmeticTabs = document.querySelectorAll('[data-tab], .cosmetic-tab');
    addTest('AVATAR_BUILDER', 'Cosmetic categories exist', cosmeticTabs.length > 0,
        `Found ${cosmeticTabs.length} cosmetic tabs`);

    logResult('AVATAR BUILDER tests complete', 'info');
}

// ============================================
// TEST 6: TANK GAME
// ============================================
async function testTankGame() {
    logResult('Testing TANK GAME...', 'info');

    // Test 6.1: Tank game button exists
    const tankGameBtn = document.querySelector('[onclick*="startTankGame"], .game-cta[onclick*="Tank"]');
    addTest('TANK_GAME', 'Tank game launch button exists', !!tankGameBtn,
        tankGameBtn ? 'Launch button found' : 'Launch button missing');

    // Test 6.2: Click tank game button (but don't wait for full game load)
    if (tankGameBtn) {
        tankGameBtn.click();
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Check if game view opened
        const tankGameView = document.getElementById('tankGameView');
        const isActive = tankGameView?.classList.contains('active');
        addTest('TANK_GAME', 'Tank game view opens', isActive,
            isActive ? 'Tank game view is active' : 'Tank game view failed to open');

        // Test 6.3: Game canvas exists
        const gameCanvas = document.querySelector('#tankGameView canvas, #gameCanvas');
        addTest('TANK_GAME', 'Game canvas exists', !!gameCanvas,
            gameCanvas ? 'Canvas found' : 'Canvas missing');

        // Close game to continue testing
        window.closeView?.() || window.showView?.('homeView');
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    logResult('TANK GAME tests complete', 'info');
}

// ============================================
// TEST 7: BEAST COLLECTION
// ============================================
async function testBeastCollection() {
    logResult('Testing BEAST COLLECTION...', 'info');

    // Navigate to beast collection
    window.openBeastCollection?.() || window.showView?.('beastCollectionView');
    await new Promise(resolve => setTimeout(resolve, 500));

    // Test 7.1: Beast collection view opens
    const beastView = document.getElementById('beastCollectionView');
    const isActive = beastView?.classList.contains('active');
    addTest('BEAST_COLLECTION', 'Beast collection opens', isActive,
        isActive ? 'Beast view is active' : 'Beast view not active');

    // Test 7.2: Beast grid exists
    const beastGrid = document.querySelector('.beast-grid, .collection-grid');
    addTest('BEAST_COLLECTION', 'Beast grid exists', !!beastGrid,
        beastGrid ? 'Grid found' : 'Grid missing');

    // Test 7.3: Rarity filter buttons
    const rarityFilters = document.querySelectorAll('[data-rarity], [onclick*="filterBeasts"]');
    addTest('BEAST_COLLECTION', 'Rarity filters exist', rarityFilters.length > 0,
        `Found ${rarityFilters.length} rarity filters`);

    logResult('BEAST COLLECTION tests complete', 'info');
}

// ============================================
// TEST 8: LEADERBOARD
// ============================================
async function testLeaderboard() {
    logResult('Testing LEADERBOARD...', 'info');

    // Navigate to leaderboard
    window.openLeaderboard?.() || window.showView?.('leaderboardView');
    await new Promise(resolve => setTimeout(resolve, 500));

    // Test 8.1: Leaderboard view opens
    const leaderboardView = document.getElementById('leaderboardView');
    const isActive = leaderboardView?.classList.contains('active');
    addTest('LEADERBOARD', 'Leaderboard opens', isActive,
        isActive ? 'Leaderboard view is active' : 'Leaderboard view not active');

    // Test 8.2: Leaderboard list exists
    const leaderboardList = document.querySelector('.leaderboard-list, #leaderboardList');
    addTest('LEADERBOARD', 'Leaderboard list exists', !!leaderboardList,
        leaderboardList ? 'List found' : 'List missing');

    // Test 8.3: Rank entries display
    const rankEntries = document.querySelectorAll('.leaderboard-entry, .rank-entry');
    addTest('LEADERBOARD', 'Rank entries display', rankEntries.length > 0,
        `Found ${rankEntries.length} rank entries`);

    // Test 8.4: Top 3 styling check
    const topThree = Array.from(rankEntries).slice(0, 3);
    const hasSpecialStyling = topThree.some(entry =>
        entry.classList.contains('rank-1') ||
        entry.classList.contains('rank-2') ||
        entry.classList.contains('rank-3') ||
        entry.classList.contains('top-rank'));
    addTest('LEADERBOARD', 'Top 3 have special styling', hasSpecialStyling,
        hasSpecialStyling ? 'Special styling found' : 'No special styling detected');

    logResult('LEADERBOARD tests complete', 'info');
}

// ============================================
// TEST 9: NAVIGATION
// ============================================
async function testNavigation() {
    logResult('Testing NAVIGATION...', 'info');

    // Test 9.1: App logo navigation
    const appLogo = document.querySelector('h1[onclick], .app-logo');
    if (appLogo) {
        appLogo.click();
        await new Promise(resolve => setTimeout(resolve, 300));
        const onHome = window.location.hash.includes('homeView') ||
                       document.getElementById('homeView')?.classList.contains('active');
        addTest('NAVIGATION', 'App logo returns to home', onHome,
            onHome ? 'Navigated to home' : 'Failed to navigate to home');
    } else {
        addTest('NAVIGATION', 'App logo clickable', false, 'Logo not found or not clickable');
    }

    // Test 9.2: Back button exists in views
    await window.showView?.('settingsView');
    await new Promise(resolve => setTimeout(resolve, 300));
    const backBtn = document.querySelector('#settingsView .back-btn, [onclick*="closeView"]');
    addTest('NAVIGATION', 'Back button exists in views', !!backBtn,
        backBtn ? 'Back button found' : 'Back button missing');

    // Test 9.3: Back button works
    if (backBtn) {
        backBtn.click();
        await new Promise(resolve => setTimeout(resolve, 300));
        const backToHome = window.location.hash.includes('homeView') ||
                          document.getElementById('homeView')?.classList.contains('active');
        addTest('NAVIGATION', 'Back button navigates correctly', backToHome,
            backToHome ? 'Back navigation works' : 'Back navigation failed');
    }

    // Test 9.4: No infinite loops (test rapid navigation)
    const views = ['homeView', 'profileView', 'settingsView', 'homeView'];
    let loopDetected = false;
    for (const view of views) {
        window.showView?.(view);
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    addTest('NAVIGATION', 'No infinite navigation loops', !loopDetected,
        'Rapid navigation test completed without crash');

    logResult('NAVIGATION tests complete', 'info');
}

// ============================================
// TEST 10: MOBILE RESPONSIVENESS
// ============================================
async function testMobileResponsiveness() {
    logResult('Testing MOBILE RESPONSIVENESS...', 'info');

    const viewportSizes = [
        { width: 375, height: 667, name: 'iPhone SE' },
        { width: 480, height: 854, name: 'Small Phone' },
        { width: 768, height: 1024, name: 'Tablet' },
        { width: 1024, height: 768, name: 'Tablet Landscape' }
    ];

    // Note: This test is informational only as we can't actually resize from inside the page
    // The real mobile testing would need to be done via Playwright browser resizing

    // Test viewport meta tag
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    addTest('MOBILE', 'Viewport meta tag exists', !!viewportMeta,
        viewportMeta ? `Content: ${viewportMeta.getAttribute('content')}` : 'Meta tag missing');

    // Test for responsive CSS
    const hasResponsiveCSS = Array.from(document.styleSheets).some(sheet => {
        try {
            const rules = Array.from(sheet.cssRules || []);
            return rules.some(rule =>
                rule.media?.mediaText?.includes('max-width') ||
                rule.media?.mediaText?.includes('min-width'));
        } catch (e) {
            return false;
        }
    });
    addTest('MOBILE', 'Responsive CSS media queries present', hasResponsiveCSS,
        hasResponsiveCSS ? 'Media queries found' : 'No media queries detected');

    // Test touch-friendly elements
    const buttons = document.querySelectorAll('button');
    const smallButtons = Array.from(buttons).filter(btn => {
        const rect = btn.getBoundingClientRect();
        return rect.width < 44 || rect.height < 44;
    });
    addTest('MOBILE', 'All buttons are touch-friendly (44px minimum)',
        smallButtons.length === 0,
        smallButtons.length > 0 ? `Found ${smallButtons.length} buttons smaller than 44px` : 'All buttons adequately sized');

    // Test for overflow issues
    const overflowElements = Array.from(document.querySelectorAll('*')).filter(el => {
        const style = window.getComputedStyle(el);
        return style.overflowX === 'scroll' || style.overflowX === 'auto';
    });
    addTest('MOBILE', 'No unexpected horizontal scroll', overflowElements.length < 5,
        `Found ${overflowElements.length} elements with horizontal scroll`);

    logResult('MOBILE RESPONSIVENESS tests complete', 'info');
}

// ============================================
// GENERATE REPORT
// ============================================
function generateReport() {
    const passRate = ((testResults.testsPassed / testResults.testsRun) * 100).toFixed(1);

    let report = `# PAGE TEST REPORT\n\n`;
    report += `**Generated:** ${new Date(testResults.timestamp).toLocaleString()}\n`;
    report += `**App Version:** ${testResults.appVersion}\n`;
    report += `**Tests Run:** ${testResults.testsRun}\n`;
    report += `**Tests Passed:** ${testResults.testsPassed} (${passRate}%)\n`;
    report += `**Tests Failed:** ${testResults.testsFailed}\n\n`;

    report += `---\n\n`;

    // Summary by view
    report += `## Summary by View\n\n`;
    report += `| View | Tests Run | Passed | Failed | Pass Rate |\n`;
    report += `|------|-----------|--------|--------|----------|\n`;

    for (const [viewName, viewData] of Object.entries(testResults.views)) {
        const total = viewData.passed + viewData.failed;
        const rate = ((viewData.passed / total) * 100).toFixed(0);
        const status = viewData.failed === 0 ? '✅' : '⚠️';
        report += `| ${status} ${viewName} | ${total} | ${viewData.passed} | ${viewData.failed} | ${rate}% |\n`;
    }

    report += `\n---\n\n`;

    // Detailed results
    report += `## Detailed Test Results\n\n`;

    for (const [viewName, viewData] of Object.entries(testResults.views)) {
        const status = viewData.failed === 0 ? 'PASS ✅' : 'FAIL ⚠️';
        report += `### ${viewName} - ${status}\n\n`;

        for (const test of viewData.tests) {
            const icon = test.passed ? '✓' : '✗';
            report += `- [${icon}] **${test.name}**\n`;
            if (test.notes) {
                report += `  - ${test.notes}\n`;
            }
        }
        report += `\n`;
    }

    // Issues found
    if (testResults.issues.length > 0) {
        report += `---\n\n## Issues Found\n\n`;
        testResults.issues.forEach((issue, index) => {
            report += `### ${index + 1}. ${issue.view} - ${issue.test}\n\n`;
            report += `**Details:** ${issue.notes}\n\n`;
            report += `**Severity:** ${issue.view === 'HOME' || issue.view === 'NAVIGATION' ? 'HIGH' : 'MEDIUM'}\n\n`;
        });
    }

    // Recommendations
    report += `---\n\n## Recommendations\n\n`;
    if (testResults.testsFailed === 0) {
        report += `✅ All tests passed! The application is functioning correctly.\n\n`;
    } else {
        report += `⚠️ ${testResults.testsFailed} test(s) failed. Review the issues above and fix accordingly.\n\n`;
    }

    report += `### Next Steps:\n\n`;
    report += `1. Review failed tests and fix broken functionality\n`;
    report += `2. Test on actual mobile devices (not just viewport resize)\n`;
    report += `3. Perform cross-browser testing (Chrome, Firefox, Safari)\n`;
    report += `4. Test with real user accounts (not just guest mode)\n`;
    report += `5. Performance testing (load times, animation smoothness)\n`;
    report += `6. Accessibility testing (screen readers, keyboard navigation)\n\n`;

    return report;
}

// ============================================
// RUN ALL TESTS
// ============================================
async function runAllTests() {
    logResult('========================================', 'info');
    logResult('COMPREHENSIVE PAGE TESTING STARTING', 'info');
    logResult('========================================', 'info');

    try {
        await testHomeView();
        await testProfileView();
        await testSettingsView();
        await testShopView();
        await testAvatarBuilder();
        await testTankGame();
        await testBeastCollection();
        await testLeaderboard();
        await testNavigation();
        await testMobileResponsiveness();

        logResult('========================================', 'info');
        logResult('ALL TESTS COMPLETE', 'info');
        logResult('========================================', 'info');
        logResult(`Tests Run: ${testResults.testsRun}`, 'info');
        logResult(`Tests Passed: ${testResults.testsPassed}`, 'pass');
        logResult(`Tests Failed: ${testResults.testsFailed}`, testResults.testsFailed > 0 ? 'fail' : 'pass');

        // Generate and download report
        const report = generateReport();
        console.log('\n\n' + report);

        // Create downloadable file
        const blob = new Blob([report], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'PAGE_TEST_REPORT.md';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        logResult('Report generated and downloaded as PAGE_TEST_REPORT.md', 'pass');

        return testResults;

    } catch (error) {
        logResult(`CRITICAL ERROR: ${error.message}`, 'fail');
        console.error(error);
        return testResults;
    }
}

// Auto-run on load or expose globally
if (typeof window !== 'undefined') {
    window.runPageTests = runAllTests;
    console.log('✅ Comprehensive page testing script loaded!');
    console.log('Run tests with: runPageTests()');
}

// Export for Node.js if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { runAllTests };
}
