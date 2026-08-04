<!-- app/pages/index.vue -->
<script setup lang="ts">
// DEPRECATED: The main homepage is now cfp.vue. This file is kept for reference.
definePageMeta({ layout: "default", path: "/_deprecated/home" });

const settingsStore = useSettingsStore();

// Reactive computed properties connected to the Pinia store
const homeBlocks = computed(() => settingsStore.homePageBlocks);
const sliders = computed(() => settingsStore.sliderItems);
const seo = computed(() => settingsStore.homeSeoMeta);

useSeoMeta({
    title: computed(() => seo.value?.meta_title ?? "Home"),
    description: computed(() => seo.value?.meta_description ?? ""),
    ogImage: computed(() => seo.value?.image_url ?? "/og-image.png"),
    ogUrl: computed(() => seo.value?.canonical_url),
});
// console.log("Rendering index");
</script>

<template>
    <div>
        <!-- Hero Slider -->
        <HomeHeroSlider :slides="sliders" />

        <!-- Dynamic home_page_block sections, rendered in sort_order -->
        <HomeBlockRenderer v-for="block in homeBlocks" :key="block.id" :block="block" />
    </div>
</template>
