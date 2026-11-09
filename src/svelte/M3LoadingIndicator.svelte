<!--
  @component M3LoadingIndicator
  Material Design 3 Expressive Loading Indicator for Svelte 5.

  Exposed to assistive technology as an indeterminate `progressbar` labelled
  "Loading"; pass `aria-label` to change the label.

  @example
  ```svelte
  <script lang="ts">
    import M3LoadingIndicator from "@alerix/m3-loading-indicator/svelte";
  </script>

  <M3LoadingIndicator />
  <M3LoadingIndicator size={64} color="#6750A4" />
  <M3LoadingIndicator contained />
  ```
-->
<script lang="ts">
  import { untrack } from "svelte";
  import { IndicatorController } from "../core/controller.js";
  import type { HTMLCanvasAttributes } from "svelte/elements";

  interface Props extends HTMLCanvasAttributes {
    /** CSS pixel size (default 48). */
    size?: number;
    /** Fill color (default "currentColor"). */
    color?: string;
    /** Shape-to-container ratio (default 0.79 = 38/48dp). */
    sizeRatio?: number;
    /** Animation speed multiplier (default 1). */
    speed?: number;
    /** Pause the animation. */
    paused?: boolean;
    /** Render with circular container background. */
    contained?: boolean;
    /** Container background color when contained. */
    containerColor?: string;
    /** Honour `prefers-reduced-motion` (default true). */
    respectReducedMotion?: boolean;
  }

  let {
    size = 48,
    color = "currentColor",
    sizeRatio = 0.79,
    speed = 1,
    paused = false,
    contained = false,
    containerColor,
    respectReducedMotion = true,
    class: className,
    ...rest
  }: Props = $props();

  let canvas: HTMLCanvasElement | undefined = $state();
  let controller: IndicatorController | undefined;

  const options = () => ({
    size,
    color,
    sizeRatio,
    speed,
    paused,
    contained,
    containerColor,
    respectReducedMotion,
  });

  // Create the controller once per canvas element.
  $effect(() => {
    if (!canvas) return;
    const c = new IndicatorController(canvas, untrack(options));
    controller = c;
    return () => {
      c.destroy();
      controller = undefined;
    };
  });

  // Push prop changes without restarting the animation.
  $effect(() => {
    const next = options();
    untrack(() => controller?.update(next));
  });
</script>

<canvas
  bind:this={canvas}
  role="progressbar"
  aria-label="Loading"
  class={className}
  style:display="block"
  style:width="{size}px"
  style:height="{size}px"
  {...rest}
></canvas>
