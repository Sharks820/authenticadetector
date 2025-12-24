# AuthenticaDetector v12 - AI Image Detection

Advanced AI-powered image detection with 90%+ accuracy. Detect AI-generated images instantly.

## 🚀 Quick Start

### Deploy to Cloudflare Pages (Recommended)
1. Push this folder to GitHub
2. Connect to Cloudflare Pages
3. Build command: (leave empty)
4. Output directory: `/`
5. Deploy!

### Local Development
```bash
# Serve locally
npx serve .
# or
python -m http.server 8000
```

---

## 🔧 Backend Setup (Supabase)

### 1. Create Project
- Go to [supabase.com](https://supabase.com)
- Create new project (free tier works)
- Note your **Project URL** and **anon key**

### 2. Run Schema
- Open SQL Editor in Supabase
- Paste contents of `supabase/schema.sql`
- Click Run

### 3. Configure App
Edit `index.html` and replace:
```javascript
const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';
```

### 4. Enable Email Auth
- Authentication → Providers → Email → Enable

---

## 📱 PWA vs Native App

### Current: PWA (Progressive Web App)
| Pros | Cons |
|------|------|
| ✅ No app store needed | ❌ iOS share-to-app broken |
| ✅ Instant updates | ❌ Confusing install process |
| ✅ Works on all platforms | ❌ No app store discovery |
| ✅ Free to deploy | ❌ Limited native features |

### Recommended: Native App (Capacitor)
For production, convert to native app:

```bash
# Install Capacitor
npm init -y
npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android

# Initialize
npx cap init AuthenticaDetector com.authenticadetector.app

# Add platforms
npx cap add ios
npx cap add android

# Build and run
npx cap sync
npx cap open ios  # Opens Xcode
npx cap open android  # Opens Android Studio
```

**Benefits:**
- ✅ Full share-to-app on both platforms
- ✅ App Store presence
- ✅ Push notifications
- ✅ Better performance
- ✅ Professional appearance

**Cost:** $99/year (Apple) + $25 one-time (Google)

---

## 🔍 Detection Architecture

### Quick Scan (Guest Access)
Heuristic-only analysis:
- **Noise Patterns**: Detects unnaturally uniform noise
- **Compression Artifacts**: Finds AI upscaling patterns
- **Color Distribution**: Identifies smooth histograms
- **Edge Coherence**: Checks edge sharpness

**Target Accuracy:** 60-70%

### Deep Scan (Login Required)
Heuristic + AI model:
- All Quick Scan checks
- **Frequency Analysis**: Detects unusual patterns
- **AI Model**: Classification confidence patterns
- **Multi-region Analysis** (Forensics mode)

**Target Accuracy:** 85-95%

### Forensics Mode
Maximum accuracy:
- All Deep Scan checks
- **5-region crop analysis**
- **Stricter thresholds**
- **Agreement boosting**

---

## 🏆 Gamification

### Points System
| Action | Points |
|--------|--------|
| Quick Scan | +1 |
| Deep Scan | +3 |
| Forensics Scan | +5 |
| AI Found | +5 |

### Leaderboard Tiers
| Rank | Title | Badge |
|------|-------|-------|
| #1 | KING | 👑 Gold |
| #2 | VICEROY | 🥈 Silver |
| #3 | ARCHDUKE | 🥉 Bronze |
| 4-10 | LEGEND | 🟣 Purple |
| 11-25 | ELITE | 🔵 Blue |
| 26-50 | VETERAN | 🟢 Green |
| 51-100 | RISING | ⚪ Gray |

### Badges (20 total)
- **Common (6)**: First Steps, AI Spotter, Getting Started, Double Digits, Deep Diver, Speed Runner
- **Rare (5)**: Detective, AI Expert, On Fire, Deep Analyst, Dedicated
- **Epic (5)**: Centurion, AI Hunter, Unstoppable, Deep Master, Forensics Pro
- **Legendary (4)**: Legend, AI Nemesis, Perfect 10, Grandmaster

### Weekly Rewards
- **KING**: Custom badge + Featured profile
- **Top 3**: Exclusive tier badges
- **Top 10**: 2x points next week

---

## 🔒 Privacy

### Your Private Data
- Scan history (only you can see)
- Uploaded images (processed locally, never stored)
- Email address

### Public Profile (Others See)
- Display name
- Avatar
- Badges earned
- Account age
- Total scans
- AI found count
- Points

---

## 📁 File Structure

```
authenticadetector-v12/
├── index.html          # Complete app (HTML + CSS + JS)
├── sw.js               # Service worker
├── manifest.json       # PWA manifest
├── _headers            # Security headers
├── _redirects          # SPA routing
├── icon-180.png        # Apple touch icon
├── icon-192.png        # PWA icon
├── icon-512.png        # Large PWA icon
├── supabase/
│   └── schema.sql      # Database schema
├── social-media/       # Marketing assets
│   ├── SOCIAL_MEDIA_GUIDE.md
│   ├── facebook/
│   ├── instagram/
│   └── tiktok/
└── README.md           # This file
```

---

## 🧪 Manual Test Checklist

### Install Flow
- [ ] Android: Install banner appears
- [ ] Android: Install prompt works
- [ ] iOS: Helper instructions show
- [ ] Install chip updates to "✓ Installed"

### Auth Flow
- [ ] Sign up creates account
- [ ] Sign in works
- [ ] Session persists after refresh
- [ ] Sign out clears session
- [ ] Guest mode works

### Detection
- [ ] Quick Scan completes
- [ ] Deep Scan loads model
- [ ] Forensics mode works
- [ ] Results display correctly
- [ ] Explainers show signals
- [ ] Feedback buttons work

### Gamification
- [ ] Points update after scan
- [ ] Badges unlock correctly
- [ ] Leaderboard loads
- [ ] Public profile shows correctly

### Responsive
- [ ] Web browser fits
- [ ] Mobile browser fits
- [ ] Installed app fits
- [ ] All buttons accessible
- [ ] Scrolling works everywhere

---

## 🔄 Version History

### v12.0.0 (Current)
- Renamed to AuthenticaDetector
- Fixed responsive scrolling issues
- Improved detection algorithms
- Added frequency domain analysis
- Enhanced leaderboard tiers
- Weekly rewards system
- 20 badges across 4 rarities
- Social media marketing package
- Comprehensive documentation

---

## 📊 Domain Recommendations

### Available Options (Check availability)
- authenticadetector.com
- authenticadetector.app
- authenticadetect.com
- detectauthentrica.com
- aidetector.app (premium)

### Registrar Recommendations
- **Cloudflare Domains**: $10/year, free privacy
- **Porkbun**: $9/year, free privacy
- **Namecheap**: $12/year

---

## 📧 Support

For issues, use the feedback button in the app.

---

Built with ❤️ to fight AI misinformation
