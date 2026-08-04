<script setup lang="ts">
import CfpFooter from "~/components/cfp/CfpFooter.vue";
import CfpNav from "~/components/cfp/CfpNav.vue";
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
