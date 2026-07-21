<!-- app/layouts/default.vue -->
<script setup lang="ts">
// Default layout used for public pages.
// Includes the API-driven header and footer.
</script>

<template>
  <div class="mx-auto flex min-h-screen max-w-480 flex-col">
    <LayoutTheHeader />
    <main class="grow">
      <slot />
    </main>
    <LayoutTheFooter />
  </div>
</template>
