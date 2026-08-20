<script setup lang="ts">
const settingsStore = useSettingsStore();
const principles = computed(() => settingsStore.cfpPrinciples);
</script>

<template>
  <section
    id="principles"
    class="bg-section-bg-light py-20 md:py-28"
  >
    <div class="mx-auto max-w-7xl px-6">
      <!-- Heading -->
      <div class="mb-12">
        <span class="font-poppins text-xs font-semibold tracking-widest text-brand-secondary uppercase">
          Foundation
        </span>
        <h2 class="mt-2 mb-4 font-lora text-3xl font-bold text-brand-primary md:text-4xl">
          7 Principles of Social Business
        </h2>
        <p class="max-w-2xl font-poppins leading-relaxed text-gray-600">
          Based on Professor Muhammad Yunus' definition: a non-dividend company created to solve
          human problems. Submissions should align with these principles.
        </p>
      </div>

      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="p in principles"
          :key="p.n"
          class="flex gap-4 rounded-2xl border border-brand-primary/15 bg-white p-6 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
        >
          <div class="shrink-0">
            <div
              class="flex size-9 items-center justify-center rounded-full bg-brand-primary font-lora text-sm font-bold text-white"
            >
              {{ p.n }}
            </div>
          </div>
          <div>
            <div class="mb-2 font-lora text-base font-semibold text-brand-primary">
              {{ p.short }}
            </div>
            <p class="font-poppins text-sm leading-relaxed text-gray-600">
              {{ p.text }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
