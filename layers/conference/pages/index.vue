<script setup lang="ts">
import { computed, watch, onMounted } from "vue";
import { useCfpService } from "../services/cfp.service";
import { parseCfpContent, parseTracksContent, parseCommitteeContent } from "../utils/cfpParser";

definePageMeta({ layout: "conference" });

const cfpService = useCfpService();
const { data, pending, error, refresh } = await useAsyncData(
  "home-content",
  async () => {
    const [cfpHtml, tracksHtml, committeeHtml] = await Promise.all([
      cfpService.fetchCallForPapers(),
      cfpService.fetchTracks(),
      cfpService.fetchCommittee(),
    ]);

    return {
      cfp: parseCfpContent(cfpHtml),
      tracks: parseTracksContent(tracksHtml),
      committee: parseCommitteeContent(committeeHtml),
    };
  },
);

// If SSR couldn't load data, auto-retry on the client
// so the page never stays blank — user always sees loading until data arrives.
onMounted(() => {
  if (error.value || !data.value) {
    refresh();
  }
});
watch(error, (err) => {
  if (err) {
    setTimeout(() => refresh(), 800);
  }
});

const heroTitle = computed(() => data.value?.cfp?.header?.title ?? "SBAC 2026");
const heroTagline = computed(() => data.value?.cfp?.header?.subtitle ?? "Advancing Social Business Research");
const heroDescription = computed(() => {
  const raw = data.value?.cfp?.overview?.[0] ?? "";
  return raw.replace(/<[^>]*>?/gm, ""); // Strip HTML tags for the hero P tag
});

useSeoMeta({
  title: heroTitle,
  description: heroDescription,
});
</script>

<template>
  <div>
    <!-- Loading: shown while fetching or while client is auto-retrying -->
    <div
      v-if="pending || error || !data"
      class="flex min-h-[60vh] flex-col items-center justify-center gap-4 py-32 font-poppins"
    >
      <div class="size-10 animate-spin rounded-full border-4 border-brand-primary border-t-transparent" />
      <p class="text-sm text-gray-400">
        Loading content…
      </p>
    </div>

    <template v-else>
      <HomeCfpHero
        :title="heroTitle"
        :tagline="heroTagline"
        :description="heroDescription"
      />

      <HomeTracksSection :tracks="data.tracks" />

      <HomeCfpDates :dates="data.cfp.dates" />

      <HomeCommitteeSection :committee-data="data.committee" />
    </template>
  </div>
</template>
