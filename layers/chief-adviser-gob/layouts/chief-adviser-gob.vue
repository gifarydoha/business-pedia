<script setup lang="ts">
import { watch, nextTick, computed } from "vue";
import { useRoute } from "vue-router";
import { useSettingsStore } from "~~/layers/base/stores/settings";

const colorMode = useColorMode();
colorMode.preference = "light";

const route = useRoute();
const settingsStore = useSettingsStore();
const homeBlocks = computed(() => settingsStore.homePageBlocks);

// Ensure the header shows for a tiny bit, then smoothly scroll to the main section on route change
watch(
  () => route.path,
  async () => {
    await nextTick();
    setTimeout(() => {
      const mainEl = document.getElementById("main");
      if (mainEl) {
        mainEl.scrollIntoView({ behavior: "smooth" });
      }
    }, 400); // 400ms delay to let the user see the cover photo briefly
  },
);
</script>

<template>
  <div class="mx-auto flex min-h-screen max-w-11xl flex-col bg-card">
    <!-- Dynamic Header Widgets -->
    <div class="mb-8">
      <HomeBlockRenderer
        v-for="block in homeBlocks"
        :key="block.id"
        :block="block"
      />
    </div>

    <LayoutTheHeaderWithoutLogo />
    <main
      id="main"
      class="grow scroll-mt-20 bg-brand-primary/10"
    >
      <slot />
    </main>
    <LayoutTheFooterShort />
  </div>
</template>
