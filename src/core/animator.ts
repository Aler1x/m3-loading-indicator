/**
 * Animation controller for the M3 Loading Indicator.
 *
 * Faithfully mirrors LoadingIndicatorAnimatorDelegate.java:
 * - Linear timer (650ms/cycle, infinite repeat)
 * - Spring-driven morph factor (k=200, ζ=0.6)
 * - Dual rotation: 50° constant + 90° spring per shape cycle
 */
import { Spring } from "./spring.js";

/** Constants from Android source. */
export const DURATION_PER_SHAPE_MS = 650;
export const CONSTANT_ROTATION_DEG = 50;
export const EXTRA_ROTATION_DEG = 90;
export const DEFAULT_SPRING_STIFFNESS = 200;
export const DEFAULT_SPRING_DAMPING = 0.6;

export interface AnimatorState {
  /** Current rotation in degrees (0–360). */
  rotation: number;
  /** Current morph fraction (drives shape interpolation). */
  morph: number;
}

export class M3Animator {
  private spring: Spring;
  private morphTarget = 1;
  private fraction = 0;
  private elapsed = 0;
  private lastTs = 0;
  private prevCycle = 0;

  speed = 1;
  paused = false;

  rotation = 0;
  morph = 0;

  constructor(stiffness = DEFAULT_SPRING_STIFFNESS, damping = DEFAULT_SPRING_DAMPING) {
    this.spring = new Spring(stiffness, damping);
    this.spring.target = 1;
  }

  /** Call on each rAF tick with `performance.now()` timestamp. */
  update(ts: number): void {
    if (this.paused) {
      this.lastTs = ts;
      return;
    }
    if (this.lastTs === 0) this.lastTs = ts;
    const rawDt = Math.min((ts - this.lastTs) / 1000, 0.1);
    const dt = rawDt * this.speed;
    this.lastTs = ts;
    if (dt <= 0) return;

    this.elapsed += dt * 1000;
    const cycle = Math.floor(this.elapsed / DURATION_PER_SHAPE_MS);

    // onAnimationRepeat → advance morph target
    if (cycle > this.prevCycle) {
      this.morphTarget += cycle - this.prevCycle;
      this.spring.target = this.morphTarget;
      this.prevCycle = cycle;
    }

    this.fraction = (this.elapsed % DURATION_PER_SHAPE_MS) / DURATION_PER_SHAPE_MS;
    this.spring.step(dt);

    // updateIndicatorRotation()
    const base = this.morphTarget - 1;
    const perShape = this.spring.pos - base;
    this.rotation =
      ((CONSTANT_ROTATION_DEG + EXTRA_ROTATION_DEG) * base +
        CONSTANT_ROTATION_DEG * this.fraction +
        EXTRA_ROTATION_DEG * perShape) %
      360;

    this.morph = this.spring.pos;
  }

  /** Reset animation to initial state. */
  reset(): void {
    this.morphTarget = 1;
    this.fraction = 0;
    this.elapsed = 0;
    this.lastTs = 0;
    this.prevCycle = 0;
    this.spring.reset();
    this.spring.target = 1;
    this.rotation = 0;
    this.morph = 0;
  }

  /** Get a snapshot of the current state. */
  getState(): AnimatorState {
    return { rotation: this.rotation, morph: this.morph };
  }
}
