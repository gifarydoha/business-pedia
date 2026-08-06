<script setup lang="ts">
const settingsStore = useSettingsStore();

definePageMeta({ layout: "conference" });

useSeoMeta({
  title: computed(() => settingsStore.cfpHero.conferenceName ?? "SBAC 2026"),
  description: computed(() => settingsStore.cfpHero.description ?? ""),
});
</script>

<template>
  <div>
    <HomeCfpHero />
    <HomeCfpPrinciples />
    <HomeCfpTopics />
    <HomeCfpDates />
    <HomeCfpSubmission />
  </div>
</template>
