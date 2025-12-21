(function() {
  const iconPaths = {
    chevronRight: 'assets/icons/chevron-right.svg',
    back: 'assets/icons/back.svg',
    badges: 'assets/icons/badges.svg',
    beasts: 'assets/icons/beasts.svg',
    boss: 'assets/icons/boss.svg',
    camera: 'assets/icons/camera.svg',
    capture: 'assets/icons/capture.svg',
    chat: 'assets/icons/chat.svg',
    coins: 'assets/icons/coins.svg',
    corruption: 'assets/icons/corruption.svg',
    crosshair: 'assets/icons/crosshair.svg',
    duels: 'assets/icons/duels.svg',
    friends: 'assets/icons/friends.svg',
    heart: 'assets/icons/heart.svg',
    help: 'assets/icons/help.svg',
    history: 'assets/icons/history.svg',
    home: 'assets/icons/home.svg',
    info: 'assets/icons/info.svg',
    install: 'assets/icons/install.svg',
    inventory: 'assets/icons/inventory.svg',
    leaderboard: 'assets/icons/leaderboard.svg',
    lootbox: 'assets/icons/lootbox.svg',
    map: 'assets/icons/map.svg',
    play: 'assets/icons/play.svg',
    profile: 'assets/icons/profile.svg',
    quest: 'assets/icons/quest.svg',
    refresh: 'assets/icons/refresh.svg',
    scan: 'assets/icons/scan.svg',
    search: 'assets/icons/search.svg',
    settings: 'assets/icons/settings.svg',
    shield: 'assets/icons/shield.svg',
    sparkles: 'assets/icons/sparkles.svg',
    star: 'assets/icons/star.svg',
    stats: 'assets/icons/stats.svg',
    store: 'assets/icons/store.svg',
    tank: 'assets/icons/tank.svg',
    trophy: 'assets/icons/trophy.svg',
    upload: 'assets/icons/upload.svg',
    verify: 'assets/icons/verify.svg',
    wand: 'assets/icons/wand.svg',
    warning: 'assets/icons/warning.svg',
  };

  const cache = new Map();

  async function getIcon(name) {
    if (!iconPaths[name]) return null;
    if (cache.has(name)) return cache.get(name);
    const res = await fetch(iconPaths[name]);
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
