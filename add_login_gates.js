const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

const loginCheck = `    // Login requirement check
    if (!user) {
        showToast('Please log in to play!', 'warning');
        return;
    }

`;

// Function patterns to add login checks
const patterns = [
    {
        // startTruthCannon
        search: /window\.startTruthCannon = function\(\) {\s*\n(\s*)console\.log/,
        replace: `window.startTruthCannon = function() {\n${loginCheck}$1console.log`
    },
    {
        // startBeastBattle (multi-line version around line 8693)
        search: /(window\.startBeastBattle = function\(\) {\s*\n)(\s*showToast\('Beast battles coming soon)/,
        replace: `$1${loginCheck}$2`
    },
    {
        // openPvPArena (multi-line version around line 8680)
        search: /(window\.openPvPArena = function\(\) {\s*\n)(\s*showToast\('PvP Arena coming soon)/,
        replace: `$1${loginCheck}$2`
    },
    {
        // viewBeastDetails (multi-line version around line 8683)
        search: /(window\.viewBeastDetails = function\(\) {\s*\n)(\s*showToast\('Beast details coming soon)/,
        replace: `$1${loginCheck}$2`
    },
    {
        // openBeastLineup (multi-line version around line 8688)
        search: /(window\.openBeastLineup = function\(\) {\s*\n)(\s*showToast\('Beast Lineup editor coming soon)/,
        replace: `$1${loginCheck}$2`
    }
];

let changeCount = 0;

patterns.forEach((pattern, index) => {
    if (pattern.search.test(content)) {
        content = content.replace(pattern.search, pattern.replace);
        changeCount++;
        console.log(`✓ Applied pattern ${index + 1}`);
    } else {
        console.log(`✗ Pattern ${index + 1} not matched`);
    }
});

if (changeCount > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`\n✓ Successfully added login gates to ${changeCount} functions`);
} else {
    console.log('\n✗ No changes made - patterns did not match');
}
