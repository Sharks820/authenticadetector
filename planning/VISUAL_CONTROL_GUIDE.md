# Tank Game - Visual Control Guide

## 📱 Mobile Layout

```
┌─────────────────────────────────────────┐
│  WAVE: 5    SCORE: 12,500    HP: 85%   │  ← Game Header
├─────────────────────────────────────────┤
│                                         │
│        🤖  📷  🤖                       │
│                                         │
│           📷    🤖                      │
│                                         │
│                        📷               │
│                                         │
│                  🔵                     │  ← Projectile
│                                         │
│                                         │
│                                         │
│                                         │
│                  🛡️                      │  ← Tank (moves with joystick)
│                                         │
│   ┌─────┐                      ┌────┐  │
│   │  🕹️  │                      │ 🔥 │  │  ← Joystick + Fire Button
│   └─────┘                      └────┘  │
│   (move)                        (fire) │
├─────────────────────────────────────────┤
│ ⏰ Slow  💥 Scatter  👁️ X-Ray  🛡️ Shield│  ← Power-ups (future)
└─────────────────────────────────────────┘
```

### Mobile Control Layout Specs
- **Joystick Zone:** 120x120px @ bottom-left (20px, 80px margins)
- **Fire Button:** 80x80px @ bottom-right (20px, 100px margins)
- **Spacing:** Minimum 200px between controls
- **Touch Targets:** All ≥ 44x44px (WCAG AA compliant)

---

## 🖥️ Desktop Layout

```
┌─────────────────────────────────────────┐
│  WAVE: 5    SCORE: 12,500    HP: 85%   │  ← Game Header
├─────────────────────────────────────────┤
│                                         │
│        🤖  📷  🤖                       │
│                                         │
│           📷    🤖         🖱️ (mouse)   │  ← Mouse cursor aims
│                                         │
│                        📷               │
│                                         │
│                  🔵                     │  ← Projectile
│                  ↑                      │
│                  │                      │
│                🛡️                       │  ← Tank (WASD/Arrows)
│                ↖│↗                     │
│                  │                      │
│                                         │
├─────────────────────────────────────────┤
│ ⏰ Slow  💥 Scatter  👁️ X-Ray  🛡️ Shield│  ← Power-ups (future)
└─────────────────────────────────────────┘

Keyboard:
  W              ↑
A S D    or   ← ↓ →   (move tank)

Space or Click = Fire
```

---

## 🎮 Control Comparison

### Mobile Controls
```
┌────────────────────┐
│   MOBILE MODE      │
├────────────────────┤
│                    │
│  🕹️ Joystick       │
│  ↙️↓️↘️↔️↖️↑️↗️        │
│  8-direction       │
│  movement          │
│                    │
│  🔥 Fire Button    │
│  Dedicated tap     │
│  80x80px           │
│  Thumb-friendly    │
│                    │
│  ✋ Touch Screen   │
│  Alternative tap   │
│  anywhere to fire  │
│                    │
│  📳 Haptic         │
│  30ms on fire      │
│  50ms on hit       │
└────────────────────┘
```

### Desktop Controls
```
┌────────────────────┐
│  DESKTOP MODE      │
├────────────────────┤
│                    │
│  ⌨️ WASD Keys       │
│  8-direction       │
│  Digital input     │
│                    │
│  ⬆️ Arrow Keys      │
│  Alternative       │
│  Same as WASD      │
│                    │
│  🖱️ Mouse Aim       │
│  360° continuous   │
│  Real-time track   │
│                    │
│  🖱️ Click = Fire   │
│  Left click        │
│  anywhere          │
│                    │
│  ⌨️ Space = Fire   │
│  Alternative       │
│  Keyboard only     │
└────────────────────┘
```

---

## 🕹️ Joystick Visual States

### Idle State
```
    ┌─────────────┐
    │             │
    │   ⚪ ← knob │
    │      (centered)
    │             │
    └─────────────┘
    Base circle
```

### Active State (Moving Up-Right)
```
    ┌─────────────┐
    │      ⚪ ← knob (moved)
    │        ↗️   │
    │   ●         │
    │   └─center  │
    └─────────────┘
    Tank moves ↗️
```

### Maximum Deflection
```
    ┌─────────────┐
    │          ⚪  │ ← Knob at edge
    │             │    (constrained to
    │   ●         │     base radius)
    │   └─center  │
    └─────────────┘
    Full speed →
```

### Dead Zone
```
    ┌─────────────┐
    │   ┌───┐     │
    │   │ ⚪ │← small movement
    │   └───┘     │    (ignored, <15%)
    │   ● center  │
    └─────────────┘
    Tank stays still
```

---

## 🔥 Fire Button Visual States

### Normal State
```
    ┌────────┐
    │        │
    │   🔥   │  80x80px
    │        │  Gradient BG
    └────────┘  White border
```

### Pressed State
```
    ┌──────┐
    │      │
    │  🔥  │  72x72px (scaled 0.9)
    │      │  Darker gradient
    └──────┘  Pressed effect
```

### Cooldown State (Future)
```
    ┌────────┐
    │ ▓▓▓░░░ │ ← Progress fill
    │   🔥   │
    │ 0.8s   │ ← Countdown
    └────────┘
```

---

## 🎯 Cannon Aiming Visual

### Slingshot Mode (Mobile/Desktop Fallback)
```
    Pull back direction:
         ⬇️
         │
         │ (pull here)
         •

         🛡️ ← Tank
         │
         │ (fires opposite)
         ⬆️

    Fires upward
```

### Mouse Aim Mode (Desktop)
```
    Mouse position:
              🖱️ (cursor)
             ↗️
            /
           /
          🛡️ ← Tank (cannon points to mouse)

    Cannon rotates to track cursor
```

### Keyboard + Mouse Mode (Desktop)
```
    WASD movement:     Mouse aim:
         ↑                  🖱️
         │                 ↗️
    ← 🛡️ →              🛡️
         │
         ↓

    Move with keyboard,
    Aim with mouse,
    Fire with click/space
```

---

## 📐 Collision Detection Zones

### Projectile vs Enemy
```
    Enemy (radius 20px):
         ┌────┐
         │ 🤖 │
         └────┘

    Projectile (radius 8px):
           •

    Detection:
         ┌────┐
         │ 🤖 │ ← Enemy radius
         └────┘
           ↓
           • ← Projectile radius

    Combined radius = 28px
    Hit if distance < 28px
    (Uses squared distance for speed)
```

### Tank Movement Bounds
```
    Canvas:
    ┌─────────────────────────────────┐
    │ 30px margin                     │
    │    ╔═══════════════════════╗   │
    │    ║                       ║   │
    │    ║   🛡️ ← Tank           ║   │
    │    ║   (stays in bounds)   ║   │
    │    ║                       ║   │
    │    ╚═══════════════════════╝   │
    │                         30px    │
    └─────────────────────────────────┘

    Tank X: max(30, min(width-30, tankX))
    Tank Y: max(30, min(height-30, tankY))
```

---

## 🎨 Control Hints Overlay

### Mobile Hints Display
```
┌──────────────────────────────────┐
│                                  │
│  ┌────────────────────────────┐ │
│  │   📱 MOBILE CONTROLS       │ │
│  │                            │ │
│  │  🕹️ Left Joystick - Move  │ │
│  │  🔥 Fire Button - Shoot   │ │
│  │  👆 Tap Screen - Fire     │ │
│  │                            │ │
│  │  Hint: Use thumb for      │ │
│  │  joystick, index for fire!│ │
│  └────────────────────────────┘ │
│          (fades after 5s)        │
│                                  │
└──────────────────────────────────┘
```

### Desktop Hints Display
```
┌──────────────────────────────────┐
│                                  │
│  ┌────────────────────────────┐ │
│  │   ⌨️ DESKTOP CONTROLS      │ │
│  │                            │ │
│  │  WASD / Arrows - Move     │ │
│  │  Mouse - Aim Cannon       │ │
│  │  Click / Space - Fire     │ │
│  │                            │ │
│  │  Tip: Move while aiming   │ │
│  │  for best results!        │ │
│  └────────────────────────────┘ │
│          (fades after 5s)        │
│                                  │
└──────────────────────────────────┘
```

---

## 📱 Responsive Breakpoints

### Phone Portrait (< 480px)
```
┌──────┐
│Header│ 60px
├──────┤
│      │
│Game  │ Remaining
│Area  │ height
│      │
├──────┤
│Power │ 60px
│ -ups │
└──────┘

Joystick: 100x100px (smaller)
Fire: 70x70px (smaller)
```

### Tablet Landscape (768px - 1024px)
```
┌────────────────┐
│    Header      │ 60px
├────────────────┤
│                │
│   Game Area    │ Optimized
│                │ aspect
│                │
├────────────────┤
│   Power-ups    │ 60px
└────────────────┘

Joystick: 120x120px (full size)
Fire: 80x80px (full size)
```

### Desktop (> 1024px)
```
┌────────────────────────┐
│       Header           │ 60px
├────────────────────────┤
│                        │
│      Game Area         │ 16:9 or
│                        │ fill
│                        │
├────────────────────────┤
│      Power-ups         │ 60px
└────────────────────────┘

No mobile controls shown
Keyboard + Mouse only
```

---

## 🎯 Movement Speed Comparison

### Tank Speed: 4 pixels/frame @ 60fps
```
1 frame:  ████░░░░░░ (4px)
5 frames: ████████████████████░░░░░░ (20px)
10 frames: ████████████████████████████████████████░░ (40px)

Diagonal: 2.83 px/frame (normalized)
          ═══░░░░░░

Full screen (1080px):
Time to cross: 1080 / 4 / 60 = 4.5 seconds
```

### Joystick Strength Multiplier
```
Center (0%):        ░░░░░░░░░░ (0 speed)
Dead zone (15%):    ░░░░░░░░░░ (0 speed)
Half deflection:    █████░░░░░ (2 px/frame)
Full deflection:    ██████████ (4 px/frame)

Smooth acceleration based on joystick distance
```

---

## 🔊 Audio/Haptic Feedback (Future Enhancement)

### Haptic Patterns
```
Fire:       ─┐   30ms pulse

Hit Enemy:  ─┐─┐─┐   [30ms, 50ms, 30ms]

Damage:     ────┐   100ms long

Power-up:   ─┐ ─┐ ─┐   [20ms, 20ms, 20ms]

Game Over:  ────────┐   200ms strong
```

### Sound Effects (Not Implemented)
```
Fire:       "pew.mp3"     (laser sound)
Hit:        "boom.mp3"    (explosion)
Damage:     "hurt.mp3"    (alert tone)
Power-up:   "pickup.mp3"  (chime)
Game Over:  "fail.mp3"    (sad horn)
```

---

## ✅ Accessibility Features

### Touch Target Sizes (WCAG AA)
```
Minimum Required: 44x44 px
                 ┌────────┐
                 │  44px  │ ✅
                 │        │
                 │  44px  │
                 └────────┘

Fire Button:     80x80 px
                 ┌──────────┐
                 │   80px   │ ✅✅
                 │          │
                 │   80px   │
                 └──────────┘

Joystick Base:   120x120 px
                 ┌──────────────┐
                 │    120px     │ ✅✅✅
                 │              │
                 │    120px     │
                 └──────────────┘
```

### Keyboard-Only Navigation
```
Tab order:
1. Game canvas (focus)
2. Power-up 1
3. Power-up 2
4. Power-up 3
5. Power-up 4
6. Power-up 5

Play with keyboard only:
✅ Move: WASD/Arrows
✅ Aim: Mouse (optional)
✅ Fire: Space
✅ Power-ups: 1-5 keys (future)
✅ Pause: ESC (future)
```

---

## 🎓 Quick Reference Card

### Mobile Quick Reference
```
╔═══════════════════════════╗
║   MOBILE CHEAT SHEET      ║
╠═══════════════════════════╣
║ Move:  🕹️ Left joystick   ║
║ Fire:  🔥 Right button    ║
║ Alt:   👆 Tap anywhere    ║
║                           ║
║ Tips:                     ║
║ • Thumb on joystick       ║
║ • Index on fire           ║
║ • Hold joystick for aim   ║
║ • Tap rapidly for spam    ║
╚═══════════════════════════╝
```

### Desktop Quick Reference
```
╔═══════════════════════════╗
║  DESKTOP CHEAT SHEET      ║
╠═══════════════════════════╣
║ Move:  WASD or ⬆️⬇️⬅️➡️    ║
║ Aim:   🖱️ Mouse cursor     ║
║ Fire:  Click or Space     ║
║                           ║
║ Tips:                     ║
║ • Strafe while shooting   ║
║ • Lead moving targets     ║
║ • Keep moving always      ║
║ • Use cover (future)      ║
╚═══════════════════════════╝
```

---

This visual guide provides ASCII diagrams and specifications for all control layouts and interactions in the enhanced tank game!
