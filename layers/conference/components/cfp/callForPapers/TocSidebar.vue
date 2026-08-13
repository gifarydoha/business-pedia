<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useUserPaper } from "~~/layers/conference/composables/useUserPaper";

const { hasSubmittedPaper, submittedPaperId } = useUserPaper();
const activeSection = ref("overview");
const observer = ref<IntersectionObserver | null>(null);

const tocSections = [
  { id: "overview", label: "Overview" },
  { id: "tracks", label: "Conference Tracks" },
  { id: "important-dates", label: "Important Dates" },
];

onMounted(() => {
  // Adding a slight delay to ensure elements are rendered before observing
  setTimeout(() => {
    observer.value = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activeSection.value = entry.target.id;
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );

    document.querySelectorAll("section[id]").forEach((el) => {
      observer.value?.observe(el);
    });
  }, 100);
});

onUnmounted(() => {
  observer.value?.disconnect();
});
</script>

<template>
  <aside class="hidden lg:block">
    <div class="sticky top-24 rounded-2xl border border-cfp-olive/15 bg-white p-6 shadow-lg">
      <h3 class="mb-4 font-lora text-sm font-semibold tracking-wider text-cfp-olive uppercase">
        Contents
      </h3>
      <nav class="flex flex-col gap-1">
        <a
          v-for="s in tocSections"
          :key="s.id"
          :href="`#${s.id}`"
          class="rounded-lg px-3 py-1.5 font-poppins text-sm transition-all"
          :class="activeSection === s.id
            ? 'bg-cfp-olive text-white font-medium'
            : 'text-gray-600 hover:bg-cfp-olive-pale hover:text-cfp-olive'"
        >
          {{ s.label }}
        </a>
      </nav>

      <div class="mt-6 border-t border-cfp-olive/10 pt-5">
        <p class="mb-3 font-poppins text-xs text-gray-500">
          Submission deadline
        </p>
        <p class="font-lora text-base font-bold text-cfp-red">
          October 1, 2026
        </p>
        <NuxtLink
          :to="hasSubmittedPaper ? `/submit-paper/${submittedPaperId}` : '/submit-paper/draft'"
          class="mt-4 block rounded-full bg-cfp-red px-5 py-2.5 text-center font-lora text-sm font-bold text-white transition-opacity hover:opacity-90"
        >
          {{ hasSubmittedPaper ? 'Edit Your Paper' : 'Submit Your Paper' }}
        </NuxtLink>
      </div>
    </div>
  </aside>
</template>
