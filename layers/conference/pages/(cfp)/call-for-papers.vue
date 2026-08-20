<script setup lang="ts">
import { watch, onMounted } from "vue";
import { useCfpService } from "../../services/cfp.service";
import { parseCfpContent } from "../../utils/cfpParser";
import Header from "../../components/cfp/callForPapers/Header.vue";
import Meta from "../../components/cfp/callForPapers/Meta.vue";
import Overview from "../../components/cfp/callForPapers/Overview.vue";
import Tracks from "../../components/cfp/callForPapers/Tracks.vue";
import TocSidebar from "../../components/cfp/callForPapers/TocSidebar.vue";
import CfpImportantDates from "../../components/cfp/callForPapers/importantDates.vue";

definePageMeta({ layout: "conference" });

const cfpService = useCfpService();
const { data: cfpData, pending, error, refresh } = await useAsyncData(
  "cfp-content",
  () => cfpService.fetchCallForPapers().then(parseCfpContent),
);

// If SSR couldn't load data, auto-retry on the client.
onMounted(() => {
  if (error.value || !cfpData.value) {
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
  <div class="mx-auto max-w-7xl px-6 py-12 lg:py-16">
    <!-- Loading: shown while fetching or while client is auto-retrying -->
    <div
      v-if="pending || error || !cfpData"
      class="flex min-h-[60vh] flex-col items-center justify-center gap-4"
    >
      <div class="size-10 animate-spin rounded-full border-4 border-brand-primary border-t-transparent" />
      <p class="font-poppins text-sm text-gray-400">
        Loading content…
      </p>
    </div>

    <div
      v-else
      class="items-start lg:grid lg:grid-cols-[1fr_260px] lg:gap-14"
    >
      <article class="min-w-0">
        <Header :header="cfpData.header" />
        <Meta :meta="cfpData.meta" />
        <Overview :overview="cfpData.overview" />
        <Tracks :tracks="cfpData.tracks" />

        <section
          id="important-dates"
          class="scroll-mt-24"
        >
          <CfpImportantDates :dates="cfpData.dates" />
        </section>
      </article>

      <TocSidebar />
    </div>
  </div>
</template>
