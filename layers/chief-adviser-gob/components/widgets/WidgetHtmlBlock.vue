<script setup lang="ts">
import type { HomePageBlock } from "~~/layers/base/types/api";

const props = defineProps<{
  block: HomePageBlock;
}>();
</script>

<template>
  <div v-html="block.description" />
</template>
