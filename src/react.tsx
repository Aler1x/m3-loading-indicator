import {
  useRef,
  useEffect,
  forwardRef,
  type CSSProperties,
  type HTMLAttributes,
} from "react";
import { M3Animator, getMorphedShape, drawIndicator, setupCanvas } from "./core/index.js";

export interface M3LoadingIndicatorProps
  extends Omit<HTMLAttributes<HTMLCanvasElement>, "children"> {
  /** CSS pixel size of the indicator (default 48). */
  size?: number;
  /** Fill color (default: currentColor). */
  color?: string;
  /** Ratio of indicator shape to container (default 0.79 = 38/48dp). */
  sizeRatio?: number;
  /** Animation speed multiplier (default 1). */
  speed?: number;
  /** Pause the animation. */
  paused?: boolean;
  /** Render with circular container background. */
  contained?: boolean;
  /** Container background color when contained (default "rgba(0,0,0,0.08)"). */
  containerColor?: string;
}

/**
 * Material Design 3 Expressive Loading Indicator for React.
 *
 * Renders a canvas element with the morphing shape animation.
 *
 * @example
 * ```tsx
 * import { M3LoadingIndicator } from "m3-loading-indicator/react";
 *
 * <M3LoadingIndicator />
 * <M3LoadingIndicator size={64} color="#6750A4" />
 * <M3LoadingIndicator size={32} paused />
 * ```
 */
export const M3LoadingIndicator = forwardRef<
  HTMLCanvasElement,
  M3LoadingIndicatorProps
>(function M3LoadingIndicator(
  {
    size = 48,
    color = "currentColor",
    sizeRatio = 0.79,
    speed = 1,
    paused = false,
    contained = false,
    containerColor,
    style,
    ...rest
  },
  ref,
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<M3Animator | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const rafRef = useRef<number>(0);

  // Sync mutable values without re-triggering effect
  const propsRef = useRef({ color, sizeRatio, speed, paused, contained, containerColor });
  propsRef.current = { color, sizeRatio, speed, paused, contained, containerColor };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = setupCanvas(canvas, size);
    ctxRef.current = ctx;

    const anim = new M3Animator();
    animRef.current = anim;

    const loop = (ts: number) => {
      const p = propsRef.current;
      anim.speed = p.speed;
      anim.paused = p.paused;
      anim.update(ts);
      const shape = getMorphedShape(anim.morph);
      drawIndicator(ctx, size, shape, anim.rotation, {
        color: p.color,
        sizeRatio: p.sizeRatio,
        contained: p.contained,
        containerColor: p.containerColor,
      });
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [size]);

  const mergedStyle: CSSProperties = {
    display: "block",
    width: size,
    height: size,
    ...style,
  };

  return (
    <canvas
      ref={(el) => {
        canvasRef.current = el;
        if (typeof ref === "function") ref(el);
        else if (ref) ref.current = el;
      }}
      aria-label="Loading"
      style={mergedStyle}
      {...rest}
    />
  );
});

export default M3LoadingIndicator;
