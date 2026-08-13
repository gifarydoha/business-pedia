<script setup lang="ts">
const settingsStore = useSettingsStore();
const contacts = computed(() => settingsStore.cfpContacts);
</script>

<template>
  <section id="submit" class="bg-cfp-olive-pale py-20 md:py-28">
    <div class="mx-auto max-w-7xl px-6">
      <div class="mb-12">
        <span class="font-poppins text-xs font-semibold tracking-widest text-cfp-yellow uppercase">
          Contacts
        </span>
        <h2 class="mt-2 mb-6 font-lora text-3xl font-bold text-cfp-olive md:text-4xl">
          Contacts Persons
        </h2>

        <!-- Peer review blurb -->
        <!-- <div class="mb-8 max-w-3xl rounded-2xl border border-cfp-olive/15 bg-white p-8 shadow-lg">
          <h3 class="mb-3 font-lora text-lg font-semibold text-cfp-olive">
            Peer-Review Process
          </h3>
          <p class="mb-4 font-poppins text-sm leading-relaxed whitespace-pre-line text-gray-600">
            {{ settingsStore.cfpHero.peerReviewBlurb }}
          </p>

          <div class="mt-6 flex flex-wrap gap-4">
            <a
              :href="settingsStore.cfpHero.portalUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="rounded-full bg-cfp-red px-7 py-3 font-lora text-sm font-bold text-white transition-opacity hover:opacity-90"
            >
              Submit via SBAC Portal
            </a>
            <a
              :href="settingsStore.cfpHero.portalUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="rounded-full border-2 border-cfp-olive px-7 py-3 font-lora text-sm font-bold text-cfp-olive transition-colors hover:bg-cfp-olive/5"
            >
              Author Instructions
            </a>
          </div>
        </div> -->
      </div>

      <!-- Contacts -->
      <!-- <h3 class="mb-6 font-lora text-xl font-semibold text-cfp-olive">
        Contact Persons
      </h3> -->
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div v-for="c in contacts" :key="c.email"
          class="rounded-2xl border border-cfp-olive/15 bg-white p-6 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl">
          <div class="mb-3 flex items-start gap-3">
            <div class="flex size-10 shrink-0 items-center justify-center rounded-full bg-cfp-olive-pale">
              <span class="font-lora text-sm font-bold text-cfp-olive">
                {{ c.name.split(' ').at(-1)?.[0] }}
              </span>
            </div>
            <div>
              <div class="font-lora text-base font-semibold text-cfp-olive">
                {{ c.name }}
              </div>
              <div class="mt-0.5 font-poppins text-xs text-gray-500">
                {{ c.title }}
              </div>
            </div>
          </div>
          <div class="mb-2 font-poppins text-sm text-gray-500">
            {{ c.affiliation }}
          </div>
          <a :href="'mailto:' + c.email"
            class="font-poppins text-sm text-cfp-olive underline underline-offset-2 transition-colors hover:text-cfp-red">
            {{ c.email }}
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
