<script setup lang="ts">
const tracks = [
  { label: "Health & Sport", icon: "🏥", tag: "Track 1" },
  { label: "Education", icon: "🎓", tag: "Track 2" },
  { label: "Technology & Artificial Intelligence", icon: "🤖", tag: "Track 3" },
  { label: "Finance & the SDGs", icon: "💹", tag: "Track 4" },
  { label: "Marketing & Entrepreneurship", icon: "📊", tag: "Track 5" },
  { label: "Environment, Disaster Management & Pollution Control", icon: "🌱", tag: "Track 6" },
];

const themes = [
  "Social business & COVID-19 pandemic",
  "Poverty and wealth concentration",
  "Sustainable development & climate change",
  "Achieving UN SDGs via social business",
  "Affordable healthcare for underserved populations",
  "Technology for unreachable communities",
  "Social business vs. CSR & social enterprise",
  "Innovative financing (bonds, crowdfunding, VC)",
  "Research & teaching methodologies",
  "Measurement of social impact",
  "Emerging management methodologies",
  "Social business and AI & robotics",
];
</script>

<template>
  <section
    id="tracks"
    class="bg-cfp-olive-pale py-20 md:py-28"
  >
    <div class="mx-auto max-w-6xl px-6">
      <div class="mb-12">
        <span class="font-poppins text-xs font-semibold tracking-widest text-cfp-yellow uppercase">
          Scientific Committee
        </span>
        <h2 class="mt-2 mb-4 font-lora text-3xl font-bold text-cfp-olive md:text-4xl">
          Conference Tracks
        </h2>
        <p class="max-w-2xl font-poppins leading-relaxed text-gray-600">
          Our Scientific Committee organises peer assessment of abstracts across six major
          interdisciplinary tracks. In-person and online presentations are both welcome.
        </p>
      </div>

      <div class="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="t in tracks"
          :key="t.label"
          class="rounded-2xl border border-cfp-olive/15 bg-white p-6 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
        >
          <div class="mb-4 flex items-start justify-between">
            <span
              class="text-3xl"
              role="img"
              :aria-label="t.label"
            >
              {{ t.icon }}
            </span>
            <span class="rounded-full bg-cfp-yellow/20 px-3 py-1 font-poppins text-xs font-semibold text-cfp-olive">
              {{ t.tag }}
            </span>
          </div>
          <h3 class="font-lora text-base leading-snug font-semibold text-cfp-olive">
            {{ t.label }}
          </h3>
        </div>
      </div>

      <!-- Themes sub-list -->
      <div class="rounded-2xl border border-cfp-olive/15 bg-white p-8 shadow-lg">
        <h3 class="mb-5 font-lora text-lg font-semibold text-cfp-olive">
          Specific Themes Covered
        </h3>
        <ul class="grid grid-cols-1 gap-x-10 gap-y-2 sm:grid-cols-2">
          <li
            v-for="th in themes"
            :key="th"
            class="flex items-start gap-2 font-poppins text-sm text-gray-600"
          >
            <span class="mt-1.5 size-1.5 shrink-0 rounded-full bg-cfp-yellow" />
            {{ th }}
          </li>
        </ul>
        <p class="mt-5 font-poppins text-sm text-cfp-olive/60 italic">
          + more themes across wealth creation, war & peace, and other emerging issues.
        </p>
      </div>
    </div>
  </section>
</template>
