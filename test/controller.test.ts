// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { IndicatorController } from "../src/core/controller.js";

let frames: Map<number, FrameRequestCallback>;
let nextId: number;
let now: number;
let mediaQueries: Map<string, FakeMediaQueryList>;
let observers: FakeIntersectionObserver[];

class FakeMediaQueryList {
  listeners = new Set<(e: { matches: boolean }) => void>();
  constructor(public media: string, public matches: boolean) {}
  addEventListener(_: string, cb: (e: { matches: boolean }) => void) {
    this.listeners.add(cb);
  }
  removeEventListener(_: string, cb: (e: { matches: boolean }) => void) {
    this.listeners.delete(cb);
  }
  set(matches: boolean) {
    this.matches = matches;
    for (const cb of this.listeners) cb({ matches });
  }
}

class FakeIntersectionObserver {
  disconnected = false;
  constructor(public cb: (entries: { isIntersecting: boolean }[]) => void) {
    observers.push(this);
  }
  observe() {}
  disconnect() {
    this.disconnected = true;
  }
  emit(isIntersecting: boolean) {
    this.cb([{ isIntersecting }]);
  }
}

function fakeContext() {
  const calls: string[] = [];
  const ctx: Record<string, unknown> = { fillStyle: "", calls };
  for (const m of [
    "clearRect", "save", "restore", "beginPath", "arc", "fill",
    "translate", "rotate", "moveTo", "lineTo", "closePath", "scale",
  ]) {
    ctx[m] = () => calls.push(m);
  }
  return ctx as unknown as CanvasRenderingContext2D & { calls: string[] };
}

function makeCanvas() {
  const canvas = document.createElement("canvas");
  const ctx = fakeContext();
  canvas.getContext = (() => ctx) as unknown as HTMLCanvasElement["getContext"];
  return { canvas, ctx };
}

/** Run the pending animation frame(s) once, advancing the clock. */
function flushFrame(dt = 16) {
  now += dt;
  const pending = [...frames.values()];
  frames.clear();
  for (const cb of pending) cb(now);
}

beforeEach(() => {
  frames = new Map();
  nextId = 1;
  now = 1000;
  mediaQueries = new Map();
  observers = [];
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
    const id = nextId++;
    frames.set(id, cb);
    return id;
  });
  vi.stubGlobal("cancelAnimationFrame", (id: number) => frames.delete(id));
  vi.stubGlobal("matchMedia", (q: string) => {
    let mql = mediaQueries.get(q);
    if (!mql) {
      mql = new FakeMediaQueryList(q, false);
      mediaQueries.set(q, mql);
    }
    return mql;
  });
  vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
  vi.stubGlobal("devicePixelRatio", 1);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("IndicatorController", () => {
  it("starts the loop and draws every frame", () => {
    const { canvas, ctx } = makeCanvas();
    const c = new IndicatorController(canvas);
    expect(c.running).toBe(true);
    flushFrame();
    flushFrame();
    expect(ctx.calls.filter((m) => m === "clearRect")).toHaveLength(2);
    expect(c.running).toBe(true);
    c.destroy();
  });

  it("stops the loop while paused but still renders a still frame", () => {
    const { canvas, ctx } = makeCanvas();
    const c = new IndicatorController(canvas, { paused: true });
    expect(c.running).toBe(false);
    expect(frames.size).toBe(0);
    expect(ctx.calls).toContain("fill");

    ctx.calls.length = 0;
    c.update({ color: "red" });
    expect(ctx.fillStyle).toBe("red");
    expect(frames.size).toBe(0);

    c.update({ paused: false });
    expect(c.running).toBe(true);
    c.destroy();
  });

  it("stops while scrolled out of view and resumes when visible", () => {
    const { canvas } = makeCanvas();
    const c = new IndicatorController(canvas);
    observers[0].emit(false);
    expect(c.running).toBe(false);
    observers[0].emit(true);
    expect(c.running).toBe(true);
    c.destroy();
    expect(observers[0].disconnected).toBe(true);
  });

  it("resizes the backing store without restarting the animation", () => {
    const { canvas } = makeCanvas();
    const c = new IndicatorController(canvas, { size: 48 });
    expect(canvas.width).toBe(48);
    for (let i = 0; i < 60; i++) flushFrame();
    // @ts-expect-error reading private state for the test
    const morph: number = c.anim.morph;
    expect(morph).toBeGreaterThan(0.5);

    c.update({ size: 96 });
    flushFrame();
    expect(canvas.width).toBe(96);
    expect(canvas.style.width).toBe("96px");
    expect(c.running).toBe(true);
    // @ts-expect-error reading private state for the test
    expect(c.anim.morph).toBeGreaterThanOrEqual(morph - 0.1);
    c.destroy();
  });

  it("re-renders at the new resolution when the pixel ratio changes", () => {
    const { canvas } = makeCanvas();
    const c = new IndicatorController(canvas, { size: 40 });
    expect(canvas.width).toBe(40);
    vi.stubGlobal("devicePixelRatio", 2);
    mediaQueries.get("(resolution: 1dppx)")!.set(false);
    expect(canvas.width).toBe(80);
    expect(canvas.style.width).toBe("40px");
    // Re-armed for the new ratio.
    expect(mediaQueries.get("(resolution: 2dppx)")!.listeners.size).toBe(1);
    expect(mediaQueries.get("(resolution: 1dppx)")!.listeners.size).toBe(0);
    c.destroy();
  });

  it("follows prefers-reduced-motion unless opted out", () => {
    const { canvas } = makeCanvas();
    const c = new IndicatorController(canvas);
    const mql = mediaQueries.get("(prefers-reduced-motion: reduce)")!;
    mql.set(true);
    for (let i = 0; i < 60; i++) flushFrame();
    // @ts-expect-error reading private state for the test
    expect(c.anim.morph).toBe(0);

    c.update({ respectReducedMotion: false });
    for (let i = 0; i < 60; i++) flushFrame();
    // @ts-expect-error reading private state for the test
    expect(c.anim.morph).toBeGreaterThan(0);
    c.destroy();
  });

  it("destroy() cancels the frame and removes listeners", () => {
    const { canvas } = makeCanvas();
    const c = new IndicatorController(canvas);
    c.destroy();
    expect(frames.size).toBe(0);
    expect(c.running).toBe(false);
    for (const mql of mediaQueries.values()) expect(mql.listeners.size).toBe(0);
    c.update({ paused: false });
    expect(frames.size).toBe(0);
  });
});
