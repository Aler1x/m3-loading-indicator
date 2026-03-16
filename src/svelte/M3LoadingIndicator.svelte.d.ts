import type { HTMLCanvasAttributes } from "svelte/elements";
import type { Component } from "svelte";

export interface M3LoadingIndicatorProps extends HTMLCanvasAttributes {
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
  /** Additional CSS class. */
  class?: string;
}

declare const M3LoadingIndicator: Component<M3LoadingIndicatorProps>;
type M3LoadingIndicator = Component<M3LoadingIndicatorProps>;

export default M3LoadingIndicator;
