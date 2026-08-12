<script setup lang="ts">
import CommitteeMemberCard from "../../components/cfp/Committee/CommitteeMemberCard.vue";
import { useCfpService } from "../../services/cfp.service";
import { parseCommitteeContent } from "../../utils/cfpParser";

definePageMeta({ layout: "conference" });

const cfpService = useCfpService();
const { data: committeeData, pending: loading, error } = await useAsyncData(
  "committee-content",
  () => cfpService.fetchCommittee().then(parseCommitteeContent),
);

const coChairs = computed(() => committeeData.value?.coChairs ?? []);
const groups = computed(() => committeeData.value?.groups ?? []);
</script>

<template>
  <section class="py-20 md:py-28">
    <div class="mx-auto max-w-6xl px-6">
      <div class="mb-14">
        <span class="font-poppins text-xs font-semibold tracking-widest text-cfp-yellow uppercase">
          SBAC 2026
        </span>
        <h1 class="mt-2 mb-4 font-lora text-3xl font-bold text-cfp-olive md:text-4xl">
          Scientific Committee
        </h1>
      </div>

      <div
        v-if="loading"
        class="py-16 text-center font-poppins text-gray-500"
      >
        Loading committee…
      </div>
      <div
        v-else-if="error || !committeeData"
        class="py-16 text-center font-poppins text-gray-500"
      >
        Unable to load Committee content right now. Please try again shortly.
      </div>

      <template v-else>
        <!-- Co-Chairs -->
        <div class="mb-16">
          <h2 class="mb-6 border-b border-cfp-olive/15 pb-2 font-lora text-2xl font-bold text-cfp-olive">
            Co-Chairs
          </h2>
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
          <h2 class="mb-8 border-b border-cfp-olive/15 pb-2 font-lora text-2xl font-bold text-cfp-olive">
            Members (including Track Chairs)
          </h2>
          <div class="space-y-12">
            <div
              v-for="g in groups"
              :key="g.trackName"
            >
              <h3 class="mb-4 font-lora text-lg font-semibold text-cfp-olive">
                {{ g.trackName }}
              </h3>
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
      </template>
    </div>
  </section>
</template>
