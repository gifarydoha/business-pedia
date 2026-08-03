<script setup lang="ts">
import { ref } from "vue";

const open = ref(false);
const links = ["About", "Principles", "Tracks", "Dates", "Submit"];
</script>

<template>
  <nav class="sticky top-0 z-50 bg-cfp-olive shadow-md">
    <div class="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-3">
      <div class="flex items-center gap-3">
        <div class="flex size-8 items-center justify-center rounded-full bg-cfp-yellow">
          <span class="font-lora text-xs font-bold text-cfp-olive">SB</span>
        </div>
        <span class="font-lora text-lg font-bold tracking-tight text-white">SBAC 2023</span>
      </div>

      <!-- Desktop links -->
      <div class="hidden items-center gap-6 md:flex">
        <a
          v-for="l in links"
          :key="l"
          :href="`#${l.toLowerCase()}`"
          class="font-poppins text-sm text-white/80 transition-colors hover:text-white"
        >
          {{ l }}
        </a>
      </div>

      <a
        href="#submit"
        class="hidden rounded-full bg-cfp-red px-5 py-2 font-lora text-sm font-bold text-white transition-opacity hover:opacity-90 md:inline-flex"
      >
        Submit Your Paper
      </a>

      <!-- Mobile hamburger -->
      <button
        class="text-white md:hidden"
        aria-label="Toggle menu"
        @click="open = !open"
      >
        <svg
          class="size-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            v-if="open"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
          <path
            v-else
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
    </div>

    <!-- Mobile menu -->
    <div
      v-show="open"
      class="flex flex-col gap-3 bg-cfp-olive-dark px-6 pb-4 md:hidden"
    >
      <a
        v-for="l in links"
        :key="l"
        :href="`#${l.toLowerCase()}`"
        class="py-1 font-poppins text-sm text-white/80 transition-colors hover:text-white"
        @click="open = false"
      >
        {{ l }}
      </a>
      <a
        href="#submit"
        class="mt-2 rounded-full bg-cfp-red px-5 py-2 text-center font-lora text-sm font-bold text-white transition-opacity hover:opacity-90"
        @click="open = false"
      >
        Submit Your Paper
      </a>
    </div>
  </nav>
</template>
