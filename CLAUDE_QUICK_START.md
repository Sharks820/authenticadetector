# AuthenticaDetector - Quick Context (Give This to Claude Code)

**Project:** AI Image Detection App (like Shazam for fake images)
**Version:** v12.0.0 | **Status:** MVP Complete, needs backend config + testing

## IMMEDIATE CONTEXT

```
Stack: Single-file PWA (index.html) + Supabase backend + Hugging Face Transformers.js
Name: AuthenticaDetector (changed from "Authentica" - trademark issue)
Deploy: Cloudflare Pages recommended
```

## CURRENT STATE

✅ **DONE:**
- Complete single-file PWA (3164 lines)
- 6-signal AI detection system (noise, compression, color, edges, frequency, model)
- Quick Scan (guest, ~65%) and Deep Scan (login, ~90% target)
- Supabase auth + database schema
- Gamification (points, 20 badges, leaderboard tiers)
- Responsive design with scroll fixes
- Social media marketing assets

❌ **NOT DONE:**
- Supabase not configured yet (user needs to add URL/key)
- Video detection (disabled)
- Text detection (future)
- Native app conversion (recommended for production)
- Detection accuracy needs real-world testing

## KEY FILES

```
index.html           - THE APP (all HTML/CSS/JS)
supabase/schema.sql  - Database tables + RLS policies
sw.js                - Service worker (offline + share-target)
manifest.json        - PWA config
CLAUDE_CODE_CONTEXT.md - Full context (read if needed)
```

## DETECTION SYSTEM (Important!)

```javascript
// Quick Scan: 4 heuristics
aiScore = noise*0.30 + compression*0.25 + color*0.25 + edges*0.20

// Deep Scan: 6 signals including AI model
aiScore = noise*0.18 + compression*0.15 + color*0.15 + 
          edges*0.12 + frequency*0.15 + model*0.25

// Key analyzers in index.html:
analyzeNoisePatterns(), analyzeCompressionArtifacts(), 
analyzeColorDistribution(), analyzeEdgeCoherence(),
analyzeFrequencyDomain(), analyzeModelOutput()
```

## GATING

```
Guest → Quick Scan only
Logged In → All features (Deep, Forensics, history, badges)
```

## COMMON TASKS

**To improve detection:**
Look at `runQuickScan()` and `runDeepScan()` in index.html

**To add features:**
All code is in index.html `<script>` section

**To change UI:**
CSS is in index.html `<style>` section

**To modify database:**
Edit supabase/schema.sql, re-run in Supabase SQL Editor

## USER PREFERENCES

- Startup mindset: ship fast, iterate
- Cost-conscious: prefer free/cheap tools
- Mobile-first: most users on phones
- Wants to eventually match Hive Moderation quality
- Prefers comprehensive responses over back-and-forth

## NEXT LIKELY TASKS

1. Configure Supabase and test
2. Improve detection accuracy
3. Add video detection
4. Convert to native app (Capacitor)
5. Design proper branding
6. Launch beta

---
**Full context:** Read CLAUDE_CODE_CONTEXT.md for complete details
