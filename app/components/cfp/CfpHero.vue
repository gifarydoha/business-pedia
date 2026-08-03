<script setup lang="ts">
const settingsStore = useSettingsStore();
</script>

<template>
  <section
    id="about"
    class="relative overflow-hidden bg-cfp-olive"
  >
    <!-- Texture overlay -->
    <div
      class="absolute inset-0 opacity-10"
      style="
        background-image: repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%);
        background-size: 10px 10px;
      "
    />

    <div class="relative mx-auto max-w-6xl px-6 py-20 md:py-28 lg:py-32">
      <!-- Eyebrow -->
      <div class="mb-6 inline-flex items-center gap-2">
        <span
          class="rounded-full bg-cfp-yellow px-4 py-1 font-poppins text-xs font-semibold tracking-widest text-cfp-olive uppercase"
        >
          Call for Papers
        </span>
        <span class="font-poppins text-xs text-white/50">· SBAC 2026</span>
      </div>

      <h1 class="mb-4 max-w-4xl font-lora text-4xl leading-tight font-bold text-white md:text-5xl lg:text-6xl">
        {{ settingsStore.cfpHero.conferenceName }}
      </h1>

      <p class="mb-8 font-lora text-xl text-cfp-yellow italic md:text-2xl">
        {{ settingsStore.cfpHero.tagline }}
      </p>

      <p class="mb-10 max-w-2xl font-poppins text-base leading-relaxed text-white/85 md:text-lg">
        {{ settingsStore.cfpHero.description }}
      </p>

      <div class="flex flex-wrap gap-4">
        <a
          href="#submit"
          class="rounded-full bg-cfp-red px-8 py-3 font-lora text-base font-bold text-white shadow-lg transition-opacity hover:opacity-90"
        >
          Submit Your Paper
        </a>
        <a
          href="#about"
          class="rounded-full border-2 border-white px-8 py-3 font-lora text-base font-bold text-white transition-colors hover:bg-white/10"
        >
          Read Full CFP
        </a>
      </div>

      <!-- Stat strip -->
      <div class="mt-16 grid grid-cols-2 gap-6 border-t border-white/20 pt-10 sm:grid-cols-4">
        <div
          v-for="s in settingsStore.cfpHero.stats"
          :key="s.label"
        >
          <div class="font-lora text-3xl font-bold text-cfp-yellow">
            {{ s.val }}
          </div>
          <div class="mt-1 font-poppins text-sm text-white/70">
            {{ s.label }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
