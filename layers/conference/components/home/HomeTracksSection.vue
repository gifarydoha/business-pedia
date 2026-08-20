<script setup lang="ts">
import type { CfpTrack } from "../../types/cfp";
import TrackCard from "../cfp/tracks/TrackCard.vue";

defineProps<{
  tracks: CfpTrack[];
}>();
</script>

<template>
  <section id="tracks" class="bg-brand-primary-light py-20 md:py-28">
    <div class="mx-auto max-w-7xl px-6">
      <div class="mb-12">
        <span class="font-poppins text-xs font-semibold tracking-widest text-brand-secondary uppercase">
          Scientific Committee
        </span>
        <h2 class="mt-2 mb-4 font-lora text-3xl font-bold text-brand-primary md:text-4xl">
          Conference Tracks
        </h2>
        <p class="max-w-2xl font-poppins leading-relaxed text-gray-600">
          Our Scientific Committee organises peer assessment of abstracts across six major
          interdisciplinary tracks. In-person and online presentations are both welcome.
        </p>
      </div>

      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <TrackCard v-for="(t, i) in tracks" :key="t.name" :index="i + 1" :name="t.name" :description="t.description" />
      </div>
    </div>
  </section>
</template>
