<!-- layers/lms/layouts/lms.vue -->
<!-- LMS layout for public and auth pages. -->
<!-- Mirrors base default.vue — independently styleable for LMS branding. -->
<script setup lang="ts">
// LMS-specific layout. Diverge header/footer styling here as LMS grows.
</script>

<template>
  <div class="mx-auto flex min-h-screen max-w-11xl flex-col">
    <LayoutTheHeader />
    <main class="flex grow flex-col">
      <slot />
    </main>
    <LayoutTheFooter />
  </div>
</template>
