/**
 * Canvas-based renderer for the loading indicator shape.
 */
import type { Point } from "./shapes.js";

export interface RenderOptions {
  color: string;
  /** Ratio of indicator size to canvas size (default 0.79 = 38dp/48dp). */
  sizeRatio?: number;
  /** If true, draw a circular container behind the indicator. */
  contained?: boolean;
  /** Container background color (default "rgba(0,0,0,0.08)"). */
  containerColor?: string;
}

/**
 * Draw a morphed shape onto a canvas context.
 *
 * @param ctx - 2D canvas context (already scaled for DPR)
 * @param cssSize - The CSS pixel size of the canvas
 * @param points - Morphed shape points in [-1, 1] normalized space
 * @param rotation - Rotation angle in degrees
 * @param options - Color and sizing
 */
export function drawIndicator(
  ctx: CanvasRenderingContext2D,
  cssSize: number,
  points: Point[],
  rotation: number,
  options: RenderOptions,
): void {
  const ratio = options.sizeRatio ?? 0.79;
  const indicatorSize = cssSize * ratio;
  const cx = cssSize / 2;
  const cy = cssSize / 2;
  const scale = indicatorSize / 2;

  ctx.clearRect(0, 0, cssSize, cssSize);

  // Draw circular container if contained mode
  if (options.contained) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, cssSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = options.containerColor ?? "rgba(0,0,0,0.08)";
    ctx.fill();
    ctx.restore();
  }

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((rotation * Math.PI) / 180);

  ctx.beginPath();
  for (let i = 0; i <= points.length; i++) {
    const [px, py] = points[i % points.length];
    if (i === 0) ctx.moveTo(px * scale, py * scale);
    else ctx.lineTo(px * scale, py * scale);
  }
  ctx.closePath();
  ctx.fillStyle = options.color;
  ctx.fill();
  ctx.restore();
}

/**
 * Set up a canvas for high-DPI rendering.
 *
 * @returns The DPR-scaled context ready for drawing
 */
export function setupCanvas(
  canvas: HTMLCanvasElement,
  cssSize: number,
): CanvasRenderingContext2D {
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
  const px = Math.round(cssSize * dpr);
  canvas.width = px;
  canvas.height = px;
  canvas.style.width = `${cssSize}px`;
  canvas.style.height = `${cssSize}px`;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(dpr, dpr);
  return ctx;
}
