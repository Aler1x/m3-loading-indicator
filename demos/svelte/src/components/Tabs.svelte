<script lang="ts">
  interface Tab {
    id: string;
    label: string;
  }

  interface Props {
    tabs: Tab[];
    value: string;
    onchange: (id: string) => void;
  }

  let { tabs, value, onchange }: Props = $props();
</script>

<div
  class="inline-flex gap-0.5 p-1 bg-subtle rounded-xl border border-dark/10"
  role="tablist"
>
  {#each tabs as tab (tab.id)}
    <button
      type="button"
      role="tab"
      aria-selected={value === tab.id}
      onclick={() => onchange(tab.id)}
      class="px-3.5 py-1.5 text-sm font-medium rounded-lg transition-all duration-150
        {value === tab.id
        ? 'bg-paper text-dark shadow-sm'
        : 'text-dark/50 hover:text-dark hover:bg-muted'}"
    >
      {tab.label}
    </button>
  {/each}
</div>
