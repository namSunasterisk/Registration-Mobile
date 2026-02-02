<!-- .github/copilot-instructions.md - guidance for AI coding agents -->
# Copilot instructions for this repo

Purpose
- Help AI coding agents be immediately productive in this Playwright test repository.

Big picture
- This is a small Playwright Test suite: tests live under [tests](tests) and use `@playwright/test` with TypeScript. The runner configuration is in [playwright.config.ts](playwright.config.ts).
- Tests drive a browser (default `chromium`) and are configured to run non-headless (`headless: false`) in the current config.

Quick developer workflows (explicit commands)
- Install Playwright browsers: `npx playwright install`
- Run the full test suite: `npx playwright test`
- Run a single spec file: `npx playwright test tests/example.spec.ts`
- Run by test title (grep): `npx playwright test -g "example test"`
- Show the HTML report (after tests): `npx playwright show-report`
- Suggested package.json script: `"test": "playwright test"` (add to [package.json](package.json)).

Project-specific conventions and patterns
- Tests are written in TypeScript (`*.spec.ts`) and live in the `tests/` folder. Keep new tests under `tests/`.
- Use the Playwright Test API: `test`, `expect`, `page`, and `locator` (see [tests/example.spec.ts](tests/example.spec.ts)).
- Prefer `page.locator(selector)` for stable interaction; `getByRole` is used when accessibility roles are available.
- Example uses CSS attribute selector for error visibility: `"[style*='block']"` — look for this pattern when updating assertions.
- Debugging: the repo uses `console.log` in examples; use `page.pause()` for interactive debugging or `headless: true` in CI.

Config notes to preserve
- The canonical config is [playwright.config.ts](playwright.config.ts). Important fields:
  - `testDir: './tests'` — where tests live
  - `timeout` and `expect.timeout` — global timeouts
  - `use.browserName` and `use.headless` — default browser behavior

TypeScript & tooling
- Dev dependencies are declared in [package.json](package.json); currently `@playwright/test` and `@types/node` are present. Tests run via the Playwright test runner (no separate build step required).

Integration points & external dependencies
- Tests visit external sites (see example spec visiting rahulshettyacademy.com). Be careful when recording network-dependent tests; prefer test doubles or stable test fixtures when possible.

What an AI agent should do first (practical checklist)
- Run `npx playwright install` then `npx playwright test` to verify baseline passing/failing tests.
- If adding tests, place them in `tests/` and name `*.spec.ts`.
- When editing browser settings or timeouts, update [playwright.config.ts](playwright.config.ts).
- Add a `test` script to [package.json](package.json) if you modify CI or local developer flows.

Examples (copyable)
- Run suite: `npx playwright test`
- Run single test: `npx playwright test tests/example.spec.ts`
- Add package script:
  ```json
  "scripts": { "test": "playwright test" }
  ```

If anything above is unclear or you'd like more detail about CI, browser matrix, or TypeScript setup, ask and I'll iterate.
