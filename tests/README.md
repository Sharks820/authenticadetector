# Tests Directory

This directory will contain all automated tests.

## Planned Structure

```
tests/
├── unit/              # Unit tests
│   ├── detection/       # Detection function tests
│   ├── auth/            # Auth tests
│   └── utils/           # Utility function tests
├── integration/       # Integration tests
│   ├── scan-flow/       # Full scan workflow
│   └── auth-flow/       # Full auth workflow
└── e2e/               # End-to-end tests
    └── smoke/           # Smoke tests
```

## Current State

**No tests exist yet.** This is a known issue.

## Test Framework (Recommended)

For this project, we recommend:
- **Unit Tests:** Vitest (fast, ESM-native)
- **Integration Tests:** Vitest
- **E2E Tests:** Playwright

## Priority Tests Needed

1. Detection accuracy tests (compare known images)
2. Auth flow tests (login, logout, session)
3. PWA install tests
4. Share target tests

## Adding Tests

Before migration, we need at minimum:
- Smoke tests for critical paths
- Baseline detection output tests
- Auth flow tests
