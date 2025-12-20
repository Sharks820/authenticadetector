# Visual Design Reference Guide
**AuthenticaDetector Design System v2.0**
**Quick Reference for Developers**

---

## Color Palette Quick Reference

### Primary Colors (Cyan-Green)
```
█ #e6faf6  --color-primary-50   (Lightest - backgrounds, hover states)
█ #b3f0e6  --color-primary-100
█ #80e6d6  --color-primary-200
█ #4ddcc6  --color-primary-300
█ #1ad3b6  --color-primary-400
█ #00d4aa  --color-primary-500  ⭐ MAIN BRAND COLOR
█ #00b993  --color-primary-600
█ #009977  --color-primary-700  (Dim variant)
█ #007a5c  --color-primary-800
█ #005a40  --color-primary-900  (Darkest - text on light)
```

### Secondary Colors (Indigo)
```
█ #ededfe  --color-secondary-50
█ #d4d5fd  --color-secondary-100
█ #b9bafc  --color-secondary-200
█ #9fa1fa  --color-secondary-300
█ #8487f9  --color-secondary-400
█ #6366f1  --color-secondary-500  ⭐ MAIN SECONDARY
█ #5053d9  --color-secondary-600
█ #3d40c1  --color-secondary-700
█ #2b2da9  --color-secondary-800
█ #1a1b91  --color-secondary-900
```

### Semantic Colors
```
✓ SUCCESS:  #2ed573  --color-success-500   (Green)
⚠ WARNING:  #ffa502  --color-warning-500   (Orange)
✗ DANGER:   #ff4757  --color-danger-500    (Red)
ℹ INFO:     #3498db  --color-info-500      (Blue)
```

### Dark Theme Neutrals
```
█ #0a0d14  --color-neutral-50   (Background - darkest)
█ #12161f  --color-neutral-100  (Surface - cards)
█ #1a1f2e  --color-neutral-200  (Surface elevated)
█ #242b3d  --color-neutral-300  (Surface highest)
█ #6b7280  --color-neutral-600  (Text tertiary)
█ #b4bcd0  --color-neutral-800  (Text secondary)
█ #ffffff  --color-neutral-1000 (Text primary)
```

---

## Typography Scale

### Font Sizes
```
12px  --font-size-xs     (Captions, labels)
14px  --font-size-sm     (Small text, helper text)
16px  --font-size-base   (Body text, paragraphs)
18px  --font-size-lg     (Subheadings)
20px  --font-size-xl     (Section headers)
24px  --font-size-2xl    (Card titles)
30px  --font-size-3xl    (Page headers)
36px  --font-size-4xl    (Hero titles)
48px  --font-size-5xl    (Large hero text)
```

### Font Weights
```
400  --font-weight-normal     (Body text)
500  --font-weight-medium     (Emphasized text)
600  --font-weight-semibold   (Subheadings)
700  --font-weight-bold       (Headings)
800  --font-weight-extrabold  (Important headings)
900  --font-weight-black      (Hero text, display)
```

### Line Heights
```
1.2    --line-height-tight     (Headings, compact text)
1.375  --line-height-snug
1.5    --line-height-normal    ⭐ BODY TEXT DEFAULT
1.625  --line-height-relaxed
1.75   --line-height-loose     (Long-form content)
```

---

## Spacing Scale (8px Grid System)

```
0px   --space-0   (No spacing)
4px   --space-1   (Tiny gaps - icon spacing)
8px   --space-2   (Small gaps - tight elements)
12px  --space-3   (Input padding, button padding)
16px  --space-4   ⭐ DEFAULT SPACING (Card padding, margins)
20px  --space-5
24px  --space-6   (Section spacing)
32px  --space-8   (Large section spacing)
48px  --space-12  (Major section breaks)
64px  --space-16  (Page-level spacing)
96px  --space-24  (Extra large spacing)
```

**Usage Rule:** Always use multiples of 4px for consistency

---

## Border Radius

```
0px    --radius-none   (Sharp corners)
4px    --radius-sm     (Subtle rounding)
8px    --radius-base   (Input fields)
12px   --radius-md     ⭐ BUTTONS (Most common)
16px   --radius-lg     ⭐ CARDS (Most common)
24px   --radius-xl     (Modals, large cards)
32px   --radius-2xl    (Extra rounded)
9999px --radius-full   (Pills, circles, avatars)
```

---

## Shadow Elevation

### Standard Shadows
```
--shadow-xs     Barely visible, subtle depth
--shadow-sm     Slight elevation (default cards)
--shadow-base   Medium elevation
--shadow-md     Noticeable elevation (hover cards)
--shadow-lg     High elevation (modals)
--shadow-xl     Very high (overlays)
--shadow-2xl    Maximum elevation (critical dialogs)
```

### Colored Shadows (Brand)
```
--shadow-primary      Primary color glow (CTA buttons)
--shadow-primary-lg   Stronger primary glow (hover states)
--shadow-secondary    Secondary color glow
--shadow-danger       Red glow (delete buttons)
--shadow-success      Green glow (success states)
```

---

## Common Component Recipes

### Primary Button
```html
<button class="btn-primary">
  Click Me
</button>
```
**Visual:** Cyan-green gradient, white text, subtle glow, hover lift

---

### Card with Hover
```html
<div class="card card-hoverable">
  <div class="card-header">
    <h3 class="card-title">Title</h3>
  </div>
  <div class="card-body">
    Content
  </div>
</div>
```
**Visual:** Dark surface, rounded corners, shadow, lifts on hover

---

### Status Badge
```html
<span class="badge badge-success">✓ Verified</span>
<span class="badge badge-warning">⚠ Pending</span>
<span class="badge badge-danger">✗ Rejected</span>
```
**Visual:** Colored background, pill shape, uppercase text

---

### Progress Bar
```html
<div class="progress">
  <div class="progress-fill" style="width: 75%;"></div>
</div>
```
**Visual:** Gradient fill, smooth animation, rounded ends

---

### Modal Dialog
```html
<div class="modal-overlay">
  <div class="modal">
    <div class="modal-header">
      <h2 class="modal-title">Title</h2>
      <button class="modal-close">×</button>
    </div>
    <div class="modal-body">
      Content
    </div>
    <div class="modal-footer">
      <button class="btn-ghost">Cancel</button>
      <button class="btn-primary">Confirm</button>
    </div>
  </div>
</div>
```
**Visual:** Blurred backdrop, centered card, shadow elevation

---

### Toast Notification
```html
<div class="toast toast-success">
  <div class="toast-icon">✓</div>
  <div class="toast-content">
    <div class="toast-title">Success!</div>
    <div class="toast-message">Action completed</div>
  </div>
</div>
```
**Visual:** Slides in from right, colored accent border, auto-dismiss

---

### Form Input
```html
<div class="input-group">
  <label class="input-label">Email</label>
  <input type="email" class="input" placeholder="you@example.com">
  <span class="input-hint">We'll never share your email</span>
</div>
```
**Visual:** Dark background, border highlight on focus, helper text

---

### Loading Skeleton
```html
<div class="skeleton skeleton-heading"></div>
<div class="skeleton skeleton-text"></div>
<div class="skeleton skeleton-text" style="width: 80%;"></div>
```
**Visual:** Animated shimmer effect, placeholder for loading content

---

### Avatar with Image
```html
<div class="avatar">
  <img src="user.jpg" alt="User">
</div>
```
**Visual:** Circular, gradient border if no image, initials centered

---

## Animation Timing Reference

### Durations
```
100ms  --duration-instant   (Instant feedback - button press)
150ms  --duration-fast      ⭐ MOST COMMON (Hover effects)
300ms  --duration-normal    (Modal open/close)
500ms  --duration-slow      (Page transitions)
700ms  --duration-slower    (Loading spinners)
```

### Easing Functions
```
--ease-out      ⭐ DEFAULT (Smooth deceleration - most natural)
--ease-in       (Acceleration - less common)
--ease-in-out   (Smooth both ends - modals)
--ease-spring   (Bounce effect - playful interactions)
--ease-smooth   (Polished transitions - cards)
```

**Common Combination:**
```css
transition: all var(--duration-fast) var(--ease-out);
```

---

## Layout Patterns

### Two-Column Grid
```html
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-6);">
  <div class="card">Left</div>
  <div class="card">Right</div>
</div>
```

### Responsive Grid (Auto-fit)
```html
<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: var(--space-4);">
  <div class="card">Card 1</div>
  <div class="card">Card 2</div>
  <div class="card">Card 3</div>
</div>
```

### Flexbox Row with Gap
```html
<div style="display: flex; gap: var(--space-4); align-items: center;">
  <div class="avatar">JD</div>
  <div style="flex: 1;">
    <h3>John Doe</h3>
    <p>Software Engineer</p>
  </div>
  <button class="btn-icon">→</button>
</div>
```

---

## Accessibility Quick Checks

### Color Contrast
```
✓ Dark text (#ffffff) on dark bg (#0a0d14)     = 21:1 (Excellent)
✓ Secondary text (#b4bcd0) on dark bg          = 7.5:1 (Good)
✓ Tertiary text (#6b7280) on dark bg           = 4.6:1 (AA Pass)
✓ Primary button (#00d4aa) on black            = 11:1 (Excellent)
```

### Touch Targets
```
✓ Buttons: 44x44px minimum
✓ Icon buttons: 44x44px
✓ Form inputs: 44px height
✓ Cards: Tappable with 8px spacing
```

### Keyboard Navigation
```
✓ Tab through all interactive elements
✓ Focus ring visible (2px solid primary color)
✓ Enter/Space activates buttons
✓ Esc closes modals
```

---

## Browser DevTools Color Picker Values

**For quick copy-paste into browser devtools:**

```
Primary:    #00d4aa
Secondary:  #6366f1
Success:    #2ed573
Warning:    #ffa502
Danger:     #ff4757
Info:       #3498db

Background: #0a0d14
Surface:    #12161f
Text:       #ffffff
Text2:      #b4bcd0
Text3:      #6b7280
```

---

## Component Size Reference

### Buttons
```
Small:   padding: 8px 16px   (height ≈ 32px)
Medium:  padding: 12px 24px  (height ≈ 44px) ⭐ DEFAULT
Large:   padding: 16px 32px  (height ≈ 56px)
```

### Icons
```
Small:  16px × 16px
Medium: 24px × 24px  ⭐ DEFAULT
Large:  32px × 32px
XL:     48px × 48px
```

### Avatars
```
Small:  32px × 32px
Medium: 48px × 48px  ⭐ DEFAULT
Large:  64px × 64px
XL:     96px × 96px
```

### Cards
```
Padding: 24px (var(--space-6))
Border Radius: 16px (var(--radius-lg))
Min Width: None
Max Width: Application-dependent
```

---

## Common Mistakes to Avoid

### ❌ DON'T
```css
/* Hard-coded color */
background: #00d4aa;

/* Magic number spacing */
padding: 15px;

/* Inconsistent shadows */
box-shadow: 0 2px 8px rgba(0,0,0,0.15);

/* Missing transition */
.button:hover { transform: scale(1.05); }
```

### ✅ DO
```css
/* Use design tokens */
background: var(--color-primary-500);

/* Use spacing scale */
padding: var(--space-4);

/* Use shadow tokens */
box-shadow: var(--shadow-md);

/* Add smooth transition */
.button {
  transition: all var(--duration-fast) var(--ease-out);
}
.button:hover { transform: scale(1.05); }
```

---

## Responsive Breakpoints

```css
/* Mobile first (default) */
/* < 480px */

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

## Z-Index Layers

```
0    --z-base       (Default layer)
100  --z-dropdown   (Dropdown menus)
200  --z-sticky     (Sticky headers)
300  --z-overlay    (Modal backdrops)
400  --z-modal      (Modal dialogs)
500  --z-toast      (Toast notifications)
600  --z-tooltip    (Tooltips - highest)
```

**Rule:** Never use arbitrary z-index values, always use tokens

---

## Quick Decision Tree

### "What button should I use?"
- **Primary action?** → `.btn-primary`
- **Secondary action?** → `.btn-secondary`
- **Cancel/dismiss?** → `.btn-ghost`
- **Delete/remove?** → `.btn-danger`
- **Success/confirm?** → `.btn-success`
- **Icon only?** → `.btn-icon`

### "What card style should I use?"
- **Standard card?** → `.card`
- **Needs hover effect?** → `.card card-hoverable`
- **Want translucent effect?** → `.card-glass`
- **Needs more elevation?** → `.card-elevated`
- **Want gradient border?** → `.card-gradient-border`

### "What spacing should I use?"
- **Tight elements (icons)?** → `var(--space-1)` or `var(--space-2)`
- **Component padding?** → `var(--space-3)` or `var(--space-4)`
- **Section spacing?** → `var(--space-6)` or `var(--space-8)`
- **Major breaks?** → `var(--space-12)` or `var(--space-16)`

### "What animation timing?"
- **Button hover?** → `var(--duration-fast)` + `var(--ease-out)`
- **Modal open?** → `var(--duration-normal)` + `var(--ease-in-out)`
- **Playful bounce?** → `var(--duration-normal)` + `var(--ease-spring)`
- **Card hover?** → `var(--duration-normal)` + `var(--ease-smooth)`

---

## Cheat Sheet: Most Used Tokens

**Copy these to your clipboard for daily work:**

```css
/* Colors */
var(--color-primary-500)
var(--color-neutral-100)
var(--color-neutral-800)

/* Spacing */
var(--space-4)
var(--space-6)

/* Radius */
var(--radius-md)
var(--radius-lg)

/* Shadows */
var(--shadow-sm)
var(--shadow-md)

/* Animations */
transition: all var(--duration-fast) var(--ease-out);
```

---

**Quick Links:**
- Full Documentation: `UI_DESIGN_SYSTEM.md`
- Component Library: `UI_COMPONENTS.css`
- Implementation Guide: `UI_IMPLEMENTATION_GUIDE.md`
- Transformation Summary: `UI_TRANSFORMATION_SUMMARY.md`

**Version:** 2.0.0
**Last Updated:** December 20, 2025
