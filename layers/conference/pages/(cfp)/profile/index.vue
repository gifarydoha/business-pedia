<script setup lang="ts">
import type { UserProfile } from "~/layers/conference/types/profile";
import { useUserPaper } from "~~/layers/conference/composables/useUserPaper";

const { hasSubmittedPaper, submittedPaperId } = useUserPaper();
definePageMeta({ layout: "conference-dashboard", middleware: ["auth"] });
useSeoMeta({ title: "My Profile" });

const authStore = useAuthStore();
const authUser = computed(() => authStore.user);
const config = useRuntimeConfig();

// Helper: derive initials from name ("doha15" → "D", "Amara Osei" → "AO")
function getInitials(name: string | undefined): string {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0)
    .map((w) => w[0]!.toUpperCase())
    .join("")
    .slice(0, 2);
}

// Helper: format ISO date → "August 2026"
// function formatJoined(iso: string | undefined): string {
//   if (!iso) return "—";
//   return new Date(iso).toLocaleDateString("en-US", { month: "long", year: "numeric" });
// }

const { data: apiUser } = await useAsyncData("profile", async () => {
  if (!authUser.value?.id) return null;
  const res = await $fetch<any>(`/ciaur/secure_api/user/${authUser.value.id}`, {
    baseURL: config.public.apiBase as string,
    method: "GET",
  });
  return res?.user || null;
});

const user = computed<UserProfile>(() => ({
  name: apiUser.value?.name || authUser.value?.name || "—",
  email: apiUser.value?.email || authUser.value?.email || "—",
  userId: authUser.value?.id ? `USR-${authUser.value.id}` : "—",
  contact_number: apiUser.value?.contact_number || "—",
  designation: apiUser.value?.designation || "—",
  avatarInitials: getInitials(apiUser.value?.name || authUser.value?.name),
}));
</script>

<template>
  <div class="min-h-screen bg-brand-primary-light/40">
    <CfpSharedBreadcrumb :crumbs="[{ label: 'My Profile' }]" />

    <div class="mx-auto max-w-3xl px-6 py-10 md:py-12">
      <div class="mb-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-5">
        <h1 class="mb-6 font-lora text-2xl font-bold text-brand-primary md:text-3xl">
          My Profile
        </h1>

        <div class="flex flex-wrap items-center gap-5">
          <NuxtLink
            to="/my-papers"
            class="font-poppins text-sm font-medium text-gray-500 underline underline-offset-2 transition-colors hover:text-brand-primary"
          >
            My Papers
          </NuxtLink>
          <NuxtLink
            :to="hasSubmittedPaper ? `/submit-paper/${submittedPaperId}` : '/submit-paper/draft'"
            class="rounded-full bg-destructive px-6 py-2.5 font-lora text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            {{ hasSubmittedPaper ? 'Edit Your Paper' : 'Submit a Paper' }}
          </NuxtLink>
        </div>
      </div>

      <ProfileCard v-bind="user" />
    </div>
  </div>
</template>
