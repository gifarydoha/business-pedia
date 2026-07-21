<!-- app/components/shared/SharedPageBanner.vue -->
<script setup lang="ts">
const props = defineProps<{
  title: string;
  image?: string | null;
}>();

const { buildImageUrl } = useImageUrl();
const bgImage = computed(() => props.image ? buildImageUrl(props.image) : null);
</script>

<template>
  <div class="bg-brand-primary relative mb-8 overflow-hidden rounded-xl py-16 text-white md:py-24">
    <!-- Background Image / Placeholder -->
    <div class="absolute inset-0 z-0 opacity-20">
      <NuxtImg
        v-if="bgImage"
        :src="bgImage"
        alt="Banner Background"
        class="size-full object-cover"
      />
      <div
        v-else
        class="size-full bg-black"
      />
    </div>

    <!-- Content -->
    <div class="relative z-10 container mx-auto px-4 text-center">
      <h1 class="text-3xl font-bold md:text-5xl">
        {{ title }}
      </h1>
    </div>
  </div>
</template>
