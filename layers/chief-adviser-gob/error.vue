<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps({
  error: {
    type: Object as () => NuxtError,
    required: true,
  },
});

const title = computed(() => {
  const code = props.error?.status || props.error?.statusCode;
  if (code === 404) return "Page Not Found";
  if (code === 403) return "Access Denied";
  return "Something Went Wrong";
});

const message = computed(() => {
  const code = props.error?.status || props.error?.statusCode;
  if (code === 404) return "The page you're looking for doesn't exist or has been moved.";
  if (code === 403) return "You do not have permission to access this page.";
  return props.error?.message || "An unexpected error occurred. Please try again later.";
});

const handleError = () => clearError({ redirect: "/" });
</script>

<template>
  <NuxtLayout name="chief-adviser-gob">
    <div class="min-h-[60vh] bg-background pt-8 pb-20 font-poppins">
      <!-- 404 Error UI -->
      <div
        v-if="(error?.status || error?.statusCode) === 404"
        class="flex flex-col items-center justify-center gap-8 px-4 py-12"
      >
        <!-- Error badge -->
        <span
          class="rounded-full bg-destructive px-4 py-1.5 text-xs font-semibold tracking-widest text-destructive uppercase"
        >
          404 Error
        </span>

        <!-- Giant "404" -->
        <p
          class="font-lora text-8xl leading-none font-bold tracking-tight text-primary select-none md:text-9xl"
        >
          404
        </p>

        <!-- Headings -->
        <div class="-mt-2 flex flex-col items-center gap-2 text-center">
          <h1
            class="font-poppins text-2xl font-semibold text-primary md:text-3xl"
          >
            Path Lost!
          </h1>
          <h2 class="text-lg font-medium text-destructive md:text-xl">
            Page Not Found
          </h2>
        </div>

        <!-- Supporting text -->
        <p class="max-w-md text-center font-poppins text-base leading-relaxed text-muted-foreground">
          You've wandered off the path — but that's okay. Every wrong turn is a learning experience. Let's
          find your way back to the official updates.
        </p>

        <!-- Button row -->
        <div class="flex w-full max-w-xs flex-col gap-4 sm:w-auto sm:max-w-none sm:flex-row">
          <button
            class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-3 font-semibold text-primary-foreground shadow-md transition-shadow duration-200 hover:bg-primary/90 hover:shadow-lg sm:w-auto"
            @click="handleError"
          >
            <UIcon
              name="i-heroicons-home"
              class="size-5"
            />
            Back to Home
          </button>
          <a
            href="mailto:contact@socialbusinesspedia.com"
            class="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-primary px-8 py-3 font-semibold text-primary transition-colors duration-200 hover:bg-primary/5 sm:w-auto"
          >
            <UIcon
              name="i-heroicons-envelope"
              class="size-5"
            />
            Contact Support
          </a>
        </div>

        <!-- Footer tagline -->
        <p class="mt-2 text-center text-sm text-muted-foreground/80">
          <span class="text-muted-foreground/50">·</span> Lost? Let's get you back on track. <span class="text-muted-foreground/50">·</span>
        </p>
      </div>

      <!-- Generic Error UI for non-404 -->
      <div
        v-else
        class="flex flex-col items-center justify-center p-4 py-12"
      >
        <div class="max-w-lg rounded-2xl border border-border bg-card p-10 text-center shadow-xl">
          <div class="mx-auto mb-6 flex size-24 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <UIcon
              name="i-heroicons-exclamation-triangle"
              class="size-12"
            />
          </div>

          <h1 class="mb-2 font-lora text-6xl font-bold text-primary">
            {{ error?.status || error?.statusCode || 500 }}
          </h1>
          <h2 class="mb-4 text-2xl font-semibold text-foreground">
            {{ title }}
          </h2>
          <p class="mb-8 text-muted-foreground">
            {{ message }}
          </p>

          <button
            class="mx-auto flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-3 font-semibold text-primary-foreground shadow-md transition-colors hover:bg-primary/90 sm:w-auto"
            @click="handleError"
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
