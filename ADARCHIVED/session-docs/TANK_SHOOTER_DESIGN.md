# Tank Wave Shooter - Complete Game Design Document
**Project:** AuthenticaDetector Tank Shooter
**Owner:** Game-Systems Agent
**Created:** Dec 20, 2025
**Status:** Design Phase → Implementation

---

## 1. Executive Summary

### Purpose
Replace the existing Truth Cannon (Angry Birds-style physics game) with a more engaging, feature-rich tank wave shooter that combines arcade action with strategic power-up management and multiplayer mechanics.

### Core Concept
Top-down tank shooter where players defend against waves of AI misinformation bots. Players earn coins based on performance, unlock power-ups, and can team up with friends in squad mode or compete in 2v2 battles.

### Target Platforms
- Mobile (touch controls, 375px+ width)
- Desktop (keyboard + mouse)
- Progressive Web App (installable)

---

## 2. Game Mechanics

### 2.1 Perspective & Controls

**Perspective:** Top-down 2D (bird's eye view)
- Tank viewed from above
- 360-degree rotation
- Enemies approach from all sides

**Desktop Controls:**
- **Movement:** WASD or Arrow Keys
- **Aim:** Mouse cursor direction
- **Shoot:** Left Mouse Button or Space
- **Power-ups:** Number keys 1-5
- **Pause:** ESC

**Mobile Controls:**
- **Movement:** Virtual joystick (left side of screen)
- **Aim:** Auto-aim at nearest enemy OR drag right side to aim manually
- **Shoot:** Auto-fire when aimed at enemy OR tap button
- **Power-ups:** Tap power-up icons (bottom row)

### 2.2 Player Tank

**Stats:**
- Health: 100 HP (regenerates slowly when not hit for 5 seconds)
- Speed: 150 pixels/second
- Fire Rate: 2 shots/second (base)
- Damage: 25 per shot (base)

**Visual Design:**
- Main body: Teal/cyan gradient (#1abc9c theme)
- Turret: Rotates independently from body
- Tracks: Animated when moving
- Health bar: Above tank (green → yellow → red)

**Upgrades (Future Phase):**
- Armor Plating (+25 HP)
- Faster Reload (+0.5 shots/sec)
- Damage Boost (+10 damage)

### 2.3 Enemy Types

#### Type 1: Spam Bot (Waves 1-3)
- **HP:** 25
- **Speed:** 75 px/s
- **Damage:** 10
- **Behavior:** Move straight toward player
- **Visual:** Small red circle with "spam" icon 📧
- **Score:** 10 points
- **Coins:** 1 coin

#### Type 2: Fake News Drone (Waves 2-6)
- **HP:** 50
- **Speed:** 100 px/s
- **Damage:** 15
- **Behavior:** Zigzag pattern while advancing
- **Visual:** Red triangle with newspaper icon 📰
- **Score:** 25 points
- **Coins:** 2 coins

#### Type 3: Deepfake Tank (Waves 4+)
- **HP:** 100
- **Speed:** 50 px/s
- **Damage:** 30
- **Behavior:** Moves slowly, shoots back at player
- **Visual:** Red tank with glitch effect 🤖
- **Score:** 50 points
- **Coins:** 5 coins

#### Type 4: Bot Swarm (Waves 6+)
- **HP:** 15 each
- **Speed:** 120 px/s
- **Damage:** 5
- **Behavior:** Spawns in groups of 5-10, swarms player
- **Visual:** Tiny red dots with bot icon
- **Score:** 5 points each
- **Coins:** 1 coin per 3 destroyed

#### Type 5: Elite Misinformation AI (Boss - Every 5 Waves)
- **HP:** 500 (scales: 500 + wave * 100)
- **Speed:** 30 px/s
- **Damage:** 50
- **Behavior:** Multi-phase attack patterns, spawns minions
- **Visual:** Large red hexagon with AI brain icon 🧠
- **Score:** 500 points
- **Coins:** 25 coins
- **Special:** Drops random power-up on death

### 2.4 Wave System

**Wave Progression:**
- **Wave 1-3:** Spam Bots only (10 → 15 → 20 enemies)
- **Wave 4-5:** Mix of Spam + Fake News (15 + 10)
- **Wave 6-9:** Spam + Fake News + Deepfake Tanks (10 + 10 + 3)
- **Wave 10+:** All enemy types including Swarms
- **Boss Waves (5, 10, 15, 20...):** Elite AI + support enemies

**Difficulty Scaling:**
- Enemy HP: +5% per wave (caps at +100%)
- Enemy Speed: +3% per wave (caps at +50%)
- Spawn Rate: -10% interval per wave (caps at 50% of base)
- Enemy Count: +2 per wave type

**Wave Transition:**
- 3-second countdown before next wave
- Heal player +20 HP between waves
- Display wave number and incoming enemy types

### 2.5 Power-Up System

#### 1. Slow-Mo ⏰
- **Effect:** Slows all enemies to 25% speed for 10 seconds
- **Cooldown:** 45 seconds
- **Duration:** 10 seconds
- **Visual:** Blue time distortion effect on screen edges
- **Strategy:** Use during boss fights or when overwhelmed

#### 2. Scatter Shot 💥
- **Effect:** Shoots 5 projectiles in cone pattern instead of 1
- **Cooldown:** 30 seconds
- **Duration:** 8 seconds
- **Visual:** Orange muzzle flash, spread bullets
- **Strategy:** Clear swarms quickly

#### 3. X-Ray Vision 👁️
- **Effect:** See enemy HP bars and weak points, +50% damage
- **Cooldown:** 60 seconds
- **Duration:** 12 seconds
- **Visual:** Green scan lines, enemy outlines glow
- **Strategy:** Focus fire on high-value targets

#### 4. Shield 🛡️
- **Effect:** Absorbs next 100 damage, reflects 50% back to attackers
- **Cooldown:** 40 seconds
- **Duration:** Until damage absorbed
- **Visual:** Cyan hexagonal shield bubble around tank
- **Strategy:** Defensive play during difficult waves

#### 5. EMP Blast ⚡
- **Effect:** Instant 50 damage to all enemies on screen, stuns for 2s
- **Cooldown:** 90 seconds (longest cooldown)
- **Duration:** Instant effect + 2s stun
- **Visual:** Purple electric pulse expanding from tank
- **Strategy:** Emergency button when surrounded

**Power-Up Acquisition:**
- All unlocked from start (simplified for v1)
- Future: Unlock with coins or achievements
- Pickup drops: Boss kills drop random power-up charge

---

## 3. Scoring & Rewards

### 3.1 Scoring System

**Base Points:**
- Enemy Kill: See enemy type scores above
- Wave Complete: 100 * wave number
- Boss Kill: 500 + (wave * 50)
- No Damage Taken (wave): +200 bonus
- Combo Multiplier: +10% per consecutive kill within 2 seconds (caps at 3x)

**Performance Grades (per session):**
- **S-Rank:** 10,000+ points, no deaths
- **A-Rank:** 7,500+ points
- **B-Rank:** 5,000+ points
- **C-Rank:** 2,500+ points
- **D-Rank:** Below 2,500 points

### 3.2 Coin Rewards

**Calculation Formula:**
```javascript
baseCoins = Math.floor(score / 100)
waveBonus = wavesCompleted * 2
bossBonus = bossesKilled * 25
performanceMultiplier = gradeMultiplier // S=2.0, A=1.5, B=1.25, C=1.0, D=0.75

totalCoins = (baseCoins + waveBonus + bossBonus) * performanceMultiplier
```

**Example:**
- Score: 8,500 (A-Rank)
- Waves: 12
- Bosses: 2
- Coins: (85 + 24 + 50) * 1.5 = **238 coins**

**Integration with Existing System:**
- Coins awarded via `award_coins_atomic()` RPC (no race conditions)
- Update `userProgression.truth_coins`
- Display in game over screen
- Persist across sessions

### 3.3 Experience & Progression

**XP Gains:**
- Complete wave: 50 XP * wave number
- Kill enemy: XP = enemy HP / 2
- Survive without damage: +100 XP per wave

**Leveling:**
- Uses existing `user_progression` table
- XP thresholds: 100, 250, 500, 1000, 2000... (exponential)
- Level up rewards: +50 coins, badge milestones

---

## 4. Multiplayer Mechanics

### 4.1 Squad Mode (Co-op)

**Overview:**
Teams of 2-4 players defend a shared battlefield against waves. Players share health pool but earn individual coins.

**Mechanics:**
- Shared wave progression (all players must survive)
- Individual coin rewards based on contribution
- Revive mechanic: Downed players can be revived by teammates within 10s
- Squad power-up synergy: Stacking same power-up = enhanced effect

**Future Implementation:**
- WebSocket server for real-time sync
- Peer-to-peer connection via WebRTC
- Turn-based variant for simpler implementation (player takes turns)

### 4.2 Versus Mode (2v2)

**Overview:**
Two teams of 2 compete to see who survives the longest or reaches highest wave.

**Mechanics:**
- Parallel battlefields (teams can't directly attack each other)
- Race to wave X or highest score in 10 minutes
- Sabotage power-ups: Send extra enemies to opponent's side
- Winner earns 2x coins, loser earns 0.5x coins

**Matchmaking:**
- Friends-only initially (invite by user ID)
- Future: Skill-based matchmaking (by level/tier)

### 4.3 Phase Strategy

**Phase 1 (Current):** Single-player wave shooter
**Phase 2:** Squad co-op (2-4 players, turn-based)
**Phase 3:** Real-time multiplayer (WebSocket sync)
**Phase 4:** Ranked 2v2 competitive mode

---

## 5. Visual Design

### 5.1 Art Style

**Theme:** Neon cyberpunk meets retro arcade
- Primary: Teal/cyan (#1abc9c) - player elements
- Danger: Red/pink (#ff4478) - enemies
- Accent: Purple (#9b59b6) - power-ups
- Background: Dark grid (#0a0e27) with glowing lines

**Effects:**
- Particle explosions on enemy death
- Muzzle flash on shooting
- Screen shake on heavy hits
- Glow effects on power-ups
- Damage numbers floating up on hits

### 5.2 UI Layout

**In-Game HUD:**
```
┌──────────────────────────────────────┐
│ HP: ████████░░ 80/100   Wave: 7      │ ← Top bar
│ Score: 3,450   Combo: x2.5   Coins:+ │
├──────────────────────────────────────┤
│                                      │
│          [Game Canvas]               │ ← Main play area
│                                      │
│                                      │
├──────────────────────────────────────┤
│ [⏰] [💥] [👁️] [🛡️] [⚡]            │ ← Power-ups
└──────────────────────────────────────┘
```

**Mobile Optimization:**
- Power-ups: Large tap targets (60px x 60px)
- Joystick: Bottom-left, semi-transparent
- Fire button: Bottom-right (if manual fire enabled)
- HUD: Compact, no overlap with controls

### 5.3 Canvas Rendering

**Layers (back to front):**
1. Background grid (static)
2. Environmental effects (particles under tanks)
3. Enemy tanks/units
4. Player tank
5. Projectiles
6. Explosions/effects
7. Damage numbers
8. HUD overlays

**Performance Targets:**
- 60 FPS on mobile (iPhone 12, Pixel 5)
- Max 100 entities on screen
- Particle pool: 200 max particles
- Canvas size: Scale to viewport (max 1920x1080)

---

## 6. Technical Implementation

### 6.1 Architecture

**File Structure:**
```
index.html
├── CSS (inline, .tank-shooter-game class)
├── HTML (game container, canvas, UI)
└── JavaScript
    ├── Game State Management
    ├── Input Handling (touch + keyboard)
    ├── Entity System (Player, Enemy, Projectile)
    ├── Wave Manager
    ├── Power-Up System
    ├── Rendering Engine
    └── Supabase Integration (coins, leaderboard)
```

**State Management:**
```javascript
const gameState = {
  running: false,
  paused: false,
  wave: 1,
  score: 0,
  combo: 1,
  comboTimer: 0,
  coins: 0,
  player: Player,
  enemies: [],
  projectiles: [],
  particles: [],
  powerUps: {
    slowMo: { ready: true, cooldown: 0, active: false },
    scatterShot: { ready: true, cooldown: 0, active: false },
    xRay: { ready: true, cooldown: 0, active: false },
    shield: { ready: true, cooldown: 0, shieldHP: 0 },
    emp: { ready: true, cooldown: 0 }
  },
  waveTimer: 0,
  enemiesRemaining: 0,
  lastTime: Date.now()
};
```

### 6.2 Entity Classes

**Player Class:**
```javascript
class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.angle = 0; // turret rotation
    this.bodyAngle = 0; // tank body rotation
    this.vx = 0;
    this.vy = 0;
    this.speed = 150;
    this.hp = 100;
    this.maxHP = 100;
    this.fireRate = 500; // ms between shots
    this.lastShot = 0;
    this.damage = 25;
    this.radius = 20;
  }

  update(deltaTime) {
    // Movement physics
    // Health regeneration
    // Fire rate cooldown
  }

  draw(ctx) {
    // Draw tank body + turret + health bar
  }

  shoot() {
    // Create projectile
  }
}
```

**Enemy Class:**
```javascript
class Enemy {
  constructor(type, x, y, wave) {
    this.type = type; // 'spam', 'fakenews', 'deepfake', 'swarm', 'boss'
    this.x = x;
    this.y = y;
    this.hp = ENEMY_STATS[type].hp * (1 + wave * 0.05); // scaling
    this.maxHP = this.hp;
    this.speed = ENEMY_STATS[type].speed * (1 + wave * 0.03);
    this.damage = ENEMY_STATS[type].damage;
    this.score = ENEMY_STATS[type].score;
    this.coins = ENEMY_STATS[type].coins;
    this.angle = 0;
    this.active = true;
  }

  update(deltaTime, playerX, playerY) {
    // AI behavior based on type
  }

  draw(ctx) {
    // Render enemy visual
  }
}
```

**Projectile Class:**
```javascript
class Projectile {
  constructor(x, y, angle, damage, owner) {
    this.x = x;
    this.y = y;
    this.vx = Math.cos(angle) * 300;
    this.vy = Math.sin(angle) * 300;
    this.damage = damage;
    this.owner = owner; // 'player' or 'enemy'
    this.radius = 4;
    this.active = true;
    this.lifetime = 0;
    this.maxLifetime = 3000; // 3 seconds
  }

  update(deltaTime) {
    this.x += this.vx * deltaTime / 1000;
    this.y += this.vy * deltaTime / 1000;
    this.lifetime += deltaTime;
    if (this.lifetime > this.maxLifetime) this.active = false;
  }

  draw(ctx) {
    // Draw bullet with glow effect
  }
}
```

### 6.3 Wave Management

**Wave Spawner:**
```javascript
class WaveManager {
  constructor() {
    this.currentWave = 1;
    this.enemiesSpawned = 0;
    this.enemiesToSpawn = [];
    this.spawnTimer = 0;
    this.waveActive = false;
    this.transitionTimer = 0;
  }

  generateWave(wave) {
    const enemies = [];

    // Generate enemy list based on wave number
    if (wave % 5 === 0) {
      enemies.push({ type: 'boss', count: 1 });
    }

    // Add regular enemies based on wave
    // ...implementation

    return enemies;
  }

  update(deltaTime) {
    if (!this.waveActive && this.transitionTimer <= 0) {
      this.startWave();
    }

    // Spawn enemies at intervals
    // ...implementation
  }
}
```

### 6.4 Power-Up Implementation

**Power-Up Manager:**
```javascript
function activatePowerUp(type) {
  const powerUp = gameState.powerUps[type];

  if (!powerUp.ready) return; // On cooldown

  powerUp.ready = false;
  powerUp.active = true;

  switch(type) {
    case 'slowMo':
      gameState.timeScale = 0.25;
      setTimeout(() => {
        gameState.timeScale = 1.0;
        powerUp.active = false;
        startCooldown(type, 45000);
      }, 10000);
      break;

    case 'scatterShot':
      gameState.player.scatterShot = true;
      setTimeout(() => {
        gameState.player.scatterShot = false;
        powerUp.active = false;
        startCooldown(type, 30000);
      }, 8000);
      break;

    // ...other power-ups
  }

  // Visual feedback
  showPowerUpActivation(type);
}

function startCooldown(type, duration) {
  const powerUp = gameState.powerUps[type];
  powerUp.cooldown = duration;

  const interval = setInterval(() => {
    powerUp.cooldown -= 100;
    if (powerUp.cooldown <= 0) {
      powerUp.ready = true;
      clearInterval(interval);
    }
  }, 100);
}
```

### 6.5 Collision Detection

**Spatial Partitioning (for performance):**
```javascript
class SpatialGrid {
  constructor(width, height, cellSize) {
    this.cellSize = cellSize;
    this.cols = Math.ceil(width / cellSize);
    this.rows = Math.ceil(height / cellSize);
    this.grid = [];
  }

  clear() {
    this.grid = Array(this.cols * this.rows).fill(null).map(() => []);
  }

  insert(entity) {
    const cellX = Math.floor(entity.x / this.cellSize);
    const cellY = Math.floor(entity.y / this.cellSize);
    const index = cellY * this.cols + cellX;
    if (this.grid[index]) this.grid[index].push(entity);
  }

  getNearby(entity, radius) {
    // Return only entities in nearby cells
    // Massive performance boost over checking every entity
  }
}
```

**Collision Check:**
```javascript
function checkCollisions() {
  // Projectile vs Enemy
  gameState.projectiles.forEach(proj => {
    if (proj.owner !== 'player') return;

    const nearby = spatialGrid.getNearby(proj, 50);
    nearby.forEach(enemy => {
      if (circleCollision(proj, enemy)) {
        enemy.hp -= proj.damage;
        proj.active = false;

        if (enemy.hp <= 0) {
          killEnemy(enemy);
        }
      }
    });
  });

  // Enemy vs Player
  gameState.enemies.forEach(enemy => {
    if (circleCollision(enemy, gameState.player)) {
      gameState.player.hp -= enemy.damage;
      enemy.active = false;
      createExplosion(enemy.x, enemy.y);
    }
  });
}
```

### 6.6 Input Handling

**Desktop (Keyboard + Mouse):**
```javascript
const keys = {};

document.addEventListener('keydown', (e) => {
  keys[e.key] = true;

  // Power-up hotkeys
  if (e.key >= '1' && e.key <= '5') {
    const powerUpIndex = parseInt(e.key) - 1;
    const powerUpTypes = ['slowMo', 'scatterShot', 'xRay', 'shield', 'emp'];
    activatePowerUp(powerUpTypes[powerUpIndex]);
  }
});

document.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  // Calculate angle from player to mouse
  const dx = mouseX - gameState.player.x;
  const dy = mouseY - gameState.player.y;
  gameState.player.angle = Math.atan2(dy, dx);
});

canvas.addEventListener('click', () => {
  gameState.player.shoot();
});
```

**Mobile (Touch):**
```javascript
// Virtual joystick for movement
const joystick = new VirtualJoystick({
  container: document.getElementById('joystickZone'),
  mouseSupport: false,
  position: { left: '20px', bottom: '100px' }
});

// Auto-aim at nearest enemy
function updateAutoAim() {
  if (!gameState.enemies.length) return;

  let nearest = null;
  let minDist = Infinity;

  gameState.enemies.forEach(enemy => {
    const dist = distance(gameState.player, enemy);
    if (dist < minDist) {
      minDist = dist;
      nearest = enemy;
    }
  });

  if (nearest) {
    const dx = nearest.x - gameState.player.x;
    const dy = nearest.y - gameState.player.y;
    gameState.player.angle = Math.atan2(dy, dx);

    // Auto-fire if within range
    if (minDist < 300 && Date.now() - gameState.player.lastShot > gameState.player.fireRate) {
      gameState.player.shoot();
    }
  }
}
```

### 6.7 Supabase Integration

**Coin Rewards:**
```javascript
async function endGame() {
  gameState.running = false;

  // Calculate final rewards
  const grade = calculateGrade(gameState.score);
  const totalCoins = calculateCoins(gameState);

  // Award coins atomically
  if (user && userProgression) {
    const { data, error } = await supabase.rpc('award_coins_atomic', {
      p_user_id: user.id,
      p_amount: totalCoins
    });

    if (!error) {
      userProgression.truth_coins = data[0].truth_coins;
      updateCoinsDisplay();
    }
  }

  // Show game over screen
  showGameOver({
    wave: gameState.wave,
    score: gameState.score,
    grade: grade,
    coins: totalCoins
  });
}
```

**Leaderboard Updates:**
```javascript
async function submitHighScore() {
  if (!user) return;

  const { data, error } = await supabase
    .from('tank_shooter_scores')
    .insert({
      user_id: user.id,
      score: gameState.score,
      wave: gameState.wave,
      enemies_killed: gameState.enemiesKilled,
      grade: gameState.grade,
      timestamp: new Date().toISOString()
    });

  // Refresh leaderboard
  loadTankShooterLeaderboard();
}
```

---

## 7. Development Phases

### Phase 1: Core Prototype (Current Sprint)
**Goal:** Playable single-player game with basic mechanics

**Tasks:**
- [x] Design document complete
- [ ] Implement Player class with movement + shooting
- [ ] Implement Enemy class (Spam Bot only)
- [ ] Wave spawning system (waves 1-5)
- [ ] Basic collision detection
- [ ] Health system + game over
- [ ] Coin rewards integration
- [ ] UI: HUD, game over screen
- [ ] Mobile touch controls (joystick)

**Deliverables:**
- Working prototype playable on mobile + desktop
- Waves 1-5 functional
- Coin rewards persist to database

**Timeline:** 1-2 days

### Phase 2: Enemy Variety & Power-Ups
**Goal:** Full enemy roster + all 5 power-ups

**Tasks:**
- [ ] Implement Fake News Drone AI
- [ ] Implement Deepfake Tank AI (with shooting)
- [ ] Implement Bot Swarm spawning
- [ ] Implement Boss enemy (multi-phase)
- [ ] All 5 power-ups functional
- [ ] Power-up cooldown UI indicators
- [ ] Wave 10+ balancing
- [ ] Particle effects polish

**Deliverables:**
- All enemy types playable
- All power-ups working
- Waves scale to 20+

**Timeline:** 2-3 days

### Phase 3: Polish & Optimization
**Goal:** Production-ready quality

**Tasks:**
- [ ] Performance optimization (60 FPS on mobile)
- [ ] Visual effects (explosions, screen shake, muzzle flash)
- [ ] Sound effects (shooting, explosions, power-ups)
- [ ] Tutorial overlay for first-time players
- [ ] Achievement integration (badges)
- [ ] Leaderboard for tank shooter mode
- [ ] Mobile UX testing

**Deliverables:**
- Smooth 60 FPS gameplay
- Professional visual polish
- Tutorial complete

**Timeline:** 2-3 days

### Phase 4: Multiplayer Foundation
**Goal:** Squad co-op mode (turn-based)

**Tasks:**
- [ ] Friend system integration
- [ ] Squad invite/join UI
- [ ] Turn-based multiplayer logic
- [ ] Shared wave progression
- [ ] Individual coin tracking
- [ ] Revive mechanic
- [ ] Squad leaderboard

**Deliverables:**
- 2-4 player squad mode functional
- Turn-based implementation working

**Timeline:** 4-5 days

### Phase 5: Real-Time Multiplayer (Future)
**Goal:** Live 2v2 competitive mode

**Tasks:**
- [ ] WebSocket server setup
- [ ] Real-time state synchronization
- [ ] Matchmaking system
- [ ] Ranked mode
- [ ] Anti-cheat validation
- [ ] Spectator mode

**Timeline:** 1-2 weeks (separate project)

---

## 8. Success Metrics

### Engagement Metrics
- **Daily Active Users (DAU):** Target 50+ players/day
- **Average Session Length:** Target 8+ minutes
- **Retention (Day 7):** Target 40%+
- **Games Played per User:** Target 3+ per session

### Game Balance Metrics
- **Average Waves Reached:** Target 7-10 waves (balanced difficulty)
- **Power-Up Usage Rate:** Target 80%+ players use power-ups
- **Boss Kill Rate:** Target 60% players defeat first boss (wave 5)
- **Mobile vs Desktop Performance:** Both platforms should have similar clear rates

### Monetization (if applicable)
- **Coin Earning Rate:** 150-300 coins per session (balanced for shop)
- **Power-Up Purchase Rate (future):** Track if players buy permanent upgrades

### Technical Metrics
- **Frame Rate:** 60 FPS on 90%+ devices
- **Load Time:** < 2 seconds to game start
- **Crash Rate:** < 0.5% of sessions
- **API Response Time:** < 500ms for coin awards

---

## 9. Testing Plan

### Unit Testing
- Player movement boundaries (doesn't move off-screen)
- Shooting mechanics (fire rate, accuracy)
- Enemy AI pathfinding (reaches player)
- Collision detection accuracy
- Power-up activation/cooldown

### Integration Testing
- Coin reward calculation correctness
- Supabase RPC calls (no race conditions)
- Leaderboard updates
- Session persistence (reload page)

### User Testing
- Mobile usability (virtual joystick comfortable?)
- Desktop controls intuitive (WASD + mouse)
- Difficulty curve appropriate (not too hard/easy)
- Tutorial clarity
- Power-up discoverability

### Performance Testing
- 60 FPS with 50+ enemies on screen
- No memory leaks (long sessions)
- Canvas rendering optimization
- Mobile battery impact

### Browser Testing
- Chrome Mobile (Android)
- Safari Mobile (iOS)
- Chrome Desktop
- Firefox Desktop
- Edge Desktop

---

## 10. Known Risks & Mitigations

### Risk 1: Performance on Low-End Devices
**Probability:** Medium
**Impact:** High (poor UX)
**Mitigation:**
- Implement quality settings (low/medium/high)
- Reduce particle count on mobile
- Cap enemy count at 50 max
- Use object pooling for entities

### Risk 2: Multiplayer Complexity
**Probability:** High
**Impact:** High (delays feature)
**Mitigation:**
- Phase 1-3 focus on single-player only
- Turn-based multiplayer easier than real-time
- Use Supabase Realtime for simple state sync before building WebSocket server

### Risk 3: Touch Controls Difficult
**Probability:** Medium
**Impact:** High (mobile = primary platform)
**Mitigation:**
- Extensive user testing on mobile
- Auto-aim option for casual players
- Large touch targets (60px+)
- Tutorial specifically for touch controls

### Risk 4: Balancing Difficulty
**Probability:** High
**Impact:** Medium (player frustration or boredom)
**Mitigation:**
- Playtesting with 10+ users
- Analytics on average wave reached
- Adjustable difficulty curve via config
- Easy/Normal/Hard mode selection

### Risk 5: Integration with Existing System
**Probability:** Low
**Impact:** Medium (data inconsistency)
**Mitigation:**
- Use same coin system as Truth Cannon
- Reuse `userProgression` table
- Atomic RPC calls prevent race conditions
- Test with existing users

---

## 11. Future Enhancements

### Cosmetics Shop (Post-Launch)
- Tank skins (color variants, patterns)
- Turret designs (modern, retro, cyber)
- Projectile trails (fire, ice, electric)
- Explosion effects (confetti, stars)
- Purchase with coins earned in-game

### Daily Challenges
- "Kill 100 enemies in one session"
- "Reach wave 15 without using power-ups"
- "Don't take damage for 5 waves"
- Rewards: Bonus coins, exclusive badges

### Endless Mode
- No game over, just survive as long as possible
- Leaderboard by time survived
- Escalating difficulty (no cap)

### Story Campaign
- 20 missions with unique objectives
- Boss battles with lore
- Unlockable tanks/weapons
- Cutscenes (simple text + images)

### Clan System
- Create/join clans with friends
- Clan leaderboards
- Clan vs Clan tournaments
- Shared clan cosmetics

---

## 12. Conclusion

The Tank Wave Shooter is designed to be a significant upgrade from Truth Cannon, offering:
- **More engaging gameplay** (top-down shooter vs physics puzzle)
- **Strategic depth** (5 power-ups, enemy variety)
- **Progression system** (coins, unlocks, leaderboard)
- **Multiplayer potential** (squads, 2v2)
- **Mobile-first design** (optimized controls, performance)

**Immediate Next Steps:**
1. Implement Phase 1 prototype (core gameplay)
2. Test on mobile + desktop
3. Integrate with existing coin/progression system
4. Gather user feedback
5. Iterate on Phase 2 (enemy variety + power-ups)

**Success Criteria:**
- Users prefer tank shooter over Truth Cannon (engagement metrics)
- Average session length increases by 50%+
- 80%+ players complete tutorial and play 3+ games

---

**Built with ❤️ to fight AI misinformation... with tanks!**
