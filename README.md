# m3-loading-indicator

Material Design 3 Expressive Loading Indicator for **React**, **Svelte 5**, **Vue 3**, and **vanilla JS**.

Faithfully ported from Android's [material-components-android](https://github.com/material-components/material-components-android/tree/master/lib/java/com/google/android/material/loadingindicator) — uses the exact SVG path geometry from Material Design shape assets, spring physics animation (k=200, ζ=0.6), and the dual rotation system from `LoadingIndicatorAnimatorDelegate.java`.

## Features

- 7 morphing shapes: Soft Burst → Cookie 9 → Pentagon → Pill → Sunny → Cookie 4 → Oval
- Spring-driven animation matching Android's `SpringForce`
- Pixel-perfect shapes from official Material Design SVG assets
- Canvas-based rendering with HiDPI support
- Tree-shakeable — only import the framework you use
- TypeScript-first with full type definitions

## Install

```bash
npm install m3-loading-indicator
```

## Examples

Run the vanilla JS example locally:

```bash
pnpm install
pnpm build
pnpm example:vanilla
```

## React

```tsx
import { M3LoadingIndicator } from "m3-loading-indicator/react";

function App() {
  return (
    <>
      {/* Default — 48px, uses currentColor */}
      <M3LoadingIndicator />

      {/* Custom size and color */}
      <M3LoadingIndicator size={64} color="#6750A4" />

      {/* Slow motion */}
      <M3LoadingIndicator speed={0.5} />

      {/* Paused */}
      <M3LoadingIndicator paused />
    </>
  );
}
```

## Svelte 5

```svelte
<script lang="ts">
  import M3LoadingIndicator from "m3-loading-indicator/svelte";
</script>

<!-- Default -->
<M3LoadingIndicator />

<!-- Custom size and color -->
<M3LoadingIndicator size={64} color="#6750A4" />

<!-- Slow motion -->
<M3LoadingIndicator speed={0.5} />

<!-- Paused -->
<M3LoadingIndicator paused />
```

## Vue 3

```vue
<script setup>
import { M3LoadingIndicator } from "m3-loading-indicator/vue";
</script>

<template>
  <!-- Default -->
  <M3LoadingIndicator />

  <!-- Custom size and color -->
  <M3LoadingIndicator :size="64" color="#6750A4" />

  <!-- Slow motion -->
  <M3LoadingIndicator :speed="0.5" />

  <!-- Paused -->
  <M3LoadingIndicator paused />
</template>
```

## Headless / Vanilla JS

Use the core API directly for custom renderers:

```ts
import {
  M3Animator,
  getMorphedShape,
  drawIndicator,
  setupCanvas,
} from "m3-loading-indicator";

const canvas = document.querySelector("canvas")!;
const ctx = setupCanvas(canvas, 48);
const animator = new M3Animator();

function loop(ts: number) {
  animator.update(ts);
  const shape = getMorphedShape(animator.morph);
  drawIndicator(ctx, 48, shape, animator.rotation, {
    color: "#6750A4",
  });
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `number` | `48` | CSS pixel size of the indicator |
| `color` | `string` | `"currentColor"` | Fill color |
| `sizeRatio` | `number` | `0.79` | Shape-to-container ratio (38dp in 48dp) |
| `speed` | `number` | `1` | Animation speed multiplier |
| `paused` | `boolean` | `false` | Pause the animation |
| `contained` | `boolean` | `false` | Render with circular container background |
| `containerColor` | `string` | `"rgba(0,0,0,0.08)"` | Container background color |

### Contained variant

The contained variant draws a circular background behind the indicator, matching Android's `ContainedLoadingIndicator`:

```tsx
// React
<M3LoadingIndicator contained />
<M3LoadingIndicator contained containerColor="#E8DEF8" color="#6750A4" />
```

```svelte
<!-- Svelte -->
<M3LoadingIndicator contained />
<M3LoadingIndicator contained containerColor="#E8DEF8" color="#6750A4" />
```

```vue
<!-- Vue -->
<M3LoadingIndicator contained />
<M3LoadingIndicator contained container-color="#E8DEF8" color="#6750A4" />
```

## Architecture

```
m3-loading-indicator
├── core/         # Framework-agnostic engine
│   ├── spring    # Spring physics (matches Android SpringForce)
│   ├── shapes    # SVG path parsing + 7 Material shapes
│   ├── animator  # Animation controller (from AnimatorDelegate.java)
│   └── renderer  # Canvas drawing + HiDPI setup
├── react         # React component (useEffect + rAF)
├── svelte        # Svelte 5 component ($effect + rAF)
└── vue           # Vue 3 component (defineComponent + rAF)
```

## Animation System

Ported from `LoadingIndicatorAnimatorDelegate.java`:

- **Linear timer**: 650ms per shape cycle, infinite repeat
- **Spring morph**: `SpringForce(stiffness=200, dampingRatio=0.6)` drives shape transitions — creates the organic overshoot/settle feel
- **Rotation**: `(50° + 90°) × base + 50° × timeFraction + 90° × springFraction` — constant rotation + spring-driven extra rotation per cycle

## Shapes

The 7 shapes use exact SVG path data from Material Design asset files, parsed at init time into 180-point arrays for smooth morphing:

1. **Soft burst** — 8-pointed soft star
2. **Cookie 9** — 9-sided scalloped shape
3. **Pentagon** — heavily rounded 5-sided polygon
4. **Pill** — rotated rounded diamond
5. **Sunny** — 12-faceted rounded polygon
6. **Cookie 4** — 4-sided scalloped shape
7. **Oval** — horizontal ellipse

## License

Apache 2.0 — see [LICENSE](./LICENSE) and [NOTICE](./NOTICE).

Ported from [material-components-android](https://github.com/material-components/material-components-android) (Apache 2.0, Copyright The Android Open Source Project) with SVG shape data from [Material Design](https://m3.material.io/components/loading-indicator) (Apache 2.0, Copyright Google LLC).
