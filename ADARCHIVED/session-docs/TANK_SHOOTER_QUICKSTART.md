# Tank Shooter - Quick Start Guide
**For:** Testing & User Onboarding
**Status:** Phase 1 Complete - Ready to Play!

---

## How to Play (Desktop)

### Starting the Game
1. Navigate to **Truth Hunters** → **Outbreaks** view
2. Click the big green button: **🎮 PLAY TANK SHOOTER**
3. Game launches in fullscreen overlay

### Controls
- **Move:** WASD or Arrow Keys
- **Aim:** Mouse cursor (tank turret follows)
- **Shoot:** Left Click (hold for auto-fire) OR Space bar
- **Power-Ups:** Press number keys 1-5
  - **1** = ⏰ Slow-Mo (slow enemies)
  - **2** = 💥 Scatter Shot (5 bullets)
  - **3** = 👁️ X-Ray Vision (+50% damage)
  - **4** = 🛡️ Shield (absorb 100 damage)
  - **5** = ⚡ EMP Blast (damage all enemies)
- **Close Game:** X button (top-left) or ESC

### Objective
- **Survive waves of AI misinformation bots**
- **Destroy enemies before they reach you**
- **Use power-ups strategically**
- **Reach higher waves for better coin rewards**

---

## How to Play (Mobile)

### Starting the Game
1. Same as desktop (tap "PLAY TANK SHOOTER")

### Controls
- **Move:** Virtual joystick (bottom-left corner)
- **Shoot:** Fire button (bottom-right) - tap or hold
- **Aim:** Auto-aims at nearest enemy
- **Power-Ups:** Tap the icons at bottom of screen

### Tips for Mobile
- Keep finger on joystick for continuous movement
- Hold fire button for auto-fire (easier than tapping)
- Power-ups are large tap targets (60px)
- Health bar and score at top

---

## Enemy Types

| Icon | Name | Behavior | HP | Threat |
|------|------|----------|----|----|
| 📧 | Spam Bot | Moves straight at you | 25 | ⭐ Low |
| 📰 | Fake News Drone | Zigzags while advancing | 50 | ⭐⭐ Medium |
| 🤖 | Deepfake Tank | Slow but shoots back | 100 | ⭐⭐⭐ High |
| ⚡ | Bot Swarm | Fast, spawns in groups | 15 | ⭐⭐ Medium (quantity) |
| 🧠 | Elite AI Boss | Huge HP, shoots, spawns minions | 500+ | ⭐⭐⭐⭐⭐ BOSS |

---

## Power-Up Strategy Guide

### ⏰ Slow-Mo (45s cooldown)
**Best For:** Boss fights, overwhelming waves
**Duration:** 10 seconds
**Effect:** Enemies move at 25% speed
**Tip:** Use when surrounded or low HP

### 💥 Scatter Shot (30s cooldown)
**Best For:** Bot swarms, clearing crowds
**Duration:** 8 seconds
**Effect:** Fire 5 bullets in cone pattern
**Tip:** Aim into dense enemy groups

### 👁️ X-Ray Vision (60s cooldown)
**Best For:** Boss damage, high-HP enemies
**Duration:** 12 seconds
**Effect:** +50% damage, see all enemy HP
**Tip:** Combo with Scatter Shot for massive DPS

### 🛡️ Shield (40s cooldown)
**Best For:** Low health emergencies
**Duration:** Until 100 damage absorbed
**Effect:** Blocks next 100 damage, reflects 50%
**Tip:** Activate before pushing into enemies

### ⚡ EMP Blast (90s cooldown)
**Best For:** Emergency panic button
**Duration:** Instant + 2s stun
**Effect:** 50 damage to ALL enemies, 2s stun
**Tip:** Save for critical moments (swarm + boss)

---

## Wave Progression

### Waves 1-3: Tutorial
- **Enemies:** Spam Bots only
- **Difficulty:** Easy
- **Learn:** Movement, shooting, power-ups

### Waves 4-5: Ramp-Up
- **Enemies:** Spam + Fake News + Deepfake
- **Difficulty:** Medium
- **Boss:** Wave 5 (first boss fight)

### Waves 6-9: Escalation
- **Enemies:** All types except boss
- **Difficulty:** Hard
- **Challenge:** Multiple enemy types at once

### Wave 10+: Endgame
- **Enemies:** All types, high quantities
- **Bosses:** Every 5 waves (10, 15, 20...)
- **Difficulty:** Very Hard (scaling continues)

---

## Scoring & Rewards

### How Points Work
- **Kill Enemy:** 10-500 points (depends on type)
- **Combo:** Kill enemies within 2 seconds for multiplier (up to 5.0x)
- **Wave Complete:** +100 points × wave number
- **No Damage Bonus:** +200 points (if full health at wave end)

### Grade System
| Grade | Score Required | Coin Multiplier |
|-------|---------------|----------------|
| S | 10,000+ | 2.0x |
| A | 7,500+ | 1.5x |
| B | 5,000+ | 1.25x |
| C | 2,500+ | 1.0x |
| D | < 2,500 | 0.75x |

### Coin Calculation
**Formula:**
```
baseCoins = floor(score / 100)
waveBonus = wave × 2
killBonus = enemiesKilled × 1

totalCoins = floor((baseCoins + waveBonus + killBonus) × gradeMultiplier)
```

**Example Session:**
- Reach Wave 8
- Score: 6,200 (B-Rank, 1.25x)
- Kill 89 enemies
- **Coins Earned:** (62 + 16 + 89) × 1.25 = **209 coins**

---

## Pro Tips

### 🎯 Maximize Score
1. **Keep Combo Alive:** Kill enemies rapidly (< 2s between kills)
2. **Prioritize High-Value Targets:** Deepfakes (50 pts) > Spam Bots (10 pts)
3. **Complete Waves Fast:** Wave bonus is fixed, so speed = more waves = more points
4. **Preserve Health:** No-damage bonus is worth 200 points (avoid unnecessary hits)

### 💰 Maximize Coins
1. **Reach Higher Waves:** Wave bonus is 2 coins per wave (wave 20 = +40 coins)
2. **Kill Everything:** Each kill = 1 coin (even 0.33 from swarm bots add up)
3. **Get S-Rank:** 2.0x multiplier doubles your coins!
4. **Don't Die Early:** Dying wave 3 vs wave 10 is massive coin difference

### 🛡️ Survive Longer
1. **Health Regen:** Don't take damage for 5 seconds = +2 HP/second
2. **Kite Enemies:** Move backward while shooting (classic shooter tactic)
3. **Use Shield Wisely:** Don't waste on 10 damage, save for 50+ damage hits
4. **EMP = Life Saver:** When HP < 25%, EMP buys you 2 seconds to heal
5. **Corner Strategy:** Don't get cornered! Keep moving, use screen edges

### ⚡ Power-Up Combos
- **X-Ray + Scatter Shot** = Delete boss HP fast
- **Shield + Slow-Mo** = Tank through waves while enemies crawl
- **EMP → Scatter Shot** = Clean up stunned enemies quickly

---

## Common Questions

### Q: Why isn't my turret aiming where I click?
**A:** The turret aims toward your mouse cursor continuously. Make sure you're moving the mouse, not just clicking.

### Q: Can I pause the game?
**A:** Not yet (Phase 2 feature). Close button (X) quits the game immediately.

### Q: Do coins carry over between games?
**A:** Yes! Coins are saved to your account via Supabase after each game.

### Q: What happens if I refresh during a game?
**A:** Game resets. Coins are only awarded at Game Over screen.

### Q: Can I play with friends?
**A:** Not yet. Multiplayer (squad co-op, 2v2) is Phase 3-4.

### Q: How do I unlock more power-ups?
**A:** All 5 power-ups are available from the start (no unlocking required).

### Q: What's the highest wave reached?
**A:** No leaderboard yet (Phase 2). Track your personal best!

---

## Troubleshooting

### Power-ups not working
- Check cooldown timer (number in top-right of button)
- Wait until button lights up green
- Press number key (1-5) or tap icon

### Enemies not spawning
- Wave transition takes 3 seconds
- Kill all current enemies first
- Check wave counter at top (should increment)

### Game feels laggy
- Close other browser tabs
- Lower screen brightness (mobile)
- Check FPS in dev console (`tankGame.running`)

### Coins not saving
- Make sure you're logged in (profile icon)
- Wait for Game Over screen (coins awarded then)
- Check console for Supabase errors

### Mobile controls not responsive
- Tap joystick area firmly
- Fire button needs direct tap (60px target)
- If stuck, refresh page and restart

---

## Developer Console (Advanced)

Open browser DevTools (F12) and type:

```javascript
// Check game state
tankGame

// Manually award coins (testing only)
activatePowerUp('emp')

// Check player stats
tankGame.player

// See all enemies
tankGame.enemies.length

// Force game over (testing)
tankGame.player.hp = 0
```

---

## Keyboard Shortcuts Reference Card

```
┌──────────────────────────────────┐
│  TANK SHOOTER CONTROLS (DESKTOP) │
├──────────────────────────────────┤
│ Movement:                        │
│   W / ↑  = Move Up              │
│   S / ↓  = Move Down            │
│   A / ←  = Move Left            │
│   D / →  = Move Right           │
│                                  │
│ Combat:                          │
│   Mouse  = Aim Turret           │
│   Click  = Shoot (hold=auto)    │
│   Space  = Shoot                │
│                                  │
│ Power-Ups:                       │
│   1 = ⏰ Slow-Mo                │
│   2 = 💥 Scatter Shot           │
│   3 = 👁️ X-Ray Vision          │
│   4 = 🛡️ Shield                │
│   5 = ⚡ EMP Blast             │
│                                  │
│ System:                          │
│   ESC = Toggle Pause            │
│   X   = Quit Game               │
└──────────────────────────────────┘
```

---

## What's Next? (Upcoming Features)

### Phase 2 - Polish (Coming Soon)
- 🔊 Sound effects & music
- 📚 Tutorial overlay for new players
- 🏆 Tank shooter leaderboard
- 🎨 Screen shake, damage numbers, muzzle flash

### Phase 3 - Multiplayer (Future)
- 👥 Squad co-op mode (2-4 players)
- ⚔️ 2v2 competitive battles
- 🤝 Friend system

### Phase 4 - Content (Long-term)
- 🎨 Cosmetic shop (tank skins, projectile trails)
- 📅 Daily challenges
- ♾️ Endless mode
- 📖 Story campaign

---

## Feedback & Bug Reports

**Found a bug?** Report in:
- GitHub Issues: https://github.com/Sharks820/authenticadetector/issues
- Tag in CLAUDE.md: @Game-Systems

**Have ideas?** Suggest features in Discord or GitHub Discussions!

---

**Ready to fight AI misinformation? PLAY TANK SHOOTER NOW! 🎮**
