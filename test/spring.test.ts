import { describe, expect, it } from "vitest";
import { Spring } from "../src/core/spring.js";

describe("Spring", () => {
  it("settles on its target", () => {
    const s = new Spring(200, 0.6);
    s.target = 1;
    for (let i = 0; i < 300; i++) s.step(1 / 60);
    expect(s.pos).toBeCloseTo(1, 4);
    expect(s.vel).toBeCloseTo(0, 4);
  });

  it("overshoots when under-damped (ζ = 0.6)", () => {
    const s = new Spring(200, 0.6);
    s.target = 1;
    let max = 0;
    for (let i = 0; i < 120; i++) {
      s.step(1 / 60);
      max = Math.max(max, s.pos);
    }
    expect(max).toBeGreaterThan(1.05);
    expect(max).toBeLessThan(1.2);
  });

  it("does not overshoot when critically damped", () => {
    const s = new Spring(200, 1);
    s.target = 1;
    let max = 0;
    for (let i = 0; i < 300; i++) {
      s.step(1 / 60);
      max = Math.max(max, s.pos);
    }
    expect(max).toBeLessThanOrEqual(1 + 1e-6);
  });

  it("reset() returns to rest at 0", () => {
    const s = new Spring(200, 0.6);
    s.target = 3;
    s.step(0.1);
    s.reset();
    expect([s.pos, s.vel, s.target]).toEqual([0, 0, 0]);
  });
});
