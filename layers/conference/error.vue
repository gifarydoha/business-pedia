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
  <NuxtLayout name="conference">
    <div class="font-poppins">
      <!-- 404 Error UI -->
      <div
        v-if="(error?.status || error?.statusCode) === 404"
        class="flex min-h-screen flex-col items-center justify-center gap-8 bg-cfp-olive-pale px-4 py-12"
      >
        <!-- Error badge -->
        <span
          class="rounded-full bg-cfp-red px-4 py-1.5 text-xs font-semibold tracking-widest text-white uppercase"
        >
          404 Error
        </span>

        <!-- Decorative icon block -->
        <!-- <div class="flex size-20 items-center justify-center rounded-2xl bg-white shadow-md">
          <Icon
            name="ph:compass-fill"
            class="size-9 text-cfp-yellow"
          />
        </div> -->

        <!-- Giant "404" -->
        <p
          class="font-lora text-8xl leading-none font-bold tracking-tight text-cfp-olive select-none md:text-9xl"
        >
          404
        </p>

        <!-- Headings -->
        <div class="-mt-2 flex flex-col items-center gap-2 text-center">
          <h1
            class="font-poppins text-2xl font-semibold text-cfp-olive md:text-3xl"
          >
            Path Lost!
          </h1>
          <h2 class="text-lg font-medium text-cfp-red md:text-xl">
            Page Not Found
          </h2>
        </div>

        <!-- Supporting text -->
        <p class="max-w-md text-center font-poppins text-base leading-relaxed text-gray-600">
          You've wandered off the path — but that's okay. Every wrong turn is a learning experience. Let's
          find your way back to the conference.
        </p>

        <!-- Button row -->
        <div class="flex w-full max-w-xs flex-col gap-4 sm:w-auto sm:max-w-none sm:flex-row">
          <button
            class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-cfp-red px-8 py-3 font-semibold text-white shadow-md transition-shadow duration-200 hover:shadow-lg sm:w-auto"
            @click="handleError"
          >
            <Icon
              name="ph:house-fill"
              class="size-4"
            />
            Back to Home
          </button>
          <a
            href="mailto:contact@socialbusinesspedia.com"
            class="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-cfp-olive px-8 py-3 font-semibold text-cfp-olive transition-colors duration-200 hover:bg-cfp-olive/5 sm:w-auto"
          >
            <Icon
              name="ph:envelope-simple-fill"
              class="size-4"
            />
            Contact Support
          </a>
        </div>

        <!-- Footer tagline -->
        <p class="mt-2 text-center text-sm text-gray-500">
          <span class="text-cfp-yellow">·</span> Lost? Let's get you back on track. <span class="text-cfp-yellow">·</span>
        </p>
      </div>

      <!-- Generic Error UI for non-404 -->
      <div
        v-else
        class="flex min-h-screen items-center justify-center bg-cfp-olive-pale p-4"
      >
        <div class="max-w-lg rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-xl">
          <div class="mx-auto mb-6 flex size-24 items-center justify-center rounded-full bg-red-50 text-cfp-red">
            <Icon
              name="ph:warning-circle-fill"
              class="size-12"
            />
          </div>

          <h1 class="mb-2 font-lora text-6xl font-bold text-cfp-olive">
            {{ error?.status || error?.statusCode || 500 }}
          </h1>
          <h2 class="mb-4 text-2xl font-semibold text-gray-800">
            {{ title }}
          </h2>
          <p class="mb-8 text-gray-500">
            {{ message }}
          </p>

          <button
            class="mx-auto flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-cfp-olive px-8 py-3 font-semibold text-white shadow-md transition-colors hover:bg-cfp-olive/90 sm:w-auto"
            @click="handleError"
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
