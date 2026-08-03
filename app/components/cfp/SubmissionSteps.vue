<script setup lang="ts">
const steps = [
  { n: "01", label: "Prepare your manuscript", detail: "Remove author names for blind review. Ensure APA citations and correct format." },
  { n: "02", label: "Submit via the portal", detail: "Use the SBAC 2026 submission portal at socialbusinesspedia.com/sbac/2026." },
  { n: "03", label: "Await peer review", detail: "Our Scientific Committee reviews all submissions. Allow 4–6 weeks for a decision." },
  { n: "04", label: "Receive notification", detail: "Acceptance, revision request, or rejection communicated by 20 September 2026." },
  { n: "05", label: "Submit final paper", detail: "Camera-ready version due 25 September 2026. Register at least one author." },
  { n: "06", label: "Present at SBAC 2026", detail: "Join us in Berlin or online on 1–2 April 2027 to present your work." },
];
</script>

<template>
  <div class="mb-16">
    <span class="font-poppins text-xs font-semibold tracking-widest text-cfp-yellow uppercase">
      Step by step
    </span>
    <h2 class="mt-2 mb-10 font-lora text-3xl font-bold text-cfp-olive">
      The Submission Process
    </h2>
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="s in steps"
        :key="s.n"
        class="rounded-2xl border border-cfp-olive/15 bg-white p-6 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
      >
        <div class="mb-3 font-lora text-3xl font-bold text-cfp-yellow">
          {{ s.n }}
        </div>
        <div class="mb-2 font-lora text-base font-semibold text-cfp-olive">
          {{ s.label }}
        </div>
        <p class="font-poppins text-sm leading-relaxed text-gray-600">
          {{ s.detail }}
        </p>
      </div>
    </div>
  </div>
</template>
