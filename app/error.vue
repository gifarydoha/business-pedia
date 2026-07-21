<!-- app/error.vue -->
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
  <div>
    <!-- 404 Error UI -->
    <div
      v-if="(error?.status || error?.statusCode) === 404"
      class="flex min-h-screen flex-col items-center justify-center gap-8 bg-white px-4 py-24"
    >
      <!-- Orange error badge -->
      <span
        class="rounded-full bg-fy-orange-300 px-4 py-1.5 font-poppins text-xs font-semibold tracking-widest text-white uppercase"
      >
        404 Error
      </span>

      <!-- Decorative compass icon block -->
      <div class="flex size-20 items-center justify-center rounded-2xl bg-fy-teal-50 shadow-md">
        <UIcon
          name="i-lucide-compass"
          class="size-9 text-fy-teal-300"
        />
      </div>

      <!-- Giant gradient "404" -->
      <p
        class="bg-linear-to-br from-fy-teal-300 to-fy-sky-500 bg-clip-text font-poppins text-8xl leading-none font-extrabold tracking-tight text-transparent select-none md:text-9xl"
      >
        404
      </p>

      <!-- Headings -->
      <div class="-mt-2 flex flex-col items-center gap-2 text-center">
        <h1
          lang="bn"
          class="font-poppins text-2xl font-semibold text-fy-sage-900 md:text-3xl"
        >
          পথ হারিয়ে গেছে!
        </h1>
        <h2 class="font-poppins text-lg font-medium text-fy-sky-500 md:text-xl">
          Page Not Found
        </h2>
      </div>

      <!-- Supporting text -->
      <p class="max-w-md text-center font-lora text-base leading-relaxed text-gray-500">
        You've wandered off the path — but that's okay. Every wrong turn is a mindset lesson. Let's
        find your way back.
      </p>

      <!-- Button row -->
      <div class="flex w-full max-w-xs flex-col gap-4 sm:w-auto sm:max-w-none sm:flex-row">
        <button
          class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-fy-teal-300 px-8 py-3 font-poppins font-semibold text-white shadow-md transition-shadow duration-200 hover:shadow-lg sm:w-auto "
          @click="handleError"
        >
          <UIcon
            name="i-lucide-home"
            class="size-4"
          />
          Back to Home
        </button>
        <a
          href="mailto:autofysaidul@gmail.com"
          class="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-fy-teal-300 px-8 py-3 font-poppins font-semibold text-fy-teal-300 transition-colors duration-200 hover:bg-fy-teal-50 sm:w-auto"
        >
          <UIcon
            name="i-lucide-mail"
            class="size-4"
          />
          Contact Support
        </a>
      </div>

      <!-- Footer tagline -->
      <p class="mt-2 text-center font-lora text-sm text-gray-400">
        <span class="text-fy-teal-300">·</span> Lost? Let's get you back on track.{" "}
        <span class="text-fy-teal-300">·</span>
      </p>
    </div>

    <!-- Generic Error UI for non-404 -->
    <div
      v-else
      class="flex min-h-screen items-center justify-center bg-gray-50 p-4"
    >
      <div class="max-w-lg rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-xl">
        <div class="mx-auto mb-6 flex size-24 items-center justify-center rounded-full bg-red-50 text-red-500">
          <UIcon
            name="i-heroicons-exclamation-triangle"
            class="size-12"
          />
        </div>

        <h1 class="mb-2 text-6xl font-bold text-gray-900">
          {{ error?.status || error?.statusCode || 500 }}
        </h1>
        <h2 class="mb-4 text-2xl font-semibold text-gray-800">
          {{ title }}
        </h2>
        <p class="mb-8 text-gray-500">
          {{ message }}
        </p>

        <UButton
          size="xl"
          class="btn-brand-primary cursor-pointer"
          @click="handleError"
        >
          Return to Home
        </UButton>
      </div>
    </div>
  </div>
</template>
