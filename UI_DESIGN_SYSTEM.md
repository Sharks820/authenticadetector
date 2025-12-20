# AuthenticaDetector UI Design System
**Version:** 2.0.0
**Last Updated:** Dec 20, 2025
**Status:** Production Ready

---

## Overview

This design system establishes a modern, professional, and accessible visual language for AuthenticaDetector. Inspired by industry leaders like Linear, Vercel, and Stripe, it combines sleek aesthetics with trust-building clarity.

### Design Principles

1. **Trust & Clarity** - Users must feel confident in AI detection results
2. **Speed & Performance** - Smooth animations, optimized interactions
3. **Accessibility First** - WCAG AA compliance minimum
4. **Mobile-First** - Responsive across all device sizes
5. **Consistent & Scalable** - Reusable components, predictable patterns

---

## Color Palette

### Primary Colors
```css
--color-primary-50: #e6faf6;    /* Lightest tint */
--color-primary-100: #b3f0e6;
--color-primary-200: #80e6d6;
--color-primary-300: #4ddcc6;
--color-primary-400: #1ad3b6;
--color-primary-500: #00d4aa;   /* Main brand color */
--color-primary-600: #00b993;
--color-primary-700: #009977;   /* Dim variant */
--color-primary-800: #007a5c;
--color-primary-900: #005a40;
```

**Usage:** CTAs, links, primary actions, success states, progress indicators

### Secondary Colors
```css
--color-secondary-50: #ededfe;
--color-secondary-100: #d4d5fd;
--color-secondary-200: #b9bafc;
--color-secondary-300: #9fa1fa;
--color-secondary-400: #8487f9;
--color-secondary-500: #6366f1;   /* Main secondary */
--color-secondary-600: #5053d9;
--color-secondary-700: #3d40c1;
--color-secondary-800: #2b2da9;
--color-secondary-900: #1a1b91;
```

**Usage:** Badges, highlights, informational states, accents

### Semantic Colors
```css
/* Success */
--color-success-50: #e8f9f0;
--color-success-500: #2ed573;
--color-success-900: #1a7d42;

/* Warning */
--color-warning-50: #fff4e5;
--color-warning-500: #ffa502;
--color-warning-900: #995f00;

/* Danger */
--color-danger-50: #ffe9ec;
--color-danger-500: #ff4757;
--color-danger-900: #991f2e;

/* Info */
--color-info-50: #e6f4ff;
--color-info-500: #3498db;
--color-info-900: #1e5a85;
```

**Usage:** Status indicators, alerts, validation feedback

### Neutral Colors (Dark Theme Base)
```css
--color-neutral-0: #000000;      /* Pure black */
--color-neutral-50: #0a0d14;     /* Background */
--color-neutral-100: #12161f;    /* Surface */
--color-neutral-200: #1a1f2e;    /* Surface elevated */
--color-neutral-300: #242b3d;    /* Surface highest */
--color-neutral-400: #2f3749;
--color-neutral-500: #4a5268;
--color-neutral-600: #6b7280;    /* Text tertiary */
--color-neutral-700: #9ca3af;
--color-neutral-800: #b4bcd0;    /* Text secondary */
--color-neutral-900: #e5e7eb;
--color-neutral-950: #f9fafb;
--color-neutral-1000: #ffffff;   /* Text primary */
```

### Metallic/Tier Colors
```css
--color-gold: #ffd700;
--color-silver: #c0c0c0;
--color-bronze: #cd7f32;
--color-platinum: #e5e4e2;
```

**Usage:** Leaderboard tiers, achievements, premium features

---

## Typography

### Font Families
```css
--font-display: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
```

**Import:**
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet">
```

### Font Sizes
```css
/* Display sizes (headings, hero text) */
--font-size-xs: 0.75rem;      /* 12px */
--font-size-sm: 0.875rem;     /* 14px */
--font-size-base: 1rem;       /* 16px */
--font-size-lg: 1.125rem;     /* 18px */
--font-size-xl: 1.25rem;      /* 20px */
--font-size-2xl: 1.5rem;      /* 24px */
--font-size-3xl: 1.875rem;    /* 30px */
--font-size-4xl: 2.25rem;     /* 36px */
--font-size-5xl: 3rem;        /* 48px */
```

### Font Weights
```css
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
--font-weight-extrabold: 800;
--font-weight-black: 900;
```

### Line Heights
```css
--line-height-tight: 1.2;     /* Headings */
--line-height-snug: 1.375;
--line-height-normal: 1.5;    /* Body text */
--line-height-relaxed: 1.625;
--line-height-loose: 1.75;
```

### Letter Spacing
```css
--letter-spacing-tight: -0.02em;
--letter-spacing-normal: 0;
--letter-spacing-wide: 0.025em;
--letter-spacing-wider: 0.05em;
--letter-spacing-widest: 0.1em;
```

### Typography Scale
```css
/* Heading styles */
.heading-1 {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-black);
  line-height: var(--line-height-tight);
  letter-spacing: var(--letter-spacing-tight);
}

.heading-2 {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-extrabold);
  line-height: var(--line-height-tight);
}

.heading-3 {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-snug);
}

.heading-4 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-snug);
}

.heading-5 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-snug);
}

/* Body styles */
.body-large {
  font-size: var(--font-size-lg);
  line-height: var(--line-height-relaxed);
}

.body-base {
  font-size: var(--font-size-base);
  line-height: var(--line-height-normal);
}

.body-small {
  font-size: var(--font-size-sm);
  line-height: var(--line-height-normal);
}

.caption {
  font-size: var(--font-size-xs);
  line-height: var(--line-height-normal);
  color: var(--color-neutral-600);
}
```

---

## Spacing System

### Base Unit: 4px
```css
--space-0: 0;
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
```

### Spacing Guidelines
- **Tight spacing:** 4px-8px (related elements, icon gaps)
- **Normal spacing:** 12px-16px (component padding, form fields)
- **Loose spacing:** 24px-32px (section spacing, cards)
- **Extra loose:** 48px+ (major sections, page layout)

---

## Border Radius

```css
--radius-none: 0;
--radius-sm: 0.25rem;   /* 4px */
--radius-base: 0.5rem;  /* 8px */
--radius-md: 0.75rem;   /* 12px */
--radius-lg: 1rem;      /* 16px */
--radius-xl: 1.5rem;    /* 24px */
--radius-2xl: 2rem;     /* 32px */
--radius-full: 9999px;  /* Pills, circles */
```

### Usage Guidelines
- **Buttons:** --radius-md (12px)
- **Cards:** --radius-lg (16px)
- **Modals:** --radius-xl (24px)
- **Input fields:** --radius-base (8px)
- **Badges/Pills:** --radius-full
- **Avatar images:** --radius-full

---

## Shadows

### Elevation System
```css
--shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
--shadow-base: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
--shadow-md: 0 6px 12px rgba(0, 0, 0, 0.15), 0 3px 6px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 20px rgba(0, 0, 0, 0.2), 0 6px 10px rgba(0, 0, 0, 0.15);
--shadow-xl: 0 20px 40px rgba(0, 0, 0, 0.25), 0 10px 20px rgba(0, 0, 0, 0.2);
--shadow-2xl: 0 30px 60px rgba(0, 0, 0, 0.3), 0 15px 30px rgba(0, 0, 0, 0.25);
```

### Colored Shadows (Brand)
```css
--shadow-primary: 0 4px 16px rgba(0, 212, 170, 0.25);
--shadow-primary-lg: 0 10px 30px rgba(0, 212, 170, 0.35);
--shadow-secondary: 0 4px 16px rgba(99, 102, 241, 0.25);
--shadow-danger: 0 4px 16px rgba(255, 71, 87, 0.25);
--shadow-success: 0 4px 16px rgba(46, 213, 115, 0.25);
```

### Inner Shadows
```css
--shadow-inner: inset 0 2px 4px rgba(0, 0, 0, 0.06);
--shadow-inner-lg: inset 0 4px 8px rgba(0, 0, 0, 0.1);
```

---

## Animations

### Durations
```css
--duration-instant: 100ms;
--duration-fast: 150ms;
--duration-normal: 300ms;
--duration-slow: 500ms;
--duration-slower: 700ms;
```

### Easing Functions
```css
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-spring: cubic-bezier(0.68, -0.55, 0.265, 1.55);
--ease-smooth: cubic-bezier(0.25, 0.46, 0.45, 0.94);
```

### Common Animations
```css
/* Fade in */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide up */
@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* Slide down */
@keyframes slideDown {
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* Scale in */
@keyframes scaleIn {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

/* Pulse glow */
@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 0 20px var(--shadow-primary); }
  50% { box-shadow: 0 0 40px var(--shadow-primary-lg); }
}

/* Spin (loading) */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

### Micro-interactions
```css
/* Button hover */
.button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
  transition: all var(--duration-fast) var(--ease-out);
}

/* Button active */
.button:active {
  transform: translateY(0) scale(0.98);
  transition: all var(--duration-instant) var(--ease-in);
}

/* Card hover */
.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
  transition: all var(--duration-normal) var(--ease-smooth);
}
```

---

## Component Library

### Buttons

#### Primary Button
```css
.btn-primary {
  padding: var(--space-3) var(--space-6);
  background: linear-gradient(135deg, var(--color-primary-500), #00ff88);
  border: none;
  border-radius: var(--radius-md);
  color: #000;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  box-shadow: var(--shadow-primary);
  transition: all var(--duration-fast) var(--ease-out);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-primary-lg);
}

.btn-primary:active {
  transform: translateY(0) scale(0.98);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}
```

#### Secondary Button
```css
.btn-secondary {
  padding: var(--space-3) var(--space-6);
  background: var(--color-neutral-200);
  border: 2px solid var(--color-neutral-400);
  border-radius: var(--radius-md);
  color: var(--color-neutral-1000);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}

.btn-secondary:hover {
  background: var(--color-neutral-300);
  border-color: var(--color-primary-500);
}
```

#### Ghost Button
```css
.btn-ghost {
  padding: var(--space-3) var(--space-6);
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  color: var(--color-neutral-800);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}

.btn-ghost:hover {
  background: var(--color-neutral-200);
  color: var(--color-neutral-1000);
}
```

#### Icon Button
```css
.btn-icon {
  width: 44px;
  height: 44px;
  padding: 0;
  background: var(--color-neutral-200);
  border: none;
  border-radius: var(--radius-md);
  color: var(--color-neutral-800);
  font-size: var(--font-size-lg);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--duration-fast) var(--ease-out);
}

.btn-icon:hover {
  background: var(--color-neutral-300);
  color: var(--color-neutral-1000);
}
```

### Cards

#### Base Card
```css
.card {
  background: var(--color-neutral-100);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
  transition: all var(--duration-normal) var(--ease-smooth);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: rgba(255, 255, 255, 0.15);
}
```

#### Glassmorphic Card
```css
.card-glass {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-md);
}
```

#### Elevated Card
```css
.card-elevated {
  background: var(--color-neutral-200);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-lg);
}
```

### Input Fields

```css
.input {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  background: var(--color-neutral-200);
  border: 2px solid var(--color-neutral-400);
  border-radius: var(--radius-base);
  color: var(--color-neutral-1000);
  font-size: var(--font-size-base);
  font-family: var(--font-body);
  transition: all var(--duration-fast) var(--ease-out);
}

.input:focus {
  outline: none;
  border-color: var(--color-primary-500);
  background: var(--color-neutral-300);
  box-shadow: 0 0 0 3px rgba(0, 212, 170, 0.1);
}

.input::placeholder {
  color: var(--color-neutral-600);
}

.input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### Badges

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
}

.badge-primary {
  background: rgba(0, 212, 170, 0.15);
  color: var(--color-primary-500);
  border: 1px solid rgba(0, 212, 170, 0.3);
}

.badge-secondary {
  background: rgba(99, 102, 241, 0.15);
  color: var(--color-secondary-500);
  border: 1px solid rgba(99, 102, 241, 0.3);
}

.badge-success {
  background: rgba(46, 213, 115, 0.15);
  color: var(--color-success-500);
  border: 1px solid rgba(46, 213, 115, 0.3);
}

.badge-warning {
  background: rgba(255, 165, 2, 0.15);
  color: var(--color-warning-500);
  border: 1px solid rgba(255, 165, 2, 0.3);
}

.badge-danger {
  background: rgba(255, 71, 87, 0.15);
  color: var(--color-danger-500);
  border: 1px solid rgba(255, 71, 87, 0.3);
}
```

### Progress Bars

```css
.progress {
  width: 100%;
  height: var(--space-2);
  background: var(--color-neutral-300);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary-500), #00ff88);
  border-radius: var(--radius-full);
  transition: width var(--duration-normal) var(--ease-smooth);
}

.progress-fill-animated {
  background: linear-gradient(90deg,
    var(--color-primary-500) 0%,
    #00ff88 50%,
    var(--color-primary-500) 100%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

### Modals

```css
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
  animation: fadeIn var(--duration-normal) var(--ease-out);
}

.modal {
  background: var(--color-neutral-100);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  max-width: 480px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: var(--shadow-2xl);
  animation: slideUp var(--duration-normal) var(--ease-spring);
}
```

### Toasts

```css
.toast {
  background: var(--color-neutral-200);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-md);
  padding: var(--space-4) var(--space-6);
  box-shadow: var(--shadow-lg);
  display: flex;
  align-items: center;
  gap: var(--space-3);
  min-width: 300px;
  animation: slideUp var(--duration-normal) var(--ease-spring);
}

.toast-success {
  border-left: 4px solid var(--color-success-500);
}

.toast-error {
  border-left: 4px solid var(--color-danger-500);
}

.toast-warning {
  border-left: 4px solid var(--color-warning-500);
}

.toast-info {
  border-left: 4px solid var(--color-info-500);
}
```

---

## Loading States

### Skeleton Loaders
```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-neutral-200) 25%,
    var(--color-neutral-300) 50%,
    var(--color-neutral-200) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-base);
}

.skeleton-text {
  height: 1em;
  margin-bottom: var(--space-2);
}

.skeleton-heading {
  height: 2em;
  width: 60%;
  margin-bottom: var(--space-4);
}

.skeleton-avatar {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-full);
}

.skeleton-card {
  height: 200px;
  border-radius: var(--radius-lg);
}
```

### Spinners
```css
.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--color-neutral-400);
  border-top-color: var(--color-primary-500);
  border-radius: var(--radius-full);
  animation: spin var(--duration-slower) linear infinite;
}

.spinner-sm {
  width: 24px;
  height: 24px;
  border-width: 3px;
}

.spinner-lg {
  width: 64px;
  height: 64px;
  border-width: 5px;
}
```

---

## Responsive Breakpoints

```css
/* Mobile first approach */
@media (min-width: 480px) {
  /* Small tablets */
}

@media (min-width: 768px) {
  /* Tablets */
}

@media (min-width: 1024px) {
  /* Laptops */
}

@media (min-width: 1280px) {
  /* Desktops */
}

@media (min-width: 1536px) {
  /* Large desktops */
}
```

---

## Accessibility Guidelines

### Color Contrast
- Text on dark background: Minimum 4.5:1 ratio (WCAG AA)
- Large text (18px+): Minimum 3:1 ratio
- UI components: Minimum 3:1 ratio

### Focus States
```css
*:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}
```

### Touch Targets
- Minimum size: 44x44px on mobile
- Minimum spacing: 8px between interactive elements

### Motion Preferences
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Z-Index Scale

```css
--z-base: 0;
--z-dropdown: 100;
--z-sticky: 200;
--z-overlay: 300;
--z-modal: 400;
--z-toast: 500;
--z-tooltip: 600;
```

---

## Usage Examples

### Hero Section
```html
<div class="hero">
  <h1 class="heading-1">
    Detect AI-Generated Images
  </h1>
  <p class="body-large" style="color: var(--color-neutral-800);">
    Advanced detection with 90%+ accuracy. Free to use.
  </p>
  <button class="btn-primary">
    Start Scanning
  </button>
</div>
```

### Scan Result Card
```html
<div class="card">
  <div class="badge-danger">AI-Generated</div>
  <h3 class="heading-4">95% Confidence</h3>
  <div class="progress">
    <div class="progress-fill" style="width: 95%;"></div>
  </div>
  <p class="body-small" style="color: var(--color-neutral-600);">
    This image shows strong AI artifacts.
  </p>
</div>
```

---

## Design Tokens File

All tokens are available in `index.html` as CSS custom properties under `:root`.

**Quick Reference:**
- Colors: `--color-{scale}-{shade}`
- Spacing: `--space-{number}`
- Typography: `--font-{property}`
- Shadows: `--shadow-{size}`
- Radius: `--radius-{size}`
- Animations: `--duration-{speed}`, `--ease-{type}`

---

**Version History:**
- 2.0.0 (Dec 20, 2025) - Complete modern redesign
- 1.0.0 (Initial) - Original dark theme system
