<script lang="ts">
  import M3LoadingIndicator from "@alerix/m3-loading-indicator/svelte";
  import { DEFAULT_PLAYGROUND, type PlaygroundState } from "../lib/props";

  const PRESET_COLORS = ["#6442D6", "#F76F53", "#111827", "#6287f5", "#16A34A", "#D97706"];

  const PRESET_CONTAINER_COLORS = [
    "#E8DEF8",
    "#FFE4DC",
    "#E5E7EB",
    "#DBEAFE",
    "#DCFCE7",
    "#FEF3C7",
  ];

  const SIZE_PRESETS = [32, 64, 96, 128];
  const SPEED_PRESETS = [0.5, 1, 1.5, 2];

  let config = $state<PlaygroundState>({ ...DEFAULT_PLAYGROUND });

  function patch(partial: Partial<PlaygroundState>) {
    config = { ...config, ...partial };
  }
</script>

<div class="space-y-10">
  <header class="space-y-2">
    <h1 class="text-4xl font-semibold text-dark tracking-tight">Playground</h1>
    <p class="text-dark/60">
      Tune props and preview the component. Copy the snippet for any framework.
    </p>
  </header>

  <div class="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">
    <!-- Preview -->
    <section
      class="rounded-2xl border border-dark/10 bg-paper flex flex-col items-center justify-center gap-6 p-12 min-h-64"
      aria-label="Live preview"
    >
      <div style:color={config.color}>
        <M3LoadingIndicator
          size={config.size}
          color={config.color}
          sizeRatio={config.sizeRatio}
          speed={config.speed}
          paused={config.paused}
          contained={config.contained}
          containerColor={config.containerColor}
        />
      </div>
    </section>

    <!-- Controls -->
    <section class="rounded-2xl border border-dark/10 bg-paper p-6 space-y-5" aria-label="Controls">
      <div class="flex items-center justify-between">
        <h2 class="text-xs font-semibold uppercase tracking-widest text-dark/40 font-mono">
          Props
        </h2>
        <button
          type="button"
          class="text-xs text-dark/40 hover:text-coral transition-colors duration-150 underline underline-offset-4"
          onclick={() => (config = { ...DEFAULT_PLAYGROUND })}
        >
          Reset defaults
        </button>
      </div>

      <div class="space-y-5">
        <!-- Size -->
        <div class="space-y-2">
          <span class="text-sm font-medium text-dark">
            Size <span class="text-dark/40 font-mono text-xs">{config.size}px</span>
          </span>
          <input
            type="range"
            min="24"
            max="128"
            step="4"
            value={config.size}
            class="w-full accent-coral"
            oninput={(e) => patch({ size: Number(e.currentTarget.value) })}
          />
          <div class="flex gap-1.5">
            {#each SIZE_PRESETS as s (s)}
              <button
                type="button"
                onclick={() => patch({ size: s })}
                class="flex-1 py-1 text-xs font-mono rounded-lg border transition-all duration-150
                  {config.size === s
                  ? 'bg-dark text-paper border-dark'
                  : 'border-dark/15 text-dark/50 hover:border-dark/40 hover:text-dark'}"
              >
                {s}
              </button>
            {/each}
          </div>
        </div>

        <!-- Color -->
        <div class="space-y-2">
          <span class="text-sm font-medium text-dark">Color</span>
          <div class="flex gap-2">
            {#each PRESET_COLORS as c (c)}
              <button
                type="button"
                onclick={() => patch({ color: c })}
                class="w-7 h-7 rounded-full transition-all duration-150 flex-shrink-0
                  {config.color === c
                  ? 'ring-2 ring-offset-2 ring-dark/40 scale-110'
                  : 'hover:scale-105'}"
                style:background-color={c}
                aria-label={c}
              ></button>
            {/each}
          </div>
        </div>

        <!-- Speed -->
        <div class="space-y-2">
          <span class="text-sm font-medium text-dark">
            Speed <span class="text-dark/40 font-mono text-xs">{config.speed.toFixed(1)}×</span>
          </span>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.05"
            value={config.speed}
            class="w-full accent-coral"
            oninput={(e) => patch({ speed: Number(e.currentTarget.value) })}
          />
          <div class="flex gap-1.5">
            {#each SPEED_PRESETS as s (s)}
              <button
                type="button"
                onclick={() => patch({ speed: s })}
                class="flex-1 py-1 text-xs font-mono rounded-lg border transition-all duration-150
                  {config.speed === s
                  ? 'bg-dark text-paper border-dark'
                  : 'border-dark/15 text-dark/50 hover:border-dark/40 hover:text-dark'}"
              >
                {s}×
              </button>
            {/each}
          </div>
        </div>

        <!-- Contained -->
        <label class="flex items-center justify-between cursor-pointer">
          <span class="text-sm font-medium text-dark">Contained</span>
          <input
            type="checkbox"
            checked={config.contained}
            class="w-4 h-4 accent-coral"
            onchange={(e) => patch({ contained: e.currentTarget.checked })}
          />
        </label>

        {#if config.contained}
          <div class="space-y-2">
            <span class="text-sm font-medium text-dark">Container color</span>
            <div class="flex gap-2">
              {#each PRESET_CONTAINER_COLORS as c (c)}
                <button
                  type="button"
                  onclick={() => patch({ containerColor: c })}
                  class="w-7 h-7 rounded-full border border-dark/10 transition-all duration-150 flex-shrink-0
                    {config.containerColor === c
                    ? 'ring-2 ring-offset-2 ring-dark/40 scale-110'
                    : 'hover:scale-105'}"
                  style:background-color={c}
                  aria-label={c}
                ></button>
              {/each}
            </div>
          </div>
        {/if}
      </div>
    </section>
  </div>
</div>
