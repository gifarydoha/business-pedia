<script setup lang="ts">
const settingsStore = useSettingsStore();
definePageMeta({ layout: "conference" });

useSeoMeta({
  title: computed(() => `Submission Guidelines — ${settingsStore.cfpHero.conferenceName ?? "SBAC 2026"}`),
});
</script>

<template>
  <div>
    <CfpSharedBreadcrumb :crumbs="[{ label: 'Submission Guidelines' }]" />

    <!-- Page header -->
    <div class="bg-brand-primary">
      <div class="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <span
          class="mb-5 inline-block rounded-full bg-brand-secondary/20 px-4 py-1 font-poppins text-xs font-semibold tracking-widest text-brand-secondary uppercase"
        >
          For Authors
        </span>
        <h1 class="mb-4 max-w-3xl font-lora text-3xl leading-tight font-bold text-white md:text-5xl">
          Submission Guidelines
        </h1>
        <p class="max-w-2xl font-poppins leading-relaxed text-white/80">
          Everything you need to know to prepare and submit your paper for SBAC 2026. Follow
          these guidelines to give your work the best chance of acceptance.
        </p>
      </div>
    </div>

    <div class="mx-auto max-w-7xl px-6 py-16 md:py-24">
      <CfpGuidelinesSections />
      <CfpGuidelinesSubmissionSteps />
      <CfpGuidelinesCtaBand />
    </div>
  </div>
</template>
