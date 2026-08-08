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
    <!-- Main profile card -->
    <div class="mb-6 overflow-hidden rounded-2xl border border-cfp-olive/15 bg-white shadow-lg">
      <!-- Card header band -->
      <div class="relative h-24 bg-cfp-olive" />

      <!-- Avatar + identity -->
      <div class="px-6 pb-8 md:px-8">
        <div class="-mt-12 mb-6 flex items-start justify-between">
          <!-- Avatar -->
          <div class="flex size-20 shrink-0 items-center justify-center rounded-full border-4 border-white bg-cfp-yellow shadow-lg">
            <span class="font-lora text-2xl font-bold text-cfp-olive">
              {{ avatarInitials }}
            </span>
          </div>

          <!-- Edit button — top-right of card -->
          <div class="mt-14">
            <NuxtLink
              to="/profile/edit"
              class="inline-flex items-center gap-2 rounded-full bg-cfp-olive px-5 py-2 font-lora text-sm font-bold text-white transition-opacity hover:opacity-90"
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
              Edit Profile
            </NuxtLink>
          </div>
        </div>

        <!-- Name + email + user ID -->
        <h2 class="mb-1 font-lora text-2xl font-bold text-cfp-olive md:text-3xl">
          {{ name }}
        </h2>
        <p class="mb-3 font-poppins text-sm text-gray-500">
          {{ email }}
        </p>
        <span class="mb-6 inline-block rounded-full bg-cfp-olive-pale px-3 py-1 font-poppins text-xs tracking-wide text-cfp-olive/70">
          ID: {{ userId }}
        </span>

        <!-- Bio -->
        <div class="mb-8">
          <p class="border-l-4 border-cfp-yellow pl-4 font-lora leading-relaxed text-gray-600 italic">
            {{ bio }}
          </p>
        </div>

        <!-- Field rows -->
        <div class="divide-y divide-cfp-olive/8">
          <div
            v-for="f in fields"
            :key="f.label"
            class="flex items-start justify-between gap-6 py-4"
          >
            <span class="w-36 shrink-0 font-poppins text-sm text-gray-400">
              {{ f.label }}
            </span>
            <span class="text-right font-poppins text-sm text-gray-800">{{ f.value }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats row -->
    <div class="mb-6 grid grid-cols-3 gap-4">
      <div
        v-for="s in [
          { val: papers, label: 'Papers Submitted' },
          { val: '2', label: 'Under Review' },
          { val: '1', label: 'Accepted' },
        ]"
        :key="s.label"
        class="rounded-2xl border border-cfp-olive/15 bg-white p-5 text-center shadow-lg transition-shadow hover:shadow-xl"
      >
        <div class="mb-1 font-lora text-3xl font-bold text-cfp-olive">
          {{ s.val }}
        </div>
        <div class="font-poppins text-xs text-gray-500">
          {{ s.label }}
        </div>
      </div>
    </div>

    <!-- Quick actions -->
    <div class="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-cfp-olive/15 bg-cfp-olive-pale p-6 shadow-lg">
      <div>
        <p class="mb-0.5 font-lora text-base font-semibold text-cfp-olive">
          Ready to submit your next paper?
        </p>
        <p class="font-poppins text-sm text-gray-500">
          Deadline: <span class="font-semibold text-cfp-red">31 January 2024</span>
        </p>
      </div>
      <div class="flex flex-wrap gap-3">
        <NuxtLink
          to="/submit-paper"
          class="rounded-full bg-cfp-red px-6 py-2.5 font-lora text-sm font-bold text-white transition-opacity hover:opacity-90"
        >
          Submit a Paper
        </NuxtLink>
        <NuxtLink
          to="/my-papers"
          class="rounded-full border-2 border-cfp-olive px-6 py-2.5 font-lora text-sm font-bold text-cfp-olive transition-colors hover:bg-cfp-olive/5"
        >
          My Papers
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
