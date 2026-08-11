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
    <h2 class="mb-5 border-b border-cfp-olive/15 pb-2 font-lora text-2xl font-bold text-cfp-olive">
      Conference Tracks
    </h2>
    <ol class="space-y-3">
      <li
        v-for="(t, i) in tracks"
        :key="i"
        class="flex items-start gap-3"
      >
        <span
          class="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-cfp-olive font-lora text-xs font-bold text-white"
        >
          {{ i + 1 }}
        </span>
        <span class="font-poppins leading-relaxed text-gray-700">
          <strong class="text-cfp-olive">{{ t.name }}:</strong> {{ t.description }}
        </span>
      </li>
    </ol>
  </section>
</template>
