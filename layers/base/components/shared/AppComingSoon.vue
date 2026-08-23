<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
}>();
</script>

<template>
  <div class="bg-brand-surface relative flex grow flex-col items-center justify-center overflow-hidden px-6 py-24 text-center">
    <!-- Animated background gradients -->
    <div class="absolute -top-40 left-0 size-96 animate-pulse rounded-full bg-brand-primary opacity-20 blur-[100px] filter" />
    <div
      class="absolute right-0 -bottom-40 size-96 animate-pulse rounded-full bg-brand-secondary opacity-20 blur-[100px] filter"
      style="animation-delay: 2s;"
    />

    <div class="relative z-10 mx-auto max-w-3xl">
      <div class="mb-8 inline-flex items-center gap-2 rounded-full border border-brand-secondary/30 bg-white/50 px-4 py-1.5 text-sm font-medium text-brand-secondary shadow-sm backdrop-blur-md">
        <UIcon
          name="i-heroicons-sparkles"
          class="size-4 animate-pulse"
        />
        Under Construction
      </div>

      <h1 class="mb-6 font-lora text-5xl font-bold tracking-tighter text-foreground sm:text-7xl">
        {{ title }}
      </h1>

      <p class="mb-10 font-poppins text-lg leading-relaxed text-muted-foreground sm:text-xl">
        {{ description }}
      </p>

      <div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
        <NuxtLink to="/">
          <UButton
            size="xl"
            class="rounded-full bg-brand-primary px-8 py-3 text-base font-semibold text-white shadow-lg transition-transform hover:-translate-y-1 hover:bg-brand-primary-dark hover:shadow-xl"
          >
            Return Home
          </UButton>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
