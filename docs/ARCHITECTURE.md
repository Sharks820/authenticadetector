# ARCHITECTURE.md - AuthenticaDetector System Architecture

## Overview

AuthenticaDetector is a Progressive Web Application (PWA) for detecting AI-generated images. It uses a multi-model ensemble approach combining heuristic analysis with deep learning models.

---

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (PWA)                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    index.html                              │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────────────┐   │   │
│  │  │  CSS       │  │  HTML      │  │  JavaScript        │   │   │
│  │  │  (~740 ln) │  │  (~370 ln) │  │  (~3,360 ln)       │   │   │
│  │  └────────────┘  └────────────┘  └────────────────────┘   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                   │
│  ┌───────────────────────────┴───────────────────────────────┐  │
│  │                    Detection Engine                        │  │
│  │  ┌─────────────────────┐  ┌─────────────────────────────┐ │  │
│  │  │  Heuristics         │  │  AI Models (CDN)            │ │  │
│  │  │  - Noise Analysis   │  │  - ViT (Deepfake)           │ │  │
│  │  │  - Compression      │  │  - CLIP (Semantic)          │ │  │
│  │  │  - Color Dist.      │  │                             │ │  │
│  │  │  - Edge Coherence   │  │  Source: HuggingFace        │ │  │
│  │  │  - Frequency        │  │  Loaded at runtime          │ │  │
│  │  │  - EXIF/Metadata    │  │  ~400MB total               │ │  │
│  │  └─────────────────────┘  └─────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                   │
│  ┌───────────────────────────┴───────────────────────────────┐  │
│  │                    Ensemble Scoring                        │  │
│  │  - Weighted average of all signals                         │  │
│  │  - Adaptive weights (self-learning)                        │  │
│  │  - Generator signature detection                           │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    Service Worker                          │  │
│  │  - Cache-first strategy                                    │  │
│  │  - Offline support                                         │  │
│  │  - Share target handling                                   │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CLOUDFLARE PAGES                              │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────┐  ┌─────────────────────────────────┐   │
│  │  Static Hosting     │  │  Workers Functions               │   │
│  │  - index.html       │  │  - /api/analyze (server-side)   │   │
│  │  - manifest.json    │  │  - /api/learn (feedback)        │   │
│  │  - sw.js            │  │  - /api/stats (global stats)    │   │
│  │  - icons            │  │                                  │   │
│  └─────────────────────┘  └─────────────────────────────────┘   │
│                              │                                   │
│  ┌───────────────────────────┴───────────────────────────────┐  │
│  │                    KV Storage                              │  │
│  │  - Rate limiting                                           │  │
│  │  - Global learning weights                                 │  │
│  │  - Statistics                                              │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         SUPABASE                                 │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────┐  ┌─────────────────────────────────┐   │
│  │  Authentication     │  │  PostgreSQL Database            │   │
│  │  - Email/Password   │  │  - profiles                     │   │
│  │  - Session mgmt     │  │  - user_stats                   │   │
│  │  - Password reset   │  │  - scans (private)              │   │
│  └─────────────────────┘  │  - user_badges                   │   │
│                           │  - feedback                      │   │
│  ┌─────────────────────┐  │  - leaderboard (view)           │   │
│  │  Row Level Security │  └─────────────────────────────────┘   │
│  │  - Users own data   │                                        │
│  │  - Public profiles  │                                        │
│  │  - Private scans    │                                        │
│  └─────────────────────┘                                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### Image Analysis Flow

```
User uploads image
        │
        ▼
┌───────────────────┐
│ File Validation   │ (type, size < 50MB)
└───────────────────┘
        │
        ▼
┌───────────────────┐
│ Quick Scan        │ (heuristics only, ~2 sec)
│ OR                │
│ Deep Scan         │ (heuristics + AI models, ~10 sec)
└───────────────────┘
        │
        ├── Noise Analysis
        ├── Compression Artifacts
        ├── Color Distribution
        ├── Edge Coherence
        ├── Frequency Domain
        ├── EXIF Metadata
        ├── File Metadata
        │
        ▼ (Deep Scan only)
        ├── Deepfake Detector (ViT)
        ├── CLIP Analysis
        └── Generator Signatures
        │
        ▼
┌───────────────────┐
│ Ensemble Scoring  │
│ - Weighted avg    │
│ - Signal agreement│
│ - Confidence calc │
└───────────────────┘
        │
        ▼
┌───────────────────┐
│ Display Results   │
│ - AI probability  │
│ - Confidence      │
│ - Explainers      │
└───────────────────┘
        │
        ▼
┌───────────────────┐
│ Save to History   │ (if logged in)
│ Update Stats      │
│ Check Badges      │
└───────────────────┘
```

### Authentication Flow

```
User clicks Login
        │
        ▼
┌───────────────────┐
│ Show Login View   │
└───────────────────┘
        │
        ├── Email/Password submit
        │
        ▼
┌───────────────────┐
│ Supabase Auth     │
│ signInWithPassword│
│ OR signUp         │
└───────────────────┘
        │
        ├── Success
        │       │
        │       ▼
        │  ┌───────────────┐
        │  │ Create Profile│ (trigger)
        │  │ Init Stats    │
        │  └───────────────┘
        │       │
        │       ▼
        │  ┌───────────────┐
        │  │ Save Session  │
        │  │ Update UI     │
        │  │ Load Stats    │
        │  └───────────────┘
        │
        └── Error
                │
                ▼
           ┌───────────────┐
           │ Show Error    │
           └───────────────┘
```

---

## Component Architecture

### View System

```
Views (mutually exclusive, one active at a time)
├── homeView        # Main view with upload/scan
├── historyView     # Scan history
├── leaderboardView # Rankings
├── profileView     # User profile
├── allBadgesView   # Badge collection
├── loginView       # Authentication
├── helpView        # FAQ/Help
├── shopView        # Item shop
└── questsView      # Daily quests

Navigation: showView(id) / closeView()
```

### State Management

```
Global State Variables
├── user            # Current user object
├── isInstalled     # PWA install status
├── currentFile     # Uploaded file
├── currentDataUrl  # Base64 image data
├── currentResult   # Last scan result
├── analysisAborted # Scan cancellation flag
├── forensicsMode   # Forensics toggle
├── adaptiveWeights # Self-learning weights
└── gameState       # Shop, quests, inventory
```

---

## Security Architecture

### Client-Side

1. **No Secrets in Client:** Supabase anon key is public (safe by design)
2. **LocalStorage Fallback:** Works without backend
3. **Input Validation:** File type/size checks

### Server-Side (Supabase)

1. **Row Level Security (RLS):**
   - Users can only read/write their own data
   - Profiles are publicly viewable
   - Scans are private

2. **Triggers:**
   - Auto-create profile on signup
   - Auto-create stats on signup

### Cloudflare Workers

1. **Rate Limiting:** Per-IP limits (50/hour)
2. **CORS Headers:** Allow all origins (public API)

---

## Performance Considerations

### Current Bottlenecks

1. **AI Model Loading:** ~400MB downloaded on first Deep Scan
2. **FFT Operations:** CPU-intensive on 256x256 images
3. **Single Thread:** No Web Workers (could freeze UI)

### Caching Strategy

1. **Service Worker:** Cache-first for static assets
2. **Model Cache:** HuggingFace transformers caches models
3. **LocalStorage:** User data, adaptive weights

---

## Dependencies

### Runtime Dependencies

| Package | Version | Purpose | Size |
|---------|---------|---------|------|
| @supabase/supabase-js | 2.x | Auth, DB | ~100KB |
| @huggingface/transformers | 3.0.0 | AI models | ~50KB |
| Google Fonts (Inter) | - | Typography | ~20KB |

### Model Dependencies

| Model | Size | Purpose |
|-------|------|---------|
| Xenova/vit-base-patch16-224 | ~87MB | Deepfake detection |
| Xenova/clip-vit-base-patch32 | ~350MB | Semantic analysis |

### Development Dependencies (Planned)

| Package | Purpose |
|---------|---------|
| eslint | Linting |
| prettier | Formatting |
| vitest | Testing |
| playwright | E2E testing |

---

*Last Updated: December 20, 2025*
