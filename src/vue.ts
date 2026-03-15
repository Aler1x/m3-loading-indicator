import {
  defineComponent,
  ref,
  onMounted,
  onBeforeUnmount,
  watch,
  h,
  type PropType,
} from "vue";
import { M3Animator, getMorphedShape, drawIndicator, setupCanvas } from "./core/index.js";

/**
 * Material Design 3 Expressive Loading Indicator for Vue 3.
 *
 * @example
 * ```vue
 * <script setup>
 * import { M3LoadingIndicator } from "m3-loading-indicator/vue";
 * </script>
 *
 * <template>
 *   <M3LoadingIndicator />
 *   <M3LoadingIndicator :size="64" color="#6750A4" />
 *   <M3LoadingIndicator :size="32" paused />
 * </template>
 * ```
 */
export const M3LoadingIndicator = defineComponent({
  name: "M3LoadingIndicator",
  props: {
    /** CSS pixel size (default 48). */
    size: { type: Number as PropType<number>, default: 48 },
    /** Fill color (default "currentColor"). */
    color: { type: String as PropType<string>, default: "currentColor" },
    /** Shape-to-container ratio (default 0.79). */
    sizeRatio: { type: Number as PropType<number>, default: 0.79 },
    /** Animation speed multiplier (default 1). */
    speed: { type: Number as PropType<number>, default: 1 },
    /** Pause the animation. */
    paused: { type: Boolean as PropType<boolean>, default: false },
    /** Render with circular container background. */
    contained: { type: Boolean as PropType<boolean>, default: false },
    /** Container background color when contained. */
    containerColor: { type: String as PropType<string>, default: undefined },
  },
  setup(props) {
    const canvasRef = ref<HTMLCanvasElement | null>(null);
    let ctx: CanvasRenderingContext2D | null = null;
    let anim: M3Animator | null = null;
    let raf = 0;

    const loop = (ts: number) => {
      if (!ctx || !anim) return;
      anim.speed = props.speed;
      anim.paused = props.paused;
      anim.update(ts);
      const shape = getMorphedShape(anim.morph);
      drawIndicator(ctx, props.size, shape, anim.rotation, {
        color: props.color,
        sizeRatio: props.sizeRatio,
        contained: props.contained,
        containerColor: props.containerColor,
      });
      raf = requestAnimationFrame(loop);
    };

    const startAnimation = () => {
      if (!canvasRef.value) return;
      ctx = setupCanvas(canvasRef.value, props.size);
      anim = new M3Animator();
      raf = requestAnimationFrame(loop);
    };

    const stopAnimation = () => {
      cancelAnimationFrame(raf);
      ctx = null;
      anim = null;
    };

    onMounted(startAnimation);
    onBeforeUnmount(stopAnimation);

    // Re-init canvas if size changes
    watch(
      () => props.size,
      () => {
        stopAnimation();
        startAnimation();
      },
    );

    return () =>
      h("canvas", {
        ref: canvasRef,
        "aria-label": "Loading",
        style: {
          display: "block",
          width: `${props.size}px`,
          height: `${props.size}px`,
        },
      });
  },
});

export default M3LoadingIndicator;
