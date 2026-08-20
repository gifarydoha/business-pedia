<script setup lang="ts">
import type { CfpTrack } from "../../../types/cfp";

defineProps<{
  tracks: CfpTrack[];
}>();
</script>

<template>
  <section
    id="tracks"
    class="mb-12 scroll-mt-24"
  >
    <h2 class="mb-5 border-b border-brand-primary/15 pb-2 font-lora text-2xl font-bold text-brand-primary">
      Conference Tracks
    </h2>
    <ol class="space-y-3">
      <li
        v-for="(t, i) in tracks"
        :key="i"
        class="flex items-start gap-3"
      >
        <span
          class="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-primary font-lora text-xs font-bold text-white"
        >
          {{ i + 1 }}
        </span>
        <span class="font-poppins leading-relaxed text-gray-700">
          <strong class="text-brand-primary">{{ t.name }}:</strong> {{ t.description }}
        </span>
      </li>
    </ol>
  </section>
</template>
