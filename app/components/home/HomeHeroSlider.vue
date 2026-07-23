<!-- app/components/home/HomeHeroSlider.vue -->
<script setup lang="ts">
import type { WidgetItem } from "~/types/api";

const props = defineProps<{
  slides: WidgetItem[];
}>();

// const { buildImageUrl } = useImageUrl();

const TRUST_AVATARS = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=40&h=40&fit=crop&auto=format",
];

const fallbackSlides = [
  {
    headline: ["Rewire Your Mindset,", "Unlock Real Results"],
    sub: "Science-backed courses that turn insight into habit — so you grow every single day.",
    cta: "Start Learning Free",
    accent: "#12B793",
    link: "/courses",
  },
  {
    headline: ["Take Action.", "Build Momentum."],
    sub: "Short, focused lessons designed around doing — not just watching. Progress you can feel.",
    cta: "Explore Courses",
    accent: "#F4701B",
    link: "/courses",
  },
  {
    headline: ["Find Your Flow,", "Live with Purpose"],
    sub: "From clarity to confidence — guided learning paths built for real-world transformation.",
    cta: "See Learning Paths",
    accent: "#236D86",
    link: "/courses",
  },
];

const activeSlides = computed(() => {
  if (props.slides && props.slides.length > 0) {
    return props.slides.map((item, i) => {
      const fallback = fallbackSlides[i % 3]!;
      const label = item.label || item.title || fallback.headline.join(" ");
      const words = label.split(" ");
      const mid = Math.ceil(words.length / 2);

      return {
        headline: [words.slice(0, mid).join(" "), words.slice(mid).join(" ")],
        // If there's fulltext, use a plain-text version, otherwise keep structure
        sub: item.fulltext ? item.fulltext.replace(/<[^>]+>/g, "") : fallback.sub,
        cta: "Learn More",
        accent: i % 3 === 0 ? "#12B793" : i % 3 === 1 ? "#F4701B" : "#236D86",
        link: item.url ? `/${item.url}` : item.link ? `/${item.link}` : "/courses",
      };
    });
  }
  return fallbackSlides;
});

const currentSlide = ref(0);
let timer: ReturnType<typeof setInterval> | null = null;

const resetTimer = () => {
  if (timer) clearInterval(timer);
  if (activeSlides.value.length > 1) {
    timer = setInterval(() => {
      currentSlide.value = (currentSlide.value + 1) % activeSlides.value.length;
    }, 5000);
  }
};

onMounted(() => {
  resetTimer();
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

watch(() => activeSlides.value.length, () => {
  resetTimer();
});

const go = (i: number) => {
  currentSlide.value = i;
  resetTimer();
};

const prev = () => go((currentSlide.value - 1 + activeSlides.value.length) % activeSlides.value.length);
const next = () => go((currentSlide.value + 1) % activeSlides.value.length);

const slide = computed(() => activeSlides.value[currentSlide.value] || activeSlides.value[0]!);
</script>

<template>
  <section
    v-if="activeSlides.length"
    class="hero-section overflow-hidden pt-24"
  >
    <div class="mx-auto max-w-7xl px-5 sm:px-8">
      <div class="grid min-h-130 grid-cols-1 items-center gap-10 lg:grid-cols-2">
        <!-- Left: text -->
        <div class="py-10 lg:py-16">
          <div class="mb-6 inline-flex items-center gap-2 rounded-full bg-fy-teal-300/10 px-3 py-1.5 font-lora text-xs font-bold text-fy-teal-300">
            <Icon
              name="lucide:zap"
              size="12"
            />
            Personal Growth Platform
          </div>

          <!-- Headline -->
          <h1
            :key="`headline-${currentSlide}`"
            class="mb-5 font-lora text-[clamp(2rem,4.5vw,3.25rem)] leading-1 font-bold text-fy-sage-900 duration-700  animate-in fade-in"
          >
            {{ slide.headline[0] }}
            <br>
            <span :style="{ color: slide.accent }">{{ slide.headline[1] }}</span>
          </h1>

          <p
            :key="`sub-${currentSlide}`"
            class="mb-8 max-w-110 font-poppins text-base leading-relaxed text-fy-slate-400 delay-100 duration-700 animate-in fade-in"
          >
            {{ slide.sub }}
          </p>

          <!-- CTA row -->
          <div class="mb-10 flex flex-wrap items-center gap-4">
            <NuxtLink
              :to="slide.link"
              class="hero-cta inline-flex items-center justify-center rounded-full px-6 py-3 font-medium text-white transition-all"
              :style="{
                background: slide.accent,
                boxShadow: `0 6px 20px ${slide.accent}55`,
              }"
            >
              {{ slide.cta }}
              <Icon
                name="lucide:arrow-right"
                size="16"
                class="ml-2"
              />
            </NuxtLink>
            <NuxtLink
              to="#"
              class="inline-flex items-center gap-2 font-poppins text-sm font-semibold text-fy-sky-500 transition-opacity hover:opacity-60"
            >
              <Icon
                name="lucide:play"
                size="14"
                class="fill-current"
              />
              Watch intro
            </NuxtLink>
          </div>

          <!-- Dot indicators + nav -->
          <div class="mb-10 flex items-center gap-2.5">
            <button
              v-for="(_, i) in activeSlides"
              :key="i"
              class="hero-dot h-2 cursor-pointer rounded-full transition-all duration-300"
              :style="{
                width: i === currentSlide ? '28px' : '8px',
                background: i === currentSlide ? slide.accent : 'rgba(0,0,0,0.15)',
              }"
              :aria-label="`Go to slide ${i + 1}`"
              @click="go(i)"
            />
            <div class="ml-2 flex gap-1">
              <button
                class="flex size-8 cursor-pointer items-center justify-center rounded-full border border-black/10 transition-colors hover:bg-gray-50"
                aria-label="Previous slide"
                @click="prev"
              >
                <Icon
                  name="lucide:chevron-left"
                  size="14"
                />
              </button>
              <button
                class="flex size-8 cursor-pointer items-center justify-center rounded-full border border-black/10 transition-colors hover:bg-gray-50"
                aria-label="Next slide"
                @click="next"
              >
                <Icon
                  name="lucide:chevron-right"
                  size="14"
                />
              </button>
            </div>
          </div>

          <!-- Trust row -->
          <div class="hero-trust-row border-t border-black/5 pt-6">
            <div class="flex flex-wrap items-center gap-4 lg:gap-6">
              <div class="flex items-center gap-2">
                <div class="flex -space-x-2">
                  <div
                    v-for="(src, i) in TRUST_AVATARS"
                    :key="i"
                    class="relative size-8 overflow-hidden rounded-full border-2 border-white"
                  >
                    <NuxtImg
                      :src="src"
                      alt="learner"
                      class="size-full object-cover"
                      sizes="32px"
                    />
                  </div>
                </div>
                <span class="font-poppins text-xs text-fy-slate-400">
                  <span class="font-bold text-fy-sage-900">42,000+</span> learners
                </span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="flex items-center gap-0.5">
                  <Icon
                    v-for="i in 5"
                    :key="i"
                    name="lucide:star"
                    size="13"
                    :class="i <= 5 ? 'text-fy-orange-300 fill-fy-orange-300' : 'text-gray-300 fill-transparent'"
                  />
                </span>
                <span class="font-poppins text-xs text-fy-slate-400">
                  <span class="font-bold text-fy-sage-900">4.9</span> avg rating
                </span>
              </div>
              <div class="flex items-center gap-1.5">
                <Icon
                  name="lucide:award"
                  size="14"
                  class="text-fy-orange-300"
                />
                <span class="font-poppins text-xs text-fy-slate-400">
                  <span class="font-bold text-fy-sage-900">120+</span> courses
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: illustration -->
        <div class="relative hidden h-full min-h-100 items-end justify-center pb-0 lg:flex">
          <!-- Background glow -->
          <div
            class="pointer-events-none absolute inset-0 rounded-3xl"
            style="background: radial-gradient(ellipse at 60% 40%, rgba(18,183,147,0.10) 0%, rgba(35,109,134,0.06) 60%, transparent 100%)"
          />

          <!-- Floating card — lesson complete -->
          <div class="hero-floating-card absolute top-16 left-0 flex items-center gap-3 rounded-xl bg-white p-3 shadow-lg">
            <div class="flex size-9 items-center justify-center rounded-xl bg-fy-teal-300/15">
              <Icon
                name="lucide:check-circle-2"
                size="18"
                class="text-fy-teal-300"
              />
            </div>
            <div>
              <p class="font-lora text-xs font-bold text-fy-sage-900">
                Lesson Complete!
              </p>
              <p class="font-poppins text-xs text-fy-slate-400">
                +50 XP earned
              </p>
            </div>
          </div>

          <!-- Main graphic -->
          <div class="relative z-10 mx-auto mt-12 w-full max-w-85">
            <div
              class="overflow-hidden rounded-3xl"
              style="background: linear-gradient(135deg, rgba(18,183,147,0.08) 0%, rgba(35,109,134,0.12) 100%)"
            >
              <svg
                viewBox="0 0 320 320"
                width="100%"
                height="320"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="160"
                  cy="155"
                  r="108"
                  fill="#12B793"
                  fill-opacity="0.07"
                />
                <circle
                  cx="160"
                  cy="155"
                  r="75"
                  fill="#12B793"
                  fill-opacity="0.07"
                />
                <!-- Brain body -->
                <path
                  d="M160 88 C128 88 106 104 104 126 C97 129 90 138 92 149 C85 156 83 169 92 178 C94 193 107 204 122 202 C129 211 144 218 160 218 C176 218 191 211 198 202 C213 204 226 193 228 178 C237 169 235 156 228 149 C230 138 223 129 216 126 C214 104 192 88 160 88Z"
                  fill="#12B793"
                  fill-opacity="0.18"
                  stroke="#12B793"
                  stroke-width="1.5"
                />
                <!-- Wrinkles -->
                <path
                  d="M138 115 C143 108 152 106 158 110"
                  stroke="#12B793"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
                <path
                  d="M176 112 C182 108 190 110 193 117"
                  stroke="#12B793"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
                <path
                  d="M125 148 C130 140 140 138 146 143"
                  stroke="#12B793"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
                <path
                  d="M180 143 C185 136 194 134 198 141"
                  stroke="#12B793"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
                <path
                  d="M132 172 C136 165 145 163 149 168"
                  stroke="#12B793"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
                <path
                  d="M170 168 C175 161 184 160 187 167"
                  stroke="#12B793"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
                <!-- Centre split -->
                <line
                  x1="160"
                  y1="88"
                  x2="160"
                  y2="218"
                  stroke="#12B793"
                  stroke-width="1"
                  stroke-dasharray="3 4"
                  stroke-opacity="0.35"
                />
                <!-- Growth arrow -->
                <path
                  d="M160 228 L160 260 M149 240 L160 228 L171 240"
                  stroke="#F4701B"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <!-- Orbiting dots -->
                <circle
                  cx="94"
                  cy="108"
                  r="4.5"
                  fill="#F4701B"
                  fill-opacity="0.6"
                />
                <circle
                  cx="228"
                  cy="98"
                  r="3.5"
                  fill="#236D86"
                  fill-opacity="0.7"
                />
                <circle
                  cx="82"
                  cy="192"
                  r="5.5"
                  fill="#12B793"
                  fill-opacity="0.4"
                />
                <circle
                  cx="240"
                  cy="188"
                  r="4"
                  fill="#F4701B"
                  fill-opacity="0.5"
                />
                <circle
                  cx="105"
                  cy="56"
                  r="3"
                  fill="#12B793"
                  fill-opacity="0.5"
                />
                <circle
                  cx="222"
                  cy="62"
                  r="2.5"
                  fill="#F4701B"
                  fill-opacity="0.4"
                />
                <!-- Sparkle lines -->
                <line
                  x1="66"
                  y1="145"
                  x2="76"
                  y2="145"
                  stroke="#12B793"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-opacity="0.5"
                />
                <line
                  x1="71"
                  y1="140"
                  x2="71"
                  y2="150"
                  stroke="#12B793"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-opacity="0.5"
                />
                <line
                  x1="254"
                  y1="145"
                  x2="244"
                  y2="145"
                  stroke="#F4701B"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-opacity="0.5"
                />
                <line
                  x1="249"
                  y1="140"
                  x2="249"
                  y2="150"
                  stroke="#F4701B"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-opacity="0.5"
                />
              </svg>
            </div>

            <!-- Floating card — streak -->
            <div
              class="hero-floating-card absolute -right-6 bottom-10 rounded-xl bg-white p-3 shadow-xl shadow-fy-orange-300/20"
              style="animation-delay: 200ms;"
            >
              <div>
                <p class="mb-2 font-lora text-xs font-bold text-fy-sage-900">
                  Weekly Streak 🔥
                </p>
                <div class="flex gap-1">
                  <div
                    v-for="(d, i) in ['M', 'T', 'W', 'T', 'F', 'S', 'S']"
                    :key="d + i"
                    class="flex flex-col items-center gap-1"
                  >
                    <div
                      class="size-5 rounded-md"
                      :style="{ background: i < 5 ? '#F4701B' : 'rgba(0,0,0,0.08)' }"
                    />
                    <span class="text-[9px] text-fy-slate-400">{{ d }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Wave divider -->
    <svg
      viewBox="0 0 1440 60"
      preserveAspectRatio="none"
      class="-mt-px block h-15 w-full"
    >
      <path
        d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z"
        fill="#f0f7f5"
      />
    </svg>
  </section>
</template>
