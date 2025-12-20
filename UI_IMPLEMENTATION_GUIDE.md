# UI Implementation Guide
**AuthenticaDetector Design System v2.0**
**Last Updated:** Dec 20, 2025

---

## Quick Start

### 1. Understanding the Design System

The design system consists of three key files:

1. **UI_DESIGN_SYSTEM.md** - Complete design documentation
2. **UI_COMPONENTS.css** - Reusable component library
3. **index.html** - Application with design tokens embedded

### 2. How to Use Design Tokens

All design tokens are defined as CSS custom properties in the `:root` selector of `index.html`. Use them throughout your code for consistency.

#### Color Example
```css
/* ❌ BAD - Hard-coded color */
background: #00d4aa;

/* ✅ GOOD - Using design token */
background: var(--color-primary-500);
```

#### Spacing Example
```css
/* ❌ BAD - Magic number */
padding: 16px;

/* ✅ GOOD - Using spacing token */
padding: var(--space-4);
```

### 3. Using Pre-Built Components

Import `UI_COMPONENTS.css` to access all pre-built components:

```html
<link rel="stylesheet" href="UI_COMPONENTS.css">
```

Then use component classes:

```html
<!-- Primary button -->
<button class="btn-primary">Click Me</button>

<!-- Card with hover effect -->
<div class="card card-hoverable">
  <div class="card-header">
    <h3 class="card-title">Title</h3>
  </div>
  <div class="card-body">
    Content goes here
  </div>
</div>
```

---

## Component Usage Examples

### Buttons

```html
<!-- Primary CTA -->
<button class="btn-primary">
  Start Scanning
</button>

<!-- Secondary action -->
<button class="btn-secondary">
  Learn More
</button>

<!-- Ghost button -->
<button class="btn-ghost">
  Cancel
</button>

<!-- Icon button -->
<button class="btn-icon">
  <i class="icon-close"></i>
</button>

<!-- Button with icon -->
<button class="btn-primary">
  <i class="icon-scan"></i>
  Scan Image
</button>

<!-- Full width button -->
<button class="btn-primary btn-block">
  Continue
</button>

<!-- Small button -->
<button class="btn-primary btn-sm">
  Small
</button>

<!-- Large button -->
<button class="btn-primary btn-lg">
  Large
</button>
```

### Cards

```html
<!-- Basic card -->
<div class="card">
  <h3>Card Title</h3>
  <p>Card content</p>
</div>

<!-- Card with hover effect -->
<div class="card card-hoverable">
  <div class="card-header">
    <h3 class="card-title">Scan Results</h3>
    <button class="btn-icon">⋯</button>
  </div>
  <div class="card-body">
    <p>This image appears to be AI-generated.</p>
  </div>
  <div class="card-footer">
    <button class="btn-secondary">View Details</button>
  </div>
</div>

<!-- Glassmorphic card -->
<div class="card-glass">
  <h3>Glassmorphism</h3>
  <p>Beautiful translucent effect</p>
</div>

<!-- Elevated card -->
<div class="card-elevated">
  <h3>Elevated</h3>
  <p>Higher elevation with stronger shadow</p>
</div>

<!-- Gradient border card -->
<div class="card-gradient-border">
  <h3>Gradient Border</h3>
  <p>Premium look with gradient outline</p>
</div>
```

### Form Inputs

```html
<!-- Input group -->
<div class="input-group">
  <label class="input-label">Email Address</label>
  <input type="email" class="input" placeholder="you@example.com">
  <span class="input-hint">We'll never share your email</span>
</div>

<!-- Input with error -->
<div class="input-group">
  <label class="input-label">Password</label>
  <input type="password" class="input input-error" placeholder="••••••••">
  <span class="input-error-message">Password must be at least 8 characters</span>
</div>

<!-- Textarea -->
<div class="input-group">
  <label class="input-label">Description</label>
  <textarea class="input textarea" placeholder="Enter description..."></textarea>
</div>
```

### Badges

```html
<!-- Status badges -->
<span class="badge badge-success">✓ Verified</span>
<span class="badge badge-warning">⚠ Pending</span>
<span class="badge badge-danger">✗ Rejected</span>
<span class="badge badge-primary">New</span>
<span class="badge badge-secondary">Beta</span>

<!-- Large badge -->
<span class="badge badge-primary badge-lg">Premium</span>
```

### Progress Bars

```html
<!-- Basic progress -->
<div class="progress">
  <div class="progress-fill" style="width: 75%;"></div>
</div>

<!-- Animated progress -->
<div class="progress">
  <div class="progress-fill progress-fill-animated" style="width: 50%;"></div>
</div>

<!-- Colored progress -->
<div class="progress">
  <div class="progress-fill progress-fill-success" style="width: 100%;"></div>
</div>

<div class="progress">
  <div class="progress-fill progress-fill-warning" style="width: 60%;"></div>
</div>

<div class="progress">
  <div class="progress-fill progress-fill-danger" style="width: 30%;"></div>
</div>

<!-- Size variants -->
<div class="progress progress-sm">
  <div class="progress-fill" style="width: 45%;"></div>
</div>

<div class="progress progress-lg">
  <div class="progress-fill" style="width: 85%;"></div>
</div>
```

### Modals

```html
<!-- Modal overlay -->
<div class="modal-overlay">
  <div class="modal">
    <div class="modal-header">
      <h2 class="modal-title">Confirm Action</h2>
      <button class="modal-close">×</button>
    </div>
    <div class="modal-body">
      <p>Are you sure you want to proceed?</p>
    </div>
    <div class="modal-footer">
      <button class="btn-ghost">Cancel</button>
      <button class="btn-primary">Confirm</button>
    </div>
  </div>
</div>
```

### Toasts

```html
<!-- Toast container (fixed position) -->
<div class="toast-container">
  <!-- Success toast -->
  <div class="toast toast-success">
    <div class="toast-icon">✓</div>
    <div class="toast-content">
      <div class="toast-title">Success!</div>
      <div class="toast-message">Image scanned successfully</div>
    </div>
  </div>

  <!-- Error toast -->
  <div class="toast toast-error">
    <div class="toast-icon">✗</div>
    <div class="toast-content">
      <div class="toast-title">Error</div>
      <div class="toast-message">Failed to upload image</div>
    </div>
  </div>

  <!-- Warning toast -->
  <div class="toast toast-warning">
    <div class="toast-icon">⚠</div>
    <div class="toast-content">
      <div class="toast-title">Warning</div>
      <div class="toast-message">File size exceeds 10MB</div>
    </div>
  </div>

  <!-- Info toast -->
  <div class="toast toast-info">
    <div class="toast-icon">ℹ</div>
    <div class="toast-content">
      <div class="toast-title">Info</div>
      <div class="toast-message">Deep scan may take longer</div>
    </div>
  </div>
</div>
```

### Loading States

```html
<!-- Spinner -->
<div class="spinner"></div>
<div class="spinner spinner-sm"></div>
<div class="spinner spinner-lg"></div>

<!-- Skeleton loaders -->
<div class="skeleton skeleton-heading"></div>
<div class="skeleton skeleton-text"></div>
<div class="skeleton skeleton-text" style="width: 80%;"></div>
<div class="skeleton skeleton-text" style="width: 60%;"></div>

<div class="skeleton skeleton-avatar"></div>

<div class="skeleton skeleton-card"></div>

<div class="skeleton skeleton-btn"></div>
```

### Empty States

```html
<div class="empty-state">
  <div class="empty-state-icon">📭</div>
  <h3 class="empty-state-title">No Results Found</h3>
  <p class="empty-state-description">
    We couldn't find any images matching your criteria.
    Try adjusting your filters.
  </p>
  <button class="btn-primary">Clear Filters</button>
</div>
```

### Avatars

```html
<!-- Avatar with initials -->
<div class="avatar">JD</div>

<!-- Avatar with image -->
<div class="avatar">
  <img src="user-photo.jpg" alt="User">
</div>

<!-- Size variants -->
<div class="avatar avatar-sm">SM</div>
<div class="avatar">MD</div>
<div class="avatar avatar-lg">LG</div>
<div class="avatar avatar-xl">XL</div>
```

### Dropdowns

```html
<div class="dropdown">
  <button class="btn-secondary">Options ▼</button>
  <div class="dropdown-menu">
    <button class="dropdown-item">
      <i class="icon-edit"></i> Edit
    </button>
    <button class="dropdown-item">
      <i class="icon-share"></i> Share
    </button>
    <div class="dropdown-divider"></div>
    <button class="dropdown-item">
      <i class="icon-trash"></i> Delete
    </button>
  </div>
</div>
```

### Dividers

```html
<!-- Horizontal divider -->
<div class="divider"></div>

<!-- Divider with text -->
<div class="divider-text">OR</div>

<!-- Vertical divider (in flex container) -->
<div style="display: flex;">
  <div>Left content</div>
  <div class="divider-vertical"></div>
  <div>Right content</div>
</div>
```

---

## Layout Patterns

### Two-Column Layout

```html
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-6);">
  <div class="card">Column 1</div>
  <div class="card">Column 2</div>
</div>
```

### Three-Column Grid

```html
<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-4);">
  <div class="card">Card 1</div>
  <div class="card">Card 2</div>
  <div class="card">Card 3</div>
</div>
```

### Responsive Grid

```html
<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: var(--space-4);">
  <div class="card">Card 1</div>
  <div class="card">Card 2</div>
  <div class="card">Card 3</div>
  <div class="card">Card 4</div>
</div>
```

### Flexbox Row

```html
<div style="display: flex; gap: var(--space-4); align-items: center;">
  <div class="avatar">JD</div>
  <div style="flex: 1;">
    <h3>John Doe</h3>
    <p style="color: var(--color-neutral-700);">Software Engineer</p>
  </div>
  <button class="btn-icon">→</button>
</div>
```

---

## Common Patterns

### Scan Result Card

```html
<div class="card card-hoverable">
  <div class="card-header">
    <div style="display: flex; align-items: center; gap: var(--space-3);">
      <div style="width: 50px; height: 50px; border-radius: var(--radius-md); background: linear-gradient(135deg, var(--color-danger-500), #ff6b7a); display: flex; align-items: center; justify-content: center; font-size: 24px;">
        🤖
      </div>
      <div>
        <h3 class="card-title">AI-Generated</h3>
        <p style="font-size: var(--font-size-sm); color: var(--color-neutral-700); margin: 0;">95% Confidence</p>
      </div>
    </div>
  </div>
  <div class="card-body">
    <div style="margin-bottom: var(--space-4);">
      <span class="badge badge-danger">High Confidence</span>
    </div>
    <div class="progress progress-lg">
      <div class="progress-fill progress-fill-danger" style="width: 95%;"></div>
    </div>
    <div style="display: flex; justify-content: space-between; margin-top: var(--space-2); font-size: var(--font-size-xs); color: var(--color-neutral-600);">
      <span>Real</span>
      <span>AI</span>
    </div>
  </div>
  <div class="card-footer">
    <button class="btn-secondary" style="flex: 1;">View Details</button>
    <button class="btn-primary" style="flex: 1;">Share</button>
  </div>
</div>
```

### Leaderboard Entry

```html
<div class="card" style="display: flex; align-items: center; gap: var(--space-4);">
  <div style="width: 32px; height: 32px; border-radius: var(--radius-base); background: linear-gradient(135deg, var(--color-primary-500), #00ff88); display: flex; align-items: center; justify-content: center; font-weight: var(--font-weight-black); color: #000;">
    1
  </div>
  <div class="avatar">
    <img src="user.jpg" alt="User">
  </div>
  <div style="flex: 1;">
    <h4 style="margin: 0; font-size: var(--font-size-base); font-weight: var(--font-weight-bold);">John Doe</h4>
    <p style="margin: 0; font-size: var(--font-size-xs); color: var(--color-neutral-600);">127 scans • Level 8</p>
  </div>
  <div style="text-align: right;">
    <div style="font-size: var(--font-size-lg); font-weight: var(--font-weight-extrabold); color: var(--color-primary-500);">1,250</div>
    <span class="badge badge-primary">King</span>
  </div>
</div>
```

### Profile Stats Grid

```html
<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-3);">
  <div class="card" style="text-align: center;">
    <div style="font-size: var(--font-size-2xl); font-weight: var(--font-weight-extrabold); background: linear-gradient(135deg, var(--color-primary-500), #00ff88); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
      1,234
    </div>
    <div style="font-size: var(--font-size-xs); color: var(--color-neutral-600); margin-top: var(--space-1);">
      Scans
    </div>
  </div>
  <div class="card" style="text-align: center;">
    <div style="font-size: var(--font-size-2xl); font-weight: var(--font-weight-extrabold); background: linear-gradient(135deg, var(--color-primary-500), #00ff88); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
      567
    </div>
    <div style="font-size: var(--font-size-xs); color: var(--color-neutral-600); margin-top: var(--space-1);">
      Badges
    </div>
  </div>
  <div class="card" style="text-align: center;">
    <div style="font-size: var(--font-size-2xl); font-weight: var(--font-weight-extrabold); background: linear-gradient(135deg, var(--color-primary-500), #00ff88); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
      89
    </div>
    <div style="font-size: var(--font-size-xs); color: var(--color-neutral-600); margin-top: var(--space-1);">
      Rank
    </div>
  </div>
</div>
```

---

## Animation Cookbook

### Button Hover Effect

```css
.custom-button {
  transition: all var(--duration-fast) var(--ease-out);
}

.custom-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.custom-button:active {
  transform: translateY(0) scale(0.98);
}
```

### Card Entrance Animation

```css
.card-enter {
  animation: slideUp var(--duration-normal) var(--ease-spring);
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
```

### Pulsing Glow Effect

```css
.glow-element {
  animation: pulseGlow 2s ease-in-out infinite;
}

@keyframes pulseGlow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(0, 212, 170, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(0, 212, 170, 0.5);
  }
}
```

---

## Accessibility Checklist

### Colors
- ✅ All text has minimum 4.5:1 contrast ratio
- ✅ Large text (18px+) has minimum 3:1 contrast
- ✅ Interactive elements have 3:1 contrast against background

### Keyboard Navigation
- ✅ All interactive elements are keyboard accessible
- ✅ Focus states are clearly visible
- ✅ Tab order is logical

### Touch Targets
- ✅ All buttons are minimum 44x44px on mobile
- ✅ Interactive elements have 8px spacing

### Motion
- ✅ Respects `prefers-reduced-motion` setting
- ✅ Animations can be disabled

---

## Best Practices

### DO ✅
- Use design tokens for all colors, spacing, and typography
- Build with mobile-first approach
- Test on real devices, not just browser devtools
- Use semantic HTML elements
- Implement keyboard navigation
- Add loading states for async operations
- Provide clear error messages
- Use consistent spacing throughout

### DON'T ❌
- Hard-code color values
- Use magic numbers for spacing
- Ignore accessibility requirements
- Skip mobile testing
- Forget loading and empty states
- Use overly aggressive animations
- Mix design system styles with custom styles

---

## Troubleshooting

### Component Not Styling Correctly
1. Check that `UI_COMPONENTS.css` is imported
2. Verify class names match exactly (case-sensitive)
3. Check for conflicting styles in custom CSS
4. Inspect element in browser devtools

### Colors Not Showing
1. Ensure design tokens are defined in `:root`
2. Check for typos in variable names
3. Verify CSS custom properties are supported (IE11 requires polyfill)

### Animations Not Working
1. Check `prefers-reduced-motion` setting
2. Verify animation keyframes are defined
3. Check browser compatibility

### Responsive Issues
1. Use browser devtools device emulation
2. Test on real devices when possible
3. Check viewport meta tag is correct
4. Verify media query breakpoints

---

## Migration Guide (v1 → v2)

### Old Code
```css
/* v1 style */
.old-button {
  background: #00d4aa;
  padding: 12px 24px;
  border-radius: 12px;
}
```

### New Code
```css
/* v2 style using tokens */
.new-button {
  background: var(--color-primary-500);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-md);
}

/* Or use pre-built component */
<button class="btn-primary">Click Me</button>
```

### Component Mapping

| Old Class | New Class |
|-----------|-----------|
| `.scan-btn` | `.btn-primary` |
| `.result-card` | `.card` |
| `.status-chip` | `.badge badge-{variant}` |
| `.progress-bar` | `.progress` |
| `.modal` | `.modal` (enhanced) |

---

## Support & Resources

- **Design System:** `UI_DESIGN_SYSTEM.md`
- **Component Library:** `UI_COMPONENTS.css`
- **GitHub Issues:** Report bugs and request features
- **Documentation:** This guide

---

**Last Updated:** Dec 20, 2025
**Version:** 2.0.0
**Maintainer:** UX-Mobile Agent
