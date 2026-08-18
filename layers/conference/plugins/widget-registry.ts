import { defineNuxtPlugin } from "#app";
import { defineAsyncComponent } from "vue";
import { useWidgetRegistry } from "../../base/composables/useWidgetRegistry";

export default defineNuxtPlugin(() => {
  const { register } = useWidgetRegistry();
  register({
    "cfp-hero": defineAsyncComponent(() => import("~~/layers/conference/components/home/CfpHero.vue")),
    "tracks": defineAsyncComponent(() => import("~~/layers/conference/components/cfp/callForPapers/Tracks.vue")),
  });
});
