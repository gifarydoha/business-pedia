<script setup lang="ts">
const principles = [
  {
    n: 1,
    text: "Business objective will be to overcome poverty, or one or more problems (such as education, health, technology access, and environment) which threaten people and society.",
    short: "Overcome Poverty & Social Problems",
  },
  {
    n: 2,
    text: "Financial and economic sustainability.",
    short: "Financial Sustainability",
  },
  {
    n: 3,
    text: "Investors get back their investment amount only; no dividend is given beyond investment money.",
    short: "No Dividend Beyond Investment",
  },
  {
    n: 4,
    text: "When investment amount is paid back, company profit stays with the company for expansion and improvement.",
    short: "Profit Reinvested for Growth",
  },
  {
    n: 5,
    text: "Gender sensitive and environmentally conscious.",
    short: "Gender & Environmentally Conscious",
  },
  {
    n: 6,
    text: "Workforce gets market wage with better working conditions.",
    short: "Fair Wages & Better Conditions",
  },
  {
    n: 7,
    text: "Do it with joy.",
    short: "Do It With Joy",
  },
];
</script>

<template>
  <section
    id="principles"
    class="bg-cfp-cream py-20 md:py-28"
  >
    <div class="mx-auto max-w-6xl px-6">
      <!-- Heading -->
      <div class="mb-12">
        <span class="font-poppins text-xs font-semibold tracking-widest text-cfp-yellow uppercase">
          Foundation
        </span>
        <h2 class="mt-2 mb-4 font-lora text-3xl font-bold text-cfp-olive md:text-4xl">
          7 Principles of Social Business
        </h2>
        <p class="max-w-2xl font-poppins leading-relaxed text-gray-600">
          Based on Professor Muhammad Yunus' definition: a non-dividend company created to solve
          human problems. Submissions should align with these principles.
        </p>
      </div>

      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="p in principles"
          :key="p.n"
          class="flex gap-4 rounded-2xl border border-cfp-olive/15 bg-white p-6 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
        >
          <div class="shrink-0">
            <div class="flex size-9 items-center justify-center rounded-full bg-cfp-olive font-lora text-sm font-bold text-white">
              {{ p.n }}
            </div>
          </div>
          <div>
            <div class="mb-2 font-lora text-base font-semibold text-cfp-olive">
              {{ p.short }}
            </div>
            <p class="font-poppins text-sm leading-relaxed text-gray-600">
              {{ p.text }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
