<!-- app/layouts/default.vue -->
<script setup lang="ts">
// Default layout used for public pages.
// Includes the API-driven header and footer.
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <TheHeader />
    <main class="flex-grow">
      <slot />
    </main>
    <TheFooter />
  </div>
</template>
