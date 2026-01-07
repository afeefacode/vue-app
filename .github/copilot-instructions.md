# GitHub Copilot instructions for @afeefa/vue-app (summary)

Purpose: short, actionable notes so an AI agent or a new dev can be productive quickly in this package.

## Big picture
- A small shared Vue 2 component & utility package used across multiple frontend projects. It exposes reusable UI components and helpers (see `docs/` for component docs/examples).
- This package is intended to be consumed by an application rather than run standalone — development usually happens by linking into a consuming app or by checking usage in the consuming repo.

## Key workflows & commands
- No heavy build pipeline inside the repo itself; check the consuming app's build for how components are compiled.
- Check `package.json` for dependencies and ensure compatibility with consuming apps (Vue 2 v2.7.x and decorators used here).

## Project-specific conventions
- Keep components and helpers small and opinionated — prefer explicit props and documented examples under `docs/components/`.
- Use `vue-class-component` / `vue-property-decorator` style for class-based components (see other Kollektiv frontends for usage examples).
- When changing shared behavior (auth models, date helpers, etc.) update all consuming apps or add migration notes in PR description.

## Integration & external dependencies
- Uses Vue 2.7.x and decorator-style class components — upgrading Vue may require refactors in consuming apps.
- Common dependencies: `vuedraggable`, `moment`, `vue-shortkey` — ensure peer compatibility.

## Common gotchas / shortcuts
- To check runtime behavior, link the package into a consuming project (e.g., `npm link` or `yarn link`) and run that app's dev server.
- When adjusting props or model shapes, update README/docs and the consuming apps to avoid runtime mismatches.

## Where to look when asked to change code
- Component docs: `docs/components/`
- Package config: `package.json` (check Vue version and dependencies)
- Shared runtime helpers: `src/` (look for Auth-related helpers in other shared packages like `kollektiv-vue-app` for reference)

---
If you'd like, I can add a small checklist for validating changes across consuming apps (linking, smoke tests, and example consuming apps to test with). ✅