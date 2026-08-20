<script setup lang="ts">
// Layout used for the chief-adviser-gob layer.
</script>

<template>
  <div class="mx-auto flex min-h-screen max-w-11xl flex-col">
    <!-- Page Header -->
    <header class="my-6 text-center">
      <h1 class="font-lora text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
        Chief Adviser Of GOB
      </h1>
      <p class="mt-4 font-poppins text-base leading-relaxed text-gray-500 sm:text-lg">
        Official updates, directives, and insights from the Chief Adviser of the Government of Bangladesh.
      </p>
    </header>

    <LayoutTheHeaderWithoutLogo />
    <main class="grow">
      <slot />
    </main>
    <LayoutTheFooterShort />
  </div>
</template>
