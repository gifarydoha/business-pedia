<script setup lang="ts">
// Layout used for the chief-adviser-gob layer.
</script>

<template>
  <div class="mx-auto flex min-h-screen max-w-11xl flex-col">
    <LayoutTheHeaderWithoutLogo />
    <main class="grow">
      <slot />
    </main>
    <LayoutTheFooterShort />
  </div>
</template>
