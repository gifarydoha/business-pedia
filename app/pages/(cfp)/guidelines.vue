<script setup lang="ts">
definePageMeta({ layout: "cfp" });

useSeoMeta({
  title: "Submission Guidelines — SBAC 2026",
});

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
  <div>
    <CfpBreadcrumb :crumbs="[{ label: 'Submission Guidelines' }]" />

    <!-- Page header -->
    <div class="bg-cfp-olive">
      <div class="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <span
          class="mb-5 inline-block rounded-full bg-cfp-yellow/20 px-4 py-1 font-poppins text-xs font-semibold tracking-widest text-cfp-yellow uppercase"
        >
          For Authors
        </span>
        <h1 class="mb-4 max-w-3xl font-lora text-3xl leading-tight font-bold text-white md:text-5xl">
          Submission Guidelines
        </h1>
        <p class="max-w-2xl font-poppins leading-relaxed text-white/80">
          Everything you need to know to prepare and submit your paper for SBAC 2026. Follow
          these guidelines to give your work the best chance of acceptance.
        </p>
      </div>
    </div>

    <div class="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <!-- Section cards -->
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

      <!-- Submission process steps -->
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

      <!-- CTA band -->
      <div
        class="flex flex-col items-start justify-between gap-6 rounded-2xl bg-cfp-olive p-8 shadow-lg md:flex-row md:items-center md:p-10"
      >
        <div>
          <h3 class="mb-2 font-lora text-2xl font-bold text-white">
            Ready to submit your paper?
          </h3>
          <p class="font-poppins text-sm text-white/70">
            Deadline: <span class="font-semibold text-cfp-yellow">31 January 2024</span> · Bangladesh Standard Time
          </p>
        </div>
        <div class="flex shrink-0 flex-wrap gap-4">
          <NuxtLink
            to="/submit-paper"
            class="rounded-full bg-cfp-red px-8 py-3 font-lora font-bold text-white transition-opacity hover:opacity-90"
          >
            Submit Your Paper
          </NuxtLink>
          <NuxtLink
            to="/read-full-cfp"
            class="rounded-full border-2 border-white px-8 py-3 font-lora font-bold text-white transition-colors hover:bg-white/10"
          >
            Read Full CFP
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
