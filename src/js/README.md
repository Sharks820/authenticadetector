# JavaScript Directory

This directory will contain all JavaScript modules after migration from index.html.

## Planned Structure

```
js/
├── config.js          # Configuration constants
├── state.js           # Global state management
├── utils.js           # Helper functions
├── main.js            # Application entry point
├── detection/         # AI detection core
│   ├── index.js
│   ├── heuristics.js    # Noise, compression, color, edge analysis
│   ├── models.js        # AI model loading (ViT, CLIP)
│   ├── ensemble.js      # Multi-signal ensemble scoring
│   └── signatures.js    # Generator signature detection
├── auth/              # Authentication
│   ├── index.js
│   ├── supabase.js      # Supabase client
│   └── session.js       # Session management
├── ui/                # User interface
│   ├── index.js
│   ├── navigation.js    # View navigation
│   ├── toast.js         # Toast notifications
│   ├── progress.js      # Progress indicators
│   └── results.js       # Results display
├── data/              # Data layer
│   ├── index.js
│   ├── history.js       # Scan history
│   ├── leaderboard.js   # Leaderboard
│   └── badges.js        # Badge system
├── game/              # Game mechanics
│   ├── index.js
│   ├── shop.js          # Shop system
│   ├── quests.js        # Quest system
│   ├── inventory.js     # Inventory
│   └── rewards.js       # Rewards/points
└── pwa/               # Progressive Web App
    ├── index.js
    ├── install.js       # Install prompts
    └── share-target.js  # Share target handling
```

## Current State

All JavaScript is currently embedded in `index.html` (lines 1128-4490, ~3,362 lines).

## Migration Notes

- Use ES modules throughout
- Maintain backward compatibility via re-exports
- Detection module requires extensive testing before extraction
