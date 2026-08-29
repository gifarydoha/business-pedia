<script setup lang="ts">
import type { CfpMeta } from "../../../types/cfp";

defineProps<{
  meta: CfpMeta;
}>();
</script>

<template>
  <section class="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
    <div>
      <span class="font-poppins text-xs font-semibold tracking-widest text-brand-primary/60 uppercase">Date</span>
      <p class="font-lora text-base font-semibold text-brand-primary">
        {{ meta.date }}
      </p>
    </div>
    <div>
      <span class="font-poppins text-xs font-semibold tracking-widest text-brand-primary/60 uppercase">Venue</span>
      <p class="font-lora text-base font-semibold text-brand-primary">
        {{ meta.venue }}
      </p>
    </div>
    <div>
      <span class="font-poppins text-xs font-semibold tracking-widest text-brand-primary/60 uppercase">Co-organized by</span>
      <p class="font-lora text-base font-semibold text-brand-primary">
        {{ meta.coOrganizedBy }}
      </p>
    </div>
    <div>
      <span class="font-poppins text-xs font-semibold tracking-widest text-brand-primary/60 uppercase">Theme</span>
      <p class="font-lora text-base font-semibold text-brand-primary">
        {{ meta.theme }}
      </p>
    </div>
  </section>
</template>
