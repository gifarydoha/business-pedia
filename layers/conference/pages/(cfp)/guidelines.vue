<script setup lang="ts">
const settingsStore = useSettingsStore();
definePageMeta({ layout: "default" });

useSeoMeta({
  title: computed(() => `Submission Guidelines — ${settingsStore.cfpHero.conferenceName ?? "SBAC 2026"}`),
});
</script>

<template>
  <div>
    <CfpBreadcrumb :crumbs="[{ label: 'Submission Guidelines' }]" />

    <!-- Page header -->
    <div class="bg-cfp-olive">
      <div class="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <span
          class="mb-5 inline-block rounded-full bg-cfp-yellow/20 px-4 py-1 font-poppins text-xs font-semibold tracking-widest text-cfp-yellow uppercase">
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

    <div class="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <CfpGuidelinesSections />
      <CfpSubmissionSteps />
      <CfpCtaBand />
    </div>
  </div>
</template>
