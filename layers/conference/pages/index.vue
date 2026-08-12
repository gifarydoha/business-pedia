<script setup lang="ts">
import { computed } from "vue";
import { cfpService } from "../services/cfp.service";
import { parseCfpContent, parseTracksContent, parseCommitteeContent } from "../utils/cfpParser";

definePageMeta({ layout: "conference" });

const { data, pending, error } = await useAsyncData(
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
    <div
      v-if="pending"
      class="py-32 text-center font-poppins text-gray-500"
    >
      Loading Homepage…
    </div>

    <div
      v-else-if="error || !data"
      class="py-32 text-center font-poppins text-gray-500"
    >
      Unable to load content right now. Please try again shortly.
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
