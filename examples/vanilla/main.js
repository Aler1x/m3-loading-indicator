import {
  M3Animator,
  getMorphedShape,
  drawIndicator,
  setupCanvas,
} from "m3-loading-indicator";

function runIndicator(canvasId, options = {}) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const size = options.size ?? parseInt(canvas.width, 10);
  const ctx = setupCanvas(canvas, size);
  const anim = new M3Animator();

  const loop = (ts) => {
    anim.speed = options.speed ?? 1;
    anim.paused = options.paused ?? false;
    anim.update(ts);
    const shape = getMorphedShape(anim.morph);
    drawIndicator(ctx, size, shape, anim.rotation, {
      color: options.color ?? "currentColor",
      sizeRatio: options.sizeRatio ?? 0.79,
      contained: options.contained ?? false,
      containerColor: options.containerColor,
    });
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

runIndicator("indicator-1", { size: 48 });
runIndicator("indicator-2", { size: 64, color: "#6750A4" });
runIndicator("indicator-3", { size: 48, contained: true });
