const fs = require('fs');

const iconMappings = [
    // View titles
    { emoji: '📋 History', svg: '<img src="assets/icons/history.svg" alt="" style="width:18px;height:18px;margin-right:4px;vertical-align:middle"> History' },
    { emoji: '👤 Profile', svg: '<img src="assets/icons/profile.svg" alt="" style="width:18px;height:18px;margin-right:4px;vertical-align:middle"> Profile' },
    { emoji: '❓ Help', svg: '<img src="assets/icons/help.svg" alt="" style="width:18px;height:18px;margin-right:4px;vertical-align:middle"> Help' },

    // Section titles
    { emoji: '🎖️ Badges', svg: '<img src="assets/icons/badges.svg" alt="" style="width:16px;height:16px;margin-right:4px"> Badges' },
    { emoji: '🌟 Weekly Challenges', svg: '<img src="assets/icons/star.svg" alt="" style="width:16px;height:16px;margin-right:4px"> Weekly Challenges' },
    { emoji: '🏆 Special Events', svg: '<img src="assets/icons/trophy.svg" alt="" style="width:16px;height:16px;margin-right:4px"> Special Events' },
    { emoji: '🏆 Weekly Challenge', svg: '<img src="assets/icons/trophy.svg" alt="" style="width:16px;height:16px;margin-right:4px"> Weekly Challenge' },
    { emoji: '🏆 Squad Leaderboard', svg: '<img src="assets/icons/leaderboard.svg" alt="" style="width:16px;height:16px;margin-right:4px"> Squad Leaderboard' },
    { emoji: '📋 Daily Quests', svg: '<img src="assets/icons/quest.svg" alt="" style="width:16px;height:16px;margin-right:4px"> Daily Quests' },

    // Help sections
    { emoji: '🪙 Truth Coins & Progression', svg: '<img src="assets/icons/currency-coin.svg" alt="" style="width:16px;height:16px;margin-right:4px"> Truth Coins & Progression' },
    { emoji: '⚡ Quest System', svg: '<img src="assets/icons/quest.svg" alt="" style="width:16px;height:16px;margin-right:4px"> Quest System' },
    { emoji: '🎨 Avatar Customization', svg: '<img src="assets/icons/camera.svg" alt="" style="width:16px;height:16px;margin-right:4px"> Avatar Customization' },
    { emoji: '🎲 Gacha / Mystery Rolls', svg: '<img src="assets/icons/lootbox.svg" alt="" style="width:16px;height:16px;margin-right:4px"> Gacha / Mystery Rolls' },
    { emoji: '🎮 Tank Shooter Game', svg: '<img src="assets/icons/ui-tank.svg" alt="" style="width:16px;height:16px;margin-right:4px"> Tank Shooter Game' },

    // Buttons and standalone icons
    { emoji: '<span>🎨</span>', svg: '<img src="assets/icons/camera.svg" alt="Edit" style="width:16px;height:16px">' },
    { emoji: '⚙️', svg: '<img src="assets/icons/ui-settings.svg" alt="Settings" style="width:18px;height:18px">' },
    { emoji: '🏪', svg: '<img src="assets/icons/shop.svg" alt="Shop" style="width:24px;height:24px">' },
    { emoji: '👥', svg: '<img src="assets/icons/friends.svg" alt="Friends" style="width:24px;height:24px">' },
    { emoji: '🛡️', svg: '<img src="assets/icons/shield.svg" alt="Shield" style="width:24px;height:24px">' },
    { emoji: '⚡', svg: '<img src="assets/icons/energy.svg" alt="Energy" style="width:24px;height:24px">' },

    // CSS content (special handling)
    { emoji: "content: '⚔️'", svg: "content: url('assets/icons/action-attack.svg')" },
    { emoji: "content: '🔒'", svg: "content: url('assets/icons/ui-lock.svg')" },

    // History empty state
    { emoji: '<div style="font-size:40px;margin-bottom:8px">📋</div>', svg: '<div style="margin-bottom:8px"><img src="assets/icons/history.svg" alt="" style="width:48px;height:48px"></div>' },

    // Lock buttons
    { emoji: '🔒 Coming Q1 2025', svg: '<img src="assets/icons/ui-lock.svg" alt="" style="width:16px;height:16px;margin-right:4px"> Coming Q1 2025' },

    // Powerup icons (already done in some places, making sure all are covered)
    { emoji: '>⚔️<', svg: '><img src="assets/icons/action-attack.svg" alt="" style="width:18px;height:18px"><' },
];

const filePath = 'C:\\Users\\Conner\\Downloads\\files_extracted\\index.html';
let content = fs.readFileSync(filePath, 'utf8');

let replacements = 0;
iconMappings.forEach(({ emoji, svg }) => {
    const count = (content.match(new RegExp(emoji.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
    if (count > 0) {
        content = content.split(emoji).join(svg);
        replacements += count;
        console.log(`Replaced ${count} instances of: ${emoji.substring(0, 50)}...`);
    }
});

fs.writeFileSync(filePath, content, 'utf8');
console.log(`\n✅ Total replacements: ${replacements}`);
console.log('Icon replacement complete!');
