<script setup lang="ts">
</script>

<template>
  <div class="mx-auto flex min-h-screen max-w-11xl flex-col bg-white font-poppins">
    <CfpSharedNav class="shrink-0" />

    <main class="relative mx-auto flex w-full max-w-7xl flex-1 overflow-hidden">
      <UiDashboardSidebar>
        <slot />
      </UiDashboardSidebar>
    </main>
    <CfpSharedFooter />
  </div>
</template>
