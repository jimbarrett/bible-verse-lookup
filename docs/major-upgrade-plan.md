# Major upgrade plan — Next / React / Tailwind / Tooling

Date: 2025-09-11
Branch: `chore/update-safe-deps` (work-in-progress)

Goal
- Safely upgrade the app from Next 13 / React 18 / Tailwind 3 to newer major releases (Next 15, React 19, Tailwind 4) and the related tooling (ESLint, Jest, PostCSS) with minimal disruption.

Quick note about Node & nvm
- Using `nvm` is helpful: it lets you test upgrades cleanly by pinning a Node version per-branch via `.nvmrc`.
- Before major upgrades, check the official Next/React/Tailwind release notes for required Node versions and pin to that. Example workflow:
  - `nvm install 20` (or the version required by target Next/React)
  - `nvm use 20`
  - Create `.nvmrc` with the selected version and commit it.

High-level approach (phased)
1. Audit and prep (quick, safe changes)
   - Run `npm outdated` and capture current state (done).
   - Remove unused deps (`npm`, `install`, duplicates) and add `.nvmrc`.
   - Lock Node version and ensure CI uses it.

2. Small safe upgrades (one PR)
   - Upgrade testing libs, heroicons, sqlite patch releases, autoprefixer/postcss minor patches.
   - Run `npm install`, `npm test`, `npm run build`, and manual smoke tests.
   - Fix any lint warnings (separate small commits).

3. Next + React major upgrade (separate PR, stepwise)
   - Read Next.js upgrade guide for 13→14→15 and React 18→19 migration notes.
   - If Next 15 requires React 19, upgrade React and ReactDOM first in the same PR or in a tightly-coupled PR.
   - Update `eslint-config-next` to the matching version and adjust ESLint rules.
   - Update any Next config (`next.config.js`) per the migration guide (app dir, edges, webpack/webpack5, image handling, routing changes).
   - Replace any deprecated APIs (getInitialProps, legacy methods) with supported ones.
   - Run full test suite, build, and manual QA of main routes.

4. Tailwind 3 → 4 migration (separate PR)
   - Review Tailwind v4 migration notes; update `tailwind.config.js` and PostCSS pipeline if required.
   - Rebuild CSS, check styles in common pages and components (theme tokens, plugin APIs).

5. Jest / ESLint / tooling updates
   - Upgrade Jest to latest compatible with Node and JSDOM versions; update jest config and test environment if API changed.
   - Update jest-environment-jsdom and test helpers (e.g., @testing-library versions) as needed.
   - Fix any failing tests or update snapshots intentionally.

6. CI, lockfile, and release
   - Update CI to use the pinned Node version and `npm ci` or `pnpm` as chosen.
   - Commit `package-lock.json` after install.
   - Create release notes and a checklist for manual QA.

Rollback strategy
- Keep changes in a single feature branch per major upgrade.
- If the build/test fails in CI, revert the branch or revert the merge commit.
- Keep granular commits so you can revert only the sub-step (e.g., Tailwind changes) if needed.

Files likely to change
- `package.json` / `package-lock.json`
- `next.config.js`
- `tailwind.config.js` / PostCSS config
- ESLint config files (root or Next config)
- CI config (GitHub Actions, etc.) — ensure Node pinning
- Add `.nvmrc`

Testing and QA
- Automated:
  - Unit tests (Jest) — all tests must pass.
  - Build (`npm run build`) must succeed.
  - Lint (`npm run lint`) and type checks if present.
- Manual:
  - Boot dev server (`npm run dev`) and sanity-check core flows: lookup page, API routes (`/api/verse`, `/api/books`, version selection, database access).
  - Smoke test mobile and desktop views.

Commands and examples
- Set Node for the branch (example):
```bash
nvm install 20
nvm use 20
echo "20" > .nvmrc
git add .nvmrc && git commit -m "chore: pin Node version via .nvmrc"
```
- Upgrade a package safely (example):
```bash
npm install @testing-library/react@14.3.1 --save-dev
npm test -- --watchAll=false
npm run build
```
- After major upgrades, clean & reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
npm test -- --watchAll=false
npm run build
```

Risk matrix & mitigation
- Breaking API changes (Next/React): mitigate by reading official guides, upgrading in small steps, and running full CI.
- Styling regressions (Tailwind): mitigate by visual QA and targeted CSS tests.
- Test flakiness from Jest/JSDOM: pin JSDOM versions and update test setup gradually.

Estimate & timeline (rough)
- Prep & small upgrades: 1 day
- Next + React migration (dev + fixes + CI): 2–4 days depending on regressions
- Tailwind migration + style QA: 1–2 days
- Final CI fixes, docs, release notes: 0.5–1 day

Open questions for you
- Do you want me to remove `npm` and `install` from `devDependencies` now? (I left them for review.)
- Which Node version do you prefer to pin in `.nvmrc`? I can pick one after we check the Next/React target requirements.

If you want, I can start the first migration PR: (A) create `.nvmrc` and remove unused devDeps, (B) apply the remaining small "wanted" upgrades, and (C) run tests/build and commit results on this branch. Let me know which of those to do next.
