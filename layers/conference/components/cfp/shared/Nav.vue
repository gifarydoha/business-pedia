<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";

const open = ref(false);
const route = useRoute();
const settingsStore = useSettingsStore();
const { buildImageUrl } = useImageUrl();

const logo = computed(() => buildImageUrl(settingsStore.org?.logo));
const orgName = computed(() => settingsStore.org?.name ?? "13th Social Business Academia Conference 2026");

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
  <header class="sticky top-0 z-50 flex w-full flex-col shadow-sm">
    <!-- Top Navbar -->
    <div class="bg-white">
      <div class="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <!-- Left Side: Logo & Info -->
        <NuxtLink
          to="/"
          class="group flex flex-wrap items-center gap-4"
        >
          <NuxtImg
            v-if="logo"
            :src="logo"
            :alt="orgName"
            class="h-14 w-auto object-contain"
          />
          <NuxtImg
            v-else
            src="/images/cfp-logo.png"
            :alt="orgName"
            class="h-14 w-auto object-contain"
          />
          <div class="flex flex-col justify-center">
            <span class="font-lora text-xl font-medium text-cyan-600 transition-colors group-hover:text-cyan-700 sm:text-2xl">
              {{ orgName }}
            </span>
            <div class="mt-1 flex flex-wrap items-center gap-2 font-poppins text-sm text-cyan-600">
              <span>1–2 April 2027</span>
              <Icon
                name="ph:map-pin-fill"
                class="size-4"
              />
              <span>Chatrium Hotel Riverside Bangkok, Thailand</span>
            </div>
          </div>
        </NuxtLink>

        <!-- Right Side: FAQ / Contact (Desktop) -->
        <div class="hidden items-center gap-6 font-poppins text-sm font-medium text-cyan-600 md:flex">
          <NuxtLink
            to="/faq"
            class="transition-colors hover:text-cyan-800"
          >FAQ</NuxtLink>
          <NuxtLink
            to="/contact"
            class="transition-colors hover:text-cyan-800"
          >Contact</NuxtLink>
        </div>

        <!-- Mobile hamburger -->
        <button
          class="text-cyan-600 md:hidden"
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
    </div>

    <!-- Bottom Navbar -->
    <div class="hidden bg-cfp-olive md:block">
      <div class="mx-auto flex max-w-6xl items-center justify-between pl-6">
        <!-- Links -->
        <div class="flex items-center gap-6 overflow-x-auto">
          <NuxtLink
            v-for="l in navLinks"
            :key="l.label"
            :to="l.href"
            class="py-4 font-poppins text-sm font-medium tracking-wide whitespace-nowrap uppercase transition-colors hover:text-white"
            :class="isActive(l.href) ? 'text-white' : 'text-white/80'"
          >
            {{ l.label }}
          </NuxtLink>
        </div>

        <!-- Sign in Button -->
        <NuxtLink
          to="/login"
          class="inline-flex h-full items-center self-stretch bg-white px-8 py-4 font-poppins text-sm font-bold text-gray-900 transition-colors hover:bg-gray-100"
        >
          Sign in
        </NuxtLink>
      </div>
    </div>

    <!-- Mobile menu -->
    <div
      v-show="open"
      class="flex flex-col gap-3 bg-cfp-olive px-6 pt-2 pb-4 md:hidden"
    >
      <NuxtLink
        v-for="l in navLinks"
        :key="l.label"
        :to="l.href"
        class="py-2 font-poppins text-sm tracking-wide uppercase transition-colors hover:text-white"
        :class="isActive(l.href) ? 'text-cfp-yellow font-medium' : 'text-white/80'"
        @click="open = false"
      >
        {{ l.label }}
      </NuxtLink>
      <div class="my-2 h-px w-full bg-white/20" />
      <NuxtLink
        to="/faq"
        class="py-1 font-poppins text-sm text-white/80 hover:text-white"
        @click="open = false"
      >FAQ</NuxtLink>
      <NuxtLink
        to="/contact"
        class="py-1 font-poppins text-sm text-white/80 hover:text-white"
        @click="open = false"
      >Contact</NuxtLink>
      <NuxtLink
        to="/login"
        class="mt-4 rounded bg-white px-5 py-2 text-center font-poppins text-sm font-bold text-gray-900 transition-colors hover:bg-gray-100"
        @click="open = false"
      >
        Sign in
      </NuxtLink>
    </div>
  </header>
</template>
