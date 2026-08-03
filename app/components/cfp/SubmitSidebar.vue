<script setup lang="ts">
defineProps<{
  nextSteps: {
    n: number;
    title: string;
    detail: string;
  }[];
}>();
</script>

<template>
  <aside class="mt-0 hidden lg:block">
    <div class="sticky top-24 space-y-5">
      <!-- What happens next card -->
      <div class="rounded-2xl bg-cfp-olive p-6 text-white shadow-lg">
        <h3 class="mb-5 font-lora text-lg font-bold text-white">
          What Happens Next
        </h3>
        <ol class="space-y-4">
          <li
            v-for="s in nextSteps"
            :key="s.n"
            class="flex items-start gap-3"
          >
            <span
              class="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-cfp-yellow font-lora text-xs font-bold text-cfp-olive"
            >
              {{ s.n }}
            </span>
            <div>
              <div class="font-poppins text-sm font-semibold text-white">
                {{ s.title }}
              </div>
              <p class="mt-0.5 font-poppins text-xs leading-relaxed text-white/65">
                {{ s.detail }}
              </p>
            </div>
          </li>
        </ol>
      </div>

      <!-- Key dates card -->
      <div class="rounded-2xl border border-cfp-olive/15 bg-white p-6 shadow-lg">
        <h3 class="mb-4 font-lora text-base font-semibold text-cfp-olive">
          Key Dates
        </h3>
        <ul class="space-y-3">
          <li
            v-for="d in [
              { label: 'Submission opens', date: '10 March 2026', urgent: false },
              { label: 'Notification', date: '20 Sep 2026', urgent: false },
              { label: 'Deadline', date: '31 Jan 2024', urgent: true },
              { label: 'Conference', date: '1–2 Apr 2024', urgent: false },
            ]"
            :key="d.label"
            class="flex items-start justify-between gap-3"
          >
            <span class="font-poppins text-xs text-gray-500">{{ d.label }}</span>
            <span
              :class="['text-right font-lora text-xs font-bold', d.urgent ? 'text-cfp-red' : 'text-cfp-olive']"
            >
              {{ d.date }}
            </span>
          </li>
        </ul>
      </div>

      <!-- Help link -->
      <div class="rounded-2xl border border-cfp-olive/15 bg-cfp-olive-pale p-5">
        <p class="mb-3 font-poppins text-sm text-gray-600">
          Questions about submission?
        </p>
        <NuxtLink
          to="/guidelines"
          class="font-poppins text-sm font-semibold text-cfp-olive underline underline-offset-2 transition-colors hover:text-cfp-red"
        >
          Read the full submission guidelines →
        </NuxtLink>
      </div>
    </div>
  </aside>
</template>
