# CSS Directory

This directory will contain all stylesheets after migration from index.html.

## Planned Structure

```
css/
├── variables.css      # CSS custom properties (colors, spacing, shadows)
├── base.css           # Reset, typography, base element styles
├── components/        # Reusable component styles
│   ├── buttons.css
│   ├── cards.css
│   ├── forms.css
│   ├── modals.css
│   └── toast.css
├── views/             # View-specific styles
│   ├── home.css
│   ├── profile.css
│   ├── leaderboard.css
│   ├── shop.css
│   └── auth.css
└── main.css           # Import aggregator
```

## Current State

All CSS is currently embedded in `index.html` (lines 18-757, ~740 lines).

## Migration Notes

- CSS variables should be extracted first
- Maintain loading order: variables -> base -> components -> views
- Use `main.css` as single entry point with @import statements
