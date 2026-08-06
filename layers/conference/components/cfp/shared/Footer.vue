<script setup lang="ts">
const settingsStore = useSettingsStore();
// const { buildImageUrl } = useImageUrl();

// const logo = computed(() => buildImageUrl(settingsStore.org?.logo));
// const orgName = computed(() => settingsStore.org?.name ?? "SBAC 2026");

// const FALLBACK_NAV_LINKS = [
//   { label: "About", href: "/#about" },
//   { label: "Principles", href: "/#principles" },
//   { label: "Tracks", href: "/#tracks" },
//   { label: "Dates", href: "/#dates" },
//   { label: "Guidelines", href: "/guidelines" },
//   { label: "Submit Paper", href: "/submit-paper" },
// ];

// const getHref = (item: { url?: string; link?: string }) => {
//   const target = item.url || item.link;
//   if (!target) return "/";
//   return target.startsWith("/") ? target : `/${target}`;
// };

// const navLinks = computed(() => {
//   if (settingsStore.mainMenu && settingsStore.mainMenu.length > 0) {
//     return settingsStore.mainMenu.map((item) => ({
//       label: item.label,
//       href: getHref(item),
//     }));
//   }
//   return FALLBACK_NAV_LINKS;
// });
</script>

<template>
  <footer class="bg-cfp-olive-dark text-white/75">
    <!-- <div class="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-14 md:grid-cols-3">
      <div>
        <div class="mb-4 flex items-center gap-3">
          <NuxtImg
            v-if="logo"
            :src="logo"
            :alt="orgName"
            class="h-10 w-auto object-contain brightness-200 grayscale"
          />
          <CfpSharedLogo
            v-else
            class="h-10 w-auto brightness-200 grayscale"
          />
          <span class="font-lora text-base font-bold text-white">{{ orgName }}</span>
        </div>
        <p class="font-poppins text-sm leading-relaxed text-white/60">
          13th Social Business Academia Conference. An interdisciplinary platform advancing
          social business research and practice globally.
        </p>
      </div>

      <div>
        <h4 class="mb-4 font-lora text-sm font-semibold tracking-wider text-white uppercase">
          Quick Links
        </h4>
        <ul class="flex flex-col gap-2 font-poppins text-sm">
          <li
            v-for="l in navLinks"
            :key="l.label"
          >
            <NuxtLink
              :to="l.href"
              class="transition-colors hover:text-cfp-yellow"
            >
              {{ l.label }}
            </NuxtLink>
          </li>
        </ul>
      </div>

      <div>
        <h4 class="mb-4 font-lora text-sm font-semibold tracking-wider text-white uppercase">
          Contact
        </h4>
        <p class="mb-2 font-poppins text-sm text-white/60">
          General enquiries:
        </p>
        <a
          :href="'mailto:' + settingsStore.cfpContacts[0]?.email"
          class="font-poppins text-sm text-cfp-yellow hover:underline"
        >
          {{ settingsStore.cfpContacts[0]?.email }}
        </a>
        <p class="mt-4 font-poppins text-sm text-white/60">
          Submission portal:
        </p>
        <a
          :href="settingsStore.cfpHero.portalUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="font-poppins text-sm break-all text-cfp-yellow hover:underline"
        >
          {{ settingsStore.cfpHero.portalUrl.replace(/^https?:\/\//, '') }}
        </a>
      </div>
    </div> -->

    <div class="border-t border-white/10">
      <div class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-5 sm:flex-row">
        <span class="font-poppins text-xs text-white/40">
          {{ settingsStore.cfpHero.footerCopyright }}
        </span>
        <span class="font-poppins text-xs text-white/40">
          {{ settingsStore.cfpHero.footerHostedBy }}
        </span>
      </div>
    </div>
  </footer>
</template>
