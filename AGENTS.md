# Repository Guidelines

## Project Structure & Module Organization
- Core React code lives at the repo root: `index.tsx` boots Vite/React, `App.tsx` manages album selection, playback, and keyboard controls.
- UI components sit in `components/` (`Background3D`, `AlbumStack`, `AlbumDetail`); shared shapes live in `types.ts`, album metadata in `constants.ts`.
- Global HTML shell is `index.html`; Vite config is `vite.config.ts`. Audio assets currently sit in the root alongside the code.
- Place any new reusable UI in `components/` (PascalCase filenames) and keep shared data/types near `constants.ts` and `types.ts` for discoverability.

## Build, Test, and Development Commands
- Install deps: `npm install`
- Run locally with hot reload: `npm run dev`
- Production build: `npm run build` (outputs to `dist/`)
- Preview the built bundle: `npm run preview`
- No automated test runner is configured yet; prefer adding one before merging substantial features.

## Coding Style & Naming Conventions
- Codebase is TypeScript + React functional components. Use hooks at the top of components and keep side effects in `useEffect`.
- Follow existing style: 2-space indentation, semicolons, single quotes, and descriptive camelCase for variables/functions; components/interfaces use PascalCase.
- Keep component files focused (UI + component-specific hooks). Pull shared helpers into small utility modules rather than growing `App.tsx`.
- Prefer explicit prop types and avoid `any`. Inline comments only where logic is non-obvious.

## Testing Guidelines
- Add tests colocated with the feature (e.g., `components/__tests__/AlbumStack.test.tsx`) if you introduce Vitest/RTL; aim to cover keyboard navigation, album selection, and playback toggle logic.
- Until a runner exists, perform manual smoke tests: navigate with arrows/Enter, open/close details with Escape, start/stop playback, and verify 3D background reacts without console errors.

## Commit & Pull Request Guidelines
- Use conventional-style messages (e.g., `feat: add album detail modal`, `fix: stabilize audio play/pause`), matching the existing `feat:` history.
- Before opening a PR: describe the change scope, list manual test steps, attach screenshots/GIFs for UI tweaks, and reference any issue IDs.
- Keep diffs focused; split unrelated changes into separate commits/PRs to simplify review.

## Security & Configuration Tips
- Store secrets in `.env.local` (e.g., `GEMINI_API_KEY`) and keep them untracked. Never commit API keys or private assets.
- Verify new media or textures are licensed for redistribution and keep large binaries out of Git when possible.
