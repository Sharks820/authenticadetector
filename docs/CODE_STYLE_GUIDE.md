# CODE_STYLE_GUIDE.md - AuthenticaDetector Coding Standards

## Overview

This guide establishes coding standards for the AuthenticaDetector project. All contributions should follow these guidelines.

---

## JavaScript

### General

- Use ES6+ features (arrow functions, const/let, template literals)
- Use `const` by default, `let` when reassignment needed, never `var`
- Use strict equality (`===`, `!==`)
- Use meaningful variable names (no single letters except loop indices)

### Functions

```javascript
// Prefer arrow functions for callbacks
array.map(item => item.value);

// Use regular functions for methods that need `this`
function handleClick(event) {
    this.classList.add('active');
}

// Document complex functions with JSDoc
/**
 * Analyzes noise patterns in an image
 * @param {HTMLImageElement} img - The image to analyze
 * @returns {number} AI probability score (0-100)
 */
function analyzeNoisePatterns(img) {
    // ...
}
```

### Async/Await

```javascript
// Prefer async/await over .then() chains
async function loadData() {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('[Module] Error:', error);
        return null;
    }
}
```

### Error Handling

```javascript
// Always handle errors with try/catch in async functions
async function fetchUser() {
    try {
        const { data, error } = await supabase.from('profiles').select('*');
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('[Auth] Fetch failed:', error);
        toast('Failed to load user data');
        return null;
    }
}
```

### Console Logging

```javascript
// Use bracketed prefixes for log messages
console.log('[SW] Registered');
console.log('[Auth] State change:', event);
console.error('[DeepFake] Load failed:', e);
```

### DOM Access

```javascript
// Use the $ shorthand for document.getElementById
const $ = id => document.getElementById(id);

// Cache DOM references when used multiple times
const progressBar = $('progressBar');
progressBar.style.width = '50%';
```

---

## CSS

### General

- Use CSS custom properties for colors, spacing, shadows
- Use lowercase with hyphens for class names
- Group properties logically (positioning, box model, visual, typography)

### Custom Properties

```css
:root {
    /* Colors */
    --primary: #00d4aa;
    --bg: #0a0d14;
    --text: #f1f5f9;

    /* Spacing */
    --space-sm: 8px;
    --space-md: 16px;
    --space-lg: 24px;

    /* Shadows */
    --shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}
```

### Class Naming

```css
/* Components */
.card { }
.card-header { }
.card-content { }

/* States */
.card.active { }
.card.hidden { }

/* Variations */
.btn-primary { }
.btn-secondary { }
```

### Property Order

```css
.component {
    /* Positioning */
    position: relative;
    top: 0;
    left: 0;
    z-index: 1;

    /* Box Model */
    display: flex;
    width: 100%;
    padding: 16px;
    margin: 8px;

    /* Visual */
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 12px;
    box-shadow: var(--shadow);

    /* Typography */
    font-family: var(--font);
    font-size: 14px;
    color: var(--text);

    /* Animation */
    transition: all 0.2s ease;
}
```

---

## HTML

### General

- Use semantic HTML5 elements
- Use meaningful `id` attributes
- Keep nesting to reasonable depth (max 5-6 levels)

### Structure

```html
<!-- View container -->
<div id="viewName" class="view hidden">
    <header class="view-header">
        <button class="back-btn" onclick="closeView()">back</button>
        <span class="view-title">Title</span>
    </header>

    <main class="view-content">
        <!-- Content here -->
    </main>
</div>
```

### Accessibility

```html
<!-- Use meaningful labels -->
<button aria-label="Close modal" onclick="closeModal()">X</button>

<!-- Use alt text for images -->
<img src="icon.png" alt="Detection icon">
```

---

## File Organization

### Current (Monolith)

```
index.html
├── <style>        <!-- All CSS -->
├── <body>         <!-- All HTML -->
└── <script>       <!-- All JavaScript -->
```

### Target (Modular)

```
src/
├── css/
│   ├── variables.css
│   ├── base.css
│   └── components/
├── js/
│   ├── config.js
│   ├── utils.js
│   └── modules/
└── views/
```

---

## Naming Conventions

### Files

| Type | Convention | Example |
|------|------------|---------|
| JavaScript | camelCase | `analyzeImage.js` |
| CSS | kebab-case | `scan-results.css` |
| Constants | UPPER_SNAKE | `API_URL` |
| Views | camelCase | `historyView` |

### Functions

| Type | Convention | Example |
|------|------------|---------|
| Actions | verbNoun | `loadUser`, `saveHistory` |
| Handlers | handleNoun | `handleFileSelect` |
| Getters | getNoun | `getTier`, `getBadges` |
| Boolean | isNoun/hasNoun | `isInstalled`, `hasActiveItem` |
| Async | asyncVerb | `async loadLeaderboard` |

### Variables

| Type | Convention | Example |
|------|------------|---------|
| Elements | noun | `progressBar`, `resultCard` |
| Booleans | isNoun | `isLoading`, `isAI` |
| Arrays | pluralNoun | `badges`, `quests` |
| Objects | singularNoun | `user`, `config` |

---

## Comments

### When to Comment

1. Complex algorithms (detection functions)
2. Non-obvious business logic
3. Workarounds or hacks
4. TODO items
5. Public API functions (JSDoc)

### Comment Style

```javascript
// Single line for brief explanations
const score = value * 100;

/*
 * Multi-line for complex explanations
 * that span multiple lines
 */
function complexFunction() { }

/**
 * JSDoc for public functions
 * @param {string} id - The element ID
 * @returns {HTMLElement|null}
 */
function $(id) { }

// TODO: Implement caching
// FIXME: Handle edge case
// NOTE: This is intentional for performance
```

### Section Headers

```javascript
// ==================== DETECTION ====================
// Large section headers for major code sections

// --- Subsection ---
// Smaller headers for subsections
```

---

## Git Commits

### Message Format

```
<type>: <short description>

<optional body>

<optional footer>
```

### Types

| Type | Use Case |
|------|----------|
| feat | New feature |
| fix | Bug fix |
| docs | Documentation only |
| style | Formatting, no code change |
| refactor | Code change, no new feature |
| perf | Performance improvement |
| test | Adding tests |
| chore | Build, tooling, etc. |

### Examples

```
feat: add generator signature detection

Detects Midjourney, DALL-E, and Stable Diffusion
fingerprints using noise and compression patterns.

Closes #123
```

```
fix: correct EXIF scoring for screenshots

Screenshots without EXIF should score neutral (50),
not suspicious (70).
```

---

## Testing

### Unit Tests

```javascript
// test/detection/noiseAnalysis.test.js
import { analyzeNoisePatterns } from '../../src/js/detection/heuristics';

describe('analyzeNoisePatterns', () => {
    it('returns score between 0-100', () => {
        const result = analyzeNoisePatterns(testImage);
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThanOrEqual(100);
    });

    it('detects uniform noise in AI images', () => {
        const result = analyzeNoisePatterns(aiGeneratedImage);
        expect(result).toBeGreaterThan(60);
    });
});
```

---

*Last Updated: December 20, 2025*
