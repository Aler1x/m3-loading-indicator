<script lang="ts">
  import { PROP_DOCS } from "../lib/props";
</script>

<div class="overflow-x-auto rounded-2xl border border-dark/10">
  <table class="w-full text-sm">
    <thead>
      <tr class="border-b border-dark/10 text-left">
        <th class="px-4 py-3 text-xs font-semibold uppercase tracking-widest text-dark/40 font-mono">
          Prop
        </th>
        <th class="px-4 py-3 text-xs font-semibold uppercase tracking-widest text-dark/40 font-mono">
          Type
        </th>
        <th class="px-4 py-3 text-xs font-semibold uppercase tracking-widest text-dark/40 font-mono">
          Default
        </th>
        <th class="px-4 py-3 text-xs font-semibold uppercase tracking-widest text-dark/40 font-mono">
          Description
        </th>
      </tr>
    </thead>
    <tbody class="divide-y divide-dark/5">
      {#each PROP_DOCS as prop (prop.name)}
        <tr class="hover:bg-muted transition-colors duration-150">
          <td class="px-4 py-3">
            <code class="font-mono text-xs text-coral bg-coral/10 px-1.5 py-0.5 rounded-md">
              {prop.name}
            </code>
          </td>
          <td class="px-4 py-3">
            <code class="font-mono text-xs text-dark/60 bg-subtle px-1.5 py-0.5 rounded-md">
              {prop.type}
            </code>
          </td>
          <td class="px-4 py-3">
            <code class="font-mono text-xs text-dark/60 bg-subtle px-1.5 py-0.5 rounded-md">
              {prop.default}
            </code>
          </td>
          <td class="px-4 py-3 text-dark/70">{prop.description}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
