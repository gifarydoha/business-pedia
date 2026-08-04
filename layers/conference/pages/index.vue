<script setup lang="ts">
const settingsStore = useSettingsStore();

definePageMeta({ layout: "default" });

useSeoMeta({
  title: computed(() => settingsStore.cfpHero.conferenceName ?? "SBAC 2026"),
  description: computed(() => settingsStore.cfpHero.description ?? ""),
});
</script>

<template>
  <div>
    <CfpHero />
    <CfpPrinciples />
    <CfpTopics />
    <CfpDates />
    <CfpSubmission />
  </div>
</template>
