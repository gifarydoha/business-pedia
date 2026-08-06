<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";

const open = ref(false);
const route = useRoute();
const settingsStore = useSettingsStore();
const authStore = useAuthStore(); // ⚠️ adjust to your actual auth store if named differently
const { buildImageUrl } = useImageUrl();

const logo = computed(() => settingsStore.org?.logo ? buildImageUrl(settingsStore.org.logo) : null);
const logoError = ref(false);
const orgName = computed(() => settingsStore.cfpHero.conferenceName ?? settingsStore.org?.name ?? "11th Social Business Academia Conference 2023");
const conferenceDate = computed(() => settingsStore.cfpDates.find((d) => d.label === "Conference Dates")?.date ?? "01 - 02 April, 2024");
const conferenceLocation = computed(() => settingsStore.cfpHero.location ?? "Asian Institute of Technology, Thailand");

const isLoggedIn = computed(() => authStore.isLoggedIn);

const FALLBACK_NAV_LINKS = [
  { label: "Announcement", href: "/#announcement" },
  { label: "Tracks and Sessions", href: "/#tracks" },
  { label: "Call For Papers", href: "/read-full-cfp" },
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

const authAction = computed(() =>
  isLoggedIn.value
    ? { label: "Submit Paper", href: "/submit-paper/draft" }
    : { label: "Login", href: "/login" },
);
</script>

<template>
  <header class="sticky top-0 z-50 flex w-full flex-col shadow-sm">
    <!-- Top Navbar -->
    <div class="bg-white">
      <div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <!-- Left Side: Logo & Info -->
        <NuxtLink
          to="/"
          class="group flex flex-wrap items-center gap-4"
        >
          <NuxtImg
            v-if="logo && !logoError"
            :src="logo"
            :alt="orgName"
            class="h-12 w-auto object-contain md:h-14"
            @error="logoError = true"
          />
          <NuxtImg
            v-else
            src="/images/cfp-logo.png"
            :alt="orgName"
            class="h-12 w-auto object-contain md:h-14"
          />
          <div class="flex flex-col justify-center">
            <span
              class="font-lora text-base font-medium text-cfp-olive transition-colors group-hover:text-cfp-olive/80 sm:text-xl"
            >
              {{ orgName }}
            </span>
            <div class="mt-1 flex flex-wrap items-center gap-1.5 font-poppins text-xs text-cfp-olive/80 sm:text-sm">
              <span>{{ conferenceDate }}</span>
              <Icon
                name="ph:map-pin-fill"
                class="size-3.5 shrink-0 sm:size-4"
              />
              <span>{{ conferenceLocation }}</span>
            </div>
          </div>
        </NuxtLink>

        <!-- Right Side: FAQ / Contact (Desktop) -->
        <div class="hidden items-center gap-6 font-poppins text-sm font-medium text-cfp-olive md:flex">
          <NuxtLink
            to="#"
            class="transition-colors hover:text-cfp-red"
          >FAQ</NuxtLink>
          <NuxtLink
            to="/pages/contact"
            class="transition-colors hover:text-cfp-red"
          >Contact</NuxtLink>
        </div>

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
    </div>

    <!-- Bottom Navbar -->
    <div class="hidden bg-cfp-yellow md:block">
      <div class="mx-auto flex max-w-6xl items-center justify-between pl-6">
        <div class="flex items-center gap-6 overflow-x-auto">
          <NuxtLink
            v-for="l in navLinks"
            :key="l.label"
            :to="l.href"
            class="py-4 font-poppins text-sm font-medium tracking-wide whitespace-nowrap uppercase transition-colors hover:text-cfp-olive"
            :class="isActive(l.href) ? 'text-cfp-olive' : 'text-white'"
          >
            {{ l.label }}
          </NuxtLink>
        </div>

        <NuxtLink
          :to="authAction.href"
          class="inline-flex h-full items-center self-stretch bg-white px-8 py-4 font-poppins text-sm font-bold text-cfp-olive transition-colors hover:bg-cfp-olive hover:text-white"
        >
          {{ authAction.label }}
        </NuxtLink>
      </div>
    </div>

    <!-- Mobile menu -->
    <div
      v-show="open"
      class="flex flex-col gap-3 bg-cfp-yellow px-6 pt-2 pb-4 md:hidden"
    >
      <NuxtLink
        v-for="l in navLinks"
        :key="l.label"
        :to="l.href"
        class="py-2 font-poppins text-sm tracking-wide uppercase transition-colors hover:text-cfp-olive"
        :class="isActive(l.href) ? 'text-cfp-olive font-semibold' : 'text-white'"
        @click="open = false"
      >
        {{ l.label }}
      </NuxtLink>
      <div class="my-2 h-px w-full bg-white/30" />
      <NuxtLink
        to="#"
        class="py-1 font-poppins text-sm text-white hover:text-cfp-olive"
        @click="open = false"
      >FAQ
      </NuxtLink>
      <NuxtLink
        to="/pages/contact"
        class="py-1 font-poppins text-sm text-white hover:text-cfp-olive"
        @click="open = false"
      >
        Contact</NuxtLink>
      <NuxtLink
        :to="authAction.href"
        class="mt-4 rounded bg-white px-5 py-2 text-center font-poppins text-sm font-bold text-cfp-olive transition-colors hover:bg-cfp-olive hover:text-white"
        @click="open = false"
      >
        {{ authAction.label }}
      </NuxtLink>
    </div>
  </header>
</template>
