<script setup lang="ts">
</script>

<template>
  <div class=" mx-auto flex min-h-screen max-w-11xl flex-col bg-white font-poppins">
    <CfpSharedNav />
    <main class="grow">
      <slot />
    </main>
    <CfpSharedFooter />
  </div>
</template>
