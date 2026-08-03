<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";

const open = ref(false);
const route = useRoute();
const settingsStore = useSettingsStore();
const { buildImageUrl } = useImageUrl();

const logo = computed(() => buildImageUrl(settingsStore.org?.logo));
const orgName = computed(() => settingsStore.org?.name ?? "SBAC 2026");

const FALLBACK_NAV_LINKS = [
  { label: "About", href: "/#about" },
  { label: "Principles", href: "/#principles" },
  { label: "Tracks", href: "/#tracks" },
  { label: "Dates", href: "/#dates" },
  { label: "Guidelines", href: "/guidelines" },
];

const getHref = (item: { url?: string; link?: string }) => {
  const target = item.url || item.link;
  if (!target) return "/";
  return target.startsWith("/") ? target : `/${target}`;
};

const navLinks = computed(() => {
  if (settingsStore.mainMenu && settingsStore.mainMenu.length > 0) {
    return settingsStore.mainMenu.map((item) => ({
      label: item.label,
      href: getHref(item),
    }));
  }
  return FALLBACK_NAV_LINKS;
});

const isActive = (href: string) => {
  if (href.startsWith("/#")) return route.path === "/";
  return route.path === href;
};
</script>

<template>
  <nav class="sticky top-0 z-50 border-b border-cfp-olive/10 bg-white shadow-sm">
    <div class="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-3">
      <NuxtLink
        to="/"
        class="group flex items-center gap-3"
      >
        <NuxtImg
          v-if="logo"
          :src="logo"
          :alt="orgName"
          class="h-10 w-auto object-contain"
        />
        <CfpLogo
          v-else
          class="h-10 w-auto"
        />
        <span
          class="font-lora text-lg font-bold tracking-tight text-cfp-olive transition-colors group-hover:text-cfp-red"
        >{{ orgName }}</span>
      </NuxtLink>

      <!-- Desktop links -->
      <div class="hidden items-center gap-6 md:flex">
        <NuxtLink
          v-for="l in navLinks"
          :key="l.label"
          :to="l.href"
          class="font-poppins text-sm transition-colors hover:text-cfp-olive"
          :class="isActive(l.href) ? 'text-cfp-red font-medium' : 'text-gray-600'"
        >
          {{ l.label }}
        </NuxtLink>
      </div>

      <NuxtLink
        to="/submit-paper"
        class="hidden rounded-full bg-cfp-red px-5 py-2 font-lora text-sm font-bold text-white transition-opacity hover:opacity-90 md:inline-flex"
      >
        Submit Your Paper
      </NuxtLink>

      <!-- Mobile hamburger -->
      <button
        class="text-cfp-olive md:hidden"
        aria-label="Toggle menu"
        @click="open = !open"
      >
        <svg
          class="size-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            v-if="open"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
          <path
            v-else
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
    </div>

    <!-- Mobile menu -->
    <div
      v-show="open"
      class="flex flex-col gap-3 bg-cfp-olive-dark px-6 pb-4 md:hidden"
    >
      <NuxtLink
        v-for="l in navLinks"
        :key="l.label"
        :to="l.href"
        class="py-1 font-poppins text-sm transition-colors hover:text-white"
        :class="isActive(l.href) ? 'text-cfp-yellow font-medium' : 'text-white/80'"
        @click="open = false"
      >
        {{ l.label }}
      </NuxtLink>
      <NuxtLink
        to="/submit-paper"
        class="mt-2 rounded-full bg-cfp-red px-5 py-2 text-center font-lora text-sm font-bold text-white transition-opacity hover:opacity-90"
        @click="open = false"
      >
        Submit Your Paper
      </NuxtLink>
    </div>
  </nav>
</template>
