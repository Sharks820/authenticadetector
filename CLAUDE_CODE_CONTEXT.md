# AuthenticaDetector - Project Context for Claude Code

**Last Updated:** December 17, 2024
**Current Version:** v12.0.0
**Status:** MVP Complete, Ready for Backend Configuration & Testing

---

## 🎯 QUICK START FOR CLAUDE CODE

Read this file first. It contains everything you need to continue development on AuthenticaDetector.

```bash
# Project location (if continuing from previous session)
cd /path/to/authenticadetector-v12

# Key files to understand the codebase:
# 1. index.html - Complete single-file PWA (HTML + CSS + JS, ~3200 lines)
# 2. supabase/schema.sql - Database schema
# 3. sw.js - Service worker for offline/share-target
# 4. manifest.json - PWA configuration
```

---

## 📋 PROJECT OVERVIEW

### What Is This?
AuthenticaDetector is an AI image detection app that helps users identify AI-generated images. Think "Shazam for fake images."

### Core Value Proposition
- AI generates 34 MILLION fake images daily
- Humans detect AI images only 48% of the time
- AuthenticaDetector aims for 90%+ accuracy using multi-signal analysis

### Target Users
- Social media users concerned about misinformation
- Journalists fact-checking images
- Anyone who wants to verify if an image is real or AI-generated

### Business Model (Planned)
- Free tier: Quick Scan (basic heuristics)
- Premium features: Deep Scan, Forensics Mode (requires free account)
- Gamification drives engagement and retention

---

## 🏗️ ARCHITECTURE

### Current Stack
```
Frontend: Single-file HTML/CSS/JS PWA
Backend: Supabase (PostgreSQL + Auth + RLS)
AI Model: Hugging Face Transformers.js (client-side)
Hosting: Cloudflare Pages (recommended)
```

### Why Single-File?
- Simplicity for rapid iteration
- No build step required
- Easy to deploy anywhere
- Can be converted to React/Vue later if needed

### File Structure
```
authenticadetector-v12/
├── index.html          # Complete app (3164 lines)
│   ├── <style>         # All CSS (~500 lines)
│   └── <script>        # All JS (~2600 lines)
├── sw.js               # Service worker
├── manifest.json       # PWA manifest
├── _headers            # Cloudflare security headers
├── _redirects          # SPA routing
├── icon-180.png        # Apple touch icon
├── icon-192.png        # Android icon
├── icon-512.png        # Large icon
├── supabase/
│   └── schema.sql      # Database schema
├── social-media/       # Marketing assets
└── README.md           # User documentation
```

---

## 🔍 DETECTION SYSTEM (CRITICAL TO UNDERSTAND)

### The Problem with Previous Versions
Old versions used `Xenova/vit-base-patch16-224` which is a **generic ImageNet classifier** (cats, dogs, cars) - NOT an AI detector! This caused unreliable results.

### Current Detection Architecture (v12)

#### Quick Scan (Guest Access, ~65% accuracy target)
```javascript
// 4 heuristic signals, weighted ensemble
noise * 0.30 + compression * 0.25 + color * 0.25 + edges * 0.20

// Calibration: Prevent false negatives
if (maxIndicator > 70) aiScore = Math.max(aiScore, maxIndicator * 0.75);

// Clamped to realistic range
aiScore = clamp(aiScore, 20, 80);
```

**Signals:**
1. **Noise Patterns** (`analyzeNoisePatterns`): AI images have unnaturally uniform noise
2. **Compression Artifacts** (`analyzeCompressionArtifacts`): AI upscalers create periodic patterns
3. **Color Distribution** (`analyzeColorDistribution`): AI has smoother histograms, fewer peaks
4. **Edge Coherence** (`analyzeEdgeCoherence`): AI edges are often too sharp or too smooth

#### Deep Scan (Login Required, ~90% accuracy target)
```javascript
// 6 signals including AI model
noise * 0.18 + compression * 0.15 + color * 0.15 + 
edges * 0.12 + frequency * 0.15 + modelScore * 0.25

// Agreement boosting
if (agreementCount >= 4) aiScore = Math.min(95, aiScore * 1.15);
```

**Additional Signals:**
5. **Frequency Domain** (`analyzeFrequencyDomain`): Unusual low/high frequency ratios
6. **Model Output** (`analyzeModelOutput`): Classification confidence patterns

#### Forensics Mode (Deep Scan + extras)
- Multi-crop analysis (5 regions)
- Stricter thresholds
- +5% boost when enabled

### Known Limitations
- Highly compressed images reduce accuracy
- Very small images (<100px) unreliable
- Screenshots of AI images harder to detect
- Model is generic classifier, not purpose-built AI detector

### Future Improvements Needed
1. **Train/use dedicated AI detector model** (biggest impact)
2. Add C2PA/metadata checking
3. Face-specific analysis (ears, teeth, hands)
4. GAN fingerprint detection
5. JPEG ghost analysis

---

## 🎮 GAMIFICATION SYSTEM

### Points
| Action | Points |
|--------|--------|
| Quick Scan | +1 |
| Deep Scan | +3 |
| Forensics Scan | +5 |
| AI Found | +5 bonus |

### Leaderboard Tiers
```javascript
const TIERS = {
    1: { name: 'KING', class: 'tier-king' },
    2: { name: 'VICEROY', class: 'tier-viceroy' },
    3: { name: 'ARCHDUKE', class: 'tier-archduke' },
    legend: { name: 'LEGEND', min: 4, max: 10 },
    elite: { name: 'ELITE', min: 11, max: 25 },
    veteran: { name: 'VETERAN', min: 26, max: 50 },
    rising: { name: 'RISING', min: 51, max: 100 }
};
```

### Badges (20 total)
- **Common (6)**: first_scan, ai_hunter, five_scans, ten_scans, first_deep, quick_five
- **Rare (5)**: twenty_five, ten_ai, streak_3, deep_ten, fifty_scans
- **Epic (5)**: hundred_scans, fifty_ai, streak_5, deep_fifty, forensics_first
- **Legendary (4)**: two_fifty, hundred_ai, streak_10, thousand

### Weekly Rewards (Planned)
- KING: Custom badge + Featured profile
- Top 3: Exclusive tier badges
- Top 10: 2x points next week

---

## 🔐 ACCESS CONTROL / GATING

```javascript
// Current gating logic
Guest: Quick Scan images only
Logged In: All features (Quick/Deep/Forensics, history, badges)

// Install is NOT required for Deep Scan (changed from v11)
// Rationale: PWA install is confusing, removes friction
```

---

## 💾 DATABASE SCHEMA

### Tables
```sql
profiles         -- User profile (display_name, avatar_url)
user_stats       -- Points, scan counts, streaks
scans            -- PRIVATE scan history (RLS enforced)
user_badges      -- Earned badges
badge_definitions -- Badge metadata
feedback         -- User feedback for model improvement
```

### Critical RLS Policies
```sql
-- Scans are PRIVATE - only owner can see
CREATE POLICY "Users can only view own scans" 
ON scans FOR SELECT USING (auth.uid() = user_id);

-- Stats are PUBLIC (for leaderboard)
CREATE POLICY "Stats viewable by everyone" 
ON user_stats FOR SELECT USING (true);
```

### Leaderboard View
```sql
CREATE VIEW leaderboard AS
SELECT p.id, p.display_name, p.avatar_url, s.total_scans, s.ai_found, s.points,
       ROW_NUMBER() OVER (ORDER BY s.points DESC) as rank
FROM profiles p JOIN user_stats s ON p.id = s.user_id
WHERE s.total_scans > 0
LIMIT 100;
```

---

## 🔧 CONFIGURATION

### Supabase Setup (REQUIRED)
```javascript
// In index.html, lines ~20-21:
const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';
```

### Local Fallback Mode
When Supabase is not configured, app uses localStorage:
- Users stored in `local_users`
- Stats in `stats_{userId}`
- History in `history_{userId}`
- Badges in `badges_{userId}`

---

## 📱 PWA vs NATIVE APP

### Current: PWA
**Pros:** Free, instant updates, works everywhere
**Cons:** iOS share-to-app broken, confusing install, no app store

### Recommended: Capacitor Native App
```bash
npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android
npx cap init AuthenticaDetector com.authenticadetector.app
npx cap add ios && npx cap add android
npx cap sync
```

**Cost:** $99/yr Apple + $25 one-time Google
**Benefits:** Full share-to-app, app store presence, push notifications

---

## 🐛 KNOWN ISSUES / TODOS

### High Priority
- [ ] Detection accuracy still needs improvement (need dedicated AI detector model)
- [ ] Need to test on real AI images from various generators
- [ ] Video detection disabled (future feature)
- [ ] Text detection disabled (future feature)

### Medium Priority
- [ ] Social media assets need PNG conversion (currently SVG)
- [ ] Need proper app icons designed
- [ ] Weekly challenges not implemented yet
- [ ] Push notifications not implemented

### Low Priority
- [ ] Dark/light theme toggle
- [ ] Multiple language support
- [ ] Export scan history
- [ ] API for developers

---

## 🚀 DEPLOYMENT CHECKLIST

1. [ ] Create Supabase project
2. [ ] Run `supabase/schema.sql` in SQL Editor
3. [ ] Copy Project URL and anon key to index.html
4. [ ] Enable Email auth in Supabase
5. [ ] Push to GitHub
6. [ ] Connect to Cloudflare Pages
7. [ ] Test all flows (install, auth, scan, leaderboard)
8. [ ] Register domain

---

## 💬 KEY DECISIONS MADE

### Why "AuthenticaDetector" not "Authentica"?
"Authentica" trademark claimed. AuthenticaDetector is the new name.

### Why remove install requirement for Deep Scan?
PWA install is confusing for users. Login-only gating reduces friction while still driving account creation.

### Why single-file architecture?
Rapid iteration, no build tools needed, easy deployment. Can refactor to components later.

### Why client-side AI model?
Privacy (images never leave device), no server costs, works offline after first load.

### Why Supabase over Firebase?
PostgreSQL > Firestore for relational data, Row Level Security built-in, generous free tier.

---

## 📞 QUICK REFERENCE

### Key Functions
```javascript
// Scan entry points
startScan('quick')  // Guest access
startScan('deep')   // Login required

// Analysis functions
runQuickScan()      // Heuristics only
runDeepScan()       // Heuristics + AI model

// Individual analyzers
analyzeNoisePatterns(img)
analyzeCompressionArtifacts(img)
analyzeColorDistribution(img)
analyzeEdgeCoherence(img)
analyzeFrequencyDomain(img)
analyzeModelOutput(results)

// Results
displayResults(result, mode)
generateExplainers(result)
```

### Key State Variables
```javascript
let user = null;           // Current user object
let isInstalled = false;   // PWA install state
let currentFile = null;    // Selected file
let currentDataUrl = null; // Base64 image data
let currentResult = null;  // Last scan result
let forensicsMode = false; // Forensics toggle
let aiDetector = null;     // Loaded AI model
```

### Key DOM IDs
```
#homeView, #historyView, #leaderboardView, #profileView, #loginView
#dropzone, #progressCard, #resultCard
#quickBtn, #deepBtn, #forensicsToggle
#statusBar, #installChip, #loginChip
```

---

## 🔄 VERSION HISTORY

| Version | Date | Key Changes |
|---------|------|-------------|
| v12 | Dec 17, 2024 | AuthenticaDetector rename, fixed scrolling, new detection system, 20 badges, social media package |
| v11 | Dec 17, 2024 | Leaderboard tiers, video scanning, share-to-app |
| v10 | Dec 17, 2024 | 12-point spec implementation |
| v9 | Dec 17, 2024 | Supabase migration, 36 badges, Deep Scan |
| v8 | Dec 17, 2024 | Backend migration started |

---

## ✅ WHEN RESUMING DEVELOPMENT

1. **Read this file first** - it's the source of truth
2. **Check index.html** - all app code is there
3. **Check supabase/schema.sql** - for database structure
4. **Ask user** what they want to work on next
5. **Common next steps:**
   - Improve detection accuracy
   - Add video detection
   - Convert to native app
   - Design proper branding/icons
   - Implement weekly challenges

---

## 📝 NOTES FOR CLAUDE CODE

- The user is building a startup product, prioritize shipping over perfection
- They want to match/beat Hive Moderation eventually (high bar)
- Cost-consciousness is important (free/cheap tools preferred)
- Mobile experience is priority (most users on phones)
- Gamification is key to retention
- User prefers comprehensive responses over back-and-forth

---

**End of Context Document**
