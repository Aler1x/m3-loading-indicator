import { describe, expect, it } from "vitest";
import {
  SHAPE_COUNT,
  getMorphedShape,
  getShapes,
  lerpShapes,
  type Point,
} from "../src/core/shapes.js";

describe("getShapes", () => {
  const shapes = getShapes();

  it(`returns ${SHAPE_COUNT} shapes of 180 points each`, () => {
    expect(shapes).toHaveLength(SHAPE_COUNT);
    for (const s of shapes) expect(s).toHaveLength(180);
  });

  it("normalizes every shape into the [-1, 1] box and touches its edge", () => {
    for (const s of shapes) {
      let extent = 0;
      for (const [x, y] of s) {
        expect(Number.isFinite(x) && Number.isFinite(y)).toBe(true);
        expect(Math.abs(x)).toBeLessThanOrEqual(1 + 1e-9);
        expect(Math.abs(y)).toBeLessThanOrEqual(1 + 1e-9);
        extent = Math.max(extent, Math.abs(x), Math.abs(y));
      }
      expect(extent).toBeGreaterThan(0.95);
    }
  });

  it("is memoized", () => {
    expect(getShapes()).toBe(shapes);
  });
});

describe("lerpShapes", () => {
  const a: Point[] = [[0, 0], [1, 1]];
  const b: Point[] = [[2, 4], [3, 5]];

  it("interpolates linearly", () => {
    expect(lerpShapes(a, b, 0)).toEqual(a);
    expect(lerpShapes(a, b, 1)).toEqual(b);
    expect(lerpShapes(a, b, 0.5)).toEqual([[1, 2], [2, 3]]);
  });

  it("writes into and reuses the provided buffer", () => {
    const out: Point[] = [];
    const first = lerpShapes(a, b, 0.25, out);
    const p0 = out[0];
    const second = lerpShapes(a, b, 0.75, out);
    expect(first).toBe(out);
    expect(second).toBe(out);
    expect(out[0]).toBe(p0);
    expect(out).toEqual([[1.5, 3], [2.5, 4]]);
  });
});

describe("getMorphedShape", () => {
  const shapes = getShapes();

  it("returns the exact shape at whole morph values", () => {
    expect(getMorphedShape(0)).toEqual(shapes[0]);
    expect(getMorphedShape(3)).toEqual(shapes[3]);
  });

  it("wraps around after the last shape and for negative values", () => {
    expect(getMorphedShape(SHAPE_COUNT)).toEqual(shapes[0]);
    expect(getMorphedShape(SHAPE_COUNT + 2)).toEqual(shapes[2]);
    expect(getMorphedShape(-1)).toEqual(shapes[SHAPE_COUNT - 1]);
  });

  it("blends neighbouring shapes in between", () => {
    const mid = getMorphedShape(1.5);
    expect(mid[0][0]).toBeCloseTo((shapes[1][0][0] + shapes[2][0][0]) / 2);
  });
});
