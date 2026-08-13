<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { useCfpService } from "../../../services/cfp.service";
import { parseCfpContent } from "../../../utils/cfpParser";

const open = ref(false);
const userDropdownOpen = ref(false);
const mobileAccountOpen = ref(false);
const route = useRoute();
const settingsStore = useSettingsStore();
const authStore = useAuthStore();
const { buildImageUrl } = useImageUrl();

const cfpService = useCfpService();
const { data: navCfp } = useAsyncData(
  "nav-cfp-content",
  () => cfpService.fetchCallForPapers().then(parseCfpContent),
);

const logo = computed(() => settingsStore.org?.logo ? buildImageUrl(settingsStore.org.logo) : null);
const logoError = ref(false);

const favicon = computed(() => settingsStore.org?.favicon ? buildImageUrl(settingsStore.org.favicon) : null);
useHead(() => ({
  link: favicon.value ? [{ rel: "icon", href: favicon.value }] : [],
}));

const orgName = computed(() => navCfp.value?.header.title ?? settingsStore.org?.name ?? "13th Social Business Academia Conference 2026");
const conferenceDate = computed(() => navCfp.value?.meta.date ?? "November 25–26, 2026");
const conferenceLocation = computed(() => navCfp.value?.meta.venue ?? "Thailand");

const isLoggedIn = computed(() => authStore.isLoggedIn);
const authUser = computed(() => authStore.user);

const avatarUrl = computed(() => {
  const av = authUser.value?.avatar;
  if (!av) return null;
  return av.startsWith("http") ? av : buildImageUrl(av);
});

const userInitials = computed(() => {
  const name = authUser.value?.name;
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0)
    .map((w) => w[0]!.toUpperCase())
    .join("")
    .slice(0, 2);
});

const FALLBACK_NAV_LINKS = [
  { label: "Call For Papers", href: "/call-for-papers" },
  { label: "Tracks", href: "/tracks" },
  { label: "Committee", href: "/committee" },
];

const getHref = (item: { url?: string; link?: string }) => {
  const target = item.url || item.link;
  if (!target) return "/";
  return target.startsWith("/") ? target : `/${target}`;
};

const navLinks = computed(() => {
  if (settingsStore.mainMenu && settingsStore.mainMenu.length > 0) {
    // console.log(settingsStore.mainMenu.map((item) => ({
    //   href: getHref(item),
    // })));
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

const USER_MENU_ITEMS = [
  { label: "My Profile", href: "/profile", icon: "ph:user" },
  { label: "My Papers", href: "/my-papers", icon: "ph:file-text" },
  { label: "Submit Paper", href: "/submit-paper/draft", icon: "ph:paper-plane-tilt" },
];

async function handleLogout() {
  userDropdownOpen.value = false;
  open.value = false;
  await authStore.logout();
}

function onClickOutside(e: MouseEvent) {
  const el = document.getElementById("user-dropdown-wrapper");
  if (el && !el.contains(e.target as Node)) {
    userDropdownOpen.value = false;
  }
}

onMounted(() => document.addEventListener("click", onClickOutside));
onUnmounted(() => document.removeEventListener("click", onClickOutside));
</script>

<template>
  <header class="sticky top-0 z-50 flex w-full flex-col shadow-sm">
    <div class="bg-white">
      <div class="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4">
        <NuxtLink
          to="/"
          class="group flex min-w-0 flex-1 items-center gap-2 sm:gap-4"
        >
          <NuxtImg
            v-if="logo && !logoError"
            :src="logo"
            :alt="orgName"
            class="h-10 w-auto shrink-0 object-contain sm:h-12 md:h-14"
            @error="logoError = true"
          />
          <NuxtImg
            v-else
            src="/images/cfp-logo.png"
            :alt="orgName"
            class="h-10 w-auto shrink-0 object-contain sm:h-12 md:h-14"
          />
          <div class="flex min-w-0 flex-col justify-center">
            <span
              class="truncate font-lora text-sm font-medium text-cfp-olive transition-colors group-hover:text-cfp-olive/80 sm:text-base md:text-xl"
            >
              {{ orgName }}
            </span>
            <div
              class="mt-0.5 flex flex-wrap items-center gap-1 font-poppins text-[10px] text-cfp-olive/80 sm:mt-1 sm:gap-1.5 sm:text-xs md:text-sm"
            >
              <span class="truncate">{{ conferenceDate }}</span>
              <Icon
                name="ph:map-pin-fill"
                class="size-3 shrink-0 sm:size-3.5 md:size-4"
              />
              <span class="truncate">{{ conferenceLocation }}</span>
            </div>
          </div>
        </NuxtLink>

        <div class="hidden items-center gap-6 font-poppins text-sm font-medium text-cfp-olive md:flex">
          <!-- <NuxtLink
            to="#"
            class="transition-colors hover:text-cfp-red"
          >FAQ</NuxtLink>
          <NuxtLink
            to="/pages/contact"
            class="transition-colors hover:text-cfp-red"
          >Contact</NuxtLink> -->
        </div>

        <button
          class="shrink-0 text-cfp-olive md:hidden"
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

    <div class="hidden bg-cfp-yellow md:block">
      <div class="mx-auto flex max-w-7xl items-center justify-between pl-6">
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

        <ClientOnly>
          <div
            v-if="isLoggedIn"
            id="user-dropdown-wrapper"
            class="relative self-stretch"
          >
            <button
              class="inline-flex h-full items-center gap-2.5 self-stretch bg-white px-5 py-4 font-poppins text-sm font-bold text-cfp-olive transition-colors hover:bg-cfp-olive hover:text-white"
              @click.stop="userDropdownOpen = !userDropdownOpen"
            >
              <span
                class="relative inline-flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-cfp-olive/10 ring-1 ring-cfp-olive/20"
              >
                <img
                  v-if="avatarUrl"
                  :src="avatarUrl"
                  :alt="authUser?.name"
                  class="size-full object-cover"
                >
                <span
                  v-else
                  class="text-xs font-bold text-cfp-olive"
                >{{ userInitials }}</span>
              </span>
              <span class="max-w-30 truncate">{{ authUser?.name }}</span>
              <Icon
                name="ph:caret-down-bold"
                class="size-3.5 shrink-0 transition-transform duration-200"
                :class="userDropdownOpen ? 'rotate-180' : ''"
              />
            </button>

            <Transition
              enter-active-class="transition duration-150 ease-out"
              enter-from-class="opacity-0 -translate-y-1"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition duration-100 ease-in"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 -translate-y-1"
            >
              <div
                v-show="userDropdownOpen"
                class="absolute top-full right-0 z-50 min-w-48 overflow-hidden rounded-b-xl bg-white shadow-lg ring-1 ring-black/5"
              >
                <div class="border-b border-gray-100 px-4 py-3">
                  <p class="truncate font-poppins text-xs font-semibold text-cfp-olive">
                    {{ authUser?.name }}
                  </p>
                  <p class="truncate font-poppins text-xs text-gray-400">
                    {{ authUser?.email }}
                  </p>
                </div>
                <nav class="py-1">
                  <NuxtLink
                    v-for="item in USER_MENU_ITEMS"
                    :key="item.href"
                    :to="item.href"
                    class="flex items-center gap-3 px-4 py-2.5 font-poppins text-sm text-gray-700 transition-colors hover:bg-cfp-yellow/20 hover:text-cfp-olive"
                    @click="userDropdownOpen = false"
                  >
                    <Icon
                      :name="item.icon"
                      class="size-4 shrink-0 text-cfp-olive/70"
                    />
                    {{ item.label }}
                  </NuxtLink>
                </nav>
                <div class="border-t border-gray-100 py-1">
                  <button
                    class="flex w-full items-center gap-3 px-4 py-2.5 font-poppins text-sm text-cfp-red transition-colors hover:bg-red-50"
                    @click="handleLogout"
                  >
                    <Icon
                      name="ph:sign-out-bold"
                      class="size-4 shrink-0"
                    />
                    Logout
                  </button>
                </div>
              </div>
            </Transition>
          </div>

          <NuxtLink
            v-else
            to="/login"
            class="inline-flex h-full items-center self-stretch bg-white px-8 py-4 font-poppins text-sm font-bold text-cfp-olive transition-colors hover:bg-cfp-olive hover:text-white"
          >
            Login
          </NuxtLink>

          <template #fallback>
            <div class="inline-flex h-full min-w-24 items-center self-stretch bg-white px-8 py-4" />
          </template>
        </ClientOnly>
      </div>
    </div>

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
      <!-- <div class="my-2 h-px w-full bg-white/30" /> -->
      <!-- <NuxtLink
        to="#"
        class="py-1 font-poppins text-sm text-white hover:text-cfp-olive"
        @click="open = false"
      >FAQ</NuxtLink>
      <NuxtLink
        to="/pages/contact"
        class="py-1 font-poppins text-sm text-white hover:text-cfp-olive"
        @click="open = false"
      >Contact</NuxtLink> -->

      <!-- <div class="my-1 h-px w-full bg-white/30" /> -->

      <ClientOnly>
        <template v-if="isLoggedIn">
          <button
            class="flex w-full items-center justify-between py-2 font-poppins text-sm font-semibold text-white"
            @click="mobileAccountOpen = !mobileAccountOpen"
          >
            <span class="flex items-center gap-2.5">
              <span
                class="inline-flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/20 ring-1 ring-white/30"
              >
                <img
                  v-if="avatarUrl"
                  :src="avatarUrl"
                  :alt="authUser?.name"
                  class="size-full object-cover"
                >
                <span
                  v-else
                  class="text-xs font-bold text-white"
                >{{ userInitials }}</span>
              </span>
              <span class="max-w-40 truncate">{{ authUser?.name }}</span>
            </span>
            <Icon
              name="ph:caret-down-bold"
              class="size-3.5 shrink-0 transition-transform duration-200"
              :class="mobileAccountOpen ? 'rotate-180' : ''"
            />
          </button>

          <Transition
            enter-active-class="transition-all duration-200 ease-out"
            enter-from-class="opacity-0 max-h-0"
            enter-to-class="opacity-100 max-h-60"
            leave-active-class="transition-all duration-150 ease-in"
            leave-from-class="opacity-100 max-h-60"
            leave-to-class="opacity-0 max-h-0"
          >
            <div
              v-show="mobileAccountOpen"
              class="overflow-hidden rounded-xl bg-white/10 backdrop-blur-sm"
            >
              <NuxtLink
                v-for="item in USER_MENU_ITEMS"
                :key="item.href"
                :to="item.href"
                class="flex items-center gap-3 px-4 py-3 font-poppins text-sm text-white transition-colors hover:bg-white/10"
                @click="open = false; mobileAccountOpen = false"
              >
                <Icon
                  :name="item.icon"
                  class="size-4 shrink-0 text-white/70"
                />
                {{ item.label }}
              </NuxtLink>
              <div class="mx-4 h-px bg-white/20" />
              <button
                class="flex w-full items-center gap-3 px-4 py-3 font-poppins text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                @click="handleLogout"
              >
                <Icon
                  name="ph:sign-out-bold"
                  class="size-4 shrink-0"
                />
                Logout
              </button>
            </div>
          </Transition>
        </template>

        <NuxtLink
          v-else
          to="/login"
          class="mt-2 rounded bg-white px-5 py-2 text-center font-poppins text-sm font-bold text-cfp-olive transition-colors hover:bg-cfp-olive hover:text-white"
          @click="open = false"
        >
          Login
        </NuxtLink>
      </ClientOnly>
    </div>
  </header>
</template>
