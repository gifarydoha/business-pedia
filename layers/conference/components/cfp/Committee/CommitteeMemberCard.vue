<script setup lang="ts">
import type { CommitteeMember } from "#layers/conference/types/cfp";

defineProps<{
  member: CommitteeMember;
}>();
</script>

<template>
  <div class="rounded-2xl border border-brand-primary/15 bg-white p-5 shadow-sm">
    <div class="mb-1 flex items-start justify-between gap-3">
      <h4 class="font-lora text-base leading-snug font-semibold text-brand-primary">
        {{ member.name }}
      </h4>
      <span
        v-if="member.isTrackChair"
        class="shrink-0 rounded-full bg-brand-secondary/20 px-2 py-0.5 font-poppins text-[10px] font-semibold tracking-wide text-brand-primary uppercase"
      >
        Track Chair
      </span>
    </div>
    <p class="mb-2 font-poppins text-xs leading-relaxed text-gray-600">
      {{ member.title }}
    </p>
    <!-- <a
      v-if="member.email"
      :href="`mailto:${member.email}`"
      class="font-poppins text-xs font-medium text-destructive hover:underline"
    >
      {{ member.email }}
    </a> -->
  </div>
</template>
