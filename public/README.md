# Public Directory

This directory contains static assets served directly by the web server.

## Contents

```
public/
├── icons/             # App icons
│   ├── icon-180.png     # Apple touch icon
│   ├── icon-192.png     # PWA icon (192x192)
│   └── icon-512.png     # PWA icon (512x512)
├── manifest.json      # PWA manifest
└── sw.js              # Service Worker
```

## Current State

Icons and manifest are currently in the root directory.
They will be moved here during reorganization.

## Service Worker

The service worker (`sw.js`) handles:
- Asset caching (cache-first strategy)
- Share target POST handling
- Offline support

**DO NOT MODIFY** the caching strategy without PM approval.
