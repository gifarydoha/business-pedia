<script setup lang="ts">
</script>

<template>
  <div class="mx-auto flex h-screen max-w-11xl flex-col overflow-hidden bg-brand-primary-light/40 font-poppins">
    <CfpSharedNav class="shrink-0" />

    <main class="relative mx-auto flex w-full max-w-7xl flex-1 overflow-hidden">
      <UiDashboardSidebar
        hide-default-toggler
        content-bg-class="bg-transparent"
      >
        <section class="flex min-h-full grow flex-col">
          <div class="flex flex-1 flex-col">
            <slot />
          </div>
        </section>
      </UiDashboardSidebar>
    </main>
    <!-- <CfpSharedFooter /> -->
  </div>
</template>
