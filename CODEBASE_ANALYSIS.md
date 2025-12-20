# CODEBASE_ANALYSIS.md - AuthenticaDetector Complete Audit

## Executive Summary

AuthenticaDetector is a monolithic PWA with **4,490 lines** of code in a single `index.html` file. This analysis provides a complete inventory of all functions, CSS organization, and architectural patterns.

---

## File Structure Analysis

### Current State

| Category | File Count | Total Size |
|----------|------------|------------|
| HTML Files | 2 (index.html, backup) | 337KB |
| JavaScript Files | 6 | ~15KB |
| CSS Files | 0 (embedded) | N/A |
| SQL Files | 1 | 8KB |
| Markdown Files | 12 | ~90KB |
| Image Files | 3 | ~40KB |
| Config Files | 5 | ~5KB |

### Monolith Breakdown (index.html)

```
index.html (4,490 lines)
├── Lines 1-17:      HTML Head (meta tags, links)
├── Lines 18-757:    Embedded CSS (~740 lines)
│   ├── CSS Variables (lines 22-78)
│   ├── Base Styles (lines 89-137)
│   ├── View Styles (lines 139-232)
│   ├── Component Styles (lines 250-708)
│   └── Animations (lines 752-757)
├── Lines 758-1127:  HTML Body/Views (~370 lines)
│   ├── Home View (lines 761-920)
│   ├── History View (lines 922-932)
│   ├── Leaderboard View (lines 934-966)
│   ├── Profile View (lines 968-995)
│   ├── All Badges View (lines 997-1005)
│   ├── Login View (lines 1007-1035)
│   ├── Help View (lines 1037-1062)
│   ├── Shop View (lines 1064-1084)
│   ├── Quests View (lines 1086-1107)
│   └── Modals (lines 1109-1126)
└── Lines 1128-4490: JavaScript Module (~3,362 lines)
    ├── Imports & Config (lines 1128-1180)
    ├── State Variables (lines 1145-1175)
    ├── Self-Learning System (lines 1158-1244)
    ├── Constants (FACTS, BADGES, TIERS) (lines 1307-1381)
    ├── Helper Functions (lines 1383-1394)
    ├── PWA Install Logic (lines 1426-1459)
    ├── Auth System (lines 1487-1702)
    ├── File Handling (lines 1703-1735)
    ├── Scan Logic (lines 1736-2191)
    ├── Detection Algorithms (lines 2193-3052)
    ├── Results Display (lines 3065-3259)
    ├── Feedback System (lines 3261-3320)
    ├── History System (lines 3366-3461)
    ├── Leaderboard System (lines 3463-3571)
    ├── Profile System (lines 3573-3921)
    ├── Badges System (lines 3782-3886)
    ├── Game Mechanics (lines 4017-4487)
    └── Init (lines 3962-4015)
```

---

## Function Inventory

### Core Detection Functions (DO NOT MODIFY)

| Function | Lines | Purpose | Complexity |
|----------|-------|---------|------------|
| `runQuickScan()` | 1771-1876 | Fast heuristic-only analysis | Medium |
| `runDeepScan()` | 1880-2191 | Full AI model + heuristics ensemble | High |
| `loadProductionModels()` | 2193-2219 | Load HuggingFace models | Medium |
| `analyzeDeepfakeOutput()` | 2224-2262 | Process deepfake detector results | Medium |
| `analyzeCLIP()` | 2265-2300 | CLIP zero-shot classification | High |
| `detectGeneratorSignatures()` | 2302-2362 | Detect MJ/DALLE/SD fingerprints | Medium |
| `analyzeNoisePatterns()` | 2366-2495 | Multi-scale noise variance analysis | High |
| `analyzeCompressionArtifacts()` | 2497-2651 | DCT block & interpolation detection | High |
| `analyzeColorDistribution()` | 2653-2707 | Histogram peak analysis | Medium |
| `analyzeEdgeCoherence()` | 2709-2755 | Sobel edge detection | Medium |
| `analyzeFrequencyDomain()` | 2757-2794 | Frequency ratio analysis | Medium |
| `analyzeModelOutput()` | 2796-2826 | Model confidence distribution | Medium |
| `analyzeMultipleCrops()` | 2828-2878 | Multi-region forensics | Medium |
| `analyzeEXIFData()` | 2880-2947 | EXIF metadata extraction | Medium |
| `analyzeMetadata()` | 2950-3052 | File metadata analysis | Medium |

### Authentication Functions

| Function | Lines | Purpose |
|----------|-------|---------|
| `initSupabase()` | 1414-1423 | Initialize Supabase client |
| `loadUser()` | 1487-1501 | Load user session |
| `saveUser()` | 1502 | Persist user to localStorage |
| `updateUserUI()` | 1504-1520 | Update UI with user info |
| `loadUserStats()` | 1522-1544 | Load user statistics |
| `updateGating()` | 1546-1555 | Update feature gating based on auth |
| `openLogin()` | 1557-1561 | Open login view |
| `updateLoginUI()` | 1562-1583 | Toggle login/signup UI |
| `toggleLoginMode()` | 1584 | Switch between login/signup |
| `submitLogin()` | 1586-1658 | Handle login form submission |
| `forgotPassword()` | 1660-1688 | Handle password reset |
| `showLoginError()` | 1690 | Display login error |
| `continueAsGuest()` | 1691 | Skip login |
| `handleLoginLogout()` | 1693-1698 | Toggle login/logout |

### UI/Navigation Functions

| Function | Lines | Purpose |
|----------|-------|---------|
| `showView()` | 1390 | Display a view by ID |
| `closeView()` | 1391 | Return to home view |
| `toast()` | 1384-1389 | Show toast notification |
| `initLogos()` | 1397-1400 | Inject SVG logos |
| `initFacts()` | 1403 | Initialize fact rotation |
| `updateFact()` | 1404-1411 | Rotate AI fact display |
| `toggleExplainers()` | 3242-3245 | Toggle detection explainer panel |
| `toggleAllModules()` | 3247-3259 | Toggle all modules panel |
| `toggleAdvanced()` | 3358-3361 | Toggle advanced settings |
| `toggleHelp()` | 3925-3930 | Toggle help section accordion |

### File Handling Functions

| Function | Lines | Purpose |
|----------|-------|---------|
| `triggerFileInput()` | 1704 | Open file picker |
| `handleFileSelect()` | 1705 | Handle file selection event |
| `processFile()` | 1707-1725 | Validate and load image file |
| `handleShareTarget()` | 3933-3938 | Handle PWA share target |

### Scan Control Functions

| Function | Lines | Purpose |
|----------|-------|---------|
| `startScan()` | 1737-1744 | Initiate scan with auth check |
| `runAnalysis()` | 1746-1768 | Execute scan workflow |
| `updateProgress()` | 3054-3057 | Update progress bar |
| `cancelScan()` | 3059-3063 | Cancel in-progress scan |
| `displayResults()` | 3066-3112 | Render scan results |
| `generateExplainers()` | 3114-3240 | Generate detection explainer HTML |
| `newScan()` | 3345-3355 | Reset for new scan |

### Feedback & Learning Functions

| Function | Lines | Purpose |
|----------|-------|---------|
| `submitFeedback()` | 3262-3320 | Submit user feedback |
| `loadAdaptiveWeights()` | 1177-1188 | Load self-learning weights |
| `saveAdaptiveWeights()` | 1190-1198 | Save self-learning weights |
| `updateWeightsFromFeedback()` | 1200-1243 | Update weights based on feedback |

### History Functions

| Function | Lines | Purpose |
|----------|-------|---------|
| `saveToHistory()` | 3367-3404 | Save scan to history |
| `loadHistory()` | 3406-3458 | Load user history |
| `openHistory()` | 3461 | Open history view |

### Leaderboard Functions

| Function | Lines | Purpose |
|----------|-------|---------|
| `loadLeaderboard()` | 3464-3509 | Load leaderboard data |
| `renderLeaderboard()` | 3511-3569 | Render leaderboard UI |
| `openLeaderboard()` | 3571 | Open leaderboard view |
| `viewPublicProfile()` | 3574-3652 | View user public profile |
| `closePublicProfile()` | 3654 | Close profile modal |
| `getTier()` | 1372-1381 | Get tier from rank |

### Stats & Badges Functions

| Function | Lines | Purpose |
|----------|-------|---------|
| `updateUserStatsAfterScan()` | 3657-3781 | Update stats after scan |
| `checkBadges()` | 3783-3824 | Check for new badge unlocks |
| `renderBadgesPreview()` | 3826-3850 | Render badge preview |
| `openAllBadges()` | 3852 | Open all badges view |
| `renderAllBadges()` | 3854-3886 | Render all badges |

### Profile Functions

| Function | Lines | Purpose |
|----------|-------|---------|
| `openProfile()` | 3889-3893 | Open profile view |
| `changeProfilePic()` | 3895-3898 | Trigger profile pic upload |
| `handleProfilePic()` | 3900-3921 | Process profile pic upload |

### PWA Functions

| Function | Lines | Purpose |
|----------|-------|---------|
| `checkInstallState()` | 1436-1444 | Check if app is installed |
| `promptInstall()` | 1445-1458 | Prompt PWA install |
| `dismissIosHelper()` | 1458 | Dismiss iOS install helper |
| `updateStatusBar()` | 1461-1484 | Update install/login status |

### Share Functions

| Function | Lines | Purpose |
|----------|-------|---------|
| `shareResult()` | 3323-3337 | Share scan result |
| `copyToClipboard()` | 3339-3343 | Copy text to clipboard |

### Game Mechanics Functions

| Function | Lines | Purpose |
|----------|-------|---------|
| `initGameMechanics()` | 4067-4072 | Initialize game systems |
| `loadGameState()` | 4074-4083 | Load game state from storage |
| `saveGameState()` | 4085-4087 | Save game state |
| `checkQuestReset()` | 4089-4104 | Check if quests need reset |
| `generateDailyQuests()` | 4106-4120 | Generate daily quests |
| `generateWeeklyQuests()` | 4122-4125 | Generate weekly quests |
| `updateQuestTimer()` | 4127-4142 | Update quest countdown |
| `updateQuestProgress()` | 4144-4178 | Update quest progress |
| `awardQuestReward()` | 4180-4191 | Award quest rewards |
| `updateQuestBadge()` | 4193-4208 | Update quest badge count |
| `openShop()` | 4211-4214 | Open shop view |
| `loadShop()` | 4216-4220 | Load shop data |
| `renderShopItems()` | 4222-4241 | Render shop items |
| `renderInventory()` | 4243-4262 | Render inventory |
| `updateShopPoints()` | 4264-4270 | Update points display |
| `filterShop()` | 4272-4289 | Filter shop by category |
| `purchaseItem()` | 4291-4333 | Purchase shop item |
| `addToInventory()` | 4335-4352 | Add item to inventory |
| `useItem()` | 4354-4385 | Use inventory item |
| `applyItemEffects()` | 4387-4394 | Apply active item effects |
| `hasActiveItem()` | 4396-4398 | Check if item is active |
| `openQuests()` | 4401-4404 | Open quests view |
| `loadQuests()` | 4406-4409 | Load quests data |
| `renderQuests()` | 4411-4414 | Render quests UI |
| `renderQuestList()` | 4416-4444 | Render quest list |
| `updateQuestStreak()` | 4446-4455 | Update streak display |

### Initialization

| Function | Lines | Purpose |
|----------|-------|---------|
| `init()` | 3963-4015 | Main initialization |

---

## CSS Organization Analysis

### Current Structure (Embedded in index.html)

| Section | Lines | Purpose |
|---------|-------|---------|
| CSS Variables | 22-78 | Theme colors, spacing, shadows |
| Reset & Base | 89-137 | Reset styles, body, html |
| Views | 139-232 | View containers, headers |
| Status Bar | 183-197 | Install/login status chips |
| Banners | 198-232 | Install banner, iOS helper |
| Facts Panel | 233-249 | AI facts display |
| Upload | 250-294 | Dropzone, file input |
| Progress | 328-348 | Scan progress card |
| Results | 349-476 | Result display, explainers |
| Toast | 477-488 | Toast notifications |
| Profile | 489-548 | Profile header, stats |
| Badges | 513-536 | Badge display |
| Menu | 537-548 | Menu items |
| History | 549-565 | History items |
| Leaderboard | 566-644 | Podium, rankings |
| Rewards | 630-644 | Rewards display |
| Login | 646-678 | Login form |
| Modals | 680-694 | Modal overlay |
| Help | 695-706 | Help accordion |
| Shop & Game | 709-751 | Shop, quests, inventory |
| Animations | 752-757 | Keyframe animations |

### CSS Metrics

- **Total CSS Lines:** ~740
- **CSS Variables:** 40+
- **Unique Classes:** ~150
- **Media Queries:** 0 (responsive via CSS variables)
- **Keyframe Animations:** 3

### CSS Issues Identified

1. **No Separation:** All CSS in one `<style>` block
2. **No Build Process:** No minification, no autoprefixer
3. **Limited Reusability:** Some repeated patterns
4. **No CSS Modules:** Global namespace pollution risk
5. **No Dark/Light Toggle:** Single theme only

---

## JavaScript Organization Analysis

### Current Module Structure

```
ES Module (single script type="module")
├── External Import
│   └── @huggingface/transformers (pipeline, env)
├── External CDN
│   └── @supabase/supabase-js (loaded via script tag)
├── Global State (window assignments)
└── Local Functions (closure-based)
```

### JavaScript Metrics

- **Total JS Lines:** ~3,363
- **Functions:** ~100+
- **State Variables:** ~25
- **Constants:** 5 major objects (FACTS, BADGES, TIERS, SHOP_ITEMS, QUEST_TEMPLATES)
- **Event Listeners:** 10+
- **window.* Exports:** ~50

### JavaScript Issues Identified

1. **Single Module:** All code in one `<script type="module">` block
2. **No Build System:** No bundling, no tree-shaking
3. **Global Pollution:** Heavy use of `window.*` for function exports
4. **No TypeScript:** No type safety
5. **Mixed Concerns:** UI, business logic, and data access interleaved
6. **No Error Boundaries:** Limited error handling
7. **Sync Storage:** Blocks main thread for localStorage operations

---

## Dependency Analysis

### External CDN Dependencies

| Package | Version | Size | Purpose |
|---------|---------|------|---------|
| @supabase/supabase-js | 2.x | ~100KB | Auth, DB |
| @huggingface/transformers | 3.0.0 | ~50KB | AI models |
| Google Fonts (Inter) | N/A | ~20KB | Typography |

### Model Dependencies (Loaded at Runtime)

| Model | Source | Size | Purpose |
|-------|--------|------|---------|
| Xenova/vit-base-patch16-224 | HuggingFace | ~87MB | Deepfake detection |
| Xenova/clip-vit-base-patch32 | HuggingFace | ~350MB | CLIP analysis |

---

## Identified Issues Summary

### Critical (Must Fix Before Reorganization)

1. **No Test Coverage:** Zero automated tests
2. **No Build System:** Can't optimize or validate changes
3. **Single File Architecture:** All code in index.html

### Major (Should Address During Reorganization)

1. **No Separation of Concerns:** UI, logic, data mixed
2. **No Dependency Management:** No package.json
3. **No Linting/Formatting:** No eslint, prettier
4. **No Git Hooks:** No pre-commit validation

### Minor (Nice to Have)

1. **No CSS Variables for All Values:** Some hardcoded
2. **No Loading States for All Actions:** Some UX gaps
3. **Console.log Statements:** Should use proper logging

---

## Recommendations Summary

### Phase 1: Tooling (Before Any Code Moves)

1. Add `package.json` with dev dependencies
2. Add ESLint + Prettier configuration
3. Add basic testing framework
4. Set up pre-commit hooks

### Phase 2: Documentation

1. Document all public functions
2. Add JSDoc comments
3. Create API documentation

### Phase 3: Extraction (After PM Approval)

1. Extract CSS to separate files
2. Extract JavaScript to modules
3. Implement build system
4. Add automated tests

---

*Analysis Date: December 20, 2025*
*Analyst: Repo-Steward Agent*
