<script setup lang="ts">
import type { CfpMeta } from "../../../types/cfp";

defineProps<{
  meta: CfpMeta;
}>();
</script>

<template>
  <section class="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
    <div>
      <span class="font-poppins text-xs font-semibold tracking-widest text-cfp-olive/60 uppercase">Date</span>
      <p class="font-lora text-base font-semibold text-cfp-olive">
        {{ meta.date }}
      </p>
    </div>
    <div>
      <span class="font-poppins text-xs font-semibold tracking-widest text-cfp-olive/60 uppercase">Venue</span>
      <p class="font-lora text-base font-semibold text-cfp-olive">
        {{ meta.venue }}
      </p>
    </div>
    <div>
      <span class="font-poppins text-xs font-semibold tracking-widest text-cfp-olive/60 uppercase">Co-organized by</span>
      <p class="font-lora text-base font-semibold text-cfp-olive">
        {{ meta.coOrganizedBy }}
      </p>
    </div>
    <div>
      <span class="font-poppins text-xs font-semibold tracking-widest text-cfp-olive/60 uppercase">Theme</span>
      <p class="font-lora text-base font-semibold text-cfp-olive">
        {{ meta.theme }}
      </p>
    </div>
  </section>
</template>
