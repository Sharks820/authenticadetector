(function() {
  const ICON_VERSION = 'v1.1'; // Cache buster - increment when icons change

  const iconPaths = {
    // === NAVIGATION ===
    chevronRight: 'assets/icons/chevron-right.svg',
    back: 'assets/icons/back.svg',
    home: 'assets/icons/home.svg',
    map: 'assets/icons/map.svg',
    notifications: 'assets/icons/notifications.svg',
    quests: 'assets/icons/quests.svg',
    quest: 'assets/icons/quests.svg', // alias
    settings: 'assets/icons/settings.svg',
    shop: 'assets/icons/shop.svg',

    // === BATTLE ===
    arena: 'assets/icons/arena.svg',
    beasts: 'assets/icons/beasts.svg',
    bossRush: 'assets/icons/boss-rush.svg',
    boss: 'assets/icons/boss.svg',
    capture: 'assets/icons/capture.svg',
    duels: 'assets/icons/duels.svg',

    // === COMPETITION ===
    achievements: 'assets/icons/achievements.svg',
    ranking: 'assets/icons/ranking.svg',
    trophy: 'assets/icons/trophy.svg',
    leaderboard: 'assets/icons/ranking.svg', // alias to new HD ranking

    // === CURRENCY (NEW HD ICONS) ===
    crystalCurrency: 'assets/icons/crystal-currency.svg',
    currencyCoin: 'assets/icons/currency-coin.svg',
    currencyKey: 'assets/icons/currency-key.svg',
    coins: 'assets/icons/currency-coin.svg', // alias to new HD coin
    star: 'assets/icons/star.svg',

    // === PROGRESSION ===
    energy: 'assets/icons/energy.svg',
    evolution: 'assets/icons/evolution.svg',
    fusion: 'assets/icons/fusion.svg',
    inventory: 'assets/icons/inventory.svg',
    rewards: 'assets/icons/rewards.svg',
    training: 'assets/icons/training.svg',

    // === SOCIAL ===
    friends: 'assets/icons/friends.svg',
    guild: 'assets/icons/guild.svg',
    messages: 'assets/icons/messages.svg',
    squad: 'assets/icons/squad.svg',
    chat: 'assets/icons/messages.svg', // alias

    // === PLAY ===
    play: 'assets/icons/play.svg',
    playRed: 'assets/icons/play-red.svg',

    // === SPECIAL ===
    vera: 'assets/icons/vera.svg',

    // === UI ELEMENTS ===
    badges: 'assets/icons/badges.svg',
    camera: 'assets/icons/camera.svg',
    corruption: 'assets/icons/corruption.svg',
    crosshair: 'assets/icons/crosshair.svg',
    heart: 'assets/icons/heart.svg',
    help: 'assets/icons/help.svg',
    history: 'assets/icons/history.svg',
    info: 'assets/icons/info.svg',
    install: 'assets/icons/install.svg',
    lootbox: 'assets/icons/lootbox.svg',
    profile: 'assets/icons/profile.svg',
    refresh: 'assets/icons/refresh.svg',
    scan: 'assets/icons/scan.svg',
    search: 'assets/icons/search.svg',
    shield: 'assets/icons/shield.svg',
    sparkles: 'assets/icons/sparkles.svg',
    stats: 'assets/icons/stats.svg',
    store: 'assets/icons/shop.svg', // alias to new HD shop
    tank: 'assets/icons/tank.svg',
    upload: 'assets/icons/upload.svg',
    verify: 'assets/icons/verify.svg',
    wand: 'assets/icons/wand.svg',
    warning: 'assets/icons/warning.svg',
  };

  const cache = new Map();

  async function getIcon(name) {
    if (!iconPaths[name]) return null;
    if (cache.has(name)) return cache.get(name);
    const res = await fetch(iconPaths[name] + '?' + ICON_VERSION);
    if (!res.ok) return null;
    const svg = await res.text();
    cache.set(name, svg);
    return svg;
  }

  async function renderIcon(target, name, options) {
    const svg = await getIcon(name);
    if (!svg || !target) return;
    target.innerHTML = svg;
    const svgEl = target.querySelector('svg');
    if (svgEl) {
      if (options && options.size) {
        svgEl.setAttribute('width', options.size);
        svgEl.setAttribute('height', options.size);
      }
      svgEl.setAttribute('aria-hidden', 'true');
      svgEl.setAttribute('focusable', 'false');
    }
  }

  function apply(root) {
    const scope = root || document;
    const nodes = scope.querySelectorAll('[data-ad-icon]');
    nodes.forEach(async (node) => {
      const name = node.getAttribute('data-ad-icon');
      const size = node.getAttribute('data-ad-size');
      await renderIcon(node, name, { size });
    });
  }

  window.IconLibrary = {
    paths: iconPaths,
    renderIcon,
    apply
  };
})();
