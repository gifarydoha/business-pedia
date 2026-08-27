<script setup lang="ts">
import { computed } from "vue";
import CommitteeMemberCard from "../cfp/Committee/CommitteeMemberCard.vue";
import type { CommitteeContent } from "../../types/cfp";

const props = defineProps<{
  committeeData: CommitteeContent;
}>();

const honoraryChairs = computed(() => props.committeeData?.honoraryChairs ?? []);
const coChairs = computed(() => props.committeeData.coChairs ?? []);
const groups = computed(() => props.committeeData.groups ?? []);
</script>

<template>
  <section class="py-20 md:py-28">
    <div class="mx-auto max-w-7xl px-6">
      <div class="mb-14">
        <span class="font-poppins text-xs font-semibold tracking-widest text-brand-secondary uppercase">
          SBAC 2026
        </span>
        <h2 class="mt-2 mb-4 font-lora text-3xl font-bold text-brand-primary md:text-4xl">
          Scientific Committee
        </h2>
      </div>

      <!-- Honorary Chairs -->
      <div class="mb-16">
        <h2 class="mb-6 border-b border-brand-primary/15 pb-2 font-lora text-2xl font-bold text-brand-primary">
          Honorary Chairs
        </h2>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <CommitteeMemberCard
            v-for="m in honoraryChairs"
            :key="m.name"
            :member="m"
          />
        </div>
      </div>

      <!-- Co-Chairs -->
      <div class="mb-16">
        <h3 class="mb-6 border-b border-brand-primary/15 pb-2 font-lora text-2xl font-bold text-brand-primary">
          Co-Chairs
        </h3>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <CommitteeMemberCard
            v-for="m in coChairs"
            :key="m.name"
            :member="m"
          />
        </div>
      </div>

      <!-- Track Groups -->
      <div>
        <h3 class="mb-8 border-b border-brand-primary/15 pb-2 font-lora text-2xl font-bold text-brand-primary">
          Members (including Track Chairs)
        </h3>
        <div class="space-y-12">
          <div
            v-for="g in groups"
            :key="g.trackName"
          >
            <h4 class="mb-4 font-lora text-lg font-semibold text-brand-primary">
              {{ g.trackName }}
            </h4>
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <CommitteeMemberCard
                v-for="m in g.members"
                :key="m.name"
                :member="m"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
