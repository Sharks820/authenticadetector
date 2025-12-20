# DEVELOPMENT.md - AuthenticaDetector Development Guide

## Prerequisites

- Git
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Code editor (VS Code recommended)
- Node.js 18+ (for tooling, not required for running)

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/your-org/AuthenticaDetector.git
cd AuthenticaDetector
```

### Local Development

Since this is a static site, you can run it locally with any HTTP server:

**Option 1: VS Code Live Server**
1. Install Live Server extension
2. Right-click `index.html`
3. Select "Open with Live Server"

**Option 2: Python**
```bash
python -m http.server 8000
# Open http://localhost:8000
```

**Option 3: Node.js**
```bash
npx serve .
# Open http://localhost:3000
```

**Option 4: PHP**
```bash
php -S localhost:8000
# Open http://localhost:8000
```

### HTTPS for PWA Features

Some PWA features require HTTPS. Use:

```bash
# With mkcert (recommended)
mkcert localhost
npx serve --ssl-cert localhost.pem --ssl-key localhost-key.pem

# Or use ngrok for quick HTTPS tunnel
npx ngrok http 8000
```

---

## Project Structure

```
AuthenticaDetector/
├── index.html          # Main application (all-in-one)
├── sw.js               # Service Worker
├── manifest.json       # PWA manifest
├── functions/          # Cloudflare Workers
│   └── api/
├── supabase/           # Database schema
├── docs/               # Documentation
├── src/                # Future: Organized source (scaffold only)
└── tests/              # Future: Test files (scaffold only)
```

---

## Development Workflow

### 1. Make Changes

Edit `index.html` directly (current monolith structure).

### 2. Test Locally

1. Open in browser
2. Test key flows:
   - File upload
   - Quick Scan
   - Deep Scan (requires AI models to load)
   - Login/Logout (uses Supabase)

### 3. Check Console

Open DevTools (F12) and check:
- No JavaScript errors
- Logs prefixed with `[Module]` format
- Network requests succeed

### 4. Commit Changes

```bash
git add .
git commit -m "type: description"
```

### 5. Deploy

Push to main branch for auto-deploy to Cloudflare Pages:

```bash
git push origin main
```

---

## Working with Supabase

### Local Development

The app uses the production Supabase instance. For local testing:

1. Create a Supabase project at https://supabase.com
2. Run the schema from `supabase/schema.sql`
3. Update `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `index.html`

### Database Schema

See `supabase/schema.sql` for full schema. Key tables:

- `profiles` - User display name, avatar
- `user_stats` - Scan counts, points, streaks
- `scans` - Scan history (private per user)
- `user_badges` - Earned badges
- `feedback` - User feedback on predictions

### Row Level Security

All tables have RLS enabled. Users can only:
- Read their own data (scans, stats)
- Read public data (profiles, leaderboard)
- Write their own data

---

## Working with Cloudflare Workers

### Function Files

Located in `functions/api/`:

- `analyze.js` - Server-side analysis (placeholder)
- `learn.js` - Global learning endpoint
- `stats.js` - Global statistics

### Local Testing

```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Start local dev server
wrangler pages dev .
```

### KV Namespaces

Create KV namespaces in Cloudflare dashboard:
- `RATE_LIMIT_KV` - Rate limiting
- `LEARNING_KV` - Global weights
- `STATS_KV` - Global stats

---

## AI Model Loading

### Models Used

1. **ViT (Deepfake):** `Xenova/vit-base-patch16-224`
2. **CLIP:** `Xenova/clip-vit-base-patch32`

### First Load

Models download on first Deep Scan (~400MB total). They're cached by the browser.

### Testing Without Models

Quick Scan uses only heuristics (no AI models), useful for testing.

---

## Debugging Tips

### Detection Issues

1. Check console for `[DeepFake]` and `[CLIP]` logs
2. Verify models loaded: `deepfakeLoaded`, `clipLoaded`
3. Check individual signal scores in result object

### Auth Issues

1. Check console for `[Auth]` logs
2. Verify Supabase connection
3. Check `useLocalFallback` flag

### PWA Issues

1. Check console for `[SW]` logs
2. Clear service worker in DevTools
3. Test in incognito for fresh install

---

## Environment Variables

No build-time environment variables. All config is in `index.html`:

```javascript
const SUPABASE_URL = 'https://...';
const SUPABASE_ANON_KEY = 'eyJ...';
const APP_VERSION = '12.0.0';
const DETECTOR_VERSION = '3.0.0';
```

For local development, you can modify these directly.

---

## Common Tasks

### Add a New View

1. Add HTML in `index.html` body:
```html
<div id="newView" class="view hidden">
    <header class="view-header">
        <button class="back-btn" onclick="closeView()">back</button>
        <span class="view-title">New View</span>
    </header>
    <main class="view-content">
        <!-- Content -->
    </main>
</div>
```

2. Add open function:
```javascript
window.openNewView = () => showView('newView');
```

3. Add CSS styles in `<style>` section

### Add a New Badge

1. Add to `BADGES` constant:
```javascript
const BADGES = {
    // ...existing badges
    new_badge: { id: 'new_badge', name: 'New Badge', icon: 'emoji', desc: 'Description', type: 'total', req: 100, rarity: 'rare' }
};
```

2. Add to Supabase `badge_definitions` table

### Add a Detection Module

1. Create analysis function:
```javascript
function analyzeNewSignal(img) {
    // Analysis logic
    return clamp(score, 0, 100);
}
```

2. Integrate into `runDeepScan()`:
```javascript
const newSignal = analyzeNewSignal(img);
allSignals.push(newSignal);
```

3. Add to moduleExplanations array

---

## Performance Tips

1. **Throttle UI updates** during scan progress
2. **Use `requestAnimationFrame`** for smooth animations
3. **Lazy load** AI models (only on Deep Scan)
4. **Cache** DOM references

---

*Last Updated: December 20, 2025*
