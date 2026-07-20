<!-- app/components/home/HomeHeroSlider.vue -->
<script setup lang="ts">
import type { WidgetItem } from "~/types/api";

const props = defineProps<{
  slides: WidgetItem[];
}>();

const { buildImageUrl } = useImageUrl();
const currentSlide = ref(0);

// Basic auto-advance slider logic
onMounted(() => {
  if (props.slides.length <= 1) return;
  setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % props.slides.length;
  }, 5000);
});
</script>

<template>
  <div
    v-if="slides.length"
    class="relative h-125 w-full overflow-hidden bg-gray-900"
  >
    <!-- Slides -->
    <div
      v-for="(slide, index) in slides"
      :key="slide.id"
      class="absolute inset-0 transition-opacity duration-1000"
      :class="index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'"
    >
      <!-- Background Image -->
      <NuxtImg
        v-if="slide.image"
        :src="buildImageUrl(slide.image)"
        :alt="slide.title || slide.label"
        class="absolute inset-0 size-full object-cover opacity-60"
      />

      <!-- Content Overlay -->
      <div class="relative z-20 container mx-auto flex h-full flex-col items-start justify-center px-4 text-white">
        <h2
          v-if="slide.label"
          class="mb-4 text-4xl font-bold drop-shadow-lg md:text-6xl"
        >
          {{ slide.label }}
        </h2>
        <p
          v-if="slide.fulltext"
          class="mb-8 max-w-2xl text-xl drop-shadow md:text-2xl"
          v-html="slide.fulltext"
        />

        <NuxtLink
          v-if="slide.link || slide.url"
          :to="`/${slide.link || slide.url}`"
        >
          <UButton
            size="xl"
            class="btn-brand-primary shadow-lg"
          >
            Explore Now
          </UButton>
        </NuxtLink>
      </div>
    </div>

    <!-- Dots Navigation -->
    <div
      v-if="slides.length > 1"
      class="absolute inset-x-0 bottom-6 z-30 flex justify-center gap-2"
    >
      <button
        v-for="(_, index) in slides"
        :key="index"
        class="size-3 cursor-pointer rounded-full transition-colors"
        :class="index === currentSlide ? 'bg-brand-primary' : 'bg-white/50 hover:bg-white/80'"
        :aria-label="`Go to slide ${index + 1}`"
        @click="currentSlide = index"
      />
    </div>
  </div>
</template>
