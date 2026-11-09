import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    "core/index": "src/core/index.ts",
    // Internal: shared by the framework wrappers (incl. the shipped .svelte
    // file, which imports it relatively). Not part of the public exports map.
    "core/controller": "src/core/controller.ts",
    react: "src/react.tsx",
    vue: "src/vue.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  treeshake: true,
  // Share the core between entries instead of inlining it into each wrapper.
  splitting: true,
  external: ["react", "vue"],
  esbuildOptions(opts) {
    opts.jsx = "automatic";
  },
});
