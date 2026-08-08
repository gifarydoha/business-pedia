<script setup lang="ts">
const props = defineProps<{
  name: string;
  email: string;
  userId: string;
  affiliation: string;
  country: string;
  bio: string;
  avatarInitials: string;
  joined: string;
  papers: number;
  track: string;
}>();

const fields = computed(() => [
  { label: "Affiliation", value: props.affiliation },
  { label: "Country", value: props.country },
  { label: "Primary Track", value: props.track },
  { label: "Member Since", value: props.joined },
]);
</script>

<template>
  <div>
    <!-- Quick actions — one clear primary action, "My Papers" de-emphasized -->
    <div class="mb-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-5">
      <div>
        <p class="font-poppins text-sm font-medium text-gray-700">
          Deadline: <span class="font-semibold text-cfp-red">31 January 2024</span>
        </p>
      </div>
      <div class="flex flex-wrap items-center gap-5">
        <NuxtLink
          to="/my-papers"
          class="font-poppins text-sm font-medium text-gray-500 underline underline-offset-2 transition-colors hover:text-cfp-olive"
        >
          My Papers
        </NuxtLink>
        <NuxtLink
          to="/submit-paper"
          class="rounded-full bg-cfp-red px-6 py-2.5 font-lora text-sm font-bold text-white transition-opacity hover:opacity-90"
        >
          Submit a Paper
        </NuxtLink>
      </div>
    </div>

    <!-- Stats row -->
    <div class="mb-5 grid grid-cols-3 gap-3">
      <div
        v-for="s in [
          { val: papers, label: 'Papers Submitted' },
          { val: '2', label: 'Under Review' },
          { val: '1', label: 'Accepted' },
        ]"
        :key="s.label"
        class="rounded-2xl border border-gray-100 bg-white p-4 text-center"
      >
        <div class="mb-0.5 font-lora text-2xl font-bold text-cfp-olive">
          {{ s.val }}
        </div>
        <div class="font-poppins text-xs text-gray-400">
          {{ s.label }}
        </div>
      </div>
    </div>

    <!-- Main profile card — light, no header band -->
    <div class=" rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
      <!-- Avatar + identity -->
      <div class="mb-6 flex items-start justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="flex size-16 shrink-0 items-center justify-center rounded-full bg-cfp-olive/10">
            <span class="font-lora text-lg font-bold text-cfp-olive">
              {{ avatarInitials }}
            </span>
          </div>
          <div>
            <h2 class="font-lora text-xl font-bold text-cfp-olive md:text-2xl">
              {{ name }}
            </h2>
            <p class="font-poppins text-sm text-gray-500">
              {{ email }}
            </p>
          </div>
        </div>

        <NuxtLink
          to="/profile/edit"
          class="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-cfp-olive/25 px-4 py-1.5 font-poppins text-sm font-medium text-cfp-olive transition-colors hover:bg-cfp-olive/5"
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

      <span class="mb-6 inline-block rounded-full bg-gray-50 px-3 py-1 font-poppins text-xs text-gray-400">
        ID: {{ userId }}
      </span>

      <!-- Bio -->
      <p class="mb-6 font-poppins text-sm leading-relaxed text-gray-600">
        {{ bio }}
      </p>

      <!-- Field rows -->
      <div class="divide-y divide-gray-100 border-t border-gray-100">
        <div
          v-for="f in fields"
          :key="f.label"
          class="flex items-center justify-between gap-6 py-3"
        >
          <span class="font-poppins text-sm text-gray-400">{{ f.label }}</span>
          <span class="font-poppins text-sm font-medium text-gray-700">{{ f.value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
