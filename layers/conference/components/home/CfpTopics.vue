<script setup lang="ts">
const settingsStore = useSettingsStore();
const tracks = computed(() => settingsStore.cfpTracks);
const themes = computed(() => settingsStore.cfpThemes);
</script>

<template>
  <section id="tracks" class="bg-brand-primary-light py-20 md:py-28">
    <div class="mx-auto max-w-7xl px-6">
      <div class="mb-12">
        <span class="font-poppins text-xs font-semibold tracking-widest text-brand-secondary uppercase">
          Scientific Committee
        </span>
        <h2 class="mt-2 mb-4 font-lora text-3xl font-bold text-brand-primary md:text-4xl">
          Conference Tracks
        </h2>
        <p class="max-w-2xl font-poppins leading-relaxed text-gray-600">
          Our Scientific Committee organises peer assessment of abstracts across six major
          interdisciplinary tracks. In-person and online presentations are both welcome.
        </p>
      </div>

      <div class="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="t in tracks" :key="t.label"
          class="rounded-2xl border border-brand-primary/15 bg-white p-6 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl">
          <div class="mb-4 flex items-start justify-between">
            <span class="text-3xl" role="img" :aria-label="t.label">
              {{ t.icon }}
            </span>
            <span class="rounded-full bg-brand-secondary/20 px-3 py-1 font-poppins text-xs font-semibold text-brand-primary">
              {{ t.tag }}
            </span>
          </div>
          <h3 class="font-lora text-base leading-snug font-semibold text-brand-primary">
            {{ t.label }}
          </h3>
        </div>
      </div>

      <!-- Themes sub-list -->
      <div class="rounded-2xl border border-brand-primary/15 bg-white p-8 shadow-lg">
        <h3 class="mb-5 font-lora text-lg font-semibold text-brand-primary">
          Specific Themes Covered
        </h3>
        <ul class="grid grid-cols-1 gap-x-10 gap-y-2 sm:grid-cols-2">
          <li v-for="th in themes" :key="th" class="flex items-start gap-2 font-poppins text-sm text-gray-600">
            <span class="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-secondary" />
            {{ th }}
          </li>
        </ul>
        <p class="mt-5 font-poppins text-sm text-brand-primary/60 italic">
          + more themes across wealth creation, war & peace, and other emerging issues.
        </p>
      </div>
    </div>
  </section>
</template>
