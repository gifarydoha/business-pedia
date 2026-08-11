<script setup lang="ts">
import type { CfpHeader } from "../../../types/cfp";

defineProps<{
  header: CfpHeader;
}>();
</script>

<template>
  <div class="mb-10">
    <span
      class="mb-4 inline-block rounded-full bg-cfp-yellow/20 px-4 py-1 font-poppins text-xs font-semibold tracking-widest text-cfp-olive uppercase"
    >
      Call for Papers
    </span>
    <h1 class="mb-3 font-lora text-3xl leading-tight font-bold text-cfp-olive md:text-4xl lg:text-5xl">
      {{ header.title }}
    </h1>
    <p class="font-lora text-lg text-cfp-yellow italic md:text-xl">
      {{ header.subtitle }}
    </p>
  </div>
</template>
