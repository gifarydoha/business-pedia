<script setup lang="ts">
import CfpImportantDates from '~/components/CfpImportantDates.vue';

const { data: cfp, pending, error } = await useCfpContent();
</script>

<template>
  <article class="min-w-0">
    <div v-if="pending" class="py-20 text-center font-poppins text-gray-500">
      Loading Call for Papers…
    </div>

    <div v-else-if="error || !cfp" class="py-20 text-center font-poppins text-gray-500">
      Unable to load Call for Papers content right now. Please try again shortly.
    </div>

    <template v-else>
      <!-- Header -->
      <div class="mb-10">
        <span
          class="mb-4 inline-block rounded-full bg-cfp-yellow/20 px-4 py-1 font-poppins text-xs font-semibold tracking-widest text-cfp-olive uppercase"
        >
          Call for Papers
        </span>
        <h1 class="mb-3 font-lora text-3xl leading-tight font-bold text-cfp-olive md:text-4xl lg:text-5xl">
          {{ cfp.header.title }}
        </h1>
        <p class="font-lora text-lg text-cfp-yellow italic md:text-xl">
          {{ cfp.header.subtitle }}
        </p>
      </div>

      <!-- Meta -->
      <section class="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <span class="font-poppins text-xs font-semibold tracking-widest text-cfp-olive/60 uppercase">Date</span>
          <p class="font-lora text-base font-semibold text-cfp-olive">{{ cfp.meta.date }}</p>
        </div>
        <div>
          <span class="font-poppins text-xs font-semibold tracking-widest text-cfp-olive/60 uppercase">Venue</span>
          <p class="font-lora text-base font-semibold text-cfp-olive">{{ cfp.meta.venue }}</p>
        </div>
        <div>
          <span class="font-poppins text-xs font-semibold tracking-widest text-cfp-olive/60 uppercase">Co-organized by</span>
          <p class="font-lora text-base font-semibold text-cfp-olive">{{ cfp.meta.coOrganizedBy }}</p>
        </div>
        <div>
          <span class="font-poppins text-xs font-semibold tracking-widest text-cfp-olive/60 uppercase">Theme</span>
          <p class="font-lora text-base font-semibold text-cfp-olive">{{ cfp.meta.theme }}</p>
        </div>
      </section>

      <!-- Overview -->
      <section
        id="overview"
        class="mb-12 scroll-mt-24"
      >
        <h2 class="mb-5 border-b border-cfp-olive/15 pb-2 font-lora text-2xl font-bold text-cfp-olive">
          Overview
        </h2>
        <div class="space-y-4 font-poppins leading-relaxed text-gray-700">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <p
            v-for="(p, i) in cfp.overview"
            :key="i"
            v-html="p"
          />
        </div>
      </section>

      <!-- Tracks -->
      <section
        id="tracks"
        class="mb-12 scroll-mt-24"
      >
        <h2 class="mb-5 border-b border-cfp-olive/15 pb-2 font-lora text-2xl font-bold text-cfp-olive">
          Conference Tracks
        </h2>
        <ol class="space-y-3">
          <li
            v-for="(t, i) in cfp.tracks"
            :key="i"
            class="flex items-start gap-3"
          >
            <span
              class="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-cfp-olive font-lora text-xs font-bold text-white"
            >
              {{ i + 1 }}
            </span>
            <span class="font-poppins leading-relaxed text-gray-700">
              <strong class="text-cfp-olive">{{ t.name }}:</strong> {{ t.description }}
            </span>
          </li>
        </ol>
      </section>

      <!-- Important Dates -->
      <CfpImportantDates :dates="cfp.dates" />
    </template>
  </article>
</template>