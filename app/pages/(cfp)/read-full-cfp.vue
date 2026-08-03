<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

definePageMeta({ layout: "cfp" });

useSeoMeta({
  title: "Call for Papers — SBAC 2026",
});

const activeSection = ref("overview");
const observer = ref<IntersectionObserver | null>(null);

const themes = [
  "The importance of social business in the context of the COVID-19 pandemic",
  "Poverty and wealth concentration",
  "Promoting sustainable development including climate change, health improvement, plastic pollution control, and environmental sustainability",
  "Achieving UN SDGs through the application of the social business methodology",
  "Affordable healthcare for the bottom-most people",
  "Application of technologies in achieving qualitative changes in the lives of the unreachable people",
  "Identifies the differences and similarities among the concepts of social business, social entrepreneurship, social enterprise, social economy, social impact investment, corporate social responsibility, etc.",
  "Issues related to the financing of social businesses including innovative financing techniques (potentials and limitations of various financing options, like bonds, venture capital, crowdfunding, philanthropic capital, etc.)",
  "Various examples of the application of the social business concept",
  "Research and teaching methodologies of social business",
  "Measurement of social impacts of social businesses",
  "Emerging management methodologies for managing social businesses",
  "Social businesses in developed countries",
  "Theoretical basis and practical experiences of establishing and operating social business funds",
  "From unemployment to entrepreneurship through social business funds",
  "Development of an ecosystem for the steady growth of the social business",
  "Social Business, marketing, and social marketing",
  "Social business and strategic alliances",
  "Social business, empathy, and active compassion",
  "Social business and education",
  "Social business and customer service relationship",
  "Application of Artificial intelligence and robotics in social business",
  "Social business and sports",
  "War, Peace and Economics: the Future of Human Being",
];

const principles = [
  "Business objective will be to overcome poverty, or one or more problems (such as education, health, technology access, and environment) which threaten people and society.",
  "Financial and economic sustainability.",
  "Investors get back their investment amount only; no dividend is given beyond investment money.",
  "When investment amount is paid back, company profit stays with the company for expansion and improvement.",
  "Gender sensitive and environmentally conscious.",
  "Workforce gets market wage with better working conditions.",
  "Do it with joy.",
];

const tracks = [
  "Health & Sport",
  "Education",
  "Technology and Artificial Intelligence",
  "Finance and the SDGs",
  "Marketing and Entrepreneurship",
  "Environment, Disaster Management and Pollution Control",
  "Wealth Creation and Other Issues",
];

const tocSections = [
  { id: "overview", label: "Overview" },
  { id: "tracks", label: "Conference Tracks" },
  { id: "principles", label: "7 Principles" },
  { id: "themes", label: "Paper Themes" },
  { id: "submission", label: "Submission" },
];

onMounted(() => {
  observer.value = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeSection.value = entry.target.id;
        }
      });
    },
    { rootMargin: "-20% 0px -70% 0px" },
  );

  document.querySelectorAll("section[id]").forEach((el) => {
    observer.value?.observe(el);
  });
});

onUnmounted(() => {
  observer.value?.disconnect();
});
</script>

<template>
  <div>
    <CfpBreadcrumb :crumbs="[{ label: 'Call for Papers' }]" />

    <!-- Top CTA strip -->
    <div class="bg-cfp-olive">
      <div
        class="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-6 py-4 sm:flex-row sm:items-center">
        <p class="font-poppins text-sm text-white/80">
          Submission deadline: <span class="font-semibold text-cfp-yellow">31 January 2024</span>
        </p>
        <NuxtLink to="/submit-paper"
          class="shrink-0 rounded-full bg-cfp-red px-6 py-2 font-lora text-sm font-bold text-white transition-opacity hover:opacity-90">
          Submit Your Paper
        </NuxtLink>
      </div>
    </div>

    <div class="mx-auto max-w-6xl px-6 py-12 lg:py-16">
      <div class="items-start lg:grid lg:grid-cols-[1fr_260px] lg:gap-14">
        <!-- Main content -->
        <article class="min-w-0">
          <!-- Header -->
          <div class="mb-10">
            <span
              class="mb-4 inline-block rounded-full bg-cfp-yellow/20 px-4 py-1 font-poppins text-xs font-semibold tracking-widest text-cfp-olive uppercase">
              Call for Papers
            </span>
            <h1 class="mb-3 font-lora text-3xl leading-tight font-bold text-cfp-olive md:text-4xl lg:text-5xl">
              13th Social Business Academia Conference 2026
            </h1>
            <p class="font-lora text-lg text-cfp-yellow italic md:text-xl">
              December 2026 · Berlin
            </p>
          </div>

          <!-- Overview -->
          <section id="overview" class="mb-12 scroll-mt-24">
            <h2 class="mb-5 border-b border-cfp-olive/15 pb-2 font-lora text-2xl font-bold text-cfp-olive">
              Overview
            </h2>
            <div class="space-y-4 font-poppins leading-relaxed text-gray-700">
              <p>
                Social business is about re-organising the world not only for a more prosperous
                future but also a more <em>dignified survival</em>. SBAC is about supporting
                these aims through social business research and teaching. The need for such
                alternatives has never been greater.
              </p>
              <p>
                Within this century, the future of humans on this planet looks very dark indeed,
                unless some drastic actions are taken in the immediate years. After a potentially
                short period of time, the planet will enter the "red zone", where the ongoing
                process of worsening will become irreversible. All actions to reverse the process
                will have no impact whatsoever. Within the little time we have, only
                extraordinarily bold and immediate actions can save humans and other life forms
                from disaster. Social Business has a role to play in this.
              </p>
              <p>
                Social Business Academia Conference (SBAC 2026), an interdisciplinary conference,
                is to be held on 13 December 2026 in Berlin. This notice is to help give you time
                to prepare a submission. We invite academic papers, practitioner cases, and
                concept notes on innovative ideas on any issues related to social business.
              </p>
              <p>
                In person and online presentations are allowed. You are highly encouraged to be
                present live to make the best use of the opportunity.
              </p>
            </div>
          </section>

          <!-- Tracks -->
          <section id="tracks" class="mb-12 scroll-mt-24">
            <h2 class="mb-5 border-b border-cfp-olive/15 pb-2 font-lora text-2xl font-bold text-cfp-olive">
              General Subjects for Conference Papers
            </h2>
            <p class="mb-6 font-poppins leading-relaxed text-gray-700">
              Our Scientific Committee organises assessment of abstracts in the following major
              tracks:
            </p>
            <ol class="space-y-3">
              <li v-for="(t, i) in tracks" :key="i" class="flex items-start gap-3">
                <span
                  class="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-cfp-olive font-lora text-xs font-bold text-white">
                  {{ i + 1 }}
                </span>
                <span class="font-poppins leading-relaxed text-gray-700">{{ t }}</span>
              </li>
            </ol>
          </section>

          <!-- Principles -->
          <section id="principles" class="mb-12 scroll-mt-24">
            <h2 class="mb-5 border-b border-cfp-olive/15 pb-2 font-lora text-2xl font-bold text-cfp-olive">
              7 Principles of Social Business
            </h2>
            <div class="mb-6 rounded-2xl border border-cfp-olive/15 bg-cfp-olive-pale p-6 shadow-lg">
              <p class="font-poppins text-sm leading-relaxed text-gray-700 italic">
                Also, when using the term "social business", submissions should focus on
                Professor Muhammad Yunus' definitions of such: a
                <strong class="font-semibold text-cfp-olive not-italic">
                  non-dividend company to solve human problems
                </strong>
                . The seven principles of social business are as follows:
              </p>
            </div>
            <ol class="space-y-4">
              <li v-for="(p, i) in principles" :key="i" class="flex items-start gap-4">
                <span
                  class="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-cfp-olive font-lora text-sm font-bold text-white">
                  {{ i + 1 }}
                </span>
                <span class="font-poppins leading-relaxed text-gray-700">{{ p }}</span>
              </li>
            </ol>
          </section>

          <!-- Themes -->
          <section id="themes" class="mb-12 scroll-mt-24">
            <h2 class="mb-5 border-b border-cfp-olive/15 pb-2 font-lora text-2xl font-bold text-cfp-olive">
              Paper Themes
            </h2>
            <p class="mb-6 font-poppins leading-relaxed text-gray-700">
              This provides wide scope for themes of papers, which, in the past, have covered:
            </p>
            <div class="grid grid-cols-1 gap-x-10 gap-y-3 sm:grid-cols-2">
              <div v-for="(th, i) in themes" :key="i" class="flex items-start gap-2.5">
                <span class="mt-2 size-1.5 shrink-0 rounded-full bg-cfp-yellow" />
                <span class="font-poppins text-sm leading-relaxed text-gray-700">{{ th }}</span>
              </div>
            </div>
            <p class="mt-6 font-poppins text-sm text-cfp-olive/60 italic">
              …and more.
            </p>
          </section>

          <!-- Submission -->
          <section id="submission" class="mb-12 scroll-mt-24">
            <h2 class="mb-5 border-b border-cfp-olive/15 pb-2 font-lora text-2xl font-bold text-cfp-olive">
              Submission Details
            </h2>
            <div class="space-y-4 font-poppins leading-relaxed text-gray-700">
              <p>
                There will be a peer-review process to select submissions for oral presentation
                at the conference. Submissions can be in the form of an abstract or full paper.
                However, even if in the form of an abstract, if accepted, a full written paper is
                expected to be submitted at a later date.
              </p>
              <p>
                Once selected, authors will be notified about the specific sessions in the
                conference in which their paper will be presented. At least one of the authors
                would have to register and be present at the conference for the presentation of
                the paper. If no author is available to present the paper, the paper will be
                withdrawn from the presentation list.
              </p>
              <p>
                Authors are requested to submit through the submission page of the Social
                Business Academia Conference 2026. Authors are also requested to see the
                instructions for authors before submitting.
              </p>
            </div>
            <div class="mt-8 flex flex-wrap gap-4">
              <NuxtLink to="/submit-paper"
                class="rounded-full bg-cfp-red px-8 py-3 font-lora font-bold text-white transition-opacity hover:opacity-90">
                Submit Your Paper
              </NuxtLink>
              <NuxtLink to="/guidelines"
                class="rounded-full border-2 border-cfp-olive px-8 py-3 font-lora font-bold text-cfp-olive transition-colors hover:bg-cfp-olive/5">
                Author Guidelines
              </NuxtLink>
            </div>
          </section>
        </article>

        <!-- Sticky TOC sidebar -->
        <aside class="hidden lg:block">
          <div class="sticky top-24 rounded-2xl border border-cfp-olive/15 bg-white p-6 shadow-lg">
            <h3 class="mb-4 font-lora text-sm font-semibold tracking-wider text-cfp-olive uppercase">
              Contents
            </h3>
            <nav class="flex flex-col gap-1">
              <a v-for="s in tocSections" :key="s.id" :href="`#${s.id}`"
                class="rounded-lg px-3 py-1.5 font-poppins text-sm transition-all" :class="activeSection === s.id
                  ? 'bg-cfp-olive text-white font-medium'
                  : 'text-gray-600 hover:bg-cfp-olive-pale hover:text-cfp-olive'">
                {{ s.label }}
              </a>
            </nav>

            <div class="mt-6 border-t border-cfp-olive/10 pt-5">
              <p class="mb-3 font-poppins text-xs text-gray-500">
                Submission deadline
              </p>
              <p class="font-lora text-base font-bold text-cfp-red">
                31 January 2024
              </p>
              <NuxtLink to="/submit-paper"
                class="mt-4 block rounded-full bg-cfp-red px-5 py-2.5 text-center font-lora text-sm font-bold text-white transition-opacity hover:opacity-90">
                Submit Your Paper
              </NuxtLink>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>
