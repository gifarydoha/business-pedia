<script setup lang="ts">
type Crumb = {
  label: string;
  href?: string;
};

defineProps<{
  crumbs: Crumb[];
}>();
</script>

<template>
  <div class="border-b border-cfp-olive/10 bg-cfp-olive/8">
    <div class="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-6 py-2.5">
      <NuxtLink to="/" class="font-poppins text-xs text-cfp-olive/60 transition-colors hover:text-cfp-olive">
        Home
      </NuxtLink>
      <span v-for="(c, i) in crumbs" :key="i" class="flex items-center gap-2">
        <span class="text-xs text-cfp-olive/30">›</span>
        <NuxtLink v-if="c.href" :to="c.href"
          class="font-poppins text-xs text-cfp-olive/60 transition-colors hover:text-cfp-olive">
          {{ c.label }}
        </NuxtLink>
        <span v-else class="font-poppins text-xs font-medium text-cfp-olive">{{ c.label }}</span>
      </span>
    </div>
  </div>
</template>
