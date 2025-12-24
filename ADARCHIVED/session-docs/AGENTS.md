# Repository Guidelines

## Project Structure & Module Organization
This repository is a single-page web app with supporting assets and scripts.
- `index.html` is the primary app (HTML, CSS, and JS live together here).
- `sw.js`, `manifest.json`, `_headers`, `_redirects` support the PWA and Cloudflare Pages hosting.
- Feature modules and styles live in standalone files such as `ai-cosmetics-gacha.js`, `avatar-cosmetics-system.js`, `tank-shooter-enhanced.js`, `PROFESSIONAL_UI_OVERHAUL.css`.
- `supabase/` contains SQL schema, security, and content migrations.
- `tests/` holds Playwright specs; `test-results/` is generated output.
- `social-media/` contains marketing assets.

## Build, Test, and Development Commands
There is no build step; run locally with a static server.
```bash
pnpm install
npx serve .
python -m http.server 8000
npx playwright test
npx playwright test tests/deep-scan.spec.js
```
`npm test` is currently a placeholder and will exit with an error.

## Coding Style & Naming Conventions
- Follow the formatting already present in the file you edit (4-space indentation, semicolons in JS).
- Keep CSS tokens in `:root` and extend them instead of hardcoding new colors.
- Use `camelCase` for JS functions/variables, `PascalCase` for classes, and `kebab-case` for CSS classes and filenames.
- When adding UI or logic, place new blocks adjacent to the related feature section in `index.html` to keep the file navigable.

## Testing Guidelines
- Playwright is the primary test runner; specs live in `tests/*.spec.js`.
- Name new specs after the feature (`scan-basic.spec.js`, `deep-scan.spec.js`).
- If you change scan flows or navigation, update or add a spec and include a brief note on what you validated.

## Commit & Pull Request Guidelines
- Commit messages typically use a short prefix plus description, e.g. `Fix: Deep scan stability`, `Feature: Tank upgrades in shop`, `UI/UX improvements: VERA animations`.
- PRs should include a summary, test command/results, and screenshots or short clips for UI changes; link issues or session notes when applicable.

## Security & Configuration
- Supabase config is embedded in `index.html` and documented in `.env.example`; do not add new secrets to the repo.
- Place SQL changes in `supabase/` with clear filenames.
- If you change behavior, add a brief entry in `CLAUDE.md` describing what you touched.
