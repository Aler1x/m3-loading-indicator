<script lang="ts">
  import CodeBlock from "../components/CodeBlock.svelte";
  import Tabs from "../components/Tabs.svelte";
  import PropsTable from "../components/PropsTable.svelte";
  import { FRAMEWORK_LABELS, STATIC_EXAMPLES, shikiLang, type Framework } from "../lib/examples";
  import { pageHref } from "../lib/nav";

  const installTabs = [
    { id: "pnpm", label: "pnpm" },
    { id: "npm", label: "npm" },
    { id: "yarn", label: "yarn" },
    { id: "bun", label: "bun" },
  ];

  const installCmds: Record<string, string> = {
    npm: "npm install @alerix/m3-loading-indicator",
    pnpm: "pnpm add @alerix/m3-loading-indicator",
    yarn: "yarn add @alerix/m3-loading-indicator",
    bun: "bun add @alerix/m3-loading-indicator",
  };

  const frameworkTabs = (["svelte", "react", "vue", "vanilla"] as Framework[]).map((id) => ({
    id,
    label: FRAMEWORK_LABELS[id],
  }));

  let installPkg = $state("pnpm");
  let framework = $state<Framework>("svelte");
  const example = $derived(STATIC_EXAMPLES[framework]);
</script>

<div class="space-y-14">
  <header class="space-y-2">
    <h1 class="text-4xl font-semibold text-dark tracking-tight">Documentation</h1>
    <p class="text-dark/60">
      Install once, import the entry for your stack. All framework wrappers share the same props and
      canvas renderer.
    </p>
  </header>

  <section class="space-y-4">
    <h2 class="text-xl font-semibold text-dark">Install</h2>
    <Tabs tabs={installTabs} value={installPkg} onchange={(id) => (installPkg = id)} />
    <CodeBlock code={installCmds[installPkg]} lang="bash" />
  </section>

  <section class="space-y-4">
    <h2 class="text-xl font-semibold text-dark">Quick start</h2>
    <p class="text-dark/70">
      Try the <a
        href={pageHref("playground")}
        class="text-coral underline underline-offset-4 hover:opacity-80 transition-opacity"
        >playground</a
      >
      to experiment with props, or pick your framework below.
    </p>
    <Tabs tabs={frameworkTabs} value={framework} onchange={(id) => (framework = id as Framework)} />
    <p class="text-sm text-dark/50">
      Example for <strong class="text-dark font-medium">{FRAMEWORK_LABELS[framework]}</strong>
    </p>
    <CodeBlock code={example} lang={shikiLang(framework)} />
  </section>

  <section class="space-y-4">
    <h2 class="text-xl font-semibold text-dark">Props</h2>
    <p class="text-dark/70">
      Available on the React, Svelte, and Vue components. The vanilla API maps
      <code class="font-mono text-xs bg-subtle px-1.5 py-0.5 rounded">sizeRatio</code>,
      <code class="font-mono text-xs bg-subtle px-1.5 py-0.5 rounded">contained</code>, and
      <code class="font-mono text-xs bg-subtle px-1.5 py-0.5 rounded">containerColor</code>
      to <code class="font-mono text-xs bg-subtle px-1.5 py-0.5 rounded">drawIndicator</code> options.
    </p>
    <PropsTable />
  </section>

  <section class="space-y-4">
    <h2 class="text-xl font-semibold text-dark">Package exports</h2>
    <CodeBlock
      code={`@alerix/m3-loading-indicator          // core (vanilla)\n@alerix/m3-loading-indicator/react   // React\n@alerix/m3-loading-indicator/svelte  // Svelte 5\n@alerix/m3-loading-indicator/vue     // Vue 3`}
      lang="text"
    />
  </section>
</div>
