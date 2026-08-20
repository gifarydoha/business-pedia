<script setup lang="ts">
import type { CfpDate } from "../../types/cfp";

defineProps<{
  dates: CfpDate[];
}>();
</script>

<template>
  <section
    id="dates"
    class="bg-section-bg-light py-20 md:py-28"
  >
    <div class="mx-auto max-w-7xl px-6">
      <div class="mb-14">
        <span class="font-poppins text-xs font-semibold tracking-widest text-brand-secondary uppercase">
          Schedule
        </span>
        <h2 class="mt-2 mb-4 font-lora text-3xl font-bold text-brand-primary md:text-4xl">
          Important Dates
        </h2>
        <p class="font-poppins text-sm text-gray-500">
          All times in Bangladesh Standard Time (BST, UTC+6)
        </p>
      </div>

      <!-- Desktop: horizontal -->
      <div class="relative hidden md:block">
        <!-- Connector line -->
        <div class="absolute inset-x-0 top-5 h-0.5 bg-brand-primary/20" />
        <div class="relative grid grid-cols-5 gap-4">
          <div
            v-for="(d, i) in dates"
            :key="i"
            class="flex flex-col items-center text-center"
          >
            <!-- Dot -->
            <div
              :class="[
                'z-10 mb-4 flex size-10 items-center justify-center rounded-full border-2 font-lora text-sm font-bold',
                d.urgent
                  ? 'border-destructive bg-destructive text-white shadow-lg'
                  : 'border-brand-primary bg-white text-brand-primary',
              ]"
            >
              {{ i + 1 }}
            </div>
            <div
              :class="[
                'mb-1 font-lora text-sm font-bold',
                d.urgent ? 'text-destructive' : 'text-brand-primary',
              ]"
            >
              {{ d.date }}
            </div>
            <div class="font-poppins text-xs leading-snug text-gray-500">
              {{ d.label }}
            </div>
            <span
              v-if="d.urgent"
              class="mt-2 rounded-full bg-destructive/10 px-2 py-0.5 font-poppins text-xs font-semibold text-destructive"
            >
              Deadline
            </span>
          </div>
        </div>
      </div>

      <!-- Mobile: vertical -->
      <div class="relative pl-8 md:hidden">
        <div class="absolute inset-y-0 left-3 w-0.5 bg-brand-primary/20" />
        <div class="flex flex-col gap-8">
          <div
            v-for="(d, i) in dates"
            :key="i"
            class="relative flex items-start gap-4"
          >
            <!-- Dot -->
            <div
              :class="[
                'absolute -left-8 flex size-8 items-center justify-center rounded-full border-2 font-lora text-xs font-bold',
                d.urgent
                  ? 'border-destructive bg-destructive text-white'
                  : 'border-brand-primary bg-white text-brand-primary',
              ]"
            >
              {{ i + 1 }}
            </div>
            <div class="ml-3">
              <div
                :class="[
                  'font-lora text-base font-bold',
                  d.urgent ? 'text-destructive' : 'text-brand-primary',
                ]"
              >
                {{ d.date }}
              </div>
              <div class="font-poppins text-sm text-gray-500">
                {{ d.label }}
              </div>
              <span
                v-if="d.urgent"
                class="mt-1 inline-block rounded-full bg-destructive/10 px-2 py-0.5 font-poppins text-xs font-semibold text-destructive"
              >
                Deadline
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
