<!-- app/layouts/dashboard.vue -->
<script setup lang="ts">
// Authenticated layout with a sidebar for user dashboard.
const authStore = useAuthStore();
</script>

<template>
  <div class="flex min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <aside class="flex w-64 flex-col border-r border-gray-200 bg-white shadow-sm">
      <div class="border-b border-gray-100 p-6">
        <NuxtLink
          to="/"
          class="text-brand-primary text-xl font-bold"
        >
          Business-Pedia
        </NuxtLink>
      </div>

      <nav class="flex-1 space-y-1 p-4">
        <NuxtLink
          to="/dashboard"
          class="hover:text-brand-primary block rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-50"
          active-class="bg-brand-primary-light text-brand-primary"
        >
          Dashboard Overview
        </NuxtLink>
        <NuxtLink
          to="/submit-paper"
          class="hover:text-brand-primary block rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-50"
          active-class="bg-brand-primary-light text-brand-primary"
        >
          Submit Paper
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
              {{ authStore.userRole }}
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
