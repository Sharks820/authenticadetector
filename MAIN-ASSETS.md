# AuthenticaDetector - Main Assets Inventory
**Last Updated:** December 23, 2025
**Total Asset Files:** 292

---

## Directory Structure

```
assets/
├── avatar/          # Basic avatar parts (4 SVGs)
├── character/       # Character system parts (7 files)
├── game/            # Game graphics and FX
│   ├── backgrounds/ # Parallax layers (3 SVGs)
│   ├── bestiary/    # Beast/monster sprites (14 SVGs)
│   ├── fx/          # Effect definitions (3 JSONs)
│   └── sprites/     # Tank, enemies, projectiles (7 SVGs)
├── icons/           # UI icons (90+ SVGs)
│   └── fixed/       # Improved icon variants (6 files)
├── style/           # Design tokens and themes (3 files)
└── vera/            # VERA character assets
    ├── v2/          # V2 layered animation system
    │   ├── vera_fairy/    # Fairy state layers (10 PNGs)
    │   ├── vera_monster/  # Monster state layers (11 PNGs)
    │   ├── vera_partial/  # Partial transform layers (11 PNGs)
    │   └── vera_takeover/ # Takeover state layers (11 PNGs)
    └── fx/          # VERA effects (3 JSONs)
```

---

## Icon Categories (90+ icons)

### Navigation Icons
| Icon | File | Usage |
|------|------|-------|
| Home | nav-home.svg | Main navigation |
| Profile | nav-profile.svg | User profile |
| History | nav-history.svg | Scan history |
| Leaderboard | nav-leaderboard.svg | Rankings |
| Pets | nav-pets.svg | Beast collection |
| Shop | nav-shop.svg | Store |
| Scan | nav-scan.svg | AI detection |
| Settings | nav-settings.svg | Settings view |
| Ranks | nav-ranks.svg | Tier rankings |
| VERA | nav-vera.svg | VERA assistant |

### Action Icons
| Icon | File | Usage |
|------|------|-------|
| Attack | action-attack.svg | Combat action |
| Defend | action-defend.svg | Defense action |
| Heal | action-heal.svg | Healing action |
| Hunt | action-hunt.svg | Truth Hunters |
| Magic | action-magic.svg | Special ability |
| Verify | action-verify.svg | Image verify |

### Alert Icons
| Icon | File | Usage |
|------|------|-------|
| Error | alert-error.svg | Error state |
| Warning | alert-warning.svg | Warning state |
| Success | alert-success.svg | Success state |
| Info | alert-info.svg | Info state |

### Currency Icons
| Icon | File | Usage |
|------|------|-------|
| Coin | currency-coin.svg | Truth Coins |
| Key | currency-key.svg | Unlock keys |
| Crystal | currency-crystal.svg | Premium currency |
| Essence | currency-essence.svg | Beast essence |

### UI Icons
| Icon | File | Usage |
|------|------|-------|
| Back | ui-back.svg | Navigation back |
| Menu | ui-menu.svg | Menu toggle |
| Lock | ui-lock.svg | Locked state |
| Unlock | ui-unlock.svg | Unlocked state |
| Install | ui-install.svg | PWA install |
| Settings | ui-settings.svg | Settings gear |
| Tank | ui-tank.svg | Tank game |
| Profile | ui-profile.svg | User avatar |
| Notification | ui-notification.svg | Alerts |

### Game Icons
| Icon | File | Usage |
|------|------|-------|
| Arena | arena.svg | PvP arena |
| Beasts | beasts.svg | Beast menu |
| Boss | boss.svg | Boss battles |
| Boss Rush | boss-rush.svg | Boss rush mode |
| Capture | capture.svg | Beast capture |
| Duels | duels.svg | PvP duels |
| Energy | energy.svg | Action points |
| Evolution | evolution.svg | Beast evolution |
| Fusion | fusion.svg | Beast fusion |
| Guild | guild.svg | Squad/guild |
| Inventory | inventory.svg | Items |
| Lootbox | lootbox.svg | Gacha boxes |
| Quest | quest.svg | Quests |
| Training | training.svg | Beast training |
| Trophy | trophy.svg | Achievements |

### Shop Icons
| Icon | File | Usage |
|------|------|-------|
| Shop | shop.svg | Main shop |
| Accessory | shop-accessory.svg | Accessories |
| Buff | shop-buff.svg | Boosts |
| Gem | shop-gem.svg | Gems |
| Outfit | shop-outfit.svg | Cosmetics |
| Potion | shop-potion.svg | Consumables |
| Premium | shop-premium.svg | Premium items |
| Skin | shop-skin.svg | Skins |

### Special Icons
| Icon | File | Usage |
|------|------|-------|
| Corruption | special-corruption.svg | Monster mode |
| Demon Eye | special-demon-eye.svg | Beast eyes |
| Fairy Dust | special-fairy-dust.svg | Fairy effects |
| Wings | special-wings.svg | Wing accessories |

---

## VERA Animation System (V2)

### States Available
1. **Fairy** - Default helpful state (10 layers)
2. **Partial** - Transitioning state (11 layers)
3. **Takeover** - Aggressive state (11 layers)
4. **Monster** - Full monster state (11 layers)

### Layer Hierarchy (per state)
1. body.png - Character body
2. head.png - Head
3. eyes.png - Eyes (for blink animation)
4. mouth.png - Mouth (for expressions)
5. hair.png - Hair (with color variants)
6. wing_left.png - Left wing
7. wing_right.png - Right wing
8. tail.png - Tail (monster/partial only)

### Hair Color Variants
- Default (black)
- Blonde
- Purple

---

## Game Sprites

### Tank Shooter Sprites (tank-sprites.svg)
Contains SVG symbols for:
- Player tank
- Enemy types: spam, bot, fakenews, troll, deepfake, swarm, shielder, sniper, rusher, botnet, phantom, juggernaut
- Powerups: health, rapidfire, shield, nuke, speedboost, spreadshot
- Boss crown

### Bestiary Creatures
- Common (3 variants)
- Uncommon (4 variants)
- Rare (3 variants)
- Legendary (2 variants)

---

## Style System

### Design Tokens (design-tokens.css)
- Color palette (teal/cyan, purple, gold themes)
- Spacing system
- Typography scales
- Animation timings
- Shadow/glow definitions

### Theme (theme.css)
- Light/dark mode variables
- Component theming
- Accent color overrides

---

## Known Issues (Icons needing attention)

### Too Small / Hard to See
- [ ] Most icons lack stroke weight for small sizes
- [ ] Currency icons need larger hit areas
- [ ] Navigation icons need consistent sizing

### Missing Icons
- [ ] Beast rarity indicators
- [ ] Tank upgrade icons
- [ ] Achievement progress icons

### Needs Redesign
- [ ] nav-vera.svg - Interactive hover state not working as <img>
- [ ] currency-coin.svg - Eye stamp too detailed at small size
- [ ] action-attack.svg - Energy trails not visible at 24px

---

## Icon Size Guidelines

| Context | Size | Notes |
|---------|------|-------|
| Navigation bar | 28px | Needs 2px stroke |
| Action buttons | 24px | High contrast |
| Currency display | 20px | Simple silhouette |
| List items | 18px | Minimal detail |
| Badges | 16px | Icon-only |

---

## Related Files (Root Level)

### Active CSS
- UI_FIXES.css - Modal and overlay fixes
- UI_POLISH_PASS.css - General polish
- PROFESSIONAL_UI_OVERHAUL.css - Badge and card styling
- vera-controller.css - VERA animations

### Active JS
- tank-shooter-enhanced.js - Tank game (uses SVG sprites)
- vera-controller.js - VERA logic
- ai-cosmetics-gacha.js - Gacha system
- avatar-cosmetics-system.js - Avatar system

---

## Archived Assets Location

Old/deprecated assets should be moved to: `ADARCHIVED/`

---

*This inventory should be updated when assets are added, modified, or archived.*
