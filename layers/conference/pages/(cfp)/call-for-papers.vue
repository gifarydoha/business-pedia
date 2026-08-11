<script setup lang="ts">
import { useCfpStore } from "../../stores/cfp";
import Header from "../../components/cfp/callForPapers/Header.vue";
import Meta from "../../components/cfp/callForPapers/Meta.vue";
import Overview from "../../components/cfp/callForPapers/Overview.vue";
import Tracks from "../../components/cfp/callForPapers/Tracks.vue";
import TocSidebar from "../../components/cfp/callForPapers/TocSidebar.vue";
import CfpImportantDates from "../../components/cfp/callForPapers/importantDates.vue";

definePageMeta({ layout: "conference" });
const cfpStore = useCfpStore();

const nuxtApp = useNuxtApp();
const { pending, error } = await useAsyncData(
  "cfp-content",
  async () => {
    await cfpStore.fetchCfpData(true);
    return true;
  },
  {
    getCachedData(key) {
      // On SSR: isHydrating is false → returning null was telling Nuxt
      // "I have cached data (null), skip the fetch" — so the API never fired.
      // Fix: return undefined when there's nothing cached, so Nuxt always fetches.
      if (nuxtApp.isHydrating) {
        const cached = nuxtApp.payload.data[key];
        // Only use payload if the key actually exists (was fetched during SSR)
        if (cached !== undefined) return cached;
      }
      return undefined;
    },
  },
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
      v-else-if="error || !cfpStore.cfpData"
      class="py-20 text-center font-poppins text-gray-500"
    >
      Unable to load Call for Papers content right now. Please try again shortly.
    </div>

    <div
      v-else
      class="items-start lg:grid lg:grid-cols-[1fr_260px] lg:gap-14"
    >
      <article class="min-w-0">
        <Header :header="cfpStore.cfpData.header" />
        <Meta :meta="cfpStore.cfpData.meta" />
        <Overview :overview="cfpStore.cfpData.overview" />
        <Tracks :tracks="cfpStore.cfpData.tracks" />

        <section
          id="important-dates"
          class="scroll-mt-24"
        >
          <CfpImportantDates :dates="cfpStore.cfpData.dates" />
        </section>
      </article>

      <TocSidebar />
    </div>
  </div>
</template>
