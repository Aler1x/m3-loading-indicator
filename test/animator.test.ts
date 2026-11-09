import { describe, expect, it } from "vitest";
import {
  CONSTANT_ROTATION_DEG,
  DURATION_PER_SHAPE_MS,
  M3Animator,
} from "../src/core/animator.js";

/** Drive the animator at 60fps for `ms` milliseconds starting at `start`. */
function run(anim: M3Animator, ms: number, start = 1): number {
  let ts = start;
  anim.update(ts);
  const end = start + ms;
  while (ts < end) {
    ts = Math.min(end, ts + 1000 / 60);
    anim.update(ts);
  }
  return ts;
}

describe("M3Animator", () => {
  it("advances roughly one shape per cycle", () => {
    const anim = new M3Animator();
    run(anim, DURATION_PER_SHAPE_MS * 4 + 600);
    // Spring trails slightly behind its target but should be near it.
    expect(anim.morph).toBeGreaterThan(4.5);
    expect(anim.morph).toBeLessThan(5.3);
  });

  it("keeps rotation within [0, 360)", () => {
    const anim = new M3Animator();
    let ts = 1;
    for (let i = 0; i < 2000; i++) {
      anim.update((ts += 16));
      expect(anim.rotation).toBeGreaterThanOrEqual(0);
      expect(anim.rotation).toBeLessThan(360);
    }
  });

  it("does not advance while paused", () => {
    const anim = new M3Animator();
    const ts = run(anim, 300);
    const before = anim.getState();
    anim.paused = true;
    run(anim, 1000, ts);
    expect(anim.getState()).toEqual(before);
  });

  it("speed scales time", () => {
    const slow = new M3Animator();
    const fast = new M3Animator();
    fast.speed = 2;
    run(slow, 1300);
    run(fast, 650);
    expect(fast.morph).toBeCloseTo(slow.morph, 1);
  });

  it("clamps large frame gaps to 100ms", () => {
    const anim = new M3Animator();
    anim.update(1);
    anim.update(10_000);
    // One 100ms step, not ~15 shapes' worth of time.
    expect(anim.morph).toBeGreaterThan(0);
    expect(anim.morph).toBeLessThan(1);
  });

  it("resetClock() prevents a jump after the loop was stopped", () => {
    const anim = new M3Animator();
    const ts = run(anim, 200);
    const before = anim.getState();
    anim.resetClock();
    anim.update(ts + 5000);
    expect(anim.getState()).toEqual(before);
  });

  it("reducedMotion freezes the morph and rotates steadily", () => {
    const anim = new M3Animator();
    anim.reducedMotion = true;
    run(anim, DURATION_PER_SHAPE_MS);
    expect(anim.morph).toBe(0);
    expect(anim.rotation).toBeCloseTo(CONSTANT_ROTATION_DEG, 0);
  });

  it("reset() restores the initial state", () => {
    const anim = new M3Animator();
    run(anim, 1000);
    anim.reset();
    expect(anim.getState()).toEqual({ rotation: 0, morph: 0 });
  });
});
