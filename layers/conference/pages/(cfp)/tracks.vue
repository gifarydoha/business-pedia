<script setup lang="ts">
import { watch, onMounted } from "vue";
import TrackCard from "../../components/cfp/tracks/TrackCard.vue";
import { useCfpService } from "../../services/cfp.service";
import { parseTracksContent } from "../../utils/cfpParser";

definePageMeta({ layout: "conference" });

const cfpService = useCfpService();
const { data: tracks, pending: loading, error, refresh } = await useAsyncData(
  "tracks-content",
  () => cfpService.fetchTracks().then(parseTracksContent),
);

// If SSR couldn't load data, auto-retry on the client.
onMounted(() => {
  if (error.value || !tracks.value) {
    refresh();
  }
});
watch(error, (err) => {
  if (err) {
    setTimeout(() => refresh(), 800);
  }
});
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

      <!-- Loading: shown while fetching or while client is auto-retrying -->
      <div
        v-if="loading || error || !tracks"
        class="flex min-h-[40vh] flex-col items-center justify-center gap-4"
      >
        <div class="size-10 animate-spin rounded-full border-4 border-cfp-olive border-t-transparent" />
        <p class="font-poppins text-sm text-gray-400">
          Loading content…
        </p>
      </div>

      <div
        v-else
        class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        <TrackCard
          v-for="(t, i) in tracks"
          :key="t.name"
          :index="i + 1"
          :name="t.name"
          :description="t.description"
        />
      </div>
    </div>
  </section>
</template>
