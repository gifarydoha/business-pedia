<!-- app/components/layout/TheHeader.vue -->
<script setup lang="ts">
const settingsStore = useSettingsStore();
const authStore = useAuthStore();
const { buildImageUrl } = useImageUrl();

interface MenuItem {
  id: string | number;
  label: string;
  url?: string;
  link?: string;
  children?: MenuItem[];
}

const FALLBACK_MAIN_MENU: MenuItem[] = [
  { id: "fallback-1", label: "Post", url: "/" },
  { id: "fallback-2", label: "About", url: "/about" },
  { id: "fallback-3", label: "Videos", url: "/videos" },
  { id: "fallback-4", label: "Images", url: "/images" },
];

const mainMenu = computed(() => {
  if (settingsStore.mainMenu && settingsStore.mainMenu.length > 0) {
    return settingsStore.mainMenu;
  }
  return FALLBACK_MAIN_MENU;
});
const logo = computed(() => buildImageUrl(settingsStore.org?.logo));
const orgName = computed(() => settingsStore.org?.name ?? "Business-Pedia");
const isMobileMenuOpen = ref(false);
const mobileDropdowns = ref<Record<string, boolean>>({});

const toggleMobileDropdown = (id: string | number) => {
  mobileDropdowns.value[id] = !mobileDropdowns.value[id];
};

const getHref = (item: { url?: string; link?: string }) => {
  const target = item.url || item.link;
  if (!target) return "/";
  return target.startsWith("/") ? target : `/${target}`;
};
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-border bg-card shadow-sm">
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
      <ul class="hidden items-center gap-6 lg:flex">
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
                class="size-4 text-muted-foreground transition-colors group-hover:text-primary"
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
                  :to="getHref(child)"
                  :prefetch="false"
                  class="block px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-primary"
                >
                  {{ child.label }}
                </NuxtLink>
              </li>
            </ul>
          </template>
          <!-- Regular item -->
          <NuxtLink
            v-else
            :to="getHref(item)"
            :prefetch="false"
            class="nav-link"
          >
            {{ item.label }}
          </NuxtLink>
        </li>
      </ul>

      <!-- Auth buttons / User Profile -->
      <div class="hidden items-center gap-3 lg:flex">
        <template v-if="authStore.isLoggedIn">
          <NuxtLink
            to="/profile"
            class="text-sm font-medium text-foreground hover:text-primary"
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
              variant="soft"
              color="neutral"
              size="sm"
            >Login</UButton>
          </NuxtLink>
          <NuxtLink to="/quick-register">
            <UButton
              class="btn-brand-primary"
              size="sm"
            >Register</UButton>
          </NuxtLink>
        </template>
      </div>

      <!-- Mobile Menu Toggle -->
      <div class="lg:hidden">
        <UButton
          icon="i-heroicons-bars-3"
          variant="ghost"
          color="neutral"
          @click="isMobileMenuOpen = true"
        />
      </div>
    </nav>

    <!-- Custom Mobile Menu (React implementation style) -->
    <div class="lg:hidden">
      <!-- Backdrop -->
      <div
        class="fixed inset-0 z-40 bg-foreground/20 transition-opacity duration-300"
        :class="isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'"
        @click="isMobileMenuOpen = false"
      />

      <!-- Menu Panel -->
      <div
        class="fixed top-0 left-0 z-50 flex h-screen w-full max-w-75 flex-col bg-card text-card-foreground shadow-xl transition-transform duration-300"
        :class="isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'"
      >
        <!-- Mobile Menu Header -->
        <div class="flex items-center justify-between border-b border-gray-100 p-4">
          <NuxtLink
            to="/"
            class="flex items-center gap-2"
            @click="isMobileMenuOpen = false"
          >
            <NuxtImg
              :src="logo"
              :alt="orgName"
              class="h-8 w-auto object-contain"
            />
          </NuxtLink>
          <!-- close btn -->
          <button
            class="p-2 text-muted-foreground hover:text-foreground focus:outline-none"
            aria-label="Close menu"
            type="button"
            @click="isMobileMenuOpen = false"
          >
            <UIcon
              name="i-heroicons-x-mark"
              class="size-6"
            />
          </button>
        </div>

        <!-- Mobile Menu Options -->
        <div class="flex flex-1 flex-col overflow-y-auto p-4">
          <div
            v-for="(item, index) in mainMenu"
            :key="item.id"
            class="flex flex-col transition-all duration-300"
            :class="isMobileMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'"
            :style="{ transitionDelay: isMobileMenuOpen ? `${100 + index * 50}ms` : '0ms' }"
          >
            <!-- Item with children -->
            <template v-if="item.children?.length">
              <button
                class="flex w-full items-center justify-between py-4 text-left font-medium text-foreground focus:outline-none"
                @click="toggleMobileDropdown(item.id)"
              >
                {{ item.label }}
                <UIcon
                  name="i-heroicons-chevron-down"
                  class="size-5 text-muted-foreground transition-transform duration-200"
                  :class="mobileDropdowns[item.id] ? 'rotate-180' : ''"
                />
              </button>
              <div
                class="flex flex-col gap-3 overflow-hidden pl-4 transition-all duration-300"
                :class="mobileDropdowns[item.id] ? 'max-h-64 pb-4 opacity-100' : 'max-h-0 pb-0 opacity-0'"
              >
                <NuxtLink
                  v-for="child in item.children"
                  :key="child.id"
                  :to="getHref(child)"
                  :prefetch="false"
                  class="block py-1 text-sm text-muted-foreground transition-colors hover:text-primary"
                  @click="isMobileMenuOpen = false"
                >
                  {{ child.label }}
                </NuxtLink>
              </div>
            </template>

            <!-- Regular item -->
            <NuxtLink
              v-else
              :to="getHref(item)"
              :prefetch="false"
              class="block py-4 font-medium text-foreground hover:text-primary"
              @click="isMobileMenuOpen = false"
            >
              {{ item.label }}
            </NuxtLink>
          </div>

          <!-- Auth Actions -->
          <div
            class="mt-6 flex flex-col gap-3 transition-all duration-300"
            :class="isMobileMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'"
            :style="{ transitionDelay: isMobileMenuOpen ? `${100 + (mainMenu?.length || 0) * 50 + 50}ms` : '0ms' }"
          >
            <template v-if="authStore.isLoggedIn">
              <div class="flex flex-col gap-2 rounded-lg bg-muted p-4">
                <span class="text-xs text-muted-foreground">Logged in as</span>
                <NuxtLink
                  to="/profile"
                  class="truncate text-sm font-medium text-foreground"
                  @click="isMobileMenuOpen = false"
                >
                  {{ authStore.user?.name }}
                </NuxtLink>
                <UButton
                  variant="soft"
                  color="neutral"
                  class="mt-2 w-full justify-center"
                  @click="() => { authStore.logout(); isMobileMenuOpen = false; }"
                >
                  Logout
                </UButton>
              </div>
            </template>
            <template v-else>
              <NuxtLink
                to="/login"
                class="w-full"
                @click="isMobileMenuOpen = false"
              >
                <UButton
                  variant="soft"
                  color="neutral"
                  class="h-11 w-full justify-center text-sm font-bold"
                >
                  Log in
                </UButton>
              </NuxtLink>
              <NuxtLink
                to="/quick-register"
                class="w-full"
                @click="isMobileMenuOpen = false"
              >
                <UButton class="btn-brand-primary h-11 w-full justify-center text-sm font-bold text-white">
                  Get Started
                </UButton>
              </NuxtLink>
            </template>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
