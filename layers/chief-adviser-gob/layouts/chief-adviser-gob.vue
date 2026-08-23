<script setup lang="ts">
import { watch, nextTick } from "vue";
import { useRoute } from "vue-router";
import coverImage from "../assets/images/cover_image.jpg";

const route = useRoute();

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
    <!-- Page Header with Cover -->
    <NuxtLink
      to="/"
      class="mb-8"
    >
      <!-- Cover Photo -->
      <div class="relative mx-auto h-48 w-full max-w-7xl overflow-hidden bg-muted md:h-72 lg:h-100 xl:rounded-b-md">
        <img
          :src="coverImage"
          alt="Chief Adviser of GOB Cover"
          class="size-full object-cover object-center"
        >
      </div>

      <!-- Title & Description -->
      <div class="mx-auto max-w-4xl px-4 pt-8 text-center sm:px-6">
        <h1 class="font-lora text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Chief Adviser Of GOB
        </h1>
        <p class="mx-auto mt-4 max-w-2xl font-poppins text-base leading-relaxed text-muted-foreground sm:text-lg">
          Official updates, directives, and insights from the Chief Adviser of the Government of Bangladesh.
        </p>
      </div>
    </NuxtLink>

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
