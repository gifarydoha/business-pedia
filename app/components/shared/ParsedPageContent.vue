<script setup lang="ts">
import { parsePagesContent } from "~/utils/parsePagesContent";
import { computed } from "vue";

const props = defineProps<{
  htmlContent: string;
}>();

const parsedData = computed(() => {
  return parsePagesContent(props.htmlContent);
});

// Determine if the parsing extracted meaningful sections
const hasParsedData = computed(() => {
  const d = parsedData.value;
  return !!(d.heroTitle || d.introHeading || d.processHeading || d.pillarsHeading || d.featuredHeading || d.contactHeading);
});
</script>

<template>
  <div>
    <!-- Render Parsed Content if available -->
    <div
      v-if="hasParsedData"
      class="space-y-16 py-8"
    >
      <!-- Hero Section -->
      <section
        v-if="parsedData.heroTitle || parsedData.heroLead"
        class="text-center"
      >
        <span
          v-if="parsedData.heroBadge"
          class="mb-4 inline-block rounded-full bg-primary-teal/10 px-4 py-1 text-sm font-semibold tracking-wide text-primary-teal uppercase"
        >
          {{ parsedData.heroBadge }}
        </span>
        <h1
          v-if="parsedData.heroTitle"
          class="mb-6 font-serif text-4xl font-bold text-primary-sky md:text-5xl"
        >
          {{ parsedData.heroTitle }}
        </h1>
        <p
          v-if="parsedData.heroLead"
          class="mx-auto max-w-3xl text-lg text-gray-600 md:text-xl"
        >
          {{ parsedData.heroLead }}
        </p>
      </section>

      <!-- Intro Section -->
      <section
        v-if="parsedData.introHeading || parsedData.introText"
        class="rounded-3xl border border-primary-teal/20 bg-primary-teal/5 p-8 text-center md:p-12"
      >
        <h2
          v-if="parsedData.introHeading"
          class="mb-6 font-serif text-3xl font-bold text-primary-teal"
        >
          {{ parsedData.introHeading }}
        </h2>
        <p
          v-if="parsedData.introText"
          class="mx-auto max-w-4xl leading-relaxed text-gray-700 md:text-lg"
        >
          {{ parsedData.introText }}
        </p>
      </section>

      <!-- Process / Support Channels Section -->
      <section v-if="parsedData.processHeading || parsedData.processSteps?.length">
        <div class="mb-10 text-center">
          <h2
            v-if="parsedData.processHeading"
            class="mb-3 font-serif text-3xl font-bold text-primary-sky"
          >
            {{ parsedData.processHeading }}
          </h2>
          <p
            v-if="parsedData.processSubtext"
            class="text-lg text-gray-500 italic"
          >
            {{ parsedData.processSubtext }}
          </p>
        </div>
        <div
          v-if="parsedData.processSteps?.length"
          class="grid gap-6 md:grid-cols-3"
        >
          <div
            v-for="(step, idx) in parsedData.processSteps"
            :key="idx"
            class="group rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:border-primary-orange/30 hover:shadow-md"
          >
            <div
              class="mb-5 flex size-14 items-center justify-center rounded-2xl bg-primary-orange/10 text-2xl font-bold text-primary-orange transition-colors group-hover:bg-primary-orange group-hover:text-white"
            >
              {{ step.number }}
            </div>
            <h3 class="mb-3 font-serif text-xl font-bold text-primary-sky">
              {{ step.title }}
            </h3>
            <p class="text-gray-600">
              {{ step.description }}
            </p>
          </div>
        </div>
      </section>

      <!-- Pillars / Other Services Section -->
      <section v-if="parsedData.pillarsHeading || parsedData.pillars?.length">
        <div class="mb-10 text-center">
          <h2
            v-if="parsedData.pillarsHeading"
            class="mb-3 font-serif text-3xl font-bold text-primary-teal"
          >
            {{ parsedData.pillarsHeading }}
          </h2>
          <p
            v-if="parsedData.pillarsSubtext"
            class="text-lg text-gray-500 italic"
          >
            {{ parsedData.pillarsSubtext }}
          </p>
        </div>
        <div
          v-if="parsedData.pillars?.length"
          class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          <div
            v-for="(pillar, idx) in parsedData.pillars"
            :key="idx"
            class="rounded-2xl border border-primary-teal/10 bg-primary-teal/5 p-6 text-center shadow-sm transition-all hover:bg-primary-teal/10"
          >
            <h3 class="mb-3 font-serif text-lg font-bold text-primary-sky">
              {{ pillar.title }}
            </h3>
            <p class="text-sm text-gray-600">
              {{ pillar.descriptor }}
            </p>
          </div>
        </div>
      </section>

      <!-- Featured / Location Section -->
      <section v-if="parsedData.featuredHeading || parsedData.featuredItems?.length">
        <div class="mb-10 text-center">
          <span
            v-if="parsedData.featuredBadge"
            class="mb-3 inline-block rounded-full bg-primary-orange/10 px-4 py-1 text-sm font-semibold tracking-wide text-primary-orange uppercase"
          >
            {{ parsedData.featuredBadge }}
          </span>
          <h2
            v-if="parsedData.featuredHeading"
            class="font-serif text-3xl font-bold text-primary-sky"
          >
            {{ parsedData.featuredHeading }}
          </h2>
        </div>
        <div
          v-if="parsedData.featuredItems?.length"
          class="grid gap-6 md:grid-cols-2"
        >
          <div
            v-for="(item, idx) in parsedData.featuredItems"
            :key="idx"
            class="flex flex-col justify-between rounded-3xl bg-gray-900 p-8 text-white shadow-xl sm:p-10"
          >
            <div>
              <span class="mb-6 inline-block text-3xl font-bold text-primary-teal">
                {{ item.badge }}
              </span>
              <h3 class="mb-2 font-serif text-2xl font-bold">
                {{ item.title }}
              </h3>
              <h4 class="mb-6 text-sm font-medium tracking-wider text-primary-orange uppercase">
                {{ item.subtitle }}
              </h4>
              <p class="leading-relaxed text-gray-300">
                {{ item.description }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Contact Section -->
      <section
        v-if="parsedData.contactHeading || (parsedData.contact && (parsedData.contact.address || parsedData.contact.phone || parsedData.contact.email))"
        class="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm sm:p-12"
      >
        <h2
          v-if="parsedData.contactHeading"
          class="mb-10 text-center font-serif text-3xl font-bold text-primary-sky"
        >
          {{ parsedData.contactHeading }}
        </h2>
        <div class="grid gap-8 text-center md:grid-cols-3">
          <div v-if="parsedData.contact.address">
            <div
              class="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary-teal/10 text-primary-teal"
            >
              <UIcon
                name="i-heroicons-map-pin"
                class="size-7"
              />
            </div>
            <p class="font-medium whitespace-pre-line text-gray-700">
              {{ parsedData.contact.address }}
            </p>
          </div>
          <div v-if="parsedData.contact.phone">
            <div
              class="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary-teal/10 text-primary-teal"
            >
              <UIcon
                name="i-heroicons-phone"
                class="size-7"
              />
            </div>
            <p class="font-medium text-gray-700">
              {{ parsedData.contact.phone }}
            </p>
          </div>
          <div v-if="parsedData.contact.email">
            <div
              class="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary-teal/10 text-primary-teal"
            >
              <UIcon
                name="i-heroicons-envelope"
                class="size-7"
              />
            </div>
            <p class="font-medium text-gray-700">
              {{ parsedData.contact.email }}
            </p>
          </div>
        </div>
      </section>
    </div>

    <div
      v-else
      class="prose max-w-none text-gray-700"
      v-html="props.htmlContent"
    />
  </div>
</template>
