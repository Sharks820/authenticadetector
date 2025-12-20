# CLAUDE.md - AuthenticaDetector Baseline Documentation

## Project Overview

**AuthenticaDetector** is a Progressive Web Application (PWA) for detecting AI-generated images. It features:
- Multi-model ensemble AI detection (DeepFake detector, CLIP analysis)
- Heuristic analysis (noise patterns, compression artifacts, color distribution, edge coherence)
- Gamification system (quests, badges, leaderboards, shop)
- Supabase backend for authentication and data persistence

**Version:** 12.0.0
**Detector Version:** 3.0.0
**Live URL:** https://authenticadetector-v7.pages.dev

---

## Baseline Snapshot (December 20, 2025)

### Current File Structure

```
AuthenticaDetector/
├── .git/
├── .wrangler/
├── _headers                    # Cloudflare Pages headers config
├── _redirects                  # Cloudflare Pages redirects
├── auto-deploy.ps1             # PowerShell auto-deploy script
├── CHANGELOG.md                # Version history
├── CLAUDE_CODE_CONTEXT.md      # AI assistant context
├── CLAUDE_QUICK_START.md       # Quick start for AI assistants
├── deploy.ps1                  # PowerShell deployment script
├── deploy.sh                   # Bash deployment script
├── deploy-now.ps1              # Quick deploy script
├── DEPLOYMENT.md               # Deployment documentation
├── DEPLOYMENT_SUCCESS.md       # Deployment verification
├── DETECTION_UPGRADE.md        # Detection algorithm docs
├── execute-schema*.js          # Database schema executors
├── execute-schema*.ps1         # Schema PowerShell scripts
├── EXECUTIVE_SUMMARY.md        # Project summary
├── FINAL_COMPLETE_README.md    # Comprehensive README
├── functions/
│   ├── api/
│   │   ├── analyze.js          # Server-side analysis endpoint
│   │   ├── learn.js            # Self-learning feedback endpoint
│   │   └── stats.js            # Global statistics endpoint
│   └── README.md               # Functions documentation
├── icon-180.png                # Apple touch icon
├── icon-192.png                # PWA icon (192x192)
├── icon-512.png                # PWA icon (512x512)
├── IMPLEMENTATION_SUMMARY.md   # Implementation details
├── index.html                  # MAIN APPLICATION FILE (4,490 lines, 195KB)
│   ├── Lines 1-757:    CSS (757 lines of embedded styles)
│   ├── Lines 758-1127: HTML Views (home, history, leaderboard, profile, etc.)
│   ├── Lines 1128-4490: JavaScript Module (3,362 lines of application logic)
├── index.html.backup           # Backup of index.html
├── KV_NAMESPACE_IDS.txt        # Cloudflare KV namespace IDs
├── manifest.json               # PWA manifest
├── QUICK_DEPLOY.md             # Quick deployment guide
├── README.md                   # Main README
├── redeploy.ps1                # Redeployment script
├── run-schema.ps1              # Schema runner script
├── setup-database.js           # Database setup script
├── social-media/
│   ├── {facebook,instagram,tiktok}/
│   ├── facebook/
│   ├── instagram/
│   ├── tiktok/
│   └── SOCIAL_MEDIA_GUIDE.md   # Social media asset guide
├── supabase/
│   └── schema.sql              # Database schema (195 lines)
├── sw.js                       # Service Worker (99 lines)
└── WORLD_CLASS_DETECTION.md    # Detection methodology docs
```

### Build/Deploy Process

1. **Platform:** Cloudflare Pages
2. **Build:** No build step required (static HTML)
3. **Deploy:** `git push` to main branch triggers auto-deploy
4. **Manual Deploy:**
   - Run `./deploy.ps1` (Windows)
   - Run `./deploy.sh` (Linux/Mac)
   - Or use Cloudflare Dashboard

### Key Dependencies

| Dependency | Source | Purpose |
|------------|--------|---------|
| Supabase JS | CDN | Authentication & database |
| Hugging Face Transformers | CDN | AI model loading (ViT, CLIP) |
| Google Fonts (Inter) | CDN | Typography |

### Known Issues

1. **Performance:** FFT operations on 256x256 images may cause UI freezes on lower-end devices
2. **Supabase Fallback:** App uses localStorage when Supabase connection fails
3. **No Build System:** All code is in a single index.html file
4. **No Tests:** No automated testing infrastructure

### Baseline Verification

- **Date:** December 20, 2025
- **Site Status:** WORKING
- **URL:** https://authenticadetector-v7.pages.dev
- **Verification Method:** WebFetch confirmed page loads and functions

---

## Safety Rails Summary

### DO NOT TOUCH (Protected Code)

1. **Detection Core Logic:**
   - `analyzeNoisePatterns()` - Lines 2366-2495
   - `analyzeCompressionArtifacts()` - Lines 2497-2651
   - `analyzeColorDistribution()` - Lines 2653-2707
   - `analyzeEdgeCoherence()` - Lines 2709-2755
   - `analyzeFrequencyDomain()` - Lines 2757-2794
   - `runDeepScan()` - Lines 1880-2191
   - `runQuickScan()` - Lines 1771-1876

2. **Game Mechanics:**
   - Tank Shooter (not implemented in current version)
   - Hunt Mode (not implemented in current version)
   - Shop system - Lines 4019-4038
   - Quest system - Lines 4040-4055

3. **Routing/Back Button:**
   - `showView()` function - Line 1390
   - `closeView()` function - Line 1391
   - View navigation throughout

4. **Supabase Schema/RLS:**
   - `supabase/schema.sql` - All RLS policies

5. **Service Worker Caching:**
   - `sw.js` - Cache strategy

### Rollback Plan

If ANY change causes breakage:
1. Immediately run: `git revert HEAD`
2. Document in this file under "Rollback History"
3. Propose safer alternative approach

---

## Rollback History

*(None yet - baseline established)*

---

## Metrics Baseline

| Metric | Value | Date |
|--------|-------|------|
| index.html size | 195,761 bytes | Dec 20, 2025 |
| Total lines | 4,490 | Dec 20, 2025 |
| CSS lines | ~757 | Dec 20, 2025 |
| HTML lines | ~370 | Dec 20, 2025 |
| JavaScript lines | ~3,363 | Dec 20, 2025 |
| Functions count | ~100+ | Dec 20, 2025 |
| Files in repo | ~35 | Dec 20, 2025 |

---

## Next Steps (Pending PM-Integrator Approval)

1. Create CODEBASE_ANALYSIS.md with detailed function inventory
2. Create ORGANIZATION_PROPOSAL.md with migration phases
3. Create folder scaffold (empty directories with READMEs)
4. Create supporting documentation
5. Hand off to PM-Integrator for review

---

*Last Updated: December 20, 2025*
*Author: Repo-Steward Agent*
