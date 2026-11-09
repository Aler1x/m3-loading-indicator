import {
  defineComponent,
  ref,
  onMounted,
  onBeforeUnmount,
  watch,
  h,
  type PropType,
} from "vue";
import { IndicatorController } from "./core/controller.js";

/**
 * Material Design 3 Expressive Loading Indicator for Vue 3.
 *
 * Exposed to assistive technology as an indeterminate `progressbar` labelled
 * "Loading"; pass `aria-label` to change the label.
 *
 * @example
 * ```vue
 * <script setup>
 * import { M3LoadingIndicator } from "@alerix/m3-loading-indicator/vue";
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
    /** Honour `prefers-reduced-motion` (default true). */
    respectReducedMotion: { type: Boolean as PropType<boolean>, default: true },
  },
  setup(props) {
    const canvasRef = ref<HTMLCanvasElement | null>(null);
    let controller: IndicatorController | null = null;

    onMounted(() => {
      if (!canvasRef.value) return;
      controller = new IndicatorController(canvasRef.value, { ...props });
    });

    onBeforeUnmount(() => {
      controller?.destroy();
      controller = null;
    });

    watch(
      () => ({ ...props }),
      (options) => controller?.update(options),
    );

    return () =>
      h("canvas", {
        ref: canvasRef,
        role: "progressbar",
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
