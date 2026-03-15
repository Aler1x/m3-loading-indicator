import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: { "core/index": "src/core/index.ts" },
    format: ["esm", "cjs"],
    dts: true,
    clean: true,
    treeshake: true,
  },
  {
    entry: { react: "src/react.tsx" },
    format: ["esm", "cjs"],
    dts: true,
    external: ["react", "react-dom"],
    treeshake: true,
    esbuildOptions(opts) {
      opts.jsx = "automatic";
    },
  },
  {
    entry: { vue: "src/vue.ts" },
    format: ["esm", "cjs"],
    dts: true,
    external: ["vue"],
    treeshake: true,
  },
]);
