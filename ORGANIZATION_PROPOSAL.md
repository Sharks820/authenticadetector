# ORGANIZATION_PROPOSAL.md - AuthenticaDetector Reorganization Plan

## Target Structure

```
AuthenticaDetector/
├── .github/
│   └── workflows/
│       └── ci.yml                      # Future: CI/CD pipeline
├── src/
│   ├── css/
│   │   ├── variables.css               # CSS custom properties
│   │   ├── base.css                    # Reset, typography, base
│   │   ├── components/
│   │   │   ├── buttons.css             # Button styles
│   │   │   ├── cards.css               # Card styles
│   │   │   ├── forms.css               # Form/input styles
│   │   │   ├── modals.css              # Modal styles
│   │   │   └── toast.css               # Toast notifications
│   │   ├── views/
│   │   │   ├── home.css                # Home view styles
│   │   │   ├── profile.css             # Profile view styles
│   │   │   ├── leaderboard.css         # Leaderboard styles
│   │   │   ├── shop.css                # Shop/game styles
│   │   │   └── auth.css                # Login/signup styles
│   │   └── main.css                    # Import aggregator
│   ├── js/
│   │   ├── config.js                   # Configuration constants
│   │   ├── state.js                    # Global state management
│   │   ├── utils.js                    # Helper functions
│   │   ├── detection/
│   │   │   ├── index.js                # Detection module entry
│   │   │   ├── heuristics.js           # Heuristic analysis functions
│   │   │   ├── models.js               # AI model loading/inference
│   │   │   ├── ensemble.js             # Ensemble scoring logic
│   │   │   └── signatures.js           # Generator signature detection
│   │   ├── auth/
│   │   │   ├── index.js                # Auth module entry
│   │   │   ├── supabase.js             # Supabase client setup
│   │   │   └── session.js              # Session management
│   │   ├── ui/
│   │   │   ├── index.js                # UI module entry
│   │   │   ├── navigation.js           # View navigation
│   │   │   ├── toast.js                # Toast notifications
│   │   │   ├── progress.js             # Progress indicators
│   │   │   └── results.js              # Results display
│   │   ├── data/
│   │   │   ├── index.js                # Data module entry
│   │   │   ├── history.js              # Scan history
│   │   │   ├── leaderboard.js          # Leaderboard data
│   │   │   └── badges.js               # Badge definitions & logic
│   │   ├── game/
│   │   │   ├── index.js                # Game module entry
│   │   │   ├── shop.js                 # Shop system
│   │   │   ├── quests.js               # Quest system
│   │   │   ├── inventory.js            # Inventory management
│   │   │   └── rewards.js              # Rewards/points system
│   │   ├── pwa/
│   │   │   ├── index.js                # PWA module entry
│   │   │   ├── install.js              # Install prompts
│   │   │   └── share-target.js         # Share target handling
│   │   └── main.js                     # Application entry point
│   └── views/
│       └── partials/                   # Future: Template partials
├── public/
│   ├── icons/
│   │   ├── icon-180.png
│   │   ├── icon-192.png
│   │   └── icon-512.png
│   ├── manifest.json
│   └── sw.js
├── functions/                          # Cloudflare Workers (existing)
│   ├── api/
│   │   ├── analyze.js
│   │   ├── learn.js
│   │   └── stats.js
│   └── README.md
├── supabase/                           # Database (existing)
│   └── schema.sql
├── docs/
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── DEVELOPMENT.md
│   ├── DEPLOYMENT.md
│   ├── TESTING.md
│   └── CODE_STYLE_GUIDE.md
├── tests/
│   ├── unit/
│   │   └── .gitkeep
│   ├── integration/
│   │   └── .gitkeep
│   └── e2e/
│       └── .gitkeep
├── scripts/
│   ├── build.js
│   └── deploy.sh
├── index.html                          # Main entry (minimal)
├── package.json
├── .eslintrc.js
├── .prettierrc
├── .gitignore
├── CLAUDE.md
├── CODEBASE_ANALYSIS.md
├── MIGRATION_LOG.md
└── README.md
```

---

## Migration Plan (15 Phases)

### PHASE 0: Guard Tooling (Current Session - NO CODE MOVES)

**Objective:** Add safety tooling without modifying any functional code

**Actions:**
1. Create folder scaffold with .gitkeep files
2. Create documentation files
3. Add package.json (devDependencies only)
4. Add ESLint + Prettier config

**Risk:** NONE - No functional code changes
**Rollback:** Delete added files

---

### PHASE 1: Create package.json

**Commit Message:** `chore: add package.json with dev dependencies`

**What:**
```json
{
  "name": "authenticadetector",
  "version": "12.0.0",
  "private": true,
  "scripts": {
    "lint": "eslint src/",
    "format": "prettier --write .",
    "test": "echo 'No tests yet'"
  },
  "devDependencies": {
    "eslint": "^8.x",
    "prettier": "^3.x"
  }
}
```

**Risk:** LOW - No code changes
**Verification:** `npm install` succeeds
**Rollback:** `git checkout -- package.json && rm -rf node_modules`

---

### PHASE 2: Add ESLint Configuration

**Commit Message:** `chore: add eslint configuration`

**What:** Create `.eslintrc.js` with browser globals, ES6+ rules

**Risk:** LOW - No code changes
**Verification:** `npm run lint` runs (will show errors, that's OK)
**Rollback:** `git checkout -- .eslintrc.js`

---

### PHASE 3: Add Prettier Configuration

**Commit Message:** `chore: add prettier configuration`

**What:** Create `.prettierrc` with project formatting rules

**Risk:** LOW - No code changes
**Verification:** `npm run format` runs
**Rollback:** `git checkout -- .prettierrc`

---

### PHASE 4: Extract CSS Variables

**Commit Message:** `refactor: extract CSS variables to src/css/variables.css`

**What:**
1. Create `src/css/variables.css` with all `:root` variables
2. Add `<link rel="stylesheet" href="src/css/variables.css">` to index.html
3. Leave original CSS in index.html (duplication OK for safety)
4. Verify site still works
5. ONLY THEN remove duplicate from index.html

**Risk:** MEDIUM - CSS loading order matters
**Verification:**
- [ ] Site loads correctly
- [ ] All colors/themes work
- [ ] No CSS errors in console
**Rollback:** `git revert HEAD`

---

### PHASE 5: Extract Base CSS

**Commit Message:** `refactor: extract base styles to src/css/base.css`

**What:**
1. Create `src/css/base.css` with reset, typography, base styles
2. Add link to index.html
3. Leave stub in index.html initially
4. Verify, then remove stub

**Risk:** MEDIUM
**Verification:** Same as Phase 4
**Rollback:** `git revert HEAD`

---

### PHASE 6: Extract Component CSS (Cards, Buttons)

**Commit Message:** `refactor: extract component styles to src/css/components/`

**What:**
1. Create component CSS files
2. Add links to index.html
3. Verify, remove stubs

**Risk:** MEDIUM
**Rollback:** `git revert HEAD`

---

### PHASE 7: Extract View CSS

**Commit Message:** `refactor: extract view styles to src/css/views/`

**What:**
1. Create view-specific CSS files
2. Add links, verify, remove stubs

**Risk:** MEDIUM
**Rollback:** `git revert HEAD`

---

### PHASE 8: Create CSS Import Aggregator

**Commit Message:** `refactor: create main.css import aggregator`

**What:**
1. Create `src/css/main.css` that imports all CSS files
2. Replace multiple link tags with single import
3. Verify all styles work

**Risk:** MEDIUM
**Rollback:** `git revert HEAD`

---

### PHASE 9: Extract JavaScript Config

**Commit Message:** `refactor: extract config to src/js/config.js`

**What:**
1. Create `src/js/config.js` with SUPABASE_URL, SUPABASE_ANON_KEY, APP_VERSION, etc.
2. Import in main module
3. Leave re-export stub in index.html

**Risk:** HIGH - Must maintain module loading order
**Verification:**
- [ ] App initializes correctly
- [ ] Supabase connects
- [ ] Version displays correctly
**Rollback:** `git revert HEAD`

---

### PHASE 10: Extract Utils Module

**Commit Message:** `refactor: extract utils to src/js/utils.js`

**What:**
1. Extract: `$`, `toast`, `showView`, `closeView`, `sleep`, `round`, `clamp`
2. Re-export from index.html
3. Verify all function calls work

**Risk:** HIGH - Many dependencies on these functions
**Rollback:** `git revert HEAD`

---

### PHASE 11: Extract UI Module

**Commit Message:** `refactor: extract UI functions to src/js/ui/`

**What:**
1. Extract navigation, toast, progress, results functions
2. Create module index
3. Update imports in index.html

**Risk:** HIGH
**Rollback:** `git revert HEAD`

---

### PHASE 12: Extract Auth Module

**Commit Message:** `refactor: extract auth functions to src/js/auth/`

**What:**
1. Extract Supabase setup, session management, login/logout
2. Create module index
3. Update imports

**Risk:** HIGH - Auth is critical path
**Verification:**
- [ ] Login works
- [ ] Signup works
- [ ] Session persists
- [ ] Logout works
**Rollback:** `git revert HEAD`

---

### PHASE 13: Extract Detection Module (REQUIRES PM APPROVAL)

**Commit Message:** `refactor: extract detection core to src/js/detection/`

**What:**
1. Extract ALL detection functions (heuristics, models, ensemble)
2. Create module structure
3. Extensive testing required

**Risk:** VERY HIGH - Core functionality
**Verification:**
- [ ] Quick Scan returns same results
- [ ] Deep Scan returns same results
- [ ] All heuristics fire correctly
- [ ] Models load correctly
- [ ] Ensemble scoring matches
**Rollback:** `git revert HEAD`

---

### PHASE 14: Extract Game Module

**Commit Message:** `refactor: extract game mechanics to src/js/game/`

**What:**
1. Extract shop, quests, inventory, rewards
2. Create module structure
3. Update imports

**Risk:** HIGH
**Rollback:** `git revert HEAD`

---

### PHASE 15: Extract Data Module

**Commit Message:** `refactor: extract data layer to src/js/data/`

**What:**
1. Extract history, leaderboard, badges
2. Create module structure
3. Update imports

**Risk:** MEDIUM
**Rollback:** `git revert HEAD`

---

## Risk Assessment Matrix

| Phase | Risk Level | Complexity | Time Est. | Dependencies |
|-------|------------|------------|-----------|--------------|
| 0 | NONE | Low | 1 hour | None |
| 1 | LOW | Low | 15 min | None |
| 2 | LOW | Low | 15 min | Phase 1 |
| 3 | LOW | Low | 15 min | Phase 1 |
| 4 | MEDIUM | Medium | 1 hour | None |
| 5 | MEDIUM | Medium | 1 hour | Phase 4 |
| 6 | MEDIUM | Medium | 2 hours | Phase 5 |
| 7 | MEDIUM | Medium | 2 hours | Phase 6 |
| 8 | MEDIUM | Low | 30 min | Phase 7 |
| 9 | HIGH | Medium | 1 hour | None |
| 10 | HIGH | Medium | 1 hour | Phase 9 |
| 11 | HIGH | High | 2 hours | Phase 10 |
| 12 | HIGH | High | 2 hours | Phase 10 |
| 13 | VERY HIGH | Very High | 4 hours | Phase 10 |
| 14 | HIGH | High | 2 hours | Phase 10 |
| 15 | MEDIUM | Medium | 1 hour | Phase 10 |

---

## Testing Checklist (For Each Phase)

### Pre-Migration Checklist
- [ ] Current branch is `chore/repo-steward-baseline`
- [ ] All changes committed
- [ ] Site is working at baseline URL

### Post-Migration Checklist
- [ ] Site loads without errors
- [ ] Console has no errors
- [ ] All views navigate correctly
- [ ] File upload works
- [ ] Quick Scan works
- [ ] Deep Scan works (if logged in)
- [ ] Login/Logout works
- [ ] History loads
- [ ] Leaderboard loads
- [ ] Profile displays correctly
- [ ] Shop opens
- [ ] Quests display

### Detection-Specific Tests (Phase 13)
- [ ] Test image 1 (known AI): Same score before/after
- [ ] Test image 2 (known real): Same score before/after
- [ ] Test image 3 (uncertain): Same score before/after
- [ ] All heuristics produce values in expected range
- [ ] Generator signatures detect correctly
- [ ] EXIF analysis works
- [ ] Metadata analysis works

---

## Rollback Strategies

### Single File Rollback
```bash
git checkout HEAD~1 -- <filename>
```

### Full Phase Rollback
```bash
git revert HEAD
```

### Emergency Full Rollback
```bash
git checkout main
git branch -D chore/repo-steward-baseline
```

### Document Every Rollback
After any rollback, add to CLAUDE.md:
```
## Rollback History

### [DATE] Phase X Rollback
- **Commit:** <hash>
- **Reason:** <what broke>
- **Action:** <what was done>
- **Next Steps:** <safer approach>
```

---

## Success Criteria

### Phase 0 Complete When:
1. All documentation files exist
2. Folder scaffold exists
3. package.json exists (optional)
4. No functional changes made
5. Site still works

### Full Migration Complete When:
1. index.html is minimal (< 100 lines)
2. All CSS in src/css/
3. All JS in src/js/
4. All tests pass
5. Site functionality unchanged
6. Performance same or better
7. Bundle size same or smaller

---

## Timeline Estimate

| Milestone | Duration | Cumulative |
|-----------|----------|------------|
| Phase 0 (Scaffold) | 2 hours | 2 hours |
| Phases 1-3 (Tooling) | 1 hour | 3 hours |
| Phases 4-8 (CSS) | 6 hours | 9 hours |
| Phases 9-15 (JS) | 14 hours | 23 hours |

**Total Estimated Time:** 23 hours (spread across multiple sessions)

---

## Approval Required

This proposal requires PM-Integrator approval before:
1. Any file moves (Phase 4+)
2. Any JavaScript extraction (Phase 9+)
3. Detection module extraction (Phase 13)

**DO NOT PROCEED PAST PHASE 0 WITHOUT PM APPROVAL**

---

*Proposal Date: December 20, 2025*
*Author: Repo-Steward Agent*
