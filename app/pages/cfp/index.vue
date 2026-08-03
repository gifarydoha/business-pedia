<script setup lang="ts">
definePageMeta({ layout: false });

useSeoMeta({
  title: "Call for Papers — SBAC 2023",
  description: "11th Social Business Academia Conference. Submit your paper on social business, poverty, SDGs, and related themes.",
});
</script>

<template>
  <div class="min-h-screen font-poppins">
    <CfpNav />
    <CfpHero />
    <CfpPrinciples />
    <CfpTopics />
    <CfpDates />
    <CfpSubmission />
    <CfpFooter />
  </div>
</template>
