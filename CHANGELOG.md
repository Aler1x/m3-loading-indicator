# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project adheres
to [Semantic Versioning](https://semver.org/).

## [1.1.0] - 2026-11-09

### Added

- `respectReducedMotion` prop (default `true`): when the OS asks for reduced
  motion, the indicator stops morphing and only rotates slowly.
- The canvas now has `role="progressbar"` (with the existing
  `aria-label="Loading"`), so screen readers announce it. Both can be
  overridden with regular attributes.
- `getMorphedShape(morph, out?)` / `lerpShapes(a, b, t, out?)` accept an
  optional output array to avoid per-frame allocations.
- `M3Animator#reducedMotion` and `M3Animator#resetClock()`.
- Test suite (vitest) and a CI workflow (typecheck, tests, build, publint,
  are-the-types-wrong, demo build).

### Changed

- The animation loop stops entirely while `paused` or scrolled out of view
  instead of redrawing the same frame at 60fps.
- Changing `size` no longer restarts the animation.
- The canvas re-renders at the correct resolution when the device pixel ratio
  changes (browser zoom, moving between monitors).
- The core engine is now a shared chunk instead of being bundled separately
  into the React and Vue entries.

### Fixed

- `tailwindcss` and `@tailwindcss/vite` were listed as runtime dependencies
  and got installed into every consumer's project. They are now demo-only
  dev dependencies.
- CommonJS consumers got ESM type declarations ("masquerading as ESM"); the
  `exports` map now points `require` at the `.d.cts` files.
- The Svelte component was published twice (`src/svelte` and `dist/svelte`).
- Removed the unused `react-dom` peer dependency.
- JSDoc examples referenced the old unscoped package name.

## [1.0.5] and earlier

See the [commit history](https://github.com/aler1x/m3-loading-indicator/commits/main).
