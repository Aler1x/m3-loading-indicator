import type { PlaygroundState } from "./props";

export type Framework = "react" | "svelte" | "vue" | "vanilla";

export const FRAMEWORK_LABELS: Record<Framework, string> = {
  react: "React",
  svelte: "Svelte 5",
  vue: "Vue 3",
  vanilla: "Vanilla JS",
};

function formatAttr(
  name: string,
  value: string | number | boolean,
  framework: Framework,
): string {
  if (typeof value === "boolean") {
    if (!value) return "";
    return ` ${name}`;
  }
  if (typeof value === "number") {
    return framework === "vue"
      ? ` :${name}="${value}"`
      : ` ${name}={${value}}`;
  }
  const quoted = `"${value}"`;
  if (framework === "vue") return ` ${name}=${quoted}`;
  return ` ${name}={${quoted}}`;
}

function buildComponentAttrs(
  state: PlaygroundState,
  framework: Framework,
): string {
  const parts: string[] = [];
  if (state.size !== 48) parts.push(formatAttr("size", state.size, framework));
  if (state.color !== "currentColor") {
    parts.push(formatAttr("color", state.color, framework));
  }
  if (state.sizeRatio !== 0.79) {
    parts.push(formatAttr("sizeRatio", state.sizeRatio, framework));
  }
  if (state.speed !== 1) parts.push(formatAttr("speed", state.speed, framework));
  if (state.paused) parts.push(formatAttr("paused", true, framework));
  if (state.contained) parts.push(formatAttr("contained", true, framework));
  if (state.contained && state.containerColor !== "rgba(0,0,0,0.08)") {
    const key = framework === "vue" ? "container-color" : "containerColor";
    parts.push(formatAttr(key, state.containerColor, framework));
  }
  return parts.join("");
}

export function exampleFor(
  framework: Framework,
  state: PlaygroundState,
): string {
  const attrs = buildComponentAttrs(state, framework);

  switch (framework) {
    case "react":
      return `import { M3LoadingIndicator } from "@alerix/m3-loading-indicator/react";

export function Spinner() {
  return <M3LoadingIndicator${attrs} />;
}`;
    case "svelte":
      return `<script lang="ts">
  import M3LoadingIndicator from "@alerix/m3-loading-indicator/svelte";
</script>

<M3LoadingIndicator${attrs} />`;
    case "vue":
      return `<script setup lang="ts">
import { M3LoadingIndicator } from "@alerix/m3-loading-indicator/vue";
</script>

<template>
  <M3LoadingIndicator${attrs} />
</template>`;
    case "vanilla":
      return `import {
  M3Animator,
  getMorphedShape,
  drawIndicator,
  setupCanvas,
} from "@alerix/m3-loading-indicator";

const canvas = document.querySelector("canvas")!;
const ctx = setupCanvas(canvas, ${state.size});
const animator = new M3Animator();
animator.speed = ${state.speed};
animator.paused = ${state.paused};

function loop(ts: number) {
  animator.update(ts);
  const shape = getMorphedShape(animator.morph);
  drawIndicator(ctx, ${state.size}, shape, animator.rotation, {
    color: ${JSON.stringify(state.color)},
    sizeRatio: ${state.sizeRatio},
    contained: ${state.contained},
    containerColor: ${JSON.stringify(state.containerColor)},
  });
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);`;
  }
}

export const STATIC_EXAMPLES: Record<Framework, string> = {
  react: `import { M3LoadingIndicator } from "@alerix/m3-loading-indicator/react";

export function App() {
  return (
    <>
      <M3LoadingIndicator />
      <M3LoadingIndicator size={64} color="#6442D6" />
      <M3LoadingIndicator speed={0.5} paused />
      <M3LoadingIndicator contained containerColor="#E8DEF8" color="#6442D6" />
    </>
  );
}`,
  svelte: `<script lang="ts">
  import M3LoadingIndicator from "@alerix/m3-loading-indicator/svelte";
</script>

<M3LoadingIndicator />
<M3LoadingIndicator size={64} color="#6442D6" />
<M3LoadingIndicator speed={0.5} paused />
<M3LoadingIndicator contained containerColor="#E8DEF8" color="#6442D6" />`,
  vue: `<script setup lang="ts">
import { M3LoadingIndicator } from "@alerix/m3-loading-indicator/vue";
</script>

<template>
  <M3LoadingIndicator />
  <M3LoadingIndicator :size="64" color="#6442D6" />
  <M3LoadingIndicator :speed="0.5" paused />
  <M3LoadingIndicator contained container-color="#E8DEF8" color="#6442D6" />
</template>`,
  vanilla: `import {
  M3Animator,
  getMorphedShape,
  drawIndicator,
  setupCanvas,
} from "@alerix/m3-loading-indicator";

const canvas = document.querySelector("canvas")!;
const ctx = setupCanvas(canvas, 48);
const animator = new M3Animator();

function loop(ts: number) {
  animator.update(ts);
  const shape = getMorphedShape(animator.morph);
  drawIndicator(ctx, 48, shape, animator.rotation, {
    color: "#6442D6",
    contained: true,
    containerColor: "#E8DEF8",
  });
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);`,
};

export function shikiLang(framework: Framework): string {
  switch (framework) {
    case "react":
      return "tsx";
    case "svelte":
      return "svelte";
    case "vue":
      return "vue";
    case "vanilla":
      return "ts";
  }
}
