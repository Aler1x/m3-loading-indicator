<script lang="ts">
  import { highlightCode } from "../lib/shiki";

  interface Props {
    code: string;
    lang: string;
    class?: string;
  }

  let { code, lang, class: className = "" }: Props = $props();

  let html = $state<string | null>(null);

  $effect(() => {
    let cancelled = false;
    html = null;
    highlightCode(code, lang).then((result) => {
      if (!cancelled) html = result;
    });
    return () => {
      cancelled = true;
    };
  });
</script>

{#if html}
  <div class="font-mono text-sm {className}">{@html html}</div>
{:else}
  <pre
    class="rounded-lg bg-[#faf9f2] border border-dark/10 p-4 text-sm font-mono overflow-x-auto text-dark/70 {className}"
  ><code>{code}</code></pre>
{/if}
