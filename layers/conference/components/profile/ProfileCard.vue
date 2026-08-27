<script setup lang="ts">
import { computed } from "vue";
import type { UserProfile } from "../../types/profile";

const props = defineProps<UserProfile>();

const fields = computed(() => [
  { label: "Designation", value: props.designation },
  { label: "Contact Number", value: props.contact_number },
]);
</script>

<template>
  <div>
    <!-- Main profile card -->
    <div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
      <!-- Avatar + identity -->
      <div class="mb-6 flex items-start justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="flex size-16 shrink-0 items-center justify-center rounded-full bg-brand-primary/10">
            <span class="font-lora text-lg font-bold text-brand-primary">
              {{ avatarInitials }}
            </span>
          </div>
          <div>
            <h2 class="font-lora text-xl font-bold text-brand-primary md:text-2xl">
              {{ name }}
            </h2>
            <p class="font-poppins text-sm text-gray-500">
              {{ email }}
            </p>
          </div>
        </div>

        <NuxtLink
          to="/profile/edit"
          class="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-brand-secondary bg-brand-secondary px-4 py-1.5 font-poppins text-sm font-medium text-brand-secondary-foreground transition-colors hover:bg-brand-secondary"
        >
          <svg
            class="size-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          Edit
        </NuxtLink>
      </div>

      <!-- Field rows -->
      <div class="divide-y divide-gray-100 border-t border-gray-100">
        <div
          v-for="f in fields"
          :key="f.label"
          class="flex items-center justify-between gap-6 py-3"
        >
          <span class="font-poppins text-sm text-gray-400">{{ f.label }}</span>
          <span class="font-poppins text-sm font-medium text-gray-700">{{ f.value || '—' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
