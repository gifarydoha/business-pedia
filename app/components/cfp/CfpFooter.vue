<template>
  <footer class="bg-cfp-olive-dark text-white/75">
    <div class="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-14 md:grid-cols-3">
      <div>
        <div class="mb-4 flex items-center gap-3">
          <CfpLogo class="h-10 w-auto brightness-200 grayscale" />
          <span class="font-lora text-base font-bold text-white">SBAC 2026</span>
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
            v-for="l in [
              { label: 'About', href: '/#about' },
              { label: 'Principles', href: '/#principles' },
              { label: 'Tracks', href: '/#tracks' },
              { label: 'Dates', href: '/#dates' },
              { label: 'Guidelines', href: '/guidelines' },
              { label: 'Submit Paper', href: '/submit-paper' },
            ]"
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
          href="mailto:nazneen@grameen.org"
          class="font-poppins text-sm text-cfp-yellow hover:underline"
        >
          nazneen@grameen.org
        </a>
        <p class="mt-4 font-poppins text-sm text-white/60">
          Submission portal:
        </p>
        <a
          href="http://socialbusinesspedia.com/sbac/2026"
          target="_blank"
          rel="noopener noreferrer"
          class="font-poppins text-sm break-all text-cfp-yellow hover:underline"
        >
          socialbusinesspedia.com/sbac/2026
        </a>
      </div>
    </div>

    <div class="border-t border-white/10">
      <div class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-5 sm:flex-row">
        <span class="font-poppins text-xs text-white/40">
          © 2026 Social Business Academia Conference. All rights reserved.
        </span>
        <span class="font-poppins text-xs text-white/40">
          Hosted by Grameen Communications & Yunus Centre
        </span>
      </div>
    </div>
  </footer>
</template>
