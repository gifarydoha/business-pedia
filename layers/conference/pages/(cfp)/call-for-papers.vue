<script setup lang="ts">
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
const { data: cfpData, pending, error } = await useAsyncData(
  "cfp-content",
  () => cfpService.fetchCallForPapers().then(parseCfpContent),
);
</script>

<template>
  <div class="mx-auto max-w-6xl px-6 py-12 lg:py-16">
    <div
      v-if="pending"
      class="py-20 text-center font-poppins text-gray-500"
    >
      Loading Call for Papers…
    </div>

    <div
      v-else-if="error || !cfpData"
      class="py-20 text-center font-poppins text-gray-500"
    >
      Unable to load Call for Papers content right now. Please try again shortly.
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
