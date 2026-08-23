<script setup lang="ts">
import coverImage from "../assets/images/cover_image.jpg";
// Layout used for the chief-adviser-gob layer.
</script>

<template>
  <div class="mx-auto flex min-h-screen max-w-11xl flex-col">
    <!-- Page Header with Cover -->
    <header class="mb-8">
      <!-- Cover Photo -->
      <div class="relative mx-auto h-48 w-full max-w-7xl overflow-hidden bg-muted md:h-72 lg:h-100 xl:rounded-b-md">
        <!-- Subtle overlay to ensure the image doesn't wash out completely -->
        <!-- <div class="absolute inset-0 z-10 bg-gradient-to-b from-black/5 to-black/20 mix-blend-multiply"></div> -->
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
    </header>

    <LayoutTheHeaderWithoutLogo />
    <main class="grow">
      <slot />
    </main>
    <LayoutTheFooterShort />
  </div>
</template>
