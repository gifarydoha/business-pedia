<script setup lang="ts">
import CfpFooter from "~~/layers/conference/components/cfp/CfpFooter.vue";
import CfpNav from "~~/layers/conference/components/cfp/CfpNav.vue";
</script>

<template>
  <div class=" mx-auto flex min-h-screen max-w-11xl flex-col bg-white font-poppins">
    <CfpNav />
    <main class="grow">
      <slot />
    </main>
    <CfpFooter />
  </div>
</template>
