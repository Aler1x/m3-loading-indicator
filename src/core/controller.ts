/**
 * Internal controller shared by the React, Vue and Svelte wrappers.
 *
 * Owns the canvas, the animator and the rAF loop, and takes care of:
 * - stopping the loop while paused or scrolled out of view,
 * - `prefers-reduced-motion`,
 * - re-rendering at the right resolution when the device pixel ratio changes
 *   (browser zoom, moving the window to another monitor),
 * - resizing without restarting the animation.
 *
 * @internal Not part of the public API; may change without a major version bump.
 */
import { M3Animator } from "./animator.js";
import { getMorphedShape, type Point } from "./shapes.js";
import { drawIndicator, setupCanvas } from "./renderer.js";

export interface IndicatorOptions {
  size: number;
  color: string;
  sizeRatio: number;
  speed: number;
  paused: boolean;
  contained: boolean;
  containerColor?: string;
  respectReducedMotion: boolean;
}

export const DEFAULT_OPTIONS: IndicatorOptions = {
  size: 48,
  color: "currentColor",
  sizeRatio: 0.79,
  speed: 1,
  paused: false,
  contained: false,
  containerColor: undefined,
  respectReducedMotion: true,
};

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export class IndicatorController {
  private ctx: CanvasRenderingContext2D;
  private readonly anim = new M3Animator();
  private readonly buffer: Point[] = [];
  private opts: IndicatorOptions;
  private raf = 0;
  private visible = true;
  private prefersReducedMotion = false;
  private destroyed = false;

  private motionQuery?: MediaQueryList;
  private dprQuery?: MediaQueryList;
  private observer?: IntersectionObserver;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    options: Partial<IndicatorOptions> = {},
  ) {
    this.opts = { ...DEFAULT_OPTIONS, ...options };
    this.ctx = setupCanvas(canvas, this.opts.size);

    if (typeof matchMedia === "function") {
      this.motionQuery = matchMedia(REDUCED_MOTION_QUERY);
      this.prefersReducedMotion = this.motionQuery.matches;
      this.motionQuery.addEventListener("change", this.onMotionChange);
      this.watchPixelRatio();
    }

    if (typeof IntersectionObserver === "function") {
      this.observer = new IntersectionObserver((entries) => {
        const last = entries[entries.length - 1];
        if (last) {
          this.visible = last.isIntersecting;
          this.sync();
        }
      });
      this.observer.observe(canvas);
    }

    this.sync();
  }

  /** Apply new options. Changing `size` keeps the animation running. */
  update(options: Partial<IndicatorOptions>): void {
    if (this.destroyed) return;
    const prevSize = this.opts.size;
    this.opts = { ...this.opts, ...options };
    if (this.opts.size !== prevSize) {
      this.ctx = setupCanvas(this.canvas, this.opts.size);
    }
    this.sync();
  }

  /** Stop the animation and release all listeners. */
  destroy(): void {
    this.destroyed = true;
    this.stop();
    this.motionQuery?.removeEventListener("change", this.onMotionChange);
    this.dprQuery?.removeEventListener("change", this.onPixelRatioChange);
    this.observer?.disconnect();
  }

  /** Whether the rAF loop is currently scheduled. */
  get running(): boolean {
    return this.raf !== 0;
  }

  private get shouldRun(): boolean {
    return !this.destroyed && !this.opts.paused && this.visible;
  }

  private sync(): void {
    this.anim.speed = this.opts.speed;
    this.anim.reducedMotion = this.opts.respectReducedMotion && this.prefersReducedMotion;

    if (this.shouldRun) {
      if (!this.raf) {
        this.anim.resetClock();
        this.raf = requestAnimationFrame(this.tick);
      }
    } else {
      this.stop();
      // Keep the still frame up to date (e.g. color changed while paused).
      if (!this.destroyed) this.draw();
    }
  }

  private stop(): void {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  private tick = (ts: number): void => {
    this.raf = 0;
    if (!this.shouldRun) return;
    this.anim.update(ts);
    this.draw();
    this.raf = requestAnimationFrame(this.tick);
  };

  private draw(): void {
    const shape = getMorphedShape(this.anim.morph, this.buffer);
    drawIndicator(this.ctx, this.opts.size, shape, this.anim.rotation, {
      color: this.opts.color,
      sizeRatio: this.opts.sizeRatio,
      contained: this.opts.contained,
      containerColor: this.opts.containerColor,
    });
  }

  private onMotionChange = (e: MediaQueryListEvent): void => {
    this.prefersReducedMotion = e.matches;
    this.sync();
  };

  /** A resolution query only fires once, so re-arm it for the new DPR. */
  private watchPixelRatio(): void {
    this.dprQuery?.removeEventListener("change", this.onPixelRatioChange);
    const dpr = (typeof window !== "undefined" && window.devicePixelRatio) || 1;
    this.dprQuery = matchMedia(`(resolution: ${dpr}dppx)`);
    this.dprQuery.addEventListener("change", this.onPixelRatioChange);
  }

  private onPixelRatioChange = (): void => {
    if (this.destroyed) return;
    this.ctx = setupCanvas(this.canvas, this.opts.size);
    this.watchPixelRatio();
    if (!this.raf) this.draw();
  };
}
