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
    <HomeCfpPrinciples />
    <HomeCfpTopics />
    <HomeCfpDates :dates="settingsStore.cfpDates" />
    <HomeCfpSubmission />
  </div>
</template>
