<script lang="ts">
  import { go, pageHref, readPage, type Page } from "./lib/nav";
  import Playground from "./pages/Playground.svelte";
  import Docs from "./pages/Docs.svelte";

  let page = $state<Page>(readPage());

  $effect(() => {
    const sync = () => {
      page = readPage();
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  });

  function navigate(next: Page, event: MouseEvent) {
    event.preventDefault();
    go(next);
  }
</script>

<div class="min-h-screen flex flex-col bg-paper text-dark font-sans">
  <header class="sticky top-0 z-10 bg-paper border-b border-dark/10">
    <nav class="max-w-5xl mx-auto px-6 h-14 flex items-center gap-6">
      <span class="font-semibold text-dark text-base tracking-tight">
        M3 Loading Indicator
      </span>

      <div class="flex items-center gap-1 ml-auto">
        <a
          href={pageHref("playground")}
          onclick={(e) => navigate("playground", e)}
          class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150
            {page === 'playground'
            ? 'bg-subtle text-dark'
            : 'text-dark/60 hover:text-dark hover:bg-muted'}"
        >
          Playground
        </a>
        <a
          href={pageHref("docs")}
          onclick={(e) => navigate("docs", e)}
          class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150
            {page === 'docs'
            ? 'bg-subtle text-dark'
            : 'text-dark/60 hover:text-dark hover:bg-muted'}"
        >
          Docs
        </a>
        <a
          href="https://github.com/aler1x/m3-loading-indicator"
          target="_blank"
          rel="noreferrer"
          class="px-3 py-1.5 rounded-lg text-sm font-medium text-dark/60 hover:text-dark hover:bg-muted transition-colors duration-150"
        >
          GitHub
        </a>
      </div>
    </nav>
  </header>

  <main class="flex-1 max-w-5xl mx-auto w-full px-6 py-12">
    {#if page === "playground"}
      <Playground />
    {:else}
      <Docs />
    {/if}
  </main>

  <footer class="bg-dark text-paper mt-10">
    <div class="max-w-5xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
      <p class="text-sm opacity-70">
        Ported from
        <a
          href="https://github.com/material-components/material-components-android"
          target="_blank"
          rel="noreferrer"
          class="underline underline-offset-4 opacity-100 hover:text-coral transition-colors duration-150"
        >
          material-components-android
        </a>. Apache 2.0.
      </p>
      <a
        href="https://github.com/aler1x/m3-loading-indicator"
        target="_blank"
        rel="noreferrer"
        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-paper text-dark text-sm font-medium
          shadow-md hover:scale-[1.02] active:scale-[0.98] transition-transform duration-150"
      >
        View on GitHub
      </a>
    </div>
  </footer>
</div>
