<!-- app/layouts/dashboard.vue -->
<script setup lang="ts">
// Authenticated layout with a sidebar for user dashboard.
import { useUserPaper } from "~~/layers/conference/composables/useUserPaper";

const authStore = useAuthStore();
const { hasSubmittedPaper, submittedPaperId } = useUserPaper();
</script>

<template>
  <div class="flex min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <aside class="flex w-64 flex-col border-r border-gray-200 bg-white shadow-sm">
      <div class="border-b border-gray-100 p-6">
        <NuxtLink
          to="/"
          class="text-xl font-bold text-brand-primary"
        >
          Business-Pedia
        </NuxtLink>
      </div>

      <nav class="flex-1 space-y-1 p-4">
        <NuxtLink
          to="/dashboard"
          class="block rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-50 hover:text-brand-primary"
          active-class="bg-brand-primary-light text-brand-primary"
        >
          Dashboard Overview
        </NuxtLink>
        <NuxtLink
          :to="hasSubmittedPaper ? `/submit-paper/${submittedPaperId}` : '/submit-paper/draft'"
          class="block rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-50 hover:text-brand-primary"
          active-class="bg-brand-primary-light text-brand-primary"
        >
          {{ hasSubmittedPaper ? 'Edit Your Paper' : 'Submit Paper' }}
        </NuxtLink>
        <!-- Add more dashboard links here based on roles -->
      </nav>

      <div class="border-t border-gray-100 p-4">
        <div class="mb-4 flex items-center gap-3">
          <div class="flex size-10 items-center justify-center rounded-full bg-gray-200 font-bold text-gray-500">
            {{ authStore.user?.name?.charAt(0) ?? 'U' }}
          </div>
          <div>
            <div class="text-sm font-medium">
              {{ authStore.user?.name }}
            </div>
            <div class="text-xs text-gray-500 capitalize">
              {{ authStore.userRoleNames }}
            </div>
          </div>
        </div>
        <UButton
          variant="soft"
          color="neutral"
          block
          @click="authStore.logout()"
        >
          Logout
        </UButton>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-8">
      <slot />
    </main>
  </div>
</template>
