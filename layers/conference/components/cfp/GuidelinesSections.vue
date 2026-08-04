<script setup lang="ts">
const sections = [
  {
    icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>`,
    title: "Format & Length",
    items: [
      { label: "Abstract submissions", detail: "Minimum 300 words; must include research question, methodology, and expected contribution." },
      { label: "Full paper submissions", detail: "Between 5,000–8,000 words (excluding references). Standard academic paper structure: Introduction, Literature Review, Methodology, Results, Discussion, Conclusion." },
      { label: "File format", detail: "Microsoft Word (.docx) or PDF. Times New Roman 12pt, double-spaced, 1-inch margins." },
      { label: "Citation style", detail: "APA 7th edition. All references must be complete and consistent." },
      { label: "Language", detail: "English only. Authors are responsible for ensuring language quality before submission." },
    ],
  },
  {
    icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>`,
    title: "Review Process",
    items: [
      { label: "Double-blind peer review", detail: "All submissions undergo a rigorous double-blind review. Author names and affiliations must be removed from the manuscript." },
      { label: "Abstract review", detail: "Abstracts are reviewed for relevance, clarity, and potential contribution. Accepted abstract authors must submit a full paper before the camera-ready deadline." },
      { label: "Review criteria", detail: "Originality and contribution to the field, theoretical rigour and/or practical relevance, alignment with social business principles, quality of methodology, and clarity of presentation." },
      { label: "Notification", detail: "Authors will be notified of acceptance decisions by 20 September 2026. Review outcomes: accept, minor revision, major revision, or reject." },
    ],
  },
  {
    icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>`,
    title: "Presentation Types",
    items: [
      { label: "In-person presentation (recommended)", detail: "Oral presentation of 15 minutes followed by a 5-minute Q&A. Authors are strongly encouraged to attend in person to maximise networking and scholarly exchange." },
      { label: "Online presentation", detail: "Virtual oral presentation via the conference video platform. Slides must be submitted 48 hours in advance. Connection test required the day before." },
      { label: "Session assignment", detail: "The Scientific Committee assigns accepted papers to specific sessions and tracks. Session details are communicated alongside acceptance notifications." },
    ],
  },
  {
    icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>`,
    title: "Author Requirements",
    items: [
      { label: "Registration requirement", detail: "At least one author per accepted paper must complete conference registration before the camera-ready deadline. Unregistered papers will be withdrawn from the programme." },
      { label: "Presentation requirement", detail: "At least one author must be available to present the paper at the conference (in-person or online). If no author can present, the paper is removed from the presentation list." },
      { label: "Multiple submissions", detail: "Authors may submit more than one paper. Each paper requires a separate submission and undergoes independent review." },
      { label: "Co-author policy", detail: "All co-authors should have made a substantive intellectual contribution to the work. Honorary authorship is not permitted per SBAC's ethical guidelines." },
    ],
  },
];
</script>

<template>
  <div class="mb-20 grid grid-cols-1 gap-8">
    <div
      v-for="sec in sections"
      :key="sec.title"
      class="overflow-hidden rounded-2xl border border-cfp-olive/15 bg-white shadow-lg"
    >
      <!-- Card header row -->
      <div class="flex items-center gap-4 border-b border-cfp-olive/10 bg-cfp-olive-pale px-6 py-5">
        <div
          class="flex size-10 shrink-0 items-center justify-center rounded-full bg-cfp-olive text-white"
          v-html="sec.icon"
        />
        <h2 class="font-lora text-xl font-bold text-cfp-olive">
          {{ sec.title }}
        </h2>
      </div>

      <!-- Items -->
      <div class="divide-y divide-cfp-olive/8">
        <div
          v-for="(item, i) in sec.items"
          :key="i"
          class="flex items-start gap-4 px-6 py-5 transition-colors hover:bg-cfp-cream/50"
        >
          <span class="mt-1 size-2 shrink-0 rounded-full bg-cfp-yellow" />
          <div>
            <span class="font-poppins text-sm font-semibold text-cfp-olive">
              {{ item.label }}
            </span>
            <span class="font-poppins text-sm text-gray-600"> — {{ item.detail }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
