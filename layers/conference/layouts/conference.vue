<script setup lang="ts">
</script>

<template>
  <div class=" mx-auto flex min-h-screen max-w-11xl flex-col bg-brand-primary-light/40 font-poppins">
    <CfpSharedNav />
    <main class="flex grow flex-col">
      <slot />
    </main>
    <CfpSharedFooter />
  </div>
</template>
