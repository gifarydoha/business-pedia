<script setup lang="ts">
import TrackCard from "../../components/cfp/tracks/TrackCard.vue";
import { useCfpService } from "../../services/cfp.service";
import { parseTracksContent } from "../../utils/cfpParser";

definePageMeta({ layout: "conference" });

const cfpService = useCfpService();
const { data: tracks, pending: loading, error } = await useAsyncData(
  "tracks-content",
  () => cfpService.fetchTracks().then(parseTracksContent),
);
</script>

<template>
  <section class="bg-cfp-olive-pale py-20 md:py-28">
    <div class="mx-auto max-w-7xl px-6">
      <div class="mb-12">
        <span class="font-poppins text-xs font-semibold tracking-widest text-cfp-yellow uppercase">
          SBAC 2026
        </span>
        <h1 class="mt-2 mb-4 font-lora text-3xl font-bold text-cfp-olive md:text-4xl">
          Conference Tracks
        </h1>
        <p class="max-w-2xl font-poppins leading-relaxed text-gray-600">
          SBAC 2026 welcomes submissions across the following nine interdisciplinary tracks.
        </p>
      </div>

      <div v-if="loading" class="py-16 text-center font-poppins text-gray-500">
        Loading tracks…
      </div>
      <div v-else-if="error || !tracks" class="py-16 text-center font-poppins text-gray-500">
        Unable to load Tracks content right now. Please try again shortly.
      </div>

      <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <TrackCard v-for="(t, i) in tracks" :key="t.name" :index="i + 1" :name="t.name" :description="t.description" />
      </div>
    </div>
  </section>
</template>
