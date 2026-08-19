<script setup lang="ts">
definePageMeta({ layout: "default" });

const settingsStore = useSettingsStore();

const homeBlocks = computed(() => settingsStore.homePageBlocks);
// const sliders = computed(() => settingsStore.sliderItems);
const seo = computed(() => settingsStore.homeSeoMeta);
const org = computed(() => settingsStore.org);

useSeoMeta({
  title: computed(() => seo.value?.meta_title ?? org.value?.["meta-title"] ?? "Home"),
  description: computed(() => seo.value?.meta_description ?? org.value?.["meta-description"] ?? ""),
  ogImage: computed(() => seo.value?.image_url ?? ""),
  ogUrl: computed(() => seo.value?.canonical_url ?? ""),
});
</script>

<template>
  <div>
    <!-- <HomeHeroSlider :slides="sliders" /> -->

    <HomeBlockRenderer
      v-for="block in homeBlocks"
      :key="block.id"
      :block="block"
    />
  </div>
</template>
