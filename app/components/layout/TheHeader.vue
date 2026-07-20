<!-- app/components/layout/TheHeader.vue -->
<script setup lang="ts">
const settingsStore = useSettingsStore();
const authStore = useAuthStore();
const { buildImageUrl } = useImageUrl();

const mainMenu = computed(() => settingsStore.mainMenu);
const logo = computed(() => buildImageUrl(settingsStore.org?.logo));
const orgName = computed(() => settingsStore.org?.name ?? "Business-Pedia");
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-gray-100 bg-white shadow-sm">
    <nav class="container mx-auto flex h-16 items-center justify-between px-4">
      <!-- Logo -->
      <NuxtLink
        to="/"
        class="flex items-center gap-2"
      >
        <NuxtImg
          :src="logo"
          :alt="orgName"
          class="h-10 w-auto object-contain"
        />
      </NuxtLink>

      <!-- Dynamic Menu (Desktop) -->
      <ul class="hidden items-center gap-6 md:flex">
        <li
          v-for="item in mainMenu"
          :key="item.id"
          class="group relative"
        >
          <!-- Item with children = dropdown -->
          <template v-if="item.children?.length">
            <button class="nav-link flex cursor-pointer items-center gap-1">
              {{ item.label }}
              <UIcon
                name="i-heroicons-chevron-down"
                class="group-hover:text-brand-primary size-4 text-gray-500 transition-colors"
              />
            </button>
            <ul
              class="invisible absolute top-full left-0 z-50 mt-2 w-48 rounded-lg border border-gray-100
                       bg-white opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100"
            >
              <li
                v-for="child in item.children"
                :key="child.id"
              >
                <NuxtLink
                  :to="`/${child.url}`"
                  class="hover:text-brand-primary block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  {{ child.label }}
                </NuxtLink>
              </li>
            </ul>
          </template>
          <!-- Regular item -->
          <NuxtLink
            v-else
            :to="`/${item.url}`"
            class="nav-link"
          >
            {{ item.label }}
          </NuxtLink>
        </li>
      </ul>

      <!-- Auth buttons / User Profile -->
      <div class="hidden items-center gap-3 md:flex">
        <template v-if="authStore.isLoggedIn">
          <NuxtLink
            to="/dashboard"
            class="hover:text-brand-primary text-sm font-medium text-gray-700"
          >
            {{ authStore.user?.name }}
          </NuxtLink>
          <UButton
            variant="ghost"
            color="neutral"
            size="sm"
            @click="authStore.logout()"
          >
            Logout
          </UButton>
        </template>
        <template v-else>
          <NuxtLink to="/login">
            <UButton
              variant="ghost"
              color="neutral"
              size="sm"
            >Login</UButton>
          </NuxtLink>
          <NuxtLink to="/register">
            <UButton
              class="btn-brand-primary"
              size="sm"
            >Register</UButton>
          </NuxtLink>
        </template>
      </div>

      <!-- Mobile Menu Toggle (Placeholder for mobile implementation) -->
      <div class="md:hidden">
        <UButton
          icon="i-heroicons-bars-3"
          variant="ghost"
          color="neutral"
        />
      </div>
    </nav>
  </header>
</template>
