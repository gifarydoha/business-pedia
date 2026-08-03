<script setup lang="ts">
definePageMeta({ layout: "cfp" });

useSeoMeta({
  title: "Call for Papers — SBAC 2026",
});
</script>

<template>
  <div>
    <CfpBreadcrumb :crumbs="[{ label: 'Call for Papers' }]" />

    <!-- Top CTA strip -->
    <div class="bg-cfp-olive">
      <div
        class="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-6 py-4 sm:flex-row sm:items-center"
      >
        <p class="font-poppins text-sm text-white/80">
          Submission deadline: <span class="font-semibold text-cfp-yellow">31 January 2024</span>
        </p>
        <NuxtLink
          to="/submit-paper"
          class="shrink-0 rounded-full bg-cfp-red px-6 py-2 font-lora text-sm font-bold text-white transition-opacity hover:opacity-90"
        >
          Submit Your Paper
        </NuxtLink>
      </div>
    </div>

    <div class="mx-auto max-w-6xl px-6 py-12 lg:py-16">
      <div class="items-start lg:grid lg:grid-cols-[1fr_260px] lg:gap-14">
        <CfpReadFullContent />
        <CfpTocSidebar />
      </div>
    </div>
  </div>
</template>
