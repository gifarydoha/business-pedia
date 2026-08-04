<!-- app/components/layout/TheFooter.vue -->
<script setup lang="ts">
const settingsStore = useSettingsStore();
const { buildImageUrl } = useImageUrl();

const org = computed(() => settingsStore.org);
const menuItems = computed(() => settingsStore.mainMenu || []);
const logoUrl = computed(() =>
  buildImageUrl(org.value?.logo) || "/images/autofymind_logo.webp",
);

const COLUMNS = [
  {
    label: "Company",
    links: [
      { name: "About Us", href: "/pages/about" },
      { name: "Careers", href: "#" },
      { name: "Press", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Partnerships", href: "#" },
    ],
  },
  {
    label: "Learn",
    links: [
      { name: "All Courses", href: "#" },
      { name: "Certificates", href: "#" },
      { name: "Free Resources", href: "#" },
      { name: "Community", href: "#" },
    ],
  },
  {
    label: "Support",
    links: [
      { name: "About Us", href: "/pages/about" },
      { name: "Contact Us", href: "/pages/contact" },
      { name: "Student FAQ", href: "#" },
      { name: "Accessibility", href: "#" },
      { name: "Status", href: "#" },
    ],
  },
  {
    label: "Legal",
    links: [
      { name: "Privacy Policy", href: "/pages/privacy" },
      { name: "Terms of Use", href: "/pages/terms" },
      { name: "Cookie Policy", href: "#" },
      { name: "Refund Policy", href: "#" },
    ],
  },
];

const getHref = (item: { url?: string; link?: string }) => {
  const targetUrl = item.url || item.link;
  if (!targetUrl) return null;
  if (["mind", "technology", "business", "happiness"].includes(targetUrl)) {
    return `/${targetUrl}`;
  }
  if (targetUrl.startsWith("kb/")) {
    return `/${targetUrl}`;
  }
  return `/${targetUrl}`;
};

const dynamicColumns = computed(() => {
  const quickLinks = menuItems.value.length > 0
    ? menuItems.value.map((item: { label?: string; url?: string; link?: string }) => ({
        name: item.label || "",
        href: getHref(item),
      })).filter((link: { name: string; href: string | null }) => link.href)
    : COLUMNS[0]?.links || [];

  const linksWithRequired = [
    ...quickLinks,
    { name: "Guidelines", href: "/guidelines" },
    { name: "Call for Paper", href: "/call-for-paper" },
  ];

  return [
    {
      label: "Quick Links",
      links: linksWithRequired,
    },
    ...COLUMNS.slice(1),
  ];
});

const SOCIALS = [
  { label: "Twitter", icon: "i-simple-icons-x" },
  { label: "Instagram", icon: "i-simple-icons-instagram" },
  { label: "LinkedIn", icon: "i-simple-icons-linkedin" },
  { label: "YouTube", icon: "i-simple-icons-youtube" },
];
</script>

<template>
  <footer class="bg-footer-bg text-white">
    <div class="mx-auto max-w-7xl px-5 py-12 sm:px-8">
      <!-- Main grid -->
      <div class="grid grid-cols-1 gap-12 lg:grid-cols-6">
        <!-- Brand column -->
        <div class="lg:col-span-2">
          <NuxtLink
            to="/"
            class="mb-4 flex items-center gap-2.5"
          >
            <NuxtImg
              :src="logoUrl"
              alt="Logo"
              width="172"
              height="40"
              class="size-auto object-contain brightness-0 invert"
              sizes="172px"
            />
          </NuxtLink>

          <p class="mb-6 font-poppins text-xs leading-loose text-white/60">
            AutofyMind হলো একটি অনলাইন লার্নিং প্ল্যাটফর্ম, যা মানসিকতা, স্কিল ও জীবনের সুখ একসাথে
            গড়ে তোলে। এখানে শেখানো হয় স্মার্ট অ্যাকশন নেওয়া, AI ও টেকনোলজি ব্যবহার, ব্যবসা সিস্টেম
            তৈরি এবং কাজ–জীবনের ভারসাম্য ধরে টেকসই সুখ অর্জন।
          </p>

          <!-- Contact Info -->
          <div class="mb-6 flex flex-col gap-3">
            <div class="flex items-start gap-2.5 font-poppins text-xs text-white/50">
              <UIcon
                name="i-heroicons-map-pin"
                class="mt-0.5 size-4 shrink-0 text-white/40"
              />
              <span>
                Mirpur-2, House 1 Block G, Road-2,
                <br>
                Dhaka 1216
              </span>
            </div>
            <div class="flex items-center gap-2.5 font-poppins text-xs text-white/50">
              <UIcon
                name="i-heroicons-phone"
                class="size-4 shrink-0 text-white/40"
              />
              <span>01917474877</span>
            </div>
            <div class="flex items-center gap-2.5 font-poppins text-xs text-white/50">
              <UIcon
                name="i-heroicons-envelope"
                class="size-4 shrink-0 text-white/40"
              />
              <span>autofysaidul@gmail.com</span>
            </div>
          </div>

          <!-- Social icons -->
          <div class="flex gap-2.5">
            <NuxtLink
              v-for="social in SOCIALS"
              :key="social.label"
              to="#"
              :aria-label="social.label"
              class="flex size-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20 hover:text-white"
            >
              <UIcon
                :name="social.icon"
                class="size-3.75"
              />
            </NuxtLink>
          </div>
        </div>

        <!-- Link columns -->
        <div class="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-4">
          <div
            v-for="col in dynamicColumns"
            :key="col.label"
            class="flex flex-col"
          >
            <h4 class="mb-6 font-semibold text-white">
              {{ col.label }}
            </h4>
            <ul class="space-y-2.5 text-sm">
              <li
                v-for="link in col.links"
                :key="link.name"
              >
                <NuxtLink
                  :to="link.href || '#'"
                  :prefetch="false"
                  class="group flex items-center text-white/60 transition-colors hover:text-white"
                >
                  <UIcon
                    name="i-heroicons-chevron-right"
                    class="mr-2 size-3.5 shrink-0 text-white/20 transition-transform group-hover:translate-x-1 group-hover:text-white/60"
                  />
                  {{ link.name }}
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Copyright bar -->
      <div
        class="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/50 sm:flex-row"
      >
        <p>© Autofy Solutions, All Right Reserved. Designed By AutofyBit</p>
        <div class="flex items-center gap-3 sm:gap-6">
          <NuxtLink
            to="/"
            class="transition-colors hover:text-white"
          >
            Home
          </NuxtLink>
          <NuxtLink
            to="#"
            class="transition-colors hover:text-white"
          >
            Cookies
          </NuxtLink>
          <NuxtLink
            to="#"
            class="transition-colors hover:text-white"
          >
            Help
          </NuxtLink>
          <NuxtLink
            to="#"
            class="transition-colors hover:text-white"
          >
            FAQs
          </NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>
