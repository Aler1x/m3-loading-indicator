import {
  useRef,
  useEffect,
  useCallback,
  forwardRef,
  type CSSProperties,
  type HTMLAttributes,
} from "react";
import { IndicatorController } from "./core/controller.js";

export interface M3LoadingIndicatorProps
  extends Omit<HTMLAttributes<HTMLCanvasElement>, "children" | "color"> {
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
  /**
   * Honour the `prefers-reduced-motion` media query by turning off shape
   * morphing and keeping only a slow rotation (default true).
   */
  respectReducedMotion?: boolean;
}

/**
 * Material Design 3 Expressive Loading Indicator for React.
 *
 * Renders a canvas element with the morphing shape animation. It is exposed to
 * assistive technology as an indeterminate `progressbar` labelled "Loading";
 * pass `aria-label` to change the label.
 *
 * @example
 * ```tsx
 * import { M3LoadingIndicator } from "@alerix/m3-loading-indicator/react";
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
    respectReducedMotion = true,
    style,
    ...rest
  },
  ref,
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const controllerRef = useRef<IndicatorController | null>(null);

  const options = {
    size,
    color,
    sizeRatio,
    speed,
    paused,
    contained,
    containerColor,
    respectReducedMotion,
  };
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const controller = new IndicatorController(canvas, optionsRef.current);
    controllerRef.current = controller;
    return () => {
      controller.destroy();
      controllerRef.current = null;
    };
  }, []);

  useEffect(() => {
    controllerRef.current?.update(optionsRef.current);
  }, [size, color, sizeRatio, speed, paused, contained, containerColor, respectReducedMotion]);

  const setRef = useCallback(
    (el: HTMLCanvasElement | null) => {
      canvasRef.current = el;
      if (typeof ref === "function") ref(el);
      else if (ref) ref.current = el;
    },
    [ref],
  );

  const mergedStyle: CSSProperties = {
    display: "block",
    width: size,
    height: size,
    ...style,
  };

  return (
    <canvas
      ref={setRef}
      role="progressbar"
      aria-label="Loading"
      style={mergedStyle}
      {...rest}
    />
  );
});

export default M3LoadingIndicator;
