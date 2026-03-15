<!--
  @component M3LoadingIndicator
  Material Design 3 Expressive Loading Indicator for Svelte 5.

  @example
  ```svelte
  <script lang="ts">
    import M3LoadingIndicator from "m3-loading-indicator/svelte";
  </script>

  <M3LoadingIndicator />
  <M3LoadingIndicator size={64} color="#6750A4" />
  <M3LoadingIndicator contained />
  ```
-->
<script lang="ts">
  import {
    M3Animator,
    getMorphedShape,
    drawIndicator,
    setupCanvas,
  } from "../core/index.js";
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
  }

  let {
    size = 48,
    color = "currentColor",
    sizeRatio = 0.79,
    speed = 1,
    paused = false,
    contained = false,
    containerColor,
    class: className,
    ...rest
  }: Props = $props();

  let canvas: HTMLCanvasElement | undefined = $state();

  $effect(() => {
    if (!canvas) return;

    const ctx = setupCanvas(canvas, size);
    const anim = new M3Animator();
    let raf: number;

    const loop = (ts: number) => {
      anim.speed = speed;
      anim.paused = paused;
      anim.update(ts);
      const shape = getMorphedShape(anim.morph);
      drawIndicator(ctx, size, shape, anim.rotation, {
        color,
        sizeRatio,
        contained,
        containerColor,
      });
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(raf);
  });
</script>

<canvas
  bind:this={canvas}
  aria-label="Loading"
  class={className}
  style:display="block"
  style:width="{size}px"
  style:height="{size}px"
  {...rest}
></canvas>
