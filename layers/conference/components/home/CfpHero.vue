<script setup lang="ts">
import { useUserPaper } from "~~/layers/conference/composables/useUserPaper";

const { hasSubmittedPaper, submittedPaperId } = useUserPaper();

defineProps<{
  title: string;
  tagline: string;
  description: string;
}>();

// const stats = [
//   { val: "13th", label: "Annual Conference" },
//   { val: "9", label: "Conference Tracks" },
//   { val: "23+", label: "Paper Themes" },
//   { val: "4", label: "Peer-Reviewed Contacts" },
// ];
</script>

<template>
  <section
    id="about"
    class="relative overflow-hidden bg-brand-primary"
  >
    <!-- Texture overlay -->
    <div
      class="absolute inset-0 opacity-10"
      style="
        background-image: repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%);
        background-size: 10px 10px;
      "
    />

    <div class="relative mx-auto max-w-7xl px-6 py-20 md:py-28 lg:py-32">
      <!-- Eyebrow -->
      <div class="mb-6 inline-flex items-center gap-2">
        <span
          class="rounded-full bg-white px-4 py-1 font-poppins text-xs font-semibold tracking-widest text-brand-primary uppercase"
        >
          Call for Papers
        </span>
        <span class="font-poppins text-xs font-medium text-white">· SBAC 2026</span>
      </div>

      <h1 class="mb-4 max-w-6xl font-lora text-4xl leading-tight font-bold text-white md:text-5xl lg:text-6xl">
        {{ title }}
      </h1>

      <p class="mb-8 font-lora text-xl text-brand-secondary italic md:text-2xl">
        {{ tagline }}
      </p>

      <p class="mb-10 max-w-4xl font-poppins text-base leading-relaxed text-white/85 md:text-lg">
        {{ description }}
      </p>

      <div class="flex flex-wrap gap-4">
        <NuxtLink
          :to="hasSubmittedPaper ? `/submit-paper/${submittedPaperId}` : '/submit-paper/draft'"
          class="rounded-full bg-destructive px-8 py-3 font-lora text-base font-bold text-white shadow-lg transition-opacity hover:opacity-90"
        >
          {{ hasSubmittedPaper ? 'Edit Your Paper' : 'Submit Your Paper' }}
        </NuxtLink>
        <a
          href="/call-for-papers"
          class="rounded-full border-2 border-white px-8 py-3 font-lora text-base font-bold text-white transition-colors hover:bg-white/10"
        >
          Read Full CFP
        </a>
      </div>

      <!-- Stat strip -->
      <!-- <div class="mt-16 grid grid-cols-2 gap-6 border-t border-white/20 pt-10 sm:grid-cols-4">
        <div
          v-for="s in stats"
          :key="s.label"
        >
          <div class="font-lora text-3xl font-bold text-brand-secondary">
            {{ s.val }}
          </div>
          <div class="mt-1 font-poppins text-sm text-white/70">
            {{ s.label }}
          </div>
        </div>
      </div> -->
    </div>
  </section>
</template>
