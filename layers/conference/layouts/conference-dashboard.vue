<script setup lang="ts">
</script>

<template>
  <div class="mx-auto flex h-screen max-w-11xl flex-col overflow-hidden bg-white font-poppins">
    <CfpSharedNav class="shrink-0" />

    <main class="relative mx-auto flex w-full max-w-7xl flex-1 overflow-hidden">
      <UiDashboardSidebar>
        <div class="flex min-h-full flex-col">
          <div class="flex-1">
            <slot />
          </div>
        </div>
      </UiDashboardSidebar>
    </main>
    <CfpSharedFooter />
  </div>
</template>
