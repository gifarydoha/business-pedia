<script setup lang="ts">
import { inject } from "vue";

type Crumb = {
  label: string;
  href?: string;
};

defineProps<{
  crumbs: Crumb[];
}>();

const toggleSidebar = inject<(() => void) | null>("toggleSidebar", null);
</script>

<template>
  <div class="border-b border-brand-primary/10 bg-brand-primary/8">
    <div class="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-6 py-2.5">
      <UButton
        v-if="toggleSidebar"
        icon="i-lucide-panel-left"
        color="neutral"
        variant="ghost"
        aria-label="Toggle sidebar"
        class="-ml-2 shrink-0 cursor-pointer text-brand-primary/60"
        @click="toggleSidebar"
      />
      <NuxtLink
        to="/"
        class="font-poppins text-xs text-brand-primary/60 transition-colors hover:text-brand-primary"
      >
        Home
      </NuxtLink>
      <span
        v-for="(c, i) in crumbs"
        :key="i"
        class="flex items-center gap-2"
      >
        <span class="text-xs text-brand-primary/30">›</span>
        <NuxtLink
          v-if="c.href"
          :to="c.href"
          class="font-poppins text-xs text-brand-primary/60 transition-colors hover:text-brand-primary"
        >
          {{ c.label }}
        </NuxtLink>
        <span
          v-else
          class="font-poppins text-xs font-medium text-brand-primary"
        >{{ c.label }}</span>
      </span>
    </div>
  </div>
</template>
