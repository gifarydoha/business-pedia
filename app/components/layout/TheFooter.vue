<!-- app/components/layout/TheFooter.vue -->
<script setup lang="ts">
const settingsStore = useSettingsStore();
const { buildImageUrl } = useImageUrl();

const org = computed(() => settingsStore.org);
const aboutContent = computed(() => settingsStore.aboutContent);
const socialMedia = computed(() => settingsStore.socialMedia);
const logo = computed(() => buildImageUrl(org.value?.logo));
</script>

<template>
  <footer class="bg-gray-900 py-12 text-gray-300">
    <div class="container mx-auto grid grid-cols-1 gap-8 px-4 md:grid-cols-4">
      <!-- Brand & About -->
      <div class="col-span-1 md:col-span-2">
        <NuxtLink
          to="/"
          class="mb-4 inline-block"
        >
          <NuxtImg
            :src="logo"
            :alt="org?.name"
            class="h-12 w-auto brightness-0 invert"
          />
        </NuxtLink>
        <p
          v-if="org?.['company-brief']"
          class="mb-4 text-gray-400"
        >
          {{ org['company-brief'] }}
        </p>
        <div
          v-if="aboutContent"
          class="prose prose-sm prose-invert"
          v-html="aboutContent"
        />
      </div>

      <!-- Quick Links -->
      <div>
        <h3 class="mb-4 text-sm font-semibold tracking-wider text-white uppercase">
          Quick Links
        </h3>
        <ul class="space-y-2 text-sm">
          <li>
            <NuxtLink
              to="/guidelines"
              class="transition-colors hover:text-white"
            >Guidelines</NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/call-for-paper"
              class="transition-colors hover:text-white"
            >Call for Paper</NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/contact"
              class="transition-colors hover:text-white"
            >Contact Us</NuxtLink>
          </li>
        </ul>
      </div>

      <!-- Contact Info -->
      <div>
        <h3 class="mb-4 text-sm font-semibold tracking-wider text-white uppercase">
          Contact Us
        </h3>
        <ul class="space-y-3 text-sm text-gray-400">
          <li
            v-if="org?.address"
            class="flex items-start gap-2"
          >
            <UIcon
              name="i-heroicons-map-pin"
              class="mt-0.5 size-5 shrink-0"
            />
            <span>{{ org.address }}</span>
          </li>
          <li
            v-if="org?.mobile || org?.['hot-number']"
            class="flex items-center gap-2"
          >
            <UIcon
              name="i-heroicons-phone"
              class="size-5 shrink-0"
            />
            <span>{{ org.mobile || org['hot-number'] }}</span>
          </li>
          <li
            v-if="org?.['contact-email']"
            class="flex items-center gap-2"
          >
            <UIcon
              name="i-heroicons-envelope"
              class="size-5 shrink-0"
            />
            <a
              :href="`mailto:${org['contact-email']}`"
              class="transition-colors hover:text-white"
            >
              {{ org['contact-email'] }}
            </a>
          </li>
        </ul>

        <!-- Socials -->
        <div class="mt-6 flex gap-4">
          <a
            v-if="socialMedia?.whatsapp"
            :href="`https://wa.me/${socialMedia.whatsapp}`"
            target="_blank"
            class="text-gray-400 hover:text-white"
          >
            <UIcon
              name="i-simple-icons-whatsapp"
              class="size-5"
            />
          </a>
          <a
            v-if="socialMedia?.messenger"
            :href="`https://m.me/${socialMedia.messenger}`"
            target="_blank"
            class="text-gray-400 hover:text-white"
          >
            <UIcon
              name="i-simple-icons-messenger"
              class="size-5"
            />
          </a>
        </div>
      </div>
    </div>

    <div class="container mx-auto mt-12 border-t border-gray-800 px-4 pt-8 text-center text-sm text-gray-500">
      &copy; {{ new Date().getFullYear() }} {{ org?.name ?? 'Business-Pedia' }}. All rights reserved.
    </div>
  </footer>
</template>
